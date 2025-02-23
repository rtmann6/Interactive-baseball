const container = document.getElementById('field-container');
const shortstop = document.getElementById('shortstop');
const description = document.getElementById('description');
const feedback = document.getElementById('feedback');
const explanation = document.getElementById('explanation');
const checkBtn = document.getElementById('check-btn');
const resetBtn = document.getElementById('reset-btn');
const nextBtn = document.getElementById('next-btn');

let isDragging = false;
let startX, startY, shortstopInitialLeft, shortstopInitialTop;
let currentScenarioIndex = 0;

// Define scenarios
const scenarios = [
    {
        description: "Runner on first, ball hit to outfield.",
        runners: ["first"],
        correctArea: { leftMin: 40, leftMax: 50, topMin: 30, topMax: 40 },
        explanation: "The shortstop should be positioned to act as a cutoff man for throws from the outfield to second or third base."
    },
    // Add more scenarios as needed
    {
        description: "Bases empty, ground ball to second baseman.",
        runners: [],
        correctArea: { leftMin: 45, leftMax: 55, topMin: 25, topMax: 35 },
        explanation: "The shortstop should cover second base to prepare for a potential double play."
    }
];

// Drag functionality
shortstop.addEventListener('mousedown', startDrag);
shortstop.addEventListener('touchstart', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag);
document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);

function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    if (e.type === 'mousedown') {
        startX = e.clientX;
        startY = e.clientY;
    } else {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }
    shortstopInitialLeft = shortstop.offsetLeft;
    shortstopInitialTop = shortstop.offsetTop;
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    let currentX, currentY;
    if (e.type === 'mousemove') {
        currentX = e.clientX;
        currentY = e.clientY;
    } else {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
    }
    const dx = currentX - startX;
    const dy = currentY - startY;
    shortstop.style.left = (shortstopInitialLeft + dx) + 'px';
    shortstop.style.top = (shortstopInitialTop + dy) + 'px';
}

function stopDrag() {
    isDragging = false;
}

// Scenario setup
function setupScenario(index) {
    const scenario = scenarios[index];
    description.textContent = scenario.description;
    feedback.textContent = '';
    explanation.textContent = '';
    nextBtn.style.display = 'none';

    // Remove existing runners and correct area
    document.querySelectorAll('.runner, .correct-area').forEach(el => el.remove());

    // Add runners
    scenario.runners.forEach(base => {
        const runner = document.createElement('div');
        runner.className = 'runner';
        runner.textContent = 'R';
        switch (base) {
            case 'first':
                runner.style.left = '70%';
                runner.style.top = '50%';
                break;
            case 'second':
                runner.style.left = '50%';
                runner.style.top = '30%';
                break;
            case 'third':
                runner.style.left = '30%';
                runner.style.top = '50%';
                break;
        }
        container.appendChild(runner);
    });

    // Reset shortstop position
    shortstop.style.left = '45%';
    shortstop.style.top = '40%';
}

// Check position
function checkPosition() {
    const containerRect = container.getBoundingClientRect();
    const shortstopRect = shortstop.getBoundingClientRect();
    const shortstopWidth = shortstop.offsetWidth;
    const shortstopHeight = shortstop.offsetHeight;
    const centerLeft = ((shortstopRect.left + shortstopWidth / 2 - containerRect.left) / containerRect.width) * 100;
    const centerTop = ((shortstopRect.top + shortstopHeight / 2 - containerRect.top) / containerRect.height) * 100;
    const scenario = scenarios[currentScenarioIndex];

    const isCorrect = centerLeft >= scenario.correctArea.leftMin &&
                     centerLeft <= scenario.correctArea.leftMax &&
                     centerTop >= scenario.correctArea.topMin &&
                     centerTop <= scenario.correctArea.topMax;

    if (isCorrect) {
        feedback.textContent = 'Correct!';
        explanation.textContent = scenario.explanation;
        nextBtn.style.display = 'inline';
    } else {
        feedback.textContent = 'Incorrect, try again.';
        explanation.textContent = scenario.explanation;
        showCorrectArea(scenario.correctArea);
        nextBtn.style.display = 'none';
    }
}

function showCorrectArea(area) {
    document.querySelectorAll('.correct-area').forEach(el => el.remove());
    const correctDiv = document.createElement('div');
    correctDiv.className = 'correct-area';
    correctDiv.style.left = area.leftMin + '%';
    correctDiv.style.top = area.topMin + '%';
    correctDiv.style.width = (area.leftMax - area.leftMin) + '%';
    correctDiv.style.height = (area.topMax - area.topMin) + '%';
    container.appendChild(correctDiv);
}

// Reset shortstop position
function resetPosition() {
    shortstop.style.left = '45%';
    shortstop.style.top = '40%';
    feedback.textContent = '';
    explanation.textContent = '';
    document.querySelectorAll('.correct-area').forEach(el => el.remove());
    nextBtn.style.display = 'none';
}

// Next scenario
function nextScenario() {
    currentScenarioIndex++;
    if (currentScenarioIndex < scenarios.length) {
        setupScenario(currentScenarioIndex);
    } else {
        alert('Congratulations, you completed all scenarios!');
        currentScenarioIndex = 0;
        setupScenario(currentScenarioIndex);
    }
}

// Event listeners
checkBtn.addEventListener('click', checkPosition);
resetBtn.addEventListener('click', resetPosition);
nextBtn.addEventListener('click', nextScenario);

// Initialize game
setupScenario(currentScenarioIndex);p