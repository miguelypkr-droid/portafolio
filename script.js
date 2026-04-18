const draggable = document.getElementById('draggable');
const dropZone = document.querySelector('.drop-zone');
const letters = draggable.querySelectorAll('span');
let isDragging = false;
let offsetX, offsetY;
let posX = 0, posY = 0;
let prevX = 0, prevY = 0;
let rotations = new Array(letters.length).fill(0);

draggable.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - draggable.offsetLeft;
    offsetY = e.clientY - draggable.offsetTop;
    draggable.style.position = 'absolute';
    draggable.style.transition = 'none';
    posX = draggable.offsetLeft;
    posY = draggable.offsetTop;
    prevX = e.clientX;
    prevY = e.clientY;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;
        
        posX = newX;
        posY = newY;
        
        draggable.style.left = posX + 'px';
        draggable.style.top = posY + 'px';
        
        // Calcular velocidad
        const speedX = e.clientX - prevX;
        const speedY = e.clientY - prevY;
        
        // Aplicar rotación a cada letra basada en velocidad
        letters.forEach((letter, index) => {
            const rotationFactor = (index % 2 === 0 ? 1 : -1) * 0.05; // Alternar dirección
            rotations[index] += speedX * rotationFactor + speedY * rotationFactor * 0.5;
            letter.style.transform = `rotate(${rotations[index]}deg)`;
        });
        
        prevX = e.clientX;
        prevY = e.clientY;
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        
        // Verificar si está dentro de la drop-zone
        const rect = dropZone.getBoundingClientRect();
        const dragRect = draggable.getBoundingClientRect();
        
        const isInside = dragRect.left >= rect.left && 
                        dragRect.right <= rect.right && 
                        dragRect.top >= rect.top && 
                        dragRect.bottom <= rect.bottom;
        
        if (isInside) {
            dropZone.style.border = 'none';
        } else {
            dropZone.style.border = '2px dashed #ccc';
        }
    }
});