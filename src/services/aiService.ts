// src/services/aiService.ts

export type ProgressReport = {
    progress: number;
    text: string;
    timeElapsed: number;
};

class AIService {
    // Ya no usamos el WebWorker para inferencia local pesada, pasamos a API backend
    /* 
    private worker: Worker | null = null;
    ...
    */

    // Inicializa el modelo, mandando callbacks de progreso
    public async initModel(model: string = 'llama-3.1-8b-instant', onProgress?: (report: ProgressReport) => void): Promise<{ success: boolean }> {
        // Simulamos una carga instantánea o muy rápida para mantener la UI
        if (onProgress) {
            onProgress({ progress: 0.5, text: 'Conectando con la nube...', timeElapsed: 0 });
            await new Promise(resolve => setTimeout(resolve, 300));
            onProgress({ progress: 1.0, text: '¡Tutor nube listo!', timeElapsed: 0.3 });
        }
        return { success: true };
    }

    // Genera una respuesta a partir de un historial de mensajes vía /api/chat
    public async generate(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]): Promise<string> {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages }),
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (e) { /* ignore json parse error */ }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data.text;
        } catch (error) {
            console.error('Error en AIService.generate:', error);
            throw error;
        }
    }
}

// Exportar como Singleton
export const aiService = new AIService();
