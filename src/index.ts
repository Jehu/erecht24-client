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
}

export function createClient(options: ERecht24Options) {
  const { apiKey, pluginKey = DEFAULT_PLUGIN_KEY } = options;

  async function fetchDocument(endpoint: string, lang: Lang = 'de', stripH1: boolean = false): Promise<string> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'eRecht24-api-key': apiKey,
        'eRecht24-plugin-key': pluginKey,
      },
    });

    if (!res.ok) {
      throw new Error(`[eRecht24] ${endpoint} failed: ${res.status} ${res.statusText}`);
    }

    const data: ERecht24Document = await res.json();
    let html = lang === 'en' ? data.html_en : data.html_de;
    if (stripH1) html = removeFirstH1(html);
    return html;
  }

  return {
    getImprint: (opts: FetchOptions = {}) => fetchDocument('/imprint', opts.lang ?? 'de', opts.stripH1 ?? false),
    getPrivacyPolicy: (opts: FetchOptions = {}) => fetchDocument('/privacyPolicy', opts.lang ?? 'de', opts.stripH1 ?? false),
    getPrivacyPolicySocialMedia: (opts: FetchOptions = {}) => fetchDocument('/privacyPolicySocialMedia', opts.lang ?? 'de', opts.stripH1 ?? false),
  };
}
