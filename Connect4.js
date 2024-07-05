//## Student
//- STUDENT NAME: TARIK SEYCERİ
const AUTO_PLAY_USER = false; // if true, PC vs PC, false: User vs PC
const AUTO_PLAY_USER_AS_HARD_OR_AI = false; // true: Hard, false: AI
const MINIMAX_DEPTH = 5; // The depth for minimax, which is the complexity of minimax algorithm (how much future can the AI sees);

/***************/
/*  Importing  */
/***************/
const terminal = require('./terminal.js');

/***************/
/*  Constants  */
/***************/
const MAX_ROWS = 6; // Maximum number of rows in the game board
const MAX_COLUMNS = 7;
const MAX_COINS = MAX_ROWS * MAX_COLUMNS; // Maximum number of coins that can be played in the game
const LEFT_SPACE = "                  "; // Left space for the board to align properly
const PLAYER1_COIN = "X"; // Usually User
const PLAYER1_WINNER_COIN = "U"; // When user wins, to point to winning coins
const PLAYER2_COIN = "O"; // Usually PC
const PLAYER2_WINNER_COIN = "P"; // When pc wins, to point to winning coins
const EMPTY = " ";

/**********************/
/*  Global Variables  */
/**********************/
let Board = []; // 2 Dimensional Array for columns and rows // for drawing function
let coinsCount = 0; // Counting played stones // to finish the game with DRAW if no one wins
let pcMode = "e"; // e = Easy || h = Hard || a = AI
let playAgain = true; // true = Play again || false = Exit
let noneWins = true; // If any player wins, will be false.

/***************/
/*  Functions  */
/***************/
async function loadGame(){  // Initialization of all Variables
	// ReInit Variables
	Board = [];
	for(let i = 0; i < MAX_ROWS; i++){
		Board[i] = [];
		for(let j = 0; j < MAX_COLUMNS; j++){
			Board[i][j] = EMPTY;
		}
	}
	coinsCount = 0;
	pcMode = "e";
	playAgain = true;
	noneWins = true;
	
	// Start Game
	await choosePCMode();

	if(await chooseWhoPlayFirst()){ // if true user will play first
		while(coinsCount < MAX_COINS){
			if(await userTurn(Board)) break;
			if(await pcTurn(Board)) break;
		}
	}
	else {
		while(coinsCount < MAX_COINS){
			if(await pcTurn(Board)) break;
			if(await userTurn(Board)) break;
		}
	}

	if(coinsCount >= MAX_COINS && noneWins){
		await noOneWins(Board);
	}

	if(playAgain){
		await loadGame();
	}

	process.exit(0);
}

async function choosePCMode(){  // This function will choose the PC Mode (Easy or Hard)
	terminal.clearScreen();

	console.log("Welcome to Connect 4 Game");
	console.log("Hope You Enjoy This Game!");

	console.log("");
	console.log(LEFT_SPACE + "Choose PC opponent mode \n");
	console.log(LEFT_SPACE + "Easy: E    Hard: H    AI: A \n");

	pcMode = await terminal.getUserInput("Enter your answer: ");
	//pcMode = "a";
}

async function chooseWhoPlayFirst(){
	terminal.clearScreen();

	console.log("\n\n");
	console.log(LEFT_SPACE + "Do you want to play first? \n");
	console.log(LEFT_SPACE + "Yes: Y            No: N \n");

	return (await terminal.getUserInput("Enter your answer: ")).toLowerCase().includes("y");
	//return true;
}

function drawBoard(board){
	terminal.clearScreen();
	console.log("Coins count:", coinsCount);

	let boardPrint = LEFT_SPACE + " ";
	for(let i = 0; i < MAX_COLUMNS; i++){
		boardPrint += "_____ ";
	}

    for (let i = MAX_ROWS - 1; i >= 0; i--) {
		boardPrint += "\n" + LEFT_SPACE + "|";
		for(let i = 0; i < MAX_COLUMNS; i++){
			boardPrint += "     |";
		}

        boardPrint += "\n" + LEFT_SPACE + "|";
        for (let j = 0; j < MAX_COLUMNS; j++) {
            boardPrint += "  " + board[i][j] + "  |";
        }
		
        boardPrint += "\n" + LEFT_SPACE + "|";
		for(let i = 0; i < MAX_COLUMNS; i++){
			boardPrint += "_____|";
		}
    }
    
    boardPrint += "\n" + LEFT_SPACE + "   ";
	for(let i = 0; i < MAX_COLUMNS; i++){
		boardPrint += (i + 1) + "     ";
	}

    console.log(boardPrint);
	console.log();
}

