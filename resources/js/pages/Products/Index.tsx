import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Images,
    Layers,
    LayoutGrid,
    Package,
    Palette,
    Pencil,
    Plus,
    Sliders,
    Trash2,
} from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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

/* ─── Partial-fill SVG stars (Premium Size) ─── */
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
            <span className="hidden text-[9px] uppercase font-black tracking-tighter text-muted-foreground/50 sm:inline">Rating</span>
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

/* ─── Premium Informative Card ─── */
function ProductCard({ item, onDelete }: { item: Product; onDelete: (id: number) => void }) {
    const thumbnailSrc = item.thumbnail
        ? item.thumbnail.startsWith('http')
            ? item.thumbnail
            : `/storage/${item.thumbnail}`
        : null;

    const imageCount   = Array.isArray(item.images)  ? item.images.length  : 0;
    const features     = Array.isArray(item.features) ? item.features       : [];
    const colors       = Array.isArray(item.colors)   ? item.colors         : [];
    const overview     = Array.isArray(item.overview) ? item.overview       : [];
    const specEntries  = item.specs ? Object.entries(item.specs).filter(([_, v]) => v && v.trim() !== '') : [];
    const options      = item.options ? Object.entries(item.options) : [];

    return (
        <div className="group relative w-full overflow-hidden rounded-[2rem] border border-zinc-200/60 bg-white shadow-xl shadow-zinc-200/40 transition-all duration-500 hover:shadow-primary/10 hover:ring-1 hover:ring-primary/20 dark:border-zinc-800/60 dark:bg-zinc-900 dark:shadow-none">
            
            {/* ══ TOP HERO SECTION ══ */}
            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start lg:p-8">
                
                {/* Visual Side */}
                <div className="relative shrink-0">
                    <div className="aspect-square size-32 overflow-hidden rounded-2xl border-2 border-zinc-100 bg-zinc-50 shadow-inner group-hover:scale-[1.02] transition-transform duration-500 dark:border-zinc-800 dark:bg-zinc-800/50 md:size-44 lg:size-48">
                        {thumbnailSrc ? (
                            <img
                                src={thumbnailSrc}
                                alt={item.name}
                                className="h-full w-full object-cover transition duration-700 hover:scale-110"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <Package className="size-12 text-zinc-300 dark:text-zinc-700" />
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

                {/* Info Side */}
                <div className="flex flex-1 flex-col justify-between">
                    <div>
                        {/* Title & Badges */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-1.5">
                                    {item.isFeatured && (
                                        <Badge className="h-5 bg-amber-100 px-2 text-[9px] font-black uppercase text-amber-700 ring-1 ring-amber-400/20 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400 dark:ring-amber-500/30">
                                            Featured
                                        </Badge>
                                    )}
                                    {item.isBestseller && (
                                        <Badge className="h-5 bg-blue-100 px-2 text-[9px] font-black uppercase text-blue-700 ring-1 ring-blue-400/20 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400 dark:ring-blue-500/30">
                                            Bestseller
                                        </Badge>
                                    )}
                                </div>
                                <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 lg:text-2xl">
                                    {item.name}
                                </h2>
                                <div className="flex items-center gap-2">
                                    {item.category && (
                                        <span className="font-bold text-primary text-[10px] tracking-wide uppercase">
                                            {item.category.name}
                                        </span>
                                    )}
                                    <span className="text-zinc-300 dark:text-zinc-700 text-[10px]">/</span>
                                    {item.brand && (
                                        <span className="font-medium text-zinc-500 text-[10px] tracking-wide uppercase">
                                            {item.brand.name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions Component (Floating style) */}
                            <div className="flex shrink-0 items-center gap-2">
                                <Button variant="secondary" size="icon" asChild className="size-8 rounded-xl shadow-sm transition-all hover:scale-110 hover:bg-primary/10 hover:text-primary">
                                    <Link href={products.edit(item.id).url}>
                                        <Pencil className="size-3.5" />
                                    </Link>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-3xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-xl font-bold">Delete Product?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-sm">
                                                Are you sure you want to permanently delete <span className="font-bold text-foreground">"{item.name}"</span>?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="rounded-xl h-9 text-xs">Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="rounded-xl bg-destructive hover:bg-destructive/90 h-9 text-xs"
                                                onClick={() => onDelete(item.id)}
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>

                        {/* Mid Row: Price & Rating */}
                        <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4">
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Price</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">
                                        Rp {Number(item.price).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Inventory</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold tracking-tight">{item.stock} Units</span>
                                    <Badge 
                                        variant={Number(item.stock) > 0 ? 'outline' : 'destructive'} 
                                        className={`h-5 rounded-full px-2 text-[8px] font-black uppercase ring-1 ${
                                            Number(item.stock) > 5 ? 'bg-emerald-50 text-emerald-600 ring-emerald-200' : 
                                            Number(item.stock) > 0 ? 'bg-amber-50 text-amber-600 ring-amber-200' : 'bg-destructive/10 text-destructive ring-destructive/20'
                                        }`}
                                    >
                                        {Number(item.stock) > 0 ? (Number(item.stock) <= 5 ? 'Low' : 'In Stock') : 'Out'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Trust</p>
                                <StarRating rating={item.rating} />
                            </div>
                        </div>

                        {/* Description */}
                        {item.description && (
                            <div className="mt-4 max-w-2xl">
                                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ══ DETAIL SECTION (COMPACT GRID) ══ */}
            <div className="border-t border-zinc-100 bg-zinc-50/50 p-6 dark:border-zinc-800/60 dark:bg-black/20 lg:p-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    
                    {/* Features Column */}
                    {features.length > 0 && (
                        <div>
                            <SectionLabel icon={CheckCircle2} label="Features" color="text-emerald-500" />
                            <ul className="space-y-1.5">
                                {features.slice(0, 5).map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 group/item">
                                        <div className="mt-1 flex size-3 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                            <div className="size-1 rounded-full bg-emerald-600" />
                                        </div>
                                        <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-hover/item:text-primary leading-snug">
                                            {f}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Overview/Metadata Column */}
                    {overview.length > 0 && (
                        <div>
                            <SectionLabel icon={Layers} label="Overview" color="text-sky-500" />
                            <ul className="space-y-1.5">
                                {overview.slice(0, 4).map((o, i) => (
                                    <li key={i} className="flex items-start gap-2 group/item">
                                        <div className="mt-1 flex size-3 shrink-0 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30">
                                            <div className="size-1 rounded-full bg-sky-600" />
                                        </div>
                                        <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-hover/item:text-sky-600 leading-snug">
                                            {o}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Specs & Options column */}
                    {(specEntries.length > 0 || options.length > 0) && (
                        <div className="space-y-8">
                            {/* Specs (Compact inside grid) */}
                            {specEntries.length > 0 && (
                                <div>
                                    <SectionLabel icon={LayoutGrid} label="Specs" color="text-violet-500" />
                                    <div className="grid grid-cols-2 gap-2">
                                        {specEntries.slice(0, 4).map(([k, v], i) => (
                                            <div key={i} className="flex flex-col gap-0.5 rounded-xl border bg-white p-2 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
                                                <span className="text-[8px] font-black uppercase text-muted-foreground/60 truncate">{k}</span>
                                                <span className="text-[11px] font-bold truncate">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Options */}
                            {options.length > 0 && (
                                <div>
                                    <SectionLabel icon={Sliders} label="Custom" color="text-amber-500" />
                                    <div className="space-y-3">
                                        {options.map(([key, values], i) => (
                                            <div key={i} className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">{key}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {values.map((v, valIdx) => (
                                                        <Badge key={valIdx} variant="secondary" className="bg-white/80 h-4 px-1.5 text-[9px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
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
                    )}
                </div>

                {/* Sub-footer for Colors & Final Details */}
                {colors.length > 0 && (
                    <div className="mt-8 rounded-2xl bg-white p-4 dark:bg-zinc-800/40">
                         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600">
                                    <Palette className="size-3.5" />
                                </div>
                                <span className="text-xs font-bold tracking-tight">Available Colors</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {colors.map((c, i) => (
                                    <span
                                        key={i}
                                        className="rounded-full border bg-zinc-50 px-3 py-1 text-[10px] font-black text-zinc-700 shadow-sm transition-all hover:scale-105 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700"
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
    );
}

/* ─── Page ─── */
export default function Index(props: any) {
    const { delete: destroy } = useForm();
    const items: Product[] = props['products']?.data || props['products'] || [];

    const handleDelete = (id: number) => {
        destroy(products.destroy(id).url);
    };

    return (
        <>
            <Head title="Product Inventory" />
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 pb-20 sm:p-6 lg:p-10">
                
                {/* Modern Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-zinc-100 pb-6 dark:border-zinc-800">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-0.5 w-10 bg-primary rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Management</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Inventory View</h1>
                        <p className="max-w-md text-sm text-muted-foreground">
                            Explore your catalog of {items.length} premium product{items.length !== 1 ? 's' : ''}.
                        </p>
                    </div>
                    <Button asChild className="h-11 gap-2 rounded-xl px-6 text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                        <Link href={products.create().url}>
                            <Plus className="size-4" />
                            New Product
                        </Link>
                    </Button>
                </div>

                {/* Elaborate Card List */}
                <div className="space-y-8">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-6 rounded-[3rem] border-2 border-dashed border-zinc-200 py-32 text-center dark:border-zinc-800">
                            <div className="flex size-24 items-center justify-center rounded-[2rem] bg-zinc-100 dark:bg-zinc-800">
                                <AlertCircle className="size-12 text-zinc-300" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">Empty Inventory</p>
                                <p className="text-muted-foreground px-4">
                                    Your product catalog doesn't have any items yet. Start building your store!
                                </p>
                            </div>
                            <Button asChild size="lg" variant="outline" className="rounded-2xl border-2">
                                <Link href={products.create().url}>
                                    Register First Product
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <ProductCard key={item.id} item={item} onDelete={handleDelete} />
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Inventory List', href: products.index().url },
    ],
};