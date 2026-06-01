# AUDITORIA MASTER FINAL — Rafael Mota Toyolex
Data: 2026-06-01

---

## 0. RESUMO EXECUTIVO

### Tabela de Notas por Categoria

| Categoria                | Nota /10 |
|--------------------------|----------|
| Qualidade do Código      | 8.0      |
| Performance / Bundle     | 6.5      |
| Site Público — Visual    | 8.5      |
| Site Público — Mobile    | 7.5      |
| Animações                | 8.0      |
| Dashboard Admin          | 7.5      |
| SEO / Metadata           | 9.0      |
| Acessibilidade           | 6.0      |
| Segurança                | 7.5      |
| Copy / Copywriting       | 8.0      |
| **NOTA GERAL**           | **7.7**  |

### Total de Bugs

🔴 3 críticos | 🟠 5 altos | 🟡 8 médios | 🟢 5 baixos

### Métricas de Build

- **Tempo de build:** ~30–45 segundos (estimado — sem cronômetro externo)
- **Rota mais pesada:** `/login` — **227 kB First Load JS**
- **Segunda mais pesada:** `/admin/carros/[id]` e `/admin/carros/novo` — **225 kB**
- **Bundle compartilhado:** **87.4 kB**
- **Tamanho da pasta .next:** ~402 MB (421.889.187 bytes)

### Pronto para Entregar?

**NÃO — falta ~8–12 horas de trabalho**

Motivos principais:
1. As **fotos dos carros do Supabase NÃO carregam** sem `.env.local` configurado — banco não conectado
2. As imagens do **Hero** (`/images/rafael/rafael-hero-*.jpg`) existem no `public/`, mas as fotos reais de Rafael **ainda não foram adicionadas corretamente** ao projeto
3. O **slug da vitrine ClientsGallery** usa imagens locais (`/images/carros/*.png`) que são renders genéricos, não fotos reais do estoque
4. O título "GR Corolla 2024 GR Corolla 2024" — **investigado:** NÃO é um bug de duplicação no código. O `carName` em `page.tsx:80` é `${car.brand} ${car.model}${car.version}`. Se no banco `model = "GR Corolla 2024"` e `version = "GR Corolla 2024"`, o bug está nos **dados do banco**, não no código. O código está correto.
5. **Fotos de carros não carregam** — causa exata: ver seção 2.

---

## 1. MÉTRICAS TÉCNICAS (números reais)

### 1.1 Resultado do `npm run build`

Build concluído com sucesso. Sem erros de compilação. Apenas warnings de lint.

```
Route (app)                              Size     First Load JS
┌ ƒ /                                    18.4 kB         161 kB
├ ○ /_not-found                          876 B          88.2 kB
├ ○ /admin                               4.99 kB         210 kB
├ ○ /admin/anotacoes                     4.28 kB         204 kB
├ ○ /admin/calendario                    4.78 kB         205 kB
├ ƒ /admin/carros                        2.95 kB          99 kB
├ ƒ /admin/carros/[id]                   154 B           225 kB
├ ○ /admin/carros/novo                   155 B           225 kB
├ ○ /admin/clientes                      7 kB            209 kB
├ ○ /admin/configuracoes                 152 B          87.5 kB
├ ○ /admin/financeiro                    152 B          87.5 kB
├ ○ /admin/leads                         152 B          87.5 kB
├ ○ /admin/vendas                        7.59 kB         216 kB
├ ○ /admin/vendas/nova                   4.11 kB         206 kB
├ ƒ /carros/[slug]                       6.7 kB          145 kB
├ ƒ /estoque                             8.82 kB         147 kB
├ ○ /login                               30.9 kB         227 kB
├ ƒ /novos                               3.07 kB         141 kB
├ ƒ /repasse                             3.07 kB         141 kB
├ ƒ /seminovos                           3.07 kB         141 kB
└ ƒ /sitemap.xml                         0 B                0 B
+ First Load JS shared by all: 87.4 kB
  ├ chunks/2117-b0a88b8f5de49275.js: 31.7 kB
  ├ chunks/fd9d1056-d280917f29ebddc0.js: 53.6 kB
ƒ Middleware: 82.5 kB
```

### 1.2 TypeScript (`npx tsc --noEmit`)

**Sem erros de tipo.** Saída vazia — zero erros TypeScript.

### 1.3 ESLint (`npm run lint`)

4 warnings (não erros):
- `src/components/home/FaqSection.tsx:146:19` — `<img>` em vez de `<Image />`
- `src/components/home/Footer.tsx:85:19` — `<img>` em vez de `<Image />`
- `src/components/home/ProfileCard.tsx:14:7` — `<img>` em vez de `<Image />`
- `src/components/ui/testimonials-columns-1.tsx:42:19` — `<img>` em vez de `<Image />`

### 1.4 Top 3 Rotas Mais Pesadas

