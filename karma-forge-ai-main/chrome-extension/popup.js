// Popup script for HabitForge extension
class PopupManager {
  constructor() {
    this.elements = {
      karmaScore: document.getElementById('karmaScore'),
      activeTime: document.getElementById('activeTime'),
      tabSwitches: document.getElementById('tabSwitches'),
      idleTime: document.getElementById('idleTime'),
      streak: document.getElementById('streak'),
      currentLevel: document.getElementById('currentLevel'),
      nextLevel: document.getElementById('nextLevel'),
      progressFill: document.getElementById('progressFill'),
      sitesList: document.getElementById('sitesList'),
      authSection: document.getElementById('authSection'),
      openDashboard: document.getElementById('openDashboard'),
      syncNow: document.getElementById('syncNow'),
      loginBtn: document.getElementById('loginBtn')
    };
    
    this.init();
  }
  
  async init() {
    await this.checkAuthStatus();
    await this.loadSessionData();
    await this.loadKarmaData();
    this.setupEventListeners();
  }
  
  async checkAuthStatus() {
    try {
      const result = await chrome.storage.local.get(['habitforge_token']);
      if (!result.habitforge_token) {
        this.showAuthSection();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking auth status:', error);
      this.showAuthSection();
      return false;
    }
  }
  
  showAuthSection() {
    this.elements.authSection.style.display = 'block';
    document.querySelector('.stats-grid').style.display = 'none';
    document.querySelector('.level-progress').style.display = 'none';
    document.querySelector('.top-sites').style.display = 'none';
    document.querySelector('.actions').style.display = 'none';
  }
  
  async loadSessionData() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSessionData' });
      if (response) {
        this.updateSessionStats(response);
        this.updateTopSites(response.topSites || []);
      }
    } catch (error) {
      console.error('Error loading session data:', error);
    }
  }
  
  async loadKarmaData() {
    try {
      const karmaData = await chrome.runtime.sendMessage({ action: 'getKarmaData' });
      if (karmaData) {
        this.updateKarmaDisplay(karmaData);
      }
    } catch (error) {
      console.error('Error loading karma data:', error);
    }
  }
  
  updateSessionStats(data) {
    // Update active time
    const activeMinutes = Math.round(data.activeTime / (1000 * 60));
    this.elements.activeTime.textContent = `${activeMinutes}m`;
    
    // Update tab switches
    this.elements.tabSwitches.textContent = data.tabSwitches.toString();
    
    // Update idle time
    const idleMinutes = Math.round(data.idleTime / (1000 * 60));
    this.elements.idleTime.textContent = `${idleMinutes}m`;
  }
  
  updateKarmaDisplay(karma) {
    // Update karma score
    const karmaValue = this.elements.karmaScore.querySelector('.karma-value');
    karmaValue.textContent = karma.score || '0';
    
    // Update streak
    this.elements.streak.textContent = (karma.streak || 0).toString();
    
    // Update level
    this.elements.currentLevel.textContent = karma.level || 'Beginner';
    
    // Update next level
    const levels = ['Beginner', 'Mindful', 'Focused', 'Zen Master'];
    const currentIndex = levels.indexOf(karma.level || 'Beginner');
    const nextLevel = levels[currentIndex + 1] || 'Max Level';
    this.elements.nextLevel.textContent = nextLevel;
    
    // Update progress bar
    const progress = this.calculateLevelProgress(karma.score || 0);
    this.elements.progressFill.style.width = `${progress}%`;
  }
  
  calculateLevelProgress(score) {
    // Level thresholds: Beginner (0-100), Mindful (100-500), Focused (500-1500), Zen Master (1500+)
    if (score < 100) return (score / 100) * 100;
    if (score < 500) return ((score - 100) / 400) * 100;
    if (score < 1500) return ((score - 500) / 1000) * 100;
    return 100; // Max level
  }
  
  updateTopSites(sites) {
    this.elements.sitesList.innerHTML = '';
    
    if (sites.length === 0) {
      this.elements.sitesList.innerHTML = '<div class="site-item"><span class="site-url">No data yet</span></div>';
      return;
    }
    
    sites.slice(0, 5).forEach(site => {
      const siteElement = document.createElement('div');
      siteElement.className = 'site-item';
      
      const timeMinutes = Math.round(site.timeSpent / (1000 * 60));
      const timeText = timeMinutes > 0 ? `${timeMinutes}m` : '<1m';
      
      siteElement.innerHTML = `
        <span class="site-url">${this.formatSiteUrl(site.url)}</span>
        <span class="site-time">${timeText}</span>
      `;
      
      this.elements.sitesList.appendChild(siteElement);
    });
  }
  
  formatSiteUrl(url) {
    // Remove www. and truncate if too long
    let formatted = url.replace(/^www\./, '');
    if (formatted.length > 20) {
      formatted = formatted.substring(0, 20) + '...';
    }
    return formatted;
  }
  
  setupEventListeners() {
    // Open dashboard button
    this.elements.openDashboard.addEventListener('click', () => {
      chrome.tabs.create({ 
        url: 'https://fca1c54b-5da5-4930-b1fd-0068a195564d.Gen_xCodersproject.com/dashboard' 
      });
      window.close();
    });
    
    // Sync now button
    this.elements.syncNow.addEventListener('click', async () => {
      try {
        this.elements.syncNow.textContent = 'Syncing...';
        this.elements.syncNow.disabled = true;
        
        await chrome.runtime.sendMessage({ action: 'syncNow' });
        
        this.elements.syncNow.textContent = 'Synced!';
        setTimeout(() => {
          this.elements.syncNow.textContent = 'Sync Now';
          this.elements.syncNow.disabled = false;
        }, 2000);
        
        // Refresh data after sync
        await this.loadKarmaData();
      } catch (error) {
        console.error('Error syncing:', error);
        this.elements.syncNow.textContent = 'Error';
        setTimeout(() => {
          this.elements.syncNow.textContent = 'Sync Now';
          this.elements.syncNow.disabled = false;
        }, 2000);
      }
    });
    
    // Login button
    this.elements.loginBtn.addEventListener('click', () => {
      chrome.tabs.create({ 
        url: 'https://fca1c54b-5da5-4930-b1fd-0068a195564d.Gen_xCodersproject.com/auth' 
      });
      window.close();
    });
  }
  
  formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});