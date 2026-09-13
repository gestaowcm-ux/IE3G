# Diretrizes do Projeto & Design System Padrão

Este projeto utiliza oficialmente o **Nike Design System** definido e detalhado no arquivo [`DESIGN.md`](./DESIGN.md).

Todos os desenvolvedores e assistentes de inteligência artificial (AI agents) **DEVEM** seguir rigorosamente as especificações deste arquivo ao criar ou modificar qualquer elemento de interface (UI), estilização, layout e experiência do usuário (UX).

---

## 1. Regra Fundamental: Consulta Obrigatória ao `DESIGN.md`
Antes de escrever, refatorar ou sugerir qualquer componente visual ou tela:
- Consulte sempre o arquivo [`DESIGN.md`](./DESIGN.md) na raiz do projeto.
- Respeite fielmente a hierarquia tipográfica, paleta cromática, raios de borda e restrições de espaçamento.

---

## 2. Pilares de Design (Nike Design System)

### A. Cores & Superfícies
- **Nike Black / Ink (`#111111`)**: Cor primária para botões de ação principal (CTAs), textos principais e destaques.
- **Canvas / Pure White (`#ffffff`)**: Fundo padrão da página e contraste em elementos escuros.
- **Soft Cloud (`#f5f5f5`)**: O palco neutro para imagens de produtos, campos de busca secundários e CTAs de baixa ênfase.
- **Hairline (`#cacacb` / `#e5e5e5`)**: Divisores finos de 1px.
- **Sale Red (`#d30005`)**: Exclusivo para sinalização de preços promocionais/descontos. Nunca use vermelho em botões ou elementos cromáticos decorativos.
- **Acentos**: Acentos cromáticos secundários (como rosa, verde e teal) são restritos a tags editoriais, swatches e fotos de produto — a UI estrutural permanece quase monocromática.

### B. Formas & Geometria
- **Pill Shape (`rounded-full` / `30px`)**: Todas as ações clicáveis (botões primários, botões secundários, chips de filtro e busca) utilizam geometria de pílula. **Nunca utilize botões retangulares ou com cantos vivos.**
- **Zero Radius para Cards (`rounded: 0px`)**: Cards de produto, mosaicos de campanha e contêineres estruturais têm raio zero (`0px`). A própria fotografia é o card.
- **Zero Drop-Shadow**: Não use sombras projetadas (`box-shadow`) ou elevações volumétricas em cards e botões. O sistema é limpo, flat e editorial. A profundidade vem das fotografias.

### C. Tipografia & Hierarquia
- **Display de Campanha (Hero)**: Tipografia monumental em maiúsculas (Futura ND / Bebas Neue / Anton, ~96px, line-height 0.9, uppercase) sobreposta diretamente em fotos editoriais full-bleed.
- **Headings & Títulos**: Helvetica Now Display Medium / Inter (32px para `heading-xl`, 24px para `heading-lg`, 16px para `heading-md`).
- **Corpo & UI**: Helvetica Now Text / Inter (14px a 16px, pesos 400 e 500).

### D. Espaçamento & Grid
- Base modular de 8px:
  - `xxs`: 2px | `xs`: 4px | `sm`: 8px | `md`: 12px | `lg`: 18px | `xl`: 24px | `xxl`: 30px
  - Ritmo vertical de seções: 48px (`section`).

---

## 3. Componentes Padrão

- **Botão Primário (`button-primary`)**: Fundo `#111111`, texto `#ffffff`, formato pílula (`rounded-full`), altura 48px, padding horizontal 32px.
- **Botão Secundário (`button-secondary`)**: Fundo `#f5f5f5`, texto `#111111`, formato pílula, altura 48px.
- **Botão em Imagem (`button-outline-on-image`)**: Fundo `#ffffff`, texto `#111111`, formato pílula posicionado no canto inferior esquerdo de imagens de campanha.
- **Card de Produto (`product-card`)**: Foto full-bleed em fundo `#f5f5f5` sem padding interno; nome, categoria e preço logo abaixo com espaçamento de 8px.
