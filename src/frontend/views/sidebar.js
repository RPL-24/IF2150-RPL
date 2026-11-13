/**
 * MahaSehat - sidebar.js
 * Perilaku navigasi responsif untuk SEMUA halaman ber-sidebar.
 *
 * Desktop (>=1024px) : sidebar vertikal seperti biasa, tombol toggle disembunyikan.
 * Tablet/mobile      : sidebar menjadi bar atas + panel dropdown.
 *
 * Markup yang dibutuhkan (sudah ada di setiap halaman):
 *   <aside class="app-sidebar" data-role="...">
 *     <div class="sidebar-header">
 *       <a class="brand-link">...</a>
 *       <button class="nav-toggle" aria-controls="SidebarPanel" aria-expanded="false">...</button>
 *     </div>
 *     <div class="sidebar-panel" id="SidebarPanel">
 *       <nav class="nav-menu">...</nav>
 *       <div class="sidebar-user">...</div>
 *     </div>
 *   </aside>
 */

(function () {
    'use strict';

    const BREAKPOINT_DESKTOP = 1024;

    function initSidebar() {
        const sidebar = document.querySelector('.app-sidebar');
        const toggle = document.querySelector('.nav-toggle');
        const panel = sidebar ? sidebar.querySelector('.sidebar-panel') : null;
        if (!sidebar || !toggle || !panel) return;

        const panelId = panel.id || 'SidebarPanel';
        panel.id = panelId;
        toggle.setAttribute('aria-controls', panelId);
        toggle.setAttribute('aria-expanded', 'false');

        // Latar gelap selama panel terbuka (dibuat dari JS agar markup halaman tetap ringkas)
        const backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        backdrop.hidden = true;
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(backdrop);

        function isOpen() {
            return sidebar.getAttribute('data-nav-open') === 'true';
        }

        function setOpen(open, { focusToggle = false } = {}) {
            sidebar.setAttribute('data-nav-open', open ? 'true' : 'false');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
            backdrop.hidden = !open;
            document.body.classList.toggle('nav-locked', open);

            if (open) {
                const firstLink = panel.querySelector('.nav-menu a') || panel.querySelector('a, button');
                if (firstLink) firstLink.focus({ preventScroll: true });
            } else if (focusToggle) {
                toggle.focus({ preventScroll: true });
            }
        }

        function closeIfDesktop() {
            if (window.innerWidth >= BREAKPOINT_DESKTOP && isOpen()) {
                sidebar.setAttribute('data-nav-open', 'false');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Buka menu navigasi');
                backdrop.hidden = true;
                document.body.classList.remove('nav-locked');
            }
        }

        toggle.addEventListener('click', () => setOpen(!isOpen(), { focusToggle: true }));

        // Escape menutup panel dan mengembalikan fokus ke tombol
        sidebar.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && isOpen()) {
                event.stopPropagation();
                setOpen(false, { focusToggle: true });
            }
        });

        // Klik backdrop / di luar sidebar menutup panel
        backdrop.addEventListener('click', () => setOpen(false, { focusToggle: true }));

        document.addEventListener('click', (event) => {
            if (isOpen() && !sidebar.contains(event.target)) setOpen(false);
        });

        // Setelah memilih menu, panel ditutup (halaman berpindah, tetapi ini
        // menjaga keadaan tetap benar bila tautan dibuka di tab yang sama)
        panel.addEventListener('click', (event) => {
            if (event.target.closest('.nav-menu a') && isOpen()) setOpen(false);
        });

        window.addEventListener('resize', closeIfDesktop);

        // Orientasi/ukuran awal
        closeIfDesktop();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebar);
    } else {
        initSidebar();
    }
})();
