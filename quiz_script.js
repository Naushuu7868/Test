// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 600; // 10 minutes in seconds
let shuffledQuestions = [];
let currentTestId = null;

// Constants for localStorage keys
const STORAGE_KEYS = {
    COMPLETED_TESTS: 'completedTests',
    CERTIFICATES: 'certificates',
    AVAILABLE_TESTS: 'availableTests',
    USER_PROGRESS: 'userProgress'
};

// Initialize storage if needed
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.COMPLETED_TESTS)) {
        localStorage.setItem(STORAGE_KEYS.COMPLETED_TESTS, '[]');
    }
    if (!localStorage.getItem(STORAGE_KEYS.CERTIFICATES)) {
        localStorage.setItem(STORAGE_KEYS.CERTIFICATES, '[]');
    }
    if (!localStorage.getItem(STORAGE_KEYS.AVAILABLE_TESTS)) {
        const defaultTests = [{
            id: 'coding-quiz-1',
            name: 'Advanced Coding Quiz',
            description: '25 Questions • 10 Minutes',
            icon: '📝',
            totalQuestions: 25,
            timeLimit: 600,
            questions: questions // from quiz_questions.js
        }];
        localStorage.setItem(STORAGE_KEYS.AVAILABLE_TESTS, JSON.stringify(defaultTests));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER_PROGRESS)) {
        localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, '{}');
    }
}

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const allTestsScreen = document.getElementById('all-tests-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const viewTestsBtn = document.getElementById('view-tests-btn');
const backToHomeBtn = document.getElementById('back-to-home');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const progressElement = document.getElementById('progress');
const questionCounter = document.getElementById('question-counter');
const timeLeftElement = document.getElementById('time-left');
const completedTestsList = document.getElementById('completed-tests-list');
const downloadPdfBtn = document.getElementById('download-pdf-btn');

// Initialize storage when page loads
initializeStorage();

// Event Listeners
startBtn.addEventListener('click', () => startQuiz('coding-quiz-1'));
nextBtn.addEventListener('click', nextQuestion);
viewTestsBtn.addEventListener('click', showAllTests);
backToHomeBtn.addEventListener('click', showWelcomeScreen);
downloadPdfBtn.addEventListener('click', downloadCertificatePDF);
document.querySelectorAll('.start-test-btn').forEach(btn => {
    btn.addEventListener('click', () => startQuiz(btn.dataset.testId));
});

// Initialize quiz
function startQuiz(testId) {
    currentTestId = testId;
    const availableTests = JSON.parse(localStorage.getItem(STORAGE_KEYS.AVAILABLE_TESTS));
    const currentTest = availableTests.find(test => test.id === testId);
    
    if (!currentTest) {
        console.error('Test not found');
        return;
    }

    hideAllScreens();
    quizScreen.classList.add('active');
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = currentTest.timeLimit;
    shuffledQuestions = [...currentTest.questions].sort(() => Math.random() - 0.5);
    startTimer();
    showQuestion();

    // Save current progress
    updateUserProgress({
        testId,
        status: 'in-progress',
        startTime: new Date().toISOString()
    });
}

function updateUserProgress(progress) {
    const userProgress = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROGRESS));
    userProgress[progress.testId] = progress;
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(userProgress));
}

function hideAllScreens() {
    welcomeScreen.classList.remove('active');
    quizScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    allTestsScreen.classList.remove('active');
}

function showWelcomeScreen() {
    hideAllScreens();
    welcomeScreen.classList.add('active');
}

function showAllTests() {
    hideAllScreens();
    allTestsScreen.classList.add('active');
    displayCompletedTests();
    displayAvailableTests();
}

