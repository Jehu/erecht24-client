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
const imprintEn = await client.getImprint({ lang: 'en' });
const privacyEn = await client.getPrivacyPolicy({ lang: 'en' });

// Strip the first <h1> from the response (useful when you provide your own heading)
const impressumNoH1 = await client.getImprint({ stripH1: true });

// Combine options
const privacyEnNoH1 = await client.getPrivacyPolicy({ lang: 'en', stripH1: true });
```

## Astro Example

```astro
---
import { createClient } from '@jehu/erecht24-client';

const client = createClient({ apiKey: import.meta.env.ERECHT24_API_KEY });
const html = await client.getImprint({ stripH1: true });
---

<div set:html={html} />
```

## API

### `createClient(options)`

| Option      | Type     | Required | Description                              |
|-------------|----------|----------|------------------------------------------|
| `apiKey`    | `string` | yes      | eRecht24 project API key                 |
| `pluginKey` | `string` | no       | eRecht24 developer key (default provided)|

Returns a client with:

- `getImprint(opts?)` — Fetch Impressum HTML
- `getPrivacyPolicy(opts?)` — Fetch Datenschutzerklärung HTML
- `getPrivacyPolicySocialMedia(opts?)` — Fetch Social Media Privacy Policy HTML

### Fetch Options

| Option    | Type              | Default | Description                          |
|-----------|-------------------|---------|--------------------------------------|
| `lang`    | `'de'` \| `'en'`  | `'de'`  | Language of the returned HTML        |
| `stripH1` | `boolean`         | `false` | Remove the first `<h1>` from output |

## Requirements

An eRecht24 Premium account with API access. [More info](https://www.e-recht24.de/mitglieder/benutzerkonto/erecht24-api-schnittstelle-optimal-nutzen/)

## License

MIT
