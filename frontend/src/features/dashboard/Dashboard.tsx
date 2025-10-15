import { useMemo } from 'react';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardProps } from '../../types';


export function Dashboard({ users }: DashboardProps) {
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === 'ACTIVE').length;
    const inactive = users.filter((u) => u.status === 'INACTIVE').length;
    const admins = users.filter((u) => u.role === 'ADMIN').length;
    const verified = users.filter((u) => u.isVerified !== false).length;

    return { total, active, inactive, admins, verified };
  }, [users]);

  // Calculate users created per day (last 7 days)
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    return last7Days.map((date) => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = users.filter((user) => {
        const createdDate = new Date(user.createdAt);
        return createdDate >= date && createdDate < nextDay;
      }).length;

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: count,
      };
    });
  }, [users]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold">{stats.total}</h1>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? ((stats.active / stats.total) * 100).toFixed(1)
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? ((stats.inactive / stats.total) * 100).toFixed(1)
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? ((stats.admins / stats.total) * 100).toFixed(1)
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Users created in the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={30}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="users"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name="Users Created"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
