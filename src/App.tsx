
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

type Message = {
  id: number;
  role: "user" | "bot";
  text: string;
  time: string;
};

const STORAGE_KEY = "mari-ai-chatbot";

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createMessage(
  role: Message["role"],
  text: string
): Message {
  return {
    id: Date.now() + Math.random(),
    role,
    text,
    time: getTime(),
  };
}

function getBotReply(input: string): string {
  const text = input.toLowerCase();

  if (/\b(hi|hello|hey|vanakkam)\b/.test(text)) {
    return "Hi! 👋 Welcome! என்னிடம் React, JavaScript, TypeScript அல்லது programming பற்றி கேட்கலாம்.";
  }

  if (text.includes("react")) {
    return "React என்பது user interfaces உருவாக்கப் பயன்படும் JavaScript library. Components, Props, State, Hooks ஆகியவை முக்கியமான concepts. 🚀";
  }

  if (text.includes("typescript")) {
    return "TypeScript என்பது JavaScript-க்கு static type checking சேர்க்கிறது. string, number, boolean, interface, type மற்றும் generics ஆகியவற்றைக் கற்றுக்கொள்.";
  }

  if (text.includes("javascript") || text.includes(" js")) {
    return "JavaScript மூலம் webpages-ஐ interactive ஆக்கலாம். Variables, functions, arrays, objects, DOM, promises மற்றும் async/await முதலில் கற்றுக்கொள்.";
  }

  if (text.includes("html")) {
    return "HTML webpage-ன் structure-ஐ உருவாக்குகிறது. Headings, paragraphs, links, images, forms மற்றும் semantic tags முக்கியமானவை.";
  }

  if (text.includes("css")) {
    return "CSS webpage-ஐ அழகாக வடிவமைக்க உதவுகிறது. Flexbox, Grid, responsive design, transitions மற்றும் media queries கற்றுக்கொள்.";
  }

  if (text.includes("python")) {
    return "Python ஒரு beginner-friendly programming language. Variables, conditions, loops, functions, lists, dictionaries மற்றும் projects மூலம் பயிற்சி செய்.";
  }

  if (text.includes("help")) {
    return "நான் உதவக்கூடிய topics: React ⚛️, JavaScript, TypeScript, HTML, CSS, Python மற்றும் coding projects. உனக்குத் தேவையான கேள்வியைத் தட்டச்சு செய்.";
  }

  if (text.includes("your name") || text.includes("who are you")) {
    return "நான் MiniBot 🤖 — இந்த React project-ல் உருவாக்கப்பட்ட demo chatbot!";
  }

  if (text.includes("thank")) {
    return "You're welcome! 😊 இன்னும் ஏதாவது coding help வேண்டுமென்றால் கேள்.";
  }

  return "நல்ல கேள்வி! 😊 நான் தற்போது சில predefined replies மட்டுமே கொடுக்கிறேன். உண்மையான AI பதில்களுக்கு backend வழியாக AI API இணைக்க வேண்டும்.";
}

function loadMessages(): Message[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const data: unknown = JSON.parse(saved);

      if (Array.isArray(data)) {
        return data as Message[];
      }
    }
  } catch {
    // Invalid saved data: start a fresh chat.
  }

  return [
    createMessage(
      "bot",
      "வணக்கம்! 👋 நான் MiniBot. React, TypeScript, coding பற்றி என்னிடம் கேளுங்கள்!"
    ),
  ];
}

function App() {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [dark, setDark] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();

    if (!text || typing) return;

    setMessages((previous) => [
      ...previous,
      createMessage("user", text),
    ]);

    setInput("");
    setTyping(true);

    // Demo reply, not a real AI API call.
    window.setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        createMessage("bot", getBotReply(text)),
      ]);

      setTyping(false);
    }, 700);
  }

  function clearChat() {
    const freshMessage = createMessage(
      "bot",
      "Chat cleared! 👋 புதிய உரையாடலைத் தொடங்கலாம்."
    );

    setMessages([freshMessage]);
    setInput("");
    setTyping(false);
  }

  const suggestions = [
    "What is React?",
    "Explain TypeScript",
    "Teach me Python",
  ];

  return (
    <div className={`app-shell ${dark ? "dark" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">🤖</span>
          <div>
            <h2>MiniBot</h2>
            <p>Your Coding Assistant</p>
          </div>
        </div>

        <div className="nav-item active">💬 &nbsp; Chat</div>
        <div className="nav-item">ℹ️ &nbsp; About</div>

        <button
          className="nav-item theme-button"
          onClick={() => setDark((previous) => !previous)}
          type="button"
        >
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <div className="sidebar-info">
          <span>✨ Demo Chatbot</span>
          <p>
            Predefined responses.
            <br />
            AI API not connected.
          </p>
        </div>

        <div className="sidebar-footer">
          ⚛️ React + TypeScript
          <br />
          <small>Version 1.0.0</small>
        </div>
      </aside>

      <main className="chat-panel">
        <header className="chat-header">
          <div className="header-title">
            <span className="bot-avatar">🤖</span>
            <div>
              <h1>Chat with MiniBot</h1>
              <p>Ask about coding and development</p>
            </div>
          </div>

          <button
            className="clear-button"
            onClick={clearChat}
            type="button"
            disabled={typing}
          >
            🗑️ <span>Clear Chat</span>
          </button>
        </header>

        <section className="messages" aria-live="polite">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-row ${message.role}`}
            >
              {message.role === "bot" && (
                <span className="message-avatar">🤖</span>
              )}

              <div className="message-content">
                <div className="bubble">{message.text}</div>
                <time className="message-time">
                  {message.time}
                </time>
              </div>

              {message.role === "user" && (
                <span className="message-avatar user-avatar">
                  👤
                </span>
              )}
            </div>
          ))}

          {typing && (
            <div className="message-row bot">
              <span className="message-avatar">🤖</span>
              <div className="bubble typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </section>

        <div className="composer-area">
          <div className="suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setInput(suggestion)}
                disabled={typing}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form className="composer" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              aria-label="Type your message"
              autoComplete="off"
              disabled={typing}
            />

            <button
              type="submit"
              disabled={!input.trim() || typing}
            >
              ➤ <span>Send</span>
            </button>
          </form>

          <p className="disclaimer">
            MiniBot demo · Replies are predefined, not AI-generated.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;