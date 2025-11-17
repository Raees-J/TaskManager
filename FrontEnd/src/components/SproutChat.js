import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FiX, FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ChatContainer = styled(motion.div)`
  position: fixed;
  bottom: 110px;
  right: 30px;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1001;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SproutAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const HeaderInfo = styled.div``;

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

const HeaderStatus = styled.div`
  font-size: 12px;
  opacity: 0.9;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
`;

const Message = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-start;
  flex-direction: ${(props) => (props.$isUser ? "row-reverse" : "row")};
`;

const MessageAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) =>
    props.$isUser
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "#e0e0e0"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
`;

const MessageBubble = styled.div`
  background: ${(props) => (props.$isUser ? "#667eea" : "white")};
  color: ${(props) => (props.$isUser ? "white" : "#000")};
  padding: 12px 16px;
  border-radius: 16px;
  max-width: 75%;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MessageText = styled.div`
  font-size: 14px;
  line-height: 1.5;
`;

const MessageTime = styled.div`
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
`;

const InputContainer = styled.div`
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 24px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #667eea;
  }
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 20px 16px;
  background: #f8f9fa;
`;

const QuickActionButton = styled.button`
  padding: 8px 16px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  font-size: 13px;
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
    background: #f0f4ff;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: white;
  border-radius: 16px;
  width: fit-content;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
  animation-delay: ${(props) => props.$delay}s;

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const SproutChat = ({ isOpen, onClose, projects = [], onTaskCreate, onProjectCreate, onRefreshProjects }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Sprout 🌱, your AI task assistant. I can help you manage tasks, find resources, or answer questions about your projects. What can I help you with today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    "What's due this week?",
    "Show my progress",
    "Find study resources",
    "Suggest a schedule",
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input; // Save input before clearing
    const userMessage = {
      id: Date.now(),
      text: userInput,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(userInput); // Use saved input
      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();

    // Task creation detection (check BEFORE project creation)
    if (
      (input.includes("create") || input.includes("add") || input.includes("make") || input.includes("new")) &&
      input.includes("task") &&
      (input.includes("in") || input.includes("for") || input.includes("inside") || input.includes("to"))
    ) {
      handleTaskCreation(userInput);
      return "Creating that task for you now! I'll add it to the specified project...";
    }

    // Project creation detection (only if NOT a task)
    if (
      (input.includes("create") || input.includes("make") || input.includes("start") || input.includes("new")) &&
      input.includes("project") &&
      !input.includes("task")
    ) {
      handleProjectCreation(userInput);
      return "Great! I'm creating that project for you now. I'll extract the details and set it up...";
    }

    // Task-related queries
    if (input.includes("due") || input.includes("deadline")) {
      return "Based on your current projects, you have several tasks coming up. Would you like me to create a prioritized list for you? I can also help you break down larger tasks into manageable steps.";
    }

    if (input.includes("progress") || input.includes("status")) {
      const totalProjects = projects.length;
      return `You currently have ${totalProjects} active project${
        totalProjects !== 1 ? "s" : ""
      }. Great work! Would you like me to show you detailed progress for any specific project?`;
    }

    if (input.includes("resource") || input.includes("help") || input.includes("study")) {
      return "I can help you find resources! What subject or topic are you working on? I can suggest study materials, tutorials, or relevant articles.";
    }

    if (input.includes("schedule") || input.includes("plan")) {
      return "I'd be happy to help you create a study schedule! To make it most effective, tell me: 1) What tasks do you need to complete? 2) When are they due? 3) How much time can you dedicate each day?";
    }

    // General task creation help
    if ((input.includes("create") || input.includes("add")) && input.includes("task") && !input.includes("in") && !input.includes("for")) {
      return "I can help you create a new task! Just tell me what you need to do and when it's due. For example: 'Create a task to finish my essay by Friday at 5pm' or 'Add a task in Project X called Review code'";
    }

    if (input.includes("motivat") || input.includes("stress") || input.includes("overwhelm")) {
      return "I understand that managing multiple tasks can feel overwhelming. Remember to break things down into smaller steps, take regular breaks, and celebrate small wins. You've got this! 💪 Would you like me to help prioritize your tasks?";
    }

    // Default helpful response
    return "I'm here to help! I can assist you with:\n\n• Creating and managing tasks\n• Finding study resources\n• Planning your schedule\n• Tracking your progress\n• Breaking down complex projects\n\nWhat would you like to work on?";
  };

  const handleQuickAction = (action) => {
    setInput(action);
    handleSend();
  };

  const handleTaskCreation = async (userInput) => {
    // Parse task details from natural language
    const taskDetails = parseTaskFromText(userInput);

    if (onTaskCreate) {
      try {
        await onTaskCreate(taskDetails);
        
        // Add success message
        setTimeout(() => {
          const projectName = projects.find(p => p._id === taskDetails.project)?.name || "your project";
          const successMessage = {
            id: Date.now() + 2,
            text: `✅ Task "${taskDetails.title}" has been created successfully in ${projectName}! ${
              taskDetails.dueDate
                ? `Due: ${new Date(taskDetails.dueDate).toLocaleDateString()}`
                : ""
            }`,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, successMessage]);
        }, 2000);
      } catch (error) {
        setTimeout(() => {
          const errorMessage = {
            id: Date.now() + 2,
            text: "I encountered an issue creating the task. Please try again or use the Quick Capture button.",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }, 2000);
      }
    }
  };

  const parseTaskFromText = (text) => {
    // Extract task title
    let taskTitle = text;
    
    // Remove common prefixes
    taskTitle = taskTitle.replace(/^(create|add|make|new)\s+(a\s+)?task\s+/i, "");
    
    // Extract project name
    let projectId = projects[0]?._id || null;
    const projectPatterns = [
      /(?:in|for|inside|to)\s+(?:project\s+)?["']?([^"']+?)["']?\s+(?:called|named|due|by|on)/i,
      /(?:in|for|inside|to)\s+(?:project\s+)?["']?([^"']+?)["']?$/i,
    ];

    for (const pattern of projectPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const projectName = match[1].trim();
        // Find project by name (case insensitive)
        const foundProject = projects.find(
          p => p.name.toLowerCase() === projectName.toLowerCase()
        );
        if (foundProject) {
          projectId = foundProject._id;
          // Remove project reference from title
          taskTitle = taskTitle.replace(pattern, "").trim();
        }
        break;
      }
    }

    // Extract task name after "called" or "named"
    const namePatterns = [
      /(?:called|named)\s+["']?([^"']+?)["']?\s+(?:in|for|due|by|on)/i,
      /(?:called|named)\s+["']?([^"']+?)["']?$/i,
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        taskTitle = match[1].trim();
        break;
      }
    }

    // Extract due date
    let dueDate = "";
    const datePatterns = [
      /due\s+(?:for|on|by)?\s*(\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)/i,
      /(?:by|on|for)\s+(?:the\s+)?(\d{1,2}\/\d{1,2}\/\d{2,4})/,
      /(?:by|on|for)\s+(tomorrow|next\s+week|next\s+month|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        dueDate = parseDateString(match[1]);
        // Remove date from title
        taskTitle = taskTitle.replace(match[0], "").trim();
        break;
      }
    }

    // Clean up title
    taskTitle = taskTitle.replace(/\s+/g, " ").trim();
    if (!taskTitle) {
      taskTitle = "New Task";
    }

    return {
      title: taskTitle,
      dueDate: dueDate || "",
      time: "23:59",
      project: projectId,
      status: "todo",
    };
  };

  const handleProjectCreation = async (userInput) => {
    // Parse project details from natural language
    const projectDetails = parseProjectFromText(userInput);

    if (onProjectCreate) {
      try {
        await onProjectCreate(projectDetails);
        
        // Refresh projects list immediately
        if (onRefreshProjects) {
          onRefreshProjects();
        }

        // Add success message
        setTimeout(() => {
          const successMessage = {
            id: Date.now() + 2,
            text: `✅ Project "${projectDetails.name}" has been created successfully! ${
              projectDetails.dueDate
                ? `Due date: ${new Date(projectDetails.dueDate).toLocaleDateString()}`
                : ""
            }. You can now start adding tasks to it!`,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, successMessage]);
        }, 2000);
      } catch (error) {
        setTimeout(() => {
          const errorMessage = {
            id: Date.now() + 2,
            text: "I encountered an issue creating the project. Please try again or create it manually from the Projects page.",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }, 2000);
      }
    }
  };

  const parseProjectFromText = (text) => {
    // Extract project name
    let projectName = "New Project";
    const namePatterns = [
      /(?:project|initiative)\s+(?:called|named)\s+["']?([^"']+)["']?/i,
      /(?:create|make|start)\s+(?:a|an)?\s*(?:project|initiative)?\s*["']?([^"']+)["']?/i,
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        projectName = match[1].trim();
        // Remove common trailing words
        projectName = projectName.replace(/\s+(project|initiative|due|for|by|on).*$/i, "").trim();
        break;
      }
    }

    // Extract due date
    let dueDate = "";
    const datePatterns = [
      /due\s+(?:for|on|by)?\s*(\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)/i,
      /(?:by|on|for)\s+(?:the\s+)?(\d{1,2}\/\d{1,2}\/\d{2,4})/,
      /(?:by|on|for)\s+(tomorrow|next\s+week|next\s+month)/i,
      /(\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)/i,
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        dueDate = parseDateString(match[1]);
        break;
      }
    }

    // Extract status
    let status = "Planning";
    if (text.match(/in\s+progress|started|ongoing/i)) {
      status = "In Progress";
    } else if (text.match(/completed|finished|done/i)) {
      status = "Completed";
    }

    return {
      name: projectName,
      status: status,
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Default 30 days
      collaborators: [],
    };
  };

  const parseDateString = (dateStr) => {
    const str = dateStr.toLowerCase();

    // Handle relative dates
    if (str.includes("tomorrow")) {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date.toISOString().split("T")[0];
    }
    if (str.includes("next week")) {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date.toISOString().split("T")[0];
    }
    if (str.includes("next month")) {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return date.toISOString().split("T")[0];
    }

    // Parse month names
    const months = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };

    for (const [monthName, monthIndex] of Object.entries(months)) {
      if (str.includes(monthName)) {
        const dayMatch = str.match(/(\d{1,2})/);
        if (dayMatch) {
          const day = parseInt(dayMatch[1]);
          const year = new Date().getFullYear();
          const date = new Date(year, monthIndex, day);
          return date.toISOString().split("T")[0];
        }
      }
    }

    // Try to parse as date
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }

    return "";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <ChatContainer
        initial={{ scale: 0, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <ChatHeader>
          <HeaderLeft>
            <SproutAvatar>🌱</SproutAvatar>
            <HeaderInfo>
              <HeaderTitle>Sprout AI</HeaderTitle>
              <HeaderStatus>● Online</HeaderStatus>
            </HeaderInfo>
          </HeaderLeft>
          <CloseButton onClick={onClose}>
            <FiX size={18} />
          </CloseButton>
        </ChatHeader>

        <MessagesContainer>
          {messages.map((message) => (
            <Message key={message.id} $isUser={message.isUser}>
              <MessageAvatar $isUser={message.isUser}>
                {message.isUser ? "👤" : "🌱"}
              </MessageAvatar>
              <div>
                <MessageBubble $isUser={message.isUser}>
                  <MessageText>{message.text}</MessageText>
                </MessageBubble>
                <MessageTime>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </MessageTime>
              </div>
            </Message>
          ))}

          {isTyping && (
            <Message $isUser={false}>
              <MessageAvatar>🌱</MessageAvatar>
              <TypingIndicator>
                <Dot $delay={0} />
                <Dot $delay={0.2} />
                <Dot $delay={0.4} />
              </TypingIndicator>
            </Message>
          )}

          <div ref={messagesEndRef} />
        </MessagesContainer>

        {messages.length === 1 && (
          <QuickActions>
            {quickActions.map((action, index) => (
              <QuickActionButton key={index} onClick={() => handleQuickAction(action)}>
                {action}
              </QuickActionButton>
            ))}
          </QuickActions>
        )}

        <InputContainer>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Sprout anything..."
          />
          <SendButton onClick={handleSend} disabled={!input.trim() || isTyping}>
            <FiSend size={18} />
          </SendButton>
        </InputContainer>
      </ChatContainer>
    </AnimatePresence>
  );
};

export default SproutChat;
