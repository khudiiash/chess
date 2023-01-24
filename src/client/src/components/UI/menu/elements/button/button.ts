import gsap from "gsap";
import "./button.scss";


export function button(text: string, callback: () => void, classes: string[] = []) {
  const button = document.createElement("button");
  button.classList.add("button");
  classes.forEach(c => button.classList.add(c));
  button.innerHTML = text;
  button.addEventListener("click", () => {
    gsap.to(button, { scale: 0.98, duration: 0.1, repeat: 1, yoyo: true });
    callback();
  });

  return button;
}