#!/usr/bin/env bash
# Merender berkas mockup menjadi PNG 1440x1043 memakai Chrome headless.
#
#   bash src/mockup/render.sh I-04-katalog layar04
#   bash src/mockup/render.sh            # merender seluruh layar sesuai peta di bawah
#
# Jalankan dari akar repository.

set -u

CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
SRC="$(pwd)/src/mockup"
OUT="$(pwd)/docs/M8/assets"

# Peta: <nama berkas html tanpa ekstensi>:<nama berkas png tanpa ekstensi>
PETA=(
  "I-01-masuk:layar01"
  "I-02-daftar-akun:layar02"
  "I-03-verifikasi-surel:layar03"
  "I-04-katalog:layar04"
  "I-05-hasil-pencarian:layar05"
  "I-05b-tidak-ditemukan:layar05b"
  "I-06-detail-barang:layar06"
  "I-06b-detail-terjual:layar06b"
  "I-07-formulir-listing:layar07"
  "I-08-listing-saya:layar08"
  "I-09-profil-akun:layar09"
  "I-10-percakapan:layar10"
  "I-11-panel-notifikasi:layar11"
  "I-12-formulir-laporan:layar12"
  "I-13-dasbor-laporan:layar13"
  "I-14-dasbor-detail-laporan:layar14"
  "I-14b-konfirmasi-moderasi:layar14b"
  "I-15-dokumen-legal:layar15"
)

render() {
  local html="$1" png="$2"
  local path="$SRC/$html.html"
  if [ ! -f "$path" ]; then
    echo "LEWAT  $html.html (belum ada)"
    return
  fi
  # Ubah path Windows menjadi URL file://
  local url
  url="file:///$(cygpath -m "$path" 2>/dev/null || echo "$path")"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --window-size=1440,1043 \
    --virtual-time-budget=8000 \
    --screenshot="$OUT/$png.png" "$url" >/dev/null 2>&1
  if [ -f "$OUT/$png.png" ]; then
    echo "OK     $png.png  ($(stat -c%s "$OUT/$png.png") bytes)"
  else
    echo "GAGAL  $png.png"
  fi
}

mkdir -p "$OUT"

if [ $# -eq 2 ]; then
  render "$1" "$2"
else
  for baris in "${PETA[@]}"; do
    render "${baris%%:*}" "${baris##*:}"
  done
fi
