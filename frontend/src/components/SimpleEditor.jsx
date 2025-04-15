import React, { useEffect, useRef } from 'react';

const SimpleEditor = ({ onChange, initialContent, className, placeholder }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      // Set initial content if provided
      if (initialContent) {
        editorRef.current.innerHTML = initialContent;
      }
      
      // Force LTR text direction multiple ways
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      editorRef.current.setAttribute('dir', 'ltr');
      
      // Try to focus the editor
      try {
        setTimeout(() => {
          editorRef.current.focus();
        }, 300);
      } catch (e) {
        console.error('Failed to focus editor', e);
      }
    }
  }, [initialContent]);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleCommand = (command) => (e) => {
    e.preventDefault();
    document.execCommand(command, false, null);
    handleInput();
    
    // Re-focus on the editor
    if (editorRef.current) {
      try {
        editorRef.current.focus();
      } catch (e) {
        console.error('Failed to focus editor after command', e);
      }
    }
  };

  return (
    <div className="simple-editor" style={{ overflow: 'hidden', border: '1px solid #ddd', borderRadius: '8px' }}>
      <div className="editor-toolbar" style={{ display: 'flex', padding: '10px', background: '#f8f8f8', borderBottom: '1px solid #ddd' }}>
        <button 
          type="button" 
          onClick={handleCommand('bold')} 
          style={{ 
            width: '36px', 
            height: '36px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: '8px', 
            border: '1px solid #ddd', 
            background: 'white', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          B
        </button>
        <button 
          type="button" 
          onClick={handleCommand('italic')} 
          style={{ 
            width: '36px', 
            height: '36px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: '8px', 
            border: '1px solid #ddd', 
            background: 'white', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontStyle: 'italic'
          }}
        >
          I
        </button>
        <button 
          type="button" 
          onClick={handleCommand('underline')} 
          style={{ 
            width: '36px', 
            height: '36px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: '8px', 
            border: '1px solid #ddd', 
            background: 'white', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            textDecoration: 'underline'
          }}
        >
          U
        </button>
      </div>
      <div 
        ref={editorRef}
        contentEditable="true"
        dir="ltr"
        style={{ 
          minHeight: '200px', 
          padding: '16px', 
          outline: 'none', 
          fontSize: '16px', 
          lineHeight: 1.6, 
          color: '#333',
          direction: 'ltr', 
          textAlign: 'left',
          unicodeBidi: 'embed'
        }}
        data-placeholder={placeholder || 'Start typing...'}
        onInput={handleInput}
        onBlur={handleInput}
        className={className}
      ></div>
    </div>
  );
};

export default SimpleEditor; 