/**
 * Clean OAuth callback parameters from the current URL
 * This removes access_token, refresh_token, and other OAuth-related hash fragments
 */
export const cleanOAuthUrl = () => {
  const urlHash = window.location.hash;
  
  if (urlHash.includes('access_token') || 
      urlHash.includes('refresh_token') || 
      urlHash.includes('provider_token') ||
      urlHash.includes('token_type')) {
    
    console.log('Cleaning OAuth parameters from URL');
    
    // Create clean URL without hash fragments
    const cleanUrl = window.location.origin + window.location.pathname + window.location.search;
    
    // Replace the current history entry
    window.history.replaceState({}, document.title, cleanUrl);
    
    return true; // Indicates that cleanup was performed
  }
  
  return false; // No cleanup was needed
};

/**
 * Check if the current URL contains OAuth callback parameters
 */
export const hasOAuthParams = () => {
  const urlHash = window.location.hash;
  return urlHash.includes('access_token') || 
         urlHash.includes('refresh_token') || 
         urlHash.includes('provider_token');
};

/**
 * Force navigation to a clean projects page after OAuth
 */
export const navigateToProjectsClean = () => {
  const cleanUrl = window.location.origin + '/projects';
  window.location.href = cleanUrl;
}; 