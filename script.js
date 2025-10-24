let currentLevel = 1;
let selectedTiles = [];
let timerInterval;
let timeRemaining = 0;
let gameActive = false;

const LEVELS = [
    // Level 1
    {
        levelId: 1,
        challenge: "Select all squares with a **traffic light**.",
        instruction: "Click all 3 squares that show a traffic light. You have 15 seconds. Easy peasy.",
        timeLimit: 15,
        correctTiles: [1, 5, 9],
        tileContent: ["🚦", "🌳", "🏠", "🌳", "🚦", "🏠", "🌳", "🏠", "🚦"],
        trick: null
    },
    // Level 2
    {
        levelId: 2,
        challenge: "Select all numbers that make 67 correctly.",
        instruction: "Pick carefully.",
        timeLimit: 15,
        correctTiles: [2, 3],
        tileContent: ["100x100=10^3", "4+1=67", "6+7=67", "mass=volumeXnewton"],
        trick: null
    },
    // Level 3
    {
        levelId: 3,
        challenge: "Select all squares with a **crosswalk**.",
        instruction: "Be precise. Look closely. Time is ticking.",
        timeLimit: 12,
        correctTiles: [2, 3, 7],
        tileContent: ["🚗", "🦓", "🦓", "🛑", "🚗", "🛑", "🦓", "🚗", "🛑"],
        trick: null
    },
    // Level 4
    {
        levelId: 4,
        challenge: "Click the **one square that is NOT a bus**.",
        instruction: "Wait, there is no 'Next' button. Click the **one** square that is **NOT** a bus.",
        timeLimit: 10,
        correctTiles: [5],
        tileContent: ["🚌", "🚌", "🚌", "🚌", "❌", "🚌", "🚌", "🚌", "🚌"],
        trick: "misleading_instruction"
    },
    // Level 5
    {
        levelId: 5,
        challenge: "Select all squares containing a **mountain**.",
        instruction: "Does that count as a mountain? You decide. The AI knows the answer.",
        timeLimit: 8,
        correctTiles: [1, 4, 6, 8],
        tileContent: ["⛰️", "☁️", "🌲", "⛰️", "🌲", "⛰️", "☁️", "⛰️", "🌲"],
        trick: null
    },
    // Level 6
    {
        levelId: 6,
        challenge: "Solve the differential equation: f''(x) + f(x) = e^x",
        instruction: "Select all tiles that represent correct steps by step solution. Think carefully.",
        timeLimit: 25,
        correctTiles: [2, 5, 7],
        tileContent: [
            "Assume f_h(x) = C1*cos(x) + C2*sin(x)",
            "f_p(x) = A*e^x",
            "f_p(x) = B*e^{-x}",
            "f(x) = ln(x)",
            "f(x) = f_h(x) + f_p(x)",
            "f''(x) - f(x) = 0",
            "C1, C2 determined by f(0)=1, f'(0)=0",
            "f(x) = x^2 + 1",
            "f(x) = sin(x)*e^x"
        ],
        trick: null
    },
    // Level 7
    {
        levelId: 7,
        challenge: "Select all squares that are **RED**.",
        instruction: "Hurry! The timer is speeding up.",
        timeLimit: 6,
        correctTiles: [1, 3, 7, 9],
        tileContent: ["🔴", "🔵", "🔴", "🔵", "🟢", "🔵", "🔴", "🔵", "🔴"],
        trick: "move_on_click"
    },
    // Level 8
    {
        levelId: 8,
        challenge: "Select all squares with a **fire hydrant**.",
        instruction: "They seem to be moving. Is that a glitch? No, it's a feature.",
        timeLimit: 10,
        correctTiles: [1, 5, 9],
        tileContent: ["🧯", "❌", "❌", "❌", "🧯", "❌", "❌", "❌", "🧯"],
        trick: "move_on_click"
    },
    // Level 9
    {
        levelId: 9,
        challenge: "Select all squares with a **bicycle**.",
        instruction: "The images are loading slowly. Just click where you think they are.",
        timeLimit: 8,
        correctTiles: [2, 4, 6, 8],
        tileContent: ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
        trick: "hidden_tiles"
    },
    // Level 10
    {
        levelId: 10,
        challenge: "Select all squares with a **chimney**.",
        instruction: "You have 3 seconds to read the instruction. It might change.",
        timeLimit: 10,
        correctTiles: [1,2,3,4,5,6,7,8,9],
        tileContent: ["🏭", "🏠", "🏭", "🏠", "🏭", "🏠", "🏭", "🏠", "🏭"],
        trick: "instruction_change"
    },
    // Level 11
    {
        levelId: 11,
        challenge: "Select the squares: **1, 3, 5, 7, 8, 9, 2**.",
        instruction: "Click them in **ANY** order. You have 3 seconds. Good luck, meatbag.",
        timeLimit: 3,
        correctTiles: [1,2,3,5,7,8,9],
        tileContent: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"],
        trick: "impassable_trick"
    },
    // Level 12
    {
        levelId: 12,
        challenge: "Select all squares that contain a **human emotion**.",
        instruction: "This is the final test. Prove your humanity. (Hint: It's a trick question)",
        timeLimit: 10,
        correctTiles: [],
        tileContent: ["😡", "😭", "😤", "😠", "🤬", "🤯", "😵", "😩", "😫"],
        trick: "impassable_trick"
    }
];

