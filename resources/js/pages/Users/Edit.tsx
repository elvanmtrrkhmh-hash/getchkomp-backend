import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import users from '@/routes/users';

export default function Edit(props: any) {
    const item = props[Object.keys(props).find(k => k !== 'auth' && k !== 'errors') as string];
    
    const { data, setData, put, processing, errors } = useForm<Record<string, any>>({
        name: item?.name || '',
        email: item?.email || '',
        password: item?.password || '',
        role: item?.role || '',
        address: item?.address || '',
        phone_number: item?.phone_number || '',
        join_date: item?.join_date || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(users.update(item.id).url);
    };

    if (!item) return <div>Loading...</div>;

    return (
        <>
            <Head title="Edit User" />
            <div className="flex flex-col gap-4 p-4 h-full flex-1 max-w-2xl">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Edit User</h1>
                    <Button variant="outline" asChild>
                        <Link href={users.index().url}>Back</Link>
                    </Button>
                </div>
                
                <form onSubmit={submit} className="space-y-4 bg-background border p-6 rounded-md">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={String(data.name || '')}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name as string} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={String(data.email || '')}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email as string} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            value={String(data.password || '')}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password as string} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                            id="role"
                            value={String(data.role || '')}
                            onChange={(e) => setData('role', e.target.value)}
                        />
                        <InputError message={errors.role as string} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={String(data.address || '')}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                        <InputError message={errors.address as string} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone number</Label>
                        <Input
                            id="phone_number"
                            value={String(data.phone_number || '')}
                            onChange={(e) => setData('phone_number', e.target.value)}
                        />
                        <InputError message={errors.phone_number as string} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="join_date">Join date</Label>
                        <Input
                            id="join_date"
                            value={String(data.join_date || '')}
                            onChange={(e) => setData('join_date', e.target.value)}
                        />
                        <InputError message={errors.join_date as string} />
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
        { title: 'User', href: users.index().url },
        { title: 'Edit', href: '#' },
    ],
};