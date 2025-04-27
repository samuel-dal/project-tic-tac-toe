const title = document.querySelector('.title');
const boardGridContainer = document.querySelector('.board-container');
const boardGrids = document.querySelectorAll('.board-container > button');
const rounds = document.querySelector('.round-num');
const player1Score = document.querySelector('.O-score');
const player2Score = document.querySelector('.X-score');
const ties = document.querySelector('.tie-score');
const aiMode = document.querySelector('.ai-mode');
const root = document.querySelector(':root');
const selectMode = document.querySelector('.select-mode');
const modal = document.querySelector('.modal');
const selectModes = document.querySelectorAll('.modal-main > button');

const winPattern = [
   [1, 2, 3],
   [4, 5, 6],
   [7, 8, 9],
   [1, 4, 7],
   [2, 5, 8],
   [3, 6, 9],
   [1, 5, 9],
   [3, 5, 7],
];

let history = [
   [1, 2, 3],
   [4, 5, 6],
   [7, 8, 9],
   [1, 4, 7],
   [2, 5, 8],
   [3, 6, 9],
   [1, 5, 9],
   [3, 5, 7],
];


let round = 1;
let totalMoves = 0;
let playerScore = 0;
let playerMoves = [];
let playerTotal = 0;
let computerScore = 0;
let tieScore = 0;
let winner;
let playerOfirst = round % 2 === 1;
const playerRegex = /[1-9][O]{2}|[O]{2}[1-9]|[O][1-9][O]/g;
const playerRegex2 = /[1-9]{2}[O]|[O][1-9]{2}|[1-9][O][1-9]/g;
const computerRegex = /[1-9][X]{2}|[X]{2}[1-9]|[X][1-9][X]/g;
const computerRegex2 = /[1-9]{2}[X]|[X][1-9]{2}|[1-9][X][1-9]/g;

const printPatterns = (player, boardVal) => {
   history.forEach((hisEl, hisIndex) => {

      hisEl.forEach((innerHis, innerHisIndex) => {
         if (innerHis === boardVal && player === 'player') {
            hisEl[innerHisIndex] = 'O';
         }

         if (innerHis === boardVal && player === 'computer') {
            hisEl[innerHisIndex] = 'X';
         }
      });

   });
}

const toggleModal = (display) => {
   root.style.setProperty('--display-modal', display);
}

toggleModal('flex');

let computerMode = 'easy';//easy, medium, hard

const selectAi = () => {
   switch(computerMode) {
      case 'easy':
         root.style.setProperty('--X-color', 'var(--easy)');
         return '😀';

      case 'medium':
         root.style.setProperty('--X-color', 'var(--medium)');
         return '😐';


      case 'hard':
         root.style.setProperty('--X-color', 'var(--hard)');
         return '😡';
   }
}

const updateScores = () => {
   player1Score.textContent = playerScore;
   player2Score.textContent = computerScore;
   rounds.textContent = round;
   ties.textContent = tieScore;
   aiMode.textContent = `${selectAi()}X`;
}

updateScores();

const playAgain = () => {
   history = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
   ];
   round++;
   winner = '';
   totalMoves = 0;
   playerTotal = 0;
   playerMoves = [];
   playerOfirst = round % 2 === 1;
   boardGrids.forEach(item => {
      item.textContent = '';
      item.style.color = 'var(--default-color)';
      item.style.backgroundColor = 'var(--default-color)';
      item.style.fontSize = '0rem';
      
   });
   root.style.setProperty('--show-btn', 'none');
   root.style.setProperty('--winner-display', 'none');
   root.style.setProperty('--highlight-winner', '0px');
   updateScores();
   if (!playerOfirst) {
      setTimeout(() => {
         computer(computerMode);
      }, 500);
   }
}

const reset = () => {
   playerScore = 0;
   computerScore = 0;
   tieScore = 0;
   playAgain();
   round = 1;
   playerOfirst = round % 2 === 1;
   updateScores();
}

const checkWinner = () => {
   let winIndex;
   history.forEach((item, index) => {
      if (item.join('') === 'OOO') {
         winner = 'Player';
         winIndex = index;
         playerScore++;
         root.style.setProperty('--highlight-winner', '-1.5px');

      }

      if (item.join('') === 'XXX') {
         winner = 'Computer';
         winIndex = index;
         computerScore++;
         root.style.setProperty('--highlight-winner', '159.5px');
      }
   });

   if (winner || totalMoves === 9) {
      root.style.setProperty('--winner-display', 'flex');
   }

   if (winner) {
      winPattern[winIndex].forEach(winItem => {
         boardGrids[winItem - 1].style.backgroundColor = 'var(--winner-color)';
      });
      root.style.setProperty('--show-btn', 'flex');
      updateScores();
      return;
   }

   if (!winner && totalMoves === 9) {
      root.style.setProperty('--show-btn', 'flex');
      root.style.setProperty('--highlight-winner', '78.5px');
      tieScore++;
      updateScores();
      return;
   }
}

