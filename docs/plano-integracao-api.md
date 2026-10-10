# Plano de integração da API — Metanoia Mentorship API (Fase 1 MVP)

Fonte: `Metanoia Mentorship API.yaml` (OpenAPI 3.0.3, 37 rotas, autenticação JWT Bearer).
Documento vivo: marque o estado de cada fase conforme for avançando.

## Modelo da API em uma frase

Mentores publicam **aulas** (`courses`, individuais ou em grupo, online ou presenciais, pagas ou
gratuitas). Cada aula tem **turmas** (`sessions`) e cada turma tem **encontros** (`meetings`, com data
e hora). Estudantes pedem **inscrição** numa turma; o mentor aprova e, se a aula for paga, o
estudante envia um **comprovativo** de pagamento que o mentor confirma. Um **onboarding com IA**
gera o **perfil de aprendizagem** do estudante, que alimenta as **recomendações**.

> ⚠️ **Diferença de modelo com o frontend atual.** Hoje a página inicial é um marketplace de
> *mentores* com preço por hora, avaliação e foto. Na API, o que se descobre e compra são *aulas*.
> O `Mentor` da API não tem preço, avaliação nem foto. A Fase 2 depende desta decisão (ver
> "Decisões pendentes").

## Lista de endpoints por prioridade

Legenda: 🔓 público · 🔒 requer JWT · **P0** bloqueia tudo · **P1** núcleo do MVP · **P2** importante · **P3** complementar

### P0 — Base e autenticação

| Endpoint | Uso no frontend | Tela |
|---|---|---|
| `POST /api/auth/login/` 🔓 | Login: devolve `access`, `refresh` e `user` | `/auth/login` ✅ existe |
| `POST /api/auth/register/` 🔓 | Registo (`role`: STUDENT, MENTOR ou BOTH) | `/auth/selecionar-papel` + `/auth/cadastro` ✅ existem |
| `POST /api/auth/refresh/` 🔓 | Renovação automática do `access` | (cliente HTTP) |
| `GET /api/me/` 🔒 | Utilizador da sessão e perfis (`student_profile`, `mentor_profile`) | (provider de autenticação) |
| `GET /api/categories/` 🔓 | Especialidades no registo de mentor, filtros | (componentes) |

### P1 — Descoberta pública

| Endpoint | Uso | Tela |
|---|---|---|
| `GET /api/discovery/search/` 🔓 | Busca de aulas publicadas (`q`, `category`, `type`, `modality`, `max_price`, `free`) com `score` e `reasons` | `/` — catálogo de aulas ✅ |
| `GET /api/courses/{id}/` 🔓 | Detalhe da aula com mentor, turmas e encontros | `/aulas/[id]` ✅ |
| `GET /api/mentors/` 🔓 | Diretório público de mentores (`search`, `specialties`) | `/mentores` (diretório) e `/mentor?id=` (perfil) ✅ |
| `GET /api/categories/{id}/` 🔓 | Detalhe de categoria | (opcional) |
| `GET /api/courses/` 🔓 | Lista paginada de aulas | alternativa ao `search` |

### P1 — Estudante: inscrição e pagamento

| Endpoint | Uso | Tela |
|---|---|---|
| `POST /api/student/enrollments/` 🔒 | Pedir inscrição numa turma | botão no detalhe da aula |
| `GET /api/student/enrollments/` 🔒 | Minhas inscrições (paginado) | `/aluno/inscricoes` ✅ |
| `GET /api/student/enrollments/{id}/` 🔒 | Detalhe e estado da inscrição/pagamento | `/aluno/inscricoes/[id]` ✅ |
| `POST /api/student/enrollments/{id}/proof/` 🔒 | Enviar comprovativo (upload) | no detalhe da inscrição |
| `GET /api/student/enrollments/{id}/download-proof/` 🔒 | Baixar o comprovativo enviado | no detalhe da inscrição |
| `POST /api/student/enrollments/{id}/cancel/` 🔒 | Cancelar inscrição | no detalhe da inscrição |

### P1 — Mentor: aulas e gestão de inscrições

| Endpoint | Uso | Tela |
|---|---|---|
| `POST /api/courses/` 🔒 | Criar aula (nasce como `DRAFT`) | **nova** `/dashboard/aulas/nova` |
| `PATCH/PUT /api/courses/{id}/` 🔒 | Editar aula | **nova** `/dashboard/aulas/[id]` |
| `POST /api/courses/{id}/publish/` 🔒 | Publicar | ação na aula |
| `POST /api/courses/{id}/archive/` · `/cancel/` 🔒 | Arquivar / cancelar | ação na aula |
| `DELETE /api/courses/{id}/` 🔒 | Excluir rascunho | ação na aula |
| `GET/POST /api/courses/{id}/sessions/` 🔒 | Listar / criar turmas | editor da aula |
| `PATCH/DELETE /api/sessions/{id}/` 🔒 | Editar / remover turma | editor da aula |
| `GET/POST /api/sessions/{id}/meetings/` 🔒 | Listar / criar encontros | editor da turma |
| `PATCH/DELETE /api/meetings/{id}/` 🔒 | Editar / remover encontro | editor da turma |
| `GET /api/mentor/enrollments/` 🔒 | Pedidos de inscrição recebidos | `/dashboard` — **substituir o mock** do "Quadro de Serviços" |
| `POST .../{id}/approve/` · `/reject/` 🔒 | Aprovar / rejeitar pedido | cartão do pedido |
| `POST .../{id}/confirm-payment/` · `/reject-payment/` 🔒 | Validar comprovativo | cartão do pedido |
| `GET .../{id}/download-proof/` 🔒 | Ver comprovativo do estudante | cartão do pedido |

