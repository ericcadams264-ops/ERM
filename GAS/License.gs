/**
 * ERM FISIOTA BACKEND - V5.0 (MODULAR)
 * FILE: 3_License.gs
 * Deskrpsi: Logika Pembuatan, Validasi, dan Cleanup Lisensi.
 */

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Fungsi generateNewLicense dipanggil dari Sidebar
function generateNewLicense(clientName, durationType, email, whatsapp) {
    if (!clientName) throw new Error("Nama Klien Kosong");

    // 🔒 LICENSE DATA MUST BE ON ADMIN SHEET (Script Bound), NOT Client Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrInsertSheet(ss, SHEET_NAMES.LICENSES, HEADERS.LICENSES);

    // Hitung Expired Date
    const now = new Date();
    let expireDate = new Date();
    let planName = "";

    if (durationType === '5mins') {
        expireDate.setMinutes(now.getMinutes() + 5);
        planName = "Trial 5 Menit (Cepat)";
    } else if (durationType === '1hour') {
        expireDate.setHours(now.getHours() + 1);
        planName = "Trial 1 Jam (Test)";
    } else if (durationType === '7days') {
        expireDate.setDate(now.getDate() + 7);
        planName = "Trial 7 Hari";
    } else if (durationType === '30days') {
        expireDate.setMonth(now.getMonth() + 1);
        planName = "Bulanan (30 Hari)";
    } else if (durationType === '3months') {
        expireDate.setMonth(now.getMonth() + 3);
        planName = "Triwulan (3 Bulan)";
    } else if (durationType === '1year') {
        expireDate.setFullYear(now.getFullYear() + 1);
        planName = "Tahunan (1 Tahun)";
    } else if (durationType === 'lifetime') {
        expireDate.setFullYear(now.getFullYear() + 100);
        planName = "Lifetime";
    }

    // Generate Key Unik
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    const key = `FISIO-${code.substring(0, 4)}-${code.substring(4, 8)}`;

    // Persiapkan Data
    const alias = slugify(clientName);
    const dateNow = Utilities.formatDate(now, TIMEZONE, "yyyy-MM-dd HH:mm:ss");
    const expiryFmt = Utilities.formatDate(expireDate, TIMEZONE, "yyyy-MM-dd HH:mm:ss");

    // Dynamic Header Handling for New Row
    const headers = sheet.getDataRange().getValues()[0];
    const newRowIndex = sheet.getLastRow() + 1;
    
    // Mapping Data ke Index Kolom
    const dataMap = [
        { targets: ['key', 'lisensi'], value: key },
        { targets: ['plan_name', 'paket'], value: planName },
        { targets: ['client_name', 'nama_klien'], value: clientName },
        { targets: ['created_at'], value: dateNow },
        { targets: ['expires_at', 'expired_at'], value: expiryFmt },
        { targets: ['status'], value: "ACTIVE" },
        { targets: ['sheet_id'], value: "" },
        { targets: ['alias'], value: alias },
        { targets: ['available_hours'], value: "" },
        { targets: ['off_days'], value: "" },
        { targets: ['whatsapp'], value: whatsapp },
        { targets: ['email'], value: email },
        { targets: ['updated_at'], value: dateNow }
    ];

    // Tulis data per kolom yang ditemukan
    dataMap.forEach(item => {
        const colIdx = findColumnIndex(headers, item.targets);
        if (colIdx !== -1) {
            sheet.getRange(newRowIndex, colIdx + 1).setValue(item.value);
        }
    });

    return {
        success: true,
        key: key,
        plan: planName,
        expiry: Utilities.formatDate(expireDate, TIMEZONE, "dd MMM yyyy HH:mm"),
        expiry_iso: Utilities.formatDate(expireDate, TIMEZONE, "yyyy-MM-dd HH:mm:ss")
    };
}

