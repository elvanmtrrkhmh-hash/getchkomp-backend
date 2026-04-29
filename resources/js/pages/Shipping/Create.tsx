import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Truck, Calendar, Hash, Package, Clock, ArrowLeft, Save, PlusCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import shipping from '@/routes/shipping';

interface Option {
    id: number;
}

export default function Create({ orders }: { orders: Option[] }) {
    const { data, setData, post, processing, errors } = useForm<Record<string, any>>({
        order_id: '',
        shipping_status: 'pending',
        tracking_number: '',
        shipping_date: '',
        estimated_delivery_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(shipping.store().url);
    };

    const statusOptions = ['pending', 'shipped', 'delivered', 'returned'];

    // Status color mapping for visual indicators
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'shipped': return 'text-blue-500';
            case 'delivered': return 'text-green-500';
            case 'returned': return 'text-amber-500';
            default: return 'text-slate-500';
        }
    };

    return (
        <>
            <Head title="Create Shipping" />
            <div className="flex flex-col gap-8 p-6 mx-auto w-full max-w-4xl">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Logistics Management</h1>
                        <p className="text-muted-foreground text-sm">Create and track shipping records for customer orders.</p>
                    </div>
                    <Button variant="outline" asChild className="gap-2 focus:ring-2 focus:ring-primary/20 bg-background/50 hover:bg-background transition-all">
                        <Link href={shipping.index().url}>
                            <ArrowLeft className="size-4" />
                            Back to List
                        </Link>
                    </Button>
                </div>

                <Card className="shadow-xl border-muted-foreground/10 overflow-hidden bg-white/5 dark:bg-black/5 backdrop-blur-md">
                    <CardHeader className="bg-muted/10 pb-8 border-b border-muted/20">
                        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                            <PlusCircle className="size-5 text-primary" />
                            New Shipping Entry
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Enter tracking details and delivery schedules to update logistics status.
                        </CardDescription>
                    </CardHeader>
                    
                    <form onSubmit={submit}>
                        <CardContent className="space-y-8 pt-8 px-8 md:px-10">
                            {/* Logistics Overview Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                <div className="space-y-3">
                                    <Label htmlFor="order_id" className="flex items-center gap-2 font-semibold text-sm">
                                        <Hash className="size-4 text-primary" />
                                        Associated Order
                                    </Label>
                                    <Select 
                                        value={data.order_id?.toString()} 
                                        onValueChange={(value) => setData('order_id', value)}
                                    >
                                        <SelectTrigger id="order_id" className="h-11 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40">
                                            <SelectValue placeholder="Select an order ID" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {orders.length > 0 ? (
                                                orders.map((ord) => (
                                                    <SelectItem key={ord.id} value={ord.id.toString()}>
                                                        Order #{ord.id}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-sm text-muted-foreground italic text-center">No active orders available</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.order_id as string} />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="shipping_status" className="flex items-center gap-2 font-semibold text-sm">
                                        <Clock className="size-4 text-primary" />
                                        Shipping Status
                                    </Label>
                                    <Select 
                                        value={data.shipping_status} 
                                        onValueChange={(value) => setData('shipping_status', value)}
                                    >
                                        <SelectTrigger id="shipping_status" className="h-11 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40 capitalize">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((opt) => (
                                                <SelectItem key={opt} value={opt} className="capitalize py-2">
                                                    <span className={opt === data.shipping_status ? getStatusColor(opt) : ''}>
                                                        {opt}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.shipping_status as string} />
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            {/* Tracking Information Section */}
                            <div className="space-y-3 pt-2">
                                <Label htmlFor="tracking_number" className="flex items-center gap-2 font-semibold text-sm">
                                    <Truck className="size-4 text-primary" />
                                    Tracking Number
                                </Label>
                                <div className="relative group">
                                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                                    <Input
                                        id="tracking_number"
                                        placeholder="e.g. JB123456789 (Carrier specific ID)"
                                        value={data.tracking_number}
                                        onChange={(e) => setData('tracking_number', e.target.value)}
                                        className="h-12 pl-10 bg-background/50 focus:bg-background border-muted-foreground/20 hover:border-primary/40 transition-all font-mono text-lg tracking-wider"
                                    />
                                </div>
                                <InputError message={errors.tracking_number as string} />
                            </div>

                            <Separator className="opacity-50" />

                            {/* Timeline Schedule Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                                <div className="space-y-3">
                                    <Label htmlFor="shipping_date" className="flex items-center gap-2 font-semibold text-sm text-foreground">
                                        <Calendar className="size-4 text-primary" />
                                        Actual Shipping Date
                                    </Label>
                                    <Input
                                        id="shipping_date"
                                        type="datetime-local"
                                        value={data.shipping_date}
                                        onChange={(e) => setData('shipping_date', e.target.value)}
                                        className="h-11 bg-background/50 focus:bg-background border-muted-foreground/20 hover:border-primary/40 transition-all"
                                    />
                                    <InputError message={errors.shipping_date as string} />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="estimated_delivery_date" className="flex items-center gap-2 font-semibold text-sm text-foreground">
                                        <Clock className="size-4 text-primary" />
                                        Est. Delivery Date
                                    </Label>
                                    <Input
                                        id="estimated_delivery_date"
                                        type="datetime-local"
                                        value={data.estimated_delivery_date}
                                        onChange={(e) => setData('estimated_delivery_date', e.target.value)}
                                        className="h-11 bg-background/50 focus:bg-background border-muted-foreground/20 hover:border-primary/40 transition-all"
                                    />
                                    <InputError message={errors.estimated_delivery_date as string} />
                                </div>
                            </div>
                        </CardContent>

                        <div className="px-8 pb-10 pt-4 md:px-10">
                            <Button 
                                type="submit" 
                                size="lg" 
                                className="w-full h-14 font-extrabold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all bg-primary hover:bg-primary/90 text-primary-foreground gap-3 text-lg" 
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <span className="size-5 animate-spin border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                                        Creating Record...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-5" />
                                        Create Shipping Entry
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

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Shipping', href: shipping.index().url },
        { title: 'Create', href: shipping.create().url },
    ],
};