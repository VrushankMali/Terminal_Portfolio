// Import the commands from commands.js
import commands from './commands.js';

document.addEventListener("DOMContentLoaded", function () {
    let intervalId;

    function showLoading(duration = 1300) {
        const loadingElement = document.querySelector('.matrix-loading');
        loadingElement.style.display = 'block'; // Show loading animation

        // Clear previous lines
        loadingElement.innerHTML = '';

        const characters = 
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()-_=+[]{};:"<>,.?/|\\' +
            '•°•■◇◆★☆☀☁☂☃☀☠☢☣☤☥☦☧' + // Adding some unique symbols
            '🔒🔑💻🖥️🖱️📡🔌⚙️🔧🎛️🧩🎮🧪'; // Adding emojis for a modern touch


        // Function to generate a falling character
        function createFallingCharacter() {
            const line = document.createElement('div');
            line.className = 'matrix-line';
            line.style.left = `${Math.random() * 100}vw`; // Random horizontal position
            line.style.fontSize = `${Math.random() * 20 + 10}px`; // Random font size
            line.textContent = characters.charAt(Math.floor(Math.random() * characters.length)); // Random character

            loadingElement.appendChild(line);

            // Animate the line to fall
            line.style.animationDuration = `${Math.random() * 2 + 2}s`; // Random fall duration
            line.style.animationName = 'fall';

            // Remove line after falling
            line.addEventListener('animationend', () => {
                line.remove();
            });
        }

        // Generate characters at intervals
        intervalId = setInterval(createFallingCharacter, 13); // Adjust the frequency as needed

        // Hide after the specified duration
        setTimeout(() => {
            clearInterval(intervalId); // Stop generating characters
            loadingElement.style.display = 'none'; // Hide loading screen
        }, duration); // Adjust duration as needed
    }

    const terminalInput = document.getElementById("terminalInput");
    const output = document.getElementById("output");

    // Array to hold previous commands
    const commandHistory = [];
    let historyIndex = -1; // Start at -1, as no commands have been entered yet

    // Add the welcome message with the new greeting-text class
    const welcomeMessage = `
        <p class="greeting-text">Welcome to Vrushank Mali's Portfolio!</p>
        <p class="greeting-text">Type <span class="terminal-input">'help'</span> to see the list of available commands.</p>
        <br>
    `;
    output.innerHTML = welcomeMessage;

    // Show loading animation for the initial load
    showLoading(4000); // Adjust the duration as needed

    // Focus the terminal input when the user clicks anywhere on the page
    document.addEventListener("click", function () {
        terminalInput.focus();
    });

    terminalInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const inputValue = terminalInput.value.trim();
            if (inputValue) {
                commandHistory.push(inputValue); // Add command to history
                historyIndex = commandHistory.length; // Reset the history index
                
                // Show loading animation before processing the command
                showLoading(1300); // Show loading for 1 second
    
                // Delay the command processing to allow the loading animation to display
                setTimeout(() => {
                    processCommand(inputValue); // Process the command after the loading animation
                    terminalInput.value = ""; // Clear input after processing the command
                }, 0); // Adjust this delay to match the loading duration
            }
        } else if (event.key === "ArrowUp") {
            // Navigate to the previous command
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
                terminalInput.focus(); // Focus the input
                setTimeout(() => {
                    terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length); // Move cursor to the end
                }, 0); // Delay the cursor setting
            }
        } else if (event.key === "ArrowDown") {
            // Navigate to the next command
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
                terminalInput.focus(); // Focus the input
                setTimeout(() => {
                    terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length); // Move cursor to the end
                }, 0); // Delay the cursor setting
            } else if (historyIndex === commandHistory.length - 1) {
                // If on the last command, clear the input
                historyIndex++;
                terminalInput.value = ""; 
                terminalInput.focus(); // Focus the input
            }
        } else if (event.key === "Tab") {
            event.preventDefault();
            autocompleteCommand(terminalInput.value);
        }
    });    

    function autocompleteCommand(input) {
        const currentInput = input.trim(); // Get the trimmed input from the parameter
        if (currentInput) {
            // Use Object.keys() to filter through the command keys
            const matchingCommands = Object.keys(commands).filter(cmd => cmd.startsWith(currentInput));
    
            if (matchingCommands.length === 1) {
                // If there's an exact match, complete the command
                terminalInput.value = matchingCommands[0];
            } else if (matchingCommands.length > 1) {
                // If multiple matches, display the options in the terminal
                showCommandSuggestions(matchingCommands);
            }
        }
    }        

    function showCommandSuggestions(suggestions) {
        const suggestionDiv = document.getElementById("suggestionsContainer");
        suggestionDiv.innerHTML = ''; // Clear previous suggestions
    
        // Populate suggestion items
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement("p");
            suggestionItem.textContent = suggestion; // This will now be the command name
            suggestionItem.classList.add("suggestion-item");
    
            // Optional: Add a click event to select a suggestion when clicked
            suggestionItem.addEventListener('click', () => {
                terminalInput.value = suggestion; // Set the input value to the clicked suggestion
                suggestionDiv.innerHTML = ''; // Clear suggestions after selection
            });
    
            suggestionDiv.appendChild(suggestionItem);
        });
    
        // Show or hide the suggestions based on whether there are suggestions
        suggestionDiv.style.display = suggestions.length > 0 ? 'block' : 'none'; // Show or hide
    }    

    // Another way for tab command
    /*function showCommandSuggestions(suggestions) {
        const suggestionDiv = document.createElement("div");
        suggestionDiv.classList.add("suggestions");
    
        // Populate suggestion items
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement("p");
            suggestionItem.textContent = suggestion; // This will now be the command name
            suggestionItem.classList.add("suggestion-item");
    
            // Optional: Add a click event to select a suggestion when clicked
            suggestionItem.addEventListener('click', () => {
                terminalInput.value = suggestion; // Set the input value to the clicked suggestion
                suggestionDiv.remove(); // Remove the suggestion box
            });
    
            suggestionDiv.appendChild(suggestionItem);
        });
    
        output.appendChild(suggestionDiv);
    
        // Remove suggestions after a short delay
        setTimeout(() => {
            suggestionDiv.remove();
        }, 3000);
    }*/    

    function processCommand(command) {
        command = command.toLowerCase();
        const paragraph = document.createElement("p");
        paragraph.className = "prompt"; // Add the prompt class
        paragraph.textContent = `vrushankmali@portfolio:~$ ${command}`; // Update the prompt text
        output.appendChild(paragraph);

        // Clear suggestions immediately after command input
        showCommandSuggestions([]); // Clear suggestions here

        // Delay processing to allow the loading animation to be visible
        setTimeout(() => {
            if (commands[command]) {
                const response = document.createElement("p");
                response.className = "help-text"; // Add the help-text class
                response.innerHTML = commands[command].join(''); // Join the array elements into a string
                output.appendChild(response);
            } else if (command === "clear") {
                output.innerHTML = "";
                const welcomeMessage = `
                    <p class="greeting-text">Type <span class="terminal-input">'help'</span> to see the list of available commands.</p>
                    <br>
                `;
                output.innerHTML = welcomeMessage;
            } else if (command === "exit") {
                // Try closing the tab first
                window.close();
                
                // If the close doesn't work, redirect to Google
                setTimeout(() => {
                    window.location.href = "https://www.google.com";
                }, 100);
            } else {
                const error = document.createElement("p");
                error.classList.add("error-message", "shake"); // Add the error-message class
                error.innerHTML = `Command not found. Type <span class="terminal-input">'help'</span> for a list of commands.`;
                output.appendChild(error);
            }

            // Scroll to the bottom
            output.scrollTop = output.scrollHeight;
        }, 1300); // Process command after 1 second
    }
});