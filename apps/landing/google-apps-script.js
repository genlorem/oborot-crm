/**
 * НашСклад — Google Apps Script
 * Принимает два типа данных:
 *   type: 'waitlist' — подписчик с лендинга
 *   type: 'survey'  — заполненная анкета
 *
 * Настройка:
 * 1. Создайте Google Таблицу с двумя листами: "Waitlist" и "Survey"
 * 2. Расширения → Apps Script → вставьте этот код
 * 3. Развернуть → Новое развертывание → Веб-приложение
 *    - Запуск от имени: Я
 *    - Доступ: Все
 * 4. URL добавьте в .env как VITE_SHEETS_WEBHOOK_URL
 */

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const data = JSON.parse(e.postData.contents)

    if (data.type === 'waitlist') {
      const sheet = ss.getSheetByName('Waitlist') || ss.insertSheet('Waitlist')
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Дата', 'Контакт'])
        sheet.getRange(1, 1, 1, 2).setFontWeight('bold')
      }
      sheet.appendRow([new Date().toLocaleString('ru-RU'), data.contact])

    } else {
      // survey (default)
      const sheet = ss.getSheetByName('Survey') || ss.insertSheet('Survey')
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Дата', 'SKU', 'Маркетплейсы', 'Боли', 'Оценка боли', 'Желания', 'Имя', 'Контакт', 'Созвон'])
        sheet.getRange(1, 1, 1, 9).setFontWeight('bold')
      }
      sheet.appendRow([
        new Date().toLocaleString('ru-RU'),
        data.skuCount || '',
        data.platforms || '',
        data.pains || '',
        data.painScore || '',
        data.wishes || '',
        data.name || '',
        data.contact || '',
        data.callReady ? 'Да' : 'Нет',
      ])
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}
