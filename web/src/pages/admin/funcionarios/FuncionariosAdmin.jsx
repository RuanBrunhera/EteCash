import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  RefreshCw,
  Search,
  UserPlus,
  UserRound,
  UserRoundX,
  X,
} from "lucide-react";
import { formatarCPF } from "../../../utils/cpf";
import adminService from "../../../services/adminService";
import ModalCadastroFuncionario from "./ModalCadastroFuncionario";

const FILTROS = [
  { valor: "todos", label: "Todos" },
  { valor: "admins", label: "Admins" },
  { valor: "ativos", label: "Ativos" },
  { valor: "inativos", label: "Inativos" },
];

function normalizar(texto) {
  return (texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function classeFiltro(ativo) {
  return `inline-flex h-10 items-center rounded-md border px-4 text-xs font-medium transition ${
    ativo
      ? "border-red-500 bg-red-950/40 text-red-200"
      : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-red-500 hover:text-white"
  }`;
}

function obterFuncionarioLogado() {
  try {
    return JSON.parse(localStorage.getItem("funcionario") ?? "null");
  } catch {
    return null;
  }
}

export default function FuncionariosAdmin() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [idAtualizando, setIdAtualizando] = useState(null);
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [anoInativacaoFiltro, setAnoInativacaoFiltro] = useState("");
  const logado = obterFuncionarioLogado();

  async function carregar() {
    setCarregando(true);
    setErro("");

    try {
      const { data, error } = await adminService.listarFuncionarios();
      if (error) {
        setErro(error);
        return;
      }

      setFuncionarios(data ?? []);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function alternarStatus(funcionario) {
    const proprioFuncionario = String(funcionario.id) === String(logado?.id);
    if (funcionario.ativo && proprioFuncionario) return;

    const ativo = !funcionario.ativo;
    setIdAtualizando(funcionario.id);
    setErro("");

    try {
      const { error } = await adminService.alterarStatusFuncionario(
        funcionario.id,
        ativo,
      );
      if (error) {
        setErro(error);
        return;
      }

      setFuncionarios((atuais) =>
        atuais.map((item) =>
          item.id === funcionario.id
            ? {
                ...item,
                ativo,
                data_inativacao: ativo ? null : new Date().toISOString(),
              }
            : item,
        ),
      );
    } finally {
      setIdAtualizando(null);
    }
  }

  const funcionariosFiltrados = useMemo(() => {
    const termo = busca.trim();
    const buscaPorCpf = termo !== "" && /^[\d\s()./-]+$/.test(termo);
    const cpfBusca = termo.replace(/\D/g, "");
    const nomeBusca = normalizar(termo);
    const ano = Number(anoInativacaoFiltro);

    return funcionarios.filter((funcionario) => {
      if (termo) {
        if (buscaPorCpf) {
          const cpf = String(funcionario.cpf ?? "").replace(/\D/g, "");
          if (!cpf.includes(cpfBusca)) return false;
        } else if (!normalizar(funcionario.nome).includes(nomeBusca)) {
          return false;
        }
      }

      if (filtro === "admins" && !funcionario.is_admin) return false;
      if (filtro === "ativos" && !funcionario.ativo) return false;
      if (filtro === "inativos" && funcionario.ativo) return false;
      if (
        filtro === "inativos" &&
        ano &&
        new Date(funcionario.data_inativacao).getFullYear() !== ano
      ) return false;

      return true;
    });
  }, [funcionarios, busca, filtro, anoInativacaoFiltro]);

  const anosInativacao = useMemo(
    () =>
      [...new Set(
        funcionarios
          .filter((funcionario) => !funcionario.ativo && funcionario.data_inativacao)
          .map((funcionario) =>
            new Date(funcionario.data_inativacao).getFullYear(),
          ),
      )].sort((a, b) => b - a),
    [funcionarios],
  );

  const temFiltro =
    busca.trim() !== "" ||
    filtro !== "todos" ||
    anoInativacaoFiltro !== "";

  function limparFiltros() {
    setBusca("");
    setFiltro("todos");
    setAnoInativacaoFiltro("");
  }

  return (
    <main className="min-h-full overflow-y-auto rounded-3xl bg-[var(--color-background)] px-4 py-6 text-[var(--color-text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-6">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-red-400">
              Administração
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">Funcionários</h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Consulte os cadastros e gerencie o acesso dos funcionários.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--color-text-muted)]">
              {temFiltro
                ? `${funcionariosFiltrados.length} de ${funcionarios.length}`
                : `${funcionarios.length} ${funcionarios.length === 1 ? "funcionário" : "funcionários"}`}
            </span>
            <button
              type="button"
              onClick={() => setCadastroAberto(true)}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
            >
              <UserPlus size={17} aria-hidden="true" />
              Novo funcionário
            </button>
            <button
              type="button"
              onClick={carregar}
              disabled={carregando}
              aria-label="Atualizar lista"
              title="Atualizar lista"
              className="inline-flex size-10 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] transition hover:border-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={carregando ? "animate-spin" : ""}
                aria-hidden="true"
              />
            </button>
          </div>
        </header>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
            <input
              type="text"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por CPF ou nome"
              aria-label="Buscar funcionário por CPF ou nome"
              className="h-10 w-full rounded-md border border-[var(--color-border)] bg-transparent pl-9 pr-9 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-red-500 focus:outline-none"
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca("")}
                aria-label="Limpar busca"
                className="absolute right-2 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded text-[var(--color-text-muted)] hover:text-white"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          <div
            role="group"
            aria-label="Filtrar funcionários"
            className="flex flex-wrap gap-2 sm:border-l sm:border-[var(--color-border-subtle)] sm:pl-3"
          >
            {FILTROS.map(({ valor, label }) => (
              <button
                key={valor}
                type="button"
                aria-pressed={filtro === valor}
                onClick={() => {
                  setFiltro(valor);
                  if (valor !== "inativos") setAnoInativacaoFiltro("");
                }}
                className={classeFiltro(filtro === valor)}
              >
                {label}
              </button>
            ))}
          </div>

          {filtro === "inativos" && anosInativacao.length > 0 && (
            <div className="border-l border-[var(--color-border-subtle)] pl-3">
              <select
                value={anoInativacaoFiltro}
                onChange={(event) => setAnoInativacaoFiltro(event.target.value)}
                aria-label="Filtrar ano de inativação"
                className="h-10 rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-xs text-[var(--color-text)]"
              >
                <option value="">Todos os anos</option>
                {anosInativacao.map((ano) => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
            </div>
          )}

          {temFiltro && (
            <button
              type="button"
              onClick={limparFiltros}
              className="inline-flex h-10 items-center gap-1.5 px-2 text-xs font-medium text-[var(--color-text-muted)] transition hover:text-white"
            >
              <X size={14} aria-hidden="true" />
              Limpar filtros
            </button>
          )}
        </div>

        {erro && (
          <div
            role="alert"
            className="mb-5 flex items-center gap-3 rounded-md border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-200"
          >
            <AlertCircle size={18} aria-hidden="true" />
            <span>{erro}</span>
          </div>
        )}

        <section
          aria-label="Lista de funcionários"
          className="overflow-hidden rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-card)]"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--color-border-subtle)] bg-white/[0.02] text-xs uppercase text-[var(--color-text-muted)]">
                <tr>
                  <th scope="col" className="px-5 py-4 font-medium">Nome</th>
                  <th scope="col" className="px-5 py-4 font-medium">CPF</th>
                  <th scope="col" className="px-5 py-4 font-medium">Perfil</th>
                  <th scope="col" className="px-5 py-4 font-medium">Status</th>
                  <th scope="col" className="px-5 py-4 text-right font-medium">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {carregando ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center text-[var(--color-text-muted)]">
                      Carregando funcionários...
                    </td>
                  </tr>
                ) : funcionariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center text-[var(--color-text-muted)]">
                      {funcionarios.length === 0
                        ? "Nenhum funcionário cadastrado."
                        : "Nenhum funcionário encontrado com esses filtros."}
                    </td>
                  </tr>
                ) : (
                  funcionariosFiltrados.map((funcionario) => {
                    const atualizando = idAtualizando === funcionario.id;
                    const proprioAtivo =
                      funcionario.ativo &&
                      String(funcionario.id) === String(logado?.id);

                    return (
                      <tr key={funcionario.id} className="transition hover:bg-white/[0.025]">
                        <td className="px-5 py-4 font-medium">{funcionario.nome}</td>
                        <td className="whitespace-nowrap px-5 py-4 font-mono text-[var(--color-text-muted)]">
                          {formatarCPF(funcionario.cpf)}
                        </td>
                        <td className="px-5 py-4">
                          {funcionario.is_admin ? (
                            <span className="inline-flex rounded-full border border-amber-800 bg-amber-950/40 px-2.5 py-1 text-xs font-medium text-amber-300">
                              Admin
                            </span>
                          ) : (
                            <span className="text-[var(--color-text-muted)]">Funcionário</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 text-xs font-medium ${
                              funcionario.ativo ? "text-emerald-400" : "text-zinc-400"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                funcionario.ativo ? "bg-emerald-400" : "bg-zinc-500"
                              }`}
                            />
                            {funcionario.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => alternarStatus(funcionario)}
                            disabled={
                              atualizando ||
                              idAtualizando !== null ||
                              Boolean(proprioAtivo)
                            }
                            title={
                              proprioAtivo
                                ? "Você não pode desativar sua própria conta"
                                : undefined
                            }
                            className={`inline-flex min-w-28 items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              funcionario.ativo
                                ? "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-red-500 hover:text-red-300"
                                : "border-emerald-800 text-emerald-300 hover:border-emerald-500 hover:bg-emerald-950/40"
                            }`}
                          >
                            {funcionario.ativo ? (
                              <UserRoundX size={15} aria-hidden="true" />
                            ) : (
                              <UserRound size={15} aria-hidden="true" />
                            )}
                            {atualizando
                              ? "Salvando..."
                              : funcionario.ativo
                                ? "Desativar"
                                : "Ativar"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <ModalCadastroFuncionario
        isOpen={cadastroAberto}
        onClose={() => setCadastroAberto(false)}
        onSuccess={carregar}
      />
    </main>
  );
}