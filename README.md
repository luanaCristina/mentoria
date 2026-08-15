# Mentoria em Tecnologia para Mulheres

🌐 Site: https://luanacristina.github.io/mentoria/
📊 Apresentação: https://app.presentations.ai/view/b8k2iGIpjs

## API Key do Gemini (Linha 572)

Para o chatbot funcionar, você precisa de uma API Key do Google Gemini.

### Como obter:
1. Acesse https://aistudio.google.com/apikey
2. Crie uma nova chave

### Opções para usar a chave:

#### Opção 1: Direta (simples, menos seguro — ok para uso educacional limitado)
Coloque a chave diretamente na linha 572 do `index.html`:
```js
const apiKey = "SUA_CHAVE_AQUI";
```
⚠️ Qualquer pessoa que inspecione o código poderá ver a chave.
Mitigação: Restrinja a chave no Google Cloud Console (API restrictions + quota limit).

#### Opção 2: Cloudflare Worker Proxy (recomendado — 100% gratuito e seguro)
1. Crie uma conta gratuita em https://workers.cloudflare.com/
2. Crie um novo Worker com o código abaixo:

```js
export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': 'https://luanacristina.github.io',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    const API_KEY = 'SUA_CHAVE_GEMINI_AQUI'; // segura no Worker
    const body = await request.text();
    
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }
    );

    const data = await resp.text();
    return new Response(data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://luanacristina.github.io',
      }
    });
  }
}
```

3. No `index.html` (linha 572-573), substitua:
```js
const apiKey = "";
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
```
Por:
```js
const apiUrl = "https://SEU-WORKER.workers.dev";
```

Assim a chave fica no Cloudflare e nunca aparece no código do GitHub.
