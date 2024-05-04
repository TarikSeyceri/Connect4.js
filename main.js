/***************/
/*  Importing  */
/***************/
const helpers = require('./helpers.js');

/***************/
/*  Constants  */
/***************/
const MAX_ROWS = 6; // Maximum number of rows in the game board
const MAX_COLUMNS = 7;
const MAX_COINS = MAX_ROWS * MAX_COLUMNS; // Maximum number of coins that can be played in the game
const leftSpace = "                  "; // Left space for the board to align properly

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
			if(await usersTurn(Board)) break;
			if(await pcsTurn(Board)) break;
		}
	}
	else {
		while(coinsCount < MAX_COINS){
			if(await pcsTurn(Board)) break;
			if(await usersTurn(Board)) break;
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
	helpers.clearScreen();

	console.log("Welcome to Connect 4 Game v4.0");
	console.log("Hope You Enjoy This Game!");

	console.log("");
	console.log(leftSpace + "Choose PC opponent mode \n");
	console.log(leftSpace + "Easy: E    Hard: H    AI: A \n");

	//pcMode = await helpers.getUserInput("Enter your answer: ");
	pcMode = "h";
}

async function chooseWhoPlayFirst(){
	helpers.clearScreen();

	console.log("\n\n");
	console.log(leftSpace + "Do you want to play first? \n");
	console.log(leftSpace + "Yes: Y            No: N \n");

	//const answer = await helpers.getUserInput("Enter your answer: ");
	
	//return answer.toLowerCase().includes("y");
	return true;
}

function drawBoard(board){
	helpers.clearScreen();
	console.log("Coins count:", coinsCount);

	let boardPrint = leftSpace + " ";
	for(let i = 0; i < MAX_COLUMNS; i++){
		boardPrint += "_____ ";
	}

    for (let i = MAX_ROWS - 1; i >= 0; i--) {
		boardPrint += "\n" + leftSpace + "|";
		for(let i = 0; i < MAX_COLUMNS; i++){
			boardPrint += "     |";
		}

        boardPrint += "\n" + leftSpace + "|";
        for (let j = 0; j < MAX_COLUMNS; j++) {
            boardPrint += "  " + board[i][j] + "  |";
        }
		
        boardPrint += "\n" + leftSpace + "|";
		for(let i = 0; i < MAX_COLUMNS; i++){
			boardPrint += "_____|";
		}
    }
    
    boardPrint += "\n" + leftSpace + "   ";
	for(let i = 0; i < MAX_COLUMNS; i++){
		boardPrint += (i + 1) + "     ";
	}

    console.log(boardPrint);
	console.log();
} 

async function usersTurn(board){
	let input = "";
	
	while(isNaN(Number(input)) || Number(input) < 1 || Number(input) > MAX_COLUMNS){
		drawBoard(board);

		input = await helpers.getUserInput(`Enter your move (1 -> ${MAX_COLUMNS}) or type exit: `);

		if(input.toLowerCase() == 'exit'){
			process.exit(0);
		}
	}
	
	if(!checkUsersMove(board, Number(input))){
		return await usersTurn(board);
	}

	coinsCount++;

	if(isUserWinner(board)){
		return await userWins(board);
	}

	return false;
}

function checkUsersMove(board, input){
	input -= 1;
	if(board[MAX_ROWS-1][input] != " ") return false; // Reached the top of the board // Play another move

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

function isUserWinner(board){
	for(let i = 0; i < MAX_ROWS; i++){
		for(let j = 0; j < MAX_COLUMNS; j++){
			if(board[i][j] == "X"){
				if(j + 3 < MAX_COLUMNS){
					if(board[i][j+1] == "X" && board[i][j+2] == "X" && board[i][j+3] == "X"){
						board[i][j] = "U";
						board[i][j+1] = "U";
						board[i][j+2] = "U";
						board[i][j+3] = "U";
						return true;
					}
				}
				if(i + 3 < MAX_ROWS){
					if(board[i+1][j] == "X" && board[i+2][j] == "X" && board[i+3][j] == "X"){
						board[i][j] = "U";
						board[i+1][j] = "U";
						board[i+2][j] = "U";
						board[i+3][j] = "U";
						return true;
					}
				}
				if(i + 3 < MAX_ROWS && j + 3 < MAX_COLUMNS){
					if(board[i+1][j+1] == "X" && board[i+2][j+2] == "X" && board[i+3][j+3] == "X"){
						board[i][j] = "U";
						board[i+1][j+1] = "U";
						board[i+2][j+2] = "U";
						board[i+3][j+3] = "U";
						return true;
					}
				}
				if(i + 3 < MAX_ROWS && j - 3 >= 0){
					if(board[i+1][j-1] == "X" && board[i+2][j-2] == "X" && board[i+3][j-3] == "X"){
						board[i][j] = "U";
						board[i+1][j-1] = "U";
						board[i+2][j-2] = "U";
						board[i+3][j-3] = "U";
						return true;
					}
				}
			}
		}
	}

	return false;
}

async function userWins(board){
	helpers.clearScreen();
	drawBoard(board);
	helpers.beep();

	console.log(leftSpace + "---- Congradulations!, You won the game ---- \n");
	console.log(leftSpace + "             Play again....? \n");
	console.log(leftSpace + "       Yes: Y            No: N \n");

	const answer = await helpers.getUserInput("Enter your answer: ");
	playAgain = !answer.toLowerCase().includes("n");

	return true;
}

async function pcsTurn(board){
	let pcsMove = 0;
	if(pcMode.toLowerCase().includes("h")){
		pcsMove = pcHardModeMove(board);
	}
	else if(pcMode.toLowerCase().includes("a")){
		pcsMove = await pcAiModeMove(board);
	}
	else {
		pcsMove = pcEasyModeMove();
	}

	if(!checkPcsMove(board, pcsMove)){
		return await pcsTurn(board);
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
	let thisBoard =  board.map(row => row.slice());

	if(!checkPcsMove(thisBoard, move)){
		return true;
	}

	return pcHardModeFindDefenceMove(thisBoard) > -1;
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

async function pcAiModeMove(board){

	return pcEasyModeMove();
}

function checkPcsMove(board, input){
	if(board[MAX_ROWS-1][input] != " ") return false; // Reached the top of the board // Play another move

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

function isPcWinner(board){
	for(let i = 0; i < MAX_ROWS; i++){
		for(let j = 0; j < MAX_COLUMNS; j++){
			if(board[i][j] == "O"){
				if(j + 3 < MAX_COLUMNS){
					if(board[i][j+1] == "O" && board[i][j+2] == "O" && board[i][j+3] == "O"){
						board[i][j] = "P";
						board[i][j+1] = "P";
						board[i][j+2] = "P";
						board[i][j+3] = "P";
						return true;
					}
				}
				if(i + 3 < MAX_ROWS){
					if(board[i+1][j] == "O" && board[i+2][j] == "O" && board[i+3][j] == "O"){
						board[i][j] = "P";
						board[i+1][j] = "P";
						board[i+2][j] = "P";
						board[i+3][j] = "P";
						return true;
					}
				}
				if(i + 3 < MAX_ROWS && j + 3 < MAX_COLUMNS){
					if(board[i+1][j+1] == "O" && board[i+2][j+2] == "O" && board[i+3][j+3] == "O"){
						board[i][j] = "P";
						board[i+1][j+1] = "P";
						board[i+2][j+2] = "P";
						board[i+3][j+3] = "P";
						return true;
					}
				}
				if(i + 3 < MAX_ROWS && j - 3 >= 0){
					if(board[i+1][j-1] == "O" && board[i+2][j-2] == "O" && board[i+3][j-3] == "O"){
						board[i][j] = "P";
						board[i+1][j-1] = "P";
						board[i+2][j-2] = "P";
						board[i+3][j-3] = "P";
						return true;
					}
				}
			}
		}
	}

	return false;
}

async function pcWins(board){
	helpers.clearScreen();
	drawBoard(board);
	helpers.beep();

	console.log(leftSpace + "       ---- You lost the game ---- \n");
	console.log(leftSpace + "             Play again....? \n");
	console.log(leftSpace + "       Yes: Y            No: N \n");

	const answer = await helpers.getUserInput("Enter your answer: ");
	playAgain = !answer.toLowerCase().includes("n");

	return true;
}

async function noOneWins(board){
	helpers.clearScreen();
	drawBoard(board);
	helpers.beep();

	console.log(leftSpace + "            ---- D R A W ---- \n");
	console.log(leftSpace + "             Play again....? \n");
	console.log(leftSpace + "       Yes: Y            No: N \n");

	const answer = await helpers.getUserInput("Enter your answer: ");
	playAgain = !answer.toLowerCase().includes("n");

	return true;
}

// Main
(async function(){
	await loadGame();
}());

