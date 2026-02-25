import { aiService } from './aiService';
import { PASAPALABRA_BANK, PasapalabraItem } from '../data/pasapalabraBank';

export async function getPasapalabraTurn(letterItem: Pick<PasapalabraItem, 'letter' | 'type'>): Promise<PasapalabraItem> {
    try {
        const typeInstruction = letterItem.type === 'Empieza por'
            ? `La palabra debe EMPEZAR por la letra ${letterItem.letter}.`
            : `La palabra debe CONTENER la letra ${letterItem.letter}.`;

        const prompt = `Eres un generador de datos para un juego. Devuelve ÚNICAMENTE un objeto JSON válido con este formato exacto: {"word": "PALABRA", "definition": "Definición breve"}. ${typeInstruction} No añadas ningún texto antes ni después del JSON. Usa español.`;

        const response = await aiService.generate([{ role: 'system', content: prompt }]);

        const cleanResponse = response.trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(cleanResponse);

        if (!parsed || !parsed.word || !parsed.definition) {
            throw new Error(`Invalid JSON structure: ${cleanResponse}`);
        }

        const word = parsed.word.toUpperCase();

        // Verify constraint
        if (letterItem.type === 'Empieza por' && !word.startsWith(letterItem.letter.toUpperCase())) {
            throw new Error(`Word ${word} does not start with ${letterItem.letter}`);
        }

        if (letterItem.type === 'Contiene' && !word.includes(letterItem.letter.toUpperCase())) {
            throw new Error(`Word ${word} does not contain ${letterItem.letter}`);
        }

        return {
            letter: letterItem.letter,
            type: letterItem.type,
            word: word,
            definition: parsed.definition
        };

    } catch (error) {
        console.warn(`AI Pasapalabra generation failed for letter ${letterItem.letter}. Falling back to local bank.`, error);

        const fallback = PASAPALABRA_BANK.find(item => item.letter === letterItem.letter);
        if (fallback) return fallback;

        // Ultimate fallback if letter not found
        return {
            letter: letterItem.letter,
            type: 'Empieza por',
            word: letterItem.letter,
            definition: 'Error de red. Escribe esta misma letra para avanzar.'
        };
    }
}
