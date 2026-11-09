// Issue tracker otomatis ITBELI (dipanggil .github/workflows/issue-tracker.yml lewat actions/github-script).
// 1) PR yang di-merge ke branch selain default (mis. develop) tidak menutup issue otomatis di GitHub,
//    jadi issue yang dirujuk "Closes #N" ditutup di sini.
// 2) Satu issue berlabel `tracker` diperbarui dengan rekap per modul A–E.

const LABEL_TRACKER = 'tracker';
const JUDUL_TRACKER = '📊 Issue Tracker ITBELI';
const MODUL = [
  ['modul-A', 'A. Akun & Otentikasi'],
  ['modul-B', 'B. Listing Penjual'],
  ['modul-C', 'C. Katalog & Pencarian + Setup'],
  ['modul-D', 'D. Percakapan & Notifikasi'],
  ['modul-E', 'E. Laporan & Moderasi'],
];

// Kata kunci penutup issue versi GitHub: close(s/d), fix(es/ed), resolve(s/d) + #N
function issueDirujuk(teks) {
  const hasil = new Set();
  const pola = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s*:?\s+#(\d+)/gi;
  for (const m of String(teks || '').matchAll(pola)) hasil.add(Number(m[1]));
  return [...hasil];
}

function waktuWIB(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Login ditulis dalam code span supaya edit tracker tidak mengirim notifikasi @mention
const orang = (login) => (login ? `\`${login}\`` : '-');
const aman = (teks) => String(teks).replace(/\|/g, '\\|');

function statusIssue(issue, prs) {
  if (issue.state === 'closed') return '✅ Selesai';
  if (prs.some((pr) => pr.state === 'open')) return '👀 Review';
  if (issue.labels.includes('in-progress')) return '🔄 Dikerjakan';
  return '📝 Terbuka';
}

function barProgres(selesai, total) {
  const isi = total ? Math.round((selesai / total) * 10) : 0;
  return `${'█'.repeat(isi)}${'░'.repeat(10 - isi)} ${total ? Math.round((selesai / total) * 100) : 0}%`;
}

function teksPr(pr) {
  if (pr.merged_at) return `#${pr.number} ✔️ → \`${pr.base}\``;
  return pr.state === 'open' ? `#${pr.number} (open)` : `#${pr.number} (ditutup)`;
}

// issues: [{ number, title, state, labels: [nama], assignees: [login] }]
// prs:    [{ number, title, state, user, base, merged_at, refs: [nomor issue] }]
function susunTracker(issues, prs, sekarang = new Date().toISOString()) {
  const prPerIssue = new Map();
  for (const pr of prs) {
    for (const n of pr.refs) prPerIssue.set(n, [...(prPerIssue.get(n) || []), pr]);
  }

  const kelompok = [...MODUL, ['', 'Lainnya (tanpa label modul)']].map(([label, nama]) => ({
    nama,
    issues: issues.filter((i) =>
      label ? i.labels.includes(label) : !MODUL.some(([l]) => i.labels.includes(l)),
    ),
  }));

  const baris = [
    `# ${JUDUL_TRACKER}`,
    '',
    '> Diperbarui otomatis oleh workflow `issue-tracker` setiap ada perubahan issue atau PR. **Jangan edit manual.**',
    '> Tautkan PR ke issue dengan menulis `Closes #<nomor>` di deskripsi PR; saat PR di-merge, issue ditutup dan tercatat di sini.',
    '',
    '## Ringkasan',
    '',
    '| Modul | Selesai | Total | Progres |',
    '| :--- | ---: | ---: | :--- |',
  ];
  let totalSelesai = 0;
  let totalSemua = 0;
  for (const k of kelompok) {
    if (!k.issues.length) continue;
    const selesai = k.issues.filter((i) => i.state === 'closed').length;
    totalSelesai += selesai;
    totalSemua += k.issues.length;
    baris.push(`| ${k.nama} | ${selesai} | ${k.issues.length} | ${barProgres(selesai, k.issues.length)} |`);
  }
  baris.push(`| **Total** | **${totalSelesai}** | **${totalSemua}** | ${barProgres(totalSelesai, totalSemua)} |`, '');

  for (const k of kelompok) {
    if (!k.issues.length) continue;
    baris.push(
      `## ${k.nama}`,
      '',
      '| Issue | Judul | PJ | Status | PR | Di-merge |',
      '| :--- | :--- | :--- | :--- | :--- | :--- |',
    );
    for (const i of [...k.issues].sort((a, b) => a.number - b.number)) {
      const terkait = prPerIssue.get(i.number) || [];
      const merge = terkait.filter((pr) => pr.merged_at).sort((a, b) => a.merged_at.localeCompare(b.merged_at)).pop();
      baris.push(
        `| #${i.number} | ${aman(i.title)} | ${i.assignees.map(orang).join(', ') || '-'} | ${statusIssue(i, terkait)} | ${
          terkait.map(teksPr).join('<br>') || '-'
        } | ${merge ? `${orang(merge.user)}, ${waktuWIB(merge.merged_at)}` : '-'} |`,
      );
    }
    baris.push('');
  }

  const terbaru = prs
    .filter((pr) => pr.merged_at)
    .sort((a, b) => b.merged_at.localeCompare(a.merged_at))
    .slice(0, 10);
  if (terbaru.length) {
    baris.push(
      '## 10 Merge Terakhir',
      '',
      '| Waktu (WIB) | PR | Penulis | Ke | Menutup |',
      '| :--- | :--- | :--- | :--- | :--- |',
    );
    for (const pr of terbaru) {
      baris.push(
        `| ${waktuWIB(pr.merged_at)} | #${pr.number} ${aman(pr.title)} | ${orang(pr.user)} | \`${pr.base}\` | ${
          pr.refs.map((n) => `#${n}`).join(', ') || '-'
        } |`,
      );
    }
    baris.push('');
  }

  baris.push(`<sub>Terakhir diperbarui: ${waktuWIB(sekarang)} WIB</sub>`);
  return baris.join('\n');
}

async function jalankan({ github, context, core }) {
  const { owner, repo } = context.repo;
  const daftarIssue = await github.paginate(github.rest.issues.listForRepo, { owner, repo, state: 'all', per_page: 100 });
  const daftarPr = await github.paginate(github.rest.pulls.list, { owner, repo, state: 'all', per_page: 100 });

  const prs = [];
  for (const pr of daftarPr) {
    let teks = `${pr.title}\n${pr.body || ''}`;
    // Pesan commit ikut dibaca untuk PR yang sudah di-merge, seperti perilaku GitHub di branch default
    if (pr.merged_at) {
      const commits = await github.paginate(github.rest.pulls.listCommits, { owner, repo, pull_number: pr.number, per_page: 100 });
      teks += commits.map((c) => `\n${c.commit.message}`).join('');
    }
    prs.push({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      user: pr.user && pr.user.login,
      base: pr.base.ref,
      merged_at: pr.merged_at,
      refs: issueDirujuk(teks),
    });
  }

  // Tutup issue yang dirujuk PR yang baru saja di-merge ke branch non-default
  const pr = context.payload.pull_request;
  if (context.eventName === 'pull_request_target' && pr && pr.merged && pr.base.ref !== context.payload.repository.default_branch) {
    const info = prs.find((p) => p.number === pr.number);
    for (const n of info ? info.refs : []) {
      const issue = daftarIssue.find((i) => i.number === n && !i.pull_request);
      if (!issue || issue.state === 'closed') continue;
      await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: n,
        body: `Ditutup otomatis: PR #${pr.number} di-merge ke \`${pr.base.ref}\` oleh \`${pr.merged_by ? pr.merged_by.login : pr.user.login}\`.`,
      });
      await github.rest.issues.update({ owner, repo, issue_number: n, state: 'closed', state_reason: 'completed' });
      issue.state = 'closed';
      core.info(`Issue #${n} ditutup (PR #${pr.number}).`);
    }
  }

  const tracker = daftarIssue.find((i) => !i.pull_request && i.labels.some((l) => l.name === LABEL_TRACKER));
  const issues = daftarIssue
    .filter((i) => !i.pull_request && i !== tracker)
    .map((i) => ({
      number: i.number,
      title: i.title,
      state: i.state,
      labels: i.labels.map((l) => l.name),
      assignees: (i.assignees || []).map((a) => a.login),
    }));
  const body = susunTracker(issues, prs);

  if (tracker) {
    if (tracker.body !== body) await github.rest.issues.update({ owner, repo, issue_number: tracker.number, body, state: 'open' });
    core.info(`Tracker #${tracker.number} diperbarui.`);
  } else {
    await github.rest.issues.createLabel({ owner, repo, name: LABEL_TRACKER, color: '0E8A16', description: 'Issue rekap otomatis' }).catch(() => {});
    const { data } = await github.rest.issues.create({ owner, repo, title: JUDUL_TRACKER, body, labels: [LABEL_TRACKER] });
    core.info(`Tracker #${data.number} dibuat.`);
  }
}

module.exports = jalankan;
module.exports.issueDirujuk = issueDirujuk;
module.exports.susunTracker = susunTracker;
