import React, { useEffect, useRef, useState } from 'react';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import '../assets/styles/BasicEditor.css';

const BasicEditor = ({ onChange, initialContent, className, placeholder, contentRef }) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(initialContent || '');
  
  useEffect(() => {
    if (editorRef.current) {
      // Set initial content if provided
      if (initialContent) {
        editorRef.current.innerHTML = initialContent;
      }
      
      // Force LTR text direction
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      editorRef.current.setAttribute('dir', 'ltr');
      
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
      setContent(html);
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
    <div className="basic-editor">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <button 
          type="button" 
          title="Bold"
          onClick={handleCommand('bold')} 
          className="editor-btn"
        >
          <FaBold />
        </button>
        <button 
          type="button" 
          title="Italic"
          onClick={handleCommand('italic')} 
          className="editor-btn"
        >
          <FaItalic />
        </button>
        <button 
          type="button" 
          title="Underline"
          onClick={handleCommand('underline')} 
          className="editor-btn"
        >
          <FaUnderline />
        </button>
      </div>
      
      {/* Editable Content Area */}
      <div 
        ref={editorRef}
        contentEditable="true"
        dir="ltr"
        className={`editor-content ${className || ''}`}
        data-placeholder={placeholder || 'Start typing...'}
        onInput={handleInput}
        onBlur={handleInput}
      ></div>
    </div>
  );
};

export default BasicEditor; 