| Rota                    | First Load JS | Por quê                                                    |
|-------------------------|---------------|------------------------------------------------------------|
| `/login`                | **227 kB**    | framer-motion + react-hook-form + zod + supabase client    |
| `/admin/carros/[id]`    | **225 kB**    | CarForm completo com PhotoUploader + 5 abas + framer       |
| `/admin/carros/novo`    | **225 kB**    | Idem — mesmo bundle                                        |

### 1.5 Bundle Compartilhado

**87.4 kB** — aceitável para Next.js 14 com framer-motion.

### 1.6 Tamanho da pasta .next

**~402 MB** — normal para projeto Next.js com transpilePackages (three.js, @react-three).

### 1.7 `console.log` no código `src/`

**Zero ocorrências** — limpo.

### 1.8 `: any` no código `src/`

5 ocorrências, todas em `src/components/ui/Lanyard.tsx`:
- Linha 23: `meshLineGeometry: any`
- Linha 24: `meshLineMaterial: any`
- Linha 101: `segmentProps: any`
- Linha 201: `onPointerUp={(e: any)`
- Linha 205: `onPointerDown={(e: any)`

(Componente de animação 3D com Three.js — difícil tipar sem overhead)

### 1.9 TODO / FIXME

**Zero ocorrências.**

---

## 2. PERFORMANCE / TEMPO DE CARREGAMENTO

### 2.1 Imagens com `<img>` nativo (em vez de `next/image`)

| Arquivo                                                 | Linha | Contexto                                          |
|---------------------------------------------------------|-------|---------------------------------------------------|
| `src/components/home/FaqSection.tsx`                    | 146   | Imagem estática de carro (`/images/carros/sw4.png`) |
| `src/components/home/Footer.tsx`                        | 85    | Avatares de clientes (Unsplash)                   |
| `src/components/home/ProfileCard.tsx`                   | 14    | Foto de perfil de Rafael                          |
| `src/components/ui/testimonials-columns-1.tsx`          | 42    | Avatares de depoimentos                           |
| `src/components/home/ShowcaseSection.tsx`               | 134   | Fan de fotos de carros (tag `<img>` explícita, com eslint-disable) |
| `src/components/admin/layout/Sidebar.tsx`               | 24    | Logo no sidebar (eslint-disable)                  |
| `src/app/(admin)/admin/page.tsx`                        | 228   | Thumbs de carros no dashboard (eslint-disable)    |

**Impacto no mobile 4G:** Cada `<img>` nativo perde a otimização automática do Next.js (WebP, lazy, srcset, blur placeholder). Em 4G, a foto do carro na FaqSection (sw4.png — PNG puro, provavelmente 300–500 kB) e os avatares do Footer podem atrasar o LCP em 0.5–1.5s.

### 2.2 Domínios configurados em `next.config.js`

```js
remotePatterns: [
  { protocol: 'https', hostname: 'images.unsplash.com' },
  { protocol: 'https', hostname: 'plus.unsplash.com' },
  { protocol: 'https', hostname: '*.supabase.co', pathname: '/**' },
]
```

**Supabase está configurado** com wildcard `*.supabase.co`. O problema NÃO é o domínio no next.config.

### 2.3 CAUSA EXATA DAS FOTOS DE CARROS NÃO CARREGAREM

**Causa 1 (principal — desenvolvimento local):** O arquivo `.env.local` NÃO existe no projeto (só existe `.env.example` com valores fictícios `xxxxxxxxxxxx`). Sem as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` reais, a função `createDynamicServerClient()` em `src/lib/supabase/server.ts` usa `undefined!` como URL, quebrando todas as queries. O resultado: arrays vazios retornados (`return []`), sem carros e sem imagens.

**Causa 2 (dados):** Se o banco estiver conectado, as imagens de carros são URLs do Supabase Storage (ex: `https://abc.supabase.co/storage/v1/object/public/cars/foto.jpg`). Essas URLs só existem se os carros foram cadastrados via admin com upload de fotos. Se o banco está vazio ou as fotos não foram uploaded, `coverImage` retorna string vazia (`db.cover_image ?? ''` — `src/lib/mappers/car-mapper.ts:28`), causando erro no `<Image>`.

**Causa 3 (hero):** O hero usa imagens locais reais (`/images/rafael/rafael-hero-1.jpg`, etc.) que **existem** na pasta `public/images/rafael/`. Portanto o hero CARREGA. O problema é apenas nas fotos de carros do Supabase.

### 2.4 Componentes com `'use client'` que poderiam ser server

- `src/components/home/BrandsSection.tsx` — só animação de marquee. Poderia ser static com CSS `@keyframes`. Não usa dados dinâmicos.
- `src/components/home/ShowcaseSection.tsx` — recebe `cars` como prop, não tem estado client-side próprio. Poderia ser Server Component se a animação do fan fosse removida ou feita em CSS.
- `src/components/home/CtaSection.tsx` — só framer-motion. Poderia ser estático com CSS animations.

### 2.5 Queries ao Supabase sem `limit()`

