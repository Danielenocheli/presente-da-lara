# Cenários de Testes

## Escopo

Validar o fluxo do presente da Lara, a tela do quebra-cabeça, as dificuldades disponíveis, o encaixe das peças, a experiência responsiva, a acessibilidade e a publicação no GitHub Pages.

## Convenções

- Prioridade P0: bloqueia o uso principal ou causa perda de dados/experiência.
- Prioridade P1: funcionalidade importante com impacto relevante.
- Prioridade P2: melhoria ou comportamento secundário.
- Resultado: marcar como `Passou`, `Falhou` ou `Bloqueado`.

## Dados de Teste

- URL local: `http://127.0.0.1:4173/`
- URL publicada: `https://danielenocheli.github.io/presente-da-lara/`
- Dificuldades: 50, 100, 150 e 200 peças.
- Navegadores: Chrome ou Edge atualizados.
- Viewports: desktop 1440x900, tablet 768x1024 e mobile 390x844.

## Fluxo do Presente

| ID | Cenário | Passos | Resultado esperado | Pri. |
| --- | --- | --- | --- | --- |
| CT-001 | Abrir a tela inicial | Acessar a URL do presente | A página abre sem erro e o presente começa fechado | P0 |
| CT-002 | Abrir o presente | Clicar em `Abrir presente` | A tampa anima uma vez e a carta aparece | P0 |
| CT-003 | Evitar clique duplicado | Clicar várias vezes durante a animação | Apenas uma abertura ocorre, o botão fica desabilitado/oculto e não há estado duplicado | P1 |
| CT-004 | Validar a carta | Ler o texto após abrir | A mensagem da Lara aparece completa e sem alteração | P0 |
| CT-005 | Continuar para o jogo | Clicar em `Continuar` | O usuário é levado para `jogo.html` | P0 |
| CT-006 | Voltar da apresentação | Clicar em `Voltar` | O navegador retorna sem erro para `index.html` ou para a raiz da apresentação | P1 |

## Cabeçalho e Controles

| ID | Cenário | Passos | Resultado esperado | Pri. |
| --- | --- | --- | --- | --- |
| CT-007 | Iniciar quebra-cabeça | Acessar `jogo.html` | O tabuleiro, a grade e os controles aparecem; não existe coluna lateral antiga | P0 |
| CT-008 | Trocar dificuldade | Selecionar 50, 100, 150 e 200 peças | A quantidade exibida no tabuleiro corresponde à opção escolhida | P0 |
| CT-009 | Embaralhar | Clicar em `Embaralhar` | As peças são redistribuídas, o progresso volta a 0% e os movimentos são zerados | P1 |
| CT-010 | Desfazer sem movimento | Abrir o jogo e observar `Desfazer` | O botão começa desabilitado | P1 |
| CT-011 | Desfazer movimento | Mover uma peça e clicar em `Desfazer` | A peça retorna ao estado anterior e o contador é atualizado | P1 |
| CT-012 | Mostrar foto | Clicar em `Ver foto` | A foto-guia aparece sem impedir o arraste das peças | P1 |
| CT-013 | Esconder foto | Clicar novamente em `Esconder foto` | A foto-guia desaparece e a grade continua disponível | P1 |
| CT-014 | Tela cheia | Clicar no botão de tela cheia | Somente a área do quebra-cabeça ocupa a tela; os demais elementos da aplicação ficam ocultos | P1 |
| CT-015 | Sair da tela cheia | Pressionar `Esc` após entrar em tela cheia | A tela retorna ao estado normal sem perder as peças | P1 |

## Montagem e Regras do Jogo

