// Prendi gli elementi
const checkKm = document.getElementById("checkKm");
const checkMinuti = document.getElementById("checkMinuti");
const inputKmDiv = document.getElementById("inputKm");
const inputMinutiDiv = document.getElementById("inputMinuti");
const resetBtn = document.getElementById("resetBtn");
const form = document.getElementById("preventivoForm");
const risultatoDiv = document.getElementById("risultato");
const messaggioDiv = document.getElementById("messaggioCliente");

// Safety check
if (!checkKm || !checkMinuti || !inputKmDiv || !inputMinutiDiv) {
    console.warn("Controlla che gli elementi #checkKm, #checkMinuti, #inputKm, #inputMinuti esistano e non siano duplicati.");
}

// Toggle animazione
checkKm.addEventListener("change", function () {
    inputKmDiv.classList.toggle("show", this.checked);
    inputKmDiv.setAttribute("aria-hidden", (!this.checked).toString());
});

checkMinuti.addEventListener("change", function () {
    inputMinutiDiv.classList.toggle("show", this.checked);
    inputMinutiDiv.setAttribute("aria-hidden", (!this.checked).toString());
});

// --- Pulsante copia messaggio ---
const copiaBtn = document.createElement("button");
copiaBtn.id = "copiaBtn";
copiaBtn.textContent = "📋 Copia messaggio";
copiaBtn.style.display = "none"; // inizialmente nascosto
document.getElementById("messaggioCliente").insertAdjacentElement("afterend", copiaBtn);

const feedback = document.createElement("div");
feedback.id = "copyFeedback";
feedback.textContent = "✅ Copiato!";
feedback.style.display = "none";
feedback.style.color = "green";
feedback.style.fontWeight = "bold";
feedback.style.marginTop = "5px";
document.getElementById("messaggioCliente").insertAdjacentElement("afterend", feedback);

copiaBtn.addEventListener("click", function () {
    const messaggio = document.getElementById("messaggioCliente").textContent;
    navigator.clipboard.writeText(messaggio).then(() => {
        feedback.style.display = "block";
        setTimeout(() => {
            feedback.style.display = "none";
        }, 2000);
    });
});

// Submit form
form.addEventListener("submit", function (e) {
    e.preventDefault();

    // === Input principali ===
    const clienteNome = document.getElementById("clienteNome").value.trim();
    const ore = parseFloat(document.getElementById("ore").value) || 0;
    const interventoNome = document.getElementById("interventoNome").value.trim();
    const interventoCosto = parseFloat(document.getElementById("interventoCosto").value) || 0;
    const videoCombinata = document.getElementById("videoCombinata")?.checked || false;
    const videoFinale = document.getElementById("videoFinale")?.checked || false;
    const comuneSelect = document.getElementById("comune");
    const comuneTesto = comuneSelect?.options[comuneSelect.selectedIndex]?.text || "";

    const urgenzaSelezionata = document.querySelector("input[name='urgenza']:checked")?.value || "";

    // Tariffe
    const IVA = 0.22;
    const TARIFFE = {
        videoCombinata: 49.18,
        videoFinale: 24.59,
        urgenze: {
            feriale: 69.67,
            sabato: 122.95,
            festivo: 204.92
        }
    };

    // Calcolo
    let totaleNetto = 0;
    let dettagli = [];

    // Intervento manuale
    let costoIntervento = ore * interventoCosto;
    totaleNetto += costoIntervento;
    if (interventoNome) dettagli.push(`🛠️ ${interventoNome} (${ore}h): € ${costoIntervento.toFixed(2)}`);

    // Maggiorazioni
    let costoTrasf = 0;
    if (checkKm && checkKm.checked) {
        const km = parseFloat(document.getElementById("km").value) || 0;
        const costoKm = km * 1;
        costoTrasf += costoKm;
        dettagli.push(`🚐 Trasferta (${km} km A/R): € ${costoKm.toFixed(2)}`);
    }
    if (checkMinuti && checkMinuti.checked) {
        const minuti = parseFloat(document.getElementById("trasferimento").value) || 0;
        const costoMin = minuti * 1;
        costoTrasf += costoMin;
        dettagli.push(`🚐 Trasferimento (${minuti} min A/R): € ${costoMin.toFixed(2)}`);
    }
    totaleNetto += costoTrasf;

    // Videoispezioni
    if (videoCombinata) {
        let costoVideoComb = ore * TARIFFE.videoCombinata;
        totaleNetto += costoVideoComb;
        dettagli.push(`🎥 Videoispezione in combinata (${ore}h): € ${costoVideoComb.toFixed(2)}`);
    }
    if (videoFinale) {
        totaleNetto += TARIFFE.videoFinale;
        dettagli.push(`🎥 Videoispezione finale: € ${TARIFFE.videoFinale.toFixed(2)}`);
    }

    // Urgenza
    if (urgenzaSelezionata && TARIFFE.urgenze[urgenzaSelezionata]) {
        let costoUrgenza = TARIFFE.urgenze[urgenzaSelezionata];
        totaleNetto += costoUrgenza;
        let labelUrgenza = urgenzaSelezionata.charAt(0).toUpperCase() + urgenzaSelezionata.slice(1);
        dettagli.push(`⚡ Urgenza ${labelUrgenza}: € ${costoUrgenza.toFixed(2)}`);
    }

    // Totali
    let totaleLordo = totaleNetto * (1 + IVA);

    // Output
    risultatoDiv.innerHTML = `
        <p>Totale netto (IVA escl.): <strong>€ ${totaleNetto.toFixed(2)}</strong></p>
        <p>Totale lordo (IVA incl. 22%): <strong>€ ${totaleLordo.toFixed(2)}</strong></p>
    `;

    // Messaggio cliente
    let messaggio = `
Buongiorno ${clienteNome ? clienteNome : ""},

📍 Invio il preventivo per l’intervento richiesto presso:
${comuneTesto}

📑 Dettaglio dei costi:
${dettagli.join("\n")}

💰 Totale complessivo stimato (netto): € ${totaleNetto.toFixed(2)}
➕ IVA 22%: € ${(totaleNetto * IVA).toFixed(2)}
💵 Totale IVA inclusa: € ${totaleLordo.toFixed(2)}

⏱ Possiamo intervenire entro 48h salvo disponibilità. 🚀
---
⚠️ IMPORTANTE:
Il costo totale dell’intervento può variare in base a complessità, lunghezza tubazioni e tenacia dell’ostruzione.
    `;

    messaggioDiv.style.display = "block";
    messaggioDiv.textContent = messaggio;

    // fai comparire i pulsanti
    copiaBtn.style.display = "inline-block";
    resetBtn.style.display = "inline-block";
});

// Reset form
resetBtn.addEventListener("click", function () {
    form.reset();

    // Nascondi campi animati
    inputKmDiv.classList.remove("show");
    inputKmDiv.setAttribute("aria-hidden", "true");
    inputMinutiDiv.classList.remove("show");
    inputMinutiDiv.setAttribute("aria-hidden", "true");

    // Reset output
    risultatoDiv.innerHTML = "Inserisci i dati e calcola il preventivo.";
    messaggioDiv.style.display = "none";
    messaggioDiv.textContent = "";

    // Nascondi pulsanti extra
    resetBtn.style.display = "none";
    copiaBtn.style.display = "none";
    feedback.style.display = "none";

    // Focus di nuovo sul campo Nome Cliente
    document.getElementById("clienteNome").focus();
});
