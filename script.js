const folderStructure = {
    "Home": {
        "about_me": ["file1.txt", "file2.txt"],
        "rythm": ["notes.txt"],
        "puzzle1": ["assembly_puzzle.js"], // New puzzle file
        "puzzle2": {}, // New directory for the vault game
        "donottouch": {}
    },
    "documents": {
        "file1.txt": null,
        "file2.txt": null
    },
    "desktop": {
        "notes.txt": null
    },
    "puzzle1": {
        "clue1.txt": null,
        "clue2.txt": null
    }
};

const encodedPhraseAddress = 0x403300;
const encodedPhrase = "D zwlj-iqn lmkqj ns tqfns xmnjy"; // Encoded with Caesar cipher
const decoyAddresses = {
    0x403310: "Nothing here but shadows.",
    0x403320: "Wrong path leads to failure.",
};
let decodedPhrase = "A wolf-dog hides in plain sight";
let isPuzzleSolved = false;
let welcomeMessageDisplayed = false;

// Function to decode the Caesar cipher

let currentPath = ["Home"]; // Start in the Home directory

function handleAssemblyPuzzleCommand(command, output) {
    if (!welcomeMessageDisplayed) {
        output.innerHTML += `<p><b>Welcome to the Enigma Debugger!</b></p>`;
        output.innerHTML += `<p>The system is locked, and a hidden phrase is the key to unlocking it.</p>`;
        output.innerHTML += `<p><b>Rules:</b></p>`;
        output.innerHTML += `<p>1. Use the debugger to analyze assembly and memory.</p>`;
        output.innerHTML += `<p>2. Decipher the hidden phrase using clues.</p>`;
        output.innerHTML += `<p>3. Enter the correct phrase to unlock the system.</p>`;
        output.innerHTML += `<p><b>Commands Available:</b></p>`;
        output.innerHTML += `<p>1. disas [function] - Disassemble a function.</p>`;
        output.innerHTML += `<p>2. inspect memory [address] - Inspect memory contents.</p>`;
        output.innerHTML += `<p>3. enter phrase [your_input] - Test your solution.</p>`;
        output.innerHTML += `<p><b>Hints:</b></p>`;
        output.innerHTML += `<p>- Some memory addresses are decoys.</p>`;
        output.innerHTML += `<p>- The phrase is encoded using a cipher and must be decoded.</p>`;
        welcomeMessageDisplayed = true;
    }

    if (command === "disas puzzle1") {
        output.innerHTML += `<p>Disassembling function: puzzle_logic...</p>`;
        output.innerHTML += `<p>0x400ef4 <+4>: mov rdi, 0x403300</p>`;
        output.innerHTML += `<p>0x400ef9 <+9>: call decode</p>`;
        output.innerHTML += `<p>0x400f00 <+16>: call strcmp</p>`;
    } else if (command === "disas decode") {
        output.innerHTML += `<p>Disassembling function: decode...</p>`;
        output.innerHTML += `<p>0x401507 <+7>: sub al, dl ; Shift each letter back by the key</p>`;
        output.innerHTML += `<p>0x40150a <+10>: cmp al, 'a' ; Wrap around for lowercase</p>`;
        output.innerHTML += `<p>0x401510 <+16>: jne .next</p>`;
    } else if (command.startsWith("inspect memory")) {
        const parts = command.split(" ");
        const address = parts.slice(2).join(" ");

        // Convert the address to a number for comparison
        const addressNumber = parseInt(address, 16);

        if (addressNumber === encodedPhraseAddress) {
            output.innerHTML += `<p>Memory at 0x${encodedPhraseAddress.toString(16)}: "${encodedPhrase}"</p>`;
        } else if (decoyAddresses[addressNumber]) {
            output.innerHTML += `<p>${decoyAddresses[addressNumber]}</p>`;
        } else {
            output.innerHTML += `<p>No data at 0x${address.toString(16)}.</p>`;
        }
    } else if (command.startsWith("enter phrase")) {
        const inputPhrase = command.split(" ").slice(2).join(" ");
        if (inputPhrase === decodedPhrase) {
            isPuzzleSolved = true;
            output.innerHTML += `<p><strong>System Unlocked!</strong> You've solved the puzzle. Here is the 1st half: 1jbq-38RlArQ93nFoO</p>`;
        } else {
            output.innerHTML += `<p><strong>BOOM!</strong> You chose the wrong path.</p>`;
        }
    } else {
        output.innerHTML += `<p>Unknown command: ${command}</p>`;
    }

    output.scrollTop = output.scrollHeight; // Scroll to bottom
}

