import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const API_BASE = 'https://api.e-recht24.de/v2';

export interface ERecht24Document {
  html_de: string;
  html_en: string;
  created: string;
  modified: string;
  pushed: string;
  warnings: string;
}

export type Lang = 'de' | 'en';

export interface FetchOptions {
  lang?: Lang;
  stripH1?: boolean;
}

function removeFirstH1(html: string): string {
  return html.replace(/<h1[^>]*>.*?<\/h1>\s*/i, '');
}

const DEFAULT_PLUGIN_KEY = '3jh4uhn8u69i97kj9timk466748996ikhkjhlk67plli08lhkijgh8z4363gr53v';

export interface ERecht24Options {
  apiKey: string;
  pluginKey?: string;
  /** Optional cache directory path. When set, successful API responses are
   *  cached to disk. On API failure, cached documents are served as fallback.
   *  If both API and cache are unavailable, the error is rethrown. */
  cacheDir?: string;
}

export function createClient(options: ERecht24Options) {
  const { apiKey, pluginKey = DEFAULT_PLUGIN_KEY, cacheDir } = options;

  function cachePath(endpoint: string): string {
    const name = endpoint.replace(/^\//, '').replace(/\//g, '_');
    return join(cacheDir!, `${name}.json`);
  }

  function readCache(endpoint: string): ERecht24Document | null {
    if (!cacheDir) return null;
    try {
      const raw = readFileSync(cachePath(endpoint), 'utf-8');
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function writeCache(endpoint: string, doc: ERecht24Document): void {
    if (!cacheDir) return;
    try {
      if (!existsSync(cacheDir)) {
        mkdirSync(cacheDir, { recursive: true });
      }
      writeFileSync(cachePath(endpoint), JSON.stringify(doc, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[eRecht24] Cache write failed:', e);
    }
  }

  async function fetchDocumentRaw(endpoint: string): Promise<ERecht24Document> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'eRecht24-api-key': apiKey,
        'eRecht24-plugin-key': pluginKey,
      },
    });

    if (!res.ok) {
      throw new Error(`[eRecht24] ${endpoint} failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  function processDocument(doc: ERecht24Document, lang: Lang, stripH1: boolean): string {
    let html = lang === 'en' ? doc.html_en : doc.html_de;
    if (stripH1) html = removeFirstH1(html);
    return html;
  }

  async function fetchDocument(endpoint: string, lang: Lang = 'de', stripH1: boolean = false): Promise<string> {
    if (!cacheDir) {
      // No caching — plain fetch
      const doc = await fetchDocumentRaw(endpoint);
      return processDocument(doc, lang, stripH1);
    }

    try {
      const doc = await fetchDocumentRaw(endpoint);
      writeCache(endpoint, doc);
      return processDocument(doc, lang, stripH1);
    } catch (err) {
      const cached = readCache(endpoint);
      if (cached) {
        console.warn(`[eRecht24] ${endpoint} failed — using cache`);
        return processDocument(cached, lang, stripH1);
      }
      // No cache available — let the error propagate so builds fail loud
      throw err;
    }
  }

  return {
    getImprint: (opts: FetchOptions = {}) => fetchDocument('/imprint', opts.lang ?? 'de', opts.stripH1 ?? false),
    getPrivacyPolicy: (opts: FetchOptions = {}) => fetchDocument('/privacyPolicy', opts.lang ?? 'de', opts.stripH1 ?? false),
    getPrivacyPolicySocialMedia: (opts: FetchOptions = {}) => fetchDocument('/privacyPolicySocialMedia', opts.lang ?? 'de', opts.stripH1 ?? false),
  };
}
