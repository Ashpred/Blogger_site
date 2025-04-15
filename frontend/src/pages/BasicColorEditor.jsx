import React, { useState, useRef, useEffect } from 'react';

const BasicColorEditor = () => {
  const editorRef = useRef(null);
  const [content, setContent] = useState('');
  
  // Define available colors
  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Green', value: '#008000' },
    { name: 'Purple', value: '#800080' },
    { name: 'Orange', value: '#FFA500' }
  ];

  // Setup editor when component mounts
  useEffect(() => {
    if (editorRef.current) {
      // Set initial direction
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      editorRef.current.dir = 'ltr';
      editorRef.current.setAttribute('contentEditable', 'true');
      
      // Add some initial content
      editorRef.current.innerHTML = '<p>Type your content here. Select text to format it...</p>';
    }
  }, []);

  // Format text when button is clicked
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    
    // Save content after formatting
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Handle editor content changes
  const handleEditorChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: 'black', textAlign: 'center' }}>Simple Color Text Editor</h1>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          padding: '8px',
          background: '#f0f0f0',
          borderRadius: '4px'
        }}>
          <button 
            type="button" 
            onClick={() => formatText('bold')}
            style={{
              padding: '8px 16px',
              margin: '4px',
              background: 'white',
              border: '2px solid #333',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: 'black',
              fontSize: '16px'
            }}
          >
            Bold
          </button>
          
          <button 
            type="button" 
            onClick={() => formatText('italic')}
            style={{
              padding: '8px 16px',
              margin: '4px',
              background: 'white',
              border: '2px solid #333',
              borderRadius: '4px',
              cursor: 'pointer',
              fontStyle: 'italic',
              color: 'black',
              fontSize: '16px'
            }}
          >
            Italic
          </button>
          
          <button 
            type="button" 
            onClick={() => formatText('underline')}
            style={{
              padding: '8px 16px',
              margin: '4px',
              background: 'white',
              border: '2px solid #333',
              borderRadius: '4px',
              cursor: 'pointer',
              textDecoration: 'underline',
              color: 'black',
              fontSize: '16px'
            }}
          >
            Underline
          </button>
          
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '4px 8px',
            fontWeight: 'bold',
            color: 'black'
          }}>
            Text Color:
          </span>
          
          {colors.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => formatText('foreColor', color.value)}
              style={{
                padding: '8px 16px',
                margin: '4px',
                background: 'white',
                border: `2px solid ${color.value}`,
                borderRadius: '4px',
                cursor: 'pointer',
                color: color.value,
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>
      
      <div 
        style={{
          border: '2px solid #333',
          borderRadius: '4px',
          padding: '16px',
          minHeight: '300px',
          backgroundColor: 'white',
          color: 'black',
          fontSize: '16px',
          lineHeight: 1.6,
          direction: 'ltr',
          textAlign: 'left',
          overflow: 'auto'
        }}
        ref={editorRef}
        onInput={handleEditorChange}
        onBlur={handleEditorChange}
        dir="ltr"
      ></div>
      
      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        color: 'black'
      }}>
        <h3 style={{ marginTop: 0 }}>How to Use Text Colors:</h3>
        <ol>
          <li>Select the text you want to color</li>
          <li>Click one of the color buttons above</li>
          <li>The selected text will change color immediately</li>
        </ol>
        <p><strong>Note:</strong> This editor uses your browser's built-in formatting commands.</p>
      </div>
      
      <button
        type="button"
        onClick={() => {
          console.log(content);
          alert("Content saved! Check browser console for HTML.");
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

export default BasicColorEditor; 