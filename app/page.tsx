"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, Mic, MicOff, MessageSquare, Calendar, Clock, MapPin, User } from "lucide-react";

interface Message {
  role: "ai" | "user";
  content: string;
  timestamp: Date;
}

interface AppointmentData {
  name: string;
  age: string;
  problem: string;
  preferredTime: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "नमस्ते जी! मैं Lumivian Clinic से बोल रही हूं। आप कैसे हैं जी?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    name: "",
    age: "",
    problem: "",
    preferredTime: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clinicInfo = {
    name: "Lumivian Clinic",
    doctor: "Dr. Rajesh Sharma",
    timing: "सुबह 9:00 बजे से शाम 7:00 बजे तक (सोमवार से शनिवार)",
    address: "123, Main Market, New Delhi - 110001",
    services: ["बाल झड़ना", "त्वचा की समस्याएं", "दर्द का इलाज", "सामान्य परामर्श"],
    fees: "₹500 पहली विज़िट के लिए",
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // FAQ responses
    if (lowerMessage.includes("timing") || lowerMessage.includes("समय") || lowerMessage.includes("खुला")) {
      return `हमारे clinic का समय ${clinicInfo.timing} है जी। आपको कब का appointment चाहिए?`;
    }
    if (lowerMessage.includes("doctor") || lowerMessage.includes("डॉक्टर")) {
      return `यहां ${clinicInfo.doctor} जी देखते हैं। वो बहुत experienced हैं जी। आपकी क्या समस्या है?`;
    }
    if (lowerMessage.includes("fees") || lowerMessage.includes("फीस") || lowerMessage.includes("खर्चा")) {
      return `पहली visit के लिए ${clinicInfo.fees} है जी। आपका नाम और समस्या बताइए?`;
    }
    if (lowerMessage.includes("address") || lowerMessage.includes("पता") || lowerMessage.includes("कहां")) {
      return `Clinic का address है: ${clinicInfo.address}। Location WhatsApp पर भी भेज दूंगी जी।`;
    }

    // Conversation flow
    if (conversationStep === 0) {
      if (lowerMessage.includes("ठीक") || lowerMessage.includes("अच्छा") || lowerMessage.includes("good")) {
        setConversationStep(1);
        return "बहुत अच्छा जी! मैं आपका appointment book करना चाहती हूं। पहले आप अपना नाम बताइए जी?";
      }
      return "कोई बात नहीं जी। मैं आपकी मदद कर सकती हूं। आप appointment लेना चाहते हैं?";
    }

    if (conversationStep === 1 && !appointmentData.name) {
      setAppointmentData((prev) => ({ ...prev, name: userMessage }));
      setConversationStep(2);
      return `धन्यवाद ${userMessage} जी! आपकी उम्र क्या है?`;
    }

    if (conversationStep === 2 && !appointmentData.age) {
      setAppointmentData((prev) => ({ ...prev, age: userMessage }));
      setConversationStep(3);
      return "जी बिल्कुल, मैं नोट कर लेती हूं। अब बताइए आपको क्या समस्या है? जैसे बाल झड़ना, त्वचा की problem, या कोई दर्द?";
    }

    if (conversationStep === 3 && !appointmentData.problem) {
      setAppointmentData((prev) => ({ ...prev, problem: userMessage }));
      setConversationStep(4);
      return "समझ गई जी। आपको कब का appointment चाहिए? कौन सा दिन और समय सही रहेगा? (जैसे: कल सुबह 10 बजे, या इस हफ्ते शाम को)";
    }

    if (conversationStep === 4 && !appointmentData.preferredTime) {
      setAppointmentData((prev) => ({ ...prev, preferredTime: userMessage }));
      setConversationStep(5);
      return `परफेक्ट जी! आपका appointment ${userMessage} के लिए confirm कर दिया गया है। ✅\n\nClinic का address और timing WhatsApp/SMS पर भेज दिया जाएगा। ${appointmentData.name} जी, appointment से 10 मिनट पहले पहुंच जाइएगा।\n\nक्या कोई और सवाल है आपका?`;
    }

    if (conversationStep === 5) {
      if (lowerMessage.includes("नहीं") || lowerMessage.includes("no") || lowerMessage.includes("bas")) {
        return "बहुत अच्छा जी! आपको Lumivian Clinic में देखने का इंतजार रहेगा। धन्यवाद और अच्छा दिन रहे! 🙏";
      }
      return "जी बताइए, मैं आपकी और कैसे मदद कर सकती हूं?";
    }

    return "जी, मैं आपकी बात समझ गई। कृपया थोड़ा और बताइए?";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse = getAIResponse(inputValue);
      const aiMessage: Message = {
        role: "ai",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 800);

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        alert("Voice input simulation - मैसेज टाइप करें");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-blue-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-3 rounded-full">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Lumivian Clinic</h1>
                <p className="text-sm text-gray-600">AI Calling Agent - Professional Appointment System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clinic Info Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                Clinic Information
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <User className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-700">Doctor</p>
                    <p className="text-gray-600">{clinicInfo.doctor}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-700">Timing</p>
                    <p className="text-gray-600">{clinicInfo.timing}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-700">Address</p>
                    <p className="text-gray-600">{clinicInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-700">Consultation Fees</p>
                    <p className="text-gray-600">{clinicInfo.fees}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Services</h3>
              <ul className="space-y-2">
                {clinicInfo.services.map((service, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {appointmentData.name && (
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Current Appointment
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {appointmentData.name}</p>
                  {appointmentData.age && <p><strong>Age:</strong> {appointmentData.age}</p>}
                  {appointmentData.problem && <p><strong>Problem:</strong> {appointmentData.problem}</p>}
                  {appointmentData.preferredTime && <p><strong>Time:</strong> {appointmentData.preferredTime}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">AI Receptionist</h2>
                      <p className="text-sm text-blue-100">Lumivian Clinic Assistant</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Active</span>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="h-[500px] overflow-y-auto p-6 bg-gray-50 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-md ${
                        message.role === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-gray-400"}`}>
                        {message.timestamp.toLocaleTimeString("hi-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleListening}
                    className={`p-3 rounded-full transition-all ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="अपना message टाइप करें..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-md"
                  >
                    भेजें
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Professional AI agent powered by Lumivian Clinic
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
