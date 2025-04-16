export const getDefaultAvatar = (username, userId) => {
  const color = userId ? 
    userId.slice(0, 6) : 
    username ? 
      username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16).slice(0, 6) : 
      '6a11cb';
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username || 'User')}&background=${color}&color=fff&size=200`;
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
}; 