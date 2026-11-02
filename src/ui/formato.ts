// PRESENTACIÓN: cómo se DIBUJAN los datos para quien lee. El dominio guarda "mr-mime" y 25; aquí
// se convierten en "Mr Mime" y "#0025". Si mañana la app se muestra en otro idioma se toca este
// archivo y ninguna regla de negocio se entera.

export function capitalizar (nombre : string) : string {
    return nombre
        .split('-')
        .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
        .join(' ');
}

export function formatearNumero (id : number) : string {
    return `#${String(id).padStart(4, '0')}`;
}

export function pluralizar (cantidad : number, singular : string, plural : string) : string {
    return `${cantidad} ${cantidad === 1 ? singular : plural}`;
}

const formatoDecimal =new Intl.NumberFormat('es-PE', {minimumFractionDigits : 1, maximumFractionDigits : 1});

export function formatearDecimal (valor : number) : string {
    return formatoDecimal.format(valor);
}

const formatoHora =new Intl.DateTimeFormat('es-PE', {hour : '2-digit', minute : '2-digit'});

export function formatearHora (milisegundos : number) : string {
    return formatoHora.format(new Date(milisegundos));
}
