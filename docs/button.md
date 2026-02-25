# Button Component

Componente de botão reutilizável, tipado em **TypeScript**, com suporte
a **variantes**, **tamanhos**, **estado de loading** e **forwardRef**,
seguindo princípios de **Clean Code** e **acessibilidade básica**.

------------------------------------------------------------------------

## Importação

``` ts
import { Button } from "@/components/ui/button"
```

------------------------------------------------------------------------

## Props disponíveis

O componente estende todas as props nativas de um `<button />`.

------------------------------------------------------------------------

### `variant`

Define o estilo visual do botão.

``` ts
type ButtonVariant = "primary" | "secondary" | "ghost"
```

  Variante    Descrição
  ----------- ---------------------------------------------------
  primary     Ação principal da interface
  secondary   Ação secundária
  ghost       Ação menos intrusiva (ex: links, ações opcionais)

**Default:** `"primary"`

------------------------------------------------------------------------

### `size`

Define o tamanho do botão.

``` ts
type ButtonSize = "sm" | "md" | "lg"
```

  Size   Altura   Uso comum
  ------ -------- --------------------------
  sm     40px     Tabelas, ações compactas
  md     48px     Padrão da aplicação
  lg     56px     CTAs principais

**Default:** `"md"`

------------------------------------------------------------------------

### `isLoading`

Controla o estado de carregamento.

``` ts
isLoading?: boolean
```

-   Exibe um spinner animado\
-   Desabilita automaticamente o botão\
-   Evita múltiplos submits

**Default:** `false`

------------------------------------------------------------------------

### `disabled`

Funciona normalmente, mas também é automaticamente ativado quando
`isLoading = true`.

------------------------------------------------------------------------

### `className`

Permite extender ou sobrescrever estilos via Tailwind.

------------------------------------------------------------------------

## Exemplos de uso

### Botão simples

``` tsx
<Button>Salvar</Button>
```

------------------------------------------------------------------------

### Botão com variante e tamanho

``` tsx
<Button variant="secondary" size="sm">
  Cancelar
</Button>
```

------------------------------------------------------------------------

### Botão Ghost

``` tsx
<Button variant="ghost">
  Ver detalhes
</Button>
```

------------------------------------------------------------------------

### Botão com loading (ex: submit de formulário)

``` tsx
<Button isLoading>
  Entrar
</Button>
```

💡 O botão é automaticamente desabilitado durante o loading.

------------------------------------------------------------------------

### Botão desabilitado manualmente

``` tsx
<Button disabled>
  Indisponível
</Button>
```

------------------------------------------------------------------------

### Usando com `ref` (forwardRef)

Ideal para foco automático ou integrações com libs externas.

``` tsx
const buttonRef = useRef<HTMLButtonElement>(null)

<Button ref={buttonRef}>
  Focar
</Button>
```

------------------------------------------------------------------------

## Boas práticas

-   Use `primary` apenas para **uma ação principal por tela**
-   Prefira `secondary` para ações alternativas
-   `ghost` é perfeito para ações em listas e tabelas
-   Sempre use `isLoading` em ações assíncronas

------------------------------------------------------------------------

## Decisões de arquitetura

-   ✅ `forwardRef` → compatível com libs externas e acessibilidade\
-   ✅ Tipagens explícitas → DX e segurança\
-   ✅ `clsx` → composição de classes limpa e legível\
-   ✅ Estados derivados (`isDisabled`) → lógica previsível\
-   ✅ Tailwind → consistência visual e escalabilidade
