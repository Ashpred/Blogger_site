
export const fixImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // Ensure HTTPS for security
  if (imageUrl.startsWith('http:')) {
    imageUrl = imageUrl.replace('http:', 'https:');
  }
  
  // For Cloudinary URLs, add optimization parameters
  if (imageUrl.includes('cloudinary.com') && !imageUrl.includes('f_auto')) {
    const parts = imageUrl.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_500,h_500,c_fill,f_auto,q_auto/${parts[1]}`;
    }
  }
  
  return imageUrl;
}; 