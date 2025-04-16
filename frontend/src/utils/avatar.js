export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return ''; 
  
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }
  
  if (avatarPath.includes('cloudinary')) {
    return avatarPath;
  }
  
  return avatarPath;
}; 