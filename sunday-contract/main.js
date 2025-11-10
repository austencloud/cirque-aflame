import html2pdf from 'html2pdf.js';

// DOM Elements
const contractForm = document.getElementById('contractForm');
const previewSection = document.getElementById('previewSection');
const contractPreview = document.getElementById('contractPreview');
const previewBtn = document.getElementById('previewBtn');
const generatePdfBtn = document.getElementById('generatePdfBtn');
const closePreviewBtn = document.getElementById('closePreviewBtn');
const saveDraftBtn = document.getElementById('saveDraftBtn');
const loadDraftBtn = document.getElementById('loadDraftBtn');
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');
const dismissInstallBtn = document.getElementById('dismissInstallBtn');
const toast = document.getElementById('toast');

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Check if user has dismissed the prompt before
    if (!localStorage.getItem('installDismissed')) {
        installPrompt.style.display = 'block';
    }
});

installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
        showToast('App installed successfully!', 'success');
    }

    deferredPrompt = null;
    installPrompt.style.display = 'none';
});

dismissInstallBtn.addEventListener('click', () => {
    installPrompt.style.display = 'none';
    localStorage.setItem('installDismissed', 'true');
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    });
}

// Toast Notification
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Form Data Management
function getFormData() {
    const formData = new FormData(contractForm);
    const data = {};

    for (const [key, value] of formData) {
        data[key] = value;
    }

    // Get all form fields manually to ensure we capture everything
    const fields = [
        'effectiveDate', 'performanceDate', 'eventName',
        'clientName', 'clientTitle', 'clientPhone', 'clientEmail',
        'performanceLocation', 'arrivalTime', 'startTime', 'endTime',
        'performersDescription', 'performanceDetails',
        'totalFee', 'paymentMethod', 'paymentTiming',
        'producerName', 'showManager', 'producerPhone', 'producerEmail'
    ];

    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            data[field] = element.value;
        }
    });

    return data;
}

function setFormData(data) {
    Object.keys(data).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = data[key];
        }
    });
}

// Save Draft to LocalStorage
saveDraftBtn.addEventListener('click', () => {
    const data = getFormData();
    const drafts = JSON.parse(localStorage.getItem('contractDrafts') || '[]');

    const draftName = prompt('Enter a name for this draft:',
        `Draft ${new Date().toLocaleString()}`);

    if (draftName) {
        drafts.push({
            name: draftName,
            date: new Date().toISOString(),
            data: data
        });

        localStorage.setItem('contractDrafts', JSON.stringify(drafts));
        showToast('Draft saved successfully!', 'success');
    }
});

// Load Draft from LocalStorage
loadDraftBtn.addEventListener('click', () => {
    const drafts = JSON.parse(localStorage.getItem('contractDrafts') || '[]');

    if (drafts.length === 0) {
        showToast('No drafts found', 'info');
        return;
    }

    // Create a simple selection dialog
    const draftList = drafts.map((draft, index) =>
        `${index + 1}. ${draft.name} (${new Date(draft.date).toLocaleString()})`
    ).join('\n');

    const selection = prompt(
        `Select a draft to load:\n\n${draftList}\n\nEnter the number:`
    );

    if (selection && !isNaN(selection)) {
        const index = parseInt(selection) - 1;
        if (index >= 0 && index < drafts.length) {
            setFormData(drafts[index].data);
            showToast('Draft loaded successfully!', 'success');
        }
    }
});

