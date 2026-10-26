// Enhanced Interactions & Copy Profile Hub

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Setup Copy Profile Link Button
  const copyBtn = document.getElementById('copy-profile-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = window.location.href;
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('✨ Copied profile link to clipboard!');
        }).catch(() => {
          fallbackCopy(url);
        });
      } else {
        fallbackCopy(url);
      }
    });
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast('✨ Copied profile link to clipboard!');
    } catch (err) {
      showToast('🔗 ' + text);
    }
    document.body.removeChild(tempInput);
  }

  // Toast notification controller
  let toastTimer = null;
  function showToast(message) {
    let toast = document.getElementById('toast-container');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-container';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
      <span>${message}</span>
    `;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // Smooth tactile press feel for link cards
  const cards = document.querySelectorAll('.link-item-card');
  cards.forEach(card => {
    card.addEventListener('mousedown', () => {
      card.style.transform = 'scale(0.985)';
    });
    card.addEventListener('mouseup', () => {
      card.style.transform = '';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});