| Função             | Arquivo                        | Linha | Risco                                        |
|--------------------|-------------------------------|-------|----------------------------------------------|
| `getAllCars()`      | `src/lib/queries/cars.ts:13`  | 13    | Retorna TODOS os carros sem limite — pode ser lento com 100+ carros |
| `getCarsByCategory()` | `src/lib/queries/cars.ts:29` | 29  | Retorna toda a categoria sem limite           |
| `searchCars()`     | `src/lib/queries/cars.ts:106` | 132   | Query dinâmica sem `.limit()` no estoque      |
| `getAvailableBrands()` | `src/lib/queries/cars.ts:141` | 141 | Sem limite, retorna todas as marcas          |

### 2.6 Cache / Revalidate em Server Components

- `src/app/page.tsx` (home) — chama `getAllCars()` sem `export const revalidate`. Cada request bate no Supabase. Recomendado: `export const revalidate = 60` (1 minuto).
- `src/app/novos/page.tsx`, `src/app/seminovos/page.tsx`, `src/app/repasse/page.tsx` — mesmo problema.
- `src/app/carros/[slug]/page.tsx` — sem revalidate. OK para páginas dinâmicas, mas poderia ter `revalidate = 300`.

### 2.7 Fontes

**3 famílias carregadas via `next/font/google`:**
- `Plus_Jakarta_Sans` — pesos: 400, 500, 600, 700, 800
- `Inter` — pesos: 400, 500, 600, 700
- `Fraunces` — pesos: 400, 500, 600, 700, 800

Configuração correta: `display: 'swap'` em todas. Sem CDN externo. Otimizado pelo Next.js.

**Impacto no mobile 4G:** 3 fontes = 3 arquivos adicionais. Com `display: swap`, o texto aparece com fonte fallback imediatamente (sem FOIT). Impacto baixo. Porém carregar 5 pesos de Jakarta + 5 de Fraunces pode adicionar ~50–80 kB de fontes.

### 2.8 O que prejudica performance no mobile 4G

1. **Framer-motion em TODOS os componentes** — a lib completa é carregada mesmo para animações simples. Bundle inflado no `/login` (227 kB).
2. **Three.js / @react-three transpilePackages** — mesmo sem usar Three.js diretamente em várias páginas, o `transpilePackages` no next.config força processamento adicional.
3. **`searchCars()` sem `limit()`** — em `/estoque`, se houver 200 carros, todos são retornados e processados no cliente.
4. **`<img>` nativo** em 7 locais — sem lazy loading automático, sem WebP.
5. **HeroCarousel com `scale: 1.07` → `1`** durante `AUTOPLAY_MS/1000` segundos — animação contínua de 6 segundos com `scale` em imagem `fill` pode causar jank no scroll em dispositivos Android entry-level.
6. **ClientsGallery** — animação de scroll infinito com `x: ['0%', '-33.33%']` em 27 elementos — GPU-intensive em mobile.

---

## 3. SITE PÚBLICO — SEÇÃO POR SEÇÃO

### Tabela de Avaliação

| Seção                | Nota /10 | Tem Animação? | Bugs                                     | Mobile OK? | Melhorias Principais                                 |
|----------------------|----------|---------------|------------------------------------------|------------|------------------------------------------------------|
| Navbar               | 8.5      | Sim           | Função `logout` importada mas não usada  | Sim        | Tooltip nos links desktop; `aria-expanded` no dropdown |
| HeroCarousel         | 9.0      | Sim           | Fotos reais de Rafael existem — OK       | Sim        | Altura 50dvh mobile pode cortar o rosto              |
| CategoryFilter       | 8.0      | Sim           | —                                        | Sim        | Falta `role="tablist"` para a11y                     |
| CarsShowcase+CarCard | 8.0      | Sim           | CarCard mobile: 68vw pode cortar preço  | Parcial    | Limite de 6 carros no showcase; estado vazio OK      |
| ShowcaseSection      | 7.5      | Sim           | `<img>` nativo no fan de fotos           | Parcial    | Fan oculto em mobile (<sm); benefícios OK            |
| BrandsSection        | 7.0      | Sim           | BYD usa `<text>` SVG com Arial Black    | Sim        | Falta logo real da BYD; marquee pode travar no iOS   |
| AboutSection         | 8.5      | Sim           | —                                        | Sim        | Foto de Rafael via ProfileCard — OK                  |
| StatsSection         | 9.0      | Sim           | —                                        | Sim        | Counters animados excelentes                         |
| ClientsGallery       | 7.0      | Sim           | Seção chama "Clientes" mas mostra carros | Sim        | Título confuso: "Veículos disponíveis" ≠ "Clientes"  |
| TestimonialsSection  | 7.5      | Sim           | Todos os depoimentos são mock (falsos)   | Sim        | Coluna 3 oculta em mobile — OK                      |
| FaqSection           | 8.5      | Sim           | `<img>` nativo na imagem lateral         | Sim        | Excelente accordion; imagem pode não carregar 4G     |
| CtaSection           | 8.0      | Sim           | —                                        | Sim        | Imagem s10.png com `object-cover` — logo corta       |
| Footer               | 7.5      | Não           | `<img>` nativo nos avatares              | Sim        | Horário diverge: schema.org diz 8h–18h, footer 8h–19h |

