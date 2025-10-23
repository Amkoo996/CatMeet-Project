// ScrollSpy refresh
window.addEventListener('load', () => {
  if (typeof bootstrap !== 'undefined') {
    const dataSpyList = [].slice.call(document.querySelectorAll('[data-bs-spy="scroll"]'));
    dataSpyList.forEach(function (dataSpyEl) {
      bootstrap.ScrollSpy.getInstance(dataSpyEl) || new bootstrap.ScrollSpy(dataSpyEl, {});
    });
  }
});

// Toast helper
function showToast(title, message) {
  const container = document.querySelector('.toast-container');
  if (!container || typeof bootstrap === 'undefined') return;
  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-bg-primary border-0';
  toastEl.setAttribute('role', 'status');
  toastEl.setAttribute('aria-live', 'polite');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <strong>${title}:</strong> ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>`;
  container.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

// Signup modal validation + username uniqueness (client-side)
(function () {
  const signupForm = document.getElementById('signupForm');
  if (!signupForm) return;
  const usernameInput = document.getElementById('username');
  const usernameFeedback = document.getElementById('usernameFeedback');
  const getUsernames = () => JSON.parse(localStorage.getItem('cm_usernames') || '[]');
  const saveUsernames = (arr) => localStorage.setItem('cm_usernames', JSON.stringify(arr));

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    let valid = signupForm.checkValidity();
    const existing = getUsernames();
    const name = (usernameInput.value || '').trim().toLowerCase();
    if (name.length >= 3 && existing.includes(name)) {
      valid = false;
      usernameInput.classList.add('is-invalid');
      if (usernameFeedback) usernameFeedback.textContent = 'This username is already taken. Please choose another.';
    }
    if (!valid) {
      signupForm.classList.add('was-validated');
      return;
    }
    existing.push(name);
    saveUsernames(existing);
    const modalEl = document.getElementById('signupModal');
    if (modalEl) bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    showToast('Signed up', 'Account created successfully. Welcome to CatMeet!');
    signupForm.reset();
    signupForm.classList.remove('was-validated');
  });

  usernameInput.addEventListener('input', () => usernameInput.classList.remove('is-invalid'));
})();

// Tomcat Get Started form
(function () {
  const gsForm = document.getElementById('getStartedForm');
  if (!gsForm) return;
  gsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!gsForm.checkValidity()) {
      gsForm.classList.add('was-validated');
      return;
    }
    const modalEl = document.getElementById('getStartedModal');
    if (modalEl) bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    showToast('Tomcat', "We'll email you steps to get started.");
    gsForm.reset();
    gsForm.classList.remove('was-validated');
  });
})();

// Lion Contact form
(function () {
  const cForm = document.getElementById('contactForm');
  if (!cForm) return;
  cForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cForm.checkValidity()) {
      cForm.classList.add('was-validated');
      return;
    }
    const modalEl = document.getElementById('contactModal');
    if (modalEl) bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    showToast('Message sent', 'Our team will contact you shortly.');
    cForm.reset();
    cForm.classList.remove('was-validated');
  });
})();

// Cookie consent banner
(function () {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  const key = 'cm_cookie_consent';
  const choice = localStorage.getItem(key);
  if (!choice) {
    banner.classList.remove('d-none');
  }
  const acceptBtn = document.getElementById('cookieAccept');
  const declineBtn = document.getElementById('cookieDecline');
  const close = (val) => {
    try { localStorage.setItem(key, val); } catch (_) {}
    banner.classList.add('d-none');
    showToast('Preferences saved', val === 'accepted' ? 'Thanks for accepting essential cookies.' : 'You declined optional cookies.');
  };
  if (acceptBtn) acceptBtn.addEventListener('click', () => close('accepted'));
  if (declineBtn) declineBtn.addEventListener('click', () => close('declined'));
})();
