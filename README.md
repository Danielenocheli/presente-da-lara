# Quebra-cabeca da Lara

Aplicacao web estatica com uma experiencia de abertura de presente, carta da Lara e quebra-cabeca com uma foto de pai e filha para o Dia dos Pais.

## Como abrir

Execute um servidor local na pasta do projeto:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Abra no navegador:

```text
http://127.0.0.1:4173
```

## Recursos

- Tela de presente anterior ao jogo.
- Caixa fechada com animacao curta de abertura.
- Carta acessivel em HTML com a mensagem da Lara.
- Navegacao da apresentacao para o jogo em `jogo.html`.
- Dificuldades de 50 pecas, 100 pecas, 150 pecas e 200 pecas.
- Posicionamento livre por arrastar e soltar.
- Encaixe assistido quando a peca chega perto do destino.
- Alternativa por teclado com Enter ou Espaco.
- Contador de movimentos.
- Progresso em porcentagem.
- Botao de desfazer o ultimo movimento.
- Feedback quando uma peca encaixa no lugar certo.
- Pecas corretas ficam travadas no tabuleiro.
- Dica visual com a foto completa atras das pecas.
- Modo tela cheia pelo botao do tabuleiro.
- Mensagem final afetiva ao concluir.

## Validacao

```powershell
npm test
```

As capturas reais das telas ficam em `docs/wireframes-imagens`.
