// Assume que ECharts já foi carregado via <script src="...echarts.min.js">
(function () {
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

  window.criarGrafico = criarGrafico;
})();
