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
                    <td style="width: 45%;"><span style="color: #94a3b8; font-weight: bold; text-transform: uppercase;">Nama:</span> <span style="font-weight: 950; color: #0f172a; text-transform: uppercase; margin-left: 4px;">${p ? p.name : '-'}</span></td>
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
                            <span style="display: block; font-weight: 900; color: #1e293b; font-size: 0.85em;">${a.diagnosis || '-'}</span>
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

                    ${conf.showObjective ? `
                    <div class="break-inside-avoid" style="page-break-inside: avoid; break-inside: avoid;">
                        <h3 style="font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; font-size: 0.75em;">Pemeriksaan Objektif</h3>
                        <div style="background: #fdfdfd; border: 1px solid #f1f5f9; border-radius: 6px; padding: 6px 8px;">
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px;">
                                <tr>
                                    <td style="font-size: 0.7em; font-weight: bold; color: #64748b;">VAS Nyeri</td>
                                    <td style="font-weight: 950; font-size: 1.2em; color: #2563eb; text-align: right;">${a.vas || 0}<span style="font-size: 0.5em; color: #94a3b8; font-weight: normal;">/10</span></td>
                                </tr>
                            </table>
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.78em; color: #475569;">
                                <tr><td style="padding-bottom: 2px;">ROM:</td><td style="font-weight: bold; text-align: right;">${a.obj?.rom || '-'}</td></tr>
                                <tr><td style="padding-bottom: 2px;">MMT:</td><td style="font-weight: bold; text-align: right;">${a.obj?.mmt || '-'}</td></tr>
                                <tr><td style="padding-bottom: 2px;">Balance:</td><td style="font-weight: bold; text-align: right;">${a.obj?.balance || '-'}</td></tr>
                            </table>
                        </div>
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

        <!-- SECTION BLOCK 3: INTERVENTION -->
        <div class="break-inside-avoid" style="margin-bottom: 6px; page-break-inside: avoid; break-inside: avoid;">
            <h3 style="font-weight: 950; color: #0f172a; text-transform: uppercase; margin-bottom: 4px; font-size: 0.75em;">D. Intervensi & Program</h3>
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
                                        ${a.intervention[i + 1] ? `
                                        <div style="display: inline-block; padding: 2px 10px; border: 1px solid #e2e8f0; border-radius: 15px; background: #fff; font-size: 0.72em; color: #334155; break-inside: avoid;">
                                            <span style="color: #94a3b8; font-size: 0.8em; margin-right: 2px;">○</span> ${a.intervention[i + 1]}
                                        </div>` : ''}
                                    </td>
                                </tr>`;
                }
                return rows;
            })()}
                    </table>
                </div>` : ''}
                
                ${conf.showEvalPlan ? `
                <table class="break-inside-avoid" style="width: 100%; border-collapse: collapse; table-layout: fixed; background: #f8fafc; page-break-inside: avoid; break-inside: avoid;">
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

        <!-- SECTION BLOCK 4: HMS -->
        ${a.hms_diagnosis ? `
        <div style="margin-top: 0px; break-inside: auto;">
            <!-- HMS BLOCK 1: MAIN DIAGNOSIS & TALLY (Force Stay Together) -->
            <div class="break-inside-avoid" style="border: 1px solid #dcfce7; background: #f0fdf4; border-radius: 10px; padding: 6px; margin-bottom: 4px; page-break-inside: avoid; break-inside: avoid;">
                <h3 style="font-weight: 950; color: #166534; text-transform: uppercase; font-size: 0.75em; margin-bottom: 6px;">E. Analisis Sistem Gerak (HMS)</h3>
                <div style="font-weight: 950; color: #0f172a; font-size: 1.05em; margin-bottom: 6px;">${a.hms_diagnosis}</div>
                
                ${(() => {
                if (!a.hms_notes) return '';
                let notes; try { notes = JSON.parse(a.hms_notes); } catch (e) { return ''; }

                // Logic to Merge Duplicate / Similar Diagnoses in Tally
                const tallyMap = {};
                (notes.tally || []).forEach(t => {
                    const dx = t.dx.trim();
                    tallyMap[dx] = (tallyMap[dx] || 0) + parseInt(t.n || 0);
                });
                const mergedTallies = Object.entries(tallyMap)
                    .map(([dx, n]) => ({ dx, n }))
                    .sort((x, y) => y.n - x.n);

                let tallyHtml = '<p style="font-size: 0.62em; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Diagnosa & Tally:</p>';
                tallyHtml += '<table style="width: 100%; border-collapse: collapse;">';
                for (let i = 0; i < mergedTallies.length; i += 2) {
                    tallyHtml += `<tr>
                            <td style="width: 50%; padding: 2px 0; vertical-align: top;">
                                <div style="display: inline-block; padding: 2px 8px; border-radius: 4px; border: 1px solid #bbf7d0; background: ${i === 0 ? '#16a34a' : '#fff'}; color: ${i === 0 ? '#fff' : '#166534'}; font-size: 0.62em; font-weight: 900;">
                                    ${i === 0 ? '🏆 ' : ''}${mergedTallies[i].dx} ${mergedTallies[i].n}x
                                </div>
                            </td>
                            <td style="width: 50%; padding: 2px 0; vertical-align: top;">
                                ${mergedTallies[i + 1] ? `
                                <div style="display: inline-block; padding: 2px 8px; border-radius: 4px; border: 1px solid #bbf7d0; background: #fff; color: #166534; font-size: 0.62em; font-weight: 900;">
                                    ${mergedTallies[i + 1].dx} ${mergedTallies[i + 1].n}x
                                </div>` : ''}
                            </td>
                        </tr>`;
                }
                tallyHtml += '</table>';
                return tallyHtml;
            })()}
            </div>

            <!-- HMS BLOCK 2: OBSERVATIONS (GRANULAR) -->
            ${(() => {
                if (!a.hms_notes) return '';
                let notes; try { notes = JSON.parse(a.hms_notes); } catch (e) { return ''; }

                const groupedObs = {};
                (notes.observations || []).forEach(o => {
                    const prot = o.protocol || 'Lainnya';
                    if (!groupedObs[prot]) groupedObs[prot] = [];
                    const text = (o.text || o.obsText || '-').trim();
                    if (!groupedObs[prot].includes(text)) {
                        groupedObs[prot].push(text);
                    }
                });

                return Object.entries(groupedObs).map(([prot, items]) => {
                    // Strict Clean: Filter out whitespace, dots, dashes, semi-colons, and placeholders
                    const cleanItems = items.filter(it => it && it.trim() !== '' && !/^[\s\-–—.;:,.\[\](){}]+$/.test(it.trim()));
                    if (cleanItems.length === 0) return '';
                    return `
                    <div class="break-inside-avoid" style="display: inline-block; width: 100%; margin-bottom: 2px; border: 1px solid #dcfce7; border-radius: 6px; background: #f0fdf4; padding: 4px; page-break-inside: avoid; break-inside: avoid;">
                        <div style="background: #f8fafc; padding: 2px 8px; border-bottom: 1px solid #f1f5f9; border-radius: 4px 4px 0 0; font-size: 0.68em; font-weight: 900; color: #475569; text-transform: uppercase; margin: -4px -4px 2px -4px; border: 1px solid #dcfce7;">
                            <span style="color: #3b82f6; margin-right: 4px;">●</span> ${prot}
                        </div>
                        <table style="width: 100%; border-collapse: collapse;">
                            ${(() => {
                            let itemsHtml = '';
                            for (let i = 0; i < cleanItems.length; i += 2) {
                                itemsHtml += `<tr>
                                        <td style="width: 50%; padding: 0px 0; vertical-align: top; font-size: 0.72em; color: #374151;">
                                            <span style="color: #16a34a; font-weight: bold; margin-right: 4px;">✓</span> ${cleanItems[i]}
                                        </td>
                                        <td style="width: 50%; padding: 0px 0; vertical-align: top; font-size: 0.72em; color: #374151;">
                                            ${cleanItems[i + 1] ? `<span style="color: #16a34a; font-weight: bold; margin-right: 4px;">✓</span> ${cleanItems[i + 1]}` : ''}
                                        </td>
                                    </tr>`;
                            }
                            return itemsHtml;
                        })()}
                        </table>
                    </div>`;
                }).join('');
            })()}
        </div>` : ''}

        <!-- SIGNATURE (Allow internal break between consent and therapist) -->
        <div style="break-inside: auto; margin-top: 12px;">
            <div style="break-inside: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 60%; vertical-align: top;">
                            ${conf.showInformedConsent ? `
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; margin-bottom: 10px; position: relative;">
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
                        <td style="width: 40%; text-align: right; vertical-align: top;">
                            ${conf.showSignature ? `
                            <div class="break-inside-avoid" style="text-align: center; display: inline-block; width: 220px; page-break-inside: avoid; break-inside: avoid;">
                                <p style="font-size: 0.78em; color: #64748b; margin-bottom: 35px;">${state.clinicInfo.city || 'Blitar'}, ${new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p style="font-weight: 950; color: #0f172a; border-bottom: 1.5px solid #0f172a; display: inline-block; padding-bottom: 2px; margin-bottom: 4px; text-transform: uppercase;">${state.clinicInfo.therapist}</p>
                                <p style="font-size: 0.7em; color: #64748b; font-weight: bold;">SIPF: ${state.clinicInfo.sipf}</p>
                            </div>` : ''}
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>`;
}


module.exports = generateSingleAssessmentHTML;