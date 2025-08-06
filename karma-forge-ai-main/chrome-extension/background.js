// Background script for HabitForge extension
class HabitTracker {
  constructor() {
    this.currentTab = null;
    this.sessionStart = Date.now();
    this.tabSwitches = 0;
    this.activeTime = 0;
    this.idleTime = 0;
    this.isIdle = false;
    this.lastActivityTime = Date.now();
    this.tabTimeTracker = new Map(); // URL -> time spent
    
    this.init();
  }
  
  init() {
    // Track tab switches
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.handleTabSwitch(activeInfo.tabId);
    });
    
    // Track tab updates (URL changes)
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.active) {
        this.handleTabSwitch(tabId);
      }
    });
    
    // Track idle state
    chrome.idle.onStateChanged.addListener((newState) => {
      this.handleIdleStateChange(newState);
    });
    
    // Set idle detection to 30 seconds
    chrome.idle.setDetectionInterval(30);
    
    // Periodic sync with web app (every 5 minutes)
    setInterval(() => {
      this.syncWithWebApp();
    }, 5 * 60 * 1000);
    
    // Initial setup
    this.getCurrentTab();
  }
  
  async getCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        this.currentTab = tab;
        this.startTrackingCurrentTab();
      }
    } catch (error) {
      console.error('Error getting current tab:', error);
    }
  }
  
  handleTabSwitch(tabId) {
    this.tabSwitches++;
    this.stopTrackingCurrentTab();
    
    chrome.tabs.get(tabId, (tab) => {
      if (tab) {
        this.currentTab = tab;
        this.startTrackingCurrentTab();
      }
    });
  }
  
  startTrackingCurrentTab() {
    if (this.currentTab) {
      const url = this.getDomainFromUrl(this.currentTab.url);
      const existing = this.tabTimeTracker.get(url) || { time: 0, visits: 0 };
      this.tabTimeTracker.set(url, {
        ...existing,
        visits: existing.visits + 1,
        startTime: Date.now()
      });
    }
  }
  
  stopTrackingCurrentTab() {
    if (this.currentTab) {
      const url = this.getDomainFromUrl(this.currentTab.url);
      const tracked = this.tabTimeTracker.get(url);
      if (tracked && tracked.startTime) {
        const timeSpent = Date.now() - tracked.startTime;
        tracked.time += timeSpent;
        delete tracked.startTime;
        this.tabTimeTracker.set(url, tracked);
      }
    }
  }
  
  handleIdleStateChange(newState) {
    const now = Date.now();
    
    if (newState === 'idle' || newState === 'locked') {
      if (!this.isIdle) {
        this.isIdle = true;
        this.activeTime += now - this.lastActivityTime;
        this.stopTrackingCurrentTab();
      }
    } else if (newState === 'active') {
      if (this.isIdle) {
        this.isIdle = false;
        this.idleTime += now - this.lastActivityTime;
        this.startTrackingCurrentTab();
      }
      this.lastActivityTime = now;
    }
  }
  
  getDomainFromUrl(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }
  
  getSessionData() {
    const now = Date.now();
    const totalSessionTime = now - this.sessionStart;
    
    // Update current tab time
    this.stopTrackingCurrentTab();
    this.startTrackingCurrentTab();
    
    // Calculate final active/idle time
    let finalActiveTime = this.activeTime;
    let finalIdleTime = this.idleTime;
    
    if (!this.isIdle) {
      finalActiveTime += now - this.lastActivityTime;
    } else {
      finalIdleTime += now - this.lastActivityTime;
    }
    
    return {
      sessionDuration: totalSessionTime,
      tabSwitches: this.tabSwitches,
      activeTime: finalActiveTime,
      idleTime: finalIdleTime,
      topSites: Array.from(this.tabTimeTracker.entries())
        .sort(([,a], [,b]) => b.time - a.time)
        .slice(0, 10)
        .map(([url, data]) => ({
          url,
          timeSpent: data.time,
          visits: data.visits
        })),
      timestamp: now
    };
  }
  
  async syncWithWebApp() {
    try {
      const sessionData = this.getSessionData();
      
      // Get stored auth token
      const result = await chrome.storage.local.get(['habitforge_token']);
      if (!result.habitforge_token) {
        console.log('No auth token found, skipping sync');
        return;
      }
      
      // Send data to web app
      const response = await fetch('https://fca1c54b-5da5-4930-b1fd-0068a195564d.Gen_xCodersproject.com/api/extension/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result.habitforge_token}`
        },
        body: JSON.stringify(sessionData)
      });
      
      if (response.ok) {
        console.log('Successfully synced with web app');
        // Reset counters after successful sync
        this.resetCounters();
      }
    } catch (error) {
      console.error('Failed to sync with web app:', error);
    }
  }
  
  resetCounters() {
    this.sessionStart = Date.now();
    this.tabSwitches = 0;
    this.activeTime = 0;
    this.idleTime = 0;
    this.lastActivityTime = Date.now();
    this.tabTimeTracker.clear();
  }
  
  async getKarmaData() {
    try {
      const result = await chrome.storage.local.get(['habitforge_token']);
      if (!result.habitforge_token) {
        return null;
      }
      
      const response = await fetch('https://fca1c54b-5da5-4930-b1fd-0068a195564d.Gen_xCodersproject.com/api/extension/karma', {
        headers: {
          'Authorization': `Bearer ${result.habitforge_token}`
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to get karma data:', error);
    }
    return null;
  }
}

// Initialize tracker
const tracker = new HabitTracker();

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSessionData') {
    sendResponse(tracker.getSessionData());
  } else if (message.action === 'getKarmaData') {
    tracker.getKarmaData().then(sendResponse);
    return true; // Keep message channel open for async response
  } else if (message.action === 'syncNow') {
    tracker.syncWithWebApp().then(() => sendResponse({ success: true }));
    return true;
  }
});