function makeMove(board, move, coin = EMPTY){
	if(board[MAX_ROWS-1][move] != EMPTY) return false; // Reached the top of the board // Make another move

	for(let i = 0; i < MAX_COLUMNS; i++){
		if(move == i){
			for(let j = 0; j < MAX_ROWS; j++){
				if(board[j][i] == EMPTY){
					board[j][i] = coin;
					return true;
				}
			}
		}
	}

	return false;
}

function isWinner(board, coin, isSimulation = false){
	for(let i = 0; i < MAX_ROWS; i++){
		for(let j = 0; j < MAX_COLUMNS; j++){
			if(board[i][j] == coin){
				if(j + 3 < MAX_COLUMNS){
					if(board[i][j+1] == coin && board[i][j+2] == coin && board[i][j+3] == coin){
						if(!isSimulation){
							board[i][j] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							board[i][j+1] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							board[i][j+2] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							board[i][j+3] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							noneWins = false;
						}
						return true;
					}
				}
				if(i + 3 < MAX_ROWS){
					if(board[i+1][j] == coin && board[i+2][j] == coin && board[i+3][j] == coin){
						if(!isSimulation){
							board[i][j] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							board[i+1][j] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							board[i+2][j] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							board[i+3][j] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							noneWins = false;
						}
						return true;
					}
				}
				if(i + 3 < MAX_ROWS && j + 3 < MAX_COLUMNS){
					if(board[i+1][j+1] == coin && board[i+2][j+2] == coin && board[i+3][j+3] == coin){
						if(!isSimulation){
							board[i][j] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							board[i+1][j+1] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							board[i+2][j+2] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							board[i+3][j+3] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							noneWins = false;
						}
						return true;
					}
				}
				if(i + 3 < MAX_ROWS && j - 3 >= 0){
					if(board[i+1][j-1] == coin && board[i+2][j-2] == coin && board[i+3][j-3] == coin){
						if(!isSimulation){
							board[i][j] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							board[i+1][j-1] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							board[i+2][j-2] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							board[i+3][j-3] = coin == PLAYER1_COIN ? PLAYER1_WINNER_COIN : PLAYER2_WINNER_COIN;
							noneWins = false;
						}
						return true;
					}
				}
			}
		}
	}

	return false;
}

async function userTurn(board){
	let input = -1;
	
	if(!AUTO_PLAY_USER){
		while(isNaN(Number(input)) || Number(input) < 1 || Number(input) > MAX_COLUMNS){
			drawBoard(board);

			input = await terminal.getUserInput(`Enter your move (1 -> ${MAX_COLUMNS}) or type exit: `);

			if(input.toLowerCase() == 'exit'){
				process.exit(0);
			}
		}

		input = Number(input) - 1; // User chooses between 1-7, but we need to make it between 0 - 6
	}
	else {
		drawBoard(board);
		if(AUTO_PLAY_USER_AS_HARD_OR_AI){
			input = pcHardModeMove(board, PLAYER1_COIN, PLAYER2_COIN);
		}
		else {
			input = pcAiModeMove(board, PLAYER1_COIN, PLAYER2_COIN);
		}
		await terminal.sleep(100);
	}

	if(!makeMove(board, input, PLAYER1_COIN)){
		return await userTurn(board);
	}

	coinsCount++;

	if(isWinner(board, PLAYER1_COIN)){
		return await userWins(board);
	}

	return false;
}

