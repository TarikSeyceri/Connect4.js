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
let board = []; // 2 Dimensional Array for columns and rows // for drawing function
let coinsCount = 0; // Counting played stones // to finish the game with DRAW if no one wins
let pcMode = "e"; // e = Easy || h = Hard || a = AI
let playAgain = true; // true = Play again || false = Exit

/***************/
/*  Functions  */
/***************/
async function loadGame(){  // Initialization of all Variables
	// ReInit Variables
	for(let i = 0; i < MAX_ROWS; i++){
		board[i] = [];
		for(let j = 0; j < MAX_COLUMNS; j++){
			board[i][j] = " ";
		}
	}
	coinsCount = 0;
	pcMode = "e";
	playAgain = true;
	
	// Start Game
	await choosePCMode();

	if(await chooseWhoPlayFirst()){ // if true user will play first
		while(coinsCount < MAX_COINS){
			if(await usersTurn()) break;
			if(await pcsTurn()) break;
		}
	}
	else {
		while(coinsCount < MAX_COINS){
			if(await pcsTurn()) break;
			if(await usersTurn()) break;
		}
	}

	if(coinsCount >= MAX_COINS){
		await checkNoOneWins();
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

function drawBoard(){
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

async function usersTurn(){
	let input = "";
	
	while(isNaN(Number(input)) || Number(input) < 1 || Number(input) > MAX_COLUMNS){
		drawBoard();

		input = await helpers.getUserInput(`Enter your move (1 -> ${MAX_COLUMNS}) or type exit: `);

		if(input.toLowerCase() == 'exit'){
			process.exit(0);
		}
	}
	
	return checkUsersMove(Number(input));
}

async function checkUsersMove(input){
	input -= 1;
	if(board[MAX_ROWS-1][input] != " ") return await usersTurn(); // Reached the top of the board // Play another move

	for(let i = 0; i < MAX_COLUMNS; i++){
		if(input == i){
			for(let j = 0; j < MAX_ROWS; j++){
				if(board[j][i] == " "){
					board[j][i] = "X";
					coinsCount++;
					return await isUserWinner();
				}
			}
		}
	}

	return await usersTurn();
}

async function isUserWinner(){
	for(let i = 0; i < MAX_ROWS; i++){
		for(let j = 0; j < MAX_COLUMNS; j++){
			if(board[i][j] == "X"){
				if(j + 3 < MAX_COLUMNS){
					if(board[i][j+1] == "X" && board[i][j+2] == "X" && board[i][j+3] == "X"){
						board[i][j] = "U";
						board[i][j+1] = "U";
						board[i][j+2] = "U";
						board[i][j+3] = "U";
						return await userWins();
					}
				}
				if(i + 3 < MAX_ROWS){
					if(board[i+1][j] == "X" && board[i+2][j] == "X" && board[i+3][j] == "X"){
						board[i][j] = "U";
						board[i+1][j] = "U";
						board[i+2][j] = "U";
						board[i+3][j] = "U";
						return await userWins();
					}
				}
				if(i + 3 < MAX_ROWS && j + 3 < MAX_COLUMNS){
					if(board[i+1][j+1] == "X" && board[i+2][j+2] == "X" && board[i+3][j+3] == "X"){
						board[i][j] = "U";
						board[i+1][j+1] = "U";
						board[i+2][j+2] = "U";
						board[i+3][j+3] = "U";
						return await userWins();
					}
				}
				if(i + 3 < MAX_ROWS && j - 3 >= 0){
					if(board[i+1][j-1] == "X" && board[i+2][j-2] == "X" && board[i+3][j-3] == "X"){
						board[i][j] = "U";
						board[i+1][j-1] = "U";
						board[i+2][j-2] = "U";
						board[i+3][j-3] = "U";
						return await userWins();
					}
				}
			}
		}
	}

	return false;
}

async function userWins(){
	helpers.clearScreen();
	drawBoard();
	helpers.beep();

	console.log(leftSpace + "---- Congradulations!, You won the game ---- \n");
	console.log(leftSpace + "             Play again....? \n");
	console.log(leftSpace + "       Yes: Y            No: N \n");

	const answer = await helpers.getUserInput("Enter your answer: ");
	playAgain = !answer.toLowerCase().includes("n");

	return true;
}

async function pcsTurn(){
	if(pcMode.toLowerCase().includes("h")){
		return await checkPcsMove(await pcHardModeMove());
	}
	else if(pcMode.toLowerCase().includes("a")){
		return await checkPcsMove(await pcAiModeMove());
	}
	else {
		return await checkPcsMove(await pcEasyModeMove());
	}
}

async function pcEasyModeMove(){
	return Math.floor(Math.random() * MAX_COLUMNS);
}

async function pcHardModeMove(){
	// Strategies for PC in hard mode
	for(let i = 0; i < MAX_COLUMNS; i++){
		for(let j = 0; j < MAX_ROWS; j++){
			if(j > 0 && j < 3){
				if(board[1][i] == "X" && board[2][i] == " ") return i; // Def from top
				if(board[1][i] == "O" && board[2][i] == " ") return i; // Atk from top
			}

			if(j < MAX_ROWS - 3){
				if(board[j][i] == "X" && (board[j+1] && board[j+1][i] == "X") && (board[j+2] && board[j+2][i] == " ")) return i; // Def from top
			}
			
			if(board[j][i] == "X" && board[j][i+1] == "X" && board[j][i+2] == "X" && board[j][i+3] == " " && (j == 0 || (j != 0 && board[j-1][i+3] != " "))) return i+3; // Def from right
			if(board[j][i] == " " && board[j][i+1] == "X" && board[j][i+2] == "X" && board[j][i+3] == "X" && (j == 0 || (j != 0 && board[j-1][i] != " "))) return i; // Def from left

			if(board[j][i] == "X" && board[j][i+1] == "X" && board[j][i+2] == " " && (j == 0 || (j != 0 && board[j-1][i+2] != " "))) return i+2; // Def from right
			if(board[j][i] == " " && board[j][i+1] == "X" && board[j][i+2] == "X" && (j == 0 || (j != 0 && board[j-1][i] != " "))) return i; // Def from left

			
		}
	}

	//return await pcEasyModeMove();
	return 6;
}

async function pcAiModeMove(){

	return await pcEasyModeMove();
}

async function checkPcsMove(input){
	if(board[MAX_ROWS-1][input] != " ") return await pcsTurn(); // Reached the top of the board // Play another move

	for(let i = 0; i < MAX_COLUMNS; i++){
		if(input == i){
			for(let j = 0; j < MAX_ROWS; j++){
				if(board[j][i] == " "){
					board[j][i] = "O";
					coinsCount++;
					return await isPcWinner();
				}
			}
		}
	}

	return await pcsTurn();
}

async function isPcWinner(){
	for(let i = 0; i < MAX_ROWS; i++){
		for(let j = 0; j < MAX_COLUMNS; j++){
			if(board[i][j] == "O"){
				if(j + 3 < MAX_COLUMNS){
					if(board[i][j+1] == "O" && board[i][j+2] == "O" && board[i][j+3] == "O"){
						board[i][j] = "P";
						board[i][j+1] = "P";
						board[i][j+2] = "P";
						board[i][j+3] = "P";
						return await pcWins();
					}
				}
				if(i + 3 < MAX_ROWS){
					if(board[i+1][j] == "O" && board[i+2][j] == "O" && board[i+3][j] == "O"){
						board[i][j] = "P";
						board[i+1][j] = "P";
						board[i+2][j] = "P";
						board[i+3][j] = "P";
						return await pcWins();
					}
				}
				if(i + 3 < MAX_ROWS && j + 3 < MAX_COLUMNS){
					if(board[i+1][j+1] == "O" && board[i+2][j+2] == "O" && board[i+3][j+3] == "O"){
						board[i][j] = "P";
						board[i+1][j+1] = "P";
						board[i+2][j+2] = "P";
						board[i+3][j+3] = "P";
						return await pcWins();
					}
				}
				if(i + 3 < MAX_ROWS && j - 3 >= 0){
					if(board[i+1][j-1] == "O" && board[i+2][j-2] == "O" && board[i+3][j-3] == "O"){
						board[i][j] = "P";
						board[i+1][j-1] = "P";
						board[i+2][j-2] = "P";
						board[i+3][j-3] = "P";
						return await pcWins();
					}
				}
			}
		}
	}

	return false;
}

async function pcWins(){
	helpers.clearScreen();
	drawBoard();
	helpers.beep();

	console.log(leftSpace + "       ---- You lost the game ---- \n");
	console.log(leftSpace + "             Play again....? \n");
	console.log(leftSpace + "       Yes: Y            No: N \n");

	const answer = await helpers.getUserInput("Enter your answer: ");
	playAgain = !answer.toLowerCase().includes("n");

	return true;
}

async function checkNoOneWins(){
	helpers.clearScreen();
	drawBoard();
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

