import React from 'react';

function CodeToolbar({ language, onCopy }) {
  const handleCopyClick = () => {
    onCopy();
  };

  return (
    <div className="code-toolbar">
      <span className="code-toolbar-language">Language: {language}</span>
      <button className="code-toolbar-copy" onClick={handleCopyClick}>
        Copy
      </button>
    </div>
  );
}

export default CodeToolbar;