async function pcTurn(board){
	let pcMove = 0;
	if(pcMode.toLowerCase().includes("h")){
		pcMove = pcHardModeMove(board);
	}
	else if(pcMode.toLowerCase().includes("a")){
		pcMove = pcAiModeMove(board);
	}
	else {
		pcMove = pcEasyModeMove();
	}

	if(!makeMove(board, pcMove, PLAYER2_COIN)){
		return await pcTurn(board);
	}

	coinsCount++;

	if(isWinner(board, PLAYER2_COIN)){
		return await pcWins(board);
	}

	return false;
}

function generateRandomMove(){
	return Math.floor(Math.random() * MAX_COLUMNS)
}

function pcEasyModeMove(){
	return generateRandomMove();
}

function pcSimulateMove(board, move, pcCoin, userCoin){
	let simBoard =  board.map(row => row.slice());

	if(!makeMove(simBoard, move, pcCoin)){
		return true;
	}
	
	return pcHardModeFindDefenceMove(simBoard, userCoin) > -1;
}

function pcHardModeFindDefenceMove(board, userCoin){
	// Strategies for PC in hard mode
	for(let i = 0; i < MAX_COLUMNS; i++){
		for(let j = 0; j < MAX_ROWS; j++){
			/***********/
			// Defence //
			/***********/

			// Check for vertical moves
			// Three stones
			if(j < MAX_ROWS - 3){
				if(board[j][i] == userCoin && board[j+1][i] == userCoin && board[j+2][i] == userCoin && board[j+3][i] == EMPTY) return i; // Def from top
			}
			
			// Check for horizontal moves
			// Three stones
			if(i < MAX_COLUMNS - 3){
				if(board[j][i] == userCoin && board[j][i+1] == userCoin && board[j][i+2] == userCoin && board[j][i+3] == EMPTY && (j == 0 || (j != 0 && board[j-1][i+3] != EMPTY))) return i+3; // Def from right
				if(board[j][i] == userCoin && board[j][i+1] == userCoin && board[j][i+2] == EMPTY && board[j][i+3] == userCoin && (j == 0 || (j != 0 && board[j-1][i+2] != EMPTY))) return i+2; // Def from middle-right
				if(board[j][i] == userCoin && board[j][i+1] == EMPTY && board[j][i+2] == userCoin && board[j][i+3] == userCoin && (j == 0 || (j != 0 && board[j-1][i+1] != EMPTY))) return i+1; // Def from middle-left
				if(board[j][i] == EMPTY && board[j][i+1] == userCoin && board[j][i+2] == userCoin && board[j][i+3] == userCoin && (j == 0 || (j != 0 && board[j-1][i] != EMPTY))) return i; // Def from left
			}

			// Check for diagonal moves (bottom-left to top-right)
			if(j < MAX_ROWS - 3 && i < MAX_COLUMNS - 3){
				if(board[j][i] == userCoin && board[j + 1][i + 1] == userCoin && board[j + 2][i + 2] == userCoin && board[j + 3][i + 3] == EMPTY && board[j + 2][i + 3] != EMPTY) return i + 3; // Def from top
				if(board[j][i] == userCoin && board[j + 1][i + 1] == userCoin && board[j + 2][i + 2] == EMPTY && board[j + 3][i + 3] == userCoin && board[j + 1][i + 2] != EMPTY) return i + 2; // Def from middle-top
				if(board[j][i] == userCoin && board[j + 1][i + 1] == EMPTY && board[j + 2][i + 2] == userCoin && board[j + 3][i + 3] == userCoin && board[j][i + 1] != EMPTY) return i + 1; // Def from middle-bottom
				if(board[j][i] == EMPTY && board[j + 1][i + 1] == userCoin && board[j + 2][i + 2] == userCoin && board[j + 3][i + 3] == userCoin && (j == 0 || (j != 0 && board[j-1][i] != EMPTY))) return i; // Def from bottom
			}

			// Check for diagonal moves (bottom-right to top-left)
			if(j < MAX_ROWS - 3 && i > 2){
				if(board[j][i] == userCoin && board[j + 1][i - 1] == userCoin && board[j + 2][i - 2] == userCoin && board[j + 3][i - 3] == EMPTY && board[j + 2][i - 3] != EMPTY) return i - 3; // Def from top
				if(board[j][i] == userCoin && board[j + 1][i - 1] == userCoin && board[j + 2][i - 2] == EMPTY && board[j + 3][i - 3] == userCoin && board[j + 1][i - 2] != EMPTY) return i - 2; // Def from middle-top
				if(board[j][i] == userCoin && board[j + 1][i - 1] == EMPTY && board[j + 2][i - 2] == userCoin && board[j + 3][i - 3] == userCoin && board[j][i - 1] != EMPTY) return i - 1; // Def from middle-bottom
				if(board[j][i] == EMPTY && board[j + 1][i - 1] == userCoin && board[j + 2][i - 2] == userCoin && board[j + 3][i - 3] == userCoin && (j == 0 || (j != 0 && board[j-1][i] != EMPTY))) return i; // Def from bottom
			}
		}
	}

	return -1;
}

