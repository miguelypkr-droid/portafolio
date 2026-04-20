const draggable = document.getElementById('draggable');
const dropZone = document.querySelector('.drop-zone');
const letters = draggable.querySelectorAll('.letter');
const cardArrows = document.querySelectorAll('.card-arrow');
const themeToggleButton = document.querySelector('.theme-toggle-button');

let isDragging = false;
let offsetX;
let offsetY;
let posX = 0;
let posY = 0;
let prevX = 0;
let prevY = 0;
const rotations = new Array(letters.length).fill(0);

draggable.addEventListener('mousedown', (event) => {
    isDragging = true;
    offsetX = event.clientX - draggable.offsetLeft;
    offsetY = event.clientY - draggable.offsetTop;
    draggable.style.position = 'absolute';
    draggable.style.transition = 'none';
    posX = draggable.offsetLeft;
    posY = draggable.offsetTop;
    prevX = event.clientX;
    prevY = event.clientY;
});

document.addEventListener('mousemove', (event) => {
    if (!isDragging) {
        return;
    }

    posX = event.clientX - offsetX;
    posY = event.clientY - offsetY;

    draggable.style.left = `${posX}px`;
    draggable.style.top = `${posY}px`;

    const speedX = event.clientX - prevX;
    const speedY = event.clientY - prevY;

    letters.forEach((letter, index) => {
        const rotationFactor = (index % 2 === 0 ? 1 : -1) * 0.05;
        rotations[index] += speedX * rotationFactor + speedY * rotationFactor * 0.5;
        letter.style.transform = `rotate(${rotations[index]}deg)`;
    });

    prevX = event.clientX;
    prevY = event.clientY;
});

document.addEventListener('mouseup', () => {
    if (!isDragging) {
        return;
    }

    isDragging = false;

    const rect = dropZone.getBoundingClientRect();
    const dragRect = draggable.getBoundingClientRect();

    const isInside = dragRect.left >= rect.left &&
        dragRect.right <= rect.right &&
        dragRect.top >= rect.top &&
        dragRect.bottom <= rect.bottom;

    void isInside;
});

function updateCardDetailsHeight(details, isOpen) {
    details.style.maxHeight = isOpen ? `${details.scrollHeight}px` : '0px';
}

cardArrows.forEach((arrow) => {
    const detailsId = arrow.getAttribute('aria-controls');
    const details = detailsId ? document.getElementById(detailsId) : null;

    if (!details) {
        return;
    }

    arrow.addEventListener('click', () => {
        const isOpen = details.classList.toggle('show');
        updateCardDetailsHeight(details, isOpen);
        arrow.classList.toggle('open', isOpen);
        arrow.setAttribute('aria-expanded', isOpen);
        details.setAttribute('aria-hidden', !isOpen);
    });
});

window.addEventListener('resize', () => {
    document.querySelectorAll('.card-details.show').forEach((details) => {
        updateCardDetailsHeight(details, true);
    });
});

if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        const isActive = document.body.classList.toggle('vaporwave-theme');
        themeToggleButton.setAttribute('aria-pressed', isActive);
    });
}