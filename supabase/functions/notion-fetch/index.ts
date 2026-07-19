import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

class NotionApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'NotionApiError'
    this.status = status
  }
}

async function getNotionError(response: Response) {
  try {
    const body = await response.json()
    return body?.message || body?.code || `Notion API returned HTTP ${response.status}`
  } catch {
    return `Notion API returned HTTP ${response.status}`
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { pageId, blockId } = await req.json()
    const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY')

    if (!pageId && !blockId) {
      throw new NotionApiError('pageId or blockId is required', 400)
    }

    if (!NOTION_API_KEY) {
      throw new NotionApiError('NOTION_API_KEY is not configured on the Edge Function', 500)
    }

    // If only blockId is provided, just return that block's children (used for recursive nesting)
    if (blockId && !pageId) {
      const blocksResponse = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children?page_size=100`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28'
        }
      });
      if (!blocksResponse.ok) {
        throw new NotionApiError(`Failed to fetch Notion blocks: ${await getNotionError(blocksResponse)}`, blocksResponse.status)
      }
      const blocksData = await blocksResponse.json();
      return new Response(
        JSON.stringify({ blocks: blocksData.results }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
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
       const message = await getNotionError(pageResponse)
       console.error(message)
       throw new NotionApiError(`Failed to fetch Notion page: ${message}`, pageResponse.status)
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
       throw new NotionApiError(`Failed to fetch Notion blocks: ${await getNotionError(blocksResponse)}`, blocksResponse.status)
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
    const status = error instanceof NotionApiError ? error.status : 500
    const message = error instanceof Error ? error.message : 'Unexpected Notion fetch error'
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    })
  }
})