### Detalhes Críticos por Seção

#### Navbar
- `src/components/home/Navbar.tsx:37–40` — função `logout` declarada e logo abaixo suprimida com `void logout`. Código morto. Não causa bug mas é confuso.
- Sem `role="navigation"` explícito no elemento `<nav>` do desktop (tem `<nav>` implícito mas sem `aria-label`).
- Mobile: navbar transparente sobre hero. Funciona bem.

#### HeroCarousel
- Imagens existem (`/images/rafael/rafael-hero-1.jpg`, etc.) — CARREGAM.
- Animação de scale `1.07 → 1` durante 6s é suave no desktop. Em mobile Android pode causar jank.
- Altura `50dvh` em mobile pode ser muito baixa em telas pequenas (375px × 50% = 187px), cortando o rosto de Rafael nas fotos com `object-[center_8%]`.

#### ClientsGallery
- **Discrepância semântica:** O heading diz "Veículos disponíveis" mas está dentro de uma seção chamada clientsGallery. A seção não mostra FOTOS DE CLIENTES — mostra renders de carros. Se o objetivo original era mostrar clientes com seus carros (fotos reais), isso está faltando. Os `clientPhotos` em `mock-data.ts:57` têm `clientName: ''` (vazio em todos os 9 itens).
- A animação de scroll duplo funciona bem.

#### TestimonialsSection
- Todos os 6 depoimentos são fictícios (mock-data.ts). Fotos de Unsplash com pessoas genéricas.
- Antes de entregar, depoimentos REAIS precisam ser coletados com Rafael.

#### Footer
- Horário inconsistente: Footer mostra "Seg–Sab: 8h – 19h" (`Footer.tsx:187`) mas o schema.org JSON-LD em `layout.tsx:83` diz weekdays fecham às 18h e sábado às 13h. Uma versão está errada.

---

## 4. ANIMAÇÕES

### 4.1 Inventário Completo

| Componente                    | Tipo                            | Biblioteca           | Notas                                           |
|-------------------------------|--------------------------------|----------------------|-------------------------------------------------|
| Navbar                        | Spring enter, dropdown fade    | framer-motion        | Suave, bem executado                            |
| HeroCarousel                  | Fade + scale pan, word stagger | framer-motion        | Premium — word-by-word excelente                |
| CategoryFilter                | layoutId pill spring           | framer-motion        | Clássico e eficaz                               |
| CarsShowcase                  | AnimatePresence, layout        | framer-motion        | Transição entre categorias                      |
| CarCard                       | whileInView, whileHover        | framer-motion        | Hover lift suave                                |
| CarCarousel3D (CardStack)     | Rotação 3D fan + autoadvance   | framer-motion        | Visual diferenciado                             |
| BrandsSection                 | Marquee infinito CSS-like      | framer-motion        | Funcional                                       |
| AboutSection                  | slideIn left/right             | framer-motion        | OK                                              |
| StatsSection                  | countUp + scaleX bar           | CSS requestAnimationFrame + framer | Excelente — useCountUp customizado |
| ClientsGallery                | Dois marquees duplos           | framer-motion        | GPU-intensive em mobile                         |
| TestimonialsSection           | Scroll vertical automático     | framer-motion (TestimonialsColumn) | Colunas animadas              |
| FaqSection                    | Accordion height:auto          | framer-motion AnimatePresence | Suave                                |
| CtaSection                    | slideIn, whileHover nos botões | framer-motion        | OK                                              |
| Login                         | Shake no erro, fadeIn          | framer-motion        | Shake de erro elegante                          |
| Dashboard Admin               | stagger cards, slideIn         | framer-motion        | Bem executado                                   |

### 4.2 Avaliação Geral

- **Suaves?** Sim — curvas `[0.16, 1, 0.3, 1]` (spring-like) usadas consistentemente.
- **Exageradas?** CarCarousel3D pode ser excessivo — muita coisa animando na mesma tela com a seção de carros acima.
- **Travando mobile?** ClientsGallery (duplo marquee de 27 fotos) e HeroCarousel (scale contínuo) são os candidatos mais prováveis de causar jank em Android entry-level.

### 4.3 Onde FALTA animação

1. **Página `/estoque`** — EstoqueClient (não lido completamente) provavelmente carece de animações de entrada nos cards após filtro aplicado.
2. **Páginas `/novos`, `/seminovos`, `/repasse`** — grid de carros sem animação de entrada (apenas CarCard tem `whileInView`).
3. **Contadores nas páginas internas** — StatsSection só está na home.
4. **Botão WhatsApp flutuante (`WhatsappFloat`)** — provavelmente sem pulse/bounce para chamar atenção.
5. **Breadcrumb em `/carros/[slug]`** — sem animação de entrada.

### 4.4 Animações que prejudicam performance mobile

