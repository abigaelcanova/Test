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

// Mock data for upcoming visits
const upcomingVisits = [
    { date: '2025-11-05', time: '9:00 AM', name: 'Jennifer Lee', status: 'invited' },
    { date: '2025-11-08', time: '2:00 PM', name: 'Christopher Taylor', status: 'invited' },
    { date: '2025-11-12', time: '11:30 AM', name: 'Amanda Anderson', status: 'invited' },
    { date: '2025-11-15', time: '3:30 PM', name: 'Matthew Thomas', status: 'invited' },
    { date: '2025-11-20', time: '10:00 AM', name: 'Lisa Rodriguez', status: 'invited' }
];

// Mock data for past visits
const pastVisits = [
    { date: '2025-10-28', time: '12:00 PM', name: 'John Smith', status: 'invited' },
    { date: '2025-10-27', time: '2:30 PM', name: 'Sarah Johnson', status: 'invited' },
    { date: '2025-09-16', time: '12:30 PM', name: 'Michael Brown', status: 'invited' },
    { date: '2025-09-16', time: '10:30 AM', name: 'Emily Davis', status: 'invited' },
    { date: '2025-09-04', time: '12:45 PM', name: 'David Wilson', status: 'invited' },
    { date: '2025-08-13', time: '1:15 PM', name: 'Jessica Martinez', status: 'invited' },
    { date: '2025-07-01', time: '3:45 PM', name: 'Robert Garcia', status: 'invited' }
];

// Navigation functionality
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const emptyState = document.getElementById('emptyState');
    const visitsList = document.getElementById('visitsList');
    
    // Show upcoming visits by default
    renderUpcomingVisits();
    visitsList.style.display = 'block';
    emptyState.style.display = 'none';
    
    navItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide appropriate content
            if (index === 0) {
                // Upcoming tab
                emptyState.style.display = 'none';
                visitsList.style.display = 'block';
                renderUpcomingVisits();
            } else {
                // Past tab
                emptyState.style.display = 'none';
                visitsList.style.display = 'block';
                renderPastVisits();
            }
        });
    });
}

// Render upcoming visits list
function renderUpcomingVisits() {
    const visitsList = document.getElementById('visitsList');
    visitsList.innerHTML = '';
    
    upcomingVisits.forEach(visit => {
        const visitItem = document.createElement('div');
        visitItem.className = 'visit-item';
        
        // Format the date
        const visitDate = new Date(visit.date + 'T00:00:00');
        const formattedDate = `${visitDate.getMonth() + 1}/${visitDate.getDate()}/${visitDate.getFullYear()}`;
        
        visitItem.innerHTML = `
            <div class="visit-date">
                <div class="visit-date-main">${formattedDate}</div>
                <div class="visit-time">${visit.time}</div>
            </div>
            <div class="visit-name">${visit.name}</div>
            <div class="visit-status">
                <span class="visit-status-label">Status:</span>
                <span class="visit-status-value">${visit.status}</span>
            </div>
        `;
        
        visitsList.appendChild(visitItem);
    });
}

// Render past visits list
function renderPastVisits() {
    const visitsList = document.getElementById('visitsList');
    visitsList.innerHTML = '';
    
    pastVisits.forEach(visit => {
        const visitItem = document.createElement('div');
        visitItem.className = 'visit-item';
        
        // Format the date
        const visitDate = new Date(visit.date + 'T00:00:00');
        const formattedDate = `${visitDate.getMonth() + 1}/${visitDate.getDate()}/${visitDate.getFullYear()}`;
        
        visitItem.innerHTML = `
            <div class="visit-date">
                <div class="visit-date-main">${formattedDate}</div>
                <div class="visit-time">${visit.time}</div>
            </div>
            <div class="visit-name">${visit.name}</div>
            <div class="visit-status">
                <span class="visit-status-label">Status:</span>
                <span class="visit-status-value">${visit.status}</span>
            </div>
        `;
        
        visitsList.appendChild(visitItem);
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
    const step2ContinueBtn = document.getElementById('step2Continue');
    
    hostDetails.classList.remove('active');
    hostingOptions.style.display = 'flex';
    step2MainTitle.style.display = 'block';
    someoneElseTitle.classList.remove('active');
    step2ContinueBtn.style.display = 'none';
    
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
    const step2ContinueBtn = document.getElementById('step2Continue');
    
    document.querySelectorAll('.hosting-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.hosting-btn').forEach(b => {
                b.classList.remove('selected');
            });
            this.classList.add('selected');
            
            selectedHost = this.getAttribute('data-host');
            
            // Show the continue button when an option is selected
            step2ContinueBtn.style.display = 'block';
        });
    });

    // Step 2 continue button handler
    step2ContinueBtn.addEventListener('click', function() {
        if (selectedHost === 'me') {
            // If "I am" is selected, go directly to step 3
            goToStep(3);
        } else if (selectedHost === 'someone') {
            // If "Someone else" is selected, show host details form
            const hostDetails = document.getElementById('hostDetails');
            const hostingOptions = document.getElementById('hostingOptions');
            const step2MainTitle = document.getElementById('step2MainTitle');
            const someoneElseTitle = document.getElementById('someoneElseTitle');
            
            hostDetails.classList.add('active');
            hostingOptions.style.display = 'none';
            step2MainTitle.style.display = 'none';
            someoneElseTitle.classList.add('active');
            step2ContinueBtn.style.display = 'none';
        }
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
        showConfirmation(formData);
    });
    
    // Confirmation modal handlers
    const confirmationModal = document.getElementById('confirmationModal');
    document.getElementById('closeConfirmation').addEventListener('click', closeConfirmationModal);
    document.getElementById('backToVisits').addEventListener('click', closeConfirmationModal);
    
    // Close when clicking outside confirmation modal
    confirmationModal.addEventListener('click', function(e) {
        if (e.target === confirmationModal) {
            closeConfirmationModal();
        }
    });
}

// Show confirmation modal
function showConfirmation(formData) {
    // Close the registration modal
    closeModal();
    
    // Format the date
    const visitDate = new Date(formData.visitDate + 'T00:00:00');
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = visitDate.toLocaleDateString('en-US', dateOptions);
    
    // Determine time text
    let timeText = '';
    if (formData.startTime && formData.endTime) {
        timeText = ` at ${formatTime(formData.startTime)}`;
    } else if (formData.startTime) {
        timeText = ` at ${formatTime(formData.startTime)}`;
    }
    
    // Set confirmation date text
    document.getElementById('confirmDate').textContent = formattedDate + timeText;
    
    // Set detail date
    const shortDateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('detailDate').textContent = visitDate.toLocaleDateString('en-US', shortDateOptions);
    
    // Set time detail
    if (formData.startTime && formData.endTime) {
        document.getElementById('detailTime').textContent = 
            `${formatTime(formData.startTime)} - ${formatTime(formData.endTime)}`;
    } else if (formData.startTime) {
        document.getElementById('detailTime').textContent = `Starting at ${formatTime(formData.startTime)}`;
    } else {
        document.getElementById('detailTime').textContent = 'All day visit';
    }
    
    // Set visitor name
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    document.getElementById('visitorNameDisplay').textContent = fullName;
    
    // Show confirmation modal
    document.getElementById('confirmationModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Format time from 24h to 12h format
function formatTime(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Close confirmation modal
function closeConfirmationModal() {
    document.getElementById('confirmationModal').classList.remove('active');
    document.body.style.overflow = '';
}

