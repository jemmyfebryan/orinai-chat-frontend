import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { parseMarkdown } from '@/lib/markdown';
import { Send, LogOut, Bell, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  followUpQuestions?: string[];
}

interface UserData {
  user_id: string;
  devices: string[];
  api_token: string;
}

export default function Chat() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Halo, tanya aku apapun tentang device-mu! 🚗',
      timestamp: new Date(),
      followUpQuestions: [
        "Berapa total waktu kendaraan aktif dalam seminggu terakhir?",
        "Berapa estimasi jarak tempuh kendaraan dalam sebulan terakhir?",
        "Berapa biaya bahan bakar kendaraan minggu ini?",
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${encodeURIComponent(userId)}`);
        if (!response.ok) {
          throw new Error('User not found');
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('User not found. Please check your User ID.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !userId) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/chat_api', {  // http://216.244.94.213:8080/chat_api
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Token': userData?.api_token || ''
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const aiMessage: Message = {
        role: 'assistant',
        content: data.data.response,
        timestamp: new Date(),
        followUpQuestions: data.data.suggested_questions || []
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Failed to get a response. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleFollowUpClick = (question: string) => {
    if (isLoading) return;
    setInputMessage(question);
    // Auto-submit the follow-up question
    setTimeout(() => {
      const form = document.querySelector('#chat-form') as HTMLFormElement;
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600">Redirecting to homepage...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <img src="/orin_logo.png" alt="ORIN AI" className="w-20 object-contain" />
              {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-lg">🛰️</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">ORIN AI</h1> */}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">👤</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">ID: {userData.user_id}</h3>
              <p className="text-sm text-gray-600">{userData.devices.length} vehicle(s)</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Devices */}
        <div className="flex-1 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Your Vehicles:</h4>
          <div className="space-y-3">
            {userData.devices.map((device, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <p className="font-medium text-gray-900">{device}</p>
                  <Badge variant="secondary" className="mt-2">
                    Vehicle {index + 1}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Selamat datang di ORIN AI!
          </h2>
          <p className="text-gray-600 mt-1">The first GPS Tracker AI Agent in the world.</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <ScrollArea className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6 max-w-4xl">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user' ? 'bg-primary text-white' : 'bg-gray-200'
                        }`}>
                          {message.role === 'user' ? '👤' : '🤖'}
                        </div>
                        <div className={`rounded-2xl p-4 ${
                          message.role === 'user' 
                            ? 'bg-primary text-white ml-auto' 
                            : 'bg-white border border-gray-200'
                        }`}>
                          {message.role === 'user' ? (
                            <p className="text-white">{message.content}</p>
                          ) : (
                            <>
                              <div
                                className="prose prose-sm max-w-none text-gray-900"
                                dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
                              />
                              {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                  <p className="text-xs text-gray-500 mb-2">💡 Pertanyaan yang disarankan:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {message.followUpQuestions.map((question, qIndex) => (
                                      <button
                                        key={qIndex}
                                        onClick={() => handleFollowUpClick(question)}
                                        disabled={isLoading}
                                        className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full border border-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {question}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                          <p className={`text-xs mt-2 ${
                            message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        🤖
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl p-4 min-w-[200px]">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-gray-700 text-sm font-medium">🧠 Analyzing your vehicle question...</span>
                        </div>
                        <div className="mt-2 bg-orange-50 rounded-lg p-2">
                          <div className="w-full bg-orange-200 rounded-full h-1">
                            <div className="bg-primary h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Input */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-6">
          <form id="chat-form" onSubmit={handleSendMessage} className="flex space-x-4">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1 py-3 text-base border-2 border-gray-200 focus:border-primary transition-colors"
            />
            <Button 
              type="submit" 
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-primary hover:bg-primary/90"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
