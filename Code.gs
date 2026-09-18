/**
 * Backend de sincronização/backup para o "Diário de Formação SIXSIS".
 *
 * Como usar:
 * 1. Cria uma Google Sheet nova (em branco).
 * 2. No menu, Extensões > Apps Script.
 * 3. Apaga o conteúdo do ficheiro "Code.gs" que aparece por omissão e
 *    cola aqui todo este ficheiro.
 * 4. Guarda (ícone de disquete).
 * 5. Implementar > Nova implementação > tipo "Aplicação Web".
 *      - Executar como: Eu (a tua conta)
 *      - Quem tem acesso: Qualquer pessoa
 * 6. Autoriza quando pedido. Copia o URL do "Web app" que é apresentado
 *    (termina em /exec) — é esse URL que colas nas Definições da app,
 *    no campo "URL de sincronização".
 *
 * A app guarda um "instantâneo" completo do estado (config, dias,
 * participantes, assinaturas) de cada vez que algo muda, e também
 * mantém uma folha de leitura fácil "Presenças" sempre atualizada.
 */

var SHEET_ESTADO = "Estado";
var SHEET_PRESENCAS = "Presenças";

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    guardarEstado(body);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, savedAt: new Date().toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var estado = lerEstado();
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, data: estado }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

function guardarEstado(payload) {
  var sheet = getSheet_(SHEET_ESTADO);
  sheet.getRange("A1").setValue("Não editar esta folha à mão — é a cópia de segurança automática.");
  sheet.getRange("A2").setValue(JSON.stringify(payload));
  sheet.getRange("B2").setValue(new Date());
  atualizarFolhaPresencas_(payload);
}

function lerEstado() {
  var sheet = getSheet_(SHEET_ESTADO);
  var raw = sheet.getRange("A2").getValue();
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

function atualizarFolhaPresencas_(payload) {
  var sheet = getSheet_(SHEET_PRESENCAS);
  sheet.clear();

  var cfg = payload.config || {};
  var dias = cfg.dias || [];
  var participantes = payload.participants || [];
  var assinaturas = payload.signatures || {};

  var linha = 1;
  sheet.getRange(linha, 1).setValue("Designação"); sheet.getRange(linha, 2).setValue(cfg.designacao || ""); linha++;
  sheet.getRange(linha, 1).setValue("Formador"); sheet.getRange(linha, 2).setValue(cfg.formador || ""); linha++;
  sheet.getRange(linha, 1).setValue("Entidade Formadora"); sheet.getRange(linha, 2).setValue(cfg.entidade || ""); linha++;
  sheet.getRange(linha, 1).setValue("Local de Realização"); sheet.getRange(linha, 2).setValue(cfg.local || ""); linha++;
  sheet.getRange(linha, 1).setValue("Horário"); sheet.getRange(linha, 2).setValue(cfg.horario || ""); linha++;
  linha += 1;

  sheet.getRange(linha, 1).setValue("Resumo dos conteúdos abordados");
  linha++;
  dias.forEach(function (d) {
    sheet.getRange(linha, 1).setValue(d.data || "");
    sheet.getRange(linha, 2).setValue(d.resumo || "");
    linha++;
  });
  linha += 1;

  sheet.getRange(linha, 1).setValue("Presenças");
  linha++;
  var header = ["Participante"].concat(dias.map(function (d) { return d.data; }));
  sheet.getRange(linha, 1, 1, header.length).setValues([header]);
  var headerRow = linha;
  linha++;
  participantes.forEach(function (p) {
    var row = [p.nome];
    dias.forEach(function (d, i) {
      var key = p.id + "_d" + i;
      var sig = assinaturas[key];
      row.push(sig ? ("Assinado " + (sig.ts || "")) : "");
    });
    sheet.getRange(linha, 1, 1, row.length).setValues([row]);
    linha++;
  });

  sheet.getRange(headerRow, 1, 1, header.length).setFontWeight("bold");
  sheet.autoResizeColumns(1, Math.max(header.length, 2));
}
