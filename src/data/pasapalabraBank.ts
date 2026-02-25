export type PasapalabraItem = {
    letter: string;
    type: 'Empieza por' | 'Contiene';
    word: string;
    definition: string;
};

export const PASAPALABRA_BANK: PasapalabraItem[] = [
    { letter: 'A', type: 'Empieza por', word: 'ARBOL', definition: 'Planta de tronco de madera grueso y elevado que se ramifica a cierta altura del suelo.' },
    { letter: 'B', type: 'Empieza por', word: 'BARCO', definition: 'Vehículo flotante que se utiliza para transportarse por el agua.' },
    { letter: 'C', type: 'Empieza por', word: 'CASA', definition: 'Edificio o parte de él para vivir.' },
    { letter: 'D', type: 'Empieza por', word: 'DEDO', definition: 'Cada una de las partes en las que terminan las manos y los pies.' },
    { letter: 'E', type: 'Empieza por', word: 'ESPEJO', definition: 'Superficie de cristal, cubierta en su cara posterior por una capa de mercurio o estaño, en la que se reflejan los objetos.' },
    { letter: 'F', type: 'Empieza por', word: 'FUEGO', definition: 'Calor y luz producidos por la combustión.' },
    { letter: 'G', type: 'Empieza por', word: 'GATO', definition: 'Mamífero felino de tamaño generalmente pequeño, cuerpo flexible y ágil, que se tiene como animal de compañía.' },
    { letter: 'H', type: 'Empieza por', word: 'HIELO', definition: 'Agua convertida en cuerpo sólido y cristalino por un descenso de la temperatura.' },
    { letter: 'I', type: 'Empieza por', word: 'ISLA', definition: 'Porción de tierra rodeada de agua por todas partes.' },
    { letter: 'J', type: 'Empieza por', word: 'JABON', definition: 'Producto que sirve para lavar y que se obtiene de la mezcla de un álcali con ácidos o cuerpos grasos.' },
    { letter: 'L', type: 'Empieza por', word: 'LUNA', definition: 'Satélite natural de la Tierra.' },
    { letter: 'M', type: 'Empieza por', word: 'MESA', definition: 'Mueble formado por un tablero horizontal, sostenido por uno o varios pies.' },
    { letter: 'N', type: 'Empieza por', word: 'NUBE', definition: 'Masa de vapor de agua suspendida en la atmósfera.' },
    { letter: 'Ñ', type: 'Contiene', word: 'UÑA', definition: 'Capa córnea que cubre el extremo de los dedos.' },
    { letter: 'O', type: 'Empieza por', word: 'OJO', definition: 'Órgano de la visión.' },
    { letter: 'P', type: 'Empieza por', word: 'PERRO', definition: 'Mamífero doméstico de la familia de los cánidos.' },
    { letter: 'Q', type: 'Empieza por', word: 'QUESO', definition: 'Alimento sólido que se obtiene por maduración de la cuajada de la leche.' },
    { letter: 'R', type: 'Empieza por', word: 'RELOJ', definition: 'Instrumento para medir el tiempo.' },
    { letter: 'S', type: 'Empieza por', word: 'SOL', definition: 'Estrella luminosa centro de nuestro sistema planetario.' },
    { letter: 'T', type: 'Empieza por', word: 'TAZA', definition: 'Recipiente pequeño provisto de un asa para tomar líquidos.' },
    { letter: 'U', type: 'Empieza por', word: 'UVA', definition: 'Fruto de la vid.' },
    { letter: 'V', type: 'Empieza por', word: 'VENTANA', definition: 'Abertura en una pared o muro donde se coloca para dar luz y ventilación.' },
    { letter: 'X', type: 'Contiene', word: 'TAXI', definition: 'Vehículo de alquiler con conductor que transporta pasajeros a cambio de una tarifa.' },
    { letter: 'Y', type: 'Empieza por', word: 'YATE', definition: 'Embarcación de vela o de motor, destinada a regatas o al recreo.' },
    { letter: 'Z', type: 'Empieza por', word: 'ZAPATO', definition: 'Calzado que no pasa del tobillo.' },
];
