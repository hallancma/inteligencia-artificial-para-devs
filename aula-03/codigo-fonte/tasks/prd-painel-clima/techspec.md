# Especificacao Tecnica — Painel de Clima

## Resumo Executivo

O Painel de Clima sera implementado como uma aplicacao fullstack com backend Hono/Bun atuando como proxy para a API Open-Meteo (geocoding + forecast) e frontend React 19 com Tailwind v4 e shadcn/ui renderizando os dados climaticos. A arquitetura segue o padrao BFF (Backend for Frontend): o frontend nunca acessa APIs externas diretamente — toda comunicacao passa pelo endpoint `GET /api/weather?city=<cidade>` do backend, que converte o nome da cidade em coordenadas via Geocoding API e busca dados de previsao via Forecast API. O frontend utiliza um custom hook `useFetch` para gerenciar estados de loading/error/data, Recharts para o grafico hora a hora, e CSS customizado com tokens do design-spec para gradientes dinamicos baseados na condicao climatica.

## Arquitetura do Sistema

### Visao Geral dos Componentes

**Backend (modificar `backend/src/index.ts`)**

- `GET /api/weather` — rota principal que recebe `?city=<nome>`, faz geocoding e retorna dados climaticos
- Middleware de validacao Zod para query params
- Servico de geocoding — chama `geocoding-api.open-meteo.com/v1/search`
- Servico de forecast — chama `api.open-meteo.com/v1/forecast` com parametros de current, hourly e daily

**Frontend (novos arquivos em `frontend/src/`)**

- `hooks/use-weather.ts` — custom hook de fetch com estados loading/error/data
- `components/weather-dashboard.tsx` — componente raiz do painel, gerencia layout responsivo
- `components/search-bar.tsx` — campo de busca + botao de geolocalizacao
- `components/hero-card.tsx` — card principal com temperatura, condicao e gradiente dinamico
- `components/metric-cards.tsx` — 4 cards de metricas (umidade, vento, UV, precipitacao)
- `components/hourly-chart.tsx` — grafico de barras hora a hora com Recharts
- `components/uv-bar.tsx` — barra visual de indice UV com gradiente
- `components/weekly-forecast.tsx` — lista de previsao de 7 dias com barras de temperatura
- `components/weather-skeleton.tsx` — skeleton loading para todos os blocos
- `lib/weather-utils.ts` — funcoes utilitarias (mapeamento de weather code para condicao/icone/gradiente)

**Fluxo de dados:**
`SearchBar` → `useWeather(city)` → `GET /api/weather?city=X` → Backend (geocoding → forecast) → Response JSON → componentes renderizam dados

## Design de Implementacao

### Interfaces Principais

```typescript
// Backend — schema de validacao da rota
const weatherQuerySchema = z.object({
  city: z.string().min(1),
});
```

```typescript
// Frontend — tipos principais
type WeatherCondition = "sunny" | "cloudy" | "rainy";

type WeatherData = {
  city: string;
  region: string;
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    precipitation: number;
    weatherCode: number;
  };
  hourly: Array<{
    time: string;
    temperature: number;
    precipitation: number;
  }>;
  daily: Array<{
    date: string;
    weekday: string;
    tempMin: number;
    tempMax: number;
    precipitationProbability: number;
    weatherCode: number;
  }>;
};

type UseWeatherReturn = {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  search: (city: string) => void;
  searchByLocation: (lat: number, lon: number) => void;
};
```

### Modelos de Dados

O backend repassa os dados da Open-Meteo transformando minimamente a resposta. A transformacao principal e agregar informacoes de geocoding (nome da cidade/regiao) ao payload de forecast.

**Parametros enviados para Open-Meteo Forecast API:**

- `current`: `temperature_2m`, `relative_humidity_2m`, `apparent_temperature`, `precipitation`, `weather_code`, `wind_speed_10m`, `uv_index`
- `hourly`: `temperature_2m`, `precipitation` (proximo 24h)
- `daily`: `weather_code`, `temperature_2m_max`, `temperature_2m_min`, `precipitation_probability_max` (7 dias)
- `timezone`: `auto`

### Endpoints de API

**`GET /api/weather?city=<cidade>`**

- **200**: Retorna JSON com dados de geocoding + forecast combinados
- **400**: Query param `city` ausente ou vazio — `{ error: "City parameter is required" }`
- **404**: Cidade nao encontrada no geocoding — `{ error: "City not found" }`
- **500**: Erro interno ao chamar APIs externas — `{ error: "Failed to fetch weather data" }`

## Pontos de Integracao

**Geocoding API (Open-Meteo)**

- URL: `https://geocoding-api.open-meteo.com/v1/search?name=<cidade>&count=1&language=pt`
- Sem autenticacao
- Retorna array `results` — usar primeiro resultado para latitude/longitude/nome/admin1
- Se `results` estiver vazio ou ausente, retornar 404

**Forecast API (Open-Meteo)**

