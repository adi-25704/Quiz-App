export function createCountdownTimer({ duration, onTick, onComplete}) 
{
    let timeLeft = duration;
    let intervalId = null;
    let running = false;

    function start() 
    {
        if (running) return;
        running = true;

        intervalId = setInterval(() => 
        {
            if (timeLeft <= 0) {
                stop();
                onComplete?.();
                return;
            }

            timeLeft--;
            onTick?.(timeLeft);
        }, 1000);
    }

    function stop() 
    {
        if (!running) return;

        clearInterval(intervalId);
        running = false;
    }

    function reset(newDuration = duration) 
    {
        stop();
        timeLeft = newDuration;
    }

    return {
        start,
        stop,
        reset,
        getTimeLeft: () => timeLeft,
        getStatus: ()=> running
    };
}
