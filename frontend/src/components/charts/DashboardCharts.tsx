import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from "recharts";
import { revenueData, salesTrendData, inventoryData, customerRetentionData } from "@/data/mock-data";

// Premium dark mode tooltip styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-xl text-xs">
        <p className="font-semibold text-muted-foreground uppercase mb-1.5">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-4 justify-between font-medium text-foreground py-0.5">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <span>{typeof item.value === "number" && item.value > 1000 ? `$${item.value.toLocaleString()}` : item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── REVENUE & ORDERS CHART ───
export function RevenueChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={revenueData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.01}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            name="Revenue"
            stroke="var(--color-primary)" 
            strokeWidth={1.5}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── INVENTORY VS DEMAND CHART ───
export function InventoryChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={inventoryData.slice(0, 6)}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="stock" name="Current Stock" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.8} />
          <Bar dataKey="demand" name="Predicted Demand" fill="#a855f7" radius={[4, 4, 0, 0]} opacity={0.8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── RETENTION & CHURN TREND ───
export function CustomerRetentionChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={customerRetentionData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Line 
            type="monotone" 
            dataKey="newCustomers" 
            name="New Customers" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="returning" 
            name="Returning Customers" 
            stroke="#6366f1" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
