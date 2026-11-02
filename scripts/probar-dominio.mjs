// Prueba las reglas puras del dominio sin navegador ni librerías: como no usan React, red ni disco,
// basta importarlas y llamarlas. Corre con `npm run probar` (Node 22.18 o superior, que ejecuta
// archivos .ts quitando los tipos).
import assert from 'node:assert/strict';

const dominio = (archivo) => import(new URL(`../src/dominio/${archivo}`, import.meta.url).href);
const { agregarMiembro, quitarMiembro, motivoRechazo, reducirEquipo, MAX_EQUIPO } = await dominio('equipo.ts');
const { filtrarPorTermino, paginar, totalPaginas } = await dominio('pokedex.ts');
const { validarFicha } = await dominio('entrenador.ts');

const pokemon = (id) => ({ id, nombre: `p${id}`, imagen: `img${id}`, extra: 'no debe guardarse' });

// ---------- Equipo ----------
let equipo = [];
for (let id = 1; id <= MAX_EQUIPO; id++) equipo = agregarMiembro(equipo, pokemon(id));
assert.equal(equipo.length, MAX_EQUIPO);
assert.deepEqual(Object.keys(equipo[0]).sort(), ['id', 'imagen', 'nombre'], 'solo copia lo necesario');
assert.equal(agregarMiembro(equipo, pokemon(7)), equipo, 'con el equipo lleno devuelve el MISMO arreglo');
assert.equal(motivoRechazo(equipo, 7), 'lleno');
assert.equal(motivoRechazo(equipo, 3), 'repetido');

const antes = JSON.stringify(equipo);
const sinTres = quitarMiembro(equipo, 3);
assert.equal(sinTres.length, 5);
assert.equal(JSON.stringify(equipo), antes, 'no muta el equipo original');
assert.equal(motivoRechazo(sinTres, 7), null);

assert.equal(reducirEquipo(sinTres, { tipo: 'alternar', pokemon: pokemon(3) }).length, 6, 'alternar agrega');
assert.equal(reducirEquipo(equipo, { tipo: 'alternar', pokemon: pokemon(3) }).length, 5, 'alternar quita');
const dosSeguidos = reducirEquipo(reducirEquipo([], { tipo: 'alternar', pokemon: pokemon(1) }), { tipo: 'alternar', pokemon: pokemon(2) });
assert.equal(dosSeguidos.length, 2, 'dos acciones seguidas parten del resultado de la anterior');

// ---------- Pokédex ----------
const indice = [
    { id: 1, nombre: 'bulbasaur', imagen: '' },
    { id: 25, nombre: 'pikachu', imagen: '' },
    { id: 26, nombre: 'raichu', imagen: '' },
];
assert.deepEqual(filtrarPorTermino(indice, ' PIKA ').map((p) => p.id), [25]);
assert.deepEqual(filtrarPorTermino(indice, '26').map((p) => p.id), [26]);
assert.equal(filtrarPorTermino(indice, '').length, 3);
assert.equal(totalPaginas(0), 1);
assert.equal(totalPaginas(25), 2);
assert.equal(totalPaginas(1025), 43);
assert.equal(paginar([...Array(30).keys()], 2).length, 6);

// ---------- Ficha del entrenador ----------
const valida = { nombre: 'Ash Ketchum', email: 'ash@ejemplo.com', region: 'Kanto', edad: '10', lema: '' };
assert.deepEqual(validarFicha(valida), {}, 'una ficha correcta no tiene errores');
assert.ok(validarFicha({ ...valida, nombre: 'Al' }).nombre, 'nombre muy corto');
assert.ok(validarFicha({ ...valida, email: 'sin-arroba' }).email, 'correo inválido');
assert.ok(validarFicha({ ...valida, region: '' }).region, 'región obligatoria');
assert.ok(validarFicha({ ...valida, region: 'Narnia' }).region, 'región fuera de la lista');
assert.ok(validarFicha({ ...valida, edad: '9' }).edad, 'edad menor a 10');
assert.ok(validarFicha({ ...valida, edad: '10.5' }).edad, 'edad no entera');
assert.ok(validarFicha({ ...valida, lema: 'x'.repeat(81) }).lema, 'lema demasiado largo');

// ---------- Puerto RepositorioPokemon: la segunda implementación cumple el mismo contrato ----------
const { repositorioEnMemoria } = await import(new URL('../src/infraestructura/repositorioEnMemoria.ts', import.meta.url).href);
const indiceEnMemoria = await repositorioEnMemoria.obtenerIndice();
assert.deepEqual(Object.keys(indiceEnMemoria[0]).sort(), ['id', 'imagen', 'nombre'], 'el índice trae solo el resumen');
assert.equal((await repositorioEnMemoria.obtenerPokemon(4)).nombre, 'charmander');
assert.equal(await repositorioEnMemoria.obtenerPokemon(9999), null, 'un Pokémon inexistente es null, no un error');

console.log('dominio y puerto: todas las comprobaciones pasaron');
