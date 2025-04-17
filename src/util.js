(function () {
  // Função para formatar data
  function formatarData(data) {
    const date = new Date(data);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  // Função para gerar rótulos para o eixo X do gráfico
  function gerarLabels(data) {
    return data.map((item) => item.label || item);
  }

  // Função para verificar se o valor é numérico
  function isNumber(value) {
    return !isNaN(value) && isFinite(value);
  }

  // Expondo no escopo global
  window.formatarData = formatarData;
  window.gerarLabels = gerarLabels;
  window.isNumber = isNumber;
})();
