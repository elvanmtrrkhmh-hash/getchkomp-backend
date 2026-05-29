import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Eye,
    Package,
    Pencil,
    Plus,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import products from '@/routes/products';

interface Product {
    id: number;
    name: string;
    thumbnail: string | null;
    isFeatured: boolean;
    isBestseller: boolean;
    price: number | string;
    stock: number;
    category?: { name: string };
    brand?: { name: string };
}

export default function Index(props: any) {
    const { delete: destroy } = useForm();
    const items: Product[] = props['products']?.data || props['products'] || [];

    const handleDelete = (id: number) => {
        destroy(products.destroy(id).url);
    };

    return (
        <>
            <Head title="Product Inventory" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 pb-20 sm:p-6 lg:p-10">
                
                {/* Modern Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-zinc-100 pb-6 dark:border-zinc-800">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-0.5 w-10 bg-primary rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Management</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Inventory</h1>
                        <p className="max-w-md text-sm text-muted-foreground">
                            Manage your product catalog and stock levels efficiently.
                        </p>
                    </div>
                    <Button asChild className="h-11 gap-2 rounded-xl px-6 text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                        <Link href={products.create().url}>
                            <Plus className="size-4" />
                            New Product
                        </Link>
                    </Button>
                </div>

                {/* Concise Table View */}
                <div className="rounded-[2rem] border border-zinc-200/60 bg-white shadow-xl shadow-zinc-200/40 overflow-hidden dark:border-zinc-800/60 dark:bg-zinc-900 dark:shadow-none">
                    <Table>
                        <TableHeader className="bg-zinc-50/50 dark:bg-black/20">
                            <TableRow className="hover:bg-transparent border-zinc-100 dark:border-zinc-800">
                                <TableHead className="w-[80px] h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground/70 pl-8">Image</TableHead>
                                <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground/70">Product Name</TableHead>
                                <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground/70">Category/Brand</TableHead>
                                <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground/70">Price</TableHead>
                                <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground/70">Stock</TableHead>
                                <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground/70">Status</TableHead>
                                <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground/70 text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Package className="size-10 text-zinc-200" />
                                            <p className="text-zinc-500 font-medium">No products found in inventory</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((item) => {
                                    const thumbnailSrc = item.thumbnail
                                        ? item.thumbnail.startsWith('http')
                                            ? item.thumbnail
                                            : `/storage/${item.thumbnail}`
                                        : null;

                                    return (
                                        <TableRow key={item.id} className="group hover:bg-zinc-50/50 dark:hover:bg-black/10 border-zinc-100 dark:border-zinc-800 transition-colors">
                                            <TableCell className="py-4 pl-8">
                                                <div className="size-12 rounded-xl border border-zinc-100 bg-zinc-50 overflow-hidden dark:border-zinc-800 dark:bg-zinc-800/50">
                                                    {thumbnailSrc ? (
                                                        <img src={thumbnailSrc} alt={item.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <Package className="size-5 text-zinc-300" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors line-clamp-1">{item.name}</span>
                                                    <span className="text-[10px] text-muted-foreground font-mono">ID: {item.id}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col gap-1">
                                                    {item.category && (
                                                        <span className="text-[11px] font-black uppercase tracking-wider text-primary">{item.category.name}</span>
                                                    )}
                                                    {item.brand && (
                                                        <span className="text-[10px] text-muted-foreground">{item.brand.name}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                                                Rp {Number(item.price).toLocaleString('id-ID')}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className={`font-black text-sm ${
                                                    Number(item.stock) === 0 ? 'text-destructive' : 
                                                    Number(item.stock) <= 5 ? 'text-amber-600' : 'text-zinc-900 dark:text-zinc-100'
                                                }`}>
                                                    {item.stock}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col gap-1">
                                                    {item.isFeatured && (
                                                        <Badge className="w-fit rounded-sm bg-amber-100 px-1.5 py-0.5 text-[7px] font-black uppercase text-amber-700 ring-1 ring-amber-400/20 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400">Featured</Badge>
                                                    )}
                                                    {item.isBestseller && (
                                                        <Badge className="w-fit rounded-sm bg-blue-100 px-1.5 py-0.5 text-[7px] font-black uppercase text-blue-700 ring-1 ring-blue-400/20 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400">Bestseller</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 pr-8 text-right">
                                                <div className="flex justify-end items-center gap-1.5">
                                                    <Button variant="ghost" size="icon" asChild className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                                                        <Link href={products.show(item.id).url}>
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild className="size-8 rounded-lg hover:bg-amber-100/50 hover:text-amber-600">
                                                        <Link href={products.edit(item.id).url}>
                                                            <Pencil className="size-3.5" />
                                                        </Link>
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive">
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="rounded-3xl">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="text-xl font-bold">Delete Product?</AlertDialogTitle>
                                                                <AlertDialogDescription className="text-sm">
                                                                    This will permanently remove <span className="font-bold text-foreground">"{item.name}"</span>.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                                                <AlertDialogAction className="rounded-xl bg-destructive hover:bg-destructive/90" onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Inventory', href: products.index().url },
    ],
};