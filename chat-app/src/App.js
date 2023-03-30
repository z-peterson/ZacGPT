import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ChatInput from './ChatInput';
import ModelSelection from './ModelSelection';
import CodeToolbar from './CodeToolbar';
import './registerLanguages'; // Import the registerLanguages.js file here

const cost_per_token = 0.00003;

function App() {
  const [messages, setMessages] = useState([]);
  const [monthlyData, setMonthlyData] = useState({ monthlyTokens: 0, monthlyCost: 0.0 });
  const [currentData, setCurrentData] = useState({ currentTokens: 0, currentCost: 0.0 });
  const [selectedModel, setSelectedModel] = useState(null);
  const [conversationId, setConversationId] = useState("");
  const [fetchingResponse, setFetchingResponse] = useState(false);
  const [responseStartTime, setResponseStartTime] = useState(null);

  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [currentResponseTime, setCurrentResponseTime] = useState(0);

  useEffect(() => {
    let interval;
    if (fetchingResponse) {
      interval = setInterval(() => {
        setCurrentResponseTime(new Date() - responseStartTime);
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [fetchingResponse]);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/get_monthly_summary");
        setMonthlyData({
          monthlyTokens: response.data.total_tokens,
          monthlyCost: response.data.total_cost,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchMonthlyData();
  }, []);

  const handleSubmit = async (message) => {
    const currentTime = new Date().toLocaleTimeString("en-US");
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message, time: currentTime },
    ]);
  
    const responseStartTime = new Date();
    setResponseStartTime(responseStartTime);
    setFetchingResponse(true);
  
    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        user_input: message,
        model_id: selectedModel,
        conversation_id: conversationId,
      });
  
      const responseReceivedTime = new Date();
      const elapsedTime = (
        (responseReceivedTime - responseStartTime) /
        1000
      ).toFixed(2);
      setCurrentData({
        currentTokens: response.data.metadata.current_tokens,
        currentCost: response.data.metadata.current_tokens * cost_per_token,
      });
  
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: response.data.response,
          time: responseReceivedTime.toLocaleTimeString("en-US"),
          elapsedTime: elapsedTime,
        },
      ]);
      setFetchingResponse(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewConversation = async (systemPrompt) => {
    setCurrentData({ currentTokens: 0, currentCost: 0.0 }); // Reset current tokens and cost data
    setMessages([]); // Reset conversation

    try {
      // Call API to start a new conversation with a system prompt
      const response = await axios.post('http://localhost:5000/api/start_conversation', {
        model_id: selectedModel,
        system_prompt: systemPrompt,
      });
      setConversationId(response.data.conversation_id);
    } catch (error) {
      console.error(error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch((err) => console.error('Failed to copy text: ', err));
  };
  

  const parseMessage = (message) => {
    const regex = /(?<![\\\/])```([\s\S]*?)```/g;
    const parts = message.split(regex);

  const headerRegex = /^###\s(.+)/;
  const tableRowRegex = /^\|(.+)?\|/;

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      const lines = part.split('\n');
      const language = lines.shift();
      const code = lines.join('\n');

      return (
        <React.Fragment key={`codeblock-${index}`}>
          <div className="code-block-container">
            <CodeToolbar language={language} onCopy={() => copyToClipboard(code)} />
            <SyntaxHighlighter
              language={language.toLowerCase()}
              style={vs2015}
              className="custom-syntax-highlighter"
              key={`code-${index}`}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </React.Fragment>
      );
    } else {
      const lines = part.split("\n");

      // Calculate the maximum widths for each column
      const maxWidths = {};
      lines.forEach((line) => {
        if (tableRowRegex.test(line)) {
          const cells = line.split("|").slice(1, -1);
          cells.forEach((cell, cellIdx) => {
            maxWidths[cellIdx] = Math.max(maxWidths[cellIdx] || 0, cell.trim().length);
          });
        }
      });

      let insideTable = false;

      return lines.map((line, idx) => {
        const isHeader = headerRegex.test(line);
        const isTableRow = tableRowRegex.test(line);

        if (isHeader) {
          return (
            <div key={`${index}-${idx}`} className="message-text">
              <strong>{line.replace("###", "").trim()}</strong>
            </div>
          );
        } else if (isTableRow) {
          if (!line.trim().match(/^\|(-+\|)+$/)) {
            insideTable = true;
            const cells = line.split("|").slice(1, -1);

            return (
              <div
                key={`${index}-${idx}`}
                className={insideTable ? "message-table-row" : "message-text"}
              >
                {cells.map((cell, cellIdx) => (
                  <span
                    key={cellIdx}
                    className="message-table-cell"
                    style={{
                      minWidth: maxWidths[cellIdx] * 8,
                    }}
                  >
                    {cell.trim()}
                  </span>
                ))}
              </div>
            );
          } else {
            // Ignore table separator row
            return null;
          }
        } else {
          if (insideTable) {
            insideTable = false;
            return (
              <React.Fragment key={`after-table-${index}-${idx}`}>
                <div className="message-text">{line}</div>
              </React.Fragment>
            );
          } else {
            return (
              <div key={`${index}-${idx}`} className="message-text">
                {line}
              </div>
            );
          }
        }
      });
    }
  });
};
  
    
  const handleModelSelect = async (modelId) => {
    // Call API to start a new conversation with a system prompt
    try {
      const response = await axios.post('http://localhost:5000/api/start_conversation', {
        model_id: modelId,
      });
      setSelectedModel(modelId);
      setConversationId(response.data.conversation_id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <div className="header-section">
        <h1>ZacGPT</h1>
        <ModelSelection
          onModelSelect={handleModelSelect}
          onNewConversation={handleNewConversation}
        />
      </div>
      <div className="app-content">
        <div className="monthly-summary">
          Total tokens this month: {monthlyData.monthlyTokens}&nbsp;&nbsp;|&nbsp;&nbsp;
          Total cost this month: ${monthlyData.monthlyCost.toFixed(2)}&nbsp;&nbsp;|&nbsp;&nbsp;
          Current conversation tokens: {currentData.currentTokens}&nbsp;&nbsp;|&nbsp;&nbsp;
          Current conversation cost: ${currentData.currentCost.toFixed(5)}
        </div>
        <div ref={chatContainerRef} className="chat-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <span className="message-time">
                {message.time}
                {message.role === 'assistant' && message.elapsedTime && ` - Response Time: ${message.elapsedTime}s`}
              </span>
              {parseMessage(message.content)}
            </div>
          ))}
          {fetchingResponse && (
            <div className={`message assistant`}>
              <div className="spinner-container">
                <div className="spinner"></div>
                <span className="ellipsis">...</span>
              </div>
              <span className="message-time">
                {responseStartTime &&
                  `Response Time: ${(currentResponseTime / 1000).toFixed(2)}s`}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="input-section">
        <ChatInput onSend={handleSubmit} />
      </div>
    </div>
  );
  
  
}

export default App;