// --- DOM Elements ---
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const notRobotCheckbox = document.getElementById('not-robot-checkbox');
const startGameButton = document.getElementById('start-game-button');
const currentLevelSpan = document.getElementById('current-level');
const timerDisplay = document.getElementById('timer-display');
const challengeText = document.getElementById('challenge-text');
const instructionText = document.getElementById('instruction-text');
const challengeGrid = document.getElementById('challenge-grid');
const submitButton = document.getElementById('submit-button');
const resultMessage = document.getElementById('result-message');
const resultDetails = document.getElementById('result-details');
const nextLevelButton = document.getElementById('next-level-button');
const restartButton = document.getElementById('restart-button');

// --- Event Listeners ---
notRobotCheckbox.addEventListener('change', () => {
    startGameButton.disabled = !notRobotCheckbox.checked;
});

startGameButton.addEventListener('click', () => {
    currentLevel = 1;
    startGame();
});

submitButton.addEventListener('click', handleSubmit);
nextLevelButton.addEventListener('click', startNextLevel);
restartButton.addEventListener('click', () => {
    currentLevel = 1;
    startGame();
});

// --- Game Functions ---
function startGame() {
    gameActive = true;
    switchScreen('game-screen');
    loadLevel(currentLevel);
}

function switchScreen(screenId) {
    [startScreen, gameScreen, resultScreen].forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function loadLevel(levelNum) {
    if(levelNum > LEVELS.length){
        showWinScreen(true);
        return;
    }

    const level = LEVELS.find(l => l.levelId === levelNum);
    selectedTiles = [];
    currentLevelSpan.textContent = level.levelId;
    challengeText.innerHTML = level.challenge;
    instructionText.textContent = level.instruction;
    submitButton.disabled = true;
    challengeGrid.classList.remove('shake');
    challengeGrid.innerHTML = '';

    level.tileContent.forEach((content,index)=>{
        const tile = document.createElement('div');
        tile.classList.add('grid-item');
        tile.dataset.index = index+1;
        tile.innerHTML = content;
        tile.addEventListener('click', handleTileClick);
        challengeGrid.appendChild(tile);
    });

    applyLevelTrick(level);
    resetTimer(level.timeLimit);
}

function handleTileClick(event){
    if(!gameActive) return;

    const tile = event.currentTarget;
    const index = parseInt(tile.dataset.index);
    const level = LEVELS.find(l => l.levelId === currentLevel);

    if(level.trick === "move_on_click"){
        if(level.correctTiles.includes(index)){
            tile.classList.remove('selected');
            selectedTiles = selectedTiles.filter(i=>i!==index);

            const allTiles = [...Array(level.tileContent.length).keys()].map(i=>i+1);
            const unselectedIncorrect = allTiles.filter(i=>!level.correctTiles.includes(i) && !selectedTiles.includes(i));
            if(unselectedIncorrect.length>0){
                const newIndex = unselectedIncorrect[Math.floor(Math.random()*unselectedIncorrect.length)];
                selectedTiles.push(newIndex);
                document.querySelector(`[data-index="${newIndex}"]`)?.classList.add('selected');
            }
        } else {
            toggleTileSelection(tile,index);
        }
    } else {
        toggleTileSelection(tile,index);
    }

    submitButton.disabled = selectedTiles.length===0;
}

function toggleTileSelection(tile,index){
    if(tile.classList.contains('selected')){
        tile.classList.remove('selected');
        selectedTiles = selectedTiles.filter(i=>i!==index);
    } else {
        tile.classList.add('selected');
        selectedTiles.push(index);
    }
}

function handleSubmit(){
    if(!gameActive) return;
    clearInterval(timerInterval);
    gameActive=false;

    const level = LEVELS.find(l=>l.levelId===currentLevel);

    if(level.trick === "impassable_trick"){
        showResult(false,"You failed by clicking submit. True humans wait.");
        return;
    }

    const correctSet = new Set(level.correctTiles);
    const selectedSet = new Set(selectedTiles);
    const isCorrect = selectedSet.size === correctSet.size && [...selectedSet].every(i=>correctSet.has(i));

    showResult(isCorrect, isCorrect ? 
        `Verification successful. You are currently ${level.levelId} times less robotic.` :
        "Verification failed. The AI overlords are disappointed."
    );
}

function showResult(win,message){
    gameActive=false;
    clearInterval(timerInterval);
    switchScreen('result-screen');

    resultMessage.textContent = win?"ACCESS GRANTED":"ACCESS DENIED";
    resultMessage.className = win?"win":"lose";
    resultDetails.textContent = message;

    nextLevelButton.classList.toggle('hidden',!win || currentLevel===LEVELS.length);
    restartButton.classList.toggle('hidden',win && currentLevel<LEVELS.length);

    if(!win) challengeGrid.classList.add('shake');
}

function startNextLevel(){
    currentLevel++;
    startGame();
}

function showWinScreen(finalWin){
    gameActive=false;
    switchScreen('result-screen');
    resultMessage.textContent="CONGRATULATIONS! You are not a robot.";
    resultMessage.className="win";
    resultDetails.innerHTML=`You have completed all ${LEVELS.length} levels.<br>Your humanity has been verified.`;
    nextLevelButton.classList.add('hidden');
    restartButton.classList.remove('hidden');
}

function resetTimer(duration){
    clearInterval(timerInterval);
    timeRemaining = duration;
    timerDisplay.textContent=`Time: ${timeRemaining.toFixed(2)}s`;
    timerDisplay.classList.remove('low-time');

    timerInterval = setInterval(()=>{
        timeRemaining-=0.01;
        timerDisplay.textContent=`Time: ${timeRemaining.toFixed(2)}s`;
        if(timeRemaining<=3) timerDisplay.classList.add('low-time');
        else timerDisplay.classList.remove('low-time');

        if(timeRemaining<=0){
            clearInterval(timerInterval);
            timeRemaining=0;
            timerDisplay.textContent="Time: 0.00s";
            showResult(false,"TIME'S UP! Emotional damage: +10");
        }
    },10);
}

function applyLevelTrick(level){
    if(!level.trick) return;

    switch(level.trick){
        case "instruction_change":
            setTimeout(()=>{
                if(gameActive && currentLevel===level.levelId){
                    challengeText.innerHTML="NEW CHALLENGE: Select all squares with a **traffic light**.";
                    instructionText.textContent="Did you read the fine print? Too late now.";
                }
            },3000);
            break;
        case "impassable_trick":
            setTimeout(()=>{
                if(gameActive && currentLevel===level.levelId){
                    showResult(true,"By doing nothing, you proved understanding of futility. You win.");
                }
            }, (level.timeLimit*1000)-100);
            break;
    }
}

switchScreen('start-screen');
