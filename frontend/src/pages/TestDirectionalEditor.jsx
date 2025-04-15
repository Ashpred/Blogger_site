import React, { useState, useEffect } from 'react';
import DirectionalTextarea from '../components/DirectionalTextarea';

const TestDirectionalEditor = () => {
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState('');

  const handleContentChange = (text) => {
    setContent(text);
    
    // Convert markdown and color syntax to HTML
    let htmlContent = text
      // Convert markdown bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert markdown italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert our custom color syntax
      .replace(/{color:(.*?)}(.*?){\/color}/g, '<span style="color:$1">$2</span>');
    
    // Replace newlines with <br>
    htmlContent = htmlContent.replace(/\n/g, '<br>');
    
    setPreview(htmlContent);
  };

  // Example content to show color and formatting
  const exampleContent = 'Welcome to the **BlogSphere** editor!\n\nYou can make text *italic* or **bold**.\n\nSelect some text and use the color button to change its color. Try to select this text and make it {color:red}red{/color} or {color:blue}blue{/color}.';

  useEffect(() => {
    // Set example content when component first loads
    if (!content) {
      handleContentChange(exampleContent);
    }
  }, []);

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: 'black', textAlign: 'center' }}>Text Color Editor</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <label 
          htmlFor="title" 
          style={{ 
            display: 'block', 
            marginBottom: '10px', 
            fontWeight: 'bold',
            color: 'black',
            fontSize: '18px'
          }}
        >
          Blog Title
        </label>
        <input
          type="text"
          id="title"
          placeholder="Enter your blog title"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #333',
            borderRadius: '4px',
            boxSizing: 'border-box',
            direction: 'ltr',
            textAlign: 'left',
            color: 'black'
          }}
          dir="ltr"
        />
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <label 
          htmlFor="content" 
          style={{ 
            display: 'block', 
            marginBottom: '10px', 
            fontWeight: 'bold',
            color: 'black',
            fontSize: '18px'
          }}
        >
          Content Editor (with Colors)
        </label>
        
        <DirectionalTextarea
          value={content}
          onChange={handleContentChange}
          placeholder="Write your content here... Select text to format it."
          rows={12}
        />
      </div>
      
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
          Formatted Preview
        </label>
        
        <div 
          style={{
            padding: '16px',
            border: '2px solid #ccc',
            borderRadius: '4px',
            minHeight: '100px',
            backgroundColor: 'white',
            color: 'black',
            fontSize: '16px',
            lineHeight: 1.6
          }}
          dangerouslySetInnerHTML={{ __html: preview }}
        ></div>
      </div>
      
      <div style={{
        padding: '16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: 'black' }}>How to Use Text Colors</h3>
        <ol style={{ margin: '0', paddingLeft: '20px' }}>
          <li>Select some text in the editor</li>
          <li>Click the "Colors" button</li>
          <li>Choose a color from the dropdown</li>
          <li>The text will be wrapped in color tags</li>
          <li>See the result in the preview section</li>
        </ol>
      </div>
      
      <button
        type="button"
        onClick={() => {
          alert(`Content saved with formatting:\n\n${content}`);
        }}
        style={{
          display: 'block',
          width: '200px',
          padding: '12px',
          margin: '20px auto',
          backgroundColor: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Save Content
      </button>
    </div>
  );
};

export default TestDirectionalEditor; 