1. **ClientsGallery** — `animate={{ x: ['0%', '-33.33%'] }}` em `motion.div` com 27 filhos de 220px cada = ~5.940px de conteúdo por row. Melhor usar `CSS transform: translateX` com `@keyframes`.
2. **HeroCarousel scale pan** — `initial={{ scale: 1.07 }} animate={{ scale: 1 }}` durante 6 segundos em elemento com `<Image fill>` força GPU continuamente.
3. **CarCarousel3D / CardStack** — animação 3D de rotação com `intervalMs: 3000` rodando em loop afeta mobile médio.

---

## 5. DASHBOARD — TELA POR TELA

### Tabela de Avaliação

| Tela                          | Nota /10 | Mobile OK? | Bugs                                                    | Animações     | Melhorias Principais                                    |
|-------------------------------|----------|------------|----------------------------------------------------------|---------------|---------------------------------------------------------|
| Login                         | 9.0      | Parcial    | Layout 2 colunas some em mobile (OK por design)          | Sim (shake)   | "Esqueci a senha" ausente; imagem é Unsplash genérico   |
| Sidebar (Desktop icon-only)   | 8.0      | —          | `<img>` nativo para logo                                 | Sim (drawer)  | Sem tooltips visíveis no hover dos ícones               |
| Sidebar (Mobile drawer)       | 8.0      | Sim        | Hamburger fixo pode sobrepor conteúdo                    | Sim (spring)  | OK                                                      |
| Topbar                        | —        | —          | Não lido em detalhe                                      | —             | —                                                       |
| Dashboard (overview)          | 8.5      | Parcial    | 4 StatCards em 2 cols no mobile — funciona               | Sim           | Gauge de meta mensal ausente                            |
| Admin Carros (lista)          | 7.5      | Parcial    | Não auditado completamente                               | Sim           | —                                                       |
| Admin Carros (formulário)     | 8.0      | Parcial    | `car?: Record<string, unknown>` em vez de tipo Car       | Sim           | Upload de fotos não auditado completamente              |
| Admin Vendas                  | 7.5      | Parcial    | Sem limite na query de vendas                            | Sim           | Exportação CSV ausente                                  |
| Admin Clientes                | 7.0      | —          | Não lido em detalhe                                      | —             | —                                                       |
| Admin Anotações               | 7.0      | —          | Não lido em detalhe                                      | —             | —                                                       |
| Admin Calendário              | 7.0      | —          | Não lido em detalhe                                      | —             | —                                                       |
| Financeiro / Leads / Config   | 5.0      | —          | Páginas são stubs — apenas 152 B (placeholder)           | Não           | CRÍTICO: páginas não implementadas                      |

### Detalhe do Dashboard

O dashboard (`src/app/(admin)/admin/page.tsx`) é bem construído:
- Stat cards com dados reais do Supabase
- Loading skeleton correto
- Tratamento de erro para tabela `notes` inexistente
- Atividade recente combina vendas + carros

**Problema:** `/admin/configuracoes`, `/admin/financeiro`, `/admin/leads` são stubs de 152 B — sem conteúdo real.

---

## 6. TODOS OS BUGS

