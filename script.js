// ===============================
// SUPABASE
// ===============================
const SUPABASE_URL =
  'https://tndzgnwqjufmlvfeyxpt.supabase.co';

const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZHpnbndxanVmbWx2ZmV5eHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTkyODUsImV4cCI6MjA5MzczNTI4NX0.UkUz9O_faMaWI65bPopamT1_mY6cVvZ8lXvb4-aUVi8';

const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );







// ===============================
// VARIABLES GLOBALES
// ===============================

const screens = document.querySelectorAll('.screen');
const completedText = document.getElementById('completed');
const progressBar = document.getElementById('progressBar');
const timerElement = document.getElementById('timer');


let playerName = '';
let startTime = null;
let completedRooms = 0;
let collectedCode = [];

let musicEnabled = false;

// ===============================
// NAVEGACIÓN ENTRE PANTALLAS
// ===============================

function showScreen(id) {

  screens.forEach(screen => {
    screen.classList.remove('active');
  });

  const target = document.getElementById(id);

  target.classList.add('active');
  target.classList.add('screen-transition');

  setTimeout(() => {
    target.classList.remove('screen-transition');
  }, 700);
}
function openRanking() {

  loadRanking();

  showScreen('rankingScreen');
}

function goBackHome() {

  showScreen('homeScreen');
}
// ===============================
// BOTONES INICIO
// ===============================

document.getElementById('startBtn').addEventListener('click', () => {

  const inputName =
    document.getElementById('playerName').value.trim();

  if(inputName === '') {

    alert('Introduce tu nombre');

    return;
  }

  playerName = inputName;

  startTime = Date.now();

  showScreen('storyScreen');
});

document.querySelector('[data-next="room1"]').addEventListener('click', () => {
  showScreen('room1');
});

// ===============================
// BARRA DE PROGRESO
// ===============================

function updateProgress() {

  completedRooms++;

  completedText.textContent = completedRooms;

  const progress = (completedRooms / 8) * 100;

  progressBar.style.width = `${progress}%`;
}

// ===============================
// FEEDBACK
// ===============================

function success(feedbackId, message) {

  const feedback = document.getElementById(feedbackId);

  feedback.style.color = '#00ff99';
  feedback.textContent = message;
}

function error(feedbackId, message, screenId) {

  const feedback = document.getElementById(feedbackId);

  feedback.style.color = '#ff4f7a';
  feedback.textContent = message;

  const screen = document.getElementById(screenId);

  screen.classList.add('shake');

  setTimeout(() => {
    screen.classList.remove('shake');
  }, 500);
}

// ===============================
// PRUEBA 1
// ===============================

function checkRoom1() {

  const value = document.getElementById('answer1').value;

  if (value == 6) {

    success('feedback1', '✔ ECUACIÓN CORRECTA — CIFRA OBTENIDA: 6');

    collectedCode.push('6');

    updateProgress();

    setTimeout(() => {
      showScreen('room2');
    }, 1800);

  } else {

    error('feedback1', '✖ RESPUESTA INCORRECTA', 'room1');
  }
}

// ===============================
// PRUEBA 2
// ===============================

function checkRoom2() {

  const x = document.getElementById('xValue').value;
  const y = document.getElementById('yValue').value;

  if (x == 4 && y == 7) {

    success('feedback2', '✔ CÓDIGO DESCUBIERTO: 47');

    collectedCode.push('4');

    updateProgress();

    setTimeout(() => {
      showScreen('room3');
    }, 1800);

  } else {

    error('feedback2', '✖ CÓDIGO INCORRECTO', 'room2');
  }
}

// ===============================
// PRUEBA 3
// ===============================

function checkRoom3() {

  const answer = document.getElementById('orderInput').value.trim();

  if (answer === '2,5,9') {

    success('feedback3', '✔ ORDEN CORRECTO — CIFRA: 2');

    collectedCode.push('2');

    updateProgress();

    setTimeout(() => {
      showScreen('room4');
    }, 1800);

  } else {

    error('feedback3', '✖ EL ORDEN NO ES CORRECTO', 'room3');
  }
}

// ===============================
// PRUEBA 4
// ===============================

function checkRoom4() {

  const value = document.getElementById('lockInput').value;

  if (value === '347') {

    success('feedback4', '✔ CANDADO ABIERTO — CIFRA: 3');

    collectedCode.push('3');

    updateProgress();

    setTimeout(() => {
      showScreen('room5');
    }, 1800);

  } else {

    error('feedback4', '✖ CÓDIGO INCORRECTO', 'room4');
  }
}

// ===============================
// PRUEBA 5 — PANEL LÁSER
// ===============================

const laserButtons = document.querySelectorAll('.laser-btn');

laserButtons.forEach(button => {

  button.addEventListener('click', () => {

    button.classList.toggle('active');
  });
});

function checkRoom5() {

  const activeButtons = document.querySelectorAll('.laser-btn.active');

  if (activeButtons.length === 3) {

    success('feedback5', '✔ PANEL ACTIVADO — CIFRA: 8');

    collectedCode.push('8');

    updateProgress();

    setTimeout(() => {
      showScreen('room6');
    }, 1800);

  } else {

    error('feedback5', '✖ CONFIGURACIÓN INCORRECTA', 'room5');
  }
}

// ===============================
// MEMORY GAME
// ===============================

