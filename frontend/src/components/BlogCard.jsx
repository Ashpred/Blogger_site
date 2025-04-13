import { getDefaultAvatar } from '../utils/avatarUtils';

<img 
  src={blog.author?.profilePicture || getDefaultAvatar(blog.author?.username, blog.author?._id)}
  alt={blog.author?.fullName}
  className="author-avatar"
/> 