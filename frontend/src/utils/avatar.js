/**
 * Utility functions for avatar handling
 */

/**
 * Gets the avatar URL, handling both full URLs and relative paths
 * @param {string} avatarPath - The path or URL to the avatar image
 * @returns {string} The properly formatted URL for the avatar
 */
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return ''; 
  
  // If it's already a full URL (starts with http or https)
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }
  
  // If it's a cloudinary URL
  if (avatarPath.includes('cloudinary')) {
    return avatarPath;
  }
  
  // Otherwise assume it's a relative path and return as is
  return avatarPath;
}; 