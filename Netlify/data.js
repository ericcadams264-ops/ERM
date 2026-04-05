


// --- 1. DATABASE TEMPLATE ICF LENGKAP ---
window.ICF_TEMPLATES = {
    // --- MUSKULO ---
    // [REGION: KEPALA & LEHER]
    'Cervical Headache & Upper Cross Syndrome': { category: 'Muskulo', region: 'Kepala & Leher', icd: 'G44.2 / R29.3', codes: 'b2801, s710, d230', b: ['b2801 (Nyeri kepala/leher)', 'b710 (ROM servikal terbatas)', 'b740 (Tightness trapezius/pektoralis)', 'b735 (Kelemahan fleksor leher dalam)'], s: ['s710 (Struktur leher)', 's7600 (Otot trapezius)', 's7103 (Vertebra serviko-torakal)'], d_act: ['d230 (Gangguan konsentrasi)', 'd415 (Sulit menahan postur tegak)'], d_part: ['d850 (Penurunan produktivitas kerja)'], intervention: ['Rilis myofascial', 'Chin tuck', 'Scapular setting', 'Edukasi ergonomi'], eval: ['VAS turun', 'ROM membaik', 'Postur lebih tegak'] },
    'Cervical Radiculopathy & HNP Servikal': { category: 'Muskulo', region: 'Kepala & Leher', icd: 'M50.1', codes: 'b2804, s120, d445', b: ['b2804 (Nyeri radikuler ke lengan)', 'b265 (Parestesia/kesemutan)', 'b710 (ROM leher terbatas)', 'Spurling Test (+)'], s: ['s120 (Radiks saraf servikal)', 's7101 (Sendi facet servikal)', 's1200 (Diskus intervertebralis)'], d_act: ['d445 (Sulit menoleh/gerak leher)', 'd415 (Hambatan posisi statis)'], d_part: ['d850 (Hambatan kerja kantor)'], intervention: ['Traksi servikal manual', 'Neural gliding', 'Postural correction', 'TENS'], eval: ['Nyeri radikuler berkurang', 'ROM membaik', 'MMT naik'] },
    'Neck Pain (Arthrogenic/Facet)': { category: 'Muskulo', region: 'Kepala & Leher', icd: 'M47.2', codes: 'b2801, s710, d410', b: ['b28013 (Nyeri leher lokal)', 'b710 (ROM terbatas pola kapsuler)', 'Start Pain (Nyeri awal gerak)'], s: ['s7103 (Vertebra servikal)', 's7101 (Sendi facet/uncovertebral)'], d_act: ['d4100 (Sulit menoleh/memutar kepala)', 'd415 (Sulit posisi statis)'], d_part: ['d850 (Hambatan aktivitas harian)'], intervention: ['Joint mobilization (Maitland)', 'Stretching', 'Heat therapy', 'Isometrik leher'], eval: ['VAS turun', 'ROM membaik', 'Tes provokasi (-)'] },

    // [REGION: BAHU]
    'Adhesive Capsulitis (Frozen Shoulder)': { category: 'Muskulo', region: 'Bahu', icd: 'M75.0', codes: 'b28014, b7100, s7201, d540', b: ['b28014 (Nyeri bahu malam hari)', 'b7100 (ROM pola kapsuler terbatas)', 'b7150 (Kekakuan/Stiffness sendi)'], s: ['s7201 (Kapsul sendi glenohumeral)', 's7202 (Otot Rotator Cuff)', 's7600 (Scapula/tulang belikat)'], d_act: ['d5400 (Sulit berpakaian)', 'd4452 (Sulit menjangkau punggung/dompet)'], d_part: ['d850 (Hambatan pekerjaan spesifik)'], intervention: ['Joint Mobilization (Grade III-IV)', 'Peregangan kapsul', 'Latihan Wand & Pendulum', 'TENS'], eval: ['Skor SPADI membaik', 'Peningkatan ROM aktif/pasif'] },
    'Shoulder Impingement & Rotator Cuff Injury': { category: 'Muskulo', region: 'Bahu', icd: 'M75.4 / M75.1', codes: 'b28014, b7300, s7202, d540', b: ['b28014 (Nyeri bahu saat elevasi/Painful Arch)', 'b7300 (Kelemahan rotator cuff)', 'Neer / Hawkins-Kennedy Test (+)'], s: ['s7202 (Otot & Tendon Rotator Cuff)', 's7201 (Bursa Subacromialis)', 's7600 (Scapula/tulang belikat)'], d_act: ['d5400 (Sulit mengangkat lengan overhead)', 'd4300 (Sulit mengangkat beban berat)'], d_part: ['d9201 (Hambatan olahraga overhead)'] , intervention: ['Strengthening Rotator Cuff', 'Scapular stabilization', 'Mobilisasi sendi (Caudal glide)', 'Ultrasound'], eval: ['VAS turun', 'Kekuatan MMT naik', 'Skor DASH membaik'] },
    'Post-Op Shoulder (Repair/Reconstruction)': { category: 'Muskulo', region: 'Bahu', icd: 'Z98.890', codes: 'b280, s7402, d540', b: ['b280 (Nyeri pasca bedah)', 'b7101 (ROM terbatas protokol)', 'b730 (Kelemahan otot bahu)'], s: ['s7402 (Tendon/Ligamen repair)', 's7401 (Sendi bahu)', 's7408 (Luka sayatan bedah)'], d_act: ['d540 (Sulit mandi/berpakaian mandiri)', 'd445 (Hambatan gerak lengan aktif)'], d_part: ['d850 (Hambatan kembali kerja fisik)'], intervention: ['Proteksi (Arm sling)', 'PROM bertahap', 'AAROM', 'Mobilisasi scapula'], eval: ['Nyeri terkontrol', 'ROM fungsional sesuai fase'] },

    // [REGION: SIKU & TANGAN]
    'Tennis Elbow (Lateral Epicondylitis)': { category: 'Muskulo', region: 'Siku & Tangan', icd: 'M77.1', codes: 'b28016, b7300, s7301, d440', b: ['b28016 (Nyeri epi-lateral)', 'b7300 (Kelemahan ekstensor wrist)', 'Mill / Cozen Test (+)'], s: ['s73012 (Otot ekstensor)', 's73010 (Tendon ECRB)', 's73011 (Epicondylus lateral)'], d_act: ['d4401 (Sulit menggenggam kuat)', 'd4301 (Membawa benda di tangan)'], d_part: ['d850 (Hambatan kerja manual/mengetik)'], intervention: ['Eccentric strengthening', 'Cross friction massage', 'Stretching', 'Ultrasound'], eval: ['Skor PRTEE membaik', 'Nyeri tekan berkurang'] },
    'Carpal Tunnel Syndrome (CTS)': { category: 'Muskulo', region: 'Siku & Tangan', icd: 'G56.0', codes: 'b265, s1103, d440', b: ['b265 (Kesemutan jari 1-3)', 'Phalen / Tinnel Test (+)', 'b730 (Kelemahan otot thenar/grip)'], s: ['s1103 (Saraf medianus)', 's750 (Terowongan karpal)', 's7501 (Ligamen retinakulum)'], d_act: ['d440 (Sulit menggenggam/mencubit)', 'd445 (Hambatan mengetik)'], d_part: ['d850 (Hambatan kerja manual)'], intervention: ['Wrist splinting', 'Nerve gliding', 'Ultrasound', 'Edukasi ergonomi'], eval: ['Kesemutan berkurang', 'Kekuatan genggam naik'] },
    'Carpal Tunnel Release (Post-Op)': { category: 'Muskulo', region: 'Siku & Tangan', icd: 'Z98.890', codes: 'b280, s1103, d440', b: ['b280 (Nyeri luka operasi)', 'b270 (Sensitivitas saraf medianus)', 'b710 (ROM pergelangan terbatas)'], s: ['s1103 (Saraf medianus)', 's7508 (Area luka operasi/scar)'], d_act: ['d440 (Sulit menggenggam halus)', 'd445 (Penurunan ketangkasan)'], d_part: ['d850 (Hambatan kembali kerja)'], intervention: ['Mobilisasi scar', 'Tendon gliding', 'Desensitisasi saraf', 'Latihan ketangkasan'], eval: ['Luka sembuh', 'ROM penuh', 'Ketangkasan kembali'] },
    'TFCC Injury & Repair': { category: 'Muskulo', region: 'Siku & Tangan', icd: 'S63.5', codes: 'b2801, s7502, d440', b: ['b2801 (Nyeri ulnar saat rotasi/genggam)', 'b715 (Instabilitas DRUJ)', 'b710 (ROM rotasi terbatas)'], s: ['s75022 (Fibrocartilage TFCC)', 's7501 (Sendi radioulnar distal)', 's7508 (Luka bedah jika post-op)'], d_act: ['d4401 (Sulit menggenggam)', 'd410 (Nyeri saat menumpu tangan)'], d_part: ['d9201 (Hambatan olahraga raket)'], intervention: ['Wrist splinting', 'Mobilisasi DRUJ', 'Grip strengthening', 'Ultrasound'], eval: ['Nyeri ulnar hilang', 'Stabilitas DRUJ baik'] },
    // [REGION: PUNGGUNG & PINGGANG]
    'Mechanical Low Back Pain': { category: 'Muskulo', region: 'Pinggang (Lumbar)', icd: 'M54.5', codes: 'b2801, s760, d410', b: ['b28013 (Nyeri punggung bawah lokal)', 'b710 (ROM lumbal terbatas)', 'b730 (Kelemahan core & gluteal)', 'b740 (Ketegangan hamstring/hip flexor)'], s: ['s7601 (Otot paraspinal & QL)', 's7600 (Diskus/Facet lumbal)', 's7600 (Ligamen iliolumbal)'], d_act: ['d410 (Sulit bangkit dari tempat tidur)', 'd415 (Hambatan duduk/berdiri lama)', 'd430 (Sulit membungkuk)'], d_part: ['d850 (Keterbatasan kerja kantoran)'], intervention: ['Manual therapy (Myofascial release)', 'Core activation (Pelvic tilt, bird-dog)', 'Hamstring/Hip flexor stretching', 'Edukasi body mechanic'], eval: ['VAS <2', 'ROM lumbal penuh', 'Skor ODI membaik'] },
    'Discogenic LBP (HNP Lumbal & Sciatica)': { category: 'Muskulo', region: 'Pinggang (Lumbar)', icd: 'M51.1', codes: 'b2804, s120, d410', b: ['b28013 (Nyeri punggung bawah)', 'b2804 (Nyeri menjalar/Radikuler)', 'b265 (Parestesia dermatome L5-S1)', 'Lasegue / SLR Test (+)', 'Bragard Test (+)'], s: ['s120 (Radiks saraf spinal)', 's7600 (Diskus intervertebralis)', 's7601 (Otot piriformis)'], d_act: ['d410 (Sulit membungkuk)', 'd415 (Sulit duduk lama)', 'd430 (Sulit mengangkat barang)'], d_part: ['d850 (Hambatan pekerjaan fisik)'] , intervention: ['McKenzie Extension Exercise', 'Neural gliding (Nerve stretching)', 'TENS / Electrical stimulation', 'Core stability training'], eval: ['Nyeri radikuler berkurang', 'SLR meningkat', 'Skor ODI membaik'] },
    'Lumbar Instability / Spondylolisthesis': { category: 'Muskulo', region: 'Pinggang (Lumbar)', icd: 'M43.1', codes: 'b2801, b715, s760, d415', b: ['b28013 (Nyeri pinggang/bokong)', 'b715 (Instabilitas/Hipermobilitas segmen)', 'Active Prone Stability Test (+)', 'Kekakuan hamstring'], s: ['s7600 (Vertebra lumbal/Pars interartikularis)', 'Ligamen longitudinal (Laxity)', 'Otot paraspinal (Spasme)'], d_act: ['d4153 (Sulit menahan posisi duduk/berdiri lama)', 'd410 (Nyeri saat ekstensi lumbal)'], d_part: ['d920 (Hambatan olahraga/aktivitas berat)'], intervention: ['Deep core stabilization', 'Pelvic tilting', 'Hamstring stretching', 'Edukasi menghindari ekstensi berlebih'], eval: ['Stabilitas lumbal meningkat', 'VAS turun', 'Toleransi posisi statis membaik'] },
    'Mid Thoracal Pain (Hypomobility)': { category: 'Muskulo', region: 'Punggung (Thorax)', icd: 'M54.6', codes: 'b2801, s710, d415', b: ['b2801 (Nyeri regio torakal tengah)', 'b710 (ROM ekstensi & rotasi terbatas)', 'b740 (Ketegangan paraspinal & belikat)', 'b730 (Kelemahan stabilisator belikat)'], s: ['s7600 (Otot rhomboid & trapezius)', 's7105 (Vertebra torakal)', 's7500 (Sendi facet torakal)'], d_act: ['d415 (Sulit menahan postur tegak)', 'd4150 (Hambatan duduk statis lama)'], d_part: ['d850 (Penurunan produktivitas kerja kantor)'], intervention: ['Joint mobilization (Thoracic PA glide)', 'Thoracic extension (Foam roller)', 'Scapular setting', 'Rilis otot rhomboid'], eval: ['Nyeri berkurang', 'ROM torakal normal', 'Postur lebih tegak'] },
    'Post Fraktur Tibia-Fibula': { category: 'Muskulo', region: 'Lutut', msi_linkage: ['knee', 'ankle', 'hip'], icd: 'Z98.890 / S82.2', codes: 'b280, s750, d450', b: ['b280 (Nyeri area fraktur/luka)', 'b710 (ROM lutut/ankle terbatas)', 'b730 (Atrofi kuadrisep & betis)', 'b760 (Gangguan propriosepsi)'], s: ['s7500 (Tulang tibia & fibula)', 's7502 (Implan/Plate/Nail)', 's750 (Sendi talokrural)', 's760 (Otot gastrocnemius & kuadrisep)'], d_act: ['d450 (Sulit menumpu berat badan)', 'd4501 (Hambatan jalan dengan alat bantu)', 'd410 (Sulit transisi duduk-berdiri)'], d_part: ['d920 (Hambatan kembali bekerja/olahraga)'], intervention: ['Edukasi weight bearing', 'kompres dingin & elevasi', 'ankle pump', 'isometrik paha', 'mobilisasi sendi lutut/ankle', 'gait training progresif', 'penguatan panggul & tungkai', 'latihan keseimbangan', 'pliometrik ringan'], eval: ['VAS <2', 'ROM penuh lutut & ankle', 'kekuatan otot ≥90% sisi sehat', 'jalan normal tanpa alat bantu', 'skor LEFS naik ≥20%'] },
    'Arthrofibrosis Lutut': { category: 'Muskulo', region: 'Lutut', msi_linkage: ['knee', 'hip', 'ankle'], icd: 'M24.66', codes: 'b710, s750, d455', b: ['b710 (ROM fleksi/ekstensi terbatas signifikan)', 'b2801 (Nyeri saat end-range)', 'b715 (Hipomobilitas patela)', 'b730 (Atrofi kuadrisep)'], s: ['s7501 (Kapsul sendi lutut)', 's750 (Bantalan lemak infrapatelar/Hoffa’s)', 's7502 (Jaringan parut intra-artikular)', 's760 (Tendon kuadrisep)'], d_act: ['d455 (Sulit naik-turun tangga)', 'd410 (Hambatan jongkok/duduk-berdiri)'], d_part: ['d450 (Pola jalan tidak normal)', 'd540 (Keterbatasan kemandirian harian)'], intervention: ['Cryotherapy', 'mobilisasi patela (intensif)', 'heel slide dengan overpressure', 'stretching agresif', 'rilis miofasial', 'isometrik kuadrisep', 'gait training', 'sepeda statis'], eval: ['Nyeri <2', 'ROM fleksi 110-120° & ekstensi 0', 'kekuatan paha ≥90% sisi sehat', 'naik tangga tanpa kompensasi', 'skor WOMAC/KOOS membaik'] },
    'Sacroiliac (SI) Joint Dysfunction': { category: 'Muskulo', region: 'Panggul (Hip)', icd: 'M53.3', codes: 'b2801, s750, d450', b: ['b28013 (Nyeri lokal bokong)', 'b715 (Instabilitas/kekakuan sendi SI)', 'Faber / Gaenslen Test (+)', 'b730 (Kelemahan gluteus medius)'], s: ['s7502 (Sendi sakroiliaka)', 's7501 (Ligamen sakroiliaka)', 's760 (Otot gluteus & piriformis)'], d_act: ['d450 (Sulit berjalan pola normal)', 'd410 (Hambatan bangkit dari duduk)', 'd415 (Sulit bertumpu satu kaki)'], d_part: ['d920 (Keterbatasan aktivitas olahraga)'], intervention: ['Joint mobilization (SI glide)', 'Gluteus strengthening', 'Pelvic stabilization', 'TENS'], eval: ['VAS turun', 'Tes provokasi SI (-)'] },
    'Snapping Hip Eksternal': { category: 'Muskulo', region: 'Panggul (Hip)', msi_linkage: ['hip', 'knee', 'lumbar'], icd: 'R29.81 / M76.3', codes: 'b710, s750, d450', b: ['b710 (Sensasi snapping/bunyi ketikan)', 'b2801 (Nyeri panggul lateral)', 'b740 (Ketegangan ITB & TFL)', 'b735 (Kelemahan abduktor panggul)'], s: ['s75001 (Pita iliotibial / ITB)', 's73022 (Tendon gluteus maximus)', 's75001 (Trokanter mayor)', 's760 (Otot TFL & gluteus)'], d_act: ['d450 (Sulit naik tangga/berlari)', 'd410 (Hambatan saat jongkok/squat)'], d_part: ['d920 (Gangguan olahraga lari/dansa)', 'd540 (Gangguan mobilitas harian)'], intervention: ['TENS & US', 'rilis jaringan ITB & bokong', 'peregangan fleksor panggul', 'latihan mobilitas panggul', 'aktivasi gluteus & core', 'penggunaan foam roller', 'penguatan abduktor progresif', 'pliometrik & kelincahan'], eval: ['Bunyi snapping hilang/minimal', 'tidak ada nyeri saat jongkok/naik tangga', 'kekuatan abduktor skala 4+/5', 'pola gerak panggul normal & stabil'] },
    'Hip ROM Limitation': { category: 'Muskulo', region: 'Panggul (Hip)', msi_linkage: ['hip', 'lumbar', 'knee'], icd: 'M25.65', codes: 'b710, s7500, d450', b: ['b710 (ROM sendi panggul terbatas aktif/pasif)', 'b2801 (Nyeri kompensasi gerak)', 'b730 (Kelemahan otot gluteal & fleksor)', 'b715 (Kekakuan kapsul sendi)'], s: ['s7500 (Sendi panggul/acetabulofemoral)', 's7501 (Kapsul sendi panggul)', 's760 (Otot iliopsoas & adduktor)', 's7601 (Otot gluteal)'], d_act: ['d450 (Sulit berjalan pola normal)', 'd410 (Hambatan transisi duduk ke berdiri)', 'd4101 (Sulit naik tangga/jongkok)'], d_part: ['d540 (Hambatan aktivitas mandiri)'], intervention: ['TENS & US', 'mobilisasi sendi (Maitland tingkat I-IV)', 'rilis jaringan lunak', 'peregangan pasif/dinamis', 'aktivasi otot penopang', 'latihan fungsional awal', 'penguatan karet resistensi', 'latihan pola jalan'], eval: ['ROM meningkat 80-90% sisi sehat', 'skala nyeri <2', 'kekuatan otot panggul skala 4+/5', 'jalan normal tanpa kompensasi lutut/lumbal'] },
    'Hip Labral Repair (Post-Op)': { category: 'Muskulo', region: 'Panggul (Hip)', icd: 'Z98.890', codes: 'b280, s750, d450', b: ['b2801 (Nyeri panggul anterior)', 'b710 (ROM fleksi terbatas)', 'b715 (Sensasi sendi terkunci)', 'b730 (Kelemahan gluteus)'] , s: ['s7502 (Labrum asetabulum)', 's7501 (Kapsul sendi panggul)', 's7508 (Luka artroskopi)'], d_act: ['d450 (Sulit jalan tanpa kruk awal)', 'd455 (Hambatan naik tangga)'], d_part: ['d9201 (Hambatan olahraga intensitas tinggi)'], intervention: ['Edukasi limitasi fleksi', 'Isometrik panggul', 'Gait training (PWB)', 'Propriosepsi'], eval: ['VAS <2', 'ROM fungsional', 'Pola jalan normal'] },
    'Gluteal Tendinopathy & Piriformis Syndrome': { category: 'Muskulo', region: 'Panggul (Hip)', icd: 'M76.0 / G57.0', codes: 'b280, s760, d450', b: ['b2801 (Nyeri bokong/panggul luar)', 'b2804 (Nyeri menjalar/Pseudo-sciatica)', 'b730 (Kelemahan gluteus)', 'FAIR Test (+)'], s: ['s7601 (Otot piriformis)', 's73022 (Tendon gluteus medius)', 's1103 (Saraf ischiadicus)'], d_act: ['d450 (Sulit jalan/naik tangga)', 'd415 (Hambatan duduk lama)'], d_part: ['d920 (Gangguan lari jarak jauh)'], intervention: ['Myofascial release piriformis', 'Gluteus medius strengthening', 'Neural gliding', 'Postural correction'], eval: ['Nyeri berkurang', 'Tes Trendelenburg (-)', 'MMT Gluteus naik'] },
    'ACLR (ACL Reconstruction) Post-Op': { category: 'Muskulo', region: 'Lutut', icd: 'Z98.890 / S83.5', codes: 'b715, s750, d920', b: ['b715 (Instabilitas sendi lutut)', 'b280 (Nyeri pasca bedah)', 'b710 (ROM fleksi/ekstensi terbatas)', 'b730 (Atrofi otot kuadrisep)'], s: ['s7502 (Ligamen cruciatum anterior/graft)', 's750 (Kapsul sendi lutut)', 's760 (Otot kuadrisep)'] , d_act: ['d450 (Sulit jalan tanpa alat bantu)', 'd455 (Hambatan naik-turun tangga)'], d_part: ['d9201 (Hambatan olahraga kompetitif)'], intervention: ['Cryotherapy & elevasi', 'Isometrik kuadrisep', 'Mobilisasi patela', 'Gait training'], eval: ['VAS <2', 'ROM 0-120 derajat', 'MMT Kuadrisep naik'] },
    'Ligamentous Injury (ACL/MCL/LCL/PCL)': { category: 'Muskulo', region: 'Lutut', icd: 'S83.5 / S83.4', codes: 'b715, s750, d450', b: ['b715 (Instabilitas/Laxity)', 'b2801 (Nyeri garis sendi)', 'Lachman / Valgus / Varus Test (+)', 'b730 (Kelemahan otot penyangga)'], s: ['s7502 (Ligamen kolateral/cruciatum)', 's7501 (Kapsul sendi lutut)', 's760 (Otot kuadrisep & hamstring)'], d_act: ['d450 (Sulit gerakan pivot/jalan cepat)', 'd455 (Hambatan naik-turun tangga)'], d_part: ['d920 (Keterbatasan olahraga kontak)'], intervention: ['Bracing & protection', 'Isometrik paha', 'Propriosepsi/Keseimbangan', 'Neuromuscular control'], eval: ['VAS <2', 'Stabilitas meningkat', 'Pola jalan normal'] },
    'Patellar Tendinopathy (Jumper\'s Knee)': { category: 'Muskulo', region: 'Lutut', icd: 'M76.5', codes: 'b280, s750, d920', b: ['b2801 (Nyeri anterior lutut/tendon patella)', 'b730 (Kelemahan kuadrisep)', 'Nyeri saat melompat/squat'], s: ['s7502 (Tendon patella)', 's760 (Otot kuadrisep)', 's7500 (Tuberositas tibia)'], d_act: ['d9201 (Sulit melompat/mendarat)', 'd455 (Nyeri naik tangga)'], d_part: ['d920 (Keterbatasan aktivitas olahraga)'], intervention: ['Isometric wall sit', 'Eccentric decline squat', 'Load management', 'Stretching hamstring'], eval: ['Skor VISA-P membaik', 'Nyeri berkurang saat loading'] },
    'Hip Osteoarthritis': { category: 'Muskulo', region: 'Panggul (Hip)', icd: 'M16', codes: 'b710, b720, s750, d450', b: ['b28015 (Nyeri inguinal/paha)', 'b710 (Kaku pagi < 30 menit)', 'Hipomobilitas Pola Kapsuler', 'FABER Test (+)'], s: ['s75001 (Struktur Sendi Panggul)', 'Kartilago Artikularis (Degenerasi)'], d_act: ['d450 (Kesulitan berjalan jauh)', 'd540 (Kesulitan berpakaian celana)'], d_part: ['d460 (Keterbatasan mobilitas komunitas)'], intervention: ['Manual therapy (Joint mobilization)', 'Strengthening gluteal', 'Stretching iliopsoas', 'Hydrotherapy'], eval: ['VAS turun', 'ROM meningkat', 'Skor WOMAC membaik'] },
    'OA Lutut (Osteoarthritis)': { 
        category: 'Muskulo', region: 'Lutut', icd: 'M17', codes: 'b28016, b710, s7501, d450, d410', 
        b: ['b28016 (Nyeri lutut/ngilu/pegal)', 'b710 (Kaku pagi/Morning Stiffness)', 'b7102 (Krepitasi saat gerak)', 'b7301 (Kelemahan otot Quadriceps)', 'Patellar Ballotement Test (+) Efusi', 'ROM terbatas pola kapsuler'], 
        s: ['s75011 (Struktur Sendi Lutut)', 's75012 (Kartilago Artikularis)', 's75018 (Osteofit/tulang tajam)'], 
        d_act: ['d4501 (Kesulitan jalan jauh/pincang)', 'd4551 (Kesulitan naik-turun tangga)', 'd4101 (Kesulitan berganti posisi/jongkok)', 'd5400 (Kesulitan aktivitas harian dasar)'], 
        d_part: ['d460 (Hambatan mobilitas di komunitas)', 'd9201 (Hambatan olahraga rekreasi)'], 
        intervention: ['US / Microwave Diathermy', 'Joint Mobilization (MWM)', 'Isometrik & Strengthening Quadriceps/Gluteal', 'Gait Retraining', 'Edukasi kontrol berat badan', 'Latihan low impact (sepeda statis)'], 
        eval: ['Nyeri berkurang (VAS/NPRS)', 'WOMAC / KOOS Score membaik', 'Peningkatan fungsional jalan & tangga'] 
    },
    'Post-Op Total Knee Replacement (TKR/TKA)': { 
        category: 'Muskulo', region: 'Lutut', icd: 'Z96.65', codes: 'b28016, b710, s7501, d450, d540', 
        b: ['b28016 (Nyeri lutut pasca bedah)', 'b710 (Keterbatasan fleksi/ekstensi)', 'b7301 (Atrofi otot kuadrisep)', 'b770 (Pola jalan belum normal)', 'Odema/Bengkak area bedah'], 
        s: ['s75011 (Prostesis/Implant Lutut)', 's7308 (Jaringan parut/Scar)', 's7601 (Otot penunjang lutut)'], 
        d_act: ['d4501 (Berjalan dengan/tanpa alat bantu)', 'd4551 (Naik-turun tangga)', 'd410 (Transfer dari duduk ke standing)', 'd530 (Hambatan toileting)'], 
        d_part: ['d540 (Ketergantungan ADL)', 'Hambatan aktivitas sosial'], 
        intervention: ['Ankle Pumping (Cegah DVT)', 'Quadriceps/Gluteal Setting', 'Mobilisasi Patela & ROM aktif/pasif', 'TENS & Kompres Dingin', 'Gait Training (Walker/Crutch)', 'Manual therapy jaringan parut'], 
        eval: ['Target Ekstensi 0 & Fleksi >110', 'Kemampuan jalan mandiri', 'WOMAC Score membaik'] 
    },
    'Post ORIF Fracture Humerus': { category: 'Muskulo', region: 'Bahu', msi_linkage: ['shoulder', 'scapula', 'cervical'], icd: 'S42', codes: 's73000, b7101, d2302', b: ['b28014 (Nyeri pasca operasi)', 'b7101 (Keterbatasan gerak sendi Bahu/Siku)', 'b730 (Penurunan kekuatan otot)', 'Odema/Bengkak lengan', 'Kekakuan otot (Muscle tightness)', 'Tes Integritas N. Radialis (Waspada Drop Hand)'], s: ['s73001 (Tulang Humerus/Implant)', 'Luka insisi operasi', 'Otot Lengan Atas (Triceps/Biceps)', 'Nervus Radialis'], d_act: ['d2302 (Kesulitan aktivitas harian rutin)', 'd540 (Kesulitan berpakaian)', 'd445 (Kesulitan menggerakkan lengan/tangan)', 'd430 (Kesulitan mengangkat benda)'], d_part: ['Hambatan pekerjaan manual', 'Hambatan aktivitas rekreasi'], intervention: ['Hand Pump Exercise (Pumping Tangan)', 'Sustained Isometric (Flexor/Extensor Elbow)', 'Mobilisasi Aktif/Assisted (Bahu, Siku, Wrist)', 'Elevasi Lengan (Kurangi Bengkak)', 'TENS / Kompres Dingin (Nyeri Akut)', 'Infrared / US (Jika tidak ada inflamasi akut)', 'Strengthening & PWB Exercise (Fase Lanjut >6 minggu)'], eval: ['Nyeri berkurang (VAS/NPRS)', 'ROM Siku & Bahu Fungsional', 'Kekuatan Otot (Target 4/5)', 'Integritas Saraf Radialis Normal', 'Bone Healing (Kalus) baik'] },
    'Ankle Sprain & Chronic Instability (CAI)': { 
        category: 'Muskulo', region: 'Ankle & Kaki', msi_linkage: ['ankle', 'foot', 'knee'], icd: 'S93 / M24.27', codes: 'b7150, b7601, s75023, d450, d9201', 
        b: ['b28015 (Nyeri pergelangan kaki)', 'b7150 (Instabilitas/Proprioceptive menurun/Giving way)', 'Bengkak/Haematoma Lateral Malleolus', 'Anterior/Posterior Drawer Test (+)', 'Nyeri tekan Ligamen ATFL/CFL', 'b730 (Kelemahan otot peroneal)'], 
        s: ['s75023 (Ligamen Lateral Ankle - ATFL/CFL)', 's750 (Sendi talokrural)', 'Tendon Peroneus', 's110 (Mekanoreseptor kapsul sendi)'], 
        d_act: ['d450 (Kesulitan berjalan di permukaan tidak rata)', 'd4552 (Kesulitan berlari/cutting)', 'd4553 (Kesulitan melompat/mendarat)', 'Kesulitan menumpu berat badan (Weight Bearing)'], 
        d_part: ['d9201 (Hambatan olahraga kompetitif)', 'Hambatan aktivitas kerja'], 
        intervention: ['External Support (Taping/Brace)', 'ROM & Stretching Exercise', 'Neuromuscular & Balance Training (BOSU)', 'Manual Therapy (MWM/Soft Tissue)', 'Strengthening Peroneal & Dorsofleksor', 'Pliometrik lateral & kelincahan'], 
        eval: ['Nyeri berkurang (VAS/NPRS)', 'Stabilitas & Agility meningkat', 'FAAM / CAIT Score membaik', 'Keseimbangan 1 kaki >30 detik'] 
    },
    'Chondromalacia Patella / PFPS': { 
        category: 'Muskulo', region: 'Lutut', msi_linkage: ['knee', 'hip', 'ankle'], icd: 'M22.40', codes: 'b280, b730, s750, d410, d455', 
        b: ['b280 (Nyeri Lutut Anterior/Retro-patellar)', 'b730 (Kelemahan VMO)', 'Nyeri saat kompresi patella', 'Theater sign (Nyeri duduk lama)', 'Atropi Quadriceps', 'Malalignment gerak patella'], 
        s: ['s75012 (Tulang Rawan Patella)', 'Otot Quadriceps (Vastus Medialis)', 'Sendi Patellofemoral'], 
        d_act: ['d410 (Nyeri saat jongkok/berlutut)', 'd455 (Nyeri saat naik/turun tangga)', 'd4103 (Nyeri duduk lutut ditekuk)'], 
        d_part: ['d920 (Hambatan Olahraga/Rekreasi)', 'd850 (Hambatan Bekerja/Mengemudi)'], 
        intervention: ['VMO Strengthening', 'Patellar Taping/Bracing', 'Quadriceps Stretching', 'Hip Abductor Strengthening', 'Edukasi pembebanan'], 
        eval: ['VAS turun', 'Antropometri lingkar paha naik', 'VMO Strength Test membaik', 'Kujala Score naik'] 
    },
    'Meniscus Tears (Robekan Meniskus)': { 
        category: 'Muskulo', region: 'Lutut', icd: 'S83.2', codes: 'b280, b710, s750', 
        b: ['b280 (Nyeri Garis Sendi Lutut)', 'b710 (Keterbatasan ROM/Locking)', 'McMurray / Apley Test (+)', 'Nyeri saat rotasi lutut'], 
        s: ['s75001 (Meniskus Medial/Lateral)', 'Sendi Tibiofemoral'], 
        d_act: ['d450 (Gangguan Berjalan/Terkunci)', 'd455 (Nyeri saat naik/turun tangga)'], 
        d_part: ['d920 (Hambatan Olahraga Pivot/Twisting)', 'd850 (Hambatan Bekerja)'], 
        intervention: ['Meniscus Manipulation', 'Stabilization & Proprioceptive Training', 'Strengthening Knee/Hip', 'Pain Management'], 
        eval: ['McMurray Test (-)', 'ROM penuh fungsional', 'Joint Line Tenderness berkurang'] 
    },
    'Shoulder Impingement Syndromes': { 
        category: 'Muskulo', region: 'Bahu', icd: 'M75.4', codes: 'b280, b710, b730, s720', 
        b: ['b280 (Nyeri Bahu Anterior/Posterior)', 'Painful Arc 60-120º', 'Neer / Hawkins-Kennedy Test (+)', 'b730 (Kelemahan Rotator Cuff)', 'b710 (Keterbatasan ROM internal rotasi)'], 
        s: ['s720 (Struktur Bahu/Acromion)', 'Rotator Cuff (Supraspinatus)', 'Labrum Glenoidalis', 'Bursa Subacromial'], 
        d_act: ['d430 (Kesulitan Mengangkat Barang)', 'd540 (Kesulitan Memakai Baju/Overhead reaching)'], 
        d_part: ['d920 (Hambatan Olahraga Melempar/Voli/Renang)', 'd850 (Hambatan Bekerja)'], 
        intervention: ['Manual Therapy (Glide/Traksi)', 'Rotator Cuff Strengthening', 'Scapular Stabilization', 'Posterior Capsule Stretching', 'US/MWD'], 
        eval: ['Nyeri berkurang (VAS)', 'ROM Meningkat', 'Negative Impingement Tests', 'DASH Score membaik'] 
    },
    'Hamstring Strain / Tear': { 
        category: 'Muskulo', region: 'Paha', icd: 'S76.3', codes: 'b730, s760, d920', 
        b: ['b730 (Kelemahan fleksi lutut)', 'b2801 (Nyeri tajam posterior paha)', 'Ecchymosis/Lebam pada paha belakang', 'b710 (Fleksibilitas Hamstring terbatas)'], 
        s: ['s760 (Biceps femoris, Semitendinosus)', 's7500 (Tuberositas ischii)', 'Jaringan ikat intramuskular'], 
        d_act: ['d9201 (Sulit sprint/menendang)', 'd4101 (Sulit membungkuk)'], 
        d_part: ['d920 (Keterbatasan olahraga atletik/bola)'], 
        intervention: ['Cryotherapy & kompresi (Akut)', 'Eccentric strengthening (Nordic Hamstring)', 'RDL ringan', 'Lari progresif', 'Soft tissue release'], 
        eval: ['VAS <2', 'ROM simetris', 'Kekuatan hamstring ≥90% sisi sehat', 'Sprint tanpa nyeri'] 
    },
    'Rectus Femoris / Quad Strain': { 
        category: 'Muskulo', region: 'Paha', icd: 'S76.1', codes: 'b280, b730, s750', 
        b: ['b280 (Nyeri Paha Depan)', 'b730 (Kelemahan Ekstensi Lutut)', 'Swelling paha anterior', 'Ely\'s Test (+)'], 
        s: ['s75011 (Otot Paha/Rectus Femoris)', 'Tendon Quadriceps'], 
        d_act: ['d450 (Nyeri saat berjalan/berlari)', 'd455 (Nyeri saat meloncat)'], 
        d_part: ['d920 (Hambatan Olahraga Lari/Sepakbola)'], 
        intervention: ['RICE', 'Eccentric Quadriceps Training', 'Stabilization Exercise', 'Stretching progresif'], 
        eval: ['VAS turun', 'Lingkar paha simetris', 'Kekuatan kontraksi pulih'] 
    },
    'Calf Muscle Tear (Tennis Leg)': { 
        category: 'Muskulo', region: 'Ankle & Kaki', icd: 'S86.11', codes: 'b730, s760, d450', 
        b: ['b730 (Kelemahan jinjit)', 'b2801 (Nyeri tajam belakang betis)', 'b710 (Nyeri dorsofleksi pasif)', 'Thompson Test (Rule out rupture)'], 
        s: ['s760 (Otot Gastrocnemius Medial)', 'Otot Soleus', 'Fascia tungkai bawah'], 
        d_act: ['d450 (Sulit menumpu berat badan)', 'd415 (Sulit jinjit satu kaki)'], 
        d_part: ['d920 (Keterbatasan olahraga tenis/lari)'], 
        intervention: ['Heel lift (Proteksi)', 'Isometrik plantarflexion', 'Eccentric heel drop', 'Pliometrik bertahap'], 
        eval: ['VAS <2', 'Single leg heel raise >20 repetisi', 'Kembali olahraga tanpa nyeri'] 
    },
    'High Ankle Sprain (Syndesmosis)': { 
        category: 'Muskulo', region: 'Ankle & Kaki', icd: 'S93.43', codes: 'b715, s750, d450', 
        b: ['b715 (Instabilitas sindesmosis)', 'Squeeze Test (+)', 'External Rotation Stress Test (+)', 'Nyeri di atas malleolus lateral'], 
        s: ['s7502 (Ligamen AITFL/PITFL)', 'Membran interosseous'], 
        d_act: ['d450 (Sulit jalan pola normal)', 'd455 (Nyeri squat/pivot)'], 
        d_part: ['d920 (Keterbatasan olahraga kontak/basket)'], 
        intervention: ['Proteksi (Wait & See / Boot)', 'Stabilisasi proksimal tibia-fibula', 'Keseimbangan dinamis', 'Agility spesifik'], 
        eval: ['Stabilitas mortise membaik', 'Squeeze test (-)', 'Jalan tanpa nyeri'] 
    },

    'Fasclitis Plantaris': { category: 'Muskulo', region: 'Ankle & Kaki', icd: 'M72.2', codes: 'b28015, s75023, d4500, d4154', b: ['b28015 (Nyeri tumit/kaki bawah)', 'Morning Pain (Nyeri langkah pertama bangun tidur)', 'Start Pain (Nyeri awal berdiri lama)', 'Nyeri tekan Tuberositas Calcaneal', 'Windlass Test (+)', 'Tightness otot Gastrocnemius'], s: ['s75023 (Fascia Plantaris)', 'Tuberositas Calcaneal', 'Otot Gastrocnemius & Soleus', 'Struktur Arkus Kaki (Pes Planus/Cavus)'], d_act: ['d4500 (Kesulitan berjalan jarak pendek)', 'd4501 (Kesulitan berjalan jarak jauh)', 'd4154 (Kesulitan berdiri lama)', 'Antalgic Gait (Pola jalan pincang)'], d_part: ['Hambatan pekerjaan berdiri lama/menumpu', 'Hambatan olahraga lari/lompat'], intervention: ['Deep Friction Massage (Plantar Fascia)', 'Stretching (Fascia & Gastroc/Soleus)', 'Strengthening Otot Intrinsik (Toe Curl)', 'Manual Therapy (Talocrural Distraction)', 'Rigid Taping (Low Dye)', 'ESWT (Shockwave Therapy)', 'Foot Orthosis (Heel Cushion/Arch Support)'], eval: ['Nyeri berkurang (VAS/NPRS)', 'FAAM / LEFS Score membaik', 'Windlass Test (-)', 'LGS Dorsifleksi membaik'] },
    'Post ORIF Fracture Femur': { category: 'Muskulo', region: 'Panggul (Hip)', msi_linkage: ['hip', 'knee', 'lumbar'], icd: 'S72', codes: 'b28016, b730, s75001, d450', b: ['b28016 (Nyeri pasca operasi)', 'b710 (Keterbatasan gerak Hip/Knee)', 'b730 (Penurunan kekuatan otot)', 'Odema tungkai bawah', 'Atrofi otot', 'Kontraktur otot'], s: ['s75001 (Tulang Femur/Implant)', 'Luka insisi operasi', 'Otot Quadriceps & Hamstring'], d_act: ['d450 (Kesulitan berjalan/Gait deviation)', 'd4551 (Kesulitan naik tangga)', 'd530 (Kesulitan toileting)', 'd410 (Kesulitan transfer duduk-berdiri)'], d_part: ['Hambatan aktivitas harian (ADL)', 'Hambatan mobilisasi jarak jauh', 'Hambatan olahraga/rekreasi'], intervention: ['Positioning (No pillow under knee)', 'Ankle Pumping & Isometric Sets', 'Mobilisasi Bertahap (NWB -> PWB -> FWB)', 'Gait Training (Walker/Crutch)', 'TENS / Kompres Dingin', 'Strengthening & ROM Exercise'], eval: ['Nyeri berkurang (VAS/NPRS)', 'ROM Fungsional/Normal', 'Kekuatan Otot Minimal 4', 'Pola Jalan Normal', 'Bone Healing Baik'] },
    'Post ORIF Fracture Patella': { category: 'Muskulo', region: 'Lutut', msi_linkage: ['knee', 'hip', 'ankle'], icd: 'S82.0', codes: 's75011, b710, b770, d450', b: ['b28016 (Nyeri pasca operasi)', 'b710 (Keterbatasan gerak sendi Lutut)', 'b730 (Penurunan kekuatan otot Quadriceps)', 'Odema area lutut', 'Atrofi otot', 'Keterbatasan mobilitas patella'], s: ['s75011 (Tulang Patella/Implant)', 'Luka insisi operasi', 'Otot Quadriceps & Hamstring', 'Sendi Tibio-femoral'], d_act: ['d450 (Kesulitan berjalan/Gait deviation)', 'd4551 (Kesulitan naik tangga)', 'd530 (Kesulitan toileting)', 'd410 (Kesulitan transfer duduk-berdiri)'], d_part: ['Hambatan aktivitas harian (ADL)', 'Hambatan aktivitas seksual', 'Hambatan kembali bekerja/olahraga'], intervention: ['Ankle Pump & Sustained Isometric (Quads/Hams)', 'Mobilisasi Patella & Sendi Lutut', 'Elevasi (Kurangi Bengkak)', 'Gait Training (PWB/FWB bertahap)', 'TENS / Kompres Dingin (Nyeri Akut)', 'Ultrasound / IR (Fase lanjut)', 'Strengthening & Stretching Exercise'], eval: ['Nyeri berkurang (VAS/NPRS)', 'ROM Lutut Fungsional/Normal', 'Kekuatan Otot Minimal 4/5', 'Mobilitas Patella Baik', 'Pola Jalan Normal'] },
    'Post ORIF Fracture Tibia': { category: 'Muskulo', region: 'Lutut', msi_linkage: ['knee', 'ankle', 'hip'], icd: 'S82', codes: 's75010, b710, b7601, d450', b: ['b28016 (Nyeri pasca operasi)', 'b710 (Keterbatasan gerak sendi)', 'b730 (Penurunan kekuatan otot)', 'Odema tungkai bawah & pedis', 'Atrofi otot', 'Kontraktur otot'], s: ['s75010 (Tulang Tibia/Implant)', 'Luka insisi operasi', 'Otot Tungkai Bawah', 'Sendi Lutut & Ankle'], d_act: ['d450 (Kesulitan berjalan/NWB-PWB)', 'd4551 (Kesulitan naik tangga)', 'd530 (Kesulitan toileting)', 'd410 (Kesulitan transfer/mobilitas bed)'], d_part: ['Hambatan aktivitas harian (ADL)', 'Hambatan aktivitas seksual', 'Hambatan kembali bekerja/olahraga'], intervention: ['Positioning (No pillow under knee)', 'Ankle Pumping & Isometric Sets', 'Mobilisasi Bertahap (NWB -> PWB -> FWB)', 'Gait Training (Walker/Crutch)', 'TENS / Kompres Dingin', 'Strengthening & Stretching Exercise', 'Joint Mobilization'], eval: ['Nyeri berkurang (VAS/NPRS)', 'ROM Fungsional/Normal', 'Kekuatan Otot Minimal 4/5', 'Pola Jalan Normal', 'Bone Healing Baik'] },
    'Post Reconstruction DDH': { category: 'Muskulo', region: 'Panggul (Hip)', msi_linkage: ['hip', 'lumbar', 'knee'], icd: 'Q65', codes: 's740, s750, b28016, d450', b: ['b28016 (Nyeri pasca operasi)', 'b710 (Keterbatasan gerak sendi panggul)', 'b730 (Penurunan kekuatan otot)', 'Asimetri lipatan paha/inguinal (Tanda klinis)', 'Gangguan stabilitas sendi'], s: ['s75001 (Struktur Sendi Panggul: Acetabulum/Caput Femur)', 'Luka insisi operasi', 'Otot-otot Ekstremitas Bawah'], d_act: ['d450 (Ketidakmampuan berjalan/NWB-PWB)', 'd410 (Kesulitan transfer tidur-duduk)', 'd530 (Kesulitan toileting)', 'd455 (Kesulitan bergerak di sekitar)'], d_part: ['Hambatan aktivitas bermain/sekolah (Anak)', 'Hambatan aktivitas sehari-hari (ADL)', 'Gangguan mobilisasi sosial'], intervention: ['Positioning (Pengaturan Posisi)', 'Isometric Exercises (Otot Ekstremitas Bawah)', 'Assisted SLR (Straight Leg Raise)', 'Mobilisasi Bertahap (NWB -> PWB -> FWB)', 'Gait Training (Latihan Jalan)', 'Pain Control (Kontrol Nyeri & Inflamasi)'], eval: ['Nyeri (FLACC/Wong Baker/NPRS)', 'ROM & Muscle Length', 'Kemampuan Transfer & Ambulasi', 'Stabilitas Sendi (X-Ray Check)'] },

    'Patellar Tendon Rupture (Post-Op)': { category: 'Muskulo', region: 'Lutut', msi_linkage: ['knee', 'hip', 'ankle'], icd: 'S86.011 / Z98.890', codes: 'b710, s750, d450', b: ['b710 (Hilangnya ekstensi aktif/Extensor lag)', 'b280 (Nyeri pasca-op)', 'b730 (Atrofi kuadrisep berat)', 'b7101 (ROM fleksi terbatas)'], s: ['s7502 (Tendon patella)', 's7500 (Kutub inferior patella/Tuberositas tibia)', 's760 (Otot kuadrisep)', 's7308 (Luka sayatan bedah)'], d_act: ['d450 (Sulit meluruskan kaki aktif)', 'd4501 (Hambatan jalan menumpu beban)', 'd410 (Sulit bangkit dari kursi)', 'd455 (Hambatan naik-turun tangga)'], d_part: ['d450 (Hambatan jalan menumpu beban)', 'd455 (Hambatan naik-turun tangga)'], intervention: ['Proteksi hasil repair, knee brace (limitasi sudut)', 'quad set & ankle pump', 'SLR (dengan penyangga)', 'mobilisasi bertahap (0-60° ke 0-90°)', 'penguatan progresif', 'gait training', 'pliometrik fase akhir'], eval: ['VAS <2', 'ROM penuh & simetris', 'kekuatan paha ≥90% sisi sehat', 'jalan/naik tangga tanpa nyeri', 'skor IKDC atau Kujala meningkat signifikan'] },
    'ATFL Post-Operatif': { category: 'Muskulo', region: 'Ankle & Kaki', msi_linkage: ['ankle', 'foot', 'knee'], icd: 'Z98.890 / S93.41', codes: 'b280, s750, d450', b: ['b280 (Nyeri pasca-bedah)', 'b710 (ROM terbatas)', 'b730 (Kelemahan peroneal/eversor)', 'b760 (Defisit kontrol neuromuskular)'], s: ['s7502 (Ligamen ATFL/CFL & Graft)', 's750 (Kapsul sendi talokrural)', 's760 (Otot peroneal)', 's7308 (Luka insisi bedah)'], d_act: ['d450 (Sulit menumpu berat badan)', 'd4501 (Hambatan jalan alat bantu)', 'd415 (Sulit berdiri satu kaki)'], d_part: ['d920 (Keterbatasan olahraga kompetitif)'], intervention: ['Edukasi proteksi (brace/boot)', 'kompres dingin & elevasi', 'ankle pump', 'mobilisasi bertahap (hindari inversi)', 'penguatan peroneal (theraband)', 'proprioceptive training', 'pliometrik lateral', 'sport specific'], eval: ['VAS <2', 'ROM penuh & simetris', 'kekuatan peroneal ≥90% sisi sehat', 'keseimbangan 1 kaki >30 detik', 'skor FAAM/CAIT naik signifikan', 'tidak ada giving way'] },
    'Achilles Rupture (Post-Op)': { category: 'Muskulo', region: 'Ankle & Kaki', msi_linkage: ['ankle', 'foot', 'knee'], icd: 'S86.011 / Z98.890', codes: 'b730, s750, d450', b: ['b730 (Hilangnya kekuatan jinjit/push-off)', 'b280 (Nyeri pasca-bedah)', 'b710 (ROM dorsofleksi terbatas)', 'b735 (Atrofi otot betis/gastro-soleus)'], s: ['s7502 (Tendon Achilles)', 's760 (Otot gastrocnemius & soleus)', 's7500 (Tulang calcaneus)', 's7308 (Luka insisi bedah)'], d_act: ['d450 (Sulit gerakan push-off jalan)', 'd4501 (Hambatan menumpu berat badan)', 'd455 (Hambatan naik-turun tangga)', 'd450 (Pola jalan pincang)'], d_part: ['d450 (Pola jalan pincang)'], intervention: ['Proteksi tendon (equinus position)', 'walking boot with wedge', 'ankle pump terbatas', 'isometrik panggul/lutut', 'mobilisasi bertahap (hindari overstretch)', 'calf raise progresif', 'keseimbangan', 'pliometrik & lari'], eval: ['VAS <2', 'dorsofleksi 10-15° tanpa nyeri', 'kekuatan betis ≥90% sisi sehat', 'single leg heel raise >20 repetisi', 'skor VISA-A naik signifikan'] },
    'TTS & Plantar Fasciitis': { category: 'Muskulo', region: 'Ankle & Kaki', msi_linkage: ['ankle', 'foot', 'knee'], icd: 'G57.5 / M72.2', codes: 'b280, s750, d450', b: ['b2801 (Nyeri tumit tajam pagi hari)', 'b270 (Sensasi terbakar/kesemutan)', 'b710 (ROM dorsofleksi terbatas)', 'b730 (Kelemahan otot intrinsik kaki)'], s: ['s110 (Nervus tibialis posterior)', 's7502 (Fasia plantar)', 's7500 (Tuberkulum kalkaneus)', 's760 (Otot gastro-soleus)'], d_act: ['d450 (Sulit langkah pertama pagi hari)', 'd415 (Hambatan berdiri lama/jalan)', 'd455 (Sulit naik tangga/jinjit)'], d_part: ['d850 (Penurunan produktivitas kerja)'], intervention: ['Kompres es botol', 'insole/arch support', 'taping', 'peregangan betis & fasia', 'towel scrunch', 'eccentric heel drop', 'neural gliding', 'kontrol BB'], eval: ['VAS <2', 'dorsofleksi ≥10°', 'kekuatan intrinsik & betis ≥90% sisi sehat', 'pola jalan normal', 'skor FAAM naik signifikan'] },
    'Ankle Fracture (Post-Op)': { category: 'Muskulo', region: 'Ankle & Kaki', msi_linkage: ['ankle', 'foot', 'knee'], icd: 'Z98.890 / S82.8', codes: 'b280, s750, d450', b: ['b280 (Nyeri pasca bedah ankle)', 'b710 (ROM ankle terbatas)', 'b730 (Kelemahan otot tungkai bawah)', 'b715 (Bengkak area malleolus)'], s: ['s750 (Tulang malleolus/talus)', 's7502 (Prostesis/Internal fixation)', 's7501 (Sendi talokrural)', 's7508 (Area luka operasi)'], d_act: ['d450 (Hambatan berjalan/NWB-PWB)', 'd460 (Kesulitan berpindah tempat)'], d_part: ['d920 (Keterbatasan olahraga)', 'd850 (Hambatan kembali kerja fisik)'], intervention: ['Edukasi weight bearing', 'kompres dingin & elevasi', 'ankle pump', 'isometrik paha', 'mobilisasi sendi lutut/ankle', 'gait training progresif', 'penguatan panggul & tungkai', 'latihan keseimbangan', 'pliometrik ringan'], eval: ['VAS <2', 'ROM penuh lutut & ankle', 'kekuatan otot ≥90% sisi sehat', 'jalan normal tanpa alat bantu', 'skor LEFS naik ≥20%'] },
    'Ankle ROM Limitation': { category: 'Muskulo', region: 'Ankle & Kaki', msi_linkage: ['ankle', 'foot', 'knee'], icd: 'M24.67', codes: 'b710, s750, d455', b: ['b710 (Keterbatasan dorsofleksi/plantarfleksi)', 'b2801 (Nyeri akhir lingkup gerak)', 'b715 (Kekakuan kapsul sendi)', 'b730 (Atrofi otot betis)'], s: ['s750 (Sendi talokrural & subtalar)', 's7501 (Kapsul sendi pergelangan kaki)', 's760 (Otot gastrocnemius & soleus)', 's7502 (Fibrosis pasca-bedah)'], d_act: ['d455 (Hambatan turun tangga)', 'd4101 (Sulit jongkok/squat)', 'd450 (Langkah pendek/kompensasi jalan)', 'd415 (Sulit berdiri satu kaki)'], d_part: ['d415 (Sulit berdiri satu kaki)'], intervention: ['Mobilisasi sendi manual (AP glide)', 'ankle pump', 'peregangan gastro-soleus', 'weight-bearing lunge stretch', 'penguatan betis/peroneal', 'keseimbangan dinamis', 'pliometrik ringan', 'pelatihan pola jalan'], eval: ['VAS <2', 'dorsofleksi fungsional ≥15°', 'kekuatan betis ≥90% sisi sehat', 'pola jalan normal tanpa kompensasi', 'teknik squat benar', 'skor FAAM/LEFS naik'] },
    'Toe Fracture': { category: 'Muskulo', region: 'Ankle & Kaki', msi_linkage: ['ankle', 'foot'], icd: 'S92.4 / S92.5', codes: 'b280, s750, d450', b: ['b2801 (Nyeri lokal jari kaki)', 'b710 (ROM MTP/IP terbatas)', 'b730 (Kelemahan intrinsik kaki)', 'b760 (Gangguan fase toe-off)'], s: ['s7500 (Tulang phalanges)', 's750 (Sendi MTP & IP)', 's760 (Otot intrinsik/lumbricals)', 's7508 (Jaringan lunak digital)'], d_act: ['d450 (Sulit tumpu berat badan depan)', 'd4501 (Hambatan jalan pola normal)', 'd455 (Nyeri pakai sepatu/jinjit)'], d_part: ['d920 (Hambatan olahraga lari/lompat)'], intervention: ['Edukasi buddy taping / boot', 'kompres dingin', 'latihan aktif jari kaki', 'towel scrunch', 'marble pick-up', 'short foot exercise', 'gait retraining', 'keseimbangan dinamis', 'pliometrik ringan'], eval: ['VAS <2', 'ROM penuh & simetris', 'kekuatan intrinsik ≥90% sisi sehat', 'pola jalan normal (effective toe-off)', 'kembali olahraga tanpa keluhan'] },
    'Achilles Tendinopathy': { category: 'Muskulo', region: 'Ankle & Kaki', msi_linkage: ['ankle', 'foot', 'knee'], icd: 'M76.6', codes: 'b280, s750, d450', b: ['b2801 (Nyeri pada tendon achilles)', 'b730 (Kelemahan otot betis)', 'b710 (ROM dorsifleksi terbatas)', 'b715 (Penebalan/edema tendon)'], s: ['s7500 (Tulang kalkaneus)', 's7502 (Insersi fasia plantar/Tendon achilles)', 's750 (Bursa retrokalkaneal)', 's7500 (Osteofit/tulang tajam)'], d_act: ['d450 (Sulit jalan jauh/berdiri lama)', 'd455 (Nyeri pakai sepatu keras/jinjit)', 'd450 (Pola jalan terganggu)'], d_part: ['d850 (Hambatan aktivitas kerja)'], intervention: ['Edukasi modifikasi sepatu (heel cup)', 'kompres dingin', 'peregangan gastro-soleus & fasia plantar', 'towel scrunch', 'eccentric heel drop', 'keseimbangan dinamis', 'kontrol BB'], eval: ['VAS <2', 'dorsofleksi ≥10°', 'kekuatan jinjit ≥90% sisi sehat', 'pola jalan normal (toe-off baik)', 'skor FAAM naik signifikan'] },
    'Calcaneal Spur & Haglund': { category: 'Muskulo', region: 'Ankle & Kaki', msi_linkage: ['ankle', 'foot'], icd: 'M77.3 / M92.8', codes: 'b280, s750, d450', b: ['b2801 (Nyeri tajam bawah/belakang tumit)', 'b710 (ROM dorsofleksi terbatas)', 'b740 (Ketegangan otot betis)', 'b2801 (Nyeri langkah pertama pagi)'], s: ['s7500 (Tulang kalkaneus)', 's7502 (Insersi fasia plantar/Tendon achilles)', 's750 (Bursa retrokalkaneal)', 's7500 (Osteofit/tulang tajam)'], d_act: ['d450 (Sulit jalan jauh/berdiri lama)', 'd455 (Nyeri pakai sepatu keras/jinjit)', 'd450 (Pola jalan terganggu)'], d_part: ['d850 (Hambatan aktivitas kerja)'], intervention: ['Edukasi modifikasi sepatu (heel cup)', 'kompres dingin', 'peregangan gastro-soleus & fasia plantar', 'towel scrunch', 'eccentric heel drop', 'keseimbangan dinamis', 'kontrol BB'], eval: ['VAS <2', 'dorsofleksi ≥10°', 'kekuatan jinjit ≥90% sisi sehat', 'pola jalan normal (toe-off baik)', 'skor FAAM naik signifikan'] },

    // --- GERIATRI ---
    'OA Lutut + ITBS/Pes Anserine': { category: 'Geriatri', region: 'Lutut', icd: 'M17.1 / M76.3', codes: 'b280, s750, d455', b: ['b2801 (Nyeri medial/lateral akibat beban)', 'b710 (ROM terbatas)', 'b740 (Ketegangan ITB/hamstring)', 'b730 (Kelemahan abduktor panggul)'], s: ['s7502 (Bursa pes anserinus)', 's7501 (ITB)', 's750 (Meniskus)', 's7601 (Otot gluteus medius)', 's7500 (Tibia proksimal)'], d_act: ['d455 (Sulit naik-turun tangga)', 'd450 (Hambatan berdiri lama/jalan jauh)', 'd410 (Nyeri bangkit dari kursi)'], d_part: ['d770 (Gangguan jalan akibat malalignment)'], intervention: ['Cryotherapy', 'edukasi proteksi sendi', 'peregangan ITB & hamstring', 'mobilisasi patela', 'isometrik paha & bokong', 'penguatan abduktor (clamshell)', 'functional circuit', 'kontrol BB'], eval: ['VAS <2', 'ROM fungsional tercapai', 'fleksibilitas jaringan lunak membaik', 'kekuatan otot ≥90% sisi sehat', 'skor WOMAC/KOOS membaik ≥20%'] },

    'Lansia dengan Gangguan Kebugaran': { category: 'Geriatri', region: 'Umum (Geriatri)', msi_linkage: ['general (geriatri)'], icd: 'R54', codes: 'b730, b455, b760, d450, d510', b: ['Penurunan VO2Max (Cardiorespiratory Fitness)', 'Sarcopenia (Penurunan massa & kekuatan otot)', 'Penurunan Fleksibilitas & Keseimbangan', 'Gangguan Koordinasi Neuromuskular', 'Cepat lelah saat aktivitas', 'Risiko Jatuh (TUG > 12 detik)'], s: ['s770 (Struktur Otot: Atrofi/Infiltrasi Lemak)', 'Tulang (Osteopenia/Osteoporosis)', 'Kartilago Sendi (Menipis)', 'Sistem Saraf (Penurunan sel/Neurotransmitter)'], d_act: ['d450 (Kesulitan berjalan jauh/cepat)', 'd410 (Kesulitan transfer duduk-berdiri)', 'd510 (Kesulitan ADL mandiri)', 'Kurangnya aktivitas fisik (Sedentary)'], d_part: ['Hambatan partisipasi sosial/komunitas', 'Penurunan Kualitas Hidup (QoL)', 'Hambatan aktivitas rekreasi'], intervention: ['Senam Lansia (Aerobik Low Impact)', 'Elastic Band Exercise (Strengthening)', 'Walking & Stair Climbing', 'Pilates & Resistance Exercise', 'Balance Exercise (Stork/Single Leg Stance)', 'Functional Training (Circuit Training)', 'Edukasi (Min. 150 menit/minggu)'], eval: ['Upper Body Strength (Hand Dynamometer)', 'Lower Body Strength (30s Sit-to-Stand)', 'Flexibility (Sit-and-Reach)', 'Balance (TUG Test & Stork Test)', 'Cardiorespiratory (6-Min Walk Test)', 'Physical Activity Level (IPAQ)'] },
    'Lansia dengan Gangguan Kardiovaskular': { category: 'Geriatri', region: 'Jantung & Paru', msi_linkage: ['thoracic', 'general (geriatri)'], icd: 'I51.9', codes: 'b410, b420, s410, d450, d230', b: ['b410 (Fungsi Jantung: Palpitasi/Aritmia)', 'b420 (Tekanan Darah: Hipertensi/Hipotensi)', 'b440 (Fungsi Respirasi: Sesak Nafas/Dispnea)', 'Nyeri Dada (Chest Pain/Angina)', 'Orthopnea (Sesak saat berbaring rata)', 'Cepat lelah saat aktivitas (Fatigue)', 'Oedema tungkai'], s: ['s410 (Struktur Jantung: Hipertrofi/Fibrosis)', 's420 (Arteri/Pembuluh Darah: Aterosklerosis)', 'Katup Jantung (Stenosis/Regurgitasi)', 'Mitokondria Jantung (Disfungsi/Penuaan)'], d_act: ['d450 (Kesulitan berjalan jauh/6MWT rendah)', 'd460 (Kesulitan mobilitas di rumah/komunitas)', 'd230 (Kesulitan melakukan rutinitas harian)', 'Intoleransi aktivitas fisik'], d_part: ['Hambatan partisipasi sosial/komunitas', 'Penurunan Kualitas Hidup (QoL)', 'Hambatan produktivitas/pekerjaan'], intervention: ['Aerobic Training (Jalan kaku/Sepeda Statis - Intensitas 60-80% VO2 Peak)', 'Foot Massage Therapy (Relaksasi/Sirkulasi)', 'Monitoring Vital Sign (HR, BP, RR) sebelum & sesudah latihan', 'Breathing Exercise', 'Edukasi Manajemen Faktor Risiko (Merokok, Diet, Stress)'], eval: ['Vital Sign (TD, Nadi, RR) Normal/Terkontrol', 'Six Minute Walking Test (6MWT) meningkat', 'EKG (Irama Jantung) terkontrol', 'Nyeri Dada berkurang (VAS/Borg Scale)', 'Spasme otot berkurang'] },
    'Lansia dengan Gangguan Fleksibilitas': { category: 'Geriatri', region: 'Umum (Geriatri)', msi_linkage: ['general (geriatri)', 'lumbar', 'hip'], icd: 'M25.6', codes: 'b710, s750, s760, d410, d450', b: ['b710 (Keterbatasan Lingkup Gerak Sendi/LGS)', 'Kekakuan sendi (Stiffness)', 'Penurunan fleksibilitas otot (Hamstring/Punggung Bawah)', 'Penurunan produksi cairan sinovial', 'Penurunan tonus otot'], s: ['s750 (Struktur Ekstremitas Bawah)', 's760 (Struktur Trunk/Punggung Bawah)', 'Tulang Rawan Sendi (Penipisan)', 'Ligamen (Kaku/Kurang Elastis)'], d_act: ['d410 (Kesulitan mengubah posisi tubuh dasar)', 'd415 (Kesulitan mempertahankan posisi duduk/berdiri)', 'd450 (Kesulitan berjalan)', 'Gerakan terbatas saat beraktivitas'], d_part: ['Hambatan aktivitas sehari-hari (ADL)', 'Hambatan partisipasi sosial akibat kaku gerak'], intervention: ['Senam Lansia (2-3x seminggu)', 'Static Stretching (Peregangan Statis)', 'PNF (Proprioceptive Neuromuscular Facilitation)', 'Latihan ROM (Range of Motion)', 'Kinesiotaping', 'Edukasi (Gerakan harian rutin)'], eval: ['Sit and Reach Test (Fleksibilitas Punggung & Hamstring)', 'Lingkup Gerak Sendi (LGS)'] },
    'Lansia dengan Gangguan Keseimbangan': { category: 'Geriatri', region: 'Umum (Geriatri)', msi_linkage: ['general (geriatri)', 'ankle', 'knee', 'hip'], icd: 'R29.6', codes: 'b755, b260, s110, d450, d410', b: ['b755 (Gangguan Keseimbangan/Equilibrium)', 'b260 (Gangguan Proprioseptif)', 'b730 (Penurunan Kekuatan Otot/Sarkopenia)', 'b210 (Gangguan Penglihatan/Visual)', 'b235 (Gangguan Vestibular/Pusing)', 'Takut Jatuh (Fear of Falling)', 'Hipotensi Postural/Ortostatik', 'Refleks Proteksi Melambat'], s: ['s110 (Otak/Serebelum/Sistem Saraf Pusat)', 's750 (Struktur Ekstremitas Bawah)', 's760 (Struktur Trunk/Vertebra)', 'Sistem Vestibular (Telinga Dalam)', 'Massa Tulang (Osteoporosis/Osteopenia)'], d_act: ['d450 (Kesulitan berjalan/Gait deviations)', 'd410 (Kesulitan transfer duduk-berdiri)', 'd455 (Kesulitan bergerak di sekitar rintangan)', 'd445 (Kesulitan meraih benda/Reaching)', 'd530 (Kesulitan Toileting/Inkontinensia)'], d_part: ['d920 (Hambatan aktivitas rekreasi)', 'd910 (Hambatan kehidupan komunitas/sosial)', 'Isolasi sosial akibat takut jatuh', 'Hambatan aktivitas ibadah'], intervention: ['Balance Exercise (Tai Chi, Weight shifting, Single leg stance)', 'Strengthening Exercise (Otot Ekstremitas Bawah & Core)', 'Gait Training (Latihan Jalan & Pola Langkah)', 'Stretching Program (Fleksibilitas)', 'Modifikasi Lingkungan (Pencahayaan, Lantai, Grab bar)', 'Edukasi Alas Kaki & Kesehatan Kaki', 'Alat Bantu Jalan (Walker/Cane)'], eval: ['Timed Up and Go Test (TUG)', 'Berg Balance Scale (BBS)', 'Fall Efficacy Scale – International (FES-I)', 'Single Leg Stance Test', 'Blood Pressure Check (Postural Hypotension)'] },
    'Gangguan Aktivitas Fungsional (ADL) Lansia': { category: 'Geriatri', region: 'Umum (Geriatri)', msi_linkage: ['general (geriatri)'], icd: 'R54', codes: 'b730, b455, d510, d520, d530, d540', b: ['b730 (Penurunan Kekuatan Otot/MMT)', 'b755 (Gangguan Keseimbangan - TUG/BBS)', 'b455 (Penurunan Endurance/Toleransi Aktivitas - 6MWT)', 'b280 (Nyeri - VAS)', 'b164 (Penurunan Kognitif - MMSE)', 'Kapasitas Paru Menurun (Spirometri)'], s: ['s7 (Struktur Sistem Muskuloskeletal)', 's1 (Struktur Sistem Saraf)', 's4 (Struktur Sistem Kardiovaskuler & Respirasi)'], d_act: ['d510 (Kesulitan Mandi/Bathing)', 'd550 (Kesulitan Makan/Eating)', 'd540 (Kesulitan Berpakaian/Dressing)', 'd530 (Kesulitan Toileting/BAB/BAK)', 'd410 (Kesulitan Transfer/Berpindah tempat)', 'd450 (Kesulitan Mobilisasi/Berjalan)'], d_part: ['d620 (Kesulitan Belanja/Shopping - IADL)', 'd630 (Kesulitan Menyiapkan Makanan - IADL)', 'd640 (Kesulitan Pekerjaan Rumah - IADL)', 'Hambatan Mengatur Keuangan', 'Hambatan Partisipasi Sosial'], intervention: ['Active Exercise (Latihan Gerak Aktif)', 'Endurance Exercise (Latihan Daya Tahan)', 'ADL Training (Latihan Fungsional Dasar)', 'Balance & Gait Training', 'Strengthening Exercise', 'Energy Conservation Technique'], eval: ['Barthel Index (Skor 0-100)', 'Katz Index of Independence', 'Lawton-Brody IADL Scale', 'MMT & VAS'] },
    'Inkontinensia Urin': { category: 'Geriatri', region: 'Umum (Geriatri)', msi_linkage: ['general (geriatri)'], icd: 'R32', codes: 'b620, s610, d530, d910, d230', b: ['b620 (Gangguan Fungsi Kontrol Urinasi)', 'Keluarnya urin involunter (Stress/Urge)', 'Kelemahan Otot Dasar Panggul', 'Frekuensi & Urgensi berkemih', 'Overdistensi Vesica Urinaria (Retensi)', 'Otot Abdominal Lemah'], s: ['s610 (Struktur Sistem Urinaria: Kandung Kemih/Uretra)', 's760 (Otot Dasar Panggul/Pelvic Floor)', 's120 (Struktur Saraf: Sfingter/Detrusor)'], d_act: ['d530 (Kesulitan Mengontrol BAK/Toileting)', 'Kebocoran urin saat batuk/bersin/tertawa', 'Tidak mampu menahan keinginan BAK (Urge)', 'Ketergantungan pada diapers/pads'], d_part: ['d910 (Hambatan kehidupan komunitas/sosial)', 'Penurunan kepercayaan diri/Isolasi sosial', 'Gangguan kualitas hidup (Cemas/Depresi)', 'Hambatan aktivitas ibadah'], intervention: ['Pelvic Floor Muscle Exercise (Kegel Exercise)', 'Bladder Retraining (Jadwal Berkemih)', 'Electrical Stimulation (ES - Re-edukasi Otot)', 'Core Strengthening (Otot Abdominal)', 'Edukasi Manajemen Cairan (Hindari Kafein)', 'Massage (Relaksasi)'], eval: ['Modified Oxford Scale (Kekuatan Otot Panggul - PERFECT Scheme)', 'Voiding Diary (Catatan Berkemih)', 'Incontinence Severity Index (ISI)', 'The 3 Incontinence Question (3IQ)', 'Pad Test (Tes Pembalut)'] },

    'Lansia dengan Penurunan Kekuatan Otot (Sarkopenia)': { category: 'Geriatri', region: 'Umum (Geriatri)', msi_linkage: ['general (geriatri)', 'hip', 'knee', 'ankle'], icd: 'M62.84', codes: 'b730, b740, s730, s750, d450, d410', b: ['b730 (Penurunan Kekuatan Otot)', 'b740 (Daya Tahan Otot Menurun)', 'Atrofi Otot (Terutama Tipe IIa Fast Twitch)', 'Kelemahan kontraksi otot', 'Penurunan Hormon Anabolik (Testosteron/GH)'], s: ['s730 (Struktur Otot Ekstremitas Atas)', 's750 (Struktur Otot Ekstremitas Bawah)', 's760 (Otot Core/Trunk)', 'Serabut Otot (Berkurang jumlah & ukuran)'], d_act: ['d410 (Kesulitan Transfer: Duduk ke Berdiri)', 'd450 (Kesulitan Berjalan/Antalgic Gait)', 'd455 (Kesulitan Naik Turun Tangga)', 'd415 (Kesulitan Mempertahankan Posisi Tubuh)'], d_part: ['d910 (Hambatan Sosialisasi/Pengajian)', 'd920 (Hambatan Rekreasi)', 'Penurunan Partisipasi Ibadah', 'Keterbatasan aktivitas komunitas'], intervention: ['5 Minutes Walking (Fleksibilitas)', 'Strengthening Lower Limb (Squat/Toe Stand/Step-ups)', 'Strengthening Upper Limb (Wall Push Up/Biceps Curl)', 'Core Strengthening (Pelvic Tilt/Bridging/Cat & Camel)', 'Edukasi Aktivitas Fisik Harian'], eval: ['Physical Activity Scale for Elderly (PASE Score 0-400)', 'MMT (Manual Muscle Testing)', 'Fungsional Berjalan & Transfer'] },
    'Post-Op TKR (Terlambat)': { category: 'Geriatri', region: 'Lutut', msi_linkage: ['knee', 'hip', 'ankle'], icd: 'Z96.65 / M24.66', codes: 'b710, s750, d455', b: ['b710 (Kontraktur fleksi/defisit ekstensi)', 'b280 (Nyeri persisten)', 'b7101 (Fibrosis periartikular)', 'b730 (Atrofi kuadrisep berat)'], s: ['s7502 (Prostesis & Jaringan fibrosa)', 's750 (Patela hipomobil)', 's760 (Otot kuadrisep & hamstring)', 's7308 (Bekas luka parut)'], d_act: ['d455 (Sulit naik-turun tangga)', 'd450 (Jalan pincang/antalgik)', 'd410 (Hambatan jongkok/duduk-berdiri)', 'd540 (Ketergantungan alat bantu)'], d_part: ['d540 (Ketergantungan alat bantu)'], intervention: ['Mobilisasi patela agresif', 'mobilisasi sendi manual', 'peregangan intensif (heel/wall slide)', 'cryotherapy pasca-latihan', 'penguatan kuadrisep/gluteal', 'sit-to-stand', 'sepeda statis'], eval: ['Nyeri minimal, ekstensi 0°, fleksi ≥110°, kekuatan paha ≥90% sisi sehat, jalan tanpa alat bantu, skor WOMAC/KOOS naik ≥20%'] },

    // --- NEUROLOGI ---
    'Post-Op Spine Weakness': { category: 'Neuro', region: 'Tulang Belakang', msi_linkage: ['lumbar', 'thoracic', 'cervical'], icd: 'M62.81 / Z98.890', codes: 'b730, s120, d410', b: ['b730 (Kelemahan otot ekstremitas/postural)', 'b735 (Penurunan tonus otot)', 'b760 (Gangguan koordinasi & jalan)', 'b280 (Nyeri pasca bedah)'], s: ['s120 (Medula spinalis/akar saraf)', 's760 (Otot inti & gluteus)', 's750 (Otot kuadrisep/bahu)', 's7308 (Area luka operasi)'], d_act: ['d410 (Sulit transisi posisi tubuh)', 'd450 (Hambatan jalan tanpa alat bantu)'], d_part: ['d540 (Kesulitan ADL mandiri)', 'd850 (Hambatan kembali kerja/olahraga)'], intervention: ['Napas diafragma', 'isometrik inti', 'quad/glute sets', 'teknik transfer aman', 'mobilisasi area non-op', 'latihan jalan (alat bantu)', 'penguatan progresif', 'keseimbangan dinamis', 'edukasi ergonomi'], eval: ['Nyeri berkurang', 'kekuatan otot naik 1-2 tingkat MMT', 'mampu duduk-berdiri-jalan mandiri', 'ADL aman', 'kembali ke aktivitas ringan'] },


    'Bell\'s Palsy': { category: 'Neuro', region: 'Wajah & TMJ', msi_linkage: ['cervical'], icd: 'G51.0', codes: 'b280, b730, s1105, d330, d550', b: ['Asimetri Wajah (Mencong)', 'Kelemahan/Kelumpuhan otot wajah satu sisi', 'Nyeri belakang telinga (Retroauricular pain)', 'Rasa baal/tebal pada wajah', 'Lagophthalmos (Sulit menutup mata)', 'Penurunan tonus otot (Sisi Lesi)', 'Tightness/Kaku (Sisi Sehat)'], s: ['s1105 (Nervus Facialis / CN VII)', 'Otot-otot Wajah (Facial Muscles)', 'Kanalis Fasialis'], d_act: ['Kesulitan mengunyah/makan', 'Kesulitan berkumur (bocor)', 'Kesulitan menutup mata', 'Kesulitan ekspresi (senyum, angkat alis, bersiul)', 'Gangguan bicara (pelo/sulit konsonan labial)'], d_part: ['Menarik diri dari kegiatan sosial', 'Kurang percaya diri (Masalah estetika)'], intervention: ['Infrared (IR) / MWD / Hotpack', 'Electrical Stimulation (ES)', 'Facial Massage & Manipulation', 'Mirror Exercises (Latihan Cermin)', 'Laser Therapy', 'Neuromuscular Taping', 'Edukasi (Eye patch, Hindari kipas angin)'], eval: ['Ugo Fisch Scale (Skala Fungsional Wajah)', 'Strength Duration Curve (SDC)', 'Kemampuan menutup mata', 'Simetrisitas Wajah'] },
    'Vertigo BPPV': { category: 'Neuro', region: 'Umum (Neuro)', msi_linkage: ['cervical', 'general (neuro)'], icd: 'H81.1', codes: 'b235, b240, s260, d410, d450', b: ['b240 (Sensasi berputar/Vertigo Posisi)', 'b215 (Nistagmus Paroksimal)', 'b235 (Gangguan Fungsi Vestibular)', 'Mual dan Muntah', 'Dix-Hallpike Test (+)', 'Supine Roll Test (+)', 'Gangguan Keseimbangan'], s: ['s260 (Telinga Dalam/Vestibulum)', 'Kanalis Semisirkularis (Posterior/Lateral/Anterior)', 'Otolith (Kalsium Karbonat/Debris)', 'Cupula & Macula'], d_act: ['d410 (Kesulitan mengubah posisi tidur/bangun)', 'Kesulitan menunduk atau melihat ke atas', 'd450 (Kesulitan berjalan lurus/Sempoyongan)', 'Kesulitan berbalik di tempat tidur'], d_part: ['Hambatan bekerja', 'Hambatan aktivitas ibadah (Gerakan Sholat)', 'Hambatan olahraga/rekreasi', 'Hambatan bersosialisasi'], intervention: ['Epley Maneuver (Canalith Repositioning)', 'Semont Maneuver', 'Lempert Maneuver (BBQ Roll)', 'Brandt-Daroff Exercise', 'Cawthorne Cooksey Exercises (Habituasi)', 'Forced Prolonged Position'], eval: ['Vertigo Symptom Scale Short Form (VSS-SF)', 'Romberg Test', 'Negatif Nistagmus pada Re-evaluasi Manuver', 'Frekuensi serangan berkurang'] },

    'Multiple Sclerosis (MS)': { category: 'Neuro', region: 'Umum (Neuro)', msi_linkage: ['general (neuro)', 'hip', 'knee', 'ankle', 'shoulder'], icd: 'G35', codes: 'b730, b735, b770, b260, b140', b: ['b730 (Kelemahan Otot/Paralysis)', 'b735 (Kekakuan/Spastisitas)', 'b770 (Gangguan Pola Jalan/Drop Foot)', 'b260 (Gangguan Sensoris/Paresthesia)', 'b140 (Gangguan Atensi/Memori)', 'Tremor Intensi', 'Nyeri Neuropatik', 'Lhermitte\'s Sign (Sensasi listrik di leher)', 'Gangguan Visual (Diplopia/Optic Neuritis)'], s: ['s110 (Struktur Otak/White Matter)', 's120 (Struktur Medula Spinalis)', 'Selubung Myelin (Demyelinisasi)', 'Oligodendrosit'], d_act: ['d450 (Kesulitan berjalan/Gait deviations)', 'd410 (Kesulitan transfer/duduk-berdiri)', 'd530 (Gangguan kontrol bladder/bowel)', 'd230 (Kesulitan melakukan rutinitas harian)'], d_part: ['d910 (Hambatan kehidupan komunitas)', 'd850 (Hambatan pekerjaan)', 'Isolasi sosial akibat disabilitas'], intervention: ['Aerobic Exercise (Low-Moderate Intensity)', 'Strengthening Exercise', 'Balance & Gait Training', 'Stretching (Manajemen Spastisitas)', 'Fatigue Management (Energy Conservation)', 'Aquatic Therapy (Water-Based Exercise)', 'Pelvic Floor Muscle Training (Bladder Control)'], eval: ['EDSS (Expanded Disability Status Scale)', 'MSFC (Multiple Sclerosis Functional Composite)', 'Modified Ashworth Scale (Spastisitas)', 'Berg Balance Scale (BBS)', '6 Minute Walk Test (Endurance)'] },
    'Drop Hand (Radial Nerve Palsy)': { category: 'Neuro', region: 'Siku & Tangan', msi_linkage: ['elbow', 'shoulder'], icd: 'M21.33', codes: 'b730, b265, s1200, d440, d5', b: ['b730 (Kelemahan Otot Ekstensor Wrist & Jari)', 'b265 (Gangguan Sensoris/Mati rasa sisi Dorsoradial)', 'b280 (Nyeri Lengan/Pergelangan Tangan)', 'Hilangnya Refleks Motorik', 'Ketidakmampuan Ekstensi Wrist (Wrist Drop)'], s: ['s1200 (Nervus Radialis)', 's730 (Otot Triceps & Ekstensor Tangan)', 'Tulang Humerus (Area Fraktur/Spiral Groove)', 'Radiks Saraf C6-C8'], d_act: ['d440 (Kesulitan Menggenggam/Fine hand use)', 'd430 (Kesulitan Mengangkat/Membawa benda)', 'Kesulitan Menulis/Mengetik', 'Kesulitan Toileting & Berpakaian', 'Kesulitan Menyetir'], d_part: ['d850 (Hambatan Pekerjaan)', 'd920 (Hambatan Rekreasi)', 'Hambatan Ibadah'], intervention: ['Electrical Stimulation (ES) untuk Ekstensor', 'Neural Mobilization (Radial Nerve)', 'Static Orthosis / Splinting (Cock-up Splint)', 'Strengthening Exercise (Grip & Wrist Extensor)', 'Active & Passive ROM Exercise', 'Edukasi (Cegah kontraktur & proteksi sendi)'], eval: ['WHDI (Wrist Hand Disability Index)', 'MMT (Kekuatan Otot Ekstensor)', 'VAS (Nyeri)', 'ROM (Goniometer)', 'Sensory Test (Tajam/Tumpul)'] },
    'Parkinson\'s Disease': { category: 'Neuro', region: 'Umum (Neuro)', msi_linkage: ['general (neuro)', 'hip', 'knee', 'ankle'], icd: 'G20', codes: 'b735, b755, b770, s110, d450, d410', b: ['b755 (Tremor Istirahat/Resting Tremor)', 'b735 (Kekakuan/Rigiditas/Katalepsi)', 'b770 (Bradikinesia/Gerakan Lambat)', 'b730 (Kelemahan Otot)', 'Hilangnya Refleks Postural (Instabilitas)', 'Mikrografia (Tulisan mengecil)', 'Wajah Topeng (Hipomimia)', 'Freezing of Gait (Membeku saat melangkah)'], s: ['s110 (Struktur Otak: Ganglia Basalis)', 'Substantia Nigra (Pars Compacta)', 'Neuron Dopaminergik (Defisiensi Dopamin)', 'Lewy Bodies'], d_act: ['d450 (Kesulitan Berjalan/Gait)', 'd410 (Kesulitan Transfer Duduk-Berdiri)', 'd440 (Kesulitan Menulis/Gerakan Halus)', 'd5 (Kesulitan ADL: Makan/Mandi/Berpakaian)', 'd415 (Kesulitan Mempertahankan Posisi Tubuh)'], d_part: ['d910 (Hambatan Bersosialisasi)', 'd850 (Hambatan Pekerjaan)', 'Isolasi Sosial (Depresi/Cemas)', 'Hambatan Komunikasi'], intervention: ['Gait Training (Visual & Auditory Cues)', 'Balance Exercise (Latihan Keseimbangan)', 'Transfer Training (Sit to Stand Strategy)', 'Posture Correction Exercise', 'Stretching & ROM (Mengurangi Rigiditas)', 'Aerobic Exercise (Maintenance)', 'Edukasi (Pencegahan Jatuh & Tetap Aktif)'], eval: ['Timed Up and Go (TUG)', 'Berg Balance Scale (BBS)', 'Dynamic Gait Index (DGI)', 'Five Times Sit and Stand Test (FTSTS)', 'Mini-BESTest', '6 Minute Walk Test (Endurance)', '10 Meter Walk Test'] },
    'Poliomyelitis / Post-Polio Syndrome': { category: 'Neuro', region: 'Umum (Neuro)', msi_linkage: ['general (neuro)', 'hip', 'knee', 'ankle'], icd: 'B91', codes: 'b730, b735, b440, s120, d450, d410', b: ['b730 (Kelemahan Otot/Flaccid Paralysis)', 'b735 (Abnormalitas Tonus/Hipotonus)', 'b780 (Kekakuan/Tightness/Kontraktur)', 'b280 (Nyeri Otot & Sendi)', 'b440 (Gangguan Fungsi Pernafasan)', 'Kelelahan Hebat (Fatigue)', 'Refleks Tendon Menurun/Hilang'], s: ['s1200 (Medula Spinalis - Anterior Horn Cell)', 's750 (Struktur Ekstremitas Bawah)', 's430 (Otot Pernafasan/Diafragma)', 's110 (Batang Otak - Tipe Bulbar)'], d_act: ['d450 (Keterlambatan/Kesulitan Berjalan)', 'd410 (Kesulitan Transfer: Tidur-Duduk-Berdiri)', 'd410 (Kesulitan Posisi Dasar: Squatting, Kneeling)', 'd415 (Keterbatasan Berdiri Stabil)'], d_part: ['d920 (Hambatan Bermain dengan Teman Sebaya)', 'd910 (Hambatan Bersosialisasi)', 'Hambatan Aktivitas Sekolah/Kerja'], intervention: ['Muscle Activation & Strengthening', 'Gait Training (Treadmill/Facilitation)', 'Hydrotherapy (Latihan di Air)', 'Respiratory Muscle Management', 'Pain Management (TENS, Massage, Hot/Cold Pack)', 'Passive Stretching (Cegah Kontraktur)', 'Penggunaan Orthosis (AFO)'], eval: ['MMT / Dynamometer (Kekuatan Otot)', 'Pediatric Balance Scale (PBS)', 'Timed Up and Go Test (TUG)', '10 Meter Walk Test (Kecepatan Jalan)', 'Spirometry / Borg Scale (Pernafasan)', 'VAS (Nyeri)'] },
    'Sindroma Guillain-Barre (SGB)': { category: 'Neuro', region: 'Umum (Neuro)', msi_linkage: ['general (neuro)', 'hip', 'knee', 'ankle'], icd: 'G61.0', codes: 'b730, b735, b280, b440, d450', b: ['b730 (Kelemahan Otot Progresif/Ascending Paralysis)', 'b265 (Parestesia/Kesemutan Kaki ke Lengan)', 'b280 (Nyeri Neuropatik/Otot)', 'b735 (Penurunan Tonus Otot/Hipotonus)', 'b440 (Gangguan Fungsi Pernafasan/Gagal Nafas)', 'b755 (Gangguan Keseimbangan)', 'Hilangnya Refleks Tendon (Areflexia)'], s: ['s120 (Akar Saraf Spinal & Saraf Tepi)', 'Selubung Myelin (Demyelinisasi - AIDP)', 'Akson Saraf (Axonal Damage - AMAN/AMSAN)', 'Saraf Kranial (Disfagia/Disfonia)'], d_act: ['d410 (Kesulitan mengubah posisi: Duduk/Berdiri)', 'd450 (Kesulitan Berjalan)', 'd530 (Kesulitan Toileting)', 'd550 (Kesulitan Makan/Menelan)', 'd415 (Kesulitan Mempertahankan Posisi Tubuh)'], d_part: ['d850 (Hambatan Bekerja)', 'd920 (Hambatan Olahraga/Rekreasi)', 'd930 (Hambatan Ibadah)', 'Hambatan Bersosialisasi'], intervention: ['Breathing Exercise (Manajemen Respirasi)', 'Passive & Active ROM Exercise (Fleksibilitas)', 'Strengthening Exercise (Bertahap)', 'Balance Training (Duduk/Berdiri/Berjalan)', 'Functional ADL Training', 'Electrical Stimulation (ES)', 'Massage & Heating (Manajemen Nyeri)'], eval: ['Manual Muscle Testing (MMT)', 'Visual Analog Scale (VAS - Nyeri)', 'Functional Reach Test (FRT - Keseimbangan)', 'Timed Up and Go Test (TUGT)', '6 Minute Walk Test (6MWT)', 'Spirometry (Fungsi Kardiopulmonal)'] },
    'Stroke (Cerebrovascular Accident)': { category: 'Neuro', region: 'Umum (Neuro)', msi_linkage: ['general (neuro)', 'shoulder', 'hip', 'knee', 'ankle'], icd: 'I64', codes: 'b730, b735, b770, s110, d450, d5', b: ['b730 (Kelemahan Otot/Hemiparesis/Hemiplegia)', 'b735 (Spastisitas/Hipertonus)', 'b770 (Gangguan Pola Jalan/Gait Deviation)', 'b760 (Gangguan Gerak Volunter/Koordinasi)', 'b260 (Gangguan Sensorik/Proprioseptif)', 'Gangguan Kognitif & Bicara (Afasia/Disartria)', 'Defisit Lapang Pandang (Hemianopsia)'], s: ['s110 (Struktur Otak: Korteks/Batang Otak)', 's120 (Saraf Kranial & Spinal)', 'Pembuluh Darah Otak (Arteri/Vena)'], d_act: ['d450 (Kesulitan Berjalan/Mobilisasi)', 'd410 (Kesulitan Transfer: Tidur-Duduk-Berdiri)', 'd5 (Ketergantungan ADL: Makan/Mandi/Toileting)', 'd440 (Gangguan Fungsi Tangan/Fine Motor)', 'd415 (Kesulitan Mempertahankan Posisi Tubuh)'], d_part: ['d850 (Hambatan Kembali Bekerja)', 'd910 (Hambatan Sosialisasi)', 'Perubahan Peran dalam Keluarga'], intervention: ['Task-Oriented Training (ADL)', 'Gait & Balance Training (Facilitation)', 'Postural Control Exercise (Core Stability)', 'Strengthening & Muscle Activation (Lower/Upper Limb)', 'Spasticity Management (Stretching/Positioning)', 'Endurance Training (Aerobic)', 'Edukasi (Home Program & Modifikasi Lingkungan)'], eval: ['NIHSS (Derajat Defisit Neurologis)', 'Barthel Index (Kemandirian Fungsional)', 'Timed Up and Go Test (Mobilitas/Keseimbangan)', '6 Minute Walk Test (Daya Tahan)', 'Modified Ashworth Scale (Spastisitas)'] },
    'Space Occupying Lesion (SOL) Cerebri': { category: 'Neuro', region: 'Kepala & Leher', msi_linkage: ['general (neuro)', 'hip', 'knee', 'ankle'], icd: 'R90.0', codes: 'b770, b735, b760, s110, d450, d410', b: ['b770 (Gangguan Pola Jalan/Ataksia)', 'b735 (Gangguan Tonus Otot/Spastisitas)', 'b760 (Gangguan Gerak Volunter/Hemiparesis)', 'Sakit Kepala (Memburuk saat batuk/valsava)', 'Kejang (Seizure)', 'Gangguan Kognitif/Perubahan Kepribadian', 'Gangguan Penglihatan (Hemianopia/Diplopia)', 'Mual & Muntah (Peningkatan TIK)'], s: ['s110 (Struktur Otak: Lobus Frontal/Temporal/Occipital)', 'Cerebellum (Jika Ataksia)', 'Sistem Ventrikel (Jika Hidrosefalus)', 'Meninges'], d_act: ['d450 (Kesulitan Berjalan/Gait Deviation)', 'd4104 (Kesulitan Berdiri Stable/Stability)', 'd440 (Gangguan Koordinasi Gerak Halus)', 'Kesulitan ADL (Makan/Mandi/Berpakaian)'], d_part: ['Hambatan Bekerja/Produktivitas', 'Hambatan Bersosialisasi', 'Ketergantungan pada Caregiver/Keluarga'], intervention: ['Proper Bed Positioning (Head up/Miring)', 'Passive & Active Mobilization', 'Balance & Coordination Training', 'Gait Training (Fasilitasi Berjalan)', 'Muscle Activation & Strengthening', 'Aerobic Capacity Training', 'Edukasi (Hindari Valsava/Mengejan)'], eval: ['GCS (Tingkat Kesadaran)', 'Berg Balance Scale (BBS)', 'Timed Up and Go Test (TUG)', '6 Minute Walk Test (Daya Tahan)', 'Gait Analysis', 'Vital Sign Monitoring (Waspada TIK)'] },
    'Spinal Cord Injury (SCI) - Traumatic/Post-Op': { 
        category: 'Neuro', region: 'Tulang Belakang', msi_linkage: ['general (neuro)', 'hip', 'knee', 'ankle'], icd: 'S14, S24, S34', codes: 'b280, b620, s120, d420, d450', 
        b: ['b280 (Nyeri Tulang Belakang/Neuropatik)', 'b730 (Tetraplegia/Paraplegia)', 'b270 (Gangguan Sensibilitas)', 'b620 (Gangguan BAB/BAK)', 'b735 (Spastisitas)', 'Gangguan Fungsi Otonom'], 
        s: ['s120 (Medula Spinalis & Struktur Vertebra)', 'Otot-otot Anggota Gerak (Atrofi/Spastisitas)', 's760 (Struktur Trunk/Batang Tubuh)'], 
        d_act: ['d420 (Transferring Oneself)', 'd450 (Walking/Ambulasi)', 'd530 (Gangguan Toileting/Self-care)', 'd440 (Gangguan Penggunaan Tangan)'], 
        d_part: ['d910 (Community Life)', 'd920 (Recreation/Leisure)', 'd850 (Hambatan Bekerja/Produktif)'], 
        intervention: ['Breathing Exercise', 'Positioning (Cegah Dekubitus)', 'Passive & Active Mobilization', 'Strengthening Otot Terinervasi', 'Bladder & Bowel Retraining', 'Transfer & Wheelchair Training', 'Verticalization'], 
        eval: ['ASIA Impairment Scale', 'Barthel Index / SCIM', 'Modified Ashworth Scale (MAS)', 'Nyeri (VAS/NPRS)'] 
    },

    // --- SPORT INJURY ---
    'Sport Specific Performance / RTS': { 
        category: 'Sport', region: 'Umum', icd: 'Z02.5', codes: 'd920, b760', 
        b: ['b760 (Gangguan kontrol motorik spesifik)', 'b2801 (Nyeri sisa saat intensitas tinggi)', 'Penurunan power/agility'], 
        s: ['Sistem Muskuloskeletal'], 
        d_act: ['d9201 (Hambatan kembali ke kompetisi)'], 
        d_part: ['d920 (Partisipasi olahraga kompetitif)'], 
        intervention: ['Agility drills (Ladder/Cone)', 'Plyometrics', 'Sport-specific simulation', 'Mental readiness training'], 
        eval: ['Lulus kriteria Return to Sport', 'Hop test ≥90% simetris'] 
    },

    // --- PEDIATRI ---
    'Cerebral Palsy (CP)': { 
        category: 'Pediatri', region: 'Umum (Pediatri)', icd: 'G80.9', codes: 'b735, b730, s110, d450', 
        b: ['b735 (Spastisitas)', 'b730 (Kelemahan Otot)', 'b760 (Gangguan Koordinasi)', 'Pola jalan abnormal'], 
        s: ['s110 (Struktur Otak)', 'Otot & Rangka (Kontraktur/Deformitas)'], 
        d_act: ['d450 (Keterlambatan Berjalan)', 'd420 (Transferring)', 'Kemandirian fungsional terbatas'], 
        d_part: ['d760 (Hubungan Keluarga)', 'e460 (Bermain dengan Teman)', 'Partisipasi Sekolah'], 
        intervention: ['NDT / Bobath', 'Strengthening Core', 'Manajemen Spastisitas', 'Edukasi Orang Tua'], 
        eval: ['GMFCS Level', 'Modified Ashworth Scale', 'Denver II', 'GMFM Score'] 
    },
    'Down Syndrome': { 
        category: 'Pediatri', region: 'Umum (Pediatri)', icd: 'Q90', codes: 'b730, b735, s110, d450', 
        b: ['b730 (Hipotonus/Lemas)', 'Hipermobilitas Sendi', 'Keterlambatan Motorik & Bicara', 'IQ Rendah'], 
        s: ['s110 (Struktur Otak)', 'Kromosom 21', 'Kelainan Jantung Bawaan (seringkali)'], 
        d_act: ['d450 (Keterlambatan Berjalan)', 'd420 (Transferring)', 'Kesulitan ADL'], 
        d_part: ['d760 (Hubungan Keluarga)', 'Partisipasi Sosial/Sekolah'], 
        intervention: ['NDT / Sensory Integration', 'Strengthening Exercise', 'Early Intervention', 'Edukasi Orang Tua'], 
        eval: ['GMFM Score', 'Denver II', 'Assessment Tonus Otot'] 
    },
    'Autism Spectrum Disorder (ASD)': { 
        category: 'Pediatri', region: 'Umum (Pediatri)', icd: 'F84.0', codes: 'b730, b152, s110, d720', 
        b: ['Gangguan Komunikasi & Interaksi', 'Perilaku Berulang', 'Gangguan Integrasi Sensorik', 'Hipotonus Postural'], 
        s: ['s110 (Struktur Otak)', 'Sistem Limbik'], 
        d_act: ['d720 (Interaksi Interpersonal)', 'Jalan Jinjit/Toe Walking', 'Koordinasi Mata-Tangan Lemah'], 
        d_part: ['d760 (Hubungan Keluarga)', 'Hambatan Sekolah/Sosial'], 
        intervention: ['Sensory Integration', 'Play Therapy', 'Postural Control Training', 'Edukasi Orang Tua'], 
        eval: ['CARS Score', 'GARS Score', 'Sensory Profile'] 
    },
    'Torticolis (Congenital)': { 
        category: 'Pediatri', region: 'Kepala & Leher', icd: 'M43.6', codes: 'b735, s710, d450', 
        b: ['b735 (Kontraktur SCM)', 'Keterbatasan ROM Leher', 'Asimetri Wajah/Plagiocephaly', 'Elevasi Bahu'], 
        s: ['s7104 (Otot SCM)', 'Vertebra Servikal'], 
        d_act: ['Kesulitan Menoleh', 'Kesulitan Menyusu', 'Keterlambatan Motorik Kasar'], 
        d_part: ['Gangguan Tidur', 'Interaksi Visual Asimetris'], 
        intervention: ['Stretching SCM', 'Positioning (Tummy Time)', 'Myofascial Release', 'Edukasi Orang Tua'], 
        eval: ['ROM Leher', 'MFS (Muscle Function Scale)', 'Asimetri Plagiocephaly'] 
    },
    'Congenital Dislocation of Hip (DDH)': { 
        category: 'Pediatri', region: 'Panggul (Hip)', icd: 'Q65.2', codes: 'b715, s750, d450', 
        b: ['b715 (Instabilitas Sendi)', 'Tes Barlow/Ortolani (+)', 'Asimetri Lipatan Paha', 'Beda Panjang Tungkai'], 
        s: ['s75001 (Acetabulum/Caput Femur)', 'Ligamen Hip'], 
        d_act: ['d450 (Pola Jalan Pincang)', 'Keterlambatan Berjalan', 'Kesulitan Rolling'], 
        d_part: ['Hambatan Bermain', 'Keterlambatan Kemandirian'], 
        intervention: ['Pavlik Harness Education', 'Hip Abduction Bracing', 'Stretching Adductor', 'Edukasi Handling'], 
        eval: ['Tes Barlow/Ortolani', 'X-Ray / USG Check', 'Galeazzi Sign'] 
    },
    'Flat Foot (Pes Planus) - Anak': { 
        category: 'Pediatri', region: 'Pergelangan Kaki & Kaki', icd: 'M21.4', codes: 'b715, b730, s750, d450', 
        b: ['b715 (Hilangnya Arcus)', 'b730 (Kelemahan Tibialis Posterior)', 'Cepat Lelah saat Jalan'], 
        s: ['s75021 (Arcus Longitudinal)', 'Fasia Plantar'], 
        d_act: ['d450 (Pola Jalan Abnormal)', 'Gangguan Keseimbangan'], 
        d_part: ['Hambatan Olahraga/Bermain'], 
        intervention: ['Short Foot Exercise', 'Toe Curl / Marble Pick-up', 'Insole/Arch Support', 'Strengthening Betis'], 
        eval: ['Clarke\'s Angle', 'Feiss Line Test', 'Wet Test (Footprint)'] 
    },
    'Scoliosis - Anak': { 
        category: 'Pediatri', region: 'Punggung (Back)', icd: 'M41', codes: 'b715, s760, d450', 
        b: ['Kurva Lateral Tulang Belakang', 'Asimetri Bahu/Pelvis', 'Rib Hump (Adam Test)', 'Imbalance Otot'], 
        s: ['s760 (Struktur Vertebra)', 'Costa/Rusuk'], 
        d_act: ['d450 (Postur Tubuh Asimetris)', 'Hambatan Gerak Punggung'], 
        d_part: ['Masalah Citra Tubuh', 'Hambatan Aktivitas Berat'], 
        intervention: ['Schroth Method / Stabilization', 'Breathing Exercise', 'Bracing Education', 'Core Strengthening'], 
        eval: ['Cobb Angle (X-Ray)', 'Adam Bending Test', 'Scoliometer'] 
    },
    'Erb\'s Palsy': { 
        category: 'Pediatri', region: 'Bahu', icd: 'G54.0', codes: 'b730, s720, d410', 
        b: ['b730 (Lumpuh Lengan Atas C5-C6)', 'Waiter\'s Tip Position', 'Refleks Moro (-) Sisi Sakit', 'Atrofi Otot Bahu'], 
        s: ['s720 (Pleksus Brakialis)', 'Otot Deltoid/Biceps'], 
        d_act: ['d410 (Sulit Rolling)', 'd440 (Sulit Memegang Mainan)', 'Hand to mouth (+) sulit'], 
        d_part: ['Hambatan Bermain (Bimanual)', 'Masalah Tumbuh Kembang'], 
        intervention: ['Passive ROM', 'Sensory Stimulation', 'Electrical Stimulation', 'Edukasi Handling'], 
        eval: ['MMT Bayi', 'Sensory Test', 'Antropometri Lengan'] 
    },
    'Osgood-Schlatter (Pediatrik)': { 
        category: 'Pediatri', region: 'Lutut', icd: 'M92.5', codes: 'b280, s750, d920', 
        b: ['b2801 (Nyeri Tuberositas Tibia)', 'Bengkak lokal', 'Nyeri saat lari/lompat/tangga'], 
        s: ['s7500 (Tuberositas Tibia)', 'Apofisis'], 
        d_act: ['d9201 (Hambatan Olahraga)', 'd455 (Nyeri Tangga)'], 
        d_part: ['Hambatan Aktivitas Sekolah'], 
        intervention: ['Load Management', 'Cryotherapy', 'Stretching Quadriceps', 'Taping'], 
        eval: ['VAS Score', 'Kembali Berolahraga'] 
    },
    'Bayi Prematur & Respiratory Distress': { 
        category: 'Pediatri', region: 'Umum (Pediatri)', icd: 'P07 / P22', codes: 'b440, b510, s430, d410', 
        b: ['Sesak Napas / Grunting', 'Retraksi Dinding Dada', 'Hipotonus', 'Refleks Menghisap Lemah'], 
        s: ['s430 (Paru Imatur)', 's110 (Otak Imatur)'], 
        d_act: ['d410 (Kontrol Kepala Lemah)', 'd560 (Sulit Menghisap/Menelan)', 'Gangguan Menangis'], 
        d_part: ['Hambatan Bonding Orang Tua', 'Tergantung Alat Bantu'], 
        intervention: ['Chest Physiotherapy Neonates', 'Kangaroo Mother Care (KMC)', 'Oral Motor Stimulation', 'Positioning'], 
        eval: ['Downes Score', 'Saturasi Oksigen (SpO2)', 'NOMAS Score'] 
    },

    // --- KARDIO & RESPIRASI ---
    'Sinusitis (Akut & Kronis)': { category: 'Kardio', region: 'Kepala & Leher', msi_linkage: ['cervical', 'thoracic'], icd: 'J01, J32', codes: 'b280, b440, b255, s310, d230, d640, d920', b: ['b280 (Nyeri Wajah/Sinus)', 'b440 (Respirasi/Kesulitan Bernafas)', 'b255 (Gangguan Penghidu/Penciuman)', 'Hidung Tersumbat/Obstruksi', 'Sekresi Mukus Mukopurulen/Kental', 'Edema & Hiperemi Konka'], s: ['s310 (Struktur Hidung & Sinus Paranasal)', 'Sinus Maksila/Frontal/Etmoid/Sphenoid', 'Mukosa Hidung'], d_act: ['Penurunan toleransi aktivitas fisik', 'Kesulitan bernafas saat aktivitas', 'Gangguan aktivitas fungsional harian'], d_part: ['d640 (Hambatan pekerjaan rumah tangga)', 'd920 (Hambatan olahraga/rekreasi)', 'Gangguan istirahat/tidur akibat sumbatan'], intervention: ['Manual Drainage Sinus (Maksila & Frontal)', 'Suboccipital Release', 'Ultrasound Therapy (Continuous 1 MHz)', 'Short Wave Diathermy (SWD - Cross fire)', 'Nasal Irrigation (Bilas air garam - Edukasi)', 'Edukasi (Stop merokok & hindari alergen)'], eval: ['Visual Analogue Scale (VAS - Nyeri Wajah)', 'Pressure Algometer (Ambang Nyeri Tekan)', 'Vital Sign (Tekanan Darah, Nadi, Suhu, RR)', 'Kualitas Mukus/Sekret'] },
    'Asma Bronkial (Asthma)': { category: 'Kardio', region: 'Dada (Chest)', msi_linkage: ['thoracic', 'cervical'], icd: 'J45, J45.90', codes: 'b4400, b4401, b4402, s430, d450, d640', b: ['b440 (Sesak napas/Dyspnea)', 'Mengi (Wheezing)', 'Batuk (terutama malam/dini hari)', 'Dada terasa berat (Chest tightness)', 'Hiperreaktivitas jalan napas', 'Penurunan FEV1 & PEF', 'Hiperventilasi'], s: ['s430 (Struktur Sistem Pernafasan)', 'Dinding Bronkus (Inflamasi/Edema)', 'Otot Polos Saluran Nafas (Spasme)', 'Kelenjar Mukosa (Hipersekresi)', 'Sangkar Thoraks (Deformitas pada kasus kronis)'], d_act: ['Penurunan toleransi aktivitas fisik', 'Keterbatasan aktivitas fungsional harian', 'Cepat lelah saat aktivitas'], d_part: ['d640 (Hambatan pekerjaan rumah tangga)', 'Hambatan partisipasi olahraga', 'Hambatan aktivitas rekreasi'], intervention: ['Breathing Control (Pursed Lip Breathing)', 'Diaphragmatic Breathing Exercise', 'Airway Clearance (ACBT, Autogenic Drainage)', 'Postural Drainage & Batuk Efektif', 'Positioning (Forward Lean)', 'Aerobic Exercise (Peningkatan toleransi)', 'Edukasi (Hindari pencetus/allergen)'], eval: ['Spirometry / Peak Flow Meter (FEV1, PEF)', 'Borg Scale / VAS / MRC (Skala Sesak)', 'Asthma Control Questionnaire (ACQ)', '6 Minute Walk Test (6MWT)', 'Auskultasi (Wheezing)'] },
    'Penyakit Paru Obstruksi Kronis (PPOK)': { category: 'Kardio', region: 'Dada (Chest)', msi_linkage: ['thoracic', 'lumbar'], icd: 'J44.9', codes: 'b440, b445, b455, s430, s760, d450, d410', b: ['b440 (Sesak Nafas/Dyspnea)', 'b455 (Penurunan Toleransi Aktivitas)', 'b445 (Gangguan Otot Respirasi)', 'Batuk Produktif (Kronis)', 'Pola Nafas Pursed Lip Breathing', 'Ekspirasi Memanjang', 'Mengi (Wheezing) & Ronki'], s: ['s430 (Struktur Sistem Pernafasan)', 's760 (Struktur Trunk - Barrel Chest)', 'Saluran Nafas (Inflamasi/Penyempitan)', 'Otot Bantu Nafas (Hipertropi/Overuse)'], d_act: ['d450 (Kesulitan Berjalan)', 'd410 (Kesulitan Mengubah Posisi Tubuh)', 'Penurunan toleransi aktivitas fisik'], d_part: ['Hambatan pekerjaan rumah tangga', 'Hambatan partisipasi olahraga'], intervention: ['Breathing Control (Pursed Lips Breathing/PLB)', 'Diaphragmatic Breathing Exercise (DBE)', 'Chest Physiotherapy (Postural Drainage/Batuk Efektif)', 'Aerobic Exercise (Jalan/Jogging/Sepeda)', 'Respiratory Muscle Training', 'Massage (Relaksasi Otot Bantu Nafas)', 'Edukasi Berhenti Merokok'], eval: ['Spirometry (FEV1/FVC)', 'Borg Scale / MRC Scale (Sesak)', '6 Minute Walk Test (6MWT)', 'Sangkar Thoraks (Meterline)'] },
    'Bedah Thoraks (Thoracic Surgery Rehabilitation)': { category: 'Kardio', region: 'Dada (Chest)', msi_linkage: ['thoracic', 'scapula', 'cervical'], icd: 'I97.0', codes: 'b440, b455, b280, s430, s410, d450, d230', b: ['b440 (Fungsi Respirasi/Pola Nafas)', 'b455 (Toleransi Aktivitas/Endurance)', 'b280 (Nyeri Pasca Operasi/Insisi)', 'Penurunan Fungsi Sirkulasi', 'Cemas/Status Emosional', 'Akumulasi Sekret (Sputum)', 'Keterbatasan Ekspansi Thoraks'], s: ['s430 (Struktur Sistem Pernafasan - Paru)', 's410 (Struktur Sistem Kardiovaskuler - Jantung)', 'Dinding Thoraks (Sternum/Ribs/Otot Intercostal)', 'Luka Insisi (Thoracotomy/Sternotomy)'], d_act: ['Penurunan toleransi aktivitas fisik', 'Kesulitan mobilisasi dini (duduk/berdiri)', 'Keterbatasan gerak bahu/trunk (akibat nyeri)', 'Kesulitan batuk efektif'], d_part: ['Gangguan pekerjaan rumah tangga', 'Hambatan partisipasi olahraga', 'Keterlambatan kembali bekerja'], intervention: ['Deep Breathing Exercise (DBE)', 'Active Cycle of Breathing Technique (ACBT)', 'Incentive Spirometry', 'Airway Clearance (Huffing/Supported Cough)', 'Early Mobilization (Duduk/Jalan)', 'Pain Management (TENS/Cryotherapy)', 'Positioning (Semi-fowler/High side lying)', 'Shoulder & Thoracic Mobility Exercise'], eval: ['Spirometry (Fungsi Paru)', 'Saturasi Oksigen (SpO2)', '6 Minute Walk Test (6MWT - Daya Tahan)', 'Ekspansi Dada (Meterline)', 'Visual Analogue Scale (VAS - Nyeri)', 'Vital Sign (HR, BP, RR)'] },
    'Pneumonia': { category: 'Kardio', region: 'Dada (Chest)', msi_linkage: ['thoracic', 'cervical'], icd: 'J18.9, J18.0', codes: 'b440, b445, b455, b280, s430, d450, d410', b: ['b440 (Sesak Nafas/Dyspnea)', 'b455 (Penurunan Toleransi Aktivitas)', 'b445 (Gangguan Otot Bantu Nafas)', 'Batuk Produktif (Purulent/Mucoid)', 'Nyeri Dada (Pleuritic Pain)', 'Suara Nafas Bronkial & Ronki', 'Demam & Menggigil'], s: ['s430 (Struktur Sistem Pernafasan - Parenkim Paru)', 'Alveoli (Konsolidasi/Cairan)', 'Bronkiolus Respiratorius'], d_act: ['Penurunan toleransi aktivitas fisik', 'Keterbatasan aktivitas fungsional', 'Kesulitan mobilisasi (akibat sesak/lelah)'], d_part: ['Hambatan pekerjaan rumah tangga', 'Hambatan partisipasi olahraga', 'Gangguan istirahat/tidur akibat batuk'], intervention: ['Chest Physiotherapy (Postural Drainage/Clapping/Vibrating)', 'Active Cycle of Breathing Technique (ACBT)', 'Incentive Spirometry', 'Inhalasi / Nebulizer', 'Breathing Exercise (Relaxation)', 'Thoracic Mobilization', 'Early Mobilization (Bed Exercise)', 'Suction (Jika perlu)'], eval: ['Auskultasi (Suara Nafas/Ronki/Sputum)', 'Borg Scale / VAS (Sesak & Nyeri)', 'Spirometry (Fungsi Paru)', '6 Minute Walk Test (6MWT)', 'Ekspansi Thoraks (Meterline)', 'Vital Sign (Suhu, RR, SpO2)'] },
    'Emphysema (Emfisema)': { category: 'Kardio', region: 'Dada (Chest)', msi_linkage: ['thoracic', 'cervical', 'lumbar'], icd: 'J43', codes: 'b440, b455, b445, s430, d450, d410', b: ['b440 (Sesak Nafas/Dyspnea)', 'b455 (Penurunan Toleransi Aktivitas)', 'b445 (Ketegangan Otot Pernafasan)', 'Batuk Kronis', 'Ekspirasi Memanjang (Prolonged Expiration)', 'Sianosis (Bibir & Kuku Biru)', 'Suara Nafas Menurun'], s: ['s430 (Struktur Alveoli - Kerusakan Dinding)', 's760 (Struktur Thoraks - Hiperinflasi)', 'Diafragma (Datar/Low Flat Diaphragm)', 'Rongga Udara Asinus (Melebar)'], d_act: ['Penurunan toleransi aktivitas fisik', 'd450 (Kesulitan Berjalan Jarak Jauh)', 'Cepat lelah saat aktivitas harian'], d_part: ['Hambatan pekerjaan rumah tangga', 'Hambatan partisipasi olahraga', 'Gangguan aktivitas sosial akibat sesak'], intervention: ['Breathing Exercise (Pursed Lip/Diaphragmatic)', 'Active Cycle of Breathing Technique (ACBT)', 'Chest Physiotherapy (Postural Drainage)', 'Thoracic Mobilization (Mobilisasi Thoraks)', 'Incentive Spirometry', 'Latihan Batuk Efektif/Huffing', 'Relaxation Technique', 'Edukasi (Berhenti Merokok & APD Masker)'], eval: ['Spirometry (FEV1/FVC, Volume Residu)', 'Borg Scale / VAS / MRC (Skala Sesak)', '6 Minute Walk Test (6MWT - Toleransi Aktivitas)', 'Ekspansi Thoraks (Meterline)', 'Auskultasi (Suara Nafas)'] },
    'Tuberkulosis Paru (TB Paru)': { category: 'Kardio', region: 'Dada (Chest)', msi_linkage: ['thoracic', 'cervical', 'lumbar'], icd: 'A15', codes: 'b440, b455, b445, b280, s430, d450, d230', b: ['b440 (Sesak Nafas/Dyspnea)', 'b455 (Penurunan Toleransi Aktivitas)', 'b445 (Spasme Otot Bantu Nafas: SCM)', 'b280 (Nyeri Dada Pleuritik)', 'Batuk Produktif (Kronis/Hemoptisis)', 'Demam & Berkeringat Malam', 'Clubbing Finger (Jari Tabuh)'], s: ['s430 (Struktur Parenkim Paru)', 'Alveoli (Eksudat/Granuloma)', 'Kavitas (Reaktifasi)', 'Jaringan Parut/Fibrosis'], d_act: ['Penurunan toleransi aktivitas fisik (Kelelahan)', 'Kesulitan berjalan jarak jauh (d450)', 'Gangguan aktivitas harian (ADL)'], d_part: ['Hambatan pekerjaan rumah tangga', 'Hambatan partisipasi olahraga', 'Isolasi sosial (Fase Penularan)'], intervention: ['Breathing Exercise (Inspiratory Breathing)', 'Thoracic Mobilization (Mobilisasi Thoraks)', 'Airway Clearance (Batuk Efektif)', 'Stretching & Massage (Otot SCM/Spasme)', 'Aerobic Exercise (Peningkatan Toleransi)', 'Heating (Relaksasi Otot)', 'Edukasi (Etika Batuk/PHBS)'], eval: ['Ekspansi Thoraks (Antropometri/Meterline)', 'Borg Scale (Skala Sesak)', '6 Minute Walk Test (6MWT)', 'Muscle Length Test (Panjang Otot)', 'Spirometry (Fungsi Paru)'] },
    'Edema Paru (Pulmonary Edema)': { category: 'Kardio', region: 'Dada (Chest)', msi_linkage: ['thoracic', 'cervical'], icd: 'J81', codes: 'b440, b455, b445, b280, s430, d450, d230', b: ['b440 (Sesak Nafas/Dyspnea)', 'b455 (Penurunan Toleransi Aktivitas)', 'b445 (Disfungsi Otot Pernafasan)', 'Abnormal Breathing Pattern', 'Penurunan Ekspansi Sangkar Thoraks', 'Hemoptisis (Sputum Pink/Berbusa)', 'Nyeri Dada & Kecemasan'], s: ['s430 (Struktur Paru - Alveoli)', 'Interstisial Paru (Cairan Serosa)', 'Kapiler Paru (Peningkatan Permeabilitas/Tekanan)'], d_act: ['Penurunan toleransi aktivitas fisik', 'd450 (Kesulitan Berjalan Jarak Jauh)', 'Kesulitan mobilisasi (akibat sesak/lelah)'], d_part: ['Hambatan pekerjaan rumah tangga', 'Hambatan partisipasi olahraga', 'Gangguan istirahat/tidur akibat ortopnea'], intervention: ['Breathing Exercise (Pursed Lip/Diaphragmatic)', 'Thoracic Expansion Exercise', 'Active Exercise (Otot Pernafasan)', 'Stretching (Otot Pernafasan)', 'Aerobic Exercise (Peningkatan Toleransi)', 'Heating (Relaxation/Nyeri)', 'Positioning (Semi-Fowler/Orthopneic Position)'], eval: ['Spirometry (Volume & Kapasitas Paru)', 'Borg Scale / VAS / MRC (Skala Sesak)', 'Mobilitas Sangkar Thoraks (Meterline)', 'Muscle Length Test (Panjang Otot)', 'Vital Sign (HR, RR, SpO2)'] },
    'Efusi Pleura (Pleural Effusion)': { category: 'Kardio', region: 'Dada (Chest)', icd: 'J90', codes: 'b440, b445, b280, s430, d450, d230', b: ['b440 (Sesak Nafas/Dyspnea)', 'b280 (Nyeri Dada Pleuritik)', 'b445 (Spasme Otot Bantu Nafas: Pectoralis/SCM)', 'Batuk Kering (Non-produktif)', 'Penurunan Bunyi Nafas & Fremitus', 'Penurunan Ekspansi Thoraks', 'Perkusi Redup'], s: ['s430 (Rongga Pleura/Kavum Pleura)', 'Pleura Viseral & Parietal', 'Otot Pectoralis & Sternocleidomastoideus', 'Sistem Limfatik Paru'], d_act: ['d450 (Kesulitan Berjalan Jarak Jauh)', 'Penurunan toleransi aktivitas fisik', 'Kesulitan menarik nafas dalam'], d_part: ['Hambatan pekerjaan rumah tangga', 'Hambatan partisipasi olahraga', 'd850 (Hambatan Bekerja)'], intervention: ['Thoracic Expansion Exercise', 'Deep Breathing Exercise', 'Incentive Spirometry', 'Manual Lymphatic Drainage (MLD)', 'Thoracic Mobilization', 'Massage & Stretching (Otot Pernafasan)', 'Edukasi (Posisi & Kontrol Infeksi)'], eval: ['Ekspansi Thoraks (Meterline)', 'Borg Scale (Skala Sesak)', 'Spirometry (Volume Paru)', 'Muscle Length Test (Otot Bantu Nafas)', 'Auskultasi & Perkusi'] },
    'Cystic Fibrosis': { category: 'Kardio', region: 'Dada (Chest)', icd: 'E84', codes: 'b440, b445, b455, s430, s550, d450, d640', b: ['b440 (Sesak Nafas/Dyspnea)', 'b455 (Cepat Lelah/Fatigue)', 'b445 (Disfungsi Otot Pernafasan)', 'Batuk Produktif (Sputum Kental/Lengket)', 'Mengi (Wheezing)', 'Penurunan Berat Badan (Malabsorbsi)', 'Nyeri Dada', 'Infeksi Saluran Nafas Berulang'], s: ['s430 (Struktur Paru & Bronkus)', 's550 (Pankreas - Insufisiensi)', 'Saluran Nafas (Obstruksi Mukus)', 'Kelenjar Keringat (Kadar Garam Tinggi)'], d_act: ['d450 (Kesulitan Berjalan Jarak Jauh)', 'Penurunan toleransi aktivitas fisik', 'Kesulitan melakukan pekerjaan rumah'], d_part: ['d640 (Hambatan pekerjaan rumah tangga)', 'Hambatan partisipasi olahraga', 'Gangguan pertumbuhan (pada anak)'], intervention: ['Airway Clearance (Chest PT, Postural Drainage)', 'Latihan Batuk Efektif & Huffing', 'Incentive Spirometry', 'Breathing Exercise', 'Aerobic Exercise (Daya Tahan Jantung Paru)', 'Active Exercise (Mobilitas Thoraks/Upper Limb)', 'Inhalasi / Nebulizer', 'Suction (Jika perlu)'], eval: ['Spirometry (Volume & Kapasitas Paru)', 'Borg Scale (Skala Sesak)', 'Antropometri Sangkar Thoraks (Ekspansi)', 'Indeks Massa Tubuh (IMT)', 'Muscle Length Test'] },
    'Bronchopneumonia': { category: 'Kardio', region: 'Dada (Chest)', icd: 'J18.0', codes: 'b440, b445, b455, b280, s430, d450, d640', b: ['b440 (Sesak Nafas/Dyspnea)', 'b455 (Penurunan Toleransi Aktivitas)', 'b445 (Disfungsi Otot Pernafasan)', 'b280 (Nyeri Dada)', 'Abnormal Breathing Pattern (Pola Nafas Abnormal)', 'Sianosis/Pucat (Hipoksia)', 'Penurunan Ekspansi Thoraks', 'Batuk & Sputum'], s: ['s430 (Struktur Paru: Bronkus & Alveoli)', 's760 (Sangkar Thoraks)', 'Alveoli (Cairan Edema/Eksudat)', 'Jaringan Interstitial'], d_act: ['d450 (Kesulitan Berjalan Jauh)', 'Penurunan toleransi aktivitas fisik', 'Kesulitan melakukan pekerjaan rumah'], d_part: ['d640 (Hambatan pekerjaan rumah tangga)', 'd920 (Hambatan olahraga)', 'Isolasi sosial (Pencegahan penularan)'], intervention: ['Breathing Exercise (Koreksi Pola Nafas)', 'Thoracic Expansion Exercise', 'Coughing Exercise (Batuk Efektif)', 'Active Exercise (Mobilitas Upper Limb)', 'Aerobic Exercise (Toleransi Aktivitas)', 'Massage & Stretching (Relaksasi Otot)', 'Edukasi (Hidrasi & Etika Batuk)'], eval: ['Spirometry (Volume & Kapasitas Paru)', 'Borg Scale / VAS / MRC (Skala Sesak)', '6 Minute Walk Test (6MWT)', 'Ekspansi Thoraks (Meterline)', 'Vital Sign (SpO2/HR)'] },
    'Bronchiectasis': { category: 'Kardio', region: 'Dada (Chest)', icd: 'J47.9', codes: 'b440, b445, b455, b280, s430, d450, d640', b: ['b440 (Sesak Nafas/Dyspnea)', 'b455 (Penurunan Toleransi Aktivitas)', 'b445 (Spasme Otot: Trapezius/SCM)', 'Batuk Kronis Produktif (Sputum Mukopurulen/Darah)', 'Mengi (Wheezing) & Ronki Kasar', 'Jari Tabuh (Clubbing Fingers)', 'Nyeri Dada Pleuritik'], s: ['s430 (Struktur Bronkus - Dilatasi Abnormal)', 'Dinding Bronkus (Destruksi Komponen Elastis)', 'Lobus Paru (Tengah Kanan/Lingula/Basal)'], d_act: ['d450 (Kesulitan Berjalan Jauh)', 'Penurunan toleransi aktivitas fisik', 'Kesulitan melakukan pekerjaan rumah'], d_part: ['d640 (Hambatan pekerjaan rumah tangga)', 'd920 (Hambatan olahraga)', 'Gangguan tumbuh kembang (pada anak)'], intervention: ['Airway Clearance (Postural Drainage, ACBT, Autogenic Drainage)', 'Positive Expiratory Pressure (PEP)', 'Breathing Exercise (Latihan Otot Pernafasan)', 'Aerobic Exercise (Toleransi Aktivitas)', 'Intermittent Positive Pressure Breathing (IPPB)', 'Edukasi (Stop Merokok & Diet Sehat)'], eval: ['Spirometry (Volume & Kapasitas Paru)', 'Borg Scale / VAS / MRC (Skala Sesak)', '6 Minute Walk Test (6MWT)', 'Ekspansi Thoraks (Meterline)', 'Muscle Length Test (Otot Bantu Nafas)'] },
    'Kanker Paru (Lung Cancer)': { category: 'Kardio', region: 'Dada (Chest)', icd: 'C34', codes: 'b440, b455, b280, b449, s430, d450, d640', b: ['b440 (Sesak Nafas/Dyspnea)', 'b455 (Penurunan Toleransi Aktivitas)', 'b280 (Nyeri Dada)', 'Batuk Kronis/Hemoptisis (Batuk Darah)', 'Mengi/Stridor (Obstruksi Saluran Nafas)', 'Spasme Otot (Upper Trapezius & SCM)', 'Penurunan Ekspansi Thoraks'], s: ['s430 (Struktur Paru & Bronkus)', 'Jaringan Paru (Tumor/Kavitas/Atelektasis)', 'Otot Bantu Nafas (Trapezius/SCM)', 'Saluran Nafas (Obstruksi)'], d_act: ['d450 (Kesulitan Berjalan Jarak Jauh)', 'Penurunan toleransi aktivitas fisik', 'Kesulitan melakukan pekerjaan rumah'], d_part: ['d640 (Hambatan pekerjaan rumah tangga)', 'd920 (Hambatan partisipasi olahraga)', 'Gangguan aktivitas sehari-hari akibat kelelahan'], intervention: ['Breathing Control & Diaphragmatic Breathing', 'Aerobic & Resistance Exercise (Peningkatan Daya Tahan)', 'Thoracic Expansion Exercise', 'Massage & Heating (Relaksasi Otot Dada/Punggung)', 'Stretching (Otot Bantu Nafas)', 'Active Exercise (Mobilitas Upper Limb)', 'Edukasi (Stop Merokok)'], eval: ['Borg Scale (Skala Sesak)', 'Antropometri Sangkar Thoraks (Mobilitas)', 'VO2max / 6 Minute Walk Test (Daya Tahan)', 'Muscle Length Test (Integritas Otot)', 'Auskultasi (Retensi Sputum/Suara Nafas)'] },
    'Gagal Jantung (Heart Failure / CHF)': { category: 'Kardio', region: 'Dada (Chest)', msi_linkage: ['thoracic', 'lumbar', 'general (neuro)'], icd: 'I50', codes: 'b410, b415, b420, b455, s410, d220, d450', b: ['b410 (Fungsi Jantung/Pompa Jantung Menurun)', 'b455 (Penurunan Toleransi Aktivitas)', 'b420 (Tekanan Darah - Hipertensi/Hipotensi)', 'Sesak Nafas (Dyspnea)', 'Nyeri Dada', 'Takikardia/Bradikardia/Aritmia (EKG)', 'Fraksi Ejeksi < 40% (Ekokardiografi)', 'Saturasi Oksigen Rendah'], s: ['s410 (Struktur Jantung)', 'Ventrikel Kiri/Kanan (Hipertrofi/Disfungsi)', 'Paru (Edema Interstisial/Efusi Pleura)', 'Jantung (Kardiomegali/CTR > 50%)'], d_act: ['d450 (Kesulitan Berjalan Jauh)', 'd220 (Kesulitan Melakukan Tugas Ganda)', 'Melakukan pekerjaan rumah tangga'], d_part: ['Gangguan melakukan pekerjaan rumah tangga', 'Gangguan partisipasi olahraga'], intervention: ['Breathing Control & Exercise', 'Aerobic Exercise (Peningkatan Toleransi)', 'Active Exercise (Mobilitas Upper Limb)', 'Thoracic Expansion Exercise', 'Resistance Exercise', 'Massage & Heating (Relaksasi Otot Dada/Punggung)', 'Edukasi (Diet Sehat, Stop Merokok, Kontrol BB)'], eval: ['Borg Scale / VAS / MRC (Skala Sesak)', 'VO2max (Daya Tahan Jantung Paru)', 'Integritas Otot Bantu Pernafasan', 'Vital Sign (EKG, BP, HR, SpO2)', 'Retensi Sputum (Jika ada kongesti paru)'] },
    'Varises (Varicose Veins)': { category: 'Kardio', region: 'Kaki & Tungkai', msi_linkage: ['ankle', 'knee', 'hip'], icd: 'I83', codes: 'b415, b460, s410, d450, d640', b: ['b415 (Fungsi Pembuluh Darah Vena)', 'b460 (Sensasi Kardiovaskuler/Nyeri)', 'Edema Tungkai/Pergelangan Kaki', 'Pelebaran Vena (>4mm/Menonjol)', 'Hiperpigmentasi Kulit', 'Stasis Darah/Inkompetensi Katup'], s: ['s410 (Struktur Sistem Kardiovaskuler)', 'Vena Superfisial Ekstremitas Bawah', 'Katup Vena (Inkompetensi)', 'Dinding Vena (Kelemahan/Dilatasi)'], d_act: ['d450 (Kesulitan Berjalan Jauh)', 'Kesulitan bergerak pada ekstremitas', 'Melakukan pekerjaan rumah'], d_part: ['d640 (Hambatan pekerjaan rumah tangga)', 'd920 (Hambatan partisipasi olahraga)', 'Gangguan penampilan (estetika)'], intervention: ['Massage (Relaksasi Lokal/Drainage)', 'Stretching (Peregangan Otot Tungkai)', 'Aerobic Exercise (Toleransi Aktivitas)', 'Strengthening Exercise (Otot Betis/Calf Pump)', 'Edukasi (Elevasi Tungkai & Diet)'], eval: ['Visual Analogue Scale (VAS - Nyeri)', 'Antropometri Tungkai (Lingkar Betis/Edema)', 'Tes Trendelenburg (Kompetensi Katup)', 'Toleransi Aktivitas (METs/VO2max)'] },
    'Penyakit Jantung Pulmonal (Cor Pulmonale)': { category: 'Kardio', region: 'Dada (Chest)', msi_linkage: ['thoracic', 'lumbar', 'general (neuro)'], icd: 'I27', codes: 'b410, b440, b455, b280, s410, s430, d450, d640', b: ['b410 (Fungsi Jantung Kanan/Hipertensi Pulmonal)', 'b440 (Sesak Nafas/Dyspnea)', 'b455 (Penurunan Toleransi Aktivitas)', 'b280 (Nyeri Dada)', 'Spasme Otot (Upper Trapezius & SCM)', 'Sianosis (Bibir & Jari)', 'Edema Tungkai/Ascites (Gagal Jantung Kanan)', 'Hilang Kesadaran saat Aktivitas (Syncope)'], s: ['s410 (Struktur Jantung - Ventrikel Kanan)', 's430 (Struktur Paru & Pembuluh Darah Paru)', 'Otot Bantu Nafas (Spasme)'], d_act: ['d450 (Kesulitan Berjalan Jauh)', 'Penurunan toleransi aktivitas fisik', 'Kesulitan melakukan pekerjaan rumah'], d_part: ['d640 (Hambatan pekerjaan rumah tangga)', 'd920 (Hambatan partisipasi olahraga)', 'Gangguan aktivitas sosial akibat sesak/lelah'], intervention: ['Aerobic Exercise (Peningkatan Daya Tahan)', 'Resistance Exercise', 'Breathing Control & Diaphragmatic Breathing', 'Thoracic Expansion Exercise', 'Relaxation (Massage/Heating/Stretching)', 'Active Exercise (Upper Limb)', 'Edukasi (Diet Sehat, Stop Merokok, Kontrol BB)'], eval: ['Borg Scale / VAS / MRC (Skala Sesak)', 'Visual Analogue Scale (VAS - Nyeri)', 'VO2max (Daya Tahan Jantung Paru)', 'Antropometri Sangkar Thoraks', 'Antropometri Tungkai (Edema)', 'Muscle Length Test (Integritas Otot)'] },
    'Infark Myokard (Myocardial Infarction)': { category: 'Kardio', region: 'Dada (Chest)', icd: 'I21', codes: 'b410, b455, b280, s410, d450, d230', b: ['b410 (Fungsi Jantung/Iskemia)', 'b280 (Nyeri Dada Retrosternal/Menjalar)', 'b455 (Penurunan Toleransi Aktivitas)', 'Sesak Nafas (Dyspnea)', 'Mual & Muntah', 'Keringat Dingin & Cemas', 'Hipotensi/Hipertensi', 'Takikardia/Aritmia'], s: ['s410 (Struktur Jantung/Miokardium)', 'Arteri Koroner (Oklusi/Sumbatan)', 'Otot Jantung (Nekrosis/Iskemik)'], d_act: ['d450 (Kesulitan Berjalan Jarak Jauh)', 'Penurunan toleransi aktivitas fisik', 'Gangguan aktivitas rumah tangga'], d_part: ['Hambatan pekerjaan rumah tangga', 'Hambatan partisipasi olahraga', 'Keterlambatan kembali bekerja'], intervention: ['Phase I: Early Mobilization & Ambulasi', 'Phase II: Aerobic Exercise (Walking)', 'Phase III: Maintenance Aerobic (60-75% MHR)', 'Breathing Exercise', 'Physical Exercise (ACSM Guideline)', 'Edukasi (Faktor Risiko & Home Program)'], eval: ['6 Minute Walk Test (6MWT)', 'Modified Borg Scale (Skala Sesak/Lelah)', 'Vital Sign (HR, BP, EKG)', 'Enzim Jantung (Monitoring)'] },
    'Diabetes Melitus (Type 1 & 2)': { category: 'Kardio', region: 'Umum (Metabolik)', msi_linkage: ['general (neuro)', 'foot', 'ankle'], icd: 'E11', codes: 'b540, b545, b280, b455, s550, s580, d450, d530', b: ['b540 (Fungsi Metabolisme Umum)', 'b545 (Fungsi Metabolisme Air/Nutrisi)', 'Polidipsi (Haus Berlebih)', 'Poliuri (Sering Kencing)', 'Polifagia (Lapar Berlebih)', 'Penurunan Berat Badan', 'Penurunan Visus/Penglihatan', 'Neuropati (Gangguan Sensasi/Nyeri)'], s: ['s550 (Struktur Pankreas/Sel Beta)', 's580 (Kelenjar Endokrin Lain)', 'Reseptor Insulin (Resistensi)'], d_act: ['d450 (Penurunan Toleransi Berjalan)', 'Penurunan daya tahan jantung paru', 'Kelelahan Cepat (Fatigue)'], d_part: ['Hambatan partisipasi olahraga', 'Gangguan pekerjaan rumah tangga', 'Risiko Ulkus/Kaki Diabetik'], intervention: ['Aerobic Exercise (Jalan/Jogging/Treadmill)', 'Resistance Exercise (Strengthening)', 'Combination Training (Aerobic + Strength)', 'Edukasi (Diet, Kontrol Gula Darah, Perawatan Kaki)'], eval: ['Manual Muscle Testing (MMT)', '6 Minute Walk Test (6MWT)', 'Indeks Massa Tubuh (IMT)', 'Visual Analogue Scale (VAS - Nyeri Neuropati)', 'Pemeriksaan Integritas Kulit & Sensasi', 'Gula Darah Puasa/Sewaktu'] },
    'Lymphedema': { category: 'Kardio', region: 'Umum (Limfatik)', msi_linkage: ['general (neuro)', 'shoulder', 'hip'], icd: 'I89', codes: 'b435, b439, s420, d450, d640', b: ['b435 (Fungsi Sistem Imun/Limfatik)', 'b439 (Fungsi Sistem Limfatik Lain)', 'Edema (Bengkak Persisten/Pitting)', 'Nyeri (Rasa Berat/Ketidaknyamanan)', 'Penurunan Lingkup Gerak Sendi (ROM)', 'Kelemahan Otot', 'Perubahan Kulit (Kasar/Warna)'], s: ['s420 (Struktur Sistem Imun/Limfatik)', 'Kelenjar Limfe (Node/Abnormal)', 'Jaringan Interstisial (Akumulasi Protein)', 'Ekstremitas (Tangan/Kaki)'], d_act: ['d450 (Kesulitan Berjalan Jauh)', 'Kesulitan bergerak pada ekstremitas', 'Melakukan pekerjaan rumah'], d_part: ['d640 (Hambatan pekerjaan rumah tangga)', 'd920 (Hambatan partisipasi olahraga)', 'Gangguan mobilitas akibat rasa berat'], intervention: ['Complete Decongestive Therapy (CDT)', 'Manual Lymphatic Drainage (MLD)', 'Gravity Assisted Pressure (GAP)', 'Compression Bandaging/Garment', 'Wound Care (Perawatan Luka)', 'Exercise (Olahraga Teratur)', 'Edukasi (Elevasi Tungkai & Diet)'], eval: ['Antropometri (Lingkar Lengan/Tungkai)', 'Visual Analogue Scale (VAS - Nyeri)', 'Pitting Edema Test', 'ROM Measurement'] },
};

