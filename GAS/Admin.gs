/**
 * ERM FISIOTA BACKEND - V5.0 (MODULAR)
 * FILE: Admin.gs
 * Deskripsi: Modul khusus untuk Notifikasi dan Antarmuka Admin Internal.
 */

// 🔑 ADMIN BOT CREDENTIALS
const ADMIN_TG_TOKEN = "8605563144:AAFE3hyfdBCzuLfrKnykj-g3AZio5xuuPE0";
const ADMIN_TG_CHAT_ID = "7823489551";

/**
 * [BARU] Pengingat Admin H-1 Masa Aktif Habis
 * Fungsi ini mengecek seluruh lisensi aktif yang akan habis BESOK (H-1).
 * Setup Trigger: Time-driven > Day timer > Jam 08:00 - 09:00 pagi.
 */
function checkAdminExpirations() {
  Logger.log("🚀 START: Checking License Expirations for Admin (H-1)...");
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.LICENSES);
  if (!sheet) {
    Logger.log("❌ Error: Tab Licenses tidak ditemukan.");
    return;
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Mapping index kolom secara dinamis
  const colName   = findColumnIndex(headers, ['client_name', 'nama_klien']);
  const colStatus = findColumnIndex(headers, ['status']);
  const colExpiry = findColumnIndex(headers, ['expires_at', 'expired_at']);
  const colWA     = findColumnIndex(headers, ['whatsapp', 'wa']);
  const colEmail  = findColumnIndex(headers, ['email']);
  const colKey    = 0; // Key selalu di kolom pertama (A)

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = Utilities.formatDate(tomorrow, TIMEZONE, "yyyy-MM-dd");

  let alertCount = 0;

  for (let i = 1; i < data.length; i++) {
    const status = String(data[i][colStatus] || "").toUpperCase().trim();
    const expiryDate = data[i][colExpiry];
    
    if (status === 'ACTIVE' && expiryDate) {
      const expiryStr = Utilities.formatDate(new Date(expiryDate), TIMEZONE, "yyyy-MM-dd");
      
      // Jika expired BESOK (H-1)
      if (expiryStr === tomorrowStr) {
        const clientName = data[i][colName] || "Klien Tanpa Nama";
        const email = data[i][colEmail] || "-";
        const wa = data[i][colWA] || "-";
        const key = data[i][colKey];
        
        let msg = `⚠️ <b>PENGINGAT ADMIN: LISENSI H-1</b>\n`;
        msg += `━━━━━━━━━━━━━━━━━━\n`;
        msg += `🏥 Klinik: <b>${clientName}</b>\n`;
        msg += `🔑 Key: <code>${key}</code>\n`;
        msg += `📅 Expired: ${Utilities.formatDate(new Date(expiryDate), TIMEZONE, "dd MMM yyyy")}\n`;
        msg += `━━━━━━━━━━━━━━━━━━\n`;
        msg += `📞 Kontak Klien:\n`;
        msg += `• WA: ${wa}\n`;
        msg += `• Email: ${email}\n\n`;
        msg += `Mohon segera hubungi klien agar perpanjangan tidak terlambat. 🙏`;

        // Kirim ke Bot Admin
        sendTelegram(ADMIN_TG_TOKEN, ADMIN_TG_CHAT_ID, msg);
        alertCount++;
        Logger.log(`   ✅ Alert sent for: ${clientName}`);
      }
    }
  }

  Logger.log(`🏁 FINISHED: Mengirim ${alertCount} peringatan ke Admin.`);
}
