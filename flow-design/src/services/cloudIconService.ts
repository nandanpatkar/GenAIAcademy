/**
 * cloudIconService.ts
 * --------------------
 * Manages custom icons stored in Supabase Storage.
 * Bucket: "custom-icons"
 * Path layout: {provider}/{category}/{name}.{ext}
 *
 * This is the Vercel-compatible replacement for the dev-server file-write API.
 * Icons uploaded here are globally accessible and survive redeployments.
 */

import { supabase, isSupabaseAvailable } from './supabaseClient';

export { isSupabaseAvailable };
export const CUSTOM_ICONS_BUCKET = 'custom-icons';

export interface CloudIcon {
  provider: string;
  category: string;
  name: string;
  filename: string; // e.g. "lambda-at-edge.svg"
  fullPath: string; // e.g. "aws/Compute/lambda-at-edge.svg"
  publicUrl: string;
}

export interface UploadResult {
  ok: boolean;
  icon?: CloudIcon;
  error?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function getExtensionFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/svg+xml': '.svg',
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/webp': '.webp',
  };
  return map[mime] ?? '.svg';
}

function dataUrlToBlob(dataUrl: string): { blob: Blob; mime: string } {
  const [header, base64] = dataUrl.split(',');
  const mimeMatch = header.match(/data:([^;]+)/);
  const mime = mimeMatch?.[1] ?? 'image/svg+xml';
  const byteStr = atob(base64);
  const bytes = new Uint8Array(byteStr.length);
  for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i);
  return { blob: new Blob([bytes], { type: mime }), mime };
}

// ---------------------------------------------------------------------------
// Ensure bucket exists (best-effort, anon key may not have admin rights)
// We rely on the bucket being created in the Supabase dashboard.
// ---------------------------------------------------------------------------

/**
 * Upload an icon file to Supabase Storage.
 * @param provider  e.g. "aws", "azure"
 * @param category  e.g. "Compute"
 * @param name      e.g. "Lambda@Edge" (will be slugified)
 * @param dataUrl   Base64 data URL of the image
 */
export async function uploadCloudIcon(
  provider: string,
  category: string,
  name: string,
  dataUrl: string
): Promise<UploadResult> {
  if (!isSupabaseAvailable || !supabase) {
    return { ok: false, error: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.' };
  }

  const normalizedProvider = slugify(provider);
  const normalizedCategory = category.trim().replace(/[^a-zA-Z0-9 _-]/g, '').trim();
  const normalizedName = slugify(name);

  if (!normalizedProvider || !normalizedCategory || !normalizedName) {
    return { ok: false, error: 'provider, category and name are required.' };
  }

  const { blob, mime } = dataUrlToBlob(dataUrl);
  const ext = getExtensionFromMime(mime);
  const filename = `${normalizedName}${ext}`;
  const fullPath = `${normalizedProvider}/${normalizedCategory}/${filename}`;

  const { error } = await supabase.storage
    .from(CUSTOM_ICONS_BUCKET)
    .upload(fullPath, blob, {
      contentType: mime,
      upsert: true, // overwrite if same name
    });

  if (error) {
    // Provide actionable guidance for the most common error
    if (error.message.includes('Bucket not found') || error.message.includes('not found')) {
      return {
        ok: false,
        error: `Storage bucket "${CUSTOM_ICONS_BUCKET}" not found. Create it in your Supabase dashboard → Storage → New Bucket → name it "custom-icons" and set it to Public.`,
      };
    }
    if (error.message.includes('row-level security') || error.message.includes('policy')) {
      return {
        ok: false,
        error: `Permission denied. In your Supabase dashboard → Storage → custom-icons → Policies, add an INSERT policy that allows anon uploads.`,
      };
    }
    return { ok: false, error: error.message };
  }

  const { data: urlData } = supabase.storage.from(CUSTOM_ICONS_BUCKET).getPublicUrl(fullPath);

  const icon: CloudIcon = {
    provider: normalizedProvider,
    category: normalizedCategory,
    name: normalizedName,
    filename,
    fullPath,
    publicUrl: urlData.publicUrl,
  };

  return { ok: true, icon };
}

/**
 * List all custom icons for a provider from Supabase Storage.
 */
export async function listCloudIcons(provider: string): Promise<CloudIcon[]> {
  if (!isSupabaseAvailable || !supabase) return [];

  const normalizedProvider = slugify(provider);
  if (!normalizedProvider) return [];

  // List all files under {provider}/ prefix
  const { data, error } = await supabase.storage
    .from(CUSTOM_ICONS_BUCKET)
    .list(normalizedProvider, { limit: 500, sortBy: { column: 'name', order: 'asc' } });

  if (error || !data) return [];

  // data is a list of folders (categories) at this level
  const icons: CloudIcon[] = [];

  await Promise.all(
    data.map(async (entry) => {
      if (entry.id === null) {
        // It's a folder — list its contents
        const { data: files } = await supabase!.storage
          .from(CUSTOM_ICONS_BUCKET)
          .list(`${normalizedProvider}/${entry.name}`, { limit: 200 });

        if (files) {
          for (const file of files) {
            if (!file.name || file.id === null) continue;
            const fullPath = `${normalizedProvider}/${entry.name}/${file.name}`;
            const { data: urlData } = supabase!.storage.from(CUSTOM_ICONS_BUCKET).getPublicUrl(fullPath);
            icons.push({
              provider: normalizedProvider,
              category: entry.name,
              name: file.name.replace(/\.[^.]+$/, ''),
              filename: file.name,
              fullPath,
              publicUrl: urlData.publicUrl,
            });
          }
        }
      }
    })
  );

  return icons.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

/**
 * Delete a custom icon from Supabase Storage.
 */
export async function deleteCloudIcon(fullPath: string): Promise<void> {
  if (!isSupabaseAvailable || !supabase) return;
  await supabase.storage.from(CUSTOM_ICONS_BUCKET).remove([fullPath]);
}

/**
 * List all providers that have custom icons in Supabase Storage.
 * Returns array of provider names.
 */
export async function listCloudIconProviders(): Promise<string[]> {
  if (!isSupabaseAvailable || !supabase) return [];
  const { data, error } = await supabase.storage
    .from(CUSTOM_ICONS_BUCKET)
    .list('', { limit: 100 });
  if (error || !data) return [];
  return data.filter((e) => e.id === null).map((e) => e.name);
}
