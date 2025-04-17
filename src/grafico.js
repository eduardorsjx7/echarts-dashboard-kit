(function () {
  function criarGrafico(el, tipo, parametro, grupo, dados) {
    const chart = echarts.init(el);

    const atualizar = () => {
      const filtrados = window.obterDadosFiltrados(grupo, dados);
      const contagem = {};

      // Corrigir a contagem, agora somando os valores de cada categoria
      filtrados.forEach(item => {
        const chave = item[parametro];
        if (contagem[chave] === undefined) {
          contagem[chave] = item.valor; // Inicializa com o valor
        } else {
          contagem[chave] += item.valor; // Acumula o valor
        }
      });

      chart.setOption({
        title: { text: parametro },
        tooltip: {},
        xAxis: { type: 'category', data: Object.keys(contagem) },
        yAxis: { type: 'value' },
        series: [{
          type: tipo,
          data: Object.values(contagem), // Passa os valores acumulados
        }]
      });
    };

    // Evento de clique no gráfico
    chart.on('click', (params) => {
      const valor = params.name;
      window.registrarComponente(grupo, parametro, valor);
    });

    // Registra o componente e executa a função de atualização
    window.registrarComponente(grupo, parametro, null, atualizar);
    atualizar();
  }

  // Expondo no escopo global
  window.criarGrafico = criarGrafico;
})();