function pcHardModeFindOffenceMove(board, pcCoin){
	// Strategies for PC in hard mode
	for(let i = 0; i < MAX_COLUMNS; i++){
		for(let j = 0; j < MAX_ROWS; j++){
			/***********/
			// Offence //
			/***********/

			// Check for vertical moves
			// Three stones
			if(j < MAX_ROWS - 3){
				if(board[j][i] == pcCoin && board[j+1][i] == pcCoin && board[j+2][i] == pcCoin && board[j+3][i] == EMPTY) return i; // Atk from top
			}
			
			// Check for horizontal moves
			// Three stones
			if(i < MAX_COLUMNS - 3){
				if(board[j][i] == pcCoin && board[j][i+1] == pcCoin && board[j][i+2] == pcCoin && board[j][i+3] == EMPTY && (j == 0 || (j != 0 && board[j-1][i+3] != EMPTY))) return i+3; // Atk from right
				if(board[j][i] == pcCoin && board[j][i+1] == pcCoin && board[j][i+2] == EMPTY && board[j][i+3] == pcCoin && (j == 0 || (j != 0 && board[j-1][i+2] != EMPTY))) return i+2; // Atk from middle-right
				if(board[j][i] == pcCoin && board[j][i+1] == EMPTY && board[j][i+2] == pcCoin && board[j][i+3] == pcCoin && (j == 0 || (j != 0 && board[j-1][i+1] != EMPTY))) return i+1; // Atk from middle-left
				if(board[j][i] == EMPTY && board[j][i+1] == pcCoin && board[j][i+2] == pcCoin && board[j][i+3] == pcCoin && (j == 0 || (j != 0 && board[j-1][i] != EMPTY))) return i; // Atk from left
			}

			// Check for diagonal moves (bottom-left to top-right)
			if(j < MAX_ROWS - 3 && i < MAX_COLUMNS - 3){
				if(board[j][i] == pcCoin && board[j + 1][i + 1] == pcCoin && board[j + 2][i + 2] == pcCoin && board[j + 3][i + 3] == EMPTY && board[j + 2][i + 3] != EMPTY) return i + 3; // Atk from top
				if(board[j][i] == pcCoin && board[j + 1][i + 1] == pcCoin && board[j + 2][i + 2] == EMPTY && board[j + 3][i + 3] == pcCoin && board[j + 1][i + 2] != EMPTY) return i + 2; // Atk from middle-top
				if(board[j][i] == pcCoin && board[j + 1][i + 1] == EMPTY && board[j + 2][i + 2] == pcCoin && board[j + 3][i + 3] == pcCoin && board[j][i + 1] != EMPTY) return i + 1; // Atk from middle-bottom
				if(board[j][i] == EMPTY && board[j + 1][i + 1] == pcCoin && board[j + 2][i + 2] == pcCoin && board[j + 3][i + 3] == pcCoin && (j == 0 || (j != 0 && board[j-1][i] != EMPTY))) return i; // Atk from bottom
			}

			// Check for diagonal moves (bottom-right to top-left)
			if(j < MAX_ROWS - 3 && i > 2){
				if(board[j][i] == pcCoin && board[j + 1][i - 1] == pcCoin && board[j + 2][i - 2] == pcCoin && board[j + 3][i - 3] == EMPTY && board[j + 2][i - 3] != EMPTY) return i - 3; // Atk from top
				if(board[j][i] == pcCoin && board[j + 1][i - 1] == pcCoin && board[j + 2][i - 2] == EMPTY && board[j + 3][i - 3] == pcCoin && board[j + 1][i - 2] != EMPTY) return i - 2; // Atk from middle-top
				if(board[j][i] == pcCoin && board[j + 1][i - 1] == EMPTY && board[j + 2][i - 2] == pcCoin && board[j + 3][i - 3] == pcCoin && board[j][i - 1] != EMPTY) return i - 1; // Atk from middle-bottom
				if(board[j][i] == EMPTY && board[j + 1][i - 1] == pcCoin && board[j + 2][i - 2] == pcCoin && board[j + 3][i - 3] == pcCoin && (j == 0 || (j != 0 && board[j-1][i] != EMPTY))) return i; // Atk from bottom
			}
		}
	}

	return -1;
}

