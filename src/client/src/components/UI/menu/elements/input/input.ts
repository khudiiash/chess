import './input.scss'

export function input(placeholder: string, callback: (value: string) => void, classes: string[] = []) {
  const input = document.createElement('input');
  input.classList.add('input');
  classes.forEach(c => input.classList.add(c));
  input.placeholder = placeholder;
  input.addEventListener('input', () => {
    callback(input.value);
  });
  return input;
}