import { CreateMLCEngine, InitProgressReport, MLCEngine } from "@mlc-ai/web-llm";

export const DEFAULT_MODEL = 'Phi-3-mini-4k-instruct-q4f16_1-MLC';

// Instancia global del motor en el worker
let engine: MLCEngine | null = null;

self.onmessage = async (event: MessageEvent) => {
  const { type, payload, id } = event.data;

  try {
    switch (type) {
      case 'INIT':
        if (!engine) {
          const initProgressCallback = (progress: InitProgressReport) => {
            // Enviamos el progreso al hilo principal
            // progress.progress es un valor entre 0 y 1
            self.postMessage({
              type: 'INIT_PROGRESS',
              id,
              payload: {
                progress: progress.progress,
                text: progress.text,
                timeElapsed: progress.timeElapsed
              }
            });
          };

          const selectedModel = payload?.model || DEFAULT_MODEL;

          // Inicializa el modelo y descarga los pesos (si no están en caché)
          engine = await CreateMLCEngine(
            selectedModel,
            { initProgressCallback }
          );
        }

        // Notificamos que la carga ha terminado exitosamente
        self.postMessage({
          type: 'INIT_COMPLETE',
          id,
          payload: { success: true }
        });
        break;

      case 'GENERATE':
        if (!engine) {
          throw new Error('El motor no está inicializado. Llama a "INIT" primero.');
        }

        const messages = payload?.messages;
        if (!messages || !Array.isArray(messages)) {
          throw new Error('Se requiere un array de mensajes.');
        }

        // Genera la respuesta del asistente
        const completion = await engine.chat.completions.create({
          messages,
        });

        // Devuelve el texto generado
        self.postMessage({
          type: 'GENERATE_RESULT',
          id,
          payload: { text: completion.choices[0].message.content }
        });
        break;

      default:
        console.warn(`Tipo de mensaje desconocido en el Worker: ${type}`);
        break;
    }
  } catch (error: unknown) {
    // Comunicar cualquier error al hilo principal
    self.postMessage({
      type: 'ERROR',
      id,
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
