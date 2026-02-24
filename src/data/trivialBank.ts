export interface TrivialQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
}

export const TRIVIAL_QUESTIONS: TrivialQuestion[] = [
    // Historia
    { id: 1, question: '¿En qué año descubrió Cristóbal Colón América?', options: ['1492', '1592', '1402', '1482'], correctAnswer: '1492' },
    { id: 2, question: '¿Qué famosa reina de España patrocinó el viaje de Colón?', options: ['Isabel la Católica', 'Juana la Loca', 'María de las Mercedes', 'Isabel II'], correctAnswer: 'Isabel la Católica' },
    { id: 3, question: '¿Qué civilización construyó Machu Picchu?', options: ['Los Incas', 'Los Mayas', 'Los Aztecas', 'Los Romanos'], correctAnswer: 'Los Incas' },
    { id: 4, question: '¿Quién fue el primer presidente de los Estados Unidos?', options: ['George Washington', 'Abraham Lincoln', 'Thomas Jefferson', 'John Adams'], correctAnswer: 'George Washington' },
    { id: 5, question: '¿En qué ciudad cayó el famoso Muro en 1989?', options: ['Berlín', 'Moscú', 'Varsovia', 'París'], correctAnswer: 'Berlín' },
    { id: 6, question: '¿Qué imperio gobernó gran parte de Europa en la antigüedad con capital en Roma?', options: ['Imperio Romano', 'Imperio Otomano', 'Imperio Persa', 'Imperio Griego'], correctAnswer: 'Imperio Romano' },
    { id: 7, question: '¿Qué líder hindú luchó por la independencia de la India de forma pacífica?', options: ['Mahatma Gandhi', 'Nelson Mandela', 'Martin Luther King', 'Dalai Lama'], correctAnswer: 'Mahatma Gandhi' },
    { id: 8, question: '¿Quién dictó las leyes en el antiguo imperio babilónico (Código de...)?', options: ['Hammurabi', 'Ramsés', 'Nabucodonosor', 'Ciro el Grande'], correctAnswer: 'Hammurabi' },
    { id: 9, question: '¿Con qué país se enfrentó España en la guerra de la Independencia de 1808?', options: ['Francia', 'Inglaterra', 'Portugal', 'Estados Unidos'], correctAnswer: 'Francia' },
    { id: 10, question: '¿Cómo se apodaba al rey español Alfonso X?', options: ['El Sabio', 'El Casto', 'El Deseado', 'El Hechizado'], correctAnswer: 'El Sabio' },

    // Geografía
    { id: 11, question: '¿Cuál es el río más largo del mundo?', options: ['Río Amazonas', 'Río Nilo', 'Río Yangtsé', 'Río Mississippi'], correctAnswer: 'Río Amazonas' },
    { id: 12, question: '¿En qué continente se encuentra Egipto?', options: ['África', 'Asia', 'Europa', 'Oceanía'], correctAnswer: 'África' },
    { id: 13, question: '¿Cuál es la capital de Italia?', options: ['Roma', 'Milán', 'Venecia', 'Florencia'], correctAnswer: 'Roma' },
    { id: 14, question: '¿Qué océano baña las costas del este de España (en parte)?', options: ['Mar Mediterráneo', 'Océano Atlántico', 'Océano Pacífico', 'Mar Cantábrico'], correctAnswer: 'Mar Mediterráneo' },
    { id: 15, question: '¿Cuál es la montaña más alta del mundo?', options: ['Monte Everest', 'El K2', 'El Mont Blanc', 'El Teide'], correctAnswer: 'Monte Everest' },
    { id: 16, question: '¿Cuál es el único mamífero capaz de volar?', options: ['El murciélago', 'La ardilla voladora', 'El avestruz', 'El pingüino'], correctAnswer: 'El murciélago' },
    { id: 17, question: '¿En qué país están los canales de Venecia?', options: ['Italia', 'Francia', 'España', 'Portugal'], correctAnswer: 'Italia' },
    { id: 18, question: '¿Cuál es el país más grande del mundo por superficie?', options: ['Rusia', 'Canadá', 'China', 'Estados Unidos'], correctAnswer: 'Rusia' },
    { id: 19, question: '¿Qué estrecho separa España de Marruecos?', options: ['Estrecho de Gibraltar', 'Estrecho de Magallanes', 'Estrecho del Bósforo', 'Canal de la Mancha'], correctAnswer: 'Estrecho de Gibraltar' },
    { id: 20, question: '¿En qué ciudad española está La Sagrada Familia?', options: ['Barcelona', 'Madrid', 'Sevilla', 'Valencia'], correctAnswer: 'Barcelona' },

    // Arte y Literatura
    { id: 21, question: '¿Quién pintó \'La Gioconda\' o \'Mona Lisa\'?', options: ['Leonardo da Vinci', 'Pablo Picasso', 'Vincent van Gogh', 'Miguel Ángel'], correctAnswer: 'Leonardo da Vinci' },
    { id: 22, question: '¿Quién escribió el famoso libro \'Don Quijote de la Mancha\'?', options: ['Miguel de Cervantes', 'William Shakespeare', 'Federico García Lorca', 'Gabriel García Márquez'], correctAnswer: 'Miguel de Cervantes' },
    { id: 23, question: '¿En qué ciudad se encuentra el Museo del Louvre?', options: ['París', 'Roma', 'Londres', 'Madrid'], correctAnswer: 'París' },
    { id: 24, question: '¿De qué color es el caballo blanco de Santiago?', options: ['Blanco', 'Negro', 'Marrón', 'Gris'], correctAnswer: 'Blanco' },
    { id: 25, question: '¿Qué artista pintó la Capilla Sixtina?', options: ['Miguel Ángel', 'Rafael', 'Donatello', 'Leonardo da Vinci'], correctAnswer: 'Miguel Ángel' },
    { id: 26, question: '¿Quién es el autor de \'Romeo y Julieta\'?', options: ['William Shakespeare', 'Charles Dickens', 'Oscar Wilde', 'Víctor Hugo'], correctAnswer: 'William Shakespeare' },
    { id: 27, question: '¿Qué pintor español es famoso por sus relojes blandos?', options: ['Salvador Dalí', 'Pablo Picasso', 'Diego Velázquez', 'Francisco de Goya'], correctAnswer: 'Salvador Dalí' },
    { id: 28, question: '¿A qué movimiento literario perteneció Garcilaso de la Vega?', options: ['Renacimiento', 'Romanticismo', 'Barroco', 'Ilustración'], correctAnswer: 'Renacimiento' },
    { id: 29, question: '¿En qué museo madrileño podemos ver el cuadro de Las Meninas?', options: ['Museo del Prado', 'Museo Reina Sofía', 'Museo Thyssen', 'Museo de Bellas Artes'], correctAnswer: 'Museo del Prado' },
    { id: 30, question: '¿Quién cantaba \'Soy minero\' o \'El porompompero\'?', options: ['Manolo Escobar', 'Joselito', 'Julio Iglesias', 'Antonio Molina'], correctAnswer: 'Manolo Escobar' },

    // Cine Clásico y Televisión
    { id: 31, question: '¿Qué actor protagonizó la película \'Casablanca\' junto a Ingrid Bergman?', options: ['Humphrey Bogart', 'Clark Gable', 'Marlon Brando', 'Cary Grant'], correctAnswer: 'Humphrey Bogart' },
    { id: 32, question: '¿En qué película clásica una chica con zapatos rojos dice "no hay lugar como el hogar"?', options: ['El Mago de Oz', 'Lo que el viento se llevó', 'Sonrisas y Lágrimas', 'Mary Poppins'], correctAnswer: 'El Mago de Oz' },
    { id: 33, question: '¿Quién cantaba bajo la lluvia en la mítica película de los años 50?', options: ['Gene Kelly', 'Fred Astaire', 'Frank Sinatra', 'Bing Crosby'], correctAnswer: 'Gene Kelly' },
    { id: 34, question: '¿Quién fue el director de películas de suspense como \'Psicosis\'?', options: ['Alfred Hitchcock', 'Orson Welles', 'Steven Spielberg', 'John Ford'], correctAnswer: 'Alfred Hitchcock' },
    { id: 35, question: '¿Cómo se llama la familia monstruosa pero divertida de televisión de los 60?', options: ['La Familia Addams', 'Los Monster', 'Los Picapiedra', 'Los Supersónicos'], correctAnswer: 'La Familia Addams' },
    { id: 36, question: '¿Qué película ambientada en la guerra civil estadounidense dice "A Dios pongo por testigo..."?', options: ['Lo que el viento se llevó', 'Doctor Zhivago', 'Los siete samuráis', 'Ben-Hur'], correctAnswer: 'Lo que el viento se llevó' },
    { id: 37, question: '¿Quién era la mítica compañera rubia de los hermanos Marx y otras comedias?', options: ['Marilyn Monroe', 'Grace Kelly', 'Audrey Hepburn', 'Rita Hayworth'], correctAnswer: 'Marilyn Monroe' },
    { id: 38, question: '¿En qué ciudad transcurre la mítica película de Audrey Hepburn, \'Desayuno con diamantes\'?', options: ['Nueva York', 'Londres', 'París', 'Roma'], correctAnswer: 'Nueva York' },
    { id: 39, question: '¿Qué programa famoso presentaba Félix Rodríguez de la Fuente?', options: ['El hombre y la tierra', 'Saber y ganar', 'Un, dos, tres', 'Estudio estadio'], correctAnswer: 'El hombre y la tierra' },
    { id: 40, question: 'En \'El Padrino\', ¿cómo se apellida la famosa familia de mafiosos?', options: ['Corleone', 'Soprano', 'Capone', 'Borgia'], correctAnswer: 'Corleone' },

    // Cultura General Mixta
    { id: 41, question: '¿Cuál es el disco más vendido de todos los tiempos (de Michael Jackson)?', options: ['Thriller', 'Bad', 'Dangerous', 'Off the Wall'], correctAnswer: 'Thriller' },
    { id: 42, question: '¿Qué invento popularizaron los hermanos Wright a principios del siglo XX?', options: ['El aeroplano (Avió)', 'El coche', 'La radio', 'El teléfono'], correctAnswer: 'El aeroplano (Avió)' },
    { id: 43, question: '¿Cuál es el metal representado por el símbolo químico \'Au\'?', options: ['Oro', 'Plata', 'Cobre', 'Hierro'], correctAnswer: 'Oro' },
    { id: 44, question: '¿Cuántos días tiene un año bisiesto?', options: ['366', '365', '360', '364'], correctAnswer: '366' },
    { id: 45, question: '¿Cómo se llama el resultado de una multiplicación?', options: ['Producto', 'Suma', 'Cociente', 'Resto'], correctAnswer: 'Producto' },
    { id: 46, question: '¿De qué color es la bandera de la ONU (Organización de las Naciones Unidas)?', options: ['Azul y blanco', 'Rojo y amarillo', 'Verde y blanco', 'Negro y blanco'], correctAnswer: 'Azul y blanco' },
    { id: 47, question: '¿Cuál es el planeta rojo del sistema solar?', options: ['Marte', 'Venus', 'Júpiter', 'Saturno'], correctAnswer: 'Marte' },
    { id: 48, question: '¿Cómo se llama la cría de la oveja?', options: ['Cordero', 'Ternero', 'Potro', 'Lechón'], correctAnswer: 'Cordero' },
    { id: 49, question: '¿En qué instrumento musical destacan los \'pedales\' para mantener la nota?', options: ['Piano', 'Guitarra', 'Batería', 'Violín'], correctAnswer: 'Piano' },
    { id: 50, question: '¿Con qué se fabrica tradicionalmente el papel?', options: ['Con madera/celulosa', 'Con algodón', 'Con plástico reciclado', 'Con arcilla'], correctAnswer: 'Con madera/celulosa' },

    // Geografía Española
    { id: 51, question: '¿Cuál es el pico más alto de España?', options: ['El Teide', 'Mulhacén', 'Aneto', 'Veleta'], correctAnswer: 'El Teide' },
    { id: 52, question: '¿Qué río pasa por Zaragoza?', options: ['Ebro', 'Tajo', 'Guadalquivir', 'Duero'], correctAnswer: 'Ebro' },
    { id: 53, question: '¿En qué comunidad autónoma se encuentra la ciudad de Salamanca?', options: ['Castilla y León', 'Andalucía', 'Extremadura', 'Madrid'], correctAnswer: 'Castilla y León' },
    { id: 54, question: '¿Qué archipiélago español está en el océano Atlántico?', options: ['Canarias', 'Baleares', 'Columbretes', 'Cíes'], correctAnswer: 'Canarias' },
    { id: 55, question: '¿Cuál es la capital del País Vasco?', options: ['Vitoria', 'Bilbao', 'San Sebastián', 'Pamplona'], correctAnswer: 'Vitoria' },
    { id: 56, question: '¿Con qué dos países hace frontera terrestre España en la península?', options: ['Portugal y Andorra (y Francia)', 'Italia y Portugal', 'Francia y Marruecos', 'Portugal e Inglaterra'], correctAnswer: 'Portugal y Andorra (y Francia)' },
    { id: 57, question: '¿En qué provincia se encuentra La Alhambra?', options: ['Granada', 'Sevilla', 'Córdoba', 'Málaga'], correctAnswer: 'Granada' },
    { id: 58, question: '¿Qué mar baña las costas de Valencia y Alicante?', options: ['Mar Mediterráneo', 'Mar Cantábrico', 'Océano Atlántico', 'Mar Menor'], correctAnswer: 'Mar Mediterráneo' },
    { id: 59, question: '¿Cuál es la isla más grande de las Islas Baleares?', options: ['Mallorca', 'Menorca', 'Ibiza', 'Formentera'], correctAnswer: 'Mallorca' },
    { id: 60, question: '¿En qué comunidad autónoma desemboca el río Miño?', options: ['Galicia', 'Asturias', 'Cantabria', 'Andalucía'], correctAnswer: 'Galicia' },

    // Historia de España
    { id: 61, question: '¿Quiénes fueron los Reyes Católicos?', options: ['Isabel y Fernando', 'Juana y Felipe', 'Carlos e Isabel', 'Felipe y Letizia'], correctAnswer: 'Isabel y Fernando' },
    { id: 62, question: '¿En qué año se aprobó la actual Constitución Española?', options: ['1978', '1975', '1981', '1931'], correctAnswer: '1978' },
    { id: 63, question: '¿Qué rey construyó el Monasterio de El Escorial?', options: ['Felipe II', 'Carlos I', 'Alfonso X', 'Felipe IV'], correctAnswer: 'Felipe II' },
    { id: 64, question: '¿Cómo se llamaba el dictador que gobernó España hasta 1975?', options: ['Francisco Franco', 'Miguel Primo de Rivera', 'Manuel Azaña', 'Niceto Alcalá-Zamora'], correctAnswer: 'Francisco Franco' },
    { id: 65, question: '¿Qué pueblo invadió la península ibérica en el año 711?', options: ['Los musulmanes', 'Los romanos', 'Los visigodos', 'Los celtas'], correctAnswer: 'Los musulmanes' },
    { id: 66, question: '¿Quién fue el primer presidente de la democracia tras la Transición?', options: ['Adolfo Suárez', 'Felipe González', 'Leopoldo Calvo-Sotelo', 'Jose María Aznar'], correctAnswer: 'Adolfo Suárez' },
    { id: 67, question: '¿En qué año se celebraron los Juegos Olímpicos de Barcelona y la Expo de Sevilla?', options: ['1992', '1982', '1996', '2000'], correctAnswer: '1992' },
    { id: 68, question: '¿A quién se le atribuye la frase "¡Por Dios, por la Patria y el Rey!"?', options: ['A los carlistas', 'A los liberales', 'A los republicanos', 'A los afrancesados'], correctAnswer: 'A los carlistas' },
    { id: 69, question: '¿Qué batalla naval de 1571 fue llamada por Cervantes "la más alta ocasión que vieron los siglos"?', options: ['Batalla de Lepanto', 'Batalla de Trafalgar', 'Armada Invencible', 'Batalla de San Quintín'], correctAnswer: 'Batalla de Lepanto' },
    { id: 70, question: '¿Cómo se llamaba la moneda de España antes del euro?', options: ['Peseta', 'Escudo', 'Franco', 'Real'], correctAnswer: 'Peseta' },

    // Literatura (Siglo de Oro y Gen 98)
    { id: 71, question: '¿Quién es el autor de la obra de teatro "La vida es sueño"?', options: ['Pedro Calderón de la Barca', 'Lope de Vega', 'Tirso de Molina', 'Miguel de Cervantes'], correctAnswer: 'Pedro Calderón de la Barca' },
    { id: 72, question: '¿A qué generación literaria pertenece Antonio Machado?', options: ['Generación del 98', 'Generación del 27', 'Romanticismo', 'Realismo'], correctAnswer: 'Generación del 98' },
    { id: 73, question: '¿Cuál es el título completo de la obra cumbre de Cervantes?', options: ['El ingenioso hidalgo Don Quijote de la Mancha', 'Don Quijote y Sancho Panza', 'Aventuras de Don Quijote', 'El Quijote'], correctAnswer: 'El ingenioso hidalgo Don Quijote de la Mancha' },
    { id: 74, question: '¿Quién escribió el "Romancero Gitano"?', options: ['Federico García Lorca', 'Rafael Alberti', 'Miguel Hernández', 'Vicente Aleixandre'], correctAnswer: 'Federico García Lorca' },
    { id: 75, question: '¿De qué famosa novela es protagonista Lázaro de Tormes?', options: ['El Lazarillo de Tormes', 'El Buscón', 'Guzmán de Alfarache', 'Rinconete y Cortadillo'], correctAnswer: 'El Lazarillo de Tormes' },
    { id: 76, question: '¿A quién corresponde el famoso poema "Caminante no hay camino..."?', options: ['Antonio Machado', 'Miguel de Unamuno', 'Juan Ramón Jiménez', 'Rosalía de Castro'], correctAnswer: 'Antonio Machado' },
    { id: 77, question: '¿Qué importante autor extremeño escribió "Los santos inocentes"?', options: ['Miguel Delibes', 'Camilo José Cela', 'Arturo Pérez-Reverte', 'Pío Baroja'], correctAnswer: 'Miguel Delibes' },
    { id: 78, question: '¿Quién fue el dramaturgo más prolífico del Siglo de Oro, llamado "Fénix de los Ingenios"?', options: ['Lope de Vega', 'Calderón de la Barca', 'Quevedo', 'Góngora'], correctAnswer: 'Lope de Vega' },
    { id: 79, question: '¿Qué obra de Camilo José Cela narra la vida en Madrid en la posguerra?', options: ['La Colmena', 'La familia de Pascual Duarte', 'San Camilo, 1936', 'Mazurca para dos muertos'], correctAnswer: 'La Colmena' },
    { id: 80, question: '¿Quién escribió "Niebla" y popularizó el concepto de "nivola"?', options: ['Miguel de Unamuno', 'Pío Baroja', 'Azorín', 'Ramón del Valle-Inclán'], correctAnswer: 'Miguel de Unamuno' },

    // Cine Español e Internacional Clásico
    { id: 81, question: '¿Qué famoso director español dirigió "Bienvenido, Mister Marshall"?', options: ['Luis García Berlanga', 'Luis Buñuel', 'Carlos Saura', 'Pedro Almodóvar'], correctAnswer: 'Luis García Berlanga' },
    { id: 82, question: '¿Quién protagonizó la película "El halcón maltés"?', options: ['Humphrey Bogart', 'Cary Grant', 'James Stewart', 'Gary Cooper'], correctAnswer: 'Humphrey Bogart' },
    { id: 83, question: '¿Qué niño prodigio del cine español cantaba "Campanera"?', options: ['Joselito', 'Marisol', 'Pablito Calvo', 'Rocío Dúrcal'], correctAnswer: 'Joselito' },
    { id: 84, question: 'En la mítica película "Los santos inocentes", ¿quién interpretó a Azarías (Milana bonita)?', options: ['Paco Rabal', 'Alfredo Landa', 'Fernando Fernán Gómez', 'Juan Diego'], correctAnswer: 'Paco Rabal' },
    { id: 85, question: '¿Quién fue el director de la película "El Padrino"?', options: ['Francis Ford Coppola', 'Martin Scorsese', 'Steven Spielberg', 'Stanley Kubrick'], correctAnswer: 'Francis Ford Coppola' },
    { id: 86, question: '¿De qué película de Alfredo Landa proviene el término "landismo"?', options: ['No es el amor quien llama', 'El pisito', 'Atraco a las tres', 'La escopeta nacional'], correctAnswer: 'No es el amor quien llama' }, // Aunque hay muchas, el landismo en general.
    { id: 87, question: '¿Qué animal salvaje siembra el terror en la playa en una famosa película de Spielberg?', options: ['Un tiburón blanco', 'Un cocodrilo', 'Una orca', 'Un pulpo gigante'], correctAnswer: 'Un tiburón blanco' },
    { id: 88, question: '¿Quién interpretaba a Don Vito Corleone en la película clásica de la mafia?', options: ['Marlon Brando', 'Al Pacino', 'Robert De Niro', 'James Caan'], correctAnswer: 'Marlon Brando' },
    { id: 89, question: 'Cine español: ¿Quién era la niña prodigio conocida como "Tómbola"?', options: ['Marisol', 'Rocío Dúrcal', 'Ana Belén', 'Misol'], correctAnswer: 'Marisol' },
    { id: 90, question: '¿Qué famoso western fue rodado en gran parte en Almería?', options: ['El bueno, el feo y el malo', 'Centauros del desierto', 'Solo ante el peligro', 'La diligencia'], correctAnswer: 'El bueno, el feo y el malo' },

    // Cultura Popular y Dichos
    { id: 91, question: '¿Qué significa el refrán "A quien madruga..."?', options: ['Dios le ayuda', 'encuentra todo cerrado', 'se levanta cansado', 'tiene mucho sueño'], correctAnswer: 'Dios le ayuda' },
    { id: 92, question: '¿Cuál es el dulce típico navideno a base de almendra y miel?', options: ['Turrón', 'Mazapán', 'Polvorón', 'Roscón'], correctAnswer: 'Turrón' },
    { id: 93, question: '¿Qué animal se asocia con dar buena suerte si te "caga" encima?', options: ['Un pájaro', 'Un perro', 'Un gato', 'Una mosca'], correctAnswer: 'Un pájaro' },
    { id: 94, question: 'Cuando algo es muy difícil o valioso, se dice que "vale un..."', options: ['Potosí', 'Dinar', 'Imperio', 'Castillo'], correctAnswer: 'Potosí' },
    { id: 95, question: '¿Qué instrumento acompaña a las sevillanas típicamente en las manos del bailaor?', options: ['Castañuelas', 'Pandereta', 'Guitarra', 'Cajón'], correctAnswer: 'Castañuelas' },
    { id: 96, question: '¿Qué se come en Nochevieja al son de las campanadas en España?', options: ['Doce uvas', 'Lentejas', 'Doce pasas', 'Cava'], correctAnswer: 'Doce uvas' },
    { id: 97, question: 'Completar el dicho: "En abril..."', options: ['Aguas mil', 'Hojas cayendo', 'Mucho calor', 'Nieve a montones'], correctAnswer: 'Aguas mil' },
    { id: 98, question: 'Si a alguien se le "ha ido el santo al cielo", significa que...', options: ['Se le ha olvidado lo que iba a decir', 'Se ha muerto', 'Se ha vuelto loco', 'Está soñando despierto'], correctAnswer: 'Se le ha olvidado lo que iba a decir' },
    { id: 99, question: '¿Cómo se llama la siesta o el descanso después de comer?', options: ['Siesta', 'Modorra', 'Pausa', 'Sobremesa'], correctAnswer: 'Siesta' },
    { id: 100, question: 'Dicho: "Cría cuervos y..."', options: ['Te sacarán los ojos', 'Tendrás muchos cuervos', 'Se irán volando', 'Pellizcarán tu pan'], correctAnswer: 'Te sacarán los ojos' },

    // Ciencia Básica y Naturaleza
    { id: 101, question: '¿A qué temperatura hierve el agua a nivel del mar?', options: ['100 grados Celsius', '50 grados Celsius', '0 grados Celsius', '90 grados Celsius'], correctAnswer: '100 grados Celsius' },
    { id: 102, question: '¿Qué gas respiramos principalmente para vivir?', options: ['Oxígeno', 'Nitrógeno', 'Dióxido de carbono', 'Helio'], correctAnswer: 'Oxígeno' },
    { id: 103, question: '¿Cuál es el único satélite natural de la Tierra?', options: ['La Luna', 'El Sol', 'Marte', 'Europa'], correctAnswer: 'La Luna' },
    { id: 104, question: '¿Cuántos huesos tiene aproximadamente el cuerpo humano adulto?', options: ['206', '300', '150', '250'], correctAnswer: '206' },
    { id: 105, question: '¿Cómo se llama el proceso por el cual las plantas fabrican su alimento?', options: ['Fotosíntesis', 'Respiración', 'Polinización', 'Germinación'], correctAnswer: 'Fotosíntesis' },
    { id: 106, question: '¿Qué científico formuló la teoría de la Relatividad?', options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Marie Curie'], correctAnswer: 'Albert Einstein' },
    { id: 107, question: '¿Cuál es el planeta más grande de nuestro Sistema Solar?', options: ['Júpiter', 'Saturno', 'La Tierra', 'Urano'], correctAnswer: 'Júpiter' },
    { id: 108, question: '¿Qué descubrió Alexander Fleming por casualidad?', options: ['La penicilina', 'La aspirina', 'Los rayos X', 'La anestesia'], correctAnswer: 'La penicilina' },
    { id: 109, question: '¿Qué animal marino es famoso por su gran inteligencia?', options: ['El delfín', 'El tiburón', 'La medusa', 'El pez espada'], correctAnswer: 'El delfín' },
    { id: 110, question: '¿Qué órgano del cuerpo humano bombea la sangre?', options: ['El corazón', 'El pulmón', 'El cerebro', 'El hígado'], correctAnswer: 'El corazón' },

    // Geografía Mundial
    { id: 111, question: '¿Cuál es el país con más habitantes del mundo en la actualidad?', options: ['India', 'Estados Unidos', 'Rusia', 'Brasil'], correctAnswer: 'India' }, // India superó a China
    { id: 112, question: '¿Cuál es la capital de Francia?', options: ['París', 'Lyon', 'Marsella', 'Burdeos'], correctAnswer: 'París' },
    { id: 113, question: '¿En qué continente está el desierto del Sáhara?', options: ['África', 'Asia', 'América del Sur', 'Oceanía'], correctAnswer: 'África' },
    { id: 114, question: '¿Qué famosa muralla visible desde el espacio se encuentra en Asia?', options: ['La Gran Muralla China', 'El Muro de Berlín', 'El Muro de Adriano', 'Las Murallas de Babilonia'], correctAnswer: 'La Gran Muralla China' },
    { id: 115, question: '¿Cuál es la capital de Argentina?', options: ['Buenos Aires', 'Santiago', 'Montevideo', 'Lima'], correctAnswer: 'Buenos Aires' },
    { id: 116, question: '¿Cuál es el pequeño país independiente ubicado dentro de Roma?', options: ['Ciudad del Vaticano', 'Mónaco', 'San Marino', 'Andorra'], correctAnswer: 'Ciudad del Vaticano' },
    { id: 117, question: '¿Dónde se encuentran las famosas pirámides de Giza?', options: ['Egipto', 'México', 'Perú', 'Grecia'], correctAnswer: 'Egipto' },
    { id: 118, question: '¿En qué país bailan tradicionalmente el tango?', options: ['Argentina', 'Brasil', 'México', 'Cuba'], correctAnswer: 'Argentina' },
    { id: 119, question: '¿A qué país pertenece la isla de Groenlandia?', options: ['Dinamarca', 'Noruega', 'Canadá', 'Estados Unidos'], correctAnswer: 'Dinamarca' },
    { id: 120, question: '¿Cuál es el idioma nativo más hablado en Brasil?', options: ['Portugués', 'Español', 'Inglés', 'Francés'], correctAnswer: 'Portugués' },

    // Más Cultura Española (Miscelánea)
    { id: 121, question: '¿Cuál es la fiesta popular de Pamplona donde se corren los encierros?', options: ['Los Sanfermines', 'Las Fallas', 'La Feria de Abril', 'La Tomatina'], correctAnswer: 'Los Sanfermines' },
    { id: 122, question: '¿En qué provincia se celebra tradicionalmente el descenso del Sella?', options: ['Asturias', 'Cantabria', 'Galicia', 'León'], correctAnswer: 'Asturias' },
    { id: 123, question: '¿Qué famoso premio literario se otorga en España la noche de Reyes?', options: ['Premio Nadal', 'Premio Planeta', 'Premio Cervantes', 'Premio Alfaguara'], correctAnswer: 'Premio Nadal' },
    { id: 124, question: '¿Qué artista aragonés pintó "Los fusilamientos del 3 de mayo"?', options: ['Francisco de Goya', 'Diego Velázquez', 'Murillo', 'El Greco'], correctAnswer: 'Francisco de Goya' },
    { id: 125, question: '¿Cómo llama el Quijote a su amada?', options: ['Dulcinea del Toboso', 'Aldonza Lorenzo', 'Maritornes', 'Teresa Panza'], correctAnswer: 'Dulcinea del Toboso' },
    { id: 126, question: '¿Qué plato español lleva tradicionalmente patata, huevo y aceite de oliva?', options: ['Tortilla de patatas', 'Paella', 'Gazpacho', 'Fabada'], correctAnswer: 'Tortilla de patatas' },
    { id: 127, question: '¿Qué cantante folklórica fue bautizada como "La Faraona"?', options: ['Lola Flores', 'Rocío Jurado', 'Isabel Pantoja', 'Carmen Sevilla'], correctAnswer: 'Lola Flores' },
    { id: 128, question: 'En un partido de mus, ¿cuántos reyes es la "jugada máxima" para grande?', options: ['Cuatro reyes', 'Tres reyes', 'Dos reyes', 'Ninguno'], correctAnswer: 'Cuatro reyes' },
    { id: 129, question: '¿Quién fue la primera mujer que obtuvo la cátedra universitaria en España y dio derecho a voto a la mujer?', options: ['Clara Campoamor', 'Emilia Pardo Bazán', 'Victoria Kent', 'Rosalía de Castro'], correctAnswer: 'Clara Campoamor' }, // Aunque hay matices históricos, ella luchó por el voto femenino
    { id: 130, question: '¿A la costa de qué provincia andaluza se la llama "Costa del Sol"?', options: ['Málaga', 'Cádiz', 'Almería', 'Huelva'], correctAnswer: 'Málaga' },

    // Más Deportes y Espectáculo
    { id: 131, question: '¿Qué tenista español ha ganado más de 10 veces en Roland Garros?', options: ['Rafa Nadal', 'Carlos Alcaraz', 'Manuel Santana', 'David Ferrer'], correctAnswer: 'Rafa Nadal' },
    { id: 132, question: '¿En qué año ganó la selección española su primer y único Mundial de Fútbol?', options: ['2010', '2008', '2012', '1982'], correctAnswer: '2010' },
    { id: 133, question: '¿Qué ciclista navarro ganó el Tour de Francia cinco veces consecutivas?', options: ['Miguel Induráin', 'Pedro Delgado', 'Alberto Contador', 'Carlos Sastre'], correctAnswer: 'Miguel Induráin' },
    { id: 134, question: '¿Qué presentadora de televisión es célebre por presentar el "Un, dos, tres..." en una de sus etapas y "Sorpresa, Sorpresa"?', options: ['Mayra Gómez Kemp', 'Isabel Gemio', 'Raffaella Carrà', 'Mercedes Milá'], correctAnswer: 'Isabel Gemio' },
    { id: 135, question: '¿En qué mítico estadio madrileño juega sus partidos el Real Madrid?', options: ['Santiago Bernabéu', 'Vicente Calderón', 'Camp Nou', 'Mestalla'], correctAnswer: 'Santiago Bernabéu' },
    { id: 136, question: '¿Qué programa de sobremesa reunía a la familia en torno a documentales de la naturaleza?', options: ['El hombre y la tierra', 'Informe Semanal', 'La bola de cristal', 'Al filo de lo imposible'], correctAnswer: 'El hombre y la tierra' },
    { id: 137, question: '¿Quién presentaba el famosísimo concurso "Un, dos, tres" en sus mejores años?', options: ['Mayra Gómez Kemp', 'Chicho Ibáñez Serrador', 'Ramón García', 'Jordi Hurtado'], correctAnswer: 'Mayra Gómez Kemp' },
    { id: 138, question: '¿De dónde era oriundo el famoso cantante Camilo Sesto?', options: ['Alcoy (Alicante)', 'Linares (Jaén)', 'Tetuán', 'Madrid'], correctAnswer: 'Alcoy (Alicante)' },
    { id: 139, question: '¿Qué presentador dio las campanadas muchas veces con una capa?', options: ['Ramón García', 'José María Íñigo', 'Joaquín Prat', 'Matias Prats'], correctAnswer: 'Ramón García' },
    { id: 140, question: '¿En qué deporte destacó Severiano Ballesteros?', options: ['Golf', 'Tenis', 'Baloncesto', 'Natación'], correctAnswer: 'Golf' },

    // Último bloque (Recuerdos de la vida cotidiana y mixta)
    { id: 141, question: '¿Cómo se llamaba la famosa furgoneta pequeña de reparto típica en la España del desarrollismo?', options: ['Citroën 2CV', 'Seat 600', 'DKW', 'Renault 4 Latas'], correctAnswer: 'Citroën 2CV' }, // En rigor, la 2CV furgoneta o la DKW eran típicas. O el 4 latas. "Cirila".
    { id: 142, question: '¿Qué popular coche motorizó España en los años 60?', options: ['Seat 600', 'Renault 5', 'Seat Panda', 'Simca 1000'], correctAnswer: 'Seat 600' },
    { id: 143, question: '¿Con qué pesetas estaba hecho el famoso billete marrón en el que aparecía Benito Pérez Galdós?', options: ['1.000 pesetas', '500 pesetas', '100 pesetas', '2.000 pesetas'], correctAnswer: '1.000 pesetas' },
    { id: 144, question: 'En un coche clásico, ¿qué se utilizaba habitualmente para subir las ventanillas?', options: ['Cremallera a manivela', 'Botón', 'Tirador de cuerda', 'Palanca de pie'], correctAnswer: 'Cremallera a manivela' },
    { id: 145, question: '¿En qué aparato rebobinábamos habitualmente las películas para ver en casa antes del DVD?', options: ['VHS / Vídeo', 'Tocadiscos', 'Magnetófono', 'Casetera'], correctAnswer: 'VHS / Vídeo' },
    { id: 146, question: '¿Qué cantaba Raphael con pasión: "Yo soy..."?', options: ['...aquel', '...minero', '...rebelde', '...tu amigo'], correctAnswer: '...aquel' },
    { id: 147, question: '¿Quién escribió el poema "La canción del pirata" (Con diez cañones por banda...)?', options: ['José de Espronceda', 'Gustavo Adolfo Bécquer', 'Antonio Machado', 'Lord Byron'], correctAnswer: 'José de Espronceda' },
    { id: 148, question: '¿Qué fruta se asocia tradicionalmente a la manzana de Eva?', options: ['Manzana', 'Pera', 'Higo', 'Uva'], correctAnswer: 'Manzana' },
    { id: 149, question: '¿Qué es el "Códice Calixtino"?', options: ['Un texto medieval con la guía del Camino de Santiago', 'Una novela de misterio', 'La primera Biblia traducida', 'Un código de leyes visigodas'], correctAnswer: 'Un texto medieval con la guía del Camino de Santiago' },
    { id: 150, question: 'Dicho popular: "Más vale pájaro en mano que..."', options: ['Ciento volando', 'Doscientos nadando', 'Tener las manos vacías', 'Que se escape volando'], correctAnswer: 'Ciento volando' }
];
