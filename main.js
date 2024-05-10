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

/**********************/
/*  Global Variables  */
/**********************/
let Board = []; // 2 Dimensional Array for columns and rows // for drawing function
let coinsCount = 0; // Counting played stones // to finish the game with DRAW if no one wins
let pcMode = "e"; // e = Easy || h = Hard || a = AI
let playAgain = true; // true = Play again || false = Exit

/***************/
/*  Functions  */
/***************/
async function loadGame(){  // Initialization of all Variables
	// ReInit Variables
	Board = [];
	for(let i = 0; i < MAX_ROWS; i++){
		Board[i] = [];
		for(let j = 0; j < MAX_COLUMNS; j++){
			Board[i][j] = " ";
		}
	}
	coinsCount = 0;
	pcMode = "e";
	playAgain = true;
	
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

	if(coinsCount >= MAX_COINS){
		await noOneWins(Board);
	}

	if(playAgain){
		await loadGame();
	}

	process.exit(0);
}

async function choosePCMode(){  // This function will choose the PC Mode (Easy or Hard)
	terminal.clearScreen();

	console.log("Welcome to Connect 4 Game v4.0");
	console.log("Hope You Enjoy This Game!");

	console.log("");
	console.log(LEFT_SPACE + "Choose PC opponent mode \n");
	console.log(LEFT_SPACE + "Easy: E    Hard: H    AI: A \n");

	//pcMode = await terminal.getUserInput("Enter your answer: ");
	pcMode = "a";
}

