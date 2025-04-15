// src/filtro.js
const filtros = {}; // { grupo: { campo: Set(valores) } }
const listeners = {}; // { grupo: [callback] }

export function registrarComponente(grupo, campo, valor, callback) {
  filtros[grupo] = filtros[grupo] || {};
  listeners[grupo] = listeners[grupo] || [];

  if (callback) {
    listeners[grupo].push(callback);
  } else {
    if (!valor) return;

    filtros[grupo][campo] = filtros[grupo][campo] || new Set();

    if (filtros[grupo][campo].has(valor)) {
      filtros[grupo][campo].delete(valor);
    } else {
      filtros[grupo][campo].add(valor);
    }

    listeners[grupo].forEach(fn => fn());
  }
}

export function obterDadosFiltrados(grupo, dados) {
  const ativo = filtros[grupo] || {};
  
  return dados.filter(item => {
    return Object.entries(ativo).every(([campo, valores]) => {
      if (!valores.size) return true;
      return valores.has(item[campo]);
    });
  });
}

export function limparFiltros(grupo) {
  filtros[grupo] = {};
  if (listeners[grupo]) listeners[grupo].forEach(fn => fn());
}

// Exporte filtros
export { filtros };
