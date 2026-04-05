
/**
 * DATABASE MASTER ICF (International Classification of Functioning, Disability and Health)
 * File ini berisi daftar lengkap kode ICF berdasarkan standar WHO.
 */

window.ICF_QUALIFIERS = {
    // Body Functions (b): Satu kualifikator (hanya satu angka di belakang titik)
    b: [
        {
            name: "Extent of Impairment",
            desc: "Indicates the extent or magnitude of an impairment in body function.",
            values: {
                "0": "NO impairment (none, absent, negligible,...) 0-4%",
                "1": "MILD impairment (slight, low,...) 5-24%",
                "2": "MODERATE impairment (medium, fair,...) 25-49%",
                "3": "SEVERE impairment (high, extreme,...) 50-95%",
                "4": "COMPLETE impairment (total,...) 96-100%",
                "8": "not specified",
                "9": "not applicable"
            }
        }
    ],
    // Body Structures (s): Tiga kualifikator (misal: s110.123)
    s: [
        {
            name: "Extent of Impairment",
            desc: "Magnitude of impairment in body structure.",
            values: {
                "0": "NO impairment (none, absent, negligible,...) 0-4%",
                "1": "MILD impairment (slight, low,...) 5-24%",
                "2": "MODERATE impairment (medium, fair,...) 25-49%",
                "3": "SEVERE impairment (high, extreme,...) 50-95%",
                "4": "COMPLETE impairment (total,...) 96-100%",
                "8": "not specified",
                "9": "not applicable"
            }
        },
        {
            name: "Nature of Change",
            desc: "Nature of the change in the respective body structure.",
            values: {
                "0": "no change in structure",
                "1": "total absence",
                "2": "partial absence",
                "3": "additional part",
                "4": "aberrant dimensions",
                "5": "discontinuity",
                "6": "deviating position",
                "7": "qualitative changes in structure (incl. fluid accumulation)",
                "8": "not specified",
                "9": "not applicable"
            }
        },
        {
            name: "Localization",
            desc: "Indicates the localization of the structural impairment (suggested).",
            values: {
                "0": "more than one region",
                "1": "right",
                "2": "left",
                "3": "both sides",
                "4": "front",
                "5": "back",
                "6": "proximal",
                "7": "distal",
                "8": "not specified",
                "9": "not applicable"
            }
        }
    ],
    // Activities & Participation (d): Dua kualifikator (Performance & Capacity)
    d: [
        {
            name: "Performance",
            desc: "What an individual does in his or her current environment.",
            values: {
                "0": "NO difficulty 0-4%",
                "1": "MILD difficulty 5-24%",
                "2": "MODERATE difficulty 25-49%",
                "3": "SEVERE difficulty 50-95%",
                "4": "COMPLETE difficulty 96-100%",
                "8": "not specified",
                "9": "not applicable"
            }
        },
        {
            name: "Capacity",
            desc: "Ability to execute tasks without assistance/environmental aid.",
            values: {
                "0": "NO difficulty 0-4%",
                "1": "MILD difficulty 5-24%",
                "2": "MODERATE difficulty 25-49%",
                "3": "SEVERE difficulty 50-95%",
                "4": "COMPLETE difficulty 96-100%",
                "8": "not specified",
                "9": "not applicable"
            }
        }
    ],
    // Environmental Factors (e): Satu kualifikator (Barriers (-) vs Facilitators (+))
    e: [
        {
            name: "Barrier / Facilitator",
            desc: "Extents of barriers (negative) or facilitators (positive).",
            values: {
                "0": "NO barrier/facilitator",
                "1": "MILD barrier/facilitator",
                "2": "MODERATE barrier/facilitator",
                "3": "SEVERE (substantial) barrier/facilitator",
                "4": "COMPLETE barrier/facilitator",
                "8": "not specified",
                "9": "not applicable"
            }
        }
    ]
};

