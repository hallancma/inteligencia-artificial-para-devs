# Documento de Requisitos de Produto (PRD) — Painel de Clima

## Referencia de Design (Paper)

| Artboard              | Descricao                                                                                                            | ID     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- | ------ |
| Clima — Mobile        | Layout mobile (390x1080) — coluna unica, busca no topo, hero card, metricas, grafico horario, barra UV, lista 7 dias | `CI-0` |
| Clima — Desktop       | Layout desktop (1440x560) — 3 colunas, header com titulo e busca, hero + metricas, grafico + UV, 7 dias              | `MH-0` |
| Clima — Card Variants | Variacoes visuais do hero card por condicao climatica (ensolarado, nublado, chuva)                                   | `MI-0` |

## Design Tokens

Todos os tokens de design (cores, gradientes, tipografia, espacamento, raios, sombras e specs de componentes) estao extraidos do Paper e disponveis em:

**Arquivo:** [`design-spec.json`](./design-spec.json)

## Visao Geral

O Painel de Clima e uma aplicacao web que permite a qualquer usuario consultar condicoes climaticas atuais e previsoes meteorologicas de forma rapida, visual e intuitiva. O usuario busca uma cidade (ou usa geolocalizacao) e recebe temperatura atual, umidade, vento, indice UV, precipitacao, previsao hora a hora e previsao de 7 dias.

O projeto resolve a necessidade de acesso simples e visual a dados meteorologicos, servindo como exercicio educacional de integracao de APIs externas (Open-Meteo), boas praticas de desenvolvimento React 19 + Hono/Bun e construcao de interfaces responsivas de alta qualidade.

## Objetivos

- Entregar uma interface funcional que exiba dados climaticos reais consumidos via backend (sem acesso direto a API externa pelo frontend)
- Demonstrar integracao completa frontend-backend com tratamento adequado de erros, loading states e feedback visual
- Atingir qualidade visual de referencia conforme os designs definidos (mobile 390px, desktop 1440px)
- Garantir responsividade mobile-first com experiencia consistente em diferentes tamanhos de tela
- Servir como projeto educacional para pratica de React 19, Hono, Tailwind v4, shadcn/ui e consumo de APIs REST

## Historias de Usuario

**HU-01 — Buscar cidade por nome**
Como usuario, eu quero digitar o nome de uma cidade no campo de busca para que eu veja as condicoes climaticas daquele local.

**HU-02 — Usar geolocalizacao**
Como usuario, eu quero pressionar o botao de geolocalizacao para que o app descubra minha cidade automaticamente e exiba o clima local.

**HU-03 — Ver clima atual**
Como usuario, eu quero ver a temperatura atual, condicao climatica (ex: "Parcialmente nublado"), sensacao termica e localizacao para planejar meu dia.

**HU-04 — Ver metricas detalhadas**
Como usuario, eu quero ver umidade, velocidade do vento, indice UV e precipitacao em cards dedicados para ter uma visao completa das condicoes atuais.

**HU-05 — Consultar previsao hora a hora**
Como usuario, eu quero ver um grafico interativo com temperatura e precipitacao das proximas horas para entender a tendencia do dia.

**HU-06 — Consultar previsao de 7 dias**
Como usuario, eu quero ver a previsao dos proximos 7 dias com temperatura minima, maxima e probabilidade de precipitacao para planejar a semana.

**HU-07 — Visualizar indice UV**
Como usuario, eu quero ver uma barra visual de indice UV com gradiente de cores (verde a vermelho) e classificacao textual para entender o risco de exposicao solar.

**HU-08 — Feedback de loading**
Como usuario, eu quero ver skeleton loading e indicadores visuais durante o carregamento para saber que o app esta processando minha busca.

**HU-09 — Feedback de erro**
Como usuario, eu quero ver uma mensagem amigavel quando uma cidade nao for encontrada, com opcao de tentar novamente, para nao ficar sem resposta.

**HU-10 — Experiencia visual dinamica**
Como usuario, eu quero que o background e as cores do app reflitam a condicao climatica atual para uma experiencia mais imersiva e informativa.

## Funcionalidades Principais

### F01 — Campo de Busca de Cidade

Permite ao usuario digitar o nome de uma cidade para consultar o clima. O campo nao possui autocomplete. Ao submeter a busca, o backend converte o nome da cidade em coordenadas geograficas via Geocoding API e retorna os dados climaticos.

- RF01.1: Campo de texto com placeholder "Buscar cidade..."
- RF01.2: Busca acionada por Enter ou submit do formulario
- RF01.3: Sem autocomplete de cidades
- RF01.4: Feedback visual de loading durante a busca
- RF01.5: Mensagem amigavel quando a cidade nao for encontrada (HTTP 404)
- RF01.6: Mensagem de erro quando dados obrigatorios estiverem ausentes (HTTP 400)

### F02 — Geolocalizacao

Botao ao lado do campo de busca que solicita a localizacao do navegador e busca o clima das coordenadas do usuario.

- RF02.1: Botao com icone de localizacao posicionado ao lado do campo de busca
- RF02.2: Solicita permissao de geolocalizacao do navegador ao ser clicado
- RF02.3: Usa as coordenadas obtidas para buscar dados climaticos
- RF02.4: Feedback de loading enquanto obtem localizacao e dados

### F03 — Clima Atual (Hero Card)

Card principal exibindo a condicao climatica atual com destaque visual.

- RF03.1: Exibir temperatura atual em graus Celsius
- RF03.2: Exibir descricao da condicao climatica (ex: "Parcialmente nublado")
- RF03.3: Exibir nome da cidade e estado/regiao
- RF03.4: Exibir sensacao termica
- RF03.5: Icone animado representando a condicao climatica
- RF03.6: Background com gradiente dinamico baseado na condicao climatica (3 variacoes: ensolarado, nublado, chuva)

