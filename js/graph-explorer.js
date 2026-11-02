/**
 * ESPLORA-FUNZIONI - Interactive Function Graph Explorer
 * Disegna funzioni in tempo reale su canvas HTML5 con stile Dark Slate
 */

class FunctionExplorer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.typeSelect = document.getElementById('funcTypeSelect');
    this.sliderContainer = document.getElementById('sliderControls');
    this.formulaDisplay = document.getElementById('currentFormulaDisplay');
    this.domainDisplay = document.getElementById('currentDomainDisplay');
    this.propertiesDisplay = document.getElementById('currentPropertiesDisplay');

    // Finestra coordinate predefinita
    this.view = {
      xMin: -6,
      xMax: 6,
      yMin: -4,
      yMax: 4
    };

    // Stato corrente
    this.currentType = 'parabola';
    this.params = { a: 1, b: 0, c: -2, m: 1, q: 0, k: 2, x0: 0, y0: 0, base: 2, amp: 2, freq: 1 };
    
    // Mouse hover
    this.hoverPos = null;

    this.init();
  }

  init() {
    this.setupResize();
    this.setupListeners();
    this.updateControls();
    this.draw();
  }

  setupResize() {
    const resize = () => {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.scale(dpr, dpr);
      this.displayWidth = rect.width;
      this.displayHeight = rect.height;
      this.draw();
    };

    window.addEventListener('resize', resize);
    resize();
  }

  setupListeners() {
    if (this.typeSelect) {
      this.typeSelect.addEventListener('change', (e) => {
        this.currentType = e.target.value;
        this.updateControls();
        this.draw();
      });
    }

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.hoverPos = this.screenToWorld(mouseX, mouseY);
      this.draw();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverPos = null;
      this.draw();
    });
  }

  updateControls() {
    if (!this.sliderContainer) return;
    this.sliderContainer.innerHTML = '';

    const configs = this.getTypeConfig(this.currentType);

    configs.sliders.forEach(s => {
      const group = document.createElement('div');
      group.className = 'control-group';

      const label = document.createElement('label');
      label.className = 'control-label';
      label.innerHTML = `<span>${s.param} (${s.label}):</span> <span class="val-badge" id="val_${s.param}">${this.params[s.param] ?? s.default}</span>`;

      const input = document.createElement('input');
      input.type = 'range';
      input.min = s.min;
      input.max = s.max;
      input.step = s.step;
      input.value = this.params[s.param] !== undefined ? this.params[s.param] : s.default;

      input.addEventListener('input', (e) => {
        this.params[s.param] = parseFloat(e.target.value);
        const badge = document.getElementById(`val_${s.param}`);
        if (badge) badge.textContent = this.params[s.param];
        this.draw();
      });

      group.appendChild(label);
      group.appendChild(input);
      this.sliderContainer.appendChild(group);
    });

    this.updateInfoText();
  }

  getTypeConfig(type) {
    switch (type) {
      case 'linear':
        return {
          title: 'Funzione Lineare (Retta)',
          sliders: [
            { param: 'm', label: 'Pendenza m', min: -4, max: 4, step: 0.2, default: 1 },
            { param: 'q', label: 'Intercetta q', min: -4, max: 4, step: 0.5, default: 0 }
          ]
        };
      case 'parabola':
        return {
          title: 'Funzione Quadratica (Parabola)',
          sliders: [
            { param: 'a', label: 'Concavità a', min: -3, max: 3, step: 0.2, default: 1 },
            { param: 'b', label: 'Termine 1° grado b', min: -4, max: 4, step: 0.5, default: 0 },
            { param: 'c', label: 'Termine noto c', min: -4, max: 4, step: 0.5, default: -2 }
          ]
        };
      case 'rational':
        return {
          title: 'Funzione Razionale Fratta',
          sliders: [
            { param: 'k', label: 'Costante k', min: -5, max: 5, step: 0.5, default: 2 },
            { param: 'x0', label: 'Asintoto vert. x₀', min: -3, max: 3, step: 0.5, default: 1 },
            { param: 'y0', label: 'Asintoto orizz. y₀', min: -3, max: 3, step: 0.5, default: 0 }
          ]
        };
      case 'exponential':
        return {
          title: 'Funzione Esponenziale',
          sliders: [
            { param: 'base', label: 'Base a (a > 0)', min: 0.2, max: 3.5, step: 0.1, default: 2 }
          ]
        };
      case 'sinusoid':
        return {
          title: 'Funzione Goniometrica (Seno)',
          sliders: [
            { param: 'amp', label: 'Ampiezza A', min: 0.5, max: 3, step: 0.25, default: 2 },
            { param: 'freq', label: 'Pulsazione ω', min: 0.5, max: 3, step: 0.25, default: 1 }
          ]
        };
      case 'sqrt':
        return {
          title: 'Funzione Irrazionale',
          sliders: [
            { param: 'a', label: 'Fattore a', min: -3, max: 3, step: 0.5, default: 1.5 },
            { param: 'x0', label: 'Origine x₀', min: -3, max: 3, step: 0.5, default: -1 }
          ]
        };
      default:
        return { title: '', sliders: [] };
    }
  }

  evaluate(x) {
    const p = this.params;
    switch (this.currentType) {
      case 'linear':
        return (p.m || 1) * x + (p.q || 0);
      case 'parabola':
        return (p.a || 1) * x * x + (p.b || 0) * x + (p.c || 0);
      case 'rational':
        const denom = x - (p.x0 || 0);
        if (Math.abs(denom) < 0.0001) return null;
        return (p.k || 2) / denom + (p.y0 || 0);
      case 'exponential':
        const base = Math.max(0.01, p.base || 2);
        return Math.pow(base, x);
      case 'sinusoid':
        return (p.amp || 2) * Math.sin((p.freq || 1) * x);
      case 'sqrt':
        const radicando = x - (p.x0 || 0);
        if (radicando < 0) return null;
        return (p.a || 1.5) * Math.sqrt(radicando);
      default:
        return x;
    }
  }

  updateInfoText() {
    const p = this.params;
    let formula = '';
    let domain = '';
    let props = '';

    switch (this.currentType) {
      case 'linear':
        formula = `f(x) = ${p.m}x ${p.q >= 0 ? '+ ' + p.q : '- ' + Math.abs(p.q)}`;
        domain = 'Dominio: D = ℝ = (-∞, +∞)';
        props = `Pendenza m = ${p.m} (${p.m > 0 ? 'crescente' : p.m < 0 ? 'decrescente' : 'costante'}). Interseca asse y in (0, ${p.q}).`;
        break;
      case 'parabola':
        formula = `f(x) = ${p.a}x² ${p.b >= 0 ? '+ ' + p.b : '- ' + Math.abs(p.b)}x ${p.c >= 0 ? '+ ' + p.c : '- ' + Math.abs(p.c)}`;
        domain = 'Dominio: D = ℝ = (-∞, +∞)';
        const delta = p.b * p.b - 4 * p.a * p.c;
        const concavity = p.a > 0 ? 'verso l\'alto (minimo)' : 'verso il basso (massimo)';
        props = `Concavità ${concavity}. Δ = ${delta.toFixed(2)} (${delta > 0 ? '2 zeri' : delta === 0 ? '1 zero' : 'nessuno zero reale'}).`;
        break;
      case 'rational':
        formula = `f(x) = ${p.k} / (x - ${p.x0}) + ${p.y0}`;
        domain = `Dominio: D = ℝ \\ {${p.x0}}`;
        props = `Asintoto verticale in x = ${p.x0}. Asintoto orizzontale in y = ${p.y0}.`;
        break;
      case 'exponential':
        formula = `f(x) = ${p.base}^x`;
        domain = 'Dominio: D = ℝ, Immagine: (0, +∞)';
        props = p.base > 1 ? `Base > 1: strettamente crescente. Asintoto orizzontale y = 0 per x → -∞.` : `Base < 1: strettamente decrescente. Asintoto orizzontale y = 0 per x → +∞.`;
        break;
      case 'sinusoid':
        formula = `f(x) = ${p.amp} · sin(${p.freq}x)`;
        domain = 'Dominio: D = ℝ, Periodo: T ≈ ' + (2 * Math.PI / p.freq).toFixed(2);
        props = `Funzione dispari (f(-x) = -f(x)). Immagine limitata in [${-p.amp}, ${p.amp}].`;
        break;
      case 'sqrt':
        formula = `f(x) = ${p.a} · √(x ${p.x0 >= 0 ? '- ' + p.x0 : '+ ' + Math.abs(p.x0)})`;
        domain = `Dominio: D = [${p.x0}, +∞)`;
        props = `Origine della curva in (${p.x0}, 0). Monotona ${p.a > 0 ? 'crescente' : 'decrescente'}.`;
        break;
    }

    if (this.formulaDisplay) this.formulaDisplay.textContent = formula;
    if (this.domainDisplay) this.domainDisplay.textContent = domain;
    if (this.propertiesDisplay) this.propertiesDisplay.textContent = props;
  }

  worldToScreen(x, y) {
    const w = this.displayWidth;
    const h = this.displayHeight;
    const sx = ((x - this.view.xMin) / (this.view.xMax - this.view.xMin)) * w;
    const sy = h - ((y - this.view.yMin) / (this.view.yMax - this.view.yMin)) * h;
    return { x: sx, y: sy };
  }

  screenToWorld(sx, sy) {
    const w = this.displayWidth;
    const h = this.displayHeight;
    const x = this.view.xMin + (sx / w) * (this.view.xMax - this.view.xMin);
    const y = this.view.yMin + ((h - sy) / h) * (this.view.yMax - this.view.yMin);
    return { x: x, y: y };
  }

  draw() {
    if (!this.ctx) return;

    // Palette Dark Slate Neon
    const colors = {
      bg: '#090d16',
      grid: 'rgba(255, 255, 255, 0.07)',
      axis: '#64748b',
      text: '#94a3b8',
      curve: '#38bdf8',       // Sky blue neon
      asymptote: '#ef4444',   // Red neon
      point: '#fbbf24',       // Amber
      intercept: '#10b981'    // Emerald
    };

    const ctx = this.ctx;
    const w = this.displayWidth;
    const h = this.displayHeight;

    // Sfondo
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, w, h);

    // Griglia cartesiana
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors.grid;
    ctx.font = '10px monospace';
    ctx.fillStyle = colors.text;

    for (let x = Math.ceil(this.view.xMin); x <= Math.floor(this.view.xMax); x++) {
      if (x === 0) continue;
      const pt = this.worldToScreen(x, 0);
      ctx.beginPath();
      ctx.moveTo(pt.x, 0);
      ctx.lineTo(pt.x, h);
      ctx.stroke();
      ctx.fillText(x.toString(), pt.x - 4, pt.y + 14);
    }

    for (let y = Math.ceil(this.view.yMin); y <= Math.floor(this.view.yMax); y++) {
      if (y === 0) continue;
      const pt = this.worldToScreen(0, y);
      ctx.beginPath();
      ctx.moveTo(0, pt.y);
      ctx.lineTo(w, pt.y);
      ctx.stroke();
      ctx.fillText(y.toString(), pt.x + 6, pt.y + 3);
    }

    // Assi principali x e y
    const origin = this.worldToScreen(0, 0);
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = colors.axis;

    // Asse X
    ctx.beginPath();
    ctx.moveTo(0, origin.y);
    ctx.lineTo(w, origin.y);
    ctx.stroke();

    // Asse Y
    ctx.beginPath();
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, h);
    ctx.stroke();

    // Etichette assi
    ctx.fillStyle = colors.text;
    ctx.fillText('x', w - 12, origin.y - 8);
    ctx.fillText('y', origin.x + 8, 14);
    ctx.fillText('0', origin.x - 10, origin.y + 14);

    // Asintoti tratteggiati
    if (this.currentType === 'rational') {
      const x0 = this.params.x0 || 0;
      const y0 = this.params.y0 || 0;
      const asymX = this.worldToScreen(x0, 0).x;
      const asymY = this.worldToScreen(0, y0).y;

      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = colors.asymptote;
      ctx.lineWidth = 1.4;

      // Asintoto verticale
      ctx.beginPath();
      ctx.moveTo(asymX, 0);
      ctx.lineTo(asymX, h);
      ctx.stroke();

      // Asintoto orizzontale
      ctx.beginPath();
      ctx.moveTo(0, asymY);
      ctx.lineTo(w, asymY);
      ctx.stroke();
      ctx.restore();
    }

    // Curva Funzione
    ctx.lineWidth = 3;
    ctx.strokeStyle = colors.curve;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    const step = (this.view.xMax - this.view.xMin) / (w * 1.5);
    let isDrawing = false;

    for (let x = this.view.xMin; x <= this.view.xMax; x += step) {
      const y = this.evaluate(x);

      if (y === null || isNaN(y) || !isFinite(y) || y < this.view.yMin - 10 || y > this.view.yMax + 10) {
        isDrawing = false;
        continue;
      }

      const pt = this.worldToScreen(x, y);

      if (!isDrawing) {
        ctx.moveTo(pt.x, pt.y);
        isDrawing = true;
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    }
    ctx.stroke();

    // Intercetta asse Y
    const yIntercept = this.evaluate(0);
    if (yIntercept !== null && isFinite(yIntercept) && yIntercept >= this.view.yMin && yIntercept <= this.view.yMax) {
      const pt = this.worldToScreen(0, yIntercept);
      ctx.fillStyle = colors.intercept;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hover del mouse: traccia coordinate
    if (this.hoverPos) {
      const hx = this.hoverPos.x;
      const hy = this.evaluate(hx);

      if (hy !== null && isFinite(hy) && hy >= this.view.yMin && hy <= this.view.yMax) {
        const pt = this.worldToScreen(hx, hy);

        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = colors.text;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pt.x, origin.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.lineTo(origin.x, pt.y);
        ctx.stroke();
        ctx.restore();

        // Punto di mira
        ctx.fillStyle = colors.point;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Tooltip
        const tipText = `(${hx.toFixed(2)}, ${hy.toFixed(2)})`;
        ctx.fillStyle = '#1e293b';
        const tipWidth = ctx.measureText(tipText).width + 16;
        const tipX = Math.min(w - tipWidth - 10, Math.max(10, pt.x + 10));
        const tipY = Math.max(25, pt.y - 12);
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(tipX, tipY - 18, tipWidth, 24);
        ctx.fillRect(tipX, tipY - 18, tipWidth, 24);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(tipText, tipX + 8, tipY - 2);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('graphCanvas')) {
    window.funcExplorer = new FunctionExplorer('graphCanvas');
  }
});