function pcHardModeMove(board, pcCoin = PLAYER2_COIN, userCoin = PLAYER1_COIN){
	let move = pcHardModeFindDefenceMove(board, userCoin);
	if(move > -1) return move;

	move = pcHardModeFindOffenceMove(board, pcCoin);
	if(move > -1) return move;

	
	let randomMove = generateRandomMove();
	
	// Simulate random moves with risk, MAX_COINS times
	for(let numOfSims = 0; numOfSims < MAX_COINS; numOfSims++){
		const isRisky = pcSimulateMove(board, randomMove, pcCoin, userCoin);
		if(isRisky){
			randomMove = generateRandomMove();
		}
		else {
			return randomMove;
		}
	}
	
	// If reached this, then we check risk from 0 to MAX_COLUMNS
	for(let i = 0; i < MAX_COLUMNS; i++){
		const isRisky = pcSimulateMove(board, i, pcCoin, userCoin);
		if(!isRisky){
			return i;
		}
	}
	
	// If reached here then any move will make the PC loose!
	return generateRandomMove();
}

/**********
 * AI
 **********/

function evaluateWindow(window, piece) {
    let score = 0;
	let oppPiece = piece == PLAYER2_COIN ? PLAYER1_COIN : PLAYER2_COIN;

    if (window.filter(val => val === piece).length === 4) {
        score += 100;
    } else if (window.filter(val => val === piece).length === 3 && window.filter(val => val === EMPTY).length === 1) {
        score += 5;
    } else if (window.filter(val => val === piece).length === 2 && window.filter(val => val === EMPTY).length === 2) {
        score += 2;
    }

    if (window.filter(val => val === oppPiece).length === 3 && window.filter(val => val === EMPTY).length === 1) {
        score -= 4;
    }

    return score;
}

function scorePosition(board, piece) {
    let score = 0;

    // Score center column
    let centerArray = Array.from(board[Math.floor(MAX_COLUMNS / 2)]).map(Number);
    let centerCount = centerArray.filter(val => val === piece).length;
    score += centerCount * 3;

    // Score Horizontal
    for (let r = 0; r < MAX_ROWS; r++) {
        let rowArray = Array.from(board[r]).map(Number);
        for (let c = 0; c < MAX_COLUMNS - 3; c++) {
            let window = rowArray.slice(c, c + 4);
            score += evaluateWindow(window, piece);
        }
    }

    // Score Vertical
    for (let c = 0; c < MAX_COLUMNS; c++) {
        let colArray = Array.from(board.map(row => row[c])).map(Number);
        for (let r = 0; r < MAX_ROWS - 3; r++) {
            let window = colArray.slice(r, r + 4);
            score += evaluateWindow(window, piece);
        }
    }

    // Score positive sloped diagonal
    for (let r = 0; r < MAX_ROWS - 3; r++) {
        for (let c = 0; c < MAX_COLUMNS - 3; c++) {
            let window = Array.from({length: 4}, (_, i) => board[r + i][c + i]);
            score += evaluateWindow(window, piece);
        }
    }

    // Score negative sloped diagonal
    for (let r = 0; r < MAX_ROWS - 3; r++) {
        for (let c = 0; c < MAX_COLUMNS - 3; c++) {
            let window = Array.from({length: 4}, (_, i) => board[r + 3 - i][c + i]);
            score += evaluateWindow(window, piece);
        }
    }

    return score;
}

