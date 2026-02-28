/**
 * Normalizes a Spanish word by converting it to lowercase and removing accents and diacritics
 * from vowels (á -> a, é -> e, í -> i, ó -> o, ú -> u, ü -> u).
 * Importantly, it preserves the 'ñ' character.
 * 
 * @param word - The word to be normalized.
 * @returns The normalized word.
 */
export function normalizeSpanishWord(word: string): string {
    if (!word) return '';
    return word.toLowerCase()
        .replace(/[áäâà]/g, 'a')
        .replace(/[éëêè]/g, 'e')
        .replace(/[íïîì]/g, 'i')
        .replace(/[óöôò]/g, 'o')
        .replace(/[úüûù]/g, 'u');
}