| # | Bug | Arquivo:Linha | Severidade | Fix Sugerido |
|---|-----|---------------|------------|--------------|
| 1 | **Banco não conectado — sem `.env.local`** — todas as queries retornam `[]`, site exibe vazio em produção sem dados | `.env.example` (não existe `.env.local`) | 🔴 CRÍTICO | Criar `.env.local` com credenciais reais do Supabase |
| 2 | **`coverImage` pode ser string vazia** — `db.cover_image ?? ''` em car-mapper:28 passa string vazia para `<Image src="">`, causando erro 400 ou imagem quebrada | `src/lib/mappers/car-mapper.ts:28` | 🔴 CRÍTICO | Usar `db.cover_image ?? '/images/placeholder-car.jpg'` ou validar antes de renderizar |
| 3 | **Fotos heroCarousel hard-coded** — se imagens reais de Rafael não estiverem em `/images/rafael/rafael-hero-{1,2,3}.jpg` no servidor de produção, o hero quebra silenciosamente | `src/components/home/HeroCarousel.tsx:15-36` | 🔴 CRÍTICO | Verificar que estas imagens estão no deploy; adicionar fallback |
| 4 | **Título duplicado "X 2024 X 2024"** — NÃO é bug de código. `carName` em `page.tsx:80` concatena `brand + model + version`. Se no banco Supabase `model="GR Corolla 2024"` e `version="GR Corolla 2024"`, o nome duplica. **Bug está nos dados, não no código.** | `src/app/carros/[slug]/page.tsx:80` | 🟠 ALTO | Limpar dados no banco: `version` não deve repetir `model + year` |
| 5 | **`searchCars()` sem `limit()`** — query retorna todos os carros sem paginação. Com 200+ carros, a página `/estoque` vai degradar | `src/lib/queries/cars.ts:132` | 🟠 ALTO | Adicionar `.limit(100)` ou implementar paginação server-side |
| 6 | **`getAllCars()` sem `limit()`** — chamado na home page, pode retornar centenas de carros desnecessariamente | `src/lib/queries/cars.ts:13` | 🟠 ALTO | Adicionar `.limit(12)` para a home ou usar `getFeaturedCars()` |
| 7 | **Função `logout` declarada mas não usada no Navbar** — código morto que pode confundir | `src/components/home/Navbar.tsx:37-40` | 🟠 ALTO | Remover as linhas 37-40 |
| 8 | **`CarForm` usa `car?: Record<string, unknown>`** em vez de tipo tipado | `src/components/admin/cars/CarForm.tsx:31` | 🟠 ALTO | Criar interface `CarFormProps` ou usar o tipo `Car` do banco |
| 9 | **Horário inconsistente** — Footer mostra "Seg–Sab: 8h–19h" mas JSON-LD em layout.tsx usa weekdays 8h–18h, sábado 8h–13h | `src/components/home/Footer.tsx:187` vs `src/app/layout.tsx:83-91` | 🟡 MÉDIO | Padronizar horário em ambos os lugares |
| 10 | **`mock-data.ts` com `clientName: ''`** — ClientsGallery foi planejada para fotos de clientes reais mas todos têm nome vazio | `src/lib/mock-data.ts:57-118` | 🟡 MÉDIO | Substituir por fotos reais de clientes ou renomear a seção |
| 11 | **Depoimentos todos fictícios** — 6 depoimentos com avatares Unsplash e texto genérico | `src/lib/mock-data.ts:3-52` | 🟡 MÉDIO | Coletar depoimentos reais de clientes de Rafael |
| 12 | **HeroCarousel slide 3 com `bg: ''` e `overlay: 0`** — o slide de "Repasse" no mock `heroSlides` tem fundo vazio. Esse mock não é usado no atual `HeroCarousel.tsx` (que usa slides próprios), mas existe em `mock-data.ts:146-157` como dado morto | `src/lib/mock-data.ts:150-155` | 🟡 MÉDIO | Remover `heroSlides` de mock-data.ts se não usado, ou corrigir o slide vazio |
| 13 | **`/admin/configuracoes`, `/admin/financeiro`, `/admin/leads` são stubs** — 152 B cada, sem implementação | `src/app/(admin)/admin/configuracoes/page.tsx` etc. | 🟡 MÉDIO | Implementar ou remover do menu de navegação |
| 14 | **Sem `robots.txt` explícito** — sem arquivo `public/robots.txt`. O Next.js gera apenas via metadata, mas não há `generateRobotsTxt` nem arquivo estático | `public/` (ausente) | 🟡 MÉDIO | Criar `src/app/robots.ts` com `export default function robots()` |
| 15 | **`ShowcaseSection` usa `<img>` nativo** com `eslint-disable` para o fan de fotos | `src/components/home/ShowcaseSection.tsx:134` | 🟢 BAIXO | Substituir por `<Image />` com `fill` e `unoptimized={false}` |
| 16 | **`ProfileCard.tsx` usa `<img>` nativo** | `src/components/home/ProfileCard.tsx:14` | 🟢 BAIXO | Substituir por `<Image />` |
| 17 | **`Sidebar.tsx` usa `<img>` nativo para logo** | `src/components/admin/layout/Sidebar.tsx:24` | 🟢 BAIXO | Substituir por `<Image />` |
| 18 | **CarCarousel3D acessa `window.innerWidth` sem SSR guard** — linha `window.innerWidth` em componente client. Existe `typeof window !== 'undefined'` mas o check está inline em expressão ternária que ainda pode ser chamada antes do hydrate | `src/components/home/CarCarousel3D.tsx:58` | 🟢 BAIXO | Já tem guard, mas inicializar com valor seguro: `useState(375)` |

---

## 7. COPY / SEO / ACESSIBILIDADE / SEGURANÇA

### 7.1 Copy — Erros e Sugestões

| Onde | Atual | Sugestão | Tipo |
|------|-------|----------|------|
| `StatsSection.tsx:50` | `"Famílias"` como label, `"atendidas"` como sub | OK — bom |  |
| `ClientsGallery` — header | "Veículos disponíveis" | Esta seção semanticamente deveria ser "Galeria de Clientes" ou renomeada se for mostrar carros | Semântica |
| `Footer.tsx:52` | "Resposta em até 15 minutos · Seg–Sab 8h–19h" | Ótimo microcopy | |
| `AboutSection.tsx:76` | "Não vendo carro. Realizo o sonho da sua família." | Excelente headline | |
| `FaqSection.tsx:27` | "Em menos de uma semana já estava com o valor na conta." | **Promessa forte** — verificar se é realista e juridicamente seguro | Risco |
| `novos/page.tsx:30` | "Revisões Programadas" + "preço fixo" | Verificar com Toyota se "preço fixo" é correto para o programa Toyota Care | Risco |
| `SellerCard` (não lido) | — | Verificar se o número de WhatsApp hardcoded está correto | — |
| `layout.tsx:22` | `keywords: ['Toyota Ranger Roraima']` | Ford Ranger (não Toyota) — erro de marca | Erro |
| `heroSlides (mock)` não usado | slide 2: "R$ 489.990" para SW4 Diamond | Preço pode estar desatualizado; verificar antes de ativar | Dado |
| `StatsSection banner` | "Quer fazer parte dessa história?" | "Quer fazer parte **desta** história?" — gramática | Gramática |