async function chooseWhoPlayFirst(){
	terminal.clearScreen();

	console.log("\n\n");
	console.log(LEFT_SPACE + "Do you want to play first? \n");
	console.log(LEFT_SPACE + "Yes: Y            No: N \n");

	//const answer = await terminal.getUserInput("Enter your answer: ");
	
	//return answer.toLowerCase().includes("y");
	return true;
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

async function userTurn(board){
	let input = "";
	
	while(isNaN(Number(input)) || Number(input) < 1 || Number(input) > MAX_COLUMNS){
		drawBoard(board);

		input = await terminal.getUserInput(`Enter your move (1 -> ${MAX_COLUMNS}) or type exit: `);

		if(input.toLowerCase() == 'exit'){
			process.exit(0);
		}
	}
	
	if(!makeUserMove(board, Number(input))){
		return await userTurn(board);
	}

	coinsCount++;

	if(isUserWinner(board)){
		return await userWins(board);
	}

	return false;
}

function makeUserMove(board, input){
	input -= 1;
	if(board[MAX_ROWS-1][input] != " ") return false; // Reached the top of the board // Make another move

	for(let i = 0; i < MAX_COLUMNS; i++){
		if(input == i){
			for(let j = 0; j < MAX_ROWS; j++){
				if(board[j][i] == " "){
					board[j][i] = "X";
					return true;
				}
			}
		}
	}

	return false;
}

function isUserWinner(board, isSimulation = false){
	for(let i = 0; i < MAX_ROWS; i++){
		for(let j = 0; j < MAX_COLUMNS; j++){
			if(board[i][j] == "X"){
				if(j + 3 < MAX_COLUMNS){
					if(board[i][j+1] == "X" && board[i][j+2] == "X" && board[i][j+3] == "X"){
						if(!isSimulation){
							board[i][j] = "U";
							board[i][j+1] = "U";
							board[i][j+2] = "U";
							board[i][j+3] = "U";
						}
						return true;
					}
				}
				if(i + 3 < MAX_ROWS){
					if(board[i+1][j] == "X" && board[i+2][j] == "X" && board[i+3][j] == "X"){
						if(!isSimulation){
							board[i][j] = "U";
							board[i+1][j] = "U";
							board[i+2][j] = "U";
							board[i+3][j] = "U";
						}
						return true;
					}
				}
				if(i + 3 < MAX_ROWS && j + 3 < MAX_COLUMNS){
					if(board[i+1][j+1] == "X" && board[i+2][j+2] == "X" && board[i+3][j+3] == "X"){
						if(!isSimulation){
							board[i][j] = "U";
							board[i+1][j+1] = "U";
							board[i+2][j+2] = "U";
							board[i+3][j+3] = "U";
						}
						return true;
					}
				}
				if(i + 3 < MAX_ROWS && j - 3 >= 0){
					if(board[i+1][j-1] == "X" && board[i+2][j-2] == "X" && board[i+3][j-3] == "X"){
						if(!isSimulation){
							board[i][j] = "U";
							board[i+1][j-1] = "U";
							board[i+2][j-2] = "U";
							board[i+3][j-3] = "U";
						}
						return true;
					}
				}
			}
		}
	}

	return false;
}

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

async function pcTurn(board){
	let pcMove = 0;
	if(pcMode.toLowerCase().includes("h")){
		pcMove = pcHardModeMove(board);
	}
	else if(pcMode.toLowerCase().includes("a")){
		pcMove = await pcAiModeMove(board);
	}
	else {
		pcMove = pcEasyModeMove();
	}

	if(!makePcMove(board, pcMove)){
		return await pcTurn(board);
	}

	coinsCount++;

	if(isPcWinner(board)){
		return await pcWins(board);
	}

	return false;
}

function pcEasyModeMove(){
	return Math.floor(Math.random() * MAX_COLUMNS);
}

function simulatePcMove(board, move){
	let simBoard =  board.map(row => row.slice());

	if(!makePcMove(simBoard, move)){
		return true;
	}

	return pcHardModeFindDefenceMove(simBoard) > -1;
}

function pcHardModeFindDefenceMove(board){
	// Strategies for PC in hard mode
	for(let i = 0; i < MAX_COLUMNS; i++){
		for(let j = 0; j < MAX_ROWS; j++){
			/***********/
			// Defence //
			/***********/

			// Check for vertical moves
			// Three stones
			if(j < MAX_ROWS - 3){
				if(board[j][i] == "X" && board[j+1][i] == "X" && board[j+2][i] == "X" && board[j+3][i] == " ") return i; // Def from top
			}
			
			// Check for horizontal moves
			// Three stones
			if(i < MAX_COLUMNS - 3){
				if(board[j][i] == "X" && board[j][i+1] == "X" && board[j][i+2] == "X" && board[j][i+3] == " " && (j == 0 || (j != 0 && board[j-1][i+3] != " "))) return i+3; // Def from right
				if(board[j][i] == "X" && board[j][i+1] == "X" && board[j][i+2] == " " && board[j][i+3] == "X" && (j == 0 || (j != 0 && board[j-1][i+2] != " "))) return i+2; // Def from middle-right
				if(board[j][i] == "X" && board[j][i+1] == " " && board[j][i+2] == "X" && board[j][i+3] == "X" && (j == 0 || (j != 0 && board[j-1][i+1] != " "))) return i+1; // Def from middle-left
				if(board[j][i] == " " && board[j][i+1] == "X" && board[j][i+2] == "X" && board[j][i+3] == "X" && (j == 0 || (j != 0 && board[j-1][i] != " "))) return i; // Def from left
			}

			// Check for diagonal moves (bottom-left to top-right)
			if(j < MAX_ROWS - 3 && i < MAX_COLUMNS - 3){
				if(board[j][i] == "X" && board[j + 1][i + 1] == "X" && board[j + 2][i + 2] == "X" && board[j + 3][i + 3] == " " && board[j + 2][i + 3] != " ") return i + 3; // Def from top
				if(board[j][i] == "X" && board[j + 1][i + 1] == "X" && board[j + 2][i + 2] == " " && board[j + 3][i + 3] == "X" && board[j + 1][i + 2] != " ") return i + 2; // Def from middle-top
				if(board[j][i] == "X" && board[j + 1][i + 1] == " " && board[j + 2][i + 2] == "X" && board[j + 3][i + 3] == "X" && board[j][i + 1] != " ") return i + 1; // Def from middle-bottom
				if(board[j][i] == " " && board[j + 1][i + 1] == "X" && board[j + 2][i + 2] == "X" && board[j + 3][i + 3] == "X" && (j == 0 || (j != 0 && board[j-1][i] != " "))) return i; // Def from bottom
			}

			// Check for diagonal moves (bottom-right to top-left)
			if(j < MAX_ROWS - 3 && i > 2){
				if(board[j][i] == "X" && board[j + 1][i - 1] == "X" && board[j + 2][i - 2] == "X" && board[j + 3][i - 3] == " " && board[j + 2][i - 3] != " ") return i - 3; // Def from top
				if(board[j][i] == "X" && board[j + 1][i - 1] == "X" && board[j + 2][i - 2] == " " && board[j + 3][i - 3] == "X" && board[j + 1][i - 2] != " ") return i - 2; // Def from middle-top
				if(board[j][i] == "X" && board[j + 1][i - 1] == " " && board[j + 2][i - 2] == "X" && board[j + 3][i - 3] == "X" && board[j][i - 1] != " ") return i - 1; // Def from middle-bottom
				if(board[j][i] == " " && board[j + 1][i - 1] == "X" && board[j + 2][i - 2] == "X" && board[j + 3][i - 3] == "X" && (j == 0 || (j != 0 && board[j-1][i] != " "))) return i; // Def from bottom
			}
		}
	}

	return -1;
}

function pcHardModeFindOffenceMove(board){
	// Strategies for PC in hard mode
	for(let i = 0; i < MAX_COLUMNS; i++){
		for(let j = 0; j < MAX_ROWS; j++){
			/***********/
			// Offence //
			/***********/

			// Check for vertical moves
			// Three stones
			if(j < MAX_ROWS - 3){
				if(board[j][i] == "O" && board[j+1][i] == "O" && board[j+2][i] == "O" && board[j+3][i] == " ") return i; // Atk from top
			}
			
			// Check for horizontal moves
			// Three stones
			if(i < MAX_COLUMNS - 3){
				if(board[j][i] == "O" && board[j][i+1] == "O" && board[j][i+2] == "O" && board[j][i+3] == " " && (j == 0 || (j != 0 && board[j-1][i+3] != " "))) return i+3; // Atk from right
				if(board[j][i] == "O" && board[j][i+1] == "O" && board[j][i+2] == " " && board[j][i+3] == "O" && (j == 0 || (j != 0 && board[j-1][i+2] != " "))) return i+2; // Atk from middle-right
				if(board[j][i] == "O" && board[j][i+1] == " " && board[j][i+2] == "O" && board[j][i+3] == "O" && (j == 0 || (j != 0 && board[j-1][i+1] != " "))) return i+1; // Atk from middle-left
				if(board[j][i] == " " && board[j][i+1] == "O" && board[j][i+2] == "O" && board[j][i+3] == "O" && (j == 0 || (j != 0 && board[j-1][i] != " "))) return i; // Atk from left
			}

			// Check for diagonal moves (bottom-left to top-right)
			if(j < MAX_ROWS - 3 && i < MAX_COLUMNS - 3){
				if(board[j][i] == "O" && board[j + 1][i + 1] == "O" && board[j + 2][i + 2] == "O" && board[j + 3][i + 3] == " " && board[j + 2][i + 3] != " ") return i + 3; // Atk from top
				if(board[j][i] == "O" && board[j + 1][i + 1] == "O" && board[j + 2][i + 2] == " " && board[j + 3][i + 3] == "O" && board[j + 1][i + 2] != " ") return i + 2; // Atk from middle-top
				if(board[j][i] == "O" && board[j + 1][i + 1] == " " && board[j + 2][i + 2] == "O" && board[j + 3][i + 3] == "O" && board[j][i + 1] != " ") return i + 1; // Atk from middle-bottom
				if(board[j][i] == " " && board[j + 1][i + 1] == "O" && board[j + 2][i + 2] == "O" && board[j + 3][i + 3] == "O" && (j == 0 || (j != 0 && board[j-1][i] != " "))) return i; // Atk from bottom
			}

			// Check for diagonal moves (bottom-right to top-left)
			if(j < MAX_ROWS - 3 && i > 2){
				if(board[j][i] == "O" && board[j + 1][i - 1] == "O" && board[j + 2][i - 2] == "O" && board[j + 3][i - 3] == " " && board[j + 2][i - 3] != " ") return i - 3; // Atk from top
				if(board[j][i] == "O" && board[j + 1][i - 1] == "O" && board[j + 2][i - 2] == " " && board[j + 3][i - 3] == "O" && board[j + 1][i - 2] != " ") return i - 2; // Atk from middle-top
				if(board[j][i] == "O" && board[j + 1][i - 1] == " " && board[j + 2][i - 2] == "O" && board[j + 3][i - 3] == "O" && board[j][i - 1] != " ") return i - 1; // Atk from middle-bottom
				if(board[j][i] == " " && board[j + 1][i - 1] == "O" && board[j + 2][i - 2] == "O" && board[j + 3][i - 3] == "O" && (j == 0 || (j != 0 && board[j-1][i] != " "))) return i; // Atk from bottom
			}
		}
	}

	return -1;
}

function pcHardModeMove(board){
	let move = pcHardModeFindDefenceMove(board);
	if(move > -1) return move;

	move = pcHardModeFindOffenceMove(board);
	if(move > -1) return move;

	
	let randomMove = pcEasyModeMove();
	
	// Simulate random moves with risk, MAX_COINS times
	for(let numOfSims = 0; numOfSims < MAX_COINS; numOfSims++){
		const isRisky = simulatePcMove(board, randomMove);
		if(isRisky){
			randomMove = pcEasyModeMove();
		}
		else {
			return randomMove;
		}
	}
	
	// If reached this, then we check risk from 0 to MAX_COLUMNS
	for(let i = 0; i < MAX_COLUMNS; i++){
		const isRisky = simulatePcMove(board, i);
		if(!isRisky){
			return i;
		}
	}
	
	// If reached here then any move will make the PC loose!
	return pcEasyModeMove();
}

/**********
 * AI
 **********/

function isColumnAvailable(board, column){
	for(let i = 0; i < MAX_ROWS; i++){
		if(board[i][column] == " ") return true;
	}
	return false;
}

function isBoardFull(board){
	for (let i = 0; i < MAX_COLUMNS; i++) {
		if (isColumnAvailable(board, i)) return false;
	}
	return true;
}

function makeMove(board, input, coin){
	if(board[MAX_ROWS-1][input] != " ") return false; // Reached the top of the board // Make another move

	for(let i = 0; i < MAX_COLUMNS; i++){
		if(input == i){
			for(let j = 0; j < MAX_ROWS; j++){
				if(board[j][i] == " "){
					board[j][i] = coin;
					return true;
				}
			}
		}
	}

	return false;
}

function minimax(board, depth, isMaximizingPlayer) {
	if (isPcWinner(board, true)) return 1;
    if (isUserWinner(board, true)) return -1;
    if (isBoardFull(board) || depth == 5) return 0;

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < MAX_COLUMNS; i++) {
            if (isColumnAvailable(board, i)) {
				let simBoard = board.map(row => row.slice());
                makeMove(simBoard, i, "O");
                let score = minimax(simBoard, depth + 1, false);
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } 
	else {
        let bestScore = Infinity;
        for (let i = 0; i < MAX_COLUMNS; i++) {
            if (isColumnAvailable(board, i)) {
				let simBoard = board.map(row => row.slice());
                makeMove(simBoard, i, "X");
                let score = minimax(simBoard, depth + 1, true);
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

async function pcAiModeMove(board) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < MAX_COLUMNS; i++) {
        if (isColumnAvailable(board, i)) {
			let simBoard =  board.map(row => row.slice());
            makeMove(simBoard, i, "O");
            let score = minimax(simBoard, 0, false);
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

/**************
 * *************
 * **************
 */

function makePcMove(board, input){
	if(board[MAX_ROWS-1][input] != " ") return false; // Reached the top of the board // Make another move

	for(let i = 0; i < MAX_COLUMNS; i++){
		if(input == i){
			for(let j = 0; j < MAX_ROWS; j++){
				if(board[j][i] == " "){
					board[j][i] = "O";
					return true;
				}
			}
		}
	}

	return false;
}

function isPcWinner(board, isSimulation = false){
	for(let i = 0; i < MAX_ROWS; i++){
		for(let j = 0; j < MAX_COLUMNS; j++){
			if(board[i][j] == "O"){
				if(j + 3 < MAX_COLUMNS){
					if(board[i][j+1] == "O" && board[i][j+2] == "O" && board[i][j+3] == "O"){
						if(!isSimulation){
							board[i][j] = "P";
							board[i][j+1] = "P";
							board[i][j+2] = "P";
							board[i][j+3] = "P";
						}
						return true;
					}
				}
				if(i + 3 < MAX_ROWS){
					if(board[i+1][j] == "O" && board[i+2][j] == "O" && board[i+3][j] == "O"){
						if(!isSimulation){
							board[i][j] = "P";
							board[i+1][j] = "P";
							board[i+2][j] = "P";
							board[i+3][j] = "P";
						}
						return true;
					}
				}
				if(i + 3 < MAX_ROWS && j + 3 < MAX_COLUMNS){
					if(board[i+1][j+1] == "O" && board[i+2][j+2] == "O" && board[i+3][j+3] == "O"){
						if(!isSimulation){
							board[i][j] = "P";
							board[i+1][j+1] = "P";
							board[i+2][j+2] = "P";
							board[i+3][j+3] = "P";
						}
						return true;
					}
				}
				if(i + 3 < MAX_ROWS && j - 3 >= 0){
					if(board[i+1][j-1] == "O" && board[i+2][j-2] == "O" && board[i+3][j-3] == "O"){
						if(!isSimulation){
							board[i][j] = "P";
							board[i+1][j-1] = "P";
							board[i+2][j-2] = "P";
							board[i+3][j-3] = "P";
						}
						return true;
					}
				}
			}
		}
	}

	return false;
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

