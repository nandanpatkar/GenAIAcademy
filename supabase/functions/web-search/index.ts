import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const getCorsHeaders = (req: Request) => ({
  // Reflect the browser origin so this works with credentialed Supabase
  // requests during local development and in production.
  'Access-Control-Allow-Origin': req.headers.get('origin') || '*',
  'Access-Control-Allow-Headers': req.headers.get('access-control-request-headers') || 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin',
})

// Proxies Tavily search so the API key never reaches the client bundle.
// Set the secret once via:
//   supabase secrets set TAVILY_API_KEY=your_key_here
// Then deploy:
//   supabase functions deploy web-search

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    const { query, maxResults = 5 } = await req.json()
    const TAVILY_API_KEY = Deno.env.get('TAVILY_API_KEY')

    if (!query || typeof query !== 'string') {
      throw new Error('query is required')
    }
    if (!TAVILY_API_KEY) {
      throw new Error('TAVILY_API_KEY secret is not set on this Supabase project')
    }

    const tavilyResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query,
        search_depth: 'basic',
        max_results: Math.min(maxResults, 10),
        include_answer: false,
      }),
    })

    if (!tavilyResponse.ok) {
      const err = await tavilyResponse.text()
      throw new Error(`Tavily request failed (${tavilyResponse.status}): ${err}`)
    }

    const data = await tavilyResponse.json()

    // Trim to just what the client needs — title, url, and a short content
    // snippet — rather than passing Tavily's full raw payload through.
    const results = (data.results || []).map((r) => ({
      title: r.title,
      url: r.url,
      content: (r.content || '').slice(0, 600),
    }))

    return new Response(
      JSON.stringify({ results }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('web-search edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
