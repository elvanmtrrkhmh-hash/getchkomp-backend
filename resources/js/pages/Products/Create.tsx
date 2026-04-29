import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Box,
    CheckCircle2,
    Coins,
    Image as ImageIcon,
    LayoutGrid,
    Plus,
    Save,
    Settings2,
    Sliders,
    Star,
    Trash2,
    Upload,
    Wrench,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import products from '@/routes/products';

interface Option {
    id: number;
    name: string;
}

export default function Create({ brands, categories }: { brands: Option[]; categories: Option[] }) {
    const { data, setData, post, transform, processing, errors } = useForm<Record<string, any>>({
        name: '',
        category_id: '',
        brand_id: '',
        price: '',
        stock: '1',
        rating: '',
        thumbnail: null as File | null,
        images: [] as File[],
        isFeatured: false,
        isBestseller: false,
        description: '',
        features: [''],
        overview: [''],
        colors: [],
        specs: [{ label: '', value: '' }],
        options: [] as Array<{ key: string; values: string[] }>,
    });

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [colorInput, setColorInput] = useState('');

    const onThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail', file);
            const reader = new FileReader();
            reader.onloadend = () => setThumbnailPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setData('images', [...data.images, ...files]);
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews((prev) => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        const newImages = data.images.filter((_: any, i: number) => i !== index);
        const newPreviews = imagePreviews.filter((_: any, i: number) => i !== index);
        setData('images', newImages);
        setImagePreviews(newPreviews);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            specs: data.specs.reduce((acc: any, item: any) => {
                if (item.label.trim()) {
                    acc[item.label.trim()] = item.value;
                }
                return acc;
            }, {}),
            options: data.options.reduce((acc: any, row: any) => {
                if (row.key?.trim() && row.values?.length > 0) {
                    acc[row.key.trim()] = row.values;
                }
                return acc;
            }, {}),
        }));
        post(products.store().url);
    };

    return (
        <>
            <Head title="Create Product" />

            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 p-6 lg:p-10">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Add a new product to your e-commerce catalog.</p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="h-9 gap-2">
                        <Link href={products.index().url}>
                            <ArrowLeft className="size-4" />
                            Back to List
                        </Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Main Content Area (Left: 8 Columns) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* ─── Row 1: General Info & Media ─── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* General Information */}
                            <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/60">
                                <CardHeader className="bg-muted/20 pb-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 flex size-7 items-center justify-center rounded-lg text-primary">
                                            <Box className="size-4" />
                                        </div>
                                        <CardTitle className="text-base">General Information</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Premium Wireless Headphones"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="h-10 transition-all focus:ring-2"
                                        />
                                        <InputError message={errors.name as string} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                                        <textarea
                                            id="description"
                                            placeholder="Detailed description..."
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        />
                                        <InputError message={errors.description as string} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Product Media */}
                            <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/60">
                                <CardHeader className="bg-muted/20 pb-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 flex size-7 items-center justify-center rounded-lg text-primary">
                                            <ImageIcon className="size-4" />
                                        </div>
                                        <CardTitle className="text-base">Product Media</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5 pt-5">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="group relative flex size-24 shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 transition-all hover:bg-muted/30"
                                            onClick={() => document.getElementById('thumbnail')?.click()}
                                        >
                                            {thumbnailPreview ? (
                                                <img src={thumbnailPreview} alt="" className="size-full object-cover transition group-hover:scale-110" />
                                            ) : (
                                                <Upload className="size-5 text-muted-foreground/50" />
                                            )}
                                            <input id="thumbnail" type="file" className="hidden" onChange={onThumbnailChange} accept="image/*" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                                                <span className="text-[10px] font-bold text-white">UPLOAD</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-bold text-foreground">Main Thumbnail</p>
                                            <p className="text-[10px] text-muted-foreground leading-tight">Recommended 800x800px JPG/PNG.</p>
                                            <InputError message={errors.thumbnail as string} />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Gallery</Label>
                                            <span className="text-[10px] font-medium text-muted-foreground">{imagePreviews.length} selected</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('images')?.click()}
                                                className="flex size-14 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 transition hover:bg-muted/30"
                                            >
                                                <Plus className="size-4 text-muted-foreground/50" />
                                            </button>
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="group relative size-14 overflow-hidden rounded-lg border bg-muted ring-1 ring-border/50">
                                                    <img src={preview} alt="" className="size-full object-cover transition group-hover:scale-110" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute inset-0 flex items-center justify-center bg-destructive/60 opacity-0 transition group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="size-3 text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <input id="images" type="file" className="hidden" multiple onChange={onImagesChange} accept="image/*" />
                                        <InputError message={errors.images as string} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* ─── Row 2: Product Specifications ─── */}
                        <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/60">
                            <CardHeader className="bg-muted/20 pb-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary/10 flex size-7 items-center justify-center rounded-lg text-primary">
                                        <Settings2 className="size-4" />
                                    </div>
                                    <CardTitle className="text-base">Specifications Content</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-2">
                                {/* Features */}
                                <div className="space-y-4 lg:border-r lg:pr-6">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Features</Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setData('features', [...data.features, ''])}
                                            className="h-6 gap-1 px-1.5 text-[10px] font-bold text-primary hover:bg-primary/10"
                                        >
                                            <Plus className="size-3" /> ADD
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {data.features.map((feature: string, index: number) => (
                                            <div key={index} className="flex gap-2">
                                                <Input
                                                    value={feature}
                                                    placeholder={`Feature ${index + 1}`}
                                                    onChange={(e) => {
                                                        const newFeatures = [...data.features];
                                                        newFeatures[index] = e.target.value;
                                                        setData('features', newFeatures);
                                                    }}
                                                    className="h-9 text-xs"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-9 shrink-0 text-muted-foreground hover:text-destructive"
                                                    disabled={data.features.length === 1}
                                                    onClick={() => setData('features', data.features.filter((_: any, i: number) => i !== index))}
                                                >
                                                    <X className="size-3.5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Colors</Label>
                                        </div>
                                        <div className="flex flex-wrap gap-2 p-2 rounded-lg border bg-muted/5">
                                            {data.colors.map((color: string, index: number) => (
                                                <Badge key={index} variant="secondary" className="gap-1 border-primary/20 text-[10px] font-bold">
                                                    {color}
                                                    <X className="size-2.5 cursor-pointer hover:text-destructive" onClick={() => setData('colors', data.colors.filter((_: any, i: number) => i !== index))} />
                                                </Badge>
                                            ))}
                                            <input
                                                placeholder="Add color..."
                                                className="flex-1 bg-transparent min-w-[80px] text-xs focus:ring-0 italic border-none h-6"
                                                value={colorInput}
                                                onChange={(e) => setColorInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        if (colorInput.trim() && !data.colors.includes(colorInput.trim())) {
                                                            setData('colors', [...data.colors, colorInput.trim()]);
                                                            setColorInput('');
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <InputError message={errors.colors as string} />
                                    </div>
                                </div>

                                {/* Overview */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Overview</Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setData('overview', [...data.overview, ''])}
                                            className="h-6 gap-1 px-1.5 text-[10px] font-bold text-primary hover:bg-primary/10"
                                        >
                                            <Plus className="size-3" /> ADD
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {data.overview.map((item: string, index: number) => (
                                            <div key={index} className="flex gap-2">
                                                <Input
                                                    value={item}
                                                    placeholder={`Highlight ${index + 1}`}
                                                    onChange={(e) => {
                                                        const newOverview = [...data.overview];
                                                        newOverview[index] = e.target.value;
                                                        setData('overview', newOverview);
                                                    }}
                                                    className="h-9 text-xs"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-9 shrink-0 text-muted-foreground hover:text-destructive"
                                                    disabled={data.overview.length === 1}
                                                    onClick={() => setData('overview', data.overview.filter((_: any, i: number) => i !== index))}
                                                >
                                                    <X className="size-3.5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ─── Row 3: Technical Specs & Options ─── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Technical Specs */}
                            <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/60">
                                <CardHeader className="bg-muted/20 pb-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 flex size-7 items-center justify-center rounded-lg text-primary">
                                            <Wrench className="size-4" />
                                        </div>
                                        <CardTitle className="text-base">Technical Specs</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 pt-5">
                                    <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2">
                                        {data.specs.map((spec: any, index: number) => (
                                            <div key={index} className="flex gap-2 items-center">
                                                <Input
                                                    placeholder="Label"
                                                    value={spec.label}
                                                    onChange={(e) => {
                                                        const newSpecs = [...data.specs];
                                                        newSpecs[index].label = e.target.value;
                                                        setData('specs', newSpecs);
                                                    }}
                                                    className="h-9 text-[11px] font-bold"
                                                />
                                                <Input
                                                    placeholder="Value"
                                                    value={spec.value}
                                                    onChange={(e) => {
                                                        const newSpecs = [...data.specs];
                                                        newSpecs[index].value = e.target.value;
                                                        setData('specs', newSpecs);
                                                    }}
                                                    className="h-9 text-[11px]"
                                                />
                                                <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => setData('specs', data.specs.filter((_: any, i: number) => i !== index))}>
                                                    <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button type="button" variant="outline" size="sm" className="w-full border-dashed h-8 text-[10px] font-bold" onClick={() => setData('specs', [...data.specs, { label: '', value: '' }])}>
                                        <Plus className="mr-2 size-3" /> ADD SPEC
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Product Options */}
                            <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/60">
                                <CardHeader className="bg-muted/20 pb-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 flex size-7 items-center justify-center rounded-lg text-primary">
                                            <Sliders className="size-4" />
                                        </div>
                                        <CardTitle className="text-base">Product Options</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-5">
                                    <div className="max-h-[300px] overflow-y-auto pr-1 space-y-3">
                                        {data.options.map((option: any, optIndex: number) => (
                                            <div key={optIndex} className="p-3 rounded-lg border bg-muted/5 space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <Input
                                                        placeholder="Option Name"
                                                        value={option.key}
                                                        onChange={(e) => {
                                                            const newOptions = [...data.options];
                                                            newOptions[optIndex].key = e.target.value;
                                                            setData('options', newOptions);
                                                        }}
                                                        className="h-8 text-[11px] font-black border-none bg-transparent"
                                                    />
                                                    <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive cursor-pointer" onClick={() => setData('options', data.options.filter((_: any, i: number) => i !== optIndex))} />
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 p-1.5 rounded-md border bg-background">
                                                    {option.values.map((v: string, vIdx: number) => (
                                                        <Badge key={vIdx} variant="secondary" className="px-1.5 py-0 text-[9px] font-bold">
                                                            {v}
                                                            <X className="size-2 ml-1 cursor-pointer" onClick={() => {
                                                                const newOptions = [...data.options];
                                                                newOptions[optIndex].values = option.values.filter((_: any, i: number) => i !== vIdx);
                                                                setData('options', newOptions);
                                                            }} />
                                                        </Badge>
                                                    ))}
                                                    <input
                                                        placeholder="..."
                                                        className="bg-transparent border-none focus:ring-0 text-[10px] w-12"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                const val = e.currentTarget.value.trim();
                                                                if (val && !option.values.includes(val)) {
                                                                    const newOptions = [...data.options];
                                                                    newOptions[optIndex].values = [...option.values, val];
                                                                    setData('options', newOptions);
                                                                    e.currentTarget.value = '';
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button type="button" variant="outline" size="sm" className="w-full border-dashed h-8 text-[10px] font-bold" onClick={() => setData('options', [...data.options, { key: '', values: [] }])}>
                                        <Plus className="mr-2 size-3" /> ADD OPTION
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar Area (Right: 4 Columns) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Inventory & Pricing */}
                        <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/60">
                            <CardHeader className="bg-muted/30 pb-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary/10 flex size-7 items-center justify-center rounded-lg text-primary">
                                        <Coins className="size-4" />
                                    </div>
                                    <CardTitle className="text-base">Price & Stock</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-5">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Selling Price</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">Rp</span>
                                        <Input
                                            id="price" type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="h-10 pl-9 font-black"
                                        />
                                    </div>
                                    <InputError message={errors.price as string} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Stock</Label>
                                    <Input
                                        id="stock" type="number"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        className="h-10 font-bold"
                                    />
                                    <InputError message={errors.stock as string} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rating" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Initial Rating</Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            id="rating" type="number" step="0.1" min="0" max="5"
                                            value={data.rating}
                                            onChange={(e) => setData('rating', e.target.value)}
                                            className="h-9 w-20 text-center font-bold"
                                        />
                                        <StarRatingBar value={data.rating} />
                                    </div>
                                    <InputError message={errors.rating as string} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Categorization */}
                        <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/60">
                            <CardHeader className="bg-muted/30 pb-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary/10 flex size-7 items-center justify-center rounded-lg text-primary">
                                        <LayoutGrid className="size-4" />
                                    </div>
                                    <CardTitle className="text-base">Classification</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-5">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
                                    <Select value={data.category_id.toString()} onValueChange={(val) => setData('category_id', val)}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Category" /></SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category_id as string} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand</Label>
                                    <Select value={data.brand_id.toString()} onValueChange={(val) => setData('brand_id', val)}>
                                        <SelectTrigger className="h-10"><SelectValue placeholder="Brand" /></SelectTrigger>
                                        <SelectContent>
                                            {brands.map((brand) => <SelectItem key={brand.id} value={brand.id.toString()}>{brand.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.brand_id as string} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Visibility */}
                        <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/60">
                            <CardHeader className="bg-muted/30 pb-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary/10 flex size-7 items-center justify-center rounded-lg text-primary">
                                        <CheckCircle2 className="size-4" />
                                    </div>
                                    <CardTitle className="text-base">Visibility</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2 pt-5">
                                <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/5">
                                    <Label htmlFor="isFeatured" className="text-xs font-bold cursor-pointer">Featured</Label>
                                    <Checkbox id="isFeatured" checked={data.isFeatured} onCheckedChange={(checked) => setData('isFeatured', checked)} />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/5">
                                    <Label htmlFor="isBestseller" className="text-xs font-bold cursor-pointer">Bestseller</Label>
                                    <Checkbox id="isBestseller" checked={data.isBestseller} onCheckedChange={(checked) => setData('isBestseller', checked)} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Trigger */}
                        <div className="sticky top-6 pt-4 space-y-4">
                            <Button type="submit" size="lg" className="h-14 w-full gap-3 rounded-2xl shadow-xl shadow-primary/20 transition-all font-black text-base" disabled={processing}>
                                <Save className="size-5" />
                                {processing ? 'CREATING...' : 'CREATE PRODUCT'}
                            </Button>
                            <p className="text-[10px] text-muted-foreground text-center px-4 leading-relaxed">
                                Review all details. Your product will be live in the store immediately upon creation.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

function StarRatingBar({ value }: { value: any }) {
    const clamped = Math.min(5, Math.max(0, Number(value)));
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`size-3 ${i < Math.floor(clamped) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 dark:text-zinc-800'}`} />
            ))}
        </div>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Product', href: products.index().url },
        { title: 'Create', href: products.create().url },
    ],
};