### P2 — Perfis

| Endpoint | Uso | Tela |
|---|---|---|
| `GET/PATCH /api/me/mentor/` 🔒 · `POST` cria perfil | Perfil de mentor (nome, bio, especialidades, experiência) | `/dashboard/perfil` ✅ |
| `GET/PATCH /api/me/student/` 🔒 · `POST` cria perfil | Perfil de estudante (nome, telefone, bio) | `/aluno/perfil` ✅ |

### P3 — Onboarding com IA e recomendações

| Endpoint | Uso | Tela |
|---|---|---|
| `POST /api/onboarding/start/` 🔒 | Inicia conversa | `/aluno/onboarding` (chat) ✅ |
| `POST /api/onboarding/{id}/message/` 🔒 | Envia mensagem | chat |
| `POST /api/onboarding/{id}/skip/` 🔒 | Pular conversa | chat |
| `GET /api/onboarding/` · `/{id}/` 🔒 | Histórico / retomar | chat |
| `GET/PATCH /api/learning-profile/{id}/` 🔒 | Rever e ajustar perfil extraído | `/aluno/perfil` |
| `GET /api/discovery/recommendations/` 🔒 | Aulas recomendadas | `/aluno/para-voce` e página inicial ✅ |

## Fases de execução

| Fase | Conteúdo | Estado |
|---|---|---|
| 0 | Cliente HTTP com axios (instância `api`, interceptores de JWT e refresh automático, erros do DRF), tipos da API | ✅ feito |
| 1 | Autenticação: login, registo por papel, sessão (`/me`), logout, proteção do dashboard | ✅ feito |
| 2 | Descoberta pública: catálogo de aulas, detalhe da aula (`/aulas/[id]`), diretório e perfil de mentores | ✅ feito |
| 3 | Área do aluno: pedir inscrição, `/aluno/inscricoes` (lista e detalhe), comprovativo, cancelamento | ✅ feito (validar no backend real) |
| 4 | Área do mentor: `/dashboard` com inscrições reais, `/dashboard/aulas` (lista, nova, editor com turmas e encontros) | ✅ feito (validar no backend real) |
| 5 | Perfis: `/dashboard/perfil` (mentor) e `/aluno/perfil` (aluno), criar o segundo perfil na mesma conta | ✅ feito (validar no backend real) |
| 6 | Onboarding com IA (`/aluno/onboarding`), perfil de aprendizagem e recomendações (`/aluno/para-voce`, faixa na página inicial) | ✅ feito (validar no backend real) |

## Sem endpoint na API (continuam mock ou ficam desativados)

- **Mensagens** (`/messages`): não há API de chat.
- **Contacto** (`/contact`): não há endpoint de envio.
- **Recuperar senha** (`/auth/recuperar-senha`): não há endpoint de reset.
- **Login social** (Google/LinkedIn): não existe.
- **Avaliações/estrelas, preço por hora e foto do mentor**: não existem no modelo.
- **Pagamento online**: o fluxo é por comprovativo manual.

## Decisões pendentes

1. ~~**Página inicial:** catálogo de aulas~~ — decidido e feito na fase 2.
2. ~~**Rotas do aluno:** grupo `(student)` com `/aluno/...`~~ — feito na fase 3.
3. **Aulas do próprio mentor:** a API não tem um filtro explícito "minhas aulas" em `GET /api/courses/`.
   Confirmar com o backend se a listagem autenticada já devolve só as do mentor, ou se há um parâmetro.
4. **Base URL da API** em cada ambiente (`NEXT_PUBLIC_API_URL`).

## Observações sobre o contrato (confirmar com o backend)

- Vários endpoints de **ação** (`publish`, `archive`, `approve`, `reject`, …) declaram como corpo o
  próprio recurso (`CourseList`, `EnrollmentRead`). Provavelmente aceitam corpo vazio; para `reject`,
  confirmar se há campo de nota (o `EnrollmentRead` tem `decision_note` só de leitura).
- `GET /api/courses/{id}/sessions/` e `GET /api/sessions/{id}/meetings/` declaram respostas de tipo
  único (`CourseList`, `CourseSession`), mas pelo nome devolvem **listas**. Tratar como array.
