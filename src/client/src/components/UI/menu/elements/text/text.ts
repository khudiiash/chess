import './text.scss';

export function text(text: string, classes: string[] = []) {
  const textElement = document.createElement('div');
  textElement.classList.add('text');
  classes.forEach(c => textElement.classList.add(c));
  textElement.innerText = text;
  return textElement;
}