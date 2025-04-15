/**
 * Returns a default avatar image URL based on user information
 * This creates a consistent avatar for users who don't have a profile picture
 * 
 * @param {string} username - The user's username
 * @param {string} userId - The user's ID
 * @returns {string} - URL to a default avatar
 */
export const getDefaultAvatar = (username, userId) => {
  // Generate a consistent color based on username or userId
  const color = userId ? 
    userId.slice(0, 6) : 
    username ? 
      username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16).slice(0, 6) : 
      '6a11cb';
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username || 'User')}&background=${color}&color=fff&size=200`;
};

/**
 * Returns the user's initials based on their name
 * 
 * @param {string} name - The user's full name
 * @returns {string} - The user's initials
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
}; 