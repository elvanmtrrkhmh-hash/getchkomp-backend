import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import InputError from '@/components/input-error';
import orders from '@/routes/orders';
import { 
    PencilLine, 
    ArrowLeft, 
    User, 
    Calendar, 
    Banknote, 
    MapPin, 
    CreditCard,
    Save,
    Tag,
    ShoppingBag
} from 'lucide-react';

interface Option {
    id: number;
    name: string;
}

export default function Edit({
    order,
    users,
}: {
    order: any;
    users: Option[];
}) {
    const { data, setData, put, processing, errors } = useForm<Record<string, any>>({
        user_id: order.user_id || '',
        total_amount: order.total_amount || '',
        status: order.status || 'pending',
        order_date: order.order_date ? order.order_date.split(' ')[0] : '',
        shipping_address: order.shipping_address || '',
        payment_status: order.payment_status || 'pending',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(orders.update(order.id).url);
    };

    const statusOptions = ['pending', 'paid', 'shipped', 'cancelled'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'text-green-500';
            case 'shipped': return 'text-blue-500';
            case 'cancelled': return 'text-red-500';
            default: return 'text-yellow-500';
        }
    };

    return (
        <>
            <Head title={`Edit Order: #${order.id}`} />
            <div className="flex flex-col gap-8 p-6 mx-auto w-full max-w-4xl">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Order Management</h1>
                        <p className="text-muted-foreground text-sm">Update and manage order details for #${order.id}.</p>
                    </div>
                    <Button variant="outline" asChild className="gap-2 focus:ring-2 focus:ring-primary/20 bg-background/50 hover:bg-background">
                        <Link href={orders.index().url}>
                            <ArrowLeft className="size-4" />
                            Back to List
                        </Link>
                    </Button>
                </div>

                <Card className="shadow-xl border-muted-foreground/10 overflow-hidden bg-white/5 dark:bg-black/5 backdrop-blur-md">
                    <CardHeader className="bg-muted/10 pb-8 border-b border-muted/20">
                        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                            <PencilLine className="size-5 text-primary" />
                            Edit Order Details
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Update customer, totals, or order statuses carefully.
                        </CardDescription>
                    </CardHeader>
                    
                    <form onSubmit={submit}>
                        <CardContent className="space-y-8 pt-8 px-8">
                            {/* Section: Customer & Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                <div className="space-y-3">
                                    <Label htmlFor="user_id" className="flex items-center gap-2 font-semibold text-sm">
                                        <User className="size-4 text-primary" />
                                        Customer
                                    </Label>
                                    <Select 
                                        value={data.user_id?.toString()} 
                                        onValueChange={(value) => setData('user_id', value)}
                                    >
                                        <SelectTrigger id="user_id" className="h-11 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40">
                                            <SelectValue placeholder="Select a customer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.length > 0 ? (
                                                users.map((user) => (
                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                        {user.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-sm text-muted-foreground italic text-center">No users found</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.user_id as string} />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="order_date" className="flex items-center gap-2 font-semibold text-sm">
                                        <Calendar className="size-4 text-primary" />
                                        Order Date
                                    </Label>
                                    <Input
                                        id="order_date"
                                        type="date"
                                        value={data.order_date}
                                        onChange={(e) => setData('order_date', e.target.value)}
                                        className="h-11 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40"
                                    />
                                    <InputError message={errors.order_date as string} />
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            {/* Section: Financials & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="total_amount" className="flex items-center gap-2 font-semibold text-sm">
                                        <Banknote className="size-4 text-primary" />
                                        Total Amount
                                    </Label>
                                    <div className="relative group">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold group-focus-within:text-primary transition-colors">Rp</span>
                                        <Input
                                            id="total_amount"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={data.total_amount}
                                            onChange={(e) => setData('total_amount', e.target.value)}
                                            className="h-11 pl-10 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40 font-mono"
                                        />
                                    </div>
                                    <InputError message={errors.total_amount as string} />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="status" className="flex items-center gap-2 font-semibold text-sm">
                                        <Tag className="size-4 text-primary" />
                                        Order Status
                                    </Label>
                                    <Select 
                                        value={data.status} 
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger id="status" className="h-11 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40 capitalize">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((opt) => (
                                                <SelectItem key={opt} value={opt} className="capitalize py-2">
                                                    <span className={opt === data.status ? getStatusColor(opt) : ''}>
                                                        {opt}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status as string} />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="payment_status" className="flex items-center gap-2 font-semibold text-sm">
                                        <CreditCard className="size-4 text-primary" />
                                        Payment Status
                                    </Label>
                                    <Select 
                                        value={data.payment_status} 
                                        onValueChange={(value) => setData('payment_status', value)}
                                    >
                                        <SelectTrigger id="payment_status" className="h-11 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40 capitalize">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((opt) => (
                                                <SelectItem key={opt} value={opt} className="capitalize py-2">
                                                    <span className={opt === data.payment_status ? getStatusColor(opt) : ''}>
                                                        {opt}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.payment_status as string} />
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            {/* Section: Shipping */}
                            <div className="space-y-3">
                                <Label htmlFor="shipping_address" className="flex items-center gap-2 font-semibold text-sm">
                                    <MapPin className="size-4 text-primary" />
                                    Shipping Address
                                </Label>
                                <Textarea
                                    id="shipping_address"
                                    placeholder="Enter full delivery details..."
                                    value={data.shipping_address}
                                    onChange={(e) => setData('shipping_address', e.target.value)}
                                    className="min-h-[120px] bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40 resize-none py-3"
                                />
                                <InputError message={errors.shipping_address as string} />
                            </div>
                        </CardContent>

                        <div className="px-8 pb-8 pt-4">
                            <Button 
                                type="submit" 
                                size="lg" 
                                className="w-full h-12 font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-base" 
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <span className="size-4 animate-spin border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                                        Updating Order...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-5" />
                                        Update Order
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Order', href: orders.index().url },
        { title: 'Edit', href: '#' },
    ],
};