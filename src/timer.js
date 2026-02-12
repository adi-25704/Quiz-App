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
            timeLeft--;
            let minutes = Math.floor((timeLeft) / 60);
            let seconds = (timeLeft) % 60;
            onTick?.(minutes,seconds);

            if (timeLeft <= 0) {
                stop();
                onComplete?.();
                return;
            }
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
        duration = newDuration;
    }

    return {
        start,
        stop,
        reset,
        getMinutes: () => Math.floor((duration - timeLeft)/60),
        getSeconds: () => (duration - timeLeft) % 60,
        getStatus: ()=> running
    };
}
