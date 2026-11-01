/**
 * =============================================================================
 * ANIMATED COMIC NOIR - VANILLA JAVASCRIPT CONTROLLER (script.js)
 * -----------------------------------------------------------------------------
 * Strictly vanilla JavaScript with zero external dependencies.
 * Responsibilities:
 * 1. Fully accessible mobile navigation menu toggle.
 * 2. Proper ARIA attribute management (aria-expanded, aria-label, aria-controls).
 * 3. Keyboard navigation support (Escape key close, Tab trap friendly).
 * 4. Automatic menu closing on backdrop click or navigation link selection.
 * 5. Window resize debouncing to restore desktop navigation states.
 * 6. Interactive comic dispatch form submission feedback in pure monochrome.
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. DOM ELEMENT REFERENCES
  // ---------------------------------------------------------------------------
  const menuToggleBtn = document.getElementById('menu-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link, .btn-cta-nav');
  const telegraphForm = document.querySelector('.telegraph-form');

  // Verify essential navigation elements exist before binding listeners
  if (!menuToggleBtn || !primaryNav) {
    console.warn('[Noir Archives] Mobile navigation elements missing from DOM.');
    return;
  }

  // ---------------------------------------------------------------------------
  // 2. STATE MANAGEMENT & HELPER FUNCTIONS
  // ---------------------------------------------------------------------------

  /**
   * Updates the navigation drawer state and syncs ARIA attributes.
   * @param {boolean} shouldOpen - Whether the mobile navigation should open.
   */
  function setMenuState(shouldOpen) {
    // 1. Update the aria-expanded attribute on the toggle button
    menuToggleBtn.setAttribute('aria-expanded', String(shouldOpen));

    // 2. Update the aria-label to announce current action to screen readers
    const newLabel = shouldOpen ? 'Close navigation menu' : 'Open navigation menu';
    menuToggleBtn.setAttribute('aria-label', newLabel);

    // 3. Toggle visual class on the nav element
    if (shouldOpen) {
      primaryNav.classList.add('is-open');
    } else {
      primaryNav.classList.remove('is-open');
    }
  }

  /**
   * Toggles the menu between open and closed.
   */
  function toggleMenu() {
    const isCurrentlyExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
    setMenuState(!isCurrentlyExpanded);
  }

  /**
   * Closes the menu and returns focus to the toggle button for keyboard users.
   * @param {boolean} returnFocus - Whether to set focus back to menuToggleBtn.
   */
  function closeMenu(returnFocus = false) {
    const isCurrentlyExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
    if (isCurrentlyExpanded) {
      setMenuState(false);
      if (returnFocus) {
        menuToggleBtn.focus();
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 3. EVENT LISTENERS: MOBILE NAVIGATION
  // ---------------------------------------------------------------------------

  // A. Click on Menu Toggle Button
  menuToggleBtn.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent immediate bubbling to document
    toggleMenu();
  });

  // B. Close Menu when Any Navigation Link is Clicked (Smooth in-page navigation)
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu(false);
    });
  });

  // C. Close Menu on Escape Key Press (WCAG 2.1 Keyboard Requirement)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu(true);
      }
    }
  });

  // D. Close Menu When Clicking Anywhere Outside the Nav Header (Backdrop Click)
  document.addEventListener('click', (event) => {
    const isClickInsideNav = primaryNav.contains(event.target);
    const isClickOnToggle = menuToggleBtn.contains(event.target);

    if (!isClickInsideNav && !isClickOnToggle) {
      closeMenu(false);
    }
  });

  // E. Handle Window Resize Gracefully (Reset mobile state above desktop breakpoint)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // 1024px corresponds to the desktop media query in styles.css
      if (window.innerWidth >= 1024) {
        setMenuState(false);
      }
    }, 150);
  });

  // ---------------------------------------------------------------------------
  // 4. TELEGRAPH DISPATCH FORM INTERACTION (PURE NOIR FEEDBACK)
  // ---------------------------------------------------------------------------
  if (telegraphForm) {
    telegraphForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const input = telegraphForm.querySelector('.noir-input');
      const submitBtn = telegraphForm.querySelector('.btn-form-submit');
      const originalBtnText = submitBtn.textContent;

      if (!input || !input.value.trim()) {
        // Immediate visual invalid pulse
        input.focus();
        input.style.outline = '4px solid #000000';
        return;
      }

      // Simulate instantaneous telegraph wire transmission
      submitBtn.textContent = 'TRANSMITTING...';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Create an authentic typewriter dispatch confirmation box
        const existingNotice = document.querySelector('.dispatch-notice');
        if (existingNotice) {
          existingNotice.remove();
        }

        const notice = document.createElement('div');
        notice.className = 'dispatch-notice';
        notice.setAttribute('role', 'status');
        notice.setAttribute('aria-live', 'polite');
        notice.style.backgroundColor = '#000000';
        notice.style.color = '#FFFFFF';
        notice.style.padding = '1rem';
        notice.style.marginTop = '1.25rem';
        notice.style.border = '4px solid #000000';
        notice.style.boxShadow = '6px 6px 0px #000000';
        notice.style.fontFamily = 'Impact, "Arial Black", sans-serif';
        notice.style.fontSize = '1.1rem';
        notice.style.letterSpacing = '1px';
        notice.style.textAlign = 'center';
        notice.textContent = `*** WIRE TRANSMITTED: OPERATIVE [${input.value.toUpperCase().trim()}] ENLISTED IN DISTRICT 09 ***`;

        telegraphForm.appendChild(notice);

        // Reset input and button
        input.value = '';
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;

        // Auto remove notice after 6 seconds
        setTimeout(() => {
          if (notice && notice.parentNode) {
            notice.remove();
          }
        }, 6000);
      }, 300);
    });
  }

});
