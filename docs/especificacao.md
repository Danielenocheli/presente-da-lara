# Quebra-cabeca de Dia dos Pais

## Necessidade

Criar uma aplicacao web simples, afetiva e segura para a filha montar um quebra-cabeca com uma foto dela com o pai e entregar como presente de Dia dos Pais. A experiencia deve ser leve, direta e sem expor dados pessoais em servicos externos.

## Publico

- Crianca que ira jogar e presentear.
- Pai que recebera o presente.
- Responsavel que prepara e compartilha a aplicacao.

## Criterios de aceite

- A apresentacao do presente aparece antes do jogo.
- A caixa inicia fechada, abre uma unica vez por interacao e revela a carta.
- A mensagem da Lara e exibida exatamente como fornecida.
- O botao de continuidade navega para a tela existente do quebra-cabeca.
- A aplicacao abre em navegador moderno sem instalacao.
- A foto aparece como referencia e como imagem das pecas.
- O usuario consegue escolher 50, 100, 150 ou 200 pecas, embaralhar e montar o quebra-cabeca.
- O app conta movimentos e progresso.
- O usuario consegue desfazer o ultimo movimento.
- O usuario recebe feedback visual quando encaixa peca no lugar certo.
- Pecas encaixadas no lugar correto ficam bloqueadas para novas trocas.
- O usuario consegue ativar e sair do modo tela cheia.
- Ao concluir, uma mensagem de Dia dos Pais e exibida.
- O jogo funciona em desktop e celular.
- Nenhuma informacao e enviada para servidor.

## Requisitos funcionais

- RF01: Exibir a foto de referencia.
- RF02: Gerar tabuleiro com dificuldades de 50 pecas, 100 pecas, 150 pecas e 200 pecas.
- RF03: Embaralhar as pecas sem iniciar resolvido.
- RF04: Permitir mover pecas livremente por arrastar e soltar.
- RF05: Permitir encaixe por teclado como alternativa acessivel.
- RF06: Atualizar quantidade de movimentos a cada arraste valido.
- RF07: Calcular progresso conforme pecas na posicao correta.
- RF08: Exibir mensagem final ao completar o puzzle.
- RF09: Permitir desfazer o ultimo movimento enquanto a partida nao estiver concluida.
- RF10: Permitir mostrar a foto completa de forma suave atras das pecas como dica.
- RF11: Exibir feedback visual e textual quando uma peca for encaixada na posicao correta.
- RF12: Bloquear interacao com pecas que ja estejam na posicao correta.
- RF13: Permitir alternar a aplicacao para modo tela cheia.

## Requisitos nao funcionais

- RNF01: Deve ser uma aplicacao estatica com HTML, CSS e JavaScript.
- RNF02: Deve carregar rapido e funcionar localmente.
- RNF03: Deve ter layout responsivo.
- RNF04: Deve separar regra de jogo da interface para permitir testes.
- RNF05: Deve evitar dependencias externas.

## Regras de negocio

- RN01: Cada peca possui uma posicao correta fixa.
- RN02: Uma jogada valida move uma peca para uma nova posicao.
- RN03: Movimento so e contado quando a peca realmente muda de posicao.
- RN04: O progresso e a porcentagem de pecas em suas posicoes corretas.
- RN05: O jogo termina quando todas as pecas estao na posicao correta.
- RN06: Ao trocar a dificuldade, uma nova partida comeca.
- RN07: Desfazer volta apenas a ultima jogada valida e reduz um movimento.
- RN08: Quando o jogo termina, as pecas nao podem mais ser alteradas ate uma nova partida.
- RN09: A dificuldade de 50 pecas usa grade 10x5.
- RN10: A dificuldade de 100 pecas usa grade 10x10.
- RN11: A dificuldade de 150 pecas usa grade 15x10.
- RN12: A dificuldade de 200 pecas usa grade 20x10.
- RN13: Uma peca correta fica bloqueada e nao pode ser movida novamente.

## Arquitetura

- `index.html`: apresentacao do presente e carta da Lara.
- `jogo.html`: estrutura preservada da tela do quebra-cabeca.
- `styles.css`: layout responsivo e identidade visual.
- `src/puzzle-core.js`: funcoes puras da regra do jogo.
- `src/app.js`: integracao da interface com a regra.
- `src/presente.js`: estados fechado, abrindo e aberto da apresentacao.
- `assets/foto-papai-e-filha.jpeg`: imagem usada no presente.
- `assets/presente-fechado.png` e `assets/presente-aberto.png`: estados visuais da caixa.
- `tests/puzzle-core.test.mjs`: testes automatizados da regra.
- `scripts/capture-screenshots.cjs`: captura imagens reais das telas para documentacao.

## Implementacao

A aplicacao posiciona as pecas livremente dentro do tabuleiro. Cada peca e um botao recortado no formato de quebra-cabeca, com a foto reposicionada para mostrar o trecho correspondente. Durante o arraste, a distancia ate o destino e calculada; ao entrar na tolerancia de encaixe, a peca e alinhada, recebe feedback e fica bloqueada.

## Execucao

Para rodar localmente:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Depois acesse:

```text
http://127.0.0.1:4173
```

Tambem ha scripts no `package.json`:

```powershell
npm test
npm run serve
npm run screenshots
```

## Testes

Testes automatizados cobrem:

- criacao do tabuleiro ordenado;
- verificacao de puzzle resolvido;
- troca de pecas;
- calculo de progresso;
- mapeamento de indice para linha/coluna;
- embaralhamento sem partida ja resolvida;
- validacoes de entrada.

Para executar:

```powershell
npm test
```

## Seguranca e privacidade

- A aplicacao nao usa backend, cookies, formularios ou armazenamento persistente.
- A foto fica apenas no pacote local do projeto.
- A politica CSP restringe scripts, estilos, imagens e frames ao proprio app.
- Nao ha dependencias de CDN, reduzindo risco de cadeia de suprimentos.
- Para compartilhar publicamente, o ideal e hospedar como site estatico e revisar se a familia esta confortavel com a exposicao da foto.
