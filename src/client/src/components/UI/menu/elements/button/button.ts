import gsap from "gsap";
import "./button.scss";


export function button(text: string, callback: () => void, classes: string[] = []) {
  const button = document.createElement("button");
  button.classList.add("button");
  classes.forEach(c => button.classList.add(c));
  button.innerHTML = text;
  button.addEventListener("click", () => {
    gsap.to(button, { scale: 0.95, duration: 0.05, ease: "power2.in", repeat: 1, yoyo: true });
    callback();
  });

  return button;
}