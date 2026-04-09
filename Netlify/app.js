// --- 0. ERROR HANDLING & ASSET CHECK ---
// Error handler moved to index.html for better catch coverage

// Check for IMG_ASSETS immediately
if (typeof window.IMG_ASSETS === 'undefined') {
    console.error("IMG_ASSETS is missing! Creating empty object to prevent crash.");
    window.IMG_ASSETS = { body_chart: '', logo: '' };
}

// --- 1. STATE & GLOBAL VARIABLES ---
let state = {
    _version: '5.5',
    user: null,
    users: [],
    patients: [],
    assessments: [],
    appointments: [],
    expenses: [],
    packages: [],
    protocols: [],
    treatments: [], // Master data tindakan & tarif

    printSelection: [],
    currentView: 'login',
    activeConfigTab: 'identity',
    selectedPatient: null,
    currentAssessment: null,
    patientLimit: 50,
    assessmentLimit: 50,
    scriptUrl: '',
    sheetId: '',
    filterPatientId: null,
    laporanLimit: 50,
    laporanSearch: '',
    calendarDate: new Date(),
    pdfConfig: {
        layoutMode: 'normal',
        accentColor: 'blue',
        showKop: true, showPatientInfo: true, showDiagnosis: true,
        showAnamnesis: true, showBodyChart: true, showObjective: true,
        showImpairment: true, showLimitation: true, showIntervention: true,
        showEvalPlan: true, showSignature: true,
        showInformedConsent: true,
        informedConsentText: 'Dengan ini saya menyatakan bahwa saya memberikan persetujuan kepada Fisioterapis untuk melakukan tindakan pemeriksaan dan terapi sesuai dengan standar profesi. Saya telah mendapatkan penjelasan mengenai tujuan, risiko, dan manfaat dari tindakan tersebut.',
        fontFamily: 'sans', fontSize: '10pt'
    },
    clinicInfo: {
        name: 'FISIOTA',
        subname: 'Physiotherapy & Rehab',
        therapist: 'Fisio',
        sipf: 'SIPF: ....................',
        city: 'Blitar',
        address: 'Jl. Contoh No.1, Kota, Provinsi',
        phone: '',
        mapsUrl: ''
    },
    notificationConfig: {
        telegramToken: '',
        telegramChatId: '',
        targetEmail: '',
        senderEmail: '',
        msgConfirm: '',
        msgReject: '',
        msgReminder: ''
    },
    bookingConfig: {
        alias: '',
        availableHours: '',
        offDays: '',
        customHolidays: '',
        dayConfig: {} // Per-day: { "1": { active: true, hours: "...", slots: 1 }, ... }
    },
    deletedIds: {
        patients: [],
        assessments: [],
        appointments: [],
        expenses: [],
        packages: [],
        protocols: [],
        users: [],
        treatments: []
    },
    pendingUploads: [],
    archives: [],
    currentYear: new Date().getFullYear(),
    clinicName: '',
    configUpdatedAt: null,
    serverTimeOffset: 0, // Offset in ms: ServerTime - LocalTime
    dashboardTab: 'main' // 'main' or 'analytics'
};

let currentTemplateCategory = 'Semua';
let currentTemplateRegion = 'Semua';
let templateSearchQuery = '';
window.tempFormData = {};

window.IndonSynonyms = {
    'kanalis semisirkularis': 'semicircular canals',
    'telinga dalam': 'inner ear',
    'gangguan keseimbangan': 'balance functions',
    'mual': 'nausea',
    'muntah': 'vomiting',
    'menunduk': 'bending', // d4105
    'melihat ke atas': 'looking up',
    'berbalik di tempat tidur': 'lying down', // d4100
    'berbalik': 'turning',
    'mandi': 'washing himself',
    'berpakaian': 'dressing',
    'makan': 'eating',
    'minum': 'drinking',
    'duduk lama': 'maintaining sitting',
    'berdiri lama': 'maintaining standing',
    'jalan jauh': 'walking long distances',
    'naik tangga': 'climbing stairs',
    'otolith': 'otolith',
    'vestibulum': 'vestibular',
    'nistagmus': 'nystagmus',
    'cupula': 'vestibular',
    'macula': 'macula',
    'pinggang': 'waist',
    'leher': 'neck',
    'nyeri': 'pain',
    'panggul': 'hip',
    'tulang belikat': 'scapula',
    'bahu': 'shoulder',
    'siku': 'elbow',
    'pergelangan tangan': 'wrist',
    'pergelangan kaki': 'ankle',
    'jari': 'fingers',
    'lutut': 'knee'
};

// --- 2. HELPER FUNCTIONS ---
// Global Image URL Converter (Drive -> High Reliability Endpoint)
function convertDriveUrl(url) {
    if (!url) return '';
    if (typeof url !== 'string') return url;
    if (url.includes('drive.google.com/') || url.includes('googleusercontent.com/')) {
        // Robust ID extraction using regex for Drive IDs (typically 33 characters, at least 25)
        const match = url.match(/[-\w]{25,}/);
        if (match) return `https://lh3.googleusercontent.com/d/${match[0]}`;
    }
    return url;
}

function isReadOnly() {
    return false; // Selalu ijinkan edit (Customizable)
}

function today() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// Global Currency Formatter
function formatRp(num) {
    if (num === null || num === undefined) return 'Rp 0';
    return 'Rp ' + Number(num).toLocaleString('id-ID');
}

// Global Currency Parser
function parseRp(input) {
    if (!input) return 0;
    if (typeof input === 'number') return input;
    // Remove Rp, dots, and spaces
    const clean = String(input).replace(/[^0-9,-]/g, '').replace(',', '.');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
}

// Shorthand for Currency Input (e.g., 150 -> 150.000)
function applyCurrencyShorthand(input) {
    if (!input || !input.value) return;
    let val = parseRp(input.value);
    if (val > 0 && val < 5000) {
        val = val * 1000;
        input.value = val;
        // Trigger input event to update totals if needed
        input.dispatchEvent(new Event('input'));
    }
}

// [Robust] Check if an appointment is considered PAID
function isPaidAppt(a) {
    if (!a) return false;
    const status = (a.paymentStatus || '').toUpperCase();
    if (status === 'PAID') return true;
    // Tightened: Only consider paid if there's an explicit paidAt timestamp
    if (!a.paymentStatus && a.paidAt) return true;
    return false;
}

// Check if an appointment was paid TODAY (based on current date)
function isPaidToday(a) {
    if (!isPaidAppt(a)) return false;
    const todayStr = today();
    const payDate = a.paidAt ? a.paidAt.slice(0, 10) : '';
    // Count if either the payment date is today, or if it's a today's therapy session marked as paid
    return (payDate === todayStr || (a.date === todayStr && isPaidAppt(a)));
}

// [NEW] Get Current Time synchronized with Google Server
function getServerTimeISO() {
    const now = Date.now();
    return new Date(now + (state.serverTimeOffset || 0)).toISOString();
}

// Helper removed: Consolidated to section 17


function calculateAge(dob) {
    if (!dob) return '-';
    const ageDifMs = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// [NEW] Robust guard to prevent disruptive UI resets during background sync
function isSafeToRefresh() {
    // 1. Don't refresh if any modal is open
    const modal = document.getElementById('modal-container');
    if (modal && !modal.classList.contains('hidden')) return false;

    // 2. Don't refresh if user is in a view that has active input fields
    const sensitiveViews = ['assessment_form', 'config', 'patient_form'];
    if (sensitiveViews.includes(state.currentView)) return false;

    // 3. Don't refresh if the user is currently typing in any input or textarea
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return false;
    }

    return true;
}



function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function updateDate() {
    const el = document.getElementById('current-date');
    if (el) {
        const now = new Date();
        el.innerText = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
}

function renderIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        setTimeout(renderIcons, 300);
    }
}

function generateNextRM() {
    if (!state.patients || state.patients.length === 0) return 'PX-0001';

    // Cari angka tertinggi dari ID yang polanya PX-XXXX
    const numericParts = state.patients
        .map(p => {
            const match = p.id.match(/^PX-(\d+)$/);
            if (!match) return null;
            const num = parseInt(match[1]);
            // Abaikan ID "astronomis" (potongan timestamp > 999.999) 
            // supaya urutan bisa kembali normal PX-0002 dst.
            return num < 1000000 ? num : null;
        })
        .filter(n => n !== null);

    const maxNum = numericParts.length > 0 ? Math.max(...numericParts) : 0;
    const nextNum = maxNum + 1;

    return `PX-${nextNum.toString().padStart(4, '0')}`;
}

function getPatientColor(id) {
    if (!id) return 'bg-slate-100 text-slate-600 border-slate-200';
    const colors = [
        'bg-red-100 text-red-800 border-red-200', 'bg-orange-100 text-orange-800 border-orange-200',
        'bg-amber-100 text-amber-800 border-amber-200', 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'bg-lime-100 text-lime-800 border-lime-200', 'bg-green-100 text-green-800 border-green-200',
        'bg-emerald-100 text-emerald-800 border-emerald-200', 'bg-teal-100 text-teal-800 border-teal-200',
        'bg-cyan-100 text-cyan-800 border-cyan-200', 'bg-sky-100 text-sky-800 border-sky-200',
        'bg-blue-100 text-blue-800 border-blue-200', 'bg-indigo-100 text-indigo-800 border-indigo-200',
        'bg-violet-100 text-violet-800 border-violet-200', 'bg-purple-100 text-purple-800 border-purple-200',
        'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200', 'bg-pink-100 text-pink-800 border-pink-200',
        'bg-rose-100 text-rose-800 border-rose-200'
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) { hash = id.charCodeAt(i) + ((hash << 5) - hash); }
    return colors[Math.abs(hash) % colors.length];
}

function formatDateForDisplay(dateStr) {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateStr;
    }
}

// --- 3. DATA & INIT ---
// --- 3. DATA & INIT ---
async function loadData() {
    try {
        // 2. Ambil data dari IndexedDB
        state.scriptUrl = localStorage.getItem('erm_script_url') || '';
        state.sheetId = localStorage.getItem('erm_sheet_id') || getSheetIdFromUrl(state.scriptUrl) || '';
        state.currentYear = parseInt(localStorage.getItem('erm_current_year')) || new Date().getFullYear();
        const savedArchives = localStorage.getItem('erm_license_archives');
        if (savedArchives) state.archives = JSON.parse(savedArchives);
        state.licenseKey = localStorage.getItem('erm_license_key') || '';
        state.clinicName = localStorage.getItem('erm_clinic_name') || '';

        let [patients, assessments, appointments, expenses, users, configs, packages, treatments, protocols] = await Promise.all([
            window.fisiotaDB.getAll('patients'),
            window.fisiotaDB.getAll('assessments'),
            window.fisiotaDB.getAll('appointments'),
            window.fisiotaDB.getAll('expenses'),
            window.fisiotaDB.getAll('users'),
            window.fisiotaDB.getAll('config'),
            window.fisiotaDB.getAll('packages'),
            window.fisiotaDB.getAll('treatments'),
            window.fisiotaDB.getAll('protocols')
        ]);

        // 3. LOGIKA MIGRASI: Jika IndexedDB kosong tapi LocalStorage ada data
        if (patients.length === 0 && localStorage.getItem('erm_patients')) {
            console.log("MIGRATION: Moving data from LocalStorage to IndexedDB...");
            state.patients = JSON.parse(localStorage.getItem('erm_patients')) || [];
            state.assessments = JSON.parse(localStorage.getItem('erm_assessments')) || [];
            state.appointments = JSON.parse(localStorage.getItem('erm_appointments')) || [];
            state.expenses = JSON.parse(localStorage.getItem('erm_expenses')) || [];
            state.users = JSON.parse(localStorage.getItem('erm_users')) || [];
            state.packages = JSON.parse(localStorage.getItem('erm_packages')) || [];
            state.treatments = JSON.parse(localStorage.getItem('erm_treatments')) || [];
            state.protocols = JSON.parse(localStorage.getItem('erm_protocols')) || [];

            // Simpan hasil migrasi ke IndexedDB
            await saveData();
        } else {
            state.patients = patients;
            state.assessments = assessments;

            // CRITICAL: Trust local cache first for instant UI response
            state.appointments = appointments;

            state.expenses = expenses;
            state.users = users;
            state.packages = packages;
            state.treatments = treatments || [];
            state.protocols = protocols || [];

            // Load Global Configs dari store 'config'
            const globalCfg = configs.find(c => c.id === 'global');
            if (globalCfg) {
                state.clinicInfo = globalCfg.info || state.clinicInfo;
                state.pdfConfig = { ...state.pdfConfig, ...(globalCfg.pdf || {}) };
                state.notificationConfig = { ...state.notificationConfig, ...(globalCfg.notif || {}) };
                state.bookingConfig = { ...state.bookingConfig, ...(globalCfg.booking || {}) };
                if (globalCfg.booking) {
                    localStorage.setItem('erm_booking_alias', globalCfg.booking.alias || '');
                    localStorage.setItem('erm_booking_hours', globalCfg.booking.availableHours || '');
                    localStorage.setItem('erm_booking_off_days', globalCfg.booking.offDays || '');
                }
            }

            const deleteLog = configs.find(c => c.id === 'deleted_logs');
            if (deleteLog) state.deletedIds = { ...state.deletedIds, ...deleteLog.ids };

            // INSTANT PURGE: Remove ghost data immediately from the current view state
            const instantPurge = (list, delIds) => (list || []).filter(item => {
                const isDeleted = (delIds || []).some(id => String(id) === String(item.id));
                return !isDeleted;
            });
            state.patients = instantPurge(state.patients, state.deletedIds.patients);
            state.assessments = instantPurge(state.assessments, state.deletedIds.assessments);
            state.appointments = instantPurge(state.appointments, state.deletedIds.appointments);

            // Initialize booking count for notifications (prevents sound on initial load)
            window.lastBookingCount = state.appointments.filter(a => a.status === 'PENDING').length;
            state.expenses = instantPurge(state.expenses, state.deletedIds.expenses || []);
            state.packages = instantPurge(state.packages, state.deletedIds.packages || []);
        }

        // Jika user tetap kosong (pertama kali total), buat default
        if (state.users.length === 0) {
            state.users = [
                { id: 'usr1', username: 'admin', password: '123', role: 'ADMIN', name: 'Administrator' },
                { id: 'usr2', username: 'fisio', password: '123', role: 'FISIO', name: 'Fisio' }
            ];
            await window.fisiotaDB.save('users', state.users);
        }

        // --- MIGRATION: Ensure Timestamps & Sanitize ---
        let mig = false;
        const ensureTs = (list) => {
            list.forEach(i => { if (!i.updatedAt) { i.updatedAt = new Date().toISOString(); mig = true; } });
        };
        ensureTs(state.patients);
        ensureTs(state.assessments);
        ensureTs(state.appointments);
        ensureTs(state.expenses);
        ensureTs(state.packages);

        state.appointments = deduplicateAppointments(state.appointments);

        // Universal Sanitization
        const sanitizeAll = (list, type) => {
            if (!list) return [];
            let changed = false;
            const sanitized = list.map(item => {
                let fixed = { ...item };
                if (fixed.islocked !== undefined && fixed.is_locked === undefined) { fixed.is_locked = fixed.islocked; changed = true; }
                if (fixed.defaultfee !== undefined && fixed.defaultFee === undefined) { fixed.defaultFee = fixed.defaultfee; changed = true; }
                if (fixed.ebookurl && !fixed.ebook_url) { fixed.ebook_url = fixed.ebookurl; changed = true; }
                if (fixed.visitorname && !fixed.visitor_name) { fixed.visitor_name = fixed.visitorname; changed = true; }
                if (fixed.visitorcontact && !fixed.visitor_contact) { fixed.visitor_contact = fixed.visitorcontact; changed = true; }
                if (fixed.patientid && !fixed.patientId) { fixed.patientId = fixed.patientid; changed = true; }
                if (fixed.is_locked === undefined) { fixed.is_locked = false; changed = true; }
                return fixed;
            });
            if (changed) mig = true;
            return sanitized;
        };

        state.patients = sanitizeAll(state.patients, 'patients');
        state.expenses = sanitizeAll(state.expenses, 'expenses');
        state.packages = sanitizeAll(state.packages, 'packages');
        state.treatments = sanitizeAll(state.treatments, 'treatments');
        state.protocols = sanitizeAll(state.protocols, 'protocols');

        const sanitizedAss = sanitizeAssessments(state.assessments);
        if (JSON.stringify(sanitizedAss) !== JSON.stringify(state.assessments)) {
            state.assessments = sanitizedAss;
            mig = true;
        }

        if (mig) {
            console.log("Data migrated with timestamps/sanitization.");
            await saveData();
        }

        // Script URL Logic (Fallback ke localStorage untuk config cepat)
        try {
            if (typeof DEFAULT_SCRIPT_URL !== 'undefined' && DEFAULT_SCRIPT_URL) {
                state.scriptUrl = DEFAULT_SCRIPT_URL;
            } else {
                state.scriptUrl = localStorage.getItem('erm_script_url') || '';
            }
        } catch (e) { state.scriptUrl = ''; }

        // Migration/Fallback for Booking Config
        if (!state.bookingConfig.alias) {
            state.bookingConfig.alias = localStorage.getItem('erm_booking_alias') || '';
            state.bookingConfig.availableHours = localStorage.getItem('erm_booking_hours') || '';
            state.bookingConfig.offDays = localStorage.getItem('erm_booking_off_days') || '';
        }

        // Apply Legacy Configs if IndexedDB didn't have them yet
        const savedConfig = JSON.parse(localStorage.getItem('erm_clinic_config'));
        if (savedConfig && !configs.find(c => c.id === 'global')) state.clinicInfo = savedConfig;

        // Apply PDF Layout
        if (state.pdfConfig) {
            document.body.classList.remove('print-compact', 'print-normal', 'print-relaxed');
            if (state.pdfConfig.layoutMode === 'compact') document.body.classList.add('print-compact');
            else if (state.pdfConfig.layoutMode === 'relaxed') document.body.classList.add('print-relaxed');
            else document.body.classList.add('print-normal');
            applyPageMargins(state.pdfConfig.layoutMode);
        }

        // REMOVED: Dummy patient generation to fix First-Sync detection
        if (state.patients.length === 0) {
            console.log("System is empty. Waiting for First Sync...");
        }

    } catch (e) {
        console.error("Critical Error loading data:", e);
        alert("Gagal memuat data dari IndexedDB. Mencoba fallback...");
    }

    // 4. Background Sync & UI Initialization
    updateSyncStatusUI(checkDataDirty());

    // INSTANT AUTO-PROVISIONING: 
    // Trigger sync immediately on load so new users get data without waiting 30s.
    if (state.scriptUrl) {
        backgroundAutoSync();
    }

    // 60 detik memberi waktu cukup bagi GAS untuk selesai menulis sebelum pull
    setInterval(backgroundAutoSync, 30 * 1000); // Push+Pull tiap 30 detik

    updateSidebarBadges();
    applyBranding();
}

// ...

async function checkLicense(silent = false) {
    const savedKey = localStorage.getItem('erm_license_key');
    const savedExpiry = localStorage.getItem('erm_license_expiry');
    const savedStatus = localStorage.getItem('erm_license_status');

    // [OPTIMIZED] 1. Cek Cache Validasi Master (Misal: 4 jam) untuk cegah "loading lama" setiap refresh
    const lastCheckTime = localStorage.getItem('erm_license_last_check');
    const CACHE_LIMIT = 4 * 60 * 60 * 1000; // 4 Jam
    if (savedStatus === 'ACTIVE' && lastCheckTime && (Date.now() - parseInt(lastCheckTime) < CACHE_LIMIT)) {
        console.log("LOG: License recently verified. Skipping remote check.");
        // Ensure state is populated for immediate background sync
        state.scriptUrl = state.scriptUrl || localStorage.getItem('erm_script_url');
        state.sheetId = state.sheetId || localStorage.getItem('erm_sheet_id') || getSheetIdFromUrl(state.scriptUrl);
        return { valid: true };
    }

    if (!savedKey) {
        if (!silent) renderLockScreen();
        return { valid: false, message: "No license key found" };
    }

    // 2. Cek Expiry Lokal
    if (savedStatus === 'ACTIVE' && savedExpiry) {
        // ... (Expiry Logic same as before)
        const parts = savedExpiry.split(' ');
        const monthMap = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 };
        let expDate = new Date();
        if (parts.length >= 3) {
            const d = parseInt(parts[0]);
            const m = monthMap[parts[1]] !== undefined ? monthMap[parts[1]] : 0;
            const y = parseInt(parts[2]);
            expDate.setFullYear(y, m, d);
            if (parts[3]) {
                const timeParts = parts[3].split(':');
                expDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0);
            } else { expDate.setHours(23, 59, 59); }
        } else { expDate = new Date(savedExpiry); }

        const now = new Date();
        if (now > expDate) {
            if (!silent) renderLockScreen("Masa aktif lisensi Anda telah habis.");
            return { valid: false, message: "License expired" };
        }
    }

    // 3. Background Validation (Ke Server Lisensi PUSAT)
    if (navigator.onLine) {
        try {
            // Extract Sheet ID from configured URL
            let sheetId = "";
            const activeYear = new Date().getFullYear();
            const configUrl = state.scriptUrl || localStorage.getItem('erm_script_url');

            if (configUrl && !isReadOnly()) {
                const match = configUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
                if (match && match[1]) sheetId = match[1];
            }

            console.log("DEBUG: Validating License with Master (Silent)...", { key: savedKey, currentSheetId: sheetId });

            const response = await fetch(`${LICENSE_API_URL}?action=check_license&key=${savedKey}&sheet_id=${sheetId}&t=${Date.now()}`);
            if (!response.ok) throw new Error("Server Error: " + response.status);
            const result = await response.json();

            state.licenseKey = savedKey; // Ensure key is always in state
            if (result.valid) {
                localStorage.setItem('erm_license_expiry', result.expires);
                if (result.expires_iso) localStorage.setItem('erm_license_expiry_iso', result.expires_iso);
                localStorage.setItem('erm_license_plan', result.plan);
                localStorage.setItem('erm_license_status', 'ACTIVE');
                localStorage.setItem('erm_license_last_check', Date.now().toString()); // Update last check time
                if (result.client_name) {
                    localStorage.setItem('erm_clinic_name', result.client_name);
                    state.clinicName = result.client_name;
                }

                // AUTO-CONFIG: Only if NOT in Archive Mode
                if (result.sheet_id) {
                    localStorage.setItem('erm_main_sheet_id', result.sheet_id);
                }

                if (result.sheet_id && !isReadOnly()) {
                    const autoUrl = `https://docs.google.com/spreadsheets/d/${result.sheet_id}/edit`;
                    const isManualConflict = state.sheetId && state.sheetId !== result.sheet_id;

                    if (!state.sheetId || (!isManualConflict && autoUrl !== state.scriptUrl)) {
                        localStorage.setItem('erm_script_url', autoUrl);
                        localStorage.setItem('erm_sheet_id', result.sheet_id); // Ensure ID is saved!
                        state.scriptUrl = autoUrl;
                        state.sheetId = result.sheet_id;
                        console.log("AUTO-CONFIG: Database Connected via License");
                    }
                }

                // SYNC BOOKING CONFIG FROM MASTER
                if (result.alias || result.available_hours) {
                    if (result.alias) state.bookingConfig.alias = result.alias;
                    state.bookingConfig.availableHours = (result.available_hours === 0 || result.available_hours) ? String(result.available_hours) : "";
                    if (result.off_days !== undefined) state.bookingConfig.offDays = String(result.off_days);
                    if (result.custom_holidays !== undefined) state.bookingConfig.customHolidays = String(result.custom_holidays);
                    if (result.day_config) {
                        try {
                            state.bookingConfig.dayConfig = typeof result.day_config === 'string' ? JSON.parse(result.day_config) : result.day_config;
                        } catch (e) { state.bookingConfig.dayConfig = {}; }
                    }
                    // FINAL FALLBACK: Jika alias masih kosong dari server, paksa ambil dari client_name jika ada
                    if (!state.bookingConfig.alias && result.client_name) {
                        state.bookingConfig.alias = result.client_name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    }

                    saveData(); // Persist to IndexedDB
                }
            }

            // Expose globally to fix underscore/camelCase mismatch
            window.check_license = checkLicense;
            
            // FORCE UI REFRESH IF IN CONFIG
            if (state.currentView === 'config') renderConfigView();

                // SYNC ARCHIVES
                if (result.archives) {
                    state.archives = result.archives;
                    localStorage.setItem('erm_license_archives', JSON.stringify(result.archives));
                }

                updateLicenseCountdown();
                result.sheet_id = result.sheet_id || localStorage.getItem('erm_sheet_id'); // Fallback
                return result; // RETURN FOR SWITCH YEAR LOGIC
            } else {
                console.warn("License Check Failed:", result.message);
                if (result.message === "Kode Lisensi tidak ditemukan.") {
                    if (!silent) renderLockScreen("Lisensi tidak valid atau telah dihapus oleh Admin.");
                }
                localStorage.setItem('erm_license_status', 'EXPIRED'); // Ensure status is updated
                if (!silent) renderLockScreen(result.message); // Keep existing renderLockScreen
                return result;
            }
        } catch (e) {
            console.error("License Background Check Error:", e);
            return { valid: false, error: e.message };
        }
    }
    return { valid: true, cached: true }; // Local validation passed
}

// ...

async function activateLicense() {
    const key = document.getElementById('license-input').value.trim();
    const btn = document.getElementById('btn-activate');
    const url = LICENSE_API_URL;

    if (!key) { alert("Masukkan kode dulu!"); return; }

    btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin" width="20"></i> Memeriksa...`;
    btn.disabled = true;
    lucide.createIcons();

    try {
        const fetchUrl = `${url}?action=check_license&key=${key}&t=${Date.now()}`;
        const resp = await fetch(fetchUrl);

        if (!resp.ok) throw new Error("HTTP Error " + resp.status);

        const result = await resp.json();

        if (result.valid) {
            alert(`✅ AKTIVASI BERHASIL!\n\nPaket: ${result.plan}\nKlien: ${result.client}\nExpired: ${result.expires}`);
            localStorage.setItem('erm_license_key', key);
            localStorage.setItem('erm_license_expiry', result.expires);
            if (result.expires_iso) localStorage.setItem('erm_license_expiry_iso', result.expires_iso);
            if (result.expiry_iso) localStorage.setItem('erm_license_expiry_iso', result.expiry_iso);

            localStorage.setItem('erm_license_status', 'ACTIVE');
            localStorage.setItem('erm_license_plan', result.plan);

            // [NEW] Store archives on activation
            if (result.archives) {
                state.archives = result.archives;
                localStorage.setItem('erm_license_archives', JSON.stringify(result.archives));
            }

            // [NEW] Set flag for initial sync screen after reload
            localStorage.setItem('erm_first_activation_sync', 'true');

            // AUTO-CONFIG on Activation
            if (result.sheet_id) {
                const autoUrl = `https://docs.google.com/spreadsheets/d/${result.sheet_id}/edit`;
                localStorage.setItem('erm_script_url', autoUrl);
                localStorage.setItem('erm_sheet_id', result.sheet_id); // [FIX] Save ID on activation
                alert(`✅ DATABASE TERHUBUNG OTOMATIS!\nID: ${result.sheet_id}`);
            }

            // [NEW] Sync Booking Config on Activation
            if (result.alias) {
                if (result.alias) state.bookingConfig.alias = result.alias;
                if (result.available_hours !== undefined) state.bookingConfig.availableHours = String(result.available_hours);
                if (result.off_days !== undefined) state.bookingConfig.offDays = String(result.off_days);
                if (result.custom_holidays !== undefined) state.bookingConfig.customHolidays = String(result.custom_holidays);
                // Use saveData() to persist to IndexedDB
                await saveData();
            }

            location.reload();
        } else {
            alert(`❌ GAGAL: ${result.message}`);
            btn.innerHTML = `<i data-lucide="key" width="20"></i> Aktivasi Sekarang`;
            btn.disabled = false;
            lucide.createIcons();
        }

    } catch (e) {
        console.error(e);
        // Clean Error Message
        let msg = e.message;
        if (msg === 'Failed to fetch') msg = "Gagal terhubung ke server. Cek internet.\nJika pakai file://, coba upload ke hosting/localhost.";

        alert(`Gagal Verifikasi.\nError: ${msg}`);
        btn.innerHTML = `<i data-lucide="key" width="20"></i> Aktivasi Sekarang`;
        btn.disabled = false;
        lucide.createIcons();
    }
}

// ...

async function refreshLicenseStatus() {
    const btn = document.querySelector('#tab-content-license button');
    const oldHtml = btn.innerHTML;
    // Safe Lucide call
    btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin" width="16"></i> Memeriksa...`;
    btn.disabled = true;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const savedKey = localStorage.getItem('erm_license_key');
    if (!savedKey) {
        alert("Data lisensi lokal tidak lengkap.");
        btn.innerHTML = oldHtml; btn.disabled = false;
        return;
    }

    try {
        // Extract Sheet ID (Robust Way)
        let sheetId = "";
        const rawUrl = state.scriptUrl || localStorage.getItem('erm_config_url');

        if (rawUrl) {
            const match = rawUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
            if (match && match[1]) sheetId = match[1];
        }

        console.log("DEBUG: Refreshing with Sheet ID =", sheetId);

        if (!sheetId) {
            alert("⚠️ PERINGATAN: Aplikasi tidak dapat menemukan URL Google Sheet Anda.\nPastikan Anda sudah 'Simpan Koneksi' di menu Konfigurasi Database.");
        }

        const fetchUrl = `${LICENSE_API_URL}?action=check_license&key=${savedKey}&sheet_id=${sheetId}&t=${Date.now()}`;
        const resp = await fetch(fetchUrl);
        const result = await resp.json();

        if (result.valid) {
            localStorage.setItem('erm_license_expiry', result.expires);
            if (result.expires_iso) localStorage.setItem('erm_license_expiry_iso', result.expires_iso);

            localStorage.setItem('erm_license_plan', result.plan);
            localStorage.setItem('erm_license_status', 'ACTIVE');

            // AUTO-CONFIG on Refresh
            if (result.sheet_id) {
                const autoUrl = `https://docs.google.com/spreadsheets/d/${result.sheet_id}/edit`;
                if (autoUrl !== (state.scriptUrl || localStorage.getItem('erm_script_url'))) {
                    localStorage.setItem('erm_script_url', autoUrl);
                    state.scriptUrl = autoUrl;
                    alert("🔄 Database Koneksi Diperbarui Otomatis!");
                }
            }

            // Sync Booking Config
            if (result.alias) {
                state.bookingConfig.alias = result.alias;
                state.bookingConfig.availableHours = (result.available_hours === 0 || result.available_hours) ? String(result.available_hours) : "";
                state.bookingConfig.offDays = (result.off_days === 0 || result.off_days) ? String(result.off_days) : "";
                if (result.day_config) {
                    try {
                        state.bookingConfig.dayConfig = typeof result.day_config === 'string' ? JSON.parse(result.day_config) : result.day_config;
                    } catch (e) { state.bookingConfig.dayConfig = {}; }
                }
                saveData();
            }

            alert(`Status Diperbarui!\n\nPaket: ${result.plan}\nExpired Terbaru: ${result.expires}\nSheet ID: Terhubung ✅`);
            updateLicenseCountdown();
        } else {
            alert(`Lisensi Tidak Valid / Expired: ${result.message}`);
            localStorage.setItem('erm_license_status', 'EXPIRED');
            checkLicense();
        }

    } catch (e) {
        console.error(e);
        alert("Gagal koneksi ke server Lisensi Pusat. Coba lagi.");
    } finally {
        btn.innerHTML = oldHtml;
        btn.disabled = false;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

async function saveData() {
    try {
        await Promise.all([
            window.fisiotaDB.save('patients', state.patients),
            window.fisiotaDB.save('assessments', state.assessments),
            window.fisiotaDB.save('appointments', state.appointments),
            window.fisiotaDB.save('expenses', state.expenses || []),
            window.fisiotaDB.save('packages', state.packages || []),
            window.fisiotaDB.save('treatments', state.treatments || []),
            window.fisiotaDB.save('protocols', state.protocols || []),

            window.fisiotaDB.save('users', state.users),
            window.fisiotaDB.save('config', [
                { id: 'global', info: state.clinicInfo, pdf: state.pdfConfig, notif: state.notificationConfig, booking: state.bookingConfig },
                { id: 'deleted_logs', ids: state.deletedIds }
            ])
        ]);

        // Backup ke localStorage untuk metadata penting (fallback cepat)
        localStorage.setItem('erm_script_url', state.scriptUrl || '');
        localStorage.setItem('erm_clinic_config', JSON.stringify(state.clinicInfo));

        updateSyncStatusUI(checkDataDirty());
    } catch (e) {
        console.error("Database Save Error:", e);
    }
}

// Sanitize assessments: pastikan semua field array benar-benar array
// Data lama dari Google Sheet bisa tersimpan sebagai string, null, dll.
function sanitizeAssessments(assessments) {
    const ARRAY_FIELDS = ['pain_points', 'b', 's', 'd_act', 'd_part', 'intervention', 'eval'];
    const OBJECT_FIELDS = ['obj', 'templateDefault', 'hms_notes', 'bodyChart', 'special_tests'];

    return (assessments || []).map(a => {
        const fixed = { ...a };

        // [AUTO-FIX] Normalize keys that might be destroyed by Google Apps Script `norm()`
        if (fixed.patientid && !fixed.patientId) fixed.patientId = fixed.patientid;
        if (fixed.specialtests && !fixed.special_tests) fixed.special_tests = fixed.specialtests;
        if (fixed.specialtestsnote && !fixed.special_tests_note) fixed.special_tests_note = fixed.specialtestsnote;
        if (fixed.hmsnotes && !fixed.hms_notes) fixed.hms_notes = fixed.hmsnotes;
        if (fixed.hmsdiagnosis && !fixed.hms_diagnosis) fixed.hms_diagnosis = fixed.hmsdiagnosis;
        if (fixed.bodychart && !fixed.bodyChart) fixed.bodyChart = fixed.bodychart;
        if (fixed.templatedefault && !fixed.templateDefault) fixed.templateDefault = fixed.templatedefault;
        if (fixed.painpoints && !fixed.pain_points) fixed.pain_points = fixed.painpoints;
        if (fixed.dact && !fixed.d_act) fixed.d_act = fixed.dact;
        if (fixed.dpart && !fixed.d_part) fixed.d_part = fixed.dpart;
        if (fixed.categoryid && !fixed.categoryID) fixed.categoryID = fixed.categoryid;
        if (fixed.diseaseid && !fixed.diseaseID) fixed.diseaseID = fixed.diseaseid;
        if (fixed.isconsented && !fixed.is_consented) fixed.is_consented = fixed.isconsented;
        if (fixed.consenttimestamp && !fixed.consent_timestamp) fixed.consent_timestamp = fixed.consenttimestamp;
        if (fixed.patientsignature && !fixed.patient_signature) fixed.patient_signature = fixed.patientsignature;
        if (fixed.rontgenurl && !fixed.rontgen_url) fixed.rontgen_url = fixed.rontgenurl;

        // [AUTO-FIX] New TTV & D/S Normalization
        if (fixed.ttvtd && !fixed.ttv_td) fixed.ttv_td = fixed.ttvtd;
        if (fixed.ttvhr && !fixed.ttv_hr) fixed.ttv_hr = fixed.ttvhr;
        if (fixed.ttvrr && !fixed.ttv_rr) fixed.ttv_rr = fixed.ttvrr;
        if (fixed.ttvtemp && !fixed.ttv_temp) fixed.ttv_temp = fixed.ttvtemp;
        if (fixed.ttvspo2 && !fixed.ttv_spo2) fixed.ttv_spo2 = fixed.ttvspo2;
        if (fixed.romd && !fixed.rom_d) fixed.rom_d = fixed.romd;
        if (fixed.roms && !fixed.rom_s) fixed.rom_s = fixed.roms;
        if (fixed.mmtd && !fixed.mmt_d) fixed.mmt_d = fixed.mmtd;
        if (fixed.mmts && !fixed.mmt_s) fixed.mmt_s = fixed.mmts;

        // 1. Handle Array Fields
        ARRAY_FIELDS.forEach(field => {
            let val = fixed[field];

            // Jika isinya string JSON array
            if (typeof val === 'string' && val.trim().startsWith('[')) {
                try { val = JSON.parse(val); } catch (e) { val = []; }
            }

            // Jika masuk sebagai object tapi bukan array (biasanya karena salah penempatan/sync)
            if (val && typeof val === 'object' && !Array.isArray(val)) {
                val = [val];
            }

            // Pastikan akhirnya adalah array
            let finalArr = [];
            if (Array.isArray(val)) {
                finalArr = val;
            } else if (typeof val === 'string' && val.trim() !== '') {
                finalArr = [val];
            }

            // [CRITICAL FIX] Clean each element from redundant quotes/slashes
            fixed[field] = finalArr.map(item => {
                if (typeof item === 'string') {
                    // Hilangkan karakter kutip yang menempel di awal/akhir string (hasil double stringify)
                    let cleaned = item.trim();
                    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
                        cleaned = cleaned.substring(1, cleaned.length - 1);
                    }
                    // Ganti literal backslash-quote dengan quote biasa
                    return cleaned.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                }
                return item;
            });
        });

        // 2. Handle Object Fields
        OBJECT_FIELDS.forEach(field => {
            // Jika isinya string JSON object
            if (typeof fixed[field] === 'string' && fixed[field].trim().startsWith('{')) {
                try { fixed[field] = JSON.parse(fixed[field]); } catch (e) { fixed[field] = {}; }
            }
            // CRITICAL: Jika masuk sebagai array padahal harusnya object (misal: [{"rom":...}])
            if (Array.isArray(fixed[field])) {
                fixed[field] = fixed[field][0] || (field === 'obj' ? { rom: '-', rom_side: '-', rom_part: '-', mmt: '0', mmt_side: '-', mmt_part: '-', balance: 'Baik' } : {});
            }
            // Pastikan akhirnya adalah object
            if (!fixed[field] || typeof fixed[field] !== 'object' || Array.isArray(fixed[field])) {
                if (field === 'obj') {
                    fixed[field] = { rom: '-', rom_side: '-', rom_part: '-', mmt: '0', mmt_side: '-', mmt_part: '-', balance: 'Baik' };
                } else {
                    fixed[field] = {};
                }
            }
        });

        // Migration: Move special_tests from obj to root if missing
        if (fixed.obj && typeof fixed.obj === 'object') {
            if (fixed.obj) {
                // FORCE MOVE: special_tests and special_tests_note MUST be top-level
                if (fixed.obj.special_tests) {
                    // Only overwrite if top-level is empty OR we are doing a fresh extraction
                    if (!fixed.special_tests || Object.keys(fixed.special_tests).length === 0) {
                        fixed.special_tests = fixed.obj.special_tests;
                    }
                    delete fixed.obj.special_tests;
                }
                if (fixed.obj.special_tests_note) {
                    if (!fixed.special_tests_note || fixed.special_tests_note === "") {
                        fixed.special_tests_note = fixed.obj.special_tests_note;
                    }
                    delete fixed.obj.special_tests_note;
                }
            }
        }

        // Pastikan kolom baru tetap ada (tidak sengaja terhapus)
        if (fixed.prenatal === undefined) fixed.prenatal = "";
        if (fixed.natal === undefined) fixed.natal = "";
        if (fixed.postnatal === undefined) fixed.postnatal = "";
        if (fixed.special_tests === undefined) fixed.special_tests = {};
        if (fixed.special_tests_note === undefined) fixed.special_tests_note = "";
        if (fixed.hms_diagnosis === undefined) fixed.hms_diagnosis = "";
        if (fixed.is_consented === undefined) fixed.is_consented = "";
        if (fixed.consent_timestamp === undefined) fixed.consent_timestamp = "";
        if (fixed.patient_signature === undefined) fixed.patient_signature = "";
        if (fixed.rontgen_url === undefined) fixed.rontgen_url = "";
        if (fixed.is_locked === undefined) fixed.is_locked = false;
        if (fixed.updatedAt === undefined) fixed.updatedAt = getServerTimeISO();

        // Auto-Lock Logic: If synced and older than 7 days, mark as locked to prevent backend corruption
        const lastSyncStr = localStorage.getItem('erm_last_sync');
        if (lastSyncStr && !fixed.is_locked) {
            const lastSync = new Date(lastSyncStr);
            const assessDate = new Date(fixed.date);
            const diffDays = Math.floor((lastSync - assessDate) / (1000 * 60 * 60 * 24));
            if (diffDays >= 7) {
                fixed.is_locked = true;
            }
        }

        // 3. Last Line Defense for VAS (Anti-Corruption)
        if (typeof fixed.vas === 'string' && (fixed.vas.includes('{') || fixed.vas.includes('['))) {
            fixed.vas = "0";
        }

        return fixed;
    });
}

function applyBranding() {
    const sidebarTitle = document.querySelector('#app-sidebar h1');
    if (sidebarTitle) sidebarTitle.innerText = state.clinicInfo.name;
    const sidebarSub = document.querySelector('#app-sidebar p.text-xs');
    if (sidebarSub) sidebarSub.innerText = state.clinicInfo.subname;

    // Legacy URL Upgrade (Optional but helpful for old uc?id= links)
    if (state.clinicInfo.logoUrl && state.clinicInfo.logoUrl.includes('drive.google.com/uc?id=')) {
        const id = state.clinicInfo.logoUrl.split('id=')[1];
        if (id) state.clinicInfo.logoUrl = `https://lh3.googleusercontent.com/d/${id}`;
    }

    // Sidebar Logo
    const sbLogoContainer = document.getElementById('sidebar-logo-container');
    const sbLogoImg = document.getElementById('sidebar-logo');
    if (sbLogoContainer && sbLogoImg) {
        // Priority: window.IMG_ASSETS.logo (User Choice) -> state.clinicInfo.logoUrl (Cloud Config)
        const activeLogo = window.IMG_ASSETS.logo || convertDriveUrl(state.clinicInfo.logoUrl);
        if (activeLogo) {
            sbLogoImg.src = activeLogo;
            sbLogoImg.onerror = () => { sbLogoContainer.classList.add('hidden'); };
            sbLogoContainer.classList.remove('hidden');
        } else {
            sbLogoContainer.classList.add('hidden');
        }
    }

    const loginTitle = document.querySelector('#login-screen h1');
    if (loginTitle) loginTitle.innerText = state.clinicInfo.name;
    const loginSub = document.querySelector('#login-screen p');
    if (loginSub) loginSub.innerText = state.clinicInfo.subname;

    // Login Logo
    const loginLogoContainer = document.getElementById('login-logo-container');
    const loginLogoImg = document.getElementById('login-logo');
    if (loginLogoContainer && loginLogoImg) {
        const activeLogo = window.IMG_ASSETS.logo || convertDriveUrl(state.clinicInfo.logoUrl);
        if (activeLogo) {
            loginLogoImg.src = activeLogo;
            loginLogoImg.onerror = () => { loginLogoContainer.classList.add('hidden'); };
            loginLogoContainer.classList.remove('hidden');
        } else {
            loginLogoContainer.classList.add('hidden');
        }
    }

    // Dynamic Favicon & Apple Icons (Uses window.IMG_ASSETS.logo)
    if (window.IMG_ASSETS.logo) {
        const favEl = document.getElementById('dynamic-favicon');
        if (favEl) favEl.href = window.IMG_ASSETS.logo;
        const appleEl = document.getElementById('dynamic-apple-icon');
        if (appleEl) appleEl.href = window.IMG_ASSETS.logo;
    }

    // Apply Dynamic Accent Color
    const accent = (state.pdfConfig && state.pdfConfig.accentColor) ? state.pdfConfig.accentColor : '#2563eb';
    let styleEl = document.getElementById('dynamic-accent-style');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'dynamic-accent-style';
        document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = `
        :root { --primary-color: ${accent}; }
        
        .print-page-wrapper h1, 
        .print-page-wrapper h2, 
        .print-page-wrapper h3 { color: var(--primary-color) !important; font-weight: 950 !important; }

        .print-page-wrapper .border-b-2, 
        .print-page-wrapper .border-t-2,
        .print-page-wrapper .border-slate-800 { border-color: var(--primary-color) !important; }

        @media print {
            h1, h2, h3 { color: var(--primary-color) !important; font-weight: 950 !important; }
            .border-b-2, .border-t-2 { border-color: var(--primary-color) !important; }
            
            /* FORCE BACKGROUND PRINTING FOR PAIN POINTS */
            .pain-point-marker {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                background-color: #ef4444 !important; 
                border-color: white !important;
                color: white !important;
            }
        }
    `;
}

function enablePrintPageMargins() {
    let style = document.getElementById('print-margin-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'print-margin-style';
        document.head.appendChild(style);
    }
    // STRICT MARGINS ONLY WHEN PRINTING
    style.innerHTML = `
        @media print {
            @page { 
                margin: 10mm 15mm 10mm 15mm !important; 
            }
        }
    `;
}

function disablePrintPageMargins() {
    const style = document.getElementById('print-margin-style');
    if (style) style.remove();
}

function checkOnlineStatus() {
    const status = document.getElementById('sync-status');
    if (status) {
        if (state.scriptUrl && state.scriptUrl.includes("docs.google.com/spreadsheets")) {
            status.classList.remove('hidden');
            status.innerHTML = '<i data-lucide="link" width="12"></i> Sheet Terkoneksi';
        } else {
            status.classList.add('hidden');
        }
    }
    renderIcons();
}

// Sync Toasts removed logic

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const colors = {
        success: 'bg-emerald-50 border-emerald-500 text-emerald-800',
        error: 'bg-rose-50 border-rose-500 text-rose-800',
        info: 'bg-blue-50 border-blue-500 text-blue-800',
        warning: 'bg-amber-50 border-amber-500 text-amber-800'
    };

    const icons = {
        success: 'check-circle',
        error: 'alert-circle',
        info: 'info',
        warning: 'alert-triangle'
    };

    toast.className = `toast-item flex items-center gap-3 p-4 rounded-xl shadow-2xl border-l-4 ${colors[type] || colors.info} mb-3`;
    toast.innerHTML = `
        <i data-lucide="${icons[type] || icons.info}" width="20"></i>
        <p class="text-sm font-bold">${message}</p>
    `;

    container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Auto remove after 3s
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showSyncBanner(isBooking = true) {
    try {
        const sound = document.getElementById('notif-sound');
        if (sound) {
            // Fallback if local file is missing
            if (sound.paused && (!sound.src || sound.src.includes('assets/notif.mp3'))) {
                sound.src = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';
            }
            sound.currentTime = 0;
            sound.play().catch(e => console.warn("Sound play failed (Interaction required?):", e));
        }
    } catch (err) { }

    // 2. Browser Title Pulse
    const originalTitle = document.title;
    if (isBooking) {
        let count = 0;
        const interval = setInterval(() => {
            document.title = (count % 2 === 0) ? "🔔 BOOKING BARU!" : originalTitle;
            if (++count > 10) { document.title = originalTitle; clearInterval(interval); }
        }, 1000);
    }

    // 3. Floating Banner
    const existing = document.getElementById('sync-banner');
    if (existing) {
        if (isBooking) {
            existing.querySelector('span').innerText = 'Ada data booking baru! Klik untuk perbarui.';
            const btn = existing.querySelector('button');
            if (btn) btn.setAttribute('onclick', "this.parentElement.remove(); navigate('schedule');");
            existing.classList.remove('hidden');
        }
        return;
    }

    const banner = document.createElement('div');
    banner.id = 'sync-banner';
    banner.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce-short';
    const text = isBooking ? 'Ada data booking baru! Klik untuk perbarui.' : 'Data tersinkronisasi. Klik untuk muat ulang.';
    const actionCmd = isBooking ? "navigate('schedule')" : "navigate(state.currentView)";

    banner.innerHTML = `
        <button onclick="this.parentElement.remove(); ${actionCmd};" 
            class="flex items-center gap-4 bg-blue-600 text-white px-8 py-4 rounded-full shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:bg-blue-700 transition-all border-2 border-white/20 font-black text-sm tracking-wide transform active:scale-95">
            <i data-lucide="bell-ring" width="24" class="animate-pulse"></i>
            <span>${text}</span>
        </button>
    `;
    document.body.appendChild(banner);
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

window.testNotifSound = function () {
    const sound = document.getElementById('notif-sound');
    if (sound) {
        sound.currentTime = 0;
        sound.play().then(() => {
            showToast("Suara notifikasi berhasil diputar! 🔔", "success");
        }).catch(e => {
            console.error("Manual Sound Play Failed:", e);
            alert("Gagal memutar suara. Pastikan browser tidak memblokir Autoplay dan file audio tersedia.\n\nError: " + e.message);
        });
    } else {
        alert("Elemen 'notif-sound' tidak ditemukan!");
    }
}

function normalizeDate(s) {
    if (!s) return "";
    if (typeof s !== 'string') return s;
    if (s.includes("-")) return s; // already yyyy-MM-dd
    if (s.includes("/")) {
        let parts = s.split("/");
        if (parts[2] && parts[2].length === 4) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
    }
    return s;
}

function normalizeTime(val) {
    if (!val) return "";
    let s = String(val).trim();
    if (s.includes(" ")) {
        let timePart = s.split(" ")[1];
        if (timePart) s = timePart;
    }
    if (s.includes(":") || s.includes(".")) {
        let parts = s.split(/[:\.]/);
        let HH = parts[0].padStart(2, '0');
        let mm = (parts[1] || "00").substring(0, 2).padStart(2, '0');
        return `${HH}:${mm}`;
    }
    return s;
}

// Helper to extract ID from URL
function getSheetIdFromUrl(url) {
    if (!url) return null;
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}

// [NEW] Robust Date Parser for variety of ISO-ish formats (handled by GAS/JS mix)
function parseDateSafe(val) {
    if (!val) return new Date(0);
    if (val instanceof Date) return val;
    // Replace space with T for ISO compatibility (GAS often returns space)
    const normalized = String(val).trim().replace(" ", "T");
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? new Date(0) : d;
}

async function pushDataToSheet() {
    if (!state.scriptUrl) { alert("URL Google Sheet belum dikonfigurasi!"); return; }

    const sheetId = state.sheetId || getSheetIdFromUrl(state.scriptUrl);
    if (!sheetId) { alert("Sheet ID tidak valid! Harap cek di menu Konfigurasi System."); return; }

    if (!confirm("PERHATIAN: Mode SYNC TOTAL aktif.\nData di Google Sheet akan disamakan PERSIS dengan Aplikasi ini.\nJika Anda menghapus data di Aplikasi, di Sheet juga akan terhapus.\n\nLanjutkan?")) return;

    const btn = document.getElementById('btn-sync');
    const oriText = btn ? btn.innerHTML : 'Kirim Data';
    if (btn) btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin" width="16"></i> Mengirim...';

    // Update timestamps for all items to be safe (optional, but good for consistency)
    const now = new Date().toISOString();

    // Helper to ensure updated_at exists
    const ensureTs = (list) => list.map(item => ({ ...item, updatedAt: item.updatedAt || now }));

    try {
        const response = await fetch(LICENSE_API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'push', // FULL SYNC (OVERWRITE)
                sheet_id: sheetId,
                patients: ensureTs(state.patients),
                assessments: ensureTs(state.assessments),
                appointments: ensureTs(state.appointments),
                expenses: ensureTs(state.expenses || []),
                packages: ensureTs(state.packages || []),
                protocols: ensureTs(state.protocols || []),
                users: ensureTs(state.users || []),
                config: state.clinicInfo ? [{ key: 'clinic_info', value: JSON.stringify(state.clinicInfo) }] : []
            })
        });

        const result = await response.json();
        if (result.status === 'success') {
            // Update Last Sync Time
            localStorage.setItem('erm_last_sync', new Date().toISOString());
            alert(`✅ Sinkronisasi Total Berhasil!\nGoogle Sheet sekarang sama persis dengan Aplikasi.`);
        } else {
            throw new Error(result.message || "Gagal sinkronisasi data.");
        }
    } catch (error) {
        console.error('Gagal mengirim.', error);
        alert('❌ Gagal mengirim data.\n\nError: ' + error.message + '\n\nSaran: Cek koneksi internet atau pastikan Sheet sudah di-SHARE ke email script.');
    } finally {
        if (btn) btn.innerHTML = oriText;
        lucide.createIcons();
    }
}

// Internal helper: push delta tanpa mengunci _syncing (dipakai oleh backgroundAutoSync)
// Berbeda dari syncDelta: tidak set _syncing flag (sudah dikunci oleh caller)
async function _pushDelta(sheetId) {
    const lastSyncStr = localStorage.getItem('erm_last_sync');
    const lastSync = parseDateSafe(lastSyncStr);

    let latestPushedTime = lastSync.getTime();

    const filterDelta = (list) => {
        if (!list || !Array.isArray(list)) return [];
        return list.filter(item => {
            const up = parseDateSafe(item.updatedAt || item.updated_at);
            const t = up.getTime();
            // [STRICT SYNC] Subtract 1 minute buffer to catch items created during the last sync request
            if (t > (lastSync.getTime() - 60000)) {
                if (t > latestPushedTime) latestPushedTime = t;
                return true;
            }
            return false;
        });
    };

    const deltaPatients = filterDelta(state.patients);
    const deltaAssessments = filterDelta(state.assessments);
    const deltaAppointments = filterDelta(state.appointments);
    const deltaExpenses = filterDelta(state.expenses);
    const deltaPackages = filterDelta(state.packages);
    const deltaProtocols = filterDelta(state.protocols);
    const deltaTreatments = filterDelta(state.treatments);

    const hasDelta = deltaPatients.length > 0 || deltaAssessments.length > 0 ||
        deltaAppointments.length > 0 || deltaExpenses.length > 0 ||
        deltaPackages.length > 0 || deltaProtocols.length > 0 || deltaTreatments.length > 0;
    const hasDeletes = Object.values(state.deletedIds || {}).some(arr => Array.isArray(arr) && arr.length > 0);

    if (!hasDelta && !hasDeletes) return null;

    try {
        updateSyncStatusUI('syncing', false); // Centralized control

        const response = await fetch(LICENSE_API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'delta_push',
                sheet_id: sheetId,
                patients: deltaPatients,
                assessments: deltaAssessments,
                appointments: deltaAppointments,
                expenses: deltaExpenses,
                packages: deltaPackages,
                protocols: deltaProtocols,
                treatments: deltaTreatments,
                deletedIds: state.deletedIds,
                config: checkConfigDelta(lastSync)
            })
        });

        const res = await response.json();
        if (response.ok && res.status === 'success') {
            const pushedDeleteIds = JSON.parse(JSON.stringify(state.deletedIds));

            // Sync Clock Offset
            if (res.server_time) {
                state.serverTimeOffset = parseDateSafe(res.server_time).getTime() - Date.now();
            }

            // USE SERVER TIME to avoid drift gaps
            const finalSyncTime = res.server_time || getServerTimeISO();
            localStorage.setItem('erm_last_sync', finalSyncTime);

            console.log('AutoSync: Push berhasil ✅ | Server Time:', finalSyncTime);
            return pushedDeleteIds;
        } else {
            const errorMsg = res.message || 'Unknown error';
            console.warn('AutoSync: Push gagal –', errorMsg);
            if (errorMsg.toLowerCase().includes('protected') || errorMsg.toLowerCase().includes('fail')) {
                showToast(`Sinkronisasi Gagal: Baris 1 di Google Sheet mungkin Terkunci (Protected).`, 'error');
            }
        }
    } catch (e) {
        console.warn('AutoSync: Push error (offline?) –', e.message);
    }
    return null;
}

async function syncDelta(blocking = false) {
    if (!state.scriptUrl) return;
    const sheetId = getSheetIdFromUrl(state.scriptUrl) || state.sheetId;
    if (!sheetId) {
        console.warn("Sync Delta aborted: No valid sheetId found.");
        updateSyncStatusUI(false);
        return;
    }

    // [FIX] Stuck sync lock protection (Auto-recovery after 60s)
    if (state._syncing && (Date.now() - (state._lastSyncStart || 0)) > 60000) {
        console.warn("Sync lock timeout detected, forcing recovery...");
        state._syncing = false;
    }

    if (state._syncing) {
        console.log("SyncDelta: System busy, rescheduling in 2s...");
        setTimeout(() => syncDelta(blocking), 2000);
        return;
    }
    state._syncing = true;
    state._lastSyncStart = Date.now();
    updateSyncStatusUI('syncing', blocking);

    const lastSyncStr = localStorage.getItem('erm_last_sync');
    const lastSync = parseDateSafe(lastSyncStr);
    const lastSyncTime = lastSync.getTime();

    let latestPushedTime = lastSyncTime;

    const filterDelta = (list) => {
        if (!list || !Array.isArray(list)) return [];
        return list.filter(item => {
            // Primary: _dirty flag = instant push
            if (item._dirty === true) return true;

            // Fallback: clock skew protection
            const itemTime = parseDateSafe(item.updatedAt || item.updated_at).getTime();
            return itemTime > (lastSyncTime - 60000);
        });
    };

    const deltaPatients = filterDelta(state.patients);
    const deltaAssessments = filterDelta(state.assessments);
    const deltaAppointments = filterDelta(state.appointments);
    const deltaExpenses = filterDelta(state.expenses);
    const deltaPackages = filterDelta(state.packages);
    const deltaProtocols = filterDelta(state.protocols);
    const deltaUsers = filterDelta(state.users);
    const deltaTreatments = filterDelta(state.treatments);

    const hasDelta = deltaPatients.length > 0 || deltaAssessments.length > 0 ||
        deltaAppointments.length > 0 || deltaExpenses.length > 0 ||
        deltaPackages.length > 0 || deltaProtocols.length > 0 ||
        deltaUsers.length > 0 || deltaTreatments.length > 0;

    // Check for deletes
    const hasDeletes = Object.values(state.deletedIds || {}).some(arr => Array.isArray(arr) && arr.length > 0);

    if (!hasDelta && !hasDeletes) {
        state._syncing = false;
        // If we came here from a manual sync request, still show success
        updateSyncStatusUI('success');
        return;
    }

    updateSyncStatusUI('syncing');

    try {
        const response = await fetch(LICENSE_API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'delta_push',
                sheet_id: sheetId,
                patients: deltaPatients,
                assessments: deltaAssessments,
                appointments: deltaAppointments,
                expenses: deltaExpenses,
                packages: deltaPackages,
                protocols: deltaProtocols,
                users: deltaUsers,
                treatments: deltaTreatments,
                deletedIds: state.deletedIds
            })
        });

        const res = await response.json();
        if (response.ok && res.status === 'success') {
            // Success
            const finalSyncTime = res.server_time || getServerTimeISO();
            localStorage.setItem('erm_last_sync', finalSyncTime);

            // [CRITICAL] Clear Dirty Flags only for items that were in the delta (Selective Clearing)
            const clearSelected = (deltaList) => { (deltaList || []).forEach(x => { if (x._dirty) delete x._dirty; }); };
            clearSelected(deltaPatients);
            clearSelected(deltaAssessments);
            clearSelected(deltaAppointments);
            clearSelected(deltaExpenses);
            clearSelected(deltaPackages);
            clearSelected(deltaProtocols);
            clearSelected(deltaUsers);
            clearSelected(deltaTreatments);

            // Clear deletes that were sent
            state.deletedIds = { patients: [], assessments: [], appointments: [], users: [], expenses: [], packages: [], protocols: [], treatments: [] };

            updateSyncStatusUI('success');
            console.log("Sync Delta: Success ✅");
        } else {
            updateSyncStatusUI('error');
            console.warn("Sync Delta: Failed –", res?.message || "Unknown error");
        }
    } catch (e) {
        updateSyncStatusUI('error');
        console.error("Sync Delta: Error –", e);
    } finally {
        state._syncing = false;
        // Ensure blocking overlay is removed
        if (window._isBlockingSync) {
            window._isBlockingSync = false;
            const syncLoading = document.getElementById('sync-loading');
            if (syncLoading) syncLoading.classList.add('hidden');
        }
    }
}

// [NEW] Volatile blacklist to prevent read-replica resurrection
window._recentDeletes = new Set();
function trackDelete(id) {
    if (!id) return;
    window._recentDeletes.add(String(id));
    // auto-clear after 2 minutes to keep memory fresh
    setTimeout(() => window._recentDeletes.delete(String(id)), 120000);
}

function updateSyncStatusUI(status, blocking = false, delaySeconds = 0) {
    const indicator = document.getElementById('sync-indicator');
    const bar = document.getElementById('top-progress-bar');
    const overlay = document.getElementById('sync-loading'); // Correct high-visibility overlay

    if (!indicator || !bar) return;

    // Handle Blocking Overlay (Visible "Menyelaraskan Data...")
    if (status === 'syncing' && (blocking || window._isBlockingSync)) {
        if (overlay) {
            overlay.classList.remove('hidden');
            const h2 = overlay.querySelector('h2');
            if (h2) h2.innerText = "Menyelaraskan Data...";
        }
    } else if (status === 'success' || status === 'synced') {
        // [FIX] Don't hide immediately if success/synced, 
        // let renderApp handle the final transition to the dashboard.
        if (overlay && !window._isBlockingSync && !blocking) overlay.classList.add('hidden');
    } else {
        if (overlay && !window._isBlockingSync) overlay.classList.add('hidden');
    }

    if (status === 'pending') {
        indicator.innerHTML = `<span class="flex items-center gap-1 text-orange-500"><i data-lucide="clock" width="14"></i> <span class="text-[10px] font-bold uppercase tracking-tighter">Dalam Antrean (${delaySeconds}s)</span></span>`;
        if (bar) bar.style.width = '0%'; // Strict user request: Keep hidden during 3s delay
    } else if (status === 'syncing') {
        indicator.innerHTML = `<span class="flex items-center gap-1 text-blue-500 animate-pulse"><i data-lucide="refresh-cw" width="14" class="animate-spin"></i> <span class="text-[10px] font-bold uppercase tracking-tighter">Sinkronisasi...</span></span>`;
        if (bar) bar.style.width = '70%';
    } else if (status === 'synced' || status === 'success') {
        indicator.innerHTML = `<span class="flex items-center gap-1 text-emerald-500"><i data-lucide="check-circle" width="14"></i> <span class="text-[10px] font-bold uppercase tracking-tighter">Berhasil Sinkron</span></span>`;
        if (bar) bar.style.width = '100%';
        setTimeout(() => {
            if (bar) bar.style.width = '0%';
            if (indicator.innerText.includes('Berhasil')) {
                indicator.innerHTML = `<span class="flex items-center gap-1 text-slate-400"><i data-lucide="cloud" width="14"></i> <span class="text-[10px] font-bold uppercase tracking-tighter">Terhubung</span></span>`;
            }
        }, 2000);
    } else if (status === 'error') {
        indicator.innerHTML = `<span class="flex items-center gap-1 text-red-500"><i data-lucide="alert-circle" width="14"></i> <span class="text-[10px] font-bold uppercase tracking-tighter">Gagal Sync</span></span>`;
        if (bar) {
            bar.style.backgroundColor = '#ef4444'; // Red
            setTimeout(() => {
                bar.style.width = '0%';
                bar.style.backgroundColor = ''; // Reset
            }, 2000);
        }
    } else {
        // IDLE / FALSE / NULL
        if (bar) bar.style.width = '0%';
        indicator.innerHTML = `<span class="flex items-center gap-1 text-slate-400"><i data-lucide="cloud" width="14"></i> <span class="text-[10px] font-bold uppercase tracking-tighter">Terhubung</span></span>`;
    }
    lucide.createIcons();
}

function checkDataDirty() {
    const lastSyncStr = localStorage.getItem('erm_last_sync');
    if (!lastSyncStr) return true;
    const lastSync = parseDateSafe(lastSyncStr);

    const hasDirty = (list) => {
        if (!list || !Array.isArray(list)) return false;
        return list.some(item => {
            const up = parseDateSafe(item.updatedAt || item.updated_at);
            // [STRICT SYNC] Match the 60s buffer in _pushDelta to prevent losing data created during previous sync
            return up.getTime() > (lastSync.getTime() - 60000);
        });
    };

    const hasDeletes = Object.values(state.deletedIds || {}).some(arr => Array.isArray(arr) && arr.length > 0);

    const baseDirty = hasDirty(state.patients) || hasDirty(state.assessments) ||
        hasDirty(state.appointments) || hasDirty(state.expenses) ||
        hasDirty(state.packages) || hasDirty(state.protocols) ||
        hasDirty(state.treatments) || hasDeletes;

    const configDirty = state.configUpdatedAt && parseDateSafe(state.configUpdatedAt).getTime() > lastSync.getTime();
    return baseDirty || configDirty;
}

function checkConfigDelta(lastSync) {
    if (!state.configUpdatedAt) return null;
    if (parseDateSafe(state.configUpdatedAt).getTime() <= lastSync.getTime()) return null;

    return [
        { key: 'CLINIC_NAME', value: state.clinicInfo.name },
        { key: 'CLINIC_SUBNAME', value: state.clinicInfo.subname },
        { key: 'CLINIC_CITY', value: state.clinicInfo.city },
        { key: 'CLINIC_LOGO', value: state.clinicInfo.logoUrl || '' },
        { key: 'CLINIC_THERAPIST', value: state.clinicInfo.therapist },
        { key: 'CLINIC_SIPF', value: state.clinicInfo.sipf },
        { key: 'CLINIC_ADDRESS', value: state.clinicInfo.address },
        { key: 'CLINIC_NPWP', value: state.clinicInfo.npwp },
        { key: 'CLINIC_PHONE', value: state.clinicInfo.phone },
        { key: 'CLINIC_MAPS', value: state.clinicInfo.mapsUrl || '' },

        { key: 'TELEGRAM_TOKEN', value: state.notificationConfig.telegramToken },
        { key: 'TELEGRAM_CHAT_ID', value: state.notificationConfig.telegramChatId },
        { key: 'EMAIL_RECEIVER', value: state.notificationConfig.targetEmail },
        { key: 'EMAIL_SENDER', value: state.notificationConfig.senderEmail },
        { key: 'MSG_CONFIRM_TEMPLATE', value: state.notificationConfig.msgConfirm },
        { key: 'MSG_REJECT_TEMPLATE', value: state.notificationConfig.msgReject },
        { key: 'MSG_REMINDER_TEMPLATE', value: state.notificationConfig.msgReminder },

        { key: 'PDF_LAYOUT', value: state.pdfConfig.layoutMode },
        { key: 'PDF_ACCENT', value: state.pdfConfig.accentColor },
        { key: 'PDF_FONT_SIZE', value: state.pdfConfig.fontSize },
        { key: 'PDF_FONT_FAMILY', value: state.pdfConfig.fontFamily },
        { key: 'PDF_SHOW_KOP', value: state.pdfConfig.showKop },
        { key: 'PDF_SHOW_PATIENT', value: state.pdfConfig.showPatientInfo },
        { key: 'PDF_SHOW_SIGNATURE', value: state.pdfConfig.showSignature },
        { key: 'PDF_IC_TEXT', value: state.pdfConfig.informedConsentText },

        { key: 'BOOKING_ALIAS', value: state.bookingConfig.alias },
        { key: 'BOOKING_HOURS', value: state.bookingConfig.availableHours },
        { key: 'BOOKING_HOLIDAYS', value: state.bookingConfig.customHolidays }
    ];
}

// Check if there is any pending data to sync
function isDataUnsynced() {
    return checkDataDirty() || state._syncing;
}

async function pullDataFromSheet() {
    if (!state.scriptUrl) { alert('URL Google Sheet belum dikonfigurasi.'); return; }

    // NEW LOGIC: Use Central Bridge
    const sheetId = state.sheetId || getSheetIdFromUrl(state.scriptUrl);
    if (!sheetId) { alert("ID Spreadsheet tidak valid! Harap cek di menu Konfigurasi System."); return; }

    if (!confirm('PERHATIAN: Data lokal akan DITIMPA dengan data dari Google Sheet.\nData lokal yang belum disinkronkan akan HILANG.\n\nLanjutkan?')) return;

    const btn = document.getElementById('btn-pull');
    const oriText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin" width="18"></i> Mengambil...';
        btn.disabled = true;
        lucide.createIcons();
    }
    try {
        // Use Central API + sheet_id param
        const response = await fetch(`${LICENSE_API_URL}?action=pull&sheet_id=${sheetId}&t=${Date.now()}`);
        const data = await response.json();

        if (data.status === 'error') {
            throw new Error(data.message || "Gagal menarik data.");
        }

        if (data.patients && data.assessments) {
            const cleanup = (list, cat) => {
                const deletedList = state.deletedIds[cat] || [];
                return (list || []).filter(item => !deletedList.includes(item.id));
            };

            state.patients = cleanup(data.patients, 'patients');
            state.assessments = sanitizeAssessments(cleanup(data.assessments, 'assessments'));
            if (data.appointments) state.appointments = deduplicateAppointments(cleanup(data.appointments, 'appointments'));
            if (data.expenses) state.expenses = cleanup(data.expenses, 'expenses');
            if (data.packages) state.packages = cleanup(data.packages, 'packages');
            if (data.protocols) state.protocols = cleanup(data.protocols, 'protocols');
            if (data.users) state.users = cleanup(data.users, 'users');

            // [FIXED] Single Unified Config Sync Loop (Prevents Overwriting)
            if (data.config && Array.isArray(data.config)) {
                data.config.forEach(c => {
                    const key = c.key ? c.key.toUpperCase() : '';
                    const val = c.value;

                    // 1. Individual Clinic Info
                    if (key === 'CLINIC_NAME') state.clinicInfo.name = val;
                    if (key === 'CLINIC_SUBNAME') state.clinicInfo.subname = val;
                    if (key === 'CLINIC_CITY') state.clinicInfo.city = val;
                    if (key === 'CLINIC_LOGO') state.clinicInfo.logoUrl = val;
                    if (key === 'CLINIC_THERAPIST') state.clinicInfo.therapist = val;
                    if (key === 'CLINIC_SIPF') state.clinicInfo.sipf = val;
                    if (key === 'CLINIC_ADDRESS') state.clinicInfo.address = val;
                    if (key === 'CLINIC_NPWP') state.clinicInfo.npwp = val;
                    if (key === 'CLINIC_PHONE') state.clinicInfo.phone = val;
                    if (key === 'CLINIC_MAPS') state.clinicInfo.mapsUrl = val;

                    // 2. Notification Config
                    if (key === 'TELEGRAM_TOKEN') state.notificationConfig.telegramToken = val;
                    if (key === 'TELEGRAM_CHAT_ID') state.notificationConfig.telegramChatId = val;
                    if (key === 'EMAIL_RECEIVER') state.notificationConfig.targetEmail = val;
                    if (key === 'EMAIL_SENDER') state.notificationConfig.senderEmail = val;
                    if (key === 'MSG_CONFIRM_TEMPLATE') state.notificationConfig.msgConfirm = val;
                    if (key === 'MSG_REJECT_TEMPLATE') state.notificationConfig.msgReject = val;
                    if (key === 'MSG_REMINDER_TEMPLATE') state.notificationConfig.msgReminder = val;

                    // 3. Booking & PDF Config
                    if (key === 'BOOKING_HOURS') state.bookingConfig.availableHours = val;
                    if (key === 'BOOKING_OFFDAYS') state.bookingConfig.offDays = val;
                    if (key === 'BOOKING_ALIAS') state.bookingConfig.alias = val;
                    if (key === 'BOOKING_HOLIDAYS') state.bookingConfig.customHolidays = val;

                    if (key === 'PDF_IC_TEXT') state.pdfConfig.informedConsentText = val;
                    if (key === 'PDF_LAYOUT') state.pdfConfig.layoutMode = val;
                    if (key === 'PDF_ACCENT') state.pdfConfig.accentColor = val;
                    if (key === 'PDF_FONT_SIZE') state.pdfConfig.fontSize = val;

                    // 4. Fallback Support (Legacy CLINIC_INFO JSON)
                    if (key === 'CLINIC_INFO' || key === 'clinic_info') {
                        try {
                            const info = JSON.parse(val);
                            Object.assign(state.clinicInfo, info);
                        } catch (e) { }
                    }
                });

                // Persistence
                localStorage.setItem('erm_clinic_config', JSON.stringify(state.clinicInfo));
                localStorage.setItem('erm_notif_config', JSON.stringify(state.notificationConfig));
                localStorage.setItem('erm_pdf_config', JSON.stringify(state.pdfConfig));
            }

            saveData();
            // Re-render current view 
            navigate(state.currentView);

            showToast('Semua data berhasil ditarik dari Cloud!', 'success');
            renderApp();
            applyBranding();
        } else {
            alert('⚠️ Sheet Kosong atau Format Salah.\nPastikan Sheet memiliki tab: Patients, Assessments, Appointments.');
        }
    } catch (error) {
        console.error(error);
        alert('❌ Gagal menarik data.\nPastikan Sheet sudah di-SHARE ke email Script Editor.');
    } finally {
        if (btn) {
            btn.innerHTML = oriText;
            btn.disabled = false;
            lucide.createIcons();
        }
    }
}

async function silentPullRefresh(clean = false) {
    const sheetId = state.sheetId || getSheetIdFromUrl(state.scriptUrl);
    if (!sheetId) return;

    try {
        console.log("SILENT PULL: Starting initial data fetch...");
        // Show silent indicator
        updateSyncStatusUI('syncing', false);

        const response = await fetch(`${LICENSE_API_URL}?action=pull&sheet_id=${sheetId}&t=${Date.now()}`);
        const data = await response.json();

        if ((data.status === 'success' || data.patients) && (data.patients || data.appointments)) {
            // [NEW] AUTHORITATIVE RECONCILIATION: 
            // If it's a 'pull' action (full data), we treat the server as the MASTER.
            // Items missing from the server pull that are OLD (not just created locally) must be PURGED.
            const reconcileAuthoritative = (localList, serverList, cat) => {
                if (clean && cat === 'treatments' && (!serverList || serverList.length === 0)) {
                    console.warn("DEBUG: Server response for TREATMENTS is empty or missing!");
                }
                const serverIds = new Set((serverList || []).map(s => String(s.id)));
                const deletedList = state.deletedIds[cat] || [];

                return (localList || []).filter(item => {
                    const id = String(item.id);
                    // 1. [CRITICAL] Ignore if in Recent Deletes (prevents read-replica resurrection)
                    if (window._recentDeletes.has(id)) return false;

                    // 2. Always keep if it's in the server's list
                    if (serverIds.has(id)) return true;
                    // 3. Keep if it's in the local deletion queue (handled by cleanup later)
                    if (deletedList.includes(item.id)) return false;

                    // [NEW] CONFIG PROTECTION: If switching to a NEW empty year, 
                    // PROTECT config categories (packages, protocols, users, treatments) from being wiped.
                    const isConfigCat = ['packages', 'protocols', 'users', 'treatments'].includes(cat);
                    if (isConfigCat && serverIds.size === 0 && (localList || []).length > 0) {
                        return true; // Stay locally (Will sync/push to the new sheet later)
                    }

                    // 4. If missing from server, check if it's a "Local-Only" new item
                    const serverSyncStr = localStorage.getItem('erm_server_sync_time');
                    const lastServerTime = serverSyncStr ? new Date(serverSyncStr.replace(" ", "T")).getTime() : 0;
                    const itemTime = new Date(item.updatedAt || 0).getTime();

                    if (itemTime < lastServerTime - (5 * 60 * 1000)) {
                        console.log(`Reality Check: Purging Ghost ${cat} ${id} (Missing from Server)`);
                        return false;
                    }

                    // If CLEAN PULL (Login), we don't keep local-only data
                    if (clean && !isConfigCat) return false;

                    return true; // Keep local-only new data
                });
            };

            const cleanup = (list, cat) => {
                const deletedList = state.deletedIds[cat] || [];
                return (list || []).filter(item => !deletedList.includes(item.id) && !window._recentDeletes.has(String(item.id)));
            };

            // [NEW] NORMALIZE KEYS FROM SERVER (GAS returns lowercase keys)
            const normKeys = (list) => (list || []).map(item => {
                const norm = { ...item };
                if (item.updatedat && !item.updatedAt) norm.updatedAt = item.updatedat;
                if (item.islocked !== undefined && item.is_locked === undefined) norm.is_locked = item.islocked;
                if (item.patientid && !item.patientId) norm.patientId = item.patientid;
                return norm;
            });

            if (data.treatments) {
                console.log("DEBUG: Treatments received from server:", data.treatments.length, "items");
                data.treatments = normKeys(data.treatments);
            }
            if (data.packages) data.packages = normKeys(data.packages);
            if (data.protocols) data.protocols = normKeys(data.protocols);
            if (data.users) data.users = normKeys(data.users);

            // Process Authoritative Reconciliation (ONLY for keys present in the response)
            if (data.patients) state.patients = reconcileAuthoritative(state.patients, data.patients, 'patients');
            if (data.assessments) state.assessments = reconcileAuthoritative(state.assessments, data.assessments, 'assessments');
            if (data.appointments) state.appointments = reconcileAuthoritative(state.appointments, data.appointments, 'appointments');
            if (data.expenses) state.expenses = reconcileAuthoritative(state.expenses, data.expenses, 'expenses');
            if (data.packages) state.packages = reconcileAuthoritative(state.packages, data.packages, 'packages');
            if (data.treatments) state.treatments = reconcileAuthoritative(state.treatments, data.treatments, 'treatments');
            if (data.protocols) state.protocols = reconcileAuthoritative(state.protocols, data.protocols, 'protocols');
            if (data.users) state.users = reconcileAuthoritative(state.users, data.users, 'users');

            // Then Merge/Update with server data
            const mergeOverwrite = (localArr, serverArr) => {
                const localMap = new Map((localArr || []).map(l => [String(l.id), l]));
                (serverArr || []).forEach(s => localMap.set(String(s.id), s));
                return Array.from(localMap.values());
            };

            state.patients = cleanup(mergeOverwrite(state.patients, data.patients), 'patients');
            state.assessments = sanitizeAssessments(cleanup(mergeOverwrite(state.assessments, data.assessments), 'assessments'));
            state.appointments = deduplicateAppointments(cleanup(mergeOverwrite(state.appointments, data.appointments), 'appointments'));
            if (data.expenses) state.expenses = cleanup(mergeOverwrite(state.expenses, data.expenses), 'expenses');
            if (data.packages) state.packages = cleanup(mergeOverwrite(state.packages, data.packages), 'packages');
            if (data.treatments) state.treatments = cleanup(mergeOverwrite(state.treatments, data.treatments), 'treatments');
            if (data.protocols) state.protocols = cleanup(mergeOverwrite(state.protocols, data.protocols), 'protocols');
            if (data.users) {
                const rawUsers = cleanup(mergeOverwrite(state.users, data.users), 'users');
                // Deduplicate by username - keep most recent (latest updatedAt) per username
                const usernameMap = new Map();
                rawUsers.forEach(u => {
                    const existing = usernameMap.get(u.username);
                    if (!existing || (u.updatedAt || '') > (existing.updatedAt || '')) {
                        usernameMap.set(u.username, u);
                    }
                });
                state.users = Array.from(usernameMap.values());
                // [KEY FIX] Once users are synced from server, permanently disable admin/123 fallback
            }

            // [NEW] POST-SYNC UI UPDATE & DIAGNOSTICS
            if (clean) {
                if (!data.treatments || data.treatments.length === 0) {
                    console.warn("Server tidak mengirim data tindakan.");
                } else {
                    console.log(`Berhasil menarik ${data.treatments.length} data tindakan.`);
                }
            }

            // Auto-refresh view if user is currently on the Config/Treatment tab
            if (state.activeConfigTab === 'treatments') {
                const container = document.getElementById('treatment-list-container');
                if (container) { container.innerHTML = renderTreatmentTable(); renderIcons(); }
            } else if (state.activeConfigTab === 'packages') {
                const container = document.getElementById('package-list-container');
                if (container) { container.innerHTML = renderPackageTable(); renderIcons(); }
            }

            if (state.users.length > 0) {
                localStorage.setItem('erm_users_initialized', 'true');
            }
            if (data.config) state.configUpdated = true; // Flag for config update

            if (data.config && Array.isArray(data.config)) {
                data.config.forEach(c => {
                    const key = c.key ? c.key.toUpperCase() : '';
                    const val = c.value;
                    if (key === 'CLINIC_NAME') state.clinicInfo.name = val;
                    if (key === 'CLINIC_SUBNAME') state.clinicInfo.subname = val;
                    if (key === 'CLINIC_CITY') state.clinicInfo.city = val;
                    if (key === 'CLINIC_LOGO') state.clinicInfo.logoUrl = val;
                    if (key === 'CLINIC_THERAPIST') state.clinicInfo.therapist = val;
                    if (key === 'CLINIC_SIPF') state.clinicInfo.sipf = val;
                    if (key === 'CLINIC_ADDRESS') state.clinicInfo.address = val;
                    if (key === 'CLINIC_NPWP') state.clinicInfo.npwp = val;
                    if (key === 'CLINIC_PHONE') state.clinicInfo.phone = val;
                    if (key === 'CLINIC_MAPS') state.clinicInfo.mapsUrl = val;

                    if (key === 'TELEGRAM_TOKEN') state.notificationConfig.telegramToken = val;
                    if (key === 'TELEGRAM_CHAT_ID') state.notificationConfig.telegramChatId = val;
                    if (key === 'EMAIL_RECEIVER') state.notificationConfig.targetEmail = val;

                    if (key === 'CLINIC_INFO' || key === 'clinic_info') {
                        try {
                            const info = JSON.parse(val);
                            Object.assign(state.clinicInfo, info);
                        } catch (e) { }
                    }
                });
                localStorage.setItem('erm_clinic_config', JSON.stringify(state.clinicInfo));
                localStorage.setItem('erm_notif_config', JSON.stringify(state.notificationConfig));
            }

            // [NEW] SMART SEEDING: Jika Sheet baru (Config kosong) tapi kita punya data lokal
            const isSheetEmpty = (!data.config || data.config.length === 0) && (!data.patients || data.patients.length === 0);
            if (isSheetEmpty && state.user) {
                console.log("SMART SEEDING: New database detected! Auto-populating Clinic Config, Packages, and Users...");
                triggerInitialSeed();
            }

            if (clean) {
                state.deletedIds = { patients: [], assessments: [], appointments: [], users: [], expenses: [], packages: [], treatments: [], protocols: [] };
                localStorage.setItem('erm_deleted_ids', JSON.stringify(state.deletedIds));
            }

            await saveData();
            const finalSyncTime = data.server_time || new Date().toISOString();
            localStorage.setItem('erm_last_sync', finalSyncTime);
            window._firstSyncDone = true;
            if (state.currentView !== 'config') renderApp();
            updateSyncStatusUI('synced');
            console.log("SILENT PULL: Initial data synced successfully.");
        }
    } catch (e) {
        console.warn("Silent pull failed:", e);
        updateSyncStatusUI('error');
    }
}

// [NEW] Helper to seed a brand new sheet with current global settings
async function triggerInitialSeed() {
    try {
        const configToSeed = [
            { key: 'CLINIC_NAME', value: state.clinicInfo.name },
            { key: 'CLINIC_SUBNAME', value: state.clinicInfo.subname },
            { key: 'CLINIC_THERAPIST', value: state.clinicInfo.therapist },
            { key: 'CLINIC_SIPF', value: state.clinicInfo.sipf },
            { key: 'CLINIC_ADDRESS', value: state.clinicInfo.address },
            { key: 'CLINIC_NPWP', value: state.clinicInfo.npwp },
            { key: 'CLINIC_PHONE', value: state.clinicInfo.phone },
            { key: 'CLINIC_MAPS', value: state.clinicInfo.mapsUrl },
            { key: 'TELEGRAM_TOKEN', value: state.notificationConfig.telegramToken },
            { key: 'TELEGRAM_CHAT_ID', value: state.notificationConfig.telegramChatId },
            { key: 'EMAIL_RECEIVER', value: state.notificationConfig.targetEmail },
            { key: 'EMAIL_SENDER', value: state.notificationConfig.senderEmail },
            { key: 'BOOKING_ALIAS', value: state.bookingConfig.alias },
            { key: 'BOOKING_HOURS', value: state.bookingConfig.availableHours },
            { key: 'BOOKING_OFFDAYS', value: state.bookingConfig.offDays }
        ];

        const payload = {
            action: 'push',
            sheet_id: state.sheetId,
            config: configToSeed,
            packages: state.packages || [],
            protocols: state.protocols || [],
            users: state.users || []
        };

        console.log("Seeding payload:", payload);
        const response = await fetch(state.scriptUrl, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const res = await response.json();
        if (res.status === 'success') {
            showToast("Sheet baru berhasil di-inisialisasi otomatis!", "success");
        }
    } catch (e) {
        console.error("Smart Seeding Error:", e);
    }
}


// --- 5. AUTH & NAV ---
async function handleLogin(e) {
    e.preventDefault();
    // [FIX] Trim whitespace to prevent "wrong password" due to accidental spaces
    const u = document.getElementById('erm_user').value.trim();
    const p = document.getElementById('erm_pass').value.trim();

    // 1. Try to match against current user list (custom credentials from Google Sheet)
    let user = state.users.find(u2 =>
        String(u2.username || "").toLowerCase() === String(u || "").toLowerCase() &&
        String(u2.password || "") === String(p || "")
    );

    let hasCustomUsers = !!localStorage.getItem('erm_users_initialized');

    // 2. [CLOUD RECOVERY CHECK]
    // If local login fails AND we have no local users, check the Cloud first!
    // This allows custom credentials to work on brand new devices.
    if (!user && (state.users.length === 0 || !hasCustomUsers) && state.scriptUrl) {
        try {
            console.log("Login: Kredensial lokal tidak ditemukan, mencoba cek ke Cloud...");
            const errEl = document.getElementById('login-error');
            if (errEl) {
                errEl.classList.remove('hidden', 'text-red-600');
                errEl.classList.add('text-blue-600');
                errEl.innerHTML = `<i data-lucide="refresh-cw" class="animate-spin" width="16"></i> Mengecek kredensial ke Cloud...`;
                renderIcons();
            }

            const sheetId = getSheetIdFromUrl(state.scriptUrl) || state.sheetId;
            if (sheetId) {
                // Perform a silent pull to fetch latest users
                await silentPullRefresh(true);
                // Re-check after sync with strict string comparison
                user = state.users.find(u2 =>
                    String(u2.username || "").toLowerCase() === String(u || "").toLowerCase() &&
                    String(u2.password || "") === String(p || "")
                );
                hasCustomUsers = !!localStorage.getItem('erm_users_initialized');
            }
        } catch (e) {
            console.warn("Pre-login cloud check failed:", e);
        }
    }

    // 3. [EMERGENCY FALLBACK] admin/123
    // ONLY works if Sheet is really empty (no custom users found).
    if (!user && state.users.length === 0 && !hasCustomUsers) {
        const EMERGENCY_DEFAULTS = [
            { id: 'usr1', username: 'admin', password: '123', role: 'ADMIN', name: 'Administrator' },
            { id: 'usr2', username: 'fisio', password: '123', role: 'FISIO', name: 'Fisio' }
        ];
        user = EMERGENCY_DEFAULTS.find(d => d.username.toLowerCase() === u.toLowerCase() && d.password === p);
    }

    if (user) {
        state.user = user;

        // [STRICT SYNC ON LOGIN]: Block and wait for fresh data
        if (state.scriptUrl) {
            try {
                console.log("Login: Forcing full data pull from Google Sheets...");
                window._isBlockingSync = true;
                updateSyncStatusUI('syncing', true);
                await silentPullRefresh(true);
                window._isBlockingSync = false;

                const lastServerTime = localStorage.getItem('erm_server_sync_time');
                if (lastServerTime) {
                    state.serverTimeOffset = parseDateSafe(lastServerTime).getTime() - Date.now();
                }

                updateSyncStatusUI('success');
            } catch (err) {
                console.warn("Initial sync failed during login, using local data:", err);
                window._isBlockingSync = false;
                updateSyncStatusUI('error');
            }
        }

        navigate('dashboard');
        document.getElementById('login-error').classList.add('hidden');
        backgroundAutoSync();
    } else {
        const errEl = document.getElementById('login-error');
        errEl.classList.remove('hidden');
        errEl.innerHTML = `
            <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2"><i data-lucide="alert-circle" width="16"></i> Username atau Password Salah!</div>
                <button type="button" onclick="pullDataFromSheet()" class="text-[10px] text-blue-600 hover:underline text-left mt-1">
                    Password tidak dikenali? Klik di sini untuk Sinkronisasi Kredensial dari Cloud/Server
                </button>
            </div>
        `;
        renderIcons();
    }
}

/** Auto-fill form with the default admin credentials */
function autoFillAdmin() {
    document.getElementById('erm_user').value = 'admin';
    document.getElementById('erm_pass').value = '123';
    // Show a brief visual feedback
    const btn = event.currentTarget;
    btn.innerHTML = '<i data-lucide="check-circle" width="14"></i> Terisi! Klik "Masuk Aplikasi"';
    btn.classList.add('text-green-600', 'border-green-300', 'bg-green-50');
    lucide?.createIcons();
}

/** Toggle show/hide password */
function togglePasswordVisibility() {
    const pwInput = document.getElementById('erm_pass');
    const icon = document.getElementById('pw-eye-icon');
    if (pwInput.type === 'password') {
        pwInput.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        pwInput.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
    }
    lucide?.createIcons();
}

// Track first sync of the session
if (window._firstSyncDone === undefined) window._firstSyncDone = false;

// [NEW] Sync Countdown Timer Global
let _syncPendingTimer = null;
let _syncCountdownInterval = null;

async function scheduleSync(seconds = 3) {
    // Clear any existing timer
    if (_syncPendingTimer) clearTimeout(_syncPendingTimer);
    if (_syncCountdownInterval) clearInterval(_syncCountdownInterval);

    let remaining = seconds;
    updateSyncStatusUI('pending', false, remaining);

    _syncCountdownInterval = setInterval(() => {
        remaining--;
        if (remaining >= 0) {
            updateSyncStatusUI('pending', false, remaining);
        }
        if (remaining <= 0) {
            clearInterval(_syncCountdownInterval);
        }
    }, 1000);

    _syncPendingTimer = setTimeout(() => {
        backgroundAutoSync();
    }, seconds * 1000);
}

/**
 * [NEW] Core Sync Handler: Fetch archives and initial data
 */
async function handleInitialSync() {
    console.log("INITIAL SYNC: Fetching archives and checking license...");
    try {
        // [OPTIMIZED]: Redundant checkLicense removed. Done in DOMContentLoaded.

        // 2. Render Year Picker with fresh data
        if (typeof renderYearPicker === 'function') renderYearPicker();

        // 3. Trigger first pull if needed
        if (!window._firstSyncDone) {
            console.log("INITIAL SYNC: Forcing clean pull for fresh session...");
            await silentPullRefresh(true); // Mandatory clean pull
            window._firstSyncDone = true;
        }
    } catch (err) {
        console.error("InitialSync Error:", err);
    }
}

async function backgroundAutoSync() {
    if (window._syncRunning) return;

    if (!window._firstSyncDone && state.licenseKey) {
        await handleInitialSync();
    }
    if (state._syncing) return;

    // [NEW LOGIC] backgroundAutoSync is now always allowed so that PUSH operations 
    // can happen in the background. UI refreshing (renderApp) however is still 
    // gated by isSafeToRefresh() to prevent disrupting the user.
    // REMOVED: if (!isSafeToAutoSync()) return;

    // Use state.sheetId as fallback if scriptUrl is partial or missing
    const sheetId = getSheetIdFromUrl(state.scriptUrl) || state.sheetId;

    if (!sheetId) {
        console.warn("BackgroundAutoSync: Aborted - No valid Sheet ID (scriptUrl/sheetId missing).");
        updateSyncStatusUI(false); // Reset UI from 'pending' if it was set
        return;
    }

    state._syncing = true;

    try {
        const isFirstSync = !window._firstSyncDone;
        updateSyncStatusUI('syncing', false); // No blocking overlay for autoSync by default

        // === STEP 1: PUSH DULU (kalau ada data pending) ===
        // Pastikan perubahan lokal sudah masuk ke sheet SEBELUM kita pull.
        // Ini mencegah pull menimpa data yang baru diedit user.
        const hasPending = checkDataDirty();
        let pushedDeletes = null;
        if (hasPending) {
            console.log("AutoSync: Pending data detected, pushing to sheet...");
            pushedDeletes = await _pushDelta(sheetId);
        }

        // === STEP 2: PULL DARI SHEET ===
        let action = 'delta_pull';
        let lastSyncStr = '';

        if (!window._firstSyncDone) {
            console.log("Starting initial session sync (Hybrid Mode)...");
        }

        const isLocalEmpty = (!state.patients || state.patients.length === 0) ||
            (!state.appointments || state.appointments.length === 0) ||
            (!state.users || state.users.length === 0);
        if (isLocalEmpty) {
            console.log("Empty local state detected. Forcing Full Pull...");
            updateSyncStatusUI('syncing', false); // Silent sync as requested
            action = 'pull';
        } else {
            // Find newest updatedAt
            let maxTime = 0;

            const checkTimes = (arr) => {
                if (!arr) return;
                arr.forEach(item => {
                    if (item.updatedAt || item.updated_at) {
                        const tText = String(item.updatedAt || item.updated_at).replace(" ", "T");
                        const t = new Date(tText).getTime();
                        if (t && t > maxTime) maxTime = t;
                    }
                });
            };

            checkTimes(state.patients);
            checkTimes(state.assessments);
            checkTimes(state.appointments);
            checkTimes(state.protocols);
            checkTimes(state.expenses);
            checkTimes(state.packages);
            checkTimes(state.treatments);

            if (maxTime > 0) {
                // Formatting back to GAS compatible string
                lastSyncStr = new Date(maxTime).toISOString();
            } else {
                action = 'pull'; // Fallback
            }
        }

        // Get last sync from server time (prefer server-synced time over local)
        let lastSyncVal = localStorage.getItem('erm_server_sync_time') || lastSyncStr;

        // BUFFER: Subtract 1 minute to overlap and catch items from slightly different clocks
        if (lastSyncVal && action === 'delta_pull') {
            let bufferDate = new Date(lastSyncVal.replace(" ", "T"));
            bufferDate.setMinutes(bufferDate.getMinutes() - 1);
            lastSyncVal = bufferDate.toISOString();
        }

        const url = `${LICENSE_API_URL}?action=${action}&sheet_id=${sheetId}&last_sync=${lastSyncVal}&limit=2000&t=${Date.now()}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.patients && data.assessments) {
            // Proactive Cleanup: Ensure any locally pending deletes are removed from current state BEFORE merging
            const cleanup = (list, deletedList) => (list || []).filter(item => {
                const isDeleted = (deletedList || []).some(delId => String(delId) === String(item.id));
                return !isDeleted;
            });
            state.patients = cleanup(state.patients, state.deletedIds.patients);
            state.assessments = cleanup(state.assessments, state.deletedIds.assessments);
            state.appointments = cleanup(state.appointments, state.deletedIds.appointments);
            state.expenses = cleanup(state.expenses, state.deletedIds.expenses);
            state.packages = cleanup(state.packages, state.deletedIds.packages);
            state.protocols = cleanup(state.protocols, state.deletedIds.protocols || []);
            state.treatments = cleanup(state.treatments, state.deletedIds.treatments);

            // [NEW] Deep Cleaning: Remove empty/invalid records that might cause empty rows in Patient Master
            state.patients = state.patients.filter(p => p && p.id && p.name && p.name.trim() !== "");

            let uiNeedsRefresh = false;

            // [FIXED] Process Config from Server (Identity & Branding)
            if (data.config && Array.isArray(data.config) && state.currentView !== 'config') {
                data.config.forEach(c => {
                    const k = c.key ? c.key.toUpperCase() : '';
                    const v = c.value;
                    if (!v) return;

                    if (k === 'CLINIC_NAME') state.clinicInfo.name = v;
                    if (k === 'CLINIC_SUBNAME') state.clinicInfo.subname = v;
                    if (k === 'CLINIC_CITY') state.clinicInfo.city = v;
                    if (k === 'CLINIC_LOGO') state.clinicInfo.logoUrl = v;
                    if (k === 'CLINIC_THERAPIST') state.clinicInfo.therapist = v;
                    if (k === 'CLINIC_SIPF') state.clinicInfo.sipf = v;
                    if (k === 'CLINIC_ADDRESS') state.clinicInfo.address = v;
                    if (k === 'CLINIC_NPWP') state.clinicInfo.npwp = v;
                    if (k === 'CLINIC_PHONE') state.clinicInfo.phone = v;
                    if (k === 'CLINIC_MAPS') state.clinicInfo.mapsUrl = v;

                    // Booking
                    if (k === 'BOOKING_ALIAS') state.bookingConfig.alias = v;
                    if (k === 'BOOKING_HOURS') state.bookingConfig.availableHours = v;
                    if (k === 'BOOKING_OFFDAYS') state.bookingConfig.offDays = v;
                    if (k === 'BOOKING_HOLIDAYS') state.bookingConfig.customHolidays = v;

                    // Notif
                    if (k === 'TG_CHAT_ID') state.notificationConfig.telegramChatId = v;
                    if (k === 'TG_TOKEN') state.notificationConfig.telegramToken = v;
                    if (k === 'EMAIL_TARGET') state.notificationConfig.targetEmail = v;
                    if (k === 'EMAIL_SENDER') state.notificationConfig.senderEmail = v;
                    if (k === 'MSG_CONFIRM') state.notificationConfig.msgConfirm = v;
                    if (k === 'MSG_REJECT') state.notificationConfig.msgReject = v;
                    if (k === 'MSG_REMINDER') state.notificationConfig.msgReminder = v;
                });
                uiNeedsRefresh = true;
            }

            if (action === 'pull') {
                state.patients = cleanup(data.patients, state.deletedIds.patients);
                state.assessments = sanitizeAssessments(cleanup(data.assessments, state.deletedIds.assessments));
                state.appointments = cleanup(data.appointments || [], state.deletedIds.appointments);
                state.expenses = cleanup(data.expenses || [], state.deletedIds.expenses);
                state.packages = cleanup(data.packages || [], state.deletedIds.packages);
                state.protocols = cleanup(data.protocols || [], state.deletedIds.protocols || []);
                state.treatments = cleanup(data.treatments || [], state.deletedIds.treatments);
                state.users = cleanup(data.users || [], state.deletedIds.users);

                // Clear deletion queue on successful Full Pull - ONLY IF WE ARE SURE SERVER IS MASTER
                // For now, let's NOT wipe it here to be safe, syncDelta will clear it when GAS acknowledges push.
                // state.deletedIds = { patients: [], assessments: [], appointments: [], expenses: [], packages: [], protocols: [] };
                window._firstSyncDone = true;
                applyBranding(); // Apply updated clinic info
                if (isSafeToRefresh()) renderApp();
            } else {
                // Merge Data by ID
                const mergeArr = (localArr, incomingArr, category) => {
                    if (!incomingArr || incomingArr.length === 0) return localArr;
                    incomingArr.forEach(inc => {
                        // FIX: Logic Filter (Ignore if ID is already in local deletion queue)
                        const isLocallyDeleted = (state.deletedIds[category] || []).some(delId => String(delId) === String(inc.id));
                        if (isLocallyDeleted) {
                            console.log(`Sync Skip: ${category} ${inc.id} is marked for deletion locally.`);
                            return;
                        }

                        const idx = localArr.findIndex(loc => loc.id === inc.id);
                        if (idx !== -1) {
                            // Bandingkan timestamp: siapa yang lebih baru menang
                            const localTime = new Date(localArr[idx].updatedAt || 0).getTime();
                            const serverTime = new Date(inc.updatedAt || 0).getTime();

                            if (serverTime > localTime) {
                                // JANGAN timpa jika lokal baru saja di ACC (PENDING -> CONFIRMED)
                                // Kita beri toleransi 2 menit agar server sempat update
                                const isRecentAcc = localArr[idx].status === 'CONFIRMED' && (Date.now() - localTime < 120000);
                                
                                if (isRecentAcc && inc.status === 'PENDING') {
                                    console.log("Sync Check: Mendeteksi data lama dari server untuk booking yang sudah di-ACC. Diabaikan.");
                                    return;
                                }

                                localArr[idx] = inc;
                                uiNeedsRefresh = true;
                                if (category === 'appointments' && inc.status === 'PENDING') {
                                    const isTrulyNew = !state.appointments.some(a => a.id === inc.id);
                                    if (isTrulyNew) hasNewBooking = true;
                                }
                            } else if (serverTime === localTime) {
                                // Timestamp sama, cek konten: mungkin status berubah (misal PENDING → CONFIRMED)
                                const locStr = JSON.stringify({ ...localArr[idx], updatedAt: null });
                                const incStr = JSON.stringify({ ...inc, updatedAt: null });
                                if (locStr !== incStr) {
                                    localArr[idx] = inc;
                                    uiNeedsRefresh = true;
                                    if (category === 'appointments' && inc.status === 'PENDING') hasNewBooking = true;
                                }
                            }
                            // server lebih lama → SKIP, lokal sudah lebih baru (push sudah dilakukan di Step 1)
                        } else {
                            // Item baru dari server (misal booking dari luar)
                            localArr.push(inc);
                            uiNeedsRefresh = true;
                            if (category === 'appointments' && inc.status === 'PENDING') hasNewBooking = true;
                        }
                    });
                    return localArr;
                };

                state.patients = mergeArr(state.patients || [], data.patients, 'patients');
                state.assessments = sanitizeAssessments(mergeArr(state.assessments || [], data.assessments, 'assessments'));
                state.appointments = deduplicateAppointments(mergeArr(state.appointments || [], data.appointments, 'appointments'));
                if (data.expenses) state.expenses = mergeArr(state.expenses || [], data.expenses, 'expenses');
                if (data.packages) state.packages = mergeArr(state.packages || [], data.packages, 'packages');
                if (data.treatments) state.treatments = mergeArr(state.treatments || [], data.treatments, 'treatments');
                if (data.protocols) state.protocols = mergeArr(state.protocols || [], data.protocols, 'protocols');
                if (data.users) state.users = mergeArr(state.users || [], data.users, 'users');
            }

            // After any successful data fetch (Full or Delta)
            if (!window._firstSyncDone) {
                window._firstSyncDone = true;
                if (isSafeToRefresh()) renderApp(); // Re-render to hide loading if necessary
            }

            // Sync Config if available
            if (data.config && Array.isArray(data.config)) {
                data.config.forEach(c => {
                    if (c.key === 'CLINIC_NAME') state.clinicInfo.name = c.value;
                    if (c.key === 'CLINIC_SUBNAME') state.clinicInfo.subname = c.value;
                    if (c.key === 'CLINIC_THERAPIST') state.clinicInfo.therapist = c.value;
                    if (c.key === 'CLINIC_SIPF') state.clinicInfo.sipf = c.value;
                    if (c.key === 'CLINIC_ADDRESS') state.clinicInfo.address = c.value;
                    if (c.key === 'CLINIC_NPWP') state.clinicInfo.npwp = c.value;
                    if (c.key === 'CLINIC_PHONE') state.clinicInfo.phone = c.value;
                    if (c.key === 'TELEGRAM_TOKEN') state.notificationConfig.telegramToken = c.value;
                    if (c.key === 'TELEGRAM_CHAT_ID') state.notificationConfig.telegramChatId = c.value;
                    if (c.key === 'EMAIL_RECEIVER') state.notificationConfig.targetEmail = c.value;
                    if (c.key === 'EMAIL_SENDER') state.notificationConfig.senderEmail = c.value;
                    if (c.key === 'MSG_CONFIRM_TEMPLATE') state.notificationConfig.msgConfirm = c.value;
                    if (c.key === 'MSG_REJECT_TEMPLATE') state.notificationConfig.msgReject = c.value;
                    if (c.key === 'MSG_REMINDER_TEMPLATE') state.notificationConfig.msgReminder = c.value;
                });
                localStorage.setItem('erm_clinic_config', JSON.stringify(state.clinicInfo));
                localStorage.setItem('erm_notif_config', JSON.stringify(state.notificationConfig));
                applyBranding();
            }

            // Apply Hard Limit for Local Storage (Max 2000 per table)
            const LOCAL_LIMIT = 2000;
            if (state.patients.length > LOCAL_LIMIT) state.patients = state.patients.slice(-LOCAL_LIMIT);
            if (state.assessments.length > LOCAL_LIMIT) state.assessments = state.assessments.slice(-LOCAL_LIMIT);
            if (state.appointments.length > LOCAL_LIMIT) state.appointments = state.appointments.slice(-LOCAL_LIMIT);

            saveData();

            // Only show toast if something was actually pulled manually or first time
            if (action === 'pull' && (
                (data.patients && data.patients.length > 0) ||
                (data.assessments && data.assessments.length > 0) ||
                (data.appointments && data.appointments.length > 0) ||
                (data.protocols && data.protocols.length > 0))) {
                showToast('Sync Selesai ✅', 'success');
            }

            // Save timestamps for future syncs & UI dirty checking
            if (data.server_time) {
                localStorage.setItem('erm_server_sync_time', String(data.server_time));
                state.serverTimeOffset = parseDateSafe(data.server_time).getTime() - Date.now();
                console.log("Server Clock Offset Sync:", state.serverTimeOffset, "ms");
            }
            localStorage.setItem('erm_last_sync', data.server_time || getServerTimeISO());

            // [NEW] Clear first activation sync flag once pull is done
            // MOVED: The removal is now handled in renderApp to ensure the UI is actually seen after login
            /*
            if (localStorage.getItem('erm_first_activation_sync')) {
                localStorage.removeItem('erm_first_activation_sync');
                console.log("Initial Activation Sync Finished.");
            }
            */

            // Option 1: Auto-Refresh UI for Schedule, Dashboard, or Kasir
            const currentPendingCount = (state.appointments || []).filter(a => a.status === 'PENDING').length;
            if (uiNeedsRefresh) {
                if (hasNewBooking || currentPendingCount > (window.lastBookingCount || 0)) {
                    showSyncBanner(true);
                    updateSidebarBadges();
                }
                window.lastBookingCount = currentPendingCount;
                if (!hasNewBooking && !showSyncBanner && isSafeToRefresh()) {
                    // SILENT AUTO-REFRESH for generic data: 
                    // Only if no modal is open and not in config view (to avoid resetting input fields)
                    if (isSafeToRefresh()) {
                        console.log("Silent Auto-Refresh (Optimized)...");
                        // We use a flag to tell renderApp not to use fade-in animations for background refreshes
                        window._isBackgroundRefresh = true;
                        document.body.classList.add('is-bg-refresh');
                        renderApp();
                        document.body.classList.remove('is-bg-refresh');
                        window._isBackgroundRefresh = false;
                    }
                }
            }

            // [NEW] SAFE DELETION QUEUE CLEANUP:
            // Only clear deletedIds that were 1) successfully pushed AND 2) NOT returned in this PULL cycle.
            // This prevents "Ghost Data" from re-appearing due to GAS latency.
            if (pushedDeletes) {
                Object.keys(pushedDeletes).forEach(cat => {
                    const successfullyPushed = pushedDeletes[cat] || [];
                    const incomingItems = data[cat] || [];

                    state.deletedIds[cat] = (state.deletedIds[cat] || []).filter(pendingId => {
                        // Keep if it wasn't pushed in this cycle
                        if (!successfullyPushed.includes(pendingId)) return true;

                        // If it WAS pushed, check if it's STILL in the incoming pull response
                        const isStillPresentOnServer = incomingItems.some(item => String(item.id) === String(pendingId));
                        if (isStillPresentOnServer) {
                            console.log(`Sync Latency: ${cat} ${pendingId} still on server after push. Keeping in deletion queue.`);
                            return true;
                        }

                        // If pushed and absent from server -> SAFE TO CLEAR
                        return false;
                    });
                });
            }
        }
    } catch (error) {
        console.error("Background Sync Failed:", error);

        // SYNC GAP FALLBACK: Don't trap the user forever if sync fails (e.g. Offline)
        if (window._firstSyncDone === false) {
            showToast('Gagal sinkronisasi awal. Menggunakan data cache.', 'error');
            window._firstSyncDone = true; // Allow rendering existing cache so user isn't stuck
            renderApp();
        }
    } finally {
        state._syncing = false;
        updateSyncStatusUI(false);
    }
}

/**
 * Cloud-Authoritative Schedule Refresh
 * Overwrites local appointments with fresh data from Google Sheets.
 */
async function refreshScheduleFromServer() {
    if (!state.scriptUrl || state._syncing) return;

    console.log("Cloud-Authoritative Refresh: Schedule");
    state._syncing = true;
    updateSyncStatusUI('syncing', false); // Silent refresh

    try {
        const url = `${LICENSE_API_URL}?action=pull_schedule&sheet_id=${state.sheetId}&t=${Date.now()}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'success' && data.appointments) {
            console.log(`Cloud Refresh Success: Pulled ${data.appointments.length} appointments.`);

            // OVERWRITE: Ensure local state reflects the absolute truth from the Sheet
            state.appointments = data.appointments;

            // Clean up deleted IDs tracking for appointments since we just synced total
            state.deletedIds.appointments = [];

            saveData();
            renderApp();
        }
    } catch (e) {
        console.error("Schedule Cloud Refresh Failed:", e);
    } finally {
        state._syncing = false;
        updateSyncStatusUI(false);
    }
}

function handleLogout() { state.user = null; state.currentView = 'login'; window._sidebarInitialized = false; renderApp(); }

function navigate(view) {
    if ((view === 'config' || view === 'analytics') && state.user.role !== 'ADMIN') {
        alert("Akses Ditolak! Menu ini khusus Administrator.");
        return;
    }

    if (view === 'analytics') {
        state.dashboardTab = 'analytics';
        state.currentView = 'dashboard';
    } else {
        if (view === 'dashboard') state.dashboardTab = 'main';
        state.currentView = view;
    }

    if (state.currentView !== 'assessments') state.filterPatientId = null;
    if (state.currentView === 'kasir') state.kasirTab = state.kasirTab || 'antrian';

    renderApp();
}


// Only close sidebar on smaller screens (mobile/tablet). On desktop, sidebar stays open during nav.
function closeSidebarOnMobile() {
    if (window.innerWidth < 1024) {
        const sidebar = document.getElementById('app-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const mainWrapper = document.getElementById('main-wrapper');
        if (sidebar) sidebar.classList.add('-translate-x-full');
        if (overlay) overlay.classList.add('hidden');
        if (mainWrapper) mainWrapper.style.marginLeft = '';
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const mainWrapper = document.getElementById('main-wrapper');
    const isCollapsed = sidebar.classList.contains('-translate-x-full');
    const isDesktop = window.innerWidth >= 1024;

    if (isCollapsed) {
        sidebar.classList.remove('-translate-x-full');
        if (isDesktop) {
            // Desktop: push content right, no overlay
            mainWrapper.style.marginLeft = '256px';
            overlay.classList.add('hidden');
        } else {
            // Mobile/Tablet: show overlay (darken background)
            overlay.classList.remove('hidden');
            mainWrapper.style.marginLeft = '';
        }
        localStorage.setItem('erm_sidebar_open', '1');
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        mainWrapper.style.marginLeft = '';
        localStorage.setItem('erm_sidebar_open', '0');
    }
}

function initSidebarState() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const mainWrapper = document.getElementById('main-wrapper');
    if (!sidebar || !overlay || !mainWrapper) return;

    const savedState = localStorage.getItem('erm_sidebar_open');
    const isDesktop = window.innerWidth >= 1024;
    // Default: open on desktop, closed on mobile
    const shouldOpen = savedState !== null ? savedState === '1' : isDesktop;

    if (shouldOpen) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.add('hidden');
        if (isDesktop) {
            mainWrapper.style.marginLeft = '256px';
        } else {
            mainWrapper.style.marginLeft = '';
            overlay.classList.remove('hidden');
        }
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        mainWrapper.style.marginLeft = '';
    }
}

function openModal(html) {
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = html;
    document.getElementById('modal-container').classList.remove('hidden');
    lucide.createIcons();
}

function closeModal() {
    const modalContent = document.getElementById('modal-content');
    modalContent.classList.remove('sm:max-w-4xl', 'sm:max-w-5xl', 'sm:max-w-6xl');
    modalContent.classList.add('sm:max-w-lg');
    document.getElementById('modal-container').classList.add('hidden');
    modalContent.innerHTML = '';
    hmsSession = null; // Clean up session
}

// --- HMS (HUMAN MOVEMENT SYSTEM) WIZARD - Multi-Checkbox + Auto-Tally ---

// Session state: stores all checked observations across all protocols
let hmsSession = {
    selectedObs: [],  // array of { protocol, text, diagnosis, type, isCorrection: bool }
    tally: {},        // { diagnosisName: score }
    hiddenProtocols: [],
    addedProtocols: [],
    activeTab: 'neuro' // 'neuro' or 'msi'
};

function switchHMSTab(tab) {
    if (!hmsSession) hmsSession = { selectedObs: [], tally: {}, hiddenProtocols: [], addedProtocols: [], activeTab: tab, openAccordions: [] };
    hmsSession.activeTab = tab;
    openHMSWizard();
}

function openHMSWizard(preserveScroll = false) {
    try {
        const scrollContainer = document.getElementById('hms-protocol-list');
        const oldScrollTop = scrollContainer ? scrollContainer.parentElement.scrollTop : 0;

        const rawDiagnosis = window.tempFormData.diagnosis || '';
        const icfMatch = (window.ICF_TEMPLATES && window.ICF_TEMPLATES[rawDiagnosis]) || { category: 'Umum' };
        const category = icfMatch.category || 'Umum';

        // Initialize session if it doesn't exist (clean open)
        if (!hmsSession || !hmsSession.activeTab) {
            hmsSession = { selectedObs: [], tally: {}, hiddenProtocols: [], addedProtocols: [], activeTab: 'neuro', openAccordions: [] };

            // Hydrate from saved notes (legacy support + new format)
            if (window.tempFormData.hms_notes) {
                try {
                    let saved = window.tempFormData.hms_notes;
                    if (typeof saved === 'string') {
                        saved = JSON.parse(saved);
                    }
                    if (saved && saved.observations) {
                        hmsSession.selectedObs = saved.observations.map(o => {
                            const type = o.type || 'neuro';
                            const source = type === 'msi' ? (window.MSI_DATA || {}) : (window.HMS_PROTOCOLS || {});
                            const protocol = source[o.protocol];
                            const diagnosis = protocol ? ((protocol.observations || []).find(obs => obs.text === o.text)?.diagnosis || 'Unknown') : 'Unknown';
                            return { protocol: o.protocol, text: o.text, diagnosis, type, isCorrection: !!o.isCorrection };
                        });
                        hmsSession.activeTab = saved.activeTab || 'neuro';
                        updateHMSTally();
                    }
                } catch (e) { console.error("Error hydrating HMS:", e); }
            }
        }

        const isMSI = (hmsSession.activeTab === 'msi');
        const dataSource = isMSI ? (window.MSI_DATA || {}) : (window.HMS_PROTOCOLS || {});
        const allProtocols = Object.keys(dataSource);

        // Map ICF region to MSI internal regions
        const msiRegionMap = {
            'Kepala & Leher': ['cervical'],
            'Bahu': ['shoulder', 'scapula'],
            'Siku & Tangan': ['elbow', 'wrist', 'hand'],
            'Pinggang (Lumbar)': ['lumbar'],
            'Punggung (Thorax)': ['thoracic'],
            'Panggul (Hip)': ['hip'],
            'Lutut': ['knee'],
            'Ankle & Kaki': ['foot', 'ankle'],
            'Tulang Belakang': ['cervical', 'lumbar', 'thoracic']
        };

        // Filter Logic
        let filteredProtocols = allProtocols;
        const icfCatLower = category.toLowerCase();
        const icfRegion = icfMatch.region;

        if (isMSI) {
            // MSI filtering (Structural) based on region + clinical linkages
            let targetRegions = [];

            if (icfMatch && icfMatch.msi_linkage) {
                targetRegions = icfMatch.msi_linkage;
            } else if (icfRegion && msiRegionMap[icfRegion]) {
                targetRegions = msiRegionMap[icfRegion];
            }

            if (targetRegions.length > 0) {
                filteredProtocols = allProtocols.filter(pKey => {
                    const p = dataSource[pKey];
                    return !p || !p.regions || p.regions.some(r =>
                        targetRegions.map(tr => tr.toLowerCase()).includes(r.toLowerCase())
                    );
                });
            }
        } else {
            // Neuro filtering (Functional)
            const categoryDomainMap = [
                { key: 'muskulo', domains: ['muskuloskeletal', 'sport'] },
                { key: 'sport', domains: ['muskuloskeletal', 'sport'] },
                { key: 'neuro', domains: ['neuro'] },
                { key: 'geriatri', domains: ['neuro', 'geriatri'] },
                { key: 'pediatri', domains: ['neuro', 'pediatri'] },
                { key: 'kardio', domains: ['kardio'] },
            ];
            let activeDomains = ['semua'];
            let matchedAny = false;
            for (const { key, domains } of categoryDomainMap) {
                if (icfCatLower.includes(key)) { activeDomains = [...activeDomains, ...domains]; matchedAny = true; }
            }
            if (matchedAny) {
                filteredProtocols = allProtocols.filter(pKey => {
                    const p = dataSource[pKey];
                    return !p || !p.regions || p.regions.length === 0 || p.regions.some(r => activeDomains.includes(r));
                });
            }
        }

        // Add protocol logic
        (hmsSession.addedProtocols || []).forEach(pKey => {
            if (dataSource[pKey] && !filteredProtocols.includes(pKey)) filteredProtocols.push(pKey);
        });
        filteredProtocols = filteredProtocols.filter(pKey => !(hmsSession.hiddenProtocols || []).includes(pKey));

        const accordionItems = filteredProtocols.map((pKey, idx) => {
            const p = dataSource[pKey];
            if (!p) return '';
            const safeKey = pKey.replace(/[^a-zA-Z0-9]/g, '_');
            const isOpen = (hmsSession.openAccordions || []).includes(safeKey);
            const countInProtocol = (hmsSession.selectedObs || []).filter(o => o.protocol === pKey && o.type === hmsSession.activeTab).length;
            const badgeClass = countInProtocol > 0 ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500";

            return `
            <div class="border-2 border-slate-100 rounded-2xl overflow-hidden group hms-acc-container mb-3" id="acc-${safeKey}">
                <div class="relative w-full flex items-center justify-between px-5 py-3 text-left bg-white hover:bg-slate-50 transition-colors">
                    <button onclick="toggleHMSAccordion('${safeKey}')" class="flex-1 flex items-center gap-3">
                        <span class="w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ${badgeClass} hms-acc-badge-${safeKey}">${countInProtocol > 0 ? countInProtocol : idx + 1}</span>
                        <div class="text-left">
                            <p class="font-bold text-slate-800 text-sm">${pKey}</p>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tight">${p.category || 'Assessment'}</p>
                        </div>
                    </button>
                    <div class="flex items-center gap-1">
                        <button type="button" onclick="hideHMSProtocol('${pKey.replace(/'/g, "\\'")}')" class="p-2 text-slate-300 hover:text-red-500 rounded-lg transition-colors"><i data-lucide="eye-off" width="16"></i></button>
                        <button type="button" onclick="toggleHMSAccordion('${safeKey}')" class="p-2 text-slate-400 ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform hms-chevron-${safeKey}"><i data-lucide="chevron-down" width="18"></i></button>
                    </div>
                </div>
                <div class="hms-acc-body-${safeKey} ${isOpen ? '' : 'hidden'} px-5 pb-5 bg-slate-50 border-t border-slate-100">
                    <div class="mt-4 mb-4 bg-white/60 border border-slate-200 rounded-xl p-3">
                        <p class="text-[9px] font-black text-slate-400 uppercase mb-2">Ideal/Focus Goal</p>
                        <ul class="space-y-1">
                            ${(p.ideal_criteria || []).map(c => `<li class="text-[11px] text-slate-600 flex gap-2"><span>•</span><span>${c}</span></li>`).join('')}
                        </ul>
                    </div>
                    <div class="space-y-2">
                        ${(p.observations || []).map((obs, obsIdx) => {
                const isChecked = (hmsSession.selectedObs || []).some(o => o.protocol === pKey && o.text === obs.text && o.type === hmsSession.activeTab);
                const isCorrection = (hmsSession.selectedObs || []).find(o => o.protocol === pKey && o.text === obs.text && o.type === hmsSession.activeTab)?.isCorrection;
                const obsId = `hms_${safeKey}_${obsIdx}`;
                return `
                            <div class="group/row">
                                <label for="${obsId}" class="flex items-start gap-3 p-3 rounded-xl border-2 ${isChecked ? 'border-emerald-400 bg-emerald-50' : 'bg-white border-slate-100'} hover:border-emerald-300 transition-all cursor-pointer">
                                    <input type="checkbox" id="${obsId}" ${isChecked ? 'checked' : ''} 
                                        onchange="toggleHMSObservation(this)" 
                                        data-protocol="${pKey}" data-obs-text="${obs.text}" data-diagnosis="${obs.diagnosis}" data-safe-key="${safeKey}"
                                        class="mt-1 w-4 h-4 accent-emerald-500 rounded border-slate-300">
                                    <div class="flex-1">
                                        <span class="text-sm font-semibold text-slate-700 block line-clamp-2">${obs.text}</span>
                                        <span class="text-[10px] text-slate-400 font-bold uppercase mt-0.5">→ ${obs.diagnosis}</span>
                                    </div>
                                    ${(isMSI && isChecked) ? `
                                    <div class="bg-white px-2 py-1 rounded-lg border border-emerald-100 flex items-center gap-2 shadow-sm animate-fade-in">
                                        <span class="text-[10px] font-black text-emerald-600 uppercase">Corrected?</span>
                                        <input type="checkbox" ${isCorrection ? 'checked' : ''} 
                                            onchange="toggleMSICorrection(this)" 
                                            data-protocol="${pKey}" data-obs-text="${obs.text}"
                                            class="w-4 h-4 accent-blue-500">
                                    </div>` : ''}
                                </label>
                            </div>`;
            }).join('')}
                    </div>
                </div>
            </div>`;
        }).join('');

        const content = `
        <div class="bg-white flex flex-col h-full overflow-hidden rounded-2xl shadow-2xl relative">
            <div class="absolute top-2 right-16 text-[9px] text-slate-300 font-bold opacity-30 select-none">HMS-WIZARD-V1.5</div>
            <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                <div>
                    <h3 class="text-xl font-black text-slate-800 flex items-center gap-2">
                        <i data-lucide="activity" class="text-emerald-500"></i> HMS Wizard
                    </h3>
                    <p class="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Assessment Multi-Domain & Path of Least Resistance</p>
                </div>
                <button onclick="closeModal()" class="w-10 h-10 flex items-center justify-center hover:bg-slate-200 rounded-full transition-colors"><i data-lucide="x" width="20"></i></button>
            </div>

            <!-- TABS HEADER -->
            <div class="flex border-b border-slate-100 px-6 shrink-0 bg-white overflow-x-auto pb-1">
                <button onclick="switchHMSTab('neuro')" class="hms-tab-btn ${!isMSI ? 'active' : ''} flex items-center gap-2 outline-none">
                    <i data-lucide="brain" width="16"></i> <span class="hidden sm:inline">Functional / Neuro</span><span class="sm:hidden">Neuro</span>
                </button>
                <button onclick="switchHMSTab('msi')" class="hms-tab-btn ${isMSI ? 'active' : ''} flex items-center gap-2 outline-none">
                    <i data-lucide="bone" width="16"></i> <span class="hidden sm:inline">Structural / MSI (Sahrmann)</span><span class="sm:hidden">MSI</span>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-6 bg-slate-50/30 custom-scroll">
                <div id="hms-protocol-list" class="max-w-3xl mx-auto pb-10">
                    ${accordionItems.length > 0 ? accordionItems : `<div class="text-center py-20 text-slate-400 font-bold italic border-2 border-dashed border-slate-200 rounded-3xl">Tidak ada protokol relevan. Gunakan menu di bawah untuk menambah manual.</div>`}
                    
                    <div class="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center">
                        <p class="text-xs font-bold text-slate-400 uppercase mb-4 tracking-tighter">Butuh protokol ${isMSI ? 'MSI' : 'Neuro'} lainnya?</p>
                        <div class="flex gap-2 w-full max-w-sm">
                            <select id="hms-add-protocol-select" class="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-emerald-100 transition-all shadow-sm">
                                <option value="" disabled selected>Pilih Protokol Tambahan</option>
                                ${allProtocols.filter(p => !filteredProtocols.includes(p)).map(p => `<option value="${p.replace(/"/g, '&quot;')}">${p}</option>`).join('')}
                            </select>
                            <button onclick="addHMSProtocolToSession()" class="h-10 w-10 bg-slate-800 text-white rounded-xl shadow-lg hover:shadow-emerald-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"><i data-lucide="plus" width="18"></i></button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="shrink-0 bg-white shadow-[0_-15px_30px_rgba(0,0,0,0.05)] z-10">
                <div id="hms-tally-panel" class="px-8 py-4 border-t border-slate-100">
                    <div class="flex items-center justify-between mb-2">
                        <p id="hms-tally-title" class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <i data-lucide="bar-chart-3" width="14" class="text-emerald-500"></i> LIVE DIAGNOSIS TALLY
                        </p>
                        <span id="hms-obs-count" class="text-[10px] font-black text-slate-300 uppercase">${(hmsSession.selectedObs || []).length} Observations Entered</span>
                    </div>
                    <div id="hms-tally-list" class="flex flex-wrap gap-2 text-xs max-h-[140px] overflow-y-auto custom-scroll pr-2 pb-2">
                        <span class="text-slate-400 italic">Centang observasi untuk melihat hasil analisis...</span>
                    </div>
                </div>

                <div class="px-8 py-5 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <button onclick="clearHMSSession()" class="text-slate-400 hover:text-red-500 text-[10px] font-black uppercase tracking-tighter transition-colors flex items-center gap-1">
                        <i data-lucide="rotate-ccw" width="14"></i> Reset Data
                    </button>
                    <div class="flex items-center gap-4">
                        <button onclick="closeModal()" class="text-slate-500 font-black text-[11px] uppercase px-4 py-2 hover:bg-slate-200 rounded-xl transition-colors">Batal</button>
                        <button id="btn-confirm-hms" disabled onclick="confirmHMSDiagnosis()" class="bg-slate-200 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all cursor-not-allowed opacity-50">
                            <i data-lucide="check-circle" width="18"></i> Simpan Analisis
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

        const modalContent = document.getElementById('modal-content');
        if (!modalContent) return;
        modalContent.innerHTML = content;
        modalContent.className = "relative bg-white rounded-3xl w-full max-w-6xl h-[92vh] overflow-hidden shadow-2xl animate-fade-in";
        document.getElementById('modal-container').classList.remove('hidden');

        if (preserveScroll) {
            const newScrollContainer = document.getElementById('hms-protocol-list');
            if (newScrollContainer) newScrollContainer.parentElement.scrollTop = oldScrollTop;
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
        updateHMSTally();
    } catch (err) {
        console.error("CRITICAL HMS ERROR:", err);
        alert("Terjadi kesalahan saat membuka HMS Wizard: " + err.message);
    }
}

function toggleHMSAccordion(safeKey) {
    if (!hmsSession.openAccordions) hmsSession.openAccordions = [];
    const body = document.querySelector(`.hms-acc-body-${safeKey}`);
    const chevron = document.querySelector(`.hms-chevron-${safeKey}`);
    if (!body) return;
    const isOpening = body.classList.contains('hidden');
    body.classList.toggle('hidden');

    if (isOpening) {
        if (!hmsSession.openAccordions.includes(safeKey)) hmsSession.openAccordions.push(safeKey);
        if (chevron) { chevron.style.transform = 'rotate(180deg)'; chevron.classList.add('rotate-180'); chevron.classList.remove('rotate-0'); }
    } else {
        hmsSession.openAccordions = hmsSession.openAccordions.filter(k => k !== safeKey);
        if (chevron) { chevron.style.transform = ''; chevron.classList.remove('rotate-180'); chevron.classList.add('rotate-0'); }
    }
}

function hideHMSProtocol(pKey) {
    if (!hmsSession.hiddenProtocols) hmsSession.hiddenProtocols = [];
    hmsSession.hiddenProtocols.push(pKey);
    openHMSWizard();
}

function addHMSProtocolToSession() {
    const select = document.getElementById('hms-add-protocol-select');
    if (!select || !select.value) return;
    if (!hmsSession.addedProtocols) hmsSession.addedProtocols = [];
    hmsSession.addedProtocols.push(select.value);
    openHMSWizard();
}

function clearHMSSession() {
    if (confirm("Hapus semua observasi terpilih untuk sesi ini?")) {
        hmsSession = { selectedObs: [], tally: {}, hiddenProtocols: [], addedProtocols: [], activeTab: 'neuro', openAccordions: [] };
        openHMSWizard();
    }
}

function toggleHMSObservation(checkbox) {
    const protocol = checkbox.getAttribute('data-protocol');
    const obsText = checkbox.getAttribute('data-obs-text');
    const diagnosis = checkbox.getAttribute('data-diagnosis');
    const safeKey = checkbox.getAttribute('data-safe-key');
    const type = hmsSession.activeTab;

    if (checkbox.checked) {
        hmsSession.selectedObs.push({ protocol, text: obsText, diagnosis, type, isCorrection: false });
    } else {
        hmsSession.selectedObs = hmsSession.selectedObs.filter(
            o => !(o.protocol === protocol && o.text === obsText && o.type === type)
        );
    }

    // Visual feedback for the row (even without full re-render)
    const label = checkbox.closest('label');
    if (label) {
        label.classList.toggle('border-emerald-400', checkbox.checked);
        label.classList.toggle('bg-emerald-50', checkbox.checked);
        label.classList.toggle('bg-white', !checkbox.checked);
        label.classList.toggle('border-slate-100', !checkbox.checked);
    }

    // Refresh count in accordion badge
    const badge = document.querySelector(`.hms-acc-badge-${safeKey}`);
    if (badge) {
        const count = hmsSession.selectedObs.filter(o => o.protocol === protocol && o.type === type).length;
        if (count > 0) {
            badge.textContent = count;
            badge.className = `w-7 h-7 rounded-full text-xs font-black flex items-center justify-center bg-emerald-500 text-white hms-acc-badge-${safeKey}`;
        } else {
            // Revert to original index if possible, or just leave as 0
            badge.textContent = '0';
            badge.className = `w-7 h-7 rounded-full text-xs font-black flex items-center justify-center bg-slate-100 text-slate-500 hms-acc-badge-${safeKey}`;
        }
    }

    if (type === 'msi') {
        if (!hmsSession.openAccordions.includes(safeKey) && checkbox.checked) {
            hmsSession.openAccordions.push(safeKey);
        }
        openHMSWizard(true); // Preserve scroll for MSI correction toggles
    } else {
        updateHMSTally();
    }
}

function toggleMSICorrection(checkbox) {
    const protocol = checkbox.getAttribute('data-protocol');
    const obsText = checkbox.getAttribute('data-obs-text');
    const item = hmsSession.selectedObs.find(o => o.protocol === protocol && o.text === obsText && o.type === 'msi');
    if (item) {
        item.isCorrection = checkbox.checked;
        updateHMSTally();
    }
}

function updateHMSTally() {
    const total = hmsSession.selectedObs.length;
    const tallyList = document.getElementById('hms-tally-list');
    const tallyTitle = document.getElementById('hms-tally-title');
    const obsCount = document.getElementById('hms-obs-count');
    const confirmBtn = document.getElementById('btn-confirm-hms');

    if (obsCount) obsCount.textContent = `${total} Observations Entered`;
    if (!tallyList) return;

    if (total === 0) {
        tallyList.innerHTML = '<span class="text-slate-400 italic">Centang observasi untuk melihat hasil analisis...</span>';
        if (tallyTitle) tallyTitle.innerHTML = `<i data-lucide="bar-chart-3" width="14" class="text-emerald-500"></i> Live Diagnosis Tally`;
        confirmBtn.disabled = true;
        confirmBtn.className = 'bg-slate-200 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-slate-100 flex items-center gap-3 transition-all cursor-not-allowed opacity-50';
        lucide.createIcons();
        return;
    }

    // Rebuild Tally with Weights
    hmsSession.tally = {};
    hmsSession.selectedObs.forEach(o => {
        let weight = 1;
        if (o.type === 'msi') {
            weight = o.isCorrection ? 5 : 1;
        }
        hmsSession.tally[o.diagnosis] = (hmsSession.tally[o.diagnosis] || 0) + weight;
    });

    const sorted = Object.entries(hmsSession.tally).sort((a, b) => b[1] - a[1]);
    const winner = sorted[0];

    if (tallyTitle) tallyTitle.innerHTML = `<i data-lucide="check-circle" width="14" class="text-emerald-500"></i> Analisis Selesai (${total} obs)`;

    confirmBtn.disabled = false;
    confirmBtn.className = 'bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-3';

    tallyList.innerHTML = sorted.map(([dx, score], i) => {
        const isWinner = i === 0;
        const obsForDx = hmsSession.selectedObs.filter(o => o.diagnosis === dx);
        const hasCorrection = obsForDx.some(o => o.isCorrection);

        return `
        <div class="flex items-center gap-1.5 px-3 py-2 rounded-xl border ${isWinner ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-black' : 'bg-slate-50 border-slate-100 text-slate-500 font-bold'}">
            ${isWinner ? '🏆' : ''} ${dx} 
            <span class="opacity-50 text-[10px]">
                (${obsForDx.length} obs${hasCorrection ? ' x5' : ''})
            </span>
        </div>`;
    }).join('');
    lucide.createIcons();
}

function confirmHMSDiagnosis() {
    if (!hmsSession || !hmsSession.selectedObs || hmsSession.selectedObs.length === 0) {
        showToast("Pilih minimal satu observasi.", "warning");
        return;
    }

    const sorted = Object.entries(hmsSession.tally).sort((a, b) => b[1] - a[1]);
    const winner = sorted[0][0];

    // Determine path
    const hasNeuro = hmsSession.selectedObs.some(o => o.type === 'neuro');
    const hasMSI = hmsSession.selectedObs.some(o => o.type === 'msi');
    let path = 'neuro';
    if (hasNeuro && hasMSI) path = 'combined';
    else if (hasMSI) path = 'msi';

    window.tempFormData.hms_diagnosis = winner;
    window.tempFormData.hms_notes = JSON.stringify({
        total: hmsSession.selectedObs.length,
        tally: sorted.map(([dx, score]) => ({ dx, score })),
        activeTab: hmsSession.activeTab,
        path: path,
        observations: hmsSession.selectedObs.map(o => ({
            protocol: o.protocol,
            text: o.text,
            type: o.type,
            isCorrection: !!o.isCorrection,
            diagnosis: o.diagnosis
        }))
    });

    closeModal();
    renderAssessmentForm(document.getElementById('main-content'), true);
    showToast("Analisis HMS berhasil disimpan ke form.", "success");
}

function clearHMSResultFromForm() {
    if (confirm("⚠️ APAKAH ANDA YAKIN?\n\nHapus hasil analisis HMS ini? Data diagnosa dan observasi yang sudah tersimpan akan dikosongkan.")) {
        window.tempFormData.hms_diagnosis = '';
        window.tempFormData.hms_notes = '';
        renderAssessmentForm(document.getElementById('main-content'), true);
        showToast("Hasil analisis HMS telah dihapus.", "success");
    }
}

function clearHMSSession() {
    // 1. Uncheck all checkboxes
    document.querySelectorAll('[id^="hms_"]').forEach(el => { if (el.type === 'checkbox') el.checked = false; });

    // 2. Reset label styles (borders and backgrounds)
    document.querySelectorAll('[class*="hms-obs-label-"]').forEach(el => {
        el.classList.remove('border-emerald-400', 'bg-emerald-50');
        el.classList.add('border-slate-200', 'bg-white');
    });

    // 3. Reset session object (preserving wizard setup like added/hidden protocols)
    hmsSession.selectedObs = [];
    hmsSession.tally = {};

    // 3b. Reset temporary form data to ensure it doesn't persist after closing wizard
    window.tempFormData.hms_diagnosis = '';
    window.tempFormData.hms_notes = '';

    // 4. Fix Badge Numbering (Use appearance sequence of visible protocols)
    const visibleBadges = document.querySelectorAll('[class*="hms-acc-badge-"]');
    visibleBadges.forEach((badge, idx) => {
        badge.textContent = idx + 1;
        badge.className = `w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center ${badge.className.split(' ').pop()}`;
    });

    // 5. Update bottom UI
    updateHMSTally();
}


function hideHMSProtocol(pKey) {
    if (!hmsSession.hiddenProtocols) hmsSession.hiddenProtocols = [];
    hmsSession.hiddenProtocols.push(pKey);

    // Auto-uncheck any selected observations from this protocol
    const checkboxes = document.querySelectorAll(`input[data-protocol="${pKey.replace(/"/g, '&quot;')}"]`);
    checkboxes.forEach(cb => {
        if (cb.checked) {
            cb.checked = false;
            toggleHMSObservation(cb);
        }
    });

    openHMSWizard();
}

function addHMSProtocolToSession() {
    const select = document.getElementById('hms-add-protocol-select');
    if (!select || !select.value) return;

    const pKey = select.value;
    if (!hmsSession.addedProtocols) hmsSession.addedProtocols = [];
    hmsSession.addedProtocols.push(pKey);

    // Also remove from hiddenProtocols if it was previously hidden in this session
    if (hmsSession.hiddenProtocols) {
        hmsSession.hiddenProtocols = hmsSession.hiddenProtocols.filter(p => p !== pKey);
    }

    openHMSWizard();

    // Auto open the newly added accordion
    setTimeout(() => {
        const safeKey = pKey.replace(/[^a-zA-Z0-9]/g, '_');
        const btn = document.querySelector(`.hms-chevron-${safeKey}`);
        if (btn) btn.parentElement.parentElement.click();
    }, 100);
}

function hideHMSObservation(obsText, obsId) {
    if (!hmsSession.hiddenObs) hmsSession.hiddenObs = [];
    hmsSession.hiddenObs.push(obsText);

    // Auto uncheck if it was checked
    const checkbox = document.getElementById(obsId);
    if (checkbox && checkbox.checked) {
        checkbox.checked = false;
        toggleHMSObservation(checkbox);
    }

    // Re-render wizard to hide it completely
    openHMSWizard();
}




window.addEventListener('resize', () => {
    // Do nothing - sidebar state is user-controlled via toggle button
    // We just close the overlay if window is resized (cleanup)
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.getElementById('app-sidebar');
    if (!sidebar || !overlay) return;
});

/**
 * Check if it is safe to perform background sync OR auto-refresh UI.
 * Prevents disruptive changes while the user is actively filling forms or focusing on inputs.
 */
function isSafeToRefresh() {
    // 1. Check for open modals (Assessments, Global Modals, etc.)
    const modal = document.getElementById('modal-container');
    const isModalVisible = modal && !modal.classList.contains('hidden');
    if (document.querySelector('.modal-open') || isModalVisible) return false;

    // 2. Check for active form views (config is NOT included - users can save from config freely)
    const sensitiveViews = ['assessment_form', 'kasir', 'patient_form'];
    if (sensitiveViews.includes(state.currentView)) return false;

    // 3. Check for active focus (User is typing)
    if (document.activeElement && (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.isContentEditable
    )) {
        return false;
    }

    return true;
}

// Alias for clarity in sync logic
const isSafeToAutoSync = isSafeToRefresh;

// --- 6. RENDER APP ---
let _lastRenderedView = null;

function renderApp() {
    const loginScreen = document.getElementById('login-screen');
    const appLayout = document.getElementById('app-layout');
    const printContainer = document.getElementById('print-container');

    if (!state.user) {
        document.body.style.overflow = 'auto';
        loginScreen.classList.remove('hidden');
        appLayout.classList.add('hidden');
        printContainer.classList.add('hidden');

        // [FIX] Delay hiding loading to match fadeIn animation
        setTimeout(() => {
            document.getElementById('sync-loading')?.classList.add('hidden');
        }, 150);

        _lastRenderedView = null;
        return;
    }

    // SYNC GAP ELIMINATION: Force Loading Screen specifically after token activation
    const isFirstActivation = localStorage.getItem('erm_first_activation_sync') === 'true';
    if (state.user && isFirstActivation) {
        document.getElementById('sync-loading')?.classList.remove('hidden');
        appLayout.classList.add('hidden');
        loginScreen.classList.add('hidden');
        lucide.createIcons();

        // Close it only if sync is finished
        if (window._firstSyncDone) {
            console.log("Sync done, finishing activation loading UI...");
            setTimeout(() => {
                localStorage.removeItem('erm_first_activation_sync');
                renderApp();
            }, 1500);
        }
        // [FIX] Jangan return di sini! Biarkan renderApp lanjut ke bawah 
        // supaya Dashboard sudah ter-render di "belakang" overlay loading.
        // Jadi saat overlay hilang (oleh updateSyncStatusUI), nggak blank putih.
    }

    // Standard Loading Screen (if no data yet)
    const isLocalEmpty = (!state.patients || state.patients.length === 0);
    if (window._firstSyncDone === false && state.scriptUrl && isLocalEmpty) {
        document.getElementById('sync-loading')?.classList.remove('hidden');
        appLayout.classList.add('hidden');
        loginScreen.classList.add('hidden');
        lucide.createIcons();
        return;
    }

    loginScreen.classList.add('hidden');
    document.getElementById('user-name').innerText = state.user.name;
    document.getElementById('user-role').innerText = state.user.role === 'ADMIN' ? 'Administrator' : 'Fisioterapis';
    const configBtn = document.getElementById('nav-config');
    if (configBtn) configBtn.classList.toggle('hidden', state.user.role !== 'ADMIN');

    if (state.currentView === 'print') {
        appLayout.classList.add('hidden');
        printContainer.classList.remove('hidden');
        printContainer.style.display = 'block';
        document.body.style.overflow = 'auto';
        renderPrintView(printContainer);
        _lastRenderedView = 'print';
    } else {
        appLayout.classList.remove('hidden');
        if (!window._sidebarInitialized) { initSidebarState(); window._sidebarInitialized = true; }
        printContainer.classList.add('hidden');
        printContainer.style.display = 'none';
        document.body.style.overflow = 'hidden';

        ['dashboard', 'schedule', 'patients', 'assessments', 'kasir', 'protocols', 'config'].forEach(v => {
            const btn = document.getElementById(`nav-${v}`);
            if (btn) {
                let isActive = state.currentView === v;
                if (v === 'dashboard') isActive = (state.currentView === 'dashboard');

                const baseClass = (v === 'schedule') ? "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 btn-press relative " : "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 btn-press ";
                btn.className = isActive
                    ? baseClass + "bg-blue-600 text-white shadow-lg shadow-blue-900/30 translate-x-1 font-semibold"
                    : baseClass + "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1";
            }
        });

        const main = document.getElementById('main-content');
        const pageTitle = document.getElementById('page-title');

        // Only clear & re-render if view actually changed
        const viewChanged = _lastRenderedView !== state.currentView;
        if (viewChanged) {
            main.innerHTML = '';
            window.scrollTo(0, 0);
        }
        _lastRenderedView = state.currentView;

        try {
            if (state.currentView === 'dashboard') { pageTitle.innerText = 'Dashboard'; renderDashboard(main); }
            else if (state.currentView === 'schedule') { pageTitle.innerText = 'Jadwal Terapi'; renderScheduleView(main); }
            else if (state.currentView === 'patients') { pageTitle.innerText = 'Data Master Pasien'; renderPatientList(main); }
            else if (state.currentView === 'assessments') { pageTitle.innerText = 'Riwayat Assessment'; renderAssessmentList(main); }
            else if (state.currentView === 'assessment_form') { pageTitle.innerText = 'Formulir Assessment'; renderAssessmentForm(main, false); }
            else if (state.currentView === 'kasir') { pageTitle.innerText = 'Kasir & Pembayaran'; renderKasirView(main); }
            else if (state.currentView === 'analytics') { pageTitle.innerText = 'Analisis Klinis'; renderAnalyticsView(main); }
            else if (state.currentView === 'protocols') { pageTitle.innerText = 'Daftar Protokol'; renderProtocols(main); }
            else if (state.currentView === 'config') { pageTitle.innerText = 'Konfigurasi'; renderConfigView(main, state.activeConfigTab); }
        } catch (err) {
            console.error("Render Error:", err);
            main.innerHTML = `
                <div class="p-10 text-center">
                    <div class="bg-red-50 text-red-700 p-6 rounded-2xl border-2 border-red-100 max-w-xl mx-auto">
                        <i data-lucide="alert-triangle" width="48" class="mx-auto mb-4 text-red-500"></i>
                        <h2 class="text-xl font-bold mb-2">Gagal Memuat Halaman</h2>
                        <p class="text-sm opacity-80 mb-4">Terjadi kesalahan teknis saat merender tampilan ini.</p>
                        <div class="bg-white/50 p-3 rounded text-left text-xs font-mono mb-6 overflow-x-auto">
                            ${err.message}
                        </div>
                        <button onclick="location.reload()" class="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-all">Muat Ulang Aplikasi</button>
                    </div>
                </div>`;
            renderIcons();
        }

        updateSidebarBadges();
        renderIcons();

        // [FIX] SEAMLESS TRANSITION: Hide loader ONLY after everything is rendered
        // Using a combination of state check and slight delay to ensure DOM is ready.
        if (!window._isBlockingSync) {
            setTimeout(() => {
                const syncLoading = document.getElementById('sync-loading');
                if (syncLoading) {
                    syncLoading.classList.add('hidden');
                }
            }, 50); // Minimal delay to allow browser paint
        }
    }
}

// --- 7. VIEW RENDERERS (DASHBOARD) ---
function renderProtocols(container) {
    container.innerHTML = `
        <div class="space-y-6 fade-in">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-800">Daftar Protokol Fisioterapi</h2>
                <div class="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
                    Total: ${state.protocols.length} Protokol
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${state.protocols.length === 0 ? `
                    <div class="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <i data-lucide="book-open" width="48" class="mx-auto mb-4 text-slate-300"></i>
                        <p class="text-slate-400 font-medium">Belum ada data protokol.</p>
                        <p class="text-[10px] text-slate-300">Data ini disinkronkan otomatis dari Master Sheet.</p>
                    </div>
                ` : state.protocols.map(p => `
                    <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                        <div class="flex items-start justify-between mb-4">
                            <span class="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">${p.category || 'Umum'}</span>
                            <span class="text-[10px] text-slate-300 font-mono">#${p.id}</span>
                        </div>
                        <h3 class="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">${p.title}</h3>
                        <p class="text-xs text-slate-500 line-clamp-3 mb-6 leading-relaxed">${p.summary || p.description || ''}</p>
                        
                        <div class="pt-4 border-t border-slate-50 flex items-center justify-between">
                            ${p.ebook_url ? `
                                <a href="${p.ebook_url}" target="_blank" class="text-xs font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1">
                                    <i data-lucide="external-link" width="14"></i> E-Book
                                </a>
                            ` : '<span class="text-[10px] text-slate-300 italic">No E-Book</span>'}
                            <button onclick="showProtocolDetail('${p.id}')" class="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1">
                                <i data-lucide="eye" width="14"></i> Detail
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    renderIcons();
}

function showProtocolDetail(id) {
    const p = state.protocols.find(i => i.id === id);
    if (!p) return;

    showModal(`
        <div class="p-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <i data-lucide="book" width="24"></i>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-slate-800">${p.title}</h3>
                    <p class="text-xs text-slate-500 font-medium uppercase tracking-widest">${p.category || 'General'}</p>
                </div>
            </div>

            <div class="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div>
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deskripsi Produk/Metode</h4>
                    <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">${p.description || 'Tidak ada deskripsi.'}</p>
                </div>
                ${p.summary ? `
                    <div class="pt-4 border-t border-slate-200">
                        <h4 class="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Rangkuman Smart</h4>
                        <div class="bg-blue-600 text-white p-4 rounded-xl text-sm italic relative">
                            <i data-lucide="quote" class="absolute -top-2 -left-2 text-blue-300 opacity-50" width="20"></i>
                            ${p.summary}
                        </div>
                    </div>
                ` : ''}
            </div>

            <div class="mt-8 flex gap-3">
                <button onclick="closeModal()" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all">Tutup</button>
                ${p.ebook_url ? `<a href="${p.ebook_url}" target="_blank" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200">Buka E-Book</a>` : ''}
            </div>
        </div>
    `);
}

function renderDashboard(container) {
    container.innerHTML = `
        <div class="fade-in pb-20">
            <div class="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div class="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                    <button onclick="switchDashboardTab('main')" id="dash-tab-main" 
                        class="px-6 py-2.5 rounded-lg text-sm font-black transition-all flex items-center gap-2 ${state.dashboardTab === 'main' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}">
                        <i data-lucide="layout-dashboard" width="16"></i> Ringkasan
                    </button>
                    <button onclick="switchDashboardTab('analytics')" id="dash-tab-analytics" 
                        class="px-6 py-2.5 rounded-lg text-sm font-black transition-all flex items-center gap-2 ${state.dashboardTab === 'analytics' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}">
                        <i data-lucide="line-chart" width="16"></i> Analisis Klinis
                    </button>
                </div>
            </div>

            <div id="dashboard-tab-content">
                <!-- Content will be injected here -->
            </div>
        </div>
    `;
    renderIcons();
    renderDashboardContent();
}

function switchDashboardTab(tab) {
    state.dashboardTab = tab;
    renderDashboardContent();
    renderDashboard(document.getElementById('main-content')); // Re-render to update tab styles
}

async function renderDashboardContent() {
    const subContainer = document.getElementById('dashboard-tab-content');
    if (!subContainer) return;

    if (state.dashboardTab === 'analytics') {
        renderAnalyticsView(subContainer);
        return;
    }

    const count = state.assessments.length;
    const todayStr = today();
    const todayAppointments = state.appointments.filter(a => normalizeDate(a.date) === todayStr);
    const todayIncome = (state.appointments || [])
        .filter(a => isPaidToday(a))
        .reduce((sum, a) => sum + (parseRp(a.finalAmount) || parseRp(a.fee) || 0), 0);
    const unpaidToday = (state.appointments || []).filter(a => normalizeDate(a.date) === todayStr && (a.status === 'CONFIRMED' || !a.status) && !isPaidAppt(a)).length;
    const formatRp = (num) => 'Rp ' + num.toLocaleString('id-ID');

    subContainer.innerHTML = `
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 fade-in text-slate-800">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 md:p-6 text-white shadow-lg">
                <h3 class="text-4xl font-bold">${state.patients.length}</h3><p class="text-blue-100">Total Pasien</p>
            </div>
            <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 md:p-6 text-white shadow-lg">
                <h3 class="text-4xl font-bold">${count}</h3><p class="text-emerald-100">Assessment</p>
            </div>
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 md:p-6 text-white shadow-lg">
                <h3 class="text-4xl font-bold">${todayAppointments.length}</h3><p class="text-purple-100">Pasien Hari Ini</p>
            </div>
            <div class="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-4 md:p-6 text-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity" onclick="navigate('kasir')">
                <h3 class="text-2xl md:text-3xl font-bold truncate" title="${formatRp(todayIncome)}">${formatRp(todayIncome)}</h3>
                <p class="text-orange-100 text-sm md:text-base">Pemasukan Hari Ini</p>
                ${unpaidToday > 0 ? `<div class="mt-2 bg-white/20 rounded-lg px-2 py-1 text-xs font-bold">${unpaidToday} belum bayar →</div>` : '<div class="mt-2 text-xs text-orange-200">Semua lunas ✓</div>'}
            </div>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 fade-in">
            <h3 class="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Kasus Terbanyak</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                ${Object.keys(ICF_TEMPLATES).map(k => `
                <div class="flex justify-between items-center text-sm p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-colors">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full bg-blue-500"></div> 
                        <span class="font-medium text-slate-700">${k}</span>
                    </div>
                    <span class="font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full text-xs">${state.assessments.filter(a => a.diagnosis === k).length}</span>
                </div>`).join('')}
            </div>
        </div>`;
}


// --- 7.5. VIEW RENDERERS (SCHEDULE) ---
let scheduleViewDate = new Date();


/**
 * Check if the clinic is closed on a specific date
 * Supports both custom holiday dates and recurring off-days
 */
function isClinicClosed(dateStr) {
    if (!dateStr) return false;
    const holidays = (state.bookingConfig.customHolidays || '').split(',').map(d => d.trim());
    if (holidays.includes(dateStr)) return true;
    const offDays = (state.bookingConfig.offDays || '').split(',').map(d => d.trim());
    const dayOfWeek = new Date(dateStr).getDay();
    if (offDays.includes(String(dayOfWeek))) return true;
    return false;
}

function renderScheduleView(container) {
    const year = scheduleViewDate.getFullYear();
    const month = scheduleViewDate.getMonth();
    const now = new Date();

    // Calendar Logic
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = (firstDay.getDay() + 6) % 7;

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    const monthAppts = state.appointments.filter(a => {
        const d = new Date(a.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });

    container.innerHTML = `
        <div class="space-y-6 fade-in pb-24">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="flex items-center gap-4">
                    <div class="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200"><i data-lucide="calendar" width="24"></i></div>
                    <div>
                        <div class="flex items-center gap-2">
                             <h2 class="text-2xl font-black text-slate-800">${monthNames[month]} ${year}</h2>
                             <div id="schedule-sync-spinner" class="hidden text-blue-500 animate-spin">
                                <i data-lucide="loader-2" width="20"></i>
                             </div>
                        </div>
                        <p class="text-slate-500 font-medium text-sm">Kelola Jadwal Terapi</p>
                    </div>
                </div>
                <div class="flex items-center bg-slate-100 rounded-xl p-1">
                    <button onclick="changeScheduleMonth(-1)" class="p-2 hover:bg-white hover:text-blue-600 rounded-lg text-slate-500 transition-all shadow-sm"><i data-lucide="chevron-left" width="20"></i></button>
                    <button onclick="resetScheduleMonth()" class="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600">Hari Ini</button>
                    <button onclick="changeScheduleMonth(1)" class="p-2 hover:bg-white hover:text-blue-600 rounded-lg text-slate-500 transition-all shadow-sm"><i data-lucide="chevron-right" width="20"></i></button>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                    ${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Ming'].map(d => `<div class="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">${d}</div>`).join('')}
                </div>
                <div class="grid grid-cols-7 divide-x divide-slate-100 divide-y" id="calendar-grid">
                    ${Array(startingDay).fill(null).map(() => `<div class="bg-slate-50/50 min-h-[100px]"></div>`).join('')}
                    ${Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = now.getDate() === day && now.getMonth() === month && now.getFullYear() === year;
        const isClosed = isClinicClosed(dateStr);
        const dayAppts = monthAppts.filter(a => normalizeDate(a.date) === dateStr).sort((a, b) => (normalizeTime(a.time) || '').localeCompare(normalizeTime(b.time) || ''));

        return `
                        <div id="day-${dateStr}" data-date="${dateStr}" class="calendar-day-cell min-h-[100px] p-2 ${isClosed ? 'bg-slate-50/80 cursor-not-allowed opacity-60' : 'hover:bg-blue-50 transition-colors cursor-pointer group'} relative border border-transparent rounded-lg">
                            <div class="flex justify-between items-start">
                                <span class="text-sm font-bold ${isToday ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md' : (isClosed ? 'text-slate-300' : 'text-slate-700')}">${day}</span>
                                ${isClosed ? '<span class="text-[9px] font-black text-rose-400 uppercase italic mt-1">TUTUP</span>' : ''}
                                ${dayAppts.length > 0 ? `<span class="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">${dayAppts.length}</span>` : ''}
                            </div>
                            <div class="mt-2 space-y-1">
                                ${dayAppts.slice(0, 3).map(a => {
            const ptType = a.patientType || 'Klinik';
            const typeIcon = ptType === 'Home Visit' ? 'home' : 'building-2';
            const typeColor = ptType === 'Home Visit' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-700';
            const patientName = state.patients.find(p => p.id === a.patientId)?.name.split(' ')[0] || (a.name || 'Pasien');
            const isPending = a.status === 'PENDING';
            const isUnpaidAlert = !isPaidAppt(a) && (normalizeDate(a.date) <= today());
            const statusClass = isPending
                ? 'bg-amber-100 border-amber-300 text-amber-800 ring-1 ring-amber-200 animate-pulse'
                : (isUnpaidAlert ? 'bg-rose-50 border-rose-200 text-rose-700 ring-1 ring-rose-200 shadow-rose-100' : 'bg-white border-slate-200 text-slate-600');
            return `<div class="text-[9px] sm:text-[10px] truncate ${statusClass} rounded px-1 py-0.5 font-medium shadow-sm group-hover:border-blue-200 flex items-center gap-0.5 sm:gap-1"><span class="${typeColor} px-0.5 sm:px-1 py-0.5 rounded text-[7px] sm:text-[8px] font-bold flex items-center gap-0.5 shrink-0"><i data-lucide="${typeIcon}" width="7" class="hidden sm:inline"></i><span class="sm:hidden">${ptType === 'Home Visit' ? 'V' : 'K'}</span></span><span class="truncate text-[8px] sm:text-[10px]">${isPending ? '⏳ ' : ''}${isUnpaidAlert ? '📌 ' : ''}${a.time.substring(0, 5)} ${patientName}</span></div>`;
        }).join('')}
                                ${dayAppts.length > 3 ? `<div class="text-[9px] sm:text-[10px] text-slate-500 font-bold pl-1 bg-slate-100 rounded px-1">+${dayAppts.length - 3}</div>` : ''}
                            </div>
                            ${!isClosed ? `<button data-action="add" data-date="${dateStr}" class="calendar-add-btn absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-blue-600 text-white p-1.5 rounded-lg shadow-md hover:scale-110 transition-all"><i data-lucide="plus" width="14"></i></button>` : ''}
                        </div>`;
    }).join('')}
                </div>
            </div>

            <!-- Legend Keterangan Tipe Pasien -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div class="flex items-center justify-between flex-wrap gap-3">
                    <h4 class="text-xs font-bold text-slate-500 uppercase">Keterangan:</h4>
                    <div class="flex items-center gap-4 flex-wrap">
                        <div class="flex items-center gap-2">
                            <span class="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                                <i data-lucide="building-2" width="10"></i>
                                <span class="hidden sm:inline">Klinik</span>
                                <span class="sm:hidden">K</span>
                            </span>
                            <span class="text-xs text-slate-600">= Pasien Klinik</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                                <i data-lucide="home" width="10"></i>
                                <span class="hidden sm:inline">Visit</span>
                                <span class="sm:hidden">V</span>
                            </span>
                            <span class="text-xs text-slate-600">= Home Visit</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detail view removed in favor of Modal -->
        </div>
    `;
    lucide.createIcons();

    // Add event delegation for calendar clicks
    const calendarGrid = document.getElementById('calendar-grid');
    if (calendarGrid) {
        // Remove old listeners if any
        calendarGrid.replaceWith(calendarGrid.cloneNode(true));
        const newGrid = document.getElementById('calendar-grid');

        newGrid.addEventListener('click', function (e) {
            // Find the calendar cell that was clicked
            const cell = e.target.closest('.calendar-day-cell');
            const addBtn = e.target.closest('.calendar-add-btn');

            if (addBtn) {
                // Clicked the + button
                e.stopPropagation();
                const dateStr = addBtn.getAttribute('data-date');
                openAppointmentModal(dateStr);
            } else if (cell) {
                // Clicked the calendar cell
                const dateStr = cell.getAttribute('data-date');
                console.log('Calendar cell clicked:', dateStr);
                openDailyScheduleModal(dateStr);
            }
        });
    }

    if (year === now.getFullYear() && month === now.getMonth()) {
        const todayStr = today();
        // Don't auto-open on page load - it's annoying
        // setTimeout(() => openDailyScheduleModal(todayStr), 100);
    }
}

function changeScheduleMonth(delta) {
    scheduleViewDate.setMonth(scheduleViewDate.getMonth() + delta);
    renderScheduleView(document.getElementById('main-content'));
}

function resetScheduleMonth() {
    scheduleViewDate = new Date();
    renderScheduleView(document.getElementById('main-content'));
}

function selectScheduleDate(dateStr) {
    console.log('Date clicked (wrapper):', dateStr);
    openDailyScheduleModal(dateStr);
}

// --- HELPER FUNCTIONS FOR DAILY MODAL ---
function handleAddFromDaily(dateStr) {
    closeModal();
    setTimeout(() => openAppointmentModal(dateStr), 300);
}

function handleEditFromDaily(id) {
    closeModal();
    setTimeout(() => openAppointmentModal(null, id), 300);
}

function handleDeleteFromDaily(id, dateStr) {
    if (confirm('Hapus jadwal ini?')) {
        deleteAppointment(id);
        setTimeout(() => openDailyScheduleModal(dateStr), 500);
    }
}

function openDailyScheduleModal(dateStr) {
    if (!dateStr) return;
    const dateObj = normalizeDate(dateStr); // returns YYYY-MM-DD
    const dayAppts = (state.appointments || []).filter(a => {
        const apptDate = normalizeDate(a.date);
        return apptDate === dateObj;
    }).sort((a, b) => (normalizeTime(a.time) || "").localeCompare(normalizeTime(b.time) || ""));

    const modalHtml = `
        <div class="bg-white px-6 py-4 border-b flex justify-between items-center sticky top-0 z-20">
            <div>
                <h3 class="text-xl font-bold text-slate-800">Jadwal: ${formatDateForDisplay(dateStr)}</h3>
                <p class="text-sm text-slate-500">${dayAppts.length} Pasien Terdaftar</p>
            </div>
            <button onclick="closeModal()" class="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"><i data-lucide="x" width="20"></i></button>
        </div>
        <div class="px-6 py-6 space-y-4 overflow-y-auto modal-scroll max-h-[70vh]">
            <div class="flex justify-end">
                 <button onclick="handleAddFromDaily('${dateStr}')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-all flex items-center gap-2"><i data-lucide="plus" width="16"></i> Tambah Jadwal</button>
            </div>
            <div class="space-y-3">
                ${dayAppts.length > 0 ? dayAppts.map(a => {
        const p = state.patients.find(pt => pt.id === a.patientId);
        const ptType = a.patientType || 'Klinik';
        const typeIcon = ptType === 'Home Visit' ? 'home' : 'building-2';
        const typeColor = ptType === 'Home Visit' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200';
        const isPending = a.status === 'PENDING';
        return `
                    <div class="flex items-center gap-4 p-4 rounded-xl border ${isPending ? 'border-amber-200 bg-amber-50' : 'border-slate-100 bg-slate-50'} hover:bg-white hover:border-blue-200 hover:shadow-md transition-all group">
                        <div class="text-center min-w-[60px]">
                            <span class="block font-black ${isPending ? 'text-amber-700' : 'text-slate-700'} text-lg">${a.time}</span>
                            ${isPending ? '<span class="text-[10px] font-bold text-amber-600 bg-amber-100 px-1 py-0.5 rounded mx-auto block w-fit mt-1">BARU</span>' : ''}
                        </div>
                        <div class="flex-1">
                            <h4 class="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">${p ? p.name : (a.name || 'Unknown')} <span class="text-xs font-normal text-slate-400 ml-1">(${p ? p.id : 'Calon Pasien'})</span></h4>
                            ${isPending ? `<div class="text-xs font-bold text-amber-700 mt-0.5"><i data-lucide="phone" width="12" class="inline"></i> ${a.contact || '-'}</div>` : ''}
                            <div class="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                <span class="${typeColor} px-2 py-0.5 rounded border flex items-center gap-1 font-bold"><i data-lucide="${typeIcon}" width="10"></i> ${ptType}</span>
                                <span class="bg-white px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1"><i data-lucide="user" width="10"></i> ${a.therapistId}</span>
                                ${isPaidAppt(a)
                ? `<span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-bold"><i data-lucide="check-circle" width="10"></i> LUNAS</span>`
                : (a.status === 'CONFIRMED' ? `<span class="bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1 font-bold"><i data-lucide="alert-circle" width="10"></i> BELUM BAYAR</span>` : '')}
                                ${a.notes ? `<span class="italic text-slate-400 max-w-[200px] truncate"><i data-lucide="sticky-note" width="10" class="inline mr-1"></i>${a.notes}</span>` : ''}
                            </div>
                        </div>
                        <div class="flex gap-2">
                            ${isPending ? `
                                <button onclick="confirmAppointment('${a.id}')" title="Terima Booking" class="p-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm"><i data-lucide="check" width="14"></i></button>
                            ` : ''}
                            <button onclick="handleEditFromDaily('${a.id}')" title="Edit" class="p-2 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 rounded-lg"><i data-lucide="edit-2" width="14"></i></button>
                            <button onclick="handleDeleteFromDaily('${a.id}', '${dateStr}')" title="Hapus" class="p-2 text-slate-400 hover:text-rose-600 bg-white border border-slate-200 rounded-lg"><i data-lucide="trash-2" width="14"></i></button>
                        </div>
                    </div>`;
    }).join('') : `<div class="text-center py-12 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center gap-3">
                    <div class="bg-slate-100 p-3 rounded-full"><i data-lucide="calendar-x" width="24"></i></div>
                    <span>Tidak ada jadwal pada tanggal ini.</span>
                </div>`}
            </div>
        </div>
        <div class="bg-slate-50 px-6 py-4 border-t flex justify-end sticky bottom-0 z-20">
             <button onclick="closeModal()" class="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm">Tutup</button>
        </div>
    `;

    document.getElementById('modal-content').innerHTML = modalHtml;
    document.getElementById('modal-container').classList.remove('hidden');
    lucide.createIcons();
}

// --- 8. VIEW RENDERERS (PATIENTS) ---
function renderPatientList(container) {
    container.innerHTML = `
        <div class="space-y-4 fade-in pb-24">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div class="relative w-full md:w-96">
                    <i data-lucide="search" class="absolute left-3 top-3 text-slate-400" width="18"></i>
                    <input type="text" id="search-patient" oninput="debouncedFilterPatients()" placeholder="Cari nama / No. RM..." class="pl-10 w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                </div>
                <button onclick="openPatientModal()" class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-200 transition-all btn-press">
                    <i data-lucide="user-plus" width="18"></i> <span class="hidden md:inline">Pasien Baru</span><span class="md:hidden">Tambah Pasien</span>
                </button>
            </div>
            <div class="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-slate-600">
                        <thead class="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200 tracking-wider">
                            <tr>
                                <th class="px-6 py-4">No. RM / NIK</th>
                                <th class="px-6 py-4">Identitas Pasien</th>
                                <th class="px-6 py-4">Gender / Usia</th>
                                <th class="px-6 py-4">Diagnosa Medis</th>
                                <th class="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="patient-table-body"></tbody>
                    </table>
                </div>
            </div>
            <div id="patient-mobile-list" class="md:hidden space-y-3"></div>
        </div>`;
    filterPatients();
}

const debouncedFilterPatients = debounce(() => {
    filterPatients();
}, 300);

function filterPatients() {
    const searchVal = document.getElementById('search-patient')?.value.toLowerCase() || '';
    const tbody = document.getElementById('patient-table-body');
    const mobileList = document.getElementById('patient-mobile-list');
    const filtered = state.patients.filter(p =>
        p.name.toLowerCase().includes(searchVal) ||
        p.id.toLowerCase().includes(searchVal) ||
        (p.tags && p.tags.toLowerCase().includes(searchVal))
    );

    if (filtered.length === 0) {
        const cloudBtn = searchVal.length >= 3 ? `
            <div class="mt-4">
                <button onclick="searchCloudPatients('${searchVal}')" class="bg-blue-50 text-blue-700 border border-blue-200 px-6 py-2 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all flex items-center gap-2 mx-auto shadow-sm">
                    <i data-lucide="cloud-download" width="16"></i> Cari di Gudang Cloud (Pusat)
                </button>
                <p class="text-[10px] text-slate-400 mt-2 italic">*Mencari di seluruh history data klinik (Google Sheets)</p>
            </div>
        ` : '';

        const emptyMsg = `
            <div class="p-12 text-center flex flex-col items-center justify-center">
                <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <i data-lucide="search-x" width="32"></i>
                </div>
                <h3 class="text-slate-800 font-bold mb-1">Data Lokal Kosong</h3>
                <p class="text-xs text-slate-400 max-w-[200px] mb-4">Nama "${searchVal}" tidak ditemukan di memori laptop ini.</p>
                ${cloudBtn}
            </div>`;

        if (tbody) tbody.innerHTML = `<tr><td colspan="6">${emptyMsg}</td></tr>`;
        if (mobileList) mobileList.innerHTML = emptyMsg;
        renderIcons();
        return;
    }

    const hasMore = filtered.length > state.patientLimit;
    const loadMoreBtn = hasMore ? `
        <div class="pt-4 pb-8 flex justify-center">
            <button onclick="loadMorePatients()" class="bg-white border border-slate-300 text-slate-700 px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                <i data-lucide="plus" width="16"></i> Tampilkan Lebih Banyak (${filtered.length - state.patientLimit})
            </button>
        </div>` : '';

    if (tbody) {
        const sliced = filtered.slice(0, state.patientLimit);
        tbody.innerHTML = sliced.map(p => {
            const cat = p.category || 'Klinik';
            const badgeClass = cat === 'Home Visit' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200';
            const catIcon = cat === 'Home Visit' ? 'home' : 'building-2';

            return `<tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 font-mono text-[10px] text-slate-500 font-bold">
                    <div>${p.id}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                        ${p.name}
                        ${p.tags ? `<span class="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm shadow-rose-200 animate-pulse flex items-center gap-1"><i data-lucide="alert-triangle" width="8"></i> ${p.tags.toUpperCase()}</span>` : ''}
                    </div>
                    <div class="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${badgeClass}"><i data-lucide="${catIcon}" width="10"></i> ${cat}</div>
                </td>
                <td class="px-6 py-4 text-xs text-slate-600">
                    <div class="font-bold">${p.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                    <div class="text-slate-400">${calculateAge(p.dob)} Th</div>
                </td>
                <td class="px-6 py-4 text-xs text-slate-600 max-w-[200px] truncate">${p.diagnosis || '-'}</td>
                <td class="px-6 py-4 text-center">
                    <div class="flex justify-center gap-2">
                        <button onclick="viewPatientHistory('${p.id}')" title="Riwayat" class="p-2 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 rounded-lg transition-all shadow-sm"><i data-lucide="history" width="16"></i></button>
                        <button onclick="startAssessment('${p.id}')" title="Assessment Baru" class="p-2 bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300 rounded-lg transition-all shadow-sm"><i data-lucide="clipboard-plus" width="16"></i></button>
                        <button onclick="openPatientModal('${p.id}')" title="Edit Data" class="p-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-all shadow-sm"><i data-lucide="edit-3" width="16"></i></button>
                        <button onclick="deletePatient('${p.id}')" title="Hapus" class="p-2 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 rounded-lg transition-all shadow-sm"><i data-lucide="trash-2" width="16"></i></button>
                    </div>
                </td>
            </tr>`;
        }).join('') + (hasMore ? `<tr><td colspan="5">${loadMoreBtn}</td></tr>` : '');
    }

    if (mobileList) {
        const sliced = filtered.slice(0, state.patientLimit);
        mobileList.innerHTML = sliced.map(p => {
            const cat = p.category || 'Klinik'; const isVisit = cat === 'Home Visit';
            const borderLeftClass = isVisit ? 'border-l-4 border-l-orange-500' : 'border-l-4 border-l-blue-500';

            return `<div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 ${borderLeftClass} relative">
                <div class="flex items-start gap-3 mb-3">
                    <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-black text-slate-400 shrink-0">${p.name.charAt(0)}</div>
                    <div class="pr-12">
                        <h4 class="font-bold text-slate-800 text-sm leading-tight mb-0.5 flex items-center gap-2">
                            ${p.name}
                            ${p.tags ? `<span class="bg-rose-100 text-rose-700 text-[8px] font-black px-1.5 py-0.5 rounded border border-rose-200 animate-pulse">${p.tags.toUpperCase()}</span>` : ''}
                        </h4>
                        <p class="text-[10px] text-slate-400 font-mono">${p.id}</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2 mb-3">
                    <div class="bg-slate-50 p-2 rounded-lg border border-slate-100"><p class="text-[9px] text-slate-400 uppercase font-bold">Usia / Gender</p><p class="text-xs font-bold text-slate-600">${calculateAge(p.dob)} Th • ${p.gender}</p></div>
                    <div class="bg-slate-50 p-2 rounded-lg border border-slate-100"><p class="text-[9px] text-slate-400 uppercase font-bold">Diagnosa</p><p class="text-xs font-bold text-slate-600 truncate">${p.diagnosis || '-'}</p></div>
                </div>
                <div class="grid grid-cols-4 gap-2 border-t border-slate-100 pt-3">
                    <button onclick="viewPatientHistory('${p.id}')" class="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"><div class="bg-indigo-50 text-indigo-600 p-1.5 rounded-md"><i data-lucide="history" width="16"></i></div><span class="text-[10px] font-bold">Riwayat</span></button>
                    <button onclick="startAssessment('${p.id}')" class="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"><div class="bg-emerald-50 text-emerald-600 p-1.5 rounded-md"><i data-lucide="clipboard-plus" width="16"></i></div><span class="text-[10px] font-bold">Assess</span></button>
                    <button onclick="openPatientModal('${p.id}')" class="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"><div class="bg-blue-50 text-blue-600 p-1.5 rounded-md"><i data-lucide="edit-3" width="16"></i></div><span class="text-[10px] font-bold">Edit</span></button>
                    <button onclick="deletePatient('${p.id}')" class="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-slate-50 text-slate-400 transition-colors"><div class="bg-rose-50 text-rose-600 p-1.5 rounded-md"><i data-lucide="trash-2" width="16"></i></div><span class="text-[10px] font-bold">Hapus</span></button>
                </div>
            </div>`;
        }).join('') + loadMoreBtn;
    }
    renderIcons();
}


// --- 24. DEEP SEARCH (CLOUD FETCH) LOGIC ---
window.searchCloudPatients = async function (query) {
    if (!state.scriptUrl) return showToast("Configurasi Cloud belum aktif.", "error");

    // Show Loading inside Search Box or Message
    const msgContainer = document.querySelector('#patient-table-body td div') || document.querySelector('#patient-mobile-list div');
    if (msgContainer) {
        msgContainer.innerHTML = `
            <div class="flex flex-col items-center py-8">
                <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p class="text-sm font-bold text-blue-600 animate-pulse">Menghubungi Cloud...</p>
            </div>
        `;
    }

    try {
        const response = await fetch(`${LICENSE_API_URL}?action=search_cloud_patients&sheet_id=${state.sheetId}&q=${encodeURIComponent(query)}&t=${Date.now()}`);
        const data = await response.json();

        if (data.status === 'success' && data.results && data.results.length > 0) {
            const resultsHtml = `
                <div class="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl mb-6">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm"><i data-lucide="database" width="16"></i></div>
                        <div>
                            <h3 class="text-sm font-black text-blue-900 leading-tight">Berhasil Ditemukan di Cloud!</h3>
                            <p class="text-[10px] text-blue-700">Silakan klik tombol "Impor" untuk menarik data ke laptop ini.</p>
                        </div>
                    </div>
                    <div class="space-y-2">
                        ${data.results.map(p => `
                            <div class="bg-white p-3 rounded-xl border border-blue-200 flex justify-between items-center shadow-sm hover:border-blue-400 transition-all group">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-black text-blue-400">${p.name.charAt(0)}</div>
                                    <div>
                                        <div class="font-bold text-slate-800 text-sm">${p.name}</div>
                                        <div class="text-[10px] text-slate-400 font-mono">${p.id} • ${p.phone || '-'}</div>
                                    </div>
                                </div>
                                <button onclick="importPatientFromCloud(${JSON.stringify(p).replace(/"/g, '&quot;')})" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95">
                                    Impor ke Lokal
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <p class="text-[10px] text-slate-400 mt-4 italic text-center text-center">*Menampilkan 20 data teratas yang cocok.</p>
                </div>
            `;

            if (msgContainer) {
                msgContainer.innerHTML = resultsHtml;
                renderIcons();
            } else {
                // Fallback for UI
                showToast(`Ketemu ${data.results.length} di Cloud!`, "info");
            }
        } else {
            showToast("Data benar-benar tidak ada di Cloud.", "warning");
            if (msgContainer) {
                msgContainer.innerHTML = `<div class="p-8 text-center text-slate-400"><i data-lucide="search-x" width="32" class="mx-auto mb-2 opacity-30"></i>Data tidak ditemukan di Cloud maupun lokal.</div>`;
                renderIcons();
            }
        }
    } catch (e) {
        console.error(e);
        showToast("Gagal akses Cloud. Cek koneksi Anda.", "error");
    }
}

window.importPatientFromCloud = async function (patientData) {
    try {
        // 1. Check if already exists (sanity check)
        if (state.patients.find(p => p.id === patientData.id)) {
            showToast("Pasien sudah ada di lokal.", "info");
            return;
        }

        // 2. Add to State
        state.patients.unshift(patientData);

        // 3. Save to Local DB (IndexedDB)
        await saveData();

        showToast(`Data ${patientData.name} Berhasil ditarik!`, "success");

        // 4. Update UI
        filterPatients();
    } catch (e) {
        console.error(e);
        showToast("Gagal menyimpan data cloud.", "error");
    }
}

function loadMorePatients() {
    state.patientLimit += 50;
    filterPatients();
}


function viewPatientHistory(id) {
    state.filterPatientId = id;
    navigate('assessments');
}

function startAssessment(pid) {
    state.selectedPatient = state.patients.find(p => p.id === pid);
    state.currentAssessment = null;
    templateSearchQuery = ''; // Reset ICF search query
    if (typeof hmsSession !== 'undefined') hmsSession = null; // Force HMS re-hydration
    navigate('assessment_form');
}

async function deletePatient(id) {
    if (confirm('Yakin ingin menghapus pasien ini? Data assessment terkait juga akan hilang.')) {
        // [IMMEDIATE] Update local state first for instant UI response
        const p = state.patients.find(x => x.id === id);
        state.patients = state.patients.filter(p => p.id !== id);
        state.assessments = state.assessments.filter(a => a.patientId !== id);
        state.appointments = state.appointments.filter(a => a.patientId !== id);

        // Track for Delta Sync
        trackDelete(id);
        if (!state.deletedIds.patients) state.deletedIds.patients = [];
        state.deletedIds.patients.push(id);

        await saveData();
        renderApp(); // Visual update right away

        if (state.scriptUrl) {
            // [Sync Instant]
            syncDelta(false);
        }
    }
}

// --- 9. VIEW RENDERERS (ASSESSMENT LIST) ---
function renderAssessmentList(container) {
    state.printSelection = [];
    let filteredAssessments = state.assessments;
    let headerText = "Riwayat Semua Pasien";

    if (state.filterPatientId) {
        filteredAssessments = state.assessments.filter(a => a.patientId === state.filterPatientId);
        const p = state.patients.find(pt => pt.id === state.filterPatientId);
        headerText = `Riwayat: ${p ? p.name : 'Unknown'}`;
    }
    filteredAssessments.sort((a, b) => new Date(b.date) - new Date(a.date));

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) return dateStr;
        return dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const hasMoreAssessments = filteredAssessments.length > state.assessmentLimit;
    const loadMoreBtn = hasMoreAssessments ? `
        <div class="pt-4 pb-8 flex justify-center">
            <button onclick="loadMoreAssessments()" class="bg-white border border-slate-300 text-slate-700 px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                <i data-lucide="plus" width="16"></i> Tampilkan Lebih Banyak (${filteredAssessments.length - state.assessmentLimit})
            </button>
        </div>` : '';

    container.innerHTML = `
        <div class="space-y-4 fade-in pb-24"> <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-3">
            <div><h3 class="font-bold text-lg text-slate-800 leading-tight">${headerText}</h3><p class="text-xs text-slate-500">Total: ${filteredAssessments.length} data</p></div>
            <div class="flex gap-2">
                ${state.filterPatientId ? `<button onclick="state.filterPatientId=null; renderAssessmentList(document.getElementById('main-content'))" class="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 flex items-center gap-2"><i data-lucide="x" width="14"></i> Reset Filter</button>` : ''}
                <button id="btn-print-multi" onclick="printSelected()" class="hidden bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-slate-700 animate-bounce-short"><i data-lucide="printer" width="14"></i> Cetak (<span id="sel-count">0</span>)</button>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="hidden md:block overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                        <tr><th class="p-4 w-10 text-center"><input type="checkbox" onchange="toggleAllSelect(this)" class="accent-blue-600 cursor-pointer"></th><th class="p-4">Tanggal</th><th class="p-4">Pasien</th><th class="p-4">Diagnosa</th><th class="p-4 text-center">Aksi</th></tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${filteredAssessments.length === 0 ? '<tr><td colspan="5" class="p-8 text-center text-slate-400 italic">Belum ada data.</td></tr>' : filteredAssessments.slice(0, state.assessmentLimit).map(a => {
        const p = state.patients.find(pt => pt.id === a.patientId);
        const isLocked = a.is_locked === true || a.is_locked === 'true';
        return `<tr class="hover:bg-blue-50 transition-colors ${isLocked ? 'bg-slate-50/50 italic opacity-80' : ''}">
                                <td class="p-4 text-center"><input type="checkbox" class="sel-check accent-blue-600 cursor-pointer" value="${a.id}" onchange="updatePrintSelection()"></td>
                                <td class="p-4 font-mono text-xs text-slate-500">${formatDate(a.date)}</td>
                                <td class="p-4 font-bold text-slate-800">${p ? p.name : '?'}</td>
                                <td class="p-4"><span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs border border-blue-200 font-medium">${a.diagnosis || (p ? p.diagnosis : '-')}</span></td>
                                <td class="p-4 flex justify-center gap-2">
                                    <button onclick="viewSinglePrint('${a.id}')" class="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-blue-600 rounded shadow-sm" title="Lihat"><i data-lucide="eye" width="16"></i></button>
                                    <button onclick="editAssessment('${a.id}')" class="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 rounded shadow-sm" title="Edit"><i data-lucide="edit-2" width="16"></i></button>
                                    <button onclick="deleteAssessment('${a.id}')" class="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 rounded shadow-sm" title="Hapus"><i data-lucide="trash-2" width="16"></i></button>
                                </td>
                            </tr>`;
    }).join('') + (hasMoreAssessments ? `<tr><td colspan="5">${loadMoreBtn}</td></tr>` : '')}
                    </tbody>
                </table>
            </div>
            <div class="md:hidden divide-y divide-slate-100">
                ${filteredAssessments.length === 0 ? '<div class="p-8 text-center text-slate-400 italic">Belum ada data.</div>' : filteredAssessments.slice(0, state.assessmentLimit).map(a => {
        const p = state.patients.find(pt => pt.id === a.patientId);
        const isLocked = a.is_locked === true || a.is_locked === 'true';
        return `<div class="p-4 flex gap-3 hover:bg-slate-50 transition-colors ${isLocked ? 'bg-slate-50 opacity-90' : ''}">
                        <div class="pt-1"><input type="checkbox" class="sel-check w-5 h-5 accent-blue-600 rounded border-slate-300 cursor-pointer" value="${a.id}" onchange="updatePrintSelection()"></div>
                        <div class="flex-1">
                            <div class="flex justify-between items-start mb-1">
                                <h4 class="font-bold text-slate-800 text-sm line-clamp-1">${p ? p.name : '?'}</h4>
                                <div class="flex items-center gap-1.5">
                                    <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">${formatDate(a.date)}</span>
                                </div>
                            </div>
                            <div class="mb-3"><span class="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] border border-blue-100 font-bold mb-1">${a.diagnosis}</span></div>
                            <div class="flex gap-2">
                                <button onclick="viewSinglePrint('${a.id}')" class="flex-1 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 flex justify-center items-center gap-1"><i data-lucide="eye" width="12"></i> Lihat</button>
                                <button onclick="editAssessment('${a.id}')" class="flex-1 py-1.5 rounded-lg border border-emerald-200 text-emerald-600 bg-emerald-50 text-xs font-bold hover:bg-emerald-100 flex justify-center items-center gap-1"><i data-lucide="edit-2" width="12"></i> Edit</button>
                                <button onclick="deleteAssessment('${a.id}')" class="flex-1 py-1.5 rounded-lg border border-rose-200 text-rose-600 bg-rose-50 text-xs font-bold hover:bg-rose-100 flex justify-center items-center gap-1"><i data-lucide="trash-2" width="12"></i> Hapus</button>
                            </div>
                        </div>
                    </div>`;
    }).join('') + loadMoreBtn}
            </div>
        </div>
    </div>`;
    renderIcons();
}

function loadMoreAssessments() {
    state.assessmentLimit += 50;
    renderAssessmentList(document.getElementById('main-content'));
}

function toggleAllSelect(el) {
    document.querySelectorAll('.sel-check').forEach(cb => cb.checked = el.checked);
    updatePrintSelection();
}

function updatePrintSelection() {
    const checks = document.querySelectorAll('.sel-check:checked');
    state.printSelection = [...new Set(Array.from(checks).map(cb => cb.value))];
    const btn = document.getElementById('btn-print-multi');
    const counter = document.getElementById('sel-count');
    if (state.printSelection.length > 0) {
        btn.classList.remove('hidden');
        counter.innerText = state.printSelection.length;
    } else {
        btn.classList.add('hidden');
    }
}

async function deleteAssessment(id) {
    const a = state.assessments.find(x => x.id === id);
    if (a && (a.is_locked === true || a.is_locked === 'true')) {
        showToast('Data ini terkunci secara permanen untuk keamanan riwayat medis.', 'warning');
        return;
    }

    if (confirm('Hapus data assessment ini?')) {
        // [IMMEDIATE] Update local state first for instant UI response
        state.assessments = state.assessments.filter(a => a.id !== id);
        if (state.currentAssessment && state.currentAssessment.id === id) {
            state.currentAssessment = null;
        }

        // Track for Delta Sync
        trackDelete(id);
        if (!state.deletedIds.assessments) state.deletedIds.assessments = [];
        state.deletedIds.assessments.push(id);

        await saveData();
        renderApp(); // Visual update right away

        if (state.scriptUrl) {
            // [Sync Instant]
            syncDelta(false);
        }
    }
}

function viewSinglePrint(id) {
    state.printSelection = [id];
    navigate('print');
}

function printSelected() {
    if (state.printSelection.length === 0) return;
    navigate('print');
}

function editAssessment(aid) {
    state.currentAssessment = state.assessments.find(a => a.id === aid);
    if (!state.currentAssessment) return;
    state.selectedPatient = state.patients.find(p => p.id === state.currentAssessment.patientId);
    if (typeof hmsSession !== 'undefined') hmsSession = null; // Force HMS re-hydration
    navigate('assessment_form');
}
// --- 10. ASSESSMENT FORM LOGIC ---
function renderAssessmentForm(container, useTempData = false) {
    let data;
    if (useTempData && window.tempFormData) {
        data = window.tempFormData;
    } else {
        const defFee = state.selectedPatient.defaultFee || 0;
        data = state.currentAssessment || {
            id: `A${Date.now()}`,
            patientId: state.selectedPatient.id,
            date: today(),
            diagnosis: '', icd: '', icf_codes: '', custom_assessment: '',
            prenatal: '', natal: '', postnatal: '',
            fee: defFee, vas: 0, pain_points: [],
            b: [], s: [], d_act: [], d_part: [], intervention: [], eval: [],
            obj: {
                rom: 'Normal', rom_side: '-', rom_part: '-',
                mmt: '5', mmt_side: '-', mmt_part: '-',
                balance: 'Baik',
            },
            special_tests: {},
            special_tests_note: '',
            hms_diagnosis: '', hms_notes: '',
            plan: '',
            is_consented: false,
            consent_timestamp: '',
            rontgen_url: null, // Initialize as null to prevent overwriting with '' in sheet sync
            // NEW FIELDS for TTV and Separate D/S
            ttv_td: '', ttv_hr: '', ttv_rr: '', ttv_temp: '', ttv_spo2: '',
            rom_d: 'Normal', rom_s: 'Normal',
            mmt_d: '5', mmt_s: '5',
        };
        if (!Array.isArray(data.pain_points)) data.pain_points = [];
        window.tempFormData = JSON.parse(JSON.stringify(data));
    }

    const isLocked = data.is_locked === true || data.is_locked === 'true';

    if (!state.selectedPatient) { navigate('patients'); return; }
    const isNewEntry = !state.currentAssessment && !data.diagnosis;

    // PRESERVE SCROLL
    const scrollEl = document.getElementById('main-form-scroll');
    const oldScroll = scrollEl ? scrollEl.scrollTop : 0;

    container.innerHTML = `
        <div class="h-full overflow-y-auto bg-slate-50 relative flex flex-col">
            ${(data.is_locked === true || data.is_locked === 'true') ? `
            <div class="sticky top-0 z-[100] bg-rose-600 text-white px-6 py-2 flex items-center justify-center gap-2 shadow-lg">
                <i data-lucide="lock" width="14" class="animate-pulse"></i>
                <span class="text-[10px] md:text-sm font-black uppercase tracking-widest">RIWAYAT TERKUNCI (READ-ONLY)</span>
            </div>` : ''}

            <div id="step-1" class="${isNewEntry ? 'block' : 'hidden'} h-full overflow-y-auto p-8 fade-in">
                <div class="max-w-5xl mx-auto">
                    <div class="mb-8 text-center">
                        <h2 class="text-3xl font-black text-slate-800 mb-2">Mulai Assessment Baru</h2>
                        <p class="text-slate-500">Pilih template kasus atau alat bantu di bawah ini untuk memulai pengisian data pasien <span class="font-bold text-blue-600">${state.selectedPatient.name}</span>.</p>
                    </div>
                    <div class="mb-8">
                        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Clinical Tools</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button onclick="openOutcomeModal()" class="bg-white p-6 rounded-2xl shadow-sm border-2 border-emerald-100 hover:border-emerald-500 hover:shadow-md transition-all text-left group">
                                <div class="flex items-center gap-4 mb-3">
                                    <div class="bg-emerald-100 p-3 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><i data-lucide="calculator" width="24"></i></div>
                                    <div><h4 class="font-bold text-slate-800 text-lg">Kalkulator Klinis</h4><p class="text-xs text-slate-500">Outcome Measure (ODI, SPADI, dll)</p></div>
                                </div>
                            </button>
                            <button onclick="openCopyAssessmentModal()" class="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-100 hover:border-blue-500 hover:shadow-md transition-all text-left group">
                                <div class="flex items-center gap-4 mb-3">
                                    <div class="bg-blue-100 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><i data-lucide="copy" width="24"></i></div>
                                    <div><h4 class="font-bold text-slate-800 text-lg">Salin Sebelumnya</h4><p class="text-xs text-slate-500">Pilih dan gunakan data kunjungan sebelumnya</p></div>
                                </div>
                            </button>
                            <button onclick="goToFormManual()" class="bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-200 hover:border-slate-400 hover:shadow-md transition-all text-left group">
                                <div class="flex items-center gap-4 mb-3">
                                    <div class="bg-slate-100 p-3 rounded-xl text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors"><i data-lucide="edit-3" width="24"></i></div>
                                    <div><h4 class="font-bold text-slate-800 text-lg">Isi Manual</h4><p class="text-xs text-slate-500">Formulir kosong tanpa template</p></div>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div class="mb-1">
                        <div class="flex flex-col md:flex-row justify-between items-center mb-4 border-b border-slate-200 pb-4 gap-4">
                            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest self-start md:self-center">Pilih Template Kasus (ICF)</h3>
                            
                            <div class="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                                <!-- Box Pencarian Template -->
                                <div class="relative w-full md:w-64">
                                    <i data-lucide="search" class="absolute left-3 top-2.5 text-slate-400" width="16"></i>
                                    <input type="text" id="icf-search" onkeyup="handleTemplateSearch(this.value)" value="${templateSearchQuery}" placeholder="Cari kasus (misal: HNP)..." class="pl-10 w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
                                </div>
                            </div>
                        </div>

                        <div id="icf-selection-container">
                            <div class="flex flex-wrap gap-2 justify-center mb-3">
                                ${['Semua', 'Muskulo', 'Neuro', 'Pediatri', 'Geriatri', 'Sport', 'Kardio'].map(cat => `
                                    <button onclick="setTemplateCategory('${cat}')" class="text-[10px] uppercase px-3 py-1.5 rounded-full font-bold transition-all border ${currentTemplateCategory === cat ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}">${cat}</button>
                                `).join('')}
                            </div>

                            <!-- Sub-Filter Regio -->
                            <div class="mb-6 flex flex-wrap gap-2 items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter mr-2 shrink-0">Filter Regio:</span>
                                ${(() => {
            const regions = ['Semua'];
            Object.keys(ICF_TEMPLATES).forEach(t => {
                const item = ICF_TEMPLATES[t];
                if (currentTemplateCategory === 'Semua' || item.category === currentTemplateCategory) {
                    if (item.region && !regions.includes(item.region)) regions.push(item.region);
                }
            });
            const sortedRegions = ['Semua', ...regions.filter(r => r !== 'Semua').sort()];
            return sortedRegions.map(reg => `
                                        <button onclick="setTemplateRegion('${reg}')" class="text-[9px] font-bold px-3 py-1.5 rounded-lg transition-all border shrink-0 ${currentTemplateRegion === reg ? 'bg-slate-800 text-white border-slate-800 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-400'}">${reg}</button>
                                    `).join('');
        })()}
                            </div>
                            <div id="icf-template-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[200px]">
                                ${renderTemplateGrid()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="step-2" class="${isNewEntry ? 'hidden' : 'flex'} flex-col h-full bg-slate-100 fade-in">
                <div class="bg-white px-4 md:px-8 py-4 border-b border-slate-200 shadow-sm flex justify-between items-center shrink-0 z-20">
                    <div class="flex items-center gap-2 md:gap-4">
                        <button onclick="showStep1()" class="p-1.5 md:p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors" title="Kembali ke Template"><i data-lucide="arrow-left" width="20"></i></button>
                        <div>
                            <h2 class="text-lg md:text-xl font-black text-slate-800 leading-tight">Form Assessment</h2>
                            <div class="flex items-center gap-1 text-[10px] md:text-sm text-slate-500">
                                Pasien: <span class="font-bold text-blue-600 truncate max-w-[120px] md:max-w-none">${state.selectedPatient.name}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 md:gap-3">
                        <button type="button" onclick="openOutcomeModal()" class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] md:text-sm font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors">
                            <i data-lucide="calculator" width="14"></i> <span class="hidden md:inline">Kalkulator</span>
                        </button>
                        <div class="h-6 md:h-8 w-px bg-slate-300 mx-0.5 md:mx-1"></div>
                        
                        <!-- EDITABLE ASSESSMENT DATE (BACKDATE SUPPORT) -->
                        <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg group hover:border-blue-400 transition-all cursor-pointer">
                            <i data-lucide="calendar" width="14" class="text-slate-400 group-hover:text-blue-500 transition-colors"></i>
                            <input type="date" id="asm-date" value="${data.date}" onchange="updateForm('date', this.value)" 
                                class="text-[10px] md:text-sm font-black text-slate-600 bg-transparent border-none outline-none focus:ring-0 p-0 cursor-pointer">
                        </div>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto p-4 md:p-8 space-y-8" id="main-form-scroll">
                    <div class="max-w-5xl mx-auto space-y-8 pb-10">
                        <div class="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div class="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4"><div class="bg-blue-600 text-white p-2 rounded-lg shadow-blue-200 shadow-md"><h3 class="font-black text-lg">01</h3></div><div><h3 class="font-bold text-lg text-slate-800">Diagnosa & Anamnesis</h3><p class="text-xs text-slate-400">Identitas medis</p></div></div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div><label class="text-xs font-bold text-slate-500 uppercase mb-2 block">Diagnosa Fisioterapi</label><input type="text" id="form-diagnosis" value="${data.diagnosis}" onchange="updateForm('diagnosis', this.value)" class="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-blue-500 outline-none text-base font-bold text-slate-700 bg-slate-50/50" placeholder="Pilih template di halaman depan..."></div>
                                <div><label class="text-xs font-bold text-slate-500 uppercase mb-2 block">Kode ICD-10</label><input type="text" id="form-icd" value="${data.icd || ''}" onchange="updateForm('icd', this.value)" class="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-blue-500 outline-none text-base font-mono text-slate-600 bg-slate-50/50"></div>
                            </div>

                            <!-- CLINICAL LINKAGES (NEW) -->
                            ${(() => {
            const diagName = (data.diagnosis || '').trim();
            const t = ICF_TEMPLATES[diagName];
            if (!t || !t.msi_linkage || t.msi_linkage.length === 0) return '';
            const linkages = t.msi_linkage.map(l =>
                `<button type="button" onclick="openHMSWizard(); switchHMSTab('msi');" class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black border border-blue-200 hover:bg-blue-600 hover:text-white transition-all shadow-sm">🔍 Assessment ${l.charAt(0).toUpperCase() + l.slice(1)}</button>`
            ).join('');
            return `
                                <div class="mb-6 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                                    <h4 class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <i data-lucide="info" width="12"></i> Rekomendasi Assessment Terkait (Recommended Assessments)
                                    </h4>
                                    <div class="flex flex-wrap gap-2">${linkages}</div>
                                </div>`;
        })()}
                            <div class="mb-6"><label class="text-xs font-bold text-slate-500 uppercase mb-2 block">List Kode ICF</label><input type="text" id="form-icf-codes" value="${data.icf_codes || ''}" onchange="updateForm('icf_codes', this.value)" class="w-full border border-blue-100 bg-blue-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono text-blue-700"></div>
                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase mb-2 block">Anamnesis</label>
                                <textarea id="form-custom-assessment" onkeyup="handleAnamnesisTyping(this.value)" onchange="updateForm('custom_assessment', this.value)" class="w-full border-2 border-slate-200 p-4 rounded-xl h-40 focus:border-blue-500 outline-none resize-none text-base leading-relaxed text-slate-700" placeholder="Ketik keluhan pasien di sini...">${data.custom_assessment}</textarea>
                                
                                <!-- [IDE 4] SMART SUGGESTIONS AREA -->
                                <div id="anamnesis-suggestions" class="mt-3 flex flex-wrap gap-2 transition-all"></div>
                            </div>
                            
                            <!-- PEDIATRIC HISTORY (Conditional) -->
                            ${currentTemplateCategory === 'Pediatri' ? `
                            <div class="mt-6 pt-6 border-t border-slate-100 space-y-4">
                                <h4 class="text-sm font-black text-blue-600 uppercase italic">Riwayat Tumbuh Kembang (Pediatri)</h4>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div><label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Prenatal (Kehamilan)</label><textarea onchange="updateForm('prenatal', this.value)" class="w-full border border-slate-200 p-3 rounded-lg text-sm bg-slate-50/50 focus:border-blue-400 outline-none" style="height: 120px; min-height: 120px; display: block;" placeholder="...">${data.prenatal || ''}</textarea></div>
                                    <div><label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Natal (Persalinan)</label><textarea onchange="updateForm('natal', this.value)" class="w-full border border-slate-200 p-3 rounded-lg text-sm bg-slate-50/50 focus:border-blue-400 outline-none" style="height: 120px; min-height: 120px; display: block;" placeholder="...">${data.natal || ''}</textarea></div>
                                    <div><label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Postnatal (Setelah Lahir)</label><textarea onchange="updateForm('postnatal', this.value)" class="w-full border border-slate-200 p-3 rounded-lg text-sm bg-slate-50/50 focus:border-blue-400 outline-none" style="height: 120px; min-height: 120px; display: block;" placeholder="...">${data.postnatal || ''}</textarea></div>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                        
                        <!-- [NEW] 02: TANDA-TANDA VITAL (TTV) -->
                        <div class="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mt-2">
                            <div class="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <div class="bg-rose-600 text-white p-2 rounded-lg shadow-rose-200 shadow-md">
                                    <h3 class="font-black text-lg">02</h3>
                                </div>
                                <div>
                                    <h3 class="font-bold text-lg text-slate-800">Tanda-Tanda Vital (TTV)</h3>
                                    <p class="text-xs text-slate-400">Tekanan darah, nadi, pernapasan, dan suhu</p>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">TD (mmHg)</label>
                                    <input type="text" value="${data.ttv_td || ''}" onchange="updateForm('ttv_td', this.value)" class="w-full text-sm border-2 border-slate-200 rounded-xl px-3 py-2.5 shadow-sm outline-none focus:border-rose-500 bg-slate-50 font-bold" placeholder="120/80">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">HR (bpm)</label>
                                    <input type="text" value="${data.ttv_hr || ''}" onchange="updateForm('ttv_hr', this.value)" class="w-full text-sm border-2 border-slate-200 rounded-xl px-3 py-2.5 shadow-sm outline-none focus:border-rose-500 bg-slate-50 font-bold" placeholder="80">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">RR (x/mnt)</label>
                                    <input type="text" value="${data.ttv_rr || ''}" onchange="updateForm('ttv_rr', this.value)" class="w-full text-sm border-2 border-slate-200 rounded-xl px-3 py-2.5 shadow-sm outline-none focus:border-rose-500 bg-slate-50 font-bold" placeholder="20">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Suhu (°C)</label>
                                    <input type="text" value="${data.ttv_temp || ''}" onchange="updateForm('ttv_temp', this.value)" class="w-full text-sm border-2 border-slate-200 rounded-xl px-3 py-2.5 shadow-sm outline-none focus:border-rose-500 bg-slate-50 font-bold" placeholder="36.5">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">SpO2 (%)</label>
                                    <input type="text" value="${data.ttv_spo2 || ''}" onchange="updateForm('ttv_spo2', this.value)" class="w-full text-sm border-2 border-slate-200 rounded-xl px-3 py-2.5 shadow-sm outline-none focus:border-rose-500 bg-slate-50 font-bold" placeholder="98">
                                </div>
                            </div>
                        </div>

                        <!-- [RESEQUENCED] 03: SPECIAL TESTS SECTION -->
                        <div class="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mt-2">
                            <div class="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <div class="bg-indigo-600 text-white p-2 rounded-lg shadow-indigo-200 shadow-md">
                                    <h3 class="font-black text-lg">03</h3>
                                </div>
                                <div>
                                    <h3 class="font-bold text-lg text-slate-800">Tes Spesifik (Provocation)</h3>
                                    <p class="text-xs text-slate-400">Pemeriksaan provokasi klinis spesifik regio</p>
                                </div>
                            </div>
                            <div id="special-tests-list-area" class="space-y-4">
                                ${renderSpecialTestsList(data)}
                            </div>
                        </div>
                        
                        <!-- [REDESIGNED] 04: OBJEKTIF DATA (ROM, MMT, BALANCE) -->
                        <div class="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mt-2">
                            <div class="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <div class="bg-blue-600 text-white p-2 rounded-lg shadow-blue-200 shadow-md">
                                    <h3 class="font-black text-lg">04</h3>
                                </div>
                                <div>
                                    <h3 class="font-bold text-lg text-slate-800">Pengukuran Objektif</h3>
                                    <p class="text-xs text-slate-400">ROM, MMT (Dexter & Sinister), dan Keseimbangan</p>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <!-- ROM D/S -->
                                <div class="col-span-1 md:col-span-3 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div class="flex items-center gap-2 mb-4"><i data-lucide="compass" width="16" class="text-blue-600"></i><span class="text-sm font-black text-slate-600 uppercase tracking-widest">ROM (Lingkup Gerak Sendi)</span></div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <!-- ROM DEXTRA ISOM -->
                                        ${(() => {
            const d = parseRomISOM(data.rom_d);
            const cfg = ROM_ISOM_CONFIG[d.plane] || ROM_ISOM_CONFIG['S'];
            return `
                                            <div id="rom-isom-area-d" class="flex flex-col gap-3">
                                                <div class="flex justify-between items-center bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                                                    <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">Sisi Dextra (D)</span>
                                                    <span id="rom-preview-d" class="text-xs font-black text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 shadow-sm">${data.rom_d || 'S 0-0-0'}</span>
                                                </div>
                                                <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                                                    <div class="flex flex-col gap-1">
                                                        <label class="text-[9px] font-bold text-slate-400 uppercase text-center">Plane</label>
                                                        <select onchange="updateRomISOM('D', 'plane', this.value)" class="border-2 border-slate-200 rounded-xl p-2.5 text-sm font-black bg-white outline-none focus:border-blue-500 transition-all text-center">
                                                            ${['S', 'F', 'T', 'R'].map(p => `<option value="${p}" ${p === d.plane ? 'selected' : ''}>${p}</option>`).join('')}
                                                        </select>
                                                    </div>
                                                    <div class="flex flex-col gap-1">
                                                        <label class="text-[9px] font-bold text-slate-400 uppercase text-center isom-label">${cfg.l1}</label>
                                                        <input type="text" value="${d.v1}" onchange="updateRomISOM('D', 'v1', this.value)" class="border-2 border-slate-200 rounded-xl p-2.5 text-sm font-black text-center outline-none focus:border-blue-500 transition-all" placeholder="0°">
                                                    </div>
                                                    <div class="flex flex-col gap-1">
                                                        <label class="text-[9px] font-bold text-slate-400 uppercase text-center isom-label">${cfg.l2}</label>
                                                        <input type="text" value="${d.v2}" onchange="updateRomISOM('D', 'v2', this.value)" class="border-2 border-slate-200 rounded-xl p-2.5 text-sm font-black text-center outline-none focus:border-blue-500 transition-all" placeholder="0°">
                                                    </div>
                                                    <div class="flex flex-col gap-1">
                                                        <label class="text-[9px] font-bold text-slate-400 uppercase text-center isom-label">${cfg.l3}</label>
                                                        <input type="text" value="${d.v3}" onchange="updateRomISOM('D', 'v3', this.value)" class="border-2 border-slate-200 rounded-xl p-2.5 text-sm font-black text-center outline-none focus:border-blue-500 transition-all" placeholder="0°">
                                                    </div>
                                                </div>
                                                <div id="rom-narrative-d" class="text-[10px] italic">
                                                    ${getRomClinicalNarrative(d.v2)}
                                                </div>
                                            </div>`;
        })()}

                                        <!-- ROM SINISTRA ISOM -->
                                        ${(() => {
            const s = parseRomISOM(data.rom_s);
            const cfg = ROM_ISOM_CONFIG[s.plane] || ROM_ISOM_CONFIG['S'];
            return `
                                            <div id="rom-isom-area-s" class="flex flex-col gap-3">
                                                <div class="flex justify-between items-center bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                                                    <span class="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Sisi Sinistra (S)</span>
                                                    <span id="rom-preview-s" class="text-xs font-black text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 shadow-sm">${data.rom_s || 'S 0-0-0'}</span>
                                                </div>
                                                <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                                                    <div class="flex flex-col gap-1">
                                                        <label class="text-[9px] font-bold text-slate-400 uppercase text-center">Plane</label>
                                                        <select onchange="updateRomISOM('S', 'plane', this.value)" class="border-2 border-slate-200 rounded-xl p-2.5 text-sm font-black bg-white outline-none focus:border-indigo-500 transition-all text-center">
                                                            ${['S', 'F', 'T', 'R'].map(p => `<option value="${p}" ${p === s.plane ? 'selected' : ''}>${p}</option>`).join('')}
                                                        </select>
                                                    </div>
                                                    <div class="flex flex-col gap-1">
                                                        <label class="text-[9px] font-bold text-slate-400 uppercase text-center isom-label">${cfg.l1}</label>
                                                        <input type="text" value="${s.v1}" onchange="updateRomISOM('S', 'v1', this.value)" class="border-2 border-slate-200 rounded-xl p-2.5 text-sm font-black text-center outline-none focus:border-indigo-500 transition-all" placeholder="0°">
                                                    </div>
                                                    <div class="flex flex-col gap-1">
                                                        <label class="text-[9px] font-bold text-slate-400 uppercase text-center isom-label">${cfg.l2}</label>
                                                        <input type="text" value="${s.v2}" onchange="updateRomISOM('S', 'v2', this.value)" class="border-2 border-slate-200 rounded-xl p-2.5 text-sm font-black text-center outline-none focus:border-indigo-500 transition-all" placeholder="0°">
                                                    </div>
                                                    <div class="flex flex-col gap-1">
                                                        <label class="text-[9px] font-bold text-slate-400 uppercase text-center isom-label">${cfg.l3}</label>
                                                        <input type="text" value="${s.v3}" onchange="updateRomISOM('S', 'v3', this.value)" class="border-2 border-slate-200 rounded-xl p-2.5 text-sm font-black text-center outline-none focus:border-indigo-500 transition-all" placeholder="0°">
                                                    </div>
                                                </div>
                                                <div id="rom-narrative-s" class="text-[10px] italic">
                                                    ${getRomClinicalNarrative(s.v2)}
                                                </div>
                                            </div>`;
        })()}
                                    </div>
                                    <div class="mt-4">
                                        <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Sendi / Gerakan</label>
                                        <input type="text" placeholder="Contoh: Flexion Knee, Abduction Shoulder..." value="${data.obj.rom_part || '-'}" onchange="updateFormObj('rom_part', this.value)" class="w-full text-sm border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 bg-white font-bold">
                                    </div>
                                </div>

                                <!-- MMT D/S -->
                                <div class="col-span-1 md:col-span-3 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div class="flex items-center gap-2 mb-4"><i data-lucide="zap" width="16" class="text-amber-600"></i><span class="text-sm font-black text-slate-600 uppercase tracking-widest">MMT (Nilai Otot)</span></div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="flex flex-col gap-2">
                                            <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest">Sisi Dextra (D)</span>
                                            <select onchange="updateForm('mmt_d', this.value)" class="border-2 border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 bg-white w-full outline-none focus:border-amber-500 transition-all">
                                                ${['0', '1', '2', '3', '4', '5'].map(o => `<option value="${o}" ${o === String(data.mmt_d || '5') ? 'selected' : ''}>${o}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <span class="text-[10px] font-black text-orange-500 uppercase tracking-widest">Sisi Sinistra (S)</span>
                                            <select onchange="updateForm('mmt_s', this.value)" class="border-2 border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 bg-white w-full outline-none focus:border-amber-500 transition-all">
                                                ${['0', '1', '2', '3', '4', '5'].map(o => `<option value="${o}" ${o === String(data.mmt_s || '5') ? 'selected' : ''}>${o}</option>`).join('')}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mt-4">
                                        <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Grup Otot</label>
                                        <input type="text" placeholder="Contoh: Quadriceps, Hamstrings..." value="${data.obj.mmt_part || '-'}" onchange="updateFormObj('mmt_part', this.value)" class="w-full text-sm border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 bg-white font-bold">
                                    </div>
                                </div>

                                <!-- BALANCE (REMAINING 1/3) -->
                                <div class="col-span-1 md:col-span-3 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div class="flex items-center gap-2 mb-3"><i data-lucide="shield" width="16" class="text-emerald-600"></i><span class="text-xs font-black text-slate-600 uppercase tracking-widest">Keseimbangan</span></div>
                                    <div class="mb-4">
                                        ${renderSelect('Pilih Status', 'balance', data.obj.balance, ['Baik', 'Cukup', 'Buruk', 'Risiko Jatuh'])}
                                    </div>
                                    <p class="text-[10px] text-slate-400 italic">Gunakan standarisasi pengukuran (BBS/TUG) jika diperlukan.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mt-2">
                            <div class="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                                <div class="flex items-center gap-3">
                                    <div class="bg-red-500 text-white p-2 rounded-lg shadow-red-200 shadow-md"><i data-lucide="target" width="20"></i></div>
                                    <div><h3 class="font-bold text-lg text-slate-800">Body Chart (Peta Nyeri)</h3><p class="text-xs text-slate-400">Klik pada gambar untuk menandai lokasi nyeri</p></div>
                                </div>
                                <button type="button" onclick="clearPainPoints()" class="text-xs text-red-600 font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"><i data-lucide="trash-2" width="12" class="inline mb-0.5"></i> Reset</button>
                            </div>
                            <div class="flex justify-center bg-slate-50 py-4 rounded-xl border border-slate-200">
                                <div class="relative w-full max-w-[300px] h-[400px] shadow-inner overflow-hidden group cursor-crosshair bg-white">
                                    <img src="${window.IMG_ASSETS.body_chart}" class="absolute inset-0 w-full h-full object-fill select-none pointer-events-none" alt="Body Chart">
                                    <div id="pain-map-overlay" onclick="addPainPoint(event)" class="absolute inset-0 w-full h-full z-10">
                                        ${(data.pain_points || []).map((p, idx) => `<div onclick="removePainPoint(${idx}, event)" class="absolute w-6 h-6 -ml-3 -mt-3 bg-red-600/90 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold hover:scale-125 transition-transform cursor-pointer animate-bounce-short" style="left: ${p.x}%; top: ${p.y}%;" title="Hapus titik ini">${idx + 1}</div>`).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div class="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4"><div class="bg-indigo-600 text-white p-2 rounded-lg shadow-indigo-200 shadow-md"><h3 class="font-black text-lg">05</h3></div><div><h3 class="font-bold text-lg text-slate-800">Impairment</h3><p class="text-xs text-slate-400">Body Function & Structure</p></div></div>
                            <div class="grid grid-cols-1 gap-6">
                                ${renderSectionBox('Body Function (b)', 'activity', `<div class="bg-slate-100 p-4 rounded-xl mb-4"><label class="flex justify-between text-sm font-bold mb-3 text-slate-700"><span>VAS Nyeri</span> <span class="bg-slate-800 text-white px-3 py-0.5 rounded-full text-xs" id="vas-display">${data.vas} / 10</span></label><input type="range" min="0" max="10" value="${data.vas}" oninput="updateForm('vas', this.value); document.getElementById('vas-display').innerText=this.value;" class="w-full h-2 bg-slate-300 rounded-lg cursor-pointer accent-slate-800 appearance-none"></div>${renderTextAreaWithMenu('b', data.b, 'Body Function')}`, 'b', true)}
                                ${renderSectionBox('Body Structure (s)', 'box', renderTextAreaWithMenu('s', data.s, 'Body Structure'), 's', true)}
                            </div>
                        </div>

                        <div class="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div class="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4"><div class="bg-violet-600 text-white p-2 rounded-lg shadow-violet-200 shadow-md"><h3 class="font-black text-lg">06</h3></div><div><h3 class="font-bold text-lg text-slate-800">Limitation</h3><p class="text-xs text-slate-400">Activity & Participation</p></div></div>
                            <div class="grid grid-cols-1 gap-6">
                                ${renderSectionBox('Activity Limitation (d)', 'alert-circle', renderTextAreaWithMenu('d_act', data.d_act, 'Activity'), 'd_act', true)}
                                ${renderSectionBox('Participation Restriction (d)', 'users', renderTextAreaWithMenu('d_part', data.d_part, 'Participation'), 'd_part', true)}
                            </div>
                        </div>

                        
                        <!-- SECTION 06: HMS ANALYSIS (Logic: Diagnosis before treatment) -->
                        <div class="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500 mt-2">
                            <div class="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <div class="flex items-center gap-3">
                                    <div class="bg-emerald-600 text-white p-2 rounded-lg shadow-emerald-200 shadow-md">
                                        <i data-lucide="activity" width="20"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-bold text-lg text-slate-800">07 Analisis Sistem Gerak (HMS)</h3>
                                        <p class="text-xs text-slate-400">Diagnosis berdasarkan observasi gerakan fungsional</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button type="button" onclick="openHMSWizard()" class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">
                                        <i data-lucide="${data.hms_diagnosis ? 'edit-3' : 'plus-circle'}" width="16"></i> 
                                        ${data.hms_diagnosis ? 'Edit Analisis' : 'Mulai Analisis'}
                                    </button>
                                    ${data.hms_diagnosis ? `
                                    <button type="button" onclick="clearHMSResultFromForm()" class="p-2.5 bg-white border-2 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-xl transition-all" title="Hapus Analisis">
                                        <i data-lucide="trash-2" width="18"></i>
                                    </button>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <div id="hms-summary-area" class="${data.hms_diagnosis ? '' : 'hidden'} bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                <p class="text-[10px] font-black text-emerald-600 uppercase mb-2">Diagnosis Sistem Gerak:</p>
                                <div class="flex items-center gap-2 mb-3">
                                    <i data-lucide="check-circle" width="18" class="text-emerald-600 shrink-0"></i>
                                    <h4 class="text-lg font-bold text-slate-800" id="hms-diagnosis-text">${data.hms_diagnosis || ''}</h4>
                                </div>
                                 ${(() => {
            if (!data.hms_notes) return '';
            let hms = data.hms_notes;
            if (typeof hms === 'string') {
                try { hms = JSON.parse(hms); } catch (e) {
                    return `<p class="text-xs text-slate-500 italic">${data.hms_notes}</p>`;
                }
            }
            if (!hms || typeof hms !== 'object') return '';
            const isMSI = (hms.path === 'msi');
            const isCombined = (hms.path === 'combined');
            let pathLabel = "Neuro / Functional";
            let pathClass = "text-emerald-600 border-emerald-100";
            if (isCombined) {
                pathLabel = "Combined / Multi-Path";
                pathClass = "text-amber-600 border-amber-100";
            } else if (isMSI) {
                pathLabel = "MSI / Structural";
                pathClass = "text-blue-600 border-blue-100";
            }

            const tallyBadges = (hms.tally || []).slice(0, 5).map((t, i) =>
                `<span class="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-lg ${i === 0 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'}">${i === 0 ? '🏆 ' : ''}${t.dx} <span class="opacity-70">(${t.score || t.n})</span></span>`
            ).join('');
            const obsItems = (hms.observations || []).map(o => {
                const corrected = o.isCorrection ? `<span class="ml-1 text-[9px] bg-blue-100 text-blue-600 px-1 rounded font-black italic">CORRECTED ✓</span>` : '';
                return `<li class="text-[10px] text-slate-500 leading-snug mb-1 pb-1 border-b border-emerald-50 last:border-0"><b class="text-slate-600">[${o.protocol}]</b> ${o.text}${corrected}</li>`;
            }).join('');
            return `
                                        <div class="border-t border-emerald-200 mt-3 pt-3 space-y-4">
                                            <div class="flex items-center justify-between">
                                                <p class="text-[9px] font-black text-slate-400 uppercase">Assessment Path</p>
                                                <span class="text-[9px] font-black ${pathClass} uppercase bg-white px-2 py-0.5 rounded-full border shadow-sm">${pathLabel}</span>
                                            </div>
                                            <div>
                                                <p class="text-[9px] font-black text-slate-400 uppercase mb-2">Tally Hasil Analisis</p>
                                                <div class="flex flex-wrap gap-1.5">${tallyBadges}</div>
                                            </div>
                                            <div>
                                                <p class="text-[9px] font-black text-slate-400 uppercase mb-2">Daftar Observasi & Tes Koreksi</p>
                                                <ul class="space-y-0.5 list-none max-h-40 overflow-y-auto custom-scroll pr-2">${obsItems}</ul>
                                            </div>
                                        </div>`;
        })()}
                            </div>
                            
                            ${!data.hms_diagnosis ? `<div class="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl"><p class="text-sm text-slate-400 italic">Belum ada analisis sistem gerak yang dilakukan.</p></div>` : ''}

                        </div>

                        <!-- [NEW] 08: INTERVENTION SECTION (FULL WIDTH) -->
                        <div class="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mt-2">
                            <div class="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <div class="bg-cyan-600 text-white p-2 rounded-lg shadow-cyan-200 shadow-md">
                                    <h3 class="font-black text-lg">08</h3>
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-bold text-lg text-slate-800">Intervensi Fisioterapi</h3>
                                    <p class="text-xs text-slate-400">Program tindakan dan modalitas fungsional</p>
                                </div>
                            </div>
                            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex-1">
                                ${renderCheckboxGroup('intervention', data.intervention)}
                                <div class="mt-6 pt-4 border-t border-slate-200 flex gap-3">
                                    <input type="text" id="custom-intervention" placeholder="+ Tambah intervensi manual (Ketik & Enter)..." class="flex-1 text-sm border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all shadow-sm" onkeydown="if(event.key === 'Enter') addCustomItem('intervention')">
                                    <button type="button" onclick="addCustomItem('intervention')" class="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100">Add Item</button>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div class="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4"><div class="bg-emerald-600 text-white p-2 rounded-lg shadow-emerald-200 shadow-md"><h3 class="font-black text-lg">09</h3></div><div><h3 class="font-bold text-lg text-slate-800">Evaluasi & Rencana</h3></div></div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 class="text-xs font-bold mb-3 text-slate-500 uppercase">Hasil Evaluasi</h4>
                                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[160px] space-y-2" id="group-eval">
                                        ${renderListItems('eval')}
                                    </div>
                                    <div class="flex gap-2 mt-3">
                                        <input type="text" id="custom-eval" placeholder="Ketik hasil evaluasi..." class="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:border-blue-500 outline-none" onkeydown="if(event.key === 'Enter') addCustomItem('eval')">
                                        <button type="button" onclick="addCustomItem('eval')" class="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg text-sm font-bold transition-colors shadow-sm">Add</button>
                                    </div>
                                </div>
                                <div>
                                    <h4 class="text-xs font-bold mb-3 text-slate-500 uppercase">Catatan Tambahan</h4>
                                    <textarea id="form-plan" onchange="updateForm('plan', this.value)" class="w-full border-2 border-slate-200 p-4 rounded-xl h-40 focus:border-blue-500 outline-none resize-none text-base text-slate-700 bg-white" placeholder="Catatan atau instruksi tambahan (Opsional)...">${data.plan || ''}</textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Section Rontgen (Penyempurnaan v2.1) -->
                        <div class="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mt-6">
                            <div class="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <div class="bg-amber-600 text-white p-2 rounded-lg shadow-amber-200 shadow-md">
                                    <i data-lucide="image" width="20"></i>
                                </div>
                                <div>
                                    <h3 class="font-bold text-lg text-slate-800">Penunjang Medis (Rontgen/MRI)</h3>
                                    <p class="text-xs text-slate-400">Upload foto atau scan hasil pemeriksaan</p>
                                </div>
                            </div>
                            <div class="flex flex-col md:flex-row gap-6 items-start">
                                <div class="w-full md:w-1/2">
                                    <label class="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            <i data-lucide="upload-cloud" class="text-slate-400 group-hover:text-blue-500 mb-2 transition-colors"></i>
                                            <p class="mb-2 text-sm text-slate-500"><span class="font-bold">Klik untuk upload</span></p>
                                            <p class="text-[10px] text-slate-400">PNG, JPG, atau PDF (Max 10MB)</p>
                                        </div>
                                        <input type="file" class="hidden" accept="image/*,.pdf" onchange="handleRontgenUpload(this)">
                                    </label>
                                </div>
                                <div id="rontgen-preview-box" class="w-full md:w-1/2 min-h-[160px] bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center relative overflow-hidden">
                                     ${data.rontgen_url ? `<a href="${data.rontgen_url}" target="_blank" class="flex flex-col items-center gap-2 group"><i data-lucide="file-text" width="48" class="text-blue-500"></i><span class="text-xs font-bold text-blue-600 group-hover:underline">Lihat Dokumen Exist</span></a>` : `<p class="text-xs text-slate-400 italic">Belum ada file diupload</p>`}
                                </div>
                            </div>
                        <!-- Section Informed Consent Digital (v2.4) -->
                                                ${state.pdfConfig.showInformedConsent ? `
                        <div class="bg-blue-50 p-6 md:p-8 rounded-2xl border-2 border-blue-100 shadow-sm mt-6 fade-in">
                            <div class="flex items-start gap-4">
                                <div class="shrink-0 mt-1">
                                    <input type="checkbox" id="form-is-consented" ${data.is_consented ? 'checked' : ''} 
                                        ${isLocked ? 'disabled' : `onchange="updateForm('is_consented', this.checked); if(this.checked) updateForm('consent_timestamp', new Date().toLocaleString('id-ID'));"`} 
                                        class="w-6 h-6 accent-blue-600 rounded ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}">
                                </div>
                                <div class="flex-1">
                                    <label for="form-is-consented" class="font-bold text-slate-800 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'} select-none">
                                        Persetujuan Tindakan (Informed Consent)
                                    </label>
                                    <p class="text-xs text-slate-500 mt-1 leading-relaxed">
                                        Saya telah menjelaskan prosedur, risiko, dan manfaat tindakan fisioterapi kepada pasien/wali, dan mereka <strong>MENYETUJUI</strong> tindakan tersebut secara sadar.
                                    </p>
                                    ${data.consent_timestamp ? `<p class="text-[10px] text-blue-600 font-bold mt-2 flex items-center gap-1"><i data-lucide="clock" width="10"></i> Disetujui pada: ${data.consent_timestamp}</p>` : ''}
                                    
                                    <div class="mt-4 pt-4 border-t border-blue-100 flex flex-col sm:flex-row items-center gap-4">
                                        <button type="button" ${isLocked ? `onclick="showToast('Persetujuan terkunci.', 'info')"` : 'onclick="openSignatureModal()"'}
                                            class="flex items-center gap-2 px-4 py-2 ${isLocked ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-xl text-sm font-bold shadow-md transition-all">
                                            <i data-lucide="pen-tool" width="16"></i>
                                            ${data.patient_signature ? 'Ulangi Tanda Tangan' : 'Tanda Tangan Pasien'}
                                        </button>
                                        <div id="signature-preview" class="${data.patient_signature ? 'block' : 'hidden'} bg-white p-2 rounded-lg border border-blue-200">
                                            <img src="${data.patient_signature || ''}" class="h-16 w-auto" alt="Signature preview">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>` : ''}

                        </div>

                        
                        <div class="p-4 bg-white border-t border-slate-200 flex flex-col-reverse md:flex-row justify-between items-center gap-3 shadow-sm rounded-2xl border border-slate-200">
                            <button type="button" onclick="navigate('assessments')" class="w-full md:w-auto px-6 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors text-sm border border-slate-200 md:border-transparent">Batal</button>
                            <div class="flex gap-3 w-full md:w-auto">
                                <button type="button" onclick="showStep1()" class="flex-1 md:flex-none px-4 md:px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors text-sm border border-slate-200 text-center"><span class="md:hidden">&lt; Back</span> <span class="hidden md:inline">&lt; Kembali</span></button>
                                <button type="button" ${isLocked ? `onclick="showToast('Riwayat ini bersifat permanen dan tidak dapat diubah.', 'info')"` : 'onclick="saveAssessment()"'} 
                                    class="flex-[2] md:flex-none px-4 md:px-8 py-3 ${isLocked ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 btn-press text-sm">
                                    <i data-lucide="${isLocked ? 'lock' : 'save'}" width="18"></i> 
                                    <span>${isLocked ? 'Locked' : 'Simpan'}</span> 
                                    <span class="hidden md:inline">${isLocked ? '' : 'Data'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    `;
    lucide.createIcons();

    // RESTORE SCROLL (with a small delay to ensure DOM is ready)
    if (scrollEl) {
        setTimeout(() => {
            const newScrollEl = document.getElementById('main-form-scroll');
            if (newScrollEl) newScrollEl.scrollTop = oldScroll;
        }, 50);
    }
}

function renderTemplateGrid() {
    const templates = Object.keys(ICF_TEMPLATES).filter(t => {
        const item = ICF_TEMPLATES[t];
        const matchesCat = currentTemplateCategory === 'Semua' || item.category === currentTemplateCategory;
        const matchesReg = currentTemplateRegion === 'Semua' || item.region === currentTemplateRegion;
        const matchesSearch = t.toLowerCase().includes(templateSearchQuery.toLowerCase());
        return matchesCat && matchesReg && matchesSearch;
    });

    if (templates.length === 0) {
        return `<div class="col-span-full text-center py-10 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center gap-2">
            <i data-lucide="search-x" width="40" class="opacity-20"></i>
            <span>Tidak menemukan template yang cocok dengan pencarian <strong>"${templateSearchQuery}"</strong> di kategori <strong>${currentTemplateCategory}</strong></span>
        </div>`;
    }

    return templates.map(t => `
        <button onclick="selectTemplateAndGo('${t.replace(/"/g, '&quot;').replace(/'/g, '\\\'')}')" class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 transition-all text-left group h-full relative overflow-hidden">
            <div class="flex items-start justify-between relative z-10">
                <span class="font-bold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">${t}</span>
                <i data-lucide="arrow-right" class="text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all shrink-0" width="16"></i>
            </div>
            <div class="mt-3 flex flex-wrap gap-1 relative z-10">
                <span class="text-[9px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">ICD: ${ICF_TEMPLATES[t].icd || '-'}</span>
                ${ICF_TEMPLATES[t].region ? `<span class="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-bold">${ICF_TEMPLATES[t].region}</span>` : ''}
                ${ICF_TEMPLATES[t].category ? `<span class="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 font-bold uppercase">${ICF_TEMPLATES[t].category}</span>` : ''}
            </div>
        </button>
    `).join('');
}

function renderSectionBox(title, icon, content, key, hideCustomInput = false) {
    return `<div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
        <div class="flex items-center gap-2 mb-4 text-blue-700 border-b border-blue-50 pb-2 shrink-0"><div class="p-1.5 bg-blue-100 rounded-lg"><i data-lucide="${icon}" width="18"></i></div><h3 class="font-bold text-sm uppercase tracking-wide">${title}</h3></div>
        <div class="flex-1">${content}</div>
        ${!hideCustomInput ? `<div class="mt-4 pt-3 border-t border-slate-100 flex gap-2 shrink-0"><input type="text" id="custom-${key}" placeholder="+ Tambah item..." class="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-500 outline-none" onkeydown="if(event.key === 'Enter') addCustomItem('${key}')"><button type="button" onclick="addCustomItem('${key}')" class="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 rounded-lg text-xs font-bold transition-colors">Add</button></div>` : ''}
    </div>`;
}

function renderTextAreaWithMenu(key, currentValue, title) {
    const valStr = Array.isArray(currentValue) ? currentValue.join('\n') : (currentValue || '');
    // [IDE 3] Gunakan Smart Picker untuk key ICF (b, s, d_act, d_part)
    const isICF = ['b', 's', 'd_act', 'd_part'].includes(key);
    const pickerIcon = isICF ? 'brain-circuit' : 'list-plus';
    const pickerFn = isICF ? `openSmartICFPicker('${key}', '${title}')` : `openItemPicker('${key}', '${title}')`;
    const pickerColor = isICF ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100';

    return `<div class="flex flex-col w-full h-full"> 
        <div class="flex justify-between items-center mb-2">
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">${isICF ? '✨ Smart Recommendation Engine' : 'Ketik manual / Pilih item'}</p>
            <button type="button" onclick="${pickerFn}" class="text-xs ${pickerColor} px-3 py-1.5 rounded-lg border font-black flex items-center gap-1.5 transition-all shadow-sm">
                <i data-lucide="${pickerIcon}" width="14"></i> ${isICF ? 'Smart Picker' : 'Pilih Item'}
            </button>
        </div>
        <textarea id="form-${key}" onchange="updateForm('${key}', this.value)" class="w-full h-48 border-2 border-slate-200 rounded-xl p-4 focus:border-blue-500 outline-none text-base leading-relaxed resize-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-medium" placeholder="Deskripsi ${title}...">${valStr}</textarea>
    </div>`;
}

function renderCheckboxGroup(key, currentItems) {
    return `<div class="grid grid-cols-1 gap-2" id="group-${key}">${renderListItems(key)}</div>`;
}

function renderListItems(category) {
    const list = window.tempFormData[category] || [];
    if (list.length === 0) {
        return `<div class="h-full flex items-center justify-center text-sm text-slate-400 italic p-4">Belum ada ${category === 'eval' ? 'catatan evaluasi' : 'item dipilih'}</div>`;
    }

    if (category === 'eval') {
        return list.map(item => `
            <div class="flex items-center gap-2 p-3 rounded-lg bg-white border border-slate-200 text-sm text-slate-700 shadow-sm">
                <i data-lucide="check-circle" width="16" class="text-emerald-500"></i> 
                <span class="flex-1">${item}</span>
                <button type="button" onclick="toggleFormItem('eval', '${item.replace(/"/g, '&quot;').replace(/'/g, '\\\'')}')" class="text-slate-300 hover:text-red-500 transition-colors">
                    <i data-lucide="x" width="16"></i>
                </button>
            </div>`).join('');
    }

    // Default for checkboxes (Intervention)
    return list.map(item => `
        <label class="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer text-sm border select-none bg-blue-50 text-blue-700 border-blue-100 transition-colors hover:bg-blue-100">
            <input type="checkbox" checked onchange="toggleFormItem('${category}', '${item.replace(/"/g, '&quot;').replace(/'/g, '\\\'')}')" class="accent-blue-600 w-4 h-4 rounded">
            <span class="leading-none">${item}</span>
        </label>`).join('');
}

function renderSelect(label, objKey, val, options) {
    return `<div class="flex flex-col gap-1"><span class="text-xs text-slate-500 font-bold uppercase">${label}</span><select onchange="updateFormObj('${objKey}', this.value)" class="border border-slate-300 rounded-lg p-2 text-slate-800 bg-white w-full outline-none text-sm focus:ring-1 focus:ring-blue-500">${options.map(o => `<option ${o === val ? 'selected' : ''}>${o}</option>`).join('')}</select></div>`;
}

function renderFormSelect(label, objKey, val, options, tiny = false) {
    return `
    <div class="flex flex-col gap-1">
        <span class="${tiny ? 'text-[9px]' : 'text-xs'} text-slate-500 font-bold uppercase">${label}</span>
        <select onchange="updateFormObj('${objKey}', this.value)" class="border border-slate-200 rounded-lg ${tiny ? 'p-1 text-[10px]' : 'p-2 text-sm'} text-slate-800 bg-white w-full outline-none focus:ring-1 focus:ring-blue-500">
            ${options.map(o => `<option value="${o}" ${o === val ? 'selected' : ''}>${o}</option>`).join('')}
        </select>
    </div>`;
}

function updateForm(key, val) {
    if (window.tempFormData && (window.tempFormData.is_locked === true || window.tempFormData.is_locked === 'true')) return;
    window.tempFormData[key] = val;
}
function updateFormObj(key, val) {
    if (window.tempFormData && (window.tempFormData.is_locked === true || window.tempFormData.is_locked === 'true')) return;
    window.tempFormData.obj[key] = val;
}

// [ISOM HELPERS]
// [ISOM HELPERS ENHANCED]
function parseRomISOM(str) {
    if (!str || str === '-' || str === 'Normal') return { plane: 'S', v1: '0', v2: '0', v3: '0' };
    // Handle format: "S: 0 - 0 - 0 [Indikasi...]"
    const parts = str.split(':');
    const plane = parts[0] ? parts[0].trim() : 'S';

    // Clean up the value part: remove anything in brackets and extra spaces
    let valPart = parts[1] || '';
    valPart = valPart.split('[')[0].trim(); // Get "0 - 0 - 0"

    const vals = valPart.split('-').map(v => v.trim());
    return {
        plane: plane,
        v1: vals[0] || '0',
        v2: vals[1] || '0',
        v3: vals[2] || '0'
    };
}

const ROM_ISOM_CONFIG = {
    'S': { name: 'Sagital', l1: 'Ext', l2: '0/Stiff', l3: 'Flex' },
    'F': { name: 'Frontal', l1: 'Abd', l2: '0/Stiff', l3: 'Add' },
    'T': { name: 'Transversal', l1: 'Left/Exo', l2: '0/Stiff', l3: 'Right/Endo' },
    'R': { name: 'Rotasi', l1: 'Left/Exo', l2: '0/Stiff', l3: 'Right/Endo' }
};

function getRomClinicalNarrative(v2, isHtml = true) {
    const val2 = parseInt(v2) || 0;
    if (val2 !== 0) {
        if (isHtml) return `<span class="text-rose-600 font-black">⚠️ Indikasi: Kaku pada ${val2}°</span>`;
        return `Kaku pada ${val2}°`;
    }
    if (isHtml) return `<span class="text-slate-400 font-bold">✓ Indikasi: Awal 0° (Normal)</span>`;
    return `Normal`;
}

function updateRomISOM(side, field, val) {
    const key = `rom_${side.toLowerCase()}`;
    const current = parseRomISOM(window.tempFormData[key] || '');
    current[field] = val;

    // Canonical format: "Plane: V1 - V2 - V3 [Narrative]"
    const narrativeText = getRomClinicalNarrative(current.v2, false);
    const formattedData = `${current.plane}: ${current.v1} - ${current.v2} - ${current.v3} [${narrativeText}]`;
    const formattedDisplay = `${current.plane}: ${current.v1} - ${current.v2} - ${current.v3}`;

    updateForm(key, formattedData);

    // Quick re-update of the labels and narrative in UI
    const areaId = `rom-isom-area-${side.toLowerCase()}`;
    const el = document.getElementById(areaId);
    if (el) {
        // Update preview (Display only numbers for UI header)
        const preview = document.getElementById(`rom-preview-${side.toLowerCase()}`);
        if (preview) preview.innerText = formattedDisplay;

        // Update labels if plane changed
        if (field === 'plane') {
            const config = ROM_ISOM_CONFIG[val] || ROM_ISOM_CONFIG['S'];
            const labels = el.querySelectorAll('.isom-label');
            if (labels.length === 3) {
                labels[0].innerText = config.l1;
                labels[1].innerText = config.l2;
                labels[2].innerText = config.l3;
            }
        }

        // Update narrative
        const narrative = document.getElementById(`rom-narrative-${side.toLowerCase()}`);
        if (narrative) narrative.innerHTML = getRomClinicalNarrative(current.v2, true);
    }
}

function toggleFormItem(category, item) {
    if (window.tempFormData && (window.tempFormData.is_locked === true || window.tempFormData.is_locked === 'true')) return;
    const list = window.tempFormData[category];
    const index = list.indexOf(item);
    if (index > -1) list.splice(index, 1);
    else list.push(item);

    updateGroupUI(category);
}

function updateGroupUI(category) {
    const container = document.getElementById(`group-${category}`);
    if (container) {
        container.innerHTML = renderListItems(category);
        lucide.createIcons();
    } else {
        renderAssessmentForm(document.getElementById('main-content'), true);
    }
}

function addCustomItem(category) {
    if (window.tempFormData && (window.tempFormData.is_locked === true || window.tempFormData.is_locked === 'true')) return;
    const input = document.getElementById(`custom-${category}`);
    const val = input.value.trim();
    if (val) {
        window.tempFormData[category].push(val);
        input.value = ''; // Clear input
        updateGroupUI(category);
    }
}

// --- 11. TEMPLATE & SAVING LOGIC ---
function processICFTemplateList(list) {
    if (!list || !Array.isArray(list)) return list;

    // Lazy-load flattened ICF to ensure it exists
    const master = getFlattenedICF();

    // 1. Ambil daftar nama lengkap tes spesifik sebagai referensi (untuk filtering agar tidak double)
    const allTestRef = [];
    Object.values(SPECIAL_TESTS_DB).forEach(regionTests => {
        regionTests.forEach(t => {
            allTestRef.push(t.name.toLowerCase());
            if (t.id) allTestRef.push(t.id.toLowerCase());
        });
    });

    // Mapping sinonim menggunakan kamus global IndonSynonyms
    const indonDict = window.IndonSynonyms || {};

    return list.map(item => {
        const lowerItem = item.toLowerCase().trim();

        // --- STEP 1: FILTERING (Jangan masukkan jika itu Tes Spesifik, biarkan di seksi 02) ---
        const isKnownTest = allTestRef.some(ref => lowerItem.includes(ref));
        const isGenericTestPattern = (lowerItem.includes('test') || lowerItem.includes(' hasil ')) &&
            (lowerItem.includes('(+)') || lowerItem.includes('(-)'));
        if (isKnownTest || isGenericTestPattern) return null;

        // --- STEP 2: RESOLUTION (Ubah teks deskriptif jadi format Kode ICF) ---
        // Jika sudah punya kode (contoh: 'b2801 Nyeri'), biarkan
        if (/^[bsde][0-9]+/i.test(item)) return item;

        // Coba cari kecocokan di Master DB
        let searchKey = lowerItem;
        for (const [idn, eng] of Object.entries(indonDict)) {
            if (lowerItem.includes(idn)) {
                searchKey = eng;
                break;
            }
        }

        // Cari item yang paling mirip di database master (Prioritas exact name, lalu include name, lalu include desc)
        const match = master.find(m => m.name.toLowerCase() === searchKey) ||
            master.find(m => m.name.toLowerCase().includes(searchKey)) ||
            master.find(m => m.desc && m.desc.toLowerCase().includes(searchKey));

        if (match) {
            return `${match.code} (${match.name})`;
        }

        return item; // Tetap kembalikan teks aslinya jika tidak ada match cerdas
    }).filter(x => x !== null);
}

function discoverRelatedICF(diagnosis, key) {
    if (!diagnosis) return [];
    const diagLower = diagnosis.toLowerCase();
    const rawKeywords = diagLower.split(/[\s/.,()]+/).filter(k => k.length > 2);

    // Keyword Expansion with IndonSynonyms
    const keywords = [...rawKeywords];
    if (window.IndonSynonyms) {
        Object.keys(window.IndonSynonyms).forEach(k => {
            if (diagLower.includes(k)) keywords.push(window.IndonSynonyms[k].toLowerCase());
        });
    }

    const master = getFlattenedICF();
    const baseCat = key.split('_')[0]; // Get 'b', 's', 'd', 'e'
    const discovered = [];

    master.forEach(m => {
        if (m.category !== baseCat) return;
        const searchPool = `${m.name} ${m.desc || ''} ${m.inclusions || ''}`.toLowerCase();
        if (keywords.some(k => searchPool.includes(k))) {
            discovered.push(`${m.code} (${m.name})`);
        }
    });

    // Sort by relevance (keyword density) or just return top
    return Array.from(new Set(discovered)).slice(0, 10);
}

function applyTemplate(tName) {
    const t = ICF_TEMPLATES[tName];
    if (!t) return;

    // Base metadata
    window.tempFormData.diagnosis = tName;
    window.tempFormData.icd = t.icd || '';
    window.tempFormData.icf_codes = t.codes || '';

    // Update the UI field immediately if it exists
    const diagInput = document.getElementById('form-diagnosis');
    if (diagInput) diagInput.value = tName;

    // Load & Resolve Clinical Data Arrays
    window.tempFormData.b = processICFTemplateList([...(t.b || [])]);
    window.tempFormData.s = processICFTemplateList([...(t.s || [])]);
    window.tempFormData.d_act = processICFTemplateList([...(t.d_act || [])]);
    window.tempFormData.d_part = processICFTemplateList([...(t.d_part || [])]);

    // --- SMART DISCOVERY PHASE ---
    // Jika data dari template dirasa kurang lengkap (< 8 item), cari tambahan dari Master DB secara otomatis
    ['b', 's', 'd_act', 'd_part'].forEach(key => {
        const currentList = window.tempFormData[key];
        if (currentList.length < 8) {
            const extra = discoverRelatedICF(tName, key);
            extra.forEach(item => {
                if (!currentList.includes(item)) currentList.push(item);
            });
        }
    });

    window.tempFormData.bSize = window.tempFormData.b.length; // Utility

    // Interventions & Evals
    window.tempFormData.intervention = t.intervention ? [...t.intervention] : [];
    window.tempFormData.eval = t.eval ? [...t.eval] : [];

    // Reset secondary analysis
    window.tempFormData.hms_diagnosis = '';
    window.tempFormData.hms_notes = '';

    showToast(`Template ${tName} dimuat dengan Auto-Discovery!`, 'success');
    renderAssessmentForm(document.getElementById('main-content'), true);
}

/**
 * [IDE 5] Open Selection Modal for Previous Assessment
 * Menampilkan daftar riwayat sebelumnya agar user bisa memilih mana yang ingin disalin
 */
function openCopyAssessmentModal() {
    if (!state.selectedPatient) return;

    const list = state.assessments
        .filter(a => String(a.patientId) === String(state.selectedPatient.id))
        .sort((a, b) => parseDateSafe(b.date) - parseDateSafe(a.date));

    if (list.length === 0) {
        showToast('Tidak ada data asesmen sebelumnya untuk pasien ini.', 'warning');
        return;
    }

    let html = `
        <div class="p-6 relative">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-xl font-black text-slate-800 leading-tight">Pilih Riwayat untuk Disalin</h3>
                    <p class="text-xs text-slate-500 mt-1">Diagnosis, ICF, dan Plan akan disalin ke form baru.</p>
                </div>
                <button onclick="closeModal()" class="w-10 h-10 -mr-2 bg-slate-50 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full flex items-center justify-center transition-all">
                    <i data-lucide="x" width="20"></i>
                </button>
            </div>
            
            <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-3 pt-4 custom-scrollbar">
                ${list.map((a, index) => `
                    <button onclick="executeCopyAssessment('${a.id}')" class="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-600 hover:bg-white hover:shadow-lg transition-all group relative mt-2">
                        ${index === 0 ? '<span class="absolute -top-3 left-4 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg z-30 uppercase tracking-widest border-2 border-white">Terbaru / Rekomendasi</span>' : ''}
                        
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex items-center gap-2">
                                <div class="bg-slate-100 p-2 rounded-lg text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <i data-lucide="calendar" width="14"></i>
                                </div>
                                <span class="text-xs font-black text-slate-400 uppercase tracking-tighter">${formatDateForDisplay(a.date)}</span>
                            </div>
                            <i data-lucide="chevron-right" width="20" class="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
                        </div>
                        
                        <div class="font-black text-slate-800 text-base md:text-lg group-hover:text-blue-600 mb-1 transition-colors line-clamp-1">${a.diagnosis || 'Tanpa Diagnosa'}</div>
                        
                        <div class="flex flex-wrap gap-2 mt-2">
                            ${a.icf_codes ? `<div class="bg-indigo-50 text-indigo-600 text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-100">ICF: ${a.icf_codes}</div>` : ''}
                            ${a.icd ? `<div class="bg-slate-50 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200">ICD: ${a.icd}</div>` : ''}
                        </div>
                    </button>
                `).join('')}
            </div>
            
            <div class="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
                <button onclick="closeModal()" class="px-6 py-2.5 text-xs font-black text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all uppercase tracking-widest">Tutup</button>
            </div>
        </div>
    `;

    openModal(html);
}

/**
 * Eksekusi penyalinan data dari assessment tertentu
 */
function executeCopyAssessment(aid) {
    const prev = state.assessments.find(a => String(a.id) === String(aid));
    if (!prev) return;

    if (!confirm('Salin data dari riwayat ini? Data yang sudah Anda ketik akan tertimpa.')) return;

    closeModal();

    // Copy data penting (Diagnosis, ICF, ICD, Anamnesis, Plan)
    window.tempFormData.diagnosis = prev.diagnosis || '';
    window.tempFormData.icd = prev.icd || '';
    window.tempFormData.icf_codes = prev.icf_codes || '';
    window.tempFormData.custom_assessment = prev.custom_assessment || '';

    // Copy ICF Arrays (Deep copy)
    window.tempFormData.b = Array.isArray(prev.b) ? [...prev.b] : [];
    window.tempFormData.s = Array.isArray(prev.s) ? [...prev.s] : [];
    window.tempFormData.d_act = Array.isArray(prev.d_act) ? [...prev.d_act] : [];
    window.tempFormData.d_part = Array.isArray(prev.d_part) ? [...prev.d_part] : [];

    // Copy Plan & Intervention
    window.tempFormData.intervention = Array.isArray(prev.intervention) ? [...prev.intervention] : [];
    window.tempFormData.eval = Array.isArray(prev.eval) ? [...prev.eval] : [];
    window.tempFormData.plan = prev.plan || '';

    // Keep the current date, don't copy the old date!
    window.tempFormData.date = today();

    showToast('Data riwayat berhasil disalin!', 'success');
    showStep2();
    // Force re-render specifically after copying data to ensure UI sync
    renderAssessmentForm(document.getElementById('main-content'), true);
}

function updateUploadBadge() {
    const badge = document.getElementById('nav-assessments-badge');
    if (!badge) return;
    if (state.pendingUploads.length > 0) {
        badge.classList.remove('hidden');
        badge.classList.add('flex');
    } else {
        badge.classList.add('hidden');
        badge.classList.remove('flex');
    }
}

async function processBackgroundUpload(assessmentId, fileData, fileName, patientName) {
    if (!LICENSE_API_URL) return;

    // Tambahkan ke antrean
    if (!state.pendingUploads.includes(assessmentId)) {
        state.pendingUploads.push(assessmentId);
    }
    updateUploadBadge();

    const payload = {
        action: 'upload_file',
        assessmentId: assessmentId, // KIRIM ID UNTUK UPDATE LANGSUNG DI SHEET
        fileData: fileData,
        fileName: fileName,
        patientName: patientName,
        sheet_id: state.sheetId || getSheetIdFromUrl(state.scriptUrl)
    };

    try {
        const response = await fetch(LICENSE_API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });

        const res = await response.json();

        if (res.status === 'success') {
            const idx = state.assessments.findIndex(a => a.id === assessmentId);
            if (idx !== -1) {
                // UPDATE STATE SECARA PERMANEN
                state.assessments[idx].rontgen_url = res.fileUrl;
                state.assessments[idx].uploading = false;
                state.assessments[idx].updatedAt = getServerTimeISO(); // Gunakan fungsi standard 

                // SAVE TO LOCAL STORAGE SEGERA
                saveData();

                // UPDATE UI SECARA INSTAN TANPA REFRESH PENUH
                const preview = document.getElementById('rontgen-preview-box');
                if (preview) {
                    preview.innerHTML = `
                        <a href="${res.fileUrl}" target="_blank" class="flex flex-col items-center gap-2 group animate-bounce-in">
                            <div class="bg-blue-100 p-3 rounded-full text-blue-600 shadow-sm border border-blue-200">
                                <i data-lucide="file-text" width="40"></i>
                            </div>
                            <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:underline">Buka Hasil Rontgen (Cloud)</span>
                        </a>`;
                    lucide?.createIcons();
                }

                showToast('🚀 Link Dokumen Tersimpan!', 'success');
                if (state.scriptUrl) syncDelta(false);
            }
        } else {
            console.error("Background upload failed:", res.message);
        }
    } catch (err) {
        console.error("Background upload error:", err);
        // Bisa ditambahkan retry logic di sini jika perlu
    } finally {
        state.pendingUploads = state.pendingUploads.filter(id => id !== assessmentId);
        updateUploadBadge();
    }
}

function saveAssessment() {
    updateSyncStatusUI('syncing', false); // [IMMEDIATE UI FEEDBACK]
    const data = window.tempFormData;
    if (data && (data.is_locked === true || data.is_locked === 'true')) {
        showToast('Riwayat ini terkunci.', 'warning');
        return;
    }
    if (!data.diagnosis) { alert("Mohon isi diagnosa medis."); return; }

    const fileToUpload = data.rontgen_base64;
    const fileName = data.rontgen_filename;
    const patientName = (state.patients.find(p => p.id === data.patientId)?.name || 'Unknown');

    // Jika ada file rontgen, tandai sedang upload dan bersihkan dari data utama
    if (fileToUpload) {
        data.uploading = true;
        delete data.rontgen_base64;
        delete data.rontgen_filename;
    }

    // SIMPAN DATA UTAMA DULU (NON-BLOCKING)
    finalizeSaveAssessment(data);

    // Jalankan upload di background jika ada file
    if (fileToUpload) {
        processBackgroundUpload(data.id, fileToUpload, fileName, patientName);
    }
}

let signaturePad = null;
function openSignatureModal() {
    if (window.tempFormData && (window.tempFormData.is_locked === true || window.tempFormData.is_locked === 'true')) {
        showToast('Riwayat terkunci.', 'warning');
        return;
    }
    openModal(`
        <div class="p-6">
            <div class="text-center mb-6">
                <h3 class="text-xl font-black text-slate-800">Tanda Tangan Pasien</h3>
                <p class="text-xs text-slate-400">Silakan bubuhkan tanda tangan di dalam area kotak di bawah ini</p>
            </div>
            
            <div class="relative bg-slate-50 border-2 border-slate-200 rounded-2xl overflow-hidden mb-6">
                <canvas id="signature-canvas" class="w-full h-64 touch-none cursor-crosshair"></canvas>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
                <button type="button" onclick="clearSignature()" 
                    class="px-4 py-3 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                    Bersihkan
                </button>
                <button type="button" onclick="closeModal()" 
                    class="px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                    Batal
                </button>
            </div>
            <button type="button" onclick="saveSignature()" 
                class="w-full mt-3 px-6 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all btn-press">
                Simpan Tanda Tangan
            </button>
        </div>
    `);

    // Wait for modal to render to get correct dimensions
    setTimeout(() => {
        const canvas = document.getElementById('signature-canvas');
        if (canvas) {
            const resizeCanvas = () => {
                const ratio = Math.max(window.devicePixelRatio || 1, 1);
                canvas.width = canvas.offsetWidth * ratio;
                canvas.height = canvas.offsetHeight * ratio;
                canvas.getContext("2d").scale(ratio, ratio);
                if (signaturePad) signaturePad.clear(); // Reset if resized
            };

            signaturePad = new SignaturePad(canvas, {
                backgroundColor: 'rgb(255, 255, 255)',
                penColor: 'rgb(0, 0, 0)',
                minWidth: 0.5,
                maxWidth: 2.5
            });

            resizeCanvas();
            window.addEventListener("resize", resizeCanvas);

            // Cleanup listener when modal closes
            const originalClose = window.closeModal;
            window.closeModal = function () {
                window.removeEventListener("resize", resizeCanvas);
                window.closeModal = originalClose;
                originalClose();
            };
            window.closeModal = originalClose;
        }
    }, 100);
}

function clearSignature() {
    if (signaturePad) signaturePad.clear();
}

function saveSignature() {
    if (window.tempFormData && (window.tempFormData.is_locked === true || window.tempFormData.is_locked === 'true')) return;
    if (!signaturePad || signaturePad.isEmpty()) {
        alert("Mohon isi tanda tangan terlebih dahulu.");
        return;
    }

    // Use JPEG with 0.5 quality to keep Base64 string small (< 10KB)
    // This ensures it survives Google Sheets sync without being truncated
    const base64 = signaturePad.toDataURL('image/jpeg', 0.5);
    window.tempFormData.patient_signature = base64;
    window.tempFormData.is_consented = true;
    window.tempFormData.consent_timestamp = new Date().toLocaleString('id-ID');

    // Update UI in Form without full re-render
    const preview = document.getElementById('signature-preview');
    if (preview) {
        preview.classList.remove('hidden');
        preview.innerHTML = `<img src="${base64}" class="h-16 w-auto" alt="Signature preview">`;
    }

    const checkbox = document.getElementById('form-is-consented');
    if (checkbox) checkbox.checked = true;

    // Refresh assessment form to ensure Lucide icons and other state updates correctly
    // or just re-render the consent section? 
    // For simplicity, let's just close modal and let the user see the preview.

    showToast('Tanda tangan berhasil disimpan.', 'success');
    closeModal();
}

async function finalizeSaveAssessment(data) {
    if (data && (data.is_locked === true || data.is_locked === 'true')) {
        showToast('Asesmen terkunci.', 'danger');
        return;
    }
    // ensure diagnosis is not empty (if not using template/manual edit, fallback to patient diagnosis)
    if (!data.diagnosis && state.selectedPatient) {
        data.diagnosis = state.selectedPatient.diagnosis || '';
    }

    if (isReadOnly()) {
        alert("PERINGATAN: Anda sedang membuka Database Arsip (Read-Only). Perubahan tidak dapat disimpan di sini.");
        return;
    }
    const existingIdx = state.assessments.findIndex(a => a.id === data.id);
    if (existingIdx === -1) {
        state.assessments.push(data);
        showToast('Asesmen baru berhasil disimpan local.', 'success');
    } else {
        state.assessments[existingIdx] = data;
        showToast('Update asesmen berhasil disimpan local.', 'success');
    }

    data.updatedAt = getServerTimeISO();
    data._dirty = true; // [FIX] Guarantee immediate sync regardless of lastSync
    closeModal();
    saveData();

    // NON-BLOCKING SYNC: Langsung pindah halaman, sync jalan di background (3s buffer)
    if (state.scriptUrl) syncDelta(false);

    navigate('assessments');
}

window.handleRontgenUpload = async (input) => {
    const file = input.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        alert("File terlalu besar (Maks 10MB)");
        input.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64 = e.target.result;
        window.tempFormData.rontgen_base64 = base64;
        window.tempFormData.rontgen_filename = file.name;

        const preview = document.getElementById('rontgen-preview-box');
        if (preview) {
            if (file.type.startsWith('image/')) {
                preview.innerHTML = `<img src="${base64}" class="w-full h-full object-cover">`;
            } else {
                preview.innerHTML = `<div class="flex flex-col items-center gap-2 py-4"><i data-lucide="file-text" width="48" class="text-blue-500"></i><span class="text-[10px] font-bold text-slate-600 text-center px-4">${file.name}</span></div>`;
                lucide.createIcons();
            }
        }
    };
    reader.readAsDataURL(file);
};

function selectTemplateAndGo(tName) { applyTemplate(tName); showStep2(); }
function goToFormManual() { window.tempFormData.diagnosis = state.selectedPatient ? state.selectedPatient.diagnosis : ''; showStep2(); }
function showStep1() { document.getElementById('step-1').classList.remove('hidden'); document.getElementById('step-2').classList.add('hidden'); }
function showStep2() { document.getElementById('step-1').classList.add('hidden'); document.getElementById('step-2').classList.remove('hidden'); const scrollArea = document.getElementById('main-form-scroll'); if (scrollArea) scrollArea.scrollTop = 0; renderIcons(); }
function updateICFSelectionUI() {
    // Granular update: only rebuild the filter pills and template grid.
    // Does NOT touch Step-2 (form data area) at all, preventing full flicker.
    const container = document.getElementById('icf-selection-container');
    if (!container) {
        // Fallback: full re-render if container not found yet
        renderAssessmentForm(document.getElementById('main-content'), true);
        return;
    }
    // Rebuild region pills
    const regions = ['Semua'];
    Object.keys(ICF_TEMPLATES).forEach(t => {
        const item = ICF_TEMPLATES[t];
        if (currentTemplateCategory === 'Semua' || item.category === currentTemplateCategory) {
            if (item.region && !regions.includes(item.region)) regions.push(item.region);
        }
    });
    const sortedRegions = ['Semua', ...regions.filter(r => r !== 'Semua').sort()];

    // Rebuild category pills html
    const catPillsHtml = ['Semua', 'Muskulo', 'Neuro', 'Pediatri', 'Geriatri', 'Sport', 'Kardio'].map(cat =>
        `<button onclick="setTemplateCategory('${cat}')" class="text-[10px] uppercase px-3 py-1.5 rounded-full font-bold transition-all border ${currentTemplateCategory === cat ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}">${cat}</button>`
    ).join('');

    const regionPillsHtml = sortedRegions.map(reg =>
        `<button onclick="setTemplateRegion('${reg}')" class="text-[9px] font-bold px-3 py-1.5 rounded-lg transition-all border shrink-0 ${currentTemplateRegion === reg ? 'bg-slate-800 text-white border-slate-800 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-400'}">${reg}</button>`
    ).join('');

    container.innerHTML = `
        <div class="flex flex-wrap gap-2 justify-center">
            ${catPillsHtml}
        </div>
        <div class="mb-6 flex flex-wrap gap-2 items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter mr-2 shrink-0">Filter Regio:</span>
            ${regionPillsHtml}
        </div>
        <div id="icf-template-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[200px]">
            ${renderTemplateGrid()}
        </div>
    `;
    renderIcons();
}

function setTemplateCategory(cat) {
    currentTemplateCategory = cat;
    currentTemplateRegion = 'Semua';
    updateICFSelectionUI();
}
function setTemplateRegion(reg) {
    currentTemplateRegion = reg;
    updateICFSelectionUI();
}
const debouncedTemplateSearch = debounce((query) => {
    templateSearchQuery = query;
    const grid = document.getElementById('icf-template-grid');
    if (grid) {
        grid.innerHTML = renderTemplateGrid();
        renderIcons();
    } else {
        renderAssessmentForm(document.getElementById('main-content'), true);
    }
}, 300);

function handleTemplateSearch(query) {
    debouncedTemplateSearch(query);
}

// --- 12. PAIN MAP LOGIC ---
function addPainPoint(event) {
    const rect = event.target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    if (!window.tempFormData.pain_points) window.tempFormData.pain_points = [];
    if (window.tempFormData.pain_points.length >= 10) { alert("Maksimal 10 titik nyeri."); return; }
    window.tempFormData.pain_points.push({ x: x.toFixed(2), y: y.toFixed(2) });
    refreshPainDots();
}

function removePainPoint(index, event) {
    event.stopPropagation();
    if (confirm('Hapus titik ini?')) {
        window.tempFormData.pain_points.splice(index, 1);
        refreshPainDots();
    }
}

function clearPainPoints() {
    if (confirm('Hapus semua titik nyeri?')) {
        window.tempFormData.pain_points = [];
        refreshPainDots();
    }
}

function refreshPainDots() {
    const overlay = document.getElementById('pain-map-overlay');
    if (!overlay) return;
    const points = window.tempFormData.pain_points || [];
    overlay.innerHTML = points.map((p, idx) => `<div onclick="removePainPoint(${idx}, event)" class="pain-point-marker absolute w-6 h-6 -ml-3 -mt-3 bg-red-500/80 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold hover:scale-125 transition-transform cursor-pointer animate-bounce-short" style="left: ${p.x}%; top: ${p.y}%;" title="Hapus titik ini">${idx + 1}</div>`).join('');
}
// --- 13. APPOINTMENT LOGIC ---
function openAppointmentModal(dateStr, apptId = null, prefillData = null) {
    if (dateStr && !apptId && isClinicClosed(dateStr)) {
        showToast("Maaf, klinik tutup pada tanggal tersebut.", "warning");
        return;
    }
    let appt = { id: '', patientId: '', therapistId: state.user.username, date: dateStr, time: '09:00', notes: '', groupId: null, fee: 0 };
    let defaultFreq = 'once';
    let defaultCount = 6;
    let currentPatientName = '';

    let patientQuota = 0;

    if (apptId) {
        appt = state.appointments.find(a => a.id === apptId);
        const p = state.patients.find(pt => pt.id === appt.patientId);
        if (p) {
            currentPatientName = `${p.name} (${p.id})`;
            patientQuota = p.quota || 0;
        }
    } else if (prefillData) {
        appt.patientId = prefillData.patientId;
        const p = state.patients.find(pt => pt.id === prefillData.patientId);
        if (p) {
            appt.fee = p.defaultFee;
            currentPatientName = `${p.name} (${p.id})`;
            patientQuota = p.quota || 0;
        }
    }

    const modalHtml = `
        <div class="bg-white px-6 py-4 border-b flex justify-between items-center sticky top-0 z-20">
            <h3 class="text-xl font-bold text-slate-800">${apptId ? 'Edit Jadwal' : 'Booking Jadwal'}</h3>
            <button onclick="closeModal()" class="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"><i data-lucide="x" width="20"></i></button>
        </div>
        <div class="px-6 py-6 space-y-5 overflow-y-auto modal-scroll flex-1 h-[70vh]">
            <form id="appt-form" autocomplete="off"> <input type="hidden" name="id" value="${appt.id}">
                <input type="hidden" name="groupId" value="${appt.groupId || ''}">
                <div class="space-y-4">
                    <div class="relative">
                        <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Cari Pasien</label>
                        <div class="relative">
                            <i data-lucide="search" class="absolute left-3 top-3 text-slate-400" width="18"></i>
                            <input type="text" id="patient-search-display" value="${currentPatientName}" placeholder="Ketik Nama atau No. RM..." class="w-full border p-2.5 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-bold text-slate-700">
                            <div id="clear-search" class="absolute right-3 top-3 cursor-pointer text-slate-400 hover:text-red-500 hidden"><i data-lucide="x-circle" width="18"></i></div>
                        </div>
                        <input type="hidden" name="patientId" id="patient-id-value" value="${appt.patientId}" required>
                        <div id="patient-search-results" class="hidden absolute top-full left-0 w-full bg-white border border-slate-200 shadow-xl rounded-lg mt-1 max-h-60 overflow-y-auto z-50 divide-y divide-slate-100"></div>
                    </div>
                    <!-- Panduan Klinis (Dinamis) -->
                    <div id="clinical-guidance-box" class="hidden"></div>

                    <!-- Sisa Paket Pasien -->
                    <div id="package-quota-box" class="bg-blue-50/50 p-4 rounded-xl border border-blue-100 ${(!apptId && !prefillData) ? 'hidden' : ''}">
                        <div class="flex items-center gap-2 mb-2">
                            <i data-lucide="package" width="16" class="text-blue-600"></i>
                            <span class="text-[10px] font-black text-blue-800 uppercase tracking-wider">Sisa Paket Pasien</span>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-slate-700 mb-0">Pasien memiliki <span id="patient-quota-display" class="text-blue-600 text-sm">${patientQuota}</span> sesi tersisa.</p>
                        </div>
                    </div>

                    <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
                        <label class="text-xs font-bold text-slate-500 uppercase block mb-2">Tipe Layanan Pasien</label>
                        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <label class="flex-1 flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border cursor-pointer transition-all ${appt.patientType === 'Klinik' ? 'bg-blue-100 border-blue-400 text-blue-800 ring-1 ring-blue-400' : 'bg-white border-slate-300 hover:bg-slate-50'}">
                                <input type="radio" name="patientType" value="Klinik" class="accent-blue-600 w-4 h-4 shrink-0" ${appt.patientType === 'Klinik' ? 'checked' : ''}>
                                <div class="flex-1"><span class="block font-bold text-xs sm:text-sm"><i data-lucide="building-2" width="14" class="inline mr-1 mb-0.5"></i> Pasien Klinik</span><span class="text-[9px] sm:text-[10px] opacity-70">Datang ke Klinik</span></div>
                            </label>
                            <label class="flex-1 flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border cursor-pointer transition-all ${appt.patientType === 'Home Visit' ? 'bg-green-100 border-green-400 text-green-800 ring-1 ring-green-400' : 'bg-white border-slate-300 hover:bg-slate-50'}">
                                <input type="radio" name="patientType" value="Home Visit" class="accent-green-600 w-4 h-4 shrink-0" ${appt.patientType === 'Home Visit' ? 'checked' : ''}>
                                <div class="flex-1"><span class="block font-bold text-xs sm:text-sm"><i data-lucide="home" width="14" class="inline mr-1 mb-0.5"></i> Pasien Visit</span><span class="text-[9px] sm:text-[10px] opacity-70">Kunjungan Rumah</span></div>
                            </label>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Tanggal Mulai</label><input type="date" name="date" value="${appt.date}" required class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></div>
                        <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Jam</label><input type="time" name="time" value="${appt.time}" required class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></div>
                    </div>
                    <div class="grid grid-cols-1">
                        <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Terapis</label><select name="therapistId" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-bold text-slate-700">${state.users.map(u => `<option value="${u.username}" ${u.username === appt.therapistId ? 'selected' : ''}>${u.name}</option>`).join('')}</select></div>
                    </div>
                    <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Catatan</label><textarea name="notes" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20" placeholder="Contoh: Bawa bola, Cek tensi...">${appt.notes || ''}</textarea></div>
                    ${apptId && appt.groupId ? `<div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200 flex items-start gap-2"><i data-lucide="layers" width="16" class="text-yellow-600 mt-0.5"></i><div><p class="text-xs font-bold text-yellow-800">Bagian dari Paket Terapi</p><p class="text-[10px] text-yellow-700">Jadwal ini terhubung dengan sesi lainnya.</p></div></div>` : ''}
                </div>
            </form>
        </div>
        <div class="bg-slate-50 px-6 py-4 border-t flex justify-between sticky bottom-0 z-20">
            ${apptId ? `<button onclick="showToast('Penghapusan jadwal dinonaktifkan di aplikasi.', 'info')" class="px-4 py-2.5 bg-slate-100 text-slate-400 rounded-lg font-bold cursor-not-allowed text-sm">Hapus Terkunci</button>` : '<div></div>'}
            <div class="flex gap-2">
                <button onclick="closeModal()" class="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm">Batal</button>
                ${appt.status === 'PENDING' ? `
                <button onclick="confirmAppointment('${appt.id}')" class="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition-all btn-press text-sm flex items-center gap-2 font-bold"><i data-lucide="check" width="16"></i> Terima Booking</button>
                ` : `
                <button onclick="saveAppointment()" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all btn-press text-sm flex items-center gap-2 font-bold"><i data-lucide="save" width="16"></i> Simpan</button>
                `}
            </div>
        </div>`;

    document.getElementById('modal-content').innerHTML = modalHtml;
    document.getElementById('modal-container').classList.remove('hidden');
    lucide.createIcons();

    // SEARCH LOGIC
    const searchInput = document.getElementById('patient-search-display');
    const resultBox = document.getElementById('patient-search-results');
    const hiddenInput = document.getElementById('patient-id-value');
    const feeInput = document.getElementById('appt-fee');
    const clearBtn = document.getElementById('clear-search');

    if (searchInput.value) clearBtn.classList.remove('hidden');

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        if (query.length > 0) clearBtn.classList.remove('hidden'); else clearBtn.classList.add('hidden');
        hiddenInput.value = '';
        if (query.length === 0) { resultBox.classList.add('hidden'); return; }
        const matches = state.patients.filter(p => p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query));
        if (matches.length > 0) {
            resultBox.innerHTML = matches.map(p => `
                <div class="p-3 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between items-center group" onclick="selectPatientSearch('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.defaultFee || 0}, ${p.quota || 0})">
                    <div><div class="font-bold text-slate-700 text-sm group-hover:text-blue-700">${p.name}</div><div class="text-[10px] text-slate-400 font-mono">${p.id} ${p.nik ? `• ${p.nik}` : ""} • ${p.diagnosis || "-"}</div></div>
                    <div class="text-xs font-bold text-slate-400 group-hover:text-blue-600">Pilih</div>
                </div>`).join('');
            resultBox.classList.remove('hidden');
        } else {
            resultBox.innerHTML = `<div class="p-4 text-center text-xs text-slate-400 italic">Pasien tidak ditemukan.</div>`;
            resultBox.classList.remove('hidden');
        }
    });

    clearBtn.addEventListener('click', function () {
        searchInput.value = ''; hiddenInput.value = '';
        if (feeInput) feeInput.value = 0;
        resultBox.classList.add('hidden'); this.classList.add('hidden'); searchInput.focus();
    });

    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !resultBox.contains(e.target)) resultBox.classList.add('hidden');
    });

    // If pre-filled (edit mode), render guidance
    if (appt.patientId) renderClinicalGuidance(appt.patientId);
}

function renderClinicalGuidance(patientId) {
    const box = document.getElementById('clinical-guidance-box');
    if (!box) return;

    // Get latest assessment
    const lastAss = [...(state.assessments || [])]
        .filter(a => a.patientId === patientId)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    if (!lastAss) {
        box.classList.add('hidden');
        return;
    }

    box.innerHTML = `
        <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mt-2 fade-in">
            <div class="flex items-center gap-2 mb-3 border-b border-blue-100 pb-2">
                <i data-lucide="info" width="16" class="text-blue-600"></i>
                <span class="text-xs font-black text-blue-800 uppercase tracking-wider">Panduan Klinis Asesmen Terakhir</span>
            </div>
            <div class="space-y-3">
                ${lastAss.eval && lastAss.eval.length > 0 ? `
                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Hasil Evaluasi:</label>
                    <div class="text-[11px] text-slate-700 bg-white/50 p-2 rounded-lg border border-blue-50 leading-relaxed italic">
                        ${lastAss.eval.map(e => `• ${e}`).join('<br>')}
                    </div>
                </div>` : ''}
                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Rencana Selanjutnya:</label>
                    <div class="inline-block px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-full shadow-sm">
                        ${lastAss.plan || 'Belum diisi'}
                    </div>
                </div>
            </div>
        </div>
    `;
    box.classList.remove('hidden');
    lucide.createIcons();
}

window.selectPatientSearch = function (id, name, fee, quota = 0) {
    document.getElementById('patient-search-display').value = `${name} (${id})`;
    document.getElementById('patient-id-value').value = id;
    document.getElementById('patient-search-results').classList.add('hidden');
    document.getElementById('clear-search').classList.remove('hidden');

    const quotaBox = document.getElementById('package-quota-box');
    if (quotaBox) {
        quotaBox.classList.remove('hidden');
        document.getElementById('patient-quota-display').innerText = quota;
    }

    renderClinicalGuidance(id);
};

window.applyPackageToAppointment = (packageId) => {
    const pkg = (state.packages || []).find(p => p.id === packageId);
    if (!pkg) return;
    const freqSelect = document.getElementById('appt-frequency');
    const countInput = document.getElementById('appt-packet-count');
    const countBox = document.getElementById('packet-count-box');
    if (countInput) countInput.value = pkg.sessions;
    if (freqSelect) {
        if (pkg.sessions > 1) {
            if (freqSelect.value === 'once') {
                freqSelect.value = '2x';
                if (countBox) countBox.classList.remove('hidden');
            }
        } else {
            freqSelect.value = 'once';
            if (countBox) countBox.classList.add('hidden');
        }
    }
};

window.togglePacketCount = (val) => {
    const box = document.getElementById('packet-count-box');
    if (box) {
        if (val === 'once') box.classList.add('hidden'); else box.classList.remove('hidden');
    }
};

function saveAppointment() {
    updateSyncStatusUI('syncing', false); // [IMMEDIATE UI FEEDBACK]
    const form = document.getElementById('appt-form');
    const id = form.querySelector('[name="id"]').value;
    const patientId = form.querySelector('[name="patientId"]').value;
    const date = form.querySelector('[name="date"]').value;
    const time = form.querySelector('[name="time"]').value;
    const therapistId = form.querySelector('[name="therapistId"]').value;
    const notes = form.querySelector('[name="notes"]').value;
    const patientType = form.querySelector('[name="patientType"]:checked')?.value || 'Klinik';


    if (!patientId || !date || !time) { alert("Data wajib diisi!"); return; }

    // Security Guard: Prevent booking on closed dates
    if (isClinicClosed(date)) {
        showToast("Maaf, klinik tutup pada tanggal pilihan tersebut.", "danger");
        return;
    }

    // Conflict Detection
    const isConflict = state.appointments.some(a =>
        a.id !== id &&
        a.date === date &&
        a.time === time &&
        a.therapistId === therapistId
    );

    if (isConflict) {
        const therapistName = state.users.find(u => u.username === therapistId)?.name || therapistId;
        if (!confirm(`Warning: Terapis ${therapistName} sudah memiliki jadwal lain di jam ${time} tanggal ${date}. Tetap simpan?`)) {
            return;
        }
    }

    const updates = { patientId, time, therapistId, notes, patientType, fee: 0, updatedAt: getServerTimeISO() };

    // No local quota deduction here, it's handled in Kasir

    if (id) {
        const originalAppt = state.appointments.find(a => a.id === id);
        if (originalAppt && originalAppt.groupId) {
            showSeriesOptions("Edit Jadwal Berulang", "Apakah Anda ingin mengubah jadwal ini saja atau seluruh paket?",
                () => { // Single
                    const idx = state.appointments.findIndex(a => a.id === id);
                    if (idx > -1) {
                        state.appointments[idx] = { ...state.appointments[idx], ...updates, date, id: id, groupId: null };
                        finalizeSave();
                    }
                },
                () => { // All
                    state.appointments.forEach(a => {
                        if (a.groupId === originalAppt.groupId) {
                            a.time = time; a.therapistId = therapistId; a.notes = notes;
                            a.updatedAt = getServerTimeISO();
                        }
                    });
                    const idx = state.appointments.findIndex(a => a.id === id);
                    if (idx > -1) {
                        state.appointments[idx].date = date;
                        state.appointments[idx].id = id; // Ensure ID preserved
                    }
                    finalizeSave();
                }
            );
            return;
        } else {
            const idx = state.appointments.findIndex(a => a.id === id);
            if (idx > -1) { state.appointments[idx] = { ...state.appointments[idx], ...updates, date, id: id }; finalizeSave(); }
        }
    } else {
        const newId = `APT${Date.now()}`;

        // [New Logic] Deduct Quota AT BOOKING time
        const pIdx = state.patients.findIndex(p => p.id === patientId);
        if (pIdx > -1 && state.patients[pIdx].quota > 0) {
            state.patients[pIdx].quota -= 1;
            state.patients[pIdx].updatedAt = getServerTimeISO();
            updates.paymentMethod = 'Paket';
            updates.fee = 0;
            console.log(`Booking Baru: Potong Kuota di Depan. Sisa: ${state.patients[pIdx].quota}`);
        }

        state.appointments.push({ id: newId, date, ...updates, groupId: null, _dirty: true });
        finalizeSave();
    }
}

/**
 * Utility to prevent duplicates in local state
 */
function deduplicateAppointments(arr) {
    if (!arr || arr.length === 0) return [];

    // [AUTO-FIX] Normalize keys that might be destroyed by Google Apps Script `norm()`
    arr.forEach(a => {
        if (a.patientid && !a.patientId) a.patientId = a.patientid;
        if (a.therapistid && !a.therapistId) a.therapistId = a.therapistid;
        if (a.patienttype && !a.patientType) a.patientType = a.patienttype;
        if (a.paymentstatus && !a.paymentStatus) a.paymentStatus = a.paymentstatus;
        if (a.paymentmethod && !a.paymentMethod) a.paymentMethod = a.paymentmethod;
        if (a.finalamount && !a.finalAmount) a.finalAmount = a.finalamount;
        if (a.groupid && !a.groupId) a.groupId = a.groupid;
        if (a.paidat && !a.paidAt) a.paidAt = a.paidat;
        if (a.visitorname && !a.visitor_name) a.visitor_name = a.visitorname;
        if (a.visitorcontact && !a.visitor_contact) a.visitor_contact = a.visitorcontact;
        if (a.updatedat && !a.updatedAt) a.updatedAt = a.updatedat;
    });

    const map = new Map();
    // Sort by updatedAt descending to keep newest in case of conflict
    const sorted = [...arr].sort((a, b) => {
        const t1 = new Date(a.updatedAt || 0).getTime();
        const t2 = new Date(b.updatedAt || 0).getTime();
        return t2 - t1;
    });

    const unique = [];
    const seenKeys = new Set();

    const normalizeTime = (t) => {
        if (!t) return "00:00";
        const clean = String(t).replace('.', ':');
        if (clean.includes(':')) {
            const parts = clean.split(':');
            const h = parts[0].padStart(2, '0');
            const m = parts[1].padStart(2, '0');
            return `${h}:${m}`;
        }
        return clean.padStart(5, '0');
    };

    sorted.forEach(item => {
        // Business logic unique key: same patient, same date, same time (normalized)
        const normT = normalizeTime(item.time);
        const key = `${item.patientId}_${item.date}_${normT}`;

        if (!seenKeys.has(item.id) && !seenKeys.has(key)) {
            unique.push({ ...item, time: normT }); // Update to normalized time for consistency
            seenKeys.add(item.id);
            seenKeys.add(key);
        }
    });

    return unique.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

function generateSeries(startDate, count, freq) {
    const dates = [];
    const current = new Date(startDate);
    const step = (freq === '1x') ? 7 : (freq === '2x') ? 3 : (freq === '3x') ? 2 : 1;
    for (let i = 0; i < count; i++) {
        dates.push(new Date(current).toISOString().split('T')[0]);
        current.setDate(current.getDate() + step);
    }
    return dates;
}

async function confirmAppointment(id, fromUrl = false) {
    const idx = state.appointments.findIndex(a => a.id === id);
    if (idx > -1) {
        // [NEW] If called from Modal, extract current form data first so changes (Clinic/Visit, Notes) are NOT lost
        const form = document.getElementById('appt-form');
        if (form && !fromUrl) {
            const patientType = form.querySelector('[name="patientType"]:checked')?.value;
            const notes = form.querySelector('[name="notes"]')?.value;
            const date = form.querySelector('[name="date"]')?.value;
            const time = form.querySelector('[name="time"]')?.value;
            const therapistId = form.querySelector('[name="therapistId"]')?.value;

            if (patientType) state.appointments[idx].patientType = patientType;
            if (notes !== undefined) state.appointments[idx].notes = notes;
            if (date) state.appointments[idx].date = date;
            if (time) state.appointments[idx].time = time;
            if (therapistId) state.appointments[idx].therapistId = therapistId;
        }

        // Apply confirmation status
        state.appointments[idx].status = 'CONFIRMED';
        state.appointments[idx].updatedAt = new Date().toISOString();

        // Optimistic UI update
        if (state.currentView === 'schedule') {
            renderScheduleView(document.getElementById('main-content'));
            // Re-open daily modal to reflect change if it was open
            openDailyScheduleModal(state.appointments[idx].date);
        }

        updateSidebarBadges(); // Update badge status immediately

        await saveData();

        if (state.scriptUrl) {
            syncDelta(false);
        }

        if (fromUrl) {
            showToast("Booking ID " + id + " Telah DITERIMA!", "success");
            fetch(state.scriptUrl, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'send_notif',
                    type: 'telegram',
                    message: `✅ Booking ID ${id} telah DITERIMA & Sinkron ke Sistem.`,
                    sheet_id: state.sheetId
                })
            }).catch(e => console.error("Failed to send TG confirmation:", e));
        } else {
            showToast("Booking Berhasil Dikonfirmasi! ✅", "success");
        }
    }
}

function updateSidebarBadges() {
    const pendingCount = (state.appointments || []).filter(a => a.status === 'PENDING').length;
    const badge = document.getElementById('nav-badge-schedule');
    if (badge) {
        if (pendingCount > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

function deleteAppointment(id, fromUrl = false) {
    const appt = state.appointments.find(a => a.id === id);
    if (!appt) return;

    const performDelete = () => {
        trackDelete(id);
        // Refund logic: Return quota if the appointment was using 'Paket'
        if (appt.paymentMethod === 'Paket') {
            const pIdx = state.patients.findIndex(pt => pt.id === appt.patientId);
            if (pIdx > -1) {
                state.patients[pIdx].quota = (state.patients[pIdx].quota || 0) + 1;
                state.patients[pIdx].updatedAt = getServerTimeISO();
                console.log(`Jadwal Dihapus: Refund Kuota Sesi. Sisa: ${state.patients[pIdx].quota}`);
            }
        }
        // [IMMEDIATE] Update local state first for instant UI response
        state.appointments = state.appointments.filter(a => a.id !== id);

        // Track for Delta Sync
        trackDelete(id);
        if (!state.deletedIds.appointments) state.deletedIds.appointments = [];
        // Match what was found in previous step 1144 view
        if (!state.deletedIds) state.deletedIds = { patients: [], assessments: [], appointments: [], users: [], expenses: [], packages: [] };
        if (!state.deletedIds.appointments) state.deletedIds.appointments = [];
        state.deletedIds.appointments.push(id);

        finalizeDelete();
        if (state.scriptUrl) {
            // [Sync Instant]
            syncDelta(false);
        }
        if (fromUrl) {
            showToast("Booking Berhasil DITOLAK/DIHAPUS", "error");
            // Optional: Send notification back to TG that it's rejected
            fetch(state.scriptUrl, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'send_notif',
                    type: 'telegram',
                    message: `❌ Booking ID ${id} telah DITOLAK & Dihapus dari Sistem.`,
                    sheet_id: state.sheetId
                })
            }).catch(e => console.error("Failed to send TG rejection:", e));
        }
    };

    if (fromUrl) {
        performDelete();
    } else if (appt.groupId) {
        showSeriesOptions("Hapus Jadwal Berulang", "Apakah Anda ingin menghapus jadwal ini saja atau seluruh paket?",
            () => {
                performDelete();
            },
            () => {
                const toDel = state.appointments.filter(a => a.groupId === appt.groupId).map(a => a.id);
                state.deletedIds.appointments.push(...toDel);
                state.appointments = state.appointments.filter(a => a.groupId !== appt.groupId);
                finalizeDelete();
            }
        );
    } else {
        // No more browser confirm for simple single deletes if we want it to be "enteng"
        // But for safety, keep one small alert if it's a single appointment trash icon click
        if (confirm('Hapus/Tolak jadwal ini?')) {
            performDelete();
        }
    }
}

async function finalizeSave() {
    if (isReadOnly()) {
        alert("PERINGATAN: Anda sedang membuka Database Arsip (Read-Only). Perubahan tidak dapat disimpan di sini.");
        return;
    }
    closeModal();
    document.getElementById('choice-modal').classList.add('hidden');
    await saveData();
    if (state.scriptUrl) syncDelta(false);
    if (state.currentView === 'schedule') renderScheduleView(document.getElementById('main-content'));
    else navigate('schedule');
}

async function finalizeDelete() {
    if (isReadOnly()) {
        alert("PERINGATAN: Anda sedang membuka Database Arsip (Read-Only). Perubahan tidak dapat disimpan di sini.");
        return;
    }
    closeModal();
    document.getElementById('choice-modal').classList.add('hidden');
    await saveData();
    if (state.scriptUrl) syncDelta(false);
    renderScheduleView(document.getElementById('main-content'));
}

function showSeriesOptions(title, message, onSingle, onSeries) {
    const modal = document.getElementById('choice-modal');
    document.getElementById('choice-title').innerText = title;
    document.getElementById('choice-desc').innerText = message;
    const btnOne = document.getElementById('btn-choice-one');
    const btnAll = document.getElementById('btn-choice-all');
    const newBtnOne = btnOne.cloneNode(true);
    const newBtnAll = btnAll.cloneNode(true);
    btnOne.parentNode.replaceChild(newBtnOne, btnOne);
    btnAll.parentNode.replaceChild(newBtnAll, btnAll);
    newBtnOne.onclick = onSingle;
    newBtnAll.onclick = onSeries;
    modal.classList.remove('hidden');
}

// --- 14. PATIENT MODAL ---
function openPatientModal(id = null) {
    const p = id ? state.patients.find(pat => pat.id === id) : { id: '', nik: '', name: '', gender: 'L', dob: '', phone: '', job: '', address: '', diagnosis: '', category: 'Klinik', quota: 0, is_locked: false };
    if (!p.category) p.category = 'Klinik';
    const isLocked = p.is_locked === true || p.is_locked === 'true';

    const modalHtml = `
        <style>
            /* Scoped Radio UI Fix - Category only (adjacent sibling works here) */
            #patient-form input[name="category"][value="Klinik"]:checked + label { background-color: #dbeafe !important; border-color: #60a5fa !important; color: #1e40af !important; box-shadow: 0 0 0 1px #60a5fa; }
            #patient-form input[name="category"][value="Home Visit"]:checked + label { background-color: #ffedd5 !important; border-color: #fb923c !important; color: #9a3412 !important; box-shadow: 0 0 0 1px #fb923c; }
            /* Gender styles applied via JS onclick - CSS fallback below */
            .pat-gen-btn-active-l { background-color: #eff6ff !important; border-color: #60a5fa !important; color: #1d4ed8 !important; }
            .pat-gen-btn-active-p { background-color: #fdf2f8 !important; border-color: #f472b6 !important; color: #be185d !important; }
            .pat-gen-btn-inactive { background-color: #ffffff !important; border-color: #e2e8f0 !important; color: #64748b !important; }
        </style>
        <div class="bg-white px-6 py-4 border-b flex justify-between items-center sticky top-0 z-20 shrink-0">
            <h3 class="text-xl font-bold text-slate-800">${id ? 'Edit Pasien' : 'Pasien Baru'}</h3>
            <button onclick="closeModal()" class="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"><i data-lucide="x" width="20"></i></button>
        </div>
        <div class="px-6 py-6 space-y-5 overflow-y-auto modal-scroll flex-1 min-h-0 max-h-[60vh] md:max-h-[70vh]">
            <form id="patient-form">
                <input type="hidden" name="id" value="${p.id}">
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <label class="text-xs font-bold text-slate-500 uppercase block mb-2">Kategori Layanan</label>
                    <div class="flex gap-3">
                        <input type="radio" id="pat-cat-klinik" name="category" value="Klinik" class="accent-blue-600 w-4 h-4 sr-only" ${p.category === 'Klinik' ? 'checked' : ''}>
                        <label for="pat-cat-klinik" class="flex-1 flex items-center gap-3 p-3 rounded-lg border border-slate-300 bg-white cursor-pointer transition-all hover:bg-slate-50">
                            <div><span class="block font-bold text-sm">Datang ke Klinik</span><span class="text-[10px] opacity-70">Rawat Jalan</span></div>
                        </label>
                        
                        <input type="radio" id="pat-cat-home" name="category" value="Home Visit" class="accent-orange-600 w-4 h-4 sr-only" ${p.category === 'Home Visit' ? 'checked' : ''}>
                        <label for="pat-cat-home" class="flex-1 flex items-center gap-3 p-3 rounded-lg border border-slate-300 bg-white cursor-pointer transition-all hover:bg-slate-50">
                            <div><span class="block font-bold text-sm">Home Visit</span><span class="text-[10px] opacity-70">Kunjungan Rumah</span></div>
                        </label>
                    </div>
                </div>
                <!-- Diagnosa Medis (Pindahkan ke sini agar lebih clean) -->
                <div class="mb-4">
                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Diagnosa Medis Utama</label>
                    <input type="text" name="diagnosis" value="${p.diagnosis}" class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-bold bg-slate-50" placeholder="Diagnosa medis awal...">
                </div>
                <div class="mb-5 bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <label class="text-[11px] font-black text-blue-800 uppercase block mb-2"><i data-lucide="package" width="14" class="inline"></i> Sisa Paket (Sesi)</label>
                    <input type="number" name="quota" value="${p.quota || 0}" class="w-full border-2 border-blue-300 p-2.5 rounded-lg focus:ring-4 focus:ring-blue-500/30 outline-none text-blue-900 font-black text-xl bg-white text-center" placeholder="0">
                    <p class="text-[9px] text-blue-600 font-bold mt-2 leading-tight uppercase">*Ketik sisa kuota pasien manual di sini. Akan dipotong otomatis jika pasien memakai paket saat jadwal terapi.</p>
                </div>
                <div class="space-y-4 ${isLocked ? 'opacity-60 pointer-events-none' : ''}">
                    <!-- NIK & Identity -->
                    <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">NIK (Nomor Induk Kependudukan)</label><input type="text" name="nik" value="${p.nik || ''}" ${isLocked ? 'disabled' : ''} class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-mono" placeholder="16 Digit NIK..."></div>
                    <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Nama Lengkap</label><input type="text" name="name" value="${p.name}" required ${isLocked ? 'disabled' : ''} class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"></div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Gender</label>
                            <div class="flex gap-2">
                                <input type="radio" id="pat-gen-l" name="gender" value="L" class="absolute opacity-0 w-0 h-0 pointer-events-none" ${p.gender === 'L' ? 'checked' : ''}>
                                <div id="lbl-pat-gen-l" role="radio" aria-checked="${p.gender === 'L' ? 'true' : 'false'}" onclick="event.preventDefault();event.stopPropagation();document.getElementById('pat-gen-l').checked=true;updatePatientGenderUI();" class="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all select-none ${p.gender === 'L' ? 'pat-gen-btn-active-l' : 'pat-gen-btn-inactive'}">
                                    <span class="text-xs font-bold">♂ Laki-laki</span>
                                </div>
                                
                                <input type="radio" id="pat-gen-p" name="gender" value="P" class="absolute opacity-0 w-0 h-0 pointer-events-none" ${p.gender === 'P' ? 'checked' : ''}>
                                <div id="lbl-pat-gen-p" role="radio" aria-checked="${p.gender === 'P' ? 'true' : 'false'}" onclick="event.preventDefault();event.stopPropagation();document.getElementById('pat-gen-p').checked=true;updatePatientGenderUI();" class="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all select-none ${p.gender === 'P' ? 'pat-gen-btn-active-p' : 'pat-gen-btn-inactive'}">
                                    <span class="text-xs font-bold">♀ Perempuan</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-xs font-bold text-slate-500 uppercase">Tgl Lahir / Usia</label>
                                <div class="flex bg-slate-100 p-0.5 rounded-md">
                                    <button type="button" id="btn-mode-date" onclick="toggleDobMode('date')" class="px-2 py-0.5 text-[9px] font-black rounded ${p.dob ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}">TGL</button>
                                    <button type="button" id="btn-mode-age" onclick="toggleDobMode('age')" class="px-2 py-0.5 text-[9px] font-black rounded ${!p.dob ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}">USIA</button>
                                </div>
                            </div>
                            <div id="input-box-date" class="${!p.dob ? 'hidden' : ''}">
                                <input type="date" id="inp-dob-date" name="dob" value="${p.dob || ''}" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 text-sm">
                            </div>
                            <div id="input-box-age" class="${p.dob ? 'hidden' : ''}">
                                <div class="relative">
                                    <input type="number" id="inp-dob-age" value="${p.dob ? calculateAge(p.dob) : ''}" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-bold text-sm" placeholder="Umur...">
                                    <span class="absolute right-3 top-2.5 text-xs font-bold text-slate-400">Tahun</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">No. HP / WhatsApp</label><input type="text" name="phone" value="${p.phone || ''}" class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" placeholder="08..."></div>
                        <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Pekerjaan</label><input type="text" name="job" value="${p.job || ''}" class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" placeholder="Karyawan, Guru, dsb..."></div>
                    </div>

                    <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Alamat Lengkap</label><textarea name="address" class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 text-sm min-h-[80px]" placeholder="Alamat tinggal sekarang...">${p.address || ''}</textarea></div>
                    
                    <div class="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <label class="text-[10px] font-black text-rose-800 uppercase block mb-1.5"><i data-lucide="tag" width="12" class="inline"></i> Label / Tag Pasien (Opsional)</label>
                        <input type="text" name="tags" value="${p.tags || ''}" class="w-full border-2 border-rose-200 p-2.5 rounded-lg focus:ring-4 focus:ring-rose-500/20 outline-none text-rose-900 font-bold text-sm bg-white" placeholder="Contoh: RESIKO TINGGI, VIP, dsb...">
                        <p class="text-[9px] text-rose-500 font-medium mt-1.5 leading-tight italic">*Label ini akan muncul berkedip di daftar pasien sebagai pengingat khusus.</p>
                    </div>
                </div>
                
                <div class="mt-6 pt-6 border-t border-slate-100">
                    <label class="flex items-center gap-3 cursor-pointer group">
                        <div class="relative">
                            <input type="checkbox" name="is_locked" class="sr-only" ${isLocked ? 'checked' : ''} onchange="this.nextElementSibling.classList.toggle('bg-blue-600', this.checked); this.nextElementSibling.classList.toggle('bg-slate-300', !this.checked);">
                            <div class="block w-10 h-6 rounded-full transition-colors ${isLocked ? 'bg-blue-600' : 'bg-slate-300'}"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isLocked ? 'translate-x-4' : ''}"></div>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-slate-700 flex items-center gap-1">
                                <i data-lucide="${isLocked ? 'lock' : 'unlock'}" width="14"></i> Kunci Data (Read-Only)
                            </span>
                            <p class="text-[10px] text-slate-400 font-medium">Jika diaktifkan, data ini tidak bisa diubah lagi untuk menjaga validitas history.</p>
                        </div>
                    </label>
                </div>
            </form>
        </div>
        <div class="bg-slate-50 px-6 py-4 border-t flex justify-end gap-3 sticky bottom-0 z-20 shrink-0">
            <button onclick="closeModal()" class="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm">Batal</button>
            <button onclick="submitPatientForm()" class="px-6 py-2.5 ${isLocked ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'} text-white rounded-lg transition-all btn-press text-sm flex items-center gap-2 font-bold"><i data-lucide="${isLocked ? 'lock' : 'save'}" width="16"></i> ${isLocked ? 'Data Terkunci' : 'Simpan Data'}</button>
        </div>
    `;
    document.getElementById('modal-content').innerHTML = modalHtml;
    document.getElementById('modal-container').classList.remove('hidden');
    lucide.createIcons();
}

async function submitPatientForm() {
    updateSyncStatusUI('syncing', false); // [IMMEDIATE UI FEEDBACK]
    if (isReadOnly()) {
        alert("PERINGATAN: Anda sedang membuka Database Arsip (Read-Only). Perubahan tidak dapat disimpan di sini.");
        return;
    }
    const form = document.getElementById('patient-form');
    let finalDob = '';
    const boxDateVisible = !document.getElementById('input-box-date').classList.contains('hidden');
    if (boxDateVisible) {
        finalDob = document.getElementById('inp-dob-date').value;
    } else {
        const ageVal = document.getElementById('inp-dob-age').value;
        if (ageVal) {
            const currentYear = new Date().getFullYear();
            finalDob = `${currentYear - parseInt(ageVal)}-01-01`;
        }
    }

    // Prevention: If data is already locked and user is NOT an admin trying to force something
    const oldP = state.patients.find(pt => pt.id === (form.querySelector('[name="id"]').value));
    if (oldP && (oldP.is_locked === true || oldP.is_locked === 'true')) {
        alert("⚠️ GAGAL: Data ini sudah terkunci dan tidak dapat diubah.");
        return;
    }

    const nikValue = form.querySelector('[name="nik"]').value;

    const newP = {
        id: form.querySelector('[name="id"]').value || generateNextRM(),
        nik: nikValue,
        name: form.querySelector('[name="name"]').value,
        category: form.querySelector('[name="category"]:checked')?.value || 'Klinik',
        gender: form.querySelector('[name="gender"]:checked')?.value || 'L',
        dob: finalDob,
        phone: form.querySelector('[name="phone"]').value,
        job: form.querySelector('[name="job"]').value,
        address: form.querySelector('[name="address"]').value,
        diagnosis: form.querySelector('[name="diagnosis"]').value,
        quota: parseInt(form.querySelector('[name="quota"]')?.value) || 0,
        defaultFee: oldP?.defaultFee || 0,
        tags: (form.querySelector('[name="tags"]')?.value || "").trim(),
        is_locked: form.querySelector('[name="is_locked"]')?.checked || false,
        updatedAt: getServerTimeISO(),
        _dirty: true // [FIX] Always push immediately regardless of lastSync timing
    };

    if (!newP.name) { alert('Nama wajib diisi!'); return; }

    const idx = state.patients.findIndex(p => p.id === newP.id);
    if (idx > -1) state.patients[idx] = newP;
    else state.patients.push(newP);

    closeModal();
    await saveData();
    if (state.scriptUrl) {
        // [Sync Instant] _dirty flag guarantees this gets included in filterDelta
        syncDelta(false);
    }
    renderPatientList(document.getElementById('main-content'));
}

function toggleDobMode(mode) {
    const btnDate = document.getElementById('btn-mode-date');
    const btnAge = document.getElementById('btn-mode-age');
    const boxDate = document.getElementById('input-box-date');
    const boxAge = document.getElementById('input-box-age');

    if (mode === 'date') {
        btnDate.className = "px-3 py-1 text-[10px] font-bold rounded bg-blue-100 text-blue-700 transition-all";
        btnAge.className = "px-3 py-1 text-[10px] font-bold rounded text-slate-500 hover:bg-slate-50 transition-all";
        boxDate.classList.remove('hidden'); boxAge.classList.add('hidden');
    } else {
        btnAge.className = "px-3 py-1 text-[10px] font-bold rounded bg-blue-100 text-blue-700 transition-all";
        btnDate.className = "px-3 py-1 text-[10px] font-bold rounded text-slate-500 hover:bg-slate-50 transition-all";
        boxAge.classList.remove('hidden'); boxDate.classList.add('hidden');
    }
}

/**
 * Updates the visual highlight of gender radio buttons in the patient form.
 * Uses direct classList manipulation — no 'for' or 'onchange' to avoid
 * browser auto-scrolling to sr-only/hidden radio inputs.
 */
function updatePatientGenderUI() {
    const lblL = document.getElementById('lbl-pat-gen-l');
    const lblP = document.getElementById('lbl-pat-gen-p');
    const radL = document.getElementById('pat-gen-l');
    const radP = document.getElementById('pat-gen-p');
    if (!lblL || !lblP || !radL || !radP) return;

    // Reset both
    lblL.classList.remove('pat-gen-btn-active-l', 'pat-gen-btn-active-p', 'pat-gen-btn-inactive');
    lblP.classList.remove('pat-gen-btn-active-l', 'pat-gen-btn-active-p', 'pat-gen-btn-inactive');

    if (radL.checked) {
        lblL.classList.add('pat-gen-btn-active-l');
        lblP.classList.add('pat-gen-btn-inactive');
        lblL.setAttribute('aria-checked', 'true');
        lblP.setAttribute('aria-checked', 'false');
    } else if (radP.checked) {
        lblP.classList.add('pat-gen-btn-active-p');
        lblL.classList.add('pat-gen-btn-inactive');
        lblL.setAttribute('aria-checked', 'false');
        lblP.setAttribute('aria-checked', 'true');
    }
}

// --- 15. CONFIG & USER MGMT ---
function renderConfigView(container, activeTab = 'identity') {
    const conf = state.pdfConfig || {};
    container.innerHTML = `
    <div class="fade-in pb-32">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div class="p-6 border-b border-slate-100"><h2 class="text-2xl font-black text-slate-800">Konfigurasi Sistem</h2><p class="text-slate-500 text-sm">Atur identitas klinik dan tampilan hasil cetak.</p></div>
            <div class="flex bg-slate-50 overflow-x-auto pb-1">
                <button onclick="switchConfigTab('identity')" id="tab-btn-identity" class="px-6 py-3 text-sm font-bold text-blue-600 border-b-2 border-blue-600 bg-white transition-colors flex items-center gap-2"><i data-lucide="building-2" width="16"></i> Identitas Klinik</button>
                <button onclick="switchConfigTab('print')" id="tab-btn-print" class="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2"><i data-lucide="printer" width="16"></i> Layout Cetak (PDF)</button>
                <button onclick="switchConfigTab('notif')" id="tab-btn-notif" class="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2"><i data-lucide="bell" width="16"></i> Notifikasi</button>
                <button onclick="switchConfigTab('system')" id="tab-btn-system" class="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2"><i data-lucide="database" width="16"></i> Data & User</button>
                <button onclick="switchConfigTab('license')" id="tab-btn-license" class="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2"><i data-lucide="crown" width="16"></i> Status Langganan</button>
                <button onclick="switchConfigTab('booking')" id="tab-btn-booking" class="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2"><i data-lucide="calendar-check" width="16"></i> Booking Online</button>
                <button onclick="switchConfigTab('packages')" id="tab-btn-packages" class="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2"><i data-lucide="package" width="16"></i> Layanan & Paket</button>
                <button onclick="switchConfigTab('treatments')" id="tab-btn-treatments" class="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2"><i data-lucide="activity" width="16"></i> Tindakan & Tarif</button>
                <button onclick="switchConfigTab('archives')" id="tab-btn-archives" class="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2"><i data-lucide="archive" width="16"></i> Database Arsip</button>
                <button onclick="switchConfigTab('maintenance')" id="tab-btn-maintenance" class="px-6 py-3 text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2"><i data-lucide="wrench" width="16"></i> Pemeliharaan</button>
            </div>
        </div>

        <div id="tab-content-license" class="config-tab-content hidden">
            <div class="bg-white p-8 rounded-xl shadow border border-slate-200 text-center max-w-2xl mx-auto">
                <div class="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i data-lucide="crown" width="40"></i>
                </div>
                <h3 class="text-2xl font-black text-slate-800 mb-2">Status Berlangganan</h3>
                <p class="text-slate-500 mb-8">Informasi masa aktif lisensi aplikasi Anda.</p>
                
                <div class="grid grid-cols-2 gap-4 text-left max-w-md mx-auto mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100 text-sm">
                    <div class="text-slate-500 font-bold">Paket Saat Ini</div>
                    <div class="font-bold text-slate-800 text-right" id="conf-lic-plan">-</div>
                    
                    <div class="text-slate-500 font-bold">Status</div>
                    <div class="font-bold text-green-600 text-right uppercase" id="conf-lic-status">-</div>
                    
                    <div class="text-slate-500 font-bold">Berlaku Sampai</div>
                    <div class="font-bold text-slate-800 text-right" id="conf-lic-expiry">-</div>
                </div>

                <div class="mb-8">
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SISA WAKTU</div>
                    <div class="text-5xl font-black text-blue-600 font-mono tracking-tight" id="conf-lic-countdown">-- : -- : --</div>
                </div>

                <button onclick="refreshLicenseStatus()" class="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 mx-auto">
                    <i data-lucide="refresh-cw" width="16"></i> Perbarui Status Lisensi
                </button>
            </div>
        </div>

        <div id="tab-content-booking" class="config-tab-content hidden">
            <div class="bg-white p-6 rounded-xl shadow border border-slate-200">
                <div class="flex items-center gap-3 mb-6 border-b pb-4">
                    <div class="p-3 bg-emerald-50 rounded-full text-emerald-600"><i data-lucide="calendar-check" width="24"></i></div>
                    <div><h3 class="font-bold text-lg text-slate-800">Pengaturan Booking Online</h3><p class="text-xs text-slate-500">Buat link booking unik untuk dibagikan ke pasien.</p></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-5">
                        <div>
                            <label class="text-xs font-bold text-slate-500 uppercase block mb-1.5">Alias Klinik (ID Booking)</label>
                            <div class="flex gap-2">
                                <span class="bg-slate-100 text-slate-500 px-3 py-2.5 rounded-l-lg border border-r-0 text-xs font-mono font-bold border-slate-200">booking/?id=</span>
                                <input type="text" id="conf-booking-alias" 
                                    readonly
                                    value="${state.bookingConfig.alias || ''}"
                                    class="flex-1 bg-slate-50 border border-slate-200 p-2.5 rounded-r-lg outline-none text-sm font-mono text-slate-500 cursor-not-allowed">
                            </div>
                            <p class="text-[11px] text-slate-400 mt-1">Huruf kecil, tanpa spasi, gunakan tanda hubung (-). Contoh: <i>klinik-sehat-blitar</i></p>
                        </div>

                        <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-6">
                            <h4 class="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <i data-lucide="info" width="14"></i> Petunjuk Pengoperasian
                            </h4>
                            <p class="text-[10px] text-slate-600 leading-relaxed">
                                <b>1. Jam Buka Default:</b> Pilih jam umum yang berlaku setiap hari.<br>
                                <b>2. Advanced Table:</b> Jika Anda mengisi "JAM" di tabel bawah, maka jam default di atas akan diabaikan khusus untuk hari tersebut.<br>
                                <b>3. Slot/Jam:</b> Mengatur berapa banyak pasien yang bisa booking di jam yang sama (misal: isi 2 jika ada 2 terapis).
                            </p>
                        </div>

                        <div>
                            <label class="text-xs font-bold text-slate-500 uppercase block mb-2">Jam Buka Default (Cepat)</label>
                            <div class="grid grid-cols-4 gap-2">
                                ${['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map(h => {
        const saved = state.bookingConfig.availableHours || '08:00,09:00,10:00,11:00,13:00,14:00,15:00,16:00';
        const isChecked = saved.split(',').includes(h) ? 'checked' : '';
        return `<label class="flex items-center gap-1.5 text-[10px] cursor-pointer hover:bg-slate-50 p-1 rounded border border-slate-100">
                                        <input type="checkbox" value="${h}" ${isChecked} onchange="updateBookingLinkPreview()" class="booking-hour-check w-3 h-3 accent-emerald-500">
                                        <span class="font-bold text-slate-700">${h}</span>
                                    </label>`;
    }).join('')}
                            </div>
                            <p class="text-[9px] text-slate-400 mt-1 italic">Jam ini berlaku setiap hari kerja jika tidak diatur khusus di tabel bawah.</p>
                        </div>

                        <div class="pt-4 border-t border-slate-100">
                            <label class="text-xs font-bold text-slate-500 uppercase block mb-3 flex justify-between items-center">
                                <span>Advanced: Atur Jam & Slot per Hari</span>
                                <span class="bg-blue-100 text-blue-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold">PREMIUM</span>
                            </label>
                            <div class="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                <table class="w-full text-left text-[10px] border-collapse">
                                    <thead class="bg-slate-100 border-b border-slate-200">
                                        <tr>
                                            <th class="px-2 py-2 font-black text-slate-500 w-12">HARI</th>
                                            <th class="px-2 py-2 font-black text-slate-500 text-center w-12">AKTIF</th>
                                            <th class="px-2 py-2 font-black text-slate-500">JAM (Pemisah Koma)</th>
                                            <th class="px-2 py-2 font-black text-slate-500 w-16">SLOT/JAM</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-200">
                                        ${['Mingu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((dayName, idx) => {
        const dayCfg = (state.bookingConfig.dayConfig && state.bookingConfig.dayConfig[idx]) || { active: null, hours: '', slots: 1 };
        const isActive = dayCfg.active === false ? '' : 'checked';
        const hours = dayCfg.hours || '';
        const slots = dayCfg.slots || 1;
        return `
                                        <tr class="bg-white hover:bg-slate-50 transition-colors">
                                            <td class="px-2 py-3 font-bold text-slate-700">${dayName}</td>
                                            <td class="px-2 py-3 text-center">
                                                <input type="checkbox" id="adv-day-active-${idx}" ${isActive} class="adv-day-check w-4 h-4 accent-blue-600 cursor-pointer">
                                            </td>
                                            <td class="px-2 py-3">
                                                <input type="text" id="adv-day-hours-${idx}" value="${hours}" placeholder="08:00, 09:00..." class="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none font-mono text-[9px]">
                                            </td>
                                            <td class="px-2 py-3">
                                                <input type="number" id="adv-day-slots-${idx}" value="${slots}" min="1" max="10" class="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none font-bold text-center">
                                            </td>
                                        </tr>`;
    }).join('')}
                                    </tbody>
                                </table>
                            </div>
                            <p class="text-[9px] text-slate-400 mt-2 leading-tight">
                                💡 <b>Tips:</b> Jika 'Jam' diisi, maka Jam Default di atas akan diabaikan khusus hari tersebut. 
                                Kolom 'Slot' menentukan berapa banyak pasien yang bisa booking di jam yang sama.
                            </p>
                        </div>

                        <div class="pt-4 border-t border-slate-100">
                            <label class="text-xs font-bold text-slate-500 uppercase block mb-2">Hari Libur Rutin (Tutup Otomatis)</label>
                            <div class="grid grid-cols-7 gap-1">
                                ${['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day, i) => {
        const currentOff = (state.bookingConfig.offDays || '').split(',').map(d => d.trim());
        const isChecked = currentOff.includes(String(i)) ? 'checked' : '';
        return `<label class="flex flex-col items-center gap-1 p-1.5 rounded-lg border cursor-pointer ${isChecked ? 'bg-rose-50 border-rose-200 ring-1 ring-rose-100' : 'bg-white border-slate-200'}">
                                        <input type="checkbox" value="${i}" ${isChecked} class="off-day-check w-3 h-3 accent-rose-500">
                                        <span class="text-[9px] font-black ${isChecked ? 'text-rose-700' : 'text-slate-500'}">${day}</span>
                                    </label>`;
    }).join('')}
                            </div>
                        </div>

                        <!-- [NEW] GUI Custom Holidays Manager -->
                        <div class="mt-4 pt-4 border-t border-slate-100">
                            <label class="text-xs font-bold text-slate-500 uppercase block mb-3 flex justify-between items-center">
                                <span>Libur Tanggal Tertentu (Kustom)</span>
                                <div class="flex items-center gap-2">
                                    <input type="date" id="conf-holiday-picker" class="text-[10px] border border-slate-200 rounded p-1 outline-none focus:ring-1 focus:ring-emerald-500">
                                    <button onclick="addCustomHoliday()" class="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-200 transition-all">
                                        <i data-lucide="plus" width="14"></i>
                                    </button>
                                </div>
                            </label>
                            
                            <div id="holiday-list-container" class="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
                                <div class="max-h-32 overflow-y-auto p-2 space-y-2" id="holiday-scroll-area">
                                    <!-- List rendered by renderHolidayList() -->
                                    <div class="text-[10px] text-slate-400 text-center py-4 italic">Belum ada tanggal libur pilihan</div>
                                </div>
                            </div>
                            <p class="text-[10px] text-slate-400 mt-2 italic">Misal: Libur Lebaran, Libur Nasional, dll.</p>
                        </div>

                        <button onclick="saveBookingConfig()" class="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg btn-press flex items-center justify-center gap-2">
                            <i data-lucide="save" width="16"></i> Simpan & Generate Link
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div class="bg-slate-50 p-5 rounded-xl border border-slate-200">
                            <h4 class="font-bold text-slate-700 mb-3 flex items-center gap-2"><i data-lucide="link" width="16"></i> Link Booking Anda</h4>
                            <div id="booking-link-display" class="bg-white p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-500 break-all min-h-[48px] flex items-center">
                                <span class="italic">Isi Alias dan klik Simpan...</span>
                            </div>
                            <button onclick="copyBookingLink()" id="btn-copy-link" class="mt-3 w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2">
                                <i data-lucide="copy" width="14"></i> Salin Link
                            </button>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-700">
                            <p class="font-bold mb-1">📋 Cara Pakai:</p>
                            <ol class="list-decimal list-inside space-y-1 text-xs">
                                <li>Isi Alias unik klinik Anda di kiri.</li>
                                <li>Centang jam-jam yang tersedia.</li>
                                <li>Klik <b>Simpan & Generate Link</b>.</li>
                                <li>Salin link dan bagikan ke pasien (WA, IG, dll).</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="tab-content-packages" class="config-tab-content hidden">
            <div class="bg-white p-6 rounded-xl shadow border border-slate-200">
                <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">Daftar Paket & Layanan</h3>
                        <p class="text-xs text-slate-400">Kelola paket terapi untuk mempermudah pendaftaran pasien</p>
                    </div>
                    <button onclick="openPackageModal()" class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
                        <i data-lucide="plus-circle" width="18"></i> Tambah Paket Baru
                    </button>
                </div>
                
                <div id="package-list-container" class="overflow-x-auto">
                    ${renderPackageTable()}
                </div>
            </div>
        </div>

        <div id="tab-content-treatments" class="config-tab-content hidden">
            <div class="bg-white p-6 rounded-xl shadow border border-slate-200">
                <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">Master Data Tindakan & Layanan</h3>
                        <p class="text-xs text-slate-400">Atur harga satuan untuk setiap alat/tindakan (Konsul, TENS, IR, dll)</p>
                    </div>
                    <button onclick="openTreatmentModal()" class="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
                        <i data-lucide="plus-circle" width="18"></i> Baru
                    </button>
                </div>
                
                <div id="treatment-list-container" class="overflow-x-auto">
                    ${renderTreatmentTable()}
                </div>
            </div>
        </div>
        

        <div id="tab-content-archives" class="config-tab-content hidden">
            ${renderArchiveTab()}
        </div>

        <div id="tab-content-maintenance" class="config-tab-content hidden">
            <div class="bg-white p-6 rounded-xl shadow border border-slate-200">
                <div class="flex items-center gap-3 mb-6 border-b pb-4">
                    <div class="p-3 bg-red-50 rounded-full text-red-600"><i data-lucide="alert-triangle" width="24"></i></div>
                    <div><h3 class="font-bold text-lg text-slate-800">Pemeliharaan & Pemulihan</h3><p class="text-xs text-slate-500">Gunakan alat ini hanya jika terjadi kerusakan data pada Google Sheets.</p></div>
                </div>
                
                <div class="space-y-6">
                    <div class="p-6 bg-red-50 rounded-2xl border border-red-100">
                        <h4 class="font-black text-red-800 mb-2 flex items-center gap-2">
                            <i data-lucide="upload-cloud" width="20"></i>
                            DARURAT: Pulihkan Google Sheets dari Browser
                        </h4>
                        <p class="text-xs text-red-600 mb-6 leading-relaxed">
                            Fitur ini akan menghapus seluruh data yang ada di Google Sheets dan menggantinya <b>PERSIS</b> dengan data yang ada di browser ini. Gunakan fitur ini jika data di Google Sheet berantakan/korup tetapi data di browser Anda masih benar.
                        </p>
                        <button onclick="pushDataToSheet()" class="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-black shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-3">
                            <i data-lucide="zap" width="24"></i>
                            <span>LAKUKAN PEMULIHAN DATA SEKARANG</span>
                        </button>
                    </div>

                    <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                        <h4 class="font-bold text-slate-800 mb-2">Pembersihan Cache Lokal</h4>
                        <p class="text-xs text-slate-500 mb-4">Menghapus data sementara di browser dan memuat ulang dari Sheets.</p>
                        <button onclick="if(confirm('Hapus cache dan muat ulang?')){ localStorage.clear(); location.reload(); }" class="text-slate-600 hover:text-red-600 text-sm font-bold flex items-center gap-2">
                            <i data-lucide="trash-2" width="18"></i>
                            Hapus Seluruh Data Browser (Berbahaya!)
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div id="tab-content-identity" class="config-tab-content hidden">
            <div class="bg-white p-6 rounded-xl shadow border border-slate-200">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Nama Klinik (Judul)</label><input type="text" id="conf-name" value="${state.clinicInfo?.name || ''}" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"></div>
                        <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Sub-Judul / Tagline</label><input type="text" id="conf-sub" value="${state.clinicInfo?.subname || ''}" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"></div>
                        <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Domisili / Kota Klinik</label><input type="text" id="conf-city" value="${state.clinicInfo?.city || ''}" placeholder="Contoh: Blitar" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"></div>
                        <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Nama Fisioterapis (Ttd)</label><input type="text" id="conf-therapist" value="${state.clinicInfo?.therapist || ''}" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"></div>
                    </div>
                    <div class="space-y-4">
                        <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Nomor Izin / SIPF</label><input type="text" id="conf-sipf" value="${state.clinicInfo?.sipf || ''}" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"></div>
                        <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Alamat (Kop Surat)</label><textarea id="conf-address" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24">${state.clinicInfo?.address || ''}</textarea></div>
                        <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">📞 No. Telepon / WA Klinik</label><input type="text" id="conf-phone" value="${state.clinicInfo?.phone || ''}" placeholder="0812-3456-7890" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"></div>
                        <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">🗺️ Maps URL (Link Lokasi)</label><input type="text" id="conf-maps" value="${state.clinicInfo?.mapsUrl || ''}" placeholder="https://maps.app.goo.gl/..." class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"></div>
                        <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">🏷️ NPWP Klinik / Pribadi</label><input type="text" id="conf-npwp" value="${state.clinicInfo?.npwp || ''}" placeholder="00.000.000.0-000.000" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"></div>
                        <!-- LOGO KLINIK SECTION -->
                        <div class="mt-6 pt-6 border-t border-slate-100">
                            <label class="text-xs font-bold text-slate-500 uppercase block mb-3">Logo Klinik (Whitelabel)</label>
                            <div class="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div id="logo-preview-container" class="w-20 h-20 bg-white rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                    ${state.clinicInfo?.logoUrl ? `<img src="${state.clinicInfo.logoUrl}" class="w-full h-full object-contain">` : `<i data-lucide="image" class="text-slate-300" width="32"></i>`}
                                </div>
                                <div class="flex-1 space-y-2">
                                    <p class="text-[10px] text-slate-500 leading-relaxed font-medium">Gunakan logo transparan (PNG) ukuran kotak/lingkaran untuk hasil terbaik di PDF.</p>
                                    <div class="flex gap-2">
                                        <button onclick="document.getElementById('logo-upload-input').click()" class="bg-white border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                                            <i data-lucide="upload-cloud" width="14"></i> Pilih Logo
                                        </button>
                                        ${state.clinicInfo?.logoUrl ? `
                                        <button onclick="removeClinicLogo()" class="text-rose-500 hover:text-rose-700 font-bold text-xs p-1">Hapus</button>
                                        ` : ''}
                                    </div>
                                    <input type="file" id="logo-upload-input" accept="image/*" class="hidden" onchange="handleLogoUpload(event)">
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="mt-6 pt-4 border-t border-slate-100 text-right"><button onclick="saveClinicConfig()" id="btn-save-clinic" class="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg btn-press flex items-center justify-center gap-2 ml-auto"><i data-lucide="save" width="16"></i> Simpan & Sinkron Cloud</button></div>
            </div>
        </div>

        <div id="tab-content-print" class="config-tab-content hidden">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-xl shadow border border-slate-200 h-fit space-y-6">
                    <div><h3 class="font-bold text-slate-800 mb-3 border-b pb-1 text-sm uppercase">Layout</h3><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Kepadatan Teks</label><select onchange="updatePdfConfig('layoutMode', this.value)" class="w-full border p-2 rounded-lg text-sm bg-slate-50"><option value="compact" ${conf.layoutMode === 'compact' ? 'selected' : ''}>Padat (Hemat Kertas)</option><option value="normal" ${conf.layoutMode === 'normal' ? 'selected' : ''}>Normal (Standar)</option><option value="relaxed" ${conf.layoutMode === 'relaxed' ? 'selected' : ''}>Longgar (Luas)</option></select></div>
                    <div><h3 class="font-bold text-slate-800 mb-3 border-b pb-1 text-sm uppercase">Tipografi</h3>
                        <div class="mb-3"><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Jenis Font</label><select onchange="updatePdfConfig('fontFamily', this.value)" class="w-full border p-2 rounded-lg text-sm bg-slate-50"><option value="sans" ${conf.fontFamily === 'sans' ? 'selected' : ''}>Modern (Sans-Serif)</option><option value="serif" ${conf.fontFamily === 'serif' ? 'selected' : ''}>Formal (Serif/Times)</option><option value="mono" ${conf.fontFamily === 'mono' ? 'selected' : ''}>Teknis (Monospace)</option></select></div>
                        <div class="mb-3"><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Ukuran Font Dasar</label><select onchange="updatePdfConfig('fontSize', this.value)" class="w-full border p-2 rounded-lg text-sm bg-slate-50"><option value="9pt" ${conf.fontSize === '9pt' ? 'selected' : ''}>Kecil (9pt)</option><option value="10pt" ${(conf.fontSize === '10pt' || !conf.fontSize) ? 'selected' : ''}>Normal (10pt)</option><option value="11pt" ${conf.fontSize === '11pt' ? 'selected' : ''}>Sedang (11pt)</option><option value="12pt" ${conf.fontSize === '12pt' ? 'selected' : ''}>Besar (12pt)</option></select></div>
                    </div>
                    <div><label class="text-xs font-bold text-slate-500 uppercase block mb-2">Warna Aksen</label>
                        <div class="flex flex-wrap gap-2 mb-2">
                            ${['#2563eb', '#4f46e5', '#7c3aed', '#db2777', '#dc2626', '#ea580c', '#d97706', '#16a34a', '#0d9488', '#0891b2', '#1e293b'].map(c => `
                                <button onclick="updatePdfConfig('accentColor', '${c}')" class="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${conf.accentColor === c ? 'border-slate-800 ring-2 ring-slate-200 scale-110' : 'border-transparent'}" style="background-color: ${c};"></button>
                            `).join('')}
                        </div>
                        <div class="flex items-center gap-2">
                            <input type="color" value="${conf.accentColor && conf.accentColor.startsWith('#') ? conf.accentColor : '#2563eb'}" onchange="updatePdfConfig('accentColor', this.value)" class="w-8 h-8 p-0 border-0 rounded cursor-pointer">
                            <span class="text-xs text-slate-500 font-bold">Custom Color</span>
                        </div>
                    </div>
                </div>
                <div class="md:col-span-2 bg-white p-6 rounded-xl shadow border border-slate-200">
                    <h3 class="font-bold text-slate-800 mb-4 border-b pb-2">Pilih Bagian yang Ditampilkan</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        ${renderPdfToggle('showKop', 'Kop Surat (Header)', conf.showKop)}
                        ${renderPdfToggle('showPatientInfo', 'Identitas Pasien', conf.showPatientInfo)}
                        ${renderPdfToggle('showDiagnosis', 'Diagnosa & ICD-10', conf.showDiagnosis)}
                        ${renderPdfToggle('showAnamnesis', 'Anamnesis (Keluhan)', conf.showAnamnesis)}
                        ${renderPdfToggle('showBodyChart', 'Peta Nyeri (Body Chart)', conf.showBodyChart)}
                        ${renderPdfToggle('showObjective', 'Data Objektif (VAS/ROM/MMT)', conf.showObjective)}
                        ${renderPdfToggle('showImpairment', 'Impairment (Body Func/Struct)', conf.showImpairment)}
                        ${renderPdfToggle('showLimitation', 'Limitation (Act & Part)', conf.showLimitation)}
                        ${renderPdfToggle('showIntervention', 'Intervensi & Terapi', conf.showIntervention)}
                        ${renderPdfToggle('showEvalPlan', 'Evaluasi & Rencana', conf.showEvalPlan)}
                        ${renderPdfToggle('showSignature', 'Tanda Tangan', conf.showSignature)}
                        ${renderPdfToggle('showInformedConsent', 'Informed Consent (Persetujuan)', conf.showInformedConsent)}
                    </div>
                    
                    <div class="mt-8 border-t pt-6 bg-blue-50/50 -mx-6 px-6 -mb-6 rounded-b-xl pb-10">
                        <h4 class="font-bold text-slate-800 mb-2 flex items-center gap-2">
                             <i data-lucide="file-signature" width="16"></i> Editor Teks Informed Consent
                        </h4>
                        <p class="text-[10px] text-slate-500 mb-3">Tuliskan bunyi persetujuan tindakan medis yang akan muncul di setiap hasil cetak asesmen.</p>
                        <textarea 
                            onchange="updatePdfConfig('informedConsentText', this.value)" 
                            class="w-full border-2 border-slate-200 rounded-xl p-4 text-xs leading-relaxed focus:border-blue-500 outline-none h-32 bg-white"
                            placeholder="Tuliskan teks persetujuan di sini..."
                        >${conf.informedConsentText || ''}</textarea>
                    </div>
                </div>
            </div>
        </div>

        <div id="tab-content-notif" class="config-tab-content hidden">
            <div class="space-y-6">
            <div class="bg-white p-4 rounded-xl shadow border border-slate-200 flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-blue-50 rounded-full text-blue-600"><i data-lucide="volume-2" width="18"></i></div>
                    <div><p class="text-xs font-bold text-slate-700">Uji Suara Notifikasi</p><p class="text-[10px] text-slate-400">Pastikan notifikasi suara terdengar di perangkat ini</p></div>
                </div>
                <button onclick="testNotifSound()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow transition-all shrink-0">
                    <i data-lucide="play-circle" width="14"></i> Test Suara
                </button>
            </div>
            <div class="bg-white p-6 rounded-xl shadow border border-slate-200">
                <div class="flex items-center gap-3 mb-6 border-b pb-4">
                    <div class="p-3 bg-blue-50 rounded-full text-blue-600"><i data-lucide="bell-ring" width="24"></i></div>
                    <div><h3 class="font-bold text-lg text-slate-800">Notifikasi Reminder</h3><p class="text-xs text-slate-500">Atur pengiriman jadwal otomatis via Telegram &amp; Email.</p></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-4">
                        <div class="bg-sky-50 p-5 rounded-xl border border-sky-100">
                            <h4 class="font-bold text-sky-800 flex items-center gap-2 mb-4">
                                <i data-lucide="info" width="18" class="text-sky-600"></i> Tutorial Setup Telegram
                            </h4>
                            <div class="space-y-4 mb-6">
                                <div class="relative pl-6">
                                    <div class="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-sky-200 text-sky-700 flex items-center justify-center text-[10px] font-bold">1</div>
                                    <p class="text-[11px] text-slate-600 font-medium">Buka <a href="https://t.me/userinfobot" target="_blank" class="text-sky-600 font-bold hover:underline">@userinfobot</a> di Telegram, klik <strong>START</strong>, lalu copy <strong>ID</strong> Anda.</p>
                                </div>
                                <div class="relative pl-6">
                                    <div class="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-sky-200 text-sky-700 flex items-center justify-center text-[10px] font-bold">2</div>
                                    <p class="text-[11px] text-slate-600 font-medium">Pastikan Bot Aktif. Japri <a href="https://t.me/FisiotaReminder_bot" target="_blank" class="text-sky-600 font-bold hover:underline">@FisiotaReminder_bot</a> & klik <strong>START</strong> (atau undang ke grup Anda).</p>
                                </div>
                                <div class="relative pl-6">
                                    <div class="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-sky-200 text-sky-700 flex items-center justify-center text-[10px] font-bold">3</div>
                                    <p class="text-[11px] text-slate-600 font-medium">Masukkan ID tadi ke kolom <strong>Chat ID</strong> di bawah ini.</p>
                                </div>
                                <div class="relative pl-6">
                                    <div class="absolute left-0 top-0.5 w-4 h-4 border border-sky-300 text-sky-500 flex items-center justify-center text-[10px] font-bold rounded-full italic">?</div>
                                    <p class="text-[10px] text-slate-500 italic">Ingin pakai Bot sendiri? Buat di <a href="https://t.me/botfather" target="_blank" class="text-sky-600 font-bold hover:underline">@BotFather</a> dan masukkan Token-nya.</p>
                                </div>
                            </div>

                            <div class="space-y-3 pt-3 border-t border-sky-100">
                                <div>
                                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Chat ID (Wajib)</label>
                                    <input type="text" id="notif-tg-chatid" value="${state.notificationConfig?.telegramChatId || ''}" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-sm font-mono shadow-sm bg-white" placeholder="-100xxxxxxx">
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-slate-400 uppercase block mb-1">Bot Token (Opsional)</label>
                                    <input type="text" id="notif-tg-token" value="${state.notificationConfig?.telegramToken || ''}" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-xs font-mono text-slate-400 bg-white" placeholder="Kosongkan jika pakai Bot Pusat">
                                </div>
                                <button onclick="testTelegramConnection()" id="btn-test-tg" class="w-full bg-sky-100 text-sky-700 py-2.5 rounded-lg text-xs font-bold hover:bg-sky-200 flex items-center justify-center gap-2 border border-sky-200 shadow-sm transition-all">
                                    <i data-lucide="send" width="14"></i> Tes Kirim Telegram
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="bg-amber-50 p-4 rounded-xl border border-amber-100">
                            <h4 class="font-bold text-amber-800 flex items-center gap-2 mb-3"><i data-lucide="mail" width="16"></i> Setup Email</h4>
                            <div class="space-y-3">
                                <div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Email Tujuan (Penerima)</label><input type="email" id="notif-email-target" value="${state.notificationConfig?.targetEmail || ''}" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="anda@gmail.com"></div>
                                <div>
                                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1 flex justify-between"><span>Email Pengirim (Opsional)</span><span class="text-[10px] text-amber-600">*Harus Alias Terverifikasi</span></label>
                                    <input type="email" id="notif-email-sender" value="${state.notificationConfig?.senderEmail || ''}" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="admin@klinik.com">
                                    <p class="text-[10px] text-slate-400 mt-1 italic">Kosongkan jika ingin menggunakan email akun utama Google.</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- GOOGLE CALENDAR INTEGRATION -->
                        <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100 col-span-1 md:col-span-2">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="p-2 bg-indigo-100 rounded-lg text-indigo-600"><i data-lucide="calendar" width="18"></i></div>
                                <div><h4 class="font-bold text-indigo-800">Integrasi Google Calendar (SaaS)</h4><p class="text-[11px] text-indigo-600">Jadwal terapi otomatis masuk ke aplikasi Kalender Anda</p></div>
                            </div>
                            <div class="flex justify-between items-center bg-white p-3 rounded-lg border border-indigo-100">
                                <div>
                                    <p class="text-xs font-bold text-slate-700">Status Koneksi</p>
                                    <p class="text-[10px] text-slate-500 max-w-xs mt-1 leading-tight"><i data-lucide="info" width="10" class="inline"></i> Anda akan dialihkan ke layar otorisasi aman Google untuk memberikan izin pada aplikasi Fisiota.</p>
                                </div>
                                <button onclick="connectGoogleCalendar()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-all">
                                    <i data-lucide="link" width="14"></i> Hubungkan Kalender
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Custom WhatsApp Message Templates -->
                <div class="mt-8 border-t border-slate-100 pt-6">
                    <h4 class="font-bold text-slate-800 flex items-center gap-2 mb-4"><i data-lucide="message-square-plus" width="18"></i> Kustomisasi Pesan WhatsApp</h4>
                    <p class="text-xs text-slate-500 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                        Gunakan placeholder: <span class="font-mono text-blue-600 font-bold">{{name}}</span>, <span class="font-mono text-blue-600 font-bold">{{date}}</span>, <span class="font-mono text-blue-600 font-bold">{{time}}</span>, <span class="font-mono text-blue-600 font-bold">{{clinic_name}}</span>, <span class="font-mono text-blue-600 font-bold">{{complaint}}</span>, <span class="font-mono text-blue-600 font-bold">{{booking_url}}</span>
                    </p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1.5 flex justify-between">
                                    <span>Template Konfirmasi Booking</span>
                                    <button onclick="resetNotifTemplate('confirm')" class="text-[10px] text-blue-600 hover:underline">Reset Default</button>
                                </label>
                                <textarea id="notif-msg-confirm" class="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium h-40 leading-relaxed" placeholder="Masukkan template pesan konfirmasi...">${state.notificationConfig?.msgConfirm || ''}</textarea>
                            </div>
                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1.5 flex justify-between">
                                    <span>Template Penolakan Booking</span>
                                    <button onclick="resetNotifTemplate('reject')" class="text-[10px] text-blue-600 hover:underline">Reset Default</button>
                                </label>
                                <textarea id="notif-msg-reject" class="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium h-40 leading-relaxed" placeholder="Masukkan template pesan penolakan...">${state.notificationConfig?.msgReject || ''}</textarea>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1.5 flex justify-between">
                                    <span>Template Reminder Harian</span>
                                    <button onclick="resetNotifTemplate('reminder')" class="text-[10px] text-blue-600 hover:underline">Reset Default</button>
                                </label>
                                <textarea id="notif-msg-reminder" class="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium h-80 leading-relaxed" placeholder="Masukkan template pesan reminder...">${state.notificationConfig?.msgReminder || ''}</textarea>
                                <p class="text-[10px] text-slate-400 mt-2">Dukungan variabel tambahan: <span class="font-mono">{{address}}</span>, <span class="font-mono">{{maps_url}}</span>, <span class="font-mono">{{notes}}</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-8 pt-4 border-t border-slate-100 text-right">
                    <button onclick="saveNotificationConfig()" class="w-full md:w-auto bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-900 shadow-lg btn-press flex items-center justify-center gap-2 ml-auto"><i data-lucide="save" width="16"></i> Simpan Konfigurasi</button>
                </div>
            </div>
            </div>
        </div>

        <div id="tab-content-system" class="config-tab-content hidden">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-xl shadow border border-slate-200">
                    <div class="flex justify-between items-center mb-4"><h3 class="font-bold text-lg text-slate-800">Manajemen User</h3><button onclick="openUserModal()" class="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-indigo-700 flex gap-1 items-center"><i data-lucide="plus" width="14"></i> Baru</button></div>
                    <div class="max-h-48 overflow-y-auto">
                        <table class="w-full text-sm text-left"><tbody class="divide-y divide-slate-100">${state.users.map(u => `<tr><td class="py-2"><span class="font-bold text-slate-700">${u.name}</span><br><span class="text-xs text-slate-400">@${u.username}</span></td><td class="text-right"><button onclick="openUserModal('${u.id}')" class="text-blue-600 p-1"><i data-lucide="edit-3" width="14"></i></button>${u.username !== 'admin' ? `<button onclick="deleteUser('${u.id}')" class="text-red-600 p-1"><i data-lucide="trash-2" width="14"></i></button>` : ''}</td></tr>`).join('')}</tbody></table>
                    </div>
                </div>
                <div class="space-y-6">
                    <div class="bg-white p-6 rounded-xl shadow border border-slate-200">
                        <h3 class="font-bold text-lg text-slate-800 mb-2">Integrasi Cloud Storage</h3>
                        <p class="text-xs text-slate-500 mb-2">ID Database aktif terhubung secara otomatis ke sistem. Lakukan proses Tarik/Kirim data secara rutin.</p>
                        
                        <input type="hidden" id="script-url" value="${state.scriptUrl}">
                        
                        <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">ID Terkunci (Read-Only)</label>
                        <div class="relative w-full mb-1">
                            <input type="password" id="conf-sheet-id" value="${state.sheetId}" readonly
                                class="w-full border p-2 pr-10 rounded text-xs font-mono bg-slate-100 text-slate-500 cursor-not-allowed select-all">
                            <button type="button" onclick="const inp=document.getElementById('conf-sheet-id'); inp.type = inp.type==='password'?'text':'password';" class="absolute right-2 top-2 text-slate-400 hover:text-blue-600 focus:outline-none cursor-pointer" title="Lihat/Sembunyikan ID">
                                <i data-lucide="eye" width="16"></i>
                            </button>
                        </div>
                        
                        <p class="text-[10px] text-slate-400 mb-3 italic">*Pergantian Database hanya bisa dilakukan oleh Sistem / via menu Arsip.</p>
                        <div class="flex gap-2 mt-4">
                            <button onclick="pullDataFromSheet()" class="flex-1 bg-slate-800 text-white border border-slate-800 p-2 rounded text-xs font-bold hover:bg-slate-700">Tarik Data (Sinkron)</button>
                            <button onclick="pushDataToSheet()" class="flex-1 border p-2 rounded text-xs font-bold hover:bg-slate-50 text-slate-700">Kirim Data (Backup)</button>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow border border-slate-200">
                        <h3 class="font-bold text-lg text-slate-800 mb-2">Backup & Restore</h3><p class="text-xs text-slate-500 mb-4">Simpan data ke file JSON atau pulihkan data dari file.</p>
                        <div class="flex gap-3">
                            <button onclick="downloadBackup()" class="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-100 flex items-center justify-center gap-2"><i data-lucide="download" width="16"></i> Backup</button>
                            <label class="flex-1 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 cursor-pointer flex items-center justify-center gap-2"><i data-lucide="upload" width="16"></i> Restore<input type="file" class="hidden" accept=".json" onchange="restoreBackup(this)"></label>
                        </div>
                        <div class="mt-4 pt-4 border-t border-slate-100"><button onclick="resetUserToDefault()" class="w-full text-red-600 text-xs font-bold hover:text-red-800 flex items-center justify-center gap-1"><i data-lucide="alert-triangle" width="12"></i> Reset User ke Default</button></div>
                    </div>
                </div>
             </div>
        </div>
    </div>`;
    lucide.createIcons();
    switchConfigTab(activeTab);
    // Render initial holiday list if in booking state
    renderHolidayList();
}

// --- Holiday Manager Helpers ---
function renderHolidayList() {
    const container = document.getElementById('holiday-scroll-area');
    if (!container) return;

    const holidays = (state.bookingConfig.customHolidays || "").split(',').filter(d => d.trim());
    if (holidays.length === 0) {
        container.innerHTML = `<div class="text-[10px] text-slate-400 text-center py-4 italic">Belum ada tanggal libur pilihan</div>`;
        return;
    }

    // Sort dates
    holidays.sort();

    container.innerHTML = holidays.map(date => {
        const d = new Date(date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = isNaN(d) ? date : d.toLocaleDateString('id-ID', options);
        
        return `
            <div class="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-sm transition-all hover:border-emerald-200">
                <span class="text-xs font-bold text-slate-700">${formattedDate}</span>
                <button onclick="removeCustomHoliday('${date}')" class="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-all">
                    <i data-lucide="x" width="12"></i>
                </button>
            </div>
        `;
    }).join('');
    renderIcons();
}

function addCustomHoliday() {
    const picker = document.getElementById('conf-holiday-picker');
    const date = picker.value;
    if (!date) return;

    const current = (state.bookingConfig.customHolidays || "").split(',').filter(d => d.trim());
    if (current.includes(date)) {
        showToast("Tanggal ini sudah ada di daftar libur.", "warning");
        return;
    }

    current.push(date);
    state.bookingConfig.customHolidays = current.join(',');
    picker.value = '';
    renderHolidayList();
}

function removeCustomHoliday(date) {
    const current = (state.bookingConfig.customHolidays || "").split(',').filter(d => d.trim() && d !== date);
    state.bookingConfig.customHolidays = current.join(',');
    renderHolidayList();
}

/**
 * [NEW] Handle Clinic Logo Upload
 */
async function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
        alert("Ukuran logo terlalu besar! Maksimal 1.5MB agar PDF tetap ringan.");
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64Data = e.target.result;
        const uploadBtn = document.querySelector('button[onclick*="logo-upload-input"]');
        const originalText = uploadBtn.innerHTML;

        try {
            uploadBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin" width="14"></i> Mengunggah...`;
            uploadBtn.disabled = true;
            lucide.createIcons();

            // [FIXED] Using the same "Sakti" URL as Rontgen Upload to ensure success
            const targetUrl = (typeof LICENSE_API_URL !== 'undefined' && LICENSE_API_URL) ? LICENSE_API_URL : state.scriptUrl;

            if (!targetUrl) throw new Error("URL Script Cloud tidak ditemukan. Pastikan lisensi terhubung.");

            const res = await fetch(targetUrl, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    action: 'upload_file',
                    isLogo: true,
                    fileName: file.name,
                    fileData: base64Data,
                    sheet_id: state.sheetId || getSheetIdFromUrl(state.scriptUrl)
                })
            });

            const responseText = await res.text();
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (jsonErr) {
                console.error("Cloud Response is not JSON:", responseText);
                throw new Error("Respon Server Cloud tidak valid (Bukan JSON). Pastikan Apps Script sudah di-DEPLOY ulang.");
            }

            if (result.status === 'success') {
                // [FIXED] Use cloud URL to avoid truncation in Google Sheets cell (50k char limit)
                state.clinicInfo.logoUrl = result.fileUrl;
                showToast("Logo Berhasil Diupdate! ✅", "success");
                saveClinicConfig();
                renderConfigView(document.getElementById('main-content'), 'identity');
            } else {
                throw new Error(result.message || "Gagal upload ke Google Drive.");
            }
        } catch (err) {
            console.error("Logo Upload Fail:", err);
            alert("Gagal mengunggah logo: " + err.message);
        } finally {
            uploadBtn.disabled = false;
        }
    };
    reader.readAsDataURL(file);
}

function removeClinicLogo() {
    if (confirm('Hapus logo klinik?')) {
        state.clinicInfo.logoUrl = null;
        saveClinicConfig();
        renderConfigView(document.getElementById('main-content'), 'identity');
    }
}

async function saveClinicConfig() {
    state.clinicInfo = {
        name: document.getElementById('conf-name').value,
        subname: document.getElementById('conf-sub').value,
        city: document.getElementById('conf-city').value,
        therapist: document.getElementById('conf-therapist').value,
        sipf: document.getElementById('conf-sipf').value,
        address: document.getElementById('conf-address').value,
        phone: document.getElementById('conf-phone').value,
        mapsUrl: document.getElementById('conf-maps')?.value || '',
        npwp: document.getElementById('conf-npwp')?.value || '',
        logoUrl: state.clinicInfo?.logoUrl || null
    };

    localStorage.setItem('erm_clinic_config', JSON.stringify(state.clinicInfo));
    state.configUpdatedAt = getServerTimeISO();
    saveData();
    applyBranding();

    const btn = document.getElementById('btn-save-clinic');
    const originalText = btn.innerHTML;

    // Sync to GAS
    if (state.scriptUrl) {
        try {
            btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin" width="16"></i> Menyinkronkan...`;
            lucide.createIcons();

            const sheetId = state.sheetId || getSheetIdFromUrl(state.scriptUrl);
            if (!sheetId) throw new Error("Sheet ID tidak valid.");

            const configItems = [
                { key: 'CLINIC_NAME', value: state.clinicInfo.name },
                { key: 'CLINIC_SUBNAME', value: state.clinicInfo.subname },
                { key: 'CLINIC_CITY', value: state.clinicInfo.city },
                { key: 'CLINIC_THERAPIST', value: state.clinicInfo.therapist },
                { key: 'CLINIC_SIPF', value: state.clinicInfo.sipf },
                { key: 'CLINIC_ADDRESS', value: state.clinicInfo.address },
                { key: 'CLINIC_NPWP', value: state.clinicInfo.npwp },
                { key: 'CLINIC_PHONE', value: state.clinicInfo.phone },
                { key: 'CLINIC_MAPS', value: state.clinicInfo.mapsUrl || '' },
                { key: 'CLINIC_LOGO', value: state.clinicInfo.logoUrl || '' }
            ];

            // [Sync Instant]
            await fetch(LICENSE_API_URL, {
                method: 'POST', mode: 'cors',
                headers: { 'Content-Type': 'text/plain' }, // Avoid preflight
                body: JSON.stringify({
                    action: 'save_config',
                    sheet_id: sheetId,
                    config: configItems
                })
            });

            // Wait 2s for "feeling" of saving
            await new Promise(r => setTimeout(r, 2000));
            alert('✅ Identitas Klinik Berhasil Disimpan & Disinkronkan ke Cloud!');
        } catch (e) {
            console.warn("Sync failed, saved locally:", e);
            alert('Tersimpan secara lokal (Sinkronisasi Cloud Gagal).');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
            lucide.createIcons();
        }
    } else {
        alert('Identitas Klinik Berhasil Disimpan (Lokal)!');
    }
    syncDelta(false);
}
function updatePdfConfig(key, value) {
    state.pdfConfig[key] = value;
    localStorage.setItem('erm_pdf_config', JSON.stringify(state.pdfConfig));
    state.configUpdatedAt = new Date().toISOString();
    saveData();
    if (state.scriptUrl) syncDelta(false);



    // Apply layout mode class & page margins
    if (key === 'layoutMode') {
        document.body.classList.remove('print-compact', 'print-normal', 'print-relaxed');
        if (value === 'compact') document.body.classList.add('print-compact');
        else if (value === 'relaxed') document.body.classList.add('print-relaxed');
        else document.body.classList.add('print-normal');

        applyPageMargins(value);
    }

    if (key === 'accentColor') {
        applyBranding();
    }

    renderConfigView(document.getElementById('main-content'));
}

function applyPageMargins(mode) {
    let margin = '15mm'; // Normal default
    if (mode === 'compact') margin = '10mm';
    if (mode === 'relaxed') margin = '25mm';

    let styleEl = document.getElementById('dynamic-print-margins');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'dynamic-print-margins';
        document.head.appendChild(styleEl);
    }
    // Set @page margin for printing
    styleEl.innerHTML = `@media print { @page { size: auto; margin: ${margin} !important; } }`;
}



// --- Booking Config Functions ---
const _bookingBase = (typeof BOOKING_BASE_URL !== 'undefined' && BOOKING_BASE_URL)
    ? BOOKING_BASE_URL
    : (window.location.origin + '/Booking');

function updateBookingLinkPreview() {
    const aliasInput = document.getElementById('conf-booking-alias');
    const alias = aliasInput ? aliasInput.value.trim() : state.bookingConfig.alias;
    const display = document.getElementById('booking-link-display');
    if (!display) return;
    if (alias) {
        const link = `${_bookingBase}/?id=${alias}`;
        display.innerHTML = `<a href="${link}" target="_blank" class="text-blue-600 hover:underline break-all font-mono text-[11px]">${link}</a>`;
    } else {
        display.innerHTML = '<span class="italic text-slate-400">Isi Alias dan klik Simpan...</span>';
    }
}

function copyBookingLink() {
    const alias = state.bookingConfig.alias;
    if (!alias) { alert('Simpan konfigurasi booking terlebih dahulu!'); return; }
    const link = `${_bookingBase}/?id=${alias}`;
    navigator.clipboard.writeText(link).then(() => {
        const btn = document.getElementById('btn-copy-link');
        if (btn) {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="check" width="14"></i><span>Tersalin!</span>';
            lucide.createIcons();
            setTimeout(() => { btn.innerHTML = originalHtml; lucide.createIcons(); }, 2000);
        }
    }).catch(() => { alert('Gagal menyalin. Silakan salin manual:\n' + link); });
}

async function saveBookingConfig() {
    state.configUpdatedAt = new Date().toISOString();
    saveData();
    const btn = document.querySelector('button[onclick="saveBookingConfig()"]');
    const originalText = btn ? btn.innerHTML : 'Simpan & Generate Link';

    const alias = (document.getElementById('conf-booking-alias') || {}).value.trim().toLowerCase() || state.bookingConfig.alias;
    if (!alias) {
        alert('⚠️ Lisensi Anda belum memiliki Alias. Silakan hubungi admin atau sinkronkan ulang lisensi.');
        return;
    }

    const hourChecks = document.querySelectorAll('.booking-hour-check:checked');
    const hours = Array.from(hourChecks).map(c => c.value).join(',');

    const offChecks = document.querySelectorAll('.off-day-check:checked');
    const offDays = Array.from(offChecks).map(c => c.value).join(',');
    const customHolidays = state.bookingConfig.customHolidays || "";

    // Collect Advanced Day Config
    const dayConfig = {};
    for (let i = 0; i < 7; i++) {
        const isActive = document.getElementById(`adv-day-active-${i}`)?.checked;
        const hoursInput = document.getElementById(`adv-day-hours-${i}`)?.value.trim();
        const slotsInput = parseInt(document.getElementById(`adv-day-slots-${i}`)?.value || "1");

        dayConfig[i] = {
            active: isActive,
            hours: hoursInput,
            slots: slotsInput
        };
    }

    // Update State
    state.bookingConfig.alias = alias;
    state.bookingConfig.availableHours = hours;
    state.bookingConfig.offDays = offDays;
    state.bookingConfig.dayConfig = dayConfig;
    // customHolidays already updated in state by add/remove functions

    // Sync UI
    updateBookingLinkPreview();

    const payload = {
        action: 'save_booking_config',
        sheet_id: state.sheetId || getSheetIdFromUrl(state.scriptUrl),
        alias: alias,
        available_hours: hours,
        off_days: offDays,
        custom_holidays: customHolidays,
        day_config: dayConfig
    };

    try {
        btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin" width="16"></i> Menyimpan...`;
        btn.disabled = true;
        lucide.createIcons();

        // [Sync Instant to Master]
        const res = await fetch(LICENSE_API_URL, {
            method: 'POST', mode: 'cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.status === 'success') {
            alert('✅ Konfigurasi Booking Berhasil Disimpan & Sinkron Master!');
        } else {
            throw new Error(result.message);
        }
    } catch (e) {
        console.warn("Sync booking config failed, saved locally:", e);
        alert('Tersimpan secara lokal (Sinkronisasi Master Gagal).');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        lucide.createIcons();
    }
    await saveData();

    // Pastikan kita punya URL Script untuk sinkronisasi
    if (state.scriptUrl || localStorage.getItem('erm_script_url')) {
        if (btn) {
            btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin" width="16"></i><span>Menghubungkan ke Cloud...</span>';
            btn.disabled = true;
            lucide.createIcons();
        }

        try {
            const sheetId = state.sheetId || getSheetIdFromUrl(state.scriptUrl || localStorage.getItem('erm_script_url'));

            if (!sheetId) {
                alert('⚠️ Sheet ID tidak ditemukan!\nSilahkan isi URL Spreadsheet di tab "Data & User" terlebih dahulu.');
                return;
            }

            // [Sync Instant]
            // CRITICAL: Gunakan LICENSE_API_URL (App Script), bukan state.scriptUrl (Sheet)
            await fetch(LICENSE_API_URL, {
                method: 'POST',
                mode: 'cors', // Removed no-cors trap so we can catch GAS errors
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    action: 'save_booking_config',
                    sheet_id: sheetId,
                    alias: state.bookingConfig.alias,
                    available_hours: state.bookingConfig.availableHours,
                    off_days: state.bookingConfig.offDays,
                    custom_holidays: state.bookingConfig.customHolidays
                })
            });

            await new Promise(r => setTimeout(r, 2000));
            alert('✅ Konfigurasi Booking Berhasil Disimpan & Disinkronkan!\n\nLink booking Anda sudah aktif di Cloud.');
        } catch (e) {
            console.error('Sync failed:', e);
            alert('❌ Gagal sinkron ke Cloud.\nTersimpan Lokal saja. Cek koneksi internet Anda.');
        } finally {
            if (btn) {
                btn.innerHTML = originalText;
                btn.disabled = false;
                lucide.createIcons();
            }
        }
    }
    syncDelta(false);
}

async function saveNotificationConfig() {
    state.configUpdatedAt = new Date().toISOString();
    saveData();

    state.notificationConfig.telegramToken = document.getElementById('notif-tg-token').value.trim();
    state.notificationConfig.telegramChatId = document.getElementById('notif-tg-chatid').value.trim();
    state.notificationConfig.targetEmail = document.getElementById('notif-email-target').value.trim();
    state.notificationConfig.senderEmail = document.getElementById('notif-email-sender').value.trim();
    state.notificationConfig.msgConfirm = document.getElementById('notif-msg-confirm').value;
    state.notificationConfig.msgReject = document.getElementById('notif-msg-reject').value;
    state.notificationConfig.msgReminder = document.getElementById('notif-msg-reminder').value;

    localStorage.setItem('erm_notif_config', JSON.stringify(state.notificationConfig));
    saveData(); // Persistent to IndexedDB

    // Sync to Cloud if Connected
    if (state.scriptUrl) {
        const btn = document.querySelector('button[onclick="saveNotificationConfig()"]');
        const originalText = btn ? btn.innerHTML : 'Simpan';
        if (btn) {
            btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin" width="16"></i> Menyimpan ke Cloud...';
            btn.disabled = true;
            lucide.createIcons();
            try {
                // Extract Sheet ID for Backend Targeting (Required for Bridge)
                let sheetId = "";
                const rawUrl = state.scriptUrl || localStorage.getItem('erm_config_url');
                if (rawUrl) {
                    const match = rawUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
                    if (match && match[1]) sheetId = match[1];
                }

                const configPayload = [
                    { key: 'TELEGRAM_TOKEN', value: state.notificationConfig.telegramToken },
                    { key: 'TELEGRAM_CHAT_ID', value: state.notificationConfig.telegramChatId },
                    { key: 'EMAIL_RECEIVER', value: state.notificationConfig.targetEmail },
                    { key: 'EMAIL_SENDER', value: state.notificationConfig.senderEmail },
                    { key: 'MSG_CONFIRM_TEMPLATE', value: state.notificationConfig.msgConfirm },
                    { key: 'MSG_REJECT_TEMPLATE', value: state.notificationConfig.msgReject },
                    { key: 'MSG_REMINDER_TEMPLATE', value: state.notificationConfig.msgReminder }
                ];

                // CRITICAL FIX: Use LICENSE_API_URL (The App Script), NOT state.scriptUrl (The Sheet)
                // [Sync Instant]
                await fetch(LICENSE_API_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify({ action: 'save_config', sheet_id: sheetId, config: configPayload })
                });
                await new Promise(r => setTimeout(r, 2000));
                alert('✅ Konfigurasi Notifikasi Berhasil Disimpan & Sinkron ke Cloud!');
            } catch (e) {
                console.error(e);
                alert('❌ Gagal mengirim ke Cloud. Tersimpan Lokal.');
            } finally {
                if (btn) {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    lucide.createIcons();
                }
            }
        } else {
            alert('Konfigurasi Disimpan Lokal (Cloud Skip: URL Sheet belum diset)!');
        }
    }
    syncDelta(false);
}

// --- GOOGLE CALENDAR OAUTH (Improved 403-proof version) ---
window.connectGoogleCalendar = async function () {
    if (!state.sheetId && !state.scriptUrl) {
        alert("Sistem belum mendeteksi ID Utama Klinik. Silakan Reload halaman.");
        return;
    }
    const realSheetId = state.sheetId || getSheetIdFromUrl(state.scriptUrl);
    if (!realSheetId) return;

    const confirmMsg = "Sistem akan mengarahkan Anda ke Halaman Keamanan Google.\n\nPastikan Anda masuk (Login) menggunakan Email Gmail Klinik yang kalendernya ingin digunakan.\n\nLanjutkan?";
    if (!confirm(confirmMsg)) return;

    // Use fetch to get the auth URL as plain text to avoid 403 HtmlService errors
    const fetchEndpoint = LICENSE_API_URL + "?action=start_oauth&sheet_id=" + encodeURIComponent(realSheetId);

    try {
        const response = await fetch(fetchEndpoint);
        if (!response.ok) throw new Error("Gagal mengambil URL Oauth");
        const authUrl = await response.text();

        if (authUrl.startsWith('http')) {
            window.location.href = authUrl; // Langsung redirect di tab yang sama agar lebih stabil
        } else {
            console.error("Link Oauth tidak valid: ", authUrl);
            alert("Terjadi kesalahan dari Server Google. Silakan coba beberapa saat lagi.");
        }
    } catch (err) {
        console.error("Oauth Redirect Error: ", err);
        alert("Gagal terhubung ke server. Pastikan koneksi internet stabil dan Deployment Script sudah diset ke 'Anyone'.");
    }
};

async function testTelegramConnection() {
    const chatId = document.getElementById('notif-tg-chatid').value.trim();
    const token = document.getElementById('notif-tg-token').value.trim();
    if (!chatId) { alert("⚠️ Chat ID wajib diisi untuk tes!"); return; }

    const btn = document.getElementById('btn-test-tg');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin" width="14"></i><span>Mengetes...</span>';
    btn.disabled = true;
    lucide.createIcons();

    try {
        const sheetId = state.sheetId || getSheetIdFromUrl(state.scriptUrl);
        const res = await fetch(LICENSE_API_URL, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                action: 'send_notif',
                type: 'telegram',
                sheet_id: sheetId,
                message: `🛠️ TEST KONEKSI TELEGRAM\n\nKoneksi dari Web App FISIOTA berhasil!\nKlinik: ${state.clinicInfo.name}\nWaktu: ${new Date().toLocaleString('id-ID')}\n\nJika Anda menerima pesan ini, berarti Bot sudah siap bekerja. ✅`
            })
        });
        alert("✅ Permintaan Terkirim!\nSilahkan cek chat Telegram Bot/Grup Anda.\n\nJika tidak muncul, pastikan Bot sudah di-START atau sudah masuk ke Grup.");
    } catch (e) {
        console.error(e);
        alert("❌ Gagal mengirim tes. Cek koneksi internet atau URL script.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        lucide.createIcons();
    }
}

async function switchConfigTab(tabName) {
    state.activeConfigTab = tabName;
    
    // [AUTO-SYNC] Tarik data Master terbaru saat buka tab booking/license
    if (tabName === 'booking' || tabName === 'license') {
        if (typeof checkLicense === 'function') await checkLicense();
    }

    document.querySelectorAll('.config-tab-content').forEach(el => el.classList.add('hidden'));
    const content = document.getElementById(`tab-content-${tabName}`);
    if (content) content.classList.remove('hidden');

    ['identity', 'print', 'notif', 'system', 'license', 'booking', 'packages', 'treatments', 'archives', 'maintenance'].forEach(t => {
        const btn = document.getElementById(`tab-btn-${t}`);
        if (!btn) return;
        if (t === tabName) {
            btn.className = "px-6 py-3 text-sm font-bold text-blue-600 border-b-2 border-blue-600 bg-white transition-colors flex items-center gap-2";
        } else {
            btn.className = "px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2";
        }
    });
}

function saveConfig() {
    const oldSheetId = state.sheetId;

    // Auto-extract ID if user pasted a full URL into the single ID input
    const rawInput = document.getElementById('conf-sheet-id').value.trim();
    state.sheetId = getSheetIdFromUrl(rawInput) || rawInput;

    // Defensive assignment to mock the old scriptUrl so legacy 'if(!state.scriptUrl) return;' checks don't break
    state.scriptUrl = state.sheetId ? `https://docs.google.com/spreadsheets/d/${state.sheetId}/edit` : "";

    localStorage.setItem('erm_script_url', state.scriptUrl);
    localStorage.setItem('erm_sheet_id', state.sheetId);

    // RESET LOGIC: If sheet ID changed, clear everything to prevent "stale" data/cache
    if (oldSheetId && state.sheetId !== oldSheetId) {
        console.log("Sheet ID mismatch detected. Clearing local sync cache...");
        localStorage.removeItem('erm_server_sync_time');
        localStorage.removeItem('erm_last_sync'); // RESET SYNC TIMESTAMP AS WELL

        // Clear IndexedDB Tables (Full Reset) - Sheet is Master
        const msg = `⚠️ PERINGATAN: ID Spreadsheet berubah!\n\nData lokal di HP/Laptop ini akan DIHAPUS dan menarik data baru dari Sheet yang baru agar sinkron.\n\nKlik OK untuk RESET & TARIK ULANG DATA (Sangat Disarankan).`;

        if (window.fisiotaDB && confirm(msg)) {
            Promise.all([
                window.fisiotaDB.clear('patients'),
                window.fisiotaDB.clear('assessments'),
                window.fisiotaDB.clear('appointments'),
                window.fisiotaDB.clear('expenses'),
                window.fisiotaDB.clear('packages'),
                window.fisiotaDB.clear('protocols'),
                window.fisiotaDB.clear('config')
            ]).then(() => {
                location.reload(); // Force reload to trigger clean initial pull from the new Master Sheet
            });
            return; // Exit if reloading
        }
    }

    // Success UI for normal saves (or if ID changed but user declined refresh)
    updateSyncStatusUI('pending', false, 3);
    refreshLicenseStatus();

    setTimeout(() => {
        alert('✅ Konfigurasi Cloud Berhasil Disimpan & Disinkronkan!');
        syncDelta(false);
    }, 1000);

    if (document.getElementById('conf-sheet-id')) {
        document.getElementById('conf-sheet-id').value = state.sheetId;
    }
    checkOnlineStatus();
}

function renderPdfToggle(key, label, isChecked) {
    return `<label class="flex items-center justify-between cursor-pointer p-3 rounded-lg border border-transparent hover:bg-slate-50 transition-colors"><span class="text-sm font-medium text-slate-700">${label}</span><div class="relative inline-flex items-center cursor-pointer"><input type="checkbox" class="sr-only peer" ${isChecked ? 'checked' : ''} onchange="updatePdfConfig('${key}', this.checked)"><div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div></div></label>`;
}

function openUserModal(id = null) {
    let u = id ? state.users.find(x => x.id === id) : null;

    // Safety check: if ID provided but not found, fallback to empty/default (prevents crash)
    if (!u) {
        u = { id: '', name: '', username: '', password: '', role: 'FISIO' };
    }
    const modalHtml = `
        <div class="bg-white px-6 py-4 border-b flex justify-between items-center sticky top-0 z-20"><h3 class="text-xl font-bold text-slate-800">${id ? 'Edit User' : 'Tambah User Baru'}</h3><button onclick="closeModal()" class="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"><i data-lucide="x" width="20"></i></button></div>
        <div class="p-6 space-y-4"><form id="user-form"><input type="hidden" name="id" value="${u.id}"><div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Nama Tampilan</label><input type="text" name="name" value="${u.name}" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: Fisio Rehan"></div><div class="grid grid-cols-2 gap-4"><div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Username</label><input type="text" name="username" value="${u.username}" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"></div><div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Password</label><input type="text" name="password" value="${u.password}" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"></div></div><div><label class="text-xs font-bold text-slate-500 uppercase block mb-1">Role</label><select name="role" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"><option value="FISIO" ${u.role === 'FISIO' ? 'selected' : ''}>Fisioterapis</option><option value="ADMIN" ${u.role === 'ADMIN' ? 'selected' : ''}>Administrator</option></select></div></form></div>
        <div class="bg-slate-50 px-6 py-4 border-t flex justify-end gap-2"><button onclick="saveUser()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg btn-press text-sm">Simpan User</button></div>`;
    document.getElementById('modal-content').innerHTML = modalHtml;
    document.getElementById('modal-container').classList.remove('hidden');
    lucide.createIcons();
}

async function saveUser() {
    updateSyncStatusUI('syncing', false); // [IMMEDIATE UI FEEDBACK]
    const form = document.getElementById('user-form');
    const id = form.querySelector('[name="id"]').value;
    const name = form.querySelector('[name="name"]').value;
    const username = form.querySelector('[name="username"]').value;
    const password = form.querySelector('[name="password"]').value;
    const role = form.querySelector('[name="role"]').value;

    if (!name || !username || !password) { alert('Semua kolom wajib diisi!'); return; }

    // ROLE PROTECTION: Jika user ini adalah ADMIN dan dia adalah satu-satunya ADMIN, 
    // jangan biarkan rolenya diubah menjadi FISIO.
    if (id) {
        const currentUser = state.users.find(x => x.id === id);
        if (currentUser && currentUser.role === 'ADMIN' && role !== 'ADMIN') {
            const adminCount = state.users.filter(u => u.role === 'ADMIN').length;
            if (adminCount <= 1) {
                alert("⚠️ GAGAL: Tidak bisa mengubah role Administrator terakhir!\nSistem memerlukan minimal 1 Administrator aktif.");
                return;
            }
        }
    }

    if (state.users.some(u => u.username === username && u.id !== id)) { alert('Username sudah dipakai!'); return; }

    const now = getServerTimeISO();
    if (id) {
        const idx = state.users.findIndex(x => x.id === id);
        if (idx > -1) {
            state.users[idx] = { id, name, username, password, role, updatedAt: now };
            if (state.user && state.user.id === id) {
                state.user = state.users[idx];
                document.getElementById('user-name').innerText = name;
                document.getElementById('user-role').innerText = role === 'ADMIN' ? 'Administrator' : 'Fisioterapis';
            }
        }
    } else {
        state.users.push({ id: 'usr' + Date.now(), name, username, password, role, updatedAt: now });
    }
    await saveData();
    closeModal();
    renderConfigView(document.getElementById('main-content'), 'system');
    showToast('User disimpan! Menyinkronkan...', 'info');
    // [FIX] Fast targeted push: only send users data, no need to sync all data
    if (state.scriptUrl) _pushUsersToSheet();
}

/** Lightweight push of only users data to Google Sheet */
async function _pushUsersToSheet() {
    const sheetId = getSheetIdFromUrl(state.scriptUrl) || state.sheetId;
    if (!sheetId) return;
    try {
        updateSyncStatusUI('syncing');
        const res = await fetch(LICENSE_API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'delta_push',
                sheet_id: sheetId,
                users: state.users,
                patients: [], assessments: [], appointments: [],
                expenses: [], packages: [], protocols: [],
                deletedIds: state.deletedIds
            })
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
            updateSyncStatusUI('success');
            showToast('Data user berhasil disinkronkan ke Google Sheet ✅', 'success');
        } else {
            updateSyncStatusUI('error');
            console.warn('Push users failed:', data.message);
        }
    } catch (e) {
        console.warn('Push users failed:', e);
        updateSyncStatusUI('error');
    }
}



async function deleteUser(id) {
    const targetUser = state.users.find(u => u.id === id);
    if (targetUser && targetUser.role === 'ADMIN' && state.users.filter(u => u.role === 'ADMIN').length <= 1) { alert("Tidak bisa menghapus Administrator terakhir!"); return; }
    if (state.user && state.user.id === id) { alert("Tidak bisa menghapus akun sendiri!"); return; }
    if (confirm(`Hapus user "${targetUser.name}"?`)) {
        if (!state.deletedIds.users) state.deletedIds.users = [];
        state.deletedIds.users.push(id);
        state.users = state.users.filter(x => x.id !== id);
        await saveData();
        renderConfigView(document.getElementById('main-content'), 'system');
        // [FIX] Direct sync so deletions reach Google Sheet immediately
        if (state.scriptUrl) syncDelta(false);
    }
}

// --- 16. OUTCOME & HEP MODALS ---
function openOutcomeModal() {
    const currentDiagnosis = (window.tempFormData.diagnosis || '').toLowerCase();
    const currentICD = (window.tempFormData.icd || '').toLowerCase();
    const combinedDx = currentDiagnosis + ' ' + currentICD;
    let suggestedOM = '';
    for (const [key, data] of Object.entries(OUTCOME_MEASURES)) {
        if (data.keywords && data.keywords.some(kw => combinedDx.includes(kw))) { suggestedOM = key; break; }
    }
    const modalHtml = `
        <div class="bg-white px-6 py-4 border-b flex justify-between items-center sticky top-0 z-20"><h3 class="text-xl font-bold text-slate-800 flex items-center gap-2"><i data-lucide="calculator" class="text-emerald-600"></i> Kalkulator Klinis</h3><button onclick="closeModal()" class="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200"><i data-lucide="x" width="20"></i></button></div>
        <div class="px-6 py-6 overflow-y-auto modal-scroll max-h-[60vh] md:max-h-[70vh]">
            ${suggestedOM ? `<div class="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4 flex items-start gap-3 fade-in"><i data-lucide="lightbulb" class="text-blue-600 mt-0.5" width="20"></i><div><p class="text-xs font-bold text-blue-800 uppercase">Saran Sistem</p><p class="text-sm text-blue-700">Sesuai diagnosa: <strong>${suggestedOM}</strong></p></div></div>` : ''}
            <div class="mb-6"><label class="block text-sm font-bold text-slate-700 mb-2">Pilih Instrumen Ukur</label><select id="om-select" onchange="renderQuestionnaire(this.value)" class="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm font-medium text-slate-700"><option value="">-- Pilih Kuesioner --</option>${Object.keys(OUTCOME_MEASURES).map(k => `<option value="${k}" ${k === suggestedOM ? 'selected' : ''}>${k}</option>`).join('')}</select><p id="om-desc" class="text-xs text-slate-500 mt-2 italic"></p></div>
            <div id="om-questions" class="space-y-4"></div>
            <div id="om-result-area" class="hidden mt-6 bg-emerald-50 p-6 rounded-xl border border-emerald-200 text-center shadow-inner"><p class="text-sm text-emerald-800 font-bold uppercase tracking-wider">Hasil Perhitungan</p><h2 id="om-final-score" class="text-3xl font-black text-emerald-600 my-3">0%</h2><button onclick="saveOutcomeToNote()" class="bg-emerald-600 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all w-full flex justify-center items-center gap-2 btn-press"><i data-lucide="save" width="18"></i> Simpan ke Catatan</button></div>
        </div>`;
    document.getElementById('modal-content').innerHTML = modalHtml;
    document.getElementById('modal-container').classList.remove('hidden');
    lucide.createIcons();
    if (suggestedOM) renderQuestionnaire(suggestedOM);
}

function renderQuestionnaire(key) {
    const container = document.getElementById('om-questions');
    const desc = document.getElementById('om-desc');
    const resArea = document.getElementById('om-result-area');
    if (!key || !OUTCOME_MEASURES[key]) { container.innerHTML = ''; desc.innerText = ''; resArea.classList.add('hidden'); return; }

    const data = OUTCOME_MEASURES[key];
    desc.innerText = data.desc;
    resArea.classList.add('hidden');
    container.innerHTML = data.questions.map((q, idx) => `<div class="bg-slate-50 p-4 rounded-lg border border-slate-200"><p class="text-sm font-bold text-slate-800 mb-3">${idx + 1}. ${q.q}</p><div class="grid grid-cols-1 gap-2">${q.opts.map((opt, optIdx) => `<label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-2 rounded transition-colors border border-transparent hover:border-slate-100"><input type="radio" name="q-${idx}" value="${optIdx}" onchange="calculateOutcome('${key}')" class="accent-emerald-600 w-4 h-4"><span class="text-slate-600">${opt}</span></label>`).join('')}</div></div>`).join('');
}

function calculateOutcome(key) {
    const data = OUTCOME_MEASURES[key];
    const totalQ = data.questions.length;
    let scores = []; let allFilled = true;
    for (let i = 0; i < totalQ; i++) {
        const checked = document.querySelector(`#om-questions input[name="q-${i}"]:checked`);
        if (checked) scores.push(parseInt(checked.value)); else allFilled = false;
    }
    if (allFilled) {
        const resultText = data.calc(scores);
        const resArea = document.getElementById('om-result-area');
        document.getElementById('om-final-score').innerText = resultText;
        resArea.classList.remove('hidden');
        resArea.dataset.result = resultText;
        resArea.scrollIntoView({ behavior: 'smooth' });
    }
}

function saveOutcomeToNote() {
    const resArea = document.getElementById('om-result-area');
    const result = resArea.dataset.result;
    if (result) {
        const currentNote = window.tempFormData.custom_assessment || '';
        const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const newText = `${currentNote ? currentNote + '\n\n' : ''}[${time}] Evaluasi Objektif:\n${result}`;
        window.tempFormData.custom_assessment = newText;
        const textArea = document.getElementById('form-custom-assessment');
        if (textArea) textArea.value = newText;
        closeModal();
    }
}

function downloadBackup() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "backup_fisiota_" + new Date().toISOString().slice(0, 10) + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function restoreBackup(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            state = JSON.parse(e.target.result);
            saveData();
            alert("Data berhasil dipulihkan!");
            location.reload();
        } catch (err) { alert("File backup tidak valid!"); }
    };
    reader.readAsText(file);
}

// --- 17. PRINT LOGIC ---
function renderPrintView(container) {
    enablePrintPageMargins(); // ACTIVATE MARGINS FOR PRINT PAGE

    let targets = [];
    if (state.printSelection.length > 0) targets = state.assessments.filter(a => state.printSelection.includes(a.id));
    else if (state.currentAssessment) targets = [state.currentAssessment];

    if (targets.length === 0) { container.innerHTML = '<div class="p-10 text-center text-white">Tidak ada data untuk dicetak. <button onclick="closePrintView()" class="underline">Kembali</button></div>'; return; }

    const pagesHtml = targets.map(a => {
        const p = state.patients.find(pt => pt.id === a.patientId);
        return generateSingleAssessmentHTML(a, p);
    }).join('');

    let docTitle = 'Laporan_Assessment';
    if (targets.length === 1) {
        const a = targets[0];
        const p = state.patients.find(pt => pt.id === a.patientId);
        const nama = p ? p.name.replace(/[^a-zA-Z0-9 ]/g, '') : (a.name || 'Pasien');
        const pAppts = (state.assessments || []).filter(x => x.patientId === a.patientId).sort((x, y) => new Date(x.date) - new Date(y.date));
        const sessionNum = pAppts.findIndex(x => x.id === a.id) + 1;
        const diag = (a.diagnosis || 'Layanan').replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'Layanan';
        docTitle = `${nama}-${diag}-${sessionNum > 0 ? 'PertemuanKe' + sessionNum : 'P1'}-${new Date().toISOString().split('T')[0]}`;
    }
    if (!state.originalDocumentTitle) state.originalDocumentTitle = document.title;
    document.title = docTitle;
    state.printDocumentTitle = docTitle;

    container.innerHTML = `
        <div id="preview-layer" class="min-h-screen bg-slate-700 pb-20">
            <style type="text/css" media="print">
                @page { size: auto; margin: 0mm !important; }
                body { margin: 0 !important; }
            </style>
            <div id="preview-controls" class="sticky top-0 z-50 bg-slate-800 text-white p-4 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 no-print">
                <div><h2 class="text-lg font-bold">Print Preview</h2><p class="text-xs text-slate-400">Total: ${targets.length} Dokumen</p></div>
                <div class="flex gap-3">
                    <button onclick="closePrintView()" class="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 font-bold text-sm transition-colors border border-slate-600">Tutup</button>
                    <button onclick="handlePrintWithTip()" class="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-sm transition-colors shadow-lg flex items-center gap-2"><i data-lucide="printer" width="16"></i> Cetak / Print</button>
                </div>
            </div>
            <div id="print-area" class="flex flex-col items-center gap-0">${pagesHtml}</div>
        </div>`;
    lucide.createIcons();
}

function handlePrintWithTip() {
    if (confirm("⚠️ TIPS PENTING:\n\n1. Cari menu 'Setelan Lain' (More Settings).\n2. Ubah SKALA menjadi 'Sesuaikan' (Fit).\n\nLanjut membuka printer?")) {
        window.print();
    }
}


function closePrintView() {
    if (state.originalDocumentTitle) {
        document.title = state.originalDocumentTitle;
        state.originalDocumentTitle = null;
    }
    navigate('assessments');
}

function printHTML(html, title = 'Document') {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '100vw'; // Hide far away but keep in DOM
    iframe.style.bottom = '100vh';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    // Inject margin 0mm inside iframe to hide headers
    const styledHtml = `<style type="text/css" media="print">@page { margin: 0mm !important; } body{ margin: 0 !important;}</style>` + html;
    doc.write(styledHtml);
    doc.close();

    // [SMART WAIT] Ensure images are loaded before printing
    const checkImages = () => {
        const images = iframe.contentWindow.document.getElementsByTagName('img');
        const allLoaded = Array.from(images).every(img => img.complete && img.naturalHeight !== 0);

        if (allLoaded) {
            triggerPrint();
        } else {
            // Check again in 100ms
            setTimeout(checkImages, 100);
        }
    };

    const triggerPrint = () => {
        iframe.contentWindow.focus();
        const titleBackup = document.title;
        document.title = title;

        setTimeout(() => {
            iframe.contentWindow.print();
            document.title = titleBackup;
            setTimeout(() => {
                if (document.body.contains(iframe)) document.body.removeChild(iframe);
            }, 1000);
        }, 100);
    };

    // Fail-safe: Start checking after a short delay and force print after max 3s
    setTimeout(checkImages, 300);
    setTimeout(triggerPrint, 3000); // Max wait 3s
}

function generateReceiptHTML(apptId, type = 'RECEIPT', paperSize = '58mm') {
    const a = (state.appointments || []).find(x => x.id === apptId);
    if (!a) return '';
    const p = (state.patients || []).find(pt => pt.id === a.patientId);
    const nama = p ? p.name : (a.visitor_name || a.name || 'Pasien');

    // FIX: Selalu bersihkan format Rp agar kalkulasi valid
    const feeBase = parseRp(a.fee) || (p ? parseRp(p.defaultFee) : 0) || 0;
    const discount = parseRp(a.discount) || 0;

    // Jika finalAmount di data adalah 0 tapi feeBase ada (dan diskon bukan full), 
    // maka kita hitung ulang (mengatasi data corrupt dari bug sebelumnya)
    let savedFinal = a.finalAmount !== undefined ? parseRp(a.finalAmount) : null;
    let finalAmount = (savedFinal !== null && savedFinal > 0) ? savedFinal : (feeBase - discount);

    const method = a.paymentMethod || state._selectedPaymentMethod || 'Tunai';

    const now = new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const qrHTML = '';

    const wConfig = paperSize === 'A4' ? {
        page: 'A4 portrait',
        paper: '100%',
        maxWidth: '800px',
        padding: '30px',
        fontSize: '11pt',
        qrSize: '150px',
        lineW: '100%',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        border: 'border-bottom: 1px solid #ccc;' // Instead of dashed lines for A4
    } : paperSize === '80mm' ? {
        page: '80mm auto',
        paper: '100%',
        maxWidth: '300px',
        padding: '15px',
        fontSize: '10pt',
        qrSize: '120px',
        lineW: '100%',
        fontFamily: "'Courier New', Courier, monospace",
        border: 'border-top: 1px dashed #000;'
    } : {
        page: '58mm auto',
        paper: '100%',
        maxWidth: '220px',
        padding: '10px',
        fontSize: '9pt',
        qrSize: '100px',
        lineW: '100%',
        fontFamily: "'Courier New', Courier, monospace",
        border: 'border-top: 1px dashed #000;'
    };

    return `
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @page { 
                size: ${wConfig.page}; 
                margin: 0mm; 
            }
            body { 
                margin: 0; 
                padding: 20px;
                background: #f1f5f9;
                font-family: ${wConfig.fontFamily}; 
                font-size: ${wConfig.fontSize}; 
                color: #000;
                line-height: 1.4;
            }
            .paper-preview {
                width: ${wConfig.paper}; 
                max-width: ${wConfig.maxWidth};
                margin: 0 auto; 
                background: #fff;
                padding: ${wConfig.padding}; 
                box-sizing: border-box;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            }
            @media print {
                html, body { 
                    background: #fff;
                    padding: 0; 
                    margin: 0;
                }
                .paper-preview {
                    width: 100%;
                    max-width: ${wConfig.maxWidth};
                    margin: 0 auto; 
                    padding: ${wConfig.padding}; 
                    box-shadow: none;
                }
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .bold { font-weight: bold; }
            .uppercase { text-transform: uppercase; }
            .dashed-line { ${wConfig.border} margin: 10px 0; }
            .flex { display: flex; justify-content: space-between; align-items: flex-start; }
            .clinic-name { font-size: 1.25em; margin-bottom: 2px; }
            .clinic-sub { font-size: 0.8em; margin-bottom: 5px; }
            .receipt-type { font-size: 1em; padding: 4px 0; margin: 12px 0; border: 1px solid #000; background: #eee !important; -webkit-print-color-adjust: exact; }
            .qr-container { margin: 15px 0; text-align: center; }
            .qr-title { font-size: 0.9em; margin-bottom: 6px; }
            .qr-image { width: ${wConfig.qrSize}; height: ${wConfig.qrSize}; border: 1px solid #eee; padding: 2px; background: #fff; display: inline-block; }
            .footer { font-size: 0.8em; margin-top: 15px; }
            .item-row { margin: 4px 0; }
        </style>
    </head>
    <body>
        <div class="paper-preview">
            <div class="text-center">
                ${state.clinicInfo.logoUrl ? `<div style="margin-bottom: 8px;"><img src="${convertDriveUrl(state.clinicInfo.logoUrl)}" style="height: 65px; width: auto; object-fit: contain; margin: 0 auto;"></div>` : ''}
                <div class="clinic-name bold uppercase">${state.clinicInfo.name || 'FISIOTA'}</div>
                <div class="clinic-sub uppercase">${state.clinicInfo.subname || ''}</div>
                <div style="font-size: 0.8em; max-width: 95%; margin: 0 auto;">${state.clinicInfo.address || ''}</div>
                <div style="font-size: 0.85em;">WA: ${state.clinicInfo.phone || ''}</div>
                
                <div class="receipt-type bold uppercase">
                    ${type === 'BILL' ? 'Tagihan Pembayaran' : 'Kuitansi Pembayaran'}
                </div>
            </div>

            <div style="font-size: 0.9em;">
                <div class="flex"><span>Tgl Cetak:</span> <span>${now}</span></div>
                <div class="flex"><span>Pasien:</span> <span class="bold">${nama}</span></div>
                <div class="flex"><span>Tgl Kunj:</span> <span>${a.date}</span></div>
            </div>

            <div class="dashed-line"></div>
            
            <div class="bold uppercase" style="font-size: 0.9em; margin-bottom: 6px;">Rincian Layanan</div>
            <div class="item-row flex" style="font-size: 0.9em;">
                <span style="flex: 1; padding-right: 10px;">${a.diagnosis || 'Layanan Fisioterapi'}</span>
                <span>${formatRp(feeBase)}</span>
            </div>
            
            <div class="dashed-line"></div>
            
            <div class="flex" style="font-size: 0.9em;"><span>Subtotal:</span> <span>${formatRp(feeBase)}</span></div>
            ${discount > 0 ? `<div class="flex" style="font-size: 0.9em;"><span>Diskon:</span> <span>-${formatRp(discount)}</span></div>` : ''}
            <div class="flex bold" style="font-size: 1.1em; margin-top: 8px;">
                <span>TOTAL:</span>
                <span>${formatRp(finalAmount)}</span>
            </div>

            <div class="dashed-line"></div>
            
            <div class="flex" style="font-size: 0.9em;"><span>Metode:</span> <span class="bold uppercase">${method}</span></div>
            <div class="flex" style="font-size: 0.9em;"><span>Status:</span> <span class="bold uppercase">${type === 'BILL' ? 'BELUM BAYAR' : 'LUNAS'}</span></div>

            ${qrHTML}

            <div class="footer text-center">
                ${type === 'RECEIPT' ? '<p class="bold" style="font-size: 1.1em; margin:0;">TERIMA KASIH</p><p style="margin: 4px 0;">Semoga lekas sembuh & sehat selalu</p>' : '<p class="bold" style="font-size: 1.1em; margin:0;">BUKTI TAGIHAN</p><p style="margin: 4px 0;">Harap disimpan</p>'}
                <div class="dashed-line"></div>
                <p style="font-size: 0.8em; margin:0;">E-Receipt by FISIOTA.com</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

function generateSingleAssessmentHTML(a, p) {
    const conf = state.pdfConfig || {};
    const fontMap = { 'sans': 'ui-sans-serif, system-ui, sans-serif', 'serif': 'Georgia, "Times New Roman", serif', 'mono': 'ui-monospace, monospace' };
    const activeFont = fontMap[conf.fontFamily || 'sans'];

    const renderList = (text) => {
        if (!text) return '<div style="color: #cbd5e1; font-style: italic; padding-left: 4px;">-</div>';
        const items = Array.isArray(text) ? text : String(text).split('\n');
        const cleanItems = items.filter(i => i && i.trim() !== '');
        if (cleanItems.length === 0) return '<div style="color: #cbd5e1; font-style: italic; padding-left: 4px;">-</div>';
        return cleanItems.map(i => `
            <div style="display: table; width: 100%; margin-bottom: 2px; break-inside: avoid;">
                <div style="display: table-cell; width: 10px; vertical-align: top; padding-top: 5px;">
                    <div style="width: 3px; height: 3px; background: #94a3b8; border-radius: 50%;"></div>
                </div>
                <div style="display: table-cell; vertical-align: top; line-height: 1.3; font-size: 0.82em; text-align: justify; color: #475569;">${i}</div>
            </div>`).join('');
    };

    let painPointsHTML = '';
    if (a.pain_points && Array.isArray(a.pain_points)) {
        painPointsHTML = a.pain_points.map((pt, idx) => `<div class="pain-point-marker absolute w-3 h-3 bg-red-600 rounded-full border border-white flex items-center justify-center text-[7px] text-white font-bold" style="left: ${pt.x}%; top: ${pt.y}%; z-index: 10; margin-left: -6px; margin-top: -6px;">${idx + 1}</div>`).join('');
    }

    return `
    <div class="print-page-wrapper page-break relative text-slate-800 bg-white" style="font-family: ${activeFont}; font-size: ${conf.fontSize || '10pt'}; width: 100%; box-sizing: border-box; padding: 30px;">
        
        <!-- HEADER -->
        <div style="margin-bottom: 6px; border-bottom: 2px solid #0f172a; padding-bottom: 8px;">
            ${conf.showKop ? `
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    ${state.clinicInfo.logoUrl ? `
                    <td style="width: 85px; padding-right: 15px; vertical-align: middle;">
                        <img src="${convertDriveUrl(state.clinicInfo.logoUrl)}" style="width: 85px; height: 85px; object-fit: contain;">
                    </td>` : ''}
                    <td style="vertical-align: bottom;">
                        <h1 style="font-size: 24px; font-weight: 950; color: #0f172a; letter-spacing: -0.05em; margin: 0; text-transform: uppercase;">${state.clinicInfo.name || 'FISIOTA'}</h1>
                        <p style="font-size: 8px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 2px;">${state.clinicInfo.subname || 'PHYSIOTHERAPY & REHAB'}</p>
                    </td>
                    <td style="text-align: right; vertical-align: bottom; font-size: 8px; color: #64748b; line-height: 1.2;">
                        <p style="font-weight: 900; color: #334155;">Praktek Mandiri Fisioterapi</p>
                        <p style="margin: 0;">${state.clinicInfo.address || '-'}</p>
                        <p style="margin: 0;">${state.clinicInfo.phone || '-'}</p>
                    </td>
                </tr>
            </table>` : ''}
        </div>

        <!-- INFO BAR -->
        ${conf.showPatientInfo ? `
        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
            <table style="width: 100%; font-size: 0.8em; border-collapse: collapse;">
                <tr>
                    <td style="width: 45%;">
                        <span style="color: #94a3b8; font-weight: bold; text-transform: uppercase;">Nama:</span> <span style="font-weight: 950; color: #0f172a; text-transform: uppercase; margin-left: 4px;">${p ? p.name : '-'}</span>
                        ${p && p.nik ? `<div style="font-size: 0.75em; color: #64748b; font-family: monospace; margin-top: 2px;">NIK: ${p.nik}</div>` : ''}
                    </td>
                    <td style="width: 30%;"><span style="color: #94a3b8; font-weight: bold; text-transform: uppercase;">No. RM:</span> <span style="font-family: monospace; font-weight: bold; color: #334155; margin-left: 4px;">${p ? p.id : '-'}</span></td>
                    <td style="width: 25%; text-align: right;"><span style="color: #94a3b8; font-weight: bold; text-transform: uppercase;">Tgl:</span> <span style="font-weight: bold; color: #0f172a; margin-left: 4px;">${new Date(a.date).toLocaleDateString('id-ID')}</span></td>
                </tr>
            </table>
        </div>` : ''}

        <!-- SECTION BLOCK 1: DIAGNOSA & ANAMNESIS -->
        <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 6px;">
            <tr>
                <td style="width: 48%; vertical-align: top; padding-right: 15px;">
                    ${conf.showDiagnosis ? `
                    <div class="break-inside-avoid" style="page-break-inside: avoid; break-inside: avoid;">
                        <h3 style="font-weight: 950; color: #0f172a; text-transform: uppercase; margin-bottom: 4px; font-size: 0.75em; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px;">A. Diagnosa Medis</h3>
                        <div style="padding: 6px 8px; background: #f8fafc; border-radius: 4px;">
                            <span style="display: block; font-weight: 900; color: #1e293b; font-size: 0.85em;">${a.diagnosis || (p ? p.diagnosis : '-')}</span>
                            <span style="color: #64748b; font-size: 0.65em; font-weight: bold;">ICD-10: ${a.icd || '-'}</span>
                        </div>
                    </div>` : ''}
                    
                    ${conf.showBodyChart ? `
                    <div style="margin-top: 10px; border: 1px solid #f1f5f9; border-radius: 6px; padding: 8px; text-align: center; break-inside: avoid;">
                        <div style="position: relative; width: 130px; margin: 0 auto;">
                            <img src="${window.IMG_ASSETS.body_chart}" style="width: 100%; height: auto; mix-blend-multiply: multiply; opacity: 0.7;" />
                            ${painPointsHTML}
                        </div>
                    </div>` : ''}
                </td>
                <td style="width: 52%; vertical-align: top; padding-left: 15px; border-left: 1px solid #f1f5f9;">
                    ${conf.showAnamnesis ? `
                    <div class="break-inside-avoid" style="page-break-inside: avoid; break-inside: avoid; margin-bottom: 6px;">
                        <h3 style="font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; font-size: 0.75em;">Keluhan Utama (Anamnesis)</h3>
                        <p style="color: #334155; line-height: 1.4; white-space: pre-line; text-align: justify; font-size: 0.82em;">${a.custom_assessment || '-'}</p>
                    </div>` : ''}

                    ${(a.prenatal || a.natal || a.postnatal) ? `
                    <div style="margin-bottom: 8px; padding: 8px; background: #f0f7ff; border-radius: 6px; break-inside: avoid;">
                        <h4 style="font-weight: 900; color: #2563eb; font-size: 0.65em; margin-bottom: 4px; text-transform: uppercase; border-bottom: 1px solid #dbeafe; padding-bottom: 2px;">Riwayat Pediatri</h4>
                        <table style="width: 100%; font-size: 0.75em; border-collapse: collapse;">
                            ${a.prenatal ? `<tr><td style="width: 30%; color: #64748b; padding-bottom: 2px;">Prenatal:</td><td style="font-weight: bold; color: #334155;">${a.prenatal}</td></tr>` : ''}
                            ${a.natal ? `<tr><td style="color: #64748b; padding-bottom: 2px;">Natal:</td><td style="font-weight: bold; color: #334155;">${a.natal}</td></tr>` : ''}
                            ${a.postnatal ? `<tr><td style="color: #64748b; padding-bottom: 2px;">Postnatal:</td><td style="font-weight: bold; color: #334155;">${a.postnatal}</td></tr>` : ''}
                        </table>
                    </div>` : ''}

                    ${conf.showObjective ? `
                    <div class="break-inside-avoid" style="page-break-inside: avoid; break-inside: avoid;">
                        <h3 style="font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; font-size: 0.75em;">Pemeriksaan Objektif</h3>
                        <div style="background: #fdfdfd; border: 1px solid #f1f5f9; border-radius: 6px; padding: 6px 8px;">
                            
                            <!-- [NEW] TTV IN PDF -->
                            <div style="margin-bottom: 8px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 6px;">
                                <p style="font-size: 0.62em; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Tanda-Tanda Vital (TTV):</p>
                                <table style="width: 100%; font-size: 0.72em; border-collapse: collapse;">
                                    <tr>
                                        <td><span style="color: #94a3b8;">TD:</span> <b>${a.ttv_td || '-'}</b> <small>mmHg</small></td>
                                        <td><span style="color: #94a3b8;">HR:</span> <b>${a.ttv_hr || '-'}</b> <small>bpm</small></td>
                                        <td><span style="color: #94a3b8;">RR:</span> <b>${a.ttv_rr || '-'}</b> <small>x/m</small></td>
                                        <td><span style="color: #94a3b8;">Suhu:</span> <b>${a.ttv_temp || '-'}</b> <small>°C</small></td>
                                        <td><span style="color: #94a3b8;">SpO2:</span> <b>${a.ttv_spo2 || '-'}</b> <small>%</small></td>
                                    </tr>
                                </table>
                            </div>

                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px;">
                                <tr>
                                    <td style="font-size: 0.7em; font-weight: bold; color: #64748b;">VAS Nyeri</td>
                                    <td style="font-weight: 950; font-size: 1.2em; color: #2563eb; text-align: right;">${a.vas || 0}<span style="font-size: 0.5em; color: #94a3b8; font-weight: normal;">/10</span></td>
                                </tr>
                            </table>
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.78em; color: #475569;">
                                <tr>
                                    <td style="padding-bottom: 2px; vertical-align: top;">ROM:</td>
                                    <td style="font-weight: bold; text-align: right; line-height: 1.2;">
                                        <div style="font-size: 0.85em;">
                                            ${(() => {
                const formatISOM = (str) => {
                    if (!str || str === '-' || str === 'Normal') return str;
                    const parts = str.split(' ');
                    if (parts.length < 2) return str;
                    const p = parts[0];
                    const v = parts[1].split('-');
                    if (v.length < 3) return str;
                    return `${p}: ${v[0]}° - ${v[1]}° - ${v[2]}°`;
                };
                const rd = formatISOM(a.rom_d);
                const rs = formatISOM(a.rom_s);

                let html = '';
                if (a.rom_d) html += `<span>(D) ${rd}</span>`;
                if (a.rom_d && a.rom_s) html += '<span style="margin: 0 4px; color: #cbd5e1;">|</span>';
                if (a.rom_s) html += `<span>(S) ${rs}</span>`;
                if (!a.rom_d && !a.rom_s) html += (a.obj?.rom || '-');
                return html;
            })()}
                                        </div>
                                        <div style="font-size: 0.75em; font-weight: normal; color: #64748b; margin-top: 1px;">${a.obj?.rom_part && a.obj.rom_part !== '-' ? a.obj.rom_part : ''}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 2px; vertical-align: top;">MMT:</td>
                                    <td style="font-weight: bold; text-align: right; line-height: 1.2;">
                                        <div style="font-size: 0.85em;">
                                            ${a.mmt_d ? `<span>(D) ${a.mmt_d}</span>` : ''}
                                            ${a.mmt_d && a.mmt_s ? '<span style="margin: 0 4px; color: #cbd5e1;">|</span>' : ''}
                                            ${a.mmt_s ? `<span>(S) ${a.mmt_s}</span>` : ''}
                                            ${!a.mmt_d && !a.mmt_s ? (a.obj?.mmt || '-') : ''}
                                        </div>
                                        <div style="font-size: 0.75em; font-weight: normal; color: #64748b; margin-top: 1px;">${a.obj?.mmt_part && a.obj.mmt_part !== '-' ? a.obj.mmt_part : ''}</div>
                                    </td>
                                </tr>
                                <tr><td style="padding-bottom: 2px;">Balance:</td><td style="font-weight: bold; text-align: right;">${a.obj?.balance || '-'}</td></tr>
                            </table>
                        </div>
                        
                        <!-- [NEW] POSITIVE SPECIAL TESTS IN PDF -->
                        ${(() => {
                const specTests = a.obj?.special_tests || {};
                const pos = [];
                for (const tid in specTests) {
                    if (specTests[tid] === '(+)') {
                        let name = tid;
                        for (const r in SPECIAL_TESTS_DB) {
                            const t = SPECIAL_TESTS_DB[r].find(x => x.id === tid);
                            if (t) { name = t.name; break; }
                        }
                        pos.push(name);
                    }
                }
                if (pos.length === 0 && !a.obj?.special_tests_note) return '';
                return `
                            <div style="margin-top: 8px; break-inside: avoid;">
                                <p style="font-size: 0.62em; font-weight: 950; color: #e11d48; text-transform: uppercase; margin-bottom: 3px; border-bottom: 1px dotted #fda4af; padding-bottom: 2px;">Hasil Tes Spesifik:</p>
                                <div style="display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 4px;">
                                    ${pos.map(n => `<span style="background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; padding: 1.5px 6px; border-radius: 4px; font-size: 0.68em; font-weight: bold; display: inline-block;">${n} (+)</span>`).join('')}
                                </div>
                                ${a.special_tests_note ? `<div style="font-size: 0.72em; font-style: italic; color: #475569; padding: 4px 8px; background: #fff1f2/30; border-left: 2px solid #e11d48; line-height: 1.2; margin-top: 4px;"><b>Note:</b> ${a.special_tests_note}</div>` : ''}
                            </div>`;
            })()}
                    </div>` : ''}
                </td>
            </tr>
        </table>

        <!-- SECTION BLOCK 2: ICF -->
        ${(conf.showImpairment || conf.showLimitation) ? `
        <div class="break-inside-avoid" style="margin-bottom: 6px; page-break-inside: avoid; break-inside: avoid;">
            <h3 style="font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; font-size: 0.75em;">Problem ICF</h3>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #f1f5f9; border-radius: 6px; table-layout: fixed; overflow: hidden;">
                <tr>
                    <td style="width: 50%; vertical-align: top; padding: 10px; border-right: 1px solid #f1f5f9; background: #fff;">
                        <h4 style="font-weight: 950; color: #334155; font-size: 0.75em; margin-bottom: 6px; text-transform: uppercase;">B. Impairment</h4>
                        <div style="margin-bottom: 6px;">
                            <p style="font-size: 0.62em; font-weight: 900; color: #2563eb; margin-bottom: 2px; text-transform: uppercase;">Body Function (b)</p>
                            ${renderList(a.b)}
                        </div>
                        <div>
                            <p style="font-size: 0.62em; font-weight: 900; color: #2563eb; margin-bottom: 2px; text-transform: uppercase;">Body Structure (s)</p>
                            ${renderList(a.s)}
                        </div>
                    </td>
                    <td style="width: 50%; vertical-align: top; padding: 10px; background: #fdfdfd;">
                        <h4 style="font-weight: 950; color: #334155; font-size: 0.75em; margin-bottom: 6px; text-transform: uppercase;">C. Activity & Participation</h4>
                        <div style="margin-bottom: 6px;">
                            <p style="font-size: 0.62em; font-weight: 900; color: #2563eb; margin-bottom: 2px; text-transform: uppercase;">Activity (d)</p>
                            ${renderList(a.d_act)}
                        </div>
                        <div>
                            <p style="font-size: 0.62em; font-weight: 900; color: #2563eb; margin-bottom: 2px; text-transform: uppercase;">Participation (d)</p>
                            ${renderList(a.d_part)}
                        </div>
                    </td>
                </tr>
            </table>
        </div>` : ''}

        <!-- SECTION BLOCK 3: HMS -->
        ${a.hms_diagnosis ? `
        <div class="break-inside-avoid" style="margin-bottom: 6px; page-break-inside: avoid; break-inside: avoid;">
            <div style="border: 1px solid #dcfce7; background: #f0fdf4; border-radius: 6px; padding: 10px; page-break-inside: avoid; break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
                    <h3 style="font-weight: 950; color: #166534; text-transform: uppercase; font-size: 0.75em; margin: 0;">D. Analisis Sistem Gerak (HMS)</h3>
                    ${(() => {
                try {
                    const hms = JSON.parse(a.hms_notes);
                    const path = hms.activeTab === 'msi' ? 'MSI / Structural' : 'Neuro / Functional';
                    return `<span style="font-size: 0.55em; font-weight: 900; background: #fff; border: 1px solid #dcfce7; color: #166534; padding: 1px 6px; border-radius: 10px;">${path}</span>`;
                } catch (e) { return ''; }
            })()}
                </div>
                <div style="font-weight: 950; color: #0f172a; font-size: 1.05em; margin-bottom: 6px;">${a.hms_diagnosis}</div>
                
                ${(() => {
                if (!a.hms_notes) return '';
                let notes = a.hms_notes;
                if (typeof notes === 'string') {
                    try { notes = JSON.parse(notes); } catch (e) { return ''; }
                }
                if (!notes || typeof notes !== 'object') return '';

                let tallies = [];
                if (Array.isArray(notes.tally) && notes.tally.length > 0) {
                    tallies = notes.tally;
                } else if (Array.isArray(notes.selectedObs)) {
                    const counts = {};
                    notes.selectedObs.forEach(o => {
                        const dx = (o.diagnosis || o.dx || 'Lainnya').trim();
                        counts[dx] = (counts[dx] || 0) + 1;
                    });
                    tallies = Object.entries(counts).map(([dx, n]) => ({ dx, n }));
                }

                if (tallies.length === 0) return '';
                const tallyMap = {};
                tallies.forEach(t => {
                    const dx = (t.dx || 'Lainnya').trim();
                    const score = parseInt(t.score || t.n || 0);
                    tallyMap[dx] = (tallyMap[dx] || 0) + score;
                });
                const mergedTallies = Object.entries(tallyMap).map(([dx, n]) => ({ dx, n })).sort((x, y) => y.n - x.n);

                let tallyHtml = '<p style="font-size: 0.62em; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Diagnosa & Tally Hasil Analisa:</p>';
                tallyHtml += '<div style="display: flex; flex-wrap: wrap; gap: 4px;">';
                mergedTallies.forEach((t, i) => {
                    tallyHtml += `<div style="padding: 2px 8px; border-radius: 4px; border: 1px solid #bbf7d0; background: ${i === 0 ? '#166534' : '#fff'}; color: ${i === 0 ? '#fff' : '#166534'}; font-size: 0.62em; font-weight: 900;">${i === 0 ? '🏆 ' : ''}${t.dx} (${t.n})</div>`;
                });
                tallyHtml += '</div>';
                return tallyHtml;
            })()}
            </div>
        </div>` : ''}

        <!-- SECTION BLOCK 4: INTERVENTION -->
        <div class="break-inside-avoid" style="margin-bottom: 6px; page-break-inside: avoid; break-inside: avoid;">
            <h3 style="font-weight: 950; color: #0f172a; text-transform: uppercase; margin-bottom: 4px; font-size: 0.75em;">E. Intervensi & Program</h3>
            <div style="border: 1px solid #f1f5f9; border-radius: 6px; overflow: hidden;">
                ${conf.showIntervention ? `
                <div style="padding: 10px; background: #fff; border-bottom: 1px solid #f1f5f9;">
                    <table style="width: 100%; border-collapse: collapse;">
                        ${(() => {
                if (!a.intervention || a.intervention.length === 0) return '<tr><td style="color: #cbd5e1; font-style: italic;">-</td></tr>';
                let rows = '';
                for (let i = 0; i < a.intervention.length; i += 2) {
                    rows += `<tr>
                        <td style="width: 50%; padding: 4px 0; vertical-align: top;">
                            <div style="display: inline-block; padding: 2px 10px; border: 1px solid #e2e8f0; border-radius: 15px; background: #fff; font-size: 0.72em; color: #334155; break-inside: avoid;">
                                <span style="color: #94a3b8; font-size: 0.8em; margin-right: 2px;">○</span> ${a.intervention[i]}
                            </div>
                        </td>
                        <td style="width: 50%; padding: 4px 0; vertical-align: top;">
                            ${a.intervention[i + 1] ? `<div style="display: inline-block; padding: 2px 10px; border: 1px solid #e2e8f0; border-radius: 15px; background: #fff; font-size: 0.72em; color: #334155; break-inside: avoid;"><span style="color: #94a3b8; font-size: 0.8em; margin-right: 2px;">○</span> ${a.intervention[i + 1]}</div>` : ''}
                        </td>
                    </tr>`;
                }
                return rows;
            })()}
                    </table>
                </div>` : ''}
                
                ${conf.showEvalPlan ? `
                <table class="break-inside-avoid" style="width: 100%; border-collapse: collapse; table-layout: fixed; background: #f8fafc; page-break-inside: avoid !important; break-inside: avoid !important;">
                    <tr>
                        <td style="width: 65%; vertical-align: top; padding: 10px; border-right: 1px solid #f1f5f9;">
                            <span style="font-size: 0.62em; font-weight: 900; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 4px;">Evaluasi Sesi Ini</span>
                            ${renderList(a.eval)}
                        </td>
                        <td style="width: 35%; vertical-align: top; padding: 10px;">
                            <span style="font-size: 0.62em; font-weight: 900; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 4px;">Planning / Rencana</span>
                            <div style="font-weight: 950; color: #2563eb; font-size: 1.1em; line-height: 1.1; margin-top: 2px;">${a.plan || '-'}</div>
                        </td>
                    </tr>
                </table>` : ''}
            </div>
        </div>

        <!-- SIGNATURE -->
        <div class="break-inside-avoid" style="page-break-inside: avoid !important; break-inside: avoid !important; margin-top: 25px; padding-top: 5px;">
            <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                <tr>
                    <td style="width: 60%; vertical-align: top; padding-right: 20px;">
                        ${conf.showInformedConsent ? `
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; position: relative;">
                            <h4 style="font-size: 0.7em; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Persetujuan Pasien</h4>
                            <p style="font-size: 0.72em; color: #475569; font-style: italic; line-height: 1.3; text-align: justify; margin-bottom: 6px;">"${conf.informedConsentText || '-'}"</p>
                            ${a.patient_signature ? `
                            <div style="margin: 8px 0; text-align: center;">
                                <img src="${a.patient_signature}" style="max-height: 60px; max-width: 100%; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                            </div>` : ''}
                            <div style="font-size: 0.6em; color: #94a3b8;">
                                ${a.is_consented ? `<span style="color: #16a34a; font-weight: 900;">● TERVERIFIKASI DIGITAL: ${a.consent_timestamp || '-'}</span>` : 'Persetujuan diperlukan.'}
                            </div>
                        </div>` : ''}
                    </td>
                    <td style="width: 40%; text-align: right; vertical-align: bottom;">
                        ${conf.showSignature ? `
                        <div style="display: inline-block; width: 220px; text-align: center;">
                            <p style="font-size: 0.78em; color: #64748b; margin-bottom: 35px;">${state.clinicInfo.city || 'Blitar'}, ${new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p style="font-weight: 950; color: #0f172a; border-bottom: 1.5px solid #0f172a; display: inline-block; padding-bottom: 2px; margin-bottom: 4px; text-transform: uppercase;">${state.clinicInfo.therapist}</p>
                            <p style="font-size: 0.7em; color: #64748b; font-weight: bold;">SIPF: ${state.clinicInfo.sipf}</p>
                        </div>` : ''}
                    </td>
                </tr>
            </table>
        </div>
    </div>`;
}

// --- 18. RESET PASSWORD LOGIC ---
let tempResetCode = null;
async function requestResetCode(e) {
    if (!LICENSE_API_URL) { alert("GAGAL: LICENSE_API_URL belum terkonfigurasi di config.js."); return; }
    const otp = Math.floor(100000 + Math.random() * 900000);
    tempResetCode = otp.toString();
    const btn = e.target;
    const originalText = btn.innerText;
    btn.innerText = "Mengirim..."; btn.disabled = true;

    // Get current sheet_id and clinic info
    const currentSheetId = (state.scriptUrl && state.scriptUrl.includes('id=')) ? state.scriptUrl.split('id=')[1] : (state.sheetId || '');
    const clinicName = state.clinicInfo ? state.clinicInfo.name : "Unknown Clinic";

    try {
        await fetch(LICENSE_API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Use text/plain to bypass CORS Preflight
            body: JSON.stringify({
                action: 'log_reset',
                code: tempResetCode,
                sheet_id: currentSheetId,
                clinic_name: clinicName,
                deviceInfo: navigator.userAgent,
                timestamp: new Date().toLocaleString()
            })
        });
        showOtpInputModal();
        alert("KODE RAHASIA dikirim ke Google Sheet! Silakan hubungi Admin Pusat.");
    } catch (error) {
        console.error("Reset request error:", error);
        alert("Gagal koneksi ke server pusat.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

function showOtpInputModal() {
    const modalHtml = `<div class="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center border-t-4 border-red-500"><div class="mb-4"><div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2"><i data-lucide="shield-alert" width="24"></i></div><h3 class="text-lg font-black text-slate-800">Verifikasi Reset</h3><p class="text-xs text-slate-500">Masukkan 6 digit kode dari Google Sheet.</p></div><input type="text" id="otp-input" maxlength="6" class="w-full text-center text-2xl font-mono font-bold tracking-widest border-2 border-slate-200 rounded-xl p-3 focus:border-red-500 outline-none mb-4" placeholder="000000"><div class="flex gap-2"><button type="button" onclick="closeModal()" class="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200">Batal</button><button type="button" onclick="verifyResetCode()" class="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200 btn-press">Reset Sekarang</button></div></div>`;
    document.getElementById('modal-content').innerHTML = modalHtml;
    document.getElementById('modal-container').classList.remove('hidden');
    lucide.createIcons();
}

async function verifyResetCode() {
    const inputCode = document.getElementById('otp-input').value;
    if (inputCode === tempResetCode) {
        if (confirm("Kode Benar! Hapus semua user custom?")) {
            const currentSheetId = (state.scriptUrl && state.scriptUrl.includes('id=')) ? state.scriptUrl.split('id=')[1] : (state.sheetId || '');
            if (LICENSE_API_URL) {
                try {
                    await fetch(LICENSE_API_URL, {
                        method: 'POST',
                        mode: 'cors',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify({
                            action: 'confirm_reset',
                            code: inputCode,
                            sheet_id: currentSheetId
                        })
                    });
                    await new Promise(r => setTimeout(r, 1500));
                } catch (e) { console.error("Confirm reset error:", e); }
            }
            // Hapus dari LocalStorage
            localStorage.removeItem('erm_users');
            // Hapus dari IndexedDB (Store users)
            if (window.fisiotaDB) {
                await window.fisiotaDB.delete('users');
            }
            alert("✅ RESET BERHASIL! User dikembalikan ke default.");
            location.reload();
        }
    } else { alert("❌ KODE SALAH!"); }
}

async function resetUserToDefault() {
    if (confirm("⚠️ PERINGATAN: Semua akun user custom akan dihapus dan dikembalikan ke default (admin/123).\n\nLanjutkan?")) {
        localStorage.removeItem('erm_users');
        if (window.fisiotaDB) {
            await window.fisiotaDB.delete('users');
        }
        alert("✅ User telah direset ke default.");
        location.reload();
    }
}

// --- 19. INITIALIZATION ---



// --- 12. GENERIC MODAL & PICKER LOGIC ---
// [IDE 3] SMART ICF PICKER WITH REAL-TIME QUALIFIER DESCRIPTION
const ICF_QUALIFIERS = {
    '0': { label: 'TIDAK ada masalah', desc: '0-4%', color: 'bg-emerald-500' },
    '1': { label: 'Masalah RINGAN', desc: '5-24%', color: 'bg-green-500' },
    '2': { label: 'Masalah SEDANG', desc: '25-49%', color: 'bg-amber-500' },
    '3': { label: 'Masalah BERAT', desc: '50-95%', color: 'bg-orange-500' },
    '4': { label: 'Masalah TOTAL', desc: '96-100%', color: 'bg-red-500' },
    '8': { label: 'Tidak ditentukan', desc: 'Not specified', color: 'bg-slate-400' },
    '9': { label: 'Tidak relevan', desc: 'Not applicable', color: 'bg-slate-300' }
};

function openSmartICFPicker(key, title) {
    window.currentPickerKey = key; // Store globally for filterPickerItems
    const currentDx = (window.tempFormData ? window.tempFormData.diagnosis : '') || '';
    const dxLower = currentDx.toLowerCase();
    const rawKeywords = dxLower.split(/[\s/.,()]+/).filter(k => k.length > 2);

    // Keyword Expansion (Mendukung istilah Indonesia)
    const keywords = [...rawKeywords];
    if (window.IndonSynonyms) {
        Object.keys(window.IndonSynonyms).forEach(idenKey => {
            if (dxLower.includes(idenKey)) {
                keywords.push(window.IndonSynonyms[idenKey]);
            }
        });
    }

    const templateItems = new Set();
    const recommendedSet = new Set();

    // Priority 1: Exact Template Match
    if (currentDx && ICF_TEMPLATES[currentDx] && ICF_TEMPLATES[currentDx][key]) {
        ICF_TEMPLATES[currentDx][key].forEach(item => {
            if (/^[bsde][0-9]+/i.test(item)) {
                templateItems.add(item);
                recommendedSet.add(item);
            }
        });
    }

    // Priority 2: Expert Keyword & Hierarchy Discovery
    if (keywords.length > 0) {
        const master = getFlattenedICF();
        const baseCat = key.split('_')[0];
        master.forEach(m => {
            if (m.category !== baseCat) return;
            const searchPool = `${m.name} ${m.desc || ''} ${m.inclusions || ''}`.toLowerCase();
            const isMatch = keywords.some(k => searchPool.includes(k.toLowerCase()));
            if (isMatch) {
                const itemStr = `${m.code} (${m.name})`;
                templateItems.add(itemStr);
                recommendedSet.add(itemStr);

                // Hierarchical boost (Parent)
                if (m.code.length >= 4) {
                    const pCode = m.code.substring(0, 4);
                    const p = master.find(x => x.code === pCode);
                    if (p) {
                        const pStr = `${p.code} (${p.name})`;
                        templateItems.add(pStr);
                        recommendedSet.add(pStr);
                    }
                }
            }
        });
    }

    const allItems = new Set();
    Object.values(ICF_TEMPLATES).forEach(t => {
        if (t[key] && Array.isArray(t[key])) {
            t[key].forEach(item => {
                // Focus: Only items with ICF codes (b, s, d, e + numbers)
                if (/^[bsde][0-9]+/i.test(item)) allItems.add(item);
            });
        }
    });

    // Sorting: Recommended & Expert items first
    const sortedItems = Array.from(allItems).sort((a, b) => {
        const aRec = templateItems.has(a), bRec = templateItems.has(b);
        if (aRec && !bRec) return -1;
        if (!aRec && bRec) return 1;
        return a.localeCompare(b);
    });

    const content = `
        <div class="bg-white flex flex-col h-full max-h-[90vh]">
            <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center shrink-0 bg-indigo-600 text-white rounded-t-2xl">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="bg-amber-400 text-indigo-900 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter shadow-sm animate-pulse">Expert Multi-Search v4.5</span>
                        <h3 class="text-xl font-black flex items-center gap-2">Smart ${title} Picker</h3>
                    </div>
                    <p class="text-[10px] opacity-90 font-bold uppercase tracking-widest leading-none">Menganalisa: <span class="text-yellow-200 italic underline decoration-yellow-400 decoration-2">"${currentDx || 'Diagnosis Umum'}"</span></p>
                </div>
                <button onclick="closeModal()" class="p-2 hover:bg-indigo-500 rounded-full transition-colors"><i data-lucide="x" width="24"></i></button>
            </div>
            
            <div class="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
                <div class="relative">
                    <i data-lucide="search" width="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input type="text" id="picker-search" onkeyup="filterPickerItems(this.value)" placeholder="Cari kode, deskripsi, atau istilah klinis (misal: Vestibular, Nyeri, Hernia)..." class="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-indigo-500 outline-none bg-white font-bold transition-all placeholder:text-slate-300 shadow-sm">
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50" id="picker-list">
                <!-- Recommendations will be injected by filter (Initial view) -->
                ${sortedItems.map((item, idx) => {
        const isRec = templateItems.has(item);
        return `
                        <div class="picker-item-card bg-white p-4 rounded-xl border-2 ${isRec ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'} hover:border-indigo-400 transition-all shadow-sm group" data-text="${item.toLowerCase()}">
                        <div class="flex justify-between items-start">
                                <div class="flex-1">
                                    <div class="flex gap-1 mb-2">
                                        ${isRec ? '<span class="text-[8px] bg-amber-500 text-white font-black px-2 py-0.5 rounded tracking-tighter uppercase shadow-sm">✨ Smart Recommendation</span>' : ''}
                                    </div>
                                    <h4 class="font-bold text-slate-700 leading-tight mb-2">${item}</h4>
                                </div>
                                <div class="flex gap-1 shrink-0 ml-4 h-9" id="qualifier-group-${idx}">
                                    ${Object.keys(ICF_QUALIFIERS).map(q => `
                                        <button onclick="selectICFWithQualifier('${key}', '${item.replace(/'/g, "\\'")}', '${q}', ${idx})" 
                                            class="w-9 h-9 rounded-xl border-2 border-slate-100 flex items-center justify-center text-xs font-black transition-all bg-white text-slate-400 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-200"
                                            title="${ICF_QUALIFIERS[q].label} (${ICF_QUALIFIERS[q].desc})">${q}</button>
                                    `).join('')}
                                </div>
                            </div>
                    </div>
                `}).join('')}
            </div>

            <!-- Global Result Container (Initially Empty) -->
            <div id="global-picker-results" class="hidden flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100 border-t-4 border-indigo-100">
                <div class="flex items-center gap-2 mb-2">
                    <div class="h-px bg-slate-300 flex-1"></div>
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hasil dari Database Master ICF</span>
                    <div class="h-px bg-slate-300 flex-1"></div>
                </div>
                <div id="global-list-content" class="space-y-3"></div>
            </div>

            <div class="p-4 border-t border-slate-100 bg-white rounded-b-2xl flex justify-between items-center">
                <div class="text-[10px] text-slate-400 font-bold max-w-[60%]">
                    *Kualifikator: 0-Tidak ada, 1-Ringan, 2-Sedang, 3-Berat, 4-Total, 8-Tidak ditentukan, 9-Tidak relevan.
                </div>
                <button onclick="closeModal()" class="px-6 py-3 bg-slate-800 text-white font-black rounded-xl hover:bg-black transition-all shadow-lg text-sm">Selesai</button>
            </div>
        </div>
    `;

    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = content;
    document.getElementById('modal-container').classList.remove('hidden');
    lucide.createIcons();
    setTimeout(() => document.getElementById('picker-search').focus(), 100);
}

function selectICFWithQualifier(key, item, qualifier, idx) {
    const qData = ICF_QUALIFIERS[qualifier];
    const fullText = `${item} .${qualifier}`; // Format standar: Kode .Kualifikator
    const input = document.getElementById(`form-${key}`);

    // Get current items as array
    let currentLines = input.value.split('\n').filter(l => l.trim() !== '');

    // Check if item (without qualifier) already exists, if so update it
    const existingIdx = currentLines.findIndex(l => l.includes(item));
    if (existingIdx !== -1) {
        currentLines[existingIdx] = fullText;
    } else {
        currentLines.push(fullText);
    }

    const newVal = currentLines.join('\n');
    updateForm(key, newVal);
    input.value = newVal;

    // Visual feedback in modal
    const group = document.getElementById(`qualifier-group-${idx}`);
    const btns = group.querySelectorAll('button');
    btns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
        if (b.innerText === qualifier) {
            b.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
        }
    });

    const descArea = document.getElementById(`desc-qualifier-${idx}`);
    descArea.classList.remove('hidden');
    descArea.innerHTML = `<i data-lucide="check-circle" width="12" class="inline mb-0.5"></i> <b>TERPILIH:</b> ${qData.label} (${qData.desc})`;
    lucide.createIcons();

    showToast(`Ditambahkan: ${item} (${qualifier})`, 'success');
}

let flattenedICF = null;
function getFlattenedICF() {
    if (flattenedICF) return flattenedICF;
    if (!window.ICF_DB) return [];

    const result = [];
    const traverse = (obj, category) => {
        if (!obj) return;
        Object.entries(obj).forEach(([code, data]) => {
            if (typeof data === 'string') {
                result.push({ code, name: data, category, inclusions: '', desc: '' });
            } else if (typeof data === 'object') {
                const name = data.name || '';
                if (name) {
                    result.push({
                        code,
                        name,
                        category,
                        desc: data.desc || '',
                        inclusions: data.inclusions || '' // Critical for deep searching
                    });
                }
                if (data.subs) traverse(data.subs, category);
            }
        });
    };

    // Traverse b, s, d, e from window.ICF_DB
    if (window.ICF_DB.b) Object.values(window.ICF_DB.b).forEach(ch => ch.groups.forEach(g => traverse(g.codes, 'b')));
    if (window.ICF_DB.s) Object.values(window.ICF_DB.s).forEach(ch => ch.groups.forEach(g => traverse(g.codes, 's')));
    if (window.ICF_DB.d) Object.values(window.ICF_DB.d).forEach(ch => ch.groups.forEach(g => traverse(g.codes, 'd')));
    if (window.ICF_DB.e) Object.values(window.ICF_DB.e).forEach(ch => ch.groups.forEach(g => traverse(g.codes, 'e')));

    flattenedICF = result;
    return flattenedICF;
}

function filterPickerItems(query) {
    const term = query.toLowerCase().trim();
    const items = document.querySelectorAll('.picker-item-card');
    const globalContainer = document.getElementById('global-picker-results');
    const globalList = document.getElementById('global-list-content');
    const key = window.currentPickerKey || 'b';

    // 1. Filter local recommended items (Term match in data-text)
    items.forEach(item => {
        const text = item.getAttribute('data-text') || "";
        item.style.display = text.includes(term) ? 'block' : 'none';
    });

    // 2. Global Real-time Discovery (Master DB)
    if (term.length > 2) {
        const masterData = getFlattenedICF();
        const baseCat = key.split('_')[0]; // 'b', 's', 'd'

        const filteredMaster = masterData.filter(m => {
            // Match category and then search in code/name/desc/inclusions
            const isCatMatch = (m.category === baseCat || (baseCat === 'd' && m.category === 'd'));
            if (!isCatMatch) return false;

            const pool = `${m.code} ${m.name} ${m.desc || ''} ${m.inclusions || ''}`.toLowerCase();
            return pool.includes(term);
        }).slice(0, 30); // Limit results for snappier UI

        if (filteredMaster.length > 0) {
            globalContainer.classList.remove('hidden');
            globalList.innerHTML = `<div class="px-2 py-3 text-[10px] text-indigo-400 font-black uppercase tracking-widest border-b border-indigo-100 mb-3 flex items-center gap-2">
                <i data-lucide="database" width="12"></i> Hasil Tambahan dari Master Database ICF (WHO)
            </div>` + filteredMaster.map((m, i) => {
                const itemStr = `${m.code} (${m.name})`;
                return `
                <div class="bg-indigo-50/30 p-4 rounded-xl border border-indigo-100 shadow-sm hover:border-indigo-400 hover:bg-white transition-all group mb-3">
                    <div class="flex justify-between items-center">
                        <div class="flex-1">
                            <span class="text-[8px] bg-indigo-600 text-white font-black px-2 py-0.5 rounded uppercase tracking-tighter shadow-sm mb-1 inline-block">Global Expert Discovery</span>
                            <h4 class="font-bold text-slate-700 leading-tight">${itemStr}</h4>
                        </div>
                        <div class="flex gap-1 shrink-0 ml-4 h-9">
                            ${Object.keys(ICF_QUALIFIERS).map(q => `
                                <button onclick="selectICFWithQualifier('${key}', '${itemStr.replace(/'/g, "\\'")}', '${q}', 'global-${i}')" 
                                    class="w-9 h-9 rounded-xl border-2 border-slate-100 flex items-center justify-center text-xs font-black transition-all bg-white text-slate-400 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-200">${q}</button>
                            `).join('')}
                        </div>
                    </div>
                    <div id="desc-qualifier-global-${i}" class="hidden italic text-[9px] text-green-600 font-bold mt-1"></div>
                </div>
            `}).join('');
            if (window.lucide) lucide.createIcons();
        } else {
            globalContainer.classList.add('hidden');
        }
    } else {
        globalContainer.classList.add('hidden');
    }
}

function confirmItemPicker(key) {
    const checked = Array.from(document.querySelectorAll('.picker-checkbox:checked')).map(cb => cb.value);

    if (checked.length > 0) {
        const input = document.getElementById(`form-${key}`);
        const currentVal = input.value;
        const newVal = currentVal ? (currentVal.trim() + '\n' + checked.join('\n')) : checked.join('\n');

        updateForm(key, newVal);
        input.value = newVal;

        // Visual feedback
        input.classList.add('ring-2', 'ring-green-400');
        setTimeout(() => input.classList.remove('ring-2', 'ring-green-400'), 500);
    }
    closeModal();
}

// Start of original app.js content
// --- 20. LICENSE & LOCK SCREEN LOGIC ---





function renderLockScreen(msg = "") {
    document.getElementById('app-layout').classList.add('hidden');
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('print-container').classList.add('hidden');
    document.getElementById('sync-loading')?.classList.add('hidden'); // Pastikan loading hilang

    if (document.getElementById('lock-screen-overlay')) return;

    const lockScreen = document.createElement('div');
    lockScreen.id = 'lock-screen-overlay';
    lockScreen.className = "fixed inset-0 bg-slate-900 z-[2000000000] flex flex-col items-center justify-center p-6 text-white";
    lockScreen.innerHTML = `
        <div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-2xl border-4 border-slate-700 animate-pulse">
            <i data-lucide="lock" width="40" class="text-red-500"></i>
        </div>
        <h1 class="text-3xl font-black mb-2 tracking-tight">Aplikasi Terkunci</h1>
        <p class="text-slate-400 mb-8 text-center max-w-md">Silakan masukkan Kode Lisensi Aktif untuk mengakses sistem FISIOTA.</p>
        
        ${msg ? `<div class="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm font-bold flex items-center gap-2"><i data-lucide="alert-triangle" width="16"></i> ${msg}</div>` : ''}

        <div class="w-full max-w-sm space-y-4">
            <div>
                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Kode Lisensi</label>
                <input type="text" id="license-input" class="w-full bg-slate-800 border-2 border-slate-700 p-4 rounded-xl text-center font-mono text-xl font-bold tracking-widest focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-white placeholder-slate-600" placeholder="FISIO-XXXX-XXXX">
            </div>
            <button onclick="activateLicense()" id="btn-activate" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center gap-2 text-lg">
                <i data-lucide="key" width="20"></i> Aktivasi Sekarang
            </button>
            
            <div class="mt-8 pt-8 border-t border-slate-800 text-center">
                <p class="text-xs text-slate-500 mb-2">Belum punya kode?</p>
                <div class="text-sm font-bold text-slate-400">Hubungi Admin FISIOTA</div>
                <div class="text-xs text-slate-600 mt-1">Status: Terhubung ke Pusat</div>
            </div>
        </div>
    `;

    document.body.appendChild(lockScreen);
    lucide.createIcons();
}



function saveSetupUrl() {
    // Legacy function support if needed elsewhere, 
    // or keep for the Config Menu inside App.
    const url = document.getElementById('config-script-url')?.value.trim();
    if (url) {
        localStorage.setItem('erm_script_url', url);
        state.scriptUrl = url;
        alert("URL Data User Disimpan.");
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // PROTECT UNSYNCED DATA
    window.addEventListener('beforeunload', (e) => {
        if (isDataUnsynced()) {
            e.preventDefault();
            e.returnValue = 'Data Anda belum tersinkronisasi ke Cloud. Yakin ingin keluar?';
            return e.returnValue;
        }
    });

    // [FIX] Tampilkan loading segera untuk cegah white screen
    const syncLoading = document.getElementById('sync-loading');
    if (syncLoading) {
        syncLoading.classList.remove('hidden');
        const h2 = syncLoading.querySelector('h2');
        if (h2) h2.innerText = "Memeriksa Lisensi...";
    }

    // [OPTIMIZED] 1. Cek Lisensi
    const license = await checkLicense();
    if (license && !license.valid) {
        console.log("License invalid, initialization paused.");
        if (syncLoading) syncLoading.classList.add('hidden'); // Sembunyikan loading jika terkunci
        return;
    }

    // [NEW LOGIK] 2. Sinkronisasi Data Master Sebelum Login
    // Menarik data user/akun agar login tidak "Salah" saat pertama kali setelah clear cache
    if (state.sheetId || state.scriptUrl) {
        const h2 = syncLoading?.querySelector('h2');
        if (h2) {
            h2.innerText = "Sinkronisasi Master...";
            const p = syncLoading.querySelector('p');
            if (p) p.innerText = "Mengambil data akun & konfigurasi terbaru dari Cloud.";
        }

        console.log("INIT: License verified. Starting mandatory pre-initial sync...");
        window._isBlockingSync = true;
        await silentPullRefresh(true); // Tunggu sampai kelar pull (Clean Pull)
        window._isBlockingSync = false;
    }

    await loadData();
    renderApp();
    handleUrlActions();

    // TRIGGER SYNC IMMEDIATELY ON LOAD: Hybrid Authoritative Mode (ONLY if user is logged in)
    if (state.scriptUrl && state.user) {
        // [FIX] Cek kelengkapan data kunci: Pasien, Jadwal, dan User. 
        // Jika salah satu kosong, lakukan Full Pull demi keamanan integritas data.
        const isMissingData = (!state.patients || state.patients.length === 0) ||
            (!state.appointments || state.appointments.length === 0) ||
            (!state.users || state.users.length === 0);

        if (isMissingData && !window._firstSyncDone) {
            console.log("Incomplete/Missing Data Detected: Triggering Mandatory Full Pull...");
            silentPullRefresh(true);
        } else {
            console.log("Initial Sync Check: Data looks complete. Triggering Background Sync...");
            backgroundAutoSync();
        }
    }

    setTimeout(renderIcons, 100);
    setInterval(updateDate, 1000);
    updateDate();
    checkOnlineStatus();
});

async function handleUrlActions() {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const id = params.get('id');
    const client = params.get('client');

    if (client && client !== state.sheetId) {
        console.log("Auto-Connect to client:", client);
        localStorage.setItem('erm_sheet_id', client);
        state.sheetId = client;
        // Optionally reload data if sheet_id changed
        await loadData();
    }

    if (action && id) {
        console.log("Processing URL Action:", action, id);
        if (action === 'confirm') {
            confirmAppointment(id, true);
        } else if (action === 'decline') {
            deleteAppointment(id, true);
        }

        // Clear params to avoid loop
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// --- 21. LICENSE UPDATE LOGIC ---
// --- 21. LICENSE UPDATE LOGIC ---
let licenseInterval;

// --- 21. LICENSE UPDATE LOGIC ---
function updateLicenseCountdown() {
    const status = localStorage.getItem('erm_license_status');
    const expiryStr = localStorage.getItem('erm_license_expiry');
    const expiryIso = localStorage.getItem('erm_license_expiry_iso'); // NEW: Precision Date

    // Sidebar Widget Check
    const widget = document.getElementById('license-widget');
    if (status !== 'ACTIVE' || (!expiryStr && !expiryIso)) {
        if (widget) widget.classList.add('hidden');
    } else {
        if (widget) widget.classList.remove('hidden');
    }

    // Determine Expiry Date Object
    let expDate = new Date();

    if (expiryIso) {
        expDate = new Date(expiryIso);
    } else if (expiryStr) {
        const parts = expiryStr.split(' ');
        const monthMap = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 };
        if (parts.length >= 3) {
            const d = parseInt(parts[0]);
            const m = monthMap[parts[1]] !== undefined ? monthMap[parts[1]] : 0;
            const y = parseInt(parts[2]);
            expDate.setFullYear(y, m, d);
            if (parts[3]) {
                const timeParts = parts[3].split(':');
                expDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0);
            } else {
                expDate.setHours(23, 59, 59);
            }
        } else {
            expDate = new Date(expiryStr);
        }
    } else {
        return;
    }

    const now = new Date();
    const diff = expDate - now;

    // UPDATE UI (Sidebar & Config)
    const planName = localStorage.getItem('erm_license_plan') || 'Active License';

    // Config Elements
    const confPlan = document.getElementById('conf-lic-plan');
    const confStatus = document.getElementById('conf-lic-status');
    const confExpiry = document.getElementById('conf-lic-expiry');
    const confCount = document.getElementById('conf-lic-countdown');

    if (confPlan) confPlan.innerText = planName;
    if (confStatus) confStatus.innerText = status;
    if (confExpiry) confExpiry.innerText = expiryStr || expiryIso;

    // Sidebar Elements
    const sidePlan = document.getElementById('lic-plan');
    if (sidePlan) sidePlan.innerText = planName;
    const sideCount = document.getElementById('lic-countdown');

    if (diff <= 0) {
        const expiredText = "EXPIRED";
        if (confCount) confCount.innerText = expiredText;
        if (sideCount) sideCount.innerText = expiredText;

        // STOP LOOPING
        if (licenseInterval) clearInterval(licenseInterval);

        checkLicense();
    } else {
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const diffHrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const diffSecs = Math.floor((diff % (1000 * 60)) / 1000);

        let shortText = "";
        let longText = "";

        if (diffDays > 0) {
            shortText = `${diffDays} Hari`;
            longText = `${diffDays} Hari ${diffHrs} Jam`;
        } else {
            shortText = `${diffHrs}j ${diffMins}m ${diffSecs}s`;
            longText = `${diffHrs}j ${diffMins}m ${diffSecs}s`;
        }

        if (sideCount) {
            sideCount.innerText = shortText;
            sideCount.className = diffDays < 3 ? "text-orange-400 font-mono font-bold" : "text-blue-400 font-mono font-bold";
        }

        if (confCount) {
            confCount.innerText = longText;
            confCount.className = diffDays < 3 ? "text-5xl font-black text-orange-500 font-mono tracking-tight animate-pulse" : "text-5xl font-black text-blue-600 font-mono tracking-tight";
        }
    }
}




// Start Countdown Interval
licenseInterval = setInterval(() => {
    updateLicenseCountdown();
}, 1000);
// Initial Call
setTimeout(updateLicenseCountdown, 2000);

// =============================================================
// --- MODUL KASIR & PEMBAYARAN ---
// =============================================================

function renderKasirView(container) {
    const tab = state.kasirTab || 'antrian';

    container.innerHTML = `
        <div class="space-y-6 fade-in pb-24">
            <!-- Tab Header -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-1 flex gap-1 overflow-x-auto pb-2">
                <button onclick="switchKasirTab('antrian')" id="ktab-antrian"
                    class="flex-1 py-2.5 px-4 rounded-xl text-[11px] md:text-sm font-bold transition-all ${tab === 'antrian' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}">
                    <i data-lucide="clock" width="14" class="inline mr-1"></i> Antrian
                </button>
                <button onclick="switchKasirTab('pengeluaran')" id="ktab-pengeluaran"
                    class="flex-1 py-2.5 px-4 rounded-xl text-[11px] md:text-sm font-bold transition-all ${tab === 'pengeluaran' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}">
                    <i data-lucide="shopping-cart" width="14" class="inline mr-1"></i> Pengeluaran
                </button>
                <button onclick="switchKasirTab('laporan')" id="ktab-laporan"
                    class="flex-1 py-2.5 px-4 rounded-xl text-[11px] md:text-sm font-bold transition-all ${tab === 'laporan' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}">
                    <i data-lucide="bar-chart-2" width="14" class="inline mr-1"></i> Keuangan & Laporan
                </button>
            </div>

            <!-- Tab Content -->
            <div id="kasir-tab-content">
                ${tab === 'antrian' ? renderKasirAntrian(formatRp) :
            (tab === 'pengeluaran' ? renderKasirPengeluaran(formatRp) : renderKasirLaporan(formatRp))}
            </div>
        </div>`;
    renderIcons();
}

function switchKasirTab(tab) {
    state.kasirTab = tab;
    renderKasirView(document.getElementById('main-content'));
}

// --- UTILS KASIR ---
// Redundant isPaidAppt and parseRp removed (using global versions instead)

function renderKasirAntrian(formatRp) {
    const todayStr = today();

    // [FIXED LOGIC] 1. Antrian Belum Bayar: Ambil hari ini DAN tanggal-tanggal lampau (tunggakan/backdate)
    // Jadwal masa depan (date > today) disembunyikan otomatis agar tidak membingungkan kasir.
    const antrian = (state.appointments || []).filter(a => {
        const isFuture = a.date > todayStr;
        const isUnpaid = !isPaidAppt(a);
        const isActive = (a.status === 'CONFIRMED' || !a.status);
        return !isFuture && isActive && isUnpaid;
    }).sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''));

    // [FIXED LOGIC] 2. Laporan Lunas Hari Ini: Hitung semua uang yang MASUK hari ini
    // Menggunakan pembanding robust berbasis Local Time (Asia/Jakarta) agar transaksi pagi tidak hilang.
    const lunas = (state.appointments || []).filter(a => {
        if (!isPaidAppt(a)) return false;

        // Pemasukan Hari Ini: 
        // 1. Tanggal Pelunasan (paidAt) adalah Tanggal Hari Ini.
        // 2. ATAU Tanggal Jadwal (date) Hari Ini dan sudah lunas.
        // 3. Tambahan: Baru saja diupdate dalam 5 menit terakhir (agar langsung muncul di laporan)
        const effectivePayDate = a.paidAt ? a.paidAt.split('T')[0] : '';
        const isRecentlyUpdated = (Date.now() - new Date(a.updatedAt || 0).getTime()) < 300000;

        return (effectivePayDate === todayStr || a.date === todayStr || isRecentlyUpdated);
    }).sort((a, b) => (b.paidAt || b.date || '').localeCompare(a.paidAt || a.date || ''));

    // SUM TOTAL LUNAS SEBENARNYA (Menggunakan finalAmount jika ada, jika tidak fallback ke fee)
    // [FIX] Hindari double counting: prioritaskan finalAmount karena bulk pay menyimpan total di satu record dan 0 di record lainnya.
    const totalLunasHariIni = lunas.reduce((s, a) => {
        const amt = (a.finalAmount !== undefined && a.finalAmount !== null && a.finalAmount !== "")
            ? parseRp(a.finalAmount)
            : (parseRp(a.fee) || 0);
        return s + amt;
    }, 0);
    const totalTunggakan = antrian.reduce((s, a) => s + (parseRp(a.fee) || 0), 0);

    return `
        <!-- Summary strip -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p class="text-2xl font-black text-amber-700">${antrian.length}</p>
                <p class="text-xs font-bold text-amber-600 mt-0.5">Menunggu Bayar</p>
            </div>
            <div class="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center">
                <p class="text-lg font-black text-rose-700 truncate">${formatRp(totalTunggakan)}</p>
                <p class="text-xs font-bold text-rose-600 mt-0.5">Estimasi Tunggakan</p>
            </div>
            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <p class="text-2xl font-black text-emerald-700">${lunas.length}</p>
                <p class="text-xs font-bold text-emerald-600 mt-0.5">Sudah Lunas</p>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p class="text-lg font-black text-blue-700 truncate">${formatRp(totalLunasHariIni)}</p>
                <p class="text-xs font-bold text-blue-600 mt-0.5">Pemasukan Hari Ini</p>
            </div>
        </div>

        <!-- Antrian Belum Bayar -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200">
            <div class="px-6 py-4 border-b border-slate-100">
                <h3 class="font-bold text-slate-800 flex items-center gap-2">
                    <i data-lucide="clock" width="18" class="text-amber-500"></i>
                    Antrian Belum Bayar
                </h3>
            </div>
            <div class="divide-y divide-slate-100">
                ${antrian.length === 0
            ? `<div class="p-8 text-center text-slate-400">
                            <i data-lucide="check-circle" width="40" class="mx-auto mb-2 text-emerald-400"></i>
                            <p class="font-medium">Semua pasien hari ini sudah lunas!</p>
                       </div>`
            : antrian.map(a => {
                const p = (state.patients || []).find(pt => pt.id === a.patientId);
                const nama = p ? p.name : (a.visitor_name || a.name || 'Pasien Baru');
                const terapis = (state.users || []).find(u => u.id === a.therapistId);
                return `
                        <div class="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors ${a.date < todayStr ? 'bg-amber-50/30' : ''}">
                            <div class="text-center min-w-[70px]">
                                <span class="text-lg font-black text-slate-700 leading-none">${a.time || '-'}</span>
                                ${a.date < todayStr ? `
                                    <div class="mt-1 flex flex-col items-center">
                                        <span class="text-[9px] font-black text-rose-500 uppercase tracking-tighter">TUNGGAKAN</span>
                                        <span class="text-[7px] text-slate-400 font-bold leading-none">${a.date}</span>
                                    </div>` : ''}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="font-bold text-slate-800 truncate">${nama}</p>
                                <p class="text-xs text-slate-400">
                                    ${a.date < todayStr ? '<span class="text-amber-600 font-bold uppercase text-[9px] mr-1">[Backdated]</span>' : ''}
                                    ${terapis ? terapis.name : (a.therapistId || '-')} &bull; ${a.patientType || 'Klinik'}
                                </p>
                            </div>
                            <div class="text-right shrink-0">
                                <p class="font-bold text-slate-700 text-sm">${formatRp(a.fee)}</p>
                                <button onclick="openPaymentModal('${a.id}')"
                                    class="mt-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                                    Proses Bayar
                                </button>
                            </div>
                        </div>`;
            }).join('')}
            </div>
        </div>

        <!-- Sudah Lunas Hari Ini -->
        ${lunas.length > 0 ? `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200">
            <div class="px-6 py-4 border-b border-slate-100">
                <h3 class="font-bold text-slate-800 flex items-center gap-2">
                    <i data-lucide="check-circle" width="18" class="text-emerald-500"></i>
                    Sudah Lunas Hari Ini
                </h3>
            </div>
            <div class="divide-y divide-slate-100">
                ${lunas.map(a => {
                const p = (state.patients || []).find(pt => pt.id === a.patientId);
                const nama = p ? p.name : (a.visitor_name || a.name || 'Pasien');
                const methodIcons = { 'Tunai': '💵', 'Transfer': '🏦', 'QRIS': '📱', 'BPJS': '🏥', 'Paket': '📦' };
                return `
                    <div class="flex items-center gap-4 px-6 py-3 bg-emerald-50/30">
                        <div class="flex-1 min-w-0">
                            <p class="font-semibold text-slate-700 truncate">${nama}</p>
                            <p class="text-xs text-slate-400">${a.time || '-'} &bull; ${methodIcons[a.paymentMethod] || ''} ${a.paymentMethod || '-'}</p>
                        </div>
                        <div class="text-right shrink-0">
                            <div class="flex items-center justify-end gap-2 mb-1">
                                <button onclick="printReceipt('${a.id}', 'RECEIPT')" class="text-slate-300 hover:text-blue-600 transition-colors" title="Cetak Struk">
                                    <i data-lucide="printer" width="14"></i>
                                </button>
                                <p class="font-bold text-emerald-700">${formatRp(a.finalAmount || a.fee)}</p>
                            </div>
                            <span class="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">LUNAS</span>
                        </div>
                    </div>`;
            }).join('')}
            </div>
        </div>` : ''}
    `;
}

function renderKasirPengeluaran(formatRp) {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM

    // Default filter harian bulan ini
    const filtered = (state.expenses || []).filter(e => e.date && e.date.slice(0, 7) === currentMonth)
        .sort((a, b) => b.date.localeCompare(a.date));

    const total = filtered.reduce((s, e) => s + (Number(e.amount) || 0), 0);

    return `
        <div class="space-y-6 fade-in shadow-inner-lg p-1">
            <!-- Summary Expense -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Biaya Operasional</p>
                    <p class="text-2xl font-black text-rose-600 mt-1">${formatRp(total)}</p>
                    <p class="text-[10px] text-slate-400 mt-1 uppercase">Bulan: ${now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                </div>
                <button onclick="openExpenseModal()" 
                    class="w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2">
                    <i data-lucide="plus-circle" width="18"></i> Catat Pengeluaran
                </button>
            </div>

            <!-- List Pengeluaran -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 class="font-bold text-slate-800 flex items-center gap-2">
                        <i data-lucide="list" width="18" class="text-slate-400"></i>
                        Riwayat Pengeluaran
                    </h3>
                </div>
                ${filtered.length === 0
            ? `<div class="p-16 text-center text-slate-300">
                    <i data-lucide="shopping-bag" width="48" class="mx-auto mb-4 opacity-20"></i>
                    <p class="font-medium">Belum ada catatan pengeluaran bulan ini.</p>
                   </div>`
            : `<div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th class="text-left px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Tanggal</th>
                                <th class="text-left px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Kategori</th>
                                <th class="text-left px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Catatan</th>
                                <th class="text-right px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Nominal</th>
                                <th class="text-center px-6 py-3" style="width: 100px;">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${filtered.map(e => `
                                <tr class="hover:bg-slate-50 transition-colors ${e.is_locked ? 'bg-slate-50/50' : ''}">
                                    <td class="px-6 py-4 text-slate-600 font-medium">${e.date}</td>
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-1.5">
                                            <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase">${e.category || 'LAINNYA'}</span>
                                            ${e.is_locked ? '<i data-lucide="lock" class="text-blue-500" width="12"></i>' : ''}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-slate-400 text-xs italic">${e.notes || '-'}</td>
                                    <td class="px-6 py-4 text-right font-black text-rose-600">${formatRp(e.amount)}</td>
                                    <td class="px-6 py-4 text-center">
                                        <div class="flex items-center justify-center gap-3">
                                            <button onclick="openExpenseModal('${e.id}')" class="text-slate-300 hover:text-blue-500 transition-colors">
                                                <i data-lucide="edit-3" width="16"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                   </div>`}
            </div>
        </div>
    `;
}

function openExpenseModal(id = null) {
    const e = id ? state.expenses.find(item => item.id === id) : { id: '', date: today(), category: 'Operasional', amount: 0, notes: '', is_locked: false };
    const isLocked = e.is_locked === true || e.is_locked === 'true';
    const modal = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');
    modal.classList.remove('hidden');

    content.innerHTML = `
        <div class="bg-white px-6 py-4 border-b flex justify-between items-center sticky top-0 z-20">
            <div>
                <h3 class="text-xl font-bold text-slate-800">${id ? 'Edit' : 'Tambah'} Pengeluaran</h3>
                <p class="text-xs text-slate-400">Pencatatan biaya operasional harian</p>
            </div>
            <button onclick="closeModal()" class="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                <i data-lucide="x" width="20"></i>
            </button>
        </div>
        <div class="px-6 py-6 space-y-5 overflow-y-auto max-h-[80vh]">
            <input type="hidden" id="exp-id" value="${e.id}">
            <div class="${isLocked ? 'opacity-60 pointer-events-none' : ''}">
                <div class="mb-4">
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Tanggal Pengeluaran</label>
                    <input type="date" id="exp-date" value="${e.date}" ${isLocked ? 'disabled' : ''}
                        class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-semibold outline-none focus:border-blue-500 transition-all">
                </div>
                <!-- ... other fields ... -->
            </div>
            <div class="${isLocked ? 'opacity-60 pointer-events-none' : ''}">
                <div class="mb-4">
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Kategori Biaya</label>
                    <select id="exp-category" ${isLocked ? 'disabled' : ''} class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-blue-500 transition-all">
                        <option value="Operasional" ${e.category === 'Operasional' ? 'selected' : ''}>Operasional (Listrik, Air, Internet)</option>
                        <option value="Alat Medis" ${e.category === 'Alat Medis' ? 'selected' : ''}>Alat Medis & Bahan Habis Pakai</option>
                        <option value="Gaji" ${e.category === 'Gaji' ? 'selected' : ''}>Gaji / Honor Terapis</option>
                        <option value="Sewa" ${e.category === 'Sewa' ? 'selected' : ''}>Sewa Tempat / Maintenance</option>
                        <option value="Lainnya" ${e.category === 'Lainnya' ? 'selected' : ''}>Lainnya / Non-Operasional</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nominal (Rp)</label>
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 font-black text-rose-400">Rp</span>
                        <input type="number" id="exp-amount" placeholder="0" value="${e.amount}" ${isLocked ? 'disabled' : ''}
                            class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-4 py-4 text-xl font-black text-rose-600 outline-none focus:border-rose-500 focus:bg-white transition-all">
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Detail / Keterangan</label>
                    <textarea id="exp-notes" placeholder="Tulis rincian pengeluaran di sini..." ${isLocked ? 'disabled' : ''}
                        class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all min-h-[100px]">${e.notes}</textarea>
                </div>
            </div>
            
            <div class="pt-2 border-t border-slate-100">
                <label class="flex items-center gap-3 cursor-pointer group mb-6">
                    <div class="relative">
                        <input type="checkbox" id="exp-locked" class="sr-only" ${isLocked ? 'checked' : ''} onchange="this.nextElementSibling.classList.toggle('bg-blue-600', this.checked); this.nextElementSibling.classList.toggle('bg-slate-300', !this.checked);">
                        <div class="block w-10 h-6 rounded-full transition-colors ${isLocked ? 'bg-blue-600' : 'bg-slate-300'}"></div>
                        <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isLocked ? 'translate-x-4' : ''}"></div>
                    </div>
                    <div>
                        <span class="text-sm font-bold text-slate-700 flex items-center gap-1">
                            <i data-lucide="${isLocked ? 'lock' : 'unlock'}" width="14"></i> Kunci Laporan Pengeluaran
                        </span>
                        <p class="text-[10px] text-slate-400 font-medium leading-tight">Mencegah perubahan data untuk keamanan pembukuan keuangan.</p>
                    </div>
                </label>
            </div>
            
            <div class="pt-2">
                <button onclick="saveExpense()" ${isLocked ? 'disabled' : ''}
                    class="w-full ${isLocked ? 'bg-slate-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700'} text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 group">
                    <i data-lucide="${isLocked ? 'lock' : 'save'}" width="20" class="group-hover:rotate-12 transition-transform"></i>
                    ${isLocked ? 'Laporan Terkunci' : 'Simpan Data Pengeluaran'}
                </button>
            </div>
        </div>
    `;
    renderIcons();
}

async function saveExpense() {
    updateSyncStatusUI('syncing', false); // [IMMEDIATE UI FEEDBACK]
    if (isReadOnly()) {
        alert("PERINGATAN: Anda sedang membuka Database Arsip (Read-Only). Perubahan tidak dapat disimpan di sini.");
        return;
    }
    const id = document.getElementById('exp-id').value;
    const date = document.getElementById('exp-date').value;
    const category = document.getElementById('exp-category').value;
    const amount = Number(document.getElementById('exp-amount').value) || 0;
    const notes = document.getElementById('exp-notes').value;
    const is_locked = document.getElementById('exp-locked').checked;

    if (amount <= 0) {
        alert('Mohon masukkan nominal belanja/pengeluaran!');
        return;
    }

    // Protection: If data was already locked
    const oldE = state.expenses.find(item => item.id === id);
    if (oldE && (oldE.is_locked === true || oldE.is_locked === 'true')) {
        alert("⚠️ GAGAL: Data pengeluaran ini sudah terkunci.");
        return;
    }

    const entry = {
        id: id || ('EXP-' + Date.now()),
        date,
        category,
        amount,
        notes,
        is_locked,
        updatedAt: getServerTimeISO(),
        _dirty: true // [FIX] Guarantee immediate sync regardless of lastSync
    };

    if (!Array.isArray(state.expenses)) state.expenses = [];

    if (id) {
        const idx = state.expenses.findIndex(item => item.id === id);
        if (idx !== -1) state.expenses[idx] = entry;
    } else {
        state.expenses.push(entry);
    }

    closeModal();
    await saveData();
    if (state.scriptUrl) syncDelta(false);
    renderKasirView(document.getElementById('main-content'));
    showToast("Catatan pengeluaran berhasil disimpan.");
}

async function deleteExpense(id) {
    if (!state.deletedIds.expenses) state.deletedIds.expenses = [];
    state.deletedIds.expenses.push(id);
    await saveData();
    if (state.scriptUrl) syncDelta(false);
    renderKasirView(document.getElementById('main-content'));
    showToast("Data pengeluaran dihapus.");
}

function renderKasirLaporan(formatRp) {
    // Default range: bulan ini
    const now = new Date();
    const defaultFrom = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const defaultTo = today();
    const savedFrom = state.laporanFrom || defaultFrom;
    const savedTo = state.laporanTo || defaultTo;

    const filtered = (state.appointments || []).filter(a => {
        const apptDate = (a.paidAt || a.date || '');
        const dateMatch = apptDate && apptDate.slice(0, 10) >= savedFrom && apptDate.slice(0, 10) <= savedTo;
        return isPaidAppt(a) && dateMatch;
    }).sort((a, b) => (b.paidAt || b.date || '').localeCompare(a.paidAt || a.date || ''));

    const totalIncome = filtered.reduce((s, a) => s + (parseRp(a.finalAmount) || parseRp(a.fee) || 0), 0);
    const byMethod = { Tunai: 0, Transfer: 0, QRIS: 0, BPJS: 0, Paket: 0 };
    filtered.forEach(a => {
        const m = a.paymentMethod || 'Tunai';
        byMethod[m] = (byMethod[m] || 0) + (parseRp(a.finalAmount) || parseRp(a.fee) || 0);
    });

    // Kalkulasi Pengeluaran dalam rentang tanggal yang sama
    const filteredExpenses = (state.expenses || []).filter(e => {
        const d = (e.date || '');
        return d >= savedFrom && d <= savedTo;
    });
    const totalExpense = filteredExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const netProfit = totalIncome - totalExpense;

    // Filter by search key if any (Live Search)
    let searchResult = filtered;
    if (state.laporanSearch) {
        const key = state.laporanSearch.toLowerCase();
        searchResult = filtered.filter(a => {
            const p = (state.patients || []).find(pt => pt.id === a.patientId);
            const nama = (p ? p.name : (a.visitor_name || a.name || '')).toLowerCase();
            return nama.includes(key);
        });
    }

    // Slice by limit for pagination
    const displayed = searchResult.slice(0, state.laporanLimit || 50);
    const hasMore = searchResult.length > (state.laporanLimit || 50);

    // Group by date for per-hari view (using full searchResult instead of just displayed)
    const byDate = {};
    searchResult.forEach(a => {
        const d = a.paidAt ? a.paidAt.slice(0, 10) : a.date;
        if (!byDate[d]) byDate[d] = { count: 0, total: 0 };
        byDate[d].count++;
        byDate[d].total += parseRp(a.finalAmount) || parseRp(a.fee) || 0;
    });

    return `
        <!-- Filter -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div class="flex flex-wrap items-end gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Dari Tanggal</label>
                    <input type="date" id="laporan-from" value="${savedFrom}"
                        class="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-blue-500 outline-none">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Sampai Tanggal</label>
                    <input type="date" id="laporan-to" value="${savedTo}"
                        class="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-blue-500 outline-none">
                </div>
                <button onclick="applyLaporanFilter()"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors shadow-md">
                    Tampilkan
                </button>
                <button onclick="printJournalReport()"
                    class="bg-slate-800 hover:bg-black text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors shadow-md flex items-center gap-2">
                    <i data-lucide="printer" width="16"></i> Cetak Jurnal Pemasukan
                </button>
                <button onclick="printFinancialReport()"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors shadow-md flex items-center gap-2">
                    <i data-lucide="bar-chart-2" width="16"></i> Cetak Laporan Keuangan
                </button>
                <button onclick="printAppointmentReport()"
                    class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors shadow-md flex items-center gap-2">
                    <i data-lucide="list" width="16"></i> Rekap Kunjungan (Excel-Style)
                </button>
            </div>
        </div>

        <!-- Summary Stats (Dashboard Arus Kas) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
            <div class="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 relative overflow-hidden">
                <div class="flex justify-between items-start relative z-10">
                    <div>
                        <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Pemasukan</p>
                        <p class="text-3xl font-black text-emerald-800 mt-2">${formatRp(totalIncome)}</p>
                        <p class="text-[10px] text-emerald-600/60 mt-2 uppercase font-bold">${filtered.length} Transaksi Pasien</p>
                    </div>
                    <div class="bg-white/50 p-2.5 rounded-2xl shadow-sm border border-emerald-100/50">
                        <i data-lucide="trending-up" class="text-emerald-600" width="20"></i>
                    </div>
                </div>
                <div class="absolute -right-4 -bottom-4 opacity-5 rotate-12">
                   <i data-lucide="arrow-up-right" width="100"></i>
                </div>
            </div>

            <div class="bg-rose-50 border border-rose-100 rounded-3xl p-6 relative overflow-hidden">
                <div class="flex justify-between items-start relative z-10">
                    <div>
                        <p class="text-[10px] font-black text-rose-600 uppercase tracking-widest">Total Pengeluaran</p>
                        <p class="text-3xl font-black text-rose-800 mt-2">${formatRp(totalExpense)}</p>
                        <div class="mt-2 flex items-center gap-2">
                             <span class="text-[10px] text-rose-600/60 uppercase font-bold">${filteredExpenses.length} Catatan Biaya</span>
                             <button onclick="switchKasirTab('pengeluaran'); openExpenseModal();" 
                                class="text-[9px] bg-rose-600 text-white px-2 py-0.5 rounded-lg font-bold hover:bg-rose-700 transition-colors uppercase">
                                + Catat Baru
                            </button>
                        </div>
                    </div>
                    <div class="bg-white/50 p-2.5 rounded-2xl shadow-sm border border-rose-100/50">
                        <i data-lucide="trending-down" class="text-rose-600" width="20"></i>
                    </div>
                </div>
                <div class="absolute -right-4 -bottom-4 opacity-5 -rotate-12">
                   <i data-lucide="arrow-down-left" width="100"></i>
                </div>
            </div>

            <div class="bg-blue-600 rounded-3xl p-6 shadow-xl shadow-blue-200 ring-4 ring-blue-50 relative overflow-hidden">
                <div class="flex justify-between items-start relative z-10">
                    <div>
                        <p class="text-[10px] font-black text-blue-100 uppercase tracking-widest">Saldo Bersih (Net Profit)</p>
                        <p class="text-3xl font-black text-white mt-1 shadow-sm">${formatRp(netProfit)}</p>
                        <p class="text-[10px] text-blue-100 mt-2 font-black italic tracking-widest bg-blue-500/50 inline-block px-2 py-0.5 rounded-lg border border-white/10 uppercase">Arus Kas Masuk</p>
                    </div>
                    <div class="bg-white/20 p-2.5 rounded-2xl border border-white/20">
                        <i data-lucide="wallet" class="text-white" width="20"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Customization Panel (Merged from Pajak) -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="p-6">
                <div class="flex flex-col lg:flex-row gap-8">
                    <div class="flex-1 space-y-4">
                        <h3 class="font-bold text-slate-800 flex items-center gap-2">
                            <i data-lucide="edit-3" width="18" class="text-blue-500"></i>
                            Kustomisasi Laporan Jurnal (PDF)
                        </h3>
                        <div class="bg-slate-50 border border-slate-100 rounded-xl p-4">
                             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">Omzet Bruto Kustom</label>
                                    <div class="relative">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">Rp</span>
                                        <input type="number" value="${state.taxOverride?.bruto !== undefined ? state.taxOverride.bruto : totalIncome}" 
                                            oninput="updateTaxOverride('bruto', this.value)"
                                            class="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none">
                                    </div>
                                    <p class="text-[9px] text-slate-400 mt-1 italic">*Kosongkan untuk pakai hitungan sistem (${formatRp(totalIncome)})</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">Catatan Tambahan Laporan</label>
                                    <textarea oninput="updateTaxOverride('notes', this.value)"
                                        placeholder="Muncul di bagian bawah PDF..."
                                        class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-[42px]">${state.taxOverride?.notes || ''}</textarea>
                                </div>
                             </div>
                        </div>
                    </div>
                    <div class="lg:w-72 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white shadow-lg flex flex-col justify-center">
                        <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Estimasi PPh (0.5%)</p>
                        <h4 class="text-2xl font-black mb-1">${formatRp((state.taxOverride?.bruto !== undefined ? state.taxOverride.bruto : totalIncome) * 0.005)}</h4>
                        <p class="text-slate-500 text-[9px] italic leading-tight">Berdasarkan Dasar Pengenaan Pajak (DPP) UMKM PP-23.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Pemasukan Per Metode -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-bold text-slate-800 flex items-center gap-2">
                        <i data-lucide="pie-chart" width="18" class="text-blue-500"></i>
                        Metode Pembayaran
                    </h3>
                </div>
                <div class="space-y-4">
                    ${Object.entries(byMethod).sort((a, b) => b[1] - a[1]).map(([m, v]) => {
        const pct = totalIncome > 0 ? (v / totalIncome) * 100 : 0;
        const colors = { Tunai: 'bg-emerald-500 shadow-emerald-100', Transfer: 'bg-blue-500 shadow-blue-100', QRIS: 'bg-purple-500 shadow-purple-100', BPJS: 'bg-orange-500 shadow-orange-100', Paket: 'bg-indigo-500 shadow-indigo-100' };
        return `
                        <div>
                            <div class="flex justify-between text-[11px] mb-2 font-black uppercase tracking-tight">
                                <span class="text-slate-500">${m}</span>
                                <span class="text-slate-800">${formatRp(v)} <span class="text-slate-400 font-medium">(${pct.toFixed(0)}%)</span></span>
                            </div>
                            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div class="${colors[m] || 'bg-slate-400'} h-full transition-all duration-1000 shadow-sm" style="width: ${pct}%"></div>
                            </div>
                        </div>`;
    }).join('')}
                </div>
            </div>

        <!-- Per Hari -->
        ${Object.keys(byDate).length > 0 ? `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200">
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 class="font-bold text-slate-800">Ringkasan Per Hari</h3>
            </div>
            <div class="divide-y divide-slate-100">
                ${Object.entries(byDate).sort(([a], [b]) => b.localeCompare(a)).map(([date, info]) => {
        const d = new Date(date + 'T00:00:00');
        const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        return `
                    <div class="flex items-center justify-between px-6 py-3 hover:bg-slate-50">
                        <div>
                            <p class="font-semibold text-slate-700 text-sm">${label}</p>
                            <p class="text-xs text-slate-400">${info.count} transaksi</p>
                        </div>
                        <p class="font-bold text-slate-800">${formatRp(info.total)}</p>
                    </div>`;
    }).join('')}
            </div>
        </div>` : ''}

        <!-- Tabel Detail -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200">
            <div class="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 class="font-bold text-slate-800">Detail Transaksi</h3>
                <div class="relative w-full md:w-72 group">
                    <input type="text" placeholder="Cari nama pasien..." id="laporan-search-input"
                        value="${state.laporanSearch || ''}"
                        onkeyup="event.key === 'Enter' ? searchLaporan() : null"
                        class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all">
                    <i data-lucide="search" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="16"></i>
                    ${state.laporanSearch ? `
                        <button onclick="clearLaporanSearch()" class="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-200 hover:bg-rose-500 hover:text-white text-slate-500 rounded-full p-1 transition-all">
                            <i data-lucide="x" width="12"></i>
                        </button>` : `
                        <button onclick="searchLaporan()" class="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1 text-[10px] font-bold shadow-sm transition-all">Cari</button>
                    `}
                </div>
            </div>
            ${filtered.length === 0
            ? `<div class="p-12 text-center text-slate-400 bg-slate-50 border-2 border-dashed border-slate-100 rounded-2xl mx-6 mb-6">
                        <i data-lucide="info" width="48" class="mx-auto mb-4 text-slate-300"></i>
                        <h4 class="text-slate-600 font-bold text-lg mb-1">Belum Ada Transaksi</h4>
                        <p class="text-sm max-w-sm mx-auto mb-6">Hanya janji temu yang sudah <b>dikonfirmasi</b> dan <b>dibayar</b> (status LUNAS) yang muncul di laporan ini.</p>
                        <div class="flex justify-center gap-3">
                            <button onclick="switchKasirTab('antrian')" class="bg-white border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-all">Cek Antrian Hari Ini</button>
                            <button onclick="pullDataFromSheet()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-blue-700 transition-all flex items-center gap-1"><i data-lucide="refresh-cw" width="12"></i> Tarik Data Terbaru</button>
                        </div>
                   </div>`
            : `<div class="overflow-x-auto horizontal-scroll-container">
                    <table class="w-full text-sm">
                        <thead class="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th class="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">Tgl Bayar</th>
                                <th class="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">Pasien</th>
                                <th class="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase hidden md:table-cell">Terapis</th>
                                <th class="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">Metode</th>
                                <th class="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase">Total</th>
                            </tr>
                        </thead>
                <tbody class="divide-y divide-slate-100">
                            ${displayed.map(a => {
                const p = (state.patients || []).find(pt => pt.id === a.patientId);
                const nama = p ? p.name : (a.visitor_name || a.name || 'Pasien');
                const terapis = (state.users || []).find(u => u.id === a.therapistId);
                const paidDate = a.paidAt ? new Date(a.paidAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
                const methodColors = { 'Tunai': 'bg-green-100 text-green-700', 'Transfer': 'bg-blue-100 text-blue-700', 'QRIS': 'bg-purple-100 text-purple-700', 'BPJS': 'bg-teal-100 text-teal-700' };
                const mc = methodColors[a.paymentMethod] || 'bg-slate-100 text-slate-600';
                return `
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-4 py-3 text-slate-500 text-xs">${paidDate}</td>
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-2">
                                            <span class="font-medium text-slate-800">${nama}</span>
                                            <button onclick="printReceipt('${a.id}', 'RECEIPT')" class="text-slate-300 hover:text-blue-600 transition-colors no-print" title="Cetak Struk">
                                                <i data-lucide="printer" width="12"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 text-slate-500 hidden md:table-cell text-xs">${terapis ? terapis.name : '-'}</td>
                                    <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${mc}">${a.paymentMethod || '-'}</span></td>
                                    <td class="px-4 py-3 text-right font-black text-slate-800">${formatRp(a.finalAmount || a.fee)}</td>
                                </tr>`;
            }).join('')}
                        </tbody>
                    </table>
                    ${hasMore ? `
                    <div class="p-6 bg-slate-50 border-t border-slate-100 text-center">
                        <button onclick="loadMoreLaporan()" class="bg-white border-2 border-slate-200 px-8 py-3 rounded-2xl text-xs font-black text-blue-600 shadow-sm hover:shadow-md hover:bg-blue-50 transition-all active:scale-95">
                            Tampilkan 50 Transaksi Berikutnya
                        </button>
                        <p class="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">Menampilkan ${displayed.length} dari ${searchResult.length} transaksi ditemukan</p>
                    </div>` : ''}
                   </div>`}
        </div>
    `;
}

function searchLaporan() {
    const val = document.getElementById('laporan-search-input')?.value || '';
    state.laporanSearch = val;
    state.laporanLimit = 50; // Reset limit on search
    renderKasirView(document.getElementById('main-content'));
    renderIcons();
}

function clearLaporanSearch() {
    state.laporanSearch = '';
    state.laporanLimit = 50;
    renderKasirView(document.getElementById('main-content'));
    renderIcons();
}

function loadMoreLaporan() {
    state.laporanLimit = (state.laporanLimit || 50) + 50;
    renderKasirView(document.getElementById('main-content'));
    renderIcons();
}

function applyLaporanFilter() {
    const from = document.getElementById('laporan-from')?.value;
    const to = document.getElementById('laporan-to')?.value;
    if (from) state.laporanFrom = from;
    if (to) state.laporanTo = to;
    state.laporanLimit = 50; // Reset pagination
    renderKasirView(document.getElementById('main-content'));
    showToast(`Laporan difilter: ${from} s/d ${to}`, 'info');
}


// --- Modal Pembayaran ---
function openPaymentModal(apptId) {
    const a = (state.appointments || []).find(x => x.id === apptId);
    if (!a) return;
    const p = (state.patients || []).find(pt => pt.id === a.patientId);
    const nama = p ? p.name : (a.visitor_name || a.name || 'Pasien Baru');

    state._currentPaymentAppt = a; // [FIX] Store current appointment for context helpers like Bulk Pay

    // Ambil fee dari appointment, jika kosong ambil dari assessment terakhir di hari yang sama, jika masih kosong ambil defaultFee
    let feeBase = parseRp(a.fee) || parseRp(a.finalAmount);
    if (feeBase === 0) {
        const lastAsm = (state.assessments || []).filter(asm => asm.patientId === a.patientId)
            .sort((a, b) => b.date.localeCompare(a.date))[0];
        if (lastAsm && lastAsm.fee) feeBase = Number(lastAsm.fee);
    }
    if (feeBase === 0 && p) {
        feeBase = Number(p.defaultFee) || 0;
    }

    // Jika appointment sudah diset metode 'Paket' dari awal booking, 
    // anggap sesi potongan paket (Rp 0)
    if (a.paymentMethod === 'Paket') {
        feeBase = 0;
    }

    window.handlePurchaseToggle = (checkbox) => {
        applyPackagePricing();
    };

    state._isPmFeeEdited = false; // RESET EDIT FLAG ON MODAL OPEN

    window.applyPackagePricing = () => {
        const pkgId = document.getElementById('pm-package-buy')?.value;
        const pkg = (state.packages || []).find(x => x.id === pkgId);
        const feeInput = document.getElementById('pm-fee-base');
        const discInput = document.getElementById('pm-discount');
        const isNew = document.getElementById('pm-is-new-purchase')?.checked;
        const method = state._selectedPaymentMethod;
        const confirmBtn = document.getElementById('pm-confirm-btn');

        if (!feeInput) return;

        if (pkg) {
            if (method === 'Paket' && !isNew) {
                // POTONG SESI: Harga 0 (Lunas di awal)
                feeInput.value = 0;
                if (discInput) discInput.value = 0;
            } else {
                // BELI BARU / TEMPLATE: Harga Full
                feeInput.value = pkg.price;
                if (discInput) discInput.value = 0;

                if (method === 'Paket' && isNew) {
                    if (confirmBtn) confirmBtn.disabled = true;
                    const help = document.getElementById('pm-help-text');
                    if (help) help.textContent = "Beli baru wajib pakai Tunai/Transfer/QRIS";
                }
            }
        } else {
            // Jika tidak pilih paket (Layanan Biasa), kembalikan ke harga default pendaftaran/assessment akhir
            if (method === 'Paket') {
                feeInput.value = 0;
            } else if (!state._isPmFeeEdited) {
                // HANYA UPDATE JIKA USER BELUM KETIK MANUAL
                feeInput.value = state._initialPmFee || 0;
            }
        }
        handlePaymentUpdateManual();
    };



    // Reset temporary state for payment
    state._selectedPaymentMethod = '';
    state._currentDiscount = 0;
    state._initialPmFee = feeBase; // Simpan untuk fallback jika batal pilih paket

    const modal = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');
    modal.classList.remove('hidden');

    content.innerHTML = `
        <div class="bg-white px-6 py-4 border-b flex justify-between items-center z-20">
            <div>
                <h3 class="text-xl font-bold text-slate-800">Proses Pembayaran</h3>
                <p class="text-sm text-slate-500">${nama} &bull; ${a.time || ''} &bull; ${a.date}</p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="handleBillPrint('${apptId}')" 
                    id="btn-print-bill"
                    class="bg-slate-100 p-2 rounded-xl text-slate-600 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-200 group flex items-center gap-2 px-3" title="Cetak Tagihan">
                    <i data-lucide="printer" width="18"></i>
                    <span class="text-xs font-bold">Cetak Tagihan</span>
                </button>
                <button onclick="closeModal()" class="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                    <i data-lucide="x" width="20"></i>
                </button>
            </div>
        </div>
        <div class="flex-1 px-6 py-5 space-y-5 overflow-y-auto modal-scroll min-h-0 max-h-[55vh] md:max-h-[65vh]">
            <!-- Rincian & Setting Tarif -->
            <div class="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200 shadow-inner">
                ${p && p.quota > 0 ? `
                <div class="flex justify-between items-center bg-blue-100/50 p-2 rounded-lg">
                    <div class="flex items-center gap-2"><i data-lucide="package" width="14" class="text-blue-600"></i><span class="text-[10px] font-black text-blue-800 uppercase">SISA PAKET TERSEDIA</span></div>
                    <span class="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black">${p.quota} SESI</span>
                </div>` : ''}

                <div class="grid grid-cols-2 gap-4">
                    <div class="relative">
                        <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Pilih Paket (Gunakan Template Harga)</label>
                        <select id="pm-package-buy" onchange="handlePackageBuy(this.value)" class="w-full text-xs border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-bold">
                            <option value="">-- Hanya Layanan Biasa --</option>
                            ${(state.packages || []).map(pkg => `<option value="${pkg.id}">${pkg.name} (${pkg.sessions} Sesi)</option>`).join('')}
                        </select>
                        
                        <div class="mt-2 flex items-center justify-between bg-white border border-slate-200 p-2 rounded-lg shadow-sm">
                           <div class="flex flex-col">
                              <span class="text-[9px] font-black text-slate-500 uppercase">Konfirmasi Beli Baru?</span>
                              <span class="text-[8px] text-blue-600 font-bold italic">Nambah Kuota Pas Lunas</span>
                           </div>
                           <label class="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" id="pm-is-new-purchase" class="sr-only peer" onchange="handlePurchaseToggle(this)">
                              <div class="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                           </label>
                        </div>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Biaya Layanan (Rp)</label>
                        <input type="number" id="pm-fee-base" value="${feeBase || 0}" step="1000" oninput="handlePaymentUpdateManual()" onblur="applyCurrencyShorthand(this)" class="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-black text-slate-700 bg-white">
                    </div>
                </div>

                <div class="flex justify-between text-sm items-center pt-1">
                    <span class="text-slate-500 font-bold text-xs uppercase">Diskon Potongan (Rp)</span>
                    <input type="number" id="pm-discount" value="0" min="0" oninput="handlePaymentUpdateManual()" onblur="applyCurrencyShorthand(this)"
                        class="w-32 text-right border-2 border-slate-200 rounded-lg px-2 py-1 text-sm focus:border-blue-500 outline-none font-bold">
                </div>
                
                <div class="border-t border-slate-200 pt-2 flex justify-between items-center">
                    <span class="font-bold text-slate-400 text-xs uppercase tracking-widest">TOTAL TAGIHAN</span>
                    <span id="pm-total" class="text-2xl font-black text-blue-600">${formatRp(feeBase)}</span>
                </div>
            </div>

            <!-- Treatment Checklist (Additive) -->
            ${(state.treatments || []).length > 0 ? `
            <div class="space-y-2">
                <p class="text-[10px] font-bold text-slate-500 uppercase">Pilih Tindakan / Layanan Tambahan</p>
                <div class="grid grid-cols-2 gap-2">
                    ${state.treatments.map(t => `
                    <label class="flex items-center gap-3 p-2 border border-slate-100 rounded-lg bg-white hover:bg-slate-50 cursor-pointer shadow-sm transition-all group">
                        <input type="checkbox" class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" onchange="toggleTreatmentFee(this, ${t.price})">
                        <div class="flex-1">
                            <div class="text-[11px] font-bold text-slate-700 leading-none">${t.name}</div>
                            <div class="text-[9px] text-slate-400 font-mono">${formatRp(t.price)}</div>
                        </div>
                    </label>`).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Pilih Metode [RESTORED] -->
            <div class="mb-4">
                <p class="text-[10px] font-black text-slate-500 uppercase mb-2">Pilih Metode Pembayaran</p>
                <div class="grid grid-cols-5 gap-2" id="pm-method-group">
                    ${['Paket', 'Tunai', 'Transfer', 'QRIS', 'BPJS'].map(m => `
                        <label class="cursor-pointer">
                            <input type="radio" name="pm-method" value="${m}" class="peer hidden" onchange="pmMethodSelected(this)">
                            <div class="peer-checked:bg-purple-600 peer-checked:text-white peer-checked:border-purple-600 border border-slate-200 bg-white rounded-xl py-2 px-1 flex flex-col justify-center items-center transition-all hover:border-purple-300">
                                <div class="text-xl mb-1">${m === 'Paket' ? '📦' : m === 'Tunai' ? '💵' : m === 'Transfer' ? '🏦' : m === 'QRIS' ? '📱' : '🏥'}</div>
                                <div class="text-[9px] uppercase font-black text-center whitespace-nowrap">${m}</div>
                            </div>
                        </label>`).join('')}
                </div>
            </div>

            <!-- Tanggal Bayar -->
            <div class="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 flex items-center justify-between gap-3 mb-4">
               <div>
                  <p class="text-[10px] font-black text-indigo-800 uppercase leading-none">Tanggal Bayar</p>
                  <p class="text-[8px] text-indigo-500 font-bold mb-1 italic">Default: Hari Ini</p>
               </div>
               <input type="date" id="pm-paid-at" value="${getServerTimeISO().split('T')[0]}" 
                  class="bg-white border-2 border-indigo-200 rounded-lg px-2 py-1 text-xs font-bold focus:border-indigo-500 outline-none">
            </div>

            <!-- Bulk Pay Option (By Patient) -->
            ${(state.appointments || []).filter(x => x.patientId === a.patientId && !isPaidAppt(x)).length > 1 ? `
                <div class="mb-4 bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <i data-lucide="layers" class="text-amber-600" width="18"></i>
                        <div>
                            <p class="text-[10px] font-black text-amber-800 uppercase leading-none">Bayar Borongan (Tunggakan)</p>
                            <p class="text-[9px] text-amber-600 font-bold">Lunasi semua sesi yang belum bayar sekaligus</p>
                        </div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="pm-bulk-pay" class="sr-only peer" onchange="handleBulkPayToggle(this)">
                        <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                </div>
            ` : ''}
        </div>
        <div class="px-6 py-4 border-t bg-slate-50">
            <button onclick="confirmPayment('${apptId}')"
                id="pm-confirm-btn"
                class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-base transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                disabled>
                <i data-lucide="check-circle" width="20"></i> 
                <span>Konfirmasi Lunas</span>
            </button>
            <p class="text-xs text-slate-400 text-center mt-2" id="pm-help-text">Pilih metode pembayaran terlebih dahulu</p>
        </div>`;

    // Global helper for this modal
    window.handlePackageBuy = (id) => {
        applyPackagePricing();
    };

    window.handlePaymentUpdateManual = (fromShorthand = false) => {
        const fee = parseRp(document.getElementById('pm-fee-base')?.value) || 0;
        const disc = parseRp(document.getElementById('pm-discount')?.value) || 0;
        const total = Math.max(0, fee - disc);

        if (!fromShorthand) state._isPmFeeEdited = true;

        const totalEl = document.getElementById('pm-total');
        if (totalEl) totalEl.innerText = formatRp(total);
        state._currentDiscount = disc;
    };

    /**
     * [FIX] Handle Bulk Pay Toggle: Automatically sum all unpaid fees
     */
    window.handleBulkPayToggle = (el) => {
        const isBulk = el.checked;
        const feeInput = document.getElementById('pm-fee-base');
        if (!feeInput) return;

        if (isBulk) {
            // Sum all unpaid fees for this patient
            const patientId = state._currentPaymentAppt?.patientId;
            const unpaid = (state.appointments || []).filter(x => x.patientId === patientId && !isPaidAppt(x));
            const totalUnpaidFee = unpaid.reduce((s, x) => s + (parseRp(x.fee) || 0), 0);

            feeInput.value = totalUnpaidFee;
            state._isPmFeeEdited = true; // [FIX] Lock this value so applyPackagePricing doesn't overwrite it
            showToast(`Membayar ${unpaid.length} sesi sekaligus.`, 'info');
        } else {
            // Revert to initial fee
            feeInput.value = state._initialPmFee || 0;
            state._isPmFeeEdited = false;
        }

        handlePaymentUpdateManual();
    };

    window.toggleTreatmentFee = (checkbox, price) => {
        const feeInput = document.getElementById('pm-fee-base');
        if (!feeInput) return;
        let current = Number(feeInput.value) || 0;
        if (checkbox.checked) {
            feeInput.value = current + price;
        } else {
            feeInput.value = Math.max(0, current - price);
        }
        handlePaymentUpdateManual();
    };

    window.handleBillPrint = (aid) => {
        const a = (state.appointments || []).find(x => x.id === aid);
        if (a) {
            // Temporarily set discount/finalAmount for receipt generation if not confirmed yet
            const oldD = a.discount;
            const oldF = a.finalAmount;
            a.discount = state._currentDiscount || 0;
            a.finalAmount = parseRp(a.fee) - a.discount;

            printReceipt(aid, 'BILL');

            // Restore (optional, as confirmPayment will overwrite anyway)
            a.discount = oldD;
            a.finalAmount = oldF;
        }
    };

    renderIcons();

    // Auto-select if already suggested during booking
    if (a.paymentMethod) {
        const radio = document.querySelector(`input[name="pm-method"][value="${a.paymentMethod}"]`);
        if (radio) {
            radio.checked = true;
            pmMethodSelected(radio);
        }
    }
}

function pmMethodSelected(radio) {
    state._selectedPaymentMethod = radio.value;

    // Jika pilih 'Paket', otomatis matikan toggle 'Beli Baru'
    if (radio.value === 'Paket') {
        const buyToggle = document.getElementById('pm-is-new-purchase');
        if (buyToggle) buyToggle.checked = false;
    }

    // Selalu update harga dan diskon berdasarkan metode baru
    applyPackagePricing();

    // Enable confirm button
    const btn = document.getElementById('pm-confirm-btn');
    if (btn) {
        btn.disabled = false;
        const help = document.getElementById('pm-help-text');
        if (help) help.textContent = `Bayar via ${radio.value}`;
    }
}

function updatePaymentTotal(feeBase) {
    const disc = Number(document.getElementById('pm-discount')?.value) || 0;
    const total = Math.max(0, feeBase - disc);
    const totalEl = document.getElementById('pm-total');
    if (totalEl) {
        totalEl.textContent = formatRp(total);
        if (total === 0) {
            totalEl.innerHTML += ` <span class="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded animate-pulse">Cek Tarif!</span>`;
        }
    }
}

async function confirmPayment(apptId) {
    updateSyncStatusUI('syncing', false); // [IMMEDIATE UI FEEDBACK]
    const a = (state.appointments || []).find(x => String(x.id).trim() === String(apptId).trim());
    if (!a) return;

    const feeBase = Number(document.getElementById('pm-fee-base')?.value) || 0;
    const discount = Number(document.getElementById('pm-discount')?.value) || 0;
    const finalAmount = Math.max(0, feeBase - discount);
    const method = state._selectedPaymentMethod;
    const packageIdBought = document.getElementById('pm-package-buy')?.value;

    if (!method) { alert('Pilih metode pembayaran!'); return; }

    // BLOKIR PEMBAYARAN BUTA Rp 0
    if (finalAmount === 0 && method !== 'Paket') {
        const sure = confirm("Peringatan: Total Tagihan Rp 0. Apakah Anda yakin ingin mengkonfirmasi pembayaran ini sebagai Lunas?");
        if (!sure) return;
    }

    const isNewPurchase = document.getElementById('pm-is-new-purchase')?.checked;

    // [FIX] Capture Payment Date from UI
    const paidAtInput = document.getElementById('pm-paid-at')?.value;
    const paidAtStr = paidAtInput ? `${paidAtInput}T${new Date().toLocaleTimeString('en-GB')}` : getServerTimeISO();

    // Update state
    a.fee = feeBase;
    // [CRITICAL FIX] Key Purification: Remove any truncated/corrupted or mismatched keys from sheet imports
    // This ensures that our preferred camelCase keys are the ONLY sources of truth.
    Object.keys(a).forEach(k => {
        const kn = k.toLowerCase();
        if (kn === 'paymentstatus' && k !== 'paymentStatus') delete a[k];
        if (kn === 'paymentmethod' && k !== 'paymentMethod') delete a[k];
        if (kn === 'finalamount' && k !== 'finalAmount') delete a[k];
        if (kn === 'paidat' && k !== 'paidAt') delete a[k];
        if (kn === 'updatedat' && k !== 'updatedAt') delete a[k];
    });

    a.paymentStatus = 'PAID';
    a.paymentMethod = method;
    a.discount = discount;
    a.finalAmount = finalAmount;
    a.paidAt = paidAtStr;
    a.updatedAt = getServerTimeISO();
    a._dirty = true; // [INSTANT PUSH] Mark as dirty to ensure sync picks it up immediately

    // Auto Quota Management
    const pIdx = state.patients.findIndex(p => p.id === a.patientId);
    if (pIdx > -1) {
        let patient = state.patients[pIdx];

        // Simplified Goal: Any Paid transaction deducts 1 if quota > 0
        if (packageIdBought && isNewPurchase) {
            const pkg = state.packages.find(x => x.id === packageIdBought);
            if (pkg) {
                // ADD pkg.sessions - 1 (because naturally we use 1 today)
                patient.quota = (patient.quota || 0) + pkg.sessions - 1;
                patient.updatedAt = getServerTimeISO();
                console.log(`Beli Paket ${pkg.name}. Multi-cut logic: +${pkg.sessions} -1. Sisa: ${patient.quota}`);
            }
        }
        // REGULAR REDUCTION REMOVED: Handled at Booking Time!

        // Handle Bulk Payment for THIS PATIENT if checked
        const isBulk = document.getElementById('pm-bulk-pay')?.checked;
        if (isBulk) {
            // BULK PAYMENT DISTRIBUTION [FIX]
            state.appointments.forEach(other => {
                if (other.patientId === a.patientId && !isPaidAppt(other)) {
                    other.paymentStatus = 'PAID';
                    other.paymentMethod = method;

                    // Logic: Keep individual fees for stats, but set finalAmount to 0 for others 
                    // to prevent double counting in financial reports (Main item carries the total paid)
                    if (other.id === a.id) {
                        other.fee = feeBase;
                        other.discount = discount;
                        other.finalAmount = finalAmount;
                    } else {
                        // other.fee remains as is (historical session fee)
                        other.discount = 0;
                        other.finalAmount = 0; // Set to 0 because total is already in 'a.finalAmount'
                    }

                    other.paidAt = paidAtStr;
                    other.updatedAt = getServerTimeISO();
                    other._dirty = true;
                }
            });
            console.log(`Bulk Payment Activated: All unpaid sessions for patient ${a.patientId} marked as PAID.`);
        }
    }

    await saveData(); // [CRITICAL] Ensure local persistence before Cloud Sync
    if (state.scriptUrl) {
        updateSyncStatusUI('syncing', false);
        syncDelta(false);
    }

    // UI Feedback Sukses & Opsi Cetak
    const content = document.getElementById('modal-content');
    content.innerHTML = `
        <div class="p-10 text-center space-y-6">
            <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
                <i data-lucide="check-circle" width="48"></i>
            </div>
            <div>
                <h3 class="text-2xl font-black text-slate-800">Pembayaran Berhasil!</h3>
                <p class="text-slate-500 mt-2">Data transaksi untuk <b>${(state.patients || []).find(p => p.id === a.patientId)?.name || 'Pasien'}</b> telah disimpan.</p>
            </div>
            <div class="grid grid-cols-2 gap-3 pt-4">
                <button onclick="printReceipt('${apptId}', 'RECEIPT')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">
                    <i data-lucide="printer" width="20"></i> Cetak Struk
                </button>
                <button onclick="closeModal()" class="bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-2xl transition-all active:scale-95">
                    Selesai
                </button>
            </div>
        </div>
    `;
    lucide.createIcons();

    renderKasirView(document.getElementById('main-content'));
}

function openReceiptPreview(apptId, type) {
    if (document.getElementById('receipt-preview-overlay')) {
        document.getElementById('receipt-preview-overlay').remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'receipt-preview-overlay';
    overlay.className = 'fixed inset-0 z-[100000] bg-slate-200 flex flex-col items-center p-4 md:p-10';
    overlay.innerHTML = `
        <div class="w-full max-w-4xl flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <button onclick="closeReceiptPreview()" class="px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold flex items-center gap-2 transition-all text-sm shadow-sm">
                <i data-lucide="arrow-left" width="18"></i> Kembali
            </button>
            <div class="flex gap-4 items-center flex-wrap justify-end">
                <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <span class="text-xs font-bold text-slate-500 uppercase">Format:</span>
                    <select id="receipt-paper-size" onchange="updateReceiptPreviewIframe('${apptId}', '${type}')" class="px-4 py-2 bg-blue-50 border-2 border-blue-200 text-blue-800 rounded-xl outline-none focus:border-blue-500 font-bold text-sm shadow-sm w-full sm:w-auto">
                        <option value="58mm">Struk Kertas 58mm</option>
                        <option value="80mm">Struk Kertas 80mm</option>
                        <option value="A4">Kertas Invoice (A4)</option>
                    </select>
                </div>
                <button onclick="executeReceiptPrint('${apptId}')" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/50 flex items-center gap-2 transition-all btn-press text-sm">
                    <i data-lucide="printer" width="18"></i> Cetak Sekarang
                </button>
            </div>
        </div>
        <div class="flex-1 w-full max-w-4xl relative">
            <div class="absolute inset-0 flex justify-center items-start overflow-y-auto pb-10 custom-scrollbar">
                <iframe id="receipt-preview-iframe" class="bg-white shadow-2xl rounded-sm transition-all duration-300 transform origin-top shrink-0" style="min-height: 500px;"></iframe>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    lucide.createIcons({ root: overlay });
    updateReceiptPreviewIframe(apptId, type);
}

function updateReceiptPreviewIframe(apptId, type) {
    const paperSize = document.getElementById('receipt-paper-size').value;
    const iframe = document.getElementById('receipt-preview-iframe');

    // adjust iframe size visually based on paper
    if (paperSize === '58mm') {
        iframe.style.width = '260px';
        iframe.style.minHeight = '400px';
    } else if (paperSize === '80mm') {
        iframe.style.width = '350px';
        iframe.style.minHeight = '500px';
    } else if (paperSize === 'A4') {
        iframe.style.width = '100%';
        iframe.style.maxWidth = '800px';
        iframe.style.minHeight = '1000px';
    }

    // Slight delay to allow reflow, so transition applies
    setTimeout(() => {
        const html = generateReceiptHTML(apptId, type, paperSize);
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
    }, 50);
}

function executeReceiptPrint(apptId) {
    const iframe = document.getElementById('receipt-preview-iframe');
    if (!iframe) return;

    let docTitle = 'Struk_Pembayaran';
    if (apptId) {
        const a = (state.appointments || []).find(x => x.id === apptId) || (state.assessments || []).find(x => x.id === apptId);
        if (a) {
            const p = (state.patients || []).find(pt => pt.id === a.patientId);
            const nama = p ? p.name.replace(/[^a-zA-Z0-9 ]/g, '') : (a.visitor_name || a.name || 'Pasien');
            const pAppts = (state.assessments || []).filter(x => x.patientId === a.patientId).sort((x, y) => new Date(x.date) - new Date(y.date));
            let sessionNum = pAppts.findIndex(x => x.id === apptId) + 1;
            if (sessionNum === 0) sessionNum = pAppts.length + 1; // Not yet saved as assessment
            const diag = (a.diagnosis || 'Layanan').replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'Layanan';
            const dateStr = (a.date || '').replace(/[^0-9-]/g, '');
            docTitle = `${nama}-${diag}-PertemuanKe${sessionNum}-${dateStr}`;
        }
    }

    if (!state.originalDocumentTitle) state.originalDocumentTitle = document.title;
    document.title = docTitle;

    const cw = iframe.contentWindow;
    cw.document.title = docTitle;
    cw.focus();
    setTimeout(() => {
        cw.print();
    }, 200);
}

function closeReceiptPreview() {
    if (state.originalDocumentTitle) {
        document.title = state.originalDocumentTitle;
        state.originalDocumentTitle = null;
    }
    const overlay = document.getElementById('receipt-preview-overlay');
    if (overlay) overlay.remove();
}

function printReceipt(apptId, type) {
    openReceiptPreview(apptId, type);
}

// Redundant Pajak functions removed successfully during merger.

// Merged into renderKasirLaporan and printJournalReport

function updateTaxOverride(key, val) {
    if (!state.taxOverride) state.taxOverride = {};
    if (key === 'bruto') {
        state.taxOverride.bruto = Number(val);
        // Update total pajak di UI secara instant agar responsif
        const amount = Number(val) * 0.005;
        const el = document.getElementById('tax-final-amount');
        if (el) el.textContent = 'Rp ' + amount.toLocaleString('id-ID');
    }
    if (key === 'notes') state.taxOverride.notes = val;
    // Debounce saves to local storage implicitly via state modification if needed, 
    // but here we just keep it in state while session is active.
}

// --- FUNGSI CETAK JURNAL & PAJAK ESTETIK ---

function printJournalReport() {
    const now = new Date();
    const clinic = state.clinicInfo || { name: 'FISIOTA' };
    const from = state.laporanFrom || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const to = state.laporanTo || today();

    // Choose title: If user has set an override, use the "Tax" formal title.
    const isOverride = (state.taxOverride && state.taxOverride.bruto !== undefined);
    const title = isOverride ? "REKAPITULASI PAJAK FINAL (UMKM PP-23)" : "JURNAL PENERIMAAN KAS KLINIK";
    const periodText = `PERIODE: ${from} s/d ${to}`;

    let filtered = (state.appointments || []).filter(a => {
        const isPaid = (a.paymentStatus || '').toUpperCase() === 'PAID';
        const isLegacyPaid = (!a.paymentStatus || a.paymentStatus === "") && (a.paymentMethod || a.paidAt);
        const apptDate = (a.paidAt || a.date || '');
        const dateStr = apptDate.slice(0, 10);
        return (isPaid || isLegacyPaid) && dateStr >= from && dateStr <= to;
    });

    // Sort by Date
    filtered.sort((a, b) => (a.paidAt || a.date || "").localeCompare(b.paidAt || b.date || ""));

    // Calculation Basis
    let totalDpp = 0;
    let totalTax = 0;
    let totalGrand = 0;

    // Pre-calculate totals for summary
    if (isOverride) {
        totalDpp = state.taxOverride.bruto;
        totalTax = totalDpp * 0.005;
        totalGrand = totalDpp; // Untuk perhitungan penerimaan di bawah
    }

    const rowsHtml = filtered.map((a, idx) => {
        const patient = state.patients.find(p => p.id === a.patientId) || { name: a.visitor_name || a.name || 'Pasien' };
        const grandTotal = parseRp(a.finalAmount) || parseRp(a.fee) || 0;
        const dpp = grandTotal;
        const tax = grandTotal * 0.005;

        if (!isOverride) {
            totalDpp += dpp;
            totalTax += tax;
            totalGrand += grandTotal;
        }

        const dateDisplay = a.paidAt
            ? new Date(a.paidAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date(a.paidAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            : formatDateForDisplay(a.date);

        return `
            <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td>${dateDisplay}</td>
                <td style="font-family: monospace; font-size: 10px;">${a.id}</td>
                <td>${patient.name}</td>
                <td style="text-align: right;">${grandTotal.toLocaleString('id-ID')}</td>
                <td style="text-align: right;">${dpp.toLocaleString('id-ID')}</td>
                <td style="text-align: right;">${tax.toLocaleString('id-ID')}</td>
                <td style="font-size: 10px;">${a.paymentMethod || '-'}</td>
            </tr>
        `;
    }).join('');

    const html = `
        <html>
        <head>
            <title>${title} - ${clinic.name}</title>
            <style>
                @page { size: A4 portrait; margin: 15mm; }
                body { font-family: 'Inter', -apple-system, system-ui, sans-serif; padding: 0; color: #1e293b; line-height: 1.4; font-size: 10px; }
                
                .header-wrapper { display: flex; align-items: flex-start; border-bottom: 2px solid #1e293b; padding-bottom: 12px; margin-bottom: 20px; }
                .logo-box { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin-right: 15px; }
                .logo-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
                .clinic-info { flex: 1; }
                .clinic-info h1 { margin: 0; font-size: 18px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -0.5px; }
                .clinic-info p { margin: 1px 0; color: #64748b; font-size: 9px; }
                .clinic-info .bold { color: #0f172a; font-weight: 700; }

                .report-header { text-align: center; margin-bottom: 20px; }
                .report-header h2 { margin: 0; font-size: 14px; font-weight: 800; border-bottom: 1px solid #1e293b; display: inline-block; padding-bottom: 2px; }
                .report-header p { margin: 4px 0 0; font-size: 11px; font-weight: 700; color: #334155; }

                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th { background: #f8fafc; color: #1e293b; font-weight: 800; text-transform: uppercase; font-size: 9px; border-top: 1px solid #1e293b; border-bottom: 1px solid #1e293b; padding: 8px 4px; }
                td { padding: 6px 4px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
                .text-right { text-align: right; }
                
                .summary-table { margin-left: auto; width: 280px; margin-top: 10px; }
                .summary-table td { border: none; padding: 2px 4px; font-size: 11px; }
                .summary-table .label { text-align: right; color: #64748b; font-weight: 600; padding-right: 15px; }
                .summary-table .value { text-align: right; font-weight: 900; border-bottom: 1px double #1e293b; color: #0f172a; }
                .summary-table .highlight { color: #dc2626; }

                .footer { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                .print-meta { font-size: 8px; color: #94a3b8; font-style: italic; }
                .signature-box { text-align: center; width: 200px; }
                .signature-box p { margin: 2px 0; }
                .signature-space { height: 60px; }

                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header-wrapper">
                <div class="logo-box">
                    ${state.clinicInfo.logoUrl ? `<img src="${convertDriveUrl(state.clinicInfo.logoUrl)}" style="width: 80px; height: 80px; object-fit: contain;">` : `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`}
                </div>
                <div class="clinic-info">
                    <h1>${clinic.name}</h1>
                    <p class="bold">Izin Operasional: ${clinic.sipf || '-'}</p>
                    <p>${clinic.address || '-'}</p>
                    <p>Telp: ${clinic.phone || '-'} &bull; NPWP: ${clinic.npwp || '-'}</p>
                </div>
            </div>

            <div class="report-header">
                <h2>${title}</h2>
                <p>${periodText}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th style="width: 25px;">No</th>
                        <th style="width: 100px;">Tanggal & Jam</th>
                        <th style="width: 70px;">ID Faktur</th>
                        <th>Nama Pasien</th>
                        <th style="width: 80px;" class="text-right">Grand Total</th>
                        <th style="width: 80px;" class="text-right">DPP</th>
                        <th style="width: 80px;" class="text-right">Pajak (0.5%)</th>
                        <th style="width: 80px;">Metode</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>

            <table class="summary-table">
                <tr>
                    <td class="label">Total DPP${isOverride ? ' (Manual)' : ''} :</td>
                    <td class="value">Rp ${totalDpp.toLocaleString('id-ID')}</td>
                </tr>
                <tr>
                    <td class="label">Total Pajak (0.5%) :</td>
                    <td class="value highlight">Rp ${totalTax.toLocaleString('id-ID')}</td>
                </tr>
                <tr>
                    <td class="label">Total Penerimaan (Netto) :</td>
                    <td class="value">Rp ${(totalDpp - totalTax).toLocaleString('id-ID')}</td>
                </tr>
            </table>

            <div style="margin-top: 20px; font-size: 9px; color: #475569; border: 1px dashed #cbd5e1; padding: 8px; border-radius: 6px;">
                <strong>Keterangan:</strong> ${state.taxOverride?.notes || '-'}
            </div>

            <div class="footer">
                <div class="print-meta">
                    Sistem Digital ERM FISIOTA<br>
                    Dicetak: ${now.toLocaleString('id-ID')}
                </div>
                <div class="signature-box">
                    <p>${clinic.location || 'Kota'}, ${now.toLocaleDateString('id-ID')}</p>
                    <p>Pimpinan Klinik,</p>
                    <div class="signature-space"></div>
                    <p><strong>( ______________________ )</strong></p>
                    <p style="font-size: 8px; color: #94a3b8; margin-top: 4px;">Ttd & Stempel</p>
                </div>
            </div>
        </body>
        </html>
    `;
    printHTML(html);
}

function printAppointmentReport() {
    const now = new Date();
    const clinic = state.clinicInfo || { name: 'FISIOTA' };
    const from = state.laporanFrom || today();
    const to = state.laporanTo || today();

    // FILTER SEMUA (Tanpa filter PAID) sesuai tab Appointments
    const filtered = (state.appointments || []).filter(a => {
        const apptDate = (a.date || '').slice(0, 10);
        return apptDate >= from && apptDate <= to;
    }).sort((a, b) => (a.date + ' ' + a.time).localeCompare(b.date + ' ' + b.time));

    const rowsHtml = filtered.map((a, idx) => {
        const p = (state.patients || []).find(pt => pt.id === a.patientId);
        const name = p ? p.name : (a.visitor_name || a.name || '-');
        const therapist = (state.users || []).find(u => u.id === a.therapistId);
        const fee = parseRp(a.fee);

        return `
            <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td style="white-space: nowrap;">${a.date}</td>
                <td style="text-align: center;">${a.time || '-'}</td>
                <td style="font-weight: 700; color: #0f172a;">${name.toUpperCase()}</td>
                <td>${therapist ? therapist.name : (a.therapistId || '-')}</td>
                <td style="text-align: center;">
                    <span style="display: inline-block; font-size: 8px; padding: 4px 8px; border-radius: 6px; background: ${a.paymentStatus === 'PAID' ? '#dcfce7' : '#f1f5f9'}; color: ${a.paymentStatus === 'PAID' ? '#166534' : '#475569'}; font-weight: 800; text-transform: uppercase;">
                        ${a.paymentStatus || (a.status || 'SCHEDULED')}
                    </span>
                </td>
                <td style="text-align: right; font-weight: 700; white-space: nowrap;">${fee.toLocaleString('id-ID')}</td>
                <td style="font-size: 9px; color: #64748b; min-width: 150px;">${a.notes || '-'}</td>
            </tr>
        `;
    }).join('');

    const html = `
        <html>
        <head>
            <title>Rekapitulasi Kunjungan - ${clinic.name}</title>
            <style>
                @page { size: A4 landscape; margin: 0; }
                body { 
                    font-family: 'Inter', system-ui, -apple-system, sans-serif; 
                    padding: 15mm 20mm; 
                    color: #1e293b; 
                    font-size: 10px; 
                    line-height: 1.5; 
                    background: #fff;
                    margin: 0;
                }
                
                * { box-sizing: border-box; }

                .report-container { width: 100%; border: 0 !important; }
                
                .header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    border-bottom: 3px solid #0f172a; 
                    padding-bottom: 12px; 
                    margin-bottom: 25px; 
                }
                .header-left h1 { margin: 0; font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -0.8px; text-transform: uppercase; }
                .header-left p { margin: 4px 0; color: #64748b; font-size: 10px; font-weight: 500; }
                .header-right { text-align: right; }
                .header-right h2 { margin: 0; font-size: 16px; font-weight: 900; color: #2563eb; letter-spacing: 0.2px; }
                .header-right p { margin: 6px 0; font-size: 11px; color: #334155; }

                table { width: 100%; border-collapse: collapse; margin-bottom: 25px; table-layout: auto; border: 1px solid #e2e8f0; }
                th { 
                    background: #f1f5f9; 
                    border: 1px solid #cbd5e1; 
                    padding: 12px 10px; 
                    font-weight: 900; 
                    text-transform: uppercase; 
                    font-size: 9px; 
                    text-align: left;
                    color: #475569;
                }
                td { 
                    border: 1px solid #e2e8f0; 
                    padding: 10px; 
                    vertical-align: middle; 
                }
                
                tr:nth-child(even) { background-color: #f8fafc; }
                
                .footer { 
                    margin-top: 40px; 
                    display: flex; 
                    justify-content: space-between; 
                    font-size: 9px; 
                    color: #94a3b8; 
                    border-top: 2px solid #f1f5f9;
                    padding-top: 15px;
                }
                .label-period { background: #dbeafe; color: #1e40af; padding: 3px 8px; border-radius: 6px; font-weight: 800; }
            </style>
        </head>
        <body>
            <div class="report-container">
                <div class="header">
                    <div class="header-left" style="display: flex; align-items: center; gap: 15px;">
                        ${state.clinicInfo.logoUrl ? `<img src="${convertDriveUrl(state.clinicInfo.logoUrl)}" style="height: 85px; width: auto; object-fit: contain;">` : ''}
                        <div>
                            <h1>${clinic.name}</h1>
                            <p>${clinic.address || '-'}</p>
                        </div>
                    </div>
                    <div class="header-right">
                        <h2>REKAPITULASI KUNJUNGAN PASIEN</h2>
                        <p>Periode: <span class="label-period">${from} s/d ${to}</span></p>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 40px; text-align: center;">No</th>
                            <th style="width: 100px;">Tanggal</th>
                            <th style="width: 60px; text-align: center;">Jam</th>
                            <th style="width: 220px;">Nama Pasien</th>
                            <th style="width: 120px;">Terapis</th>
                            <th style="width: 90px; text-align: center;">Status</th>
                            <th style="width: 100px; text-align: right;">Biaya (Fee)</th>
                            <th>Catatan/Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>

                <div class="footer">
                    <div>Dicetak otomatis oleh Sistem ERM FISIOTA pada ${now.toLocaleString('id-ID')}</div>
                    <div style="font-weight: bold; color: #64748b;">Halaman 1 / 1</div>
                </div>
            </div>
        </body>
        </html>
    `;


    printHTML(html);
}

function printFinancialReport() {
    const now = new Date();
    const clinic = state.clinicInfo || { name: 'FISIOTA' };

    const defaultFrom = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const defaultTo = today();
    const from = state.laporanFrom || defaultFrom;
    const to = state.laporanTo || defaultTo;

    // Filter Pemasukan
    const incomes = (state.appointments || []).filter(a => {
        const isPaid = (a.paymentStatus || '').toUpperCase() === 'PAID';
        const isLegacyPaid = (!a.paymentStatus || a.paymentStatus === "") && (a.paymentMethod || a.paidAt);
        const apptDate = (a.paidAt || a.date || '');
        const dateStr = apptDate.slice(0, 10);
        return (isPaid || isLegacyPaid) && dateStr >= from && dateStr <= to;
    }).sort((a, b) => (a.paidAt || a.date || "").localeCompare(b.paidAt || b.date || ""));

    // Filter Pengeluaran
    const expenses = (state.expenses || []).filter(e => {
        const d = (e.date || '').slice(0, 10);
        return d >= from && d <= to;
    }).sort((a, b) => (a.date || "").localeCompare(b.date || ""));

    // Hitung Total
    const totalIncome = incomes.reduce((s, a) => s + (parseRp(a.finalAmount) || parseRp(a.fee) || 0), 0);
    const totalExpense = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const netProfit = totalIncome - totalExpense;

    function renderDate(d) {
        if (!d) return '-';
        return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    const incomeRows = incomes.map((a, idx) => {
        const patient = state.patients.find(p => p.id === a.patientId) || { name: a.visitor_name || a.name || 'Pasien' };
        const amt = parseRp(a.finalAmount) || parseRp(a.fee) || 0;
        return `
            <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td>${renderDate(a.paidAt || a.date)}</td>
                <td>${patient.name}</td>
                <td>${a.paymentMethod || '-'}</td>
                <td style="text-align: right;">${amt.toLocaleString('id-ID')}</td>
            </tr>
        `;
    }).join('') || '<tr><td colspan="5" style="text-align:center; padding: 10px; color:#94a3b8;">Tidak ada data pemasukan</td></tr>';

    const expenseRows = expenses.map((e, idx) => {
        const amt = Number(e.amount) || 0;
        return `
            <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td>${renderDate(e.date)}</td>
                <td>${e.category || '-'}</td>
                <td>${e.notes || '-'}</td>
                <td style="text-align: right;">${amt.toLocaleString('id-ID')}</td>
            </tr>
        `;
    }).join('') || '<tr><td colspan="5" style="text-align:center; padding: 10px; color:#94a3b8;">Tidak ada data pengeluaran</td></tr>';

    const html = `
        <html>
        <head>
            <title>Laporan Keuangan - ${clinic.name}</title>
            <style>
                @page { size: A4 portrait; margin: 15mm; }
                body { font-family: 'Inter', -apple-system, system-ui, sans-serif; padding: 0; color: #1e293b; line-height: 1.4; font-size: 11px; }
                
                .header-wrapper { display: flex; align-items: flex-start; border-bottom: 2px solid #1e293b; padding-bottom: 12px; margin-bottom: 20px; }
                .logo-box { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin-right: 15px; }
                .logo-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
                .clinic-info { flex: 1; }
                .clinic-info h1 { margin: 0; font-size: 18px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -0.5px; }
                .clinic-info p { margin: 1px 0; color: #64748b; font-size: 10px; }
                .clinic-info .bold { color: #0f172a; font-weight: 700; }

                .report-header { text-align: center; margin-bottom: 20px; }
                .report-header h2 { margin: 0; font-size: 16px; font-weight: 800; border-bottom: 1px solid #1e293b; display: inline-block; padding-bottom: 2px; }
                .report-header p { margin: 4px 0 0; font-size: 12px; font-weight: 700; color: #334155; }

                .section-title { font-size: 12px; font-weight: 800; color: #0f172a; margin: 15px 0 5px; text-transform: uppercase; background: #f1f5f9; padding: 4px 8px; display: inline-block; border-radius: 4px; }
                
                table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                th { background: #f8fafc; color: #1e293b; font-weight: 800; text-transform: uppercase; font-size: 10px; border-top: 1px solid #1e293b; border-bottom: 1px solid #1e293b; padding: 6px; text-align: left; }
                td { padding: 5px 6px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
                
                .summary-box { border: 2px solid #1e293b; border-radius: 8px; padding: 15px; margin-top: 25px; background: #fafafa; }
                .summary-table { width: 100%; margin: 0; }
                .summary-table td { border: none; padding: 4px 0; font-size: 12px; }
                .summary-table .label { font-weight: 700; color: #334155; }
                .summary-table .value { text-align: right; font-weight: 800; }
                .summary-table .total-row td { border-top: 2px solid #1e293b; padding-top: 8px; margin-top: 4px; font-size: 14px; font-weight: 900; }
                
                .profit { color: #059669; }
                .loss { color: #dc2626; }

                .footer { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                .print-meta { font-size: 9px; color: #94a3b8; font-style: italic; }
                .signature-box { text-align: center; width: 200px; }
                .signature-box p { margin: 2px 0; }
                .signature-space { height: 60px; }

                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header-wrapper">
                <div class="logo-box" style="width: 80px; height: 80px;">
                    ${state.clinicInfo.logoUrl ? `<img src="${convertDriveUrl(state.clinicInfo.logoUrl)}" style="width: 80px; height: 80px; object-fit: contain;">` : `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`}
                </div>
                <div class="clinic-info">
                    <h1>${clinic.name}</h1>
                    <p>${clinic.subname || 'Fisioterapi & Rehabilitasi'}</p>
                    <p>${clinic.address || 'Alamat belum diatur'}</p>
                    <p>Telp: <span class="bold">${clinic.phone || '-'}</span> | SIPF: <span class="bold">${clinic.sipf || '-'}</span></p>
                </div>
            </div>

            <div class="report-header">
                <h2>LAPORAN KEUANGAN KLINIK</h2>
                <p>PERIODE: ${from} s/d ${to}</p>
            </div>

            <!-- TABEL PEMASUKAN -->
            <div class="section-title">A. Pemasukan (Kredit)</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%; text-align:center;">No</th>
                        <th style="width: 15%;">Tanggal</th>
                        <th style="width: 40%;">Sumber / Pasien</th>
                        <th style="width: 20%;">Metode</th>
                        <th style="width: 20%; text-align:right;">Nominal (Rp)</th>
                    </tr>
                </thead>
                <tbody>
                    ${incomeRows}
                </tbody>
            </table>

            <!-- TABEL PENGELUARAN -->
            <div class="section-title">B. Pengeluaran (Debit)</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%; text-align:center;">No</th>
                        <th style="width: 15%;">Tanggal</th>
                        <th style="width: 20%;">Kategori</th>
                        <th style="width: 40%;">Keterangan</th>
                        <th style="width: 20%; text-align:right;">Nominal (Rp)</th>
                    </tr>
                </thead>
                <tbody>
                    ${expenseRows}
                </tbody>
            </table>

            <!-- RINGKASAN LABA RUGI -->
            <div class="summary-box">
                <table class="summary-table">
                    <tr>
                        <td class="label">Total Pemasukan Operasional</td>
                        <td class="value">${totalIncome.toLocaleString('id-ID')}</td>
                    </tr>
                    <tr>
                        <td class="label">Total Beban / Pengeluaran</td>
                        <td class="value" style="color:#dc2626;">(${totalExpense.toLocaleString('id-ID')})</td>
                    </tr>
                    <tr class="total-row">
                        <td class="label">LABA BERSIH (NET PROFIT)</td>
                        <td class="value ${netProfit >= 0 ? 'profit' : 'loss'}">${netProfit.toLocaleString('id-ID')}</td>
                    </tr>
                </table>
            </div>

            <div class="footer">
                <div class="print-meta">Dicetak pada: ${new Date().toLocaleString('id-ID')} oleh ${state.user ? state.user.name : 'System'}</div>
                <div class="signature-box">
                    <p>Mengetahui,</p>
                    <div class="signature-space"></div>
                    <p style="font-weight: 800; text-decoration: underline;">${clinic.therapist || 'Pimpinan Klinik'}</p>
                    <p style="font-size: 9px; color: #64748b;">${clinic.sipf ? 'SIPF. ' + clinic.sipf : 'Pimpinan'}</p>
                </div>
            </div>
        </body>
        </html>
    `;
    printHTML(html);
}


async function autoSyncPayment(appt) {
    const sheetId = getSheetIdFromUrl(state.scriptUrl);
    if (!sheetId) return;
    try {
        await fetch(LICENSE_API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'sync_incremental',
                sheet_id: sheetId,
                appointments: [appt]
            })
        });
        console.log('Payment synced to Google Sheet:', appt.id);
    } catch (e) {
        console.warn('Auto-sync payment failed (will sync on next manual push):', e);
    }
}

function resetNotifTemplate(type) {
    const defaults = {
        confirm: `Assalamualaikum Wr. Wb. 🌟\n\nHalo, Kak {{name}}! 😊\n\nKami dari *{{clinic_name}}* dengan senang hati menginformasikan bahwa jadwal Fisioterapi Kakak telah berhasil kami *konfirmasi* ✅\n\n🗓️ *Detail Jadwal:*\n┌─────────────────────\n│ 📅 Tanggal : {{date}}\n│ ⏰ Jam        : {{time}} WIB\n│ 📝 Keluhan : {{complaint}}\n└─────────────────────\n\n📌 *Mohon diperhatikan:*\n• Hadir 5-10 menit sebelum jadwal\n• Gunakan pakaian yang nyaman\n• Jika ada perubahan, mohon hubungi kami sebelumnya\n\nKami tunggu kedatangan Kakak 🙏\nSemoga segera pulih dan sehat selalu! 💪\n\nWassalamualaikum Wr. Wb.\n~ *Admin {{clinic_name}}*`,
        reject: `Assalamualaikum Wr. Wb. 🌟\n\nHalo, Kak {{name}}! 😊\n\nTerima kasih telah mempercayakan kesehatan Kakak kepada *{{clinic_name}}* 🙏\n\nDengan hormat, kami informasikan bahwa slot waktu yang Kakak pilih:\n📅 *{{date}}* pukul *{{time}} WIB*\nsaat ini *belum dapat kami terima* dikarenakan jadwal yang sudah penuh. 🙏\n\n*Kami sangat menyarankan* Kakak untuk memilih jadwal alternatif lain yang masih tersedia. Silakan booking ulang melalui link berikut:\n🔗 {{booking_url}}\n\nKami mohon maaf atas ketidaknyamanan ini dan berharap dapat segera melayani Kakak di waktu yang lebih sesuai 🌷\n\nWassalamualaikum Wr. Wb.\n~ *Admin {{clinic_name}}*`,
        reminder: `Assalamualaikum 👋\n\nMengingatkan kembali untuk jadwal Fisioterapi hari ini ya: 👇\n\n📅 Tanggal: {{date}}\n⏰ Jam: {{time}} WIB\n📍 Lokasi: {{category}}\n🏥 Alamat: {{address}}\n📞 Kontak: {{phone}}\n🗺️ Maps: {{maps_url}}\n📝 Catatan: {{notes}}\n\nMohon konfirmasinya. Terima kasih! 🙏\n~ Admin {{clinic_name}}`
    };

    if (confirm("Reset template ini ke pengaturan bawaan?")) {
        const el = document.getElementById(`notif-msg-${type}`);
        if (el) el.value = defaults[type];
    }
}

// --- 15.1. PACKAGE MANAGEMENT FUNCTIONS ---
function renderPackageTable() {
    const pkgs = state.packages || [];
    if (pkgs.length === 0) {
        return `<div class="p-12 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl mb-8">
                    <i data-lucide="package-search" width="48" class="mx-auto mb-4 opacity-20"></i>
                    <p class="font-medium">Belum ada paket layanan. <br><span class="text-xs">Klik tombol di atas untuk membuat paket pertama.</span></p>
                </div>`;
    }


    return `<table class="w-full text-sm mb-8">
        <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
                <th class="text-left px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Nama Paket</th>
                <th class="text-center px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Sesi</th>
                <th class="text-right px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Harga Total</th>
                <th class="text-right px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Per Sesi</th>
                <th class="text-center px-6 py-3" style="width: 100px;">Aksi</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
            ${pkgs.map(p => {
        const perSession = Math.round(p.price / p.sessions);
        return `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4">
                        <p class="font-bold text-slate-800">${p.name}</p>
                        <p class="text-[10px] text-slate-400 italic">${p.description || '-'}</p>
                    </td>
                    <td class="px-6 py-4 text-center font-bold text-blue-600">${p.sessions}</td>
                    <td class="px-6 py-4 text-right font-black text-slate-700">${formatRp(p.price)}</td>
                    <td class="px-6 py-4 text-right font-bold text-emerald-600">${formatRp(perSession)}</td>
                    <td class="px-6 py-4 text-center">
                        <div class="flex items-center justify-center gap-2">
                            <button onclick="openPackageModal('${p.id}')" class="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-all"><i data-lucide="edit-3" width="16"></i></button>
                        </div>
                    </td>
                </tr>`;
    }).join('')}
        </tbody>
    </table>`;
}

function openPackageModal(id = null) {
    const p = id ? state.packages.find(x => x.id === id) : { id: '', name: '', sessions: 10, price: 0, description: '' };
    const modalHtml = `
        <div class="bg-white px-6 py-4 border-b flex justify-between items-center sticky top-0 z-20">
            <div>
                <h3 class="text-xl font-bold text-slate-800">${id ? 'Edit Paket Layanan' : 'Buat Paket Baru'}</h3>
                <p class="text-xs text-slate-400">Atur harga dan kuota sesi terapi</p>
            </div>
            <button onclick="closeModal()" class="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"><i data-lucide="x" width="20"></i></button>
        </div>
        <div class="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            <form id="package-form">
                <input type="hidden" name="id" value="${p.id}">
                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1.5">Nama Paket</label>
                    <input type="text" name="name" value="${p.name}" class="w-full border-2 border-slate-100 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-bold" placeholder="Contoh: Paket Fisioterapi 10 Sesi">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-bold text-slate-500 uppercase block mb-1.5">Jumlah Sesi</label>
                        <input type="number" name="sessions" value="${p.sessions}" min="1" class="w-full border-2 border-slate-100 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center font-black text-blue-600 text-xl">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-slate-500 uppercase block mb-1.5">Harga Total (Rp)</label>
                        <input type="number" name="price" value="${p.price}" step="10000" class="w-full border-2 border-slate-100 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-right font-black text-slate-700 text-xl">
                    </div>
                </div>
                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1.5">Keterangan / Deskripsi</label>
                    <textarea name="description" class="w-full border-2 border-slate-100 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[80px]" placeholder="Catatan tambahan paket ini...">${p.description}</textarea>
                </div>
            </form>
        </div>
        <div class="bg-slate-50 px-6 py-4 border-t flex justify-end gap-3">
            <button onclick="closeModal()" class="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all text-sm">Batal</button>
            <button onclick="savePackage()" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm flex items-center gap-2">
                <i data-lucide="save" width="16"></i> Simpan Paket
            </button>
        </div>`;
    document.getElementById('modal-content').innerHTML = modalHtml;
    document.getElementById('modal-container').classList.remove('hidden');
    renderIcons();
}

async function savePackage() {
    updateSyncStatusUI('syncing', false); // [IMMEDIATE UI FEEDBACK]
    const form = document.getElementById('package-form');
    const id = form.querySelector('[name="id"]').value;
    const name = form.querySelector('[name="name"]').value.trim();
    const sessions = parseInt(form.querySelector('[name="sessions"]').value) || 0;
    const price = parseInt(form.querySelector('[name="price"]').value) || 0;
    const description = form.querySelector('[name="description"]').value.trim();

    if (!name || sessions <= 0 || price < 0) { alert('Mohon lengkapi data paket dengan benar!'); return; }

    const pkg = { id: id || 'PKG-' + Date.now(), name, sessions, price, description, updatedAt: getServerTimeISO(), _dirty: true };

    if (!state.packages) state.packages = [];

    if (id) {
        const idx = state.packages.findIndex(x => x.id === id);
        if (idx > -1) state.packages[idx] = pkg;
    } else {
        state.packages.push(pkg);
    }

    closeModal();
    await saveData();
    if (state.scriptUrl) syncDelta(false);
    renderConfigView(document.getElementById('main-content'));
    showToast("Paket layanan berhasil disimpan.");
}

async function deletePackage(id) {
    if (!confirm('Hapus paket layanan ini? Data paket yang sudah digunakan di pasien tetap aman.')) return;
    trackDelete(id);
    state.packages = (state.packages || []).filter(p => p.id !== id);
    if (!state.deletedIds.packages) state.deletedIds.packages = [];
    state.deletedIds.packages.push(id);

    await saveData();
    if (state.scriptUrl) syncDelta(false);
    const container = document.getElementById('package-list-container');
    if (container) {
        container.innerHTML = renderPackageTable();
        renderIcons();
    }
    showToast("Paket dihapus.");
}

function applyPackageToPatient(packageId) {
    const pkg = state.packages.find(p => p.id === packageId);
    if (!pkg) return;

    const quotaInput = document.querySelector('#patient-form [name="quota"]');
    const feeInput = document.querySelector('#patient-form [name="defaultFee"]');

    if (quotaInput) quotaInput.value = pkg.sessions;
    if (feeInput) feeInput.value = pkg.price / pkg.sessions;
}

/**
 * --- 15B. TREATMENT MANAGEMENT FUNCTIONS ---
 */
function renderTreatmentTable() {
    const list = state.treatments || [];
    if (list.length === 0) {
        return `<div class="p-12 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl mb-8">
                    <p class="font-medium mb-4">Belum ada daftar tindakan kustom.</p>
                    <button onclick="silentPullRefresh(true)" class="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center justify-center gap-2 mx-auto">
                        <i data-lucide="refresh-cw" width="16"></i> Tarik Ulang Data dari Sheet
                    </button>
                </div>`;
    }

    return `<table class="w-full text-sm mb-8">
        <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
                <th class="text-left px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Nama Tindakan</th>
                <th class="text-right px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Harga Satuan (Rp)</th>
                <th class="text-center px-6 py-3" style="width: 100px;">Aksi</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
            ${list.map(t => `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4 font-bold text-slate-800">${t.name}</td>
                    <td class="px-6 py-4 text-right font-black text-emerald-600">${formatRp(t.price)}</td>
                    <td class="px-6 py-4 text-center">
                        <div class="flex items-center justify-center gap-2">
                            <button onclick="openTreatmentModal('${t.id}')" class="text-blue-500 p-1.5 hover:bg-blue-50 rounded-lg"><i data-lucide="edit-3" width="14"></i></button>
                        </div>
                    </td>
                </tr>`).join('')}
        </tbody>
    </table>`;
}

function openTreatmentModal(id = null) {
    const t = id ? state.treatments.find(x => x.id === id) : { id: '', name: '', price: 0 };
    const modalHtml = `
        <div class="bg-white px-6 py-4 border-b flex justify-between items-center sticky top-0 z-20">
            <h3 class="text-xl font-bold text-slate-800">${id ? 'Edit Tindakan' : 'Tambah Tindakan Baru'}</h3>
            <button onclick="closeModal()" class="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"><i data-lucide="x" width="20"></i></button>
        </div>
        <div class="p-6 space-y-5">
            <form id="treatment-form">
                <input type="hidden" name="id" value="${t.id}">
                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1.5">Nama Tindakan/Alat</label>
                    <input type="text" name="name" value="${t.name}" class="w-full border-2 border-slate-100 p-3 rounded-xl outline-none font-bold placeholder-slate-300" placeholder="Contoh: Konsul, IR, TENS, SWD...">
                </div>
                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1.5">Harga Per Tindakan (Rp)</label>
                    <input type="number" name="price" value="${t.price}" class="w-full border-2 border-slate-100 p-3 rounded-xl outline-none font-black text-emerald-600 text-xl" placeholder="0">
                </div>
            </form>
        </div>
        <div class="bg-slate-50 px-6 py-4 border-t flex justify-end gap-3">
            <button onclick="closeModal()" class="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 text-sm transition-all">Batal</button>
            <button onclick="saveTreatment()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg transition-all text-sm flex items-center gap-2">
                <i data-lucide="save" width="16"></i> Simpan
            </button>
        </div>`;
    document.getElementById('modal-content').innerHTML = modalHtml;
    document.getElementById('modal-container').classList.remove('hidden');
    renderIcons();
}

async function saveTreatment() {
    updateSyncStatusUI('syncing', false); // [IMMEDIATE UI FEEDBACK]
    const form = document.getElementById('treatment-form');
    const id = form.querySelector('[name="id"]').value;
    const name = form.querySelector('[name="name"]').value.trim();
    const price = parseInt(form.querySelector('[name="price"]').value) || 0;

    if (!name) { alert('Nama tindakan harus diisi!'); return; }

    const item = { id: id || 'TND-' + Date.now(), name, price, updatedAt: getServerTimeISO(), _dirty: true };
    if (!state.treatments) state.treatments = [];

    if (id) {
        const idx = state.treatments.findIndex(x => x.id === id);
        if (idx > -1) state.treatments[idx] = item;
    } else {
        state.treatments.push(item);
    }

    closeModal();
    await saveData();
    if (state.scriptUrl) syncDelta(false);
    renderConfigView(document.getElementById('main-content'), 'treatments');
    showToast("Data tindakan berhasil disimpan.");
}

async function deleteTreatment(id) {
    if (!confirm('Hapus daftar tindakan ini?')) return;
    trackDelete(id);
    state.treatments = (state.treatments || []).filter(t => t.id !== id);
    if (!state.deletedIds.treatments) state.deletedIds.treatments = [];
    state.deletedIds.treatments.push(id);
    await saveData();
    if (state.scriptUrl) syncDelta(false);
    const container = document.getElementById('treatment-list-container');
    if (container) { container.innerHTML = renderTreatmentTable(); renderIcons(); }
    showToast("Tindakan dihapus.");
}

// --- 16. PROTOCOL / PHYSIO ASSISTANT FUNCTIONS ---


async function triggerFullSync() {
    if (!state.scriptUrl) {
        alert("Atur URL Script di menu Konfigurasi terlebih dahulu!");
        return;
    }
    if (!confirm("Apakah Anda ingin melakukan Sinkronisasi Penuh? \nSemua data lokal akan diperbarui paksa sesuai dengan isi Google Sheet. Ini berguna jika Anda baru saja menghapus baris secara manual di Sheet.")) {
        return;
    }

    const btn = document.getElementById('nav-sync');
    const oriText = btn ? btn.innerHTML : '';
    if (btn) btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin" width="20"></i> Syncing...';

    state._syncing = true;
    const sheetId = getSheetIdFromUrl(state.scriptUrl) || state.sheetId;

    try {
        const url = `${LICENSE_API_URL}?action=pull&sheet_id=${sheetId}&t=${Date.now()}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'error') {
            alert("Error: " + data.message);
            return;
        }

        if (data.patients && data.assessments) {
            state.patients = data.patients || [];
            state.assessments = sanitizeAssessments(data.assessments || []);
            state.appointments = data.appointments || [];
            state.expenses = data.expenses || [];
            state.packages = data.packages || [];
            state.treatments = data.treatments || [];


            state.deletedIds = { patients: [], assessments: [], appointments: [], expenses: [], packages: [], treatments: [] };

            await saveData();
            showToast('Sinkronisasi Penuh Berhasil! ✅', 'success');
            renderApp();
        }
    } finally {
        state._syncing = false;
        if (btn) btn.innerHTML = oriText;
        lucide.createIcons();
    }
}

// --- 25. ANALYTICS & REPORTS MODULE ---
async function renderAnalyticsView(container) {
    container.innerHTML = `
        <div class="space-y-6 fade-in pb-20 overflow-x-hidden">
            <!-- Header & Filter -->
            <div class="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div>
                    <h3 class="text-xl font-black text-slate-800 tracking-tight">Dashboard Analisis Klinis</h3>
                    <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Statistik Instan & Analisa Lanjutan</p>
                </div>
                
                <div class="flex flex-wrap items-center gap-2 no-print">
                    <div class="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                        <input type="date" id="analytic-from" onchange="refreshAnalytics()" class="bg-transparent text-[10px] font-bold text-slate-600 outline-none p-1" />
                        <span class="text-slate-300 text-xs">/</span>
                        <input type="date" id="analytic-to" onchange="refreshAnalytics()" class="bg-transparent text-[10px] font-bold text-slate-600 outline-none p-1" />
                    </div>
                    <div class="flex gap-2">
                        <button onclick="printAnalyticsReport()" class="bg-slate-800 text-white hover:bg-slate-900 px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md">
                            <i data-lucide="printer" width="14"></i> Cetak
                        </button>
                        <button onclick="backgroundAutoSync(); refreshAnalytics();" class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md">
                            <i data-lucide="refresh-cw" width="14"></i> Sync Server
                        </button>
                    </div>
                </div>
            </div>

            <div id="analytics-content">
                <div class="py-20 flex flex-col items-center justify-center text-slate-400">
                    <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p class="text-sm font-bold animate-pulse">Menghitung Persentase Data...</p>
                </div>
            </div>
        </div>
    `;
    renderIcons();

    // Initial Fetch
    await refreshAnalytics();
}

async function testConnectivity() {
    if (!LICENSE_API_URL) return showToast("Atur Script URL dulu!", "error");
    showToast("Mengirim Sinyal Tes...", "info");
    try {
        let baseUrl = LICENSE_API_URL; if (baseUrl.includes('?')) baseUrl = baseUrl.split('?')[0];
        const res = await fetch(`${baseUrl}?action=ping&t=${Date.now()}`);
        const data = await res.json();
        if (data.status === 'success') alert("✅ MANTAP! " + data.message);
        else alert("⚠️ RESPON ANEH: " + JSON.stringify(data));
    } catch (e) {
        alert("❌ SINYAL GAGAL: " + e.message + "\n\nSaran: Periksa izin Deploy GAS Anda (harus 'Anyone').");
    }
}

async function refreshAnalytics() {
    const content = document.getElementById('analytics-content');
    if (!content) return;

    // DATA POOLS (CLEAN & DEDUPLICATED)
    const rawPatients = state.patients || [];
    const rawAssessments = state.assessments || [];
    const rawAppts = state.appointments || [];
    const exps = state.expenses || [];

    // STYCT FILTER: Only real patients (Must have ID and a valid Name)
    const patients = Array.from(new Map(rawPatients.filter(p => {
        const n = String(p.name || '').trim().toUpperCase();
        return p.id && n && n !== 'TIDAK TERISI' && n !== '-' && n !== 'GHOST';
    }).map(p => [p.id, p])).values());

    const appts = Array.from(new Map(rawAppts.filter(a => a.id).map(a => [a.id, a])).values());
    const assessments = rawAssessments;

    if (patients.length === 0) {
        content.innerHTML = `<div class="py-20 text-center text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-3xl">Belum ada data pasien di memori. Silakan klik "Sync Server" dulu Pak.</div>`;
        return;
    }

    // RANGE PREPARATION...
    const fromVal = document.getElementById('analytic-from').value;
    const toVal = document.getElementById('analytic-to').value;
    const startTime = fromVal ? new Date(fromVal).getTime() : 0;
    const endObj = toVal ? new Date(toVal) : null;
    if (endObj) endObj.setHours(23, 59, 59);
    const endTime = endObj ? endObj.getTime() : Infinity;

    // AGGREGATORS
    let totalPatients = 0;
    let newPatients = 0;
    let oldPatientsStore = new Set();
    const genderStats = { L: 0, P: 0 };
    let totalAge = 0;
    let ageCount = 0;
    const ageGroupStats = { child: 0, teen: 0, adult: 0, elderly: 0 };
    const dxStats = {};
    const ivStats = {};
    const trendStats = {};
    const geoStats = {};
    const riskStats = {};
    const patientVisitCount = {};
    let totalIncome = 0;
    let totalExpense = 0;
    let totalVisits = 0;
    let totalBookings = 0;
    let arrivedVisits = 0;
    const hourStats = new Array(24).fill(0);

    // Helper: Find Region from Address
    const getRegion = (addr) => {
        const rawAddr = String(addr || '').trim().toUpperCase();
        if (!rawAddr || rawAddr === 'TIDAK TERISI') return 'LOKASI TIDAK DIISI';
        const parts = rawAddr.split(',').map(s => s.trim());
        let found = parts.find(p => p.includes('KEC') || p.includes('KAB') || p.includes('KOTA') || p.includes('KEL'));
        if (!found) found = parts[parts.length - 1];
        return found.replace(/KEC\.|KECAMATAN|KAB\.|KABUPATEN|KOTA|KEL\.|KELURAHAN/g, '').trim() || 'LAINNYA';
    };

    // --- PASS 1: ACTIVITY DISCOVERY (Find patients active in this period) ---
    const activePatientIds = new Set();
    assessments.forEach(a => {
        const aTime = new Date(a.date).getTime();
        if (aTime >= startTime && aTime <= endTime) activePatientIds.add(String(a.patientId));
    });
    appts.forEach(a => {
        const aTime = new Date(a.date).getTime();
        if (aTime >= startTime && aTime <= endTime) activePatientIds.add(String(a.patientId));
    });

    // --- PASS 2: FILTERED PATIENT INVENTORY (GEO, RISK, GENDER) ---
    patients.forEach(p => {
        const regTime = new Date(p.createdAt || p.updatedAt || Date.now()).getTime();
        const isNew = regTime >= startTime && regTime <= endTime;
        const wasSeen = activePatientIds.has(String(p.id));

        // Only count patients who were registered in this period OR had activity
        if (isNew || wasSeen) {
            totalPatients++;
            if (p.gender === 'L') genderStats.L++; else if (p.gender === 'P') genderStats.P++;
            if (p.dob) {
                const age = new Date().getFullYear() - new Date(p.dob).getFullYear();
                totalAge += age; ageCount++;

                if (age <= 11) ageGroupStats.child++;
                else if (age <= 18) ageGroupStats.teen++;
                else if (age <= 59) ageGroupStats.adult++;
                else ageGroupStats.elderly++;
            }

            // GEO
            const region = getRegion(p.address);
            geoStats[region] = (geoStats[region] || 0) + 1;

            // RED-FLAG
            if (p.tags) {
                const tgs = p.tags.split(',').map(s => s.trim().toUpperCase());
                tgs.forEach(t => { if (t && t !== '-') riskStats[t] = (riskStats[t] || 0) + 1; });
            }

            if (isNew) {
                newPatients++;
            } else {
                // If not new but seen, they are 'Old' patients for this period
                oldPatientsStore.add(p.id);
            }
        }
    });

    // --- PASS 3: ACTIVITY ANALYSIS (ASSESSMENTS & RETENTION) ---
    const uniquePatientsInPeriod = new Set();
    assessments.forEach(a => {
        const aTime = new Date(a.date).getTime();
        if (aTime < startTime || aTime > endTime) return;

        totalVisits++;
        uniquePatientsInPeriod.add(a.patientId);
        patientVisitCount[a.patientId] = (patientVisitCount[a.patientId] || 0) + 1;

        const dx = (a.diagnosis || 'Tanpa Diagnosa').trim().toUpperCase();
        if (dx && dx !== 'TANPA DIAGNOSA') dxStats[dx] = (dxStats[dx] || 0) + 1;

        const dStr = a.date.split('T')[0];
        trendStats[dStr] = (trendStats[dStr] || 0) + 1;

        // Note: oldPatientsStore calculation already handled in PASS 2

        let ivs = a.intervention || [];
        if (typeof ivs === 'string') ivs = ivs.split(',').map(s => s.trim());
        if (Array.isArray(ivs)) {
            ivs.forEach(v => {
                const name = v.trim().toUpperCase();
                if (name && name !== '-') ivStats[name] = (ivStats[name] || 0) + 1;
            });
        }
    });

    // --- PASS 3: APPOINTMENTS & FINANCIALS ---
    appts.forEach(a => {
        const aDate = new Date(a.date);
        const aTimeMs = aDate.getTime();
        if (aTimeMs < startTime || aTimeMs > endTime) return;

        totalBookings++;
        if (isPaidAppt(a)) arrivedVisits++;

        if (a.time) {
            const hr = parseInt(String(a.time).split(':')[0]);
            if (!isNaN(hr)) hourStats[hr]++;
        }

        const isPaid = (a.paymentStatus || '').toUpperCase() === 'PAID' || a.paidAt;
        if (isPaid) {
            const payTime = new Date(a.paidAt || a.date).getTime();
            if (payTime >= startTime && payTime <= endTime) totalIncome += Number(a.fee || 0);
        }
    });

    exps.forEach(e => {
        const eTime = new Date(e.date).getTime();
        if (eTime >= startTime && eTime <= endTime) totalExpense += Number(e.amount || 0);
    });

    // CALCULATIONS
    const topDx = Object.entries(dxStats).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topIv = Object.entries(ivStats).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topGeo = Object.entries(geoStats).sort((a, b) => b[1] - a[1]).slice(0, 5);

    let returningPatients = 0;
    Object.values(patientVisitCount).forEach(v => { if (v > 1) returningPatients++; });
    const retentionRate = uniquePatientsInPeriod.size > 0 ? ((returningPatients / uniquePatientsInPeriod.size) * 100).toFixed(1) : 0;

    const avgAge = ageCount > 0 ? (totalAge / ageCount).toFixed(0) : 0;
    const netProfit = totalIncome - totalExpense;
    const arpp = totalVisits > 0 ? (totalIncome / totalVisits) : 0;
    const conversionRate = totalBookings > 0 ? ((arrivedVisits / totalBookings) * 100).toFixed(1) : 0;

    content.innerHTML = `
        <!-- FINANCIAL KPI BOXES -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div class="bg-gradient-to-br from-indigo-600 to-blue-700 p-5 rounded-2xl shadow-lg shadow-blue-100 text-white border-b-4 border-indigo-800">
                <p class="text-[10px] font-black opacity-80 uppercase mb-1">Pendapatan Kotor</p>
                <h4 class="text-2xl font-black">${formatRp(totalIncome)}</h4>
                <p class="text-[9px] font-bold opacity-70 mt-1">Total Uang Masuk</p>
            </div>
            <div class="bg-gradient-to-br from-rose-500 to-rose-600 p-5 rounded-2xl shadow-lg shadow-rose-100 text-white border-b-4 border-rose-800">
                <p class="text-[10px] font-black opacity-80 uppercase mb-1">Total Pengeluaran</p>
                <h4 class="text-2xl font-black">${formatRp(totalExpense)}</h4>
                <p class="text-[9px] font-bold opacity-70 mt-1">Operational Cost</p>
            </div>
            <div class="bg-emerald-600 p-5 rounded-2xl shadow-lg text-white border-b-4 border-emerald-800 relative overflow-hidden group">
                <p class="text-[10px] font-black opacity-80 uppercase mb-1 text-center">Profit Bersih (Net)</p>
                <h4 class="text-2xl font-black text-center">${formatRp(netProfit)}</h4>
                <div class="mt-2 text-center text-[9px] font-black bg-white/20 py-1 rounded-full">
                    ${netProfit >= 0 ? '📈 SURPLUS' : '⚠️ DEFISIT'}
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm border-b-4 border-slate-200">
                <p class="text-[10px] font-black text-slate-400 uppercase mb-1 text-center">Retention Rate</p>
                <h4 class="text-2xl font-black text-indigo-600 text-center">${retentionRate}%</h4>
                <p class="text-[9px] font-bold text-slate-300 mt-1 text-center">LOYALTY SCORE</p>
            </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Populasi Pasien</p>
                <h4 class="text-3xl font-black text-slate-800">${totalPatients} <span class="text-xs font-bold text-slate-300">JIWA</span></h4>
                <div class="mt-2 flex gap-2 text-[9px] font-bold">
                    <span class="text-indigo-500">🆕 ${newPatients} Baru</span>
                    <span class="text-emerald-500">⭐ ${oldPatientsStore.size} Lama</span>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p class="text-[10px] font-black text-indigo-400 uppercase mb-1">Visit Rate</p>
                <h4 class="text-3xl font-black text-indigo-600">${totalVisits} <span class="text-xs font-bold text-indigo-300">VISIT</span></h4>
            </div>
            <div class="bg-slate-800 p-5 rounded-2xl shadow-lg text-white">
                <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Conversion Rate</p>
                <h4 class="text-3xl font-black text-emerald-400">${conversionRate}%</h4>
                <p class="text-[9px] font-bold opacity-60 mt-1 uppercase">Booking -> Arrival</p>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p class="text-[10px] font-black text-slate-400 uppercase mb-1">ARPP (Avg/Visit)</p>
                <h4 class="text-2xl font-black text-slate-700">${formatRp(arpp)}</h4>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-3">📈 Tren Kunjungan Harian</h4>
                <div style="height: 250px; position: relative;"><canvas id="chart-trend"></canvas></div>
            </div>
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-3">🕰️ Jam Sibuk Klinik (Busy Hours)</h4>
                <div style="height: 250px; position: relative;"><canvas id="chart-hour"></canvas></div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-10">
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
                <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-3 w-full text-center text-[9px]">GENDER</h4>
                <div class="w-full max-w-[140px]"><canvas id="chart-gender"></canvas></div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
                <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-3 w-full text-center text-[9px]">PROPORSI USIA</h4>
                <div class="w-full max-w-[140px]"><canvas id="chart-age"></canvas></div>
            </div>
            
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-3 w-full text-center text-[9px]">📍 Top 5 Wilayah</h4>
                <div class="flex-1 overflow-auto">
                    <table class="w-full text-left text-[11px] font-bold">
                        ${topGeo.map(([reg, c]) => `<tr><td class="py-2 text-slate-600 uppercase text-[9px]">${reg}</td><td class="py-2 text-right text-indigo-600">${c} Jiwa</td></tr>`).join('') || '<tr><td class="py-10 text-center text-slate-300 italic">No Location</td></tr>'}
                    </table>
                </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-3 w-full text-center text-[9px]">🏆 Top 5 Diagnosa</h4>
                <div class="flex-1 overflow-auto">
                    <table class="w-full text-left text-[11px] font-bold">
                        ${topDx.map(([dx, c]) => `<tr><td class="py-2 text-slate-600 uppercase text-[9px]">${dx}</td><td class="py-2 text-right text-emerald-600">${c} Vis</td></tr>`).join('') || '<tr><td class="py-10 text-center text-slate-300 italic">No Data</td></tr>'}
                    </table>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <h4 class="text-xs font-black text-rose-500 uppercase tracking-widest mb-6 border-b pb-3 w-full text-center text-[9px] flex items-center justify-center gap-2">
                    <i data-lucide="alert-triangle" width="10"></i> Peringatan Risiko (Red-Flag)
                </h4>
                <div class="flex-1 overflow-auto">
                    <table class="w-full text-left text-[11px] font-bold">
                        ${Object.entries(riskStats).sort((a, b) => b[1] - a[1]).map(([t, c]) => `<tr><td class="py-2 text-rose-600 uppercase text-[9px]">${t}</td><td class="py-2 text-right text-rose-800">${c} Jiwa</td></tr>`).join('') || '<tr><td class="py-10 text-center text-slate-300 italic uppercase text-[8px]">Semua Aman ✅</td></tr>'}
                    </table>
                    <p class="text-[8px] text-slate-400 mt-4 leading-tight">*Data akumulasi Tag Pasien yang aktif pada periode ini (Kebutuhan APD / Safety).</p>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-3 w-full text-center text-[9px]">⚡ Top 5 Intervensi</h4>
                <div class="flex-1 overflow-auto">
                    <table class="w-full text-left text-[11px] font-bold">
                        ${topIv.map(([iv, c]) => `<tr><td class="py-2 text-slate-600 uppercase text-[9px]">${iv}</td><td class="py-2 text-right text-indigo-600">${c} Ses</td></tr>`).join('') || '<tr><td class="py-10 text-center text-slate-300 italic">No Data</td></tr>'}
                    </table>
                </div>
            </div>
        </div>
    `;

    initDemographicCharts({ gender: genderStats, age: ageGroupStats, trend: trendStats, hours: hourStats });
    renderIcons();

    // Save analytics data snapshot for printing
    window._lastAnalyticsData = {
        totalIncome, totalExpense, netProfit,
        retentionRate, totalPatients, newPatients,
        conversionRate, arpp, totalVisits,
        genderL: genderStats.L, genderP: genderStats.P,
        ageGroup: ageGroupStats,
        dxStats, ivStats, geoStats, riskStats,
        topDx, topIv, topGeo,
        period: (fromVal && toVal) ? `${fromVal} s/d ${toVal}` : 'SEMUA WAKTU',
        generatedAt: new Date()
    };

    // BACKGROUND SYNC (Non-blocking)
    (async () => {
        try {
            let baseUrl = LICENSE_API_URL; if (baseUrl.includes('?')) baseUrl = baseUrl.split('?')[0];
            fetch(`${baseUrl}?action=get_analytics_demographic&sheet_id=${state.sheetId}&from=${fromVal}&to=${toVal}&t=${Date.now()}`);
        } catch (e) { }
    })();
}

function initDemographicCharts(data) {
    const ctxGender = document.getElementById('chart-gender').getContext('2d');
    const chartTrendEl = document.getElementById('chart-trend');
    const chartHourEl = document.getElementById('chart-hour');
    const chartAgeEl = document.getElementById('chart-age');

    // Hancurkan Chart lama (Hemat Memori)
    if (window._chartGender) window._chartGender.destroy();
    if (window._chartAge) window._chartAge.destroy();
    if (window._chartTrend) window._chartTrend.destroy();
    if (window._chartHour) window._chartHour.destroy();

    // 1. CHART GENDER (Donut)
    window._chartGender = new Chart(ctxGender, {
        type: 'doughnut',
        data: {
            labels: ['L', 'P'],
            datasets: [{
                data: [data.gender.L || 0, data.gender.P || 0],
                backgroundColor: ['#6366f1', '#ec4899'],
                borderWidth: 4,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { weight: 'bold', size: 9 },
                        padding: 10,
                        boxWidth: 10,
                        usePointStyle: true
                    }
                }
            },
            cutout: '70%'
        }
    });

    // 2. CHART AGE (Donut)
    if (chartAgeEl) {
        window._chartAge = new Chart(chartAgeEl.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Anak', 'Remaja', 'Dewasa', 'Lansia'],
                datasets: [{
                    data: [data.age.child || 0, data.age.teen || 0, data.age.adult || 0, data.age.elderly || 0],
                    backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#ef4444'],
                    borderWidth: 4,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 9, weight: 'bold' },
                            padding: 10,
                            boxWidth: 10,
                            usePointStyle: true
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }

    // 3. CHART TREN (LINE)
    if (chartTrendEl) {
        const trendLabels = Object.keys(data.trend).sort();
        const trendValues = trendLabels.map(l => data.trend[l]);

        window._chartTrend = new Chart(chartTrendEl.getContext('2d'), {
            type: 'line',
            data: {
                labels: trendLabels.map(d => d.split('-').slice(1).reverse().join('/')),
                datasets: [{
                    label: 'Visits',
                    data: trendValues,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 9 } } },
                    x: { grid: { display: false }, ticks: { font: { size: 9 } } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    // 4. CHART BUSY HOURS (BAR)
    if (chartHourEl) {
        window._chartHour = new Chart(chartHourEl.getContext('2d'), {
            type: 'bar',
            data: {
                labels: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
                datasets: [{
                    label: 'Kedatangan',
                    data: data.hours,
                    backgroundColor: '#10b981',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 9 } } },
                    x: { ticks: { font: { size: 8 }, maxRotation: 45, minRotation: 45 } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
}

/**
 * GENERATE HIGH-RES CHART FOR PRINTING
 * Renders a chart to a hidden canvas with large fonts for readable A4 reports.
 */
function generatePrintChart(type, data, labels, colors) {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Create temporary chart instance
    const chart = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: false,
            animation: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 24, weight: '900' },
                        padding: 30,
                        usePointStyle: true,
                        boxWidth: 15
                    }
                }
            },
            cutout: '65%'
        }
    });

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    chart.destroy();
    return dataUrl;
}

function printAnalyticsReport() {
    const appLayout = document.getElementById('app-layout');
    const printContainer = document.getElementById('print-container');

    // AUTO-PREPARE DATA IF MISSING
    if (!window._lastAnalyticsData) {
        showToast('Menyiapkan laporan...', 'info');
        // If data is missing, we try to trigger refresh once
        const dashboardBtn = document.querySelector('[onclick*="switchTab(\'analytics\')"]');
        if (dashboardBtn) {
            dashboardBtn.click();
            setTimeout(printAnalyticsReport, 1500);
            return;
        }
        showToast('Gagal menyiapkan data. Buka Dashboard > Analisis Klinis dulu.', 'error');
        return;
    }

    const d = window._lastAnalyticsData;

    // GENERATE HIGH-RES IMAGES FOR PRINT ONLY
    const printGenderImg = generatePrintChart('doughnut',
        [d.genderL, d.genderP],
        ['L', 'P'],
        ['#6366f1', '#ec4899']
    );

    const printAgeImg = generatePrintChart('doughnut',
        [d.ageGroup.child, d.ageGroup.teen, d.ageGroup.adult, d.ageGroup.elderly],
        ['Anak (0-11)', 'Remaja (12-18)', 'Dewasa (19-55)', 'Lansia (60+)'],
        ['#10b981', '#6366f1', '#f59e0b', '#ef4444']
    );

    const trendCanvas = document.getElementById('chart-trend');
    const hourCanvas = document.getElementById('chart-hour');
    const hasCharts = trendCanvas && hourCanvas;
    const trendImg = hasCharts ? trendCanvas.toDataURL('image/png', 1.0) : '';
    const hourImg = hasCharts ? hourCanvas.toDataURL('image/png', 1.0) : '';

    const formatRp = (num) => 'Rp ' + Math.round(num || 0).toLocaleString('id-ID');
    const totalAssessments = Object.values(d.dxStats || {}).reduce((s, v) => s + v, 0) || 1;

    const makeTopTable = (entries) => {
        if (!entries || entries.length === 0) return '<tr><td style="padding:12px; color:#94a3b8; text-align:center; font-size:10px;">Belum Ada Data</td></tr>';
        return entries.map(([label, val]) => {
            const perc = ((val / totalAssessments) * 100).toFixed(1);
            return `<tr style="border-bottom:1px solid #f1f5f9;">
                <td style="font-size:10px; font-weight:700; color:#334155; padding:6px 2px; width:55%; text-transform:uppercase;">${label}</td>
                <td style="font-size:11px; font-weight:800; color:#1d4ed8; text-align:center; width:20%;">${val}</td>
                <td style="font-size:10px; font-weight:800; text-align:right; width:25%;"><span style="background:#eff6ff; color:#1d4ed8; padding:2px 6px; border-radius:6px; border:1px solid #dbeafe;">${perc}%</span></td>
            </tr>`;
        }).join('');
    };

    const makeSimpleTable = (entries, colorHex) => {
        if (!entries || entries.length === 0) return '<tr><td style="padding:12px; color:#94a3b8; text-align:center; font-size:10px;">Belum Ada Data</td></tr>';
        return entries.map(([label, val]) =>
            `<tr style="border-bottom:1px solid #f1f5f9;">
                <td style="font-size:10px; font-weight:700; color:#334155; padding:6px 2px; text-transform:uppercase;">${label}</td>
                <td style="font-size:11px; font-weight:900; color:${colorHex}; text-align:right; padding:6px 2px;">${val}</td>
            </tr>`
        ).join('');
    };

    const riskEntries = Object.entries(d.riskStats || {}).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const profitStatus = d.netProfit >= 0 ? '📈 SURPLUS' : '⚠️ DEFISIT';

    printContainer.innerHTML = `
        <style>
            @page { size: A4 portrait; margin: 0; }
            @media print {
                body { margin: 0; padding: 0; }
                .printable-report { margin: 0; border: none; height: 100vh; overflow:hidden; }
            }
        </style>
        <div class="printable-report" style="background:#fff; color:#1e293b; padding:0.6cm 1.0cm; width:21cm; height:29.6cm; font-family: 'Inter', sans-serif; position:relative; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
            <!-- HEADER -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #0f172a; padding-bottom:10px; margin-bottom:15px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    ${state.clinicInfo?.logoUrl ? `<img src="${state.clinicInfo.logoUrl}" style="max-height:55px; max-width:55px; object-fit:contain;" />` : ''}
                    <div>
                        <h1 style="margin:0; font-size:22px; font-weight:900; letter-spacing:-1px; color:#0f172a;">${state.clinicInfo.name || 'FISIOTA CLINIC'}</h1>
                        <p style="margin:1px 0 0; font-size:10px; font-weight:800; color:#2563eb; text-transform:uppercase; letter-spacing:1px;">Strategic Health Analytics Report</p>
                    </div>
                </div>
                <div style="text-align:right">
                    <h2 style="margin:0; font-size:11px; font-weight:900; color:#1e293b; text-transform:uppercase;">OFFICIAL REPORT</h2>
                    <p style="margin:2px 0 0; font-size:9px; font-weight:700; color:#64748b;">Periode: ${d.period}</p>
                </div>
            </div>

            <!-- KPI ROW 1 -->
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; margin-bottom:12px;">
                <div style="border:1.2px solid #e2e8f0; border-radius:10px; padding:8px; text-align:center; background:#f8fafc;">
                    <p style="margin:0 0 2px; font-size:8px; font-weight:900; color:#64748b; text-transform:uppercase;">Gross Income</p>
                    <p style="margin:0; font-size:13px; font-weight:900; color:#1d4ed8;">${formatRp(d.totalIncome)}</p>
                </div>
                <div style="border:1.2px solid #e2e8f0; border-radius:10px; padding:8px; text-align:center;">
                    <p style="margin:0 0 2px; font-size:8px; font-weight:900; color:#64748b; text-transform:uppercase;">Total Expense</p>
                    <p style="margin:0; font-size:13px; font-weight:900; color:#dc2626;">${formatRp(d.totalExpense)}</p>
                </div>
                <div style="border:1.2px solid #e2e8f0; border-radius:10px; padding:8px; text-align:center; background:#f0fdf4;">
                    <p style="margin:0 0 2px; font-size:8px; font-weight:900; color:#64748b; text-transform:uppercase;">Net Profit</p>
                    <p style="margin:0; font-size:13px; font-weight:900; color:#059669;">${formatRp(d.netProfit)}</p>
                </div>
                <div style="border:1.2px solid #e2e8f0; border-radius:10px; padding:8px; text-align:center;">
                    <p style="margin:0 0 2px; font-size:8px; font-weight:900; color:#64748b; text-transform:uppercase;">Retention</p>
                    <p style="margin:0; font-size:13px; font-weight:900; color:#7c3aed;">${d.retentionRate}%</p>
                </div>
            </div>

            <!-- KPI ROW 2 -->
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; margin-bottom:15px;">
                <div style="border:1.2px solid #e2e8f0; border-radius:10px; padding:7px; text-align:center;">
                    <p style="margin:0 0 1px; font-size:8px; font-weight:900; color:#64748b; text-transform:uppercase;">Patients</p>
                    <p style="margin:0; font-size:15px; font-weight:900; color:#0f172a;">${d.totalPatients}</p>
                    <small style="font-size:7px; color:#94a3b8;">🆕 ${d.newPatients} Baru</small>
                </div>
                <div style="border:1.2px solid #e2e8f0; border-radius:10px; padding:7px; text-align:center;">
                    <p style="margin:0 0 1px; font-size:8px; font-weight:900; color:#64748b; text-transform:uppercase;">Visits</p>
                    <p style="margin:0; font-size:15px; font-weight:900; color:#2563eb;">${d.totalVisits}</p>
                    <small style="font-size:7px; color:#94a3b8;">Kunjungan</small>
                </div>
                <div style="border:1.2px solid #e2e8f0; border-radius:10px; padding:7px; text-align:center;">
                    <p style="margin:0 0 1px; font-size:8px; font-weight:900; color:#64748b; text-transform:uppercase;">Conversion</p>
                    <p style="margin:0; font-size:15px; font-weight:900; color:#059669;">${d.conversionRate}%</p>
                    <small style="font-size:7px; color:#94a3b8;">Success Rate</small>
                </div>
                <div style="border:1.2px solid #e2e8f0; border-radius:10px; padding:7px; text-align:center;">
                    <p style="margin:0 0 1px; font-size:8px; font-weight:900; color:#64748b; text-transform:uppercase;">ARPP</p>
                    <p style="margin:0; font-size:13px; font-weight:900; color:#0f172a;">${formatRp(d.arpp)}</p>
                    <small style="font-size:7px; color:#94a3b8;">Avg/Visit</small>
                </div>
            </div>

            <!-- CHARTS ROW 1 -->
            ${hasCharts ? `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:12px;">
                <div style="border:1px solid #e2e8f0; border-radius:10px; padding:8px;">
                    <p style="margin:0 0 6px; font-size:9px; font-weight:950; text-transform:uppercase; color:#1e3a8a;">📈 Tren Kunjungan</p>
                    <img src="${trendImg}" style="width:100%; height:120px; object-fit:contain;" />
                </div>
                <div style="border:1px solid #e2e8f0; border-radius:10px; padding:8px;">
                    <p style="margin:0 0 6px; font-size:9px; font-weight:950; text-transform:uppercase; color:#1e3a8a;">🕰️ Jam Sibuk</p>
                    <img src="${hourImg}" style="width:100%; height:120px; object-fit:contain;" />
                </div>
            </div>
            
            <!-- CHARTS ROW 2 (DEMOGRAPHIC) -->
            <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:10px; margin-bottom:12px;">
                <div style="border:1.2px solid #e2e8f0; border-radius:10px; padding:8px; display:flex; flex-direction:column; align-items:center;">
                    <p style="margin:0 0 6px; font-size:9px; font-weight:950; text-transform:uppercase; color:#1e3a8a; width:100%; text-align:left;">📊 Rasio Gender</p>
                    <img src="${printGenderImg}" style="height:120px; width:120px; object-fit:contain;" />
                    <div style="font-size:14px; font-weight:900; display:flex; gap:20px; margin-top:6px;">
                        <span style="color:#6366f1;">♂ L: ${d.genderL}</span>
                        <span style="color:#ec4899;">♀ P: ${d.genderP}</span>
                    </div>
                </div>
                <div style="border:1.2px solid #e2e8f0; border-radius:10px; padding:8px; display:flex; flex-direction:column; align-items:center; background:#f8fafc;">
                    <p style="margin:0 0 6px; font-size:9px; font-weight:950; text-transform:uppercase; color:#1e3a8a; width:100%; text-align:left;">🎂 Proporsi Usia</p>
                    <div style="display:flex; align-items:center; gap:10px; width:100%;">
                        <img src="${printAgeImg}" style="height:120px; width:120px; object-fit:contain;" />
                        <div style="font-size:9px; font-weight:800; color:#475569; display:flex; flex-direction:column; gap:4px;">
                            <div style="display:flex; align-items:center; gap:5px;">
                                <div style="width:10px; height:10px; background:#10b981; border-radius:2px;"></div>
                                <span>Anak: <b>${d.ageGroup.child}</b></span>
                            </div>
                            <div style="display:flex; align-items:center; gap:5px;">
                                <div style="width:10px; height:10px; background:#6366f1; border-radius:2px;"></div>
                                <span>Remaja: <b>${d.ageGroup.teen}</b></span>
                            </div>
                            <div style="display:flex; align-items:center; gap:5px;">
                                <div style="width:10px; height:10px; background:#f59e0b; border-radius:2px;"></div>
                                <span>Dewasa: <b>${d.ageGroup.adult}</b></span>
                            </div>
                            <div style="display:flex; align-items:center; gap:5px;">
                                <div style="width:10px; height:10px; background:#ef4444; border-radius:2px;"></div>
                                <span>Lansia: <b>${d.ageGroup.elderly}</b></span>
                            </div>
                        </div>
                    </div>
                    <p style="font-size:10px; font-weight:900; color:#1e293b; margin-top:4px; text-transform:uppercase; letter-spacing:0.5px;">Standar Kemenkes RI</p>
                </div>
            </div>` : ''}

            <!-- DATA TABLES -->
            <div style="display:grid; grid-template-columns: 1.1fr 1fr 1fr; gap:10px; margin-bottom:12px;">
                <div style="border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; background:#fff;">
                    <div style="background:#f1f5f9; padding:6px; border-bottom:1px solid #e2e8f0;"><p style="margin:0; font-size:8px; font-weight:900; color:#1e40af; text-transform:uppercase;">🏆 Top Diagnosa</p></div>
                    <div style="padding:4px 6px;"><table style="width:100%; border-collapse:collapse;">${makeTopTable(d.topDx)}</table></div>
                </div>
                <div style="border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; background:#fff;">
                    <div style="background:#f1f5f9; padding:6px; border-bottom:1px solid #e2e8f0;"><p style="margin:0; font-size:8px; font-weight:900; color:#059669; text-transform:uppercase;">⚡ Intervensi</p></div>
                    <div style="padding:4px 6px;"><table style="width:100%; border-collapse:collapse;">${makeSimpleTable(d.topIv, '#059669')}</table></div>
                </div>
                <div style="border:1.2px solid #fee2e2; border-radius:10px; overflow:hidden; background:#fff;">
                    <div style="background:#fef2f2; padding:6px; border-bottom:1.2px solid #fee2e2;"><p style="margin:0; font-size:8px; font-weight:900; color:#dc2626; text-transform:uppercase;">🚨 Red-Flag</p></div>
                    <div style="padding:4px 6px;"><table style="width:100%; border-collapse:collapse;">${makeSimpleTable(riskEntries, '#dc2626')}</table></div>
                </div>
            </div>

            <!-- GEOGRAPHIC -->
            <div style="border:1px solid #e2e8f0; border-radius:10px; overflow:hidden;">
                <div style="background:#f1f5f9; padding:6px 12px; border-bottom:1px solid #e2e8f0;"><p style="margin:0; font-size:8px; font-weight:900; color:#1e40af; text-transform:uppercase;">📍 Distribusi Wilayah</p></div>
                <div style="padding:6px 12px; display:grid; grid-template-columns: repeat(5, 1fr); gap:6px;">
                    ${d.topGeo.map(([r, c]) => `<div style="text-align:center; border:1px solid #f1f5f9; border-radius:6px; padding:4px;"><p style="margin:0; font-size:7px; font-weight:700; color:#64748b; text-transform:uppercase;">${r}</p><p style="margin:1px 0 0; font-size:11px; font-weight:900; color:#1d4ed8;">${c}</p></div>`).join('') || '<p style="color:#94a3b8; font-size:9px;">No data</p>'}
                </div>
            </div>
            </div>

            <!-- FOOTER -->
            <div style="padding:8px 0; border-top:1.2px solid #f1f5f9; display:flex; justify-content:space-between; font-size:8px; color:#94a3b8; font-weight:700;">
                <p style="margin:0;">OFFICIAL CLINIC ANALYTICS • FISIOTA ERM ENGINE</p>
                <p style="margin:0;">GENERATED: ${d.generatedAt.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
            </div>
        </div>
    `;

    // EXECUTE
    const originalDisplay = appLayout.style.display || 'flex';
    appLayout.style.display = 'none';
    printContainer.classList.remove('hidden');
    printContainer.style.display = 'block';

    setTimeout(() => {
        window.print();
        setTimeout(() => {
            appLayout.style.display = originalDisplay;
            printContainer.classList.add('hidden');
            printContainer.style.display = 'none';
            renderIcons();
        }, 500);
    }, 800);
}

/**
 * [IDE 4] SMART ANAMNESIS TO ICF MAPPING
 * Kamus kata kunci untuk mendeteksi potensi kode ICF dari teks anamnesis
 */
const ANAMNESIS_KEYWORD_MAP = {
    // Body Functions (b)
    'nyeri': { code: 'b280', name: 'Sensation of pain', cat: 'b' },
    'sakit': { code: 'b280', name: 'Sensation of pain', cat: 'b' },
    'kaku': { code: 'b710', name: 'Mobility of joint functions', cat: 'b' },
    'lemas': { code: 'b730', name: 'Muscle power functions', cat: 'b' },
    'lemah': { code: 'b730', name: 'Muscle power functions', cat: 'b' },
    'kesemutan': { code: 'b265', name: 'Touch functions (Tingling)', cat: 'b' },
    'baal': { code: 'b265', name: 'Touch functions (Numbness)', cat: 'b' },
    'pusing': { code: 'b240', name: 'Sensations associated with hearing/vestibular', cat: 'b' },
    'sesak': { code: 'b440', name: 'Respiration functions', cat: 'b' },
    'bengkak': { code: 'b410', name: 'Heart functions (Edema)', cat: 'b' },

    // Activities (d)
    'jalan': { code: 'd450', name: 'Walking', cat: 'd_act' },
    'tangga': { code: 'd455', name: 'Moving around (Stairs)', cat: 'd_act' },
    'tidur': { code: 'b134', name: 'Sleep functions', cat: 'b' },
    'baju': { code: 'd540', name: 'Dressing', cat: 'd_act' },
    'makan': { code: 'd550', name: 'Eating', cat: 'd_act' },
    'mandi': { code: 'd510', name: 'Washing oneself', cat: 'd_act' },
    'kerja': { code: 'd850', name: 'Remunerative employment', cat: 'd_part' }
};

const handleAnamnesisTyping = debounce((text) => {
    const container = document.getElementById('anamnesis-suggestions');
    if (!container) return;

    const words = text.toLowerCase().split(/[\s,.]+/);
    const foundCodes = new Set();
    const suggestions = [];

    words.forEach(word => {
        if (ANAMNESIS_KEYWORD_MAP[word]) {
            const item = ANAMNESIS_KEYWORD_MAP[word];
            if (!foundCodes.has(item.code)) {
                foundCodes.add(item.code);
                suggestions.push(item);
            }
        }
    });

    if (suggestions.length > 0) {
        container.innerHTML = `
            <div class="w-full text-indigo-500 text-[9px] font-black uppercase tracking-widest mb-1 animate-pulse">💡 Ditemukan Kata Kunci ICF:</div>
            ${suggestions.map(s => `
                <button onclick="addICFFromSuggestion('${s.cat}', '${s.code}', '${s.name.replace(/'/g, "\\'")}')" 
                    class="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-1.5">
                    <i data-lucide="plus-circle" width="12"></i> ${s.code} - ${s.name}
                </button>
            `).join('')}
        `;
        lucide.createIcons();
    } else {
        container.innerHTML = '';
    }
}, 500);

function getICFCategory(code) {
    if (!code) return 'b';
    const c = code.toLowerCase();
    if (c.startsWith('b')) return 'b';
    if (c.startsWith('s')) return 's';
    if (c.startsWith('d')) {
        // d1-d6: Activity, d7-d9: Participation
        const ch = parseInt(c.substring(1, 2));
        return (ch >= 7) ? 'd_part' : 'd_act';
    }
    return 'b';
}

function addICFFromSuggestion(key, code, name) {
    const fullText = `${code} (${name}) .2`; // Default qualifier 2
    // If key is just 'd', resolve to d_act/d_part automatically
    let targetKey = key;
    if (targetKey === 'd') targetKey = getICFCategory(code);

    const input = document.getElementById(`form-${targetKey}`);

    if (!input) {
        // Jika input tidak ada (masih di step 1), simpan ke tempFormData
        const currentVal = window.tempFormData[targetKey] || "";
        let lines = [];
        if (typeof currentVal === 'string') {
            lines = currentVal.split('\n').filter(l => l.trim() !== '');
        } else if (Array.isArray(currentVal)) {
            lines = currentVal;
        }

        if (!lines.some(l => l.includes(code))) {
            lines.push(fullText);
            window.tempFormData[targetKey] = Array.isArray(currentVal) ? lines : lines.join('\n');
            showToast(`Kode ${code} ditambahkan ke antrian ${targetKey.toUpperCase()}`, 'success');
        } else {
            showToast(`Kode ${code} sudah ada.`, 'warning');
        }
        return;
    }

    let currentLines = input.value.split('\n').filter(l => l.trim() !== '');
    if (!currentLines.some(l => l.includes(code))) {
        currentLines.push(fullText);
        const newVal = currentLines.join('\n');
        updateForm(targetKey, newVal);
        input.value = newVal;
        showToast(`Kode ${code} ditambahkan ke ${targetKey.toUpperCase()}!`, 'success');

        // Highlight textarea
        input.classList.add('ring-2', 'ring-indigo-400', 'ring-offset-2');
        setTimeout(() => input.classList.remove('ring-2', 'ring-indigo-400', 'ring-offset-2'), 1500);
    } else {
        showToast(`Kode ${code} sudah ada di daftar.`, 'warning');
    }
}

/**
 * [IDE BARU] RENDER SPECIAL TESTS LIST
 * Fungsi untuk menampilkan daftar tes spesifik berdasarkan region
 */
function renderSpecialTestsList(data) {
    const diag = (data.diagnosis || '').toLowerCase();
    const regionFilter = getRegionFromDiag(diag);

    // Default region jika tidak ditemukan
    let targetRegion = 'Cervical'; // Default ke Cervical jika regio tak terdeteksi
    if (regionFilter) targetRegion = regionFilter;

    const tests = SPECIAL_TESTS_DB[targetRegion] || [];
    if (tests.length === 0) {
        return `<p class="text-[10px] text-slate-400 italic">Pilih diagnosa regio Cervical/Thoracal untuk memuat daftar tes otomatis.</p>`;
    }

    const currentResults = data.special_tests || {};

    const listHtml = tests.map(test => {
        const result = currentResults[test.id] || 'N/A'; // N/A, (-), (+)

        // Warna status untuk indikator di pinggir kartu
        let statusColor = 'bg-slate-200';
        if (result === '(+)') statusColor = 'bg-rose-500';
        if (result === '(-)') statusColor = 'bg-emerald-500';

        return `
            <div class="group relative bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <!-- Status Sidebar Indicator -->
                <div class="absolute left-0 top-0 bottom-0 w-1.5 ${statusColor} transition-colors"></div>
                
                <div class="mb-4">
                    <div class="flex items-center gap-2 mb-1.5">
                        <span class="p-1 px-1.5 bg-slate-100 rounded-md text-[8px] font-black text-slate-400 uppercase tracking-tighter">${test.id}</span>
                        <h4 class="text-[11px] font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors uppercase">${test.name}</h4>
                    </div>
                    <p class="text-[10px] text-slate-400 leading-relaxed line-clamp-2 italic">${test.description}</p>
                </div>

                <div class="flex items-center justify-between border-t border-slate-50 pt-3">
                    <div class="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Status:</div>
                    <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                        ${['N/A', '(-)', '(+)'].map(val => {
            const isActive = (result === val);
            let activeClass = 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200';
            if (isActive && val === '(+)') activeClass = 'bg-rose-600 text-white shadow-lg shadow-rose-200';
            if (isActive && val === '(-)') activeClass = 'bg-emerald-600 text-white shadow-lg shadow-emerald-200';

            return `<button onclick="toggleSpecialTestValue('${test.id}', '${val}', '${targetRegion}')" 
                                    class="text-[10px] px-3 py-1 rounded-lg font-black transition-all ${isActive ? activeClass : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/50'}">${val}</button>`;
        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const noteArea = `
        <div class="mt-6 p-5 bg-indigo-50/50 rounded-2xl border-2 border-dashed border-indigo-100 group transition-all hover:border-indigo-300">
            <div class="flex items-center gap-2 mb-3">
                <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <i data-lucide="edit-3" width="14"></i>
                </div>
                <label class="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Manual Results / Additional Notes</label>
            </div>
            <textarea onchange="updateForm('special_tests_note', this.value)" 
                      class="w-full text-sm border-2 border-indigo-50 rounded-xl px-4 py-3 outline-none focus:border-indigo-400 bg-white/80 min-h-[100px] transition-all placeholder:italic placeholder:text-slate-300 text-slate-600" 
                      placeholder="Masukkan hasil tes manual di sini jika tidak tersedia pada opsi di atas...">${data.special_tests_note || ''}</textarea>
        </div>
    `;

    return `<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">${listHtml}</div> ${noteArea}`;
}

function getRegionFromDiag(diag) {
    if (diag.includes('cervical') || diag.includes('leher') || diag.includes('neck') || diag.includes('crs')) return 'Cervical';
    if (diag.includes('thoracal') || diag.includes('scoliosis') || diag.includes('skoliosis') || diag.includes('rusuk') || diag.includes('rib')) return 'Thoracal';
    if (diag.includes('lumbal') || diag.includes('pinggang') || diag.includes('low back') || diag.includes('lbp') || diag.includes('hnp') || diag.includes('sij') || diag.includes('sacro') || diag.includes('stenosis')) return 'Lumbal';
    if (diag.includes('shoulder') || diag.includes('bahu') || diag.includes('acromio') || diag.includes('rotator cuff')) return 'Shoulder';
    if (diag.includes('elbow') || diag.includes('siku') || diag.includes('epicondylitis')) return 'Elbow';
    if (diag.includes('wrist') || diag.includes('hand') || diag.includes('tangan') || diag.includes('cts') || diag.includes('finger') || diag.includes('jari')) return 'Wrist';
    if (diag.includes('hip') || diag.includes('panggul') || diag.includes('coxa') || diag.includes('femur') || diag.includes('piriformis')) return 'Hip';
    if (diag.includes('knee') || diag.includes('lutut') || diag.includes('acl') || diag.includes('mcl') || diag.includes('meniscus') || diag.includes('patella') || diag.includes('genu')) return 'Knee';
    if (diag.includes('ankle') || diag.includes('foot') || diag.includes('kaki') || diag.includes('achilles') || diag.includes('talus') || diag.includes('calcaneus')) return 'Ankle';
    return null;
}

function toggleSpecialTestValue(testId, val, region) {
    if (!window.tempFormData.special_tests) window.tempFormData.special_tests = {};

    // Update data
    window.tempFormData.special_tests[testId] = val;

    // Jika terpilih (+), berikan suggestion ICF
    if (val === '(+)') {
        const testData = SPECIAL_TESTS_DB[region].find(t => t.id === testId);
        if (testData && testData.target) {
            testData.target.forEach(code => {
                // Determine category dynamically
                const cat = getICFCategory(code);
                addICFFromSuggestion(cat, code, `Hasil (+) ${testData.name}`);
            });
        }
    }

    // Re-render only the list area for speed
    const area = document.getElementById('special-tests-list-area');
    if (area) {
        area.innerHTML = renderSpecialTestsList(window.tempFormData);
    }

    showToast(`Test ${testId} diupdate ke ${val}`, 'success');
}

// --- PWA INSTALLATION HANDLER ---
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    // e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    console.log('PWA: beforeinstallprompt event fired');
    // Optionally: show a custom install button here if needed
});

window.addEventListener('appinstalled', (evt) => {
    console.log('PWA: App was installed');
});
