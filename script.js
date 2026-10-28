// Exercise 1 data (Blue theme)
const exercise1Questions = [
    {
        question: "Which ticket area should I review first?",
        answer: "Prioritize",
        icon: "📌",
        explanation: "Prioritization ranks work items based on business importance, operational risk, or expected impact."
    },
    {
        question: "Which CP readings appear unusual?",
        answer: "Anomalies",
        icon: "⚠️",
        explanation: "Anomaly detection identifies data points that differ significantly from normal patterns."
    },
    {
        question: "What previously unknown CP patterns exist?",
        answer: "Cluster",
        icon: "🔗",
        explanation: "Clustering discovers groups and patterns that are not predefined."
    },
    {
        question: "Based on similar leak records, what is the likely leak cause?",
        answer: "Classify",
        icon: "🏷️",
        explanation: "Classification assigns records into categories such as corrosion, excavation, or joint failure."
    },
    {
        question: "What is the probability this ticket becomes high risk?",
        answer: "Predict",
        icon: "📈",
        explanation: "Prediction estimates future outcomes using historical data."
    }
];

// Exercise 2 data (Green theme)
const exercise2Questions = [
    {
        question: "Can we extract keywords such as Corrosion and Damage from comments?",
        answer: "Read Text",
        icon: "📖",
        explanation: "Reading text uses natural language processing to understand, extract, and organize information from written comments."
    },
    {
        question: "Which cause should I choose?",
        answer: "Recommend",
        icon: "💡",
        explanation: "Recommendation systems suggest the most likely or best option based on available information."
    },
    {
        question: "What will the repair cost be?",
        answer: "Estimate",
        icon: "📊",
        explanation: "Estimation predicts a numerical value such as cost, duration, or effort."
    },
    {
        question: "What is the best rectifier setting?",
        answer: "Optimize",
        icon: "⚙️",
        explanation: "Optimization identifies the best action or setting to maximize performance or achieve an objective."
    }
];

// Game state
let currentExercise = 'exercise1';
let currentQuestionIndex = 0;
let exercise1Score = 0;
let exercise2Score = 0;
let isGameActive = true;
let answeredAnswers = []; // Track answers that have been correctly answered
let shuffledQuestions = []; // Shuffled order of questions
let shuffledOptions = []; // Shuffled order of answer options

// DOM elements
const menuScreenEl = document.getElementById('menu-screen');
const menuBtnEl = document.getElementById('menu-btn');
const menuBtnResultsEl = document.getElementById('menu-btn-results');
const headerEl = document.getElementById('game-header');
const headerTitleEl = document.getElementById('header-title');
const progressEl = document.getElementById('progress');
const questionTextEl = document.getElementById('question-text');
const optionsGridEl = document.getElementById('options-grid');
const feedbackModalEl = document.getElementById('feedback-modal');
const feedbackTitleEl = document.getElementById('feedback-title');
const feedbackTextEl = document.getElementById('feedback-text');
const feedbackIconEl = document.getElementById('feedback-icon');
const continueBtnEl = document.getElementById('continue-btn');
const gameAreaEl = document.getElementById('game-area');
const resultsScreenEl = document.getElementById('results-screen');
const finalScoreEl = document.getElementById('final-score');
const percentageDisplayEl = document.getElementById('percentage-display');
const learningSummaryEl = document.getElementById('learning-summary');
const restartBtnEl = document.getElementById('restart-btn');
const totalScoreEl = document.getElementById('total-score');
const exerciseCards = document.querySelectorAll('.exercise-card');

// Fisher-Yates shuffle
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize app
function initApp() {
    showMenu();
    updateCombinedScore();
}

// Show main menu
function showMenu() {
    menuScreenEl.style.display = 'flex';
    headerEl.style.display = 'none';
    gameAreaEl.style.display = 'none';
    resultsScreenEl.style.display = 'none';
}

// Start an exercise
function startExercise(exercise) {
    currentExercise = exercise;

    // Update theme based on exercise
    if (exercise === 'exercise1') {
        document.documentElement.style.setProperty('--primary-color', '#003366');
        document.documentElement.style.setProperty('--primary-light', '#0066cc');
        document.documentElement.style.setProperty('--accent-color', '#003366');
        headerTitleEl.textContent = 'Exercise 1: AI Opportunity Match';
    } else {
        document.documentElement.style.setProperty('--primary-color', '#006633');
        document.documentElement.style.setProperty('--primary-light', '#008040');
        document.documentElement.style.setProperty('--accent-color', '#006633');
        headerTitleEl.textContent = 'Exercise 2: AI Capability Match';
    }

    // Reset game state
    currentQuestionIndex = 0;
    exercise1Score = 0;
    exercise2Score = 0;
    answeredAnswers = [];
    isGameActive = true;

    // Get questions for this exercise
    const allQuestions = exercise === 'exercise1' ? exercise1Questions : exercise2Questions;

    // Shuffle questions for question order
    shuffledQuestions = shuffleArray(allQuestions);

    // Create shuffled options array (all answers shuffled)
    shuffledOptions = shuffleArray(allQuestions);

    menuScreenEl.style.display = 'none';
    headerEl.style.display = 'flex';
    gameAreaEl.style.display = 'block';
    resultsScreenEl.style.display = 'none';

    showQuestion();
}

