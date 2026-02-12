import { createQuizEngine } from "./quizEngine.js";
import { quizData } from "./quizData.js";
export function initQuiz() 
{
    const engine = createQuizEngine(quizData);
    const quizLength = quizData.length;

    const startBtn = document.getElementById("startQuizBtn");
    const startScreen = document.getElementById("startScreen");
    const quizScreen = document.getElementById("quizScreen");
    const resultsScreen = document.getElementById("resultsScreen");
    const questionText = document.getElementById("questionText");
    const qestionNumber = document.getElementById("questionNumber");
    const answersContainer = document.getElementById("answersContainer");
    const resultsSummary = document.getElementById("resultsSummary");
    const retakeBtn = document.getElementById("retakeBtn");
    const progressFill = document.getElementById("progressFill");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const startExamBtn = document.getElementById("startExamBtn");


    function loadQuestion() 
    {
        const index = engine.getIndex();
        
        prevBtn.disabled = (index === 0);
        prevBtn.style.visibility = (index === 0 ? "hidden" : "visible");
        nextBtn.textContent = (index === quizLength - 1 ? "Submit" : "Next Question");

        const q = engine.getCurrentQuestion();
        questionText.textContent = q.question;
        qestionNumber.textContent = `Question ${engine.getIndex() + 1} of ${quizLength}`;
        answersContainer.innerHTML = "";
        q.answers.forEach((answer,index) => {
            const button = document.createElement("button");
            button.textContent = answer;
            button.classList.add("btn", "answer-btn");
            if(q.selected === index) {
                button.classList.add("selected");
            }
            button.addEventListener("click", () => {
                document.querySelectorAll(".answer-btn").forEach(btn => btn.classList.remove("selected"));
                button.classList.add("selected");
                engine.selectAnswer(index);
                updateProgressBar();
            });
            answersContainer.appendChild(button);
            
        });
        
    }


    function updateProgressBar() 
    {
        progressFill.style.width = `${engine.getprogress()}%`;
    }

    if(nextBtn)
    {
        nextBtn.style.transition = "visibility 0s, opacity 0.5s linear";
        nextBtn.addEventListener("click", () => {
        const q = engine.getCurrentQuestion();
        console.log("current question:"+ q.question);
            if(q.selected === null) {
                alert("Please select an answer before proceeding.");
                return;
            }
            engine.getNextQuestion();
            if(engine.getIndex() < quizLength) {
                loadQuestion();       
            }
            else {
                displayResults();
            }
        });
    }

    function displayResults() 
    {
        quizScreen.classList.remove("active");
        resultsScreen.classList.add("active");
        resultsSummary.textContent = `Your Score: ${engine.getScore()} out of ${quizLength}`;
    }

    if(retakeBtn)
    {
        retakeBtn.addEventListener("click", () => {
            engine.resetQuiz();
            resultsScreen.classList.remove("active");
            startScreen.classList.add("active");
            progressFill.style.width = `0%`;
        });
    }

    if(prevBtn)
    {
        prevBtn.style.transition = "visibility 0s, opacity 0.5s linear";

        prevBtn.addEventListener("click", () => {
            engine.getPreviousQuestion();
            if(engine.getIndex() >= 0) {
                loadQuestion();
            }
        });
    }

    if(startBtn) 
    {
        startBtn.addEventListener("click", () => {
            startScreen.classList.remove("active");
            quizScreen.classList.add("active");
            updateProgressBar();
            loadQuestion();
        });
    }

    if (startExamBtn) 
    {
        startExamBtn.addEventListener("click", () => {
            const proceed = confirm(
            "Once you start the exam, you cannot pause or exit without submitting.\n\nDo you want to continue?");

            if (proceed) 
            {
                window.location.href = "exam.html";
            }
        });
    }

    loadQuestion();

}

