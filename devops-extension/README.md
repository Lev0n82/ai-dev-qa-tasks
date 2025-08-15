# DevOps User Lookup Chrome Extension

A Chrome extension that provides enhanced user lookup functionality for Azure DevOps. This extension helps users quickly find and insert team members into work items, pull requests, and other Azure DevOps forms.

## Features

- 🔍 **Quick User Search**: Search for users by first name, last name, or display name
- 🎯 **Smart Scope Selection**: Search within project scope first, then organization-wide
- ⚡ **One-Click Insertion**: Click to insert selected users into active form fields
- 💾 **Persistent Settings**: Remember your search preferences
- 🎨 **Clean UI**: Integrated popup interface that matches Azure DevOps design
- 🔒 **Secure**: Minimal permissions, works only on Azure DevOps domains

## Installation

### From Chrome Web Store (Recommended)
1. Visit the Chrome Web Store listing
2. Click "Add to Chrome"
3. Navigate to any Azure DevOps page to start using

### Manual Installation (Development)
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `devops-extension` folder
5. The extension will appear in your Chrome toolbar

## Usage

1. **Navigate to Azure DevOps**: Open any Azure DevOps page (dev.azure.com, *.visualstudio.com)
2. **Open Extension**: Click the extension icon in your Chrome toolbar
3. **Search Users**: Type a name or email to search for team members
4. **Select Scope**: Choose to search within project or organization
5. **Insert User**: Click on a user result to insert them into the active form field

### Automatic Field Detection

The extension automatically detects and adds lookup buttons to common user fields:
- Assigned To fields
- Reviewer fields
- User picker controls
- Identity picker inputs

## Configuration

The extension supports the following configuration options:

- **Search Scope**: Choose between "Project first, then organization" or "Organization only"
- **Project Search Order**: Customize the order of search fields within projects
- **Organization Search Order**: Customize the order of search fields within the organization

Settings are automatically saved and synchronized across your Chrome profile.

## Development

### Project Structure
```
devops-extension/
├── manifest.json           # Chrome extension manifest (Manifest V3)
├── popup.html             # Extension popup interface
├── dist/                  # Built extension files
│   ├── popup.js          # Popup functionality
│   ├── content.js        # Content script for page interaction
│   ├── background.js     # Service worker
│   └── content.css       # Injected styles
├── icons/                # Extension icons (16, 32, 48, 128px)
├── scripts/              # Build and validation scripts
└── src/                  # Original TypeScript/React components
```

### Building

```bash
cd devops-extension
npm install
npm run build
npm run validate
```

### Testing

```bash
npm test
npm run validate:manifest
npm run validate:permissions
```

### Packaging for Chrome Web Store

```bash
npm run pack
```

This creates a `devops-user-lookup-extension.zip` file ready for Chrome Web Store submission.

## Chrome Web Store Compliance

This extension is designed to meet all Chrome Web Store requirements:

- ✅ **Manifest V3**: Uses the latest manifest version for security and performance
- ✅ **Minimal Permissions**: Only requests necessary permissions (storage, activeTab)
- ✅ **Specific Host Permissions**: Limited to Azure DevOps domains only
- ✅ **Content Security Policy**: Strict CSP without unsafe-eval or unsafe-inline
- ✅ **Privacy Compliant**: No external tracking or data collection
- ✅ **Clear Purpose**: Single-purpose extension with clear functionality
- ✅ **Professional UI**: Clean, accessible interface following design guidelines

### Required Permissions Explained

- **storage**: Save user preferences and search settings
- **activeTab**: Interact with the current Azure DevOps tab only
- **Host permissions**: Limited to Azure DevOps domains for API access

## API Integration

The extension includes placeholder functions for integrating with Azure DevOps APIs:

```javascript
// Implement these functions with actual Azure DevOps REST API calls
async function searchProjectUsersByFirstName(query) { /* ... */ }
async function searchOrgUsersByDisplayName(query) { /* ... */ }
```

See the [Azure DevOps REST API documentation](https://docs.microsoft.com/en-us/rest/api/azure/devops/) for implementation details.

## Security

- No data is transmitted to external servers
- All user searches are performed locally through Azure DevOps APIs
- Extension only activates on Azure DevOps domains
- No storage of sensitive user information
- Content Security Policy prevents code injection

## Privacy Policy

This extension:
- Does not collect personal information
- Does not track user activity
- Only stores user preferences locally
- Does not communicate with external services
- Operates entirely within Azure DevOps domains

## Support

For issues, feature requests, or contributions:
- GitHub Issues: [Report an issue](https://github.com/Lev0n82/ai-dev-qa-tasks/issues)
- Documentation: See this README and inline code comments

## License

MIT License - see LICENSE file for details.

## Version History

### v1.0.0
- Initial release
- Basic user search functionality
- Chrome Web Store compliant manifest
- Azure DevOps integration
