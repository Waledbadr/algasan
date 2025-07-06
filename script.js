// Global Variables
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
let isAdminLoggedIn = false;
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// Pricing Configuration
const PRICING = {
    'استراحة': 300,
    'شاليه': 250,
    'كلاهما': 500
};

// DOM Elements
const bookingForm = document.getElementById('bookingForm');
const contactForm = document.getElementById('contactForm');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminPanel = document.getElementById('adminPanel');
const adminLogin = document.getElementById('adminLogin');
const successModal = document.getElementById('successModal');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').min = today;
    document.getElementById('checkOut').min = today;
    
    // Add event listeners
    addEventListeners();
    
    // Update admin dashboard if logged in
    if (isAdminLoggedIn) {
        updateAdminDashboard();
    }
    
    // Smooth scrolling for navigation links
    setupSmoothScrolling();
}

function addEventListeners() {
    // Booking form
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
        
        // Date validation
        document.getElementById('checkIn').addEventListener('change', validateDates);
        document.getElementById('checkOut').addEventListener('change', validateDates);
        
        // Price calculation
        document.getElementById('checkIn').addEventListener('change', calculatePrice);
        document.getElementById('checkOut').addEventListener('change', calculatePrice);
        document.getElementById('accommodation').addEventListener('change', calculatePrice);
    }
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Admin login form
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    // Admin logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleAdminLogout);
    }
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Modal close
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            closeModal();
        }
    });
}

function setupSmoothScrolling() {
    // Add smooth scrolling for all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function validateDates() {
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    
    if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        if (checkOutDate <= checkInDate) {
            alert('تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول');
            document.getElementById('checkOut').value = '';
            return false;
        }
        
        // Update minimum checkout date
        const minCheckOut = new Date(checkInDate);
        minCheckOut.setDate(minCheckOut.getDate() + 1);
        document.getElementById('checkOut').min = minCheckOut.toISOString().split('T')[0];
    }
    
    return true;
}

function calculatePrice() {
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const accommodation = document.getElementById('accommodation').value;
    
    if (checkIn && checkOut && accommodation) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        
        if (nights > 0) {
            const pricePerNight = PRICING[accommodation];
            const totalPrice = nights * pricePerNight;
            
            document.getElementById('nights').textContent = nights;
            document.getElementById('totalPrice').textContent = totalPrice.toLocaleString();
        }
    }
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    if (!validateDates()) {
        return;
    }
    
    const formData = new FormData(bookingForm);
    const bookingData = {
        id: generateBookingId(),
        guestName: formData.get('guestName'),
        guestPhone: formData.get('guestPhone'),
        guestEmail: formData.get('guestEmail'),
        checkIn: formData.get('checkIn'),
        checkOut: formData.get('checkOut'),
        guests: formData.get('guests'),
        accommodation: formData.get('accommodation'),
        specialRequests: formData.get('specialRequests'),
        status: 'معلق',
        bookingDate: new Date().toISOString(),
        totalPrice: document.getElementById('totalPrice').textContent
    };
    
    // Check for conflicts
    if (checkBookingConflicts(bookingData)) {
        alert('عذراً، التواريخ المحددة غير متاحة. يرجى اختيار تواريخ أخرى.');
        return;
    }
    
    // Add booking to storage
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Show success modal
    showSuccessModal();
    
    // Reset form
    bookingForm.reset();
    document.getElementById('nights').textContent = '0';
    document.getElementById('totalPrice').textContent = '0';
    
    // Update admin dashboard if logged in
    if (isAdminLoggedIn) {
        updateAdminDashboard();
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const contactData = {
        name: formData.get('contactName'),
        email: formData.get('contactEmail'),
        subject: formData.get('contactSubject'),
        message: formData.get('contactMessage'),
        date: new Date().toISOString()
    };
    
    // Store contact messages (in a real app, this would be sent to a server)
    let contactMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    contactMessages.push(contactData);
    localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
    
    alert('تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.');
    contactForm.reset();
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        adminLogin.style.display = 'none';
        adminPanel.style.display = 'block';
        updateAdminDashboard();
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
}

function handleAdminLogout() {
    isAdminLoggedIn = false;
    adminLogin.style.display = 'block';
    adminPanel.style.display = 'none';
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
}

function generateBookingId() {
    return 'BK' + Date.now().toString().slice(-6);
}

function checkBookingConflicts(newBooking) {
    const newCheckIn = new Date(newBooking.checkIn);
    const newCheckOut = new Date(newBooking.checkOut);
    
    return bookings.some(booking => {
        if (booking.status === 'ملغي' || booking.accommodation !== newBooking.accommodation) {
            return false;
        }
        
        const existingCheckIn = new Date(booking.checkIn);
        const existingCheckOut = new Date(booking.checkOut);
        
        // Check for date overlap
        return (newCheckIn < existingCheckOut && newCheckOut > existingCheckIn);
    });
}