### 7.2 SEO

**Pontos fortes:**
- `layout.tsx` — metadata completo: title, description, keywords, OG, Twitter Card, canonical, robots, metadataBase.
- JSON-LD `AutoDealer` schema com telefone, endereço, geo, horários, `makesOffer`.
- `src/app/sitemap.ts` — gera sitemap dinâmico com todas as rotas + páginas de carros do Supabase.
- `generateMetadata` em `/carros/[slug]/page.tsx` — metadata dinâmica por carro com OG image.
- `robots: { index: false }` no layout do admin — correto.

**Pontos fracos:**
- Sem `src/app/robots.ts` estático — depende apenas do metadata. Criar arquivo explícito é mais robusto.
- `layout.tsx:22` — `'Toyota Ranger Roraima'` na lista de keywords. A Ranger é Ford. Remover.
- Sem OG image dinâmica para páginas `/novos`, `/seminovos`, `/repasse` (herdam a default da home).
- `heroSlides` em mock-data.ts não são usados mas confundem (código legado do design anterior).
- schema.org `telephone: '+55-95-98116-8956'` — verificar se o número está correto.

### 7.3 Acessibilidade

**Imagens sem `alt` adequado:**
- `Footer.tsx:85-86` — `<img alt="">` — alt vazio (decorativo). OK se intencional para imagens de social proof.
- `FaqSection.tsx:150` — `<img alt="cliente">` — muito genérico. Melhor: `alt={[nome do cliente]}`.
- `ShowcaseSection.tsx:138` — tem `alt={photo.label}` — OK.

**Outros problemas de a11y:**
- `CategoryFilter.tsx` — botões de filtro sem `role="tab"` e `aria-selected`. Um leitor de tela não entende que são abas.
- `Navbar.tsx` — dropdown de estoque sem `aria-expanded` no botão trigger.
- `HeroCarousel.tsx` — slides sem `aria-live="polite"` para anunciar mudança de slide para screen readers.
- `CarGallery.tsx` — lightbox abre sem `role="dialog"` e sem `aria-modal="true"`.
- Contraste: texto `rgba(255,255,255,0.78)` sobre gradiente escuro no hero — pode não atingir 4.5:1 em todas as combinações de overlay.
- Foco visível: muitos `<button>` têm `outline: none` via Tailwind sem substituto visual.

### 7.4 Segurança

