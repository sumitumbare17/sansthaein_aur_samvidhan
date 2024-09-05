const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const questionContainer = document.getElementById('questionContainer');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');

const segments = [
    { text: 'Legislature', image: 'path/to/parliament.png' },
    { text: 'Judiciary', image: 'path/to/gavel.png' },
    // Add more segments as needed
];

const questions = {
    'Legislature': {
        text: 'What is the primary role of the Legislature?',
        options: [
            { text: 'Judicial Review', correct: false },
            { text: 'Law Making', correct: true },
            { text: 'Executive Decisions', correct: false },
            { text: 'Administrative Functions', correct: false }
        ]
    },
    'Judiciary': {
        text: 'What is the primary function of the Judiciary?',
        options: [
            { text: 'Law Enforcement', correct: false },
            { text: 'Law Interpretation', correct: true },
            { text: 'Legislative Proposals', correct: false },
            { text: 'Policy Formulation', correct: false }
        ]
    },
    // Add more questions as needed
};

let isSpinning = false;
let startAngle = 0;
const arc = Math.PI / (segments.length / 2);
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;

function drawRouletteWheel() {
    const imgPromises = segments.map(segment => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = segment.image;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    });

    Promise.all(imgPromises).then(images => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.font = '16px Arial';

        for (let i = 0; i < segments.length; i++) {
            const angle = startAngle + i * arc;
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(angle);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);

            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, angle + arc);
            ctx.lineTo(canvas.width / 2, canvas.height / 2);
            ctx.closePath();
            ctx.fillStyle = i % 2 === 0 ? '#FFCC00' : '#FF9900';
            ctx.fill();

            const img = images[i];
            ctx.save();
            ctx.clip();
            ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2, img.width, img.height);
            ctx.restore();
            
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(segments[i].text, canvas.width / 2, canvas.height / 2);
            ctx.restore();
        }

        // Arrow
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 4, canvas.height / 2 - (canvas.width / 2) - 10);
        ctx.lineTo(canvas.width / 2 + 4, canvas.height / 2 - (canvas.width / 2) - 10);
        ctx.lineTo(canvas.width / 2 + 4, canvas.height / 2 - (canvas.width / 2) - 20);
        ctx.lineTo(canvas.width / 2 + 9, canvas.height / 2 - (canvas.width / 2) - 20);
        ctx.lineTo(canvas.width / 2, canvas.height / 2 - (canvas.width / 2) - 30);
        ctx.lineTo(canvas.width / 2 - 9, canvas.height / 2 - (canvas.width / 2) - 20);
        ctx.lineTo(canvas.width / 2 - 4, canvas.height / 2 - (canvas.width / 2) - 20);
        ctx.lineTo(canvas.width / 2 - 4, canvas.height / 2 - (canvas.width / 2) - 10);
        ctx.fill();
    });
}

function rotateWheel() {
    spinAngleStart += Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 4000;
    rotate();
}

function rotate() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    const spinAngle = spinAngleStart * (1 - spinTime / spinTimeTotal);
    startAngle += spinAngle * Math.PI / 180;
    drawRouletteWheel();
    spinTimeout = setTimeout(rotate, 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = arc * 180 / Math.PI;
    const index = Math.floor((360 - degrees % 360) / arcd);
    const selectedSegment = segments[index];

    // Add glow effect
    document.getElementById('wheelCanvas').classList.add('glow');

    // Display the question based on the selected segment
    showQuestion(selectedSegment.text);
    isSpinning = false;
}

function showQuestion(segment) {
    questionText.textContent = questions[segment].text;
    optionsContainer.innerHTML = '';
    questions[segment].options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.className = 'optionButton';
        button.onclick = () => handleAnswer(option.correct);
        optionsContainer.appendChild(button);
    });
    questionContainer.classList.remove('hidden');
}

function handleAnswer(isCorrect) {
    if (isCorrect) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
    // Optionally disable further answers or show feedback
}

function resetGame() {
    questionContainer.classList.add('hidden');
    document.getElementById('wheelCanvas').classList.remove('glow');
}

function spinWheel() {
    if (!isSpinning) {
        isSpinning = true;
        rotateWheel();
    }
}

drawRouletteWheel();