| ID | Cenário | Passos | Resultado esperado | Pri. |
| --- | --- | --- | --- | --- |
| CT-016 | Peças fora da grade | Iniciar o jogo em cada dificuldade | As peças embaralhadas ficam na bandeja direita no desktop e não cobrem a grade | P0 |
| CT-017 | Grade preenchendo o card | Observar o tabuleiro em desktop | A grade ocupa o espaço principal do card, sem buracos ou área desnecessária | P1 |
| CT-018 | Encaixe correto | Arrastar uma peça para a célula correspondente | A peça encaixa, recebe feedback visual e fica bloqueada | P0 |
| CT-019 | Tentar mover peça bloqueada | Arrastar novamente uma peça correta | A peça permanece imóvel e não incrementa movimentos | P0 |
| CT-020 | Encaixe incorreto | Soltar uma peça em célula errada | A peça não é bloqueada, retorna à bandeja e exibe orientação ao usuário | P0 |
| CT-021 | Feedback acessível | Encaixar uma peça corretamente | A mensagem de feedback é atualizada em uma região `role=status` | P1 |
| CT-022 | Completar o jogo | Encaixar todas as peças | Progresso chega a 100%, mensagem final aparece e novas alterações não desfazem a conclusão | P0 |
| CT-023 | Contagem de movimentos | Fazer um movimento válido e um inválido | O contador considera somente movimentos realizados pelo usuário | P1 |
| CT-024 | Grade sem frestas | Completar o jogo em 50 e 200 peças | A imagem final fica contínua, sem cortes, sobreposição ou buracos brancos | P0 |

## Responsividade

| ID | Cenário | Passos | Resultado esperado | Pri. |
| --- | --- | --- | --- | --- |
| CT-025 | Desktop | Abrir em 1440x900 | Cabeçalho, grade e bandeja direita ficam enquadrados sem overflow horizontal | P0 |
| CT-026 | Tablet | Abrir em 768x1024 | Controles quebram de forma organizada e o tabuleiro permanece utilizável | P1 |
| CT-027 | Mobile | Abrir em 390x844 | A grade aparece acima e as peças ficam centralizadas abaixo, sem sobreposição | P0 |
| CT-028 | Mobile com 200 peças | Selecionar 200 peças no mobile | A página permite rolagem vertical e todas as peças permanecem acessíveis | P1 |
| CT-029 | Rotação do dispositivo | Alternar retrato e paisagem | O layout se recalcula sem perder peças encaixadas | P1 |

## Acessibilidade e Segurança

| ID | Cenário | Passos | Resultado esperado | Pri. |
| --- | --- | --- | --- | --- |
| CT-030 | Navegação por teclado | Usar `Tab`, `Enter` e `Espaço` | Todos os controles recebem foco visível e podem ser acionados | P0 |
| CT-031 | Leitor de tela | Inspecionar nomes acessíveis | Botões, seletor, progresso e status possuem nomes compreensíveis | P1 |
| CT-032 | Redução de movimento | Ativar `prefers-reduced-motion` | Animações são reduzidas ou removidas sem quebrar o fluxo | P1 |
| CT-033 | Contraste | Verificar textos, bordas e estados | O conteúdo permanece legível em todos os estados | P1 |
| CT-034 | Recursos locais | Desconectar a rede após carregar a página | Nenhum script externo é necessário para o jogo funcionar | P2 |
| CT-035 | Conteúdo inesperado | Alterar parâmetros da URL, como `?demo=abc` | A aplicação continua em estado seguro e não executa conteúdo arbitrário | P1 |
| CT-036 | Política de conteúdo | Inspecionar cabeçalho CSP no servidor | Scripts e imagens são aceitos somente pelas origens previstas | P1 |

## Deploy e Regressão

| ID | Cenário | Passos | Resultado esperado | Pri. |
| --- | --- | --- | --- | --- |
| CT-037 | Testes automatizados | Executar `npm test` | Todos os testes da lógica passam | P0 |
| CT-038 | Verificar alterações versionadas | Executar `git status` e revisar o commit | Não existem arquivos acidentais ou mudanças fora do escopo | P1 |
| CT-039 | Publicação Pages | Fazer push para `main` e abrir Actions | O workflow `Publicar no GitHub Pages` termina com sucesso | P0 |
| CT-040 | Smoke test online | Abrir a URL publicada, abrir o presente e entrar no jogo | O fluxo principal funciona com os mesmos recursos da versão local | P0 |

## Critérios de Aceite

- Todos os cenários P0 devem estar como `Passou`.
- Nenhum cenário pode apresentar perda de peças encaixadas.
- Não pode existir overflow horizontal em desktop, tablet ou mobile.
- O workflow do GitHub Pages deve terminar com sucesso.
- O smoke test online deve validar a abertura do presente e o início do jogo.

## Evidências Recomendadas

Para cada execução, registrar data, navegador, viewport, resultado, observação e captura de tela quando houver falha. Para defeitos, informar o ID do cenário, passos para reproduzir e o commit em que o problema foi observado.