window.ICF_DB = {
    // --- 1. BODY FUNCTIONS (b) ---
    b: {
        ch1: {
            title: "Mental functions",
            groups: [
                {
                    name: "Global mental functions (b110-b139)",
                    codes: {
                        "b110": "Consciousness functions",
                        "b114": "Orientation functions",
                        "b117": "Intellectual functions",
                        "b122": "Global psychosocial functions",
                        "b126": "Temperament and personality functions",
                        "b130": "Energy and drive functions",
                        "b134": "Sleep functions",
                        "b139": "Global mental functions, other specified and unspecified"
                    }
                },
                {
                    name: "Specific mental functions (b140-b189)",
                    codes: {
                        "b140": "Attention functions",
                        "b144": "Memory functions",
                        "b147": "Psychomotor functions",
                        "b152": "Emotional functions",
                        "b156": "Perceptual functions",
                        "b160": "Thought functions",
                        "b164": "Higher-level cognitive functions",
                        "b167": "Mental functions of language",
                        "b172": "Calculation functions",
                        "b176": "Mental function of sequencing complex movements",
                        "b180": "Experience of self and time functions",
                        "b189": "Specific mental functions, other specified and unspecified",
                        "b198": "Mental functions, other specified",
                        "b199": "Mental functions, unspecified"
                    }
                }
            ]
        },
        ch2: {
            title: "Sensory functions and pain",
            groups: [
                {
                    name: "Seeing and related functions (b210-b229)",
                    codes: {
                        "b210": {
                            name: "Seeing functions",
                            desc: "Sensory functions relating to sensing the presence of light and sensing the form, size, shape and colour of the visual stimuli.",
                            inclusions: "visual acuity functions; visual field functions; quality of vision; functions of sensing light and colour, visual acuity of distant and near vision, monocular and binocular vision; visual picture quality; myopia, hypermetropia, astigmatism, hemianopia, colour-blindness, tunnel vision, central and peripheral scotoma, diplopia, night blindness and impaired adaptability to light",
                            exclusions: "perceptual functions (b156)",
                            subs: {
                                "b2100": {
                                    name: "Visual acuity functions",
                                    desc: "Seeing functions of sensing form and contour, both binocular and monocular, for both distant and near vision.",
                                    subs: {
                                        "b21000": "Binocular acuity of distant vision",
                                        "b21001": "Monocular acuity of distant vision",
                                        "b21002": "Binocular acuity of near vision",
                                        "b21003": "Monocular acuity of near vision",
                                        "b21008": "Visual acuity functions, other specified",
                                        "b21009": "Visual acuity functions, unspecified"
                                    }
                                },
                                "b2101": {
                                    name: "Visual field functions",
                                    desc: "Seeing functions related to the entire area that can be seen with fixation of gaze.",
                                    inclusions: "scotoma, tunnel vision, anopsia"
                                },
                                "b2102": {
                                    name: "Quality of vision",
                                    desc: "Seeing functions involving light sensitivity, colour vision, contrast sensitivity and the overall quality of the picture.",
                                    subs: {
                                        "b21020": {
                                            name: "Light sensitivity",
                                            desc: "Sensing a minimum amount of light (light minimum), and the minimum difference in intensity (light difference).",
                                            inclusions: "dark adaptation; night blindness (hyposensitivity to light) and photophobia (hypersensitivity to light)"
                                        },
                                        "b21021": "Colour vision",
                                        "b21022": "Contrast sensitivity",
                                        "b21023": {
                                            name: "Visual picture quality",
                                            desc: "Seeing functions involving the quality of the picture.",
                                            inclusions: "stray lights, floaters or webbing, picture distortion, stars or flashes"
                                        },
                                        "b21028": "Quality of vision, other specified",
                                        "b21029": "Quality of vision, unspecified"
                                    }
                                },
                                "b2108": "Seeing functions, other specified",
                                "b2109": "Seeing functions, unspecified"
                            }
                        },
                        "b215": {
                            name: "Functions of structures adjoining the eye",
                            desc: "Functions of structures in and around the eye that facilitate seeing functions.",
                            inclusions: "internal muscles of the eye, eyelid, external muscles of the eye, voluntary and tracking movements, fixation of the eye, lachrymal glands, accommodation, pupillary reflex; nystagmus, xerophthalmia and ptosis",
                            exclusions: "seeing functions (b210); Chapter 7 Neuromusculoskeletal and Movement-related Functions",
                            subs: {
                                "b2150": {
                                    name: "Functions of internal muscles of the eye",
                                    desc: "Functions of the muscles inside the eye, such as the iris, that adjust the shape and size of the pupil and lens of the eye.",
                                    inclusions: "accommodation; pupillary reflex"
                                },
                                "b2151": "Functions of the eyelid",
                                "b2152": {
                                    name: "Functions of external muscles of the eye",
                                    desc: "Functions of the muscles used to look in different directions, follow a moving object, and fix the eye.",
                                    inclusions: "nystagmus; cooperation of both eyes"
                                },
                                "b2153": "Functions of lachrymal glands",
                                "b2158": "Functions of structures adjoining the eye, other specified",
                                "b2159": "Functions of structures adjoining the eye, unspecified"
                            }
                        },
                        "b220": {
                            name: "Sensations associated with the eye and adjoining structures",
                            desc: "Sensations of tired, dry and itching eye and related feelings.",
                            inclusions: "feelings of pressure behind the eye, eye strain, burning in the eye, eye irritation",
                            exclusions: "sensation of pain (b280)"
                        },
                        "b229": "Seeing and related functions, other specified and unspecified"
                    }
                },
                {
                    name: "Hearing and vestibular functions (b230-b249)",
                    codes: {
                        "b230": {
                            name: "Hearing functions",
                            desc: "Sensory functions relating to sensing the presence of sounds and discriminating the location, pitch, loudness and quality of sounds.",
                            inclusions: "hearing, auditory discrimination, localization of sound source, lateralization of sound, speech discrimination; deafness, hearing impairment and hearing loss",
                            exclusions: "perceptual functions (b156) and mental functions of language (b167)",
                            subs: {
                                "b2300": "Sound detection",
                                "b2301": "Sound discrimination",
                                "b2302": "Localisation of sound source",
                                "b2303": "Lateralization of sound",
                                "b2304": "Speech discrimination",
                                "b2308": "Hearing functions, other specified",
                                "b2309": "Hearing functions, unspecified"
                            }
                        },
                        "b235": {
                            name: "Vestibular functions",
                            desc: "Sensory functions of the inner ear related to position, balance and movement.",
                            inclusions: "position and positional sense; balance of the body and movement",
                            exclusions: "sensation associated with hearing and vestibular functions (b240)",
                            subs: {
                                "b2350": "Vestibular function of position",
                                "b2351": "Vestibular function of balance",
                                "b2352": "Vestibular function of determination of movement",
                                "b2358": "Vestibular functions, other specified",
                                "b2359": "Vestibular functions, unspecified"
                            }
                        },
                        "b240": {
                            name: "Sensations associated with hearing and vestibular function",
                            desc: "Sensations of dizziness, falling, tinnitus and vertigo.",
                            inclusions: "ringing in ears, irritation in ear, aural pressure, nausea associated with dizziness or vertigo",
                            exclusions: "vestibular functions (b235); sensation of pain (b280)",
                            subs: {
                                "b2400": "Ringing in ears or tinnitus",
                                "b2401": "Dizziness",
                                "b2402": "Sensation of falling",
                                "b2403": "Nausea associated with dizziness or vertigo",
                                "b2404": "Irritation in the ear",
                                "b2405": "Aural pressure",
                                "b2408": "Sensations associated with hearing and vestibular function, other specified",
                                "b2409": "Sensations associated with hearing and vestibular function, unspecified"
                            }
                        },
                        "b249": "Hearing and vestibular functions, other specified and unspecified"
                    }
                },
                {
                    name: "Additional sensory functions (b250-b279)",
                    codes: {
                        "b250": {
                            name: "Taste function",
                            desc: "Sensory functions of sensing qualities of bitterness, sweetness, sourness and saltiness.",
                            inclusions: "gustatory functions; ageusia and hypogeusia"
                        },
                        "b255": {
                            name: "Smell function",
                            desc: "Sensory functions of sensing odours and smells.",
                            inclusions: "olfactory functions; anosmia or hyposmia"
                        },
                        "b260": {
                            name: "Proprioceptive function",
                            desc: "Sensory functions of sensing the relative position of body parts.",
                            inclusions: "statesthesia and kinaesthesia",
                            exclusions: "vestibular functions (b235); sensations related to muscles and movement functions (b780)"
                        },
                        "b265": {
                            name: "Touch function",
                            desc: "Sensory functions of sensing surfaces and their texture or quality.",
                            inclusions: "touching, feeling of touch; numbness, anaesthesia, tingling, paraesthesia and hyperaesthesia",
                            exclusions: "sensory functions related to temperature and other stimuli (b270)"
                        },
                        "b270": {
                            name: "Sensory functions related to temperature and other stimuli",
                            desc: "Sensory functions of sensing temperature, vibration, pressure and noxious stimulus.",
                            inclusions: "sensitivity to temperature, vibration, shaking or oscillation, superficial pressure, deep pressure, burning sensation or a noxious stimulus",
                            exclusions: "touch functions (b265); sensation of pain (b280)",
                            subs: {
                                "b2700": "Sensitivity to temperature",
                                "b2701": "Sensitivity to vibration",
                                "b2702": {
                                    name: "Sensitivity to pressure",
                                    desc: "Sensory functions of sensing pressure against or on the skin.",
                                    inclusions: "sensitivity to touch, numbness, hypaesthesia, hyperaesthesia, paraesthesia and tingling"
                                },
                                "b2703": {
                                    name: "Sensitivity to a noxious stimulus",
                                    desc: "Sensory functions of sensing painful or uncomfortable sensations.",
                                    inclusions: "hypalgesia, hyperpathia, allodynia, analgesia and anaesthesia dolorosa"
                                },
                                "b2708": "Sensations for other stimuli, other specified",
                                "b2709": "Sensations for other stimuli, unspecified"
                            }
                        },
                        "b279": "Additional sensory functions, other specified and unspecified"
                    }
                },
                {
                    name: "Pain (b280-b289)",
                    codes: {
                        "b280": {
                            name: "Sensation of pain",
                            desc: "Sensation of unpleasant feeling indicating potential or actual damage to some body structure.",
                            inclusions: "generalized or localized pain, dermatome, stabbing, burning, dull, aching pain; myalgia, analgesia and hyperalgesia",
                            subs: {
                                "b2800": "Generalized pain",
                                "b2801": {
                                    name: "Pain in body part",
                                    desc: "Felt in a specific part, or parts, of the body.",
                                    subs: {
                                        "b28010": "Pain in head and neck",
                                        "b28011": "Pain in chest",
                                        "b28012": "Pain in stomach or abdomen (incl. pelvic)",
                                        "b28013": "Pain in back (incl. trunk, low backache)",
                                        "b28014": "Pain in upper limb (incl. hands)",
                                        "b28015": "Pain in lower limb (incl. feet)",
                                        "b28016": "Pain in joints (incl. hip, shoulder)",
                                        "b28018": "Pain in body part, other specified",
                                        "b28019": "Pain in body part, unspecified"
                                    }
                                },
                                "b2802": "Pain in multiple body parts",
                                "b2803": "Radiating pain in a dermatome",
                                "b2804": "Radiating pain in a segment or region"
                            }
                        },
                        "b289": "Sensation of pain, other specified and unspecified"
                    }
                },
                {
                    name: "Sensory functions and pain, other",
                    codes: {
                        "b298": "Sensory functions and pain, other specified",
                        "b299": "Sensory functions and pain, unspecified"
                    }
                }
            ]
        },
        ch3: {
            title: "Voice and speech functions",
            groups: [
                {
                    name: "Voice and speech functions",
                    codes: {
                        "b310": {
                            name: "Voice functions",
                            desc: "Functions of the production of various sounds by the passage of air through the larynx.",
                            inclusions: "phonation, pitch, loudness; aphonia, dysphonia, hoarseness, hypernasality",
                            exclusions: "mental functions of language (b167); articulation functions (b320)",
                            subs: {
                                "b3100": "Production of voice (incl. phonation, loudness)",
                                "b3101": "Quality of voice (incl. pitch, resonance; hypernasality, dysphonia)",
                                "b3108": "Voice functions, other specified",
                                "b3109": "Voice functions, unspecified"
                            }
                        },
                        "b320": {
                            name: "Articulation functions",
                            desc: "Functions of the production of speech sounds.",
                            inclusions: "enunciation, articulation of phonemes; dysarthria, anarthria",
                            exclusions: "mental functions of language (b167); voice functions (b310)"
                        },
                        "b330": {
                            name: "Fluency and rhythm of speech functions",
                            desc: "Functions of the production of flow and tempo of speech.",
                            inclusions: "fluency, rhythm, speed, melody; prosody, intonation; stuttering, stammering, bradylalia",
                            exclusions: "language functions (b167); voice functions (b310); articulation functions (b320)",
                            subs: {
                                "b3300": "Fluency of speech (incl. connection of speech; stuttering, stammering)",
                                "b3301": "Rhythm of speech (tempo and stress patterns)",
                                "b3302": "Speed of speech (incl. bradylalia, tachylalia)",
                                "b3303": "Melody of speech (pitch patterns, intonation, prosody)",
                                "b3308": "Fluency and rhythm functions, other specified",
                                "b3309": "Fluency and rhythm functions, unspecified"
                            }
                        },
                        "b340": {
                            name: "Alternative vocalization functions",
                            desc: "Functions of the production of other manners of vocalization.",
                            inclusions: "singing, chanting, babbling, humming; crying aloud, screaming",
                            exclusions: "mental functions of language (b167); voice functions (b310); articulation (b320); fluency (b330)",
                            subs: {
                                "b3400": "Production of notes (singing, humming, chanting)",
                                "b3401": "Making a range of sounds (incl. babbling in children)",
                                "b3408": "Alternative vocalization, other specified",
                                "b3409": "Alternative vocalization, unspecified"
                            }
                        },
                        "b398": "Voice and speech functions, other specified",
                        "b399": "Voice and speech functions, unspecified"
                    }
                }
            ]
        },
        ch4: {
            title: "Functions of the cardiovascular, haematological, immunological and respiratory systems",
            groups: [
                {
                    name: "Functions of the cardiovascular system (b410-b429)",
                    codes: {
                        "b410": {
                            name: "Heart functions",
                            desc: "Functions of pumping the blood in adequate or required amounts and pressure throughout the body.",
                            inclusions: "heart rate, rhythm and output; ventricular muscles; heart valves; pulmonary circuit; tachycardia, bradycardia, heart failure",
                            exclusions: "blood vessel functions (b415); blood pressure (b420); exercise tolerance (b455)",
                            subs: {
                                "b4100": {
                                    name: "Heart rate",
                                    desc: "Number of times the heart contracts every minute.",
                                    inclusions: "tachycardia, bradycardia"
                                },
                                "b4101": {
                                    name: "Heart rhythm",
                                    desc: "Regularity of the beating of the heart.",
                                    inclusions: "arrhythmias"
                                },
                                "b4102": "Contraction force of ventricular muscles (incl. cardiac output)",
                                "b4103": "Blood supply to the heart (incl. coronary ischaemia)",
                                "b4108": "Heart functions, other specified",
                                "b4109": "Heart functions, unspecified"
                            }
                        },
                        "b415": {
                            name: "Blood vessel functions",
                            desc: "Functions of transporting blood throughout the body.",
                            inclusions: "arteries, capillaries and veins; vasomotor function; atherosclerosis, arteriosclerosis, thromboembolism and varicose veins",
                            exclusions: "heart functions (b410); blood pressure (b420); haematological (b430); exercise tolerance (b455)",
                            subs: {
                                "b4150": "Functions of arteries (incl. dilation, constriction; intermittent claudication)",
                                "b4151": "Functions of capillaries",
                                "b4152": {
                                    name: "Functions of veins",
                                    desc: "Blood flow in the veins and functions of valves of veins.",
                                    inclusions: "venous dilation; insufficient closing of valves as in varicose veins"
                                },
                                "b4158": "Blood vessel functions, other specified",
                                "b4159": "Blood vessel functions, unspecified"
                            }
                        },
                        "b420": {
                            name: "Blood pressure functions",
                            desc: "Functions of maintaining the pressure of blood within the arteries.",
                            inclusions: "hypotension, hypertension and postural hypotension",
                            exclusions: "heart functions (b410); blood vessel functions (b415); exercise tolerance (b455)",
                            subs: {
                                "b4200": "Increased blood pressure (hypertension)",
                                "b4201": "Decreased blood pressure (hypotension)",
                                "b4202": "Maintenance of blood pressure (response to changes)",
                                "b4208": "Blood pressure functions, other specified",
                                "b4209": "Blood pressure functions, unspecified"
                            }
                        },
                        "b429": "Functions of the cardiovascular system, other specified and unspecified"
                    }
                },
                {
                    name: "Functions of the haematological and immunological systems (b430-b439)",
                    codes: {
                        "b430": {
                            name: "Haematological system functions",
                            desc: "Functions of blood production, oxygen and metabolite carriage, and clotting.",
                            inclusions: "blood and bone marrow production; oxygen-carrying capacity; clotting; anaemia, haemophilia",
                            exclusions: "cardiovascular system (b410-b429); immunological functions (b435); exercise tolerance (b455)",
                            subs: {
                                "b4300": "Production of blood",
                                "b4301": "Oxygen-carrying functions of the blood",
                                "b4302": "Metabolite-carrying functions of the blood",
                                "b4303": "Clotting functions (coagulation)",
                                "b4308": "Haematological system functions, other specified",
                                "b4309": "Haematological system functions, unspecified"
                            }
                        },
                        "b435": {
                            name: "Immunological system functions",
                            desc: "Protection against foreign substances, including infections, by immune responses.",
                            inclusions: "immune response (specific and non-specific); hypersensitivity reactions; lymphatic vessels and nodes; autoimmunity, allergies, lymphoedema",
                            exclusions: "haematological system functions (b430)",
                            subs: {
                                "b4350": {
                                    name: "Immune response",
                                    desc: "Response of sensitization to foreign substances, including infections.",
                                    subs: {
                                        "b43500": "Specific immune response",
                                        "b43501": "Non-specific immune response",
                                        "b43508": "Immune response, other specified",
                                        "b43509": "Immune response, unspecified"
                                    }
                                },
                                "b4351": "Hypersensitivity reactions (incl. allergies)",
                                "b4352": "Functions of lymphatic vessels (transport lymph)",
                                "b4353": "Functions of lymph nodes",
                                "b4358": "Immunological system functions, other specified",
                                "b4359": "Immunological system functions, unspecified"
                            }
                        },
                        "b439": "Functions of the haematological and immunological systems, other specified and unspecified"
                    }
                },
                {
                    name: "Functions of the respiratory system (b440-b449)",
                    codes: {
                        "b440": {
                            name: "Respiration functions",
                            desc: "Inhaling air, gas exchange between air and blood, and exhaling air.",
                            inclusions: "respiration rate, rhythm and depth; apnoea, hyperventilation, irregular respiration, pulmonary emphysema",
                            exclusions: "respiratory muscle functions (b445); additional respiratory functions (n450); exercise tolerance (b455)",
                            subs: {
                                "b4400": "Respiration rate (incl. tachypnoea, bradypnoea)",
                                "b4401": "Respiratory rhythm (periodicity and regularity)",
                                "b4402": "Depth of respiration (expansion of the lungs)",
                                "b4408": "Respiration functions, other specified",
                                "b4409": "Respiration functions, unspecified"
                            }
                        },
                        "b445": {
                            name: "Respiratory muscle functions",
                            desc: "Functions of the muscles involved in breathing.",
                            inclusions: "thoracic respiratory muscles; diaphragm; accessory respiratory muscles",
                            exclusions: "respiration functions (b440); additional respiratory functions (b450); exercise tolerance (b455)",
                            subs: {
                                "b4450": "Functions of the thoracic respiratory muscles",
                                "b4451": "Functions of the diaphragm",
                                "b4452": "Functions of accessory respiratory muscles",
                                "b4458": "Respiratory muscle functions, other specified",
                                "b4459": "Respiratory muscle functions, unspecified"
                            }
                        },
                        "b449": "Functions of the respiratory system, other specified and unspecified"
                    }
                },
                {
                    name: "Additional functions and sensations of the cardiovascular and respiratory systems (b450-b469)",
                    codes: {
                        "b450": {
                            name: "Additional respiratory functions",
                            desc: "Additional functions related to breathing, such as coughing, sneezing and yawning.",
                            inclusions: "functions of blowing, whistling and mouth breathing"
                        },
                        "b455": {
                            name: "Exercise tolerance functions",
                            desc: "Functions related to respiratory and cardiovascular capacity as required for enduring physical exertion.",
                            inclusions: "functions of physical endurance, aerobic capacity, stamina and fatiguability",
                            exclusions: "cardiovascular system (b410-b429); haematological (b430); respiration (b440); respiratory muscle (b445); additional respiratory (b450)",
                            subs: {
                                "b4550": "General physical endurance",
                                "b4551": "Aerobic capacity",
                                "b4552": "Fatiguability",
                                "b4558": "Exercise tolerance functions, other specified",
                                "b4559": "Exercise tolerance functions, unspecified"
                            }
                        },
                        "b460": {
                            name: "Sensations associated with cardiovascular and respiratory functions",
                            desc: "Sensations such as missing a heart beat, palpitation and shortness of breath.",
                            inclusions: "tightness of chest, feelings of irregular beat, dyspnoea, air hunger, choking, gagging and wheezing",
                            exclusions: "sensation of pain (b280)"
                        },
                        "b469": "Additional functions and sensations of the cardiovascular and respiratory systems, other specified and unspecified"
                    }
                },
                {
                    name: "Other cardiovascular and respiratory functions",
                    codes: {
                        "b498": "Functions of the cardiovascular, haematological, immunological and respiratory systems, other specified",
                        "b499": "Functions of the cardiovascular, haematological, immunological and respiratory systems, unspecified"
                    }
                }
            ]
        },
        ch5: {
            title: "Functions of the digestive, metabolic and endocrine systems",
            groups: [
                {
                    name: "Functions related to the digestive system (b510-b539)",
                    codes: {
                        "b510": {
                            name: "Ingestion functions",
                            desc: "Taking in and manipulating solids or liquids through the mouth into the body.",
                            inclusions: "sucking, chewing, biting, salivation, swallowing, vomiting; dysphagia, aspiration, drooling",
                            exclusions: "sensations associated with digestive system (b535)",
                            subs: {
                                "b5100": "Sucking",
                                "b5101": "Biting",
                                "b5102": "Chewing (crushing, grinding)",
                                "b5103": "Manipulation of food in the mouth (teeth and tongue)",
                                "b5104": "Salivation",
                                "b5105": {
                                    name: "Swallowing",
                                    desc: "Clearing food and drink through oral cavity, pharynx and oesophagus.",
                                    subs: {
                                        "b51050": "Oral swallowing",
                                        "b51051": "Pharyngeal swallowing",
                                        "b51052": "Oesophageal swallowing",
                                        "b51058": "Swallowing, other specified",
                                        "b51059": "Swallowing, unspecified"
                                    }
                                },
                                "b5106": "Regurgitation and vomiting",
                                "b5108": "Ingestion functions, other specified",
                                "b5109": "Ingestion functions, unspecified"
                            }
                        },
                        "b515": {
                            name: "Digestive functions",
                            desc: "Transporting food through GI tract, breakdown of food and absorption of nutrients.",
                            inclusions: "transport, peristalsis; breakdown, enzyme production; malabsorption, intestinal paralysis",
                            exclusions: "ingestion (b510); assimilation (b520); defecation (b525); sensations (b535)",
                            subs: {
                                "b5150": "Transport of food through stomach and intestines (peristalsis)",
                                "b5151": "Breakdown of food (mechanically reducing)",
                                "b5152": "Absorption of nutrients into blood stream",
                                "b5153": "Tolerance to food (incl. gluten intolerance)",
                                "b5158": "Digestive functions, other specified",
                                "b5159": "Digestive functions, unspecified"
                            }
                        },
                        "b520": "Assimilation functions (converting nutrients into body components)",
                        "b525": {
                            name: "Defecation functions",
                            desc: "Elimination of wastes and undigested food as faeces.",
                            inclusions: "faecal consistency, frequency; continece, flatulence; constipation, diarrhoea",
                            exclusions: "digestive functions (b515); assimilation (b520); sensations (b535)",
                            subs: {
                                "b5250": "Elimination of faeces (incl. abdominal muscle contraction)",
                                "b5251": "Faecal consistency (hard, soft, watery)",
                                "b5252": "Frequency of defecation",
                                "b5253": "Faecal continence",
                                "b5254": "Flatulence",
                                "b5258": "Defecation functions, other specified",
                                "b5259": "Defecation functions, unspecified"
                            }
                        },
                        "b530": {
                            name: "Weight maintenance functions",
                            desc: "Maintaining appropriate body weight and BMI.",
                            inclusions: "underweight, overweight, cachexia, obesity",
                            exclusions: "assimilation (b520); general metabolic (b540); endocrine (b555)"
                        },
                        "b535": {
                            name: "Sensations associated with the digestive system",
                            desc: "Nausea, feeling bloated, abdominal cramps.",
                            inclusions: "fullness, globus feeling, heartburn, gas",
                            exclusions: "sensation of pain (b280); ingestion (b510); digestion (b515); defecation (b525)",
                            subs: {
                                "b5350": "Sensation of nausea",
                                "b5351": "Feeling bloated",
                                "b5352": "Sensation of abdominal cramp",
                                "b5358": "Sensations, other specified",
                                "b5359": "Sensations, unspecified"
                            }
                        },
                        "b539": "Functions related to the digestive system, other specified and unspecified"
                    }
                },
                {
                    name: "Functions related to metabolism and the endocrine system (b540-b559)",
                    codes: {
                        "b540": {
                            name: "General metabolic functions",
                            desc: "Regulation of essential components such as carbohydrates, proteins and fats.",
                            inclusions: "basal metabolic rate, catabolism, anabolism, energy production; hyperthyroidism, hypothyroidism",
                            exclusions: "assimilation (b520); weight maintenance (b530); water/mineral balance (b545); thermoregulatory (b550); endocrine (b555)",
                            subs: {
                                "b5400": "Basal metabolic rate (incl. oxygen consumption)",
                                "b5401": "Carbohydrate metabolism (conversion to glucose)",
                                "b5402": "Protein metabolism",
                                "b5403": "Fat metabolism",
                                "b5408": "General metabolic functions, other specified",
                                "b5409": "General metabolic functions, unspecified"
                            }
                        },
                        "b545": {
                            name: "Water, mineral and electrolyte balance functions",
                            desc: "Regulation of water, minerals and electrolytes in the body.",
                            inclusions: "water balance, calcium, sodium, potassium; dehydration, hyponatraemia, hypokalaemia",
                            exclusions: "haematological (b430); metabolic (b540); endocrine (b555)",
                            subs: {
                                "b5450": {
                                    name: "Water balance",
                                    desc: "Maintaining the amount of water in the body.",
                                    subs: {
                                        "b54500": "Water retention",
                                        "b54501": "Maintenance of water balance",
                                        "b54508": "Water balance, other specified",
                                        "b54509": "Water balance, unspecified"
                                    }
                                },
                                "b5451": "Mineral balance (intake, storage, utilization)",
                                "b5452": "Electrolyte balance",
                                "b5458": "Water, mineral and electrolyte balance, other specified",
                                "b5459": "Water, mineral and electrolyte balance, unspecified"
                            }
                        },
                        "b550": {
                            name: "Thermoregulatory functions",
                            desc: "Regulation of body temperature.",
                            inclusions: "maintenance of temperature; hypothermia, hyperthermia",
                            exclusions: "metabolic (b540); endocrine (b555)",
                            subs: {
                                "b5500": "Body temperature regulation",
                                "b5501": "Maintenance of body temperature (incl. tolerance to heat/cold)",
                                "b5508": "Thermoregulatory functions, other specified",
                                "b5509": "Thermoregulatory functions, unspecified"
                            }
                        },
                        "b555": {
                            name: "Endocrine gland functions",
                            desc: "Production and regulation of hormonal levels in the body.",
                            inclusions: "hormonal balance; hyperpituitarism, hypothyroidism, hyperadrenalism, hypogonadism",
                            exclusions: "metabolic (b540); water balance (b545); thermoregulatory (b550); sexual (b640); menstruation (b650)"
                        },
                        "b559": "Functions related to metabolism and the endocrine system, other specified and unspecified"
                    }
                },
                {
                    name: "Other digestive, metabolic and endocrine functions",
                    codes: {
                        "b598": "Functions of these systems, other specified",
                        "b599": "Functions of these systems, unspecified"
                    }
                }
            ]
        },
        ch6: {
            title: "Genitourinary and reproductive functions",
            groups: [
                {
                    name: "Urinary functions (b610-b639)",
                    codes: {
                        "b610": {
                            name: "Urinary excretory functions",
                            desc: "Functions of filtration and collection of the urine.",
                            inclusions: "urinary filtration, collection; renal insufficiency, anuria, oliguria, hydronephrosis",
                            exclusions: "urination functions (b620)",
                            subs: {
                                "b6100": "Filtration of urine (by kidneys)",
                                "b6101": "Collection of urine (by ureters and bladder)",
                                "b6108": "Urinary excretory functions, other specified",
                                "b6109": "Urinary excretory functions, unspecified"
                            }
                        },
                        "b620": {
                            name: "Urination functions",
                            desc: "Functions of discharge of urine from the urinary bladder.",
                            inclusions: "frequency, continence; stress, urge, reflex, overflow incontinence, polyuria, retention",
                            exclusions: "excretory functions (b610); sensations (b630)",
                            subs: {
                                "b6200": "Urination (voiding the bladder; incl. retention)",
                                "b6201": "Frequency of urination",
                                "b6202": "Urinary continence (control over urination; incl. stress/urge incontinence)",
                                "b6208": "Urination functions, other specified",
                                "b6209": "Urination functions, unspecified"
                            }
                        },
                        "b630": {
                            name: "Sensations associated with urinary functions",
                            desc: "Sensations arising from voiding and related urinary functions.",
                            inclusions: "incomplete voiding, feeling of fullness of bladder",
                            exclusions: "sensation of pain (b280); urination functions (b620)"
                        },
                        "b639": "Urinary functions, other specified and unspecified"
                    }
                },
                {
                    name: "Genital and reproductive functions (b640-b679)",
                    codes: {
                        "b640": {
                            name: "Sexual functions",
                            desc: "Mental and physical functions related to the sexual act.",
                            inclusions: "arousal, preparatory, orgasmic and resolution stages; performance, erection, ejaculation; impotence, frigidity, vaginismus",
                            exclusions: "procreation (b660); sensations (b670)",
                            subs: {
                                "b6400": "Functions of sexual arousal phase",
                                "b6401": "Functions of sexual preparatory phase",
                                "b6402": "Functions of orgasmic phase",
                                "b6403": "Functions of sexual resolution phase (incl. dissatisfaction)",
                                "b6408": "Sexual functions, other specified",
                                "b6409": "Sexual functions, unspecified"
                            }
                        },
                        "b650": {
                            name: "Menstruation functions",
                            desc: "Functions associated with the menstrual cycle.",
                            inclusions: "regularity, interval, extent of bleeding, menarche, menopause; amenorrhoea, menorrhagia, polymenorrhoea",
                            exclusions: "sexual functions (b640); procreation (b660); sensations (b670); pain (b280)",
                            subs: {
                                "b6500": "Regularity of menstrual cycle",
                                "b6501": "Interval between menstruation",
                                "b6502": "Extent of menstrual bleeding (incl. hypomenorrhoea, menorrhagia)",
                                "b6508": "Menstruation functions, other specified",
                                "b6509": "Menstruation functions, unspecified"
                            }
                        },
                        "b660": {
                            name: "Procreation functions",
                            desc: "Functions associated with fertility, pregnancy, childbirth and lactation.",
                            inclusions: "male/female fertility, childbirth, lactation; subfertility, sterility, miscarriage, premature childbirth",
                            exclusions: "sexual (b640); menstruation (b650)",
                            subs: {
                                "b6600": "Functions related to fertility (incl. sterility)",
                                "b6601": "Functions related to pregnancy",
                                "b6602": "Functions related to childbirth",
                                "b6603": "Lactation (producing milk)",
                                "b6608": "Procreation functions, other specified",
                                "b6609": "Procreation functions, unspecified"
                            }
                        },
                        "b670": {
                            name: "Sensations associated with genital and reproductive functions",
                            desc: "Sensations from sexual arousal, intercourse, menstruation, and menopause.",
                            inclusions: "dyspareunia, dysmenorrhoea, hot flushes and night sweats",
                            exclusions: "pain (b280); urinary sensations (b630); sexual (b640); menstruation (b650); procreation (b660)",
                            subs: {
                                "b6700": "Discomfort associated with sexual intercourse",
                                "b6701": "Discomfort associated with the menstrual cycle",
                                "b6702": "Discomfort associated with menopause (incl. hot flushes)",
                                "b6708": "Sensations, other specified",
                                "b6709": "Sensations, unspecified"
                            }
                        },
                        "b679": "Genital and reproductive functions, other specified and unspecified"
                    }
                },
                {
                    name: "Other genitourinary and reproductive functions",
                    codes: {
                        "b698": "Genitourinary and reproductive functions, other specified",
                        "b699": "Genitourinary and reproductive functions, unspecified"
                    }
                }
            ]
        },
        ch7: {
            title: "Neuromusculoskeletal and movement-related functions",
            groups: [
                {
                    name: "Functions of the joints and bones (b710-b729)",
                    codes: {
                        "b710": {
                            name: "Mobility of joint functions",
                            desc: "Functions of the range and ease of movement of a joint.",
                            inclusions: "single or several joints, vertebral, shoulder, wrist, hip, knee, ankle; frozen joints, frozen shoulder, arthritis",
                            exclusions: "stability of joint functions (b715); control of voluntary movement (b760)",
                            subs: {
                                "b7100": "Mobility of a single joint",
                                "b7101": "Mobility of several joints",
                                "b7102": "Mobility of joints generalized",
                                "b7108": "Mobility of joint functions, other specified",
                                "b7109": "Mobility of joint functions, unspecified"
                            }
                        },
                        "b715": {
                            name: "Stability of joint functions",
                            desc: "Functions of the maintenance of structural integrity of the joints.",
                            inclusions: "stability of single/several joints; unstable shoulder, dislocation of hip/shoulder",
                            exclusions: "mobility of joint functions (b710)",
                            subs: {
                                "b7150": "Stability of a single joint",
                                "b7151": "Stability of several joints",
                                "b7152": "Stability of joints generalized",
                                "b7158": "Stability of joint functions, other specified",
                                "b7159": "Stability of joint functions, unspecified"
                            }
                        },
                        "b720": {
                            name: "Mobility of bone functions",
                            desc: "Functions of the range and ease of movement of the scapula, pelvis, carpal and tarsal bones.",
                            inclusions: "frozen scapula, frozen pelvis",
                            exclusions: "mobility of joints functions (b710)",
                            subs: {
                                "b7200": "Mobility of scapula (incl. protraction, retraction, laterorotation)",
                                "b7201": "Mobility of pelvis (incl. rotation)",
                                "b7202": "Mobility of carpal bones",
                                "b7203": "Mobility of tarsal bones",
                                "b7208": "Mobility of bone functions, other specified",
                                "b7209": "Mobility of bone functions, unspecified"
                            }
                        },
                        "b729": "Functions of the joints and bones, other specified and unspecified"
                    }
                },
                {
                    name: "Muscle functions (b730-b749)",
                    codes: {
                        "b730": {
                            name: "Muscle power functions",
                            desc: "Force generated by the contraction of a muscle or muscle groups.",
                            inclusions: "isolated muscles, limb muscles, side of body, trunk; monoplegia, hemiplegia, paraparesis, quadriplegia",
                            exclusions: "eye structures (b215); muscle tone (b735); muscle endurance (b740)",
                            subs: {
                                "b7300": "Power of isolated muscles and muscle groups",
                                "b7301": "Power of muscles of one limb (incl. monoparesis/monoplegia)",
                                "b7302": "Power of muscles of one side of the body (incl. hemiparesis/hemiplegia)",
                                "b7303": "Power of muscles in lower half of the body (incl. paraparesis/paraplegia)",
                                "b7304": "Power of muscles of all limbs (incl. tetraparesis/tetraplegia)",
                                "b7305": "Power of muscles of the trunk",
                                "b7306": "Power of all muscles of the body (incl. akinetic mutism)",
                                "b7308": "Muscle power functions, other specified",
                                "b7309": "Muscle power functions, unspecified"
                            }
                        },
                        "b735": {
                            name: "Muscle tone functions",
                            desc: "Tension in resting muscles and resistance to passive movement.",
                            inclusions: "hypotonia, hypertonia, spasticity; torticollis, focal dystonias, Parkinson's disease",
                            exclusions: "muscle power (b730); muscle endurance (b740)",
                            subs: {
                                "b7350": "Tone of isolated muscles and muscle groups",
                                "b7351": "Tone of muscles of one limb",
                                "b7352": "Tone of muscles of one side of body",
                                "b7353": "Tone of muscles of lower half of body",
                                "b7354": "Tone of muscles of all limbs",
                                "b7355": "Tone of muscles of trunk",
                                "b7356": "Tone of all muscles of the body (incl. Parkinson's disease)",
                                "b7358": "Muscle tone functions, other specified",
                                "b7359": "Muscle tone functions, unspecified"
                            }
                        },
                        "b740": {
                            name: "Muscle endurance functions",
                            desc: "Sustaining muscle contraction for the required period of time.",
                            inclusions: "sustaining isolated/group contraction; myasthenia gravis",
                            exclusions: "exercise tolerance (b455); muscle power (b730); muscle tone (b735)",
                            subs: {
                                "b7400": "Endurance of isolated muscles",
                                "b7401": "Endurance of muscle groups",
                                "b7402": "Endurance of all muscles of the body",
                                "b7408": "Muscle endurance functions, other specified",
                                "b7409": "Muscle endurance functions, unspecified"
                            }
                        },
                        "b749": "Muscle functions, other specified and unspecified"
                    }
                },
                {
                    name: "Movement functions (b750-b789)",
                    codes: {
                        "b750": {
                            name: "Motor reflex functions",
                            desc: "Involuntary contraction of muscles automatically induced by specific stimuli.",
                            inclusions: "stretch motor reflex, biceps reflex, radius reflex, quadriceps reflex, patellar reflex, ankle reflex",
                            subs: {
                                "b7500": "Stretch motor reflex",
                                "b7501": "Reflexes generated by noxious stimuli (withdrawal reflex)",
                                "b7502": "Reflexes generated by other exteroceptive stimuli",
                                "b7508": "Motor reflex functions, other specified",
                                "b7509": "Motor reflex functions, unspecified"
                            }
                        },
                        "b755": {
                            name: "Involuntary movement reaction functions",
                            desc: "Involuntary contractions of large muscles induced by body position, balance and threatening stimuli.",
                            inclusions: "postural reactions, righting reactions, adjustment reactions, balance reactions, supporting reactions",
                            exclusions: "motor reflex functions (b750)"
                        },
                        "b760": {
                            name: "Control of voluntary movement functions",
                            desc: "Control over and coordination of voluntary movements.",
                            inclusions: "simple/complex movements, coordination, supportive functions of arm/leg, eye-hand, eye-foot; dysdiadochokinesia",
                            exclusions: "muscle power (b730); involuntary movement (b765); gait (b770)",
                            subs: {
                                "b7600": "Control of simple voluntary movements",
                                "b7601": "Control of complex voluntary movements",
                                "b7602": "Coordination of voluntary movements (incl. visually directed; dysdiadochokinesia)",
                                "b7603": "Supportive functions of arm or leg (placing weight on elbows/hands or knees/feet)",
                                "b7608": "Control of voluntary movement, other specified",
                                "b7609": "Control of voluntary movement, unspecified"
                            }
                        },
                        "b765": {
                            name: "Involuntary movement functions",
                            desc: "Unintentional, non- or semi-purposive involuntary contractions of a muscle or group of muscles.",
                            inclusions: "tremors, tics, chorea, athetosis, dystonic movements, dyskinesia",
                            exclusions: "control of voluntary movement (b760); gait (b770)",
                            subs: {
                                "b7650": "Involuntary contractions of muscles (incl. choreatic/athetotic; sleep disorders)",
                                "b7651": "Tremor",
                                "b7652": "Tics and mannerisms (incl. vocal tics, coprolalia, bruxism)",
                                "b7653": "Stereotypies and motor perseveration (rocking, nodding)",
                                "b7658": "Involuntary movement functions, other specified",
                                "b7659": "Involuntary movement functions, unspecified"
                            }
                        },
                        "b770": {
                            name: "Gait pattern functions",
                            desc: "Movement patterns associated with walking, running or other whole body movements.",
                            inclusions: "spastic gait, hemiplegic gait, paraplegic gait, asymmetric gait, limping, stiff gait",
                            exclusions: "muscle power (b730); muscle tone (b735); control of voluntary movement (b760); involuntary movement (b765)"
                        },
                        "b780": {
                            name: "Sensations related to muscles and movement functions",
                            desc: "Sensations associated with the muscles and their movement.",
                            inclusions: "muscle stiffness, tightness, spasm, heaviness",
                            exclusions: "sensation of pain (b280)",
                            subs: {
                                "b7800": "Sensation of muscle stiffness",
                                "b7801": "Sensation of muscle spasm (incl. involuntary contraction)",
                                "b7808": "Sensations, other specified",
                                "b7809": "Sensations, unspecified"
                            }
                        },
                        "b789": "Movement functions, other specified and unspecified"
                    }
                },
                {
                    name: "Other neuromusculoskeletal and movement-related functions",
                    codes: {
                        "b798": "Neuromusculoskeletal functions, other specified",
                        "b799": "Neuromusculoskeletal functions, unspecified"
                    }
                }
            ]
        },
        ch8: {
            title: "Functions of the skin and related structures",
            groups: [
                {
                    name: "Functions of the skin (b810-b849)",
                    codes: {
                        "b810": {
                            name: "Protective functions of the skin",
                            desc: "Protecting the body from physical, chemical and biological threats.",
                            inclusions: "sun protection, pigmentation, insulation; broken skin, ulcers, bedsores",
                            exclusions: "repair (b820); other skin functions (b830)"
                        },
                        "b820": {
                            name: "Repair functions of the skin",
                            desc: "Repairing breaks and other damage to the skin.",
                            inclusions: "scab formation, healing, scarring; keloid formation",
                            exclusions: "protective (b810); other functions (b830)"
                        },
                        "b830": {
                            name: "Other functions of the skin",
                            desc: "Cooling and sweat secretion.",
                            inclusions: "sweating, glandular functions, body odour",
                            exclusions: "protective (b810); repair (b820)"
                        },
                        "b840": {
                            name: "Sensation related to the skin",
                            desc: "Sensations such as itching, burning and tingling.",
                            inclusions: "pins and needles, crawling sensation",
                            exclusions: "sensation of pain (b280)"
                        },
                        "b849": "Functions of the skin, other specified and unspecified"
                    }
                },
                {
                    name: "Functions of the hair and nails (b850-b869)",
                    codes: {
                        "b850": {
                            name: "Functions of hair",
                            desc: "Protection, coloration and appearance of hair.",
                            inclusions: "growth, location; alopecia (hair loss)"
                        },
                        "b860": {
                            name: "Functions of nails",
                            desc: "Protection, scratching and appearance of nails.",
                            inclusions: "growth, pigmentation, quality"
                        },
                        "b869": "Functions of the hair and nails, other specified and unspecified"
                    }
                },
                {
                    name: "Other skin and related functions",
                    codes: {
                        "b898": "Skin functions, other specified",
                        "b899": "Skin functions, unspecified"
                    }
                }
            ]
        }
    },
    // --- 2. BODY STRUCTURES (s) ---
    s: {
        ch1: {
            title: "Structures of the nervous system",
            groups: [
                {
                    name: "Structures of the nervous system (s110-s199)",
                    codes: {
                        "s110": {
                            name: "Structure of brain",
                            subs: {
                                "s1100": {
                                    name: "Structure of cortical lobes",
                                    subs: {
                                        "s11000": "Frontal lobe",
                                        "s11001": "Temporal lobe",
                                        "s11002": "Parietal lobe",
                                        "s11003": "Occipital lobe",
                                        "s11008": "Structure of cortical lobes, other specified",
                                        "s11009": "Structure of cortical lobes, unspecified"
                                    }
                                },
                                "s1101": "Structure of midbrain",
                                "s1102": "Structure of diencephalon",
                                "s1103": "Basal ganglia and related structures",
                                "s1104": "Structure of cerebellum",
                                "s1105": {
                                    name: "Structure of brain stem",
                                    subs: {
                                        "s11050": "Medulla oblongata",
                                        "s11051": "Pons",
                                        "s11058": "Structure of brain stem, other specified",
                                        "s11059": "Structure of brain stem, unspecified"
                                    }
                                },
                                "s1106": "Structure of cranial nerves",
                                "s1108": "Structure of brain, other specified",
                                "s1109": "Structure of brain, unspecified"
                            }
                        },
                        "s120": {
                            name: "Spinal cord and related structures",
                            subs: {
                                "s1200": {
                                    name: "Structure of spinal cord",
                                    subs: {
                                        "s12000": "Cervical spinal cord",
                                        "s12001": "Thoracic spinal cord",
                                        "s12002": "Lumbosacral spinal cord",
                                        "s12003": "Cauda equina",
                                        "s12008": "Structure of spinal cord, other specified",
                                        "s12009": "Structure of spinal cord, unspecified"
                                    }
                                },
                                "s1201": "Spinal nerves",
                                "s1208": "Spinal cord and related structures, other specified",
                                "s1209": "Spinal cord and related structures, unspecified"
                            }
                        },
                        "s130": "Structure of meninges",
                        "s140": "Structure of sympathetic nervous system",
                        "s150": "Structure of parasympathetic nervous system",
                        "s198": "Structure of the nervous system, other specified",
                        "s199": "Structure of the nervous system, unspecified"
                    }
                }
            ]
        },
        ch2: {
            title: "The eye, ear and related structures",
            groups: [
                {
                    name: "The eye, ear and related structures (s210-s299)",
                    codes: {
                        "s210": "Structure of eye socket",
                        "s220": {
                            name: "Structure of eyeball",
                            subs: {
                                "s2200": "Conjunctiva, sclera, choroid",
                                "s2201": "Cornea",
                                "s2202": "Iris",
                                "s2203": "Retina",
                                "s2204": "Lens of eyeball",
                                "s2205": "Vitreous body",
                                "s2208": "Structure of eyeball, other specified",
                                "s2209": "Structure of eyeball, unspecified"
                            }
                        },
                        "s230": {
                            name: "Structures around eye",
                            subs: {
                                "s2300": "Lachrymal gland and related structures",
                                "s2301": "Eyelid",
                                "s2302": "Eyebrow",
                                "s2303": "External ocular muscles",
                                "s2308": "Structures around eye, other specified",
                                "s2309": "Structures around eye, unspecified"
                            }
                        },
                        "s240": "Structure of external ear",
                        "s250": {
                            name: "Structure of middle ear",
                            subs: {
                                "s2500": "Tympanic membrane",
                                "s2501": "Eustachian canal",
                                "s2502": "Ossicles",
                                "s2508": "Structure of middle ear, other specified",
                                "s2509": "Structure of middle ear, unspecified"
                            }
                        },
                        "s260": {
                            name: "Structure of inner ear",
                            subs: {
                                "s2600": "Cochlea",
                                "s2601": "Vestibular labyrinth",
                                "s2602": "Semicircular canals",
                                "s2603": "Internal auditory meatus",
                                "s2608": "Structure of inner ear, other specified",
                                "s2609": "Structure of inner ear, unspecified"
                            }
                        },
                        "s298": "Eye, ear and related structures, other specified",
                        "s299": "Eye, ear and related structures, unspecified"
                    }
                }
            ]
        },
        ch3: {
            title: "Structures involved in voice and speech",
            groups: [
                {
                    name: "Structures involved in voice and speech (s310-s399)",
                    codes: {
                        "s310": {
                            name: "Structure of nose",
                            subs: {
                                "s3100": "External nose",
                                "s3101": "Nasal septum",
                                "s3102": "Nasal fossae",
                                "s3108": "Structure of nose, other specified",
                                "s3109": "Structure of nose, unspecified"
                            }
                        },
                        "s320": {
                            name: "Structure of mouth",
                            subs: {
                                "s3200": "Teeth",
                                "s3201": "Gums",
                                "s3202": {
                                    name: "Structure of palate",
                                    subs: {
                                        "s32020": "Hard palate",
                                        "s32021": "Soft palate"
                                    }
                                },
                                "s3203": "Tongue",
                                "s3204": {
                                    name: "Structure of lips",
                                    subs: {
                                        "s32040": "Upper lip",
                                        "s32041": "Lower lip"
                                    }
                                },
                                "s3208": "Structure of mouth, other specified",
                                "s3209": "Structure of mouth, unspecified"
                            }
                        },
                        "s330": {
                            name: "Structure of pharynx",
                            subs: {
                                "s3300": "Nasal pharynx",
                                "s3301": "Oral pharynx",
                                "s3308": "Structure of pharynx, other specified",
                                "s3309": "Structure of pharynx, unspecified"
                            }
                        },
                        "s340": {
                            name: "Structure of larynx",
                            subs: {
                                "s3400": "Vocal folds",
                                "s3408": "Structure of larynx, other specified",
                                "s3409": "Structure of larynx, unspecified"
                            }
                        },
                        "s398": "Structures involved in voice and speech, other specified",
                        "s399": "Structures involved in voice and speech, unspecified"
                    }
                }
            ]
        },
        ch4: {
            title: "Structures of the cardiovascular, immunological and respiratory systems",
            groups: [
                {
                    name: "Structures of the cardiovascular, immunological and respiratory systems (s410-s499)",
                    codes: {
                        "s410": {
                            name: "Structure of cardiovascular system",
                            subs: {
                                "s4100": {
                                    name: "Heart",
                                    subs: {
                                        "s41000": "Atria",
                                        "s41001": "Ventricles",
                                        "s41008": "Structure of heart, other specified",
                                        "s41009": "Structure of heart, unspecified"
                                    }
                                },
                                "s4101": "Arteries",
                                "s4102": "Veins",
                                "s4103": "Capillaries",
                                "s4108": "Structure of cardiovascular system, other specified",
                                "s4109": "Structure of cardiovascular system, unspecified"
                            }
                        },
                        "s420": {
                            name: "Structure of immune system",
                            subs: {
                                "s4200": "Lymphatic vessels",
                                "s4201": "Lymphatic nodes",
                                "s4202": "Thymus",
                                "s4203": "Spleen",
                                "s4204": "Bone marrow",
                                "s4208": "Structure of immune system, other specified",
                                "s4209": "Structure of immune system, unspecified"
                            }
                        },
                        "s430": {
                            name: "Structure of respiratory system",
                            subs: {
                                "s4300": "Trachea",
                                "s4301": {
                                    name: "Lungs",
                                    subs: {
                                        "s43010": "Bronchial tree",
                                        "s43011": "Alveoli",
                                        "s43018": "Structure of lungs, other specified",
                                        "s43019": "Structure of lungs, unspecified"
                                    }
                                },
                                "s4302": "Thoracic cage",
                                "s4303": {
                                    name: "Muscles of respiration",
                                    subs: {
                                        "s43030": "Intercostal muscles",
                                        "s43031": "Diaphragm",
                                        "s43038": "Muscles of respiration, other specified",
                                        "s43039": "Muscles of respiration, unspecified"
                                    }
                                },
                                "s4308": "Structure of respiratory system, other specified",
                                "s4309": "Structure of respiratory system, unspecified"
                            }
                        },
                        "s498": "Structures of the cardiovascular, immunological and respiratory systems, other specified",
                        "s499": "Structures of the cardiovascular, immunological and respiratory systems, unspecified"
                    }
                }
            ]
        },
        ch5: {
            title: "Structures related to the digestive, metabolic and endocrine systems",
            groups: [
                {
                    name: "Structures related to the digestive, metabolic and endocrine systems (s510-s599)",
                    codes: {
                        "s510": "Structure of salivary glands",
                        "s520": "Structure of oesophagus",
                        "s530": "Structure of stomach",
                        "s540": {
                            name: "Structure of intestine",
                            subs: {
                                "s5400": "Small intestine",
                                "s5401": "Large intestine",
                                "s5408": "Structure of intestine, other specified",
                                "s5409": "Structure of intestine, unspecified"
                            }
                        },
                        "s550": "Structure of pancreas",
                        "s560": "Structure of liver",
                        "s570": "Structure of gall bladder and ducts",
                        "s580": {
                            name: "Structure of endocrine glands",
                            subs: {
                                "s5800": "Pituitary gland",
                                "s5801": "Thyroid gland",
                                "s5802": "Parathyroid gland",
                                "s5803": "Adrenal gland",
                                "s5808": "Structure of endocrine glands, other specified",
                                "s5809": "Structure of endocrine glands, unspecified"
                            }
                        },
                        "s598": "Structures related to the digestive, metabolic and endocrine systems, other specified",
                        "s599": "Structures related to the digestive, metabolic and endocrine systems, unspecified"
                    }
                }
            ]
        },
        ch6: {
            title: "Structures related to the genitourinary and reproductive systems",
            groups: [
                {
                    name: "Structures related to the genitourinary and reproductive systems (s610-s699)",
                    codes: {
                        "s610": {
                            name: "Structure of urinary system",
                            subs: {
                                "s6100": "Kidneys",
                                "s6101": "Ureters",
                                "s6102": "Urinary bladder",
                                "s6103": "Urethra",
                                "s6108": "Structure of urinary system, other specified",
                                "s6109": "Structure of urinary system, unspecified"
                            }
                        },
                        "s620": "Structure of pelvic floor",
                        "s630": {
                            name: "Structure of reproductive system",
                            subs: {
                                "s6300": "Ovaries",
                                "s6301": {
                                    name: "Structure of uterus",
                                    subs: {
                                        "s63010": "Body of uterus",
                                        "s63011": "Cervix",
                                        "s63012": "Fallopian tubes",
                                        "s63018": "Structure of uterus, other specified",
                                        "s63019": "Structure of uterus, unspecified"
                                    }
                                },
                                "s6302": "Breast and nipple",
                                "s6303": {
                                    name: "Structure of vagina and external genitalia",
                                    subs: {
                                        "s63030": "Clitoris",
                                        "s63031": "Labia majora",
                                        "s63032": "Labia minora",
                                        "s63033": "Vaginal canal"
                                    }
                                },
                                "s6304": "Testes",
                                "s6305": {
                                    name: "Structure of the penis",
                                    subs: {
                                        "s63050": "Glans penis",
                                        "s63051": "Shaft of penis",
                                        "s63058": "Structure of penis, other specified",
                                        "s63059": "Structure of penis, unspecified"
                                    }
                                },
                                "s6306": "Prostate",
                                "s6308": "Structures of reproductive system, other specified",
                                "s6309": "Structures of reproductive system, unspecified"
                            }
                        },
                        "s698": "Structures related to the genitourinary and reproductive systems, other specified",
                        "s699": "Structures related to the genitourinary and reproductive systems, unspecified"
                    }
                }
            ]
        },
        ch7: {
            title: "Structures related to movement",
            groups: [
                {
                    name: "Structures related to movement (s710-s799)",
                    codes: {
                        "s710": {
                            name: "Structure of head and neck region",
                            subs: {
                                "s7100": "Bones of cranium",
                                "s7101": "Bones of face",
                                "s7102": "Bones of neck region",
                                "s7103": "Joints of head and neck region",
                                "s7104": "Muscles of head and neck region",
                                "s7105": "Ligaments and fasciae of head and neck region",
                                "s7108": "Structure of head and neck region, other specified",
                                "s7109": "Structure of head and neck region, unspecified"
                            }
                        },
                        "s720": {
                            name: "Structure of shoulder region",
                            subs: {
                                "s7200": "Bones of shoulder region",
                                "s7201": "Joints of shoulder region",
                                "s7202": "Muscles of shoulder region",
                                "s7203": "Ligaments and fasciae of shoulder region",
                                "s7208": "Structure of shoulder region, other specified",
                                "s7209": "Structure of shoulder region, unspecified"
                            }
                        },
                        "s730": {
                            name: "Structure of upper extremity",
                            subs: {
                                "s7300": {
                                    name: "Structure of upper arm",
                                    subs: {
                                        "s73000": "Bones of upper arm",
                                        "s73001": "Elbow joint",
                                        "s73002": "Muscles of upper arm",
                                        "s73003": "Ligaments and fasciae of upper arm",
                                        "s73008": "Structure of upper arm, other specified",
                                        "s73009": "Structure of upper arm, unspecified"
                                    }
                                },
                                "s7301": {
                                    name: "Structure of forearm",
                                    subs: {
                                        "s73010": "Bones of forearm",
                                        "s73011": "Wrist joint",
                                        "s73012": "Muscles of forearm",
                                        "s73013": "Ligaments and fasciae of forearm",
                                        "s73018": "Structure of forearm, other specified",
                                        "s73019": "Structure of forearm, unspecified"
                                    }
                                },
                                "s7302": {
                                    name: "Structure of hand",
                                    subs: {
                                        "s73020": "Bones of hand",
                                        "s73021": "Joints of hand and fingers",
                                        "s73022": "Muscles of hand",
                                        "s73023": "Ligaments and fasciae of hand",
                                        "s73028": "Structure of hand, other specified",
                                        "s73029": "Structure of hand, unspecified"
                                    }
                                },
                                "s7308": "Structure of upper extremity, other specified",
                                "s7309": "Structure of upper extremity, unspecified"
                            }
                        },
                        "s740": {
                            name: "Structure of pelvic region",
                            subs: {
                                "s7400": "Bones of pelvic region",
                                "s7401": "Joints of pelvic region",
                                "s7402": "Muscles of pelvic region",
                                "s7403": "Ligaments and fasciae of pelvic region",
                                "s7408": "Structure of pelvic region, other specified",
                                "s7409": "Structure of pelvic region, unspecified"
                            }
                        },
                        "s750": {
                            name: "Structure of lower extremity",
                            subs: {
                                "s7500": {
                                    name: "Structure of thigh",
                                    subs: {
                                        "s75000": "Bones of thigh",
                                        "s75001": "Hip joint",
                                        "s75002": "Muscles of thigh",
                                        "s75003": "Ligaments and fasciae of thigh",
                                        "s75008": "Structure of thigh, other specified",
                                        "s75009": "Structure of thigh, unspecified"
                                    }
                                },
                                "s7501": {
                                    name: "Structure of lower leg",
                                    subs: {
                                        "s75010": "Bones of lower leg",
                                        "s75011": "Knee joint",
                                        "s75012": "Muscles of lower leg",
                                        "s75013": "Ligaments and fasciae of lower leg",
                                        "s75018": "Structure of lower leg, other specified",
                                        "s75019": "Structure of lower leg, unspecified"
                                    }
                                },
                                "s7502": {
                                    name: "Structure of ankle and foot",
                                    subs: {
                                        "s75020": "Bones of ankle and foot",
                                        "s75021": "Ankle joint and joints of foot and toes",
                                        "s75022": "Muscles of ankle and foot",
                                        "s75023": "Ligaments and fasciae of ankle and foot",
                                        "s75028": "Structure of ankle and foot, other specified",
                                        "s75029": "Structure of ankle and foot, unspecified"
                                    }
                                },
                                "s7508": "Structure of lower extremity, other specified",
                                "s7509": "Structure of lower extremity, unspecified"
                            }
                        },
                        "s760": {
                            name: "Structure of trunk",
                            subs: {
                                "s7600": {
                                    name: "Structure of vertebral column",
                                    subs: {
                                        "s76000": "Cervical vertebral column",
                                        "s76001": "Thoracic vertebral column",
                                        "s76002": "Lumbar vertebral column",
                                        "s76003": "Sacral vertebral column",
                                        "s76004": "Coccyx",
                                        "s76008": "Structure of vertebral column, other specified",
                                        "s76009": "Structure of vertebral column, specified"
                                    }
                                },
                                "s7601": "Muscles of trunk",
                                "s7602": "Ligaments and fasciae of trunk",
                                "s7608": "Structure of trunk, other specified",
                                "s7609": "Structure of trunk, unspecified"
                            }
                        },
                        "s770": {
                            name: "Additional musculoskeletal structures related to movement",
                            subs: {
                                "s7700": "Bones",
                                "s7701": "Joints",
                                "s7702": "Muscles",
                                "s7703": "Extra-articular ligaments, fasciae, bursae, unspecified",
                                "s7708": "Additional musculoskeletal structures, other specified",
                                "s7709": "Additional musculoskeletal structures, unspecified"
                            }
                        },
                        "s798": "Structures related to movement, other specified",
                        "s799": "Structures related to movement, unspecified"
                    }
                }
            ]
        },
        ch8: {
            title: "Skin and related structures",
            groups: [
                {
                    name: "Skin and related structures (s810-s899)",
                    codes: {
                        "s810": {
                            name: "Structure of areas of skin",
                            subs: {
                                "s8100": "Skin of head and neck region",
                                "s8101": "Skin of the shoulder region",
                                "s8102": "Skin of upper extremity",
                                "s8103": "Skin of pelvic region",
                                "s8104": "Skin of lower extremity",
                                "s8105": "Skin of trunk and back",
                                "s8108": "Structure of areas of skin, other specified",
                                "s8109": "Structure of areas of skin, unspecified"
                            }
                        },
                        "s820": {
                            name: "Structure of skin glands",
                            subs: {
                                "s8200": "Sweat glands",
                                "s8201": "Sebaceous glands",
                                "s8208": "Structure of skin glands, other specified",
                                "s8209": "Structure of skin glands, unspecified"
                            }
                        },
                        "s830": {
                            name: "Structure of nails",
                            subs: {
                                "s8300": "Finger nails",
                                "s8301": "Toe nails",
                                "s8308": "Structure of nails, other specified",
                                "s8309": "Structure of nails, unspecified"
                            }
                        },
                        "s840": "Structure of hair",
                        "s898": "Skin and related structures, other specified",
                        "s899": "Skin and related structures, unspecifed"
                    }
                }
            ]
        }
    },
    // --- 3. ACTIVITIES AND PARTICIPATION (d) ---
    d: {
        ch1: {
            title: "Learning and applying knowledge",
            groups: [
                {
                    name: "Purposeful sensory experiences (d110-d129)",
                    codes: {
                        "d110": {
                            name: "Watching",
                            desc: "Using the sense of seeing intentionally to experience visual stimuli."
                        },
                        "d115": {
                            name: "Listening",
                            desc: "Using the sense of hearing intentionally to experience auditory stimuli."
                        },
                        "d120": {
                            name: "Other purposeful sensing",
                            desc: "Using other basic senses (touch, taste, smell) intentionally."
                        },
                        "d129": "Purposeful sensory experiences, other specified and unspecified"
                    }
                },
                {
                    name: "Basic learning (d130-d159)",
                    codes: {
                        "d130": "Copying (imitating gestures, sounds, letters)",
                        "d135": "Rehearsing (repeating sequences of events or symbols)",
                        "d140": "Learning to read",
                        "d145": "Learning to write",
                        "d150": "Learning to calculate",
                        "d155": {
                            name: "Acquiring skills",
                            desc: "Developing competencies in integrated sets of actions or tasks.",
                            subs: {
                                "d1550": "Acquiring basic skills (manipulating eating utensils, pencils)",
                                "d1551": "Acquiring complex skills (sequence and coordinate movements)",
                                "d1558": "Acquiring skills, other specified",
                                "d1559": "Acquiring skills, unspecified"
                            }
                        },
                        "d159": "Basic learning, other specified and unspecified"
                    }
                },
                {
                    name: "Applying knowledge (d160-d179)",
                    codes: {
                        "d160": "Focusing attention",
                        "d163": {
                            name: "Thinking",
                            desc: "Formulating and manipulating ideas, concepts, and images.",
                            exclusions: "solving problems (d175); making decisions (d177)"
                        },
                        "d166": "Reading (comprehension and interpretation)",
                        "d170": "Writing (using symbols to convey information)",
                        "d172": "Calculating (performing computations)",
                        "d175": {
                            name: "Solving problems",
                            desc: "Finding solutions to questions or situations.",
                            subs: {
                                "d1750": "Solving simple problems (single issue)",
                                "d1751": "Solving complex problems (multiple interrelated issues)",
                                "d1758": "Solving problems, other specified",
                                "d1759": "Solving problems, unspecified"
                            }
                        },
                        "d177": "Making decisions",
                        "d179": "Applying knowledge, other specified and unspecified"
                    }
                },
                {
                    name: "Other learning and applying knowledge",
                    codes: {
                        "d198": "Learning and applying knowledge, other specified",
                        "d199": "Learning and applying knowledge, unspecified"
                    }
                }
            ]
        },
        ch2: {
            title: "General tasks and demands",
            groups: [
                {
                    name: "General tasks and demands (d210-d299)",
                    codes: {
                        "d210": {
                            name: "Undertaking a single task",
                            desc: "Carrying out simple or complex actions related to a single task.",
                            inclusions: "initiating, organizing, completing; independently or in a group",
                            exclusions: "acquiring skills (d155); solving problems (d175); making decisions (d177); multiple tasks (d220)",
                            subs: {
                                "d2100": "Undertaking a simple task",
                                "d2101": "Undertaking a complex task",
                                "d2102": "Undertaking a single task independently",
                                "d2103": "Undertaking a single task in a group",
                                "d2108": "Undertaking single tasks, other specified",
                                "d2109": "Undertaking single tasks, unspecified"
                            }
                        },
                        "d220": {
                            name: "Undertaking multiple tasks",
                            desc: "Carrying out integrated and complex tasks in sequence or simultaneously.",
                            inclusions: "completing multiple tasks; independently or in a group",
                            exclusions: "acquiring skills (d155); solving problems (d175); making decisions (d177); single task (d210)",
                            subs: {
                                "d2200": "Carrying out multiple tasks",
                                "d2201": "Completing multiple tasks",
                                "d2202": "Undertaking multiple tasks independently",
                                "d2203": "Undertaking multiple tasks in a group",
                                "d2208": "Undertaking multiple tasks, other specified",
                                "d2209": "Undertaking multiple tasks, unspecified"
                            }
                        },
                        "d230": {
                            name: "Carrying out daily routine",
                            desc: "Planning, managing and completing day-to-day procedures or duties.",
                            inclusions: "budgeting time, managing activity level",
                            exclusions: "undertaking multiple tasks (d220)",
                            subs: {
                                "d2301": "Managing daily routine",
                                "d2302": "Completing the daily routine",
                                "d2303": "Managing one's own activity level (arranging energy and time)",
                                "d2308": "Carrying out daily routine, other specified",
                                "d2309": "Carrying out daily routine, unspecified"
                            }
                        },
                        "d240": {
                            name: "Handling stress and other psychological demands",
                            desc: "Managing psychological demands required for tasks involving stress, distraction or crisis.",
                            inclusions: "handling responsibilities, stress and crisis",
                            subs: {
                                "d2400": "Handling responsibilities",
                                "d2401": "Handling stress (coping with pressure)",
                                "d2402": "Handling crisis (acute danger or difficulty)",
                                "d2408": "Handling stress, other specified",
                                "d2409": "Handling stress, unspecified"
                            }
                        },
                        "d298": "General tasks and demands, other specified",
                        "d299": "General tasks and demands, unspecified"
                    }
                }
            ]
        },
        ch3: {
            title: "Communication",
            groups: [
                {
                    name: "Communicating - receiving (d310-d329)",
                    codes: {
                        "d310": "Communicating with - receiving - spoken messages (comprehending literal and implied meanings)",
                        "d315": {
                            name: "Communicating with - receiving - nonverbal messages",
                            desc: "Comprehending literal/implied meanings of gestures, symbols and drawings.",
                            subs: {
                                "d3150": "Communicating with - receiving - body gestures (facial expressions, posture)",
                                "d3151": "Communicating with - receiving - general signs and symbols (traffic signs, icons)",
                                "d3152": "Communicating with - receiving - drawings and photographs (graphs, charts)",
                                "d3158": "Communicating with - receiving - nonverbal, other specified",
                                "d3159": "Communicating with - receiving - nonverbal, unspecified"
                            }
                        },
                        "d320": "Communicating with - receiving - formal sign language messages",
                        "d325": "Communicating with - receiving - written messages (incl. Braille)",
                        "d329": "Communicating - receiving, other specified and unspecified"
                    }
                },
                {
                    name: "Communicating - producing (d330-d349)",
                    codes: {
                        "d330": "Speaking (producing words, phrases, stories)",
                        "d335": {
                            name: "Producing nonverbal messages",
                            desc: "Using gestures, symbols and drawings to convey messages.",
                            subs: {
                                "d3350": "Producing body language (smiling, frowning, postures)",
                                "d3351": "Producing signs and symbols (icons, symbolic notation)",
                                "d3352": "Producing drawings and photographs (sketches, diagrams)",
                                "d3358": "Producing nonverbal messages, other specified",
                                "d3359": "Producing nonverbal messages, unspecified"
                            }
                        },
                        "d340": "Producing messages in formal sign language",
                        "d345": "Writing messages (producing literal/implied meanings in writing)",
                        "d349": "Communication - producing, other specified and unspecified"
                    }
                },
                {
                    name: "Conversation and use of communication devices and techniques (d350-d369)",
                    codes: {
                        "d350": {
                            name: "Conversation",
                            desc: "Interchange of thoughts and ideas via language.",
                            subs: {
                                "d3500": "Starting a conversation (introductions, greetings)",
                                "d3501": "Sustaining a conversation (taking turns, adding ideas)",
                                "d3502": "Ending a conversation (closure, termination)",
                                "d3503": "Conversing with one person",
                                "d3504": "Conversing with many people",
                                "d3508": "Conversation, other specified",
                                "d3509": "Conversation, unspecified"
                            }
                        },
                        "d355": {
                            name: "Discussion",
                            desc: "Examination of a matter with arguments for or against.",
                            subs: {
                                "d3550": "Discussion with one person",
                                "d3551": "Discussion with many people",
                                "d3558": "Discussion, other specified",
                                "d3559": "Discussion, unspecified"
                            }
                        },
                        "d360": {
                            name: "Using communication devices and techniques",
                            desc: "Using devices and techniques for communication purposes.",
                            subs: {
                                "d3600": "Using telecommunication devices (phone, fax)",
                                "d3601": "Using writing machines (typewriters, computers, Braille writers)",
                                "d3602": "Using communication techniques (e.g. lip reading)",
                                "d3608": "Using communication devices/techniques, other specified",
                                "d3609": "Using communication devices/techniques, unspecified"
                            }
                        },
                        "d369": "Conversation and use of communication devices and techniques, other specified and unspecified"
                    }
                },
                {
                    name: "Other communication",
                    codes: {
                        "d398": "Communication, other specified",
                        "d399": "Communication, unspecified"
                    }
                }
            ]
        },
        ch4: {
            title: "Mobility",
            groups: [
                {
                    name: "Changing and maintaining body position (d410-d429)",
                    codes: {
                        "d410": {
                            name: "Changing basic body position",
                            desc: "Getting into and out of a body position and moving from one location to another.",
                            inclusions: "changing from lying, squatting, kneeling, sitting, standing; bending; shifting center of gravity",
                            exclusions: "transferring oneself (d420)",
                            subs: {
                                "d4100": "Lying down (incl. getting into prostrate position)",
                                "d4101": "Squatting",
                                "d4102": "Kneeling",
                                "d4103": "Sitting",
                                "d4104": "Standing",
                                "d4105": "Bending (torso downward or side)",
                                "d4106": "Shifting the body's centre of gravity (moving weight while sitting/standing)",
                                "d4108": "Changing basic body position, other specified",
                                "d4109": "Changing basic body position, unspecified"
                            }
                        },
                        "d415": {
                            name: "Maintaining a body position",
                            desc: "Staying in the same body position as required.",
                            inclusions: "maintaining lying, squatting, kneeling, sitting, standing",
                            subs: {
                                "d4150": "Maintaining a lying position (prone, supine, side-lying)",
                                "d4151": "Maintaining a squatting position",
                                "d4152": "Maintaining a kneeling position",
                                "d4153": "Maintaining a sitting position (straight legs, cross-legged, feet supported)",
                                "d4154": "Maintaining a standing position (slope, slippery/hard surface)",
                                "d4158": "Maintaining a body position, other specified",
                                "d4159": "Maintaining a body position, unspecified"
                            }
                        },
                        "d420": {
                            name: "Transferring oneself",
                            desc: "Moving from one surface to another without changing body position.",
                            inclusions: "transferring while sitting or lying; chair to bed, toilet, car seat",
                            exclusions: "changing basic body position (d410)",
                            subs: {
                                "d4200": "Transferring oneself while sitting (chair to bed, wheelchair to car)",
                                "d4201": "Transferring oneself while lying (bed to bed)",
                                "d4208": "Transferring oneself, other specified",
                                "d4209": "Transferring oneself, unspecified"
                            }
                        },
                        "d429": "Changing and maintaining body position, other specified and unspecified"
                    }
                },
                {
                    name: "Carrying, moving and handling objects (d430-d449)",
                    codes: {
                        "d430": {
                            name: "Lifting and carrying objects",
                            desc: "Raising up an object or taking something from one place to another.",
                            inclusions: "lifting, carrying in hands/arms, on shoulders/hip/back/head; putting down",
                            subs: {
                                "d4300": "Lifting (from lower to higher level)",
                                "d4301": "Carrying in the hands (glass, suitcase)",
                                "d4302": "Carrying in the arms (carrying a child)",
                                "d4303": "Carrying on shoulders, hip and back",
                                "d4304": "Carrying on the head",
                                "d4305": "Putting down objects",
                                "d4308": "Lifting and carrying, other specified",
                                "d4309": "Lifting and carrying, unspecified"
                            }
                        },
                        "d435": {
                            name: "Moving objects with lower extremities",
                            desc: "Moving an object by using the legs and feet.",
                            inclusions: "pushing with legs/feet; kicking",
                            subs: {
                                "d4350": "Pushing with lower extremities",
                                "d4351": "Kicking",
                                "d4358": "Moving objects with lower extremities, other specified",
                                "d4359": "Moving objects with lower extremities, unspecified"
                            }
                        },
                        "d440": {
                            name: "Fine hand use",
                            desc: "Handling, picking up, manipulating and releasing objects using hand, fingers and thumb.",
                            inclusions: "picking up, grasping, manipulating and releasing",
                            exclusions: "lifting and carrying objects (d430)",
                            subs: {
                                "d4400": "Picking up (pencil, coin)",
                                "d4401": "Grasping (tool, door knob)",
                                "d4402": "Manipulating (handling coins or small objects)",
                                "d4403": "Releasing (dropping an item)",
                                "d4408": "Fine hand use, other specified",
                                "d4409": "Fine hand use, unspecified"
                            }
                        },
                        "d445": {
                            name: "Hand and arm use",
                            desc: "Performing actions required to move or manipulate objects using hands and arms.",
                            inclusions: "pulling/pushing; reaching; turning/twisting; throwing; catching",
                            exclusions: "fine hand use (d440)",
                            subs: {
                                "d4450": "Pulling (moving towards oneself)",
                                "d4451": "Pushing (moving away from oneself)",
                                "d4452": "Reaching (extending to touch/grasp)",
                                "d4453": "Turning or twisting the hands or arms (tools, utensils)",
                                "d4454": "Throwing",
                                "d4455": "Catching",
                                "d4458": "Hand and arm use, other specified",
                                "d4459": "Hand and arm use, unspecified"
                            }
                        },
                        "d449": "Carrying, moving and handling objects, other specified and unspecified"
                    }
                },
                {
                    name: "Walking and moving (d450-d469)",
                    codes: {
                        "d450": {
                            name: "Walking",
                            desc: "Moving along a surface on foot, step by step.",
                            inclusions: "short/long distances, different surfaces, around obstacles",
                            exclusions: "transferring oneself (d420); moving around (d455)",
                            subs: {
                                "d4500": "Walking short distances (<1 km, around rooms/hallways)",
                                "d4501": "Walking long distances (>1 km, across town/townships)",
                                "d4502": "Walking on different surfaces (sloping, uneven, gravel, ice)",
                                "d4503": "Walking around obstacles (people, animals, crowded areas)",
                                "d4508": "Walking, other specified",
                                "d4509": "Walking, unspecified"
                            }
                        },
                        "d455": {
                            name: "Moving around",
                            desc: "Moving the whole body by means other than walking.",
                            inclusions: "crawling, climbing, running, jumping, swimming",
                            exclusions: "transferring oneself (d420); walking (d450)",
                            subs: {
                                "d4550": "Crawling (on hands/arms and knees)",
                                "d4551": "Climbing (upwards/downwards over steps, ladders, rocks)",
                                "d4552": "Running (quick steps, both feet off ground)",
                                "d4553": "Jumping (hopping, skipping, jumping on one foot)",
                                "d4554": "Swimming",
                                "d4558": "Moving around, other specified",
                                "d4559": "Moving around, unspecified"
                            }
                        },
                        "d460": {
                            name: "Moving around in different locations",
                            desc: "Walking and moving around in various places and situations.",
                            inclusions: "moving within home, other buildings, and outside",
                            subs: {
                                "d4600": "Moving around within the home (between rooms, floors, garden)",
                                "d4601": "Moving around within buildings other than home",
                                "d4602": "Moving around outside the home and other buildings",
                                "d4608": "Moving around in different locations, other specified",
                                "d4609": "Moving around in different locations, unspecified"
                            }
                        },
                        "d465": "Moving around using equipment (wheelchair, walker, skates, skis)",
                        "d469": "Walking and moving, other specified and unspecified"
                    }
                },
                {
                    name: "Moving around using transportation (d470-d489)",
                    codes: {
                        "d470": {
                            name: "Using transportation",
                            desc: "Using transportation to move around as a passenger.",
                            inclusions: "human-powered, private motorized, or public motorized (bus, train, plane)",
                            exclusions: "moving around using equipment (d465); driving (d475)",
                            subs: {
                                "d4700": "Using human-powered vehicles (rickshaw, rowboat)",
                                "d4701": "Using private motorized transportation (taxi, private boat/aircraft)",
                                "d4702": "Using public motorized transportation (bus, train, subway)",
                                "d4708": "Using transportation, other specified",
                                "d4709": "Using transportation, unspecified"
                            }
                        },
                        "d475": {
                            name: "Driving",
                            desc: "Being in control of and moving a vehicle or the animal that draws it.",
                            inclusions: "human-powered (bicycle), motorized (car, motorcycle), animal-powered",
                            exclusions: "moving using equipment (d465); using transportation (d470)",
                            subs: {
                                "d4750": "Driving human-powered transportation (bicycle, rowboat)",
                                "d4751": "Driving motorized vehicles (automobile, motorcycle)",
                                "d4752": "Driving animal-powered vehicles",
                                "d4758": "Driving, other specified",
                                "d4759": "Driving, unspecified"
                            }
                        },
                        "d480": "Riding animals for transportation (horse, ox, camel)",
                        "d489": "Moving around using transportation, other specified and unspecified"
                    }
                },
                {
                    name: "Other mobility",
                    codes: {
                        "d498": "Mobility, other specified",
                        "d499": "Mobility, unspecified"
                    }
                }
            ]
        },
        ch5: {
            title: "Self-care",
            groups: [
                {
                    name: "Self-care (d510-d599)",
                    codes: {
                        "d510": {
                            name: "Washing oneself",
                            desc: "Washing and drying one's whole body or body parts.",
                            subs: {
                                "d5100": "Washing body parts",
                                "d5101": "Washing whole body",
                                "d5102": "Drying oneself",
                                "d5108": "Washing oneself, other specified",
                                "d5109": "Washing oneself, unspecified"
                            }
                        },
                        "d520": {
                            name: "Caring for body parts",
                            desc: "Looking after skin, face, teeth, scalp, nails and genitals.",
                            subs: {
                                "d5200": "Caring for skin (removing calluses, moisturizing)",
                                "d5201": "Caring for teeth (brushing, flossing, prosthesis care)",
                                "d5202": "Caring for hair (combing, styling, shaving)",
                                "d5203": "Caring for fingernails",
                                "d5204": "Caring for toenails",
                                "d5208": "Caring for body parts, other specified",
                                "d5209": "Caring for body parts, unspecified"
                            }
                        },
                        "d530": {
                            name: "Toileting",
                            desc: "Elimination of human waste and cleaning oneself afterwards.",
                            subs: {
                                "d5300": "Regulating urination (indicating need, position, cleaning)",
                                "d5301": "Regulating defecation",
                                "d5302": "Menstrual care",
                                "d5308": "Toileting, other specified",
                                "d5309": "Toileting, unspecified"
                            }
                        },
                        "d540": {
                            name: "Dressing",
                            desc: "Putting on and taking off clothes and footwear.",
                            subs: {
                                "d5400": "Putting on clothes",
                                "d5401": "Taking off clothes",
                                "d5402": "Putting on footwear",
                                "d5403": "Taking off footwear",
                                "d5404": "Choosing appropriate clothing",
                                "d5408": "Dressing, other specified",
                                "d5409": "Dressing, unspecified"
                            }
                        },
                        "d550": "Eating (taking food to mouth, consuming culturally)",
                        "d560": "Drinking (mixing, stirring, pouring, consuming)",
                        "d570": {
                            name: "Looking after one’s health",
                            desc: "Ensuring physical comfort, health and well-being.",
                            subs: {
                                "d5700": "Ensuring one’s physical comfort (awareness, temperature, position)",
                                "d5701": "Managing diet and fitness",
                                "d5702": "Maintaining one's health (professional aid, following medical advice)",
                                "d5708": "Looking after one’s health, other specified",
                                "d5709": "Looking after one’s health, unspecified"
                            }
                        },
                        "d598": "Self-care, other specified",
                        "d599": "Self-care, unspecified"
                    }
                }
            ]
        },
        ch6: {
            title: "Domestic life",
            groups: [
                {
                    name: "Acquisition of necessities (d610-d629)",
                    codes: {
                        "d610": {
                            name: "Acquiring a place to live",
                            desc: "Buying, renting, furnishing and arranging a dwelling.",
                            subs: {
                                "d6100": "Buying a place to live",
                                "d6101": "Renting a place to live",
                                "d6102": "Furnishing a place to live",
                                "d6108": "Acquiring a place to live, other specified",
                                "d6109": "Acquiring a place to live, unspecified"
                            }
                        },
                        "d620": {
                            name: "Acquisition of goods and services",
                            desc: "Selecting, procuring and transporting all goods and services required for daily living.",
                            subs: {
                                "d6200": "Shopping (selecting, negotiating, paying, transporting)",
                                "d6201": "Gathering daily necessities (harvesting, getting water/fuel)",
                                "d6208": "Acquisition of goods and services, other specified",
                                "d6209": "Acquisition of goods and services, unspecified"
                            }
                        },
                        "d629": "Acquisition of necessities, other specified and unspecified"
                    }
                },
                {
                    name: "Household tasks (d630-d649)",
                    codes: {
                        "d630": {
                            name: "Preparing meals",
                            desc: "Planning, organizing, cooking and serving meals.",
                            subs: {
                                "d6300": "Preparing simple meals (small number of ingredients)",
                                "d6301": "Preparing complex meals (large number of ingredients, slicing, Presenting)",
                                "d6308": "Preparing meals, other specified",
                                "d6309": "Preparing meals, unspecified"
                            }
                        },
                        "d640": {
                            name: "Doing housework",
                            desc: "Managing household by cleaning, washing, using appliances.",
                            subs: {
                                "d6400": "Washing and drying clothes and garments (by hand/air)",
                                "d6401": "Cleaning cooking area and utensils (washing dishes, floors)",
                                "d6402": "Cleaning living area (tidying, dusting, windows, walls)",
                                "d6403": "Using household appliances (washing machines, vacuum cleaners)",
                                "d6404": "Storing daily necessities (canning, salting, refrigerating)",
                                "d6405": "Disposing of garbage",
                                "d6408": "Doing housework, other specified",
                                "d6409": "Doing housework, unspecified"
                            }
                        },
                        "d649": "Household tasks, other specified and unspecified"
                    }
                },
                {
                    name: "Caring for household objects and assisting others (d650-d669)",
                    codes: {
                        "d650": {
                            name: "Caring for household objects",
                            desc: "Maintaining and repairing household and personal objects.",
                            subs: {
                                "d6500": "Making and repairing clothes (sewing, mending, fixing footwear)",
                                "d6501": "Maintaining dwelling and furnishings (painting, fixing furniture)",
                                "d6502": "Maintaining domestic appliances",
                                "d6503": "Maintaining vehicles (bicycle, automobile, boat)",
                                "d6504": "Maintaining assistive devices (prostheses, wheelchairs, walkers)",
                                "d6505": "Taking care of plants (indoor/outdoor, gardening)",
                                "d6506": "Taking care of animals (feeding, cleaning, grooming)",
                                "d6508": "Caring for household objects, other specified",
                                "d6509": "Caring for household objects, unspecified"
                            }
                        },
                        "d660": {
                            name: "Assisting others",
                            desc: "Helping others with learning, self-care, movement, or well-being.",
                            subs: {
                                "d6600": "Assisting others with self-care (bathing, dressing, eating)",
                                "d6601": "Assisting others in movement (outside, to/from destinations)",
                                "d6602": "Assisting others in communication",
                                "d6603": "Assisting others in interpersonal relations",
                                "d6604": "Assisting others in nutrition (preparing/eating meals)",
                                "d6605": "Assisting others in health maintenance (medical check-ups)",
                                "d6608": "Assisting others, other specified",
                                "d6609": "Assisting others, unspecified"
                            }
                        },
                        "d669": "Caring for household objects and assisting others, other specified and unspecified"
                    }
                },
                {
                    name: "Other domestic life",
                    codes: {
                        "d698": "Domestic life, other specified",
                        "d699": "Domestic life, unspecified"
                    }
                }
            ]
        },
        ch7: {
            title: "Interpersonal interactions and relationships",
            groups: [
                {
                    name: "General interpersonal interactions (d710-d729)",
                    codes: {
                        "d710": {
                            name: "Basic interpersonal interactions",
                            desc: "Interacting in a contextually and socially appropriate manner.",
                            subs: {
                                "d7100": "Respect and warmth in relationships",
                                "d7101": "Appreciation in relationships",
                                "d7102": "Tolerance in relationships",
                                "d7103": "Criticism in relationships",
                                "d7104": "Social cues in relationships (signs and hints)",
                                "d7105": "Physical contact in relationships",
                                "d7108": "Basic interpersonal interactions, other specified",
                                "d7109": "Basic interpersonal interactions, unspecified"
                            }
                        },
                        "d720": {
                            name: "Complex interpersonal interactions",
                            desc: "Maintaining and managing interactions with other people.",
                            subs: {
                                "d7200": "Forming relationships (beginning and maintaining interactions)",
                                "d7201": "Terminating relationships (bringing interactions to a close)",
                                "d7202": "Regulating behaviours within interactions (regulating emotions/impulses)",
                                "d7203": "Interacting according to social rules",
                                "d7204": "Maintaining social space (proper distance)",
                                "d7208": "Complex interpersonal interactions, other specified",
                                "d7209": "Complex interpersonal interactions, unspecified"
                            }
                        },
                        "d729": "General interpersonal interactions, other specified and unspecified"
                    }
                },
                {
                    name: "Particular interpersonal relationships (d730-d779)",
                    codes: {
                        "d730": "Relating with strangers (temporary contacts for specific purposes)",
                        "d740": {
                            name: "Formal relationships",
                            desc: "Creating and maintaining relationships in formal settings.",
                            subs: {
                                "d7400": "Relating with persons in authority (employer, higher rank)",
                                "d7401": "Relating with subordinates (employee, subordinates)",
                                "d7402": "Relating with equals (same rank or prestige)",
                                "d7408": "Formal relationships, other specified",
                                "d7409": "Formal relationships, unspecified"
                            }
                        },
                        "d750": {
                            name: "Informal social relationships",
                            desc: "Casual relationships with neighbors, co-workers, peers.",
                            subs: {
                                "d7500": "Informal relationships with friends",
                                "d7501": "Informal relationships with neighbours",
                                "d7502": "Informal relationships with acquaintances",
                                "d7503": "Informal relationships with co-inhabitants",
                                "d7504": "Informal relationships with peers (same age or interest)",
                                "d7508": "Informal social relationships, other specified",
                                "d7509": "Informal social relationships, unspecified"
                            }
                        },
                        "d760": {
                            name: "Family relationships",
                            desc: "Creating and maintaining kinship relationships.",
                            subs: {
                                "d7600": "Parent-child relationships (natural or adoptive parent role)",
                                "d7601": "Child-parent relationships (obeying or caring for parents)",
                                "d7602": "Sibling relationships (brothers/sisters)",
                                "d7603": "Extended family relationships (cousins, aunts, uncles)",
                                "d7608": "Family relationships, other specified",
                                "d7609": "Family relationships, unspecified"
                            }
                        },
                        "d770": {
                            name: "Intimate relationships",
                            desc: "Romantic, spousal and sexual relationships.",
                            subs: {
                                "d7700": "Romantic relationships (emotional/physical attraction)",
                                "d7701": "Spousal relationships (legal marriage, spouse)",
                                "d7702": "Sexual relationships",
                                "d7708": "Intimate relationships, other specified",
                                "d7709": "Intimate relationships, unspecified"
                            }
                        },
                        "d779": "Particular interpersonal relationships, other specified and unspecified"
                    }
                },
                {
                    name: "Other interpersonal interactions and relationships",
                    codes: {
                        "d798": "Interpersonal interactions and relationships, other specified",
                        "d799": "Interpersonal interactions and relationships, unspecified"
                    }
                }
            ]
        },
        ch8: {
            title: "Major life areas",
            groups: [
                {
                    name: "Education (d810-d839)",
                    codes: {
                        "d810": "Informal education (learning at home, homeschooling)",
                        "d815": "Preschool education (preparation for school, day-care)",
                        "d820": "School education (primary and secondary education, organizing/studying)",
                        "d825": "Vocational training (preparation for employment in a trade/job)",
                        "d830": "Higher education (university, colleges, professional schools)",
                        "d839": "Education, other specified and unspecified"
                    }
                },
                {
                    name: "Work and employment (d840-d859)",
                    codes: {
                        "d840": "Apprenticeship (work preparation, internship, in-service training)",
                        "d845": {
                            name: "Acquiring, keeping and terminating a job",
                            desc: "Seeking, finding and choosing employment.",
                            subs: {
                                "d8450": "Seeking employment (locating job, interview)",
                                "d8451": "Maintaining a job (promotion, advancement)",
                                "d8452": "Terminating a job (quitting in appropriate manner)",
                                "d8458": "Acquiring, keeping and terminating a job, other specified",
                                "d8459": "Acquiring, keeping and terminating a job, unspecified"
                            }
                        },
                        "d850": {
                            name: "Remunerative employment",
                            desc: "Engaging in work as an occupation for payment.",
                            subs: {
                                "d8500": "Self-employment (free-lance, consultant, owner)",
                                "d8501": "Part-time employment",
                                "d8502": "Full-time employment",
                                "d8508": "Remunerative employment, other specified",
                                "d8509": "Remunerative employment, unspecified"
                            }
                        },
                        "d855": "Non-remunerative employment (volunteer, charity, community work)",
                        "d859": "Work and employment, other specified and unspecified"
                    }
                },
                {
                    name: "Economic life (d860-d879)",
                    codes: {
                        "d860": "Basic economic transactions (purchasing food, bartering, saving)",
                        "d865": "Complex economic transactions (buying business, trading commodities)",
                        "d870": {
                            name: "Economic self-sufficiency",
                            desc: "Having command over economic resources for security.",
                            subs: {
                                "d8700": "Personal economic resources",
                                "d8701": "Public economic entitlements",
                                "d8708": "Economic self-sufficiency, other specified",
                                "d8709": "Economic self-sufficiency, unspecified"
                            }
                        },
                        "d879": "Economic life, other specified and unspecified"
                    }
                },
                {
                    name: "Other major life areas",
                    codes: {
                        "d898": "Major life areas, other specified",
                        "d899": "Major life areas, unspecified"
                    }
                }
            ]
        },
        ch9: {
            title: "Community, social and civic life",
            groups: [
                {
                    name: "Community, social and civic life (d910-d950)",
                    codes: {
                        "d910": {
                            name: "Community life",
                            desc: "Engaging in aspects of community social life.",
                            subs: {
                                "d9100": "Informal associations",
                                "d9101": "Formal associations",
                                "d9102": "Ceremonies (non-religious rites, marriages, funerals)",
                                "d9108": "Community life, other specified",
                                "d9109": "Community life, unspecified"
                            }
                        },
                        "d920": {
                            name: "Recreation and leisure",
                            desc: "Engaging in play, recreational or leisure activity.",
                            subs: {
                                "d9200": "Play (games with rules or unstructured)",
                                "d9201": "Sports (competitive and athletic events)",
                                "d9202": "Arts and culture (theatre, cinema, gallery, music)",
                                "d9203": "Crafts (pottery, knitting)",
                                "d9204": "Hobbies (collecting, stamps, coins)",
                                "d9205": "Socializing (visiting friends, informal meetups)",
                                "d9208": "Recreation and leisure, other specified",
                                "d9209": "Recreation and leisure, unspecified"
                            }
                        },
                        "d930": {
                            name: "Religion and spirituality",
                            desc: "Engaging in religious or spiritual activities and practices.",
                            subs: {
                                "d9300": "Organized religion (ceremonies, church, mosque)",
                                "d9301": "Spirituality (activities outside organized religion)",
                                "d9308": "Religion and spirituality, other specified",
                                "d9309": "Religion and spirituality, unspecified"
                            }
                        },
                        "d940": "Human rights (enjoying nationally/internationally recognized rights)",
                        "d950": "Political life and citizenship (voting, holding office, speech)",
                        "d998": "Community, social and civic life, other specified",
                        "d999": "Community, social and civic life, unspecified"
                    }
                }
            ]
        }
    },
    // --- 4. ENVIRONMENTAL FACTORS (e) ---
    e: {
        ch1: {
            title: "Products and technology",
            groups: [
                {
                    name: "Products and technology (e110-e165)",
                    codes: {
                        "e110": {
                            name: "Products or substances for personal consumption",
                            desc: "Object or substance gathered, processed or manufactured for ingestion.",
                            subs: {
                                "e1100": "Food (ingestion, vitamin supplements)",
                                "e1101": "Drugs (allopathic and naturopathic medication)",
                                "e1108": "Products/substances for personal consumption, other specified",
                                "e1109": "Products/substances for personal consumption, unspecified"
                            }
                        },
                        "e115": {
                            name: "Products and technology for personal use in daily living",
                            desc: "Equipment and technologies used in daily activities.",
                            subs: {
                                "e1150": "General products/technology (clothes, furniture, appliances)",
                                "e1151": "Assistive products/technology (prosthetics, orthotics, control units)",
                                "e1158": "Products/technology for personal use, other specified",
                                "e1159": "Products/technology for personal use, unspecified"
                            }
                        },
                        "e120": {
                            name: "Products and technology for personal indoor and outdoor mobility and transportation",
                            desc: "Equipment for moving inside and outside buildings.",
                            subs: {
                                "e1200": "General products (vehicles, animal-powered transporters)",
                                "e1201": "Assistive products (walking devices, wheelchairs, special cars)",
                                "e1208": "Mobility products/technology, other specified",
                                "e1209": "Mobility products/technology, unspecified"
                            }
                        },
                        "e125": {
                            name: "Products and technology for communication",
                            desc: "Equipment for sending and receiving information.",
                            subs: {
                                "e1250": "General products (telephone, TV, audio recorders)",
                                "e1251": "Assistive products (vision/hearing aids, cochlear implants, boards)",
                                "e1258": "Communication products/technology, other specified",
                                "e1259": "Communication products/technology, unspecified"
                            }
                        },
                        "e130": {
                            name: "Products and technology for education",
                            desc: "Equipment for acquisition of knowledge or skill.",
                            subs: {
                                "e1300": "General products (books, manuals, educational toys)",
                                "e1301": "Assistive products (specialized computer technology)",
                                "e1308": "Education products/technology, other specified",
                                "e1309": "Education products/technology, unspecified"
                            }
                        },
                        "e135": {
                            name: "Products and technology for employment",
                            desc: "Equipment used to facilitate work activities.",
                            subs: {
                                "e1350": "General products (tools, machines, office equipment)",
                                "e1351": "Assistive products (adjustable desks, remote door controls)",
                                "e1358": "Employment products/technology, other specified",
                                "e1359": "Employment products/technology, unspecified"
                            }
                        },
                        "e140": {
                            name: "Products and technology for culture, recreation and sport",
                            desc: "Equipment for conduct of cultural or sporting activities.",
                            subs: {
                                "e1400": "General products (toys, skis, musical instruments)",
                                "d1401": "Assistive products (modified mobility for sports)",
                                "e1408": "Culture/recreation/sport products, other specified",
                                "e1409": "Culture/recreation/sport products, unspecified"
                            }
                        },
                        "e145": {
                            name: "Products and technology for the practice of religion and spirituality",
                            desc: "Products given symbolic meaning in religious contexts.",
                            subs: {
                                "e1450": "General products (crucifixes, prayer mats, spirit houses)",
                                "e1451": "Assistive products (Braille religious books)",
                                "e1458": "Religion/spirituality products, other specified",
                                "e1459": "Religion/spirituality products, unspecified"
                            }
                        },
                        "e150": {
                            name: "Design, construction and building products and technology of buildings for public use",
                            desc: "Human-made indoor and outdoor environment for public use.",
                            subs: {
                                "e1500": "Entering/exiting public buildings (ramps, lever handles)",
                                "e1501": "Accessing facilities inside (elevators, thermostats, seating)",
                                "e1502": "Way finding and path routing (signage, Braille, Directories)",
                                "e1508": "Public building design/products, other specified",
                                "e1509": "Public building design/products, unspecified"
                            }
                        },
                        "e155": {
                            name: "Design, construction and building products and technology of buildings for private use",
                            desc: "Human-made indoor and outdoor environment for private use.",
                            subs: {
                                "e1550": "Entering/exiting private buildings (portable ramps, lever handles)",
                                "e1551": "Accessing facilities inside (kitchen cabinets, appliances)",
                                "e1552": "Way finding and path routing",
                                "e1558": "Private building design/products, other specified",
                                "e1559": "Private building design/products, unspecified"
                            }
                        },
                        "e160": {
                            name: "Products and technology of land development",
                            desc: "Products and technology of land areas (land use policies).",
                            subs: {
                                "e1600": "Rural land development (farm lands, pathways)",
                                "e1601": "Suburban land development (kerb cuts, street lighting)",
                                "e1602": "Urban land development (ramps, street lighting)",
                                "e1603": "Parks, conservation and wildlife areas (wildlife trails)",
                                "e1608": "Land development products, other specified",
                                "e1609": "Land development products, unspecified"
                            }
                        },
                        "e165": {
                            name: "Assets",
                            desc: "Products or objects of economic exchange (property, money).",
                            subs: {
                                "e1650": "Financial assets (money, medium of exchange)",
                                "e1651": "Tangible assets (houses, land, clothing, technical goods)",
                                "e1652": "Intangible assets (intellectual property, knowledge)",
                                "e1658": "Assets, other specified",
                                "e1659": "Assets, unspecified"
                            }
                        },
                        "e198": "Products and technology, other specified",
                        "e199": "Products and technology, unspecified"
                    }
                }
            ]
        },
        ch2: {
            title: "Natural environment and human-made changes to environment",
            groups: [
                {
                    name: "Natural environment and human-made changes to environment (e210-e260)",
                    codes: {
                        "e210": {
                            name: "Physical geography",
                            desc: "Features of land forms and bodies of water.",
                            subs: {
                                "e2100": "Land forms (mountains, hills, valleys)",
                                "e2101": "Bodies of water (lakes, dams, rivers)",
                                "e2108": "Physical geography, other specified",
                                "e2109": "Physical geography, unspecified"
                            }
                        },
                        "e215": {
                            name: "Population",
                            desc: "Groups of people sharing same pattern of environmental adaptation.",
                            subs: {
                                "e2150": "Demographic change (birth, death, ageing, migration)",
                                "e2151": "Population density",
                                "e2158": "Population, other specified",
                                "e2159": "Population, unspecified"
                            }
                        },
                        "e220": {
                            name: "Flora and fauna",
                            desc: "Plants and animals.",
                            subs: {
                                "e2200": "Plants",
                                "e2201": "Animals (wild, farm, mammals - excl. pets)",
                                "e2208": "Flora and fauna, other specified",
                                "e2209": "Flora and fauna, unspecified"
                            }
                        },
                        "e225": {
                            name: "Climate",
                            desc: "Meteorological features and events.",
                            subs: {
                                "e2250": "Temperature",
                                "e2251": "Humidity",
                                "e2252": "Atmospheric pressure (height above sea level)",
                                "e2253": "Precipitation (rain, snow, dew)",
                                "e2254": "Wind",
                                "e2255": "Seasonal variation",
                                "e2258": "Climate, other specified",
                                "e2259": "Climate, unspecified"
                            }
                        },
                        "e230": "Natural events (earthquakes, tornadoes, floods, fires)",
                        "e235": "Human-caused events (conflict, wars, toxic spills, pollution)",
                        "e240": {
                            name: "Light",
                            desc: "Electromagnetic radiation (sunlight, artificial).",
                            subs: {
                                "e2400": "Light intensity",
                                "e2401": "Light quality (color contrasts, visual info/distraction)",
                                "e2408": "Light, other specified",
                                "e2409": "Light, unspecified"
                            }
                        },
                        "e245": {
                            name: "Time-related changes",
                            desc: "Natural, regular or predictable temporal change.",
                            subs: {
                                "e2450": "Day/night cycles (dawn, dusk)",
                                "e2451": "Lunar cycles",
                                "e2458": "Time-related changes, other specified",
                                "e2459": "Time-related changes, unspecified"
                            }
                        },
                        "e250": {
                            name: "Sound",
                            desc: "Phenomena that is or may be heard.",
                            subs: {
                                "e2500": "Sound intensity (loud/soft, volume)",
                                "e2501": "Sound quality (timbre, tone, melodiousness/harshness)",
                                "e2508": "Sound, other specified",
                                "e2509": "Sound, unspecified"
                            }
                        },
                        "e255": "Vibration (shaking, quivering caused by machines, aircraft)",
                        "e260": {
                            name: "Air quality",
                            desc: "Characteristics of atmosphere inside or outside buildings.",
                            subs: {
                                "e2600": "Indoor air quality (odour, smoke, humidity, AC)",
                                "e2601": "Outdoor air quality (smell of rain, toxic smells)",
                                "e2608": "Air quality, other specified",
                                "e2609": "Air quality, unspecified"
                            }
                        },
                        "e298": "Natural environment and human-made changes to environment, other specified",
                        "e299": "Natural environment and human-made changes to environment, unspecified"
                    }
                }
            ]
        },
        ch3: {
            title: "Support and relationships",
            groups: [
                {
                    name: "Support and relationships (e310-e360)",
                    codes: {
                        "e310": "Immediate family (spouses, parents, siblings, children, grandparents)",
                        "e315": "Extended family (aunts, uncles, nephews, nieces)",
                        "e320": "Friends",
                        "e325": "Acquaintances, peers colleagues, neighbours and community members",
                        "e330": "People in positions of authority (teachers, employers, religious leaders)",
                        "e335": "People in subordinate positions (students, employees)",
                        "e340": "Personal care providers and personal assistants (paid help, nannies)",
                        "e345": "Strangers",
                        "e350": "Domesticated animals (pets, animals for personal mobility)",
                        "e355": "Health professionals (doctors, nurses, physiotherapists, OTs, STs)",
                        "e360": "Other professionals (social workers, lawyers, teachers, architects)",
                        "e398": "Support and relationships, other specified",
                        "e399": "Support and relationships, unspecified"
                    }
                }
            ]
        },
        ch4: {
            title: "Attitudes",
            groups: [
                {
                    name: "Attitudes (e410-e465)",
                    codes: {
                        "e410": "Individual attitudes of immediate family members",
                        "e415": "Individual attitudes of extended family members",
                        "e420": "Individual attitudes of friends",
                        "e425": "Individual attitudes of acquaintances, peers colleagues, neighbours and community members",
                        "e430": "Individual attitudes of people in positions of authority",
                        "e435": "Individual attitudes of people in subordinate positions",
                        "e440": "Individual attitudes of personal care providers and personal assistants",
                        "e445": "Individual attitudes of strangers",
                        "e450": "Individual attitudes of health professionals",
                        "e455": "Individual attitudes of other professionals",
                        "e460": "Societal attitudes (opinions/beliefs held by people of a culture/society)",
                        "e465": "Social norms, practices and ideologies (customs, rules, values)",
                        "e498": "Attitudes, other specified",
                        "e499": "Attitudes, unspecified"
                    }
                }
            ]
        },
        ch5: {
            title: "Services, systems and policies",
            groups: [
                {
                    name: "Services, systems and policies (e510-e595)",
                    codes: {
                        "e510": {
                            name: "Services, systems and policies for the production of consumer goods",
                            desc: "Governing and providing for the production of objects used by people.",
                            subs: {
                                "e5100": "Services for production (collection, manufacturing)",
                                "e5101": "Systems for production (standards setting, monitoring)",
                                "e5102": "Policies for production (legislation, regulations)",
                                "e5108": "Services, systems and policies, other specified",
                                "e5109": "Services, systems and policies, unspecified"
                            }
                        },
                        "e515": {
                            name: "Architecture and construction services, systems and policies",
                            desc: "Design and construction of buildings, public and private.",
                            subs: {
                                "e5150": "Architecture and construction services",
                                "e5151": "Architecture and construction systems (building codes monitoring)",
                                "e5152": "Architecture and construction policies"
                            }
                        },
                        "e520": "Open space planning services, systems and policies (parks, forests, shorelines)",
                        "e525": "Housing services, systems and policies (shelters, dwellings, lodging)",
                        "e530": "Utilities services, systems and policies (water, fuel, electricity, sanitation)",
                        "e535": "Communication services, systems and policies (telephone, internet, mail)",
                        "e540": "Transportation services, systems and policies (road, rail, air, water)",
                        "e545": "Civil protection services, systems and policies (fire, police, ambulance)",
                        "e550": "Legal services, systems and policies (courts, tribunals, legislation)",
                        "e555": "Associations and organizational services, systems and policies",
                        "e560": {
                            name: "Media services, systems and policies",
                            desc: "Provision of mass communication (radio, TV, newspapers, internet).",
                            subs: {
                                "e5600": "Media services (radio, TV, press, Braille services)",
                                "e5601": "Media systems (content/distribution standards)",
                                "e5602": "Media policies"
                            }
                        },
                        "e565": "Economic services, systems and policies",
                        "e570": {
                            name: "Social security services, systems and policies",
                            desc: "Income support for age, poverty, or disability.",
                            subs: {
                                "e5700": "Social security services (welfare, insurance, pensions)",
                                "e5701": "Social security systems (eligibility monitoring)",
                                "e5702": "Social security policies"
                            }
                        },
                        "e575": "General social support services, systems and policies (shopping, housework help)",
                        "e580": {
                            name: "Health services, systems and policies",
                            desc: "Preventing/treating health problems and medical rehabilitation.",
                            subs: {
                                "e5800": "Health services (hospitals, clinics, primary care, rehab)",
                                "e5801": "Health systems (accessibility, universality, funding)",
                                "e5802": "Health policies"
                            }
                        },
                        "e585": {
                            name: "Education and training services, systems and policies",
                            desc: "Acquisition of knowledge, expertise and vocational skills.",
                            subs: {
                                "e5850": "Education/training services (preschool to university)",
                                "e5851": "Education/training systems (boards, curricula size)",
                                "e5852": "Education/training policies"
                            }
                        },
                        "e590": {
                            name: "Labour and employment services, systems and policies",
                            desc: "Finding work and supporting employed individuals.",
                            subs: {
                                "e5900": "Labour services (placement, vocational follow-up, OHS)",
                                "e5901": "Labour systems (employment creation, unions)",
                                "e5902": "Labour policies"
                            }
                        },
                        "e595": "Political services, systems and policies (voting, governance, treaties)",
                        "e598": "Services, systems and policies, other specified",
                        "e599": "Services, systems and policies, unspecified"
                    }
                }
            ]
        }
    }
};
