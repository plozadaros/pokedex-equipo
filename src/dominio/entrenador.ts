// La ficha del entrenador: el formulario principal de la aplicación. Reglas puras de validación;
// la pantalla solo muestra los mensajes que esta función devuelve.
export const REGIONES = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Teselia', 'Kalos', 'Alola', 'Galar', 'Paldea'];
export const EDAD_MINIMA = 10;
export const EDAD_MAXIMA = 99;
export const LEMA_MAXIMO = 80;

// Lo que el usuario escribe: TODO es texto (un <input> siempre entrega string). La conversión a
// número ocurre al guardar, no al escribir.
export type ValoresFicha = {
    nombre : string;
    email : string;
    region : string;
    edad : string;
    lema : string;
};

// Lo que se guarda, ya con los tipos correctos.
export interface FichaEntrenador {
    nombre : string;
    email : string;
    region : string;
    edad : number;
    lema : string;
}

export type ErroresFicha = Partial<Record<keyof ValoresFicha, string>>;

export function validarFicha (v : ValoresFicha) : ErroresFicha {
    const errores : ErroresFicha = {};
    if(!/^[\p{L}0-9 _-]{3,20}$/u.test(v.nombre.trim())) {
        errores.nombre = 'Entre 3 y 20 caracteres: letras, números, espacios, guion o guion bajo';
    }
    if(!/^\S+@\S+\.\S+$/.test(v.email.trim())) errores.email = 'Escribe un correo electrónico válido';
    if(v.region === '') errores.region = 'Elige tu región de origen';
    else if(!REGIONES.includes(v.region)) errores.region = 'Esa región no existe en el mapa';
    const edad = Number(v.edad);
    if(v.edad.trim() === '' || !Number.isInteger(edad) || edad < EDAD_MINIMA || edad > EDAD_MAXIMA) {
        errores.edad = `Escribe una edad entera entre ${EDAD_MINIMA} y ${EDAD_MAXIMA}`;
    }
    if(v.lema.length > LEMA_MAXIMO) errores.lema = `Máximo ${LEMA_MAXIMO} caracteres (llevas ${v.lema.length})`;
    return errores;
}

export function aFicha (v : ValoresFicha) : FichaEntrenador {
    return {
        nombre : v.nombre.trim(),
        email : v.email.trim(),
        region : v.region,
        edad : Number(v.edad),
        lema : v.lema.trim()
    };
}

export function aValores (ficha : FichaEntrenador) : ValoresFicha {
    return {nombre : ficha.nombre, email : ficha.email, region : ficha.region, edad : String(ficha.edad), lema : ficha.lema};
}
