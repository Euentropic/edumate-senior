export interface CognitiveActivity {
    id: string;
    title: string;
    description: string;
    category: 'Memoria' | 'Cálculo' | 'Lectura' | 'Lógica' | 'Atención';
    iconName: string;
}

export const cognitiveActivities: CognitiveActivity[] = [
    {
        id: 'act-1',
        title: 'La Palabra Oculta',
        description: 'Adivina la palabra oculta a partir de su definición de diccionario y su letra inicial. ¡Un reto excelente para el vocabulario!',
        category: 'Memoria',
        iconName: 'Brain'
    },
    {
        id: 'act-2',
        title: 'Anagramas',
        description: 'Descifra la palabra original a partir de 7 letras desordenadas. Pon a prueba tu agilidad mental y visión espacial.',
        category: 'Lógica',
        iconName: 'Puzzle'
    },
    {
        id: 'act-3',
        title: 'Cálculo Encadenado',
        description: 'Mantén el hilo de las operaciones matemáticas en tu cabeza. 3 operaciones encadenadas sin papel ni boli. ¿Aceptas el reto?',
        category: 'Cálculo',
        iconName: 'Calculator'
    }
];

export const getRandomActivity = (): CognitiveActivity => {
    return cognitiveActivities[Math.floor(Math.random() * cognitiveActivities.length)];
};
