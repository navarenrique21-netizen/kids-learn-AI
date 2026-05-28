// Kids Learning - with timer, high score, sounds, bilingual
const levelsEN = [
  { name: '2 letters', description: 'Start with simple 2-letter words.', words: ['at','in','on','up','it','is','me','my','go','no','an','by','do','he','we'] },
  { name: '3 letters', description: 'Now try easy 3-letter words.', words: ['cat','dog','sun','hat','pig','bat','top','red','run','box','map','log','big','bed','cup'] },
  { name: '4 letters', description: 'Build confidence with 4-letter words.', words: ['play','jump','time','boat','food','book','rain','cold','fish','bell','milk','farm','snow','camp','star'] },
  { name: '5+ letters', description: 'Grow into longer words and keep learning.', words: ['happy','apple','house','water','train','smile','sleep','light','bread','green','party','river','grass','chair','table'] }
];

const levelsES = [
  { name: '2 letras', description: 'Empieza con palabras simples de 2 letras.', words: ['ya','va','ve','da','mi','tu','se','la','el','un','en','al','os','es','yo'] },
  { name: '3 letras', description: 'Ahora intenta palabras fáciles de 3 letras.', words: ['sol','pan','mar','luz','pez','pie','oso','ala','aro','uva','ojo','sal','red','voz','té'] },
  { name: '4 letras', description: 'Gana confianza con palabras de 4 letras.', words: ['casa','luna','agua','pato','mesa','sopa','gato','flor','tren','nube','mano','ropa','vida','cama','papa'] },
  { name: '5+ letras', description: 'Crece con palabras más largas.', words: ['feliz','manzana','escuela','familia','jugar','amigo','libro','verde','dulce','noche','perro','plaza','raton','silla','arbol'] }
];

const uiText = {
  en: { title: 'Build a', word: 'word', tap: 'Tap the letters in the correct order to spell one of the', hint: 'Here is the first letter. Keep going!', correct: 'Great job! That word is correct. Tap Next to keep learning.', try: 'Try building the word first.', almost: 'Almost there! Check the letters and try again.', submit:'Check', clear:'Clear', hintBtn:'Hint', say:'Say', next:'Next', score:'Score', high:'Best', time:'Time', lang:'ES' },
  es: { title: 'Forma una palabra de', word: 'palabra', tap: 'Toca las letras en orden para formar una de las', hint: 'Aquí está la primera letra. ¡Sigue!', correct: '¡Muy bien! Palabra correcta. Toca Siguiente.', try: 'Primero forma la palabra.', almost: '¡Casi! Revisa las letras e intenta de nuevo.', submit:'Revisar', clear:'Borrar', hintBtn:'Pista', say:'Decir', next:'Siguiente', score:'Puntos', high:'Récord', time:'Tiempo', lang:'EN' }
};

let lang = localStorage.getItem('kidsLang') || 'en';
let levels = lang === 'en' ? levelsEN : levelsES;
let t = uiText[lang];

const targetWordEl = document.getElementById('targetWord');
const letterButtonsEl = document.getElementById('letterButtons');
const answerDisplayEl = document.getElementById('answerDisplay');
const messageEl = document.getElementById('message');
const scoreEl = document.getElementById('score');
const highEl = document.getElementById('highScore');
const timeEl = document.getElementById('time');
const levelDescriptionEl = document.getElementById('levelDescription');
const levelButtons = document.querySelectorAll('.level-btn');
const lessonTitle = document.getElementById('lessonTitle');
const lessonText = document.getElementById('lessonText');

let activeLevel = 0;
let currentWord = '';
let lastWord = '';
let currentAnswer = '';
let score = 0;
let highScore = Number(localStorage.getItem('kidsHighScore') || 0);
let startTime = Date.now();

highEl.textContent = highScore;

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function setLang(newLang) {
  lang = newLang;
  localStorage.setItem('kidsLang', lang);
  levels = lang === 'en' ? levelsEN : levelsES;
  t = uiText[lang];
  document.getElementById('langToggle').textContent = t.lang;
  updateTexts();
  setActiveLevel(0);
}

