import React, { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize'; // Import TextareaAutosize for dynamic height

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState('');
  const textInput = useRef(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // To prevent adding a newline when pressing enter
      handleClick();
    }
  };

  const handleClick = () => {
    if (input.trim() !== '') {
      onSend(input.trim());
      setInput(''); // Clear the input field
      textInput.current.focus(); // Focus back on the input field
    }
  };

  useEffect(() => {
    textInput.current.focus(); // Focus on the input field when the component is mounted
  }, []);

  return (
    <div className="chat-input">
      <TextareaAutosize
        ref={textInput}
        value={input}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        minRows={1}
        maxRows={5}
        autoFocus={true} // Set the input focus when the component is mounted
        placeholder="Type your message here..."
      />
      <button onClick={handleClick}>Send</button>
    </div>
  );

}
