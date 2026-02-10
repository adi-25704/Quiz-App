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

const exitBtn = document.getElementById("exitBtn");
const startExamBtn = document.getElementById("startExamBtn");
const examScreen = document.getElementById("examScreen");
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
const examTimer = document.getElementById("exam-timer");
var currentQuestionIndex = 0;
var timeLeft = 1 * 10; // 30 minutes in seconds
var timerId;

if(examScreen)
{
    timerId = setInterval(updateTimer, 1000);
    updateProgressBar();
    loadQuestion();
}

if(exitBtn) {
    exitBtn.style.transition = "visibility 0s, opacity 0.5s linear";
    exitBtn.addEventListener("click", () => {
        if(quizData.filter(q => q.selected !== null).length < quizData.length) 
        {
            alert("Please answer all questions before submitting.");
            return;
        }
        if(confirm("Are you sure you want to submit?")) 
        {
            displayResults();
        }
        
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
        if(quizData[currentQuestionIndex].selected === index) {
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
        if(currentQuestionIndex === (quizData.length-1)) {
            nextBtn.disabled = false;
            nextBtn.style.visibility = "visible";  
        }
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
    nextBtn.style.transition = "visibility 0s, opacity 0.5s linear";
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
            nextBtn.disabled = true;
            nextBtn.style.visibility = "hidden";
            
        }
        if(currentQuestionIndex < quizData.length) {
            loadQuestion();       
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
    examScreen.classList.remove("active");
    resultsScreen.classList.add("active");
    exitBtn.disabled = true;
    exitBtn.style.visibility = "hidden";
    var score = quizData.filter(q => q.selected === q.correct).length;
    resultsSummary.textContent = `Your Score: ${score} out of ${quizData.length}`;
}

function updateProgressBar() {
    const answered = quizData.filter(q => q.selected !== null).length;
    progressFill.style.width = `${((answered) / quizData.length) * 100}%`;
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    examTimer.textContent = `${minutes}:${seconds}`;
    examTimer.setAttribute("datetime", `PT${minutes}M${seconds}S`);
    if (timeLeft <= 0) {         
        clearInterval(timerId);  
        alert("Time's up! Your answers will be submitted.");
        displayResults();
    }
    else
    {
        timeLeft--;
    }
}
