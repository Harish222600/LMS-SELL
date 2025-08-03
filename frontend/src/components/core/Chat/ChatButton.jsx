import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { BsChatDots } from 'react-icons/bs';
import { initiateChat } from '../../../services/operations/chatAPI';
import ChatWindow from './ChatWindow';

const ChatButton = ({ courseId, courseName, instructorName }) => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChatClick = async () => {
    if (!token || !user) {
      toast.error('Please login to chat with instructor');
      return;
    }

    if (user.accountType !== 'Student') {
      toast.error('Only students can initiate chats with instructors');
      return;
    }

    if (!courseId) {
      toast.error('Course information not available');
      return;
    }

    setIsLoading(true);
    
    try {
      const chatData = await initiateChat(courseId, token);
      if (chatData) {
        setCurrentChat(chatData);
        setIsChatOpen(true);
      }
    } catch (error) {
      console.error('Error initiating chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setCurrentChat(null);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={handleChatClick}
        disabled={isLoading}
        className={`
          flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform
          ${isLoading 
            ? 'bg-academic-slate-400 cursor-not-allowed opacity-60' 
            : 'btn-elegant hover:scale-105 hover:shadow-elegant'
          }
          border-2 border-academic-gold-300 hover:border-academic-gold-400
        `}
        title={`Chat with ${instructorName || 'Instructor'}`}
      >
        <BsChatDots size={20} className={isLoading ? 'text-academic-slate-600' : 'text-academic-navy-900'} />
        <span className="text-sm font-medium">
          {isLoading ? 'Starting Chat...' : 'Chat with Instructor'}
        </span>
        {isLoading && (
          <div className="w-4 h-4 border-2 border-academic-navy-900 border-t-transparent rounded-full animate-spin"></div>
        )}
      </button>

      {/* Chat Window Modal */}
      {isChatOpen && currentChat && (
        <ChatWindow
          chat={currentChat}
          onClose={handleCloseChat}
          courseName={courseName}
        />
      )}
    </>
  );
};

export default ChatButton;
