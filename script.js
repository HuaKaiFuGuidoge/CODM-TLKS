let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = [];

async function loadQuestions() {
    const response = await fetch('./json/mata.json');
    const data = await response.json();
    const keys = Object.keys(data);

    while (questions.length < 10) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        if (!questions.some(q => q.key === randomKey)) {
            questions.push({ key: randomKey, name: Object.keys(data[randomKey])[0], mp3: data[randomKey][Object.keys(data[randomKey])[0]] });
        }
    }
}

function showModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function startQuiz() {
    closeModal();
    resetQuiz();
    loadQuestion();
}

function resetQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = [];
    document.getElementById('quiz').innerHTML = '';
    document.getElementById('nextButton').style.display = 'none';
    document.getElementById('retryButton').style.display = 'none';
    questions = [];
    loadQuestions().then(() => loadQuestion());
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    const questionElement = document.getElementById('quiz');

    const audio = new Audio(`./mp3/${question.mp3}`);
    audio.addEventListener('ended', () => {
        document.getElementById('playAgainBtn').disabled = false;
    });

    document.getElementById('audioControls').innerHTML = `
        <button class="listen-again-btn" id="playAgainBtn" onclick="playAudio('${question.mp3}')">再听一遍</button>
    `;

    let options = [question.name];
    const allNames = questions.map(q => q.name);
    while (options.length < 4) {
        const randomOption = allNames[Math.floor(Math.random() * allNames.length)];
        if (!options.includes(randomOption)) {
            options.push(randomOption);
        }
    }

    options = options.sort(() => Math.random() - 0.5);

    questionElement.innerHTML = `
        <div class="question">第 ${currentQuestionIndex + 1} 题</div>
        <audio controls autoplay class="default-audio">
            <source src="./mp3/${question.mp3}" type="audio/mp3">
        </audio>
        <div class="options">
            ${options.map((option, index) => {
                return `<button class="option-btn" onclick="checkAnswer('${option}', '${question.name}', '${question.mp3}')">${option}</button>`;
            }).join('')}
        </div>
    `;
}

function checkAnswer(selected, correct, mp3) {
    const result = document.createElement('div');
    result.classList.add('result');
    if (selected === correct) {
        result.textContent = '回答正确！';
        result.classList.add('correct');
        correctAnswers++;
    } else {
        result.textContent = `回答错误！正确答案是：${correct}`;
        result.classList.add('incorrect');
        wrongAnswers.push({ selected, correct, mp3 });
    }
    document.getElementById('quiz').appendChild(result);
    document.getElementById('nextButton').style.display = 'inline-block';
}

function loadNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
        document.getElementById('nextButton').style.display = 'none';
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quiz').innerHTML = `
        <div class="result">测试完成！你答对了 ${correctAnswers} / 10。</div>
        <div class="result">正确答案：</div>
        <ul>${questions.map((q, index) => `<li>第 ${index + 1} 题: ${q.name}</li>`).join('')}</ul>
        <div class="result">错误答案：</div>
        <ul>${wrongAnswers.map(wrong => `<li>第 ${questions.findIndex(q => q.mp3 === wrong.mp3) + 1} 题: 选择了 ${wrong.selected}, 正确答案是 ${wrong.correct}</li>`).join('')}</ul>
    `;
    document.getElementById('nextButton').style.display = 'none';
    document.getElementById('retryButton').style.display = 'inline-block';
}

function retryQuiz() {
    resetQuiz();
    startQuiz();
}

function playAudio(mp3) {
    const audio = new Audio(`./mp3/${mp3}`);
    audio.play();
    document.getElementById('playAgainBtn').disabled = true;
}

loadQuestions();

window.onload = function () {
    showModal();
}