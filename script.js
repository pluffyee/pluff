// Sample folder structure
const folderStructure = {
    "Home": {
        "Documents": ["file1.txt", "file2.txt"],
        "Pictures": ["image1.png", "image2.jpg"],
        "Desktop": ["game.exe", "notes.txt"],
        "Mystery": ["assembly_puzzle.js"], // New puzzle file
        "DoNotTouch": ["phase_1.txt", "decode_and_compare.txt", "decode.txt"]
    },
    "Documents": {
        "file1.txt": null,
        "file2.txt": null
    },
    "Pictures": {
        "image1.png": null,
        "image2.jpg": null
    },
    "Desktop": {
        "game.exe": null,
        "notes.txt": null
    },
    "Mystery": {
        "clue1.txt": null,
        "clue2.txt": null
    }
};

let currentPath = ["Home"]; // Start in the Home directory

// Function to handle command input
// Function to handle command input
// Function to handle command input
// Function to handle command input
function handleCommand(command) {
    const output = document.querySelector('.output');

    // Add the command to the output
    output.innerHTML += `<p>${document.getElementById('prompt').textContent}${command}</p>`;

    // Command handling
    if (command === 'ls') {
        listFiles(output);
    } else if (command.startsWith('cd ')) {
        changeDirectory(command.split(' ')[1], output);
    } else if (command === 'disas') {
        // Provide guidance for the next command
        output.innerHTML += `<p>Type <strong>disas phase_1</strong> to continue.</p>`;
    } else if (command.startsWith('disas ') || command.startsWith('inspect memory') || command.startsWith('enter phrase')) {
        handleAssemblyPuzzleCommand(command, output); // Pass output to the function
    } else {
        output.innerHTML += `<p>Unknown command: ${command}</p>`;
    }

    // Scroll to the bottom of the output
    output.scrollTop = output.scrollHeight;

    // Clear the input after processing the command
    inputDiv.textContent = ''; // Clear the input area correctly
    inputDiv.focus(); // Keep focus on the input area
    updatePrompt(); // Update the prompt after command execution
    updateDirectoryTree(); // Update the directory tree display
}



// Function to list files in the current directory
function listFiles(output) {
    const currentDir = currentPath.reduce((acc, dir) => acc[dir], folderStructure);
    const files = Object.keys(currentDir).join(', ');
    output.innerHTML += `<p>${files}</p>`;
}

// Function to change directory
function changeDirectory(dir, output) {
    const currentDir = currentPath.reduce((acc, d) => acc[d], folderStructure);
    if (currentDir[dir]) {
        currentPath.push(dir);
        output.innerHTML += `<p>Changed directory to ${currentPath.join('\\')}</p>`;
        
        // Check if the user entered the "Mystery" directory
        if (dir === "Mystery") {
            output.innerHTML += `<p>Type <strong>disas phase_1</strong> to continue.</p>`;
        }
    } else if (dir === '..') {
        if (currentPath.length > 1) {
            currentPath.pop(); // Go back to the previous directory
            output.innerHTML += `<p>Changed directory to ${currentPath.join('\\')}</p>`;
        } else {
            output.innerHTML += `<p>You are already at the root directory.</p>`;
        }
    } else {
        output.innerHTML += `<p>No such directory: ${dir}</p>`;
    }
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

    // Create a pointer to show where we are
    const pointer = '→';
    directoryTree.innerHTML += `${pointer} ${currentPath[currentPath.length - 1]}`;
}

// Initialize the game
updatePrompt(); // Set initial prompt
updateDirectoryTree(); // Set initial directory tree

// Handle input from the contenteditable div
const inputDiv = document.getElementById('input');
inputDiv.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const command = inputDiv.innerText.trim();
        if (command) { // Only process if there is a command
            handleCommand(command);
        }
        event.preventDefault(); // Prevent newline in contenteditable
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

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    // If the user clicks on the title bar, initiate dragging
    const titleBar = elmnt.querySelector('.title-bar');
    titleBar.onmousedown = dragMouseDown;
    terminalIcon.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Initialize the terminal window to be hidden
terminalWindow.style.display = 'none';