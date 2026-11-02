/**
 * ESPLORA-FUNZIONI - Interactive Quiz System
 * Motore per test di autovalutazione sulle funzioni numeriche reali
 */

const quizData = [
  {
    id: 1,
    topic: "Definizione",
    question: "Quale delle seguenti affermazioni definisce correttamente una funzione $f: A \\to B$?",
    options: [
      "Una relazione che associa ad ogni elemento di $A$ almeno due elementi di $B$",
      "Una legge che associa ad ogni elemento di $A$ uno ed un solo elemento di $B$",
      "Un insieme di coppie in cui ogni elemento di $B$ ha una sola controimmagine in $A$",
      "Qualsiasi relazione generica tra due numeri reali"
    ],
    correct: 1,
    explanation: "Per definizione formale, una funzione da $A$ a $B$ è una relazione che associa a <strong>ogni</strong> elemento $x \\in A$ <strong>uno e un solo</strong> elemento $y \\in B$ (univocità dell'immagine)."
  },
  {
    id: 2,
    topic: "Grafico Cartesiano",
    question: "Nel piano cartesiano, come si riconosce graficamente se una curva rappresenta il grafico di una funzione $y = f(x)$?",
    options: [
      "Test della retta orizzontale: ogni retta orizzontale deve tagliare la curva in un solo punto",
      "Test della retta verticale: ogni retta verticale $x = k$ deve intersecare la curva al massimo in un punto",
      "La curva non deve mai toccare l'asse delle ascisse",
      "La curva deve essere sempre continua e non avere asintoti"
    ],
    correct: 1,
    explanation: "Il <strong>test della retta verticale</strong> assicura l'univocità: se ogni retta verticale $x = k$ tocca la curva in al massimo un punto, ad ogni input $x$ corrisponde una sola ordinata $y$."
  },
  {
    id: 3,
    topic: "Calcolo del Dominio",
    question: "Qual è il dominio naturale (campo di esistenza) della funzione razionale fratta $f(x) = \\frac{2x + 1}{x^2 - 9}$?",
    options: [
      "$D = \\mathbb{R} \\setminus \\{3\}$",
      "$D = \\mathbb{R} \\setminus \\{-3, 3\}$",
      "$D = (-3, 3)$",
      "$D = [3, +\\infty)$"
    ],
    correct: 1,
    explanation: "Una frazione algebrica ha significato se e solo se il denominatore è non nullo: $x^2 - 9 \\neq 0 \\iff x \\neq \\pm 3$. Il dominio è $D = \\mathbb{R} \\setminus \\{-3, 3\}$."
  },
  {
    id: 4,
    topic: "Radici e Dominio",
    question: "Determinare il dominio della funzione irrazionale $f(x) = \\sqrt{2x - 8}$ nell'insieme $\\mathbb{R}$:",
    options: [
      "$x > 4$",
      "$x \\ge 4$",
      "$x \\le 4$",
      "$x \\in \\mathbb{R}$"
    ],
    correct: 1,
    explanation: "Nei numeri reali, la radice quadrata ha indice pari ($n=2$), quindi il radicando deve essere maggiore o uguale a zero: $2x - 8 \\ge 0 \\implies 2x \\ge 8 \\implies x \\ge 4$. Quindi $D = [4, +\\infty)$."
  },
  {
    id: 5,
    topic: "Classificazione",
    question: "Come viene classificata la funzione $f(x) = \\frac{\\sqrt{x + 2}}{x - 1}$?",
    options: [
      "Algebrica razionale intera",
      "Algebrica razionale fratta",
      "Algebrica irrazionale fratta",
      "Trascendente logaritmica"
    ],
    correct: 2,
    explanation: "La variabile $x$ compare sia sotto il segno di radice (quindi è <strong>irrazionale</strong>) sia al denominatore (quindi è <strong>fratta</strong>). È un'algebrica irrazionale fratta."
  },
  {
    id: 6,
    topic: "Simmetria",
    question: "La funzione $f(x) = 3x^4 - 5x^2 + 2$ è:",
    options: [
      "Pari, poiché $f(-x) = f(x)$ (simmetrica rispetto all'asse y)",
      "Dispari, poiché $f(-x) = -f(x)$ (simmetrica rispetto all'origine)",
      "Né pari né dispari",
      "Periodica"
    ],
    correct: 0,
    explanation: "Sostituendo $-x$ al posto di $x$: $f(-x) = 3(-x)^4 - 5(-x)^2 + 2 = 3x^4 - 5x^2 + 2 = f(x)$. Poiché $f(-x) = f(x)$, la funzione è <strong>pari</strong> ed è geometricamente simmetrica rispetto all'asse $y$."
  },
  {
    id: 7,
    topic: "Simmetria",
    question: "La funzione $f(x) = x^3 - 4x$ è:",
    options: [
      "Pari",
      "Dispari, poiché $f(-x) = -f(x)$ (simmetrica rispetto all'origine)",
      "Non ha alcuna simmetria",
      "Periodica di periodo $\\pi$"
    ],
    correct: 1,
    explanation: "Calcolando $f(-x)$: $f(-x) = (-x)^3 - 4(-x) = -x^3 + 4x = -(x^3 - 4x) = -f(x)$. Dunque $f(-x) = -f(x)$, la funzione è <strong>dispari</strong> e il suo grafico è simmetrico rispetto all'origine $O(0,0)$."
  },
  {
    id: 8,
    topic: "Funzioni Trascendenti",
    question: "Quale delle seguenti è una proprietà fondamentale della funzione esponenziale elementare $f(x) = a^x$ con base $a > 1$?",
    options: [
      "Il suo dominio è solo l'insieme dei reali positivi $x > 0$",
      "Assume sia valori positivi che negativi",
      "È sempre positiva ($y > 0$), strettamente crescente su tutto $\\mathbb{R}$ e passa per $(0,1)$",
      "Ha un asintoto verticale in $x = 0$"
    ],
    correct: 2,
    explanation: "Per $a > 1$, la funzione esponenziale è definita su tutto $\\mathbb{R}$, è strettamente crescente, strettamente positiva ($a^x > 0$), passa per $(0, 1)$ poiché $a^0 = 1$, ed ha $y=0$ come asintoto orizzontale sinistro."
  },
  {
    id: 9,
    topic: "Proprietà Globali",
    question: "Se ogni retta orizzontale $y = k$ interseca il grafico di una funzione $y = f(x)$ <strong>al massimo in un punto</strong>, allora la funzione è:",
    options: [
      "Suriettiva",
      "Iniettiva",
      "Periodica",
      "Costante"
    ],
    correct: 1,
    explanation: "Questo è il <strong>test delle rette orizzontali</strong> per l'iniettività. Garantisce che elementi distinti del dominio abbiano sempre immagini distinte: $x_1 \\neq x_2 \\implies f(x_1) \\neq f(x_2)$."
  },
  {
    id: 10,
    topic: "GeoGebra",
    question: "In GeoGebra, quale comando individua direttamente le intersezioni tra il grafico della funzione $f(x)$ e l'asse delle ascisse (zeri della funzione)?",
    options: [
      "IntersezioneAssi(f)",
      "Radice(f) [oppure Root(f)]",
      "ZeriPolinomio(f)",
      "SoluzioneEquazione(f)"
    ],
    correct: 1,
    explanation: "In GeoGebra il comando specifico per calcolare gli zeri di una funzione reale è <code>Radice(f)</code> (nella versione italiana) oppure <code>Root(f)</code>."
  }
];

