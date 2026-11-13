/* Client offline, Antrean di localStorage, status SOS di sessionStorage. */
/* queue di local storage, status sos di sessions*/


const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
const Q_KEY = "safeshe_queue", POS_KEY = "safeshe_lastpos", SVC_KEY = "safeshe_svc_", SOS_KEY = "safeshe_sos";
const DEFAULT_POS = { lat: -6.8915, lon: 107.6107 };
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(16).slice(2));
const jget = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const jset = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const getSos = () => { try { return JSON.parse(sessionStorage.getItem(SOS_KEY)) || {}; } catch { return {}; } };
const setSos = (p) => { try { sessionStorage.setItem(SOS_KEY, JSON.stringify({ ...getSos(), ...p })); } catch {} };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const I = (n) => `<svg class="ic"><use href="icons.svg#i-${n}"/></svg>`;
const fmt = (iso) => { try { return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }); } catch { return ""; } };
const JENIS = {
  rumah_sakit: { l: "Rumah sakit", i: "cross", d: "Layanan kesehatan dan pemeriksaan medis" },
  konseling: { l: "Konseling", i: "heart", d: "Pendampingan psikologis dan konseling krisis" },
  shelter: { l: "Shelter", i: "home", d: "Tempat tinggal sementara yang aman" },
  polisi: { l: "Polisi", i: "shield", d: "Penerimaan laporan dan perlindungan" },
};
function toast(t) { const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => (el.hidden = true), 2200); }

/*  navigasion  */
const NAVMAP = { home: "home", respons: "home", lapor: "lapor", konfirmasi: "lapor", cek: "lapor", peta: "peta", detail: "peta", panduan: "panduan", status: "status" };
let current = "home";
function go(v) {
  current = v;
  document.body.classList.toggle("disguise", v === "status");
  document.title = v === "status" ? "Catatan" : "SafeShe";
  $$(".view").forEach((x) => (x.hidden = x.id !== "v-" + v));
  $$(".nav button").forEach((b) => (NAVMAP[v] === b.dataset.go ? b.setAttribute("aria-current", "page") : b.removeAttribute("aria-current")));
  window.scrollTo(0, 0);
  if (v === "peta") loadLayanan();
  if (v === "respons") renderRespons();
  if (v === "status") { renderStatus(); maybeStatusHint(); } else closeHint();
  if (v === "konfirmasi") renderKonf();
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-go]"); if (b) { closeSheet(); go(b.dataset.go); }
  const k = e.target.closest("[data-cek]"); if (k) { closeSheet(); go("cek"); $("#cekCode").value = k.dataset.cek || ""; $("#cekRes").innerHTML = ""; if (k.dataset.cek) $("#cekForm").requestSubmit(); }
  const o = e.target.closest("[data-open]"); if (o) openDetail(o.dataset.open);
  const c = e.target.closest("[data-copy]"); if (c) copyText(c.dataset.copy);
});
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); toast("Tersalin"); }
  catch { const a = document.createElement("textarea"); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand("copy"); toast("Tersalin"); } catch { toast("Tidak dapat menyalin"); } a.remove(); }
}
$("#quickExit").addEventListener("click", () => { try { sessionStorage.clear(); } catch {} location.replace("https://www.bmkg.go.id"); });

