

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function updateDiceImage(diceElement, randomNumber) {
    const diceImage = `images/dice${randomNumber}.png`;
    diceElement.setAttribute('src', diceImage);
}

function rollBothDice() {
    const randomNumber1 = rollDice();
    const randomNumber2 = rollDice();

    
    const dice1 = document.querySelector('.img1');
    const dice2 = document.querySelector('.img2');
    updateDiceImage(dice1, randomNumber1);
    updateDiceImage(dice2, randomNumber2);

    const heading = document.querySelector('h1');
    if (randomNumber1 > randomNumber2) {
        heading.textContent = '🚩 Player 1 Wins!';
    } else if (randomNumber2 > randomNumber1) {
        heading.textContent = 'Player 2 Wins! 🚩';
    } else {
        heading.textContent = 'It\'s a Tie!';
    }
}

document.querySelector('.img1').addEventListener('click', function () {
    const randomNumber = rollDice();
    updateDiceImage(this, randomNumber);
    rollBothDice();
});

document.querySelector('.img2').addEventListener('click', function () {
    const randomNumber = rollDice();
    updateDiceImage(this, randomNumber);
    rollBothDice();
});

rollBothDice();