let inPuzzleMode = false; // Flag to indicate if we are in puzzle mode





//Game2
let inVaultGame = false; // Flag to indicate if we are in the vault game
const vaults = [1, 2, 3]; // Vaults available
let keyLocation; // Where the key is located
let userChoice; // User's initial choice
let revealedVault; // Vault that is revealed to be empty
let finalChoice; // User's final choice after switching
let switchChoice; // To track if the user wants to switch
let isGameOver = false; // Flag to indicate if the game is over

function startVaultGame(output) {
    // Randomly select the vault that contains the key (1, 2, or 3)
    keyLocation = vaults[Math.floor(Math.random() * vaults.length)];
    
    output.innerHTML += `<p>Welcome to the Vault Challenge!</p>`;
    output.innerHTML += `<p>Three vaults: 0x001, 0x002, 0x003. One contains the key.</p>`;
    output.innerHTML += `<p>Enter your initial vault choice (1-3):</p>`;
    inVaultGame = true; // Set the flag to indicate the vault game is active
}

function calculateReveal(output) {
    // Reveal a vault that is not the player's choice and does not contain the key
    revealedVault = vaults.find(vault => vault !== userChoice && vault !== keyLocation);
    output.innerHTML += `<p>I'll reveal an empty vault for you... Vault ${revealedVault} is empty.</p>`;
    offerSwitch(output); // Prompt the user to switch or stay
}

function offerSwitch(output) {
    output.innerHTML += `<p>Would you like to switch your choice? (1 for yes, 0 for no):</p>`;
    switchChoice = true; // Indicate that the game is waiting for a switch decision
}



function processSwitch(choice, output) {
    const switchDecision = parseInt(choice);

    if (switchDecision === 1) {
        // Player chooses to switch
        finalChoice = vaults.find(vault => vault !== userChoice && vault !== revealedVault);
        output.innerHTML += `<p>You switched to vault ${finalChoice}.</p>`;
    } else if (switchDecision === 0) {
        // Player chooses not to switch
        finalChoice = userChoice;
        output.innerHTML += `<p>You kept your choice of vault ${finalChoice}.</p>`;
    } else {
        output.innerHTML += `<p>Invalid input. Please enter 1 for yes or 0 for no.</p>`;
        return; // Exit without progressing
    }

    checkWin(output); // Determine if the player won or lost
}

function checkWin(output) {
    if (finalChoice === keyLocation) {
        output.innerHTML += `<p>Congratulations! You found the key! Here is the 2nd half: fIDZr90Ab3JWZoG</p>`;
    } else {
        output.innerHTML += `<p>Sorry! The vault was empty.</p>`;
    }
    resetGame(); // Reset the game state after completion
}

function makeChoice(choice, output) {
    if (isGameOver) {
        output.innerHTML += `<p>The game is already over. Please restart to play again.</p>`;
        return;
    }

    if (!switchChoice) {
        // Initial choice
        userChoice = parseInt(choice);
        if (!vaults.includes(userChoice)) {
            output.innerHTML += `<p>Invalid choice. Please choose a vault (1-3).</p>`;
            return;
        }

        output.innerHTML += `<p>You chose vault ${userChoice}.</p>`;
        calculateReveal(output); // Reveal an empty vault
    } else {
        // Process switch choice
        processSwitch(choice, output); // Decide whether to switch or not
    }
}
function resetGame(output) {
    isGameOver = false; // Reset to false instead of true
    inVaultGame = false;
    switchChoice = undefined;
    userChoice = undefined;
    finalChoice = undefined;
    revealedVault = undefined;
    keyLocation = undefined;

    output.innerHTML += `<p>Game over. Exiting back to Home directory...</p>`;
    currentPath = ["Home"];
    updatePrompt();
    updateDirectoryTree();
}





//end game 2

