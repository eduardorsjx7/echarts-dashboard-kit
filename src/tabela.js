import { createTable } from '@tanstack/table-core';
import { registrarComponente, obterDadosFiltrados } from './filtro';

export function criarTabela(el, colunas, grupo, dados) {
  const atualizar = () => {
    const filtrados = obterDadosFiltrados(grupo, dados);
    el.innerHTML = '';
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    colunas.forEach(c => {
      const th = document.createElement('th');
      th.textContent = c;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    filtrados.forEach(item => {
      const tr = document.createElement('tr');
      colunas.forEach(c => {
        const td = document.createElement('td');
        td.textContent = item[c];
        tr.appendChild(td);
      });
      tr.onclick = () => {
        colunas.forEach(c => registrarComponente(grupo, c, item[c]));
      };
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    el.appendChild(table);
  };

  colunas.forEach(c => registrarComponente(grupo, c, null, atualizar));
  atualizar();
}