function updateTexts() {
  document.getElementById('submitBtn').textContent = t.submit;
  document.getElementById('clearBtn').textContent = t.clear;
  document.getElementById('hintBtn').textContent = t.hintBtn;
  document.getElementById('sayBtn').textContent = t.say;
  document.getElementById('nextBtn').textContent = t.next;
  document.querySelector('label[for="score"]').textContent = t.score;
  document.querySelector('label[for="highScore"]').textContent = t.high;
  document.querySelector('label[for="time"]').textContent = t.time;
}

function setActiveLevel(index) {
  activeLevel = index;
  levelButtons.forEach((button, idx) => button.classList.toggle('active', idx === index));
  levelDescriptionEl.textContent = levels[index].description;
  lessonTitle.textContent = `${t.title} ${levels[index].name} ${t.word}`;
  lessonText.textContent = `${t.tap} ${levels[index].name} ${lang==='en'?'words':'palabras'}.`;
  messageEl.textContent = '';
  nextWord();
}

function nextWord() {
  const wordList = levels[activeLevel].words;
  do {
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
  } while (wordList.length > 1 && currentWord === lastWord);
  lastWord = currentWord;
  currentAnswer = '';
  targetWordEl.textContent = '?';
  answerDisplayEl.textContent = '';
  messageEl.textContent = '';
  renderLetters();
}

function renderLetters() {
  const letters = shuffle(currentWord.split(''));
  letterButtonsEl.innerHTML = '';
  letters.forEach(letter => {
    const btn = document.createElement('button');
    btn.textContent = letter.toUpperCase();
    btn.className = 'letter-btn';
    btn.type = 'button';
    btn.addEventListener('click', () => addLetter(letter, btn));
    letterButtonsEl.appendChild(btn);
  });
}

function addLetter(letter, button) {
  if (currentAnswer.length >= currentWord.length) return;
  currentAnswer += letter;
  answerDisplayEl.textContent = currentAnswer.toUpperCase();
  button.disabled = true;
}

function clearAnswer() {
  currentAnswer = '';
  answerDisplayEl.textContent = '';
  document.querySelectorAll('.letter-btn').forEach(b => b.disabled = false);
  messageEl.textContent = '';
}

function playSuccess() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(600, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.3);
  } catch(e){}
}

function checkAnswer() {
  if (!currentAnswer) { messageEl.textContent = t.try; return; }
  if (currentAnswer.toLowerCase() === currentWord) {
    targetWordEl.textContent = currentWord.toUpperCase();
    score += 1;
    scoreEl.textContent = score;
    if (score > highScore) {
      highScore = score;
      highEl.textContent = highScore;
      localStorage.setItem('kidsHighScore', String(highScore));
    }
    messageEl.textContent = t.correct;
    playSuccess();
    speakWord(currentWord);
    document.querySelectorAll('.letter-btn').forEach(b => b.disabled = true);
  } else {
    messageEl.textContent = t.almost;
  }
}

function showHint() {
  const hint = currentWord[0].toUpperCase() + ' ' + '_ '.repeat(currentWord.length - 1).trim();
  targetWordEl.textContent = hint;
  messageEl.textContent = t.hint;
}

function speakWord(word) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.rate = 0.9;
  u.lang = lang === 'es' ? 'es-MX' : 'en-US';
  window.speechSynthesis.speak(u);
}

// timer
setInterval(() => {
  const s = Math.floor((Date.now() - startTime) / 1000);
  const m = String(Math.floor(s/60)).padStart(2,'0');
  const sec = String(s%60).padStart(2,'0');
  timeEl.textContent = `${m}:${sec}`;
}, 1000);

document.getElementById('submitBtn').addEventListener('click', checkAnswer);
document.getElementById('clearBtn').addEventListener('click', clearAnswer);
document.getElementById('hintBtn').addEventListener('click', showHint);
document.getElementById('sayBtn').addEventListener('click', () => speakWord(currentWord));
document.getElementById('nextBtn').addEventListener('click', nextWord);
document.getElementById('langToggle').addEventListener('click', () => setLang(lang === 'en' ? 'es' : 'en'));

levelButtons.forEach(btn => {
  btn.addEventListener('click', () => setActiveLevel(Number(btn.dataset.level)));
});

updateTexts();
setActiveLevel(0);