class QuizApp {
  constructor() {
    this.currentIndex = 0;
    this.score = 0;
    this.container = document.getElementById('quizQuestionsContainer');
    this.progressBar = document.getElementById('quizProgressBar');
    this.statusText = document.getElementById('quizStatusText');
    this.scoreText = document.getElementById('quizLiveScore');
    this.resultsCard = document.getElementById('quizResultsCard');
    this.restartBtn = document.getElementById('restartQuizBtn');

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.renderCurrentQuestion();
    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => this.restart());
    }
  }

  renderCurrentQuestion() {
    const q = quizData[this.currentIndex];
    const total = quizData.length;

    // Aggiorna progress bar e contatori
    const percent = Math.round(((this.currentIndex) / total) * 100);
    if (this.progressBar) this.progressBar.style.width = `${percent}%`;
    if (this.statusText) this.statusText.textContent = `Quesito ${this.currentIndex + 1} di ${total}`;
    if (this.scoreText) this.scoreText.textContent = `Punteggio: ${this.score}/${this.currentIndex}`;

    let html = `
      <div class="question-card">
        <div class="q-number">Argomento: ${q.topic}</div>
        <div class="q-text">${q.question}</div>
        <div class="options-grid">
    `;

    const prefixes = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      html += `
        <button class="option-btn" data-index="${idx}">
          <span class="opt-letter">${prefixes[idx]}</span>
          <span class="option-label">${opt}</span>
        </button>
      `;
    });

    html += `
        </div>
        <div class="feedback-box" id="feedbackBox"></div>
        <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <button class="btn btn-quiz" id="nextQuestionBtn" style="display: none; width: auto; padding: 10px 22px;">
            ${this.currentIndex === total - 1 ? 'Visualizza Risultati Finali ➔' : 'Prossimo Quesito ➔'}
          </button>
        </div>
      </div>
    `;

    this.container.innerHTML = html;

    // Rirenderizza KaTeX per le formule
    if (window.renderMathInElement) {
      window.renderMathInElement(this.container, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ]
      });
    }

    const optionBtns = this.container.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.getAttribute('data-index'));
        this.handleAnswer(selectedIdx, optionBtns);
      });
    });

    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentIndex++;
        if (this.currentIndex < total) {
          this.renderCurrentQuestion();
        } else {
          this.showFinalResults();
        }
      });
    }
  }

  handleAnswer(selectedIdx, buttons) {
    const q = quizData[this.currentIndex];
    const isCorrect = selectedIdx === q.correct;
    const feedbackBox = document.getElementById('feedbackBox');
    const nextBtn = document.getElementById('nextQuestionBtn');

    buttons.forEach((b, idx) => {
      b.disabled = true;
      if (idx === q.correct) {
        b.classList.add('correct');
      } else if (idx === selectedIdx && !isCorrect) {
        b.classList.add('incorrect');
      }
    });

    if (isCorrect) {
      this.score++;
      feedbackBox.className = 'feedback-box callout callout-success';
      feedbackBox.innerHTML = `<strong>Corretto! Ottimo lavoro.</strong><br>${q.explanation}`;
    } else {
      feedbackBox.className = 'feedback-box callout callout-danger';
      feedbackBox.innerHTML = `<strong>Risposta non corretta.</strong><br>${q.explanation}`;
    }

    feedbackBox.style.display = 'block';
    if (nextBtn) nextBtn.style.display = 'inline-flex';

    if (window.renderMathInElement) {
      window.renderMathInElement(feedbackBox, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ]
      });
    }

    if (this.scoreText) this.scoreText.textContent = `Punteggio: ${this.score}/${this.currentIndex + 1}`;
  }

  showFinalResults() {
    this.container.style.display = 'none';
    if (this.resultsCard) {
      this.resultsCard.style.display = 'block';
      const total = quizData.length;
      const scoreNum = document.getElementById('finalScoreNumber');
      const feedbackTitle = document.getElementById('resultsFeedbackTitle');
      const feedbackDesc = document.getElementById('resultsFeedbackDesc');

      if (scoreNum) scoreNum.textContent = this.score;

      const percentage = (this.score / total) * 100;
      let title = '';
      let desc = '';

      if (percentage >= 90) {
        title = "🏆 Eccellente! Maestro delle Funzioni Reali!";
        desc = "Hai dimostrato una comprensione solida e approfondita di domini, classificazioni, grafici e strumenti digitali.";
      } else if (percentage >= 70) {
        title = "👏 Ottimo risultato! Buona comprensione!";
        desc = "Conosci bene i concetti cardine. Rivedi i pochi punti incerti consultando le sezioni di approfondimento.";
      } else if (percentage >= 50) {
        title = "📚 Buona base, ma serve ancora un po' di ripasso!";
        desc = "Rileggi con attenzione la pagina di definizione e classificazione per chiarire il calcolo dei domini e le simmetrie.";
      } else {
        title = "💪 Non scoraggiarti! Rivedi le sezioni e riprova!";
        desc = "Ti consigliamo di consultare la sezione di Definizione e il Laboratorio GeoGebra per visualizzare i concetti.";
      }

      if (feedbackTitle) feedbackTitle.textContent = title;
      if (feedbackDesc) feedbackDesc.textContent = desc;
      if (this.progressBar) this.progressBar.style.width = '100%';
    }
  }

  restart() {
    this.currentIndex = 0;
    this.score = 0;
    if (this.resultsCard) this.resultsCard.style.display = 'none';
    if (this.container) this.container.style.display = 'block';
    this.renderCurrentQuestion();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('quizQuestionsContainer')) {
    window.quizApp = new QuizApp();
  }
});
