import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { router } from '@inertiajs/react';

export default function Index({ articles }: any) {
    const items = articles?.data || articles || [];

    const handleDelete = (id: number) => {
        router.delete(`/articles/${id}`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <Badge className="bg-green-500">Published</Badge>;
            case 'draft':
                return <Badge variant="outline">Draft</Badge>;
            case 'archived':
                return <Badge variant="secondary">Archived</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Articles" />
            <div className="flex flex-col gap-4 p-4 h-full flex-1">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Articles</h1>
                    <Button asChild>
                        <Link href="/articles/create">Create Article</Link>
                    </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead className="w-[80px]">Thumbnail</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Tag</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No articles found.</TableCell>
                                </TableRow>
                            ) : items.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>
                                        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted border">
                                            {item.thumbnail ? (
                                                <img 
                                                    src={`/storage/${item.thumbnail}`} 
                                                    alt={item.title} 
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground bg-muted">No IMG</div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>{item.user?.name || 'Unknown'}</TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium px-2 py-1 bg-muted rounded-md border text-muted-foreground">
                                            {item.category?.name || '-'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {item.tags && item.tags.length > 0 ? (
                                                item.tags.map((tag: any) => (
                                                    <Badge key={tag.id} variant="secondary" className="text-[10px] px-1.5 py-0 leading-tight">
                                                        {tag.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground text-xs font-mono">-</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                    <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/articles/${item.id}/edit`}>Edit</Link>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete the article "{item.title}".
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

Index.layout = (page: any) => {
    // Standard layout pattern
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Articles', href: '/articles' },
    ];
    // Assuming you have a way to wrap layouts; Products/Index used a static property
    // I will follow the Products/Index pattern exactly.
    return page;
};

// Re-applying the static layout property as seen in Products/Index
(Index as any).layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Articles', href: '/articles' },
    ],
};
