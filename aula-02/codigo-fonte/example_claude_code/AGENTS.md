# AGENTS.md

Guia para agentes de IA ao trabalhar com o código deste repositório.

Este projeto usa **React 19 + Vite** no frontend e **Express** no backend.

### Prioridades

- **Sempre verifique as skills** antes de implementar — tarefas sem skills relevantes podem ser invalidadas
- **Execute os checks** antes de concluir: `npm run lint` e `npm run typecheck` (frontend), `npm run build` (frontend + backend)
- **Não use workarounds** — prefira correções de causa raiz
- **Use `npm install <pacote>`** para adicionar dependências (nunca edite `package.json` manualmente sem conferir a versão)

### Comandos do projeto

```bash
# Frontend (dentro de frontend/)
cd frontend
npm run dev        # Servidor de desenvolvimento (Vite)
npm run build      # Build de produção
npm run lint       # ESLint
npm run typecheck  # Verificação de tipos TypeScript

# Backend (dentro de backend/)
cd backend
npm run dev        # Servidor com nodemon + tsx
npm run build      # Compilação TypeScript
npm start          # Executar build
```

- O frontend roda na porta `localhost:5173`
- O backend roda na porta `localhost:3000`

### Stack e skills recomendadas

| Área              | Tecnologia                | Skill sugerida                                                        |
| ----------------- | ------------------------- | --------------------------------------------------------------------- |
| Componentes React | React 19, hooks           | `react`, `vercel-react-best-practices`, `vercel-composition-patterns` |
| UI / shadcn       | shadcn/ui, Tailwind       | `shadcn`, `frontend-design`                                           |
| Backend           | Express, rotas            | —                                                                     |
| Design / UX       | Interface, acessibilidade | `ui-ux-pro-max`, `web-design-guidelines`                              |

### Estrutura do projeto

```
frontend/
├── src/
│   ├── components/ui/   # Componentes shadcn
│   ├── lib/             # Utilitários (utils.ts)
│   ├── App.tsx
│   └── main.tsx
backend/
├── src/
│   └── index.ts         # App Express, rotas, middleware
```

### Regras de componentes React

1. **Componentes funcionais** — sem class components, sem `React.FC`
2. **Props tipadas** — tipar diretamente na função
3. **Tratar estados** — loading, error e empty
4. **kebab-case** para nomes de arquivos (ex: `meu-componente.tsx`)
5. **Composição** — preferir compound components a muitas props booleanas

### Git

- **Não execute** `git restore`, `git reset`, `git clean` ou comandos destrutivos **sem permissão explícita do usuário**

### Anti-padrões

1. Pular ativação de skill
2. Ativar apenas uma skill quando o código toca vários domínios
3. Esquecer verificação antes de marcar tarefa concluída
4. Executar comandos git destrutivos sem permissão do usuário
5. Evite fazer workarounds
