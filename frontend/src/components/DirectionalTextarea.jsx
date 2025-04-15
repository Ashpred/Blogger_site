import React, { useState, useEffect, useRef } from 'react';

const DirectionalTextarea = ({ 
  value, 
  onChange, 
  className, 
  placeholder, 
  rows = 10,
  error 
}) => {
  const textareaRef = useRef(null);
  const [text, setText] = useState(value || '');
  const [colorMenuOpen, setColorMenuOpen] = useState(false);

  // Define available colors
  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Green', value: '#008000' },
    { name: 'Purple', value: '#800080' },
    { name: 'Orange', value: '#FFA500' }
  ];

  // Update component if external value changes
  useEffect(() => {
    if (value !== undefined && value !== text) {
      setText(value);
    }
  }, [value]);

  // Force LTR direction on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.direction = 'ltr';
      textareaRef.current.style.textAlign = 'left';
      textareaRef.current.dir = 'ltr';
    }
  }, []);

  // Click outside to close color menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorMenuOpen && !event.target.closest('.color-selector')) {
        setColorMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colorMenuOpen]);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    if (onChange) {
      onChange(newText);
    }
  };

  const applyFormatting = (type, param = null) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = text.substring(start, end);
      
      if (selectedText) {
        let newText;
        let cursorOffset;
        
        switch(type) {
          case 'bold':
            newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
            cursorOffset = 4;
            break;
          case 'italic':
            newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
            cursorOffset = 2;
            break;
          case 'color':
            // Use simpler markdown-like syntax: {color:red}text{/color}
            newText = text.substring(0, start) + 
                      `{color:${param}}${selectedText}{/color}` + 
                      text.substring(end);
            cursorOffset = `{color:${param}}`.length + selectedText.length + '{/color}'.length;
            break;
          default:
            return;
        }
        
        setText(newText);
        
        if (onChange) {
          onChange(newText);
        }
        
        // Set cursor position after selection
        setTimeout(() => {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            start + cursorOffset,
            start + cursorOffset
          );
        }, 0);
      }
    }
  };

  return (
    <div className="directional-textarea-container" style={{ width: '100%' }}>
      <div 
        className="formatting-toolbar" 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          marginBottom: '8px',
          background: '#f0f0f0',
          padding: '8px',
          borderRadius: '4px'
        }}
      >
        <button 
          type="button" 
          onClick={() => applyFormatting('bold')}
          style={{
            padding: '6px 12px',
            marginRight: '8px',
            marginBottom: '4px',
            background: 'white',
            border: '1px solid #333',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: 'black',
            fontSize: '16px'
          }}
        >
          B
        </button>
        <button 
          type="button" 
          onClick={() => applyFormatting('italic')}
          style={{
            padding: '6px 12px',
            marginRight: '8px',
            marginBottom: '4px',
            background: 'white',
            border: '1px solid #333',
            borderRadius: '4px',
            cursor: 'pointer',
            fontStyle: 'italic',
            color: 'black',
            fontSize: '16px'
          }}
        >
          I
        </button>
        
        <div className="color-selector" style={{ position: 'relative', marginRight: '8px', marginBottom: '4px' }}>
          <button 
            type="button" 
            onClick={() => setColorMenuOpen(!colorMenuOpen)}
            style={{
              padding: '6px 12px',
              background: 'white',
              border: '1px solid #333',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'black',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <span style={{ marginRight: '4px' }}>Colors</span>
            <div style={{ 
              width: '14px', 
              height: '14px', 
              background: 'linear-gradient(to right, red, orange, green, blue, purple)',
              border: '1px solid #333' 
            }}></div>
          </button>
          
          {colorMenuOpen && (
            <div style={{ 
              position: 'absolute', 
              top: '100%', 
              left: '0', 
              zIndex: 100,
              background: 'white',
              border: '1px solid #333',
              borderRadius: '4px',
              padding: '8px',
              marginTop: '4px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              width: '150px'
            }}>
              {colors.map(color => (
                <div 
                  key={color.value}
                  onClick={() => {
                    applyFormatting('color', color.name.toLowerCase());
                    setColorMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    marginBottom: '4px',
                    border: '1px solid #ddd'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: color.value,
                    border: '1px solid #ddd',
                    marginRight: '8px'
                  }}></div>
                  <span style={{ 
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>{color.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${className || ''} ${error ? 'error' : ''}`}
        style={{
          width: '100%',
          minHeight: `${rows * 24}px`,
          padding: '12px',
          boxSizing: 'border-box',
          border: error ? '2px solid #e53935' : '2px solid #333',
          borderRadius: '4px',
          fontSize: '16px',
          lineHeight: '1.5',
          direction: 'ltr',
          textAlign: 'left',
          unicodeBidi: 'embed',
          resize: 'vertical',
          color: 'black',
          backgroundColor: 'white'
        }}
        dir="ltr"
        rows={rows}
        onClick={() => setColorMenuOpen(false)}
      />
      
      <div style={{
        marginTop: '8px',
        padding: '8px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#555'
      }}>
        <p style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: 'black' }}>Formatting Guide:</p>
        <ul style={{ margin: '0', paddingLeft: '20px', color: 'black' }}>
          <li><strong>Bold:</strong> Select text and click <strong>B</strong> (adds **text**)</li>
          <li><em>Italic:</em> Select text and click <em>I</em> (adds *text*)</li>
          <li><span>Colors:</span> Select text and choose a color from the dropdown</li>
        </ul>
      </div>
      
      {error && (
        <p style={{ color: '#e53935', fontSize: '14px', marginTop: '4px', fontWeight: 'bold' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default DirectionalTextarea; 