function verifyLicense(keyInput, clientSheetId) { 
    Logger.log(`[verifyLicense] Key: ${keyInput} | SheetID Received: ${clientSheetId || 'NULL'}`);
    const ss = SpreadsheetApp.getActiveSpreadsheet(); 
    const sheet = ss.getSheetByName(SHEET_NAMES.LICENSES);
    if (!sheet) return { valid: false, message: "Tab Licenses tidak ditemukan di Master." };
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Dynamic Column Lookups
    const colKey = findColumnIndex(headers, ['key', 'lisensi', 'kode_lisensi']);
    const colPlan = findColumnIndex(headers, ['plan_name', 'paket', 'nama_paket']);
    const colClient = findColumnIndex(headers, ['client_name', 'nama_klien', 'klien']);
    const colExpiry = findColumnIndex(headers, ['expires_at', 'expired_at', 'berlaku_sampai']);
    const colStatus = findColumnIndex(headers, ['status', 'status_lisensi']);
    const colSheetId = findColumnIndex(headers, ['sheet_id', 'id_sheet']);
    const colAlias = findColumnIndex(headers, ['alias', 'alias_klinik']);
    const colHours = findColumnIndex(headers, ['available_hours', 'jam_tersedia', 'aviliasi']);
    const colOffDays = findColumnIndex(headers, ['off_days', 'hari_libur']);

    if (colKey === -1 || colStatus === -1) {
        return { valid: false, message: "Struktur kolom Master License tidak valid (Key/Status tidak ditemukan)." };
    }

    let found = null;
    let foundRow = -1;
    const cleanKeyInput = String(keyInput).trim();

    for (let i = 1; i < data.length; i++) {
        if (String(data[i][colKey]).trim() === cleanKeyInput) {
            found = {
                plan: colPlan !== -1 ? data[i][colPlan] : "Standard",
                client: colClient !== -1 ? data[i][colClient] : "Client",
                expires: colExpiry !== -1 ? data[i][colExpiry] : "",
                status: data[i][colStatus],
                sheetId: colSheetId !== -1 ? data[i][colSheetId] : "",
                alias: colAlias !== -1 ? data[i][colAlias] : "",
                available_hours: colHours !== -1 ? data[i][colHours] : "",
                off_days: colOffDays !== -1 ? data[i][colOffDays] : ""
            };
            foundRow = i + 1;
            break;
        }
    }

    if (!found) return { valid: false, message: "Kode Lisensi tidak ditemukan." };
    if (String(found.status).toUpperCase().trim() !== 'ACTIVE') return { valid: false, message: "Lisensi ini tidak aktif (SUSPENDED/EXPIRED)." };

    // Update Sheet ID HANYA jika di Master masih KOSONG (Initial Setup)
    // JANGAN MENIMPA ID yang sudah ada karena itu adalah ID DATABASE UTAMA.
    if (clientSheetId && !found.sheetId && colSheetId !== -1) {
        sheet.getRange(foundRow, colSheetId + 1).setValue(clientSheetId);
        found.sheetId = clientSheetId;
    }

    const now = new Date();
    let expDate = new Date(found.expires);

    if (now > expDate) {
        sheet.getRange(foundRow, colStatus + 1).setValue("EXPIRED");
        return { valid: false, message: "Masa aktif lisensi telah habis." };
    }

    // [BARU] Ambil Daftar Arsip untuk Klien ini (dari tab LICENSE_ARCHIVES)
    let myArchives = [];
    try {
        const arcSheet = ss.getSheetByName(SHEET_NAMES.LICENSE_ARCHIVES);
        if (arcSheet) {
            const arcData = arcSheet.getDataRange().getValues();
            const arcHeaders = arcData[0];
            const colArcClient = findColumnIndex(arcHeaders, ['client_name', 'nama_klien']);
            const colArcYear = findColumnIndex(arcHeaders, ['year', 'tahun']);
            const colArcSheetId = findColumnIndex(arcHeaders, ['sheet_id', 'id_sheet']);
            
            if (colArcClient !== -1 && colArcYear !== -1 && colArcSheetId !== -1) {
                for (let i = 1; i < arcData.length; i++) {
                    if (String(arcData[i][colArcClient]).toLowerCase().trim() === String(found.client).toLowerCase().trim()) {
                        myArchives.push({
                            year: parseInt(arcData[i][colArcYear]),
                            sheet_id: String(arcData[i][colArcSheetId]).trim()
                        });
                    }
                }
            }
        }
    } catch (e) { Logger.log("Error loading archives: " + e.message); }

    return {
        valid: true,
        message: "Lisensi Aktif",
        plan: found.plan,
        client: found.client,
        sheet_id: found.sheetId,
        expires: Utilities.formatDate(expDate, TIMEZONE, "dd MMM yyyy HH:mm"),
        expires_iso: Utilities.formatDate(expDate, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss"),
        alias: found.alias || "",
        available_hours: (found.available_hours === 0 || found.available_hours) ? String(found.available_hours) : "",
        off_days: (found.off_days === 0 || found.off_days) ? String(found.off_days) : "",
        custom_holidays: (found.custom_holidays === 0 || found.custom_holidays) ? String(found.custom_holidays) : "",
        archives: myArchives
    };
}

// AUTO CLEANUP (Set in Trigger)
function cleanupExpiredLicenses() {
    const ss = SpreadsheetApp.getActiveSpreadsheet(); 
    const sheet = getOrInsertSheet(ss, SHEET_NAMES.LICENSES, HEADERS.LICENSES);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const now = new Date();

    const colKey = findColumnIndex(headers, ['key']);
    const colStatus = findColumnIndex(headers, ['status']);
    const colExpiry = findColumnIndex(headers, ['expires_at', 'expired_at']);

    if (colStatus === -1 || colExpiry === -1) return;

    for (let i = 1; i < data.length; i++) {
        const status = String(data[i][colStatus]).trim().toUpperCase();
        const expiryStr = data[i][colExpiry];

        if (status === 'ACTIVE' && expiryStr) {
            const expDate = new Date(expiryStr);
            if (!isNaN(expDate.getTime()) && now > expDate) {
                sheet.getRange(i + 1, colStatus + 1).setValue("EXPIRED");
                Logger.log(`License ${colKey !== -1 ? data[i][colKey] : i} expired at ${expiryStr}. Status updated.`);
            }
        }
    }
}

// ==========================================
// [BARU] FITUR DIRECTORY / ALIAS (LINK PENDEK)
// ==========================================

function resolveClinicAlias(alias) {
  if (!alias) return createJSONOutput({ status: 'error', message: 'Alias kosong' });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.LICENSES);
  if (!sheet) return createJSONOutput({ status: 'error', message: 'Tab Licenses tidak ditemukan.' });
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const normalize = (s) => String(s).toLowerCase().replace(/[\s_]/g, "");
  const headersNormalized = headers.map(normalize);

  const colSheetId = headersNormalized.indexOf(normalize('sheet_id'));
  const colAlias = headersNormalized.indexOf(normalize('alias'));
  
  if (colAlias === -1 || colSheetId === -1) return createJSONOutput({ status: 'error', message: 'Struktur Master tidak lengkap.' });

  // Cari Alias
  const row = data.find((r, i) => i > 0 && r[colAlias] && String(r[colAlias]).toLowerCase().trim() === String(alias).toLowerCase().trim());

  if (row) {
    return createJSONOutput({ 
      status: 'success', 
      sheet_id: row[colSheetId]
    });
  } else {
    return createJSONOutput({ status: 'error', message: 'Klinik tidak ditemukan' });
  }
}