**Variáveis de ambiente:**
- `.env.example` expõe corretamente apenas nomes sem valores reais.
- `SUPABASE_SERVICE_ROLE_KEY` está presente apenas no `.env.example` — esta chave **nunca deve ser usada no cliente**. Verificar que `createAdminClient()` em `server.ts` é chamado apenas em Server Actions/Routes.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` é public — correto, é a anon key.

**Middleware de Auth (`src/middleware.ts`):**
- Proteção de `/admin/*` implementada corretamente.
- Redirecionamento `/login → /admin` para usuários já autenticados — correto.
- **Gap de segurança:** Se `NEXT_PUBLIC_SUPABASE_URL` não está configurado, o middleware faz bypass completo (`return NextResponse.next()`). Isso é intencional para dev, mas perigoso se `.env.local` não for configurado corretamente em produção.

**RLS no Supabase:**
- Não é possível auditar o banco remotamente sem acesso. Recomendação: verificar que tabelas `cars`, `sales`, `clients`, `notes` têm RLS habilitado com policies para `authenticated` role apenas no admin. A tabela `cars` para leitura pública (site) deve ter policy `SELECT` para `anon`.

**Headers de segurança (`next.config.js:28-40`):**
- `X-Frame-Options: DENY` — correto.
- `X-Content-Type-Options: nosniff` — correto.
- `Referrer-Policy: strict-origin-when-cross-origin` — correto.
- `Permissions-Policy` — correto.
- **Faltam:** `Content-Security-Policy` (CSP) e `Strict-Transport-Security` (HSTS). CSP é difícil com Next.js mas HSTS deve ser adicionado.

**`dangerouslySetInnerHTML` em `layout.tsx:113`:**
- Usado para JSON-LD. O conteúdo é `JSON.stringify(jsonLd)` com objeto hardcoded — sem entrada de usuário. Seguro neste caso.

---

## 8. PLANO DE AÇÃO PRIORIZADO

### 🔴 CRÍTICO — Antes de Entregar (estimativa: 3–4 horas)

1. **Configurar `.env.local` com credenciais reais do Supabase** (15 min) — sem isso, zero fotos de carros carregam. Coordenar com Rafael para criar projeto Supabase e configurar o banco.
2. **Criar schema e popular o banco Supabase** — tabelas `cars`, `sales`, `clients`, `notes`. Cadastrar os carros reais de Rafael com fotos. (2–4 horas dependendo da quantidade de carros)
3. **Fallback para `coverImage` vazio** em `src/lib/mappers/car-mapper.ts:28` — substituir `??''` por `?? '/images/placeholder-car.jpg'` e criar a imagem placeholder. (30 min)
4. **Verificar/corrigir título duplicado "GR Corolla 2024 GR Corolla 2024"** — limpar dados do banco para que `version` não repita o que já está em `model`. (5 min no banco)

### 🟠 ALTO — Antes de Divulgar (estimativa: 3–4 horas)

5. **Adicionar `.limit(12)` em `getAllCars()`** e `getCarsByCategory()` para a home (30 min) — `src/lib/queries/cars.ts:13,29`.
6. **Adicionar `revalidate` nas pages** — home, novos, seminovos, repasse: `export const revalidate = 60` (15 min).
7. **Remover função `logout` morta do Navbar** — `src/components/home/Navbar.tsx:37-40` (5 min).
8. **Substituir depoimentos fictícios** por depoimentos reais de clientes de Rafael (1–2 horas de coleta + substituição).
9. **Corrigir horário inconsistente** Footer vs JSON-LD (15 min).
10. **Remover `'Toyota Ranger Roraima'` dos keywords** em `layout.tsx:22` (5 min).
11. **Substituir imagens `<img>` por `<Image />`** nos 4 arquivos com warnings de lint (1 hora) — FaqSection, Footer, ProfileCard, testimonials-columns-1.

### 🟡 MÉDIO — V2 (estimativa: 4–6 horas)

12. **Implementar paginação no /estoque** para queries sem limit (2 horas).
13. **Substituir depoimentos fictícios na galeria de clientes** com fotos reais (1 hora após coletar fotos).
14. **Adicionar `aria-expanded`, `aria-label`, `role="tablist"`** nas áreas críticas de acessibilidade (2 horas).
15. **Criar `src/app/robots.ts`** explícito (15 min).
16. **Otimizar ClientsGallery** — substituir framer-motion por CSS `@keyframes` (1 hora).
17. **Implementar páginas stub** `/admin/configuracoes`, `/admin/financeiro`, `/admin/leads` (3–6 horas).
18. **Adicionar `HSTS` nos headers** de `next.config.js` (15 min).
19. **Tipar corretamente `CarForm`** — substituir `Record<string, unknown>` por interface adequada (30 min).
20. **Verificar e ativar CSP** no next.config.js (1–2 horas — complexo com Next.js).

### 🟢 BAIXO — Backlog

21. Substituir `<img>` por `<Image />` no ShowcaseSection, ProfileCard, Sidebar (1 hora).
22. Refatorar `BrandsSection` para CSS puro sem framer-motion (30 min).
23. Adicionar `role="dialog"` e `aria-modal` no lightbox da galeria (15 min).
24. Adicionar scroll reveal nas páginas /novos, /seminovos, /repasse (1 hora).
25. Adicionar pulse animation no botão WhatsApp flutuante (30 min).
26. Auditar e tipar `Lanyard.tsx` para remover os 5 usos de `: any` (1 hora).
27. Remover `heroSlides` de mock-data.ts se confirmado que não é mais usado (5 min).

---

## 9. RECOMENDAÇÃO FINAL HONESTA

### Vale entregar? NÃO agora. Falta pouco.

O código está **muito bem construído** para um projeto de consultor automotivo. A qualidade técnica é superior à média — TypeScript sem erros, framer-motion bem usado, SEO sólido, middleware de auth funcionando, estrutura limpa.

### O que está faltando de verdade:

**O maior bloqueador é operacional, não técnico:** o banco de dados Supabase precisa ser criado, configurado e populado com os carros reais de Rafael. Sem isso:
- O site mostra seções vazias ("nenhum carro disponível")
- As fotos não existem
- O admin não funciona

**Segundo bloqueador:** os dados fictícios. Depoimentos falsos com fotos do Unsplash e "2.000 famílias atendidas" como dado mockado. Antes de publicar, pelo menos 3–4 depoimentos reais devem ser coletados.

### Estimativa real de tempo para entregar:

| Tarefa | Tempo |
|--------|-------|
| Criar e configurar Supabase (schema, storage, RLS) | 2–3 horas |
| Cadastrar 10–20 carros reais com fotos | 2–4 horas |
| Coletar 4–6 depoimentos reais e atualizar | 1–2 horas |
| Fixes críticos e altos do código | 2–3 horas |
| Testes no mobile (375px, Android) | 1 hora |
| Deploy e verificação em produção | 1 hora |
| **TOTAL** | **9–14 horas** |

### Nota Técnica Final: 7.7/10

Um projeto sólido, bem arquitetado, com design premium. O que falta é **conteúdo real** e **banco conectado** — não refatoração massiva de código.
