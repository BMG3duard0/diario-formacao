# Diário de Formação SIXSIS — instalação e utilização

Esta é uma PWA verdadeira: fica alojada num endereço teu, instala-se no tablet
como uma aplicação normal (ícone no ecrã inicial, ecrã inteiro, sem barra de
endereço) e funciona sem internet. Os dados ficam guardados no próprio tablet e,
se ligares a sincronização, também numa Google Sheet tua.

## O que vem no pacote

O ficheiro `index.html` é a aplicação, `manifest.json` é o que diz ao tablet
como a instalar, `service-worker.js` é o que a faz funcionar offline, a pasta
`icons` tem o ícone da aplicação e o logótipo SIXSIS, e `Code.gs` é o código a
colar no Google Apps Script se quiseres a cópia de segurança automática.

---

## Passo 1 — Publicar no GitHub Pages

1. Cria conta em github.com, se ainda não tiveres.
2. Carrega no `+` (canto superior direito) e escolhe **New repository**.
3. Dá-lhe um nome simples, por exemplo `diario-formacao`. Escolhe **Public**
   (o GitHub Pages gratuito exige repositório público) e carrega em
   **Create repository**.
4. Na página que aparece, clica em **uploading an existing file**.
5. Arrasta para ali o conteúdo desta pasta: `index.html`, `manifest.json`,
   `service-worker.js` e a pasta `icons` inteira. Atenção: arrasta os
   ficheiros, não a pasta que os contém — o `index.html` tem de ficar na raiz
   do repositório. O `INSTRUCOES.md` e o `Code.gs` podes enviar também, não
   fazem mal nenhum.
6. Em baixo, carrega em **Commit changes**.
7. Vai a **Settings** (no topo do repositório) e, na coluna da esquerda, a
   **Pages**. Em *Branch*, escolhe `main` e a pasta `/ (root)`, e carrega em
   **Save**.
8. Espera um ou dois minutos e recarrega essa página: aparece o endereço, do
   género `https://oteunome.github.io/diario-formacao/`. É este o endereço da
   tua aplicação. Guarda-o.

O endereço é público, ou seja, quem o souber consegue abrir a aplicação. Não
mostra dados nenhuns: cada tablet só vê o que foi escrito nesse tablet (ou o
que vier da tua Google Sheet, e essa está protegida pela tua conta Google).

---

## Passo 2 — Cópia de segurança automática no Google

Sem este passo a aplicação funciona na mesma, mas os registos só existem no
tablet. Com ele, tudo o que escreveres é copiado para uma folha de cálculo tua,
automaticamente, poucos segundos depois de cada alteração.

1. Cria uma Google Sheet nova e vazia (sheets.new).
2. No menu, **Extensões → Apps Script**.
3. Apaga o que lá estiver no `Code.gs` e cola todo o conteúdo do ficheiro
   `Code.gs` deste pacote. Guarda (ícone da disquete).
4. Carrega em **Implementar → Nova implementação**. No ícone da engrenagem
   escolhe o tipo **Aplicação Web**. Define *Executar como*: **Eu**, e
   *Quem tem acesso*: **Qualquer pessoa**. Carrega em **Implementar**.
5. Autoriza quando o Google pedir (vai aparecer um aviso de "aplicação não
   verificada" — é a tua própria, escolhe *Avançadas* e prossegue).
6. Copia o **URL da aplicação web**, que acaba em `/exec`.
7. Abre a aplicação no tablet, toca na engrenagem, cola esse URL no campo
   **URL de sincronização** e carrega em **Guardar**.

A partir daí aparece um ponto colorido junto à engrenagem: verde quer dizer
copiado, laranja a enviar, vermelho sem ligação (tenta outra vez sozinho
quando a internet voltar).

Na Google Sheet vais ver duas folhas: **Presenças**, legível, com o resumo de
cada dia e a matriz de quem assinou o quê, e **Estado**, que é a cópia técnica
que permite recuperar tudo noutro tablet. Não mexas na folha Estado.

O botão **Recuperar da nuvem**, nas definições, traz para o tablet o último
estado guardado — útil se mudares de equipamento ou se algo correr mal.

---

## Passo 3 — Instalar no tablet

**Android (Chrome):** abre o endereço do Passo 1. Aparece uma barra a propor
*Instalar aplicação*; se não aparecer, menu dos três pontos → **Instalar
aplicação** ou **Adicionar ao ecrã principal**.

**iPad (Safari):** abre o endereço, toca no botão de partilha (quadrado com
seta) e escolhe **Adicionar ao ecrã principal**. Tem de ser no Safari; no
Chrome do iPad esta opção não existe.

Em qualquer dos casos fica um ícone bronze com "SS" no ecrã inicial, e ao abrir
ocupa o ecrã todo, sem barra de endereço. Depois de aberta uma vez, funciona
sem internet.

---

## Como se usa

As abas em cima são os dias da formação; ao abrir, salta automaticamente para o
dia de hoje, se for um dos dias configurados. Escreves o sumário na caixa de
texto — guarda-se sozinho, não há botão de gravar. Passas o tablet ao formando,
ele toca em **Assinar** ao lado do nome, assina com o dedo ou caneta e confirma;
fica a assinatura em miniatura e a hora. No dia seguinte mudas de aba e a folha
está limpa outra vez, mas o dia anterior continua lá.

O botão da seta para baixo exporta tudo para um ficheiro CSV que abres no Excel.

Na engrenagem mudas a designação, o formador, o local, o horário e os dias, e
acrescentas ou removes participantes na lista principal.

Para a formação seguinte, usa **Começar nova formação (limpar tudo)** nas
definições — mas exporta ou sincroniza primeiro, porque isso apaga os registos
deste tablet.

---

## Notas

Os dados vivem no armazenamento do browser do tablet. Se limpares os dados de
navegação ou desinstalares a aplicação, perdes o que estiver lá — daí valer a
pena o Passo 2. Se usares dois tablets ao mesmo tempo com o mesmo URL de
sincronização, o último a gravar sobrepõe-se ao outro; para vários tablets em
paralelo era preciso outra abordagem, diz-me se vier a fazer falta.

Para atualizar a aplicação mais tarde, basta substituir os ficheiros no GitHub;
o tablet apanha a versão nova sozinho da próxima vez que abrir com internet.
