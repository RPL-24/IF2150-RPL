// Penangkap SMTP lokal pengganti Mailpit (mailpit.exe diblokir kebijakan Application Control).
// SMTP di port 1025, API HTTP di port 8025 yang meniru dua endpoint Mailpit:
//   GET /api/v1/search?query=to:"alamat"   -> { messages: [{ ID }] } terbaru lebih dulu
//   GET /api/v1/message/:id                -> { ID, Subject, Text, To: [{ Address }], From: { Address } }
//   GET /api/v1/messages                   -> seluruh pesan (untuk bukti)
const net = require('net');
const http = require('http');

const pesan = [];

function dekodeQP(teks) {
  return teks.replace(/=\r?\n/g, '').replace(/=([0-9A-F]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function uraikan(mentah, dari, ke) {
  const [kepalaMentah, ...sisa] = mentah.split(/\r?\n\r?\n/);
  const kepala = {};
  kepalaMentah.replace(/\r?\n[ \t]+/g, ' ').split(/\r?\n/).forEach((b) => {
    const i = b.indexOf(':');
    if (i > 0) kepala[b.slice(0, i).trim().toLowerCase()] = b.slice(i + 1).trim();
  });
  let badan = sisa.join('\n\n');
  const enc = (kepala['content-transfer-encoding'] || '').toLowerCase();
  if (enc === 'quoted-printable') badan = Buffer.from(dekodeQP(badan), 'latin1').toString('utf8');
  if (enc === 'base64') badan = Buffer.from(badan.replace(/\s+/g, ''), 'base64').toString('utf8');
  let subjek = kepala.subject || '';
  subjek = subjek.replace(/=\?utf-8\?([BQ])\?([^?]*)\?=/gi, (_, m, isi) => (m.toUpperCase() === 'B'
    ? Buffer.from(isi, 'base64').toString('utf8')
    : Buffer.from(dekodeQP(isi.replace(/_/g, ' ')), 'latin1').toString('utf8')));
  return {
    ID: String(pesan.length + 1),
    Subject: subjek,
    Text: badan.replace(/\r\n/g, '\n').trim(),
    From: { Address: dari },
    To: ke.map((a) => ({ Address: a })),
    Created: new Date().toISOString(),
  };
}

net.createServer((soket) => {
  let dari = '';
  let ke = [];
  let modeData = false;
  let penyangga = '';
  const kirim = (t) => soket.write(`${t}\r\n`);
  kirim('220 penangkap-smtp ITBELI');
  soket.on('data', (potongan) => {
    penyangga += potongan.toString('latin1');
    for (;;) {
      if (modeData) {
        const akhir = penyangga.indexOf('\r\n.\r\n');
        if (akhir < 0) return;
        const mentah = Buffer.from(penyangga.slice(0, akhir).replace(/\r\n\.\./g, '\r\n.'), 'latin1').toString('latin1');
        penyangga = penyangga.slice(akhir + 5);
        modeData = false;
        pesan.push(uraikan(mentah, dari, ke));
        kirim('250 OK');
        continue;
      }
      const i = penyangga.indexOf('\r\n');
      if (i < 0) return;
      const baris = penyangga.slice(0, i);
      penyangga = penyangga.slice(i + 2);
      const perintah = baris.slice(0, 4).toUpperCase();
      if (perintah === 'EHLO') { soket.write('250-penangkap-smtp\r\n250 8BITMIME\r\n'); }
      else if (perintah === 'HELO') kirim('250 penangkap-smtp');
      else if (perintah === 'MAIL') { dari = (baris.match(/<([^>]*)>/) || [])[1] || ''; ke = []; kirim('250 OK'); }
      else if (perintah === 'RCPT') { ke.push((baris.match(/<([^>]*)>/) || [])[1] || ''); kirim('250 OK'); }
      else if (perintah === 'DATA') { modeData = true; kirim('354 Akhiri dengan <CRLF>.<CRLF>'); }
      else if (perintah === 'QUIT') { kirim('221 Sampai jumpa'); soket.end(); return; }
      else kirim('250 OK');
    }
  });
  soket.on('error', () => {});
}).listen(1025, '127.0.0.1');

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const jawab = (obj, kode = 200) => { res.writeHead(kode, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
  if (url.pathname === '/api/v1/search') {
    const tujuan = ((url.searchParams.get('query') || '').match(/to:"([^"]+)"/i) || [])[1] || '';
    const cocok = pesan.filter((p) => p.To.some((t) => t.Address.toLowerCase() === tujuan.toLowerCase())).reverse();
    return jawab({ messages: cocok.map((p) => ({ ID: p.ID })), messages_count: cocok.length });
  }
  const m = url.pathname.match(/^\/api\/v1\/message\/(\d+)$/);
  if (m) {
    const p = pesan.find((x) => x.ID === m[1]);
    return p ? jawab(p) : jawab({ galat: 'tidak ada' }, 404);
  }
  if (url.pathname === '/api/v1/messages') return jawab({ messages: [...pesan].reverse(), total: pesan.length });
  return jawab({ galat: 'tidak dikenal' }, 404);
}).listen(8025, '127.0.0.1', () => console.log('penangkap SMTP siap: smtp 1025, api 8025'));
