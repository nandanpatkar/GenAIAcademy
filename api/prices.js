const fs = require('fs');
const path = require('path');
const { SUPPORTED_REGIONS } = require('./regions');

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || '';
const CF_KV_NAMESPACE_ID = process.env.CF_KV_NAMESPACE_ID || '';
const CF_API_TOKEN = process.env.CF_API_TOKEN || '';

function isKVConfigured() {
  return !!(
    CF_ACCOUNT_ID && !CF_ACCOUNT_ID.startsWith('REPLACE_') &&
    CF_KV_NAMESPACE_ID && !CF_KV_NAMESPACE_ID.startsWith('REPLACE_') &&
    CF_API_TOKEN && !CF_API_TOKEN.startsWith('REPLACE_')
  );
}

const CF_KV_BASE = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/values`;

// In-memory cache (cached per lambda instance)
const memCache = new Map();
const MEM_CACHE_TTL_MS = 60 * 60 * 1000;

async function getPricingFromKV(regionCode) {
  const cached = memCache.get(regionCode);
  if (cached && (Date.now() - cached.cachedAt) < MEM_CACHE_TTL_MS) {
    return cached.data;
  }

  if (!isKVConfigured()) {
    return null;
  }

  const kvKey = `pricing:${regionCode}`;
  const url = `${CF_KV_BASE}/${encodeURIComponent(kvKey)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
      },
    });

    if (response.status === 404) return null;
    if (!response.ok) return null;

    const data = await response.json();
    memCache.set(regionCode, { data, cachedAt: Date.now() });
    return data;
  } catch (err) {
    return null;
  }
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const regionCode = (req.query.region || 'us-east-1').trim().toLowerCase();

  if (!SUPPORTED_REGIONS.has(regionCode)) {
    return res.status(404).json({
      unsupportedRegion: true,
      regionCode,
      message: `Region "${regionCode}" is not a recognized AWS region code.`,
    });
  }

  if (regionCode === 'us-east-1') {
    const localFilePath = path.join(process.cwd(), 'api', 'data', 'us-east-1.json');
    if (fs.existsSync(localFilePath)) {
      try {
        const rawData = fs.readFileSync(localFilePath, 'utf8');
        const data = JSON.parse(rawData);
        res.setHeader('X-Cache', 'LOCAL_FILE');
        return res.status(200).json(data);
      } catch (err) {
        console.error('Error reading local us-east-1.json:', err.message);
      }
    }
  }

  const data = await getPricingFromKV(regionCode);

  if (data === null) {
    if (!isKVConfigured()) {
      return res.status(404).json({
        unsupportedRegion: true,
        regionCode,
        message: `Cloudflare KV credentials not configured, and requested region is not us-east-1.`,
      });
    }

    return res.status(404).json({
      unsupportedRegion: true,
      regionCode,
      message: `Pricing for region "${regionCode}" has not been generated yet.`,
    });
  }

  res.setHeader('X-Cache', 'KV');
  res.status(200).json(data);
}