// --- 2. DATABASE OUTCOME MEASURE (KUESIONER) ---
window.OUTCOME_MEASURES = {
    'NDI (Neck)': {
        title: 'Neck Disability Index',
        keywords: ['neck', 'leher', 'cervical', 'torticollis', 'hnp cervical'],
        desc: 'Untuk nyeri dan kekakuan leher.',
        questions: [
            { q: 'Intensitas Nyeri', opts: ['Tidak nyeri', 'Sangat ringan', 'Sedang', 'Cukup hebat', 'Sangat hebat', 'Terburuk'] },
            { q: 'Perawatan Diri', opts: ['Normal tanpa nyeri', 'Normal tapi nyeri', 'Nyeri, lambat & hati-hati', 'Perlu bantuan kadang', 'Perlu bantuan selalu', 'Tidak bisa'] },
            { q: 'Mengangkat', opts: ['Beban berat tanpa nyeri', 'Berat nyeri', 'Sedang nyeri', 'Ringan nyeri', 'Sangat ringan nyeri', 'Tidak bisa'] },
            { q: 'Membaca', opts: ['Bisa baca banyak', 'Bisa baca tapi nyeri ringan', 'Bisa baca tapi nyeri sedang', 'Bisa baca sedikit', 'Hampir tidak bisa', 'Tidak bisa'] },
            { q: 'Sakit Kepala', opts: ['Tidak ada', 'Ringan', 'Sedang', 'Cukup berat', 'Berat', 'Setiap saat'] },
            { q: 'Konsentrasi', opts: ['Penuh', 'Sedikit terganggu', 'Terganggu', 'Banyak terganggu', 'Sangat terganggu', 'Hilang total'] },
            { q: 'Bekerja', opts: ['Bisa semua', 'Bisa biasa', 'Bisa sebagian', 'Tidak bisa biasa', 'Hampir tidak bisa', 'Tidak bisa sama sekali'] },
            { q: 'Mengemudi', opts: ['Bisa kapan saja', 'Bisa tapi nyeri', 'Bisa tapi nyeri sedang', 'Bisa tapi nyeri berat', 'Hampir tidak bisa', 'Tidak bisa'] },
            { q: 'Tidur', opts: ['Nyenyak', 'Kurang < 1 jam', 'Kurang < 2 jam', 'Kurang < 3 jam', 'Kurang < 5 jam', 'Tidak bisa tidur'] },
            { q: 'Rekreasi', opts: ['Bisa semua', 'Bisa tapi nyeri', 'Bisa sedikit', 'Bisa sangat sedikit', 'Hampir tidak bisa', 'Tidak bisa'] }
        ],
        calc: (scores) => {
            const total = scores.reduce((a, b) => a + b, 0);
            const percent = (total / 50) * 100;
            return `Skor NDI: ${percent}% (Makin tinggi makin berat)`;
        }
    },
    'ODI (Low Back)': {
        title: 'Oswestry Disability Index',
        keywords: ['pinggang', 'lumbal', 'low back pain', 'lbp', 'ischialgia', 'hnp lumbal', 'saraf kejepit'],
        desc: 'Gold standard nyeri punggung bawah.',
        questions: [
            { q: 'Intensitas Nyeri', opts: ['Tidak nyeri', 'Sangat ringan', 'Sedang', 'Cukup hebat', 'Sangat hebat', 'Terburuk'] },
            { q: 'Perawatan Diri', opts: ['Bisa normal', 'Bisa tapi nyeri', 'Perlu bantuan, nyeri', 'Perlu bantuan besar', 'Bantuan tiap hari', 'Tidak bisa'] },
            { q: 'Mengangkat', opts: ['Berat tanpa nyeri', 'Berat nyeri', 'Sedang nyeri', 'Ringan nyeri', 'Sangat ringan', 'Tidak bisa'] },
            { q: 'Berjalan', opts: ['Jarak jauh', 'Maks 1 km', 'Maks 500 m', 'Maks 100 m', 'Pakai tongkat', 'Di kasur saja'] },
            { q: 'Duduk', opts: ['Berapapun lama', 'Selama saya mau', 'Maks 1 jam', 'Maks 30 menit', 'Maks 10 menit', 'Tidak bisa'] },
            { q: 'Berdiri', opts: ['Selama saya mau', 'Maks 1 jam', 'Maks 30 menit', 'Maks 10 menit', 'Tidak bisa', 'Di kasur saja'] },
            { q: 'Tidur', opts: ['Nyenyak', 'Terganggu < 1/4 jam', 'Terganggu < 1/2 jam', 'Terganggu < 3/4 jam', 'Terganggu terus', 'Tidak bisa'] },
            { q: 'Kehidupan Seksual', opts: ['Normal', 'Normal tapi nyeri', 'Hampir normal, nyeri', 'Terbatas', 'Sangat terbatas', 'Tidak ada'] },
            { q: 'Kehidupan Sosial', opts: ['Normal', 'Normal nyeri', 'Nyeri, terbatas', 'Sering di rumah', 'Di rumah saja', 'Tidak ada'] },
            { q: 'Bepergian', opts: ['Kemana saja', 'Kemana saja nyeri', 'Nyeri < 2 jam', 'Nyeri < 1 jam', 'Perlu ambulan', 'Tidak bisa'] }
        ],
        calc: (scores) => {
            const total = scores.reduce((a, b) => a + b, 0);
            const percent = (total / 50) * 100;
            return `Skor ODI: ${percent}% (0-20%: Minimal, 21-40%: Sedang, >40%: Berat)`;
        }
    },
    'SPADI (Shoulder)': {
        title: 'Shoulder Pain and Disability Index',
        keywords: ['bahu', 'shoulder', 'frozen', 'rotator', 'impingement', 'acromio'],
        desc: 'Spesifik nyeri dan disabilitas bahu.',
        questions: [
            { q: 'Nyeri: Istirahat', opts: ['0-1 (Tidak)', '2-3', '4-5', '6-7', '8-9', '10 (Berat)'] },
            { q: 'Nyeri: Tidur sisi sakit', opts: ['0-1', '2-3', '4-5', '6-7', '8-9', '10'] },
            { q: 'Nyeri: Menggapai ke atas', opts: ['0-1', '2-3', '4-5', '6-7', '8-9', '10'] },
            { q: 'Nyeri: Menyentuh leher', opts: ['0-1', '2-3', '4-5', '6-7', '8-9', '10'] },
            { q: 'Nyeri: Mendorong lengan', opts: ['0-1', '2-3', '4-5', '6-7', '8-9', '10'] },
            { q: 'Sulit: Cuci rambut', opts: ['0-1 (Mudah)', '2-3', '4-5', '6-7', '8-9', '10 (Sulit)'] },
            { q: 'Sulit: Gosok punggung', opts: ['0-1', '2-3', '4-5', '6-7', '8-9', '10'] },
            { q: 'Sulit: Pakai kaos', opts: ['0-1', '2-3', '4-5', '6-7', '8-9', '10'] },
            { q: 'Sulit: Kancing baju', opts: ['0-1', '2-3', '4-5', '6-7', '8-9', '10'] },
            { q: 'Sulit: Bawa benda 5kg', opts: ['0-1', '2-3', '4-5', '6-7', '8-9', '10'] },
            { q: 'Sulit: Ambil dompet saku blkg', opts: ['0-1', '2-3', '4-5', '6-7', '8-9', '10'] },
            { q: 'Sulit: Bawa benda 500gr', opts: ['0-1', '2-3', '4-5', '6-7', '8-9', '10'] }
        ],
        calc: (scores) => {
            const total = scores.reduce((a, b) => a + (b * 2), 0);
            const max = scores.length * 10;
            const percent = Math.round((total / max) * 100);
            return `Skor SPADI: ${percent}% (Makin tinggi makin sakit)`;
        }
    },
    'QuickDASH (Arm/Hand)': {
        title: 'QuickDASH',
        keywords: ['tangan', 'siku', 'elbow', 'wrist', 'pergelangan', 'jari', 'cts', 'tennis', 'de quervain'],
        desc: 'Umum untuk semua gangguan lengan atas.',
        questions: [
            { q: 'Buka tutup toples baru/kencang', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] },
            { q: 'Melakukan pekerjaan berat (pel/dinding)', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] },
            { q: 'Membawa belanjaan / tas koper', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] },
            { q: 'Mencuci punggung', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] },
            { q: 'Menggunakan pisau potong makanan', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] },
            { q: 'Aktivitas rekreasi yang butuh tenaga', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] },
            { q: 'Nyeri lengan mengganggu sosial?', opts: ['Tidak', 'Sedikit', 'Sedang', 'Sering', 'Selalu'] },
            { q: 'Terbatas kerja karena lengan?', opts: ['Tidak', 'Sedikit', 'Sedang', 'Sering', 'Selalu'] },
            { q: 'Nyeri lengan', opts: ['Tidak', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'] },
            { q: 'Kesemutan', opts: ['Tidak', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'] },
            { q: 'Sulit tidur karena nyeri', opts: ['Tidak', 'Sedikit', 'Sedang', 'Sering', 'Selalu'] }
        ],
        calc: (scores) => {
            const sum = scores.reduce((a, b) => a + (b + 1), 0);
            const n = scores.length;
            const result = ((sum / n) - 1) * 25;
            return `Skor QuickDASH: ${result.toFixed(1)}% (0=Sehat, 100=Disabilitas Total)`;
        }
    },
    'LEFS (Lower Extremity)': {
        title: 'Lower Extremity Functional Scale',
        keywords: ['kaki', 'panggul', 'hip', 'lutut', 'knee', 'ankle', 'pergelangan kaki', 'acl', 'meniscus'],
        desc: 'Skrining umum fungsi kaki (Panggul hingga Jari kaki).',
        questions: [
            { q: 'Pekerjaan biasa/rumah tangga', opts: ['Sangat sulit/Tidak bisa', 'Sulit', 'Sedang', 'Sedikit sulit', 'Tidak sulit'] },
            { q: 'Jongkok', opts: ['Sangat sulit', 'Sulit', 'Sedang', 'Sedikit', 'Mudah'] },
            { q: 'Mengangkat benda berat', opts: ['Sangat sulit', 'Sulit', 'Sedang', 'Sedikit', 'Mudah'] },
            { q: 'Berjalan 1 Km', opts: ['Sangat sulit', 'Sulit', 'Sedang', 'Sedikit', 'Mudah'] },
            { q: 'Naik turun tangga', opts: ['Sangat sulit', 'Sulit', 'Sedang', 'Sedikit', 'Mudah'] },
            { q: 'Berdiri 1 jam', opts: ['Sangat sulit', 'Sulit', 'Sedang', 'Sedikit', 'Mudah'] },
            { q: 'Masuk keluar mobil', opts: ['Sangat sulit', 'Sulit', 'Sedang', 'Sedikit', 'Mudah'] },
            { q: 'Lari jarak pendek/belok', opts: ['Sangat sulit', 'Sulit', 'Sedang', 'Sedikit', 'Mudah'] },
            { q: 'Melompat', opts: ['Sangat sulit', 'Sulit', 'Sedang', 'Sedikit', 'Mudah'] },
            { q: 'Berguling di tempat tidur', opts: ['Sangat sulit', 'Sulit', 'Sedang', 'Sedikit', 'Mudah'] }
        ],
        calc: (scores) => {
            const total = scores.reduce((a, b) => a + b, 0);
            const max = scores.length * 4;
            const percent = (total / max) * 100;
            return `Skor LEFS: ${percent.toFixed(1)}% (Makin tinggi makin SEHAT)`;
        }
    },
    'KOOS-12 (Knee)': {
        title: 'KOOS-12 (Knee)',
        keywords: ['lutut', 'knee', 'oa', 'osteoarthritis', 'acl', 'meniscus', 'chondromalacia'],
        desc: 'Spesifik cedera lutut & Osteoarthritis.',
        questions: [
            { q: 'Seberapa sering nyeri lutut?', opts: ['Tidak pernah', 'Bulanan', 'Mingguan', 'Harian', 'Selalu'] },
            { q: 'Nyeri saat meluruskan lutut', opts: ['Tidak', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'] },
            { q: 'Nyeri saat naik turun tangga', opts: ['Tidak', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'] },
            { q: 'Nyeri saat duduk/baring', opts: ['Tidak', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'] },
            { q: 'Sulit bangkit dari duduk', opts: ['Tidak', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'] },
            { q: 'Sulit membungkuk ambil benda', opts: ['Tidak', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'] },
            { q: 'Sulit masuk mobil', opts: ['Tidak', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'] },
            { q: 'Sulit belanja', opts: ['Tidak', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'] },
            { q: 'Padar lutut bengkak?', opts: ['Tidak', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'] },
            { q: 'Ada bunyi gemeretak/krepitasi?', opts: ['Tidak', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'] },
            { q: 'Lutut kaku saat bangun pagi?', opts: ['Tidak', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'] },
            { q: 'Kualitas hidup terganggu lutut?', opts: ['Tidak', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'] }
        ],
        calc: (scores) => {
            const total = scores.reduce((a, b) => a + b, 0);
            const max = scores.length * 4;
            const disability = (total / max) * 100;
            const health = 100 - disability;
            return `Skor KOOS: ${health.toFixed(1)}% (100% = Sempurna/Sehat)`;
        }
    },
    'FAAM (Foot/Ankle)': {
        title: 'FAAM (ADL Subscale)',
        keywords: ['ankle', 'tumit', 'kaki', 'foot', 'sprain', 'plantar', 'fasciitis'],
        desc: 'Fungsi kaki dan pergelangan kaki.',
        questions: [
            { q: 'Berdiri', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] },
            { q: 'Berjalan di tanah rata', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] },
            { q: 'Berjalan tanpa alas kaki', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] },
            { q: 'Naik turun tangga', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] },
            { q: 'Jinjit', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] },
            { q: 'Jongkok', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] },
            { q: 'Berjalan 15 menit', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] },
            { q: 'Pekerjaan rumah tangga', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] },
            { q: 'Aktivitas pribadi', opts: ['Tidak Sulit', 'Sedikit', 'Sedang', 'Sulit', 'Tidak Bisa'] }
        ],
        calc: (scores) => {
            const totalSehat = scores.reduce((a, b) => a + (4 - b), 0);
            const max = scores.length * 4;
            const percent = (totalSehat / max) * 100;
            return `Skor FAAM: ${percent.toFixed(1)}% (Makin tinggi makin SEHAT)`;
        }
    },
    'Barthel Index': {
        title: 'Barthel Index',
        keywords: ['stroke', 'cva', 'hemi', 'geriatri', 'tua', 'bedrest', 'lumpuh'],
        desc: 'Kemandirian aktivitas sehari-hari (ADL).',
        questions: [
            { q: 'Makan', opts: ['0 - Perlu bantuan total', '5 - Perlu bantuan potong dll', '10 - Mandiri'] },
            { q: 'Mandi', opts: ['0 - Tergantung orang lain', '5 - Mandiri'] },
            { q: 'Kebersihan Diri (Sikat gigi/wajah)', opts: ['0 - Butuh bantuan', '5 - Mandiri'] },
            { q: 'Berpakaian', opts: ['0 - Tergantung orang lain', '5 - Perlu bantuan sebagian', '10 - Mandiri (termasuk kancing)'] },
            { q: 'BAB (Kontrol)', opts: ['0 - Inkontinensia/Perlu enema', '5 - Kadang ngompol', '10 - Terkontrol'] },
            { q: 'BAK (Kontrol)', opts: ['0 - Pakai kateter/ngompol', '5 - Kadang ngompol', '10 - Terkontrol'] },
            { q: 'Ke Toilet', opts: ['0 - Tergantung total', '5 - Perlu bantuan', '10 - Mandiri'] },
            { q: 'Transfer (Bed ke Kursi)', opts: ['0 - Tidak bisa', '5 - Bantuan fisik berat (2 org)', '10 - Bantuan min (1 org)', '15 - Mandiri'] },
            { q: 'Mobilitas (Jalan)', opts: ['0 - Immobile', '5 - Kursi roda', '10 - Jalan dengan bantuan', '15 - Mandiri'] },
            { q: 'Naik Tangga', opts: ['0 - Tidak bisa', '5 - Butuh bantuan', '10 - Mandiri'] }
        ],
        calc: (scores) => {
            // Kalkulasi manual karena Barthel punya bobot berbeda (0,5,10,15)
            // Di sistem ini kita ambil value dari label radio button saja nanti di app.js
            // Tapi placeholder function tetap ada
            return 'Skor Barthel dihitung di Logic';
        }
    },
    'Berg Balance (BBS)': {
        title: 'Berg Balance Scale',
        keywords: ['jatuh', 'seimbang', 'balance', 'parkinson', 'vertigo', 'sempoyongan'],
        desc: 'Risiko jatuh dan keseimbangan.',
        questions: [
            { q: 'Duduk ke berdiri', opts: ['0 - Perlu bantuan max', '1', '2', '3', '4 - Mandiri aman'] },
            { q: 'Berdiri tanpa pegangan', opts: ['0', '1', '2', '3', '4'] },
            { q: 'Duduk tanpa sandaran', opts: ['0', '1', '2', '3', '4'] },
            { q: 'Berdiri ke duduk', opts: ['0', '1', '2', '3', '4'] },
            { q: 'Transfer/Pindah kursi', opts: ['0', '1', '2', '3', '4'] },
            { q: 'Berdiri mata tertutup', opts: ['0', '1', '2', '3', '4'] },
            { q: 'Berdiri kaki rapat', opts: ['0', '1', '2', '3', '4'] },
            { q: 'Meraih ke depan', opts: ['0', '1', '2', '3', '4'] },
            { q: 'Ambil benda di lantai', opts: ['0', '1', '2', '3', '4'] },
            { q: 'Menoleh ke belakang', opts: ['0', '1', '2', '3', '4'] },
            { q: 'Berputar 360 derajat', opts: ['0', '1', '2', '3', '4'] },
            { q: 'Menempatkan kaki bergantian (step)', opts: ['0', '1', '2', '3', '4'] },
            { q: 'Berdiri satu kaki di depan (tandem)', opts: ['0', '1', '2', '3', '4'] },
            { q: 'Berdiri satu kaki', opts: ['0', '1', '2', '3', '4'] }
        ],
        calc: (scores) => {
            const total = scores.reduce((a, b) => a + b, 0);
            let interp = '';
            if (total <= 20) interp = 'Risiko Jatuh TINGGI (Kursi roda)';
            else if (total <= 40) interp = 'Risiko Jatuh SEDANG (Bantuan jalan)';
            else interp = 'Risiko Jatuh RENDAH (Aman)';
            return `Skor BBS: ${total}/56 (${interp})`;
        }
    }
};

// --- 3. DATABASE HOME EXERCISE PROGRAM (HEP) ---
window.EXERCISE_DB = {
    'Leher (Cervical)': [
        { name: 'Chin Tucks', desc: 'Tarik dagu ke belakang, tahan 5 detik. Ulangi 10x.' },
        { name: 'Upper Trapezius Stretch', desc: 'Miringkan kepala ke satu sisi, tahan 30 detik.' },
        { name: 'Levator Scapulae Stretch', desc: 'Tunduk dan toleh ke ketiak, tahan 30 detik.' },
        { name: 'Neck Isometrics', desc: 'Dorong kepala ke tangan (lawan tahanan) tanpa bergerak.' }
    ],
    'Punggung Bawah (Lumbar)': [
        { name: 'William Flexion', desc: 'Tidur terlentang, peluk kedua lutut ke dada.' },
        { name: 'McKenzie Extension', desc: 'Tengkurap, angkat badan bertumpu pada tangan (seperti kobra).' },
        { name: 'Bridging Exercise', desc: 'Tidur terlentang, tekuk lutut, angkat pantat ke atas.' },
        { name: 'Cat & Camel', desc: 'Posisi merangkak, bungkukkan dan cekungkan punggung bergantian.' },
        { name: 'Piriformis Stretch', desc: 'Posisi angka 4, tarik paha ke dada.' }
    ],
    'Bahu (Shoulder)': [
        { name: 'Pendulum Exercise', desc: 'Bungkuk, ayunkan lengan memutar searah jarum jam & sebaliknya.' },
        { name: 'Wall Climbing', desc: 'Jari merambat naik di dinding sampai maksimal.' },
        { name: 'Towel Stretch', desc: 'Tangan sehat menarik tangan sakit ke atas lewat punggung.' },
        { name: 'Isometric External Rotation', desc: 'Siku ditekuk 90 derajat, dorong ke arah luar melawan tembok.' }
    ],
    'Lutut (Knee)': [
        { name: 'Quadriceps Setting', desc: 'Ganjal handuk di bawah lutut, tekan handuk ke bawah.' },
        { name: 'Heel Slides', desc: 'Seret tumit mendekati pantat, lalu luruskan kembali.' },
        { name: 'SLR (Straight Leg Raise)', desc: 'Angkat kaki lurus ke atas setinggi 45 derajat.' },
        { name: 'Wall Squat', desc: 'Sandar dinding, turunkan badan setengah jongkok tahan 10 detik.' }
    ],
    'Ankle & Foot': [
        { name: 'Ankle Pumping', desc: 'Gerakkan pergelangan kaki naik turun.' },
        { name: 'Alfabet Exercise', desc: 'Tulis huruf A-Z menggunakan ujung jari kaki di udara.' },
        { name: 'Calf Stretch', desc: 'Berdiri menghadap tembok, satu kaki lurus di belakang, dorong tembok.' },
        { name: 'Heel Raises', desc: 'Jinjit 2 kaki, lalu turun perlahan.' }
    ],
    'Stroke / Neuro': [
        { name: 'Bridging', desc: 'Angkat pantat, fokus pada sisi yang lemah.' },
        { name: 'Rolling (Miring Kanan-Kiri)', desc: 'Latihan memiringkan badan secara mandiri.' },
        { name: 'Sit to Stand', desc: 'Latihan berdiri dari kursi dengan tumpuan seimbang.' },
        { name: 'Hand Grasp Release', desc: 'Latihan menggenggam dan melepas benda.' }
    ]
};

// --- 3. DATABASE HMS (HUMAN MOVEMENT SYSTEM) ---
window.HMS_PROTOCOLS = {
    'Duduk Tenang (Quiet Sitting)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Observasi stabilitas postur duduk selama 30 detik.',
        ideal_criteria: [
            'Kaki dan lutut terbuka selebar pinggul, menapak lantai.',
            'Berat badan terbagi rata pada kedua sisi pantat.',
            'Pinggul menekuk wajar dan batang tubuh tegak.',
            'Kepala seimbang di atas bahu yang sejajar.',
            'Badan diam stabil tanpa goyangan berlebih.'
        ],
        observations: [
            { text: 'COM melenceng jauh dari titik tengah (Sangat tidak normal)', diagnosis: 'Defisit Biomekanik (modifier)' },
            { text: 'Tidak bisa duduk tanpa sandaran/bantuan (Sangat lemah/mau jatuh)', diagnosis: 'Force Production Deficit' },
            { text: 'Tidak bisa duduk tanpa sandaran / tanda hilang sensorik (sangat lemah)', diagnosis: 'Force Production Deficit / Sensory Detection Deficit' },
            { text: 'Duduk miring/asimetris, butuh bantuan minimal — posisi kaki aneh / respon lambat', diagnosis: 'Fractionated Movement Deficit' },
            { text: 'Duduk miring/asimetris, butuh bantuan minimal — bukan masalah kaki', diagnosis: 'Force Production Deficit / Sensory Selection & Weighting Deficit' },
            { text: 'Miring ke samping/belakang & melawan saat posisi dibenarkan terapis', diagnosis: 'Postural Vertical Deficit' },
            { text: 'Condong ke belakang, terasa kaku dan lambat saat membenarkan postur', diagnosis: 'Hypokinesia' },
            { text: 'Performa membaik secara signifikan setelah dicoba berulang kali', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: 'Performa memburuk/cepat lelah saat diulang-ulang', diagnosis: 'Force Production Deficit (Fatigue)' },
            { text: 'Badan goyang berlebihan, butuh tangan penyangga, tidak membaik dengan latihan', diagnosis: 'Dysmetria' }
        ]
    },
    'Berdiri dari Posisi Duduk (Sit to Stand)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Analisis transisi dari posisi duduk ke berdiri tanpa bantuan tangan.',
        ideal_criteria: [
            'Kaki tetap rata menapak lantai.',
            'Pinggul menekuk (badan condong ke depan) dengan punggung & leher tetap lurus.',
            'Lutut bergerak maju sedikit saat mulai berdiri.',
            'Pinggul dan lutut lurus sempurna di akhir gerakan.'
        ],
        observations: [
            // Fase Inisiasi
            { text: '[Inisiasi] Butuh bantuan angkat pantat / terhempas cepat saat dilepas', diagnosis: 'Force Production Deficit' },
            { text: '[Inisiasi] Gerakan ancang-ancang sangat lambat/kaku', diagnosis: 'Hypokinesia' },
            { text: '[Inisiasi] Kaki dibuka terlalu lebar (butuh pijakan luas)', diagnosis: 'Force Production Deficit / Dysmetria' },
            { text: '[Inisiasi] Susah bangun, butuh ayunan badan (momentum)', diagnosis: 'Force Production Deficit / Hypokinesia' },
            { text: '[Inisiasi] Badan terlalu banyak goyang', diagnosis: 'Dysmetria / Sensory Detection Deficit' },
            { text: '[Inisiasi] Menolak condong ke depan / dorong ke belakang atau samping', diagnosis: 'Postural Vertical Deficit' },
            // Fase Eksekusi
            { text: '[Eksekusi] Lutut lurus duluan sebelum pinggul (pantat nungging)', diagnosis: 'Force Production Deficit / Sensory Detection Deficit' },
            { text: '[Eksekusi] Tiba-tiba berhenti di tengah jalan saat mau berdiri', diagnosis: 'Hypokinesia' },
            { text: '[Eksekusi] Urutan gerak salah/kikuk (membaik jika diajari)', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: '[Eksekusi] Berat badan miring ke satu sisi (membaik jika diajari)', diagnosis: 'Sensory Selection & Weighting Deficit' },
            { text: '[Eksekusi] Miring ke sisi lemah/belakang & melawan saat dikoreksi', diagnosis: 'Postural Vertical Deficit' },
            { text: '[Eksekusi] Berhenti karena nyeri sendi atau kaku sendi', diagnosis: 'Biomechanical Deficit' },
            // Fase Akhir
            { text: '[Akhir] Pergelangan kaki goyang / butuh melangkah selangkah agar seimbang', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: '[Akhir] Melangkah berkali-kali untuk cari keseimbangan', diagnosis: 'Dysmetria / Force Production Deficit' },
            { text: '[Akhir] Lutut "mengunci" kelewat lurus (hyperextension) tapi membaik jika ditegur', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: '[Akhir] Lutut "mengunci" kelewat lurus & tetap begitu meski ditegur', diagnosis: 'Force Production Deficit / Sensory Detection Deficit' },
            { text: '[Akhir] Pinggul/lutut lambat dan kaku untuk lurus sempurna', diagnosis: 'Hypokinesia' }
        ]
    },
    'Berdiri Tenang (Quiet Standing)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Analisis stabilitas berdiri dengan mata terbuka (30 detik) dan mata tertutup (15 detik).',
        ideal_criteria: [
            'Telapak kaki sejajar di bawah bahu.',
            'Pinggul sedikit di depan pergelangan kaki.',
            'Bahu lurus di atas pinggul.',
            'Kepala seimbang di atas bahu yang rata.',
            'Batang tubuh tegak lurus.'
        ],
        observations: [
            { text: 'Tidak bisa berdiri tanpa pegangan, lemas & mau jatuh', diagnosis: 'Force Production Deficit' },
            { text: 'Miring sangat ekstrem mendekati batas jatuh', diagnosis: 'Biomechanical Deficit' },
            { text: 'Tidak bisa menahan lurus di sendi, makin lama makin memburuk (gemetar)', diagnosis: 'Force Production Deficit (Fatigue)' },
            { text: 'Posisi kaki aneh, butuh langkah-langkah terus, respon lambat', diagnosis: 'Fractionated Movement Deficit' },
            { text: 'Takut bergerak, kaku seperti patung', diagnosis: 'Hypokinesia' },
            { text: 'Ragu-ragu / butuh usaha berkali-kali (membaik setelah latihan)', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: 'Badan goyang berlebihan, tidak membaik walau diajari', diagnosis: 'Dysmetria' },
            { text: 'Miring ke satu sisi & melawan saat dikoreksi posisi tegaknya', diagnosis: 'Postural Vertical Deficit' },
            { text: '[Mata Tertutup] Goyang makin parah, tapi membaik setelah dilatih', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: '[Mata Tertutup] Langsung hilang keseimbangan / tidak membaik walau dilatih', diagnosis: 'Sensory Detection Deficit' },
            { text: '[Mata Tertutup] Jatuh selalu ke arah yang sama, membaik jika ada target visual', diagnosis: 'Sensory Selection & Weighting Deficit' }
        ]
    },
    'Berdiri Rapat (Feet Together Standing)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Analisis stabilitas berdiri dengan tumit dan jari kaki saling bersentuhan rapat (narrow base of support).',
        ideal_criteria: [
            'Kaki benar-benar rapat (tumit & ujung jari bersentuhan).',
            'Pinggul sedikit di depan pergelangan kaki.',
            'Bahu lurus di atas pinggul.',
            'Kepala tegak seimbang.',
            'Batang tubuh tegak.'
        ],
        observations: [
            { text: 'Tidak bisa berdiri tanpa pegangan, miring & melawan saat dibenarkan', diagnosis: 'Postural Vertical Deficit' },
            { text: 'Tidak bisa berdiri tanpa pegangan, sangat lemas & mau jatuh', diagnosis: 'Force Production Deficit' },
            { text: 'Tidak bisa menahan lurus di sendi, makin lama makin memburuk (fatigue)', diagnosis: 'Force Production Deficit (Fatigue)' },
            { text: 'Posisi kaki aneh, butuh bantuan tangan, respon lambat', diagnosis: 'Fractionated Movement Deficit' },
            { text: 'Takut bergerak, kaku seperti patung', diagnosis: 'Hypokinesia' },
            { text: 'Ragu-ragu / butuh usaha berkali-kali (membaik setelah diajari)', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: 'Badan goyang berlebihan, sangat butuh pegangan', diagnosis: 'Dysmetria' },
            { text: '[Mata Tertutup] Goyang bertambah, tapi membaik setelah dilatih', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: '[Mata Tertutup] Goyang sangat parah / langsung jatuh, tidak membaik dengan latihan', diagnosis: 'Sensory Detection Deficit' },
            { text: '[Mata Tertutup] Jatuh selalu ke arah yang sama, membaik jika ada target visual', diagnosis: 'Sensory Selection & Weighting Deficit' }
        ]
    },
    'Tes Melangkah Naik (Step-Up)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Analisis kontrol motorik dan stabilitas saat melangkah naik ke pijakan (10-15 cm).',
        ideal_criteria: [
            'Memindahkan berat badan ke kaki tumpu dengan stabil.',
            'Pinggul dan lutut kaki tumpuan tetap lurus/kuat.',
            'Batang tubuh tetap tegak (tidak miring/bungkuk).',
            'Pinggul kaki melangkah dapat terangkat dengan baik.',
            'Penempatan kaki terkontrol (mulus, tidak diseret).'
        ],
        observations: [
            // Fase Inisiasi
            { text: '[Inisiasi] Ragu-ragu/ancang-ancang (membaik dgn latihan)', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: '[Inisiasi] Berat badan miring (membaik dgn target visual)', diagnosis: 'Sensory Selection & Weighting Deficit' },
            { text: '[Inisiasi] Ragu-ragu & tetap tidak membaik walau dilatih', diagnosis: 'Force Production Deficit (FPD)' },
            { text: '[Inisiasi] Kaki kaku / susah gerak lancar', diagnosis: 'Fractionated Movement Deficit' },
            { text: '[Inisiasi] Ragu-ragu seolah meraba lantai', diagnosis: 'Sensory Detection Deficit' },
            { text: '[Inisiasi] Gerakan sangat lambat/kaku (ancang-ancang)', diagnosis: 'Hypokinesia' },
            { text: '[Inisiasi] Tidak berani mencoba tanpa pegangan', diagnosis: 'Sensory Detection / Hypokinesia / Dysmetria / Postural Vertical Deficit' },
            // Fase Eksekusi
            { text: '[Eksekusi-Swing] Pinggul kurang tinggi / gerak pakai ayunan badan / lelah', diagnosis: 'Force Production Deficit (FPD)' },
            { text: '[Eksekusi-Swing] Lambat, kaku seperti robot, tidak membaik', diagnosis: 'Fractionated Movement Deficit' },
            { text: '[Eksekusi-Swing] Lambat, kaku (membaik saat diulang)', diagnosis: 'Hypokinesia' },
            { text: '[Eksekusi-Swing] Badan miring parah (membaik saat diajari)', diagnosis: 'MPCD / Sensory Selection & Weighting Deficit' },
            { text: '[Eksekusi-Swing] Kaki terlalu tinggi/lebar, pijakan tidak jelas', diagnosis: 'Sensory Detection Deficit / Dysmetria' },
            { text: '[Eksekusi-Stance] Pinggul anjlok / lutut nekuk (tidak kuat menahan)', diagnosis: 'FPD / Fractionated Movement Deficit' },
            { text: '[Eksekusi-Stance] Lutut mengunci terlalu lurus (hyperextension)', diagnosis: 'FPD / Sensory Detection Deficit' },
            // Fase Akhir
            { text: '[Akhir] Mau jatuh (seimbang jika ada target visual)', diagnosis: 'Sensory Selection & Weighting Deficit' },
            { text: '[Akhir] Goyang belakang, pijakan kurang pas (membaik dicoba lagi)', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: '[Akhir] Kaki tidak sampai atas (butuh bantuan agar tdk jatuh)', diagnosis: 'FPD / Fractionated Movement / Hypokinesia' },
            { text: '[Akhir] Goyang parah, bablas kelewat batas, melangkah berkali-kali', diagnosis: 'Dysmetria / Sensory Detection Deficit' }
        ]
    },
    'Tes Berjalan (Gait)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Analisis pola jalan fungsional (6 meter) termasuk fase menapak, mengayun, dan berputar.',
        ideal_criteria: [
            'Pinggul lurus dan panggul bergeser natural saat menapak.',
            'Lutut menekuk (heel strike) -> lurus (stance) -> menekuk (toe off).',
            'Pinggul terangkat dan lutut menekuk saat mengayun.',
            'Pergelangan kaki dorsofleksi (jari naik) sebelum tumit menyentuh lantai.',
            'Menjaga keseimbangan saat berputar balik tanpa alat bantu.'
        ],
        observations: [
            // Fase Menapak (Stance)
            { text: '[Menapak] Badan miring ke samping saat menapak', diagnosis: 'Force Production Deficit (FPD)' },
            { text: '[Menapak] Pinggul atau badan menunduk/membungkuk', diagnosis: 'Force Production Deficit (FPD)' },
            { text: '[Menapak] Panggul anjlok/jatuh sebelah saat menahan beban', diagnosis: 'Force Production Deficit (FPD)' },
            { text: '[Menapak] Posisi kaki aneh (misal jinjit terus atau miring)', diagnosis: 'Fractionated Movement Deficit' },
            { text: '[Menapak] Lutut mengunci (hyperextension), tdk membaik dgn visual', diagnosis: 'Force Production Deficit (FPD)' },
            { text: '[Menapak] Lutut mengunci, membaik dgn panduan visual', diagnosis: 'Sensory Detection Deficit' },
            // Fase Mengayun (Swing)
            { text: '[Mengayun] Kaki memutar (jangka) / jinjit kaki tumpu (circumduction)', diagnosis: 'Force Production Deficit (FPD)' },
            { text: '[Mengayun] Pinggul kurang terangkat, jari kaki diseret', diagnosis: 'Force Production Deficit (FPD)' },
            { text: '[Mengayun] Gerakan kaku/aneh, langkah sangat pendek', diagnosis: 'Fractionated Movement Deficit' },
            { text: '[Mengayun] Pijakan acak-acakan (membaik setelah dilatih)', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: '[Mengayun] Pijakan acak-acakan (tidak membaik walau dilatih)', diagnosis: 'Dysmetria' },
            { text: '[Mengayun] Pijakan acak-acakan (membaik dengan panduan visual)', diagnosis: 'Sensory Detection Deficit' },
            { text: '[Mengayun] Sering berhenti, langkah sangat pendek (shuffling)', diagnosis: 'Hypokinesia' },
            // Overall & Turns
            { text: '[Jalur] Sempoyongan (membaik setelah diulang)', diagnosis: 'MPCD / Sensory Selection & Weighting Deficit' },
            { text: '[Jalur] Sempoyongan parah (tidak membaik walau diulang)', diagnosis: 'Dysmetria' },
            { text: '[Jalur] Melenceng terus ke satu sisi tertentu', diagnosis: 'Disregard / Sensory Selection & Weighting Deficit' },
            { text: '[Jalur] Tidak bisa melangkah maju tanpa pegangan', diagnosis: 'Postural Vertical Deficit' }
        ]
    },
    'Tes Jalan Kompleks (Complex Gait)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Analisis adaptabilitas jalan dengan tantangan (nengok, maju-mundur, rintangan).',
        ideal_criteria: [
            'Tetap stabil saat menoleh ke kiri/kanan.',
            'Transisi maju ke mundur lancar tanpa berhenti.',
            'Melompati rintangan kecil dengan kontrol yang baik.',
            'Tidak ada pengurangan kecepatan yang drastis.',
            'Jalur tetap lurus dan tidak sempoyongan.'
        ],
        observations: [
            { text: 'Jalan melenceng saat menoleh', diagnosis: 'Sensory Selection & Weighting Deficit / MPCD' },
            { text: 'Ragu/langkah ekstra saat ganti arah (membaik setelah dicoba)', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: 'Ragu/susah jalan mundur, pinggul tdk kuat menopang', diagnosis: 'Force Production Deficit (FPD)' },
            { text: 'Ragu/kikuk saat melewati rintangan (membaik saat dicoba)', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: 'Stop-and-go, langkah kecil, susah kontrol laju badan', diagnosis: 'Hypokinesia' },
            { text: 'Susah beradaptasi saat kondisi tiba-tiba diubah', diagnosis: 'Sensory Selection & Weighting Deficit' },
            { text: 'Langkah acak-acakan, kaki dibuka sangat lebar, tdk membaik', diagnosis: 'Dysmetria' }
        ]
    },
    'Tes Berjalan Dual Task (Performance)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Analisis gangguan jalan saat melakukan tugas tambahan (kognitif/manual).',
        ideal_criteria: [
            'Kualitas jalan tetap stabil saat berhitung/bercerita.',
            'Dapat membawa objek (gelas air/koin) tanpa tumpu/jatuh.',
            'Dapat memprioritaskan keselamatan jalan di atas tugas sambilan.',
            'Tidak ada "Freezing" atau berhenti mendadak saat fokus terpecah.'
        ],
        observations: [
            { text: 'Kualitas jalan ATAU tugas sekunder memburuk — tambahkan modifier "with dual task difficulty" pada diagnosis utama', diagnosis: 'Movement Pattern Coordination Deficit (MPCD) [+ modifier: with dual task difficulty]' },
            { text: 'Prioritas tugas sekunder > Keseimbangan (BAHAYA: Risiko Jatuh Tinggi)', diagnosis: 'Catatan Keselamatan: Prioritas Jalan Terganggu [tambahkan ke diagnosis utama]' },
            { text: 'Langkah memendek / jalan melambat drastis saat Dual Task (Shuffling)', diagnosis: 'Hypokinesia [+ modifier: with dual task difficulty]' },
            { text: 'Berhenti berhitung atau air tumpah saat mencoba jalan lancar', diagnosis: 'Movement Pattern Coordination Deficit (MPCD) [+ modifier: with dual task difficulty]' }
        ]
    },
    'Menjangkau & Menggenggam (Reach & Grasp)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Analisis koordinasi lengan dan jari saat berinteraksi dengan benda.',
        ideal_criteria: [
            'Sendi bergerak sendiri secara normal (fractionated).',
            'Rentang gerak cukup (lurus/menekuk penuh).',
            'Bentuk jari bersiap menyesuaikan benda (prep-shaping).',
            'Penempatan tangan akurat (ujung jari menyentuh duluan).',
            'Tekanan genggaman pas (tidak terlalu keras/lemas).'
        ],
        observations: [
            { text: 'Gerakan normal, tapi rentang gerak kurang / tdk kuat menahan lama', diagnosis: 'Force Production Deficit (FPD)' },
            { text: 'Gerakan normal, tapi kikuk, berantakan, tdk pas saat ambil benda', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: 'Tangan sering meleset parah saat menunjuk/mengambil benda', diagnosis: 'Dysmetria' },
            { text: 'Genggaman terlalu keras (meremas) atau terlalu lemas', diagnosis: 'Force Production Deficit / Sensory Detection Deficit' }
        ]
    },
    'Manipulasi Jari (In-Hand Manipulation)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Analisis kelincahan motorik halus jari (memutar pensil/koin).',
        ideal_criteria: [
            'Dapat memutar benda di dalam tangan tanpa bantuan tangan lain.',
            'Dapat memosisikan benda ke ujung jari dengan lancar.',
            'Gerakan jari terpisah satu sama lain (independent finger movement).',
            'Benda tidak mudah jatuh saat dimanipulasi.'
        ],
        observations: [
            { text: 'Jari bisa bergerak terpisah, tapi lemah / benda mudah jatuh', diagnosis: 'Force Production Deficit (FPD)' },
            { text: 'Bisa bergerak, tapi sangat lambat, kikuk, atau bingung posisi', diagnosis: 'Movement Pattern Coordination Deficit (MPCD)' },
            { text: 'Tidak bisa menggerakkan jari secara terpisah (kaku bersamaan)', diagnosis: 'Fractionated Movement Deficit' }
        ]
    },
    'Status Mental (Mental Status)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Skrining dasar kesadaran, atensi, dan kognitif pasien.',
        ideal_criteria: [
            'Sadar sepenuhnya (Compos Mentis).',
            'Fokus dan perhatian penuh saat interaksi.',
            'Memahami situasi (tahu tempat dan waktu).',
            'Dapat mengikuti instruksi motorik kompleks.'
        ],
        observations: [
            { text: 'Sangat bingung, tidak bisa fokus, tidak paham instruksi', diagnosis: 'Cognitive Deficit' },
            { text: 'Agak bingung disertai masalah motorik berat', diagnosis: 'Diagnosis X dengan Penyerta Gangguan Mental' },
            { text: 'Hanya lambat berpikir (instruksi harus pelan-pelan)', diagnosis: 'Cognitive (Mild/Note Only)' }
        ]
    },
    'Keterbatasan Sendi (Joint Limitation)': {
        category: 'Neuro / Geriatri',
        regions: ['muskuloskeletal', 'sport', 'neuro', 'geriatri', 'pediatri'],
        description: 'Evaluasi hambatan gerak sendi (ROM) dan biomekanik.',
        ideal_criteria: [
            'Sendi dapat ditekuk/diluruskan penuh (ROM normal).',
            'Tidak ada kaku sendi atau kontraktur.',
            'Gerakan sendi bebas tanpa tahanan biomekanik.'
        ],
        observations: [
            { text: 'Kaku/mentok tdk bisa lurus/menekuk penuh', diagnosis: 'Defisit Biomekanik' },
            { text: 'Keterbatasan sendi sangat parah (kontraktur/tulang)', diagnosis: 'Masalah Muskuloskeletal Murni' }
        ]
    },
    'Ketegangan Otot (Muscle Tone)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Evaluasi ketegangan otot menggunakan MRA, Ashworth, atau Rigidity test.',
        ideal_criteria: [
            'Tonus otot normal (tahanan ringan saat digerakkan pasif).',
            'Tidak ada spastisitas (kejang) saat gerakan cepat.',
            'Tidak ada rigiditas (kaku menetap).',
            'Otot tidak lemas total (flaccid).'
        ],
        observations: [
            { text: 'MRA Moderate / Marked / Severe — atau Modified Ashworth 3-4', diagnosis: 'Fractionated Movement Deficit' },
            { text: 'MRA Flaccid (lengan/betis jatuh lebih cepat dari sisi sehat)', diagnosis: 'Force Production Deficit (Prognosis Buruk)' },
            { text: 'MRA Normal atau Mild (dengan riwayat lesi saraf pusat)', diagnosis: 'MPCD atau Force Production Deficit (Prognosis Baik)' },
            { text: 'Kekakuan berubah-ubah tergantung posisi tubuh (terkait cedera otak)', diagnosis: 'Catatan: Ukur tonus saat tugas fungsional, bukan hanya istirahat' },
            { text: 'MRA UE dan LE menunjukkan kategori yang BERBEDA', diagnosis: 'Pertimbangkan diagnosis terpisah untuk UE dan LE' }
        ]
    },
    'Gerakan Spontan & Terpisah (FM)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Evaluasi membedakan gerakan mandiri vs pola kaku (synergy). Posisi: Duduk bersandar.',
        ideal_criteria: [
            '[Bahu/Siku] Mampu gerak mandiri minimal 50% ROM.',
            '[Pergelangan Tangan/Jari/Telunjuk] Wajib mampu gerak mandiri 100% (penuh).',
            '[Pinggul/Lutut] Mampu gerak mandiri minimal 50% ROM.',
            '[Engkel Kaki] Wajib mampu gerak mandiri 100% (dorsiflexion penuh).',
            'Gerakan mulus tanpa otot lain ikut menegang.'
        ],
        observations: [
            { text: 'Sendi besar (Bahu/Siku/Pinggul/Lutut) < 50% ROM mandiri', diagnosis: 'Fractionated Movement Deficit' },
            { text: 'Sendi distal (Engkel/Jari/Wrist) < 100% ROM mandiri', diagnosis: 'Fractionated Movement Deficit' },
            { text: 'Gerakan kaku/robot/ikut-ikutan (Synergy Pattern)', diagnosis: 'Fractionated Movement Deficit' },
            { text: 'Skor SCALE ≤ 5 (khusus anak-anak)', diagnosis: 'Fractionated Movement Deficit' }
        ]
    },
    'Kekuatan Otot (MMT)': {
        category: 'Neuro / Geriatri',
        regions: ['semua'],
        description: 'Evaluasi kekuatan otot objektif menggunakan Skala Kendall (0-5).',
        ideal_criteria: [
            'Nilai MMT mayoritas 5 (Normal/Sangat Kuat).',
            'Dapat menahan gravitasi dan tahanan maksimal terapis.',
            'Nilai minimal 4 untuk aktivitas fungsional mandiri.'
        ],
        observations: [
            { text: 'Nilai mayoritas < 4 atau otot kunci mendadak lemah', diagnosis: 'Force Production Deficit (Prognosis Bagus)' },
            { text: 'Nilai mayoritas ≤ 3+ (tidak kuat menahan gravitasi)', diagnosis: 'Force Production Deficit (Berat)' },
            { text: 'Lumpuh total / hanya kedutan (Nilai 0-1)', diagnosis: 'Force Production Deficit (Sangat Berat)' }
        ]
    },
    'Tes Kelelahan Otot (Fatigue)': {
        category: 'Neuro / Geriatri',
        regions: ['semua'],
        description: 'Evaluasi daya tahan otot melalui gerakan berulang (10x repetisi) pada ekstremitas atau fungsional.',
        ideal_criteria: [
            'Dapat menyelesaikan 10 repetisi tanpa penurunan kecepatan signifikan.',
            'Rentang gerak (ROM) tetap penuh hingga repetisi terakhir.',
            'Tidak ada sesak napas atau jantung berdebar kencang (Cardiopulmonary).',
            'Kualitas gerakan tetap stabil dan terkontrol.'
        ],
        observations: [
            { text: 'Gerakan makin menciut / makin melambat di akhir repetisi', diagnosis: 'Force Production Deficit (Fatigue)' },
            { text: 'Berhenti karena ngos-ngosan / napas pendek / debar jantung', diagnosis: 'Cardiopulmonary Issue (Bukan Masalah Otot)' },
            { text: 'Tidak sanggup mencapai 5 repetisi (Kelemahan berat)', diagnosis: 'Force Production Deficit (Severe)' }
        ]
    },
    'Perencanaan Gerak (Motor Planning)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Evaluasi apraxia / kemampuan menyusun skenario gerakan fungsional.',
        ideal_criteria: [
            'Gerakan fungsional (misal: minum) dilakukan dengan urutan yang benar.',
            'Tidak ada keraguan atau kebingungan saat memulai aktivitas nyata.',
            'Gerakan lancar dan efisien, tidak kikuk atau salah urutan.'
        ],
        observations: [
            { text: 'Gerakan sendi normal saat dites satu-satu, tapi kikuk saat aktivitas nyata', diagnosis: 'Motor Planning Deficit (Apraxia)' },
            { text: 'Bingung urutan gerak / salah urutan (Misal: pakai baju terbalik)', diagnosis: 'Cognitive / Motor Planning Deficit' },
            { text: 'Sangat kikuk dan butuh bantuan instruksi berulang', diagnosis: 'Cognitive Deficit / Apraxia' }
        ]
    },
    'Koordinasi Non-Ekuilibrium': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Evaluasi akurasi (Point-to-Point) dan kecepatan gerak bolak-balik (Reciprocal) tanpa beban keseimbangan.',
        ideal_criteria: [
            'Akurasi Telunjuk-Hidung: Meleset 0-1 kali (Normal).',
            'Akurasi Tumit-Tulang Kering: Meleset 0-1 kali (Normal).',
            'Gerak Reciprocal (Tangan/Kaki): Cepat, lancar, dan ritmis.'
        ],
        observations: [
            { text: 'Telunjuk-Hidung (FNF): Meleset 2-6 kali (Mild — belum tentu Dysmetria, perlu kombinasi tes lain)', diagnosis: 'Impairment Ringan — perlu kombinasi tes lain untuk konfirmasi Dysmetria' },
            { text: 'Telunjuk-Hidung (FNF): Meleset 7-10 kali (Markedly Impaired)', diagnosis: 'Dysmetria' },
            { text: 'Tumit-Tulang Kering (HKS): Meleset 2-6 kali (Mild — belum tentu Dysmetria, perlu kombinasi tes lain)', diagnosis: 'Impairment Ringan — perlu kombinasi tes lain untuk konfirmasi Dysmetria' },
            { text: 'Tumit-Tulang Kering (HKS): Meleset 7-10 kali (Markedly Impaired)', diagnosis: 'Dysmetria' },
            { text: 'Gerak Reciprocal (Bolak-balik): Lambat (UE: Pronasi-Supinasi / LE: Toe-Tap)', diagnosis: 'Dysmetria' }
        ]
    },
    'Kesadaran Posisi Sendi (Proprioception)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Evaluasi rasa posisi sendi (Joint Position Sense) dengan mata tertutup.',
        ideal_criteria: [
            'Dapat menebak arah gerakan (Atas/Bawah) dengan akurasi 100%.',
            'Respon cepat dan yakin tanpa melihat sendi.',
            'Akurasi tetap terjaga pada sendi distal (jempol) maupun proksimal (lutut).'
        ],
        observations: [
            { text: 'Skor 0 (akurat semua): Tidak ada gangguan sensorik', diagnosis: 'Normal' },
            { text: 'Skor Mild (salah 1-2x) di jempol/engkel saja: Gangguan ringan', diagnosis: 'Mild Impairment (bukan Sensory Detection Deficit)' },
            { text: 'Skor Mild (salah 1-2x) di ENGKEL DAN LUTUT sekaligus', diagnosis: 'Sensory Detection Deficit' },
            { text: 'Skor Moderate (salah 3-4x) di jempol/engkel', diagnosis: 'Sensory Detection Deficit' },
            { text: 'Skor Severe (salah 5x+) di mana pun / tidak bisa tebak sama sekali', diagnosis: 'Sensory Detection Deficit (Berat)' },
            { text: 'Lumpuh parah DISERTAI kehilangan sensorik (joint position sense)', diagnosis: 'Diagnosis utama terkait motorik + modifier: with sensory loss' }
        ]
    },
    'Sindrom Mendorong (Postural Vertical Deficit)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri'],
        description: 'Evaluasi Pusher Syndrome (Contraversive Pushing) dan orientasi tegak.',
        ideal_criteria: [
            'Dapat mempertahankan posisi tegak lurus tanpa miring.',
            'Menerima koreksi posisi dari terapis tanpa melawan.',
            'Tidak mendorong menggunakan sisi yang sehat untuk miring ke sisi lemah.'
        ],
        observations: [
            { text: 'Miring ke samping/belakang & NGOTOT MELAWAN saat diluruskan', diagnosis: 'Postural Vertical Deficit (Pusher Syndrome)' },
            { text: 'Mendorong kuat dengan tangan/kaki sehat hingga nyaris jatuh', diagnosis: 'Postural Vertical Deficit' }
        ]
    },
    'Orientasi Vertikal (Sensory Selection)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri'],
        description: 'Evaluasi orientasi vertikal tanpa perlawanan (Verticality without pushing).',
        ideal_criteria: [
            'Dapat mempertahankan posisi tegak lurus.',
            'Tidak menunjukkan pola miring bawaan saat diam.'
        ],
        observations: [
            { text: 'Badan miring TAPI menurut/bisa lurus saat dikoreksi/lihat kaca', diagnosis: 'Sensory Selection & Weighting Deficit' },
            { text: 'Miring/condong belakang tapi tidak panik saat diluruskan', diagnosis: 'Sensory Selection & Weighting Deficit' }
        ]
    },
    'Pengabaian Sisi Tubuh (Disregard/Neglect)': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri'],
        description: 'Skrining perilaku pengabaian (Neglect) pada satu sisi ruang atau tubuh.',
        ideal_criteria: [
            'Memperhatikan kedua sisi ruang (kiri & kanan) secara seimbang.',
            'Sering menoleh ke kedua sisi saat beraktivitas.',
            'Tidak menabrak benda di salah satu sisi saat berjalan.'
        ],
        observations: [
            { text: 'Sering menabrak benda di satu sisi tertentu (Neglect)', diagnosis: 'Disregard (with Diagnosis Utama)' },
            { text: 'Tidak pernah menoleh ke salah satu sisi ruang', diagnosis: 'Disregard / Hemi-spatial Neglect' },
            { text: 'Tidur selalu mepet ke satu sisi kasur secara konsisten', diagnosis: 'Disregard (Behavioral Note)' }
        ]
    },
    'Sensitivitas Rangsangan Sensorik': {
        category: 'Neuro / Geriatri',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Evaluasi hipersensitivitas terhadap rangsangan visual, vestibular, atau suara.',
        ideal_criteria: [
            'Dapat mengikuti gerakan mata tanpa pusing/mual.',
            'Tidak kehilangan keseimbangan saat di lingkungan bising/ramai.',
            'Tidak ada ketergantungan visual yang berlebihan (Visual Dependency).'
        ],
        observations: [
            { text: 'Pusing/mual/goyang saat melihat benda bergerak atau bising', diagnosis: 'Sensory Selection & Weighting Deficit' },
            { text: 'Melakukan gerakan berulang (rocking) untuk mencari sensasi', diagnosis: 'Sensory Seeking / Sensitivity' },
            { text: 'Gerakan bola mata sangat aneh (Nistagmus/Lainnya)', diagnosis: 'Rujuk Spesialis Saraf (Medical Concern)' }
        ]
    },
    'Pemeriksaan Nyeri (Pain)': {
        category: 'Umum / Skrining',
        regions: ['semua'],
        description: 'Skrining nyeri untuk membedakan sumber muskuloskeletal vs neurologis.',
        ideal_criteria: [
            'Bebas nyeri (Skala 0/10).',
            'Nyeri berkurang dengan koreksi posisi atau penyangga.',
            'Tidak ada nyeri tajam/panas yang mengganggu gerakan.'
        ],
        observations: [
            { text: 'Nyeri berkurang dengan bantal/koreksi posisi', diagnosis: 'Nyeri Muskuloskeletal (Tulang/Otot)' },
            { text: 'Nyeri tetap tinggi meski posisi dibenarkan', diagnosis: 'Potensi Nyeri Neuropatik/Saraf' },
            { text: 'Skala Nyeri Tinggi (7-10/10)', diagnosis: 'Nyeri Berat / Rujuk jika perlu' }
        ]
    },
    'Ketahanan Fisik / Toleransi Aktivitas': {
        category: 'Umum / Skrining (Safety)',
        regions: ['semua'],
        description: 'Skrining keamanan kardiopulmonal & tanda vital selama aktivitas fisik.',
        ideal_criteria: [
            'Tanda vital (HR, BP, RR) stabil / merespon normal terhadap beban.',
            'Detak jantung kembali normal setelah istirahat 2 menit.',
            'Saturasi Oksigen (SpO2) tetap di atas 90%.',
            'Irama napas terkontrol, tidak kerja keras meraup udara.'
        ],
        observations: [
            { text: 'Detak jantung turun/berantakan/tdk kembali normal', diagnosis: 'Cardiopulmonary Issue (Safety Alarm)' },
            { text: 'Tensi sistolik anjlok atau diastolik naik > 10 mmHg', diagnosis: 'Cardiopulmonary Issue (Safety Alarm)' },
            { text: 'Napas ngos-ngosan parah / bahu kerja keras', diagnosis: 'Cardiopulmonary Issue' },
            { text: 'Saturasi O2 anjlok di bawah 90%', diagnosis: 'Hypoxia / Cardiopulmonary Alarm' },
            { text: 'Tekanan otak (Intracranial) naik di atas batas aman', diagnosis: 'Medical Emergency / Safety Alarm' }
        ]
    },
    'Motorneuron Response Assessment (MRA)': {
        category: 'Neuro / Khusus Spastisitas',
        regions: ['neuro', 'geriatri'],
        description: 'Evaluasi mendalam kekakuan otot (spastisitas), uji jatuh (drop test), dan reaksi asosiasi (associated reactions).',
        ideal_criteria: [
            'Tidak ada tahanan saat digerakkan pasif oleh terapis.',
            'Uji Jatuh (Drop Test): Lengan/betis jatuh dengan kecepatan normal (sama dengan sisi sehat).',
            'Dapat rileks total setelah melakukan gerakan aktif.',
            'Tidak ada gerakan ikut-ikutan (associated reactions) pada anggota tubuh lain saat bergerak.'
        ],
        observations: [
            { text: '[UE] Lengan jatuh lebih cepat dari sisi sehat (Flaccid)', diagnosis: 'Force Production Deficit (Layu)' },
            { text: '[UE] Ada tahanan sedikit, tapi jatuh normal (Mild)', diagnosis: 'Motorneuron Response (Mild Spasticity)' },
            { text: '[UE] Lengan jatuh lebih lambat dari sisi sehat (Moderate)', diagnosis: 'Spasticity (Moderate)' },
            { text: '[UE] Tekuk kaki paretik -> Lengan ikut tegang (Marked)', diagnosis: 'Fractionated Movement Deficit (Associated Reaction)' },
            { text: '[UE] Tekuk kaki SEHAT -> Lengan ikut tegang (Severe)', diagnosis: 'Fractionated Movement Deficit (Severe Cross-Talk)' },
            { text: '[LE] Betis jatuh lebih cepat dari sisi sehat (Flaccid)', diagnosis: 'Force Production Deficit (Layu)' },
            { text: '[LE] Ada tahanan sedikit saat digerakkan (Mild)', diagnosis: 'Motorneuron Response (Mild)' },
            { text: '[LE] Betis jatuh lebih lambat dari sisi sehat (Moderate)', diagnosis: 'Spasticity (Moderate)' },
            { text: '[LE] Aktivitas/ketegangan terus-menerus pada kaki (Severe)', diagnosis: 'Spasticity (Severe / Constant Tone)' }
        ]
    },
    'Pemeriksaan Postur (Alignment)': {
        category: 'Neuro / Geriatri',
        regions: ['semua'],
        description: 'Evaluasi kelurusan postur dari kepala hingga kaki dalam posisi berdiri.',
        ideal_criteria: [
            'Kepala tegak seimbang, tidak terlalu maju.',
            'Punggung tidak bungkuk (Kyphosis) atau bengkok (Scoliosis).',
            'Pinggul dan lutut lurus simetris.',
            'Telapak kaki memiliki lengkungan normal (tidak flat foot).'
        ],
        observations: [
            { text: 'Kepala terlalu maju / Punggung bungkuk (Kyphosis)', diagnosis: 'Defisit Biomekanik / Postural Vertical Deficit' },
            { text: 'Badan bengkok ke satu sisi (Scoliosis)', diagnosis: 'Defisit Biomekanik / Sensory Selection & Weighting Deficit' },
            { text: 'Lutut nekuk / Pinggul asimetris saat berdiri', diagnosis: 'Force Production Deficit / Biomekanik' }
        ]
    },
    'Modified CTSIB (Balance on Foam)': {
        category: 'Neuro / Khusus Keseimbangan',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Tes keseimbangan di atas busa/matras empuk untuk mengecek sensor kaki.',
        ideal_criteria: [
            'Dapat berdiri stabil di atas busa (Mata Terbuka) selama 30 detik.',
            'Dapat berdiri stabil di atas busa (Mata Tertutup) selama 30 detik.',
            'Tidak ada ayunan tubuh berlebihan saat berdiri di permukaan empuk.'
        ],
        observations: [
            { text: 'Sangat goyang / jatuh saat berdiri di busa (Mata Tertutup)', diagnosis: 'Sensory Selection & Weighting Deficit' },
            { text: 'Sangat goyang saat di atas busa walau mata terbuka', diagnosis: 'Sensory Selection (Proprioceptive Dependency)' }
        ]
    },
    'Tes Jalan 6 Menit (6MWT)': {
        category: 'Umum / Toleransi Aktivitas',
        regions: ['neuro', 'geriatri', 'kardio'],
        description: 'Evaluasi kapasitas aerobik dan ketahanan jantung-paru.',
        ideal_criteria: [
            'Dapat berjalan terus menerus selama 6 menit.',
            'Jarak tempuh sesuai standar usia/gender.',
            'Tanda vital tetap dalam batas aman setelah tes.'
        ],
        observations: [
            { text: 'Berhenti berulang kali karena sesak/lelah jantung', diagnosis: 'Cardiopulmonary Issue / Activity Intolerance' },
            { text: 'Jarak tempuh sangat pendek dibanding standar', diagnosis: 'Force Production Deficit / Endurance Issue' }
        ]
    },
    'Bangun dari Lantai (Floor to Stand)': {
        category: 'Geriatri / Fungsional',
        regions: ['neuro', 'geriatri', 'pediatri'],
        description: 'Evaluasi kemampuan transisi dari lantai ke posisi berdiri.',
        ideal_criteria: [
            'Dapat bangun dari lantai secara mandiri dengan lancar.',
            'Tidak butuh bantuan fisik atau pegangan furnitur.',
            'Tidak kehilangan keseimbangan saat transisi naik.'
        ],
        observations: [
            { text: 'Tidak sanggup bangun tanpa bantuan alat/orang', diagnosis: 'Force Production Deficit (Severe)' },
            { text: 'Sangat lambat / butuh momentum besar untuk bangun', diagnosis: 'Force Production Deficit / MPCD' }
        ]
    },
    'Kesimpulan & Rencana Terapi (Report)': {
        category: 'Report / Summary',
        regions: ['semua'],
        description: 'Penentuan diagnosis akhir, prognosis, dan rencana latihan.',
        ideal_criteria: [
            'Diagnosis sesuai dengan pola observasi mayoritas.',
            'Prognosis realistis berdasarkan kondisi fisik.',
            'Target (STG/LTG) terukur dan memiliki batas waktu.'
        ],
        observations: [
            { text: 'Diagnosis: Force Production Deficit (Tentukan Prognosis)', diagnosis: 'FPD' },
            { text: 'Diagnosis: Movement Pattern Coordination Deficit', diagnosis: 'MPCD' },
            { text: 'Diagnosis: Fractionated Movement Deficit', diagnosis: 'Fractionated Movement Deficit' },
            { text: 'Diagnosis: Dysmetria', diagnosis: 'Dysmetria' },
            { text: 'Diagnosis: Hypokinesia', diagnosis: 'Hypokinesia' },
            { text: 'Diagnosis: Sensory Selection & Weighting Deficit', diagnosis: 'Sensory Selection & Weighting Deficit' },
            { text: 'Diagnosis: Sensory Detection Deficit', diagnosis: 'Sensory Detection Deficit' },
            { text: 'Diagnosis: Postural Vertical Deficit', diagnosis: 'Postural Vertical Deficit' },
            { text: 'Diagnosis: Cognitive Deficit', diagnosis: 'Cognitive Deficit' }
        ]
    }
};

