import React, { useEffect, useRef } from 'react';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import '../assets/styles/BasicEditor.css';

const EnhancedEditor = ({ onChange, initialContent, className, placeholder, contentRef }) => {
  const editorRef = useRef(null);
  
  useEffect(() => {
    if (editorRef.current) {
      // Set initial content if provided
      if (initialContent) {
        editorRef.current.innerHTML = initialContent;
      }
      
      // Set RTL direction with left-align
      editorRef.current.style.direction = 'rtl';
      editorRef.current.style.textAlign = 'left';
      editorRef.current.setAttribute('dir', 'rtl');
      
      // Set better size
      editorRef.current.style.height = '120px';
      editorRef.current.style.whiteSpace = 'normal';
      editorRef.current.style.overflowY = 'auto';
      editorRef.current.style.width = '100%';
      editorRef.current.style.boxSizing = 'border-box';
      
      // Assign to external ref if provided
      if (contentRef) {
        contentRef.current = editorRef.current;
      }
      
      // Focus the editor
      try {
        setTimeout(() => {
          editorRef.current.focus();
        }, 300);
      } catch (e) {
        console.error('Failed to focus editor', e);
      }
    }
  }, [initialContent, contentRef]);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const handleCommand = (command) => (e) => {
    e.preventDefault();
    document.execCommand(command, false, null);
    handleInput();
    
    // Re-focus the editor
    if (editorRef.current) {
      try {
        editorRef.current.focus();
      } catch (e) {
        console.error('Failed to focus editor after command', e);
      }
    }
  };

  return (
    <div className="basic-editor" style={{ width: '100%' }}>
      {/* Toolbar */}
      <div className="editor-toolbar">
        <button 
          type="button" 
          title="Bold"
          onClick={handleCommand('bold')} 
          className="editor-btn"
          style={{ color: '#000000 !important' }}
        >
          <FaBold style={{ color: '#000000 !important', width: '16px', height: '16px' }} />
        </button>
        <button 
          type="button" 
          title="Italic"
          onClick={handleCommand('italic')} 
          className="editor-btn"
          style={{ color: '#000000 !important' }}
        >
          <FaItalic style={{ color: '#000000 !important', width: '16px', height: '16px' }} />
        </button>
        <button 
          type="button" 
          title="Underline"
          onClick={handleCommand('underline')} 
          className="editor-btn"
          style={{ color: '#000000 !important' }}
        >
          <FaUnderline style={{ color: '#000000 !important', width: '16px', height: '16px' }} />
        </button>
      </div>
      
      {/* Editable Content Area */}
      <div 
        ref={editorRef}
        contentEditable="true"
        dir="rtl"
        className={`editor-content ${className || ''}`}
        data-placeholder={placeholder || 'Write your blog content here...'}
        onInput={handleInput}
        onBlur={handleInput}
        style={{ 
          direction: 'rtl', 
          textAlign: 'left',
          height: '120px',
          whiteSpace: 'normal',
          overflowY: 'auto',
          width: '100%',
          boxSizing: 'border-box'
        }}
      ></div>
    </div>
  );
};

export default EnhancedEditor; 