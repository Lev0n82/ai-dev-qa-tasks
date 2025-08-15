// Popup script for DevOps User Lookup Extension
class UserLookup {
  constructor() {
    this.searchButton = document.getElementById('search-button');
    this.searchQuery = document.getElementById('search-query');
    this.searchScope = document.getElementById('search-scope');
    this.resultsContainer = document.getElementById('results');
    
    this.init();
  }
  
  init() {
    this.searchButton.addEventListener('click', () => this.handleSearch());
    this.searchQuery.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      }
    });
    
    // Load saved preferences
    this.loadPreferences();
  }
  
  async handleSearch() {
    const query = this.searchQuery.value.trim();
    if (!query) {
      this.showError('Please enter a search query');
      return;
    }
    
    this.showLoading();
    
    try {
      const scope = this.searchScope.value;
      const results = await this.searchUsers(query, scope);
      this.displayResults(results);
      
      // Save search preferences
      this.savePreferences();
    } catch (error) {
      this.showError('Failed to search users: ' + error.message);
    }
  }
  
  async searchUsers(query, scope) {
    // Get current tab URL to determine the DevOps organization
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    
    if (!this.isDevOpsUrl(currentTab.url)) {
      throw new Error('Please navigate to an Azure DevOps page first');
    }
    
    // Send message to content script to perform the search
    const response = await chrome.tabs.sendMessage(currentTab.id, {
      action: 'searchUsers',
      query: query,
      scope: scope
    });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.users || [];
  }
  
  isDevOpsUrl(url) {
    return url && (
      url.includes('dev.azure.com') ||
      url.includes('visualstudio.com') ||
      url.includes('.azure.com')
    );
  }
  
  displayResults(users) {
    this.resultsContainer.innerHTML = '';
    
    if (users.length === 0) {
      this.resultsContainer.innerHTML = '<div class="no-results">No users found</div>';
      return;
    }
    
    users.forEach(user => {
      const userElement = this.createUserElement(user);
      this.resultsContainer.appendChild(userElement);
    });
  }
  
  createUserElement(user) {
    const userDiv = document.createElement('div');
    userDiv.className = 'user-item';
    userDiv.innerHTML = `
      <div class="user-name">${this.escapeHtml(user.displayName)}</div>
      <div class="user-email">${this.escapeHtml(user.firstName)} ${this.escapeHtml(user.lastName)}</div>
    `;
    
    userDiv.addEventListener('click', () => {
      this.selectUser(user);
    });
    
    return userDiv;
  }
  
  async selectUser(user) {
    // Send the selected user back to the content script
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    
    await chrome.tabs.sendMessage(currentTab.id, {
      action: 'selectUser',
      user: user
    });
    
    // Close the popup
    window.close();
  }
  
  showLoading() {
    this.resultsContainer.innerHTML = '<div class="loading">Searching users...</div>';
    this.searchButton.disabled = true;
    this.searchButton.textContent = 'Searching...';
  }
  
  showError(message) {
    this.resultsContainer.innerHTML = `<div class="error">${this.escapeHtml(message)}</div>`;
    this.searchButton.disabled = false;
    this.searchButton.textContent = 'Search Users';
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  async loadPreferences() {
    try {
      const result = await chrome.storage.sync.get(['searchScope']);
      if (result.searchScope) {
        this.searchScope.value = result.searchScope;
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }
  
  async savePreferences() {
    try {
      await chrome.storage.sync.set({
        searchScope: this.searchScope.value
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new UserLookup();
});