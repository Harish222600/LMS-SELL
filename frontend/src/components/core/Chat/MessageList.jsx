import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { IoPersonCircle, IoCheckmarkDone, IoCheckmark } from 'react-icons/io5';

const MessageList = ({ messages, currentUserId, messagesEndRef }) => {
  
  const formatMessageTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Just now';
    }
  };

  const isMessageRead = (message) => {
    return message.readBy?.some(read => read.user !== currentUserId);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-32 h-32 bg-gradient-to-br from-academic-gold-100 to-academic-navy-100 rounded-full flex items-center justify-center mb-6 shadow-elegant">
            <div className="text-6xl">💬</div>
          </div>
          <h3 className="elegant-heading text-2xl text-academic-navy-900 mb-3">No messages yet</h3>
          <p className="text-academic-slate-600">Start the conversation by sending a message!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => {
            const showAvatar = index === 0 || messages[index - 1].sender._id !== message.sender._id;
            const isSystemMessage = message.isSystemMessage;

            if (isSystemMessage) {
              return (
                <div key={message._id} className="flex justify-center my-4">
                  <div className="bg-academic-slate-100 text-academic-slate-600 px-4 py-2 rounded-full text-sm font-medium border border-academic-slate-200">
                    {message.content}
                  </div>
                </div>
              );
            }

            // More robust check for own message - handle both string and ObjectId comparisons
            const isOwnMessage = currentUserId && message.sender && (
              String(message.sender._id) === String(currentUserId) ||
              message.sender._id === currentUserId
            );
            
            return (
              <div key={message._id} className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} mb-4`}>
                {/* Avatar */}
                {showAvatar && (
                  <div className="flex-shrink-0 mb-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-academic-gold-100 to-academic-navy-100 flex items-center justify-center ring-2 ring-academic-slate-200 shadow-sm">
                      {message.sender.image ? (
                        <img
                          src={message.sender.image}
                          alt={`${message.sender.firstName} ${message.sender.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <IoPersonCircle size={40} className="text-academic-slate-400" />
                      )}
                    </div>
                  </div>
                )}
                
                {/* Message Content - Below Avatar */}
                <div className={`max-w-[75%] ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                  {/* Message Bubble */}
                  <div className={`inline-block px-4 py-3 rounded-2xl ${
                    isOwnMessage 
                      ? 'bg-gradient-to-r from-academic-navy-700 to-academic-navy-800 text-white rounded-br-md shadow-elegant' 
                      : 'bg-white border-2 border-academic-slate-200 text-academic-navy-900 rounded-bl-md shadow-sm hover:shadow-md transition-shadow duration-200'
                  }`}>
                    {/* Text Content */}
                    {message.content && message.content !== 'Image' && (
                      <div className="text-sm leading-relaxed font-medium">
                        {message.content}
                      </div>
                    )}
                    
                    {/* Image Message */}
                    {message.messageType === 'image' && message.imageUrl && (
                      <div className="mb-2">
                        <img
                          src={message.imageUrl}
                          alt="Shared image"
                          className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity border-2 border-academic-slate-200 shadow-sm"
                          onClick={() => window.open(message.imageUrl, '_blank')}
                          style={{ maxHeight: '300px', maxWidth: '250px' }}
                        />
                      </div>
                    )}
                    
                    {/* Message Time and Status */}
                    <div className={`flex items-center gap-2 mt-2 text-xs ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <span className={`font-medium ${isOwnMessage ? 'text-academic-slate-200' : 'text-academic-slate-500'}`}>
                        {formatMessageTime(message.createdAt)}
                      </span>
                      
                      {/* Read Status (only for own messages) */}
                      {isOwnMessage && (
                        <>
                          {isMessageRead(message) ? (
                            <IoCheckmarkDone size={14} className="text-academic-gold-300" title="Read" />
                          ) : (
                            <IoCheckmark size={14} className="text-academic-slate-300" title="Sent" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Sender Name (for received messages) */}
                  {!isOwnMessage && showAvatar && (
                    <div className="text-xs text-academic-slate-500 font-medium mt-1 ml-2">
                      {message.sender.firstName} {message.sender.lastName}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
