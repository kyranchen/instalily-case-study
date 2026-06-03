import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import { getAIMessage } from "../api/api";
import { marked } from "marked";
import ProductCard from "./ProductCard";

function ChatWindow() {
  const defaultMessage = [
    {
      role: "assistant",
      content:
        "Hi! I'm the PartSelect assistant. I can help with refrigerator and dishwasher parts — look up a specific part, check whether one fits your model, find a part by symptom, or walk through a repair. How can I help?",
      parts: [],
    },
  ];

  const [messages, setMessages] = useState(defaultMessage);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (text) => {
    if (text.trim() === "" || isSending) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, parts: [] },
    ]);
    setInput("");
    setIsSending(true);

    const newMessage = await getAIMessage(text);
    setMessages((prev) => [...prev, newMessage]);
    setIsSending(false);
  };

  return (
    <div className="messages-container">
      {messages.map((message, index) => (
        <div key={index} className={`${message.role}-message-container`}>
          {message.content && (
            <div className={`message ${message.role}-message`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: marked(message.content).replace(/<p>|<\/p>/g, ""),
                }}
              ></div>
              {message.parts && message.parts.length > 0 && (
                <div className="product-cards">
                  {message.parts.map((p) => (
                    <ProductCard key={p.part_number} part={p} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      {isSending && (
        <div className="assistant-message-container">
          <div className="message assistant-message typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a part, model number, or repair…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSend(input);
              e.preventDefault();
            }
          }}
          disabled={isSending}
        />
        <button
          className="send-button"
          onClick={() => handleSend(input)}
          disabled={isSending}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
