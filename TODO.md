# TODO / Backlog — EteCash

## Funcionalidades pendentes

- [X] **Bug no confirmar pin que caso aperte enter enquanto o modal de confirmação aparece, repete a compra**
  - Substituir esse ENTER e deixar para seguir processo apenas no mouse
  - Ou travar tela/botões listeners enquanto o modal estiver aberto/em exibição

- [X] **Editar dados de perfil (aluno)**
  - Trocar e-mail (depende do item "e-mail no aluno" abaixo)
  - Trocar senha (exigir senha atual antes de aceitar a nova)
  - Trocar PIN (exigir PIN atual antes; decidir se o novo PIN é escolhido pelo aluno ou gerado aleatoriamente como no cadastro)

- [X] **Editar dados de perfil (funcionário)**
  - Trocar e-mail, telefone, senha

- [X] **Relatório de vendas "de verdade"**
  - Estilo `Statistics.jsx` do aluno — dados agregados, gráficos
  - Rota `/cantina/relatorios` está livre pra isso (não confundir com o histórico, que já existe em `/cantina/historico`)

- [X] **Reorganização de components/ (fazer junto com Fase F3 - camada de services/)

Hoje `components/` mistura dois critérios: por domínio de usuário (`cantina/`)
e por função (`common/`, `layout/`, `dashboard/`, etc). Decisão: abandonar
agrupamento por domínio em components/ (isso é papel de pages/), reorganizar
por função/categoria do componente. Motivo: componentes em components/ devem
ser tratados como potencialmente reutilizáveis; presos numa pasta por domínio,
ficam "carimbados" como exclusivos de um usuário mesmo quando não precisam ser.

Estrutura alvo:
- components/common/       → ModalSucesso, ModalEditarCampo (já está certo)
- components/layout/        → Layout, LayoutCantina (já está certo)
- components/navigation/     → SideBar, SidebarCantina (hoje espalhados)
- components/dashboard/      → StatCard, WelcomeCard, WelcomeCardCantina (hoje espalhados)
- components/venda/          → CarrinhoVenda, ModalProdutosComprados
- components/saldo/          → AdicionarSaldo
- components/fab/            → FloatingButton

  - [ ] Botão "ver detalhes da compra" no histórico do aluno (mesmo padrão do ModalProdutosComprados que a cantina já usa)

- [ ] **Recuperação de senha via e-mail** (aluno + funcionário)
  - Precisa de infraestrutura de envio de e-mail real

- [ ] **Role "admin"**
  - Cadastro de aluno/funcionário deveria ser restrito a administradores (hoje `CadastrarAluno` é rota pública)

- [ ] **Campo de e-mail no Aluno**
  - Hoje só `Funcionario` tem e-mail
  - Pré-requisito para recuperação de senha do aluno

- [ ] **QR Code como forma alternativa de confirmação de compra**
  - Além do PIN

- [ ] **Refresh tokens**
  - Hoje o JWT expira em 24h fixas, sem mecanismo de renovação sem novo login

- [ ] **Rejeitar PIN óbvios**
  - Rejeitar PINs óbvios (0000, 1234, sequências repetidas) na troca de PIN

- [ ] **Migrar Hash da senha**
  - Migrar hash de senha/PIN de SHA-256 puro pra algo com salt (bcrypt/argon2)

## Dívida técnica / organização

- [ ] **Organizar estrutura de pastas do projeto**
  - Padronizar convenções (hoje há inconsistência entre pastas/arquivos)

- [ ] **Comentar o código**
  - Muitas partes do projeto ainda não têm comentários explicativos

## Ajustes visuais

- [ ] Revisar visual de outras telas que ainda não passaram por polimento (o carrinho de vendas já foi todo estilizado)