/**
 * ERM FISIOTA - ARCHIVE & YEAR MANAGER
 * Handles switching between yearly database sheets and archive CRUD.
 */

// --- 1. YEAR PICKER UI ---

function renderYearPicker() {
    const archives = state.archives || [];
    const currentYear = state.currentYear || new Date().getFullYear();

    // Sort archives by year descending
    archives.sort((a, b) => b.year - a.year);

    return `
        <div class="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h4 class="text-sm font-bold text-slate-700">Pilih Tahun Database</h4>
                <p class="text-[10px] text-slate-400">Pindah ke database tahun aktif atau arsip yang terhubung.</p>
            </div>
            <div class="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 w-full md:w-auto">
                <select onchange="switchYear(this.value)" class="w-full md:w-auto bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer px-4 py-2">
                    <option value="${new Date().getFullYear()}" ${currentYear == new Date().getFullYear() ? 'selected' : ''}> Tahun Aktif (${new Date().getFullYear()})</option>
                    ${archives.map(arc => `
                        <option value="${arc.year}" ${currentYear == arc.year ? 'selected' : ''}> Arsip ${arc.year}</option>
                    `).join('')}
                </select>
            </div>
        </div>
    `;
}

async function switchYear(targetYear) {
    const isCurrentActive = targetYear == new Date().getFullYear();
    const archives = state.archives || [];

    // 1. Tampilkan Konfirmasi Segera (Agar UI terasa cepat seperti Arsip)
    const confirmSwitch = confirm(`Pindah ke database tahun ${targetYear}?\n\nSemua data lokal akan ditarik ulang dari pusat.`);
    if (!confirmSwitch) {
        renderYearPicker();
        return;
    }

    let targetSheetId = "";
    if (isCurrentActive) {
        // [CLOUD BRANKAS]: Ambil ID Sheet Utama terbaru dari Master (Tanpa Kedip/Silent)
        updateSyncStatusUI("Memvalidasi Lisensi & Mengambil ID Utama...", true);

        try {
            const result = await checkLicense(true); // SILENT = TRUE (Hapus Kedipan)
            targetSheetId = result?.sheet_id || localStorage.getItem('erm_main_sheet_id');
            
            if (!targetSheetId) {
                updateSyncStatusUI("error", false); // Hapus overlay jika gagal
                alert("Gagal mengambil ID Utama: ID Sheet tidak ditemukan di Master maupun memori lokal.");
                renderYearPicker();
                return;
            }
        } catch (e) {
            updateSyncStatusUI("error", false); // Hapus overlay jika gagal
            alert("Kesalahan koneksi: " + e.message);
            renderYearPicker();
            return;
        }
    } else {
        const found = archives.find(a => a.year == targetYear);
        if (found) targetSheetId = found.sheet_id;
    }

    if (!targetSheetId) {
        alert("Gagal menemukan ID Sheet untuk tahun tersebut.");
        renderYearPicker();
        return;
    }

    updateSyncStatusUI("Menyiapkan Tahun " + targetYear + "...", true);

    try {
        // 1. Clear Local Data (IndexedDB)
        if (window.fisiotaDB) {
            await window.fisiotaDB.clear('patients');
            await window.fisiotaDB.clear('assessments');
            await window.fisiotaDB.clear('appointments');
            await window.fisiotaDB.clear('expenses');
            // JANGAN HAPUS: packages, protocols agar data ini "tertinggal" (Global)
        }

        // 2. Update Persisted State
        const targetUrl = `https://docs.google.com/spreadsheets/d/${targetSheetId}/edit`;
        const yearNum = parseInt(targetYear);
        localStorage.setItem('erm_current_year', yearNum);
        localStorage.setItem('erm_sheet_id', targetSheetId);
        localStorage.setItem('erm_script_url', targetUrl);

        // 3. Update Global State
        state.currentYear = yearNum;
        state.sheetId = targetSheetId;
        state.scriptUrl = targetUrl;

        // 4. Force Full Sync
        window._firstSyncDone = false;
        localStorage.removeItem('erm_last_sync');

        // 5. Reload or Refresh
        alert(`Berhasil pindah ke tahun ${targetYear}. Aplikasi akan memuat ulang data.`);
        location.reload();

    } catch (err) {
        console.error("SwitchYear Error:", err);
        alert("Gagal melakukan perpindahan tahun: " + err.message);
        renderYearPicker();
    }
}

// --- 2. ARCHIVE CRUD (CONFIG TAB) ---

