// ECO Gaming Platform - Main JavaScript File

// Utility Functions
function formatPrice(price) {
  return `₮${price.toLocaleString()}`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('mn-MN');
}

// Navbar Functions
function initNavbar() {
  const searchInput = document.getElementById('searchInput');
  const districtFilter = document.getElementById('districtFilter');
  const sortBy = document.getElementById('sortBy');

  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  if (districtFilter) {
    districtFilter.addEventListener('change', handleFilter);
  }

  if (sortBy) {
    sortBy.addEventListener('change', handleSort);
  }
}

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  console.log('Searching for:', searchTerm);
  // Filter logic would go here
}

function handleFilter(e) {
  const district = e.target.value;
  console.log('Filtering by district:', district);
  // Filter logic would go here
}

function handleSort(e) {
  const sortOption = e.target.value;
  console.log('Sorting by:', sortOption);
  // Sort logic would go here
}

// Animation on Scroll
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
}

// Booking Functions
function initBookingPage() {
  const dateInput = document.getElementById('dateInput');
  const timeSelect = document.getElementById('timeSelect');
  const durationSelect = document.getElementById('durationSelect');

  if (dateInput) {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;

    dateInput.addEventListener('change', updateSummary);
  }

  if (timeSelect) {
    timeSelect.addEventListener('change', updateSummary);
  }

  if (durationSelect) {
    durationSelect.addEventListener('change', updateSummary);
  }
}

function updateSummary() {
  const dateInput = document.getElementById('dateInput');
  const timeSelect = document.getElementById('timeSelect');
  const durationSelect = document.getElementById('durationSelect');
  const summaryDetails = document.getElementById('summaryDetails');

  if (!summaryDetails) return;

  const date = dateInput ? new Date(dateInput.value).toLocaleDateString('mn-MN') : '-';
  const time = timeSelect ? timeSelect.value : '-';
  const duration = durationSelect ? durationSelect.value : '1';

  summaryDetails.innerHTML = `
    <div class="flex justify-between">
      <span class="text-gray-400">Огноо:</span>
      <span class="text-white">${date}</span>
    </div>
    <div class="flex justify-between">
      <span class="text-gray-400">Цаг:</span>
      <span class="text-white">${time}</span>
    </div>
    <div class="flex justify-between">
      <span class="text-gray-400">Хугацаа:</span>
      <span class="text-white">${duration} цаг</span>
    </div>
  `;
}

// Form Validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[0-9]{8}$/;
  return re.test(phone);
}

function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  document.body.insertBefore(alertDiv, document.body.firstChild);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

// Local Storage Functions
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving to localStorage:', e);
    return false;
  }
}

function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return null;
  }
}

function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error removing from localStorage:', e);
    return false;
  }
}

// Mock Authentication
function mockLogin(email, password, userType = 'user') {
  // This is a mock login - in production, this would call a real API
  if (email && password) {
    const userData = {
      email,
      userType,
      loginTime: new Date().toISOString()
    };
    
    saveToLocalStorage('currentUser', userData);
    return true;
  }
  return false;
}

function mockLogout() {
  removeFromLocalStorage('currentUser');
  window.location.href = 'index.html';
}

function isLoggedIn() {
  const user = getFromLocalStorage('currentUser');
  return user !== null;
}

function getCurrentUser() {
  return getFromLocalStorage('currentUser');
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    mobileMenu.classList.toggle('hidden');
  }
}

// Smooth Scroll
function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initBookingPage();
  
  // Check if user is logged in and update navbar
  const currentUser = getCurrentUser();
  if (currentUser) {
    console.log('User logged in:', currentUser.email);
  }
});

// Export functions for use in HTML
window.ECO = {
  formatPrice,
  formatDate,
  validateEmail,
  validatePhone,
  showAlert,
  mockLogin,
  mockLogout,
  isLoggedIn,
  getCurrentUser,
  toggleMobileMenu,
  smoothScroll,
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage
};