function handleCommand(command) {
    const output = document.querySelector('.output');
    const sanitizedCommand = command.trim();

    // Show the entered command
    output.innerHTML += `<p>${document.getElementById('prompt').textContent} ${sanitizedCommand}</p>`;

    if (sanitizedCommand === 'ls') {
        listFiles(output);
    } else if (sanitizedCommand.startsWith('cd ')) {
        changeDirectory(sanitizedCommand.split(' ')[1], output);
    } else if (sanitizedCommand === 'disas puzzle1') {
        inPuzzleMode = true; // Enter puzzle mode
        handleAssemblyPuzzleCommand('disas puzzle1', output);
    } else if (inVaultGame) {
        // Handle vault game input
        makeChoice(sanitizedCommand, output); // Process the vault choice
    } else if (isGameOver) {
        output.innerHTML += `<p>Unknown command: ${sanitizedCommand}</p>`;
        output.innerHTML += `<p>Game has ended. Use <strong>cd ..</strong> to navigate or <strong>ls</strong> to explore.</p>`;
    } else if (inPuzzleMode) {
        if (sanitizedCommand === 'exit') {
            inPuzzleMode = false; // Exit puzzle mode
            currentPath = ["Home"]; // Return to Home directory
            output.innerHTML += `<p>Exited puzzle mode. Returned to Home.</p>`;
            updatePrompt(); // Update the prompt
            updateDirectoryTree(); // Update the directory tree
        } else {
            handleAssemblyPuzzleCommand(sanitizedCommand, output); // Continue handling commands in puzzle mode
        }
    } else {
        output.innerHTML += `<p>Unknown command: ${sanitizedCommand}</p>`;
    } 

    // Scroll output and clear input
    output.scrollTop = output.scrollHeight;
    inputDiv.textContent = '';
    inputDiv.focus();
    updatePrompt();
}


// Function to list files in the current directory
function listFiles(output) {
    const currentDir = currentPath.reduce((acc, dir) => acc[dir], folderStructure);
    if (Array.isArray(currentDir)) {
        output.innerHTML += `<p>${currentDir.join(', ')}</p>`;
    } else if (typeof currentDir === 'object') {
        const entries = Object.keys(currentDir);
        output.innerHTML += `<p>${entries.join(', ')}</p>`;
    } else {
        output.innerHTML += `<p>No files in the directory.</p>`;
    }
}


function changeDirectory(dir, output) {
    // Get the current directory object
    const currentDir = currentPath.reduce((acc, d) => acc[d], folderStructure);
    
    // Handle directory navigation
    if (dir === '..') {
        if (currentPath.length > 1) {
            currentPath.pop();
            output.innerHTML += `<p>Changed directory to ${currentPath.join('\\')}</p>`;
        } else {
            output.innerHTML += `<p>You are already at the root directory.</p>`;
        }
        return;
    }
    if (dir === 'about_me') {
        displayAboutMe(output); // Render the about_me profile
        return;
    }
    // Check if the target is a directory
    if (currentDir[dir] && typeof currentDir[dir] === 'object') {
        currentPath.push(dir);
        output.innerHTML += `<p>Changed directory to ${currentPath.join('\\')}</p>`;
        
        // Special directory handling
        if (dir === "puzzle1") {
            output.innerHTML += `<p>Type <strong>disas puzzle1</strong> to continue.</p>`;

        } if (dir === "puzzle2") {
        // Reset all game states when entering puzzle2
            isGameOver = false;
            inVaultGame = false;
            switchChoice = undefined;
            userChoice = undefined;
            finalChoice = undefined;
            revealedVault = undefined;
            keyLocation = undefined;
        
        // Then start the game
            startVaultGame(output);
        } else if (dir === "rythm") {
            output.innerHTML += `<p>The answer's locked in numbers' hold,</p>`;
            output.innerHTML += `<p>Hex is the key, let truth unfold.</p>`;
            output.innerHTML += `<p>XOR the bytes to break the seal,</p>`;
            output.innerHTML += `<p>Decode the phrase, the code reveal.</p>`;
        } else if (dir === "donottouch") {
            output.innerHTML += `<p><strong>Access granted! Here's your link: <p>https://drive.google.com/file/d/[1st-half][2nd-half]/view?usp=sharing</p></strong></p>`;
        }
        return;
    }
    
    output.innerHTML += `<p>No such directory or file: ${dir}</p>`;
}



// Function to update the command prompt based on the current path
function updatePrompt() {
    const prompt = document.getElementById('prompt');
    prompt.textContent = `C:\\Users\\Pluffyee\\${currentPath.join('\\')}\\>`;
}


