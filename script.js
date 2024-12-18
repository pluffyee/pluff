// Sample folder structure
const folderStructure = {
    "Home": {
        "douments": ["file1.txt", "file2.txt"],
        "pictures": ["image1.png", "image2.jpg"],
        "rythm": ["notes.txt"],
        "mystery": ["assembly_puzzle.js"], // New puzzle file
        "donottouch": ["phase_1.txt", "decode_and_compare.txt", "decode.txt"]
    },
    "documents": {
        "file1.txt": null,
        "file2.txt": null
    },
    "desktop": {
        "notes.txt": null
    },
    "mystery": {
        "clue1.txt": null,
        "clue2.txt": null
    }
};

const encodedPhraseAddress = 0x403300;
const encodedPhrase = [0x50, 0x6c, 0x75, 0x66, 0x66, 0x79, 0x65, 0x65, 0x20, 0x69, 0x73, 0x20, 0x61, 0x20, 0x77, 0x6f, 0x6c, 0x66, 0x2d, 0x64, 0x6f, 0x67];
const decoyAddresses = {
    0x403310: "Wrong guess!",
    0x403320: "Not it either!"
};

let decodedPhrase = "";
let isPuzzleSolved = false;

// Function to decode the phrase
function decodePhrase() {
    decodedPhrase = encodedPhrase.map(byte => byte ^ 0x5F).map(byte => String.fromCharCode(byte)).join('');
}
let currentPath = ["Home"]; // Start in the Home directory
let welcomeMessageDisplayed = false; // Flag to track if the welcome message has been displayed
function handleAssemblyPuzzleCommand(command, output) {
    // Only display the welcome message if it hasn't been shown yet
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
        output.innerHTML += `<p>- The phrase is encoded and must be interpreted.</p>`;
        output.innerHTML += `<p>You have entered the game 1'</p>`;
        
        welcomeMessageDisplayed = true; // Set the flag to true after displaying the message
    }

    // Handle specific commands
    if (command.replace(/\s+/g, ' ') === 'disas phase_1') {
        output.innerHTML += `<p>Disassembling function: game 1</p>`;
        output.innerHTML += `<p>0x400ef0 <+0>:          sub         $0x8, %rsp                          // Prepare the stack</p>`;
        output.innerHTML += `<p>0x400ef4 <+4>:          mov         $0x403300, %esi                     // Load address of encoded string</p>`;
        output.innerHTML += `<p>0x400ef9 <+9>:          callq       0x401400 func(decode_and_compare)   // Decode and compare input</p>`;
        output.innerHTML += `<p>0x400efe <+14>:         test        %eax, %eax                          // Check result of comparison</p>`;
        output.innerHTML += `<p>0x400f00 <+16>:         je          0x400f20 func(success)              // Jump to success if equal</p>`;
        output.innerHTML += `<p>0x400f02 <+18>:         callq       0x401574 func(explode)              // Otherwise, explode</p>`;
        output.innerHTML += `<p>0x400f07 <+23>:         add         $0x8, %rsp</p>`;
        output.innerHTML += `<p>0x400ef9 <+9>:          callq       0x401400 func(decode_and_compare)</p>`;
        output.innerHTML += `<p>0x400f0b <+27>:         retq                                            // Return</p>`;
    } else if (command.startsWith('disas decode_and_compare')) {
        output.innerHTML += `<p>Disassembling function: decode_and_compare...</p>`;
        output.innerHTML += `<p>0x401400 <+0>:     push   %rbp</p>`;
        output.innerHTML += `<p>0x401401 <+1>:     mov    %rsp, %rbp</p>`;
        output.innerHTML += `<p>0x401404 <+4>:     mov    %rsi, %rdi                                    // Load encoded string</p>`;
        output.innerHTML += `<p>0x401407 <+7>:     callq  0x401500 func(decode)                         // Decode the string</p>`;
        output.innerHTML += `<p>0x40140c <+12>:    callq  0x40130e func(strings_not_equal)              // Compare decoded string to input</p>`;
        output.innerHTML += `<p>0x401411 <+17>:    leave</p>`;
        output.innerHTML += `<p>0x401412 <+18>:    retq</p>`;    
    } else if (command.startsWith('disas decode')) {
        output.innerHTML += `<p>Disassembling function: decode...</p>`;
        output.innerHTML += `<p>0x401500 <+0>:     push   %rbp</p>`;
        output.innerHTML += `<p>0x401501 <+1>:     mov    %rsp, %rbp</p>`;
        output.innerHTML += `<p>0x401504 <+4>:     mov    %rdi, %rsi           // Load address of encoded string</p>`;
        output.innerHTML += `<p>0x401507 <+7>:     xor    $0x5F, (%rsi)        // XOR the first byte with 0x5F</p>`;
        output.innerHTML += `<p>0x40150a <+10>:    inc    %rsi                 // Move to next byte</p>`;
        output.innerHTML += `<p>0x40150d <+13>:    cmpb   $0x0, (%rsi)         // Check for null terminator</p>`;
        output.innerHTML += `<p>0x401510 <+16>:    jne    0x401507 func(decode+7)  // Repeat until null terminator</p>`;
        output.innerHTML += `<p>0x401512 <+18>:    leave</p>`;
        output.innerHTML += `<p>0x401513 <+19>:    retq</p>`;
    } else if (command.startsWith('inspect memory')) {
        const parts = command.split(' ');

        // Check if the command has the correct number of parts
        if (parts.length < 3) {
            output.innerHTML += `<p>Error: Please provide a memory address.</p>`;
        return;
        }

        const address = parseInt(parts[2], 16); // Parse the address as a hexadecimal number

        // Check if the parsed address is a valid number
        if (isNaN(address)) {
            output.innerHTML += `<p>Error: Invalid memory address format.</p>`;
        return;
        }

        // Check if the address matches the encoded phrase address
        if (address === encodedPhraseAddress) {
            output.innerHTML += `<p>Memory at 0x403300: ${encodedPhrase.join(' ')}</p>`;
        } 
        // Check if the address is in the decoy addresses
        else if (decoyAddresses[address]) {
            output.innerHTML += `<p>${decoyAddresses[address]}</p>`;
        } 
    // If the address is not recognized
        else {
            output.innerHTML += `<p>No data at 0x${address.toString(16)}.</p>`;
        }
    } else if (command.startsWith('enter phrase')) {
        const inputPhrase = command.split(' ').slice(2).join(' ');
        if (inputPhrase === "Pluffye is a wolf-dog") {
            isPuzzleSolved = true;
            output.innerHTML += `<p><strong>System Unlocked!</strong> You've solved the puzzle.</p>`;
        } else {
            output.innerHTML += `<p><strong>BOOM!</strong> The system exploded.</p>`;
        }

    }else {
        output.innerHTML += `<p>Unknown command: ${command}</p>`;
    }

    output.scrollTop = output.scrollHeight; // Scroll to bottom
}