// Store completed test and certificate
function saveCompletedTest(testData) {
    // Save completed test
    const completedTests = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_TESTS));
    const testId = Date.now();
    const completedTest = {
        id: testId,
        testId: currentTestId,
        ...testData,
        date: new Date().toISOString(),
        answers: shuffledQuestions.map((q, i) => ({
            question: q.question,
            selectedAnswer: testData.answers ? testData.answers[i] : null,
            correctAnswer: q.options[q.correct]
        }))
    };
    completedTests.push(completedTest);
    localStorage.setItem(STORAGE_KEYS.COMPLETED_TESTS, JSON.stringify(completedTests));

    // Save certificate
    const certificates = JSON.parse(localStorage.getItem(STORAGE_KEYS.CERTIFICATES));
    const certificate = {
        id: testId,
        testId: currentTestId,
        date: new Date().toISOString(),
        score: testData.score,
        percentage: testData.percentage,
        wrongAnswers: testData.wrongAnswers,
        timeSpent: 600 - timeLeft,
        motivationMessage: getMotivationMessage(testData.percentage)
    };
    certificates.push(certificate);
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates));

    // Update user progress
    updateUserProgress({
        testId: currentTestId,
        status: 'completed',
        completionTime: new Date().toISOString(),
        score: testData.percentage
    });

    return testId;
}

function getMotivationMessage(percentage) {
    if (percentage >= 80) {
        return "Outstanding performance! You're a coding expert! 🌟";
    } else if (percentage >= 60) {
        return "Great job! Keep practicing to improve further! 👍";
    }
    return "Keep learning and try again. Practice makes perfect! 💪";
}

// Display completed tests
function displayCompletedTests() {
    const completedTests = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_TESTS));
    const availableTests = JSON.parse(localStorage.getItem(STORAGE_KEYS.AVAILABLE_TESTS));
    completedTestsList.innerHTML = '';

    if (completedTests.length === 0) {
        completedTestsList.innerHTML = '<p class="no-tests">No completed tests yet</p>';
        return;
    }

    completedTests
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(test => {
            const testInfo = availableTests.find(t => t.id === test.testId);
            const testCard = document.createElement('div');
            testCard.className = 'test-card completed-test-card';
            testCard.innerHTML = `
                <div class="test-icon">${testInfo ? testInfo.icon : '📝'}</div>
                <div class="test-info">
                    <div>
                        <h4>${testInfo ? testInfo.name : 'Coding Quiz'}</h4>
                        <p>${new Date(test.date).toLocaleDateString()}</p>
                    </div>
                    <div class="score">${test.percentage}%</div>
                </div>
                <button class="view-certificate-btn" data-test-id="${test.id}">View Certificate</button>
            `;
            completedTestsList.appendChild(testCard);

            testCard.querySelector('.view-certificate-btn').addEventListener('click', () => {
                showCertificate(test.id);
            });
        });
}

function displayAvailableTests() {
    const availableTests = JSON.parse(localStorage.getItem(STORAGE_KEYS.AVAILABLE_TESTS));
    const availableTestsList = document.querySelector('#available-tests .test-list');
    availableTestsList.innerHTML = '';

    availableTests.forEach(test => {
        const testCard = document.createElement('div');
        testCard.className = 'test-card';
        testCard.innerHTML = `
            <div class="test-icon">${test.icon}</div>
            <div class="test-info">
                <h4>${test.name}</h4>
                <p>${test.description}</p>
            </div>
            <button class="btn primary-btn start-test-btn" data-test-id="${test.id}">Start Test</button>
        `;
        availableTestsList.appendChild(testCard);

        testCard.querySelector('.start-test-btn').addEventListener('click', () => {
            startQuiz(test.id);
        });
    });
}

function showCertificate(testId) {
    const certificates = JSON.parse(localStorage.getItem(STORAGE_KEYS.CERTIFICATES));
    const certificate = certificates.find(c => c.id === testId);
    
    if (!certificate) {
        console.error('Certificate not found');
        return;
    }

    hideAllScreens();
    resultScreen.classList.add('active');
    
    document.getElementById('completion-date').textContent = new Date(certificate.date).toLocaleDateString();
    document.getElementById('correct-answers').textContent = certificate.score;
    document.getElementById('wrong-answers').textContent = certificate.wrongAnswers;
    document.getElementById('percentage').textContent = `${certificate.percentage}%`;
    document.getElementById('motivation-message').textContent = certificate.motivationMessage;
}

// Shuffle questions
function shuffleQuestions() {
    shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
}

