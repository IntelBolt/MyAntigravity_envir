import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const revalidate = 0;

const DEFAULT_CLIENT_ID = 10234;

async function getExchangeRates() {
    try {
        // Fetching rates with KZT as base
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/KZT');
        if (!response.ok) throw new Error('Failed to fetch rates');
        const data = await response.json();
        return data.rates;
    } catch (err) {
        console.error('Exchange Rate Error:', err);
        // Fallback rates if API is down
        return {
            "KZT": 1,
            "USD": 0.0022,
            "RUB": 0.20,
            "CNY": 0.016
        };
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const clientIdParam = searchParams.get('clientId');
    const platformFilter = searchParams.get('platform');
    const clientId = clientIdParam ? parseInt(clientIdParam) : DEFAULT_CLIENT_ID;

    try {
        const rates = await getExchangeRates();

        // Helper to convert to KZT
        const toKZT = (amount: number, currency: string) => {
            if (!currency || currency === 'KZT') return amount;
            const rate = rates[currency.toUpperCase()];
            if (!rate) return amount; // Fallback if rate not found
            return amount / rate;
        };

        // 1. Fetch all orders for calculations
        let sql = `SELECT * FROM sales_data WHERE client_id = $1`;
        let params: any[] = [clientId];

        if (platformFilter && platformFilter !== 'all') {
            sql += ` AND source = $2`;
            params.push(platformFilter);
        }

        const allOrdersRes = await query(sql, params);
        const allOrders = allOrdersRes.rows;

        // 2. Calculations in KZT
        let totalRevenueKZT = 0;
        const platformMap: Record<string, { orders: number, revenue: number }> = {};
        const dailyTrend: Record<string, { revenue: number, orders: number }> = {};

        allOrders.forEach(order => {
            const price = parseFloat(order.total_price);
            const kztPrice = toKZT(price, order.currency);

            totalRevenueKZT += kztPrice;

            // Platform breakdown
            if (!platformMap[order.source]) platformMap[order.source] = { orders: 0, revenue: 0 };
            platformMap[order.source].orders += 1;
            platformMap[order.source].revenue += kztPrice;

            // Daily trend
            const date = new Date(order.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
            if (!dailyTrend[date]) dailyTrend[date] = { revenue: 0, orders: 0 };
            dailyTrend[date].revenue += kztPrice;
            dailyTrend[date].orders += 1;
        });

        const totalOrders = allOrders.length;
        const avgOrderValueKZT = totalOrders > 0 ? totalRevenueKZT / totalOrders : 0;
        const connectedPlatforms = new Set(allOrders.map(o => o.source)).size;

        // 3. Platform breakdown array
        const platformBreakdown = Object.entries(platformMap).map(([name, stats]) => ({
            name,
            orders: stats.orders,
            revenue: stats.revenue // in KZT
        })).sort((a, b) => b.revenue - a.revenue);

        // 4. Sales Trend array
        const salesTrend = Object.entries(dailyTrend).map(([name, stats]) => ({
            name,
            revenue: stats.revenue,
            orders: stats.orders
        })).sort((a, b) => {
            const [d1, m1] = a.name.split('.').map(Number);
            const [d2, m2] = b.name.split('.').map(Number);
            return (m1 - m2) || (d1 - d2);
        });

        // 5. Latest Orders (Original currency)
        const latestOrders = allOrders
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 10);

        // 6. Get all available platforms for filter
        const platformsRes = await query(`SELECT DISTINCT source FROM sales_data WHERE client_id = $1`, [clientId]);
        const availablePlatforms = platformsRes.rows.map(r => r.source);

        return NextResponse.json({
            summary: [
                { title: "Total Revenue", value: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(totalRevenueKZT), change: "+8.4%", trend: "up" },
                { title: "Total Orders", value: totalOrders.toString(), change: "+12.1%", trend: "up" },
                { title: "AOV (Avg Check)", value: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(avgOrderValueKZT), change: "-2.3%", trend: "down" },
                { title: "Active Shops", value: connectedPlatforms.toString(), change: "Live now", trend: "neutral" }
            ],
            totalRevenueRaw: totalRevenueKZT,
            platformBreakdown,
            salesTrend,
            latestOrders,
            availablePlatforms,
            baseCurrency: 'KZT'
        });

    } catch (error: any) {
        console.error('Marketplaces API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
