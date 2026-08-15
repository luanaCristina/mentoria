# 🚀 Mentoria em Tecnologia para Mulheres

🌐 **Site:** https://luanacristina.github.io/mentoria/
📊 **Apresentação:** https://app.presentations.ai/view/b8k2iGIpjs

---

## 🤖 Como usar o Chatbot de IA (Gemini)

O site possui um chatbot que usa a API do Google Gemini para responder dúvidas sobre carreira em tech. Existem **duas formas** de fazer funcionar:

---

### 📋 Passo 1: Gerar sua API Key do Gemini (obrigatório para ambas as opções)

1. Acesse: https://aistudio.google.com/apikey
2. Faça login com sua conta Google
3. Clique em **"Create API Key"**
4. Selecione um projeto (pode usar o padrão "Generative Language Client")
5. Copie a chave gerada (começa com `AIzaSy...`)
6. **Guarde em local seguro** — não compartilhe publicamente!

---

### 🅰️ Opção A: Uso Local com API Key direto no código (mais simples)

**Quando usar:** Para testar localmente no seu computador, estudos ou desenvolvimento.

**Como fazer:**

1. Faça clone ou download deste repositório
2. Abra o arquivo `index.html`
3. Encontre a linha (por volta da linha 585):
   ```javascript
   const apiKey = ""; // OPCAO 2: Cole sua API Key aqui para uso local
   ```
4. Cole sua chave entre as aspas:
   ```javascript
   const apiKey = "AIzaSy_SUA_CHAVE_AQUI";
   ```
5. Abra o `index.html` no navegador (pode usar Live Server no VS Code)
6. Pronto! O chatbot vai funcionar chamando a API diretamente.

⚠️ **Atenção:** Se você publicar o site no GitHub Pages com a chave no código, qualquer pessoa poderá vê-la. Para publicação use a Opção B.

---

### 🅱️ Opção B: Usar Cloudflare Worker como proxy (seguro para publicação)

**Quando usar:** Para publicar o site na internet sem expor sua chave.

**Como funciona:**
```
Navegador → Cloudflare Worker (tem a chave) → Google Gemini API
```

**Passo a passo:**

#### 1. Criar conta no Cloudflare (gratuita)
- Acesse: https://workers.cloudflare.com/
- Crie uma conta com seu email

#### 2. Criar o Worker
- No dashboard, vá em **Workers & Pages**
- Clique **"Create application"** → **"Start with Hello World!"**
- Nomeie: `gemini-proxy` (ou qualquer nome)
- Clique **"Deploy"**

#### 3. Editar o código do Worker
- Clique em **"Edit code"**
- Apague todo o código e cole:

```javascript
export default {
  async fetch(request) {
    const ALLOWED_ORIGINS = [
      'https://SEU-USUARIO.github.io',  // Troque pelo seu domínio
      'http://localhost:5500',
      'http://127.0.0.1:5500'
    ];

    const origin = request.headers.get('Origin') || '';
    const isAllowed = ALLOWED_ORIGINS.includes(origin);

    const corsHeaders = {
      'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Use POST' }), {
        status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Cole sua API Key aqui (segura - só você vê este código no Cloudflare)
    const apiKey = "AIzaSy_SUA_CHAVE_AQUI";

    try {
      const body = await request.text();
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }
      );
      const data = await resp.text();
      return new Response(data, {
        status: resp.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
```

#### 4. Personalizar e fazer deploy
- Troque `'https://SEU-USUARIO.github.io'` pelo domínio do seu site
- Troque `"AIzaSy_SUA_CHAVE_AQUI"` pela sua chave real do Gemini
- Clique **"Save and Deploy"**

#### 5. Configurar o site para usar o Worker
No `index.html`, altere a variável `workerUrl`:
```javascript
const workerUrl = "https://gemini-proxy.SEU-SUBDOMINIO.workers.dev";
```

Deixe `apiKey` vazia — o site vai usar o Worker automaticamente.

---

## ❓ Perguntas Frequentes

**P: Por que não posso colocar a chave direto no código publicado?**
R: Qualquer pessoa pode abrir F12 no navegador e ver o JavaScript. Se a chave estiver lá, podem usá-la e gastar seu crédito.

**P: O Cloudflare Worker é gratuito?**
R: Sim! O plano free permite 100.000 requests por dia, sem cartão de crédito.

**P: Posso usar outro modelo do Gemini?**
R: Sim! Troque `gemini-2.5-flash` por outro modelo disponível (ex: `gemini-2.5-pro`). Consulte: https://ai.google.dev/gemini-api/docs/models

**P: O que é CORS?**
R: É uma proteção do navegador que impede sites desconhecidos de usarem seu Worker. O Worker só responde para os domínios listados em `ALLOWED_ORIGINS`.

---

## 📁 Estrutura do Projeto

```
mentoria/
├── index.html                    # Site principal com chatbot
├── mentoria.md                   # Conteúdo da mentoria (markdown)
├── README.md                     # Este arquivo
├── cloudflare-worker/
│   ├── worker.js                 # Código do Worker (referência)
│   └── GUIA-CONFIGURACAO.md      # Guia detalhado de setup
└── ...
```

---

## 🔗 Links Úteis

- Google AI Studio (gerar API Key): https://aistudio.google.com/apikey
- Cloudflare Workers: https://workers.cloudflare.com/
- Modelos disponíveis: https://ai.google.dev/gemini-api/docs/models
- Repositório: https://github.com/luanaCristina/mentoria
