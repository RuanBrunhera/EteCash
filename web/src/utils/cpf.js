export const somenteDigitos = (valor) => String(valor ?? "").replace(/\D/g, "");

export const formatarCPF = (valor) =>
	somenteDigitos(valor)
		.slice(0, 11)
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})$/, "$1-$2");