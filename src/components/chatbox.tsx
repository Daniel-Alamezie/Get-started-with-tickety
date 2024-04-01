import React, { useState, useEffect, useCallback } from 'react';
import { ticket } from '@/lib/ticketyInit'; // Ensure this is the correct path to your Tickety instance

interface Message {
  id: string;
  content: string;
  created_at: string;
  role: 'developer' | 'user'; // Add other roles as needed
  // Include other properties as needed
}


const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const authToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6Im1aeVBmS1RGaDhJSXdLTVciLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzExNzUyMzg5LCJpYXQiOjE3MTE3NDg3ODksImlzcyI6Imh0dHBzOi8vb3V1ampud21raHV1am55a3l5dXcuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjY0MGFkMGQ1LTcwNGEtNGZlMS1hMThkLTMxMDE4OGNhYTM2OCIsImVtYWlsIjoiZGFuaWVsYWxhbWV6aWUzMDBAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJnaXRodWIiLCJwcm92aWRlcnMiOlsiZ2l0aHViIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvNzQ4ODA4NTc_dj00IiwiZW1haWwiOiJkYW5pZWxhbGFtZXppZTMwMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbSIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiRGFuaWVsLUFsYW1lemllIiwicHJvdmlkZXJfaWQiOiI3NDg4MDg1NyIsInN1YiI6Ijc0ODgwODU3IiwidXNlcl9uYW1lIjoiRGFuaWVsLUFsYW1lemllIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE3MTE3MDU5NDJ9XSwic2Vzc2lvbl9pZCI6IjYyNjdhY2IyLTBlZTktNDVkYS1hMmE5LTMxOGZjMDFhZmYwMiIsImlzX2Fub255bW91cyI6ZmFsc2V9.-DjxOdKZbrlDk-yD1UA5KE-9_HDA3eS5ESYJ97Cai24'; // Replace with your actual token

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
    // Poll for new messages after a delay
    setTimeout(pollMessages, 5000);
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
    pollMessages(); // Start polling when the component mounts
    return () => {
      // Cleanup: clear the timeout to stop polling when the component unmounts
      clearTimeout(pollMessages);
    };
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
