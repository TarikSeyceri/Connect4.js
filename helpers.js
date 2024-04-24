const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports = new function(){
    this.clearScreen = function() {
        //console.log('\u001b[2J'); // Linux Clear Screen
        //process.stdout.write('\x1b\x63'); // Windows Clear screen
        console.clear(); // General Clear Screen
    }

    this.beep = function() {
        // Bellow tested on windows
        //process.stdout.write('\u0007');
        console.log('\u0007');
    }
    
    this.getUserInput = async function(question = "") {
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                if (answer.toLowerCase() === 'exit') { // Check if the user wants to exit
                    rl.close(); // Close the readline interface
                }
                resolve(answer);
            });
        });
    }
}