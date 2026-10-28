import { useEffect, useState } from "react";
import adminService from "../../../services/adminService";
import { formatarCPF, somenteDigitos } from "../../../utils/cpf";

const camposIniciais = {
	nome: "",
	cpf: "",
	email: "",
	telefone: "",
};

export default function ModalCadastroFuncionario({ isOpen, onClose, onSuccess }) {
	const [campos, setCampos] = useState(camposIniciais);
	const [erro, setErro] = useState("");
	const [salvando, setSalvando] = useState(false);
	const [resultado, setResultado] = useState(null);
	const bloqueiaFechamento = salvando || resultado !== null;

	useEffect(() => {
		if (!isOpen) return;

		setCampos(camposIniciais);
		setErro("");
		setResultado(null);
	}, [isOpen]);

	function alterarCampo(campo, valor) {
		setCampos((atuais) => ({ ...atuais, [campo]: valor }));
	}

	async function salvar(event) {
		event.preventDefault();
		setErro("");

		const nome = campos.nome.trim();
		const cpf = somenteDigitos(campos.cpf)
		const email = campos.email.trim();
		const telefone = campos.telefone.trim();

		if (nome.length < 3) {
			setErro("O nome deve ter pelo menos 3 caracteres.");
			return;
		}

		if (cpf.length !== 11) {
			setErro("O CPF deve conter 11 dígitos.");
			return;
		}

		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setErro("Informe um e-mail válido.");
			return;
		}

		if (telefone && (telefone.length < 10 || telefone.length > 20)) {
			setErro("O telefone deve ter entre 10 e 20 caracteres.");
			return;
		}

		const payload = { nome, cpf };
		if (email) payload.email = email;
		if (telefone) payload.telefone = telefone;

		setSalvando(true);
		try {
			const { data, error } = await adminService.cadastrarFuncionario(payload);

			if (error) {
				setErro(error);
				return;
			}

			setResultado(data);
		} finally {
			setSalvando(false);
		}
	}

	function concluir() {
		setResultado(null);
		onSuccess();
		onClose();
	}

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
			onClick={() => {
				if (!bloqueiaFechamento) onClose();
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="funcionario-modal-title"
				className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl"
				onClick={(event) => event.stopPropagation()}
			>
				{resultado ? (
					<section>
						<h2 id="funcionario-modal-title" className="mb-2 text-lg font-semibold text-white">
							Funcionário cadastrado
						</h2>
						<p className="mb-5 text-sm text-zinc-400">
							Anote a senha temporária. Ela não será exibida novamente.
						</p>

						<dl className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 text-sm">
							<div className="flex justify-between gap-4">
								<dt className="text-zinc-400">CPF</dt>
								<dd className="font-medium text-white">{formatarCPF(resultado.cpf)}</dd>
							</div>
							<div className="flex justify-between gap-4">
								<dt className="text-zinc-400">Nome</dt>
								<dd className="text-right font-medium text-white">{resultado.nome}</dd>
							</div>
							<div className="flex justify-between gap-4">
								<dt className="text-zinc-400">Senha temporária</dt>
								<dd className="font-mono font-medium text-emerald-400">{resultado.senha_temp}</dd>
							</div>
						</dl>

						<button
							type="button"
							onClick={concluir}
							className="mt-6 w-full rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
						>
							Concluir
						</button>
					</section>
				) : (
					<>
						<h2 id="funcionario-modal-title" className="mb-4 text-lg font-semibold text-white">
							Cadastrar funcionário
						</h2>

						{erro && <p className="mb-4 text-sm text-red-400" role="alert">{erro}</p>}

						<form onSubmit={salvar} className="space-y-4">
							<div>
								<label htmlFor="funcionario-nome" className="mb-2 block text-sm font-medium text-white">Nome</label>
								<input
									id="funcionario-nome"
									type="text"
									value={campos.nome}
									onChange={(event) => alterarCampo("nome", event.target.value)}
									maxLength={100}
									autoComplete="name"
									className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white focus:border-red-600 focus:outline-none"
								/>
							</div>

							<div>
								<label htmlFor="funcionario-cpf" className="mb-2 block text-sm font-medium text-white">CPF</label>
								<input
									id="funcionario-cpf"
									type="text"
									inputMode="numeric"
									value={campos.cpf}
									onChange={(e) => alterarCampo("cpf", formatarCPF(e.target.value))}
									maxLength={14}
									placeholder="000.000.000-00"
									autoComplete="off"
									className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white focus:border-red-600 focus:outline-none"
								/>
							</div>

							<div>
								<label htmlFor="funcionario-email" className="mb-2 block text-sm font-medium text-white">E-mail <span className="font-normal text-zinc-400">(opcional)</span></label>
								<input
									id="funcionario-email"
									type="email"
									value={campos.email}
									onChange={(event) => alterarCampo("email", event.target.value)}
									maxLength={254}
									autoComplete="email"
									className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white focus:border-red-600 focus:outline-none"
								/>
							</div>

							<div>
								<label htmlFor="funcionario-telefone" className="mb-2 block text-sm font-medium text-white">Telefone <span className="font-normal text-zinc-400">(opcional)</span></label>
								<input
									id="funcionario-telefone"
									type="tel"
									value={campos.telefone}
									onChange={(event) => alterarCampo("telefone", event.target.value)}
									maxLength={20}
									autoComplete="tel"
									className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white focus:border-red-600 focus:outline-none"
								/>
							</div>

							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={() => {
										if (!bloqueiaFechamento) onClose();
									}}
									disabled={bloqueiaFechamento}
									className="flex-1 rounded-xl bg-zinc-800 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Cancelar
								</button>
								<button
									type="submit"
									disabled={salvando}
									className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{salvando ? "Salvando..." : "Cadastrar"}
								</button>
							</div>
						</form>
					</>
				)}
			</div>
		</div>
	);
}