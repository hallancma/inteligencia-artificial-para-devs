# Tarefa 3.0: Testes E2E com Playwright

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se voce nao ler esses arquivos sua tarefa sera invalidada</critical>

## Visao Geral

Implementar testes end-to-end com Playwright cobrindo os fluxos principais do Painel de Clima: busca de cidade com exibicao completa de dados, fluxo de erro com cidade inexistente e mensagem amigavel, e verificacao de responsividade nos breakpoints mobile (390px) e desktop (1440px). Os testes devem validar que o sistema funciona de ponta a ponta (frontend → backend → APIs externas).

<skills>
### Conformidade com Skills Padroes

- Nenhuma skill especifica — Playwright ja esta configurado no projeto
</skills>

<requirements>
- Testes devem rodar com `bun run test:e2e` a partir da raiz
- Usar o arquivo `e2e/app.spec.ts` existente
- Testes devem cobrir fluxo principal (busca → exibicao), fluxo de erro (404) e responsividade
- Backend e frontend devem estar rodando durante os testes (configuracao `webServer` do Playwright)
- Testes devem usar dados reais da API Open-Meteo (sem mocks no E2E)
</requirements>

## Subtarefas

- [ ] 3.1 Verificar e ajustar `playwright.config.ts` para garantir que `webServer` inicia backend e frontend corretamente
- [ ] 3.2 Implementar teste E2E: fluxo principal — digitar cidade no campo de busca, submeter, verificar que HeroCard (temperatura, condicao, cidade), MetricCards (4 cards), grafico hora a hora, barra UV e previsao 7 dias aparecem na tela
- [ ] 3.3 Implementar teste E2E: fluxo de erro — digitar cidade inexistente, submeter, verificar que mensagem amigavel "Cidade nao encontrada" aparece com botao de retry
- [ ] 3.4 Implementar teste E2E: responsividade mobile (390px) — verificar layout em coluna unica, todos os componentes visiveis e empilhados verticalmente
- [ ] 3.5 Implementar teste E2E: responsividade desktop (1440px) — verificar layout em 3 colunas, header com titulo e busca no topo
- [ ] 3.6 Executar todos os testes e garantir que passam nos 3 browsers (Chromium, Firefox, WebKit)

## Detalhes de Implementacao

Consultar a secao **"Testes E2E"** da `techspec.md` e a secao **"Fluxo Principal"** e **"Fluxo de Erro"** do `prd.md`.

### Configuracao do Playwright

O `playwright.config.ts` na raiz ja existe. Verificar se o `webServer` esta configurado para iniciar ambos os servidores:
- Backend: `bun run dev:backend` na porta 3000
- Frontend: `bun run dev:frontend` na porta 5173

### Seletores sugeridos

Usar `data-testid` ou texto visivel para localizar elementos:
- Campo de busca: placeholder "Buscar cidade..."
- HeroCard: temperatura em destaque, nome da cidade
- MetricCards: textos "Umidade", "Vento", "UV", "Precipitacao"
- Grafico: container do Recharts
- Barra UV: texto de classificacao (ex: "Moderado", "Alto")
- Previsao 7 dias: nomes dos dias da semana
- Erro: texto "Cidade nao encontrada", botao "Tentar novamente"

### Fluxo principal detalhado

1. Navegar para `http://localhost:5173`
2. Localizar campo de busca
3. Digitar "Sao Paulo"
4. Pressionar Enter
5. Aguardar loading desaparecer
6. Verificar que HeroCard exibe temperatura (numero seguido de grau)
7. Verificar que nome da cidade aparece
8. Verificar que 4 MetricCards estao visiveis
9. Verificar que grafico hora a hora esta renderizado
10. Verificar que barra UV esta visivel com classificacao
11. Verificar que previsao 7 dias exibe 7 linhas

### Fluxo de erro detalhado

1. Digitar "xyznonexistent123" no campo de busca
2. Pressionar Enter
3. Aguardar loading desaparecer
4. Verificar que mensagem "Cidade nao encontrada" esta visivel
5. Verificar que botao "Tentar novamente" esta visivel
6. Clicar em "Tentar novamente"
7. Verificar que campo de busca esta focado e vazio

## Criterios de Sucesso

- Todos os testes E2E passam nos 3 browsers (Chromium, Firefox, WebKit)
- Teste do fluxo principal valida exibicao de todos os componentes com dados reais
- Teste de erro valida mensagem amigavel e funcionalidade de retry
- Testes de responsividade validam layouts corretos em mobile e desktop
- `bun run test:e2e` executa com sucesso a partir da raiz

## Testes da Tarefa

- [ ] E2E: fluxo principal — busca de cidade → exibicao completa de dados climaticos
- [ ] E2E: fluxo de erro — cidade inexistente → mensagem amigavel → retry
- [ ] E2E: responsividade mobile (390px) — layout em coluna unica
- [ ] E2E: responsividade desktop (1440px) — layout em 3 colunas
- [ ] Verificar: `bun run test:e2e` passa com sucesso

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERA-LA FINALIZADA</critical>

## Arquivos relevantes

- `e2e/app.spec.ts` — testes E2E (arquivo existente, adicionar novos testes)
- `playwright.config.ts` — configuracao do Playwright (pode precisar ajuste no webServer)
- `tasks/prd-painel-clima/techspec.md` — secao "Testes E2E"
- `tasks/prd-painel-clima/prd.md` — secoes "Fluxo Principal" e "Fluxo de Erro"
