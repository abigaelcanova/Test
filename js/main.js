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
    initMultipleVisitors();
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

// Check-in functionality (now using dropdown, no initialization needed)
function initCheckInButtons() {
    // Check-in is now a dropdown, no additional initialization needed
}

// Multiple visitors functionality
let visitorCount = 1;

function initMultipleVisitors() {
    const addButton = document.getElementById('addAnotherVisitor');
    const downloadButton = document.getElementById('downloadTemplate');
    const uploadInput = document.getElementById('bulkUpload');
    
    addButton.addEventListener('click', function() {
        visitorCount++;
        addVisitorForm();
    });
    
    // Download CSV template
    downloadButton.addEventListener('click', downloadCSVTemplate);
    
    // Upload CSV file
    uploadInput.addEventListener('change', handleCSVUpload);
}

// Download CSV template
function downloadCSVTemplate() {
    const csvContent = 'Email,First Name,Last Name,Phone Number\n' +
                       'example@email.com,John,Smith,+1234567890\n' +
                       ',Jane,Doe,+1234567891\n';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visitor_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Handle CSV upload
function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        parseCSV(text);
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
}

// Parse CSV and populate visitor forms
function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length <= 1) {
        alert('The CSV file appears to be empty.');
        return;
    }
    
    // Skip header row
    const dataLines = lines.slice(1);
    
    // Clear existing visitors except the first one
    const container = document.getElementById('visitorsContainer');
    const allVisitors = container.querySelectorAll('.visitor-form');
    allVisitors.forEach((form, index) => {
        if (index > 0) {
            form.remove();
        }
    });
    
    visitorCount = 1;
    
    // Populate visitors from CSV
    dataLines.forEach((line, index) => {
        const values = parseCSVLine(line);
        if (values.length < 4) return; // Skip incomplete rows
        
        const [email, firstName, lastName, phone] = values;
        
        // Skip if all fields are empty
        if (!email && !firstName && !lastName && !phone) return;
        
        if (index === 0) {
            // Populate first visitor form
            const firstForm = container.querySelector('.visitor-form');
            firstForm.querySelector('.visitor-email').value = email || '';
            firstForm.querySelector('.visitor-firstname').value = firstName || '';
            firstForm.querySelector('.visitor-lastname').value = lastName || '';
            firstForm.querySelector('.visitor-phone').value = phone || '';
        } else {
            // Add new visitor form
            visitorCount++;
            addVisitorForm();
            
            // Populate the newly added form
            const forms = container.querySelectorAll('.visitor-form');
            const newForm = forms[forms.length - 1];
            newForm.querySelector('.visitor-email').value = email || '';
            newForm.querySelector('.visitor-firstname').value = firstName || '';
            newForm.querySelector('.visitor-lastname').value = lastName || '';
            newForm.querySelector('.visitor-phone').value = phone || '';
        }
    });
    
    alert(`Successfully imported ${Math.min(dataLines.length, visitorCount)} visitor(s).`);
}

// Parse a CSV line handling quoted values
function parseCSVLine(line) {
    const values = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    
    values.push(currentValue.trim());
    return values;
}

function addVisitorForm() {
    const container = document.getElementById('visitorsContainer');
    const visitorForm = document.createElement('div');
    visitorForm.className = 'visitor-form';
    visitorForm.setAttribute('data-visitor', visitorCount);
    
    visitorForm.innerHTML = `
        <div class="visitor-header">
            <h3 class="visitor-number">Visitor ${visitorCount}</h3>
            <button type="button" class="remove-visitor-btn" onclick="removeVisitor(this)">Remove</button>
        </div>

        <div class="form-group">
            <label class="form-label">Visitor's email</label>
            <div class="input-wrapper">
                <input type="email" class="form-input visitor-email" placeholder="Enter email address">
                <button type="button" class="clear-btn" onclick="this.previousElementSibling.value=''">×</button>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">First name <span class="required">*</span></label>
            <input type="text" class="form-input visitor-firstname" placeholder="e.g. John">
        </div>

        <div class="form-group">
            <label class="form-label">Last name <span class="required">*</span></label>
            <input type="text" class="form-input visitor-lastname" placeholder="e.g. Smith">
        </div>

        <div class="form-group">
            <label class="form-label">Phone number</label>
            <div class="phone-input-wrapper">
                <div class="country-select">🇺🇸</div>
                <div class="input-wrapper" style="flex: 1;">
                    <input type="tel" class="form-input visitor-phone" placeholder="e.g. +1234567890">
                    <button type="button" class="clear-btn" onclick="this.previousElementSibling.value=''">×</button>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(visitorForm);
}

function removeVisitor(button) {
    const visitorForm = button.closest('.visitor-form');
    visitorForm.remove();
    
    // Renumber remaining visitors
    const allVisitors = document.querySelectorAll('.visitor-form');
    allVisitors.forEach((form, index) => {
        const number = index + 1;
        form.setAttribute('data-visitor', number);
        form.querySelector('.visitor-number').textContent = `Visitor ${number}`;
    });
    
    visitorCount = allVisitors.length;
}

// Make removeVisitor available globally
window.removeVisitor = removeVisitor;

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
    
    // Recurring visit functionality
    const recurringCheckbox = document.getElementById('recurringCheckbox');
    const recurringFrequency = document.getElementById('recurringFrequency');
    const recurringEndDate = document.getElementById('recurringEndDate');
    const recurringEndInput = document.getElementById('recurringEnd');
    const endDateDisplay = document.getElementById('endDateDisplay');
    
    recurringCheckbox.addEventListener('change', function() {
        if (this.checked) {
            recurringFrequency.style.display = 'block';
            recurringEndDate.style.display = 'block';
        } else {
            recurringFrequency.style.display = 'none';
            recurringEndDate.style.display = 'none';
        }
    });
    
    // Format end date display
    recurringEndInput.addEventListener('change', function() {
        if (this.value) {
            const date = new Date(this.value + 'T00:00:00');
            if (!isNaN(date)) {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = date.toLocaleDateString('en-US', options);
                endDateDisplay.textContent = formattedDate;
            }
        }
    });
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
        
        // Collect all visitors data
        const visitors = [];
        document.querySelectorAll('.visitor-form').forEach(form => {
            const visitor = {
                email: form.querySelector('.visitor-email').value,
                firstName: form.querySelector('.visitor-firstname').value,
                lastName: form.querySelector('.visitor-lastname').value,
                phone: form.querySelector('.visitor-phone').value
            };
            visitors.push(visitor);
        });
        
        // Collect all form data
        const formData = {
            visitors: visitors,
            checkIn: document.getElementById('checkIn').value,
            visitorNote: document.getElementById('visitorNote').value,
            hosting: selectedHost,
            hostName: selectedHost === 'someone' ? document.getElementById('hostName').value : 'Self',
            floor: document.getElementById('floor').value,
            suite: document.getElementById('suite').value,
            visitDate: document.getElementById('visitDate').value,
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
            numEntries: document.getElementById('numEntries').value,
            recurring: document.getElementById('recurringCheckbox').checked,
            frequency: document.getElementById('frequency').value,
            recurringEndDate: document.getElementById('recurringEnd').value
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
    
    // Set visitor names
    const visitorNames = formData.visitors
        .map(v => `${v.firstName} ${v.lastName}`.trim())
        .filter(name => name)
        .join(', ');
    document.getElementById('visitorNameDisplay').textContent = visitorNames || 'No names provided';
    
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

