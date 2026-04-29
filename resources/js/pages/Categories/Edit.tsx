import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import categories from '@/routes/categories';

interface Category {
    id: number;
    name: string;
    description: string | null;
}

export default function Edit({ category }: { category: Category }) {
    // dynamically extract singular model property e.g. props.category or props.brand

    const { data, setData, put, processing, errors } = useForm<Record<string, string>>({
        name: category?.name || '',
        description: category?.description || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(categories.update(category.id).url);
    };

    if (!category) return <div>Loading...</div>;

    return (
        <>
            <Head title="Edit Category" />
            <div className="flex flex-col gap-4 p-4 h-full flex-1 max-w-2xl">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Edit Category</h1>
                    <Button variant="outline" asChild>
                        <Link href={categories.index().url}>Back</Link>
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

                    <Button type="submit" disabled={processing}>Update</Button>
                </form>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Category', href: categories.index().url },
        { title: 'Edit', href: '#' },
    ],
};