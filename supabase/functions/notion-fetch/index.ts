import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { pageId } = await req.json()
    const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY')

    if (!pageId) {
      throw new Error('pageId is required')
    }

    // 1. Fetch Page Metadata
    const pageResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28'
      }
    });
    
    if (!pageResponse.ok) {
       const err = await pageResponse.json();
       console.error(err);
       throw new Error(`Failed to fetch Notion page: ${err.message}`);
    }

    const pageData = await pageResponse.json();

    // 2. Fetch Page Blocks (Non-recursive for now, can be extended)
    const blocksResponse = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28'
      }
    });

    if (!blocksResponse.ok) {
       const err = await blocksResponse.json();
       throw new Error(`Failed to fetch Notion blocks: ${err.message}`);
    }

    const blocksData = await blocksResponse.json();

    return new Response(
      JSON.stringify({
        page: pageData,
        blocks: blocksData.results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
