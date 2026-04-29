import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import brands from '@/routes/brands';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<Record<string, string>>({
        name: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(brands.store().url);
    };

    return (
        <>
            <Head title="Create Brand" />
            <div className="flex flex-col gap-4 p-4 h-full flex-1 max-w-2xl">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Create Brand</h1>
                    <Button variant="outline" asChild>
                        <Link href={brands.index().url}>Back</Link>
                    </Button>
                </div>
                
                <form onSubmit={submit} className="space-y-4 bg-background border p-6 rounded-md">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name as string} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <InputError message={errors.description as string} />
                    </div>

                    <Button type="submit" disabled={processing}>Save</Button>
                </form>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Brand', href: brands.index().url },
        { title: 'Create', href: brands.create().url },
    ],
};