const memoryData = [
  '2x=8', '4',
  'x+5=9', '4',
  '3x=15', '5',
  'x-1=6', '7'
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;

function shuffle(array) {

  return array.sort(() => Math.random() - 0.5);
}

function createMemoryGame() {

  const grid = document.getElementById('memoryGrid');

  const shuffled = shuffle([...memoryData]);

  shuffled.forEach(item => {

    const card = document.createElement('div');

    card.classList.add('memory-card');

    card.dataset.value = item;

    card.innerText = '?';

    card.addEventListener('click', () => flipCard(card));

    grid.appendChild(card);
  });
}

function flipCard(card) {

  if (lockBoard) return;

  if (card.classList.contains('flipped')) return;

  card.classList.add('flipped');

  card.innerText = card.dataset.value;

  if (!firstCard) {

    firstCard = card;
    return;
  }

  secondCard = card;

  lockBoard = true;

  checkMatch();
}

function checkMatch() {

  const value1 = firstCard.dataset.value;
  const value2 = secondCard.dataset.value;

  const correctMatch = (

    (value1 === '4' && value2 === '2x=8') ||
    (value2 === '4' && value1 === '2x=8') ||

    (value1 === '4' && value2 === 'x+5=9') ||
    (value2 === '4' && value1 === 'x+5=9') ||

    (value1 === '5' && value2 === '3x=15') ||
    (value2 === '5' && value1 === '3x=15') ||

    (value1 === '7' && value2 === 'x-1=6') ||
    (value2 === '7' && value1 === 'x-1=6')
  );

  if (correctMatch) {

    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    matches++;

    resetTurn();

    if (matches === 4) {

      success('feedback6', '✔ MEMORIA COMPLETADA — CIFRA: 5');

      collectedCode.push('5');

      updateProgress();

      setTimeout(() => {
        showScreen('room7');
      }, 2000);
    }

  } else {

    setTimeout(() => {

      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');

      firstCard.innerText = '?';
      secondCard.innerText = '?';

      resetTurn();

    }, 1000);
  }
}

function resetTurn() {

  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

createMemoryGame();

// ===============================
// PRUEBA FINAL
// ===============================

function finishGame() {

  const finalCode = document.getElementById('finalCode').value;
  const finalEquation = document.getElementById('finalEquation').value;

  const correctCode = collectedCode.join('');

  if (finalCode === correctCode && finalEquation == 5) {

    success('finalFeedback', '✔ PUERTA DESBLOQUEADA');

    const door = document.getElementById('door');

    door.classList.add('open');

    updateProgress();

    setTimeout(() => {

      showScreen('bossScreen');

    }, 3000);

  } else {

    error('finalFeedback', '✖ CÓDIGO O ECUACIÓN INCORRECTOS', 'room7');
  }
}
function checkBossLevel() {

  const answer =
    document.getElementById('bossAnswer').value;
  const bossAnswerEq =
    document.getElementById('bossAnswerEq').value;

  if((answer == '15,23' || answer == '23,15') && (bossAnswerEq == 'x + (x + 8) = 38' || bossAnswerEq == '2x + 8) = 38')) {
    
    saveScore();
    updateProgress();
    showScreen('victoryScreen');
    

  } else {

    error(
      'bossFeedback',
      '✖ SISTEMA AÚN ACTIVO',
      'bossScreen'
    );
  }
}
// ===============================
// REINICIAR
// ===============================

function restartGame() {

  location.reload();
}

// ===============================
// TEMPORIZADOR DECORATIVO
// ===============================

let seconds = 3599;

setInterval(() => {

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  timerElement.textContent =
    `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (seconds > 0) {
    seconds--;
  }

}, 1000);

// ===============================
// MÚSICA
// ===============================

const musicBtn = document.getElementById('musicBtn');

musicBtn.addEventListener('click', () => {

  musicEnabled = !musicEnabled;

  if (musicEnabled) {

    musicBtn.innerText = '🔈 Música OFF';

  } else {

    musicBtn.innerText = '🔊 Música ON';
  }
});

// ===============================
// EFECTO BRILLO DINÁMICO
// ===============================

const panels = document.querySelectorAll('.panel');

panels.forEach(panel => {

  panel.addEventListener('mousemove', (e) => {

    const rect = panel.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    panel.style.background =
      `radial-gradient(circle at ${x}px ${y}px,
      rgba(255,255,255,0.12),
      rgba(255,255,255,0.05))`;
  });

  panel.addEventListener('mouseleave', () => {

    panel.style.background = 'rgba(255,255,255,0.08)';
  });
});


window.addEventListener('load', () => {
  loadRanking();
});

async function saveScore() {

  const endTime = Date.now();

  const totalTime =
    Math.floor((endTime - startTime) / 1000);

  await supabaseClient
    .from('ranking')
    .insert([
      {
        player_name: playerName,
        completion_time: totalTime
      }
    ]);

  await loadRanking();
}

async function loadRanking() {

  const { data, error } =
    await supabaseClient
      .from('ranking')
      .select('*')
      .order('completion_time', {
        ascending: true
      })
      .limit(3);

  if(error) {

    console.error(error);

    return;
  }

  renderRanking(data);
}

function renderRanking(players) {

  console.log("Ranking: ", players);
  const ranking =
    document.getElementById('rankingList');

  ranking.innerHTML = '';
  
  players.forEach((player, index) => {
    console.log("Ranking: ", player);

    ranking.innerHTML += `
      <div class="ranking-item">
        🏆 #${index + 1}
        — ${player.player_name}
        — ${player.completion_time}s
      </div>
    `;
  });
}