function isColumnAvailable(board, column){
	for(let i = 0; i < MAX_ROWS; i++){
		if(board[i][column] == EMPTY) return true;
	}
	return false;
}

function isBoardFull(board){
	for (let i = 0; i < MAX_COLUMNS; i++) {
		if (isColumnAvailable(board, i)) return false;
	}
	return true;
}

function minimax(board, depth, alpha, beta, isMaximizingPlayer, pcCoin = PLAYER2_COIN, userCoin = PLAYER1_COIN) {
    if (isWinner(board, pcCoin, true)) return [undefined, 10000000000000000];
    if (isWinner(board, userCoin, true)) return [undefined, -10000000000000000];
    if (isBoardFull(board)) return [undefined, 0];
    if (depth == 0) return [undefined, scorePosition(board, pcCoin)];
	
    if (isMaximizingPlayer) {
        let bestScore = -Infinity;

		let move = generateRandomMove();
		while(!isColumnAvailable(board, move)){
			move = generateRandomMove();
		}

		for (let i = 0; i < MAX_COLUMNS; i++) {
            if (isColumnAvailable(board, i)) {
				let simBoard = board.map(row => row.slice());
				makeMove(simBoard, i, pcCoin);

				let score = minimax(simBoard, depth-1, alpha, beta, false, pcCoin, userCoin)[1];
				
				if(score > bestScore){
					bestScore = score;
					move = i;
				}

				alpha = Math.max(alpha, bestScore);
                if (alpha >= beta) break;
			}
		}
		return [move, bestScore];
    } 
	else {
        let bestScore = Infinity;

		let move = generateRandomMove();
		while(!isColumnAvailable(board, move)){
			move = generateRandomMove();
		}

		for (let i = 0; i < MAX_COLUMNS; i++) {
            if (isColumnAvailable(board, i)) {
				let simBoard = board.map(row => row.slice());
				makeMove(simBoard, i, userCoin);

				let score = minimax(simBoard, depth-1, alpha, beta, true, pcCoin, userCoin)[1];

				if(score < bestScore){
					bestScore = score;
					move = i;
				}

				beta = Math.min(beta, bestScore);
                if (alpha >= beta) break;
			}
		}
		return [move, bestScore];
    }
}

function pcAiModeMove(board, pcCoin = PLAYER2_COIN, userCoin = PLAYER1_COIN) {
    let move = minimax(board, MINIMAX_DEPTH, -Infinity, Infinity, true, pcCoin, userCoin)[0];

	if(typeof move == 'undefined'){
		move = pcHardModeMove(board, pcCoin, userCoin);
	}
	
    return move;
}

/**************
 * *************
 * **************
 */

async function userWins(board){
	terminal.clearScreen();
	drawBoard(board);
	terminal.beep();

	console.log(LEFT_SPACE + "---- Congradulations!, You won the game ---- \n");
	console.log(LEFT_SPACE + "             Play again....? \n");
	console.log(LEFT_SPACE + "       Yes: Y            No: N \n");

	const answer = await terminal.getUserInput("Enter your answer: ");
	playAgain = !answer.toLowerCase().includes("n");

	return true;
}

async function pcWins(board){
	terminal.clearScreen();
	drawBoard(board);
	terminal.beep();

	console.log(LEFT_SPACE + "       ---- You lost the game ---- \n");
	console.log(LEFT_SPACE + "             Play again....? \n");
	console.log(LEFT_SPACE + "       Yes: Y            No: N \n");

	const answer = await terminal.getUserInput("Enter your answer: ");
	playAgain = !answer.toLowerCase().includes("n");

	return true;
}

async function noOneWins(board){
	terminal.clearScreen();
	drawBoard(board);
	terminal.beep();

	console.log(LEFT_SPACE + "            ---- D R A W ---- \n");
	console.log(LEFT_SPACE + "             Play again....? \n");
	console.log(LEFT_SPACE + "       Yes: Y            No: N \n");

	const answer = await terminal.getUserInput("Enter your answer: ");
	playAgain = !answer.toLowerCase().includes("n");

	return true;
}

// Main
(async function(){
	await loadGame();
}());