/* connection,  queue offline */
const queue = () => jget(Q_KEY, []);
const saveQ = (q) => jset(Q_KEY, q);
function enqueue(type, payload) { const q = queue(); const it = { type, payload }; q.push(it); saveQ(q); updateNet(); return it; }
function updateNet() {
  const q = queue().length, off = !navigator.onLine;
  $("#netChip").classList.toggle("warn", off || q > 0);
  $("#netText").textContent = off ? "Offline, antrean aktif" : q ? `${q} permintaan menunggu koneksi` : "Terlindungi dan terhubung";
}
let flushing = false;
async function flush() {
  if (flushing) return; flushing = true;
  try {
    for (const it of [...queue()]) {
      let res;
      try { res = await fetch(it.type === "sos" ? "/api/sos" : "/api/laporan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(it.payload) }); }
      catch { break; }
      if (res.ok) {
        const data = await res.json();
        if (it.type === "sos") onSosSent(data.sos_id);
        else onLaporanSent(it.payload.client_id, data.token);
      } else if (res.status >= 500 || res.status === 429) break;
      saveQ(queue().filter((x) => x.payload.client_id !== it.payload.client_id));
    }
    updateNet(); await uploadPending();
  } finally { flushing = false; }
}
window.addEventListener("online", () => { updateNet(); flush(); });
window.addEventListener("offline", updateNet);
setInterval(flush, 15000);

/* func location   */
function getPos(timeout = 6000) {
  return new Promise((res) => {
    if (!navigator.geolocation) return res(jget(POS_KEY, null));
    navigator.geolocation.getCurrentPosition(
      (p) => { const v = { lat: p.coords.latitude, lon: p.coords.longitude }; jset(POS_KEY, v); res(v); },
      () => res(jget(POS_KEY, null)), { enableHighAccuracy: true, timeout, maximumAge: 60000 });
  });
}

/* hold SOS button    */
const HOLD = 1500, RING = 1194;
const sosBtn = $("#sosBtn"), ring = $("#ringFill");
let holdAt = 0, raf = 0, lastSend = 0;
function holdStart() { if (holdAt) return; holdAt = performance.now(); tick(); }
function tick() {
  const p = Math.min((performance.now() - holdAt) / HOLD, 1);
  ring.style.strokeDashoffset = RING * (1 - p);
  if (p >= 1) {holdAt = 0; ring.style.strokeDashoffset = RING; if (navigator.vibrate) navigator.vibrate(60); triggerSos(); return; }
  raf = requestAnimationFrame(tick);
}
function holdEnd() {
  cancelAnimationFrame(raf);
  if (holdAt && performance.now() - holdAt < 400) {
    $("#cueT").innerHTML = I("lock") + "Tahan sedikit lebih lama";
    clearTimeout(holdEnd.t); holdEnd.t = setTimeout(() => ($("#cueT").innerHTML = I("lock") + "Tahan tombol untuk mengirim"), 2000);
  }
  holdAt = 0; ring.style.strokeDashoffset = RING;
}
["pointerup", "pointercancel", "pointerleave"].forEach((ev) => sosBtn.addEventListener(ev, holdEnd));
sosBtn.addEventListener("pointerdown", (e) => { e.preventDefault(); holdStart(); });
sosBtn.addEventListener("contextmenu", (e) => e.preventDefault());
sosBtn.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && !e.repeat) { e.preventDefault(); holdStart(); } });
sosBtn.addEventListener("keyup", (e) => { if (e.key === "Enter" || e.key === " ") holdEnd(); });

async function triggerSos() {
  if (Date.now() - lastSend < 10000) { toast("SOS sudah dikirim. Petugas sedang diberi tahu."); showSheet(getSos().id ? "sent" : "queued"); return; }
  lastSend = Date.now();
  showSheet("sending");
  const pos = await getPos();
  if (!pos) { lastSend = 0; showSheet("nopos"); return; }
  enqueue("sos", { client_id: uid(), lat: pos.lat, lon: pos.lon, nama: null });
  setSos({ pending: true, id: null, status: "dikirim", pesan: "", reply: null, created_at: new Date().toISOString() });
  renderBanner(); startRecording();
  await flush();
  if (sheetState === "sending") showSheet(getSos().id ? "sent" : "queued");
}
function onSosSent(id) {
  setSos({ pending: true, id, status: "dikirim" });
  uploadPending(); pollStatus(); renderBanner();
  if (sheetState === "queued" || sheetState === "sending") showSheet("sent");
}

