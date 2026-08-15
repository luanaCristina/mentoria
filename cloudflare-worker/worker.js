/**
 * Cloudflare Worker — Proxy seguro para API Gemini
 * 
 * Este Worker recebe a pergunta do frontend (GitHub Pages),
 * adiciona a API Key (que está segura aqui no Cloudflare),
 * chama o Gemini e devolve a resposta.
 * 
 * A chave NUNCA aparece no código do site.
 * 
 * Variável de ambiente necessária:
 *   GEMINI_API_KEY = sua chave do Google AI Studio
 */

export default {
  async fetch(request, env) {
    // Domínios permitidos (CORS) — só seu site pode usar este Worker
    const ALLOWED_ORIGINS = [
      'https://luanacristina.github.io',
      'http://localhost:5500',  // para testes locais com Live Server
      'http://127.0.0.1:5500'
    ];

    const origin = request.headers.get('Origin') || '';
    const isAllowed = ALLOWED_ORIGINS.includes(origin);

    // Headers CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Preflight (OPTIONS) — navegador pergunta se pode fazer POST
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Só aceita POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Método não permitido. Use POST.' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Pega a API Key da variável de ambiente (configurada no dashboard do Cloudflare)
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key não configurada no Worker.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      // Lê o body que veio do frontend
      const body = await request.text();

      // Faz a chamada ao Gemini
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;

      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
      });

      const data = await geminiResponse.text();

      return new Response(data, {
        status: geminiResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: 'Erro ao chamar a API Gemini: ' + error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
