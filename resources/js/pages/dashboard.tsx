import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import { 
    Package, 
    ShoppingCart, 
    Users, 
    DollarSign, 
    TrendingUp, 
    UserPlus, 
    ShoppingBag, 
    Star,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { format } from 'date-fns';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    iconColor: string;
    bgColor: string;
}

const StatCard = ({ title, value, icon: Icon, description, trend, iconColor, bgColor }: StatCardProps) => (
    <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md dark:bg-zinc-900/50">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground text-sm font-medium">{title}</p>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight">{value}</h3>
                </div>
                <div className={`rounded-xl ${bgColor} p-3`}>
                    <Icon className={`size-6 ${iconColor}`} />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-1">
                {trend && (
                    <span className={`flex items-center text-xs font-medium ${trend.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trend.isPositive ? <ArrowUpRight className="mr-0.5 size-3" /> : <ArrowDownRight className="mr-0.5 size-3" />}
                        {trend.value}
                    </span>
                )}
                <span className="text-muted-foreground text-xs">{description}</span>
            </div>
        </CardContent>
    </Card>
);

interface DashboardProps {
    stats: {
        totalProducts: number;
        totalOrders: number;
        totalCustomers: number;
        totalRevenue: string | number;
    };
    salesData: any[];
    recentOrders: any[];
    recentActivities: any[];
}

export default function Dashboard({ stats, salesData, recentOrders, recentActivities }: DashboardProps) {
    // Format currency
    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(value));
    };

    // Format chart date
    const chartData = salesData.map(item => ({
        ...item,
        formattedDate: format(new Date(item.date), 'MMM dd'),
    }));

    const iconMap: Record<string, React.ElementType> = {
        UserPlus: UserPlus,
        ShoppingBag: ShoppingBag,
        Star: Star,
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header Section */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your store today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        title="Total Revenue"
                        value={formatCurrency(stats.totalRevenue)}
                        icon={DollarSign}
                        description="from last month"
                        trend={{ value: '12.5%', isPositive: true }}
                        iconColor="text-emerald-600 dark:text-emerald-400"
                        bgColor="bg-emerald-100 dark:bg-emerald-950/50"
                    />
                    <StatCard 
                        title="Total Orders"
                        value={stats.totalOrders}
                        icon={ShoppingCart}
                        description="completed orders"
                        trend={{ value: '8.2%', isPositive: true }}
                        iconColor="text-blue-600 dark:text-blue-400"
                        bgColor="bg-blue-100 dark:bg-blue-950/50"
                    />
                    <StatCard 
                        title="Total Customers"
                        value={stats.totalCustomers}
                        icon={Users}
                        description="registered users"
                        trend={{ value: '3.1%', isPositive: true }}
                        iconColor="text-violet-600 dark:text-violet-400"
                        bgColor="bg-violet-100 dark:bg-violet-950/50"
                    />
                    <StatCard 
                        title="Total Products"
                        value={stats.totalProducts}
                        icon={Package}
                        description="items in catalog"
                        iconColor="text-orange-600 dark:text-orange-400"
                        bgColor="bg-orange-100 dark:bg-orange-950/50"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-7">
                    {/* Sales Chart */}
                    <Card className="overflow-hidden border-none shadow-sm lg:col-span-4 dark:bg-zinc-900/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-8">
                            <div>
                                <CardTitle className="text-xl">Revenue Growth</CardTitle>
                                <CardDescription>Sales activity for the last 30 days</CardDescription>
                            </div>
                            <div className="bg-muted flex items-center gap-1 rounded-lg p-1">
                                <TrendingUp className="text-emerald-500 ml-1 size-4" />
                                <span className="text-xs font-medium pr-1">+24% this week</span>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[350px] w-full pl-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-primary, #3b82f6)" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="var(--color-primary, #3b82f6)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis 
                                        dataKey="formattedDate" 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#888888', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#888888', fontSize: 12 }}
                                        tickFormatter={(value) => `Rp${value / 1000}k`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(24, 24, 27, 0.95)', 
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            color: '#fff'
                                        }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card className="overflow-hidden border-none shadow-sm lg:col-span-3 dark:bg-zinc-900/50">
                        <CardHeader>
                            <CardTitle className="text-xl">Latest Activity</CardTitle>
                            <CardDescription>Real-time updates from your store</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {recentActivities.map((activity) => {
                                    const Icon = iconMap[activity.icon] || Star;
                                    const colorMap: Record<string, string> = {
                                        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
                                        green: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
                                        yellow: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
                                    };

                                    return (
                                        <div key={activity.id} className="flex gap-4">
                                            <div className={`mt-1 flex size-10 shrink-0 items-center justify-center rounded-full ${colorMap[activity.color] || colorMap.blue}`}>
                                                <Icon className="size-5" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold">{activity.title}</p>
                                                    <span className="text-muted-foreground text-xs">{activity.time}</span>
                                                </div>
                                                <p className="text-muted-foreground text-sm line-clamp-1">
                                                    {activity.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders Table */}
                <Card className="overflow-hidden border-none shadow-sm dark:bg-zinc-900/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Recent Orders</CardTitle>
                            <CardDescription>A summary of the most recent customer purchases</CardDescription>
                        </div>
                        <Badge variant="outline" className="h-6 gap-1 font-normal">
                            Last 5 orders
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="pl-6 w-[150px]">Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead className="pr-6 text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-muted/10">
                                        <TableCell className="pl-6 font-medium">#{order.order_number.split('-')[1]}</TableCell>
                                        <TableCell>{order.customer}</TableCell>
                                        <TableCell className="font-semibold">{formatCurrency(order.total_amount)}</TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant={
                                                    order.status === 'completed' ? 'default' : 
                                                    order.status === 'canceled' ? 'destructive' : 'secondary'
                                                }
                                                className="capitalize shadow-none"
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={`size-2 rounded-full ${order.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                <span className="text-muted-foreground text-sm capitalize">{order.payment_status}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-6 text-right text-sm text-muted-foreground">{order.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