### F04 — Cards de Metricas

Conjunto de 4 cards exibindo metricas detalhadas do clima atual.

- RF04.1: Card de Umidade — valor percentual com icone
- RF04.2: Card de Vento — velocidade em km/h com icone
- RF04.3: Card de Indice UV — valor numerico com icone
- RF04.4: Card de Precipitacao — valor em mm com icone

### F05 — Previsao Hora a Hora

Grafico interativo exibindo a previsao de temperatura e precipitacao para as proximas horas.

- RF05.1: Grafico de barras com temperatura por hora
- RF05.2: Valores de temperatura exibidos acima de cada barra
- RF05.3: Rotulos de hora no eixo horizontal
- RF05.4: Gradiente de cores nas barras (mais intenso = temperatura mais alta)
- RF05.5: Grafico interativo (hover/touch para detalhes)

### F06 — Barra de Indice UV

Barra visual horizontal mostrando o indice UV atual com gradiente de cores.

- RF06.1: Barra com gradiente de verde (baixo) a vermelho (extremo)
- RF06.2: Indicador/marcador na posicao correspondente ao valor atual
- RF06.3: Classificacao textual ao lado (ex: "6 Alto")

### F07 — Previsao de 7 Dias

Lista com a previsao dos proximos 7 dias.

- RF07.1: Exibir dia da semana para cada entrada
- RF07.2: Exibir probabilidade de precipitacao com icone
- RF07.3: Exibir temperatura minima e maxima
- RF07.4: Barra visual de temperatura min/max com gradiente proporcional
- RF07.5: Layout em lista com separacao visual entre dias

### F08 — Background Dinamico

O fundo da aplicacao reflete a condicao climatica selecionada.

- RF08.1: Gradiente de background muda conforme a condicao (3 variacoes)
- RF08.2: Variacao "Ensolarado" — tons de azul celeste
- RF08.3: Variacao "Nublado" — tons de roxo/lilas
- RF08.4: Variacao "Chuva" — tons de verde/turquesa
- RF08.5: Transicao suave ao trocar de cidade/condicao

## Experiencia do Usuario

### Personas

**Persona primaria**: Usuario geral que quer consultar o clima rapidamente antes de sair de casa ou planejar atividades da semana. Acessa de dispositivo movel ou desktop.

### Fluxo Principal

1. Usuario acessa a aplicacao
2. Digita o nome de uma cidade no campo de busca OU clica no botao de geolocalizacao
3. Skeleton loading e exibido durante o carregamento
4. App exibe: hero card com clima atual, cards de metricas, grafico hora a hora, barra UV e previsao de 7 dias
5. Usuario pode buscar outra cidade a qualquer momento

### Fluxo de Erro

1. Usuario digita cidade inexistente
2. Backend retorna 404
3. App exibe mensagem amigavel ("Cidade nao encontrada") com opcao de retry

### Layout e Responsividade

**Mobile (390px)**: Layout vertical em coluna unica. Campo de busca no topo, hero card abaixo, 4 cards de metricas em linha horizontal, grafico hora a hora, barra UV, lista de 7 dias. Conforme artboard "Clima — Mobile" do design.

**Desktop (1440px)**: Layout em 3 colunas. Coluna esquerda: hero card + cards de metricas + precipitacao. Coluna central: grafico hora a hora + barra UV. Coluna direita: previsao de 7 dias. Header com titulo "Painel de Clima" e campo de busca no canto superior direito. Conforme artboard "Clima — Desktop" do design.

### Variacoes Visuais de Condicao

Tres temas visuais de gradiente conforme a condicao climatica, documentados no artboard "Clima — Card Variants":

- **Ensolarado**: Gradiente azul celeste com icone de sol
- **Nublado**: Gradiente roxo/lilas com icone de sol parcialmente coberto por nuvem
- **Chuva**: Gradiente verde/turquesa com icone de nuvem com chuva

### Tipografia

- Fonte principal: Sora
- Hierarquia clara: temperatura em destaque (display grande), labels em tamanho menor, metricas em peso medio

### Acessibilidade

- Contraste adequado entre texto e backgrounds de gradiente
- Rotulos acessiveis em campos de formulario
- Feedback visual e textual para estados de loading e erro
- Suporte a navegacao por teclado no campo de busca

## Restricoes Tecnicas de Alto Nivel

- O frontend NAO deve acessar diretamente a API do Open-Meteo; todo acesso deve ser intermediado pelo backend
- Backend deve expor um unico endpoint: `GET /api/weather?city=<cidade>` com status codes 200 (sucesso), 400 (dados faltantes) e 404 (cidade nao encontrada)
- O payload retornado pelo backend deve ser o mesmo formato retornado pela API do Open-Meteo
- APIs externas utilizadas: Geocoding API (`geocoding-api.open-meteo.com/v1/search`) e Weather Forecast API (`api.open-meteo.com/v1/forecast`)
- O backend e responsavel por converter o nome da cidade em coordenadas (geocoding) antes de buscar os dados climaticos
- Nao ha necessidade de autenticacao ou chave de API (Open-Meteo e gratuita e aberta)

## Fora de Escopo

- Tema claro/escuro (toggle de tema) — explicitamente excluido
- Salvar cidades favoritas ou historico de buscas
- Autenticacao de usuarios ou contas
- Notificacoes ou alertas meteorologicos
- Suporte a multiplos idiomas (i18n)
- Cache agressivo ou estrategia de offline-first
- Mais de 3 variacoes visuais de condicao climatica
- Comentarios no codigo — explicitamente excluido
- Consumo direto da API Open-Meteo pelo frontend — explicitamente proibido
