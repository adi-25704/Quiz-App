import { quizData } from "./quizData.js";
import { createQuizEngine } from "./quizEngine.js";
import { createCountdownTimer } from "./timer.js";

export function initExam()
{
    const engine = createQuizEngine(quizData);
    const examLength = quizData.length;

    let duration = 1*60;
    const timer = createCountdownTimer({ duration: duration , onTick: handleTick, onComplete: handleTimeUp});

    const exitBtn = document.getElementById("exitBtn");
    const examScreen = document.getElementById("examScreen");
    const resultsScreen = document.getElementById("resultsScreen");
    const questionText = document.getElementById("questionText");
    const questionNumber = document.getElementById("questionNumber");
    const answersContainer = document.getElementById("answersContainer");
    const finalScore = document.getElementById("finalScore");
    const progressFill = document.getElementById("progressFill");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const examTimer = document.getElementById("exam-timer");
    const timeTaken = document.getElementById("timeTaken");



    window.addEventListener("beforeunload", (e) => 
    {
        if (timer.getStatus()) 
        {
            e.preventDefault();
            e.returnValue = "";
        }
    });

    function startExam() 
    {
        timer.start();
        updateProgressBar();
        loadQuestion();
    }

    if(exitBtn) 
    {
        exitBtn.style.transition = "visibility 0s, opacity 0.5s linear";
        exitBtn.addEventListener("click", () => {
            if(!engine.getIsComplete()) 
            {
                alert("Please answer all questions before submitting.");
                return;
            }
            if(confirm("Are you sure you want to submit?")) 
            {
                endExam("manual-submitted");
            }
        });
    }

    function loadQuestion() 
    {
        const index = engine.getIndex();
        
        prevBtn.disabled = (index === 0);
        prevBtn.style.visibility = (index === 0 ? "hidden" : "visible");
        nextBtn.disabled = (index === examLength - 1);
        nextBtn.style.visibility = (index === examLength -1 ? "hidden" : "visible");

        const q = engine.getCurrentQuestion();
        questionText.textContent = q.question;
        questionNumber.textContent = `Question ${engine.getIndex() + 1} of ${examLength}`;
        answersContainer.innerHTML = "";
        q.answers.forEach((answer,index) => {
            const button = document.createElement("button");
            button.textContent = answer;
            button.classList.add("btn", "answer-btn");
            if(engine.isSelected(index)) {
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

    if(prevBtn)
    {
        prevBtn.style.transition = "visibility 0s, opacity 0.5s linear";
        
        prevBtn.addEventListener("click", () => {
            engine.getPreviousQuestion();

            if(engine.isFirst()) {
                loadQuestion();
            }
        });
    }

    if(nextBtn)
    {
        nextBtn.style.transition = "visibility 0s, opacity 0.5s linear";
        nextBtn.addEventListener("click", () => {
            const q = engine.getCurrentQuestion();
            if(!engine.hasAnsweredCurrent()) {
                alert("Please select an answer before proceeding.");
                return;
            }
            engine.getNextQuestion();

            if(engine.isLast()) 
            {
                loadQuestion();       
            }
            
        });
    }
    
    function displayResults() 
    {
        examScreen.classList.remove("active");
        resultsScreen.classList.add("active");
        examTimer.textContent = "Exam Ended";
        exitBtn.disabled = true;
        exitBtn.style.visibility = "hidden";
        finalScore.textContent = `${engine.getScore()} out of ${examLength}`;
        timeTaken.textContent = `${Math.floor(timer.getMinutes())}:${(timer.getSeconds()).toString().padStart(2, '0')}`+ " Secs";
    }

    function updateProgressBar() 
    {
        progressFill.style.width = `${engine.getProgress()}%`;
    }

    function handleTick(mins, secs) 
    {
        const minutes = mins.toString().padStart(2, "0");
        const seconds = secs.toString().padStart(2, "0");

        examTimer.textContent = `${minutes}:${seconds}`;
        examTimer.setAttribute("datetime", `PT${minutes}M${seconds}S`);
    }

    function handleTimeUp() 
    {
        alert("Time's up! Your answers will be submitted.");
        endExam("time up");
    }

    function endExam(reason = "submitted") 
    {
        timer.stop();
        displayResults();
    }

    startExam();
}

