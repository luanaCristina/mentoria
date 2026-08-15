# 🔐 Guia: Protegendo API Keys com Cloudflare Workers

## O Problema

Quando temos um site estático (GitHub Pages) que precisa chamar uma API com chave secreta, **não podemos colocar a chave no JavaScript** porque qualquer pessoa pode abrir o DevTools (F12) e ver.

## A Solução: Proxy com Cloudflare Worker

Criamos um "mini servidor" gratuito no Cloudflare que:
1. Recebe a pergunta do nosso site
2. Adiciona a API Key (que está segura lá)
3. Chama o Gemini
4. Devolve a resposta pro site

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  GitHub Pages   │────▶│  Cloudflare Worker   │────▶│  Google Gemini  │
│  (sem API Key)  │◀────│  (com API Key)       │◀────│  API            │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
     Frontend              Proxy (backend)              Serviço externo
```

---

## Passo a Passo (10 minutos)

### 1️⃣ Criar conta no Cloudflare (gratuita)

1. Acesse: https://workers.cloudflare.com/
2. Clique em **"Sign Up"**
3. Use seu email e crie uma senha
4. Confirme o email

### 2️⃣ Criar o Worker

1. No dashboard, vá em **Workers & Pages** (menu lateral)
2. Clique em **"Create"**
3. Selecione **"Create Worker"**
4. Dê um nome ao Worker, por exemplo: `gemini-proxy-mentoria`
5. Clique em **"Deploy"** (vai criar com um código padrão de "Hello World")
6. Clique em **"Edit Code"** (botão "Quick Edit" no canto superior)

### 3️⃣ Colar o código do Worker

1. Apague todo o código padrão
2. Cole o conteúdo do arquivo `worker.js` deste repositório
3. Clique em **"Save and Deploy"**

### 4️⃣ Configurar a variável de ambiente (API Key)

1. Volte para a página do Worker (clique no nome dele)
2. Vá em **Settings** → **Variables and Secrets**
3. Clique em **"Add"**
4. Preencha:
   - **Variable name:** `GEMINI_API_KEY`
   - **Value:** sua chave do Google AI Studio (pega em https://aistudio.google.com/apikey)
   - Marque como **"Encrypt"** (criptografada)
5. Clique em **"Save and Deploy"**

### 5️⃣ Testar o Worker

Seu Worker terá uma URL tipo:
```
https://gemini-proxy-mentoria.SEU-USUARIO.workers.dev
```

Para testar, use o terminal:
```bash
curl -X POST https://gemini-proxy-mentoria.SEU-USUARIO.workers.dev \
  -H "Content-Type: application/json" \
  -H "Origin: https://luanacristina.github.io" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Olá, me explique o que é QA"}]}]}'
```

Se retornar uma resposta JSON do Gemini, está funcionando!

### 6️⃣ Atualizar o site da Mentoria

No `index.html` do repositório da mentoria, na linha 572-573, substitua:

**Antes:**
```javascript
const apiKey = ""; // INSIRA SUA API KEY AQUI
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
```

**Depois:**
```javascript
const apiUrl = "https://gemini-proxy-mentoria.SEU-USUARIO.workers.dev";
```

Pronto! Agora o site chama o Worker (que tem a chave segura) em vez de chamar o Gemini diretamente.

---

## 🎓 Explicação para os Alunos

### Por que não podemos colocar a API Key no JavaScript?

O JavaScript do frontend roda **no navegador do usuário**. Tudo que está no código JS pode ser visto por qualquer pessoa:
- Abrindo DevTools (F12) → aba Sources/Network
- Acessando o repositório no GitHub

Se alguém pegar sua chave, pode:
- Usar seu crédito/quota da API
- Fazer requests em seu nome
- Gerar custos na sua conta

### O que é CORS?

CORS (Cross-Origin Resource Sharing) é uma proteção do navegador. O Worker só aceita requests vindos de `luanacristina.github.io`. Se alguém tentar usar a URL do Worker de outro site, será bloqueado.

### Analogia simples:

Imagine que a API Key é a **senha do Wi-Fi da sua casa**:
- ❌ Colocar no JS = escrever a senha num cartaz na frente da casa
- ✅ Usar um Worker = ter um porteiro que só deixa entrar quem mora lá

### Plano gratuito do Cloudflare Workers:
- 100.000 requests por dia
- Sem cartão de crédito
- Sem limite de tempo

---

## 📋 Checklist de Segurança

- [ ] API Key está APENAS no Cloudflare (variável de ambiente criptografada)
- [ ] API Key NÃO está no código do GitHub
- [ ] CORS configurado para aceitar apenas seu domínio
- [ ] Worker testado e respondendo
- [ ] Site chamando o Worker em vez da API diretamente

---

## 🔗 Links Úteis

- Cloudflare Workers: https://workers.cloudflare.com/
- Google AI Studio (criar API Key): https://aistudio.google.com/apikey
- Documentação Workers: https://developers.cloudflare.com/workers/
