/* CheckInPage — Check-in Harian Pelajar (MahaSehat). Vanilla JS, tanpa dependensi. */
(function () {
  "use strict";

  const MOODS = [
    { v: 1, icon: "😞", label: "Berat", desc: "Sangat tidak nyaman" },
    { v: 2, icon: "🙁", label: "Kurang", desc: "Cukup berat" },
    { v: 3, icon: "😐", label: "Biasa", desc: "Netral" },
    { v: 4, icon: "🙂", label: "Baik", desc: "Cukup nyaman" },
    { v: 5, icon: "😄", label: "Sangat baik", desc: "Tenang dan energik" }
  ];
  const MEALS = [
    { id: "teratur", label: "Teratur", desc: "3 kali sehari, bergizi" },
    { id: "kurang", label: "Kurang teratur", desc: "Melewatkan satu waktu makan" },
    { id: "tidak", label: "Tidak teratur", desc: "Sulit makan karena jadwal" }
  ];
  const TRIGGERS = [
    { id: "Akademik", desc: "Tugas, ujian, atau tenggat" },
    { id: "Keluarga", desc: "Hubungan atau kondisi di rumah" },
    { id: "Sosial", desc: "Pertemanan atau lingkungan" },
    { id: "Tidak ada", desc: "Hari ini terasa ringan" }
  ];
  const TOTAL = 6, MAX_NOTE = 500;

  const state = {
    step: 0, // 0 sapaan, 1-6 wizard, 7 sukses
    returnToSummary: false,
    mood: null, bed: "22:30", wake: "06:00",
    meal: null, triggers: [], note: "",
    saving: false, error: ""
  };
  let cfg = {}, app;

  /* ---------- util ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const greeting = () => {
    const h = new Date().getHours();
    return h < 11 ? "Selamat Pagi" : h < 15 ? "Selamat Siang" : h < 18 ? "Selamat Sore" : "Selamat Malam";
  };
  const sleepHours = (a, b) => {
    const [h1, m1] = a.split(":").map(Number), [h2, m2] = b.split(":").map(Number);
    let d = h2 * 60 + m2 - (h1 * 60 + m1);
    if (d <= 0) d += 1440;
    return d / 60;
  };
  const fmtHours = (h) => String(Math.round(h * 10) / 10).replace(".", ",") + " jam";

  // Enkripsi catatan di browser (AES-GCM). Di produksi, kelola kunci di server / key wrapping.
  async function encryptNote(text) {
    if (!text.trim()) return null;
    if (!window.crypto || !crypto.subtle) throw new Error("Web Crypto tidak tersedia (butuh HTTPS atau localhost).");
    const b64 = (u8) => btoa(String.fromCharCode(...u8));
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const buf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(text));
    const raw = new Uint8Array(await crypto.subtle.exportKey("raw", key));
    return { cipher: b64(new Uint8Array(buf)), iv: b64(iv), key: b64(raw) };
  }

  /* ---------- template ---------- */
  const head = (title, sub) => `
    <div class="progress-track" role="progressbar" aria-valuemin="1" aria-valuemax="${TOTAL}" aria-valuenow="${state.step}">
      <span class="progress-fill" style="width:${(state.step / TOTAL) * 100}%"></span>
    </div>
    <p class="step-label">Langkah ${state.step} dari ${TOTAL}</p>
    <h1 class="page-title" tabindex="-1">${title}</h1>
    <p class="page-subtitle">${sub}</p>`;

  const option = ({ selected, action, value, title, desc, lead, role }) => `
    <button type="button" role="${role}" aria-checked="${selected}" class="option-card${selected ? " is-selected" : ""}" data-action="${action}" data-value="${esc(value)}">
      ${lead ? `<span class="option-icon" aria-hidden="true">${lead}</span>` : ""}
      <span><strong>${title}</strong><small>${desc}</small></span>
    </button>`;

  const nav = ({ label = "Lanjut", action = "next", disabled = false, skip = false } = {}) => `
    <div class="form-actions">
      <button class="btn-amber" type="button" data-action="${action}" ${disabled ? "disabled" : ""}>${label}</button>
      ${skip ? `<button class="btn-detail" type="button" data-action="skip">Lewati</button>` : ""}
      <button class="btn-detail" type="button" data-action="back">Kembali</button>
    </div>`;

  const views = {
    0: () => `
      <section class="card intro-card">
        <span class="intro-icon" aria-hidden="true">×</span>
        <h1 class="page-title" tabindex="-1">${greeting()}, ${esc(cfg.name)}.</h1>
        <p class="page-subtitle">Hari ini kamu belum mengisi daily check-in. Yuk, luangkan 5 menitmu untuk merefleksikan kesehatan mentalmu hari ini.</p>
        <button class="btn-amber" type="button" data-action="start">Mulai check-in</button>
      </section>`,

    1: () => head("Bagaimana perasaanmu hari ini?", "Pilih yang paling mendekati keadaanmu.") +
      `<div class="option-list" role="radiogroup" aria-label="Mood">` +
      MOODS.map((m) => option({ selected: state.mood === m.v, action: "mood", value: m.v, title: m.label, desc: m.desc, lead: m.icon, role: "radio" })).join("") +
      `</div>` + nav({ disabled: state.mood === null }),

    2: () => head("Bagaimana tidurmu semalam?", "Isi jam tidur dan jam bangun.") + `
      <div class="time-grid">
        <label>Jam tidur<input type="time" id="bed" value="${state.bed}"></label>
        <label>Jam bangun<input type="time" id="wake" value="${state.wake}"></label>
      </div>
      <p class="form-hint" id="duration">Durasi tidur: ${fmtHours(sleepHours(state.bed, state.wake))}.</p>` +
      nav({ disabled: !state.bed || !state.wake }),

    3: () => head("Bagaimana pola makanmu hari ini?", "Pilih yang paling mendekati.") +
      `<div class="option-list" role="radiogroup" aria-label="Pola makan">` +
      MEALS.map((m) => option({ selected: state.meal === m.id, action: "meal", value: m.id, title: m.label, desc: m.desc, role: "radio" })).join("") +
      `</div>` + nav({ disabled: state.meal === null }),

    4: () => head("Apa pemicu stresmu hari ini?", "Boleh pilih lebih dari satu.") +
      `<div class="option-list" role="group" aria-label="Pemicu stres">` +
      TRIGGERS.map((t) => option({ selected: state.triggers.includes(t.id), action: "trigger", value: t.id, title: t.id, desc: t.desc, role: "checkbox" })).join("") +
      `</div>` + nav({ disabled: state.triggers.length === 0 }),

    5: () => head("Ada yang ingin kamu catat?", "Opsional. Hanya terlihat olehmu.") + `
      <textarea class="note-field" id="note" rows="7" maxlength="${MAX_NOTE}" aria-label="Catatan refleksi"
        placeholder="Apa yang paling terasa hari ini?">${esc(state.note)}</textarea>
      <p class="form-hint">Catatan ini dienkripsi. <span class="char-count" id="count">${state.note.length} / ${MAX_NOTE}</span></p>` +
      nav({ skip: true }),

    6: () => {
      const mood = MOODS.find((m) => m.v === state.mood), meal = MEALS.find((m) => m.id === state.meal);
      const rows = [
        ["Mood", mood ? `${mood.v} / 5 - ${mood.label}` : "-", 1],
        ["Tidur", `${state.bed} - ${state.wake} (${fmtHours(sleepHours(state.bed, state.wake))})`, 2],
        ["Pola makan", meal ? meal.label : "-", 3],
        ["Pemicu stres", state.triggers.join(", ") || "-", 4],
        ["Refleksi", state.note.trim() || "Tidak ada catatan", 5]
      ];
      return head("Cek lagi sebelum simpan.", "Kamu bisa mengubah bagian mana pun.") + `
        <dl class="card summary-card">
          <h2>Ringkasan check-in</h2>
          ${rows.map(([k, v, s]) => `
            <div class="summary-row">
              <div><dt>${k}</dt><dd>${esc(v)}</dd></div>
              <button class="btn-detail" type="button" data-action="edit" data-value="${s}" aria-label="Ubah ${k}">Ubah</button>
            </div>`).join("")}
        </dl>
        ${state.error ? `<p class="form-error" role="alert">${esc(state.error)}</p>` : ""}
        <div class="form-actions">
          <button class="btn-amber" type="button" data-action="save" ${state.saving ? "disabled" : ""}>${state.saving ? "Menyimpan…" : "Simpan check-in"}</button>
          <button class="btn-detail" type="button" data-action="back-summary">Kembali</button>
        </div>
        <p class="form-hint">Catatan refleksi dienkripsi dan hanya terlihat olehmu.</p>`;
    },

    7: () => `
      <section class="card success-card">
        <span class="success-icon" aria-hidden="true">✓</span>
        <h1 class="page-title page-title-sm" tabindex="-1">Check-in tersimpan.</h1>
        <p class="page-subtitle">Terima kasih sudah meluangkan waktu untuk dirimu hari ini! Catatanmu sudah aman. Sampai jumpa besok.</p>
        <button class="btn-amber" type="button" data-action="done">Kembali ke dashboard</button>
      </section>`
  };

  /* ---------- render & aksi ---------- */
  function render(focusTitle = true) {
    app.innerHTML = views[state.step]();
    document.getElementById("btn-close").hidden = state.step === 7;
    if (focusTitle) { const t = app.querySelector(".page-title"); if (t) t.focus({ preventScroll: true }); }
    window.scrollTo({ top: 0 });
  }
  const go = (s) => { state.step = s; render(); };
  const advance = () => go(state.returnToSummary ? 6 : state.step + 1);

  async function save() {
    state.saving = true; state.error = ""; render(false);
    try {
      const note = await encryptNote(state.note);
      await (cfg.onSubmit && cfg.onSubmit({
        date: new Date().toISOString(),
        mood: state.mood,
        sleep: { bed: state.bed, wake: state.wake, hours: sleepHours(state.bed, state.wake) },
        meal: state.meal, triggers: state.triggers,
        note // { cipher, iv, key } atau null
      }));
      state.saving = false; go(7);
    } catch (e) {
      state.saving = false;
      state.error = "Check-in belum tersimpan. Periksa koneksimu lalu coba lagi.";
      render(false);
    }
  }

  const actions = {
    start: () => go(1),
    next: advance,
    back: () => go(state.returnToSummary ? 6 : state.step - 1),
    "back-summary": () => { state.returnToSummary = false; go(5); },
    skip: () => { state.note = ""; advance(); },
    edit: (v) => { state.returnToSummary = true; go(Number(v)); },
    mood: (v) => { state.mood = Number(v); render(false); },
    meal: (v) => { state.meal = v; render(false); },
    trigger: (v) => {
      const t = state.triggers;
      state.triggers = v === "Tidak ada" ? (t.includes(v) ? [] : [v])
        : t.includes(v) ? t.filter((x) => x !== v) : t.filter((x) => x !== "Tidak ada").concat(v);
      render(false);
    },
    save,
    done: () => cfg.onDone && cfg.onDone()
  };

  function init(options) {
    cfg = Object.assign({ name: "Teman" }, options);
    app = document.getElementById("checkin-content");
    document.getElementById("btn-close").addEventListener("click", () => cfg.onClose && cfg.onClose());

    app.addEventListener("click", (e) => {
      const el = e.target.closest("[data-action]");
      if (el && !el.disabled && actions[el.dataset.action]) actions[el.dataset.action](el.dataset.value);
    });
    app.addEventListener("input", (e) => {
      if (e.target.id === "bed" || e.target.id === "wake") {
        state[e.target.id] = e.target.value;
        document.getElementById("duration").textContent =
          state.bed && state.wake ? `Durasi tidur: ${fmtHours(sleepHours(state.bed, state.wake))}.` : "";
        app.querySelector('[data-action="next"]').disabled = !state.bed || !state.wake;
      } else if (e.target.id === "note") {
        state.note = e.target.value;
        document.getElementById("count").textContent = `${state.note.length} / ${MAX_NOTE}`;
      }
    });
    render();
  }

  window.CheckInPage = { init };
})();