const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endgameEl = document.getElementById('end-game-container');
const settingsBtn = document.getElementById('settings-btn');
const settings = document.getElementById('settings');
const settingsForm = document.getElementById('settings-form');
const difficultySelect = document.getElementById('difficulty');

// Init words
let randomWord;

// Init Score
let score = 0;

// Init time
let time = 10;

// Set difficulty to value in ls or medium
let difficulty =
  localStorage.getItem('difficulty') !== null
    ? localStorage.getItem('difficulty')
    : 'medium';

// Set difficulty select value
difficultySelect.value = difficulty;

// Focus on text on start
text.focus();

const apiUrl = 'https://random-word-api.herokuapp.com/word?number=10';

// List of words for game
async function getWords() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Generate random word from array
    function getRandomWord() {
      return data[Math.floor(Math.random() * data.length)];
    }

    // Add word to DOM
    function addWordToDOM() {
      randomWord = getRandomWord();
      word.innerHTML = randomWord;
    }

    // Update Score
    function updateScore() {
      score++;
      scoreEl.innerHTML = score;
    }

    //Update Time
    // Start counting down
    const timeInterval = setInterval(function updateTime() {
      time--;
      timeEl.innerHTML = time + 's';

      if (time === 0) {
        clearInterval(timeInterval);
        // end game
        gameOver();
      }

      //   Game over, show end screen
      function gameOver() {
        endgameEl.innerHTML = `
        <h1>Time ran out</h1>
        <p>Your final score is ${score}</p>
        <button onclick="location.reload()">Reload</button>
        `;

        endgameEl.style.display = 'flex';
      }
    }, 1000);

    addWordToDOM();

    // Event listeners (Typing)
    text.addEventListener('input', (e) => {
      const insertedText = e.target.value;

      if (insertedText === randomWord) {
        addWordToDOM();
        updateScore();

        // Clear
        e.target.value = '';

        if (difficulty === 'hard') {
          time += 2;
        } else if (difficulty === 'medium') {
          time += 4;
        } else {
          time += 5;
        }

        updateTime();
      }
    });

    // Settings btn click
    settingsBtn.addEventListener('click', () => {
      settings.classList.toggle('hide');
    });
    //Settings Select
    settingsForm.addEventListener('change', (e) => {
      difficulty = e.target.value;
      localStorage.setItem('difficulty', difficulty);
    });
  } catch (error) {
    console.log(error);
  }
}
getWords();