// Generate Contract HTML
function generateContractHTML(data) {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return `
        <div class="banner-container">
            <img src="Simple Banner.png" alt="Cirque Aflame Banner" class="banner-image">
        </div>

        <div style="padding: 10px 20px;">
            <p class="effective-date">
                This Agreement (the "Agreement") is entered into as of
                <span class="highlight">${formatDate(data.effectiveDate)}</span> (effective date),
                between <span class="highlight">${data.clientName}</span> ("Client") and
                <span class="highlight">${data.producerName}</span> ("Producer"), with regard to the
                facts set forth herein. The performance will be carried out by
                <span class="highlight">${data.performersDescription}</span> (collectively, the "Performers")
                for <span class="highlight">${data.eventName}</span>.
            </p>
        </div>

        <div class="parties">
            <div class="party">
                <h3>CLIENT</h3>
                <p><strong>Name:</strong> ${data.clientName}</p>
                <p><strong>Phone:</strong> ${data.clientPhone}</p>
                <p><strong>Email:</strong> ${data.clientEmail}</p>
                <p><strong>Title:</strong> ${data.clientTitle}</p>
            </div>

            <div class="party">
                <h3>PRODUCER</h3>
                <p><strong>Name:</strong> ${data.producerName}</p>
                <p><strong>Show Manager:</strong> ${data.showManager}</p>
                <p><strong>Phone:</strong> ${data.producerPhone}</p>
                <p><strong>Email:</strong> ${data.producerEmail}</p>
            </div>
        </div>

        <div class="location-date">
            <div>
                <strong>Location:</strong> ${data.performanceLocation}
            </div>
            <div>
                <strong>Date:</strong> ${formatDate(data.performanceDate)}
            </div>
        </div>

        <div style="padding: 10px 20px;">
            <div class="section">
                <h2>1. FEES PAYABLE TO THE PERFORMER</h2>
                <ul>
                    <li>Total fee for the performance is <span class="highlight">$${parseFloat(data.totalFee).toFixed(2)} USD</span>.</li>
                    <li>Payment is due <span class="highlight">${data.paymentTiming}</span>.</li>
                    <li>Payment will be made by <span class="highlight">${data.paymentMethod}</span>.</li>
                    <li>'Completion' is defined as the end of the scheduled performance or the moment the Performers cease performing due to unforeseen circumstances. Full payment remains due unless otherwise agreed in writing.</li>
                </ul>
            </div>

            <div class="section">
                <h2>2. SERVICES</h2>
                <ul>
                    <li><strong>Event:</strong> ${data.eventName}</li>
                    <li><strong>Performance Details:</strong> ${data.performanceDetails}</li>
                    <li><strong>Performance Schedule:</strong>
                        <ul>
                            <li>${formatTime(data.arrivalTime)}: Performers arrive for setup</li>
                            <li>${formatTime(data.startTime)} - ${formatTime(data.endTime)}: Performance</li>
                        </ul>
                    </li>
                    <li><strong>Equipment:</strong> All performance equipment will be provided by the Performers.</li>
                </ul>
            </div>

            <div class="section">
                <h2>3. CANCELLATION AND REFUND</h2>
                <ul>
                    <li>If Client cancels, ${data.producerName} will offer a backup date within one year, subject to availability (more likely with 2+ weeks notice).</li>
                    <li>If Producer cancels, payment may be applied toward rescheduling or waived entirely.</li>
                    <li>For severe weather, health emergencies, or force majeure events, both parties will work together to reschedule, modify, or cancel the performance as appropriate.</li>
                </ul>
            </div>

            <div class="section">
                <h2>4. LATE ARRIVAL & CHANGE OF SCHEDULE</h2>
                <ul>
                    <li>Full fee remains due even if performance is shortened at Client's request.</li>
                    <li>Performers will accommodate schedule delays under 30 minutes. Longer delays may result in modified performance duration, with full fee remaining due.</li>
                    <li>Changes to performance date or time must be communicated as soon as possible. Changes within 48 hours are subject to performer availability.</li>
                </ul>
            </div>

            <div class="section">
                <h2>5. OBLIGATIONS</h2>
                <p>Producer:</p>
                <ul>
                    <li>Will ensure timely preparation and optimal performance delivery.</li>
                    <li>Will maintain confidentiality of Client information.</li>
                    <li>Will arrive with all necessary performance equipment and costumes.</li>
                    <li>May substitute performers with Client's consent, providing replacements of comparable skill and experience with advance notice when possible.</li>
                    <li>Will maintain professional conduct and collaborate with event staff.</li>
                </ul>

                <p>Client:</p>
                <ul>
                    <li>Will ensure a safe performance area appropriate for the performance type.</li>
                    <li>Will adhere to all terms and event setup responsibilities.</li>
                    <li>Will provide accurate information regarding venue, audience, and technical requirements.</li>
                    <li>Will inform Performers of any special circumstances that may affect the performance.</li>
                    <li>Will provide access to a private changing area (bathroom minimum) for performers.</li>
                </ul>
            </div>

            <div class="section">
                <h2>6. HEALTH AND SAFETY</h2>
                <ul>
                    <li>Both parties agree to uphold safety as a priority. Producer may modify or cancel performance if conditions are unsafe.</li>
                    <li>Performance area must be reasonably free of obstacles and hazards.</li>
                    <li>Performers will conduct a brief safety evaluation upon arrival and may suggest location adjustments.</li>
                    <li>Performers carry professional liability insurance through Specialty Insurance for all performance activities.</li>
                    <li>Each party agrees to indemnify and hold harmless the other from claims arising from their own negligent acts or omissions.</li>
                    <li>Any disputes related to this contract shall be governed by the laws of the State of Illinois.</li>
                </ul>
            </div>

            <div class="section">
                <h2>7. COMMUNICATION & MEDIA RIGHTS</h2>
                <ul>
                    <li>${data.showManager} will serve as the performance manager for this event and will be the primary contact for all day-of logistics and questions.</li>
                    <li>Both Client and Producer may freely use, share, and publish photographs and videos from the performance for promotional and personal purposes.</li>
                    <li>Client agrees to credit "${data.producerName}" when sharing professional photos or videos from the performance on social media or other public platforms.</li>
                    <li>Producer may list the Client's event in its portfolio and promotional materials unless Client specifically requests otherwise.</li>
                </ul>
            </div>
        </div>

        <div class="signatures">
            <div class="signature">
                <h3>CLIENT SIGNATURE</h3>
                <div class="signature-line"></div>
                <p>Name: ${data.clientName}</p>
                <p>${data.clientTitle}</p>
                <p class="date-line">Date: _______________</p>
            </div>

            <div class="signature">
                <h3>PRODUCER SIGNATURE</h3>
                <div class="signature-line"></div>
                <p>For ${data.producerName}</p>
                <p>Name: ${data.showManager}</p>
                <p class="date-line">Date: _______________</p>
            </div>
        </div>

        <div class="footer">
            <p>© ${new Date().getFullYear()} ${data.producerName} | This document is legally binding once signed by both parties.</p>
        </div>
    `;
}