/* status SOS */
let sheetState = null;
const SHEET = {
  sending: ["run", "shield", "Mengirim…", "Sedang mengirim lokasi Anda dan memanggil petugas.", "lock", "Data Anda terenkripsi"],
  sent: ["ok", "check", "SOS terkirim", "Petugas telah menerima permintaan Anda. Tetap tenang dan cari tempat yang aman.", "mic", "Rekaman suara sekitar berjalan"],
  queued: ["wait", "wifioff", "Menunggu koneksi", "Tidak ada sinyal. SOS tersimpan di perangkat dan dikirim otomatis begitu terhubung.", "lock", "Jangan tutup halaman ini"],
  nopos: ["wait", "alert", "Lokasi belum tersedia", "Aktifkan GPS lalu tahan tombol SOS lagi. Jika darurat, hubungi 112.", "info", "Belum ada yang terkirim"],
};
function showSheet(state) {
  sheetState = state; const [cls, ic, t, p, ci, ct] = SHEET[state];
  $("#sheetBody").innerHTML = `<div class="spin ${cls}">${I(ic)}</div><h2 id="sheetT">${t}</h2><p>${p}</p>
    <div class="assure" id="sheetAssure">${I(ci)}${ct}</div>
    ${state === "nopos" ? '<a class="btn" href="tel:112" style="margin-bottom:8px">Telepon 112</a>' : state !== "sending" ? '<button class="btn alt" data-go="respons" style="margin-bottom:8px">Lihat status</button>' : ""}
    ${state === "sent" || state === "queued" ? '<button class="btn alt" id="sheetStopRec" style="margin-bottom:8px" hidden>' + I("mic") + 'Hentikan rekaman suara</button>' : ""}
    <button class="btn ghost" id="sheetClose">Tutup</button>
    <div class="hint">${I("exit")}Keluar cepat: tombol Keluar di kanan atas</div>`;
  $("#scrim").hidden = false; $("#sheetClose").focus();
  $("#sheetClose").addEventListener("click", closeSheet);
  $("#sheetStopRec")?.addEventListener("click", stopRecording);
  syncRecUi();
}
function closeSheet() { $("#scrim").hidden = true; sheetState = null; sosBtn.focus({ preventScroll: true }); }
$("#scrim").addEventListener("click", (e) => { if (e.target.id === "scrim") closeSheet(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#scrim").hidden) closeSheet(); });

/* status, balasan petugas- */
let pollT = null;
function pollStatus() {
  clearInterval(pollT);
  const run = async () => {
    const s = getSos(); if (!s.id) return;
    try {
      const r = await fetch(`/api/sos/${s.id}/status`);
      if (r.ok) { const d = await r.json(); setSos({ status: d.status, pesan: d.pesan, reply: d.reply, created_at: d.created_at }); renderBanner(); if (current === "respons") renderRespons(); if (current === "status") renderStatus(); }
    } catch {}
  };
  run(); pollStatus.run = run; pollT = setInterval(run, 5000);
}
function renderBanner() {
  const s = getSos(), el = $("#bannerS"); let t = "Lihat status dan balasan SOS";
  if (s.id) t = s.status === "dalam_perjalanan" ? "Bantuan menuju lokasi" : s.status === "diterima" ? "Petugas menerima SOS" : "SOS terkirim";
  else if (s.pending) t = "Menunggu koneksi…";
  el.classList.toggle("ok", !!s.id); el.querySelector("span").textContent = t;
}
function stage(done, title, sub) { return `<div class="stage ${done ? "done" : ""}"><span class="m">${done ? I("check") : "<i></i>"}</span><div><b>${title}</b><small>${sub}</small></div></div>`; }
function renderRespons() {
  const s = getSos(), b = $("#resBody");
  if (!s.pending && !s.id) { b.innerHTML = `<div class="center" style="padding-top:48px"><div class="spin">${I("msg")}</div><h2>Belum ada permintaan</h2><p>Tahan tombol SOS di beranda jika Anda membutuhkan bantuan.</p></div><button class="btn alt" data-go="home">Kembali ke beranda</button>`; return; }
  const sent = !!s.id, acc = s.status === "diterima" || s.status === "dalam_perjalanan", way = s.status === "dalam_perjalanan";
  const head = !sent ? ["wifioff", "wait", "Menunggu koneksi", "SOS menunggu koneksi", "SOS tersimpan di perangkat dan akan dikirim otomatis begitu terhubung."]
    : way ? ["shieldok", "", "Bantuan menuju lokasi", "Bantuan menuju lokasi", "Petugas sedang menuju lokasi Anda. Tetap di tempat aman jika bisa."]
    : acc ? ["shieldok", "", "Diterima petugas", "SOS diterima petugas", "Petugas sudah menerima sinyal Anda dan sedang menanganinya."]
    : ["send", "", "SOS terkirim", "SOS terkirim", "Sinyal Anda sudah sampai. Menunggu petugas menanggapi."];
  b.innerHTML = `<div class="row" style="padding-top:8px"><button class="mut row" style="gap:4px;min-height:48px;font-size:15px;font-weight:500" data-go="home">${I("back")}Beranda</button></div>
    <div class="center" style="display:flex;flex-direction:column;align-items:center;gap:12px"><div class="spin ${head[1]}" style="margin:0">${I(head[0])}</div>
      <span class="chip ${sent ? "" : "warn"}" style="background:var(--chip)">${head[2]}</span><h2 style="font-size:26px;line-height:31px;font-weight:400">${head[3]}</h2><p style="margin:0">${head[4]}</p></div>
    ${s.reply ? `<div class="reply"><div class="row" style="justify-content:flex-start;gap:10px"><span class="circ">${I("shield")}</span><div><b style="font-size:14px">Petugas SafeShe</b><div class="t11" style="font-weight:400">Balasan polisi</div></div></div><p>${esc(s.reply)}</p></div>` : ""}
    <div style="display:flex;flex-direction:column;gap:16px"><span class="t15" style="font-size:14px">Perkembangan SOS</span>
      ${stage(sent, "SOS dikirim", sent ? fmt(s.created_at) : "Menunggu koneksi")}
      ${stage(acc, "Diterima petugas", acc ? "Sudah diterima" : "Menunggu")}
      ${stage(way, "Bantuan menuju lokasi", way ? "Dalam perjalanan" : "Menunggu")}</div>
    <div class="sil">${I("mute")}<span>Balasan tidak berbunyi. Tab <b>Status</b> menampilkan kabar yang sama dalam tampilan menyerupai catatan.</span></div>
    ${sent ? `<button class="btn alt" id="reload">${I("refresh")}Muat ulang status</button>` : `<button class="btn" id="retry">${I("refresh")}Coba kirim ulang</button>`}`;
  $("#reload")?.addEventListener("click", () => { pollStatus.run?.(); toast("Memuat…"); });
  $("#retry")?.addEventListener("click", () => { flush(); toast("Mencoba mengirim…"); });
}
function dblTap(el, fn) { let t = 0; el.addEventListener("click", () => { const n = Date.now(); if (n - t < 600) { t = 0; fn(); } else t = n; }); }
dblTap($("#stealth"), () => go("home"));          
dblTap($(".nhead h1"), () => go("home"));  
const HINT_KEY = "safeshe_hint_status";
const hintSeen = () => { try { return !!localStorage.getItem(HINT_KEY); } catch { return false; } };
function maybeStatusHint() { if (hintSeen()) return; $("#hint").hidden = false; $("#stealth").classList.add("pulse"); }
function closeHint() { $("#hint").hidden = true; $("#stealth").classList.remove("pulse"); }
$("#hintOk").addEventListener("click", () => { try { localStorage.setItem(HINT_KEY, "1"); } catch {} closeHint(); });
$("#replayHint").addEventListener("click", () => { try { localStorage.removeItem(HINT_KEY); } catch {} go("status"); });
const NOTES_KEY = "safeshe_notes";
const myNotes = () => jget(NOTES_KEY, []), saveNotes = (n) => jset(NOTES_KEY, n);
let nTag = "", nQuery = "", editingId = null;
const DECOYS = [
  { title: "Soto ayam", text: "Bahan: dada ayam 500 gr, serai 2 batang, daun jeruk 4 lembar, kunyit bakar.", tag: "Resep", when: "Kemarin" },
  { title: "Jadwal kursus", text: "Setiap Selasa jam 19.00 via panggilan grup. Materi komunikasi kerja.", tag: "Jadwal", when: "Sen" },
  { title: "Belanja mingguan", text: "Minyak goreng 2 liter, sabun cuci, beras 5 kg, telur 1 papan, teh.", tag: "Belanja", when: "Min" },
];


const dayLabel = (iso) => { try { const d = new Date(iso), n = new Date(); return d.toDateString() === n.toDateString() ? fmt(iso) : d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }); } catch { return ""; } };
function renderStatus() {
  const s = getSos();
  const st = !s.id && !s.pending
    ? { text: "Belum ada pembaruan.", when: "", sync: "Belum ada", wait: false }
    : { text: s.pesan || "Pesanan Anda sedang diproses.", when: s.created_at ? fmt(s.created_at) : "", sync: s.id ? "Tersinkron" : "Menunggu koneksi", wait: !s.id };
  const all = [{ kind: "status", title: "Daftar belanja bulanan", tag: "Belanja", ...st },
    ...myNotes().map((n) => ({ kind: "mine", id: n.id, title: n.title, text: n.text, tag: n.tag, when: dayLabel(n.at) })),
    ...DECOYS.map((d) => ({ kind: "decoy", ...d }))];
  const q = nQuery.trim().toLowerCase();
  const list = all.filter((n) => (!nTag || n.tag === nTag) && (!q || (n.title + " " + n.text).toLowerCase().includes(q)));
  $("#ncount").textContent = `${all.length} catatan`;
  $("#notes").innerHTML = list.length ? list.map((n) => `<div class="note-i" ${n.kind === "mine" ? `data-id="${esc(n.id)}" role="button" tabindex="0" aria-label="Buka catatan ${esc(n.title)}"` : ""}>
      <div class="t"><h3>${esc(n.title || "Tanpa judul")}</h3><small>${esc(n.when)}</small></div><p>${esc(n.text)}</p>
      ${n.kind === "status" ? `<div class="sync ${n.wait ? "w" : ""}"><i></i>${n.sync}</div>` : `<div><span class="tg">${esc(n.tag)}</span></div>`}</div>`).join("")
    : '<p class="mut" style="padding:8px 4px">Tidak ada catatan yang cocok.</p>';
}
$("#nchips").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; nTag = b.dataset.tag; $$("#nchips button").forEach((x) => x.setAttribute("aria-pressed", x === b)); renderStatus(); });
$("#nsearch").addEventListener("input", (e) => { nQuery = e.target.value; renderStatus(); });
function openEditor(id) {
  editingId = id || null; const n = id ? myNotes().find((x) => x.id === id) : null;
  $("#nT").textContent = n ? "Ubah catatan" : "Catatan baru";
  $("#nTitle").value = n?.title || ""; $("#nText").value = n?.text || ""; $("#nTag").value = n?.tag || (nTag || "Belanja");
  $("#nDel").hidden = !n; $("#nscrim").hidden = false; $("#nTitle").focus();
}


