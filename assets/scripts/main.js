const draggable = document.getElementById('draggable');
const dropZone = document.querySelector('.drop-zone');
const letters = draggable.querySelectorAll('.letter');
const cardArrows = document.querySelectorAll('.card-arrow');
const themeToggleButton = document.querySelector('.theme-toggle-button');
const vaporwaveAudio = document.getElementById('vaporwave-audio');
const themeCurtain = document.querySelector('.theme-curtain');

const CURTAIN_CLOSE_MS = 420;
const CURTAIN_OPEN_MS = 520;

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

function wait(ms) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

async function playVaporwaveAudio() {
    if (!vaporwaveAudio) {
        return;
    }

    vaporwaveAudio.volume = 0.55;

    try {
        await vaporwaveAudio.play();
    } catch (error) {
        console.warn('No se pudo reproducir la musica VaporWave.', error);
    }
}

function stopVaporwaveAudio() {
    if (!vaporwaveAudio) {
        return;
    }

    vaporwaveAudio.pause();
    vaporwaveAudio.currentTime = 0;
}

function syncThemeToggleButton(isActive) {
    if (!themeToggleButton) {
        return;
    }

    themeToggleButton.textContent = isActive ? 'Future' : 'VaporWave';
    themeToggleButton.setAttribute('aria-pressed', isActive);
}

async function runThemeCurtainAnimation(applyThemeChange) {
    if (!themeCurtain) {
        applyThemeChange();
        return;
    }

    document.body.classList.add('theme-transitioning');
    themeCurtain.classList.add('is-animating', 'is-closing');
    themeCurtain.classList.remove('is-opening');

    await wait(CURTAIN_CLOSE_MS);
    applyThemeChange();

    themeCurtain.classList.remove('is-closing');
    themeCurtain.classList.add('is-opening');

    await wait(CURTAIN_OPEN_MS);
    themeCurtain.classList.remove('is-animating', 'is-opening');
    document.body.classList.remove('theme-transitioning');
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
    syncThemeToggleButton(document.body.classList.contains('vaporwave-theme'));

    themeToggleButton.addEventListener('click', async () => {
        if (document.body.classList.contains('theme-transitioning')) {
            return;
        }

        let isActive = document.body.classList.contains('vaporwave-theme');

        await runThemeCurtainAnimation(() => {
            isActive = document.body.classList.toggle('vaporwave-theme');
            syncThemeToggleButton(isActive);
        });

        if (isActive) {
            await playVaporwaveAudio();
            return;
        }

        stopVaporwaveAudio();
    });
}