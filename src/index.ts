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

export interface ERecht24Options {
  apiKey: string;
}

export function createClient(options: ERecht24Options) {
  const { apiKey } = options;

  async function fetchDocument(endpoint: string, lang: Lang = 'de'): Promise<string> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'eRecht24-api-key': apiKey,
      },
    });

    if (!res.ok) {
      throw new Error(`[eRecht24] ${endpoint} failed: ${res.status} ${res.statusText}`);
    }

    const data: ERecht24Document = await res.json();
    return lang === 'en' ? data.html_en : data.html_de;
  }

  return {
    getImprint: (lang: Lang = 'de') => fetchDocument('/imprint', lang),
    getPrivacyPolicy: (lang: Lang = 'de') => fetchDocument('/privacyPolicy', lang),
    getPrivacyPolicySocialMedia: (lang: Lang = 'de') => fetchDocument('/privacyPolicySocialMedia', lang),
  };
}
