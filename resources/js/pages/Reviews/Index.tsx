import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import reviews from '@/routes/reviews';
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
    const items = props['reviews']?.data || props['reviews'] || [];

    const handleDelete = (id: number) => {
        destroy(reviews.destroy(id).url);
    };

    return (
        <>
            <Head title="Review List" />
            <div className="flex flex-col gap-4 p-4 h-full flex-1">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Review</h1>
                    <Button asChild>
                        <Link href={reviews.create().url}>Create Review</Link>
                    </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Reviewer</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">No data found</TableCell>
                                </TableRow>
                            ) : items.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.rating}</TableCell>
                                    <TableCell className="max-w-xs truncate">{item.comment}</TableCell>
                                    <TableCell>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</TableCell>
                                    <TableCell className="text-right space-x-2 flex justify-end">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={reviews.edit(item.id).url}>Edit</Link>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the Review.
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
        { title: 'Review', href: reviews.index().url },
    ],
};