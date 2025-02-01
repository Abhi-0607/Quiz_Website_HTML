const apiUrl = "https://cors-anywhere.herokuapp.com/https://api.jsonserve.com/Uw5CrX";


const startScreen = document.getElementById("start-screen");
const quizContainer = document.getElementById("quiz-container");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const scoreDisplay = document.getElementById("score");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Fetch quiz data
async function fetchQuestions() {
    try {
        let response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        let data = await response.json();
        
        if (!data.questions || data.questions.length === 0) {
            throw new Error("No questions found in API.");
        }

        questions = data.questions;
        startQuiz();
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        alert("Failed to load quiz. Please try again later.");
    }
}

// Start Quiz
function startQuiz() {
    startScreen.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

// Display current question
function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];

    questionText.innerText = currentQuestion.description;

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option.option;
        button.classList.add("option");
        button.addEventListener("click", () => selectAnswer(index, currentQuestion.correct));
        optionsContainer.appendChild(button);
    });
}

// Reset question state
function resetState() {
    optionsContainer.innerHTML = "";
    nextBtn.classList.add("hidden");
}

// Handle answer selection
function selectAnswer(selectedIndex, correctIndex) {
    const options = document.querySelectorAll(".option");
    options.forEach((option, index) => {
        if (index === correctIndex) {
            option.style.backgroundColor = "green";
        } else if (index === selectedIndex) {
            option.style.backgroundColor = "red";
        }
        option.disabled = true;
    });

    if (selectedIndex === correctIndex) {
        score += 10;
    }

    nextBtn.classList.remove("hidden");
}

// Move to the next question or show results
nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

// Display quiz result
function showResult() {
    quizContainer.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    scoreDisplay.innerText = `${score} / ${questions.length * 10}`;
}

// Restart Quiz
restartBtn.addEventListener("click", () => {
    resultScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
});

// Start Quiz on button click
startBtn.addEventListener("click", fetchQuestions);
