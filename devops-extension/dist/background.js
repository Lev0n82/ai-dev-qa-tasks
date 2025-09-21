// Background service worker for DevOps User Lookup Extension
class DevOpsUserLookupBackground {
  constructor() {
    this.init();
  }
  
  init() {
    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });
    
    // Handle messages from content scripts and popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Will respond asynchronously
    });
    
    // Handle action button clicks (when user clicks the extension icon)
    chrome.action.onClicked.addListener((tab) => {
      this.handleActionClick(tab);
    });
  }
  
  handleInstallation(details) {
    if (details.reason === 'install') {
      // First time installation
      this.setDefaultSettings();
      this.showWelcomeNotification();
    } else if (details.reason === 'update') {
      // Extension updated
      this.handleUpdate(details.previousVersion);
    }
  }
  
  async setDefaultSettings() {
    try {
      await chrome.storage.sync.set({
        searchScope: 'project',
        projectFirst: true,
        projectSearchOrder: ['firstName', 'lastName', 'displayName'],
        orgSearchOrder: ['firstName', 'lastName', 'displayName']
      });
    } catch (error) {
      console.error('Failed to set default settings:', error);
    }
  }
  
  showWelcomeNotification() {
    chrome.notifications.create('welcome', {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'DevOps User Lookup Installed',
      message: 'Click the extension icon when on Azure DevOps to search for users!'
    });
  }
  
  handleUpdate(previousVersion) {
    console.log(`Updated from version ${previousVersion}`);
    // Handle any migration logic here if needed
  }
  
  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'openPopup':
          // This is handled by default popup behavior
          sendResponse({ success: true });
          break;
          
        case 'getSettings':
          const settings = await this.getSettings();
          sendResponse({ settings });
          break;
          
        case 'updateSettings':
          await this.updateSettings(request.settings);
          sendResponse({ success: true });
          break;
          
        case 'checkDevOpsPage':
          const isDevOpsPage = this.isDevOpsUrl(sender.tab?.url);
          sendResponse({ isDevOpsPage });
          break;
          
        default:
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      sendResponse({ error: error.message });
    }
  }
  
  handleActionClick(tab) {
    // Check if we're on a DevOps page
    if (!this.isDevOpsUrl(tab.url)) {
      this.showNotDevOpsNotification();
      return;
    }
    
    // The popup will open automatically due to the manifest configuration
  }
  
  isDevOpsUrl(url) {
    if (!url) return false;
    
    const devOpsPatterns = [
      /https:\/\/.*\.visualstudio\.com\/.*/,
      /https:\/\/dev\.azure\.com\/.*/,
      /https:\/\/.*\.azure\.com\/.*/
    ];
    
    return devOpsPatterns.some(pattern => pattern.test(url));
  }
  
  showNotDevOpsNotification() {
    chrome.notifications.create('not-devops', {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Not on Azure DevOps',
      message: 'Please navigate to an Azure DevOps page to use this extension.'
    });
  }
  
  async getSettings() {
    try {
      const result = await chrome.storage.sync.get([
        'searchScope',
        'projectFirst',
        'projectSearchOrder',
        'orgSearchOrder'
      ]);
      
      return {
        searchScope: result.searchScope || 'project',
        projectFirst: result.projectFirst !== undefined ? result.projectFirst : true,
        projectSearchOrder: result.projectSearchOrder || ['firstName', 'lastName', 'displayName'],
        orgSearchOrder: result.orgSearchOrder || ['firstName', 'lastName', 'displayName']
      };
    } catch (error) {
      console.error('Failed to get settings:', error);
      throw error;
    }
  }
  
  async updateSettings(settings) {
    try {
      await chrome.storage.sync.set(settings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }
}

// Initialize the background service worker
new DevOpsUserLookupBackground();