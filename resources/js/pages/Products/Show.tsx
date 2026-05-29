import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Images,
    Layers,
    LayoutGrid,
    Package,
    Palette,
    Pencil,
    Sliders,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import products from '@/routes/products';

interface Product {
    id: number;
    name: string;
    description: string | null;
    thumbnail: string | null;
    images: string[] | null;
    rating: string | number | null;
    isFeatured: boolean;
    isBestseller: boolean;
    price: number | string;
    stock: number;
    features: string[] | null;
    overview: string[] | null;
    colors: string[] | null;
    specs: Record<string, string> | null;
    options: Record<string, string[]> | null;
    category?: { name: string };
    brand?: { name: string };
}

/* ─── Partial-fill SVG stars ─── */
function StarRating({ rating }: { rating: string | number | null }) {
    const num = Number(rating);
    if (rating === null || rating === undefined || rating === '' || isNaN(num)) {
        return <span className="text-xs text-muted-foreground italic">No rating available</span>;
    }
    const clamped = Math.min(5, Math.max(0, num));
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => {
                    const fill = Math.min(1, Math.max(0, clamped - i));
                    const pct = Math.round(fill * 100);
                    const gid = `sr-${i}-${pct}`;
                    return (
                        <svg key={i} width="14" height="14" viewBox="0 0 24 24">
                            <defs>
                                <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset={`${pct}%`} stopColor="#f59e0b" />
                                    <stop offset={`${pct}%`} stopColor="#e5e7eb" />
                                </linearGradient>
                            </defs>
                            <polygon
                                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                                fill={`url(#${gid})`}
                                stroke={pct > 0 ? '#b45309' : '#d1d5db'}
                                strokeWidth="0.5"
                            />
                        </svg>
                    );
                })}
            </div>
            <span className="text-xs font-bold tabular-nums text-foreground">{clamped.toFixed(1)}</span>
        </div>
    );
}

