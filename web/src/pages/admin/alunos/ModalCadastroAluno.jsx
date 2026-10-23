import { useEffect, useState } from "react";
import adminService from "../../../services/adminService";

const camposIniciais = {
	rm: "",
	nome: "",
	serie: "",
	curso_id: "",
};

export default function ModalCadastroAluno({ isOpen, onClose, onSuccess }) {
	const [campos, setCampos] = useState(camposIniciais);
	const [cursos, setCursos] = useState([]);
	const [erro, setErro] = useState("");
	const [carregandoCursos, setCarregandoCursos] = useState(false);
	const [salvando, setSalvando] = useState(false);
	const [resultado, setResultado] = useState(null);
	const bloqueiaFechamento = salvando || resultado !== null;

	useEffect(() => {
		if (!isOpen) return;

		let ativo = true;

		async function carregarCursos() {
			setCampos(camposIniciais);
			setCursos([]);
			setErro("");
			setResultado(null);
			setCarregandoCursos(true);

			const { data, error } = await adminService.listarCursos();

			if (!ativo) return;

			if (error) {
				setErro(error);
			} else if (!data?.length) {
				setErro("Nenhum curso disponível para cadastro.");
			} else {
				setCursos(data);
			}

			setCarregandoCursos(false);
		}

		carregarCursos();

		return () => {
			ativo = false;
		};
	}, [isOpen]);

	function alterarCampo(campo, valor) {
		setCampos((atuais) => ({ ...atuais, [campo]: valor }));
	}

	async function salvar(event) {
		event.preventDefault();
		setErro("");

		const rm = campos.rm.trim();
		const nome = campos.nome.trim();

		if (!rm || !nome || !campos.serie || !campos.curso_id) {
			setErro("Preencha todos os campos.");
			return;
		}

		if (!/^\d+$/.test(rm)) {
			setErro("O RM deve ser um número inteiro.");
			return;
		}

		if (nome.length < 3) {
			setErro("O nome deve ter pelo menos 3 caracteres.");
			return;
		}

		setSalvando(true);

		try {
			const { data, error } = await adminService.cadastrarAluno({
				rm: Number(campos.rm),
				nome,
				serie: campos.serie,
				curso_id: Number(campos.curso_id),
			});

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
				className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl"
				onClick={(event) => event.stopPropagation()}
			>
				{resultado ? (
					<section>
						<h2 className="mb-2 text-lg font-semibold text-white">Aluno cadastrado</h2>
						<p className="mb-5 text-sm text-zinc-400">
							Anote as credenciais abaixo. Elas não serão exibidas novamente.
						</p>

						<dl className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 text-sm">
							<div className="flex justify-between gap-4">
								<dt className="text-zinc-400">RM</dt>
								<dd className="font-medium text-white">{resultado.rm}</dd>
							</div>
							<div className="flex justify-between gap-4">
								<dt className="text-zinc-400">Nome</dt>
								<dd className="text-right font-medium text-white">{resultado.nome}</dd>
							</div>
							<div className="flex justify-between gap-4">
								<dt className="text-zinc-400">PIN</dt>
								<dd className="font-mono font-medium text-emerald-400">{resultado.pin}</dd>
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
						<h2 className="mb-4 text-lg font-semibold text-white">Cadastrar aluno</h2>

						{erro && <p className="mb-4 text-sm text-red-400" role="alert">{erro}</p>}

						<form onSubmit={salvar} className="space-y-4">
							<div>
								<label htmlFor="aluno-rm" className="mb-2 block text-sm font-medium text-white">RM</label>
								<input
									id="aluno-rm"
									type="number"
									min="1"
									value={campos.rm}
									onChange={(event) => alterarCampo("rm", event.target.value)}
									className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white focus:border-red-600 focus:outline-none"
								/>
							</div>

							<div>
								<label htmlFor="aluno-nome" className="mb-2 block text-sm font-medium text-white">Nome</label>
								<input
									id="aluno-nome"
									type="text"
									value={campos.nome}
									onChange={(event) => alterarCampo("nome", event.target.value)}
									className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white focus:border-red-600 focus:outline-none"
								/>
							</div>

							<div>
								<label htmlFor="aluno-serie" className="mb-2 block text-sm font-medium text-white">Série</label>
								<select
									id="aluno-serie"
									value={campos.serie}
									onChange={(event) => alterarCampo("serie", event.target.value)}
									className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white focus:border-red-600 focus:outline-none"
								>
									<option value="">Selecione a série</option>
									<option value="1">1ª série</option>
									<option value="2">2ª série</option>
									<option value="3">3ª série</option>
								</select>
							</div>

							<div>
								<label htmlFor="aluno-curso" className="mb-2 block text-sm font-medium text-white">Curso</label>
								<select
									id="aluno-curso"
									value={campos.curso_id}
									onChange={(event) => alterarCampo("curso_id", event.target.value)}
									disabled={carregandoCursos || salvando || cursos.length === 0}
									className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white focus:border-red-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="">{carregandoCursos ? "Carregando cursos..." : "Selecione o curso"}</option>
									{cursos.map((curso) => (
										<option key={curso.id} value={curso.id}>
											{curso.nome} ({curso.periodo})
										</option>
									))}
								</select>
							</div>

							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={() => {
										if (!bloqueiaFechamento) onClose();
									}}
									disabled={bloqueiaFechamento}
									className="flex-1 rounded-xl bg-zinc-800 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
								>
									Cancelar
								</button>
								<button
									type="submit"
									disabled={carregandoCursos || salvando || cursos.length === 0}
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