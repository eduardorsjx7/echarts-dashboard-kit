(function () {
    // Função para criar gráfico
    function criarGrafico(el, tipo, parametro, grupo, dados) {
      const chart = echarts.init(el);
  
      const atualizar = () => {
        const filtrados = window.obterDadosFiltrados(grupo, dados);
        const contagem = {};
        filtrados.forEach(item => {
          const chave = item[parametro];
          contagem[chave] = (contagem[chave] || 0) + 1;
        });
  
        chart.setOption({
          title: { text: parametro },
          tooltip: {},
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
        window.registrarComponente(grupo, parametro, valor);
      });
  
      window.registrarComponente(grupo, parametro, null, atualizar);
      atualizar();
    }
  
    // Função para criar tabela
    function criarTabela(el, colunas, grupo, dados) {
      const atualizar = () => {
        const filtrados = window.obterDadosFiltrados(grupo, dados);
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
            colunas.forEach(c => window.registrarComponente(grupo, c, item[c]));
          };
          tbody.appendChild(tr);
        });
  
        table.appendChild(tbody);
        el.appendChild(table);
      };
  
      colunas.forEach(c => window.registrarComponente(grupo, c, null, atualizar));
      atualizar();
    }
  
    // Funções do filtro
    const filtros = {};
  
    function registrarComponente(grupo, campo, valor, callback) {
      filtros[grupo] = filtros[grupo] || {};
  
      if (callback) {
        filtros[grupo].callback = callback;
      } else {
        if (!valor) return;
  
        filtros[grupo][campo] = filtros[grupo][campo] || new Set();
  
        if (filtros[grupo][campo].has(valor)) {
          filtros[grupo][campo].delete(valor);
        } else {
          filtros[grupo][campo].add(valor);
        }
  
        if (filtros[grupo].callback) filtros[grupo].callback();
      }
    }
  
    function obterDadosFiltrados(grupo, dados) {
      const ativo = filtros[grupo] || {};
  
      return dados.filter(item => {
        return Object.entries(ativo).every(([campo, valores]) => {
          if (!valores.size) return true;
          return valores.has(item[campo]);
        });
      });
    }
  
    function limparFiltros(grupo) {
      filtros[grupo] = {};
      if (filtros[grupo].callback) filtros[grupo].callback();
    }
  
    // Expondo as funções no escopo global
    window.criarGrafico = criarGrafico;
    window.criarTabela = criarTabela;
    window.registrarComponente = registrarComponente;
    window.obterDadosFiltrados = obterDadosFiltrados;
    window.limparFiltros = limparFiltros;
    window.filtros = filtros;
  })();
  