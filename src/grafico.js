import * as echarts from 'echarts';
import { registrarComponente, obterDadosFiltrados } from './filtro';

export function criarGrafico(el, tipo, parametro, grupo, dados) {
  const chart = echarts.init(el);

  const atualizar = () => {
    const filtrados = obterDadosFiltrados(grupo, dados);
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
    registrarComponente(grupo, parametro, valor);
  });

  registrarComponente(grupo, parametro, null, atualizar);
  atualizar();
}