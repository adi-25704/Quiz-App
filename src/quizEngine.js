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
    
    function getProgress() 
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

    function getIsComplete() 
    {
        return !(quizData.filter(q => q.selected !== null).length < quizData.length);
    }

    function hasAnsweredCurrent()
    {
        return quizData[currentQuestionIndex].selected !== null;
    }

    function isSelected(index)
    {
        return quizData[currentQuestionIndex].selected === index;
    }

    function isLast()
    {
        return currentQuestionIndex < quizData.length;
    }

    function isFirst()
    { 
        return currentQuestionIndex >= 0;    
    }


    return {
        getCurrentQuestion,
        selectAnswer,
        getIndex: () => currentQuestionIndex,
        getProgress,
        getNextQuestion,
        getPreviousQuestion,
        getScore,
        resetQuiz,
        getIsComplete,
        hasAnsweredCurrent,
        isSelected,
        isLast,
        isFirst
    };
}