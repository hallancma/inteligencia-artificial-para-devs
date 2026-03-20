# Tarefa 2.0: Frontend — Painel de Clima Completo

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se voce nao ler esses arquivos sua tarefa sera invalidada</critical>

## Referencia de Design (Paper)

Os artboards de referencia visual estao no Paper e devem ser consultados usando as ferramentas do MCP Paper (`get_screenshot`, `get_tree_summary`, `get_computed_styles`, `get_jsx`, etc.) para extrair detalhes visuais precisos durante a implementacao.

| Artboard              | Descricao                                                                                                            | ID Paper |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- | -------- |
| Clima — Mobile        | Layout mobile (390x1080) — coluna unica, busca no topo, hero card, metricas, grafico horario, barra UV, lista 7 dias | `CI-0`   |
| Clima — Desktop       | Layout desktop (1440x560) — 3 colunas, header com titulo e busca, hero + metricas, grafico + UV, 7 dias              | `MH-0`   |
| Clima — Card Variants | Variacoes visuais do hero card por condicao climatica (ensolarado, nublado, chuva)                                   | `MI-0`   |

**Como usar:** Antes de implementar cada componente, use `get_screenshot` no artboard correspondente para verificar o visual esperado. Use `get_computed_styles` e `get_jsx` para extrair valores exatos de estilos quando necessario. Nunca use screenshots como input para gerar codigo — use apenas as ferramentas que retornam valores exatos.

## Design Tokens (`design-spec.json`)

Todos os tokens de design estao extraidos do Paper e disponiveis em `tasks/prd-painel-clima/design-spec.json`. Este arquivo contem:

- **`colors`** — background (`#EEF2F7`), surface (`#FFFFFF`), text (primary `#1B2A4A`, secondary `#7B8BA3`, muted, onGradient), accent (blue `#4A8FE7`, orange `#F97316`)
- **`gradients`** — hero cards (`heroSunny`, `heroCloudy`, `heroRain`), botao geo (`geoButton`), icones de metricas (`iconHumidity`, `iconWind`, `iconUV`, `iconPrecipitation`), barras do grafico (`chartBarHigh`, `chartBarMid`, `chartBarLow`), barra UV (`uvBar`), barra de temperatura (`tempBar`)
- **`typography`** — fonte `Sora`, escala completa: `tempDisplayMobile` (72px/800), `tempDisplayCard` (56px/300), `tempUnit`, `pageTitle`, `sectionTitle`, `metricValue`, `cityName`, `heroCondition`, `heroFeelsLike`, `body`, `label`, `smallLabel`, `chartLabel`, `unitLabel`, `placeholder`
- **`spacing`** — `pagePadding` (20px), `cardPadding` (28px), `metricCardPadding`, `searchPadding`, `rowPadding`, `sectionGap` (16px), `cardGap` (4px), `metricGap` (8px), `rowGap` (12px)
- **`radii`** — `heroCard` (24px), `card` (20px), `searchInput` (16px), `metricCard` (18px), `iconContainer` (12px), `chartBar` (8px), `tempBar` (3px), `uvBar` (4px), `geoButton` (16px)
- **`shadows`** — `card`, `heroSunny`, `heroCloudy`, `heroRain`, `geoButton`, `uvIndicator`
- **`components`** — specs de `uvIndicator` (16px, circular, borda 3px orange), `searchInput` (height 46px), `geoButton` (50px), `iconContainer` (40px), `tempBarTrack` (height 6px)

**Importante:** Usar os valores exatos do `design-spec.json` para garantir fidelidade visual. Nao inventar valores — sempre consultar o arquivo.

## Visao Geral

Implementar todo o frontend do Painel de Clima: tipos, utilitarios, hook de fetch, todos os componentes visuais (SearchBar, HeroCard, MetricCards, HourlyChart, UVBar, WeeklyForecast, Skeleton, estados de erro) e layout responsivo mobile-first. O painel deve consumir dados exclusivamente do endpoint `GET /api/weather` do backend (Tarefa 1.0) e refletir visualmente as condicoes climaticas com gradientes dinamicos conforme o design-spec.

<skills>
### Conformidade com Skills Padroes

- `vercel-react-best-practices` — hooks, composicao de componentes, estados de loading
- `vercel-composition-patterns` — compound components, composicao sobre props booleanas
- `shadcn` — componentes UI base-nova ja configurados (card, input, skeleton, button)
- `frontend-design` — qualidade visual conforme design-spec com tokens e gradientes
  </skills>

