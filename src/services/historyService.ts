export const getPlayedItems = (gameId: string): string[] => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(`edumate_history_${gameId}`);
    return saved ? JSON.parse(saved) : [];
};

export const markItemsAsPlayed = (gameId: string, items: string[]) => {
    if (typeof window === 'undefined') return;
    const current = getPlayedItems(gameId);
    const updated = Array.from(new Set([...current, ...items]));
    localStorage.setItem(`edumate_history_${gameId}`, JSON.stringify(updated));
};

export const clearHistory = (gameId: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`edumate_history_${gameId}`);
};

export const getRandomUnplayedItems = (gameId: string, allItems: string[], count: number): string[] => {
    let played = getPlayedItems(gameId);
    let available = allItems.filter(item => !played.includes(item));

    if (available.length < count) {
        clearHistory(gameId);
        played = [];
        available = [...allItems];
    }

    // Shuffle available items
    for (let i = available.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [available[i], available[j]] = [available[j], available[i]];
    }

    return available.slice(0, count);
};
