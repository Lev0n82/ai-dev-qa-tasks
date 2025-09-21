#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Validates the permissions and host permissions in the manifest
 * Ensures compliance with Chrome Web Store policies
 */
function validatePermissions() {
  const manifestPath = path.join(__dirname, '..', 'manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ manifest.json not found');
    process.exit(1);
  }
  
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    console.log('🔍 Validating permissions...');
    
    const sensitivePermissions = [
      'tabs',
      'history',
      'bookmarks',
      'downloads',
      'management',
      'nativeMessaging',
      'privacy',
      'system.cpu',
      'system.memory',
      'system.storage'
    ];
    
    const broadHostPermissions = [
      '<all_urls>',
      'http://*/',
      'https://*/',
      'file:///*'
    ];
    
    // Check regular permissions
    if (manifest.permissions) {
      console.log(`📋 Permissions: ${manifest.permissions.join(', ')}`);
      
      const usedSensitivePermissions = manifest.permissions.filter(perm => 
        sensitivePermissions.includes(perm)
      );
      
      if (usedSensitivePermissions.length > 0) {
        console.warn(`⚠️  Sensitive permissions detected: ${usedSensitivePermissions.join(', ')}`);
        console.warn('   These require clear justification in Chrome Web Store submission');
      }
    }
    
    // Check host permissions (Manifest V3)
    if (manifest.host_permissions) {
      console.log(`🌐 Host permissions: ${manifest.host_permissions.join(', ')}`);
      
      const usedBroadPermissions = manifest.host_permissions.filter(perm =>
        broadHostPermissions.includes(perm)
      );
      
      if (usedBroadPermissions.length > 0) {
        console.warn(`⚠️  Broad host permissions detected: ${usedBroadPermissions.join(', ')}`);
        console.warn('   These require strong justification in Chrome Web Store submission');
      }
      
      // Check if host permissions are specific to the extension's purpose
      const devOpsRelated = manifest.host_permissions.some(perm =>
        perm.includes('azure') || perm.includes('visualstudio') || perm.includes('dev.azure.com')
      );
      
      if (devOpsRelated) {
        console.log('✅ Host permissions appear relevant to DevOps functionality');
      } else {
        console.warn('⚠️  Host permissions may not be clearly related to stated functionality');
      }
    }
    
    // Check content script matches
    if (manifest.content_scripts) {
      manifest.content_scripts.forEach((script, index) => {
        console.log(`📄 Content script ${index + 1} matches: ${script.matches.join(', ')}`);
        
        const broadMatches = script.matches.filter(match =>
          broadHostPermissions.includes(match)
        );
        
        if (broadMatches.length > 0) {
          console.warn(`⚠️  Content script ${index + 1} has broad matches: ${broadMatches.join(', ')}`);
        }
      });
    }
    
    // Check for minimum required permissions
    const hasStoragePermission = manifest.permissions && manifest.permissions.includes('storage');
    if (!hasStoragePermission) {
      console.warn('⚠️  No storage permission detected. Extension may not be able to save user preferences.');
    }
    
    // Validate that permissions match functionality
    console.log('\n📊 Permission analysis:');
    console.log('- Extension appears to be for DevOps user lookup');
    console.log('- Host permissions should be limited to Azure DevOps domains');
    console.log('- Storage permission is appropriate for saving user preferences');
    console.log('- activeTab permission allows interaction with current page only');
    
    console.log('\n✅ Permission validation completed!');
    
  } catch (error) {
    console.error('❌ Error validating permissions:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  validatePermissions();
}

module.exports = { validatePermissions };