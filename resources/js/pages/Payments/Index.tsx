import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import payments from '@/routes/payments';
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
    const items = props['payments']?.data || props['payments'] || [];

    const getPaymentMethodLabel = (item: any) => {
        const method = (item.payment_method || "").toUpperCase();
        const channel = (item.payment_channel || "").toUpperCase();
        
        if (method.includes("VIRTUAL_ACCOUNT") || method.includes("BANK_TRANSFER") || channel.includes("VIRTUAL_ACCOUNT")) return "Transfer Bank / Virtual Account";
        if (method.includes("EWALLET") || channel.includes("EWALLET")) return "E-Wallet";
        if (method === "QR_CODE" || method === "QRIS" || channel === "QR_CODE" || channel === "QRIS") return "QRIS";
        if (method.includes("CARD") || channel.includes("CARD")) return "Credit Card/Debit";
        if (method.includes("DIRECT_DEBIT") || channel.includes("DIRECT_DEBIT")) return "Direct Debit";
        
        return method || channel || "Menunggu pilihan di Xendit";
    };

    const getStatusLabel = (status: string) => {
        const s = (status || "").toUpperCase();
        if (s === 'PAID' || s === 'SETTLED' || s === 'SUCCESS') return 'Paid';
        if (s === 'PENDING') return 'Pending';
        if (s === 'EXPIRED') return 'Expired';
        if (s === 'FAILED') return 'Failed';
        if (s === 'CANCELED' || s === 'CANCELLED') return 'Canceled';
        return status ? (status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()) : 'Pending';
    };

    const getStatusColorClass = (status: string) => {
        const s = (status || "").toUpperCase();
        if (s === 'PAID' || s === 'SETTLED' || s === 'SUCCESS') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (s === 'PENDING') return 'bg-amber-100 text-amber-700 border-amber-200';
        if (s === 'EXPIRED') return 'bg-orange-100 text-orange-700 border-orange-200';
        return 'bg-rose-100 text-rose-700 border-rose-200';
    };

    const handleDelete = (id: number) => {
        destroy(payments.destroy(id).url);
    };

    return (
        <>
            <Head title="Payment Management" />
            <div className="flex flex-col gap-4 p-4 h-full flex-1">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold font-display">Payments</h1>
                    <Button asChild>
                        <Link href={payments.create().url}>Create Payment</Link>
                    </Button>
                </div>
                
                <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>External ID / Order</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Method (Channel)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment Date</TableHead>
                                <TableHead className="text-right px-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-medium">No transactions found</TableCell>
                                </TableRow>
                            ) : items.map((item: any) => (
                                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-mono text-xs">
                                        <div className="font-bold text-foreground text-sm">{item.external_id}</div>
                                        <div className="text-muted-foreground">Order ID: {item.order_id}</div>
                                    </TableCell>
                                    <TableCell className="font-bold">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.amount)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-sm">{getPaymentMethodLabel(item)}</div>
                                        {item.payment_channel && (
                                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.payment_channel}</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColorClass(item.status)}`}>
                                            {getStatusLabel(item.status)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {item.payment_date ? new Date(item.payment_date).toLocaleString('id-ID') : '-'}
                                    </TableCell>
                                    <TableCell className="text-right px-6">
                                        <div className="flex justify-end items-center gap-2">
                                            <Button variant="outline" size="sm" asChild className="h-8">
                                                <Link href={payments.edit(item.id).url}>Edit</Link>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50">Delete</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Payment Record?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently remove the record for {item.external_id}. This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-rose-600 hover:bg-rose-700">Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
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
        { title: 'Payment', href: payments.index().url },
    ],
};