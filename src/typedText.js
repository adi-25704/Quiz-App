let index = 0;
let heading;
let text;
let hasTyped = false;
export function typedText(inputText, speed = 20) {
  if(hasTyped) return; 
  hasTyped = true;
  heading = document.getElementById("typed-heading");
  text = inputText;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    heading.textContent = text;
  } else {
    heading.textContent = "";
    function typeNextChar() {
        if (index < text.length) {
            heading.textContent += text.charAt(index);
            index++;
            setTimeout(typeNextChar, speed); 
        }
    }
    typeNextChar();
  }
}