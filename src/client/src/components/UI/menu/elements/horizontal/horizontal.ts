import './horizontal.scss';

export function horizontal(elements: HTMLElement[]): HTMLDivElement {
    const horizontal = document.createElement('div');
    horizontal.classList.add('horizontal');
    elements.forEach(element => horizontal.appendChild(element));
    return horizontal;
}