// Function to update the directory tree display
function updateDirectoryTree() {
    const directoryTree = document.getElementById('directory-tree');
    directoryTree.innerHTML = `Current Directory: ${currentPath.join('\\')} <br>`;
    directoryTree.innerHTML = `<strong> "ls"</strong> to search the directory. "cd [foldername]"</strong> to enter a folder. "cd .."</strong> to exit a folder.`;
}

// Initialize the game
updatePrompt(); // Set initial prompt
updateDirectoryTree(); // Set initial directory tree

// Handle input from the contenteditable div
const inputDiv = document.getElementById('input');
inputDiv.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default newline

        const command = inputDiv.innerText.trim(); // Get the typed command
        if (command) {
            handleCommand(command); // Process the command
        }

        inputDiv.innerText = ''; // Clear input after Enter
        setTimeout(() => inputDiv.focus(), 0); // Refocus on the input area
    }
});




// Focus on the input div to start typing immediately
inputDiv.focus();

// Show terminal window when the icon is clicked
const terminalIcon = document.getElementById('terminal-icon');
const terminalWindow = document.getElementById('terminal-window');

// Function to toggle terminal window visibility
function toggleTerminal() {
    if (terminalWindow.style.display === 'flex') {
        terminalWindow.style.display = 'none'; // Hide the terminal window
    } else {
        terminalWindow.style.display = 'flex'; // Show the terminal window
    }
}

// Show terminal window when the icon is clicked
terminalIcon.addEventListener('click', toggleTerminal);

// Close terminal window when the close button is clicked
const closeButton = document.getElementById('close');
closeButton.addEventListener('click', toggleTerminal);

// Make the terminal window draggable
dragElement(terminalWindow);

