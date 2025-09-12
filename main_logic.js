document.getElementById("preventivoForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // === Input ===
    const ore = parseFloat(document.getElementById("ore").value) || 0;
    const trasferimento = parseFloat(document.getElementById("trasferimento").value) || 0; // minuti A/R
    const lavoro = document.getElementById("lavoro").value;
    const lavoroTesto = document.getElementById("lavoro").options[document.getElementById("lavoro").selectedIndex].text;
    const videoCombinata = document.getElementById("videoCombinata").checked;
    const videoFinale = document.getElementById("videoFinale").checked;
    const comuneSelect = document.getElementById("comune");
    const comuneTesto = comuneSelect.options[comuneSelect.selectedIndex].text;

    // Urgenza selezionata
    const urgenzaSelezionata = document.querySelector("input[name='urgenza']:checked").value;

    // === Tariffe (NETTO, IVA esclusa) ===
    const IVA = 0.22;
    const TARIFFE = {
        trasferimento: 1.64,
        intervento: 106.56,
        videoCombinata: 49.18,
        videoFinale: 24.59,
        urgenze: {
            feriale: 69.67,
            sabato: 122.95,
            festivo: 204.92
        }
    };

    // === Calcolo base ===
    let totaleNetto = 0;
    let dettagli = [];

    // Trasferimento tecnico
    let costoTrasf = trasferimento * TARIFFE.trasferimento;
    totaleNetto += costoTrasf;
    dettagli.push(`🚐 Trasferimento tecnico: € ${costoTrasf.toFixed(2)}`);

    // Ore intervento
    let costoIntervento = ore * TARIFFE.intervento;
    totaleNetto += costoIntervento;
    dettagli.push(`🛠️ ${lavoroTesto} (${ore}h): € ${costoIntervento.toFixed(2)}`);

    // Videoispezione in combinata
    if (videoCombinata) {
        let costoVideoComb = ore * TARIFFE.videoCombinata;
        totaleNetto += costoVideoComb;
        dettagli.push(`🎥 Videoispezione in combinata (${ore}h): € ${costoVideoComb.toFixed(2)}`);
    }

    // Videoispezione finale
    if (videoFinale) {
        totaleNetto += TARIFFE.videoFinale;
        dettagli.push(`🎥 Videoispezione finale: € ${TARIFFE.videoFinale.toFixed(2)}`);
    }

    // Urgenza
    let costoUrgenza = 0;
    let urgenzaTesto = "";

    if (urgenzaSelezionata === "feriale") {
        costoUrgenza = TARIFFE.urgenze.feriale;
        urgenzaTesto = "⚡ Urgenza feriale";
    }
    if (urgenzaSelezionata === "sabato") {
        costoUrgenza = TARIFFE.urgenze.sabato;
        urgenzaTesto = "⚡ Urgenza sabato/prefestivi";
    }
    if (urgenzaSelezionata === "festivo") {
        costoUrgenza = TARIFFE.urgenze.festivo;
        urgenzaTesto = "⚡ Urgenza festivi/domeniche";
    }

    if (costoUrgenza > 0) {
        totaleNetto += costoUrgenza;
        dettagli.push(`${urgenzaTesto}: € ${costoUrgenza.toFixed(2)}`);
    }

    // === Totale lordo ===
    let totaleLordo = totaleNetto * (1 + IVA);

    // === Output tecnico ===
    document.getElementById("risultato").innerHTML = `
    <p>Totale netto (IVA escl.): <strong>€ ${totaleNetto.toFixed(2)}</strong></p>
    <p>Totale lordo (IVA incl. 22%): <strong>€ ${totaleLordo.toFixed(2)}</strong></p>
  `;

    // === Messaggio cliente ===
    let messaggio = `
Buongiorno,

📍 Invio il preventivo per l’intervento richiesto presso:
${comuneTesto}

📑 Dettaglio dei costi:
🛣️ Km stimati: ${(trasferimento / 1.5).toFixed(0)} km A/R
⏱️ Tempo stimato di trasferimento: ${trasferimento} minuti A/R
🚐 Trasferimento tecnico: € ${costoTrasf.toFixed(2)}
🛠️ ${lavoroTesto} (${ore}h): € ${costoIntervento.toFixed(2)}
${videoCombinata ? `🎥 Videoispezione in combinata (${ore}h): € ${(ore * TARIFFE.videoCombinata).toFixed(2)}` : ""}
${videoFinale ? `🎥 Videoispezione finale: € ${TARIFFE.videoFinale.toFixed(2)}` : ""}
${costoUrgenza > 0 ? `${urgenzaTesto}: € ${costoUrgenza.toFixed(2)}` : ""}

💰 Totale complessivo stimato (netto): € ${totaleNetto.toFixed(2)}
➕ IVA 22%: € ${(totaleNetto * IVA).toFixed(2)}
💵 Totale IVA inclusa: € ${totaleLordo.toFixed(2)}

⏱ Possiamo intervenire entro 48h salvo disponibilità. 🚀
---
⚠️ IMPORTANTE:
Il costo totale dell’intervento può variare in base a:
- Lunghezza della tubazione
- Complessità dell’intervento (curve a 90°, braghe, ecc.)
- Tenacia/durezza dell’ostruzione (calcare, radici, grassi calcificati)

Con questa tabella puoi farti un’idea del costo del tuo intervento…

💡 Ma ricorda: ogni intervento è unico!
  `;

    const messaggioDiv = document.getElementById("messaggioCliente");
    messaggioDiv.style.display = "block";
    messaggioDiv.textContent = messaggio;
});
