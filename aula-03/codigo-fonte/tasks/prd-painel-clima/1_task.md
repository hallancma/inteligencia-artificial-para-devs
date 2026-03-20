# Tarefa 1.0: Backend — Rota `/api/weather` com Geocoding, Forecast e Validacao Zod

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se voce nao ler esses arquivos sua tarefa sera invalidada</critical>

## Visao Geral

Criar o endpoint `GET /api/weather?city=<cidade>` no backend Hono/Bun que atua como BFF (Backend for Frontend). A rota recebe o nome de uma cidade, converte em coordenadas via Geocoding API do Open-Meteo, busca dados climaticos via Forecast API e retorna o payload combinado ao frontend. Inclui validacao de query params com Zod e tratamento de erros com status codes adequados (200/400/404/500).

<skills>
### Conformidade com Skills Padroes

- `hono` — backend usa Hono, deve seguir padroes da skill para rotas, middleware e tratamento de erros
- `zod` — validacao de schemas para query params com `@hono/zod-validator`
</skills>

<requirements>
- Instalar dependencias `zod` e `@hono/zod-validator` no workspace backend via `bun add`
- Criar schema Zod para validacao do query param `city` (string, min 1 caractere)
- Implementar servico de geocoding que chama `https://geocoding-api.open-meteo.com/v1/search?name=<cidade>&count=1&language=pt`
- Implementar servico de forecast que chama `https://api.open-meteo.com/v1/forecast` com os parametros corretos
- Combinar dados de geocoding (nome da cidade, regiao) com dados de forecast no payload de resposta
- Retornar status 200 com dados, 400 quando `city` estiver ausente/vazio, 404 quando cidade nao for encontrada, 500 em erro interno
- O endpoint tambem deve aceitar `lat` e `lon` como alternativa a `city` (para suporte a geolocalizacao)
</requirements>

## Subtarefas

- [ ] 1.1 Instalar `zod` e `@hono/zod-validator` no workspace backend (`cd backend && bun add zod @hono/zod-validator`)
- [ ] 1.2 Criar schema Zod de validacao para query params (`city` string min 1, ou `lat`/`lon` numericos)
- [ ] 1.3 Implementar funcao de geocoding — chamada a `geocoding-api.open-meteo.com/v1/search`, extrair primeiro resultado (latitude, longitude, name, admin1), retornar 404 se `results` vazio
- [ ] 1.4 Implementar funcao de forecast — chamada a `api.open-meteo.com/v1/forecast` com parametros: `current` (temperature_2m, relative_humidity_2m, apparent_temperature, precipitation, weather_code, wind_speed_10m, uv_index), `hourly` (temperature_2m, precipitation), `daily` (weather_code, temperature_2m_max, temperature_2m_min, precipitation_probability_max), `timezone=auto`
- [ ] 1.5 Criar rota `GET /api/weather` em `backend/src/index.ts` — orquestrar validacao → geocoding → forecast → resposta combinada
- [ ] 1.6 Tratar erros: 400 (city ausente), 404 (cidade nao encontrada), 500 (falha na API externa) com mensagens adequadas
- [ ] 1.7 Escrever testes unitarios cobrindo todos os cenarios

## Detalhes de Implementacao

Consultar a secao **"Design de Implementacao"** e **"Pontos de Integracao"** da `techspec.md` para:
- Schema Zod esperado (`weatherQuerySchema`)
- URLs e parametros das APIs externas (Geocoding e Forecast)
- Formato do payload de resposta
- Status codes e mensagens de erro

### Parametros da Forecast API

Conforme `techspec.md`, enviar para Open-Meteo:
- `current`: `temperature_2m`, `relative_humidity_2m`, `apparent_temperature`, `precipitation`, `weather_code`, `wind_speed_10m`, `uv_index`
- `hourly`: `temperature_2m`, `precipitation`
- `daily`: `weather_code`, `temperature_2m_max`, `temperature_2m_min`, `precipitation_probability_max`
- `timezone`: `auto`

### Formato de resposta

O payload retornado deve combinar dados de geocoding com forecast. Incluir `city` (nome) e `region` (admin1) do geocoding no topo do payload junto com os dados brutos de forecast.

## Criterios de Sucesso

- `GET /api/weather?city=São Paulo` retorna 200 com dados climaticos reais
- `GET /api/weather` (sem city) retorna 400 com `{ error: "City parameter is required" }`
- `GET /api/weather?city=xyznonexistent123` retorna 404 com `{ error: "City not found" }`
- `GET /api/weather?lat=-23.55&lon=-46.63` retorna 200 com dados climaticos (geolocalizacao)
- Todos os testes unitarios passam
- `bun run typecheck` passa sem erros no workspace backend
- `bun run build` completa com sucesso

## Testes da Tarefa

- [ ] Teste unitario: rota retorna 400 quando `city` param esta ausente
- [ ] Teste unitario: rota retorna 404 quando geocoding nao encontra a cidade (mock de fetch)
- [ ] Teste unitario: rota retorna 200 com payload correto para cidade valida (mock de fetch para geocoding e forecast)
- [ ] Teste unitario: rota retorna 500 quando API externa falha (mock de fetch com erro)
- [ ] Teste unitario: rota aceita `lat`/`lon` como alternativa a `city`
- [ ] Verificar: `bun run typecheck` passa no backend
- [ ] Verificar: `bun run test` passa no backend

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERA-LA FINALIZADA</critical>

## Arquivos relevantes

- `backend/src/index.ts` — adicionar rota `/api/weather` e servicos
- `backend/src/index.test.ts` — adicionar testes da nova rota
- `backend/package.json` — adicionar `zod` e `@hono/zod-validator`
- `tasks/prd-painel-clima/techspec.md` — referencia tecnica completa
- `tasks/prd-painel-clima/prd.md` — requisitos de produto
