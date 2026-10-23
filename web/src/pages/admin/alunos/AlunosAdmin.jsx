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
import adminService from "../../../services/adminService";
import ModalCadastroAluno from "./ModalCadastroAluno";

// Os nomes são comparados normalizados para não depender de maiúsculas ou acentos.
// Se os nomes no seu banco forem diferentes, ajuste só os "nomes".
const CURSOS = [
  { sigla: "ADM", nomes: ["adm"] },
  { sigla: "DS", nomes: ["ds"] },
  { sigla: "QUI", nomes: ["quimica"] },
];

const PERIODOS = [
  { valor: "manha", label: "Manhã" },
  { valor: "tarde", label: "Tarde" },
  { valor: "noite", label: "Noite" },
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

export default function AlunosAdmin() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [rmAtualizando, setRmAtualizando] = useState(null);
  const [cadastroAberto, setCadastroAberto] = useState(false);

  const [busca, setBusca] = useState("");
  const [cursoFiltro, setCursoFiltro] = useState(null);
  const [periodoFiltro, setPeriodoFiltro] = useState(null);

  async function carregar() {
    setCarregando(true);
    setErro("");

    try {
      const { data, error } = await adminService.listarAlunos();
      if (error) {
        setErro(error);
        return;
      }

      setAlunos(data ?? []);
    } catch {
      setErro("Não foi possível carregar os alunos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function alternarStatus(aluno) {
    const ativo = !aluno.ativo;
    setRmAtualizando(aluno.rm);
    setErro("");

    try {
      const { error } = await adminService.alterarStatusAluno(aluno.rm, ativo);
      if (error) {
        setErro(error);
        return;
      }

      setAlunos((atuais) =>
        atuais.map((item) =>
          item.rm === aluno.rm ? { ...item, ativo } : item,
        ),
      );
    } catch {
      setErro("Não foi possível atualizar o status do aluno.");
    } finally {
      setRmAtualizando(null);
    }
  }

  const alunosFiltrados = useMemo(() => {
    const termo = busca.trim();
    const curso = CURSOS.find((c) => c.sigla === cursoFiltro);

    return alunos.filter((aluno) => {
      if (termo && !String(aluno.rm).includes(termo)) return false;

      if (curso) {
        const nomeCurso = normalizar(aluno.curso?.nome);
        if (!curso.nomes.includes(nomeCurso)) return false;
      }

      if (periodoFiltro && normalizar(aluno.curso?.periodo) !== periodoFiltro) {
        return false;
      }

      return true;
    });
  }, [alunos, busca, cursoFiltro, periodoFiltro]);

  const temFiltro = busca !== "" || cursoFiltro !== null || periodoFiltro !== null;

  function limparFiltros() {
    setBusca("");
    setCursoFiltro(null);
    setPeriodoFiltro(null);
  }

  return (
    <main className="min-h-full overflow-y-auto bg-[var(--color-background)] px-4 py-6 text-[var(--color-text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-6">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-red-400">
              Administração
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">Alunos</h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Consulte os cadastros e gerencie o acesso dos alunos.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--color-text-muted)]">
              {temFiltro
                ? `${alunosFiltrados.length} de ${alunos.length}`
                : `${alunos.length} ${alunos.length === 1 ? "aluno" : "alunos"}`}
            </span>
            <button
              type="button"
              onClick={() => setCadastroAberto(true)}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
            >
              <UserPlus size={17} aria-hidden="true" />
              Novo aluno
            </button>
            <button
              type="button"
              onClick={carregar}
              disabled={carregando}
              aria-label="Atualizar lista"
              title="Atualizar lista"
              className="inline-flex size-10 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] transition hover:border-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={17} className={carregando ? "animate-spin" : ""} />
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
              inputMode="numeric"
              value={busca}
              onChange={(e) => setBusca(e.target.value.replace(/\D/g, ""))}
              placeholder="Buscar por RM"
              aria-label="Buscar aluno por RM"
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

          <div role="group" aria-label="Filtrar por curso" className="flex gap-2 border-l border-[var(--color-border-subtle)] pl-3">
            {CURSOS.map(({ sigla }) => (
              <button
                key={sigla}
                type="button"
                aria-pressed={cursoFiltro === sigla}
                onClick={() =>
                  setCursoFiltro((atual) => (atual === sigla ? null : sigla))
                }
                className={classeFiltro(cursoFiltro === sigla)}
              >
                {sigla}
              </button>
            ))}
          </div>

          <div role="group" aria-label="Filtrar por período" className="flex gap-2 border-l border-[var(--color-border-subtle)] pl-3">
            {PERIODOS.map(({ valor, label }) => (
              <button
                key={valor}
                type="button"
                aria-pressed={periodoFiltro === valor}
                onClick={() =>
                  setPeriodoFiltro((atual) => (atual === valor ? null : valor))
                }
                className={classeFiltro(periodoFiltro === valor)}
              >
                {label}
              </button>
            ))}
          </div>

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

        <section aria-label="Lista de alunos" className="overflow-hidden rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-card)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--color-border-subtle)] bg-white/[0.02] text-xs uppercase text-[var(--color-text-muted)]">
                <tr>
                  <th scope="col" className="px-5 py-4 font-medium">RM</th>
                  <th scope="col" className="px-5 py-4 font-medium">Nome</th>
                  <th scope="col" className="px-5 py-4 font-medium">Curso</th>
                  <th scope="col" className="px-5 py-4 font-medium">Status</th>
                  <th scope="col" className="px-5 py-4 text-right font-medium">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {carregando ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center text-[var(--color-text-muted)]">
                      Carregando alunos...
                    </td>
                  </tr>
                ) : alunosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center text-[var(--color-text-muted)]">
                      {alunos.length === 0
                        ? "Nenhum aluno cadastrado."
                        : "Nenhum aluno encontrado com esses filtros."}
                    </td>
                  </tr>
                ) : (
                  alunosFiltrados.map((aluno) => {
                    const atualizando = rmAtualizando === aluno.rm;

                    return (
                      <tr key={aluno.rm} className="transition hover:bg-white/[0.025]">
                        <td className="whitespace-nowrap px-5 py-4 font-mono text-[var(--color-text-muted)]">
                          {aluno.rm}
                        </td>
                        <td className="px-5 py-4 font-medium">{aluno.nome}</td>
                        <td className="px-5 py-4 text-[var(--color-text-muted)]">
                          {aluno.curso?.nome ?? "Não informado"}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 text-xs font-medium ${
                              aluno.ativo ? "text-emerald-400" : "text-zinc-400"
                            }`}
                          >
                            <span className={`size-1.5 rounded-full ${aluno.ativo ? "bg-emerald-400" : "bg-zinc-500"}`} />
                            {aluno.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => alternarStatus(aluno)}
                            disabled={atualizando || rmAtualizando !== null}
                            className={`inline-flex min-w-28 items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition disabled:cursor-wait disabled:opacity-50 ${
                              aluno.ativo
                                ? "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-red-500 hover:text-red-300"
                                : "border-emerald-800 text-emerald-300 hover:border-emerald-500 hover:bg-emerald-950/40"
                            }`}
                          >
                            {aluno.ativo ? (
                              <UserRoundX size={15} aria-hidden="true" />
                            ) : (
                              <UserRound size={15} aria-hidden="true" />
                            )}
                            {atualizando ? "Salvando..." : aluno.ativo ? "Desativar" : "Ativar"}
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

      <ModalCadastroAluno
        isOpen={cadastroAberto}
        onClose={() => setCadastroAberto(false)}
        onSuccess={carregar}
      />
    </main>
  );
}
