const board = document.getElementById('game-board');
const startBtn = document.getElementById('start-btn');
const difficultyBtn = document.getElementById('difficulty-btn');
const timerDisplay = document.getElementById('timer');
const matchesDisplay = document.getElementById('matches');
const gridSizeSelect = document.getElementById('grid-size');
const modeSelect = document.getElementById('mode');

let gridSize = 4;
let mode = 'number';
let cards = [];
let firstCard = null;
let secondCard = null;
let matchedCount = 0;
let timer = 0;
let interval;
let difficultyLevel = 1;

const emojiSet = ['😀','🐶','🍎','🚗','🌈','🎵','⚽','🧠','💡','🎲','🎯','📚','🧸','🍕','🎁','🪁','🦄','🐸','🐼','🐧'];

function generateValues(size, mode) {
  const total = (size * size) / 2;
  let values = [];
  if (mode === 'number') {
    for (let i = 1; i <= total; i++) values.push(i);
  } else if (mode === 'alphabet') {
    for (let i = 0; i < total; i++) values.push(String.fromCharCode(65 + i));
  } else {
    for (let i = 0; i < total; i++) values.push(emojiSet[i % emojiSet.length]);
  }
  return [...values, ...values].sort(() => Math.random() - 0.5);
}

function createBoard(size, values) {
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  cards = [];
  matchedCount = 0;
  matchesDisplay.textContent = matchedCount;

  values.forEach((val, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = val;
    card.dataset.index = index;
    card.textContent = '';
    card.addEventListener('click', handleCardClick);
    board.appendChild(card);
    cards.push(card);
  });
}
function startEmojiRain() {
  const container = document.getElementById('emoji-rain-container');
  container.innerHTML = ''; // เคลียร์ก่อนเริ่มใหม่
  const emojis = ['🎉', '✨', '🥳', '🎊', '💫', '🎈', '🌟'];
  let count = 0;

  const rainInterval = setInterval(() => {
    const emoji = document.createElement('div');
    emoji.classList.add('emoji-drop');
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = `${Math.random() * 100}%`;
    emoji.style.fontSize = `${24 + Math.random() * 24}px`;
    emoji.style.animationDuration = `${2 + Math.random() * 2}s`;
    container.appendChild(emoji);

    setTimeout(() => emoji.remove(), 4000);

    count++;
    if (count > 100) clearInterval(rainInterval); // จำกัดจำนวน
  }, 100);
}

function createBoard(size, values) {
  board.innerHTML = '';
  board.className = `board grid-${size}`;
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  cards = [];
  matchedCount = 0;
  matchesDisplay.textContent = matchedCount;

  values.forEach((val, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = val;
    card.dataset.index = index;
    card.textContent = '';
    card.addEventListener('click', handleCardClick);
    board.appendChild(card);
    cards.push(card);
  });
}


function startGame() {
  document.getElementById('start-btn').classList.remove('button-animated');
  document.getElementById('win-effect').style.display = 'none';
  gridSize = parseInt(gridSizeSelect.value);
  mode = modeSelect.value;
  const values = generateValues(gridSize, mode);
  createBoard(gridSize, values);
  timer = 0;
  timerDisplay.textContent = '00:00';
  clearInterval(interval);
  interval = setInterval(() => {
  timer++;
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}, 1000);

}
function handleCardClick(e) {
  const card = e.target;
  if (card.classList.contains('revealed') || card.classList.contains('matched')) return;

  card.textContent = card.dataset.value;
  card.classList.add('revealed');

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    if (firstCard.dataset.value === secondCard.dataset.value) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      matchedCount++;
      matchesDisplay.textContent = matchedCount;
      if (matchedCount === (gridSize * gridSize) / 2) {
        clearInterval(interval);
        document.getElementById('start-btn').classList.add('button-animated');
        document.getElementById('win-effect').style.display = 'block';
        startEmojiRain();

      }
      firstCard = null;
      secondCard = null;
    } else {
      setTimeout(() => {
        firstCard.textContent = '';
        secondCard.textContent = '';
        firstCard.classList.remove('revealed');
        secondCard.classList.remove('revealed');
        firstCard = null;
        secondCard = null;
      }, 300);
    }
  }
}


startBtn.addEventListener('click', startGame);
difficultyBtn.addEventListener('click', increaseDifficulty);