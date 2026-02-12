export function createQuizEngine(initialData) 
{
    let currentQuestionIndex = 0;
    const quizData = structuredClone(initialData);

    function getCurrentQuestion() 
    {
        return quizData[currentQuestionIndex];
    }

    function selectAnswer(index) 
    {
        quizData[currentQuestionIndex].selected = index;
    }
    
    function getprogress() 
    {
        const answered = quizData.filter(q => q.selected !== null).length;
        return (answered / quizData.length) * 100;
    }

    function getNextQuestion() 
    {
        currentQuestionIndex++;
        return quizData[currentQuestionIndex];
    }

    function getPreviousQuestion() 
    {
        currentQuestionIndex--;
        return quizData[currentQuestionIndex];
    }

    function getScore() 
    {
        return quizData.filter(q => q.selected === q.correct).length;
    }

    function resetQuiz() 
    {
        currentQuestionIndex = 0;
        quizData.forEach(q => {q.selected = null;});
    }

    function getselectedCount() 
    {
        return quizData.filter(q => q.selected !== null).length;
    }

    return {
        getCurrentQuestion,
        selectAnswer,
        getIndex: () => currentQuestionIndex,
        getprogress,
        getNextQuestion,
        getPreviousQuestion,
        getScore,
        resetQuiz,
        getselectedCount
    };
}