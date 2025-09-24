document.querySelectorAll('body, input, textarea, button, a').forEach(el => el.style.cursor = 'none');

const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

const style = document.createElement('style');
style.innerHTML = `
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 12px;
  height: 12px;
  background: #fff;
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  border-radius: 4px;
  transform: translate(-50%, -50%) rotate(-15deg);
  pointer-events: none;
  transition: transform 0.08s ease-out, background 0.2s;
  z-index: 10000;
}
.custom-cursor.hovering {
  background: #00c6ff;
  transform: translate(-50%, -50%) rotate(-15deg) scale(1.2);
}
`;
document.head.appendChild(style);

document.addEventListener('mousemove', e => {
  cursor.style.top = e.clientY + 'px';
  cursor.style.left = e.clientX + 'px';
});

const addHoverEffect = (selector='button, input, a, textarea') => {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
};

addHoverEffect();
window.addEventListener('DOMContentLoaded', () => addHoverEffect());