const player = (targetEl) => {
   if (winner || playerOfirst && totalMoves % 2 === 1 || !playerOfirst && totalMoves % 2 === 0) {
      return;
   }
   const parseVal = parseFloat(targetEl.value);

   targetEl.textContent = 'O';
   targetEl.style.color = 'var(--O-color)';
   targetEl.style.fontSize = 'var(--tile-font-size)';
   printPatterns('player', parseVal);
   playerMoves.push(parseVal);
   playerTotal += parseVal;
   totalMoves++;
   checkWinner();
}

const updateComputerMove = (isRandom, arr) => {
   if (isRandom) {
      let random = Math.floor(Math.random() * arr.length);
      boardGrids[arr[random] - 1].textContent = 'X';
      boardGrids[arr[random] - 1].style.color = 'var(--X-color)';
      boardGrids[arr[random] - 1].style.fontSize = 'var(--tile-font-size)';
      printPatterns('computer', parseFloat(boardGrids[arr[random] - 1].value));
   }

   if (!isRandom) {
      boardGrids[arr[0] - 1].textContent = 'X';
      boardGrids[arr[0] - 1].style.color = 'var(--X-color)';
      boardGrids[arr[0] - 1].style.fontSize = 'var(--tile-font-size)';
      printPatterns('computer', arr[0]);
   }
   totalMoves++;
   checkWinner();
}

const computerFirstMove = () => {
   if (playerMoves[0] % 2 === 0) {
      let evenBoard = [];
      let evenValue = [[2, 8], [4, 6]];

      evenValue.forEach((evenItem) => {
         if (evenItem.join('').includes(playerMoves[0])) {
            evenItem.forEach((innerItem) => {
               if (innerItem !== playerMoves[0]) {
                  !boardGrids[4].textContent ? evenBoard.push(5) : false;
               }
               if (innerItem !== playerMoves[0]) {
                  !boardGrids[innerItem - 1].textContent ? evenBoard.push(innerItem) : false;
               }
            });
         }
      });
      updateComputerMove(true, evenBoard);
   }
   if (playerMoves[0] === 5) {
      let oddBoard = [];
      boardGrids.forEach((item) => {
         if (!item.textContent && parseFloat(item.value) % 2 === 1) {
            oddBoard.push(parseFloat(item.value));
         }
      });
      updateComputerMove(true, oddBoard);
   }
   let middleBoard = [5];
   if (playerMoves[0] % 2 === 1 && playerMoves[0] !== 5 && !boardGrids[4].textContent) {
      updateComputerMove(false, middleBoard);

   }

   if (totalMoves % 2 === 0 && !playerOfirst) {
      let emptyBoard = [];
      boardGrids.forEach((item) => {
         if (!item.textContent) {
            emptyBoard.push(parseFloat(item.value));
         }
      });
      updateComputerMove(true, emptyBoard);
   }
}

const computerFinalMoves = () => {

      let playerMatchRegex = false;//
      let playerMatchRegex2 = false;//
      let computerMatchRegex = false;//
      let computerMatchRegex2 = false;//
      let playerMatched = [];//catch player 2move
      let playerMatched2 = [];//catch player 1move
      let computerMatched = [];//endgame
      let computerMatched2Even = [];
      let computerMatched2Odd = [];
      let matchedEvenAndOdd = [];

      history.forEach((hisEl) => {
         const joinedEl = hisEl.join('');

         if (joinedEl.match(playerRegex)) {
             hisEl.forEach((innerHisEl) => {
               if (parseFloat(innerHisEl) && !boardGrids[innerHisEl - 1].textContent) {
                  playerMatched.push(innerHisEl);
                  playerMatchRegex = true;
               }
             });
         }

         if (joinedEl.match(playerRegex2)) {
            hisEl.forEach((innerHisEl) => {
               if (parseFloat(innerHisEl) && !boardGrids[innerHisEl - 1].textContent && parseFloat(innerHisEl) !== 5) {
                  playerMatched2.push(innerHisEl);
                  playerMatchRegex2 = true;
               }
             });
         }

         
         if (joinedEl.match(computerRegex2)) {
            hisEl.forEach((innerHisEl) => {
               if (parseFloat(innerHisEl) % 2 === 0 && !boardGrids[innerHisEl - 1].textContent) {
                  computerMatched2Even.push(innerHisEl);
                  computerMatchRegex2 = true;

               }

               if (parseFloat(innerHisEl) % 2 === 1 && !boardGrids[innerHisEl - 1].textContent) {
                  computerMatched2Odd.push(innerHisEl);
                  computerMatchRegex2 = true;
               }
             });
         }

         if (joinedEl.match(computerRegex)) {
            hisEl.forEach((innerHisEl) => {
               if (parseFloat(innerHisEl)) {
                  computerMatched.push(innerHisEl);
                  computerMatchRegex = true;
               }
             });
         }
      });


      if (computerMatchRegex) {//endgame
         updateComputerMove(false, computerMatched);
         return;
      }

      if (playerMatchRegex && !computerMatchRegex) {//catch
         updateComputerMove(false, playerMatched);

         return;
      }


      if (computerMatchRegex2 && !playerMatchRegex && !computerMatchRegex && playerMoves[0] === 5 && playerTotal % 2 === 0) {
         updateComputerMove(true, computerMatched2Odd);
         return;
      }

      if (!playerMatchRegex && !computerMatchRegex && computerMatched2Even.length) {

         if (computerMatchRegex2 && playerTotal % 2 === 0 && playerMoves[0] !== 5 || 
            !computerMatchRegex2 && playerTotal % 2 === 1 && playerMoves[0] !== 5) {
               updateComputerMove(true, computerMatched2Even);
               return;
         }
      }

      if (!playerMatchRegex && !computerMatchRegex && computerMatchRegex2) {
         let checkmateMoves = [[12, 7, 9], [14, 3, 9], [16, 1, 7], [18, 1, 3]];
         let checkmateMove = [];
         let exit = false;
         checkmateMoves.forEach(item => {
            if (item[0] === playerTotal && totalMoves === 5) {
               checkmateMove.push(item[1], item[2]);
               exit = true;
            }
         });

         if (exit) {
            updateComputerMove(true, checkmateMove);
            return;
         }

         if (!exit) {
            matchedEvenAndOdd.push(...computerMatched2Even, ...computerMatched2Odd);
            updateComputerMove(true, matchedEvenAndOdd);
            return;
         }
      }

      if (!playerMatchRegex && !computerMatchRegex && !computerMatchRegex2) {//random
         let emptyBoard = [];
         let exit = false;

         boardGrids.forEach((item) => {
            if (!item.textContent) {
               emptyBoard.push(parseFloat(item.value));
            }

         });

         if (playerMatchRegex2) {
            updateComputerMove(true, playerMatched2);
            exit = true;
            return;
         }

         if (!exit) {
            updateComputerMove(true, emptyBoard);
            return;
         }
      }
}

