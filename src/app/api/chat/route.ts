import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Se requiere un array de mensajes' }, { status: 400 });
        }

        const groqApiKey = process.env.GROQ_API_KEY;

        console.log('--- NUEVA PETICIÓN A GROQ ---');
        console.log('1. GROQ_API_KEY (primeros caracteres):', groqApiKey ? `${groqApiKey.substring(0, 5)}...` : 'UNDEFINED / VACÍA');
        console.log('2. Mensajes recibidos en el backend:', JSON.stringify(messages, null, 2));

        if (!groqApiKey) {
            console.error('GROQ_API_KEY no está configurada en las variables de entorno');
            return NextResponse.json({ error: 'Configuración de servidor incompleta' }, { status: 500 });
        }

        const payload = {
            model: 'llama-3.1-8b-instant',
            messages: messages,
            temperature: 0.7,
        };
        console.log('3. Payload enviado a Groq:', JSON.stringify(payload, null, 2));

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error de la API de Groq: ${response.status} - ${errorText}`);
            return NextResponse.json({ error: 'Error comunicándose con el servicio de IA' }, { status: response.status });
        }

        const data = await response.json();
        const generatedText = data.choices?.[0]?.message?.content || '';

        return NextResponse.json({ text: generatedText });
    } catch (error) {
        console.error('Error en el endpoint de chat:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