<requirements>
- Instalar `recharts` e `@fontsource-variable/sora` no workspace frontend via `bun add`
- Configurar design tokens do `design-spec.json` no CSS (cores, gradientes, tipografia, espacamento, raios, sombras)
- Configurar fonte Sora como fonte principal
- Criar tipos TypeScript (`WeatherData`, `WeatherCondition`, `UseWeatherReturn`)
- Criar `weather-utils.ts` com mapeamento de WMO weather codes para condicao/icone/gradiente
- Criar hook `useWeather` com estados loading/error/data e funcoes `search` e `searchByLocation`
- Criar todos os componentes listados na techspec
- Implementar layout responsivo: mobile (390px, coluna unica) e desktop (1440px, 3 colunas)
- Implementar 3 variacoes visuais de gradiente (ensolarado, nublado, chuva)
- Implementar skeleton loading para cada secao
- Implementar estado de erro com mensagem amigavel e opcao de retry
- Frontend NAO deve acessar API Open-Meteo diretamente
- Sem comentarios no codigo (explicitamente excluido no PRD)
</requirements>

## Subtarefas

### 2.1 — Setup: Dependencias e Design Tokens

- [ ] 2.1.1 Instalar `recharts` e `@fontsource-variable/sora` (`cd frontend && bun add recharts @fontsource-variable/sora`)
- [ ] 2.1.2 Importar fonte Sora no `main.tsx`
- [ ] 2.1.3 Configurar design tokens no `index.css` — cores, gradientes, tipografia, espacamento, raios e sombras conforme `design-spec.json`

### 2.2 — Tipos e Utilitarios

- [ ] 2.2.1 Criar `frontend/src/lib/types.ts` com tipos `WeatherCondition`, `WeatherData`, `UseWeatherReturn` conforme techspec
- [ ] 2.2.2 Criar `frontend/src/lib/weather-utils.ts` com funcoes de mapeamento:
  - `getWeatherCondition(weatherCode: number): WeatherCondition` — mapeia WMO codes para "sunny" | "cloudy" | "rainy"
  - `getWeatherDescription(weatherCode: number): string` — descricao textual em portugues
  - `getWeatherIcon(condition: WeatherCondition): string` — nome do icone Lucide correspondente
  - `getGradientClass(condition: WeatherCondition): string` — classe CSS do gradiente
- [ ] 2.2.3 Escrever testes unitarios para `weather-utils.ts` cobrindo os 3 grupos de weather codes

### 2.3 — Hook `useWeather`

- [ ] 2.3.1 Criar `frontend/src/hooks/use-weather.ts` — custom hook que:
  - Gerencia estados `data`, `loading`, `error`
  - Expoe funcao `search(city: string)` que faz fetch para `/api/weather?city=<cidade>`
  - Expoe funcao `searchByLocation(lat: number, lon: number)` que faz fetch para `/api/weather?lat=<lat>&lon=<lon>`
  - Trata erros HTTP (400, 404, 500) com mensagens amigaveis
- [ ] 2.3.2 Escrever testes unitarios para `useWeather` com mock de fetch (estados loading, data, error)

### 2.4 — SearchBar

- [ ] 2.4.1 Criar `frontend/src/components/search-bar.tsx`:
  - Campo de texto com placeholder "Buscar cidade..."
  - Busca acionada por Enter/submit
  - Botao de geolocalizacao ao lado (icone MapPin/LocateFixed do Lucide)
  - Botao solicita `navigator.geolocation.getCurrentPosition()` e chama `searchByLocation`
  - Feedback visual de loading durante busca
- [ ] 2.4.2 Escrever testes para SearchBar (submit dispara busca, botao geo solicita localizacao)

### 2.5 — WeatherDashboard (Layout Responsivo)

- [ ] 2.5.1 Criar `frontend/src/components/weather-dashboard.tsx`:
  - Componente raiz que orquestra todos os sub-componentes
  - Layout mobile (390px): coluna unica — SearchBar no topo, HeroCard, MetricCards, HourlyChart, UVBar, WeeklyForecast
  - Layout desktop (1440px): header com titulo "Painel de Clima" + SearchBar, 3 colunas — esquerda (HeroCard + MetricCards), central (HourlyChart + UVBar), direita (WeeklyForecast)
  - Background dinamico conforme condicao climatica com transicao suave
- [ ] 2.5.2 Atualizar `App.tsx` para renderizar WeatherDashboard

### 2.6 — HeroCard