const computer = (mode) => {
   if (totalMoves >= 9 || winner || playerOfirst && totalMoves % 2 === 0 || !playerOfirst && totalMoves % 2 === 1) {
      return;
   }

   if (mode === 'easy' && !winner) {
      if (totalMoves >= 1 || totalMoves === 0 && !playerOfirst) {
         let emptyBoard = [];
         boardGrids.forEach((item) => {
            if (!item.textContent) {
               emptyBoard.push(parseFloat(item.value));
            }
         });
         updateComputerMove(true, emptyBoard);
      }
   }

   if (mode === 'medium' && !winner) {
      if (totalMoves === 1 && playerOfirst || totalMoves <= 2 && !playerOfirst) {

         let random = (Math.floor(Math.random() * 2)) % 2 === 0;

         if (random) {
            let emptyBoard = [];
            boardGrids.forEach((item) => {
               if (!item.textContent) {
                  emptyBoard.push(parseFloat(item.value));
               }
            });
            updateComputerMove(true, emptyBoard);
            return;
         }

         if (!random) {
            computerFirstMove();
         }

      }

      if (totalMoves >= 3 && playerOfirst || totalMoves > 3 && !playerOfirst) {

         let random = Math.floor(Math.random() * 11);

         if (random === 1) {
            let emptyBoard = [];
            boardGrids.forEach((item) => {
               if (!item.textContent) {
                  emptyBoard.push(parseFloat(item.value));
               }
            });
            updateComputerMove(true, emptyBoard);
            return;
         }
         computerFinalMoves();

      }
   }

   if (mode === 'hard' && !winner) {
      if (totalMoves === 1 && playerOfirst || totalMoves <= 2 && !playerOfirst) {

         computerFirstMove();

      }

      if (totalMoves >= 3 && playerOfirst || totalMoves > 3 && !playerOfirst) {
         let specialMove = [[6, 1], [8, 3], [14, 9], [12, 7]];
         let specialVal = [];
         let exit = false;

         specialMove.forEach((item) => {
            if (item[0] === playerTotal && playerMoves[0] !== 5 && playerMoves[0] % 2 === 0) {
               specialVal.push(item[1]);
               exit = true;
            }
         });

         if (exit && totalMoves === 3 && playerOfirst) {
            updateComputerMove(false, specialVal);
            return;
         }

         computerFinalMoves();
      }
   }
}

boardGridContainer.addEventListener('click', (e) => {
   const targetEl = e.target;

   if (targetEl.textContent || winner) {
      return;
   }
   player(targetEl);
   setTimeout(() => {
      computer(computerMode);
   }, 500);
});

document.addEventListener('keydown', (e) => {
   if (e.key === ' ') {
      playAgain();
   }
});

selectMode.addEventListener('click', (e) => {
   toggleModal('flex');

});

modal.addEventListener('click', (e) => {
   const target = e.target;
   const targetVal = target.value;


   if (target.className === 'modal' || computerMode === targetVal) {
      toggleModal('none');
      return;
   }

   if (round === 1 && totalMoves === 0) {
      computerMode = targetVal;
      selectAi();
      reset();
      toggleModal('none');
      reset();
      return;
   }

   let confirmReset = confirm(`Change ${computerMode} to ${targetVal}? All data will reset!`);

   if (!confirmReset) {
      toggleModal('none');
      return;
   }

   computerMode = targetVal;
   selectAi();
   reset();
   toggleModal('none');
   reset();
});