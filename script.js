const textToType = document.getElementById('text-to-type');
const typingArea = document.getElementById('typing-area');
const timeDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const startBtn = document.getElementById('start-btn');
const timeSelect = document.getElementById('time-select');
const historyList = document.getElementById('history-list');

const textSamples = [
  "The quick brown fox jumps over the lazy dog.",
  "JavaScript is a versatile programming language.",
  "HTML and CSS are essential for web development.",
  "Typing games help improve your speed and accuracy.",
  "Practice makes perfect in the art of typing."
];

let selectedText = "";
let timeLeft = 60;
let timer;
let isPlaying = false;
let sentenceCount = 0;
let history = JSON.parse(localStorage.getItem('history')) || [];
history.reverse();

function startGame() {
  resetGame();
  timeLeft = parseInt(timeSelect.value);
  timeDisplay.textContent = timeLeft;
  loadNextSentence();
  typingArea.removeAttribute('disabled');
  typingArea.value = ''; 
  typingArea.focus();
  startBtn.textContent = "Restart";
  isPlaying = true;
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  timeDisplay.textContent = timeLeft;
  if (timeLeft <= 0) {
    endGame();
  }
}

function loadNextSentence() {
  selectedText = textSamples[Math.floor(Math.random() * textSamples.length)];
  renderText(selectedText);
}

function renderText(text) {
  textToType.innerHTML = text.split("").map(char => `<span>${char}</span>`).join("");
}

function calculateResults() {
  const typedText = typingArea.value;
  const textSpans = textToType.querySelectorAll('span');
  let correctChars = 0;

  textSpans.forEach((span, i) => {
    const typedChar = typedText[i];
    if (typedChar == null) {
      span.classList.remove('correct', 'incorrect');
    } else if (typedChar === span.textContent) {
      span.classList.add('correct');
      span.classList.remove('incorrect');
      correctChars++;
    } else {
      span.classList.add('incorrect');
      span.classList.remove('correct');
    }
  });

  const wordsTyped = typedText.split(' ').length;
  const accuracy = Math.round((correctChars / selectedText.length) * 100);
  const wpm = Math.round((wordsTyped / (60 - timeLeft)) * 60);

  accuracyDisplay.textContent = accuracy;
  wpmDisplay.textContent = wpm;

  if (typedText === selectedText) {
    sentenceCount++;
    const timeTaken = parseInt(timeSelect.value) - timeLeft;
    history.push({ sentence: selectedText, wpm: wpm, time: timeTaken });
    localStorage.setItem('history', JSON.stringify(history));
    loadNextSentence();
    typingArea.value = ''; 
  }
}

function endGame() {
    clearInterval(timer); 
    typingArea.setAttribute('disabled', true);
    isPlaying = false;
    calculateResults(); 
    updateHistory(parseInt(wpmDisplay.textContent));  
  
    alert('Stop!!! Time is up!');
  
  }

function updateHistory(wpm) {
  renderHistory();
}

function renderHistory() {
    let recentHistory = history.reverse().slice(0, 5);

    historyList.innerHTML = recentHistory.map(item => {
      return `<li>WPM: ${item.wpm}, Time: ${item.time}s, Sentence: "${item.sentence}"</li>`;
    }).join('');
}

function resetGame() {
  clearInterval(timer);
  typingArea.value = "";
  timeDisplay.textContent = timeLeft;
  wpmDisplay.textContent = 0;
  accuracyDisplay.textContent = 0;
  sentenceCount = 0;
  startBtn.textContent = "Start";
  typingArea.setAttribute('disabled', true);
}

startBtn.addEventListener('click', startGame);
typingArea.addEventListener('input', calculateResults);

renderHistory();