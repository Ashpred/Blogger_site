import React, { useState } from 'react';

const PlainTextEditor = () => {
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  
  // Apply color formatting
  const applyColor = (color) => {
    // Get the text from textarea
    const textarea = document.getElementById('plain-text-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start === end) {
      alert('Please select some text first');
      return;
    }
    
    const selectedText = content.substring(start, end);
    
    // Create new content with the color tag
    const newContent = 
      content.substring(0, start) + 
      `{color:${color}}${selectedText}{/color}` + 
      content.substring(end);
    
    setContent(newContent);
    
    // Also update HTML preview
    updatePreview(newContent);
    
    // Set focus back and position cursor at the end of formatted text
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = end + `{color:${color}}`.length + `{/color}`.length;
      textarea.selectionEnd = textarea.selectionStart;
    }, 0);
  };
  
  // Update the HTML preview
  const updatePreview = (text) => {
    // Convert custom curly brace tags to HTML
    // {color:red}text{/color} -> <span style="color:red">text</span>
    let html = text.replace(/\{color:(.*?)\}(.*?)\{\/color\}/g, '<span style="color:$1">$2</span>');
    
    // Convert newlines to <br>
    html = html.replace(/\n/g, '<br>');
    
    setHtmlContent(html);
  };
  
  // Handle text changes
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setContent(newText);
    updatePreview(newText);
  };
  
  // Available colors with bright, distinct options
  const colors = [
    { name: 'Black', value: 'black' }, 
    { name: 'Red', value: 'red' }, 
    { name: 'Blue', value: 'blue' }, 
    { name: 'Green', value: 'green' }, 
    { name: 'Purple', value: 'purple' }, 
    { name: 'Orange', value: 'orange' }
  ];
  
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '30px auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ 
        color: 'black', 
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        Simple Text Color Editor
      </h1>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          backgroundColor: '#f7f7f7',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          <p style={{ 
            margin: '0 0 10px 0',
            fontWeight: 'bold',
            color: 'black',
            fontSize: '16px'
          }}>
            1. Type your text below
          </p>
          <p style={{ 
            margin: '0 0 10px 0',
            fontWeight: 'bold',
            color: 'black',
            fontSize: '16px'
          }}>
            2. Select text you want to color
          </p>
          <p style={{ 
            margin: '0',
            fontWeight: 'bold',
            color: 'black',
            fontSize: '16px'
          }}>
            3. Click a color button
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '10px'
        }}>
          {colors.map(color => (
            <button
              key={color.value}
              onClick={() => applyColor(color.value)}
              style={{
                padding: '10px 15px',
                backgroundColor: color.value === 'black' ? '#333' : color.value,
                color: color.value === 'black' || color.value === 'blue' || color.value === 'purple' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                minWidth: '80px'
              }}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label 
            htmlFor="plain-text-editor"
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: 'black'
            }}
          >
            Text Editor:
          </label>
          <textarea
            id="plain-text-editor"
            value={content}
            onChange={handleTextChange}
            placeholder="Type your content here. Select text and click a color button to apply color..."
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '12px',
              border: '2px solid #333',
              borderRadius: '4px',
              fontSize: '16px',
              lineHeight: 1.5,
              color: 'black',
              direction: 'ltr',
              resize: 'vertical'
            }}
            dir="ltr"
          />
        </div>
        
        <div>
          <label 
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: 'black'
            }}
          >
            Preview:
          </label>
          <div 
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '12px',
              border: '2px solid #ccc',
              borderRadius: '4px',
              backgroundColor: 'white',
              color: 'black',
              fontSize: '16px',
              lineHeight: 1.5,
              overflowWrap: 'break-word'
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent || '<span style="color:#777">Your formatted text will appear here...</span>' }}
          />
        </div>
      </div>
      
      <div style={{ 
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#fffde7',
        borderRadius: '4px',
        border: '1px solid #ffe082',
        color: '#856404'
      }}>
        <p style={{ margin: '0', fontSize: '14px' }}>
          <strong>Note:</strong> The colored text will be visible in the preview section.
          The input field shows formatting tags: {'{'+'color:red'+'}'}text{'{'+'/'+'color'+'}'}
        </p>
      </div>
      
      <button
        onClick={() => {
          alert("Text saved with formatting codes!");
          console.log("Raw text with formatting:", content);
          console.log("HTML formatted version:", htmlContent);
        }}
        style={{
          display: 'block',
          width: '200px',
          padding: '12px',
          margin: '20px auto 0',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Save Text
      </button>
    </div>
  );
};

export default PlainTextEditor; 