window.MSI_DATA = {
    'Cervical Spine': {
        category: 'MSI / Structural',
        regions: ['cervical'],
        description: 'Movement System Impairment assessment for the neck region.',
        syndromes: [
            { name: 'Cervical Extension', tests: ['Backward Bending', 'Sitting Posture'], correction: 'Chin tuck / Neutral alignment' },
            { name: 'Cervical Extension-Rotation', tests: ['Backward Bending + Rotation'], correction: 'Neutral rotation during extension' },
            { name: 'Cervical Flexion', tests: ['Forward Bending', 'Slumped Sitting'], correction: 'Scapular elevation / Thoracic extension' },
            { name: 'Cervical Flexion-Rotation', tests: ['Forward Bending + Rotation'], correction: 'Symmetrical flexion' },
            { name: 'Cervical Rotation', tests: ['Rotation only'], correction: 'Axial extension during rotation' }
        ],
        observations: [
            { text: '[Extension] Nyeri saat mendongak, berkurang jika leher diposisikan netral', diagnosis: 'Cervical Extension' },
            { text: '[Flexion] Nyeri saat menunduk, berkurang jika belikat ditopang (raised)', diagnosis: 'Cervical Flexion' },
            { text: '[Rotation] Nyeri hanya pada satu sisi saat menoleh', diagnosis: 'Cervical Rotation' },
            { text: '[Alignment] Kepala terlalu maju (Forward Head), nyeri berkurang saat dikoreksi', diagnosis: 'Cervical Extension / Flexion' }
        ]
    },
    'Thoracic Spine': {
        category: 'MSI / Structural',
        regions: ['thoracic'],
        description: 'Assessment of Thoracic Spine impairments.',
        syndromes: [
            { name: 'Thoracic rotation-flexion', tests: ['Trunk Rotation'], correction: 'Slight extension during rotation' },
            { name: 'Thoracic flexion', tests: ['Slumping'], correction: 'Chest up / Thoracic extension' },
            { name: 'Thoracic rotation-extension', tests: ['Extension + Rotation'], correction: 'Neutral extension' },
            { name: 'Thoracic rotation', tests: ['Pure Rotation'], correction: 'Limited/Symmetrical rotation' },
            { name: 'Thoracic extension', tests: ['Backward Bending'], correction: 'Limit extension at specific segments' }
        ],
        observations: [
            { text: '[Rotation] Nyeri saat memutar badan, berkurang jika punggung agak ditegakkan', diagnosis: 'Thoracic rotation-flexion' },
            { text: '[Flexion] Punggung tampak membungkuk (Kiposis), nyeri berkurang jika dada dibusungkan', diagnosis: 'Thoracic flexion' },
            { text: '[Rotation] Nyeri saat memutar badan ke satu sisi saja', diagnosis: 'Thoracic rotation' },
            { text: '[Correction] Nyeri berkurang saat posisi tulang belakang dikoreksi ke netral', diagnosis: 'Thoracic Syndrome Confirmed' }
        ]
    },
    'Shoulder': {
        category: 'MSI / Structural',
        regions: ['shoulder', 'scapula'],
        description: 'Assessment of Scapular and Humeral movement impairments.',
        syndromes: [
            { name: 'Scapular insufficient upward rotation', tests: ['Arm Elevation'], correction: 'Manual upward rotation assist' },
            { name: 'Scapular internal rotation', tests: ['Push up against wall'], correction: 'Serratus activation' },
            { name: 'Scapular depression', tests: ['Resting posture'], correction: 'Passive elevation (shrug)' },
            { name: 'Scapular abduction', tests: ['Resting posture'], correction: 'Scapular adduction cue' },
            { name: 'Scapular adduction', tests: ['Resting posture'], correction: 'Passive abduction' },
            { name: 'Scapular winging and tilting', tests: ['Push up against wall'], correction: 'Serratus activation' },
            { name: 'Humeral anterior glide', tests: ['Shoulder Extension / IR'], correction: 'Postural humeral head support' },
            { name: 'Humeral superior glide', tests: ['Arm Elevation'], correction: 'Humeral head downward pressure' },
            { name: 'Shoulder medial rotation', tests: ['Resting posture'], correction: 'Taping / External rotation cue' },
            { name: 'Glenohumeral hypomobility', tests: ['Passive Range'], correction: 'Joint mobilization' }
        ],
        observations: [
            { text: '[Scapula] Tulang belikat menonjol (winging) saat dorong tembok', diagnosis: 'Scapular winging and tilting' },
            { text: '[Humerus] Nyeri bahu depan saat angkat tangan, berkurang jika bahu didorong ke belakang', diagnosis: 'Humeral anterior glide' },
            { text: '[Alignment] Bahu tampak turun (depressed), nyeri leher berkurang jika bahu diangkat', diagnosis: 'Scapular depression' },
            { text: '[Source] Nyeri siku/tangan berkurang saat belikat distabilkan terapis', diagnosis: 'Scapular insufficient upward rotation' },
            { text: '[Medial] Bahu tampak memutar ke dalam (Medial Rotation)', diagnosis: 'Shoulder medial rotation' }
        ]
    },
    'Elbow': {
        category: 'MSI / Structural',
        regions: ['elbow'],
        description: 'Movement impairment for the elbow and forearm.',
        syndromes: [
            { name: 'Wrist extension with forearm pronation', tests: ['Typing / Resisted Extension'], correction: 'Neutral forearm' },
            { name: 'Elbow hypomobility', tests: ['Flexion/Extension PROM'], correction: 'Manual mobilization' },
            { name: 'Elbow flexion', tests: ['Resting posture'], correction: 'Passive extension' },
            { name: 'Elbow valgus', tests: ['Carrying angle'], correction: 'Neutral alignment cue' },
            { name: 'Elbow extension', tests: ['Resting posture'], correction: 'Passive flexion' },
            { name: 'Wrist flexion with forearm pronation', tests: ['Grip'], correction: 'Neutral wrist extension' }
        ],
        observations: [
            { text: '[Pronation] Nyeri siku luar (Lateral Epicondyle) saat ngetik, berkurang jika lengan diputar telapak menghadap atas', diagnosis: 'Wrist extension with forearm pronation' },
            { text: '[Flexion] Siku cenderung menekuk terus, nyeri jika diluruskan maksimal', diagnosis: 'Elbow flexion' },
            { text: '[Valgus] Siku tampak miring keluar, nyeri saat membawa beban berat', diagnosis: 'Elbow valgus' },
            { text: '[Hypomobility] Sendi siku kaku saat diluruskan atau ditekuk (Passive)', diagnosis: 'Elbow hypomobility' }
        ]
    },
    'Wrist and Hand': {
        category: 'MSI / Structural',
        regions: ['wrist', 'hand'],
        description: 'Impairments of the wrist, fingers, and thumb.',
        syndromes: [
            { name: 'Insufficient finger and/or thumb flexion', tests: ['Grip'], correction: 'Assisted flexion' },
            { name: 'Insufficient finger and/or thumb extension', tests: ['Flat hand'], correction: 'Passive extension' },
            { name: 'Insufficient thumb palmar abduction and/or opposition', tests: ['Pinch'], correction: 'Assisted opposition' },
            { name: 'Thumb carpometacarpal accessory hypermobility', tests: ['Stability test'], correction: 'Taping / Splinting' },
            { name: 'Finger or thumb flexion with or without finger rotation', tests: ['Fine motor'], correction: 'Alignment cue' }
        ],
        observations: [
            { text: '[Flexion] Jari kaku saat mengepal, nyeri berkurang jika dibantu ditekuk', diagnosis: 'Insufficient finger and/or thumb flexion' },
            { text: '[Thumb] Nyeri pangkal jempol saat memegang benda kecil', diagnosis: 'Thumb carpometacarpal accessory hypermobility' },
            { text: '[Extension] Jari sulit diluruskan maksimal', diagnosis: 'Insufficient finger and/or thumb extension' }
        ]
    },
    'Lumbar Spine': {
        category: 'MSI / Structural',
        regions: ['lumbar'],
        description: 'Movement System Impairment assessment for the low back.',
        syndromes: [
            { name: 'Lumbar flexion', tests: ['Forward Bending', 'Sitting'], correction: 'Flat back / Hip hinge' },
            { name: 'Lumbar extension', tests: ['Backward Bending', 'Standing'], correction: 'Abdominal activation / Tailbone tuck' },
            { name: 'Lumbar rotation', tests: ['Side Bending', 'Rotation'], correction: 'Symmetrical movement' },
            { name: 'Lumbar rotation with flexion', tests: ['Forward Bending + Rotation'], correction: 'Neutral spine during movement' },
            { name: 'Lumbar rotation with extension', tests: ['Backward Bending + Rotation'], correction: 'Neutral spine during movement' }
        ],
        observations: [
            { text: '[Flexion] Nyeri saat membungkuk, berkurang jika panggul (hip) bergerak duluan', diagnosis: 'Lumbar flexion' },
            { text: '[Extension] Nyeri saat berdiri tegak/mendongak, berkurang dengan kunci perut', diagnosis: 'Lumbar extension' },
            { text: '[Rotation] Nyeri saat miring/putar, berkurang jika pelvis distabilkan', diagnosis: 'Lumbar rotation' },
            { text: '[Correction] Nyeri berkurang drastis saat gerakan lumbale dibatasi', diagnosis: 'MSI Confirmed (Path of Least Resistance)' }
        ]
    },
    'Hip': {
        category: 'MSI / Structural',
        regions: ['hip'],
        description: 'Femoral and Pelvic movement impairment syndromes.',
        syndromes: [
            { name: 'Femoral anterior glide', tests: ['Hip Extension', 'Prone Knee Bend'], correction: 'Posterior glute activation' },
            { name: 'Femoral anterior glide with medial rotation', tests: ['Extension + IR'], correction: 'Glute activation + Alignment' },
            { name: 'Femoral anterior glide with lateral rotation', tests: ['Extension + ER'], correction: 'Glute activation + Alignment' },
            { name: 'Femoral posterior glide', tests: ['Hip Flexion'], correction: 'Posterior pelvic tilt' },
            { name: 'Femoral multidirectional accessory hypermobility', tests: ['Stability'], correction: 'Strength / Bracing' },
            { name: 'Femoral hypomobility with superior glide', tests: ['Passive Flexion'], correction: 'Inferior mobilization' },
            { name: 'Hip adduction', tests: ['Single leg stance'], correction: 'Pelvic leveling' },
            { name: 'Hip adduction with medial rotation', tests: ['Single leg stance'], correction: 'Pelvic leveling + neutral femur' },
            { name: 'Femoral lateral glide', tests: ['Side Lying'], correction: 'Manual medial pressure' },
            { name: 'Hip extension with knee extension', tests: ['Prone'], correction: 'Knee flexion maintenance' },
            { name: 'Hip extension with medial rotation', tests: ['Gait'], correction: 'Neutral femur cue' },
            { name: 'Hip lateral rotation', tests: ['Sitting', 'Gait'], correction: 'Neutral foot alignment' }
        ],
        observations: [
            { text: '[Glide] Nyeri selangkangan saat paha lurus ke belakang', diagnosis: 'Femoral anterior glide' },
            { text: '[Adduction] Panggul miring saat berdiri satu kaki (Trendelenburg)', diagnosis: 'Hip adduction' },
            { text: '[Correction] Nyeri berkurang saat panggul ditahan agar tetap sejajar', diagnosis: 'Hip adduction' },
            { text: '[Glide] Bunyi "Klik" di panggul saat ditekuk, berkurang jika panggul didorong ke bawah', diagnosis: 'Femoral hypomobility with superior glide' }
        ]
    },
    'Knee': {
        category: 'MSI / Structural',
        regions: ['knee'],
        description: 'Tibiofemoral and Patellofemoral syndromes.',
        syndromes: [
            { name: 'Tibiofemoral rotation', tests: ['Squat', 'Step down'], correction: 'Manual rotation correction' },
            { name: 'Tibiofemoral hypomobility', tests: ['Range of Motion'], correction: 'Joint glides' },
            { name: 'Knee extension', tests: ['Standing'], correction: 'Avoid hyperextension' },
            { name: 'Knee extension with patellar superior glide', tests: ['Sitting to Standing'], correction: 'Patellar taping/manual glide' },
            { name: 'Knee hyperextension', tests: ['Resting Standing'], correction: 'Soft knee cueing' },
            { name: 'Patellar lateral glide knee impairment', tests: ['Knee Flexion'], correction: 'Medial taping' }
        ],
        observations: [
            { text: '[Rotation] Lutut masuk ke dalam (Valgus) saat jongkok', diagnosis: 'Tibiofemoral rotation' },
            { text: '[Hyperextension] Lutut melenting ke belakang saat berdiri', diagnosis: 'Knee hyperextension' },
            { text: '[Correction] Nyeri berkurang saat arah gerakan tempurung lutut dikontrol', diagnosis: 'Patellar lateral glide knee impairment' }
        ]
    },
    'Foot and Ankle': {
        category: 'MSI / Structural',
        regions: ['foot', 'ankle'],
        description: 'Movement impairment for the foot and ankle.',
        syndromes: [
            { name: 'Pronation', tests: ['Standing', 'Walking'], correction: 'Arch support / Short foot' },
            { name: 'Supination', tests: ['Standing'], correction: 'External wedge' },
            { name: 'Insufficient dorsiflexion', tests: ['Lunging'], correction: 'Talar glide' },
            { name: 'Hypomobility', tests: ['Passive Range'], correction: 'Joint mobilization' },
            { name: 'Foot and ankle impairment', tests: ['Gait'], correction: 'General support' },
            { name: 'Proximal tibiofibular glide', tests: ['Knee/Ankle movement'], correction: 'Stabilization taping' }
        ],
        observations: [
            { text: '[Pronation] Kaki tampak rata (Flat Foot), nyeri berkurang jika lengkung kaki diangkat', diagnosis: 'Pronation' },
            { text: '[Dorsiflexion] Betis sangat kaku, saat jongkok tumit terangkat', diagnosis: 'Insufficient dorsiflexion' },
            { text: '[Supination] Berat badan dominan di sisi luar kaki saat berdiri', diagnosis: 'Supination' }
        ]
    }
};