## Autenticação

### Visão Geral

O fluxo de autenticação do frontend da Metanoia atualmente é composto por várias páginas em React/Next.js e componentes de suporte. Essas telas estão implementadas como client components em `src/app/auth` e `src/components/auth`.

Os utilizadores podem escolher o seu papel, criar uma nova conta, iniciar sessão ou recuperar uma palavra-passe esquecida. A integração com a API ainda não está conectada, portanto os formulários atualmente não enviam dados para nenhum endpoint e o projeto utiliza handlers temporários (console logs) quando o utilizador interage com a interface.

---

### Telas e Componentes Implementados 

1. **Seleção de Papel** (`/auth/selecionar-papel`)
   - Componente `<SelectUserRole />`
   - Dois cards para "Quero Aprender" e "Quero Ensinar"
   - Botão de continuar que faz log do papel selecionado
   - Links para voltar ao login caso o utilizador já tenha conta

2. **Cadastro** (`/auth/cadastro`)
   - `<RegistrationPage />` renderiza o formulário completo de registo
   - Inclui campos para nome, email, palavra-passe, tipo de utilizador e checkbox de termos
   - Barra de progresso atualmente fixa em 50 % (etapa 1 de um fluxo multi-etapas)
   - Indicadores de confiança abaixo do formulário
   - Footer e header são elementos de UI partilhados

3. **Login** (`/auth/login`)
   - `<LoginPage />` com campos de email e palavra-passe
   - Alternância de visibilidade da palavra-passe e link "Esqueci a palavra-passe?"
   - Botões de login social para Google e LinkedIn (apenas UI)
   - Links para a página de cadastro

4. **Recuperação de Palavra-Passe** (`/auth/recuperar-senha`)
   - Componente `<ForgotPassword />` com formulário simples de recuperação
   - Header e footer consistentes com as outras telas de autenticação

5. **Componentes de UI Partilhados**
   - Diversos componentes menores (headers, cards, inputs de formulário, etc.) estão em `src/components/auth/_components` e `src/components/ui`. Esses elementos são reutilizados em todo o fluxo de autenticação.

6. **Rota de mensagem**
   - Componentes <message />
   - Header consistentes com as outras telas

### Comportamento Atual do Fluxo

- Novos visitantes chegam por padrão à página de **seleção de papel** (a rota ainda não está forçada). Selecionar um papel apenas atualiza o estado local.
- A partir daí, os utilizadores podem navegar para a página de cadastro, onde visualizam a primeira etapa do registo.
- A tela de login pode ser acessada de forma independente e ainda não realiza autenticação com o backend.
- "Esqueci a palavra-passe" redireciona para o formulário de recuperação, mas não envia nenhum email.
- Após login/registo, a aplicação deve redirecionar para `/dashboard`.

### Próximos Passos 

Para evoluir o fluxo de autenticação para um estado funcional, as seguintes tarefas devem ser consideradas:

1. **Integração com API**
   - Conectar os formulários a endpoints reais do backend (ex.: `/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`).
   - Tratar respostas de sucesso/erro e exibir mensagens de feedback apropriadas.

2. **Gestão de Estado & Proteção de Rotas**
   - Implementar um contexto de autenticação no cliente (ex.: React Context ou Zustand) para armazenar token/dados do utilizador.
   - Adicionar middleware ou componentes de ordem superior (HOCs) para proteger o dashboard e outras rotas privadas.

3. **Roteamento Baseado em Papel**
   - Utilizar o papel selecionado para direcionar o utilizador para o onboarding adequado (mentor vs. aluno).
   - Persistir a escolha do papel no registo e nas configurações de perfil.

4. **Completar o Registo Multi-Etapas**
   - Desenvolver as etapas restantes (configuração de perfil, detalhes de pagamento, etc.) e conectar corretamente a barra de progresso.
   - Validar os dados de entrada e gerir a submissão do formulário entre as etapas.

5. **Implementação do Dashboard**
   - Estruturar `src/app/dashboard/layout.tsx` e as páginas conforme os diferentes papéis de utilizador.
   - Exibir dados relevantes (cursos, sessões de mentoria, etc.) quando o backend estiver disponível.

6. **Melhorias de UX**
   - Garantir navegação adequada entre as telas (ex.: login ⇄ cadastro, fluxos de redefinição de palavra-passe).
   - Adicionar toasts de sucesso, estados de erro e indicadores de carregamento durante requisições de rede.

7. **Acessibilidade**
   - Assegurar que os formulários são acessíveis (labels, atributos ARIA).

---

Este documento servirá como referência viva para o fluxo de autenticação; atualize-o conforme novas telas forem adicionadas ou a lógica do fluxo evoluir.
