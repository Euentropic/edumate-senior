import { aiService } from './aiService';
import { WORDS } from '../data/wordBank';

export async function getDynamicWord(playedWords: string[]): Promise<string> {
    try {
        const prompt = 'Eres un generador de palabras. Devuelve ÚNICAMENTE UNA palabra en español de entre 5 y 10 letras. SIN puntos, SIN espacios, SIN emojis, SIN explicaciones. Solo la palabra pura.';

        const response = await aiService.generate([{ role: 'system', content: prompt }]);

        let word = response.trim().toUpperCase();

        // Remove accents to simplify game rules later, or keep them if standard play allows? 
        // Hangman typically uses base letters. The prompt says "with Ñ and tildes" ok stringently

        // Sanity Filter (Regex)
        const regex = /^[A-ZÁÉÍÓÚÑ]{5,12}$/i;
        if (!regex.test(word)) {
            throw new Error(`Invalid format or length: ${word}`);
        }

        // Ensure not played
        if (playedWords.includes(word)) {
            throw new Error(`Already played: ${word}`);
        }

        return word;
    } catch (error) {
        console.warn('AI word generation failed or rejected. Falling back to local bank.', error);

        let availableWords = WORDS.filter(w => !playedWords.includes(w));

        // If all words are played, reset local pool
        if (availableWords.length === 0) {
            availableWords = [...WORDS];
        }

        const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        return randomWord;
    }
}
