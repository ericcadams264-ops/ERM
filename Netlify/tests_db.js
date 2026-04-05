/**
 * DATABASE PEMERIKSAAN SPESIFIK (SPECIAL TESTS)
 * Dibuat khusus untuk pengujian klinis Fisioterapi.
 */

window.SPECIAL_TESTS_DB = {
    "Cervical": [
        {
            id: "cerv_comp",
            name: "Compression Test (Spurling)",
            description: "Mendeteksi penekanan foramen intervertebralis cervical.",
            procedure: "Menekan kepala pasien dalam posisi netral, side fleksi, ekstensi, atau fleksi.",
            positive: "Timbul nyeri radikuler sesuai tingkat kompresi.",
            target: ["b2804", "s120"] // Mapping ke kode ICF terkait
        },
        {
            id: "valsalva",
            name: "Tes Valsalva",
            description: "Meningkatkan tekanan intratekal untuk mendeteksi desak ruang (HNP/Tumor).",
            procedure: "Pasien diminta mengejan sambil menahan napas.",
            positive: "Timbul nyeri radikuler yang berpangkal di cervical dan menjalar ke lengan.",
            target: ["b2804", "s120"]
        },
        {
            id: "naffziger",
            name: "Tes Naffziger",
            description: "Meningkatkan tekanan intracranial untuk mendeteksi proses desak ruang.",
            procedure: "Menekan kedua vena jugularis sambil pasien diminta mengejan.",
            positive: "Timbul nyeri melintasi kawasan dermatomnya.",
            target: ["b2804", "s120"]
        },
        {
            id: "distraction",
            name: "Tes Distraksi",
            description: "Mengurangi kompresi radiks saraf dorsalis.",
            procedure: "Mengangkat kepala pasien secara perlahan dalam posisi berbaring/duduk.",
            positive: "Nyeri syaraf berkurang atau hilang saat tarikan dilakukan.",
            target: ["b2804"]
        },
        {
            id: "de_kleyn",
            name: "Tes Arteri Vertebralis (De Kleyn)",
            description: "Mendeteksi gangguan vaskuler/iskemia vertebrobasilar (VBI).",
            procedure: "Pasien berbaring, kepala dipertahankan posisi ekstensi dan rotasi maksimal selama 45 detik.",
            positive: "Timbul nystagmus, dizzines (pusing), mual, slurred speech (bicara ngawur), atau hilang kesadaran.",
            target: ["b2401", "b2152"]
        },
        {
            id: "swallowing_test",
            name: "Swallowing Test",
            description: "Mendeteksi penghalang (tumor/bony spur) pada cervical anterior.",
            procedure: "Pasien diminta untuk melakukan gerakan menelan.",
            positive: "Peningkatan rasa sakit atau kesulitan menelan (disfagia).",
            target: ["b5100"]
        },
        {
            id: "sharp_purser",
            name: "Sharp Purser Test",
            description: "Menilai integritas Ligamen Transversus (Atlanto-Axial).",
            procedure: "Duduk, tekan dahi ke arah posterior sambil memfiksasi proc. spinosus C2.",
            positive: "Terasa gerakan geser (sliding) atau bunyi 'klik' di langit-langit mulut.",
            target: ["b710", "s120"]
        }
    ],
    "Thoracal": [
        {
            id: "scoliosis_test",
            name: "Tes Skoliosis (Adams/Schit Load)",
            description: "Mencari adanya pembengkokan lateral tulang belakang.",
            procedure: "Berdiri tegak, gunakan bandul (Schit Load) dari C7 ke arah bawah.",
            positive: "Tali bandul tidak segaris dengan prosesus spinosus vertebrae.",
            target: ["s760", "b710"]
        },
        {
            id: "rib_compression",
            name: "Lateral & AP Rib Compression Test",
            description: "Menentukan adanya fraktur atau memar pada tulang rusuk.",
            procedure: "Kompresi dinding dada dari arah Anterior-Posterior dan sisi Lateral.",
            positive: "Nyeri tajam pada tulang rusuk selama kompresi dilakukan.",
            target: ["b280", "s710"]
        },
        {
            id: "thor_comp",
            name: "Thoracic Compression",
            description: "Mendeteksi nyeri atau gangguan pada area vertebra thoracal.",
            procedure: "Kompresi langsung atau lewat shoulder grid.",
            positive: "Nyeri tajam di area thoracal.",
            target: ["b2801", "s7105"]
        },
        {
            id: "adam_test",
            name: "Adam's Forward Bend Test",
            description: "Skrining scoliosis pada thoracal.",
            procedure: "Pasien membungkuk ke depan, pemeriksa melihat adanya 'hump' atau punuk.",
            positive: "Adanya asimetri (punuk) pada satu sisi punggung.",
            target: ["s760", "b710"]
        }
    ],
    "Lumbal": [
        {
            id: "slr_test",
            name: "Straight-Leg Raise (SLR / Lasegue)",
            description: "Meregangkan saraf siatica (L4-S1).",
            procedure: "Pasien telentang, kaki diangkat lurus (lutut ekstensi). Catat sudut saat nyeri muncul.",
            positive: "Nyeri tajam menjalar atau parasthesia pada tungkai bawah di antara sudut 30-70 derajat (Indikasi HNP L4-S1).",
            target: ["b28015", "s12038"]
        },
        {
            id: "slump_test",
            name: "The Slump Test (Full Version)",
            description: "Tes ketegangan saraf spinal sensitivitas jaringan saraf.",
            procedure: "Slump (fleksi lumbal), fleksi leher, ekstensi lutut, dan dorsofleksi ankle secara bertahap.",
            positive: "Nyeri saat posisi ditegangkan, namun berkurang saat tekanan pada kepala/leher dilepaskan.",
            target: ["b28015", "b710"]
        },
        {
            id: "kernig_brudzinski",
            name: "Kernig / Brudzinski’s Neck Sign",
            description: "Mendeteksi iritasi meningeal atau jaringan saraf tulang belakang.",
            procedure: "Pasien telentang, fleksikan kepala secara cepat ke arah dada semaksimal mungkin.",
            positive: "Fleksi involunter pada kedua tungkai atau nyeri hebat pada leher/punggung.",
            target: ["b280", "s120"]
        },
        {
            id: "stoop_test",
            name: "Stoop Test",
            description: "Mendeteksi Neurogenic Claudication / Stenosis Vertebra.",
            procedure: "Pasien diminta jalan cepat, lalu berhenti dan berdiri tegak lurus.",
            positive: "Tubuh membungkuk progresif saat jalan (fleksi hip/knee) untuk mengurangi nyeri radikuler.",
            target: ["b710", "b28015"]
        },
        {
            id: "bowstring_test",
            name: "Bowstring Test (Cram Test)",
            description: "Mendeteksi nyeri radikuler akar saraf L5-S1.",
            procedure: "Lakukan SLR hingga nyeri, tekuk lutut sedikit, lalu beri tekanan pada fossa popliteal.",
            positive: "Timbul rasa sakit/nyeri radikuler saat fossa popliteal ditekan.",
            target: ["b28015"]
        },
        {
            id: "spring_test",
            name: "Spring Test",
            description: "Menguji mobilitas vertebrae (khususnya L5-L1).",
            procedure: "Pasien tengkurap, berikan kompresi (springing) pada prosesus spinosus individu.",
            positive: "Tidak ada gerakan (hipomobile) atau nyeri tajam saat kompresi.",
            target: ["b710", "s120"]
        },
        {
            id: "gillet_test",
            name: "Gillet Test",
            description: "Menilai mobilitas sendi Sacroiliac (SIPS).",
            procedure: "Berdiri, palpasi SIPS, instruksikan pasien fleksi panggul > 90 derajat.",
            positive: "SIPS pada sisi tersebut tidak bergerak inferior/lateral terhadap sacrum.",
            target: ["b710", "s760"]
        },
        {
            id: "squish_test",
            name: "Squish Test (Gaping)",
            description: "Menilai mobilitas/nyeri sendi Sacroiliac.",
            procedure: "Telentang, beri tekanan dorongan bersilang pada kedua SIAS.",
            positive: "Gerakan lebih sedikit pada satu sisi atau timbul nyeri pada SIJ.",
            target: ["b710", "s760"]
        },
        {
            id: "yeoman_test",
            name: "Yeoman’s Test",
            description: "Mendeteksi Sakroilitis atau tegangan saraf femoral.",
            procedure: "Tengkurap, fleksi lutut 90, lalu lakukan ekstensi hip.",
            positive: "Nyeri pada SIJ (Sacroiliitis) atau nyeri di paha (N. Femoral strain).",
            target: ["b28013", "s760"]
        },
        {
            id: "long_sitting",
            name: "Long-sitting Test",
            description: "Menilai inominasi SIJ dan perbedaan panjang kaki semu.",
            procedure: "Bandingkan tinggi malleolus medialis saat posisi telentang vs duduk (sit-up).",
            positive: "Perubahan posisi panjang kaki (pendek ke panjang atau sebaliknya) saat duduk.",
            target: ["s750", "s760"]
        },
        {
            id: "seated_flexion",
            name: "Seated Flexion Test",
            description: "Menunjukkan disfungsi sacroiliac.",
            procedure: "Pasien duduk, palpasi SIPS lalu pasien membungkuk ke depan.",
            positive: "Gerakan asimetris ke atas dari salah satu SIPS.",
            target: ["b710", "s760"]
        },
        {
            id: "kemp_test",
            name: "Kemp’s Test",
            description: "Menilai kelainan sendi Facet Lumbar.",
            procedure: "Pasien duduk/berdiri, lakukan kombinasi fleksi lateral, rotasi, dan ekstensi punggung.",
            positive: "Nyeri, mati rasa, atau kesemutan di punggung atau ekstremitas bawah.",
            target: ["b28015", "s120"]
        },
        {
            id: "prone_instability",
            name: "Prone Instability Test",
            description: "Menilai ketidakstabilan Lumbo-Pelvis (indikasi stabilisasi).",
            procedure: "Kompresi vertebra saat kaki menumpu di lantai vs saat kaki diangkat.",
            positive: "Nyeri mereda saat kaki diangkat (otot berkontraksi menjaga stabilitas).",
            target: ["b710", "s760"]
        },
        {
            id: "prone_knee_bending",
            name: "Prone Knee Bend Test (Nachlas)",
            description: "Deteksi cedera akar saraf L2-L3 atau ketegangan Quadriceps.",
            procedure: "Pasien tengkurap, fleksi lutut maksimal (sentuh pantat) selama 45-60 detik.",
            positive: "Nyeri unilateral di lumbar (L2/L3) atau nyeri di paha depan (N. Femoralis).",
            target: ["b28015", "s120"]
        },
        {
            id: "femoral_stretch",
            name: "Femoral Stretch Test",
            description: "Meregangkan saraf femoralis (L2-L4).",
            procedure: "Pasien telentang/miring, hip diekstensikan dan knee difleksikan.",
            positive: "Nyeri atau parasthesia di bagian medial anterior paha (HNP L2-L4).",
            target: ["b28015", "s12038"]
        },
        {
            id: "hoover_test",
            name: "Hoover Test",
            description: "Mengidentifikasi pasien berpura-pura sakit (Malingering).",
            procedure: "Pasien telentang, angkat satu kaki lurus. Rasakan tekanan tumit satunya di tangan pemeriksa.",
            positive: "Tidak ada tekanan ke bawah pada tumit sisi berlawanan saat mencoba mengangkat kaki.",
            target: ["b160"]
        },
        {
            id: "valsalva_lumbal",
            name: "Valsalva Maneuver (Lumbal)",
            description: "Meningkatkan tekanan intratekal.",
            procedure: "Mengejan kuat seperti saat buang air besar.",
            positive: "Peningkatan nyeri punggung atau nyeri menjalar ke kaki.",
            target: ["b28015"]
        },
        {
            id: "gaenslen_sign",
            name: "Gaenslen’s Sign",
            description: "Mendeteksi gangguan sendi Sacroiliac (SIJ).",
            procedure: "Pasien dipinggir bed, satu kaki ditarik ke dada, kaki sisi uji diturunkan ke lantai.",
            positive: "Timbul nyeri pada area sendi Sacroiliac.",
            target: ["b28013", "s760"]
        },
        {
            id: "patrick_faber",
            name: "Patrick’s (FABER) Test",
            description: "Mendeteksi patologi sendi SIJ atau Hip (panggul).",
            procedure: "Kaki ditekuk membentuk angka 4, lalu lutut ditekan ke bawah.",
            positive: "Nyeri pada area SIJ (SIJ pathology) atau nyeri pada area selangkangan (Hip pathology).",
            target: ["b28013", "s750"]
        }
    ],
    "Shoulder": [
        {
            id: "apley_scratch",
            name: "Apley Scratch Test",
            description: "Mengetahui tendinitis supraspinatus, bursitis, atau capsulitis (Frozen Shoulder).",
            procedure: "Pasien menggaruk punggung atas (angulus medialis skapula) lewat atas atau bawah.",
            positive: "Pasien tidak mampu menyentuh area skapula atau timbul nyeri hebat.",
            target: ["b710", "s710"]
        },
        {
            id: "rockwood",
            name: "Anterior Instability (Rockwood Test)",
            description: "Mengevaluasi derajat sublukasi anterior caput humerus.",
            procedure: "Abduksi lengan 45, 90, dan 120 derajat diikuti rotasi lateral pasif.",
            positive: "Nyeri dan kecemasan pasien (apprehension) pada posisi 90 derajat.",
            target: ["b710", "s710"]
        },
        {
            id: "crank_test",
            name: "Apprehension / Crank Test",
            description: "Mendeteksi kerentanan dislokasi anterior bahu.",
            procedure: "Abduksi 90 derajat dan rotasi eksternal perlahan. Dorong caput humeri ke depan.",
            positive: "Pasien merasa nyeri, takut (apprehend), atau terdengar suara 'klik'.",
            target: ["b710", "s710"]
        },
        {
            id: "laxity_test",
            name: "Laxity Test (Load & Shift)",
            description: "Mengevaluasi stabilitas sendi (kelemahan kapsul).",
            procedure: "Geser caput humeri ke arah posterior dan anterior dalam fosa glenoid (Manual gliding).",
            positive: "Gerakan gliding berlebih atau rasa tidak stabil pada sendi.",
            target: ["b710", "s710"]
        },
        {
            id: "post_drawer",
            name: "Posterior Drawer Test",
            description: "Mendeteksi ketidakstabilan bahu arah posterior.",
            procedure: "Dorong caput humerus ke arah posterior dalam posisi fleksi bahu 80-100 derajat.",
            positive: "Mobilitas posterior yang berlebih dibanding sisi sehat.",
            target: ["b710", "s710"]
        },
        {
            id: "sulcus_sign",
            name: "Inferior Instability (Sulcus Sign)",
            description: "Mendeteksi ketidakstabilan multi-arah/inferior.",
            procedure: "Traksi lengan ke bawah (inferior) sambil memfiksasi skapula.",
            positive: "Adanya gap (sulcus) antara akromion dan caput humerus.",
            target: ["b710", "s710"]
        },
        {
            id: "clunk_test",
            name: "Clunk Test",
            description: "Mendeteksi robekan Labrum Glenoid.",
            procedure: "Pasien telentang, abduksi penuh, dorong caput humerus ke anterior sambil rotasi lateral.",
            positive: "Terdengar suara 'clunk' atau bunyi 'klik/bising' di sendi bahu.",
            target: ["s7102"]
        },
        {
            id: "cross_flexion",
            name: "Cross-Flexion Test",
            description: "Provokasi nyeri sendi Acromioclavicular (AC Joint).",
            procedure: "Abduksi 90 derajat lalu adduksi horizontal maksimal ke arah badan.",
            positive: "Nyeri tajam pada area sendi acromioclavicular.",
            target: ["b2801", "s710"]
        },
        {
            id: "ac_shear",
            name: "Acromioclavicular Shear Test",
            description: "Menentukan sumber nyeri pada AC Joint.",
            procedure: "Remas klavikula dan spina skapula secara bersamaan (compression).",
            positive: "Nyeri atau gerakan abnormal pada sendi AC.",
            target: ["b2801", "s710"]
        },
        {
            id: "obrien_test",
            name: "O’Brien Test",
            description: "Mendeksi kompresi pada AC Joint atau robekan Labrum Superior (SLAP).",
            procedure: "Fleksi bahu 90, adduksi 15, rotasi internal maksimal, beri tahanan ke bawah. Ulangi dalam posisi supinasi.",
            positive: "Nyeri saat rotasi internal yang berkurang saat posisi supinasi.",
            target: ["b2801", "s710"]
        },
        {
            id: "yergason",
            name: "Yergason’s Test",
            description: "Mengevaluasi stabilitas tendon Biceps (Long head/SLAP).",
            procedure: "Siku fleksi 90, pasien supinasi & rotasi eksternal melawan tahanan (pemeriksa dorong ekstensi).",
            positive: "Nyeri di sulcus bicipitalis atau tendon keluar dari jalurnya.",
            target: ["b2801", "s710"]
        },
        {
            id: "speed_test",
            name: "Speed’s Test",
            description: "Mendeteksi Tendinitis Biceps atau ruptur tendon.",
            procedure: "Lengan supinasi, bahu fleksi 90, berikan tahanan ke arah bawah (ekstensi).",
            positive: "Peningkatan nyeri (tenderness) didalam sulcus bicipitalis.",
            target: ["b2801", "s7101"]
        },
        {
            id: "drop_arm",
            name: "Drop Arm Test (Moseley)",
            description: "Mendeteksi ruptur Rotator Cuff (khususnya Supraspinatus).",
            procedure: "Abduksikan lengan pasif ke 90 derajat, minta pasien menurunkan pelan-pelan.",
            positive: "Lengan pasien jatuh tiba-tiba (tidak mampu menahan) pada posisi abduksi 90.",
            target: ["b730", "s710"]
        },
        {
            id: "hawkins_kennedy",
            name: "Hawkins Supraspinatus Impingement Test",
            description: "Tes jepitan (impingement) sub-acromial.",
            procedure: "Bahu fleksi 90 derajat, siku fleksi 90 derajat, lalu rotasi internal paksa secara cepat.",
            positive: "Nyeri tajam pada bagian lateral/sub-acromial bahu.",
            target: ["b2801", "s710"]
        },
        {
            id: "empty_can",
            name: "Empty Can Test (Supraspinatus)",
            description: "Mendeteksi cedera/robekan pada tendon supraspinatus.",
            procedure: "Abduksi 90 derajat dalam bidang skapula, rotasi internal penuh (jempol bawah), beri tahanan abduksi.",
            positive: "Nyeri hebat atau kelemahan otot selama melawan tahanan.",
            target: ["b2801", "b730"]
        },
        {
            id: "neer_test",
            name: "Neer Test (Impingement)",
            description: "Mendeteksi impingement (jepitan) pada sub-acromial.",
            procedure: "Lengan deputar ke arah internal rotasi penuh (jempol bawah), lalu angkat (fleksi) lengan secara pasif semaksimal mungkin ke depan.",
            positive: "Timbul nyeri tajam di area subacromial atau lateral bahu.",
            target: ["b2801", "s710"]
        },
        {
            id: "adson_maneuver",
            name: "Adson Maneuver",
            description: "Mendeteksi Thoracic Outlet Compression Syndrome (TOCS).",
            procedure: "Kepala rotasi & ekstensi ke sisi yang diuji, tarik napas dalam, cek denyut a. radialis.",
            positive: "Denyut arteri radialis hilang atau melemah secara signifikan.",
            target: ["b280", "b265", "s120"]
        },
        {
            id: "allen_maneuver",
            name: "Allen Maneuver",
            description: "Mendeteksi Thoracic Outlet Compression Syndrome (TOCS).",
            procedure: "Siku fleksi 90, bahu ekstensi horizontal & rotasi lateral, rotasi kepala ke sisi berlawanan.",
            positive: "Denyut arteri radialis hilang saat kepala rotasi ke sisi berlawanan.",
            target: ["b280", "b265", "s120"]
        },
        {
            id: "halstead_maneuver",
            name: "Halstead Maneuver",
            description: "Mendeteksi Thoracic Outlet Compression Syndrome (TOCS).",
            procedure: "Terapis menarik lengan ke bawah, leher pasien hiperekstensi & rotasi ke sisi berlawanan.",
            positive: "Hilangnya denyutan arteri radialis.",
            target: ["b280", "b265", "s120"]
        },
        {
            id: "cyriax_test",
            name: "Tes Cyriax (Passive Scapular Elevation)",
            description: "Mendeteksi Thoracic Outlet Compression Syndrome (TOCS).",
            procedure: "Angkat (elevasi) skapula pasien secara pasif selama beberapa menit.",
            positive: "Timbul rasa kesemutan pada jari-jari tangan (paresthesia).",
            target: ["b280", "b265", "s120"]
        },
        {
            id: "roos_test",
            name: "Roos Test (EAST Test)",
            description: "Mendeteksi Thoracic Outlet Compression Syndrome (TOCS).",
            procedure: "Abduksi 90, siku 90, bahu retraksi. Buka-tutup kepalan tangan kuat-kuat selama 3 menit.",
            positive: "Kelelahan berlebih atau kesemutan sebelum 3 menit (biasanya < 1 menit).",
            target: ["b280", "b265", "s120"]
        }
    ],
    "Elbow": [
        {
            id: "elbow_ligament_instability",
            name: "Varus/Valgus Stress Test (Elbow)",
            description: "Menilai integritas ligamen collateral medial dan lateral siku.",
            procedure: "Siku fleksi 20-30 derajat. Berikan stress Varus (adduksi) untuk ligamen lateral dan Valgus (abduksi) untuk ligamen medial.",
            positive: "Adanya gap/longgar pada sendi atau nyeri tajam saat stress diberikan.",
            target: ["b710", "s720"]
        },
        {
            id: "cozen_test",
            name: "Cozen’s Test",
            description: "Mendeteksi Lateral Epicondylitis (Tennis Elbow).",
            procedure: "Siku fleksi 90, kepalkan tangan, pronasi, radial deviasi. Minta pasien ekstensi wrist melawan tahanan.",
            positive: "Nyeri tajam pada epikondilus lateral humeri.",
            target: ["b28014", "s720"]
        },
        {
            id: "maudsley_test",
            name: "Maudsley's Test (Third Finger Extension)",
            description: "Mendeteksi Lateral Epicondylitis (M. Extensor Carpi Radialis Brevis).",
            procedure: "Berikan tahanan pada ekstensi jari ke-III (jari tengah) pasien.",
            positive: "Timbul nyeri hebat di atas epikondilus lateral.",
            target: ["b28014", "s720"]
        },
        {
            id: "mill_test",
            name: "Mill’s Test",
            description: "Mendeteksi Lateral Epicondylitis (Tennis Elbow).",
            procedure: "Lengan pronasi, fleksi jari & wrist, lalu luruskan siku secara pasif (stretching ekstensos).",
            positive: "Nyeri tajam pada area epikondilus lateral.",
            target: ["b28014", "s720"]
        },
        {
            id: "golfers_elbow",
            name: "Golfer's Elbow (Medial Epicondylitis Test)",
            description: "Mendeteksi Medial Epicondylitis.",
            procedure: "Lengan supinasi, ekstensi siku dan wrist secara pasif. Bisa ditambah tahanan fleksi wrist.",
            positive: "Nyeri tajam di epikondilus medial humeri.",
            target: ["b28014", "s720"]
        },
        {
            id: "forearm_extension_test",
            name: "Forearm Extension Test (Medial)",
            description: "Mendeteksi Medial Epicondylitis.",
            procedure: "Siku fleksi, forearm supinasi. Minta pasien ekstensi siku melawan tahanan.",
            positive: "Nyeri bertambah di area epikondilus medial.",
            target: ["b28014", "s720"]
        },
        {
            id: "elbow_flexion_test",
            name: "Elbow Flexion Test (Cubital Tunnel)",
            description: "Mendeteksi Cubital Tunnel Syndrome (Saraf Ulnaris).",
            procedure: "Fleksi siku maksimal dan pertahankan posisi tersebut selama 3-5 menit.",
            positive: "Paresthesia (kesemutan) atau mati rasa sepanjang distribusi saraf ulnar (jari 4-5).",
            target: ["b265", "b280", "s12038"]
        },
        {
            id: "pressure_provocation",
            name: "Pressure Provocation Test (Ulnar Nerve)",
            description: "Mendeteksi kompresi saraf ulnaris pada siku.",
            procedure: "Siku fleksi 20 derajat, forearm supinasi. Tekan saraf ulnaris di sulcus ulnaris selama 1 menit.",
            positive: "Peningkatan nyeri, kesemutan, atau mati rasa di area inervasi saraf ulnaris.",
            target: ["b265", "b280", "s12038"]
        }
    ],
    "Wrist": [
        {
            id: "phalen_test",
            name: "Phalen's Test",
            description: "Mendeteksi Carpal Tunnel Syndrome (CTS).",
            procedure: "Fleksi 90 derajat pada kedua pergelangan tangan, punggung tangan saling menempel selama 60 detik.",
            positive: "Tangan terasa kebas, kesemutan, atau terbakar (distribusi N. Medianus).",
            target: ["b265", "s120"]
        },
        {
            id: "reverse_phalen",
            name: "Reverse Phalen (Test Pray)",
            description: "Mendeteksi Carpal Tunnel Syndrome (CTS).",
            procedure: "Kedua telapak tangan menempel (seperti berdoa) di depan dada, tahan selama 60 detik.",
            positive: "Tangan terasa kebas atau terbakar.",
            target: ["b265", "s120"]
        },
        {
            id: "tinel_wrist",
            name: "Tinel’s Sign (Wrist)",
            description: "Mendeteksi Carpal Tunnel Syndrome (CTS).",
            procedure: "Ketuk dengan ringan di atas retinakulum fleksor (terowongan karpal).",
            positive: "Timbul sensasi paresthesia (kesemutan) distal dari pergelangan tangan.",
            target: ["b265", "s120"]
        },
        {
            id: "carpal_compression",
            name: "Carpal Compression Test (Durkan’s)",
            description: "Mendeteksi kompresi saraf medianus (CTS).",
            procedure: "Tekan kuat dengan kedua ibu jari tepat di tengah retinakulum fleksor selama 1 menit.",
            positive: "Timbul paresthesia dalam distribusi saraf medianus.",
            target: ["b265", "s120"]
        },
        {
            id: "flick_sign",
            name: "Flick Sign Test",
            description: "Mendukung diagnosa CTS.",
            procedure: "Pasien diminta mengibas-ngibaskan tangan atau menggerakkan jari-jari.",
            positive: "Keluhan nyeri/kesemutan berkurang atau menghilang setelah mengibas tangan.",
            target: ["b265", "s120"]
        },
        {
            id: "finkelstein",
            name: "Finkelstein's Test",
            description: "Mendiagnosa De Quervain's Syndrome.",
            procedure: "Ibu jari dilipat dalam kepalan, lalu lakukan deviasi ulnar (bisa ditambah sedikit ekstensi).",
            positive: "Nyeri hebat di atas processus styloideus radialis (tendon APL & EPB).",
            target: ["b28014", "s730"]
        },
        {
            id: "allen_test_wrist",
            name: "Allen’s Test (Vascular)",
            description: "Menentukan patensi arteri radialis dan ulnaris.",
            procedure: "Tekan arteri radialis & ulnaris, pompa tangan (buka-tutup jari), lalu lepas salah satu arteri secara bergantian.",
            positive: "Warna telapak tangan lambat kembali merah (menunjukkan gangguan sirkulasi pembuluh darah).",
            target: ["b410", "b420"]
        },
        {
            id: "froment_sign",
            name: "Froment’s Sign",
            description: "Mendeteksi kelumpuhan Saraf Ulnaris (Kelemahan M. Adductor Pollicis).",
            procedure: "Pasien diminta memegang kertas di antara ibu jari dan jari telunjuk. Tarik kertas tersebut.",
            positive: "Sendi IP ibu jari fleksi (menggunakan M. Flexor Pollicis Longus) untuk menahan kertas.",
            target: ["b730", "s120"]
        },
        {
            id: "watenberg_sign",
            name: "Wartenberg’s Sign",
            description: "Mendeteksi neuropati ulnar.",
            procedure: "Ekstensi penuh semua jari, lalu minta pasien melakukan adduksi (merapatkan) semua jari.",
            positive: "Pasien tidak mampu merapatkan jari ke-5 (kelingking) ke jari manis.",
            target: ["b730", "s120"]
        },
        {
            id: "bunnel_littler",
            name: "Bunnel-Littler Test",
            description: "Membedakan kontraktur otot intrinsik vs kapsul sendi.",
            procedure: "Ekstensi MCP lalu fleksi PIP. Bandingkan dengan posisi MCP fleksi.",
            positive: "PIP tidak bisa fleksi (kapsul sendi) atau fleksi membaik saat MCP fleksi (otot intrinsik).",
            target: ["b710", "s730"]
        },
        {
            id: "retinacular_test",
            name: "Tight Retinacular Ligament Test",
            description: "Mendeteksi pemendekan ligamen retinacular atau kapsul DIP.",
            procedure: "PIP ekstensi penuh lalu fleksi DIP. Jika terbatas, ulangi dengan PIP fleksi.",
            positive: "DIP tetap tidak bisa fleksi (kontraktur DIP) atau fleksi membaik (retinacular ligament).",
            target: ["b710", "s730"]
        },
        {
            id: "grind_test",
            name: "Grind Test (CMC Osteoarthritis)",
            description: "Menilai osteoarthritis pada sendi carpometacarpal (CMC) I.",
            procedure: "Tekan ibu jari ke arah axis longitudinal sambil melakukan gerakan grinding (memutar).",
            positive: "Nyeri tajam, krepitasi, atau ketidakstabilan pada sendi CMC ibu jari.",
            target: ["b28014", "s7301"]
        },
        {
            id: "piano_key",
            name: "Piano Key Test",
            description: "Mendeteksi instabilitas Inferior Radio-Ulnar Joint (DRUJ).",
            procedure: "Lengan pronasi, tekan bagian distal ulna ke arah bawah (seperti menekan tombol piano).",
            positive: "Terasa nyeri atau pergerakan ulna yang berlebihan (hipermobile).",
            target: ["b710", "s730"]
        },
        {
            id: "radial_collateral_stress",
            name: "Radial Collateral Ligament Stress Test",
            description: "Mengevaluasi integritas ligamen radial kolateral.",
            procedure: "Ulnar deviasi (adduksi wrist) secara pasif hingga maksimal (normal 30-45 derajat).",
            positive: "Nyeri tajam pada sisi lateral atau ROM yang berlebihan.",
            target: ["b710", "s730"]
        },
        {
            id: "ulnar_collateral_stress",
            name: "Ulnar Collateral Ligament Stress Test",
            description: "Mengevaluasi integritas ligamen ulnar kolateral.",
            procedure: "Radial deviasi (abduksi wrist) secara pasif hingga maksimal (normal 15 derajat).",
            positive: "Nyeri tajam pada sisi medial atau ROM yang berlebihan.",
            target: ["b710", "s730"]
        },
        {
            id: "tfcc_load_test",
            name: "TFCC Load Test",
            description: "Mendeteksi robekan atau degenerasi TFCC.",
            procedure: "Lakukan kompresi axial, ulnar deviasi, diikuti gerakan fleksi/ekstensi wrist.",
            positive: "Nyeri lokal pada sisi ulnar, klik, atau krepitasi.",
            target: ["b28014", "s7302"]
        },
        {
            id: "supination_lift",
            name: "Supination Lift Test",
            description: "Memeriksa patologi TFCC (Dorsal tear).",
            procedure: "Siku fleksi 90, supinasi. Pasien mencoba mengangkat beban/tangan pemeriksa dengan telapak tangan.",
            positive: "Nyeri pada bagian ulnar dan kesulitan melakukan dorongan.",
            target: ["b28014", "s7302"]
        },
        {
            id: "watson_test",
            name: "Watson Test (Scaphoid Shift)",
            description: "Mendeteksi instabilitas Scapho-lunate.",
            procedure: "Tekan tuberkulum skafoid ke arah dorsal, gerakkan wrist dari ulnar ke radial deviasi.",
            positive: "Terdengar bunyi klik, nyeri, atau pergeseran tulang skafoid.",
            target: ["b710", "s730"]
        }
    ],
    "Hip": [
        {
            id: "trendelenburg",
            name: "Trendelenburg’s Test",
            description: "Menilai stabilitas panggul (Kekuatan M. Gluteus Medius).",
            procedure: "Pasien berdiri satu kaki di sisi yang diuji. Amati posisi panggul sisi yang bebas (non-weight bearing).",
            positive: "Panggul sisi yang bebas justru jatuh ke bawah (tidak terangkat).",
            target: ["b730", "b770"]
        },
        {
            id: "lateral_step_down",
            name: "Lateral Step Down (Pelvis Drop Test)",
            description: "Menilai kelemahan hip dan kontrol rotator lateral.",
            procedure: "Pasien berdiri di atas meja kecil dengan satu kaki, kaki lainnya melayang turun perlahan.",
            positive: "Kaki yang melayang terjatuh dengan cepat atau pasien kehilangan keseimbangan.",
            target: ["b760", "b770"]
        },
        {
            id: "ober_test",
            name: "Ober’s Test",
            description: "Menilai ketegangan Traktus Iliotibial (ITB).",
            procedure: "Pasien miring, abduksikan kaki penuh, fleksi lutut 90, lalu lepaskan tungkai perlahan.",
            positive: "Paha tetap tertahan dalam posisi abduksi (tidak turun merapat ke bed).",
            target: ["b710", "s750"]
        },
        {
            id: "thomas_test",
            name: "Thomas’s Test",
            description: "Menilai fleksibilitas grup otot Iliopsoas (Fleksor Hip).",
            procedure: "Pasien telentang, satu lutut ditarik ke dada. Biarkan kaki satunya relaks di tepi meja.",
            positive: "Punggung bawah tidak bisa menempel di bed atau hip tidak bisa ekstensi penuh.",
            target: ["b710", "s75001"]
        },
        {
            id: "ely_test",
            name: "Ely’s Test",
            description: "Menilai ketegangan otot Rectus Femoris.",
            procedure: "Pasien tengkurap, fleksikan lutut pasien secara pasif ke arah tumit menyentuh pantat.",
            positive: "Panggul (pelvis) ikut terangkat ke atas saat lutut difleksikan.",
            target: ["b710", "s750"]
        },
        {
            id: "phelps_test",
            name: "Phelp’s Test",
            description: "Menilai ketegangan otot adduktor (Gracilis) atau rotator hip.",
            procedure: "Tengkurap, lutut fleksi 90, lalu abduksikan hip maksimal.",
            positive: "Adanya keterbatasan gerak abduksi (terutama dibandingkan sisi sehat).",
            target: ["b710", "s750"]
        },
        {
            id: "gapping_anterior",
            name: "Anterior Gapping Test (Anterior SIJ)",
            description: "Mendeteksi kelainan ligamen anterior SIJ.",
            procedure: "Telentang, letakkan tangan bersilangan di SIAS, lakukan kompresi/penekanan ke arah luar.",
            positive: "Timbul rasa nyeri pada area sendi Sacroiliaca.",
            target: ["b28013", "s760"]
        },
        {
            id: "gapping_posterior",
            name: "Posterior Gapping Test (Posterior SIJ)",
            description: "Mendeteksi kelainan ligamen posterior SIJ.",
            procedure: "Pasien tidur miring, lakukan kompresi/penekanan langsung pada area pelvis.",
            positive: "Timbul rasa nyeri pada area sendi Sacroiliaca.",
            target: ["b28013", "s760"]
        },
        {
            id: "gaenslen_test",
            name: "Gaenslen’s Test",
            description: "Mendeteksi gangguan/keterbatasan gerak SIJ.",
            procedure: "Satu kaki ditarik ke dada, kaki sisi uji diturunkan di tepi bed. Berikan penekanan pada keduanya.",
            positive: "Timbul rasa nyeri pada area SIJ.",
            target: ["b28013", "s760"]
        },
        {
            id: "patrick_faber",
            name: "Patrick’s (FABERE) Test",
            description: "Mendeteksi patologi Hip atau Lig. Anterior SIJ.",
            procedure: "Tumit diletakkan di lutut kaki satunya (angka 4), lalu lutut ditekan ke bawah.",
            positive: "Timbul nyeri di area selangkangan (Groin) atau SIJ.",
            target: ["b28013", "s750"]
        },
        {
            id: "anti_patrick",
            name: "Anti-Patrick Test",
            description: "Mendeteksi kelainan ligamen posterior SIJ.",
            procedure: "Pasien telentang dengan kaki rotasi internal, lakukan penekanan pada lutut ke arah medial.",
            positive: "Timbul rasa nyeri pada sendi Sacroiliaca.",
            target: ["b28013", "s760"]
        },
        {
            id: "true_leg_length",
            name: "True Leg Length Discrepancy",
            description: "Mengukur panjang tungkai nyata.",
            procedure: "Ukur dari SIAS ke Malleolus Medialis. Pastikan pelvic dalam posisi sejajar.",
            positive: "Perbedaan panjang > 1.5 cm di antara kedua tungkai.",
            target: ["s750"]
        },
        {
            id: "slr_test",
            name: "Straight-Leg Raise (SLR / Laseque)",
            description: "Mendeteksi iritasi N. Ischiadicus (HNP).",
            procedure: "Pasien telentang, kaki diangkat lurus (lutut ekstensi).",
            positive: "Nyeri kejut/tajam menjalar sepanjang tungkai sebelum sudut 70 derajat.",
            target: ["b28015", "s120"]
        },
        {
            id: "bragard_test",
            name: "Bragard’s Test",
            description: "Memperkuat tes SLR (N. Ischiadicus).",
            procedure: "Lakukan SLR hingga nyeri, turunkan sedikit, lalu tambahkan gerakan dorsofleksi ankle.",
            positive: "Nyeri tajam muncul kembali saat ankle ditekuk (dorsofleksi).",
            target: ["b28015", "s120"]
        },
        {
            id: "neri_test",
            name: "Neri Test",
            description: "Mendeteksi tegangan durai/saraf Ischiadicus.",
            procedure: "Pasien duduk, lakukan fleksi hip pasif dikombinasikan dorsofleksi ankle dan fleksi leher.",
            positive: "Nyeri atau kesemutan menjalar dari leher hingga kaki.",
            target: ["b28015", "s120"]
        }
    ],
    "Knee": [
        {
            id: "mcmurray_test",
            name: "McMurray's Test",
            description: "Mendeteksi robekan Meniskus (Medial/Lateral).",
            procedure: "Fleksi lutut maksimal, lakukan eksorotasi (medial meniscus) atau endorotasi (lateral meniscus) diikuti ekstensi lutut.",
            positive: "Terdengar/terasa bunyi 'klik' (klek) atau nyeri tajam pada sela sendi.",
            target: ["b28016", "s75001"]
        },
        {
            id: "apley_meniscus",
            name: "Apley’s Meniscus Test (Compression)",
            description: "Mendeteksi lesi/robekan meniskus.",
            procedure: "Tengkurap, lutut fleksi 90. Berikan kompresi pada tumit ke arah longitudinal axis tibia sambil rotasi.",
            positive: "Nyeri pada sela sendi lutut sisi medial atau lateral.",
            target: ["b28016", "s75001"]
        },
        {
            id: "lachman_test",
            name: "Lachman Test",
            description: "Mendeteksi lesi ACL (Lig. Krusiatum Anterior).",
            procedure: "Lutut fleksi 20-30 derajat. Fiksasi paha, tarik tungkai bawah (tibia) ke arah anterior.",
            positive: "Gerakan tibia ke depan yang berlebihan (soft end-feel) dibandingkan sisi sehat.",
            target: ["b710", "s75002"]
        },
        {
            id: "gravity_sign",
            name: "Gravity Sign (Posterior Sag)",
            description: "Mendeteksi lesi PCL (Lig. Krusiatum Posterior).",
            procedure: "Telentang, panggul fleksi 90, lutut fleksi 90. Amati ketinggian tuberositas tibia.",
            positive: "Tuberositas tibia sisi sakit nampak lebih rendah (sag) dibanding sisi sehat.",
            target: ["b710", "s75002"]
        },
        {
            id: "ballotement_test",
            name: "Ballotement Test",
            description: "Mendeteksi adanya efusi sendi (cairan berlebih) di lutut.",
            procedure: "Tekan recessus suprapatellaris, lalu tekan patella ke arah bawah dengan jari lain.",
            positive: "Patella terasa melayang atau memantul (seperti menekan es di dalam air).",
            target: ["b280", "s75002"]
        },
        {
            id: "fluctuation_test",
            name: "Fluctuation Test",
            description: "Mendeteksi efusi sendi lutut.",
            procedure: "Tekan kantong suprapetellar dengan satu tangan, rasakan perpindahan cairan di samping patella dengan tangan lain.",
            positive: "Terasa adanya fluktuasi/perpindahan cairan di bawah jari.",
            target: ["b280", "s75002"]
        },
        {
            id: "knee_ligament_instability",
            name: "Varus/Valgus Stress Test (Knee)",
            description: "Menilai integritas ligamen kolateral medial (MCL) dan lateral (LCL).",
            procedure: "Lutut fleksi 20-30 derajat. Berikan stress valgus (abduksi) untuk MCL dan varus (adduksi) untuk LCL.",
            positive: "Adanya nyeri atau celah (gapping) pada sisi sendi yang diuji.",
            target: ["b710", "s75002"]
        },
        {
            id: "active_anterior_drawer",
            name: "Active Anterior Drawer Sign",
            description: "Mendeteksi cedera ACL.",
            procedure: "Tahan kaki pasien, minta pasien mencoba meluruskan (ekstensi) lutut secara aktif.",
            positive: "Tibia plateau nampak bergeser/bergerak ke anterior.",
            target: ["b710", "s75002"]
        },
        {
            id: "posterior_drawer_sign",
            name: "Posterior Drawer Sign",
            description: "Mendeteksi cedera PCL.",
            procedure: "Lutut fleksi 90, dorong tungkai bawah (tibia proksimal) ke arah dorsal/posterior.",
            positive: "Gerakan ke belakang > 6 mm (atau lebih dalam dibanding sisi sehat.",
            target: ["b710", "s75002"]
        },
        {
            id: "slocum_test",
            name: "Slocum Test (Rotary Instability)",
            description: "Mendeteksi ketidakstabilan rotasi anterolateral atau anteromedial.",
            procedure: "Lakukan Anterior Drawer dengan tibia posisi rotasi internal 30 derajat atau eksternal 15 derajat.",
            positive: "Subluksasi tibia yang abnormal pada sisi lateral atau medial.",
            target: ["b710", "s75002"]
        },
        {
            id: "dejour_test",
            name: "Dejour Test",
            description: "Menilai derajat cedera ACL dan kapsul posterolateral.",
            procedure: "Berikan stress varus, angkat tibia sambil menekan femur ke bawah.",
            positive: "Subluksasi tibia ke anterior (Grade 1/2/3 berdasarkan milimeter gerakan).",
            target: ["b710", "s75002"]
        },
        {
            id: "pivot_shift_macintosh",
            name: "Lateral Pivot Shift (MacIntosh Test)",
            description: "Mendeteksi ruptur ACL and instabilitas anterolateral.",
            procedure: "Lutut ekstensi, abduksi panggul, rotasi internal tibia. Perlahan dorong ke arah fleksi lutut + valgus stress.",
            positive: "Terdengar/terasa entakan (jerk) saat tibia mereduksi diri pada fleksi 30-40 derajat.",
            target: ["b710", "s75002"]
        },
        {
            id: "jerk_test_hughston",
            name: "Jerk Test of Hughston",
            description: "Mendeteksi ruptur ACL and instabilitas anterolateral.",
            procedure: "Mulai dari lutut fleksi 90, luruskan lutut sambil berikan varus stress dan rotasi internal tibia.",
            positive: "Tibia plateau bagian lateral bergeser ke anterior pada sudut fleksi 20-30 derajat.",
            target: ["b710", "s75002"]
        },
        {
            id: "noyes_drawer",
            name: "Noyes Flexion-Rotation Drawer Test",
            description: "Mendeteksi ruptur ACL.",
            procedure: "Fleksikan lutut 15-30 derajat, dorong tibia ke posterior untuk mereduksi subluksasi.",
            positive: "Subluksasi tibia berkurang secara signifikan saat didorong ke posterior.",
            target: ["b710", "s75002"]
        },
        {
            id: "posteromedial_pivot_shift",
            name: "Posteromedial Pivot Shift Test",
            description: "Mendeteksi cedera PCL dan kompleks posteromedial.",
            procedure: "Lutut fleksi 45, berikan valgus stress + kompresi + rotasi internal tibia, lalu luruskan.",
            positive: "Subluksasi tibia medial ke posterior yang membaik saat lutut diluruskan.",
            target: ["b710", "s75002"]
        },
        {
            id: "jakob_test",
            name: "Jakob Test (Reverse Pivot Shift)",
            description: "Mendeteksi cedera LCL dan kapsul lateral.",
            procedure: "Pasien fleksi lutut, berikan varus stress sambil meluruskan lutut.",
            positive: "Tibia plateau bergeser ke posterior secara abnormal.",
            target: ["b710", "s75002"]
        },
        {
            id: "bounce_home_test",
            name: "Bounce Home Test",
            description: "Mendeteksi robekan Meniskus (Buckle handle tear).",
            procedure: "Fleksi lutut penuh lalu luruskan secara tiba-tiba.",
            positive: "Lutut tidak bisa lurus sempurna atau terasa sensasi 'mengeper' (springy block).",
            target: ["b28016", "s75001"]
        }
    ],
    "Ankle": [
        {
            id: "anterior_drawer_ankle",
            name: "Anterior Drawer Sign (Ankle)",
            description: "Mengecek integritas ligamen talofibular anterior (ATFL).",
            procedure: "Ankle fleksi 20 derajat, fiksasi tungkai bawah, tarik kalkaneus & talus ke arah anterior.",
            positive: "Timbul nyeri atau gerakan kaki berlebihan ke anterior (ATFL Sprain).",
            target: ["b710", "s7502"]
        },
        {
            id: "talar_tilt_inversion",
            name: "Inversion Talar Tilt Test",
            description: "Mengecek ruptur ligamen ATFL (posisi PF) atau CFL (posisi netral).",
            procedure: "Gerakkan calcaneus ke arah inverse (dalam) secara cepat sementara ankle dalam posisi netral/plantar fleksi.",
            positive: "Posisi talus miring (tilted) saat dipalpasi atau terasa nyeri hebat.",
            target: ["b710", "s7502"]
        },
        {
            id: "talar_tilt_eversion",
            name: "Eversion Talar Tilt Test",
            description: "Mendeteksi sprain pada ligamen Deltoid (medial).",
            procedure: "Fiksasi calcaneus, lakukan gerakan eversi (luar) pada kaki pasien secara pasif.",
            positive: "Posisi talus miring atau nyeri tajam pada sisi medial ankle.",
            target: ["b710", "s7502"]
        },
        {
            id: "thompson_test",
            name: "Thompson Test (Achilles)",
            description: "Mendeteksi robekan (ruptur) total Tendon Achilles.",
            procedure: "Pasien tengkurap, kaki menggantung. Remas muscle belly gastrocnemius (betis).",
            positive: "Kaki TIDAK melakukan gerakan plantar fleksi (Stay still).",
            target: ["b280", "s7502", "b730"]
        },
        {
            id: "heel_tap_test",
            name: "Heel Tap (Bump) Test",
            description: "Mengidentifikasi patah tulang (Fraktur) pada tibia, fibula, talus, atau calcaneus.",
            procedure: "Kaki menggantung, lutut lurus. Pukul bagian bawah calcaneus dengan telapak tangan secara progresif.",
            positive: "Nyeri tajam dan/atau krepitasi pada area yang dicurigai fraktur.",
            target: ["b280", "s710"]
        },
        {
            id: "percussion_tibia",
            name: "Percussion of Tibia Test",
            description: "Mendeteksi kemungkinan fraktur pada tulang tibia.",
            procedure: "Tidur telentang, lakukan ketukan (perkusi) langsung pada tulang tibia.",
            positive: "Timbul nyeri tajam pada titik ketukan.",
            target: ["b280", "s710"]
        },
        {
            id: "squeeze_test_ankle",
            name: "Squeeze Test (Ankle)",
            description: "Mengidentifikasi cedera syndesmotic tibiofibular.",
            procedure: "Tekan tibia dan fibula secara perlahan di area 6-8 inchi di bawah lutut, beri tekanan berlebih.",
            positive: "Respon nyeri hebat pada area distal (syndesmosis).",
            target: ["b280", "s7502"]
        },
        {
            id: "side_to_side_test",
            name: "Side-to-Side Test",
            description: "Mendeteksi Syndesmosis sprain.",
            procedure: "Geser talus/calcaneus ke arah lateral dan medial secara bergantian sambil memfiksasi tungkai bawah.",
            positive: "Timbul nyeri atau terdengar bunyi klik/entakan.",
            target: ["b710", "s7502"]
        },
        {
            id: "mtp_stress_test",
            name: "Varus/Valgus Stress Test (MTP)",
            description: "Mendeteksi sprain ligamen collateral pada sendi MTP.",
            procedure: "Fiksasi tulang proksimal jari, gerakkan tulang distal (jari) ke arah medial (varus) dan lateral (valgus).",
            positive: "Peningkatan laxity (kelonggaran) atau nyeri pada sendi MTP.",
            target: ["b710", "s7502"]
        },
        {
            id: "feiss_line_test",
            name: "Feiss’ Line Test",
            description: "Mendeteksi Hyperpronation/Flat Foot (Pes Planus).",
            procedure: "Tarik garis dari malleolus medial ke MTP 1. Bandingkan posisi tuberkulum navicular saat duduk vs berdiri.",
            positive: "Navicular turun lebih dari 10 mm saat berdiri (Weight bearing).",
            target: ["b710", "s7502"]
        },
        {
            id: "supple_pes_planus",
            name: "Supple Pes Planus Test",
            description: "Menilai kelengkungan arkus longitudinal medial.",
            procedure: "Amati arkus saat pasien duduk (non-weight bearing) vs saat pasien berdiri (weight bearing).",
            positive: "Arkus menghilang total saat berdiri namun muncul kembali saat duduk.",
            target: ["b710", "s7502"]
        },
        {
            id: "homan_sign",
            name: "Homan’s Sign Test",
            description: "Screening Deep Vein Thrombophlebitis (DVT).",
            procedure: "Lutut lurus, lakukan dorsofleksi pasif maksimal pada ankle, lalu palpasi area betis.",
            positive: "Nyeri hebat di betis, nampak pucat/bengkak, atau mati rasa saat dipalpasi.",
            target: ["b415", "b280"]
        }
    ]
};
