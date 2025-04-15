// Função para formatar data
export function formatarData(data) {
    const date = new Date(data);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
  
  // Função para gerar rótulos para o eixo X do gráfico
  export function gerarLabels(data) {
    return data.map((item) => item.label || item);
  }
  
  // Função para verificar se o valor é numérico
  export function isNumber(value) {
    return !isNaN(value) && isFinite(value);
  }