- [ ] 2.6.1 Criar `frontend/src/components/hero-card.tsx`:
  - Temperatura atual em destaque (tipografia `tempDisplayMobile`/`tempDisplayCard` do design-spec)
  - Descricao da condicao climatica (ex: "Parcialmente nublado")
  - Nome da cidade e estado/regiao
  - Sensacao termica
  - Icone representando a condicao (Lucide icons: Sun, CloudSun, CloudRain)
  - Background com gradiente dinamico: `heroSunny`, `heroCloudy`, `heroRain` do design-spec
  - Sombra correspondente: `heroSunny`, `heroCloudy`, `heroRain` do design-spec
- [ ] 2.6.2 Escrever testes para HeroCard (renderiza dados corretos, aplica gradiente correto por condicao)

### 2.7 — MetricCards

- [ ] 2.7.1 Criar `frontend/src/components/metric-cards.tsx`:
  - 4 cards: Umidade (%), Vento (km/h), Indice UV, Precipitacao (mm)
  - Cada card com icone em container com gradiente proprio (do design-spec: `iconHumidity`, `iconWind`, `iconUV`, `iconPrecipitation`)
  - Layout em grid horizontal (4 colunas em mobile, 4 em desktop)
- [ ] 2.7.2 Escrever testes para MetricCards (renderiza 4 cards com valores corretos)

### 2.8 — HourlyChart (Recharts)

- [ ] 2.8.1 Criar `frontend/src/components/hourly-chart.tsx`:
  - Grafico de barras com temperatura por hora (proximas 24h)
  - Valores de temperatura acima de cada barra
  - Rotulos de hora no eixo horizontal
  - Gradiente de cores nas barras (usar gradientes `chartBarHigh`, `chartBarMid`, `chartBarLow` do design-spec)
  - Grafico interativo (hover/touch para detalhes)
- [ ] 2.8.2 Escrever testes para HourlyChart (renderiza com dados mockados, exibe barras e labels)

### 2.9 — UVBar

- [ ] 2.9.1 Criar `frontend/src/components/uv-bar.tsx`:
  - Barra horizontal com gradiente `uvBar` do design-spec (verde a vermelho)
  - Indicador circular na posicao correspondente ao valor atual (componente `uvIndicator` do design-spec)
  - Classificacao textual ao lado (ex: "6 Alto")
  - Mapeamento de valor UV para classificacao: 0-2 Baixo, 3-5 Moderado, 6-7 Alto, 8-10 Muito Alto, 11+ Extremo
- [ ] 2.9.2 Escrever testes para UVBar (posicao do indicador, classificacao textual correta)

### 2.10 — WeeklyForecast

- [ ] 2.10.1 Criar `frontend/src/components/weekly-forecast.tsx`:
  - Lista com 7 dias de previsao
  - Cada linha: dia da semana, icone de condicao, probabilidade de precipitacao (%), temperatura min e max
  - Barra visual de temperatura min/max com gradiente `tempBar` do design-spec, proporcional ao range global
  - Separacao visual entre dias (divider do design-spec)
- [ ] 2.10.2 Escrever testes para WeeklyForecast (renderiza 7 dias, exibe min/max, barras proporcionais)

### 2.11 — WeatherSkeleton (Loading)

- [ ] 2.11.1 Criar `frontend/src/components/weather-skeleton.tsx`:
  - Skeleton loading para cada secao: HeroCard, MetricCards, HourlyChart, UVBar, WeeklyForecast
  - Usar componente `Skeleton` do shadcn/ui ja disponivel
  - Mesmo layout que os componentes reais para evitar layout shift
- [ ] 2.11.2 Escrever testes para WeatherSkeleton (renderiza skeletons corretos)

### 2.12 — Estado de Erro

- [ ] 2.12.1 Implementar estado de erro no WeatherDashboard:
  - Mensagem amigavel quando cidade nao encontrada ("Cidade nao encontrada")
  - Botao de "Tentar novamente" que limpa o erro e foca no campo de busca
  - Mensagem de erro generica para falhas inesperadas
- [ ] 2.12.2 Escrever testes para estado de erro (exibe mensagem, retry funciona)

### 2.13 — Teste de Integracao

- [ ] 2.13.1 Teste de integracao: fluxo completo SearchBar → useWeather → renderizacao de dados com fetch mockado
- [ ] 2.13.2 Teste de integracao: transicoes de estado idle → loading (skeleton visivel) → data (componentes renderizados)
- [ ] 2.13.3 Teste de integracao: transicao idle → loading → error (mensagem amigavel exibida)

## Detalhes de Implementacao

Consultar os seguintes arquivos para detalhes completos:

