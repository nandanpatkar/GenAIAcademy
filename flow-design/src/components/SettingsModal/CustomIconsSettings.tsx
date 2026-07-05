import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, Trash2, Check, AlertCircle, RefreshCw, Package, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { isSupabaseAvailable, uploadCloudIcon, listCloudIcons, deleteCloudIcon } from '@/services/cloudIconService';
import type { CloudIcon } from '@/services/cloudIconService';
import { invalidateProviderCatalogCache } from '@/services/shapeLibrary/providerCatalog';

type UploadStatus =
    | { type: 'idle' }
    | { type: 'uploading' }
    | { type: 'success'; message: string }
    | { type: 'error'; message: string };

const BUILTIN_PROVIDERS = [
    { id: 'aws', label: 'AWS', color: '#FF9900' },
    { id: 'azure', label: 'Azure', color: '#0078D4' },
    { id: 'gcp', label: 'Google Cloud', color: '#4285F4' },
    { id: 'cncf', label: 'CNCF', color: '#326CE5' },
    { id: 'developer', label: 'Developer', color: '#6366f1' },
];

function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function slugify(value: string): string {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function ProviderBadge({ provider, selected, onClick }: { provider: { id: string; label: string; color: string }; selected: boolean; onClick: () => void }): React.ReactElement {
    return (
        <button
            type="button"
            onClick={onClick}
            style={selected ? { borderColor: provider.color, backgroundColor: `${provider.color}18` } : {}}
            className={`flex h-[60px] w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-[var(--radius-xl)] border transition-all duration-200 ${selected ? 'ring-2 shadow-md' : 'border-[var(--color-brand-border)] bg-[var(--brand-surface)] hover:border-[var(--brand-secondary)] hover:bg-[var(--brand-background)]'}`}
            aria-label={`Select ${provider.label}`}
        >
            <span className="text-[10px] font-bold leading-tight" style={{ color: selected ? provider.color : 'var(--brand-secondary)' }}>
                {provider.label.toUpperCase().slice(0, 4)}
            </span>
        </button>
    );
}

function DropZone({ onFile, preview }: { onFile: (file: File) => void; preview: string | null }): React.ReactElement {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) onFile(file);
    }, [onFile]);

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-xl)] border-2 border-dashed p-8 transition-all duration-200 ${dragging ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/8 scale-[1.01]' : 'border-[var(--color-brand-border)] bg-[var(--brand-background)] hover:border-[var(--brand-primary)]/60 hover:bg-[var(--brand-surface)]'}`}
        >
            <input ref={inputRef} type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
            {preview ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--color-brand-border)] bg-[var(--brand-surface)] p-2">
                        <img src={preview} alt="Preview" className="h-full w-full object-contain" />
                    </div>
                    <p className="text-[11px] text-[var(--brand-secondary)]">Click or drag to replace</p>
                </div>
            ) : (
                <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-primary)]/10">
                        <Upload className="h-5 w-5 text-[var(--brand-primary)]" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-[var(--brand-text)]">Drop icon here</p>
                        <p className="mt-0.5 text-[11px] text-[var(--brand-secondary)]">SVG recommended · PNG, JPEG, WebP supported</p>
                    </div>
                </>
            )}
        </div>
    );
}