/* ─── Modern Label ─── */
function SectionLabel({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
    return (
        <div className="flex items-center gap-2 mb-2">
            <div className={`p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800`}>
                <Icon className={`size-3 ${color}`} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/70">{label}</span>
        </div>
    );
}

export default function Show({ product }: { product: Product }) {
    const thumbnailSrc = product.thumbnail
        ? product.thumbnail.startsWith('http')
            ? product.thumbnail
            : `/storage/${product.thumbnail}`
        : null;

    const imageCount   = Array.isArray(product.images)  ? product.images.length  : 0;
    const features     = Array.isArray(product.features) ? product.features       : [];
    const colors       = Array.isArray(product.colors)   ? product.colors         : [];
    const overview     = Array.isArray(product.overview) ? product.overview       : [];
    const specEntries  = product.specs ? Object.entries(product.specs).filter(([_, v]) => v && v.trim() !== '') : [];
    const options      = product.options ? Object.entries(product.options) : [];

    return (
        <>
            <Head title={`Product Detail: ${product.name}`} />
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 pb-20 sm:p-6 lg:p-10">
                
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild className="gap-2 rounded-xl">
                        <Link href={products.index().url}>
                            <ArrowLeft className="size-4" />
                            Back to Inventory
                        </Link>
                    </Button>
                    <Button asChild className="gap-2 rounded-xl px-6 font-black shadow-lg shadow-primary/20">
                        <Link href={products.edit(product.id).url}>
                            <Pencil className="size-4" />
                            Edit Product
                        </Link>
                    </Button>
                </div>

                <div className="group relative w-full overflow-hidden rounded-[2rem] border border-zinc-200/60 bg-white shadow-xl shadow-zinc-200/40 dark:border-zinc-800/60 dark:bg-zinc-900 dark:shadow-none">
                    <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start lg:p-8">
                        <div className="relative shrink-0">
                            <div className="aspect-square size-44 overflow-hidden rounded-2xl border-2 border-zinc-100 bg-zinc-50 shadow-inner dark:border-zinc-800 dark:bg-zinc-800/50 lg:size-64">
                                {thumbnailSrc ? (
                                    <img
                                        src={thumbnailSrc}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <Package className="size-20 text-zinc-300 dark:text-zinc-700" />
                                    </div>
                                )}
                            </div>
                            {imageCount > 0 && (
                                <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-xl border border-zinc-200 bg-white/90 px-2 py-1 shadow-lg backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-800/90">
                                    <Images className="size-3 text-primary" />
                                    <span className="text-[10px] font-bold text-foreground">{imageCount}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                            <div>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        {product.isFeatured && (
                                            <Badge className="h-5 bg-amber-100 px-2 text-[9px] font-black uppercase text-amber-700 ring-1 ring-amber-400/20 dark:bg-amber-900/40 dark:text-amber-400">
                                                Featured
                                            </Badge>
                                        )}
                                        {product.isBestseller && (
                                            <Badge className="h-5 bg-blue-100 px-2 text-[9px] font-black uppercase text-blue-700 ring-1 ring-blue-400/20 dark:bg-blue-900/40 dark:text-blue-400">
                                                Bestseller
                                            </Badge>
                                        )}
                                    </div>
                                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 lg:text-4xl">
                                        {product.name}
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        {product.category && (
                                            <span className="font-bold text-primary text-xs tracking-wide uppercase">
                                                {product.category.name}
                                            </span>
                                        )}
                                        <span className="text-zinc-300 dark:text-zinc-700 text-xs">/</span>
                                        {product.brand && (
                                            <span className="font-medium text-zinc-500 text-xs tracking-wide uppercase">
                                                {product.brand.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-wrap items-center gap-x-12 gap-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Price</p>
                                        <span className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">
                                            Rp {Number(product.price).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Inventory</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold tracking-tight">{product.stock} Units</span>
                                            <Badge 
                                                variant={Number(product.stock) > 0 ? 'outline' : 'destructive'} 
                                                className={`h-5 rounded-full px-2 text-[8px] font-black uppercase ring-1 ${
                                                    Number(product.stock) > 5 ? 'bg-emerald-50 text-emerald-600 ring-emerald-200' : 
                                                    Number(product.stock) > 0 ? 'bg-amber-50 text-amber-600 ring-amber-200' : 'bg-destructive/10 text-destructive ring-destructive/20'
                                                }`}
                                            >
                                                {Number(product.stock) > 0 ? (Number(product.stock) <= 5 ? 'Low' : 'In Stock') : 'Out'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Rating</p>
                                        <StarRating rating={product.rating} />
                                    </div>
                                </div>

                                {product.description && (
                                    <div className="mt-8">
                                        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                                            {product.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-zinc-100 bg-zinc-50/50 p-6 dark:border-zinc-800/60 dark:bg-black/20 lg:p-8">
                        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                            {features.length > 0 && (
                                <div>
                                    <SectionLabel icon={CheckCircle2} label="Features" color="text-emerald-500" />
                                    <ul className="space-y-2">
                                        {features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                    {f}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {overview.length > 0 && (
                                <div>
                                    <SectionLabel icon={Layers} label="Overview" color="text-sky-500" />
                                    <ul className="space-y-2">
                                        {overview.map((o, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky-500" />
                                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                    {o}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="space-y-10">
                                {specEntries.length > 0 && (
                                    <div>
                                        <SectionLabel icon={LayoutGrid} label="Specifications" color="text-violet-500" />
                                        <div className="grid grid-cols-1 gap-3">
                                            {specEntries.map(([k, v], i) => (
                                                <div key={i} className="flex items-center justify-between rounded-xl border bg-white p-3 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
                                                    <span className="text-[10px] font-black uppercase text-muted-foreground/60">{k}</span>
                                                    <span className="text-xs font-bold">{v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {options.length > 0 && (
                                    <div>
                                        <SectionLabel icon={Sliders} label="Configurable Options" color="text-amber-500" />
                                        <div className="space-y-4">
                                            {options.map(([key, values], i) => (
                                                <div key={i} className="space-y-2">
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{key}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {values.map((v, valIdx) => (
                                                            <Badge key={valIdx} variant="secondary" className="bg-white px-2 py-1 text-[10px] font-bold dark:bg-zinc-800">
                                                                {v}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {colors.length > 0 && (
                            <div className="mt-12 rounded-3xl bg-white p-6 dark:bg-zinc-800/40 shadow-sm border border-zinc-100 dark:border-zinc-800">
                                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600">
                                            <Palette className="size-5" />
                                        </div>
                                        <span className="text-sm font-black uppercase tracking-widest">Available Colors</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((c, i) => (
                                            <span
                                                key={i}
                                                className="rounded-full border border-zinc-200 bg-zinc-50 px-5 py-2 text-xs font-bold text-zinc-700 shadow-sm dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700"
                                            >
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Inventory', href: products.index().url },
        { title: 'Detail', href: '#' },
    ],
};
