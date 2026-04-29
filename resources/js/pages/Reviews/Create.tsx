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
import reviews from '@/routes/reviews';
import { 
    PlusCircle, 
    ArrowLeft, 
    Package, 
    User, 
    Star, 
    Calendar, 
    MessageSquare,
    Save
} from 'lucide-react';

interface Option {
    id: number;
    name: string;
}

export default function Create({ products }: { products: Option[] }) {
    const { data, setData, post, processing, errors } = useForm<Record<string, any>>({
        product_id: '',
        name: '',
        rating: '',
        date: '',
        comment: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(reviews.store().url);
    };

    return (
        <>
            <Head title="Create New Review" />
            <div className="flex flex-col gap-8 p-6 mx-auto w-full max-w-3xl">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Product Reviews</h1>
                        <p className="text-muted-foreground text-sm">Collect and manage feedback from your customers.</p>
                    </div>
                    <Button variant="outline" asChild className="gap-2 focus:ring-2 focus:ring-primary/20">
                        <Link href={reviews.index().url}>
                            <ArrowLeft className="size-4" />
                            Back to List
                        </Link>
                    </Button>
                </div>

                <Card className="shadow-xl border-muted-foreground/10 overflow-hidden bg-card/50 backdrop-blur-sm">
                    <CardHeader className="bg-muted/10 pb-8 border-b border-muted">
                        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                            <PlusCircle className="size-5 text-primary" />
                            Post New Review
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Share experience and rating for a specific product.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-8 pt-8 px-8">
                            {/* Product Selection */}
                            <div className="space-y-3">
                                <Label htmlFor="product_id" className="flex items-center gap-2 font-semibold">
                                    <Package className="size-4 text-primary" />
                                    Select Product
                                </Label>
                                <Select 
                                    value={data.product_id?.toString()} 
                                    onValueChange={(value) => setData('product_id', value)}
                                >
                                    <SelectTrigger id="product_id" className="w-full bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40 h-11">
                                        <SelectValue placeholder="Choose a product to review" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product.id} value={product.id.toString()}>
                                                {product.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.product_id as string} />
                            </div>

                            {/* Reviewer Name */}
                            <div className="space-y-3">
                                <Label htmlFor="name" className="flex items-center gap-2 font-semibold">
                                    <User className="size-4 text-primary" />
                                    Reviewer Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Enter customer name (e.g., Jane Smith)"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="h-11 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40"
                                />
                                <InputError message={errors.name as string} />
                            </div>

                            {/* Rating & Date Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="rating" className="flex items-center gap-2 font-semibold">
                                        <Star className="size-4 text-yellow-500 fill-yellow-500" />
                                        Rating (1.0 - 5.0)
                                    </Label>
                                    <Input
                                        id="rating"
                                        type="number"
                                        min="1"
                                        max="5"
                                        step="0.1"
                                        placeholder="5.0"
                                        value={data.rating}
                                        onChange={(e) => setData('rating', e.target.value)}
                                        className="h-11 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40 font-mono"
                                    />
                                    <InputError message={errors.rating as string} />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="date" className="flex items-center gap-2 font-semibold">
                                        <Calendar className="size-4 text-primary" />
                                        Date & Time
                                    </Label>
                                    <Input
                                        id="date"
                                        type="datetime-local"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="h-11 bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40"
                                    />
                                    <InputError message={errors.date as string} />
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="space-y-3">
                                <Label htmlFor="comment" className="flex items-center gap-2 font-semibold">
                                    <MessageSquare className="size-4 text-primary" />
                                    Review Comment
                                </Label>
                                <Textarea
                                    id="comment"
                                    placeholder="Share the feedback details here..."
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    className="min-h-[150px] bg-background/50 focus:bg-background transition-all border-muted-foreground/20 hover:border-primary/40 resize-none py-3"
                                />
                                <p className="text-[11px] text-muted-foreground italic">Be as detailed as possible to help other customers.</p>
                                <InputError message={errors.comment as string} />
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
                                        Posting Review...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-5" />
                                        Create Review
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
        { title: 'Review', href: reviews.index().url },
        { title: 'Create', href: reviews.create().url },
    ],
};