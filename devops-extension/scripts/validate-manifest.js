#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Validates the Chrome extension manifest.json file
 * Checks for compliance with Chrome Web Store requirements
 */
function validateManifest() {
  const manifestPath = path.join(__dirname, '..', 'manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ manifest.json not found');
    process.exit(1);
  }
  
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    console.log('🔍 Validating manifest.json...');
    
    // Check required fields
    const requiredFields = [
      'manifest_version',
      'name',
      'version',
      'description'
    ];
    
    const missingFields = requiredFields.filter(field => !manifest[field]);
    if (missingFields.length > 0) {
      console.error(`❌ Missing required fields: ${missingFields.join(', ')}`);
      process.exit(1);
    }
    
    // Check manifest version
    if (manifest.manifest_version !== 3) {
      console.warn('⚠️  Consider using Manifest V3 for better future compatibility');
    }
    
    // Check name length
    if (manifest.name.length > 75) {
      console.error('❌ Extension name is too long (max 75 characters)');
      process.exit(1);
    }
    
    // Check description length
    if (manifest.description.length > 132) {
      console.error('❌ Description is too long (max 132 characters)');
      process.exit(1);
    }
    
    // Check version format
    const versionRegex = /^\d+(\.\d+)*$/;
    if (!versionRegex.test(manifest.version)) {
      console.error('❌ Invalid version format. Use dot-separated integers.');
      process.exit(1);
    }
    
    // Check for icons
    if (!manifest.icons) {
      console.warn('⚠️  No icons specified. Icons are recommended for Chrome Web Store.');
    } else {
      const requiredSizes = [16, 48, 128];
      const missingSizes = requiredSizes.filter(size => !manifest.icons[size]);
      if (missingSizes.length > 0) {
        console.warn(`⚠️  Missing icon sizes: ${missingSizes.join(', ')}`);
      }
    }
    
    // Check permissions
    if (manifest.permissions && manifest.permissions.includes('tabs')) {
      console.warn('⚠️  "tabs" permission requires justification for Chrome Web Store');
    }
    
    if (manifest.permissions && manifest.permissions.includes('<all_urls>')) {
      console.warn('⚠️  "<all_urls>" permission requires justification for Chrome Web Store');
    }
    
    // Check content security policy
    if (manifest.content_security_policy) {
      const csp = manifest.content_security_policy;
      if (typeof csp === 'string' && csp.includes('unsafe-eval')) {
        console.error('❌ unsafe-eval is not allowed in Chrome extensions');
        process.exit(1);
      }
      if (typeof csp === 'object' && csp.extension_pages && csp.extension_pages.includes('unsafe-eval')) {
        console.error('❌ unsafe-eval is not allowed in Chrome extensions');
        process.exit(1);
      }
    }
    
    // Check background script
    if (manifest.background) {
      if (manifest.manifest_version === 3 && !manifest.background.service_worker) {
        console.error('❌ Manifest V3 requires service_worker in background');
        process.exit(1);
      }
      if (manifest.manifest_version === 2 && manifest.background.service_worker) {
        console.error('❌ Manifest V2 does not support service_worker');
        process.exit(1);
      }
    }
    
    console.log('✅ Manifest validation passed!');
    console.log(`📊 Extension: ${manifest.name} v${manifest.version}`);
    console.log(`📝 Description: ${manifest.description}`);
    
  } catch (error) {
    console.error('❌ Invalid JSON in manifest.json:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  validateManifest();
}

module.exports = { validateManifest };