- `POST /api/student/enrollments/` não documenta os campos de escrita; presume-se `session` (id da turma).
- `POST .../proof/` não documenta o campo do ficheiro; presume-se `multipart/form-data` com `proof`.
- `download-proof` declara JSON, mas deve devolver o ficheiro (blob).
- `price_amount` é **string decimal** (ex.: `"15000.00"`) e há `currency`; formatar com `formatKz` quando `currency` for `AOA`/`KZ`.
- `topic_details` e `specialty_details` são objetos sem esquema; presume-se `{ id, name }`.

### Confirmado na API real (fase 2)

- `GET /api/discovery/search/` devolve **objeto paginado** (`count`, `next`, `previous`, `results`), não lista
  como o YAML diz. O serviço aceita os dois formatos. Os filtros `category`, `type`, `modality`, `free`,
  `max_price`, `q` e `page_size` são aceites (HTTP 200).
- `GET /api/courses/{id}/` inexistente → `404 {"detail": "No Course matches the given query."}`.
- `specialty_details` vem como `{ id, name, slug }`.
- **Não existe `GET /api/mentors/{id}/`**: o perfil procura o mentor no diretório (`page_size=100`).
- **Não há filtro de aulas por mentor**: o perfil filtra o catálogo publicado pelo `mentor.id`.
  Pedir ao backend um endpoint de detalhe de mentor e um filtro `mentor` na busca.
- O catálogo carrega até 100 aulas e ordena/pagina no cliente, porque a busca não tem ordenação por
  preço. Migrar para paginação no servidor quando o volume crescer.

### A confirmar no backend (fase 3)

O schema publicado em `/api/schema/` é igual ao YAML, por isso estes pontos continuam por confirmar.
Estão isolados em `src/services/enrollment.service.ts`:

- **Criar inscrição:** o frontend envia `{ "session": <id da turma>, "course": <id da aula> }`.
- **Comprovativo:** o ficheiro vai em `multipart/form-data` com os campos `payment_proof` **e** `proof`
  (constante `PROOF_FIELD_NAMES`). Reduzir para o nome certo quando confirmado.
- **Limites do comprovativo** (só validados no cliente): JPG, PNG, WEBP ou PDF, até 5 MB.
- **Cancelamento:** o frontend permite cancelar enquanto a inscrição está ativa e o pagamento não foi
  confirmado. Confirmar a regra do backend.

### A confirmar no backend (fase 4)

Isolado em `src/services/mentor-course.service.ts` e `src/services/mentor-enrollment.service.ts`:

- **Minhas aulas:** o frontend pede `GET /api/courses/` autenticado e filtra pelo `mentor.id` do utilizador.
  Confirmar se esta listagem inclui os **rascunhos** do próprio mentor; se não, é preciso um endpoint
  (ou filtro) para as aulas do mentor, senão rascunhos recém-criados não aparecem na lista.
- **Criar turma:** `POST /api/courses/{id}/sessions/` com `{ course, name, capacity, is_active }`.
- **Criar encontro:** `POST /api/sessions/{id}/meetings/` com `{ session, starts_at, ends_at, location }`
  (datas em ISO UTC, convertidas a partir da hora local).
- **Recusar pedido / comprovativo:** o frontend envia `{ "decision_note": "..." }` quando há motivo.
- **Publicar:** o frontend não bloqueia; se a API exigir turma ativa, mostra a mensagem dela.
- O calendário do dashboard pede o detalhe de até 10 aulas para montar os encontros (não há endpoint
  de "encontros do mentor").

### A confirmar no backend (fase 5)

- `GET /api/me/mentor/` e `/api/me/student/` devolvem **404** quando o perfil não existe (documentado);
  o frontend trata como "sem perfil".
- Criar o segundo perfil (`POST`) transforma a conta em aluno **e** mentor. Confirmar que o backend permite
  isto para contas registadas só com um papel.

### A confirmar no backend (fase 6)

Isolado em `src/services/onboarding.service.ts`:

- **Enviar mensagem:** `POST /api/onboarding/{id}/message/` com `{ "content": "...", "message": "..." }`
  (o corpo não está documentado). Reduzir para o campo certo quando confirmado.
- **Id do perfil de aprendizagem:** nenhum endpoint o devolve. O frontend usa o **id do perfil de aluno**
  em `GET/PATCH /api/learning-profile/{id}/` e trata 404 como "perfil ainda não gerado". Se o id for outro,
  é preciso expô-lo (ex.: em `/api/me/` ou na resposta da conversa concluída).
- **Recomendações:** aceita lista (como no YAML) ou objeto paginado (como a busca real).
- O frontend esconde mensagens com `role: SYSTEM` e considera a conversa terminada quando `status` passa a
  `COMPLETED`.
- Depois do cadastro, alunos novos vão para `/aluno/onboarding`.
