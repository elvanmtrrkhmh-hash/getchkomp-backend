import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    FileText,
    Image as ImageIcon,
    Save,
    Upload,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        status: 'draft',
        thumbnail: null as File | null,
        category: '',
        tags: '',
    });

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    const onThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail', file);
            const reader = new FileReader();
            reader.onloadend = () => setThumbnailPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/articles');
    };

    return (
        <>
            <Head title="Create Article" />

            <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6 lg:p-10">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Article</h1>
                        <p className="text-muted-foreground mt-1">Share your thoughts and insights with the world.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" asChild className="h-9 gap-2">
                            <Link href="/articles">
                                <ArrowLeft className="size-4" />
                                Back to List
                            </Link>
                        </Button>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column: Main Content */}
                    <div className="flex flex-col gap-8 lg:col-span-2">
                        {/* Article Content */}
                        <Card className="overflow-hidden border-none shadow-md ring-1 ring-border/60">
                            <CardHeader className="bg-muted/30 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary/10 flex size-8 items-center justify-center rounded-lg text-primary">
                                        <FileText className="size-5" />
                                    </div>
                                    <CardTitle className="text-lg">Article Content</CardTitle>
                                </div>
                                <CardDescription>Craft your story and refine your message.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-semibold">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter a catchy title..."
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="h-11 transition-all duration-200 focus:ring-2 text-lg font-medium"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content" className="text-sm font-semibold">
                                        Content
                                    </Label>
                                    <textarea
                                        id="content"
                                        placeholder="Write your article here..."
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="flex min-h-[400px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-serif leading-relaxed"
                                    />
                                    <InputError message={errors.content} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="flex flex-col gap-8">
                        {/* Publish Settings */}
                        <Card className="overflow-hidden border-none shadow-md ring-1 ring-border/60">
                            <CardHeader className="bg-muted/30 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary/10 flex size-8 items-center justify-center rounded-lg text-primary">
                                        <BookOpen className="size-5" />
                                    </div>
                                    <CardTitle className="text-lg">Publish Settings</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Status</Label>
                                    <Select 
                                        value={data.status} 
                                        onValueChange={(val) => setData('status', val)}
                                    >
                                        <SelectTrigger className="h-10 w-full transition-all focus:ring-2">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-sm font-semibold">Kategori</Label>
                                    <Input 
                                        id="category"
                                        placeholder="Pilih atau ketik kategori..." 
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="h-10 transition-all focus:ring-2"
                                    />
                                    <InputError message={errors.category} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tags" className="text-sm font-semibold">Tag</Label>
                                    <Input 
                                        id="tags"
                                        placeholder="Tag1, Tag2, Tag3..." 
                                        value={data.tags}
                                        onChange={(e) => setData('tags', e.target.value)}
                                        className="h-10 transition-all focus:ring-2"
                                    />
                                    <p className="text-[11px] text-muted-foreground">Pisahkan dengan koma untuk banyak tag.</p>
                                    <InputError message={errors.tags} />
                                </div>

                                <Separator />

                                {/* Thumbnail */}
                                <div className="space-y-4">
                                    <Label className="text-sm font-semibold">Thumbnail</Label>
                                    <div className="relative aspect-video cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 transition-all hover:bg-muted/30"
                                        onClick={() => document.getElementById('thumbnail')?.click()}
                                    >
                                        {thumbnailPreview ? (
                                            <img
                                                src={thumbnailPreview}
                                                alt="Thumbnail"
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                                                <Upload className="size-8 text-muted-foreground/60" />
                                                <span className="text-xs font-medium text-muted-foreground">Upload Image</span>
                                            </div>
                                        )}
                                        <input
                                            id="thumbnail"
                                            type="file"
                                            className="hidden"
                                            onChange={onThumbnailChange}
                                            accept="image/*"
                                        />
                                        {thumbnailPreview && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="size-8 rounded-full"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setData('thumbnail', null);
                                                        setThumbnailPreview(null);
                                                    }}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground text-[11px]">Recommended 16:9 ratio. Max 2MB.</p>
                                    <InputError message={errors.thumbnail} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="sticky top-6 space-y-4">
                            <Button type="submit" size="lg" className="h-12 w-full gap-2 rounded-xl text-base shadow-lg transition-all active:scale-[0.98]" disabled={processing}>
                                <Save className="size-5" />
                                {processing ? 'Processing...' : 'Save Article'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Articles', href: '/articles' },
        { title: 'Create', href: '/articles/create' },
    ],
};
