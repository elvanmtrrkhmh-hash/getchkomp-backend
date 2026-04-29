import React, { useEffect, useRef } from 'react';
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
import { Plus, Minus, Package, Hash, Banknote, ShoppingCart, ArrowLeft, Save, PencilLine } from 'lucide-react';
import InputError from '@/components/input-error';
import orderItems from '@/routes/order-items';

interface OrderOption {
    id: number;
}

interface ProductOption {
    id: number;
    name: string;
    price: number;
}

export default function Edit({
    orderItem,
    orders,
    products,
}: {
    orderItem: any;
    orders: OrderOption[];
    products: ProductOption[];
}) {
    const { data, setData, put, processing, errors } = useForm<Record<string, any>>({
        order_id: orderItem.order_id || '',
        product_id: orderItem.product_id || '',
        quantity: orderItem.quantity || 1,
        price: orderItem.price?.toString() || '',
    });

    const isFirstRender = useRef(true);

    // Automatically update price when product is changed by user
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (data.product_id) {
            const selectedProduct = products.find(p => p.id === parseInt(data.product_id));
            if (selectedProduct) {
                setData('price', selectedProduct.price.toString());
            }
        }
    }, [data.product_id]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(orderItems.update(orderItem.id).url);
    };

    const handleQuantityChange = (val: number) => {
        const newQty = Math.max(1, (data.quantity || 1) + val);
        setData('quantity', newQty);
    };

    const subtotal = (data.quantity || 0) * (Number(data.price) || 0);

    return (
        <>
            <Head title={`Edit Order Item: #${orderItem.id}`} />
            <div className="flex flex-col gap-8 p-6 mx-auto w-full max-w-4xl">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Order Items</h1>
                        <p className="text-muted-foreground text-sm">Update quantities or product selection for item #{orderItem.id}.</p>
                    </div>
                    <Button variant="outline" asChild className="gap-2 focus:ring-2 focus:ring-primary/20 bg-background/50 hover:bg-background transition-all">
                        <Link href={orderItems.index().url}>
                            <ArrowLeft className="size-4" />
                            Back to List
                        </Link>
                    </Button>
                </div>

                <Card className="shadow-xl border-muted-foreground/10 overflow-hidden bg-white/5 dark:bg-black/5 backdrop-blur-md">
                    <CardHeader className="bg-muted/10 pb-8 border-b border-muted/20">
                        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                            <PencilLine className="size-5 text-primary" />
                            Modify Item Details
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Carefully adjust the order association or product specifications.
                        </CardDescription>
                    </CardHeader>
                    
                    <form onSubmit={submit}>
                        <CardContent className="space-y-8 pt-8 px-8">
                            {/* Section: Order & Product Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="order_id" className="flex items-center gap-2 font-semibold text-sm">
                                        <Hash className="size-4 text-primary" />
                                        Target Order
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
                                                <div className="p-2 text-sm text-muted-foreground italic text-center">No active orders</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.order_id as string} />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="product_id" className="flex items-center gap-2 font-semibold text-sm">
                                        <Package className="size-4 text-primary" />
                                        Select Product
                                    </Label>
                                    <Select 
                                        value={data.product_id?.toString()} 
                                        onValueChange={(value) => setData('product_id', value)}
                                    >
                                        <SelectTrigger id="product_id" className="h-11 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40">
                                            <SelectValue placeholder="Select a product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.length > 0 ? (
                                                products.map((prod) => (
                                                    <SelectItem key={prod.id} value={prod.id.toString()}>
                                                        {prod.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-sm text-muted-foreground italic text-center">No products available</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.product_id as string} />
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            {/* Section: Quantity & Price */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                <div className="space-y-3">
                                    <Label htmlFor="quantity" className="flex items-center gap-2 font-semibold text-sm">
                                        <ShoppingCart className="size-4 text-primary" />
                                        Quantity
                                    </Label>
                                    <div className="flex items-center gap-3 bg-muted/20 p-1.5 rounded-lg border border-muted-foreground/10 group focus-within:border-primary/40 transition-colors">
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handleQuantityChange(-1)}
                                            className="h-10 w-10 shrink-0 hover:bg-background hover:text-primary transition-all active:scale-90"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', parseInt(e.target.value) || 1)}
                                            className="text-center font-bold text-xl border-0 shadow-none bg-transparent focus-visible:ring-0"
                                        />
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handleQuantityChange(1)}
                                            className="h-10 w-10 shrink-0 hover:bg-background hover:text-primary transition-all active:scale-90"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <InputError message={errors.quantity as string} />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="price" className="flex items-center gap-2 font-semibold text-sm">
                                        <Banknote className="size-4 text-primary" />
                                        Unit Price (Rp)
                                    </Label>
                                    <div className="relative group">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold group-focus-within:text-primary transition-colors">Rp</span>
                                        <Input
                                            id="price"
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="0"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value.replace(/\D/g, ''))}
                                            className="h-11 pl-10 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40 font-mono text-lg"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground italic h-4">
                                        {data.price && (
                                            <>
                                                <span className="font-medium text-primary">Formatted:</span>
                                                <span className="font-bold">Rp{Number(data.price).toLocaleString('id-ID')}</span>
                                            </>
                                        )}
                                    </div>
                                    <InputError message={errors.price as string} />
                                </div>
                            </div>

                            {/* Section: Summary Highlight */}
                            <div className="pt-2">
                                <div className="flex flex-col md:flex-row justify-between items-center bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl border border-primary/20 shadow-inner group">
                                    <div className="flex items-center gap-3 mb-4 md:mb-0">
                                        <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                            <Banknote className="size-6 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Adjusted Subtotal</span>
                                            <span className="text-sm font-semibold text-primary/80">Calculation: {data.quantity || 0} units × Rp{(Number(data.price) || 0).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-black text-primary tracking-tighter shadow-primary/10 drop-shadow-sm">
                                        Rp{subtotal.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <div className="px-8 pb-8 pt-4">
                            <Button 
                                type="submit" 
                                size="lg" 
                                className="w-full h-14 font-extrabold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all bg-primary hover:bg-primary/90 text-primary-foreground gap-3 text-lg" 
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <span className="size-5 animate-spin border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-5" />
                                        Save Changes
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
        { title: 'OrderItem', href: orderItems.index().url },
        { title: 'Edit', href: '#' },
    ],
};