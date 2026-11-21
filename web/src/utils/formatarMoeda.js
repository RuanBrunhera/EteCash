const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const formatarMoeda = (valor) => {
  const numero = Number(valor);
  return formatadorMoeda.format(Number.isFinite(numero) ? numero : 0);
};