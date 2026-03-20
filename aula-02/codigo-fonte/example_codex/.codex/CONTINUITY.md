Goal (incl. success criteria):
- Implementar o painel de clima descrito em `/Users/pedronauck/Downloads/iadevt5_base-main 3/prompt.md`.
- Sucesso: backend expõe `GET /api/weather?city=<cidade>` usando Open-Meteo; frontend consome apenas o backend; UI responsiva com busca, geolocalização, estados de loading/erro, cards climáticos, gráfico horário e previsão de 7 dias; validação com `lint`, `typecheck`, `build` e `curl`.
- Refatorar `/Users/pedronauck/Downloads/iadevt5_base-main 3/frontend/src/App.tsx` com `vercel-composition-patterns` e `vercel-react-best-practices`, reduzindo responsabilidades no componente raiz e melhorando composição/performance.

Constraints/Assumptions:
- Não usar comandos git destrutivos.
- Não comentar o código novo.
- Frontend não pode consumir Open-Meteo diretamente.
- Skills obrigatórias lidas para esta tarefa: `frontend-design`, `shadcn`, `ui-ux-pro-max`, `vercel-react-best-practices`, `web-design-guidelines`.
- Checks obrigatórios ao final: `frontend` lint/typecheck/build e `backend` build.

Key decisions:
- Implementar proxy no backend com geocoding + forecast do Open-Meteo.
- Manter a aplicação como SPA Vite no frontend e Express no backend existentes.
- Usar componentes shadcn compatíveis com o projeto para card/input/skeleton/alert/chart quando necessário.

State:
- Refatoração do frontend concluída e validada.

Done:
- Lidos `AGENTS.md` e `prompt.md`.
- Verificada estrutura atual de `frontend` e `backend`.
- Confirmado contexto shadcn do frontend (`button` já instalado, projeto Vite + Tailwind v3).
- Implementado backend com `GET /api/weather` para busca por cidade e por coordenadas, incluindo fallback resiliente para geolocalização.
- Implementado painel de clima no frontend com busca, geolocalização, skeleton loading, estados de erro/retry, cards climáticos, UV bar, gráfico horário e cards de 7 dias.
- Adicionados componentes shadcn necessários (`card`, `input`, `skeleton`, `alert`, `chart`) e proxy do Vite para o backend.
- Executados `frontend`: `npm run lint`, `npm run typecheck`, `npm run build`; `backend`: `npm install`, `npm run build`.
- Validados com `curl` os endpoints do Open-Meteo (search e forecast) e os endpoints locais `/health`, `/api/weather?city=...` e `/api/weather?latitude=...&longitude=...`.
- Refatorado `/Users/pedronauck/Downloads/iadevt5_base-main 3/frontend/src/App.tsx` para um shell fino.
- Extraída a lógica do dashboard para `/Users/pedronauck/Downloads/iadevt5_base-main 3/frontend/src/features/weather/use-weather-dashboard.ts`.
- Extraída a composição da UI para `/Users/pedronauck/Downloads/iadevt5_base-main 3/frontend/src/features/weather/weather-dashboard.tsx`.
- Lazy-loaded o painel com `recharts` em `/Users/pedronauck/Downloads/iadevt5_base-main 3/frontend/src/features/weather/weather-chart-panel.tsx`, reduzindo o chunk principal do frontend.
- Reexecutados `frontend`: `npm run lint`, `npm run typecheck`, `npm run build` após a refatoração.

Now:
- Preparar resposta final da refatoração e observações dos checks.

Next:
- Opcional: tratar warning antigo do `button.tsx` gerado pelo template shadcn se virar prioridade.

Open questions (UNCONFIRMED if needed):
- Nenhuma aberta.

Working set (files/ids/commands):
- `/Users/pedronauck/Downloads/iadevt5_base-main 3/prompt.md`
- `/Users/pedronauck/Downloads/iadevt5_base-main 3/AGENTS.md`
- `/Users/pedronauck/Downloads/iadevt5_base-main 3/frontend/src/App.tsx`
- `/Users/pedronauck/Downloads/iadevt5_base-main 3/frontend/src/features/weather/*`
- `/Users/pedronauck/Downloads/iadevt5_base-main 3/backend/src/index.ts`
- `/Users/pedronauck/Downloads/iadevt5_base-main 3/backend/src/open-meteo.ts`
- `/Users/pedronauck/Downloads/iadevt5_base-main 3/frontend/src/lib/weather.ts`
- `/Users/pedronauck/Downloads/iadevt5_base-main 3/frontend/src/index.css`
- `npx shadcn@latest add card input skeleton alert chart`
- `curl https://geocoding-api.open-meteo.com/...`
- `curl https://api.open-meteo.com/v1/forecast?...`
- `curl http://localhost:3000/api/weather?...`