// Timer functions
function startTimer() {
    updateTimerDisplay();
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResults('timeout');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeLeftElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    if (timeLeft <= 60) {
        timeLeftElement.style.color = '#ff1744';
    }
}

// Question display
function showQuestion() {
    const question = shuffledQuestions[currentQuestionIndex];
    questionElement.textContent = question.question;
    optionsElement.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.textContent = option;
        button.addEventListener('click', () => selectOption(index));
        optionsElement.appendChild(button);
    });

    // Update progress
    const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
    progressElement.style.width = `${progress}%`;
    questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${shuffledQuestions.length}`;
    
    nextBtn.disabled = true;
}

// Option selection
function selectOption(selectedIndex) {
    const options = optionsElement.children;
    const question = shuffledQuestions[currentQuestionIndex];
    
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove('selected', 'correct', 'wrong');
        options[i].disabled = true;
    }
    
    options[selectedIndex].classList.add('selected');
    
    if (selectedIndex === question.correct) {
        options[selectedIndex].classList.add('correct');
        score++;
    } else {
        options[selectedIndex].classList.add('wrong');
        options[question.correct].classList.add('correct');
    }
    
    nextBtn.disabled = false;
}

// Navigation
function nextQuestion() {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        showResults('complete');
    }
}

// Results display
function showResults(endType) {
    clearInterval(timer);
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    const correctAnswers = document.getElementById('correct-answers');
    const wrongAnswers = document.getElementById('wrong-answers');
    const percentage = document.getElementById('percentage');
    const motivationMessage = document.getElementById('motivation-message');
    const completionDate = document.getElementById('completion-date');
    
    const totalQuestions = shuffledQuestions.length;
    const wrongCount = totalQuestions - score;
    const percentageValue = (score / totalQuestions) * 100;
    
    correctAnswers.textContent = score;
    wrongAnswers.textContent = wrongCount;
    percentage.textContent = `${percentageValue.toFixed(1)}%`;
    completionDate.textContent = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    if (percentageValue >= 80) {
        motivationMessage.textContent = "Outstanding performance! You're a coding expert! 🌟";
    } else if (percentageValue >= 60) {
        motivationMessage.textContent = "Great job! Keep practicing to improve further! 👍";
    } else {
        motivationMessage.textContent = "Keep learning and try again. Practice makes perfect! 💪";
    }
    
    // Save completed test
    saveCompletedTest({
        score,
        wrongAnswers: wrongCount,
        percentage: percentageValue
    });
}

// Download certificate as password-protected PDF
async function downloadCertificatePDF() {
    try {
        const certificateElement = document.querySelector('.certificate');
        
        // Show loading state
        const downloadBtn = document.getElementById('download-pdf-btn');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<span class="loading-icon">⌛</span> Generating PDF...';
        downloadBtn.disabled = true;

        // First, style the certificate for capture
        const originalStyle = certificateElement.style.cssText;
        certificateElement.style.background = 'white';
        certificateElement.style.padding = '2rem';
        certificateElement.style.borderRadius = '15px';
        certificateElement.style.maxWidth = '800px';
        certificateElement.style.margin = '0 auto';
        
        // Create canvas with better quality
        const canvas = await html2canvas(certificateElement, {
            scale: 2,
            useCORS: true,
            logging: true,
            backgroundColor: '#ffffff'
        });

        // Restore original style
        certificateElement.style.cssText = originalStyle;

        // Create PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height],
            encryption: {
                userPassword: "Naushad@786",
                ownerPassword: "Naushad@786",
                userPermissions: ["print", "modify", "copy", "annot-forms"]
            }
        });

        // Add the canvas as image
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        doc.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);

        // Get current date for filename
        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');

        // Save the PDF
        doc.save(`coding-quiz-certificate-${date}.pdf`);

        // Restore button state
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;

        // Show success message
        alert('Certificate downloaded successfully!\nPassword: Naushad@786');

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.\nError: ' + error.message);
        
        // Restore button state on error
        const downloadBtn = document.getElementById('download-pdf-btn');
        downloadBtn.innerHTML = '<span class="download-icon">📥</span> Download Certificate (PDF)';
        downloadBtn.disabled = false;
    }
}
