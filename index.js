window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');

    let board = ['', '', '', '', '', '', '', '', ''];
    let  currentPlayer = 'X';
    let isGameActive = true;

    const  PLAYERX_WON = 'PLAYERX_WON';
    const  PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleResultValidation() {
        let roundWon = false;
        let winIndex = -1;
    
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
    
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                winIndex = i;
                break;
            }
        }
    
        if (roundWon) {
            drawWinningLine(winIndex);
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }
    
        if (!board.includes('')) announce(TIE);
    }

    function drawWinningLine(index) {
        const winningLine = document.querySelector('.winning-line');
        const tiles = document.querySelectorAll('.tile');
        const gameContainer = document.querySelector('.gameContainer').getBoundingClientRect();
    
        // Get first and last tile of the winning combination
        const firstTile = tiles[winningConditions[index][0]].getBoundingClientRect();
        const lastTile = tiles[winningConditions[index][2]].getBoundingClientRect();
    
        // Calculate line position and size
        const lineX = (firstTile.left + lastTile.left) / 2 - gameContainer.left + firstTile.width / 2;
        const lineY = (firstTile.top + lastTile.top) / 2 - gameContainer.top + firstTile.height / 2;
        const lineWidth = Math.sqrt(
            Math.pow(lastTile.left - firstTile.left, 2) +
            Math.pow(lastTile.top - firstTile.top, 2)
        );
        const angle = Math.atan2(
            lastTile.top - firstTile.top,
            lastTile.left - firstTile.left
        ) * (180 / Math.PI);
    
        // Apply styles dynamically
        winningLine.style.top = `${lineY}px`;
        winningLine.style.left = `${lineX}px`;
        winningLine.style.width = `${lineWidth}px`;
        winningLine.style.height = `6px`; // Thickness of the line
        winningLine.style.backgroundColor = '#fff'; // Pink to match purple theme
        winningLine.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        winningLine.classList.remove('hide');
    }
    
    
    const announce = (type) => {
        const playerSection = document.querySelector('.player'); // Select the player section
    
        switch(type){
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won!';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won!';
                break;
            case TIE:
                announcer.innerText = 'Tie';
        }
        
        // Hide player turn display when the game is over
        playerSection.classList.add('hide');
        
        announcer.classList.remove('hide');
    };
    

    const isValidAction = (tile) => {
        if(tile.innerText === 'X' || tile.innerText === 'O') {
            return false;
        }
        return true;
    };

    const updateBoard = (index) => {
        board[index] = currentPlayer;
    }

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    const UserAction = (tile, index) => {
        if(isValidAction(tile) && isGameActive){
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    }

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');
    
        document.querySelector('.winning-line').classList.add('hide'); // Hide line
        document.querySelector('.player').classList.remove('hide'); // Show player turn again
    
        if (currentPlayer === 'O') {
            changePlayer();
        }
    
        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    };
    

    tiles.forEach( (tile, index) => {
        tile.addEventListener('click', () => UserAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);
});