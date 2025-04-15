import React, { useState, useRef } from 'react';
import EnhancedEditor from '../components/EnhancedEditor';
import { fixImageUrl } from '../utils/imageUtils';

const TestImageEditor = () => {
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState('');
  const contentRef = useRef(null);
  
  const handleContentChange = (html) => {
    console.log('Content changed:', html);
    setContent(html);
    setPreview(html);
  };
  
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        color: 'black', 
        textAlign: 'center', 
        marginBottom: '30px',
        borderBottom: '2px solid #6a11cb',
        paddingBottom: '15px'
      }}>
        Enhanced Blog Editor with Image Support
      </h1>
      
      <div style={{ marginBottom: '30px' }}>
        <label 
          style={{ 
            display: 'block', 
            marginBottom: '10px', 
            fontWeight: 'bold',
            color: 'black',
            fontSize: '18px'
          }}
        >
          Blog Content Editor (with Image Insertion)
        </label>
        
        <EnhancedEditor
          initialContent={content}
          onChange={handleContentChange}
          placeholder="Write your blog content here... You can insert images using the image button in the toolbar."
          contentRef={contentRef}
        />
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ color: 'black', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
          Preview
        </h2>
        <div 
          style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: 'white',
            minHeight: '200px',
            marginTop: '20px'
          }}
          dangerouslySetInnerHTML={{ __html: preview }}
        ></div>
      </div>
      
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <button
          onClick={() => {
            alert('Content saved! Check console for HTML.');
            console.log('Blog content HTML:', content);
          }}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6a11cb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          Save Content
        </button>
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ color: '#495057', marginTop: 0 }}>How to Use</h3>
        <ol style={{ color: '#495057', paddingLeft: '20px' }}>
          <li>Type your blog content in the editor above</li>
          <li>Click the image button (<span role="img" aria-label="image">🖼️</span>) to insert an image</li>
          <li>Select an image from your device</li>
          <li>The image will be uploaded and inserted at your cursor position</li>
          <li>You can continue typing around the inserted image</li>
        </ol>
        <p style={{ color: '#6c757d', fontStyle: 'italic', marginBottom: 0 }}>
          This editor supports basic formatting options and image insertion for creating rich blog content.
        </p>
      </div>
    </div>
  );
};

export default TestImageEditor; 