// Function to handle commands for the assembly puzzle

// Initialize the puzzle
decodePhrase(); // Decode the phrase at the start
// Handle input commands

let inPuzzleMode = false; // Flag to indicate if we are in puzzle mode


function handleCommand(command) {
    const output = document.querySelector('.output');
    const sanitizedCommand = command.trim();

    // Show the entered command
    output.innerHTML += `<p>${document.getElementById('prompt').textContent} ${sanitizedCommand}</p>`;

    if (sanitizedCommand === 'ls') {
        listFiles(output);
    } else if (sanitizedCommand.startsWith('cd ')) {
        changeDirectory(sanitizedCommand.split(' ')[1], output);
    } else if (sanitizedCommand === 'disas phase_1') {
        inPuzzleMode = true; // Enter puzzle mode
        handleAssemblyPuzzleCommand(sanitizedCommand, output);
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

// Function to change directory
// Function to open an image viewer
function openImageViewer(imagePath) {
    // Create a container for the image viewer
    const imageViewer = document.createElement('div');
    imageViewer.className = 'image-viewer';
    imageViewer.style.position = 'absolute';
    imageViewer.style.top = '50px';
    imageViewer.style.left = '50px';
    imageViewer.style.width = '300px';
    imageViewer.style.height = 'auto';
    imageViewer.style.backgroundColor = '#333';
    imageViewer.style.border = '1px solid #888';
    imageViewer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    imageViewer.style.zIndex = 1000;

    // Add title bar
    const titleBar = document.createElement('div');
    titleBar.className = 'title-bar';
    titleBar.style.backgroundColor = '#222';
    titleBar.style.color = '#fff';
    titleBar.style.padding = '5px';
    titleBar.style.cursor = 'move';
    titleBar.style.fontSize = '14px';
    titleBar.innerHTML = `<span>${imagePath}</span> <button class="close-btn" style="float: right; color: #fff;">X</button>`;
    imageViewer.appendChild(titleBar);

    // Add the image element
    const imageElement = document.createElement('img');
    imageElement.src = `assets/${imagePath}`; // Use your asset path
    imageElement.style.width = '100%';
    imageElement.style.height = 'auto';
    imageElement.alt = imagePath;
    imageViewer.appendChild(imageElement);

    // Add the image viewer to the body
    document.body.appendChild(imageViewer);

    // Make the image viewer draggable
    dragElement(imageViewer);

    // Close functionality
    const closeButton = titleBar.querySelector('.close-btn');
    closeButton.addEventListener('click', () => {
        imageViewer.remove();
    });
}

// Update the changeDirectory function to handle image files

function changeDirectory(dir, output) {
    const currentDir = currentPath.reduce((acc, d) => acc[d], folderStructure);

    if (currentDir[dir]) {
        // Navigate to directory
        currentPath.push(dir);
        output.innerHTML += `<p>Changed directory to ${currentPath.join('\\')}</p>`;
        updatePrompt();
        updateDirectoryTree();
    } else if (Array.isArray(currentDir) && currentDir.includes(dir)) {
        // Open file
        const fileExtension = dir.split('.').pop().toLowerCase();
        if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
            openImageFile(dir);
        } else {
            output.innerHTML += `<p>${dir} is not a directory and cannot be opened.</p>`;
        }
    } else if (dir === '..') {
        // Navigate to parent directory
        if (currentPath.length > 1) {
            currentPath.pop();
            output.innerHTML += `<p>Changed directory to ${currentPath.join('\\')}</p>`;
            updatePrompt();
            updateDirectoryTree();
        } else {
            output.innerHTML += `<p>You are already at the root directory.</p>`;
        }
    } else {
        output.innerHTML += `<p>No such directory or file: ${dir}</p>`;
    }
}


function changeDirectory(dir, output) {
    const currentDir = currentPath.reduce((acc, d) => acc[d], folderStructure);
    if (currentDir[dir]) {
        currentPath.push(dir);
        output.innerHTML += `<p>Changed directory to ${currentPath.join('\\')}</p>`;
        if (dir === "mystery") {
            output.innerHTML += `<p>Type <strong>disas phase_1</strong> to continue.</p>`;
        }

        if (dir === "rythm") {
            output.innerHTML += `<p>The answer's locked in numbers' hold,</p>`;
            output.innerHTML += `<p>Hex is the key, let truth unfold.</p>`;
            output.innerHTML += `<p>XOR the bytes to break the seal,</p>`;
            output.innerHTML += `<p>Decode the phrase, the code reveal.</p>`;
        }
    } else if (currentDir[dir] === null) {
        // Handle file case
        const fileExtension = dir.split('.').pop().toLowerCase();
        if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
            openImageViewer(dir); // Open image viewer for images
        } else {
            output.innerHTML += `<p>Cannot open file: ${dir}</p>`;
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

// Make any element draggable
function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    // If the user clicks on the title bar, initiate dragging
    const titleBar = elmnt.querySelector('.title-bar');
    titleBar.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate the new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set the element's new position
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Stop moving when mouse button is released
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
function openImageFile(fileName) {
    const imgWindow = document.createElement('div');
    imgWindow.classList.add('image-window');
    imgWindow.style.position = 'absolute';
    imgWindow.style.top = '100px';
    imgWindow.style.left = '100px';
    imgWindow.style.border = '2px solid #000';
    imgWindow.style.backgroundColor = '#fff';
    imgWindow.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.1)';
    imgWindow.style.zIndex = '1000';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.onclick = () => imgWindow.remove();

    const imgElement = document.createElement('img');
    imgElement.src = `images/${fileName}`; // Replace with the actual file path
    imgElement.style.maxWidth = '400px';
    imgElement.style.maxHeight = '300px';

    imgWindow.appendChild(closeButton);
    imgWindow.appendChild(imgElement);
    document.body.appendChild(imgWindow);
}
// Initialize the terminal window to be hidden
terminalWindow.style.display = 'none';