/**
 * [BARU] Mengambil daftar unik nama klinik untuk dropdown Renew
 */
function getExistingClients() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  checkAndFixColumns(ss, true); // Pastikan header terbaru ada (WA, Email, Updated_at)
  const sheet = ss.getSheetByName(SHEET_NAMES.LICENSES);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const colName = findColumnIndex(headers, ['client_name', 'nama_klien']);
  
  if (colName === -1) return [];
  
  const names = data.slice(1).map(r => String(r[colName]).trim()).filter(n => n);
  // Return unique sorted names
  return [...new Set(names)].sort();
}

/**
 * [BARU] Perpanjang Lisensi (Metode REPLACE)
 * Menemukan baris lama, menghitung masa aktif baru, dan menimpa data (tepat di baris tersebut).
 */
function renewLicense(clientName, durationType) {
  Logger.log(`[Renew] Starting for: ${clientName} | Duration: ${durationType}`);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  checkAndFixColumns(ss, true);
  const sheet = ss.getSheetByName(SHEET_NAMES.LICENSES);
  if (!sheet) throw new Error("Tab Licenses tidak ditemukan.");

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const colName = findColumnIndex(headers, ['client_name', 'nama_klien']);
  const colStatus = findColumnIndex(headers, ['status']);
  const colExpiry = findColumnIndex(headers, ['expires_at', 'expired_at']);
  const colUpdate = findColumnIndex(headers, ['updated_at']);
  const colPlan   = findColumnIndex(headers, ['plan_name', 'paket']);
  const colKey    = 0;

  let rowIndex = -1;
  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][colName]).trim() === String(clientName).trim()) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex === -1) throw new Error("Klinik tidak ditemukan di database.");
  
  const oldData = data[rowIndex - 1];
  const oldKey = oldData[colKey];
  const oldStatus = String(oldData[colStatus]).toUpperCase().trim();
  
  // Explicitly parse current expiry
  let currentExpiry;
  if (oldData[colExpiry] instanceof Date) {
    currentExpiry = oldData[colExpiry];
  } else {
    currentExpiry = new Date(oldData[colExpiry]);
    if (isNaN(currentExpiry.getTime())) {
      Logger.log(`[Renew] Warning: Failed to parse old expiry "${oldData[colExpiry]}", using NOW.`);
      currentExpiry = new Date();
    }
  }

  const now = new Date();
  const oldPlanName = String(oldData[colPlan] || "").toUpperCase();
  const isCurrentlyLifetime = oldPlanName.includes("LIFETIME") || (currentExpiry.getFullYear() > (now.getFullYear() + 5));

  // LOGIKA TANGGAL: 
  // 1. Jika Plan Lama adalah LIFETIME (atau > 5thn lagi) DAN Plan Baru BUKAN Lifetime -> MULAI DARI SEKARANG (Reset).
  // 2. Jika Masih ACTIVE dan belum expired -> Tambahkan dari EXPIRED lama.
  // 3. Jika sudah EXPIRED atau Status SUSPENDED -> Mulai dari SEKARANG.
  
  let startDate;
  if (isCurrentlyLifetime && durationType !== 'lifetime') {
    Logger.log(`[Renew] Downgrade/Reset detected from Lifetime. Resetting start date to NOW.`);
    startDate = new Date(now.getTime());
  } else if (oldStatus === 'ACTIVE' && currentExpiry.getTime() > now.getTime()) {
    startDate = new Date(currentExpiry.getTime());
  } else {
    startDate = new Date(now.getTime());
  }
  
  Logger.log(`[Renew] Start Date calculated: ${startDate.toISOString()} (Old Expiry: ${currentExpiry.toISOString()}, IsLifetime: ${isCurrentlyLifetime})`);

  let newExpiry = new Date(startDate.getTime());
  let planName = "";

  // Mapping Durasi
  switch (durationType) {
    case '7days':
      newExpiry.setDate(newExpiry.getDate() + 7);
      planName = "Trial 7 Hari";
      break;
    case '30days':
      newExpiry.setMonth(newExpiry.getMonth() + 1);
      planName = "Bulanan (30 Hari)";
      break;
    case '3months':
      newExpiry.setMonth(newExpiry.getMonth() + 3);
      planName = "Triwulan (3 Bulan)";
      break;
    case '1year':
      newExpiry.setFullYear(newExpiry.getFullYear() + 1);
      planName = "Tahunan (1 Tahun)";
      break;
    case 'lifetime':
      newExpiry.setFullYear(newExpiry.getFullYear() + 100);
      planName = "Lifetime";
      break;
    default:
      throw new Error(`Durasi tidak dikenal: ${durationType}`);
  }

  Logger.log(`[Renew] New Expiry: ${newExpiry.toISOString()} | Plan: ${planName}`);

  // Generate Key Baru (Random)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  const newKey = `FISIO-${code.substring(0, 4)}-${code.substring(4, 8)}`;

  // REPLACE: Update data di baris yang sama
  const dateFmt = "yyyy-MM-dd HH:mm:ss";
  sheet.getRange(rowIndex, colKey + 1).setValue(newKey);
  sheet.getRange(rowIndex, colPlan + 1).setValue(planName);
  sheet.getRange(rowIndex, colExpiry + 1).setValue(Utilities.formatDate(newExpiry, TIMEZONE, dateFmt));
  sheet.getRange(rowIndex, colStatus + 1).setValue("ACTIVE");
  sheet.getRange(rowIndex, colUpdate + 1).setValue(Utilities.formatDate(now, TIMEZONE, dateFmt));

  Logger.log(`[Renew] Success. Updated Row ${rowIndex} with Key ${newKey}`);

  return {
    success: true,
    key: newKey,
    plan: planName,
    expiry: Utilities.formatDate(newExpiry, TIMEZONE, "dd MMM yyyy HH:mm"),
    expiry_iso: Utilities.formatDate(newExpiry, TIMEZONE, dateFmt)
  };
}
