# Connect 4 Game

## Student
- STUDENT NAME: TARIK SEYCERİ
- STUDENT ID: 1702899
- BAU UNIVERSITY - CMP5999 Project

## Introduction

Connect 4 is a classic two-player game where players take turns dropping colored discs 
into a vertically suspended grid. The objective is to connect four of one's own discs 
consecutively either horizontally, vertically, or diagonally. This implementation 
leverages JavaScript to create an interactive and challenging game experience.
This is a JavaScript implementation of the classic Connect 4 game, features different 
difficulty levels for AI opponents. The game can be played in the terminal and supports 
user vs. computer as well as computer vs. computer modes.

## Features

- Multiple game modes: user vs. computer, computer vs. computer.
- Different AI difficulty levels: Easy, Hard, and AI (using the minimax algorithm).
- Interactive terminal-based user interface.
- Clear screen and beep sound notifications for enhanced user experience.

## File Structure

- `main.js`: Contains the core game logic, including board initialization, game flow, and AI strategies.
- `terminal.js`: Manages user input/output and provides utility functions.

## Installation

1. Ensure you have Node.js installed on your system.
2. Clone this repository or download the source code.
3. Navigate to the project directory in your terminal.

## Usage

1. Run the game using Node.js:

```bash
node main.js
```

2. Follow the on-screen instructions to play the game.

## Gameplay Instructions

- The game will prompt you to choose the difficulty level of the AI opponent.
- You will be asked if you want to play first.
- Enter your moves by specifying the column number (1 to 7).
- The game will alternate turns between the player and the computer until a winner is determined or the board is full.
- You can exit the game at any time by typing exit.
