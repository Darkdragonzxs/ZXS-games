// Hide the system cursor completely
document.body.style.cursor = 'none';

// Create the custom cursor element
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

// Add styles dynamically
const style = document.createElement('style');
style.innerHTML = `
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 16px;
  height: 20px;
  background: #fff; /* solid white */
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  border-radius: 3px;
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

// Move the cursor with the mouse
document.addEventListener('mousemove', e => {
  cursor.style.top = e.clientY + 'px';
  cursor.style.left = e.clientX + 'px';
});

// Add hover effects on interactive elements
const addHoverEffect = (selector='button, input, a') => {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
};

// Initial binding
addHoverEffect();

// Optional: dynamically rebind if new elements are added later
window.addEventListener('DOMContentLoaded', () => addHoverEffect());