const closeEditor = () => { $("#nscrim").hidden = true; editingId = null; };
$("#newNote").addEventListener("click", () => openEditor());
$("#notes").addEventListener("click", (e) => { const c = e.target.closest("[data-id]"); if (c) openEditor(c.dataset.id); });
$("#notes").addEventListener("keydown", (e) => { const c = e.target.closest("[data-id]"); if (c && e.key === "Enter") openEditor(c.dataset.id); });
$("#nCancel").addEventListener("click", closeEditor);
$("#nscrim").addEventListener("click", (e) => { if (e.target.id === "nscrim") closeEditor(); });
$("#nSave").addEventListener("click", () => {
  const title = $("#nTitle").value.trim(), text = $("#nText").value.trim(), tag = $("#nTag").value;
  if (!title && !text) { toast("Catatan masih kosong"); return; }
  const list = myNotes();
  if (editingId) { const n = list.find((x) => x.id === editingId); if (n) Object.assign(n, { title, text, tag }); }
  else list.unshift({ id: uid(), title, text, tag, at: new Date().toISOString() });
  saveNotes(list); closeEditor(); renderStatus(); toast("Catatan disimpan");
});
$("#nDel").addEventListener("click", () => { saveNotes(myNotes().filter((x) => x.id !== editingId)); closeEditor(); renderStatus(); toast("Catatan dihapus"); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#nscrim").hidden) closeEditor(); });

/* voice recording */
let recording = false, recStopped = false, recStream = null, recRec = null; const blobs = [];
function syncRecUi() {
  const rs = $("#recStop"); if (rs) rs.hidden = !recording;
  const sb = $("#sheetStopRec"); if (sb) sb.hidden = !recording;
  const a = $("#sheetAssure");
  if (a && sheetState === "sent") a.innerHTML = recording ? I("mic") + "Rekaman suara sekitar berjalan" : I("lock") + "Rekaman suara tidak aktif";
}
function endRecording() {
  if (recStream) recStream.getTracks().forEach((t) => t.stop());
  recStream = null; recRec = null; recording = false; syncRecUi();
}
function stopRecording() {
  recStopped = true;
  if (recRec && recRec.state !== "inactive") recRec.stop(); else if (recording) endRecording();
  toast("Rekaman suara dihentikan");
}
async function startRecording() {
  if (recording || !navigator.mediaDevices || !window.MediaRecorder) return;
  recStopped = false;
  let stream; try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { return; }
  if (recStopped) { stream.getTracks().forEach((t) => t.stop()); return; }
  recStream = stream; recording = true; syncRecUi(); const stopAt = Date.now() + 5 * 60 * 1000;
  const seg = () => {
    const rec = new MediaRecorder(stream), ch = [];
    recRec = rec;
    rec.ondataavailable = (e) => e.data.size && ch.push(e.data);
    rec.onstop = () => { if (ch.length) { blobs.push(new Blob(ch, { type: rec.mimeType || "audio/webm" })); uploadPending(); } if (!recStopped && Date.now() < stopAt) seg(); else endRecording(); };
    rec.start(); setTimeout(() => rec.state !== "inactive" && rec.stop(), 15000);
  };
  seg();
}
async function uploadPending() {
  const id = getSos().id; if (!id) return;
  while (blobs.length) {
    const fd = new FormData(); fd.append("file", blobs[0], "rekaman.webm");
    try { const r = await fetch(`/api/sos/${id}/recording`, { method: "POST", body: fd }); if (!r.ok && r.status >= 500) return; } catch { return; }
    blobs.shift();
  }
}



/* layanan terdekat */
let map, markers = [], items = [], jenis = "", curPos = DEFAULT_POS, alertClosed = false, noGps = false, dmap;
$("#chips").addEventListener("click", (e) => { const b = e.target.closest(".fchip"); if (!b) return; jenis = b.dataset.j; $$(".fchip").forEach((x) => x.setAttribute("aria-pressed", x === b)); loadLayanan(); });
$("#refreshLoc").addEventListener("click", () => loadLayanan());
$("#locRetry").addEventListener("click", () => loadLayanan());
$("#locClose").addEventListener("click", () => { alertClosed = true; $("#locAlert").hidden = true; });
$("#recenter").addEventListener("click", () => map && map.setView([curPos.lat, curPos.lon], 14));
async function loadLayanan() {
  $("#mapErr").textContent = ""; $("#mapBadge").textContent = "Mencari…";
  let pos = await getPos(); noGps = !pos; if (noGps) pos = DEFAULT_POS;
  $("#locAlert").hidden = !noGps || alertClosed; curPos = pos;
  try {
    const q = new URLSearchParams({ lat: pos.lat, lon: pos.lon, radius_km: 15 }); if (jenis) q.set("jenis", jenis);
    const r = await fetch("/api/layanan/nearby?" + q); if (!r.ok) throw 0;
    items = (await r.json()).items; jset(SVC_KEY + jenis, items);
  } catch {
    items = jget(SVC_KEY + jenis, []);
    $("#mapErr").textContent = items.length ? "Tidak dapat terhubung. Menampilkan data terakhir." : "Layanan tidak dapat dimuat. Coba lagi saat terhubung.";
  }
  renderLayanan();
}
function renderLayanan() {
  $("#mapBadge").textContent = noGps ? "Lokasi perkiraan" : "Lokasi Anda aktif";
  $("#foundN").textContent = items.length ? `${items.length} ditemukan` : "";
  const f = items[0], feat = $("#feat");
  if (f) {
    const j = JENIS[f.jenis] || JENIS.polisi;
    feat.hidden = false;
    feat.innerHTML = `<div class="row" style="justify-content:flex-start;gap:8px;align-items:flex-start"><span class="tile">${I(j.i)}</span><div><h3>${esc(f.nama)} <span class="badge">Terdekat</span></h3><div class="mut">${j.l}</div></div></div>
      <div class="meta">${I("pin")}${f.jarak_km} km dari Anda</div>
      <div class="acts">${f.kontak ? `<a class="btn" href="tel:${esc(f.kontak)}">${I("phone")}Telepon</a>` : `<button class="btn" disabled>Kontak belum tersedia</button>`}<button class="btn sq" data-open="${f.id}" aria-label="Lihat detail ${esc(f.nama)}">${I("chev")}</button></div>`;
  } else feat.hidden = true;
  $("#plist").innerHTML = items.length ? items.slice(1).map((s) => { const j = JENIS[s.jenis] || JENIS.polisi;
    return `<button class="li" data-open="${s.id}"><span class="l"><span class="tile">${I(j.i)}</span><span><b>${esc(s.nama)}</b><span class="mut">${j.l}</span></span></span><small>${s.jarak_km} km</small></button>`; }).join("")
    : '<p class="mut">Tidak ada layanan dalam radius ini.</p>';
  drawMap();
}
function drawMap() {
  if (!window.L) { $("#map").innerHTML = '<p class="mut" style="padding:16px">Peta tidak dapat dimuat. Gunakan daftar di bawah.</p>'; return; }
  if (!map) { map = L.map("map", { zoomControl: false }); L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(map); }
  markers.forEach((m) => m.remove()); markers = [];
  const pin = (cls, ic, label) => L.divIcon({ className: "", iconSize: [0, 0], html: `<div class="pin ${cls}"><i>${ic}</i><span>${esc(label)}</span></div>` });
  markers.push(L.marker([curPos.lat, curPos.lon], { icon: pin("me", "", "Anda") }).addTo(map));
  items.forEach((s) => markers.push(L.marker([s.lat, s.lon], { icon: pin(s.jenis, I((JENIS[s.jenis] || JENIS.polisi).i), s.nama) }).addTo(map).on("click", () => openDetail(s.id))));
  const pts = [[curPos.lat, curPos.lon], ...items.slice(0, 6).map((s) => [s.lat, s.lon])];
  setTimeout(() => { map.invalidateSize(); pts.length > 1 ? map.fitBounds(pts, { padding: [50, 50], maxZoom: 15 }) : map.setView(pts[0], 14); }, 60);
}
async function openDetail(id) {
  go("detail"); const box = $("#dsheet"); box.innerHTML = '<div class="handle"></div><p class="mut">Memuat…</p>';
  try {
    const r = await fetch("/api/layanan/" + id); if (!r.ok) throw 0;
    renderDetail(await r.json());
  } catch { box.innerHTML = '<div class="handle"></div><div class="disabledbox"><b>Informasi layanan tidak lengkap.</b>Coba lagi atau pilih layanan lain.</div><button class="btn alt" data-go="peta">Kembali ke peta</button>'; }
}
function renderDetail(s) {
  const j = JENIS[s.jenis] || JENIS.polisi, it = items.find((x) => x.id === s.id), jarak = it ? it.jarak_km + " km" : "-";
  const dir = `https://www.openstreetmap.org/directions?from=${curPos.lat},${curPos.lon}&to=${s.lat},${s.lon}`;
  $("#dsheet").innerHTML = `<div class="handle"></div>
    <div class="tags"><span class="tag">${I(j.i)}${j.l}</span><span class="tag d">${I("pin")}${jarak}</span></div>
    <div><h2>${esc(s.nama)}</h2><p class="mut" style="margin:4px 0 0">${j.d}</p></div>
    <div class="metrics"><div>${I("pin")}<b>${jarak}</b><span>Jarak</span></div><div>${I("phone")}<b>${s.kontak_tersedia ? "Tersedia" : "Belum ada"}</b><span>Kontak</span></div><div>${I("lock")}<b>Rahasia</b><span>Privasi</span></div></div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <div class="info"><span class="tile">${I("pin")}</span><div><small>Alamat lengkap</small><b>${esc(s.alamat || "Alamat belum tersedia")}</b></div></div>
      ${s.kontak ? `<div class="info p"><div style="display:flex;gap:12px;align-items:center"><span class="tile">${I("phone")}</span><div><small>Nomor telepon</small><b>${esc(s.kontak)}</b></div></div><button class="copy" data-copy="${esc(s.kontak)}">${I("copy")}Salin</button></div>` : ""}</div>
    ${s.fasilitas.length ? `<div><span class="t15">Layanan tersedia</span>${s.fasilitas.map((f) => `<div class="fac"><span class="circ">${I("check")}</span><b>${esc(f)}</b></div>`).join("")}</div>` : ""}
    <div style="display:flex;flex-direction:column;gap:12px">
      ${s.kontak ? `<a class="btn" href="tel:${esc(s.kontak)}" style="background:var(--plum2);border-radius:16px">${I("phone")}Telepon langsung</a>`
        : `<div class="disabledbox"><div class="row"><span>Telepon langsung</span><span style="color:var(--ph)">Tidak tersedia</span></div><button class="btn" disabled>${I("phone")}Kontak belum tersedia</button><span class="center" style="text-align:center">Pilih layanan lain atau gunakan navigasi.</span></div>`}
      <a class="btn link" target="_blank" rel="noopener" href="${dir}">${I("nav")}Navigasi aman</a></div>
    <p class="note">${I("lock")}<span>Pencarian layanan tidak meminta nama atau identitas Anda.</span></p>`;
  if (window.L) {
    if (!dmap) { dmap = L.map("dmap", { zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, touchZoom: false, attributionControl: false }); L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(dmap); dmap.m = null; }
    if (dmap.m) dmap.m.remove();
    dmap.m = L.marker([s.lat, s.lon], { icon: L.divIcon({ className: "", iconSize: [0, 0], html: `<div class="pin ${s.jenis}"><i>${I(j.i)}</i></div>` }) }).addTo(dmap);
    setTimeout(() => { dmap.invalidateSize(); dmap.setView([s.lat, s.lon], 15); }, 60);
  }
}
(async function loadDial() {
  try {
    const p = jget(POS_KEY, null) || DEFAULT_POS;
    const r = await fetch(`/api/layanan/nearby?lat=${p.lat}&lon=${p.lon}&radius_km=30&jenis=polisi`); if (!r.ok) return;
    const s = (await r.json()).items.find((x) => x.kontak); if (!s) return;
    $("#dialA").href = "tel:" + s.kontak; $("#dialS").textContent = s.nama;
  } catch {}
})();

/* membuat laporan  */
let konf = null;
$$("input[name=mode]").forEach((r) => r.addEventListener("change", () => ($("#namaWrap").hidden = $("input[name=mode]:checked").value !== "identitas")));
const FID = { deskripsiKekerasan: "f-deskripsi", tanggalKekerasan: "f-tanggal", lokasiKekerasan: "f-lokasi", nama: "f-nama" };
$("#laporForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const mode = $("input[name=mode]:checked").value, msg = $("#laporMsg");
  const payload = { client_id: uid(), deskripsi: $("#deskripsi").value, tanggal: $("#tanggal").value, lokasi: $("#lokasi").value, mode, nama: mode === "identitas" ? $("#namaLap").value : "" };
  $$(".field.bad").forEach((x) => x.classList.remove("bad")); msg.textContent = ""; msg.className = "msg";
  let r;
  try { r = await fetch("/api/laporan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); }
  catch { enqueue("laporan", payload); konf = { state: "queued", client_id: payload.client_id, mode, at: new Date() }; $("#laporForm").reset(); $("#namaWrap").hidden = true; go("konfirmasi"); return; }
  const data = await r.json().catch(() => ({}));
  if (r.status === 422) {
    const bad = (data.kolom || []).map((k) => FID[k]).filter(Boolean); bad.forEach((id) => $("#" + id).classList.add("bad"));
    msg.className = "msg err2"; msg.textContent = "Lengkapi kolom yang ditandai."; $("#" + (bad[0] || "f-deskripsi"))?.querySelector("input,textarea")?.focus(); return;
  }
  if (!r.ok) { msg.className = "msg err2"; msg.textContent = "Laporan belum dapat dikirim. Coba lagi."; return; }
  konf = { state: "sent", token: data.token, mode, at: new Date() }; $("#laporForm").reset(); $("#namaWrap").hidden = true; go("konfirmasi");
});
function onLaporanSent(cid, token) { if (konf && konf.client_id === cid) { konf.state = "sent"; konf.token = token; if (current === "konfirmasi") renderKonf(); } }
function renderKonf() {
  const k = konf, b = $("#konfBody");
  if (!k) { b.innerHTML = '<div class="center" style="padding-top:48px"><h2>Belum ada laporan</h2></div><button class="btn" data-go="lapor">Buat laporan</button>'; return; }
  const sent = k.state === "sent", t = k.at.toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  b.innerHTML = `<div class="center" style="padding-top:16px"><span class="chip" style="background:${sent ? "var(--teal-l)" : "#FBF3E3"};color:${sent ? "var(--teal-d)" : "var(--amber)"}">${I(sent ? "lock" : "wifioff")}${sent ? "Terkirim aman" : "Menunggu koneksi"}</span>
    <div class="okmark ${sent ? "" : "wait"}">${I(sent ? "check" : "wifioff")}</div>
    <h2>${sent ? "Laporan diterima" : "Tersimpan di perangkat"}</h2>
    <p>${sent ? "Terima kasih atas keberanian Anda. Laporan Anda telah kami terima dengan aman." : "Laporan akan terkirim otomatis begitu perangkat terhubung. Jangan hapus data peramban sebelum itu."}</p></div>
    <div class="snap"><div class="hd"><span style="background:none;padding:0;font-size:13px;font-weight:600;color:var(--plum)">${I("doc")} Ringkasan laporan</span><span>${I("lock")}Terenkripsi</span></div>
      ${sent ? `<div class="code"><div><small>Kode laporan</small><b>${esc(k.token)}</b></div><button data-copy="${esc(k.token)}">${I("copy")}Salin</button></div>` : ""}
      <div class="kv"><span>Mode</span><b>${k.mode === "anonim" ? "Anonim" : "Dengan nama"}</b></div>
      <div class="kv"><span>Waktu</span><b>${t}</b></div>
      <div class="kv"><span>Status</span><b style="color:${sent ? "var(--teal)" : "var(--amber)"}">${sent ? "Diterima server" : "Menunggu koneksi"}</b></div></div>
    <div class="secure"><span class="circ">${I("shieldok")}</span><div><b>Keamanan identitas Anda</b><p>${k.mode === "anonim" ? "Mode anonim: nama dan kontak Anda tidak disimpan." : "Identitas Anda hanya dapat dibaca petugas yang berwenang."}</p></div></div>
    <div class="next"><div class="h"><span class="circ">${I("shield")}</span><span class="t15">Langkah berikutnya</span></div>
      <p class="mut" style="margin:0">Jika Anda berada di lingkungan yang tidak aman sekarang, hubungi 112 atau cari layanan pendamping terdekat.</p>
      <div class="two"><a href="tel:112" style="background:var(--chip)"><span style="color:var(--red2)">${I("phone")}</span>112</a><button data-go="peta">${I("map")}Layanan</button></div></div>
    <div style="display:flex;flex-direction:column;gap:10px"><button class="btn" data-go="home">${I("home")}Kembali ke beranda</button>${sent ? `<button class="btn alt" data-cek="${esc(k.token)}">${I("search")}Cek status laporan</button>` : ""}<button class="btn alt" data-go="lapor">${I("doc")}Buat laporan lain</button></div>`;
}

/* cek status laporan    */
const LSTAGE = [["baru", "Laporan diterima"], ["ditinjau", "Sedang ditinjau"], ["ditindaklanjuti", "Ditindaklanjuti"], ["selesai", "Selesai"]];
$("#cekForm").addEventListener("submit", async (e) => {
  e.preventDefault(); const code = $("#cekCode").value.trim(), box = $("#cekRes");
  $("#f-cek").classList.toggle("bad", !code); if (!code) { box.innerHTML = ""; return; }
  box.innerHTML = '<p class="mut">Memeriksa…</p>';
  let r; try { r = await fetch(`/api/laporan/${encodeURIComponent(code)}/status`); }
  catch { box.innerHTML = '<p class="msg err2">Tidak dapat terhubung. Coba lagi saat ada sinyal.</p>'; return; }
  if (r.status === 404) { box.innerHTML = '<p class="msg err2">Kode tidak ditemukan. Periksa kembali penulisannya.</p>'; return; }
  if (!r.ok) { box.innerHTML = '<p class="msg err2">Status belum dapat dimuat. Coba lagi.</p>'; return; }
  const d = await r.json(), idx = LSTAGE.findIndex((x) => x[0] === d.status), when = (iso) => { try { return new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); } catch { return ""; } };
  box.innerHTML = `<div class="snap"><div class="hd"><span style="background:none;padding:0;font-size:13px;font-weight:600;color:var(--plum)">${I("doc")} Perkembangan laporan</span><span>${I("lock")}Terenkripsi</span></div>
    <div style="display:flex;flex-direction:column;gap:16px;padding:8px 4px">${LSTAGE.map((x, i) => stage(i <= idx, x[1], i < idx ? "Selesai tahap ini" : i === idx ? "Tahap saat ini · " + when(d.diperbarui) : "Menunggu")).join("")}</div>
    <div class="kv"><span>Diterima</span><b>${when(d.diterima)}</b></div></div>
    ${d.pesan ? `<div class="reply"><div class="row" style="justify-content:flex-start;gap:10px"><span class="circ">${I("shield")}</span><b style="font-size:14px">Pesan dari petugas</b></div><p>${esc(d.pesan)}</p></div>` : '<p class="mut" style="margin:0">Belum ada pesan dari petugas.</p>'}`;
});

/* start app */
$("#recStop").addEventListener("click", stopRecording);
updateNet(); renderBanner(); if (getSos().id) pollStatus(); flush();
