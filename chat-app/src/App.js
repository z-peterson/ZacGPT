import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import ChatInput from "./ChatInput";
import ModelSelection from "./ModelSelection";
import "./registerLanguages";
import ChatMessage from "./ChatMessage";
import MonthlySummary from "./MonthlySummary";
import { getMonthlySummary, startConversation, chat } from "./api";

let costPerToken = 3e-5;

function App() {
  const [messages, setMessages] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState({
    monthlyTokens: 0,
    monthlyCost: 0,
  });
  const [currentSummary, setCurrentSummary] = useState({
    currentTokens: 0,
    currentCost: 0,
  });
  const [modelId, setModelId] = useState(null);
  const [conversationId, setConversationId] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const chatRef = useRef(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isMouseNearTop, setIsMouseNearTop] = useState(false);
  const headerRef = useRef(null);

  const scrollToBottom = () => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let tim
    if (isTyping) {
      timer = setInterval(() => {
        setElapsedTime(new Date() - responseTime);
      }, 100);
    } else {
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isTyping]);

  useEffect(() => {
    const fetchMonthlySummary = async () => {
      try {
        const data = await getMonthlySummary();
        setMonthlySummary(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMonthlySummary();
  }, []);

  const handleSendMessage = async (userInput) => {
    const messageTime = new Date().toLocaleTimeString("en-US");
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userInput, time: messageTime },
    ]);

    const startTime = new Date();
    setResponseTime(startTime);
    setIsTyping(true);

    try {
      const response = await chat({ userInput, modelId, conversationId });
      const endTime = new Date();
      const elapsedTime = ((endTime - startTime) / 1000).toFixed(2);

      setCurrentSummary({
        currentTokens: response.metadata.currentTokens,
        currentCost: costPerToken * response.metadata.currentTokens,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: response.response,
          time: endTime.toLocaleTimeString("en-US"),
          elapsedTime,
        },
      ]);

      setIsTyping(false);
    } catch (error) {
      console.error(error);
    }
  };

  const checkOrientation = () => {
    if (window.innerWidth > window.innerHeight) {
      setIsHeaderVisible(false);
    } else {
      setIsHeaderVisible(true);
    }
  };

  const handleMouseMove = (event) => {
    // Unhide header when the mouse is within 50px from the top of the screen
    if (event.clientY <= 50) {
      setIsMouseNearTop(true);
    } else {
      // Check if the mouse is within the header section using the headerRef's bounding rectangle
      const headerRect = headerRef.current.getBoundingClientRect();
      if (event.clientY > headerRect.bottom) {
        setIsMouseNearTop(false);
      }
    }
  };
  

  useEffect(() => {
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
  
    // Cleanup
    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  const handleNewConversation = async (prompt) => {
    setCurrentSummary({ currentTokens: 0, currentCost: 0 });
    setMessages([]);

    try {
      const data = await startConversation({ modelId, prompt });
      setConversationId(data.conversationId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleModelSelect = async (selectedModelId) => {
    try {
      const data = await startConversation({ modelId: selectedModelId });
      setModelId(selectedModelId);
      setConversationId(data.conversationId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
  
    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  

  return (
    <div className="App">
      <div
        ref={headerRef}
        className="header-section"
        style={{
          display: (isHeaderVisible || isMouseNearTop) ? "block" : "none",
        }}
>
        <h1>ZacGPT</h1>
        <ModelSelection
          onModelSelect={handleModelSelect}
          onNewConversation={handleNewConversation}
        />
      </div>
      <div className="app-content">
        <MonthlySummary
          monthlyTokens={monthlySummary.monthlyTokens}
          monthlyCost={monthlySummary.monthlyCost}
          currentTokens={currentSummary.currentTokens}
          currentCost={currentSummary.currentCost}
        />
        <div ref={chatRef} className="chat-container">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              messageRole={message.role}
              messageContent={message.content}
              time={message.time}
              elapsedTime={message.elapsedTime}
            />
          ))}
          {isTyping && <ChatMessage isTyping responseTime={elapsedTime / 1000} />}
        </div>
      </div>
      <div className="input-section">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}

export default App;
