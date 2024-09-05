var currentPosition = 1;
var diceValue = 0;
var dices = ["", "&#9856", "&#9857", "&#9858", "&#9859", "&#9860", "&#9861"];
var correctAnswer = "";
var targetPosition = 1;
var moveInterval;

var id = 100;
for (var a = 0; a < 5; a++) {
    for (var b = 0; b <= 9; b++) {
        document.getElementById("out").innerHTML += "<div class='boardbox left' id='box" + id + "'></div>";
        id--;
    }
    for (var c = 0; c <= 9; c++) {
        document.getElementById("out").innerHTML += "<div class='boardbox right' id='box" + id + "'></div>";
        id--;
    }
}

document.getElementById("box" + currentPosition).innerHTML = "<img id='counter' class='img' src='http://www.freepngimg.com/thumb/chess/9-chess-pawn-png-image-thumb.png'></img>";

function play() {
    currentPosition = 1;
    document.getElementById("out").style.visibility = "visible";
    document.getElementById("dice").style.visibility = "visible";
    document.getElementById("Play").style.visibility = "hidden";
    document.getElementById("dice").innerHTML = dices[1];
}

function random() {
    diceValue = Math.ceil(Math.random() * 6);
    document.getElementById("dice").innerHTML = dices[diceValue];
    targetPosition = currentPosition + diceValue;
    if (targetPosition > 100) {
        targetPosition = currentPosition; // Don't move if over 100
        return;
    }
    move();
}

function move() {
    moveInterval = setInterval(moveCounter, 200);
}

function moveCounter() {
    if (currentPosition < targetPosition) {
        currentPosition++;
        document.getElementById("box" + currentPosition).appendChild(document.getElementById("counter"));
    } else {
        clearInterval(moveInterval);
        checkForQuestionOrMove();
    }
}

function checkForQuestionOrMove() {
    // If the position has a question, ask it
    if (isQuestionPosition(currentPosition)) {
        askQuestion(getQuestion(currentPosition));
    } else {
        checkSnakesAndLadders();
    }
}

function isQuestionPosition(position) {
    return [99, 92, 73, 78, 37, 31].includes(position);
}

function getQuestion(position) {
    switch (position) {
        case 99: return { question: "What is 2+5?", answer: "7" };
        case 92: return { question: "What is 9-4?", answer: "5" };
        case 73: return { question: "What is 7*6?", answer: "42" };
        case 78: return { question: "What is 8/2?", answer: "4" };
        case 37: return { question: "What is 3+4?", answer: "7" };
        case 31: return { question: "What is 6-2?", answer: "4" };
        default: return { question: "", answer: "" };
    }
}

function askQuestion(questionObj) {
    correctAnswer = questionObj.answer;
    document.getElementById("question").innerText = questionObj.question;
    document.getElementById("question-dialog").style.display = "block";
}

function submitAnswer() {
    var userAnswer = document.getElementById("answer").value.trim();
    document.getElementById("question-dialog").style.display = "none";
    document.getElementById("answer").value = ""; // Clear input field
    if (userAnswer === correctAnswer) {
        targetPosition = currentPosition + diceValue; // Update target position to the final position
        move(); // Continue moving to the final target position
    } else {
        // Incorrect answer, move back according to snake
        moveBackOnSnake();
    }
}

function moveBackOnSnake() {
    var snakePositions = {
        99: 7,
        92: 35,
        73: 53,
        78: 39,
        37: 17,
        31: 14
    };
    
    if (snakePositions[currentPosition]) {
        currentPosition = snakePositions[currentPosition];
        document.getElementById("box" + currentPosition).appendChild(document.getElementById("counter"));
        if (currentPosition === 100) {
            showCongrats();
        } else {
            checkForQuestionOrMove(); // Check for snakes, ladders, or questions after the move
        }
    }
}

function checkSnakesAndLadders() {
    var snakeOrLadderPositions = {
        5: 25,
        10: 29,
        22: 41,
        28: 55,
        44: 95,
        70: 89,
        79: 81
    };

    if (snakeOrLadderPositions[currentPosition]) {
        moveToNewPosition(snakeOrLadderPositions[currentPosition]);
    } else if (currentPosition === 100) {
        showCongrats();
    }
}

function moveToNewPosition(position) {
    currentPosition = position;
    document.getElementById("box" + currentPosition).appendChild(document.getElementById("counter"));
    if (currentPosition === 100) {
        showCongrats();
    } else {
        checkForQuestionOrMove(); // Check for snakes, ladders, or questions after the move
    }
}

function closeDialog() {
    document.getElementById("question-dialog").style.display = "none";
}

function closeCongrats() {
    document.getElementById("congrats-dialog").style.display = "none";
}

function showCongrats() {
    document.getElementById("congrats-dialog").style.display = "block";
    setTimeout(closeCongrats, 30000); // Close after 30 seconds
}
