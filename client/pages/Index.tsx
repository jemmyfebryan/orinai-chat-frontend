import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Index() {
  const [userId, setUserId] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/check_user_ids?q=${encodeURIComponent(userId)}`);
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      navigate(`/chat/${encodeURIComponent(userId.trim())}`);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setUserId(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-2xl">🛰️</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">ORIN AI</h1>
          </div>
          <p className="text-gray-600 text-lg">Your intelligent vehicle assistant</p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl text-gray-900">Welcome to ORIN AI</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your User ID to start chatting about your vehicles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter your User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="text-lg py-6 border-2 border-gray-200 focus:border-primary transition-colors"
                  autoComplete="off"
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectSuggestion(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-700">{suggestion}</span>
                          <Badge variant="secondary" className="text-xs">User</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 transform hover:scale-[1.02]"
                disabled={!userId.trim()}
              >
                Start Chat
              </Button>
            </form>

            {/* Quick Demo Users */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center mb-3">Quick demo users:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['41651', '41641', '41634', '41564'].map((demo) => (
                  <Badge 
                    key={demo}
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => selectSuggestion(demo)}
                  >
                    {demo}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-xl">⏱️</span>
            </div>
            <h3 className="font-semibold text-gray-900">Operational Time</h3>
            <p className="text-sm text-gray-600">Track total moving, idle, and engine-on durations</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-xl">🛣️</span>
            </div>
            <h3 className="font-semibold text-gray-900">Distance Estimation</h3>
            <p className="text-sm text-gray-600">Estimate distance traveled over time</p>
          </div>
        </div>

      </div>
    </div>
  );
}
