/**
 * ESPLORA-FUNZIONI - Main JavaScript
 * Gestione tema chiaro/scuro, menu responsive e utility interattive
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initActiveNavLink();
  initHeroEvaluator();
});

/* -------------------------------------------------------------
   Tema Chiaro / Scuro
   ------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  // Controlla preferenza memorizzata o preferenza di sistema
  const savedTheme = localStorage.getItem('theme-preference');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.removeAttribute('data-theme');
    updateThemeIcon(false);
  }

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme-preference', 'light');
      updateThemeIcon(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme-preference', 'dark');
      updateThemeIcon(true);
    }
    
    // Notifica ad altri componenti (es. canvas grafici) del cambio di tema
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark: !isDark } }));
  });
}

function updateThemeIcon(isDark) {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.innerHTML = isDark ? '☀️' : '🌙';
    btn.setAttribute('aria-label', isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro');
    btn.title = isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro';
  }
}

/* -------------------------------------------------------------
   Menu Mobile
   ------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.nav-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Chiudi il menu cliccando all'esterno
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }
}

/* -------------------------------------------------------------
   Evidenziazione Link Navigazione Attivo
   ------------------------------------------------------------- */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* -------------------------------------------------------------
   Mini Calcolatore Funzione per la Hero della Home
   Mostra concretamente il concetto di funzione come macchina y = f(x)
   ------------------------------------------------------------- */
function initHeroEvaluator() {
  const xInput = document.getElementById('heroXInput');
  const funcSelect = document.getElementById('heroFuncSelect');
  const outputEl = document.getElementById('heroResultOutput');
  const formulaLabel = document.getElementById('heroFormulaLabel');

  if (!xInput || !funcSelect || !outputEl) return;

  function evaluate() {
    const x = parseFloat(xInput.value);
    const mode = funcSelect.value;
    let y = 0;
    let label = '';

    if (isNaN(x)) {
      outputEl.textContent = 'Valore non valido';
      return;
    }

    switch(mode) {
      case 'linear':
        // f(x) = 2x + 3
        y = 2 * x + 3;
        label = `f(${x}) = 2 · (${x}) + 3 = ${y}`;
        break;
      case 'quadratic':
        // f(x) = x^2 - 4
        y = Math.pow(x, 2) - 4;
        label = `f(${x}) = (${x})² - 4 = ${y}`;
        break;
      case 'sine':
        // f(x) = sin(x)
        y = Math.sin(x);
        label = `f(${x}) = sin(${x} rad) ≈ ${y.toFixed(3)}`;
        break;
      case 'exp':
        // f(x) = 2^x
        y = Math.pow(2, x);
        label = `f(${x}) = 2^(${x}) ≈ ${y.toFixed(3)}`;
        break;
      default:
        y = x;
        label = `f(${x}) = ${x}`;
    }

    outputEl.textContent = typeof y === 'number' ? y.toFixed(3).replace(/\.?0+$/, '') : y;
    const inputBadge = document.getElementById('heroInputBadge');
    if (inputBadge) inputBadge.textContent = x;
    if (formulaLabel) formulaLabel.textContent = label;
  }

  xInput.addEventListener('input', evaluate);
  funcSelect.addEventListener('change', evaluate);
  evaluate();
}

/* Helper globale per copiare comandi negli appunti */
window.copyToClipboard = function(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnElement.textContent;
    btnElement.textContent = 'Copiato! ✓';
    btnElement.style.color = 'var(--success)';
    setTimeout(() => {
      btnElement.textContent = originalText;
      btnElement.style.color = '';
    }, 2000);
  }).catch(err => {
    console.error('Errore durante la copia:', err);
  });
};