- **`techspec.md`** — secao "Design de Implementacao" para interfaces TypeScript, secao "Visao Geral dos Componentes" para lista de arquivos
- **`design-spec.json`** — todos os tokens de design (cores, gradientes, tipografia, espacamento, raios, sombras, specs de componentes)
- **`prd.md`** — secao "Layout e Responsividade" para breakpoints e organizacao visual, secao "Variacoes Visuais de Condicao" para os 3 temas

### Mapeamento de WMO Weather Codes (referencia)

Os weather codes da Open-Meteo seguem o padrao WMO. Agrupar em 3 condicoes:

- **sunny**: codes 0 (ceu limpo), 1 (predominantemente limpo)
- **cloudy**: codes 2 (parcialmente nublado), 3 (nublado), 45, 48 (nevoa)
- **rainy**: codes 51-67 (chuvisco/chuva), 71-77 (neve), 80-86 (pancadas), 95-99 (tempestade)

### Layout Responsivo

- **Mobile (< 768px)**: `flex flex-col`, coluna unica, padding `20px`
- **Desktop (>= 768px)**: CSS Grid 3 colunas, header com titulo + busca no topo

## Criterios de Sucesso

- Todos os componentes renderizam corretamente com dados reais do backend
- Layout responsivo funciona em 390px (mobile) e 1440px (desktop)
- Gradientes dinamicos mudam conforme condicao climatica (sunny/cloudy/rainy)
- Skeleton loading aparece durante o carregamento
- Mensagem de erro aparece quando cidade nao e encontrada, com opcao de retry
- Grafico Recharts exibe barras interativas com dados hora a hora
- Barra UV exibe indicador na posicao correta com classificacao textual
- Previsao 7 dias exibe barras de temperatura proporcionais
- Todos os testes unitarios e de integracao passam
- `bun run lint` passa sem erros
- `bun run typecheck` passa sem erros
- `bun run build` completa com sucesso

## Testes da Tarefa

- [ ] Testes unitarios: `weather-utils.ts` — mapeamento de weather codes para condicao, descricao, icone, gradiente
- [ ] Testes unitarios: `useWeather` hook — estados loading, data, error com fetch mockado
- [ ] Testes unitarios: `SearchBar` — submit dispara busca, botao geo solicita localizacao
- [ ] Testes unitarios: `HeroCard` — renderiza dados, aplica gradiente correto
- [ ] Testes unitarios: `MetricCards` — renderiza 4 cards com valores corretos
- [ ] Testes unitarios: `HourlyChart` — renderiza grafico com dados mockados
- [ ] Testes unitarios: `UVBar` — posicao do indicador, classificacao textual
- [ ] Testes unitarios: `WeeklyForecast` — renderiza 7 dias com min/max e barras
- [ ] Testes unitarios: `WeatherSkeleton` — renderiza skeletons
- [ ] Testes de integracao: fluxo SearchBar → useWeather → renderizacao completa
- [ ] Testes de integracao: transicao loading → data e loading → error
- [ ] Verificar: `bun run lint` passa
- [ ] Verificar: `bun run typecheck` passa no frontend
- [ ] Verificar: `bun run build` completa com sucesso

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERA-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/App.tsx` — substituir conteudo pelo WeatherDashboard
- `frontend/src/index.css` — adicionar tokens customizados do design-spec
- `frontend/src/main.tsx` — importar fonte Sora
- `frontend/src/lib/types.ts` — tipos TypeScript (novo)
- `frontend/src/lib/weather-utils.ts` — utilitarios de mapeamento (novo)
- `frontend/src/hooks/use-weather.ts` — hook de fetch (novo)
- `frontend/src/components/weather-dashboard.tsx` — layout raiz (novo)
- `frontend/src/components/search-bar.tsx` — campo de busca (novo)
- `frontend/src/components/hero-card.tsx` — card principal (novo)
- `frontend/src/components/metric-cards.tsx` — cards de metricas (novo)
- `frontend/src/components/hourly-chart.tsx` — grafico hora a hora (novo)
- `frontend/src/components/uv-bar.tsx` — barra UV (novo)
- `frontend/src/components/weekly-forecast.tsx` — previsao 7 dias (novo)
- `frontend/src/components/weather-skeleton.tsx` — skeleton loading (novo)
- `frontend/src/components/ui/` — componentes shadcn existentes (card, input, skeleton, button)
- `frontend/package.json` — adicionar recharts e @fontsource-variable/sora
- `tasks/prd-painel-clima/design-spec.json` — tokens de design
- `tasks/prd-painel-clima/techspec.md` — referencia tecnica completa
- `tasks/prd-painel-clima/prd.md` — requisitos de produto
