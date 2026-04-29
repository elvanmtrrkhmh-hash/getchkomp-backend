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
import { CreditCard, Calendar, Hash, CheckCircle, ArrowLeft, Save, PencilLine } from 'lucide-react';
import InputError from '@/components/input-error';
import payments from '@/routes/payments';

interface Option {
    id: number;
}

export default function Edit({
    payment,
    orders,
}: {
    payment: any;
    orders: Option[];
}) {
    const { data, setData, put, processing, errors } = useForm<Record<string, any>>({
        order_id: payment.order_id || '',
        payment_method: payment.payment_method || 'credit_card',
        payment_status: payment.payment_status || 'pending',
        payment_date: payment.payment_date ? payment.payment_date.replace(' ', 'T').slice(0, 16) : '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(payments.update(payment.id).url);
    };

    const methodOptions = [
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'e_wallet', label: 'E-Wallet' },
    ];

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'failed', label: 'Failed' },
    ];

    return (
        <>
            <Head title={`Edit Payment: #${payment.id}`} />
            <div className="flex flex-col gap-8 p-6 mx-auto w-full max-w-3xl">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Payment Management</h1>
                        <p className="text-muted-foreground text-sm">Update and review financial transaction details for record #{payment.id}.</p>
                    </div>
                    <Button variant="outline" asChild className="gap-2 focus:ring-2 focus:ring-primary/20 transition-all bg-background/50 hover:bg-background">
                        <Link href={payments.index().url}>
                            <ArrowLeft className="size-4" />
                            Back to List
                        </Link>
                    </Button>
                </div>

                <Card className="shadow-xl border-muted-foreground/10 overflow-hidden bg-white/5 dark:bg-black/5 backdrop-blur-md">
                    <CardHeader className="bg-muted/10 pb-8 border-b border-muted/20">
                        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
                            <PencilLine className="size-5 text-primary" />
                            Modify Payment Details
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Adjust payment associations, method, or current status carefully.
                        </CardDescription>
                    </CardHeader>
                    
                    <form onSubmit={submit}>
                        <CardContent className="space-y-8 pt-8 px-8">
                            {/* Order Selection */}
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
                                        <SelectValue placeholder="Select an order" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orders.length > 0 ? (
                                            orders.map((ord) => (
                                                <SelectItem key={ord.id} value={ord.id.toString()}>
                                                    Order #{ord.id}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-sm text-muted-foreground italic text-center">No orders available</div>
                                        )}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.order_id as string} />
                            </div>

                            <Separator className="opacity-50" />

                            {/* Method & Status Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="payment_method" className="flex items-center gap-2 font-semibold text-sm">
                                        <CreditCard className="size-4 text-primary" />
                                        Payment Method
                                    </Label>
                                    <Select 
                                        value={data.payment_method} 
                                        onValueChange={(value) => setData('payment_method', value)}
                                    >
                                        <SelectTrigger id="payment_method" className="h-11 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {methodOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.payment_method as string} />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="payment_status" className="flex items-center gap-2 font-semibold text-sm">
                                        <CheckCircle className="size-4 text-primary" />
                                        Payment Status
                                    </Label>
                                    <Select 
                                        value={data.payment_status} 
                                        onValueChange={(value) => setData('payment_status', value)}
                                    >
                                        <SelectTrigger id="payment_status" className="h-11 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.payment_status as string} />
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            {/* Date Selection */}
                            <div className="space-y-3">
                                <Label htmlFor="payment_date" className="flex items-center gap-2 font-semibold text-sm">
                                    <Calendar className="size-4 text-primary" />
                                    Payment Date & Time
                                </Label>
                                <Input
                                    id="payment_date"
                                    type="datetime-local"
                                    value={data.payment_date}
                                    onChange={(e) => setData('payment_date', e.target.value)}
                                    className="h-11 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40"
                                />
                                <InputError message={errors.payment_date as string} />
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
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-5" />
                                        Update Payment Entry
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
        { title: 'Payment', href: payments.index().url },
        { title: 'Edit', href: '#' },
    ],
};