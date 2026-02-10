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
    correct: 2,
    selected: null
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    selected: null
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correct: 3,
    selected: null
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    answers: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correct: 1,
    selected: null
  },
  {
    question: "What is the smallest prime number?",
    answers: ["0", "1", "2", "3"],
    correct: 2,
    selected: null
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
const prevBtn = document.getElementById("prevBtn");
const startExamBtn = document.getElementById("startExamBtn");
var currentQuestionIndex = 0;

if (startExamBtn) {
  startExamBtn.addEventListener("click", () => {
    const proceed = confirm(
      "Once you start the exam, you cannot pause or exit without submitting.\n\nDo you want to continue?");

    if (proceed) {
      window.location.href = "exam.html";
    }
  });
}

if(startBtn) {
startBtn.addEventListener("click", () => {
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");
    updateProgressBar();
    loadQuestion();
});
}

function loadQuestion() {
    questionText.textContent = quizData[currentQuestionIndex].question;
    qestionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    answersContainer.innerHTML = "";
    quizData[currentQuestionIndex].answers.forEach((answer,index) => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.classList.add("btn", "answer-btn");
        if(quizData[currentQuestionIndex].selected == index) {
            button.classList.add("selected");
        }
        button.addEventListener("click", () => {
            document.querySelectorAll(".answer-btn").forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            quizData[currentQuestionIndex].selected = index;
            updateProgressBar();
        });
        answersContainer.appendChild(button);
        
    });
    
}

if(prevBtn)
{
    prevBtn.style.transition = "visibility 0s, opacity 0.5s linear";
    if(currentQuestionIndex === 0) {
        prevBtn.disabled = true;
        prevBtn.style.visibility = "hidden";

    }
    prevBtn.addEventListener("click", () => {
        currentQuestionIndex--;
        if(currentQuestionIndex === 0) {
            prevBtn.disabled = true;
            prevBtn.style.visibility = "hidden";
        }
        if(currentQuestionIndex >= 0) {
            loadQuestion();
        }
    });
}

if(nextBtn)
{
    nextBtn.addEventListener("click", () => {
        if(quizData[currentQuestionIndex].selected === null) {
            alert("Please select an answer before proceeding.");
            return;
        }
        updateProgressBar();
        currentQuestionIndex++;
        prevBtn.disabled = false;
        prevBtn.style.visibility = "visible";
        if(currentQuestionIndex === (quizData.length-1)) {
            nextBtn.textContent = "Submit";
            
        }
        if(currentQuestionIndex < quizData.length) {
            loadQuestion();       
        }
        else {
            displayResults();
        }
        
    });
}

if(retakeBtn)
{
    retakeBtn.addEventListener("click", () => {
        currentQuestionIndex = 0;
        quizData.forEach(q => {q.selected = null;});
        resultsScreen.classList.remove("active");
        startScreen.classList.add("active");
        progressFill.style.width = `0%`;
    });
}

function displayResults() {
    quizScreen.classList.remove("active");
    resultsScreen.classList.add("active");
    var score = quizData.filter(q => q.selected === q.correct).length;
    resultsSummary.textContent = `Your Score: ${score} out of ${quizData.length}`;
}

function updateProgressBar() {
    const answered = quizData.filter(q => q.selected !== null).length;
    progressFill.style.width = `${((answered) / quizData.length) * 100}%`;
}
