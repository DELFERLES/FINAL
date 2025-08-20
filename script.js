import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', () => {
    const teacherNameInput = document.getElementById('teacherName');
    const assignButton = document.getElementById('assignButton');
    const resultDisplay = document.getElementById('result');
    const teacherImage = document.getElementById('teacherImage');
    const confettiCanvas = document.getElementById('confettiCanvas');

    // New elements for the initial screen
    const startButton = document.getElementById('startButton');
    const startScreen = document.getElementById('startScreen');
    const appContainer = document.getElementById('appContainer');

    // Configure confetti with the specific canvas
    const myConfetti = confetti.create(confettiCanvas, { resize: true, useColors: true });

    let confettiInterval = null; // Variable to hold the confetti interval

    // Web Audio API setup for sound effects
    let audioContext;
    let soundBuffer;

    async function loadSound(url) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            soundBuffer = await audioContext.decodeAudioData(arrayBuffer);
            // Attempt to resume audio context if it's suspended (e.g., due to autoplay policy)
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }
            return true; // Indicate success
        } catch (error) {
            console.error("Error loading sound:", error);
            return false; // Indicate failure
        }
    }

    function playSound() {
        if (soundBuffer && audioContext) {
            const source = audioContext.createBufferSource();
            source.buffer = soundBuffer;
            source.connect(audioContext.destination);
            source.start(0); // Play immediately
        }
    }

    // NEW: Event listener for the start button
    startButton.addEventListener('click', async () => {
        // Ensure audio context is resumable if suspended. This click serves as user gesture.
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        // Load and play the sound
        const soundLoaded = await loadSound('/que comience el juego.mp3');
        if (soundLoaded) {
            playSound();
        }

        // Hide the start screen and show the main application content
        startScreen.style.display = 'none'; // Completely hide the start screen
        appContainer.classList.remove('hidden-content'); // Show the main app container
    });

    // Helper function to normalize string for comparison (lowercase, no diacritics, trimmed)
    const normalizeString = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    };

    // Define teacher data with canonical (correctly cased and accented) names and sections.
    // The keys are normalized strings for lookup.
    const teacherData = {
        "maria mudarra": { canonicalName: "María Mudarra", section: "1ero A" },
        "mireudis romero": { canonicalName: "Mireudis Romero", section: "1ero B" },
        "yuraima figuera": { canonicalName: "Yuraima Figuera", section: "1ero C" },
        "norismar canova": { canonicalName: "Norismar Canova", section: "1ero D" },
        "suleymi millan": { canonicalName: "Suleymi Millán", section: "2do A" },
        "teresa gomez": { canonicalName: "Teresa Gómez", section: "2do B" },
        "rossy gomez": { canonicalName: "Rossy Gómez", section: "2do C" },
        "katherine navarro": { canonicalName: "Katherine Navarro", section: "2do D" },
        "arianmy guerra": { canonicalName: "Arianmy Guerra", section: "3ero A" },
        "indira leonett": { canonicalName: "Indira Leonett", section: "3ero B" },
        "arianny gomez": { canonicalName: "Arianny Gómez", section: "3ero C" },
        "gloria hernandez": { canonicalName: "Gloria Hernández", section: "3ero D" },
        "ana gil": { canonicalName: "Ana Gil", section: "4to A" },
        "ana olivares": { canonicalName: "Ana Olivares", section: "4to B" },
        "susan meza": { canonicalName: "Susan Meza", section: "4to C" },
        "norglimar lopez": { canonicalName: "Norglimar López", section: "4to D" },
        "martha suarez": { canonicalName: "Martha Suárez", section: "5to A" },
        "melanys marcano": { canonicalName: "Melanys Marcano", section: "5to B" },
        "thais labady": { canonicalName: "Thais Labady", section: "5to D" },
        "yenny rosillo": { canonicalName: "Yenny Rosillo", section: "6to A" },
        "adriana bathis": { canonicalName: "Adriana Bathis", section: "6to C" },
        "lismaris rios": { canonicalName: "Lismaris Rios", section: "6to D" }
    };

    const handleAssign = () => {
        const inputName = teacherNameInput.value;
        const normalizedInputName = normalizeString(inputName); // Use normalized input for lookup

        const teacherInfo = teacherData[normalizedInputName]; // Get the teacher's data

        // Clear previous visuals and repeating confetti
        if (confettiInterval) {
            clearInterval(confettiInterval);
            confettiInterval = null;
        }
        teacherImage.classList.remove('visible');
        teacherImage.classList.add('hidden');
        confettiCanvas.classList.remove('visible');
        confettiCanvas.classList.add('hidden');
        myConfetti.reset(); // Stop any ongoing confetti
        
        resultDisplay.innerHTML = '';
        resultDisplay.classList.remove('animate');

        if (teacherInfo) {
            // Use the canonical name and convert it to uppercase for display, preserving accents
            const displayedName = teacherInfo.canonicalName.toUpperCase();
            
            const part1 = '¡Felicidades, Maestra ';
            const part3 = `! Te tocó la sección ${teacherInfo.section}.`;

            resultDisplay.classList.add('animate');
            let charIndex = 0;

            // Part 1: Animate character by character
            part1.split('').forEach((char) => {
                const span = document.createElement('span');
                span.innerHTML = char === ' ' ? '&nbsp;' : char;
                span.style.animationDelay = `${charIndex * 0.05}s`;
                resultDisplay.appendChild(span);
                charIndex++;
            });

            // Part 2: Teacher's name as a single, non-separated block
            const nameSpan = document.createElement('span');
            nameSpan.innerHTML = displayedName.replace(/ /g, '&nbsp;'); // prevent line break within name
            nameSpan.style.animationDelay = `${charIndex * 0.05}s`;
            resultDisplay.appendChild(nameSpan);

            // Update charIndex to account for the length of the name, so Part 3 starts with the correct delay
            charIndex += displayedName.length;

            // Part 3: Animate character by character
            part3.split('').forEach((char) => {
                const span = document.createElement('span');
                span.innerHTML = char === ' ' ? '&nbsp;' : char;
                span.style.animationDelay = `${charIndex * 0.05}s`;
                resultDisplay.appendChild(span);
                charIndex++;
            });
            
            // Show image and confetti
            setTimeout(() => {
                teacherImage.classList.remove('hidden');
                teacherImage.classList.add('visible');
                confettiCanvas.classList.remove('hidden');
                confettiCanvas.classList.add('visible');
    
                // Function to fire confetti
                const fireConfetti = () => {
                    myConfetti({
                        particleCount: 150,
                        spread: 90,
                        origin: { y: 0.6 }
                    });
                };

                // Fire it once immediately, then repeat
                fireConfetti();
                confettiInterval = setInterval(fireConfetti, 2000); // Repeat every 2 seconds

            }, 100);

        } else {
            resultDisplay.textContent = "Maestra no encontrada o sección no asignada. Por favor, verifica el nombre completo.";
        }
    };

    assignButton.addEventListener('click', handleAssign);

    teacherNameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleAssign();
        }
    });

    // Optional: Reset on input change
    teacherNameInput.addEventListener('input', () => {
        if(teacherNameInput.value.trim() === '') {
            resultDisplay.textContent = "";
            resultDisplay.classList.remove('animate');
            teacherImage.classList.remove('visible');
            teacherImage.classList.add('hidden');
            confettiCanvas.classList.remove('visible');
            confettiCanvas.classList.add('hidden');
            myConfetti.reset();
            // Clear repeating confetti if it exists
            if (confettiInterval) {
                clearInterval(confettiInterval);
                confettiInterval = null;
            }
        }
    });
});