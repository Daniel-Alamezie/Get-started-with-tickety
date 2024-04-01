import React, { useState, useEffect, useCallback } from 'react';
import { ticket } from '@/lib/ticketyInit'; // Ensure this is the correct path to your Tickety instance

interface Message {
  id: string;
  content: string;
  created_at: string;
  role: 'developer' | 'user'; // All senders have roles associated with them. You as the developer always have the developer role associated and the client sending messages from your software have the  user role. This is important if you want to style the message based on the sender's role
}

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const authToken = ('Auth_Token'); // Replace with your actual token. This is a jwt token used to verify users session on your application. This is used to get simple information about the user so when they send you a message you can see who has sent or raised a ticket in your dashboard.

  // Function to fetch messages
  const pollMessages = useCallback(async () => {
    try {
      const fetchedMessages = await ticket.fetchMessage(authToken);
      if (fetchedMessages.success) {
        setMessages(fetchedMessages.data);
      } else {
        console.error(fetchedMessages.error);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [authToken]);

  // Function to send a message
  const sendMessage = async () => {
    const response = await ticket.sendMessage(newMessage, authToken);
    if (response.success) {
      setNewMessage(''); // Clear input after sending
      pollMessages(); // Immediately poll for the latest messages after sending
    } else {
      console.error(response.error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(pollMessages, 5000); // Poll for new messages every 5 seconds
    return () => clearInterval(intervalId); // Clear the interval when the component unmounts
  }, [pollMessages]);

  return (
    <div className="container max-w-2xl p-4 mx-auto border rounded-lg shadow-lg">
      <div className="p-2 mb-4 space-y-4 overflow-y-auto messages h-96">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role === 'developer' ? 'text-left' : 'text-right'}`}>
            <p className="inline-block px-4 py-2 bg-gray-200 rounded-lg shadow">{message.content}</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-2 send-message">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={sendMessage}
          className="p-2 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;