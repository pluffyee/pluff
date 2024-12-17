// assembly_puzzle.js

const encodedPhraseAddress = 0x403300;
const encodedPhrase = [0x5B, 0x50, 0x55, 0x5A, 0x5A, 0x5E, 0x44, 0x45, 0x0];
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

// Function to handle commands for the assembly puzzle
function handleAssemblyPuzzleCommand(command, output) {
    if (command === 'disas phase_1') {
        output.innerHTML += `<p>Disassembling function: phase_1...</p>`;
        output.innerHTML += `<p>0x400ef0 <+0>: sub $0x8, %rsp</p>`;
        output.innerHTML += `<p>0x400ef4 <+4>: mov $0x403300, %esi</p>`;
        output.innerHTML += `<p>0x400ef9 <+9>: callq 0x401400 <decode_and_compare></p>`;
        // Add more disassembly lines as needed
    } else if (command.startsWith('inspect memory')) {
        const address = parseInt(command.split(' ')[2], 16);
        if (address === encodedPhraseAddress) {
            output.innerHTML += `<p>Memory at 0x403300: ${encodedPhrase.join(' ')}</p>`;
        } else if (decoyAddresses[address]) {
            output.innerHTML += `<p>Memory at 0x${address.toString(16)}: "${decoyAddresses[address]}"</p>`;
        } else {
            output.innerHTML += `<p>No data at this address.</p>`;
        }
    } else if (command.startsWith('enter phrase')) {
        const inputPhrase = command.split(' ').slice(2).join(' '); // Join the rest of the command
        if (inputPhrase === "Pluffye is a wolf-dog") {
            isPuzzleSolved = true;
            output.innerHTML += `<p>System Unlocked! You've solved the puzzle.</p>`;
        } else {
            output.innerHTML += `<p>BOOM! The system exploded.</p>`;
        }
    } else {
        output.innerHTML += `<p>Unknown command: ${command}</p>`;
    }

    // Scroll to the bottom of the output
    output.scrollTop = output.scrollHeight;
}

// Initialize the puzzle
decodePhrase(); // Decode the phrase at the start