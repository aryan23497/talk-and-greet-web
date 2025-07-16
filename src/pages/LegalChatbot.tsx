import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Send, Bot, User, Scale, BookOpen, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { indianKanoonService, LegalQuery } from "@/services/indianKanoonService";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  legalData?: {
    cases?: any[];
    statutes?: any[];
    summary?: string;
  };
  error?: string;
}

const LegalChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Indian Legal AI Assistant. I can help you with legal queries related to Indian law, including case law, statutes, and legal advice. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check API connection on component mount
    const checkApiConnection = async () => {
      try {
        const response = await indianKanoonService.healthCheck();
        setIsApiConnected(response.success);
      } catch (error) {
        setIsApiConnected(false);
      }
    };
    
    checkApiConnection();
  }, []);

  const formatLegalResponse = (legalData: any): string => {
    let response = "Based on Indian legal sources, here's what I found:\n\n";
    
    if (legalData.cases && legalData.cases.length > 0) {
      response += "📋 **Relevant Case Law:**\n";
      legalData.cases.forEach((caseItem: any, index: number) => {
        response += `${index + 1}. ${caseItem.title || caseItem.details?.title || 'Case Title'}\n`;
        response += `   Court: ${caseItem.docsource || caseItem.details?.docsource || 'Not specified'}\n`;
        response += `   Date: ${caseItem.publishdate || caseItem.details?.publishdate || 'Not specified'}\n`;
        if (caseItem.details?.content) {
          const summary = caseItem.details.content.substring(0, 200);
          response += `   Summary: ${summary}${summary.length === 200 ? '...' : ''}\n`;
        }
        response += "\n";
      });
    }

    if (legalData.statutes && legalData.statutes.length > 0) {
      response += "📜 **Relevant Statutes:**\n";
      legalData.statutes.forEach((statute: any, index: number) => {
        response += `${index + 1}. ${statute.title || 'Statute Title'}\n`;
        response += `   Section: ${statute.section || 'Not specified'}\n`;
        if (statute.description) {
          response += `   Description: ${statute.description.substring(0, 200)}...\n`;
        }
        response += "\n";
      });
    }

    if (legalData.totalFound) {
      response += `📊 **Total Results Found:** ${legalData.totalFound}\n\n`;
    }

    response += "⚠️ **Disclaimer:** This information is for educational purposes only. Please consult with a qualified legal professional for specific legal advice.";
    
    return response;
  };

  // Section summaries for common legal sections
  const sectionSummaries: Record<string, string> = {
    '125': 'Section 125 of the Code of Criminal Procedure, 1973 provides for maintenance of wives, children, and parents who are unable to maintain themselves.',
    '13': 'Section 13 of the Hindu Marriage Act, 1955 lays down the grounds for divorce, such as cruelty, adultery, desertion, etc.',
    '13B': 'Section 13B of the Hindu Marriage Act, 1955 provides for divorce by mutual consent.'
    // Add more as needed
  };

  // Helper to detect broad queries and return clarifying question if needed
  const getClarifyingQuestion = (query: string): string | null => {
    const broadQueries = [
      'divorce', 'maintenance', 'marriage', 'custody', 'property', 'inheritance', 'dowry', 'alimony'
    ];
    for (const broad of broadQueries) {
      if (query.toLowerCase().trim() === broad) {
        if (broad === 'divorce') {
          return 'Can you specify the grounds for divorce? (e.g., mutual consent, cruelty, adultery, desertion, etc.)';
        }
        if (broad === 'maintenance') {
          return 'Are you seeking maintenance for wife, children, or parents?';
        }
        // Add more clarifying questions as needed
        return `Can you provide more details about your query on ${broad}?`;
      }
    }
    return null;
  };

  // Helper: Extract bullet points from legal text using simple heuristics
  const extractKeyPoints = (text: string): string[] => {
    if (!text) return [];
    // Split into sentences and filter those with numbers or keywords
    const keywords = [
      'imprisonment', 'punishment', 'fine', 'years', 'months', 'life', 'death', 'offence', 'offense', 'under section', 'shall be', 'liable', 'minimum', 'maximum', 'not less than', 'not more than', 'whoever', 'if', 'provided that', 'court may', 'court shall'
    ];
    return text
      .split(/(?<=[.!?])\s+/)
      .filter(sentence =>
        /\d/.test(sentence) || keywords.some(kw => sentence.toLowerCase().includes(kw))
      )
      .map(sentence => sentence.trim())
      .slice(0, 6); // Limit to 6 key points for brevity
  };

  // Helper: Strip HTML tags from a string
  const stripHtml = (html: string): string => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Check for clarifying question
    const clarifying = getClarifyingQuestion(userMessage.text);
    if (clarifying) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: clarifying,
          sender: 'bot',
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 800);
      return;
    }

    try {
      const legalQuery: LegalQuery = {
        query: userMessage.text,
        context: "Indian legal system"
      };

      const response = await indianKanoonService.getLegalAdvice(legalQuery);

      if (response.success && response.data) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: formatLegalResponse(response.data),
          sender: 'bot',
          timestamp: new Date(),
          legalData: response.data
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `I apologize, but I encountered an issue while searching for legal information: ${response.error}. Please try rephrasing your question or check if your API token is valid.`,
          sender: 'bot',
          timestamp: new Date(),
          error: response.error
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I encountered an unexpected error. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderLegalData = (legalData: any) => {
    if (!legalData) return null;

    // Helper to build IndianKanoon case/section URLs
    const getCaseUrl = (tid: string | number) => `https://indiankanoon.org/doc/${tid}/`;
    const getSectionUrl = (section: string) => `https://indiankanoon.org/search/?formInput=section+${section}`;

    return (
      <div className="mt-4 space-y-4">
        {legalData.cases && legalData.cases.length > 0 && (
          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Scale className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm">Relevant Cases</h4>
              </div>
              <div className="space-y-2">
                {legalData.cases.map((caseItem: any, index: number) => {
                  // Use the 'doc' field (HTML) if available, else fallback to content
                  const rawHtml = caseItem.details?.doc || caseItem.details?.content || '';
                  const plainText = stripHtml(rawHtml);
                  const keyPoints = extractKeyPoints(plainText);
                  return (
                    <a
                      key={index}
                      href={getCaseUrl(caseItem.tid || caseItem.details?.tid)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition"
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm underline text-primary">
                            {caseItem.title || caseItem.details?.title || 'Case Title'}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {caseItem.docsource || caseItem.details?.docsource || 'Court'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {caseItem.publishdate || caseItem.details?.publishdate || 'Date'}
                            </Badge>
                          </div>
                          {keyPoints.length > 0 && (
                            <ul className="text-xs text-muted-foreground mt-2 list-disc list-inside space-y-1">
                              {keyPoints.map((point, i) => (
                                <li key={i}>{point}</li>
                              ))}
                            </ul>
                          )}
                          {/* Debug: Show raw content for diagnosis */}
                          {process.env.NODE_ENV === 'development' && rawHtml && (
                            <details className="text-xs text-muted-foreground mt-2">
                              <summary>Raw Content (debug)</summary>
                              <pre style={{ whiteSpace: 'pre-wrap' }}>{rawHtml.substring(0, 500)}</pre>
                            </details>
                          )}
                          {/* Fallback: Always show first 2 lines if no key points */}
                          {plainText && keyPoints.length === 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {plainText.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
        {/* Statutes/Sections with summaries and links */}
        {legalData.statutes && legalData.statutes.length > 0 && (
          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm">Relevant Statutes</h4>
              </div>
              <div className="space-y-2">
                {legalData.statutes.map((statute: any, index: number) => (
                  <a
                    key={index}
                    href={getSectionUrl(statute.section)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition"
                    style={{ textDecoration: 'none' }}
                  >
                    <p className="font-medium text-sm underline text-primary">
                      {statute.title || 'Statute Title'}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      Section {statute.section || 'N/A'}
                    </Badge>
                    {sectionSummaries[statute.section] && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {sectionSummaries[statute.section]}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/20 px-6 py-4 bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Indian Legal AI</h1>
                        <p className="text-sm text-muted-foreground">
          {isApiConnected ? 'Connected to IndianKanoon' : 'API Server Required'}
        </p>
              </div>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${isApiConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
        </div>
      </header>

      {/* API Status */}
      {isApiConnected ? (
        <div className="px-6 py-4 bg-green-50 border-b border-green-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 p-4 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  IndianKanoon API Connected
                </p>
                <p className="text-xs text-green-700">
                  Ready to provide Indian legal information and advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 p-4 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  API Server Not Connected
                </p>
                <p className="text-xs text-yellow-700">
                  Please start the IndianKanoon API server to use this feature.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-gradient-primary text-primary-foreground'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Scale className="w-4 h-4" />
                )}
              </div>
              <div className={`max-w-[70%] ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border/20 text-card-foreground'
                }`}>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</div>
                  {message.legalData && renderLegalData(message.legalData)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-card border border-border/20 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Searching legal databases...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border/20 px-6 py-4 bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about Indian law, cases, or statutes..."
              className="flex-1 bg-background border-border/20 focus:ring-primary/20"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
                     <div className="flex items-center justify-between mt-2">
             <p className="text-xs text-muted-foreground">
               Powered by IndianKanoon API • Legal information for educational purposes only
             </p>
             <div className="flex items-center space-x-1">
               {isApiConnected ? (
                 <>
                   <CheckCircle className="w-3 h-3 text-green-500" />
                   <span className="text-xs text-green-600">API Connected</span>
                 </>
               ) : (
                 <>
                   <AlertCircle className="w-3 h-3 text-yellow-500" />
                   <span className="text-xs text-yellow-600">API Disconnected</span>
                 </>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LegalChatbot; 