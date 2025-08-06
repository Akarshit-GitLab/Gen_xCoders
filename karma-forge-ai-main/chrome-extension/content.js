// Content script for activity detection
let lastActivity = Date.now();
let activityTimer;

// Track user activity on the page
function trackActivity() {
  lastActivity = Date.now();
  
  // Reset the activity timer
  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    // User has been inactive for 30 seconds
    chrome.runtime.sendMessage({ action: 'userInactive' });
  }, 30000);
}

// Listen for user interactions
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
  document.addEventListener(event, trackActivity, true);
});

// Send periodic activity updates
setInterval(() => {
  chrome.runtime.sendMessage({ 
    action: 'activityUpdate',
    lastActivity: lastActivity 
  });
}, 10000); // Every 10 seconds

// Initial activity tracking
trackActivity();