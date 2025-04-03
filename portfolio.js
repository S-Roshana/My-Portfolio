// ===== TYPING ANIMATION WITH TAB AWARENESS =====
const textElement = document.getElementById("dynamic-text");
const words = [
  "Mobile Application Developer 📱", 
  "Web Application Developer 💻", 
  "Problem Solver 🔍"
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let animationFrame = null;
let lastAnimationTime = 0;

// Animation timing controls
const typeSpeed = 100;    // ms per character typing
const deleteSpeed = 50;   // ms per character deleting
const pauseBetweenWords = 1500; // ms pause between words

function typeEffect(timestamp) {
  if (!lastAnimationTime) lastAnimationTime = timestamp;
  const elapsed = timestamp - lastAnimationTime;
  const speed = isDeleting ? deleteSpeed : typeSpeed;
  
  if (elapsed >= speed) {
    const currentWord = words[wordIndex];
    
    // Update text content
    textElement.textContent = isDeleting 
      ? currentWord.substring(0, charIndex - 1)
      : currentWord.substring(0, charIndex + 1);
    
    // Update counters
    isDeleting ? charIndex-- : charIndex++;
    lastAnimationTime = timestamp;

    // State transitions
    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at end of word
      setTimeout(() => {
        isDeleting = true;
        animationFrame = window.requestAnimationFrame(typeEffect);
      }, pauseBetweenWords);
      return;
    } else if (isDeleting && charIndex === 0) {
      // Move to next word
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  // Continue animation
  animationFrame = window.requestAnimationFrame(typeEffect);
}

// ===== TAB VISIBILITY CONTROL =====
function handleVisibilityChange() {
  if (document.hidden) {
    // Pause when tab is inactive
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  } else {
    // Resume when tab becomes active
    if (!animationFrame) {
      lastAnimationTime = 0;
      animationFrame = window.requestAnimationFrame(typeEffect);
    }
  }
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      // Close mobile menu if open
      document.querySelector('.sidebar')?.classList.remove('mobile-open');
      
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}

document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('.submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.loading-spinner');
  const status = document.getElementById('form-status');
  
  // Show loading state
  btnText.textContent = 'Sending...';
  spinner.style.display = 'block';
  submitBtn.disabled = true;
  
  try {
      const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: {
              'Accept': 'application/json'
          }
      });
      
      if (response.ok) {
          status.textContent = 'Message sent successfully! I will get back to you soon.';
          status.className = 'form-status success';
          form.reset();
      } else {
          throw new Error('Form submission failed');
      }
  } catch (error) {
      console.error('Error:', error);
      status.textContent = 'There was a problem sending your message. Please try again later.';
      status.className = 'form-status error';
  } finally {
      // Reset button state
      btnText.textContent = 'Send Message';
      spinner.style.display = 'none';
      submitBtn.disabled = false;
      
      // Auto-hide success message after 5 seconds
      if (status.className.includes('success')) {
          setTimeout(() => {
              status.className = 'form-status';
              status.textContent = '';
          }, 5000);
      }
  }
});

// ===== INITIALIZE EVERYTHING =====
document.addEventListener("DOMContentLoaded", () => {
  // Start animations
  animationFrame = window.requestAnimationFrame(typeEffect);
  
  // Set up event listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  setupSmoothScrolling();
  setupForm();
});

// ===== CLEANUP ON PAGE UNLOAD =====
window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(animationFrame);
});