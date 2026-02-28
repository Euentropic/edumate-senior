import { aiService } from './aiService';
import { WORDS } from '../data/wordBank';
import { normalizeSpanishWord } from '../utils/textUtils';

const PLAYED_WORDS_KEY = 'edumate_played_words';
const MAX_HISTORY = 500;

export function getPlayedWordsHistory(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(PLAYED_WORDS_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error('Error reading played words', e);
    }
    return [];
}

export function addPlayedWordToHistory(word: string) {
    if (typeof window === 'undefined' || !word) return;
    let played = getPlayedWordsHistory();
    const normalized = normalizeSpanishWord(word).toUpperCase();

    if (!played.includes(normalized)) {
        played.push(normalized);
    }

    const available = WORDS.filter(w => !played.includes(w));
    if (available.length === 0 || played.length >= MAX_HISTORY) {
        played = []; // Reset if exhausted or too big
    }

    try {
        localStorage.setItem(PLAYED_WORDS_KEY, JSON.stringify(played));
    } catch (e) {
        console.error('Error saving played words', e);
    }
}

export async function getDynamicWord(playedWords: string[]): Promise<string> {
    try {
        const prompt = 'Eres un generador de palabras. Devuelve ÚNICAMENTE UNA palabra en español de entre 5 y 10 letras. SIN puntos, SIN espacios, SIN emojis, SIN explicaciones. Solo la palabra pura.';

        const response = await aiService.generate([{ role: 'system', content: prompt }]);

        let word = response.trim().toUpperCase();
        word = normalizeSpanishWord(word).toUpperCase();

        // Sanity Filter (Regex) - Note: standard A-Z includes Ñ
        const regex = /^[A-ZÑ]{5,12}$/i;
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