function updateAdminDashboard() {
    // Update statistics
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'معلق').length;
    const confirmedBookings = bookings.filter(b => b.status === 'مؤكد').length;
    
    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('pendingBookings').textContent = pendingBookings;
    document.getElementById('confirmedBookings').textContent = confirmedBookings;
    
    // Update bookings table
    updateBookingsTable();
}

function updateBookingsTable() {
    const tableBody = document.getElementById('bookingsTableBody');
    tableBody.innerHTML = '';
    
    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.guestName}</td>
            <td>${booking.guestPhone}</td>
            <td>${formatDate(booking.checkIn)}</td>
            <td>${formatDate(booking.checkOut)}</td>
            <td>${booking.accommodation}</td>
            <td><span class="status-${getStatusClass(booking.status)}">${booking.status}</span></td>
            <td>
                ${booking.status === 'معلق' ? `
                    <button class="action-btn confirm-btn" onclick="confirmBooking('${booking.id}')">تأكيد</button>
                    <button class="action-btn cancel-btn" onclick="cancelBooking('${booking.id}')">إلغاء</button>
                ` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
}

function getStatusClass(status) {
    switch(status) {
        case 'معلق': return 'pending';
        case 'مؤكد': return 'confirmed';
        case 'ملغي': return 'cancelled';
        default: return 'pending';
    }
}

function confirmBooking(bookingId) {
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
        bookings[bookingIndex].status = 'مؤكد';
        localStorage.setItem('bookings', JSON.stringify(bookings));
        updateAdminDashboard();
        
        // In a real app, you would send a confirmation email here
        alert('تم تأكيد الحجز بنجاح');
    }
}

function cancelBooking(bookingId) {
    if (confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) {
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);
        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = 'ملغي';
            localStorage.setItem('bookings', JSON.stringify(bookings));
            updateAdminDashboard();
            
            // In a real app, you would send a cancellation email here
            alert('تم إلغاء الحجز');
        }
    }
}

function showSuccessModal() {
    successModal.style.display = 'block';
    
    // Auto close after 3 seconds
    setTimeout(() => {
        closeModal();
    }, 3000);
}

function closeModal() {
    successModal.style.display = 'none';
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll effect to header
window.addEventListener('scroll', debounce(() => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    }
}, 10));

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add loading animation to buttons
document.querySelectorAll('.submit-btn').forEach(button => {
    button.addEventListener('click', function() {
        if (this.form && this.form.checkValidity()) {
            this.innerHTML = '<span class="loading"></span> جاري التحميل...';
            this.disabled = true;
            
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = this.dataset.originalText || 'إرسال';
            }, 2000);
        }
    });
});

// Store original button text
document.querySelectorAll('.submit-btn').forEach(button => {
    button.dataset.originalText = button.innerHTML;
});

// Add year to footer
const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});

// Add form validation styling
document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.checkValidity()) {
            this.style.borderColor = '#27ae60';
        } else {
            this.style.borderColor = '#e74c3c';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.style.borderColor === '#e74c3c' && this.checkValidity()) {
            this.style.borderColor = '#27ae60';
        }
    });
});

// Add print functionality for admin
function printBookingReport() {
    const printWindow = window.open('', '', 'height=600,width=800');
    const bookingsList = bookings.map(booking => 
        `<tr>
            <td>${booking.id}</td>
            <td>${booking.guestName}</td>
            <td>${booking.guestPhone}</td>
            <td>${formatDate(booking.checkIn)}</td>
            <td>${formatDate(booking.checkOut)}</td>
            <td>${booking.accommodation}</td>
            <td>${booking.status}</td>
            <td>${booking.totalPrice} ر.س</td>
        </tr>`
    ).join('');
    
    printWindow.document.write(`
        <html dir="rtl">
        <head>
            <title>تقرير الحجوزات</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                th { background-color: #f2f2f2; }
                h1 { text-align: center; }
            </style>
        </head>
        <body>
            <h1>تقرير الحجوزات - استراحة وشاليه الغصن</h1>
            <table>
                <thead>
                    <tr>
                        <th>رقم الحجز</th>
                        <th>اسم الضيف</th>
                        <th>الهاتف</th>
                        <th>تاريخ الوصول</th>
                        <th>تاريخ المغادرة</th>
                        <th>نوع الإقامة</th>
                        <th>الحالة</th>
                        <th>المبلغ</th>
                    </tr>
                </thead>
                <tbody>
                    ${bookingsList}
                </tbody>
            </table>
            <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Make print function available globally
window.printBookingReport = printBookingReport;
