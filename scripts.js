let index = 0;
let heading;
let text;
let hasTyped = false;
export function typedText(inputText) {
  if(hasTyped) return; // Prevent re-typing if already done
  hasTyped = true;
  heading = document.getElementById("typed-heading");
  text = inputText;

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    // Show text instantly
    heading.textContent = text;
  } else {
    // Typing effect (runs once, then persists)
    heading.textContent = "";
    function typeNextChar() {
        if (index < text.length) {
            heading.textContent += text.charAt(index);
            index++;
            setTimeout(typeNextChar, 20); // typing speed (ms)
        }
    }
    typeNextChar();
  }
}



const quizData = [
  {
    question: "What is the capital of France?",
    answers: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correct: 3
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    answers: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correct: 1
  },
  {
    question: "What is the smallest prime number?",
    answers: ["0", "1", "2", "3"],
    correct: 2
  }
];

const startBtn = document.getElementById("startQuizBtn");
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultsScreen = document.getElementById("resultsScreen");
const questionText = document.getElementById("questionText");
const qestionNumber = document.getElementById("questionNumber");
const answersContainer = document.getElementById("answersContainer");
const resultsSummary = document.getElementById("resultsSummary");
const retakeBtn = document.getElementById("retakeBtn");
const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const nextBtn = document.getElementById("nextBtn");
var currentQuestionIndex = 0;
var score = 0;
var selectedAnswerIndex = null;
if(startBtn) {
startBtn.addEventListener("click", () => {
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");
    loadQuestion();
});
}

function loadQuestion() {
    progressFill.style.width = `${((currentQuestionIndex) / quizData.length) * 100}%`;
    questionText.textContent = quizData[currentQuestionIndex].question;
    qestionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    answersContainer.innerHTML = "";
    quizData[currentQuestionIndex].answers.forEach((answer,index) => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.classList.add("btn", "answer-btn");
        button.addEventListener("click", () => {
            document.querySelectorAll(".answer-btn").forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            selectedAnswerIndex = index;
        });
        answersContainer.appendChild(button);
        
    });
    
}

if(nextBtn)
{
nextBtn.addEventListener("click", () => {
            if(selectedAnswerIndex === null) {
                alert("Please select an answer before proceeding.");
                return;
            }
            if(selectedAnswerIndex === quizData[currentQuestionIndex].correct) {
                score++;
                console.log("Correct! Score: " + score);
                progressFill.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;
            }
            currentQuestionIndex++;
            selectedAnswerIndex = null;
            if(currentQuestionIndex < quizData.length) {
                loadQuestion(currentQuestionIndex, score, selectedAnswerIndex);
            } else {
                quizScreen.classList.remove("active");
                resultsScreen.classList.add("active");
                resultsSummary.textContent = `Your Score: ${score} out of ${quizData.length}`;
            }
        });
    }

if(retakeBtn)
{
retakeBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswerIndex = null;
    resultsScreen.classList.remove("active");
    startScreen.classList.add("active");
    progressFill.style.width = `0%`;
});
}