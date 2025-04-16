import axios from '../config/axios';

export const uploadProfilePicture = async (file) => {
  console.log('Starting profile picture upload', { fileSize: file.size, fileType: file.type });
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('Sending profile picture upload request');
    const response = await axios.post('/api/upload/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Profile picture upload successful', response.data);
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw new Error('Failed to upload profile picture');
  }
};

export const uploadBlogImage = async (file) => {
  console.log('Starting blog image upload', { fileSize: file.size, fileType: file.type });
  const formData = new FormData();
  formData.append('coverImage', file);

  try {
    console.log('Sending blog image upload request');
    const response = await axios.post('/api/upload/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Blog image upload successful', response.data);
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error uploading blog image:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw new Error('Failed to upload blog image');
  }
};

export const uploadContentImage = async (file) => {
  console.log('Starting content image upload', { fileSize: file.size, fileType: file.type });
  const formData = new FormData();
  formData.append('contentImage', file);

  try {
    console.log('Sending content image upload request');
    const response = await axios.post('/api/upload/content', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Content image upload successful', response.data);
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error uploading content image:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw new Error('Failed to upload content image');
  }
}; 