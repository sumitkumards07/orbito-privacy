// Orbito Privacy Portal Scripts

// 1. Theme Management
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');

function initTheme() {
  const savedTheme = localStorage.getItem('orbito_theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  if (!themeIcon) return;
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'light') {
    // Show Moon icon
    themeIcon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    `;
  } else {
    // Show Sun icon
    themeIcon.innerHTML = `
      <circle cx="12" cy="12" r="5"></circle>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
    `;
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('orbito_theme', newTheme);
    updateThemeIcon();
  });
}

// 2. Reading Progress Bar
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  if (!progressBar) return;
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (totalHeight > 0) {
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }
});

// 3. Print Button
const printBtn = document.getElementById('printBtn');
if (printBtn) {
  printBtn.addEventListener('click', () => {
    window.print();
  });
}

// 4. ScrollSpy for Sidebar Table of Contents
const tocLinks = document.querySelectorAll('.toc-link');
const sections = document.querySelectorAll('.policy-section');

function onScroll() {
  if (!sections.length || !tocLinks.length) return;
  let currentSectionId = '';
  const scrollPos = window.scrollY + 140;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      currentSectionId = section.getAttribute('id');
    }
  });

  tocLinks.forEach((link) => {
    link.classList.remove('active');
    if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });

// 5. Sidebar Filter / Search
const sectionSearch = document.getElementById('sectionSearch');
if (sectionSearch) {
  sectionSearch.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const tocItems = document.querySelectorAll('#tocList li');

    tocItems.forEach((li) => {
      const link = li.querySelector('.toc-link');
      const text = link ? link.textContent.toLowerCase() : '';
      if (text.includes(query)) {
        li.style.display = '';
      } else {
        li.style.display = 'none';
      }
    });
  });
}

// 6. Copy Anchor Link to Clipboard
function copyAnchor(sectionId) {
  const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast('Section link copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy link.');
  });
}

// 7. Toast Notification Utility
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// 8. Handle Account Deletion Request on account-deletion.html
function handleDeletionSubmit(e) {
  e.preventDefault();
  const emailInput = document.getElementById('accountEmail');
  const scopeInput = document.getElementById('deletionScope');
  const reasonInput = document.getElementById('deletionReason');
  const confirmBox = document.getElementById('confirmCheckbox');
  const resultBox = document.getElementById('deletionResult');
  const resultText = document.getElementById('deletionResultText');

  if (!emailInput || !confirmBox.checked) return;

  const email = emailInput.value.trim();
  const scope = scopeInput ? scopeInput.value : 'all';
  const reason = reasonInput ? reasonInput.value.trim() : 'None provided';

  const subject = encodeURIComponent(`Orbito Account Deletion Request: ${email}`);
  const body = encodeURIComponent(
`Dear Orbito Privacy Team,

I am requesting the deletion of my Orbito account and associated cloud data in accordance with Google Play data safety policies.

Details:
- Registered Account Email: ${email}
- Requested Deletion Scope: ${scope}
- Reason: ${reason}
- Confirmation: I confirm this deletion request.

Please confirm receipt and let me know once my data has been purged.

Thank you.`
  );

  const mailtoUrl = `mailto:sumitkumards07@gmail.com?cc=sumitds700@gmail.com&subject=${subject}&body=${body}`;

  if (resultBox && resultText) {
    resultBox.style.display = 'flex';
    resultText.innerHTML = `
      Your deletion request for <strong>${email}</strong> has been formulated.<br>
      We are opening your email client to dispatch the request to <code>sumitkumards07@gmail.com</code>.<br><br>
      <a href="${mailtoUrl}" class="btn btn-primary" style="display:inline-flex; margin-top:0.5rem;">
        Click here if email app didn't open automatically
      </a>
    `;
    window.location.href = mailtoUrl;
  }
}

// Run on initial load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  onScroll();
});