export function CustomIconsSettings(): React.ReactElement {
    const [selectedProvider, setSelectedProvider] = useState<string>('aws');
    const [customProvider, setCustomProvider] = useState('');
    const [useCustomProvider, setUseCustomProvider] = useState(false);
    const [category, setCategory] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [fileData, setFileData] = useState<string | null>(null);
    const [status, setStatus] = useState<UploadStatus>({ type: 'idle' });
    const [existingIcons, setExistingIcons] = useState<CloudIcon[]>([]);
    const [loadingList, setLoadingList] = useState(false);

    const provider = useCustomProvider ? slugify(customProvider) : selectedProvider;
    const providerLabel = BUILTIN_PROVIDERS.find((p) => p.id === provider)?.label ?? (provider ? `"${provider}"` : '…');

    const refreshList = useCallback(() => {
        if (!provider || !isSupabaseAvailable) return;
        setLoadingList(true);
        listCloudIcons(provider).then(setExistingIcons).finally(() => setLoadingList(false));
    }, [provider]);

    useEffect(() => { refreshList(); }, [refreshList]);

    async function handleFile(file: File): Promise<void> {
        const dataUrl = await readFileAsDataUrl(file);
        setFileData(dataUrl);
        setPreview(dataUrl);
        if (!serviceName) {
            const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
            setServiceName(baseName);
        }
    }

    async function handleUpload(): Promise<void> {
        if (!fileData || !category.trim() || !serviceName.trim() || !provider) {
            setStatus({ type: 'error', message: 'Fill in all fields and select a file.' });
            return;
        }
        setStatus({ type: 'uploading' });
        const result = await uploadCloudIcon(provider, category.trim(), serviceName, fileData);
        if (result.ok && result.icon) {
            setStatus({ type: 'success', message: `${result.icon.provider}/${result.icon.category}/${result.icon.filename}` });
            setPreview(null); setFileData(null); setServiceName('');
            // Bust the catalog cache so the icon picker sees the new icon immediately
            invalidateProviderCatalogCache(provider);
            refreshList();
            setTimeout(() => setStatus({ type: 'idle' }), 5000);
        } else {
            setStatus({ type: 'error', message: result.error ?? 'Upload failed' });
        }
    }

    async function handleDelete(icon: CloudIcon): Promise<void> {
        await deleteCloudIcon(icon.fullPath);
        setExistingIcons((prev) => prev.filter((i) => i.fullPath !== icon.fullPath));
        invalidateProviderCatalogCache(icon.provider);
    }

    const canUpload = isSupabaseAvailable && Boolean(fileData && category.trim() && serviceName.trim() && provider);

    if (!isSupabaseAvailable) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border border-amber-500/25 bg-amber-500/10 p-8 text-center">
                <AlertCircle className="h-8 w-8 text-amber-400" />
                <div>
                    <p className="font-semibold text-amber-100">Supabase not configured</p>
                    <p className="mt-1 text-[11px] leading-5 text-amber-100/80">
                        Add <code className="rounded bg-amber-500/20 px-1">VITE_SUPABASE_URL</code> and <code className="rounded bg-amber-500/20 px-1">VITE_SUPABASE_ANON_KEY</code> to your <code className="rounded bg-amber-500/20 px-1">.env</code> file to enable cloud icon storage.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-4 animate-in fade-in duration-200 w-full min-w-0">
            {/* Header */}
            <div className="space-y-1">
                <h3 className="text-base font-semibold text-[var(--brand-text)]">Custom Icon Upload</h3>
                <p className="text-xs text-[var(--brand-secondary)]">
                    Add new service icons to any provider pack. Icons are stored in <strong className="text-[var(--brand-text)]">Supabase Storage</strong> and appear everywhere — including on Vercel.
                </p>
            </div>

            {/* Supabase setup notice */}
            <div className="flex items-start gap-2 rounded-[var(--radius-lg)] border border-[var(--brand-primary)]/25 bg-[var(--brand-primary)]/8 px-3 py-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-[var(--brand-text)] uppercase tracking-wider">Cloud Storage Active</p>
                    <p className="mt-0.5 text-[11px] leading-5 text-[var(--brand-secondary)]">
                        Icons upload to your Supabase Storage bucket <code className="rounded bg-[var(--brand-surface)] px-1">custom-icons</code>. They appear instantly in the icon picker and survive redeployments.
                        {' '}<a href="https://supabase.com/dashboard/project/twcsujjshudwgpihkwyz/storage/buckets" target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-[var(--brand-primary)] hover:underline">Open Storage <ExternalLink className="h-3 w-3" /></a>
                    </p>
                </div>
            </div>

            {/* Provider Selection */}
            <div className="space-y-3">
                <Label>Target Provider Pack</Label>
                <div className="flex items-center gap-2 overflow-x-auto px-1 py-2 custom-scrollbar">
                    {BUILTIN_PROVIDERS.map((p) => (
                        <ProviderBadge key={p.id} provider={p} selected={!useCustomProvider && selectedProvider === p.id} onClick={() => { setUseCustomProvider(false); setSelectedProvider(p.id); }} />
                    ))}
                    <button
                        type="button"
                        onClick={() => setUseCustomProvider(true)}
                        className={`flex h-[60px] w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-[var(--radius-xl)] border transition-all duration-200 ${useCustomProvider ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/8 ring-2 ring-[var(--brand-primary)]/40 shadow-md' : 'border-[var(--color-brand-border)] bg-[var(--brand-surface)] hover:border-[var(--brand-secondary)] hover:bg-[var(--brand-background)]'}`}
                        aria-pressed={useCustomProvider}
                        aria-label="New custom provider"
                    >
                        <Package className={`h-4 w-4 ${useCustomProvider ? 'text-[var(--brand-primary)]' : 'text-[var(--brand-secondary)]'}`} />
                        <span className={`text-[9px] font-medium leading-tight ${useCustomProvider ? 'text-[var(--brand-primary)]' : 'text-[var(--brand-secondary)]'}`}>New</span>
                    </button>
                </div>
                {useCustomProvider && (
                    <Input value={customProvider} onChange={(e) => setCustomProvider(e.target.value)} placeholder="e.g. vercel, cloudflare, oracle" helperText="A new provider group will be created automatically." />
                )}
            </div>

            <div className="h-px bg-[var(--brand-background)]" />

            {/* Upload Form */}
            <div className="space-y-5">
                <Label>Upload New Icon to {providerLabel}</Label>
                <DropZone onFile={handleFile} preview={preview} />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label>Category</Label>
                        <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Compute, Storage, AI" helperText="Groups icons in the picker." />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Service Name</Label>
                        <Input value={serviceName} onChange={(e) => setServiceName(e.target.value)} placeholder="e.g. Lambda@Edge, Bedrock" helperText="Shown as the label in the picker." />
                    </div>
                </div>

                {status.type === 'error' && (
                    <div className="flex items-start gap-2 rounded-[var(--radius-lg)] border border-red-500/30 bg-red-500/10 px-3 py-2.5">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                        <p className="text-[11px] text-red-300 leading-5">{status.message}</p>
                    </div>
                )}
                {status.type === 'success' && (
                    <div className="flex items-center gap-2 rounded-[var(--radius-lg)] border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
                        <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                        <p className="text-[11px] text-emerald-300">Uploaded → <code className="opacity-80">{status.message}</code></p>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => void handleUpload()}
                    disabled={!canUpload || status.type === 'uploading'}
                    className="w-full flex items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-semibold text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {status.type === 'uploading' ? (
                        <><RefreshCw className="h-4 w-4 animate-spin" /> Uploading to Supabase…</>
                    ) : (
                        <><Upload className="h-4 w-4" /> Save Icon to {providerLabel}</>
                    )}
                </button>
            </div>

            <div className="h-px bg-[var(--brand-background)]" />

            {/* Existing Icons */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label>Uploaded icons in <span className="text-[var(--brand-primary)]">{providerLabel}</span></Label>
                    <button type="button" onClick={refreshList} className="flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--color-brand-border)] bg-[var(--brand-surface)] px-2 py-1 text-[10px] font-medium text-[var(--brand-secondary)] transition-colors hover:border-[var(--brand-secondary)]">
                        <RefreshCw className={`h-3 w-3 ${loadingList ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>

                {loadingList ? (
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                        {Array.from({ length: 12 }, (_, i) => <div key={i} className="aspect-square animate-pulse rounded-[var(--radius-md)] bg-[var(--brand-surface)]" />)}
                    </div>
                ) : existingIcons.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-brand-border)] bg-[var(--brand-background)] py-8">
                        <Package className="h-6 w-6 text-[var(--brand-secondary)]" />
                        <p className="text-xs text-[var(--brand-secondary)]">No uploaded icons for {providerLabel} yet</p>
                    </div>
                ) : (
                    <>
                        <p className="text-[11px] text-[var(--brand-secondary)]">{existingIcons.length} icon{existingIcons.length !== 1 ? 's' : ''} — hover to delete</p>
                        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                            {existingIcons.map((icon) => (
                                <div key={icon.fullPath} className="group relative aspect-square">
                                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-[var(--color-brand-border)] bg-[var(--brand-surface)] p-1.5 transition-all group-hover:border-red-500/40 group-hover:bg-red-500/5">
                                        {icon.publicUrl ? (
                                            <img src={icon.publicUrl} alt={icon.name} className="h-8 w-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                                        ) : (
                                            <ImageIcon className="h-6 w-6 text-[var(--brand-secondary)]" />
                                        )}
                                        <span className="w-full truncate text-center text-[8px] text-[var(--brand-secondary)] leading-tight">{icon.name}</span>
                                        <span className="w-full truncate text-center text-[7px] text-[var(--brand-secondary)]/60 leading-tight">{icon.category}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => void handleDelete(icon)}
                                        aria-label={`Delete ${icon.name}`}
                                        className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-md)] bg-red-500/0 opacity-0 transition-all group-hover:bg-red-500/15 group-hover:opacity-100"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-400" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