function renderArchiveTab() {
    const archives = state.archives || [];

    return `
    <div class="space-y-6">
        ${renderYearPicker()}
        
        <div class="bg-white p-6 rounded-xl shadow border border-slate-200">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div>
                <h3 class="text-lg font-bold text-slate-800">Manajemen Database Arsip</h3>
                <p class="text-xs text-slate-400">Hubungkan ID tahun sebelumnya untuk diakses sebagai arsip.</p>
            </div>
            <button onclick="openAddArchiveModal()" class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
                <i data-lucide="plus-circle" width="18"></i> Hubungkan Arsip Baru
            </button>
        </div>

        <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6 flex gap-3 items-start">
            <i data-lucide="info" class="text-amber-600 shrink-0" width="20"></i>
            <div class="text-xs text-amber-800 leading-relaxed">
                Gunakan ID yang diberikan oleh Admin via WA untuk menambah backup data terbaru. (data lama tetap bisa dibuka melalui menu ini. Backup data dilakukan minimal tiap 1 tahun sekali)
            </div>
        </div>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm border-collapse">
                <thead>
                    <tr class="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
                        <th class="px-4 py-3">Tahun</th>
                        <th class="px-4 py-3">ID</th>
                        <th class="px-4 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    ${archives.length === 0 ? `
                        <tr><td colspan="3" class="px-4 py-8 text-center text-slate-400 italic">Belum ada arsip yang terhubung.</td></tr>
                    ` : archives.map(arc => `
                        <tr class="hover:bg-slate-50/50 transition-colors">
                            <td class="px-4 py-3 font-bold text-slate-700">${arc.year}</td>
                            <td class="px-4 py-3 font-mono text-[11px] text-slate-500">${arc.sheet_id}</td>
                            <td class="px-4 py-3 text-right">
                                <button onclick="deleteArchiveConfirm('${arc.year}', '${arc.sheet_id}')" class="text-red-500 hover:text-red-700 p-1" title="Putus Koneksi">
                                    <i data-lucide="log-out" width="16"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>
    `;
}

function openAddArchiveModal() {
    const html = `
    <div class="p-6 relative">
        <button onclick="closeModal()" class="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors">
            <i data-lucide="x" width="20"></i>
        </button>
        <h3 class="text-xl font-black text-slate-800 mb-1">Hubungkan Arsip</h3>
        <p class="text-xs text-slate-500 mb-6">Masukkan data ID yang diberikan oleh Admin.</p>
        
        <div class="space-y-4">
            <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Tahun Database</label>
                <input type="number" id="new-arc-year" placeholder="Contoh: 2025" value="${new Date().getFullYear() - 1}" class="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-blue-500 outline-none font-bold">
            </div>
            <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">ID (Dari WA Admin)</label>
                <input type="text" id="new-arc-id" placeholder="1abc...xyz" class="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-blue-500 outline-none font-mono text-xs">
            </div>
            
            <button onclick="submitNewArchive()" id="btn-submit-arc" class="w-full bg-blue-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <i data-lucide="save" width="18"></i> Simpan Mapping Arsip
            </button>
        </div>
    </div>
    `;
    openModal(html);
    renderIcons();
}

async function submitNewArchive() {
    const year = document.getElementById('new-arc-year').value;
    const sheetId = document.getElementById('new-arc-id').value.trim();
    const btn = document.getElementById('btn-submit-arc');

    if (!year || !sheetId) {
        alert("Harap isi Tahun dan ID!");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<i class="animate-spin" data-lucide="refresh-cw" width="18"></i> Menyimpan...`;
    renderIcons();

    try {
        const payload = {
            action: 'add_archive',
            license_key: state.licenseKey,
            client_name: state.clinicName || '',
            year: year,
            sheet_id: sheetId
        };

        const resp = await fetch(LICENSE_API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const result = await resp.json();

        if (result.status === 'success') {
            alert("Arsip berhasil ditambahkan!");
            // Update local state temporarily
            state.archives.push({ year: parseInt(year), sheet_id: sheetId });
            localStorage.setItem('erm_license_archives', JSON.stringify(state.archives)); // Persist immediately!
            closeModal();
            renderApp(); // Refresh view
        } else {
            throw new Error(result.message || "Gagal menyimpan ke server");
        }
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="save" width="18"></i> Simpan Mapping Arsip`;
        renderIcons();
    }
}

function deleteArchiveConfirm(year, sheetId) {
    if (!confirm(`Hapus mapping arsip tahun ${year}?\n\nFile Sheet-nya sendiri TIDAK akan terhapus, hanya akses dari aplikasi ini saja.`)) return;

    executeDeleteArchive(year);
}

async function executeDeleteArchive(year) {
    try {
        const payload = {
            action: 'delete_archive',
            license_key: state.licenseKey,
            year: year
        };

        const resp = await fetch(LICENSE_API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const result = await resp.json();

        if (result.status === 'success') {
            state.archives = state.archives.filter(a => a.year != year);
            localStorage.setItem('erm_license_archives', JSON.stringify(state.archives)); // Persist deletion!
            renderApp();
            alert("Mapping arsip berhasil dihapus.");
        } else {
            throw new Error(result.message || "Gagal menghapus dari server");
        }
    } catch (err) {
        alert("Error: " + err.message);
    }
}
