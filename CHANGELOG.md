# CHANGELOG — Site Rafael Mota

Todas as alterações relevantes são documentadas aqui.  
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [0.4.0] — 2026-05-20 (Auditoria Técnica)

### Segurança
- **Atualizado** `next` de `14.2.5` para `14.2.35` — resolve CVE crítico (SSRF/cache poisoning) e 6 vulnerabilidades de alta severidade
- **Removido** `lenis@1.1.9` — pacote de 482 KB que nunca foi importado em nenhum arquivo do projeto

### SEO
- **Criado** `public/robots.txt` — permite indexação de todas as páginas e aponta para o sitemap
- **Criado** `src/app/sitemap.ts` — sitemap XML dinâmico via `MetadataRoute.Sitemap` do Next.js, cobrindo 24 rotas (home, estoque, novos, seminovos, repasse + 15 slugs de carros)

### Correções de Bug
- **Corrigido** imagem Unsplash quebrada (HTTP 404): `photo-1568844293986-ca047ba9df5b` substituída por `photo-1609137144813-7d9921338f24` no mock-data.ts

### Verificações
- Build de produção: ✅ 24 páginas geradas sem erros
- TypeScript: ✅ zero erros
- ESLint: ✅ zero warnings

---

## [0.3.0] — 2026-05-20 (Páginas Internas + Filtros)

### Adicionado
- **`src/app/estoque/page.tsx`** — página de estoque completo com sistema de filtros
  - Filtros: busca por texto, categoria, marca, faixa de preço, faixa de ano, KM máximo, combustível, câmbio, mostrar vendidos
  - Estado de filtros persistido na URL via `useSearchParams` + `router.replace`
  - Chips de filtros ativos com botão X individual
  - Dropdown de ordenação (preço, ano, KM, mais recente)
  - Toggle de visualização: grid vs lista
  - Bottom sheet mobile com spring animation
  - Suspense boundary para compatibilidade com SSG do Next.js 14
- **`src/app/novos/page.tsx`** — landing page de carros novos (Server Component)
- **`src/app/seminovos/page.tsx`** — landing page de seminovos (Server Component)
- **`src/app/repasse/page.tsx`** — landing page de repasse com seção "Como Funciona" (Server Component)
- **`src/app/carros/[slug]/page.tsx`** — página de detalhe do carro (reescrito)
  - `generateStaticParams()` para todos os 15 slugs
  - `generateMetadata()` com title, description e OG image por carro
  - Layout 2 colunas: galeria + especificações à esquerda, sidebar sticky à direita
  - Breadcrumb de navegação
  - Banner de status (vermelho para VENDIDO, amarelo para RESERVADO)
  - Grid de 6 especificações com ícones Lucide
  - Grid de features com checkmarks
  - Seção de carros similares (mesma categoria/marca, máx 4)
- **`src/app/carros/[slug]/not-found.tsx`** — página 404 customizada para carro não encontrado
- **`src/components/car/CarGallery.tsx`** — galeria com lightbox
  - Transições AnimatePresence entre imagens
  - Miniaturas com indicador de imagem ativa
  - Lightbox fullscreen com navegação por teclado (Escape, ←→)
  - Suporte a swipe touch (threshold 40px)
  - Badge "AMPLIAR" e contador de imagens
- **`src/components/car/SellerCard.tsx`** — card do vendedor
  - Link WhatsApp dinâmico com URL completa do carro
  - Web Share API com fallback para clipboard
  - Badge de status (verde/amarelo/vermelho)
  - Selos de confiança: 15+ anos, vistoria cautelar, documentação
- **`src/lib/filters.ts`** — utilitários de filtragem
  - `filterCars()`, `sortCars()`, `parseFiltersFromURL()`, `filtersToURL()`
  - `countActiveFilters()`, `getAvailableBrands()`, `getSimilarCars()`
- **`src/lib/slug.ts`** — `slugify()` com normalização Unicode NFD

### Alterado
- **`src/lib/mock-data.ts`** — expandido para 15 carros completos
  - 5 novos Toyota (todos disponíveis)
  - 5 seminovos Toyota (1 reservado, 2 vendidos, 2 disponíveis)
  - 5 repasse (1 reservado, 2 vendidos, 2 disponíveis)
  - Corrigido: `transmission: 'Automático'` (era 'Automática')
  - Corrigido: `fuel: 'Híbrido'` (era 'Híbrida')
- **`src/lib/whatsapp.ts`** — adicionado `carWhatsAppLinkDynamic()` para links com URL do carro
- **`src/components/home/CarCard.tsx`** — atualizado para nova interface `Car`
  - Usa `car.brand + car.model + car.version` em vez de `car.name`
  - Usa `car.coverImage` em vez de `car.images[0]`
  - Estado visual VENDIDO: grayscale + stamp vermelho sobreposto
  - Estado visual RESERVADO: faixa amarela na base do card
  - Exibe `oldPrice` riscado quando presente
  - Badge "Aceita negociação" quando `car.negotiable === true`
  - Botão de WhatsApp desabilitado para carros VENDIDO
- **`src/components/home/CarsShowcase.tsx`** — filtra carros VENDIDO da exibição na homepage
- **`src/components/home/Navbar.tsx`** — atualizado com links reais de rotas
  - Links internos: ESTOQUE, NOVOS, SEMINOVOS, REPASSE
  - Links âncora: SOBRE, CONTATO (com fallback para `/#ancora` fora da homepage)
  - Indicador de rota ativa via `usePathname()`
  - Drawer fecha automaticamente ao mudar de rota
- **`src/components/home/Footer.tsx`** — links atualizados para rotas reais

### Interface `Car` (nova)

```typescript
type CarStatus = 'disponivel' | 'reservado' | 'vendido'
type FuelType = 'Gasolina' | 'Etanol' | 'Flex' | 'Diesel' | 'Híbrido' | 'Elétrico'
type TransmissionType = 'Manual' | 'Automático' | 'CVT' | 'Automatizado'
```

---

## [0.2.0] — 2026-05-19 (Estrutura Base)

### Adicionado
- Layout principal com Navbar + Footer
- Homepage com HeroCarousel, CarsShowcase com filtros de categoria, AboutSection, CtaSection
- Tipografia Anton (display) + Inter (corpo) via `next/font/google`
- Palette de cores custom: `bg-primary #0A0A0A`, `accent-red #E31E24`, `text-muted #888`
- `src/types/index.ts` com interfaces base

---

## [0.1.0] — 2026-05-19 (Inicialização)

### Adicionado
- Projeto Next.js 14 com App Router, TypeScript, Tailwind CSS
- Configuração base: `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`
- `eslint-config-next`