// Preview Contract
previewBtn.addEventListener('click', () => {
    if (!contractForm.checkValidity()) {
        contractForm.reportValidity();
        return;
    }

    const data = getFormData();
    const html = generateContractHTML(data);

    contractPreview.innerHTML = html;
    previewSection.classList.add('active');
    document.querySelector('.main-content').classList.add('preview-active');

    showToast('Preview generated!', 'success');
});

// Close Preview
closePreviewBtn.addEventListener('click', () => {
    previewSection.classList.remove('active');
    document.querySelector('.main-content').classList.remove('preview-active');
});

// Generate PDF
generatePdfBtn.addEventListener('click', async () => {
    if (!contractForm.checkValidity()) {
        contractForm.reportValidity();
        return;
    }

    // Show loading state
    generatePdfBtn.classList.add('is-loading');
    generatePdfBtn.disabled = true;

    try {
        const data = getFormData();
        const html = generateContractHTML(data);

        // Create a temporary container
        const element = document.createElement('div');
        element.innerHTML = html;
        element.style.width = '8.5in';
        element.style.padding = '0';
        element.style.background = 'white';
        element.style.fontFamily = 'Montserrat, sans-serif';
        element.style.fontSize = '9pt';
        element.style.lineHeight = '1.3';
        element.style.color = '#333';

        // PDF options
        const opt = {
            margin: [0.3, 0.3, 0.3, 0.3],
            filename: `${data.eventName.replace(/[^a-z0-9]/gi, '_')}_Contract.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false
            },
            jsPDF: {
                unit: 'in',
                format: 'letter',
                orientation: 'portrait'
            }
        };

        // Generate PDF
        await html2pdf().set(opt).from(element).save();

        showToast('PDF generated successfully!', 'success');
    } catch (error) {
        console.error('PDF generation error:', error);
        showToast('Error generating PDF. Please try again.', 'error');
    } finally {
        // Remove loading state
        generatePdfBtn.classList.remove('is-loading');
        generatePdfBtn.disabled = false;
    }
});

// Set default dates on load
window.addEventListener('load', () => {
    const today = new Date().toISOString().split('T')[0];

    if (!document.getElementById('effectiveDate').value) {
        document.getElementById('effectiveDate').value = today;
    }

    if (!document.getElementById('performanceDate').value) {
        // Set to next week
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        document.getElementById('performanceDate').value = nextWeek.toISOString().split('T')[0];
    }

    showToast('Welcome to Cirque Aflame Contract Generator!', 'info');
});

// Auto-save to sessionStorage on form change
let autoSaveTimeout;
contractForm.addEventListener('input', () => {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        const data = getFormData();
        sessionStorage.setItem('contractFormData', JSON.stringify(data));
    }, 1000);
});

// Restore from sessionStorage on load
window.addEventListener('load', () => {
    const savedData = sessionStorage.getItem('contractFormData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            setFormData(data);
        } catch (e) {
            console.error('Error restoring form data:', e);
        }
    }
});
