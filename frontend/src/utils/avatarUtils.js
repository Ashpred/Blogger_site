/**
 * Generate a unique avatar URL based on user information
 * Uses DiceBear API (https://dicebear.com)
 * 
 * @param {string} username - The user's username
 * @param {string} userId - The user's ID
 * @returns {string} - URL to the generated avatar
 */
export const getDefaultAvatar = (username, userId) => {
  // Use a consistent seed based on user data to ensure the same user gets the same avatar
  const seed = userId || username || Math.random().toString(36).substring(2, 10);
  
  // Select a DiceBear avatar style (options: adventurer, avataaars, bottts, etc.)
  // See all options at: https://dicebear.com/styles
  const style = 'adventurer';
  
  // Customize avatar with options
  const options = {
    backgroundColor: 'b6e3f4,c0aede,d1d4f9',
    radius: 50, // circular avatars
    size: 200  // size in pixels
  };
  
  // Convert options to query string
  const queryParams = Object.entries(options)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  // Return the full URL
  return `https://api.dicebear.com/6.x/${style}/svg?seed=${encodeURIComponent(seed)}&${queryParams}`;
};

/**
 * Get initials from a full name
 * 
 * @param {string} name - The full name
 * @returns {string} - The initials (uppercase)
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
}; 