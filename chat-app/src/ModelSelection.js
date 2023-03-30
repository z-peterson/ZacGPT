import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ModelSelection({ onModelSelect, onNewConversation }) {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/models');
        setModels(response.data.data);
        setSelectedModel(response.data.data[0]?.id || '');
      } catch (error) {
        console.error(error);
      }
    };
    fetchModels();
  }, []);

  const handleChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleSystemPromptChange = (event) => {
    setSystemPrompt(event.target.value);
  };

  const handleNewConversationClick = () => {
    onNewConversation(systemPrompt);
    onModelSelect(selectedModel);
  };

  const gptModels = models.filter((model) => model.id.startsWith("gpt-"));

  return (
    <div className="model-selection">
      <label htmlFor="model-select">Select Model:</label>
      <select id="model-select" value={selectedModel} onChange={handleChange}>
        <option value="">Please select a model</option>
        {gptModels.map((model) => (
          <option key={model.id} value={model.id}>
            {model.id}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="System prompt (optional)"
        value={systemPrompt}
        onChange={handleSystemPromptChange}
      />
      <button onClick={handleNewConversationClick}>New Conversation</button>
    </div>
  );
}