- URL: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=...&hourly=...&daily=...&timezone=auto`
- Sem autenticacao
- Timeout recomendado: 10s
- Em caso de falha, retornar 500 ao frontend

**Geolocation API (Browser)**

- `navigator.geolocation.getCurrentPosition()` no frontend
- Coordenadas obtidas sao enviadas diretamente para o backend (futuro endpoint ou adaptacao do existente para aceitar `lat`/`lon` como alternativa a `city`)

## Abordagem de Testes

### Testes Unitarios

**Backend (`backend/src/`):**

- Testar rota `/api/weather` com mock de fetch para Open-Meteo
- Cenarios: cidade valida (200), city param ausente (400), cidade nao encontrada (404), falha na API externa (500)
- Mock: `vi.stubGlobal('fetch', ...)` para simular respostas da Geocoding e Forecast API

**Frontend (`frontend/src/`):**

- Testar `useWeather` hook com mock de fetch — estados loading, data, error
- Testar `weather-utils.ts` — mapeamento de weather codes para condicoes
- Testar componentes individuais com dados mockados (hero-card, metric-cards, weekly-forecast)
- Usar `@testing-library/react` + `@testing-library/user-event`

### Testes de Integracao

- Testar fluxo completo SearchBar → useWeather → renderizacao de dados com fetch mockado
- Verificar transicoes de estado: idle → loading (skeleton) → data ou error

### Testes E2E

- Playwright: fluxo principal — digitar cidade, submeter busca, verificar que hero card, metricas, grafico e previsao 7 dias aparecem
- Testar fluxo de erro — cidade inexistente mostra mensagem amigavel
- Testar responsividade — viewport mobile (390px) e desktop (1440px)

## Sequenciamento de Desenvolvimento

### Ordem de Construcao

1. **Backend: rota `/api/weather`** — estrutura base com geocoding + forecast + validacao Zod + testes unitarios. E o alicerce de todo o frontend.
2. **Frontend: tipos e utilitarios** — `WeatherData` types, `weather-utils.ts` (mapeamento weather code → condicao/icone), hook `useWeather`.
3. **Frontend: SearchBar + layout base** — campo de busca, botao geolocation, estrutura responsiva do dashboard (mobile-first).
4. **Frontend: HeroCard + MetricCards** — cards principais com gradientes dinamicos e dados reais.
5. **Frontend: HourlyChart (Recharts)** — grafico de barras com gradiente, integrado com dados da API.
6. **Frontend: UVBar + WeeklyForecast** — barra UV com gradiente e lista de 7 dias com barras de temperatura.
7. **Frontend: Skeleton loading + estados de erro** — skeleton para cada bloco, mensagem de erro amigavel.
8. **Testes E2E** — Playwright cobrindo fluxos principais.

### Dependencias Tecnicas

- `recharts` — biblioteca de graficos para o frontend
- `@fontsource-variable/sora` — fonte Sora para tipografia conforme design-spec
- `@hono/zod-validator` + `zod` — validacao de query params no backend

## Monitoramento e Observabilidade

- Logs de erro no backend via `console.error` para falhas de geocoding e forecast com detalhes da cidade buscada
- Log de warning para cidades nao encontradas (404) para analise de buscas invalidas
- Tempo de resposta das APIs externas logado para deteccao de degradacao

## Consideracoes Tecnicas

### Decisoes Principais

| Decisao                                 | Justificativa                                                          | Alternativa rejeitada                                                   |
| --------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Recharts para graficos                  | Declarativo, React-native, suporte a gradientes SVG, grande comunidade | Chart.js (menos idiomatico para React), SVG customizado (muito esforco) |
| Custom hook `useFetch`                  | Zero dependencias, educacional, suficiente para o escopo               | TanStack Query (overhead desnecessario para projeto educacional)        |
| Zod + @hono/zod-validator               | Validacao tipada, middleware oficial Hono, mensagens estruturadas      | Validacao manual (sem tipagem, mais propenso a erros)                   |
| @fontsource/sora                        | Consistente com padrao existente (Geist via fontsource), self-hosted   | Google Fonts CDN (dependencia externa)                                  |
| Mapeamento de weather codes no frontend | Reducao de logica no backend, permite reutilizacao                     | Mapeamento no backend (acoplaria apresentacao ao servidor)              |

### Riscos Conhecidos

- **Rate limiting Open-Meteo**: API e gratuita sem chave, mas pode ter limites em alta carga. Mitigacao: nao ha cache no escopo, mas e uma evolucao natural se necessario.
- **Geolocation API**: Requer HTTPS em producao e permissao do usuario. Fallback: busca manual por cidade sempre disponivel.
- **Weather codes**: Open-Meteo usa WMO weather codes (0-99). O mapeamento para as 3 condicoes visuais (sunny/cloudy/rainy) precisa cobrir todos os codigos relevantes.

### Conformidade com Skills Padroes

- `hono` — backend usa Hono com Bun, deve seguir padroes da skill
- `shadcn` — componentes UI base-nova ja configurados (card, input, skeleton, button disponiveis)
- `vercel-react-best-practices` — hooks, composicao de componentes, estados de loading
- `frontend-design` — qualidade visual conforme design-spec com tokens e gradientes
- `zod` — validacao de schemas no backend

### Arquivos relevantes e dependentes

**Backend:**

- `backend/src/index.ts` — adicionar rota `/api/weather` e servicos
- `backend/src/index.test.ts` — adicionar testes da nova rota
- `backend/package.json` — adicionar `zod` e `@hono/zod-validator`

**Frontend:**

- `frontend/src/App.tsx` — substituir conteudo pelo WeatherDashboard
- `frontend/src/index.css` — adicionar tokens customizados (gradientes, cores do design-spec, fonte Sora)
- `frontend/src/components/ui/` — componentes shadcn ja disponiveis (card, input, skeleton, button)
- `frontend/package.json` — adicionar `recharts` e `@fontsource-variable/sora`
- Novos arquivos listados na secao "Visao Geral dos Componentes"

**Raiz:**

- `e2e/app.spec.ts` — adicionar testes E2E do painel de clima
- `playwright.config.ts` — pode precisar de ajuste para webServer incluir backend