// Show current question
function showQuestion() {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    progressEl.textContent = `Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`;
    questionTextEl.textContent = currentQuestion.question;

    // Show options grid and hide results
    optionsGridEl.style.display = 'grid';
    resultsScreenEl.style.display = 'none';

    renderOptions();
}

// Render options from shuffledOptions, keeping positions, hiding answered ones
function renderOptions() {
    optionsGridEl.innerHTML = '';

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-card';
        button.dataset.type = option.answer;

        // Check if this answer has been answered
        if (answeredAnswers.includes(option.answer)) {
            button.classList.add('hidden');
        }

        button.innerHTML = `<span class="card-icon">${option.icon}</span><span class="card-label">${option.answer}</span>`;
        optionsGridEl.appendChild(button);
    });

    // Add event listeners
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
            handleSelection(card.dataset.type, card);
        });
    });
}

// Handle option selection
function handleSelection(selectedType, cardElement) {
    if (!isGameActive) return;
    if (cardElement.classList.contains('hidden')) return;

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = selectedType === currentQuestion.answer;

    if (isCorrect) {
        if (currentExercise === 'exercise1') exercise1Score++;
        else exercise2Score++;

        // Mark this answer as answered
        answeredAnswers.push(currentQuestion.answer);

        showFeedback(true, currentQuestion);
    } else {
        // Wrong answer - show feedback but don't continue
        showFeedback(false, currentQuestion);
    }
}

// Show feedback modal
function showFeedback(isCorrect, question) {
    feedbackModalEl.classList.add('active');

    if (isCorrect) {
        feedbackIconEl.textContent = '✅';
        feedbackIconEl.className = 'feedback-icon correct';
        feedbackTitleEl.textContent = 'Correct!';
        feedbackTextEl.textContent = question.explanation;
        continueBtnEl.textContent = 'Continue';
        continueBtnEl.onclick = nextQuestion;
    } else {
        feedbackIconEl.textContent = '❌';
        feedbackIconEl.className = 'feedback-icon incorrect';
        feedbackTitleEl.textContent = 'Incorrect';
        feedbackTextEl.innerHTML = `<strong>The correct answer was: ${question.answer}</strong><br><br>${question.explanation}`;
        continueBtnEl.textContent = 'Try Again';
        continueBtnEl.onclick = tryAgain;
    }
}

// Try again - just close the modal
function tryAgain() {
    feedbackModalEl.classList.remove('active');
}

// Close feedback and move to next question
function nextQuestion() {
    feedbackModalEl.classList.remove('active');
    currentQuestionIndex++;

    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// Show final results
function showResults() {
    isGameActive = false;
    gameAreaEl.style.display = 'none';
    resultsScreenEl.style.display = 'block';

    const currentQuestions = currentExercise === 'exercise1' ? exercise1Questions : exercise2Questions;
    const currentScore = currentExercise === 'exercise1' ? exercise1Score : exercise2Score;

    const percentage = Math.round((currentScore / currentQuestions.length) * 100);

    finalScoreEl.textContent = `${currentScore}/${currentQuestions.length}`;
    percentageDisplayEl.textContent = `${percentage}% Correct`;

    let summaryText = '';
    if (percentage === 100) {
        summaryText = 'Excellent work! You have mastered this topic.';
    } else if (percentage >= 80) {
        summaryText = 'Great job! You have a strong understanding.';
    } else if (percentage >= 60) {
        summaryText = 'Good effort! Review the explanations to strengthen your understanding.';
    } else {
        summaryText = 'Keep practicing! Review the explanations carefully and try again.';
    }

    if (currentExercise === 'exercise2') {
        summaryText += '\n\nRead Text → Understand comments and documents\nRecommend → Suggest likely actions or choices\nEstimate → Predict numeric values\nOptimize → Determine best operating settings';
    }

    learningSummaryEl.textContent = summaryText;
    updateCombinedScore();
}

// Update combined score display
function updateCombinedScore() {
    totalScoreEl.textContent = `${exercise1Score + exercise2Score}/9`;
}

// Event listeners
menuBtnEl.addEventListener('click', showMenu);

menuBtnResultsEl.addEventListener('click', showMenu);

restartBtnEl.addEventListener('click', () => {
    startExercise(currentExercise);
});

exerciseCards.forEach(card => {
    card.addEventListener('click', () => {
        startExercise(card.dataset.exercise);
    });
});

// Initialize on load
initApp();