function displayAboutMe(output) {
    const aboutMeHTML = `
        <div class="container">
            <div class="main-content">
                <div class="header">
                    <span class="prompt">root@pluffyee-system:~$</span> ./display_profile.sh
                </div>
                <div class="section">
                    <div><span class="label">User:</span> Pluffyee</div>
                    <div><span class="label">Race:</span> Wolf (babyfur) <span class="warning">[!] Don't look it up</span></div>
                    <div><span class="label">DoB:</span> 09/01/2002</div>
                    <div><span class="label">Furry Age:</span> 2 years</div>
                    <div><span class="label">Location:</span> Houston, TX (Ex-VIP District 12, HCMC)</div>
                    <div><span class="label">Ocp:</span> MSc in Data Science in Georgia Tech</div>
                </div>
                <div class="divider"></div>
                <div class="section">
                    <div><span class="label">Hobbies:</span> Furry socializing, Photography, Cooking</div>
                    <div><span class="label">Dreams:</span> Acquiring PhD. MS. titles</div>
                    <div><span class="label">Shows:</span> TAWOG, ATLA, Family Guy, Bluey</div>
                    <div><span class="label">Fun Fact:</span> Ex-admin of Viettoons (Family Guy subber)</div>
                </div>
                <div class="divider"></div>
                <div class="section">
                    <div class="info">FURRY STATUS:</div>
                    <div>• Full suit owned ✓</div>
                    <div>• Future: Commissioning Digitigrade Fursuit</div>
                    <div>• Cons: Midwest Furfest (Dec), Anthrocon, FWA (May)</div>
                </div>
                <div class="divider"></div>
                <div class="section">
                    <div class="success">CONTACT INFO:</div>
                    <div>• Open for new friends 24/7</div>
                    <div>• Languages: 🇻🇳 Vietnamese | 🇺🇸 English </div>
                    <div>• Timezone: US Central (active until 9 PM)</div>
                </div>
            </div>
            <div class="ascii-art">
                   ,ood8888booo,
                  ,od8           8bo,
               ,od                   bo,
             ,d8                       8b,
            ,o                           o,    ,a8b
           ,8                             8,,od8  8
           8'                             d8'     8b
           8                           d8'ba     aP'
           Y,                       o8'         aP'
            Y8,                      YaaaP'    ba
             Y8o                   Y8'         88
              Y8               ,8"           P
                Y8o        ,d8P'              ba
           ooood8888888P"""'                  P'
        ,od                                  8
     ,dP     o88o                           o'
    ,dP          8                          8
   ,d'   oo       8                       ,8
   $    d$"8      8           Y    Y  o   8
  d    d  d8    od  ""boooooooob   d"" 8   8
  $    8  d   ood' ,   8        b  8   '8  b
  $   $  8  8     d  d8        b  d    '8  b
   $  $ 8   b    Y  d8          8 ,P     '8  b
   $$  Yb  b     8b 8b         8 8,      '8  o,
        Y  b      8o  $$o      d  b        b   $o
         8   $     8$,,$"      $   $o      '$o$$
          $o$$P"                 $$o$

⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠻⣥⠙⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡿⠀⡿⠻⣆⠙⠦⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⡄⠁⠀⠘⣆⡔⢶⣆⠉⢷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡄⠀⠀⡿⢿⡀⠉⠀⠞⠹⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡿⡄⠀⡇⠘⣧⣀⣀⣀⠀⠻⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⠃⠁⢀⣠⠞⣹⢿⠻⡟⢿⣿⣯⢳⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⠃⠶⠒⠉⠁⣴⠇⢸⡇⡟⡷⢬⡙⠎⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⠇⢀⣠⣄⡀⠚⠁⠀⠈⠀⠀⣷⠀⠉⠛⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⣽⣿⣶⠋⢉⡿⠇⠀⠀⠀⠀⠀⣰⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢱⣿⣿⠇⠀⣠⣥⣤⡀⠀⠀⠀⢀⡟⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⢿⣿⢀⣾⡟⠉⢹⡇⠀⠀⠀⢸⠁⡿⠙⣿⣷⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⢸⣇⣾⡟⠀⠸⡏⣄⡀⠀⠀⢹⢀⡇⢀⢘⢿⣮⡙⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣇⠀⡀⣧⠰⣿⣶⣄⠀⠀⠀⠘⣎⠳⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡿⣿⣆⠹⣿⡐⣾⣷⣹⣆⠀⠀⠀⠘⢷⣄⣻⣿⣿⣷⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⢿⣿⣦⠽⣇⣹⣟⢿⠙⠁⠀⠀⠀⣤⠉⠻⣿⣿⣿⣿⣦⡀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠙⡟⠂⣿⢹⡿⣼⠇⠀⠀⣀⠀⣷⡀⠀⠈⠻⣿⣿⣿⣷⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡆⢻⠀⠉⢸⡇⠈⣀⣠⣾⠇⠀⠻⣿⣦⣤⣴⣿⠿⣿⡿⣷⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⡇⢸⡀⠀⢸⠁⣰⠛⣽⡧⠖⠻⢿⡆⠈⠉⠉⠀⠀⢻⣷⠹⠇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠘⡇⠀⢸⢰⡏⢰⡟⠀⣀⣀⡼⠃⠀⢀⡆⠀⠀⠘⣿⡆⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣴⣿⣶⣷⣶⣾⣿⣧⣾⣤⣄⣀⣀⣤⣤⣶⡿⠀⠀⠀⢠⣿⡇⠀
⠀⠀⠀⠀⠀⠀⠀⣠⣴⣾⣿⣟⡛⠛⠛⠉⠉⠉⠉⢉⣭⣽⡿⠿⠿⠿⠛⠛⠛⠓⠲⠦⠄⣼⢻⡇⠀
⠀⠀⠀⠀⠀⠀⠘⢉⣼⣿⣿⠿⠛⠛⠁⠀⠀⣠⠖⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠁⣸⡇⠀
⠀⠀⠀⠀⠀⢀⣴⠿⠛⠁⢀⣀⣀⣀⣀⣀⣄⡀⠀⠀⠀⢦⣀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠇⣰⣿⠁⠀
⠀⠀⠀⢀⣴⣟⣥⣶⣾⣿⣿⣿⣿⣿⣿⣭⣤⣤⣤⣀⣀⡀⠈⠛⠶⢶⣶⣶⣶⣾⣿⣿⣿⠟⠁⠀⠀
⠀⢀⣴⡿⠟⠋⡽⠟⠉⠉⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠙⠛⠛⠛⠿⠿⠿⠿⠟⠛⠉⠁⠀⠀⠀⠀
⠐⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            </div>
        </div>`;
    output.innerHTML = aboutMeHTML; // Replace the output with the about_me HTML
}

// Add this function to handle dragging elements
function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    const titleBar = elmnt.querySelector('.title-bar');
    if (titleBar) {
        titleBar.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

terminalWindow.style.display = 'none';
