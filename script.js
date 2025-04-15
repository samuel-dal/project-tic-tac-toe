const boardGrids = document.querySelectorAll('.board-container > button');
const boardPlayerP = document.querySelectorAll('.board-container > p');
const boardPlayerSpan = document.querySelectorAll('.board-container > p > span');
const result = document.querySelector('.result');
const root = document.querySelector(':root');
const buttons = document.querySelectorAll('.bottom-btn > *');

let playerOneFirst = true;
let numberMove = playerOneFirst ? 1 : 2;
let winPlayer = '';
let player1 = 'O';
let player2 = 'X';

const players = {
   playerOne: '', 
   playerTwo: '', 
   playerOneScore: 0, 
   playerTwoScore: 0
}

const updateScore = () => {
   boardPlayerSpan[4].textContent = players.playerOneScore;
   boardPlayerSpan[5].textContent = players.playerTwoScore;
}

updateScore();

const playerNextTurn = () => {
   if (numberMove % 2 !== 0) {
      boardPlayerP[2].style.borderRight = 'var(--current-move)';
      boardPlayerP[1].style.borderRight = 'var(--next-move)';
      return;
   }

   if (numberMove % 2 === 0) {
      boardPlayerP[1].style.borderRight = 'var(--current-move)';
      boardPlayerP[2].style.borderRight = 'var(--next-move)';
   }
}

playerNextTurn();

let winPattern = [
   '123', 
   '456', 
   '789', 
   '147', 
   '258', 
   '369', 
   '159', 
   '357'
];

const playAgain = () => {
   playerOneFirst = !playerOneFirst;
   numberMove = playerOneFirst ? 1 : 2;
   players.playerOne = '';
   players.playerTwo = '';
   result.textContent = '';
   winPlayer = '';
   root.style.setProperty('--show-btn', 'none');
   boardGrids.forEach(boardItem => boardItem.textContent = '');
   boardPlayerP.forEach(playerItem => playerItem.style.color = 'white');
   updateScore();
   playerNextTurn();
}

const reset = () => {
   players.playerOneScore = 0;
   players.playerTwoScore = 0;
   playAgain()
   playerOneFirst = true;
   numberMove = playerOneFirst ? 1 : 2;
   playerNextTurn();
}

const resetColor = (setColor) => {
   boardGrids.forEach(gridItem => {
      gridItem.style.color = setColor;
   })
}


const playersMove = (targetElement) => {
   if (numberMove % 2 === 0 && !targetElement.textContent) {
      players.playerTwo += targetElement.value;
      numberMove++;
      playerNextTurn();
      return targetElement.textContent = player2;
   } 
   
   if (numberMove % 2 !== 0 && !targetElement.textContent) {
      players.playerOne += targetElement.value;
      numberMove++;
      playerNextTurn();
      return targetElement.textContent = player1;
   }
}

const checkWinner = () => {
   let { playerOne, playerTwo } = players;
   if (numberMove > 5) {

      winPattern.forEach(winItem => {
         let winRegexPattern = new RegExp(`[${winItem}]`, 'g');
         let playerOneMatch = playerOne.match(winRegexPattern);
         let playerTwoMatch = playerTwo.match(winRegexPattern);

         if (playerOneMatch && playerOneMatch.length > 2) {
            winPlayer = 'One';
            boardPlayerP[1].style.color = 'lightgreen';
            players.playerOneScore++;
         }

         if (playerTwoMatch && playerTwoMatch.length > 2) {
            winPlayer = 'Two';
            boardPlayerP[2].style.color = 'lightgreen';
            players.playerTwoScore++;
         }
      });

      if (winPlayer) {
         root.style.setProperty('--show-btn', 'flex');
         updateScore();
         return result.textContent = `Player ${winPlayer} Wins!`;
      }
   
      if (numberMove > 9 && playerOneFirst || numberMove > 10 && !playerOneFirst) {
         root.style.setProperty('--show-btn', 'flex');
         return result.textContent = `It's a tie!`;
      }
   }

   
}

boardGrids.forEach(gridItem => {

   gridItem.addEventListener('click', (gridItemEvent) => {
      let targetElement = gridItemEvent.target;
      if (targetElement.textContent || winPlayer) {
         return;
      }
      resetColor('white');
      playersMove(targetElement);
      checkWinner();
   });
});

buttons.forEach(buttonItem => {
   buttonItem.addEventListener('click', (buttonItemEvent) => {
      let targetElement = buttonItemEvent.target;

      if (targetElement.classList.value === 'play-again') {
         playAgain();
         return;
      }

      if (targetElement.classList.value === 'reset') {
         reset();
         return;
      }
   })
})

