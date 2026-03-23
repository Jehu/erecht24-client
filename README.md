# @jehu/erecht24-client

Lightweight eRecht24 API client for fetching Impressum, Datenschutz and Social Media Privacy Policy content.

Zero dependencies, TypeScript, works with any framework (Astro, SvelteKit, Next.js, etc.).

## Installation

```bash
npm install @jehu/erecht24-client --registry=https://npm.pkg.github.com
```

## Usage

```ts
import { createClient } from '@jehu/erecht24-client';

const client = createClient({ apiKey: 'your-erecht24-api-key' });

const impressum = await client.getImprint();           // German HTML
const datenschutz = await client.getPrivacyPolicy();   // German HTML
const socialMedia = await client.getPrivacyPolicySocialMedia();

// English versions
const imprintEn = await client.getImprint('en');
const privacyEn = await client.getPrivacyPolicy('en');
```

## Astro Example

```astro
---
import { createClient } from '@jehu/erecht24-client';

const client = createClient({ apiKey: import.meta.env.ERECHT24_API_KEY });
const html = await client.getImprint();
---

<div set:html={html} />
```

## API

### `createClient(options)`

| Option   | Type     | Description          |
|----------|----------|----------------------|
| `apiKey` | `string` | eRecht24 API key     |

Returns a client with:

- `getImprint(lang?)` — Fetch Impressum HTML
- `getPrivacyPolicy(lang?)` — Fetch Datenschutzerklärung HTML
- `getPrivacyPolicySocialMedia(lang?)` — Fetch Social Media Privacy Policy HTML

`lang` is optional: `'de'` (default) or `'en'`.

## Requirements

An eRecht24 Premium account with API access. [More info](https://www.e-recht24.de/mitglieder/benutzerkonto/erecht24-api-schnittstelle-optimal-nutzen/)

## License

MIT
