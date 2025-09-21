// Content script for DevOps User Lookup Extension
class DevOpsUserLookupContent {
  constructor() {
    this.init();
  }
  
  init() {
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Will respond asynchronously
    });
    
    // Initialize user lookup controls on the page
    this.initializeUserLookupControls();
  }
  
  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'searchUsers':
          const users = await this.searchUsers(request.query, request.scope);
          sendResponse({ users });
          break;
          
        case 'selectUser':
          this.insertSelectedUser(request.user);
          sendResponse({ success: true });
          break;
          
        default:
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      sendResponse({ error: error.message });
    }
  }
  
  async searchUsers(query, scope) {
    // Mock implementation - replace with actual Azure DevOps API calls
    // This would typically use the Azure DevOps REST API or Graph API
    
    const mockUsers = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        email: 'john.doe@company.com'
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        displayName: 'Jane Smith',
        email: 'jane.smith@company.com'
      },
      {
        id: '3',
        firstName: 'Bob',
        lastName: 'Johnson',
        displayName: 'Bob Johnson',
        email: 'bob.johnson@company.com'
      }
    ];
    
    // Simulate search filtering
    const filteredUsers = mockUsers.filter(user => {
      const searchTerm = query.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.displayName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return filteredUsers;
  }
  
  insertSelectedUser(user) {
    // Find the currently focused input field or the most appropriate field
    const activeElement = document.activeElement;
    
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      // Insert user name into the active field
      activeElement.value = user.displayName;
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      activeElement.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      // Try to find user-related fields in Azure DevOps
      this.findAndFillUserFields(user);
    }
  }
  
  findAndFillUserFields(user) {
    // Look for common user field selectors in Azure DevOps
    const userFieldSelectors = [
      'input[aria-label*="Assigned"]',
      'input[aria-label*="assigned"]',
      'input[placeholder*="user"]',
      'input[placeholder*="User"]',
      'input[placeholder*="assignee"]',
      'input[placeholder*="Assignee"]',
      '.identity-picker-input input',
      '.user-picker input',
      '.people-picker input'
    ];
    
    for (const selector of userFieldSelectors) {
      const field = document.querySelector(selector);
      if (field && field.offsetParent !== null) { // Check if field is visible
        field.value = user.displayName;
        field.focus();
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  }
  
  initializeUserLookupControls() {
    // Add user lookup buttons to relevant forms
    this.addLookupButtonsToUserFields();
    
    // Watch for dynamically added forms
    this.observeForNewUserFields();
  }
  
  addLookupButtonsToUserFields() {
    const userFields = document.querySelectorAll('input[aria-label*="Assigned"], input[placeholder*="user"], .identity-picker-input input');
    
    userFields.forEach(field => {
      if (!field.dataset.userLookupAdded) {
        this.addLookupButton(field);
        field.dataset.userLookupAdded = 'true';
      }
    });
  }
  
  addLookupButton(field) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'user-lookup-btn';
    button.innerHTML = '👤';
    button.title = 'Open User Lookup';
    button.style.cssText = `
      margin-left: 5px;
      padding: 4px 8px;
      border: 1px solid #ccc;
      background: #f5f5f5;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    `;
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      field.focus();
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });
    
    // Insert button after the field
    if (field.parentNode) {
      field.parentNode.insertBefore(button, field.nextSibling);
    }
  }
  
  observeForNewUserFields() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if the added node contains user fields
              const userFields = node.querySelectorAll('input[aria-label*="Assigned"], input[placeholder*="user"], .identity-picker-input input');
              userFields.forEach(field => {
                if (!field.dataset.userLookupAdded) {
                  this.addLookupButton(field);
                  field.dataset.userLookupAdded = 'true';
                }
              });
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Initialize when script loads
new DevOpsUserLookupContent();