<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,400&display=swap" rel="stylesheet">
  <title>เกมทายตัวเลข & เกมความจำ & จำตัวเลข</title>
  <style>
    body {
      font-family: "Prompt", sans-serif;
      font-weight: 400;
      font-style: normal;
      text-align: center;
      background: #f9f9f9;
      padding: 20px;
    }

    h1 {
      margin-bottom: 30px;
    }

    section {
      margin-bottom: 40px;
    }

    input {
      padding: 5px;
      font-size: 16px;
    }

    button {
      padding: 5px 10px;
      font-size: 16px;
      margin-left: 10px;
      cursor: pointer;
    }

    #result, #memory-result, #recall-result {
      margin-top: 10px;
      font-weight: bold;
    }

    .game-board {
      display: grid;
      grid-template-columns: repeat(4, 80px);
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
    }

    .card {
      width: 80px;
      height: 80px;
      background: #333;
      color: white;
      font-size: 2em;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 8px;
      user-select: none;
    }

    .card.flipped {
      background: #fff;
      color: #333;
    }

    #number-sequence {
      font-size: 24px;
      margin: 15px 0;
      letter-spacing: 10px;
    }
  </style>
</head>
<body>
  <h1>🎮 เกมบนเว็บ JJ Vasitphon เบื้องต้น</h1>

  <!-- เกมทายตัวเลข -->
  <section id="number-game">
    <h2>🎯 เกมทายตัวเลข</h2>
    <p>ทายเลขระหว่าง 1 ถึง 100</p>
    <input type="number" id="guess" />
    <button onclick="checkGuess()">ทาย!</button>
    <p id="result"></p>
  </section>

  <hr />

  <!-- เกมความจำ -->
  <section id="memory-game">
    <h2>🧠 เกมความจำ</h2>
    <div class="game-board"></div>
    <p id="memory-result"></p>
  </section>

  <hr />

  <!-- เกมจำตัวเลข -->
  <section id="recall-game">
    <h2>🧮 เกมจำตัวเลข</h2>
    <button onclick="startRecallGame()">เริ่มเกม</button>
    <div id="number-sequence"></div>
    <input type="text" id="recall-input" placeholder="พิมพ์ตัวเลขที่จำได้" />
    <button onclick="submitRecall()">ส่งคำตอบ</button>
    <p id="recall-result"></p>
  </section>

  <script>
    // 🎯 เกมทายตัวเลข
    let secretNumber = Math.floor(Math.random() * 100) + 1;

    function checkGuess() {
      const guess = parseInt(document.getElementById('guess').value);
      const result = document.getElementById('result');

      if (isNaN(guess)) {
        result.innerText = '⛔ กรุณาใส่ตัวเลข';
        return;
      }

      if (guess === secretNumber) {
        result.innerText = '🎉 ถูกต้อง!';
      } else if (guess < secretNumber) {
        result.innerText = '🔼 มากกว่านี้';
      } else {
        result.innerText = '🔽 น้อยกว่านี้';
      }
    }

    // 🧠 เกมความจำ
    const board = document.querySelector('.game-board');
    const emojis = ['🍎', '🍌', '🍇', '🍓', '🍍', '🍉', '🥝', '🍒'];
    const emojiPairs = [...emojis, ...emojis];
    let shuffled = emojiPairs.sort(() => 0.5 - Math.random());
    let flippedCards = [];
    let matched = [];

    shuffled.forEach((emoji, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.emoji = emoji;
      card.dataset.index = index;
      card.innerText = '';
      board.appendChild(card);

      card.addEventListener('click', () => {
        if (
          flippedCards.length < 2 &&
          !card.classList.contains('flipped') &&
          !matched.includes(card)
        ) {
          card.classList.add('flipped');
          card.innerText = emoji;
          flippedCards.push(card);

          if (flippedCards.length === 2) {
            const [first, second] = flippedCards;
            if (first.dataset.emoji === second.dataset.emoji) {
              matched.push(first, second);
              flippedCards = [];
              if (matched.length === emojiPairs.length) {
                document.getElementById('memory-result').innerText = '🎉 จับคู่ครบแล้ว!';
              }
            } else {
              setTimeout(() => {
                first.classList.remove('flipped');
                second.classList.remove('flipped');
                first.innerText = '';
                second.innerText = '';
                flippedCards = [];
              }, 800);
            }
          }
        }
      });
    });

    // 🧮 เกมจำตัวเลข
    let recallSequence = [];
    let recallAttempts = 0;

    function startRecallGame() {
      recallSequence = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
      document.getElementById('number-sequence').innerText = recallSequence.join(' ');
      document.getElementById('recall-result').innerText = '';
      document.getElementById('recall-input').value = '';
      recallAttempts = 0;

      setTimeout(() => {
        document.getElementById('number-sequence').innerText = '';
      }, 3000); // แสดงตัวเลข 3 วินาที
    }

    function submitRecall() {
      const input = document.getElementById('recall-input').value.trim();
      const result = document.getElementById('recall-result');

      if (input === recallSequence.join('')) {
        result.innerText = '✅ ถูกต้อง!';
      } else {
        recallAttempts++;
        if (recallAttempts >= 3) {
          result.innerText = `❌ ผิดครบ 3 ครั้ง! เฉลยคือ: ${recallSequence.join('')}`;
        } else {
          result.innerText = `❌ ผิดแล้ว (${recallAttempts}/3 ครั้ง) ลองใหม่อีกครั้ง`;
        }
      }
    }
  </script>
</body>
</html>
