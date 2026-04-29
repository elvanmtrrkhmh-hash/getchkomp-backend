<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

$models = [
    'Product' => ['folder' => 'Products', 'route' => 'products', 'table' => 'products'],
    'ProductVariant' => ['folder' => 'ProductVariants', 'route' => 'product-variants', 'table' => 'product_variants'],
    'Review' => ['folder' => 'Reviews', 'route' => 'reviews', 'table' => 'reviews'],
    'Order' => ['folder' => 'Orders', 'route' => 'orders', 'table' => 'orders'],
    'OrderItem' => ['folder' => 'OrderItems', 'route' => 'order-items', 'table' => 'order_items'],
    'Payment' => ['folder' => 'Payments', 'route' => 'payments', 'table' => 'payments'],
    'Shipping' => ['folder' => 'Shipping', 'route' => 'shipping', 'table' => 'shipping'],
    'User' => ['folder' => 'Users', 'route' => 'users', 'table' => 'users'],
];

foreach ($models as $name => $meta) {
    echo "Processing {$name}...\n";
    
    // Fetch schema directly
    if (!Schema::hasTable($meta['table'])) {
        echo "Table {$meta['table']} not found. Skipping.\n";
        continue;
    }
    $cols = DB::select("DESCRIBE {$meta['table']}");
    $fields = [];
    foreach($cols as $c) {
        $fieldName = $c->Field;
        if (in_array($fieldName, ['id', 'created_at', 'updated_at', 'remember_token', 'email_verified_at', 'two_factor_secret', 'two_factor_recovery_codes', 'two_factor_confirmed_at'])) continue;
        
        $type = $c->Type;
        $uiType = 'Input';
        if (strpos($type, 'text') !== false) $uiType = 'Textarea';
        if (strpos($type, 'json') !== false) {
            $uiType = 'Input'; // simplify JSON entry as text input for MVP
        }
        $fields[$fieldName] = $uiType;
    }

    $folder = __DIR__ . "/resources/js/pages/" . $meta['folder'];
    if (!is_dir($folder)) mkdir($folder, 0755, true);

    $routeNs = $meta['route'];
    $camelRoute = lcfirst(str_replace(' ', '', ucwords(str_replace('-', ' ', $routeNs))));

    // INDEX
    $indexCode = <<<TSX
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {$camelRoute} from '@/routes/{$routeNs}';
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
} from "@/components/ui/alert-dialog";

export default function Index(props: any) {
    const { delete: destroy } = useForm();
    const items = props['{$meta['route']}']?.data || props['{$meta['route']}'] || [];

    const handleDelete = (id: number) => {
        destroy({$camelRoute}.destroy(id).url);
    };

    return (
        <>
            <Head title="{$name} List" />
            <div className="flex flex-col gap-4 p-4 h-full flex-1">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{$name}</h1>
                    <Button asChild>
                        <Link href={{$camelRoute}.create().url}>Create {$name}</Link>
                    </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Record</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8">No data found</TableCell>
                                </TableRow>
                            ) : items.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.name || item.id}</TableCell>
                                    <TableCell className="text-right space-x-2 flex justify-end">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={{$camelRoute}.edit(item.id).url}>Edit</Link>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the {$name}.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
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
        { title: '{$name}', href: {$camelRoute}.index().url },
    ],
};
TSX;
    file_put_contents("$folder/Index.tsx", $indexCode);


    // CREATE
    $formFields = "";
    $defaultData = [];
    foreach ($fields as $fKey => $fType) {
        $capFKey = ucfirst(str_replace('_', ' ', $fKey));
        $defaultData[] = "        {$fKey}: '',";
        if ($fType === 'Textarea') {
            $formFields .= <<<TSX
                    <div className="space-y-2">
                        <Label htmlFor="{$fKey}">{$capFKey}</Label>
                        <textarea
                            id="{$fKey}"
                            value={data.{$fKey}}
                            onChange={(e) => setData('{$fKey}', e.target.value)}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <InputError message={errors.{$fKey} as string} />
                    </div>

TSX;
        } else {
            $formFields .= <<<TSX
                    <div className="space-y-2">
                        <Label htmlFor="{$fKey}">{$capFKey}</Label>
                        <Input
                            id="{$fKey}"
                            value={String(data.{$fKey} || '')}
                            onChange={(e) => setData('{$fKey}', e.target.value)}
                        />
                        <InputError message={errors.{$fKey} as string} />
                    </div>

TSX;
        }
    }
    $defaultDataStr = implode("\n", $defaultData);

    $createCode = <<<TSX
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import {$camelRoute} from '@/routes/{$routeNs}';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<Record<string, any>>({
{$defaultDataStr}
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post({$camelRoute}.store().url);
    };

    return (
        <>
            <Head title="Create {$name}" />
            <div className="flex flex-col gap-4 p-4 h-full flex-1 max-w-2xl">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Create {$name}</h1>
                    <Button variant="outline" asChild>
                        <Link href={{$camelRoute}.index().url}>Back</Link>
                    </Button>
                </div>
                
                <form onSubmit={submit} className="space-y-4 bg-background border p-6 rounded-md">
{$formFields}
                    <Button type="submit" disabled={processing}>Save</Button>
                </form>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: '{$name}', href: {$camelRoute}.index().url },
        { title: 'Create', href: {$camelRoute}.create().url },
    ],
};
TSX;
    file_put_contents("$folder/Create.tsx", $createCode);



    $editDataLines = [];
    foreach(array_keys($fields) as $k) {
        $editDataLines[] = "        {$k}: item?.{$k} || '',";
    }
    $editDataReady = implode("\n", $editDataLines);

    $editCode = <<<TSX
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import {$camelRoute} from '@/routes/{$routeNs}';

export default function Edit(props: any) {
    const item = props[Object.keys(props).find(k => k !== 'auth' && k !== 'errors') as string];
    
    const { data, setData, put, processing, errors } = useForm<Record<string, any>>({
{$editDataReady}
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put({$camelRoute}.update(item.id).url);
    };

    if (!item) return <div>Loading...</div>;

    return (
        <>
            <Head title="Edit {$name}" />
            <div className="flex flex-col gap-4 p-4 h-full flex-1 max-w-2xl">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Edit {$name}</h1>
                    <Button variant="outline" asChild>
                        <Link href={{$camelRoute}.index().url}>Back</Link>
                    </Button>
                </div>
                
                <form onSubmit={submit} className="space-y-4 bg-background border p-6 rounded-md">
{$formFields}
                    <Button type="submit" disabled={processing}>Update</Button>
                </form>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: '{$name}', href: {$camelRoute}.index().url },
        { title: 'Edit', href: '#' },
    ],
};
TSX;
    file_put_contents("$folder/Edit.tsx", $editCode);
}
echo "OK\n";
