import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Используем твою уже настроенную переменную
        const n8nUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

        if (!n8nUrl) {
            return NextResponse.json({ error: 'N8N Webhook URL not configured' }, { status: 500 });
        }

        console.log('Proxying request to n8n:', n8nUrl);

        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        // n8n может вернуть ошибку, прокидываем её статус
        if (!response.ok) {
            const errorText = await response.text();
            console.error('n8n error response:', errorText);
            return NextResponse.json({ error: `n8n responded with ${response.status}: ${errorText}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Proxy error trace:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
