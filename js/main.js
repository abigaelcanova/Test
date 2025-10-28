// Global state
let currentStep = 1;
let selectedHost = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initModal();
    initCheckInButtons();
    initHostingButtons();
    initDatePicker();
    initForms();
});

// Navigation functionality
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// Modal functionality
function initModal() {
    const modal = document.getElementById('visitorModal');
    const addVisitorBtn = document.querySelector('.add-visitor-btn');
    const closeModalBtn = document.getElementById('closeModal');
    const modalBack = document.getElementById('modalBack');
    
    // Open modal
    addVisitorBtn.addEventListener('click', function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        goToStep(1);
    });
    
    // Close modal
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close when clicking outside modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Back button functionality
    modalBack.addEventListener('click', function() {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        } else {
            closeModal();
        }
    });
}

// Close modal and reset
function closeModal() {
    const modal = document.getElementById('visitorModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    goToStep(1); // Reset to step 1
}

// Step navigation
function goToStep(step) {
    currentStep = step;
    
    // Hide all steps
    document.querySelectorAll('.modal-step').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show current step
    document.getElementById('step' + step).classList.add('active');
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = (step / 3 * 100) + '%';
    
    // Update step text
    document.getElementById('stepText').textContent = 'Step ' + step + ' of 3';
    
    // Reset step 2 view when navigating to it
    if (step === 2) {
        resetStep2();
    }
}

// Reset step 2 to initial state
function resetStep2() {
    const hostDetails = document.getElementById('hostDetails');
    const hostingOptions = document.getElementById('hostingOptions');
    const step2MainTitle = document.getElementById('step2MainTitle');
    const someoneElseTitle = document.getElementById('someoneElseTitle');
    
    hostDetails.classList.remove('active');
    hostingOptions.style.display = 'flex';
    step2MainTitle.style.display = 'block';
    someoneElseTitle.classList.remove('active');
    
    // Clear button selections
    document.querySelectorAll('.hosting-btn').forEach(b => {
        b.classList.remove('selected');
    });
}

// Check-in button toggle
function initCheckInButtons() {
    document.querySelectorAll('.check-in-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.check-in-btn').forEach(b => {
                b.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
}

// Clear input function
function clearInput(inputId) {
    document.getElementById(inputId).value = '';
}

// Make clearInput available globally
window.clearInput = clearInput;

// Hosting options functionality
function initHostingButtons() {
    document.querySelectorAll('.hosting-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.hosting-btn').forEach(b => {
                b.classList.remove('selected');
            });
            this.classList.add('selected');
            
            selectedHost = this.getAttribute('data-host');
            const hostDetails = document.getElementById('hostDetails');
            const hostingOptions = document.getElementById('hostingOptions');
            const step2MainTitle = document.getElementById('step2MainTitle');
            const someoneElseTitle = document.getElementById('someoneElseTitle');
            
            if (selectedHost === 'someone') {
                hostDetails.classList.add('active');
                hostingOptions.style.display = 'none';
                step2MainTitle.style.display = 'none';
                someoneElseTitle.classList.add('active');
            } else if (selectedHost === 'me') {
                // If "I am" is selected, go directly to step 3
                setTimeout(() => {
                    goToStep(3);
                }, 300);
            }
        });
    });

    // Continue to step 3 from someone else option
    document.getElementById('continueStep3').addEventListener('click', function() {
        goToStep(3);
    });
}

// Date picker functionality
function initDatePicker() {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const visitDateInput = document.getElementById('visitDate');
    const dateDisplay = document.getElementById('dateDisplay');
    visitDateInput.value = dateString;
    
    // Format date display
    function updateDateDisplay() {
        const date = new Date(visitDateInput.value + 'T00:00:00');
        if (!isNaN(date)) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            dateDisplay.textContent = formattedDate;
        }
    }
    
    visitDateInput.addEventListener('change', updateDateDisplay);
    updateDateDisplay(); // Set initial display
}

// Form submission handlers
function initForms() {
    // Step 1: Visitor Information
    document.getElementById('step1Form').addEventListener('submit', function(e) {
        e.preventDefault();
        goToStep(2);
    });

    // Step 3: Final form submission
    document.getElementById('step3Form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect all form data
        const formData = {
            visitorEmail: document.getElementById('visitorEmail').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            checkIn: document.querySelector('.check-in-btn.selected').getAttribute('data-option'),
            visitorNote: document.getElementById('visitorNote').value,
            hosting: selectedHost,
            hostName: selectedHost === 'someone' ? document.getElementById('hostName').value : 'Self',
            floor: document.getElementById('floor').value,
            suite: document.getElementById('suite').value,
            visitDate: document.getElementById('visitDate').value,
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
            numEntries: document.getElementById('numEntries').value
        };
        
        console.log('Visitor Request Submitted:', formData);
        alert('Visitor request submitted successfully!');
        closeModal();
    });
}

