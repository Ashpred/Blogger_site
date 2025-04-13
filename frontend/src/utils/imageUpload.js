import axios from '../config/axios';

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);

  try {
    const response = await axios.post('/api/upload/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw new Error('Failed to upload profile picture');
  }
};

// Upload blog image
export const uploadBlogImage = async (file) => {
  const formData = new FormData();
  formData.append('coverImage', file);

  try {
    const response = await axios.post('/api/upload/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error uploading blog image:', error);
    throw new Error('Failed to upload blog image');
  }
}; 