const filtros = {};     // { grupo: { campo: Set(valores) } }
const listeners = {};   // <- Adicione essa linha

(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(require("echarts")); // Node/CommonJS
  } else {
    global.echartsDashboardKit = factory(global.echarts); // Browser
  }
})(typeof window !== "undefined" ? window : this, function (echarts) {
  if (!echarts) {
    throw new Error("ECharts não foi carregado. Instale com npm ou inclua via CDN antes de usar a biblioteca.");
  }

  const filtros = {};

  function registrarComponente(grupo, campo, valor, callback) {
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

  function obterDadosFiltrados(grupo, dados) {
    const ativo = filtros[grupo] || {};

    return dados.filter(item => {
      return Object.entries(ativo).every(([campo, valores]) => {
        if (!valores || valores.size === 0) return true;
        return valores.has(item[campo]);
      });
    });
  }

  function limparFiltros(grupo) {
    filtros[grupo] = {};
    if (filtros[grupo].callback) filtros[grupo].callback();
  }

  function criarGrafico(el, tipo, parametro, grupo, dados) {
    const chart = echarts.init(el);

    const atualizar = () => {
      const filtrados = window.obterDadosFiltrados(grupo, dados);
      const contagem = {};
    
      filtrados.forEach(item => {
        const chave = item[parametro];
        const valor = item.valor || 1; // se não tiver 'valor', soma 1
        contagem[chave] = (contagem[chave] || 0) + valor;
      });
    
      chart.setOption({
        title: { text: parametro },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: Object.keys(contagem) },
        yAxis: { type: 'value' },
        series: [{
          type: tipo,
          data: Object.values(contagem),
        }]
      });
    };
    
    chart.on('click', (params) => {
      const valor = params.name;
      registrarComponente(grupo, parametro, valor);
    });

    registrarComponente(grupo, parametro, null, atualizar);
    atualizar();
  }

  function criarTabela(el, colunas, grupo, dados) {
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

  return {
    criarGrafico,
    criarTabela,
    registrarComponente,
    obterDadosFiltrados,
    limparFiltros,
    filtros
  };
});
