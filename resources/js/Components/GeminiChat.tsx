import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Product {
    name: string;
    price: number;
    sales_price?: number;
    images: string[];

}

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface GeminiChatProps {
    products: Product[];
}

export default function GeminiChat({ products }: GeminiChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    
    const chatEndRef = useRef<HTMLDivElement>(null);
    // Auto-scroll to the latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading, isOpen]); 

    // Send message to Gemini
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt) return;

        const newMessages: Message[] = [...messages, { role: 'user', text: prompt }];
        setMessages(newMessages);
        setPrompt('');
        setLoading(true);

        try {
            
            const res = await axios.post('/ask-gemini', { 
                prompt: prompt,
                history: messages.slice(-6),
            });
            
            if (res.data.success) {
                setMessages([...newMessages, { role: 'model', text: res.data.data }]);
            }
        } catch (error: any) {
            console.error("Error communicating with backend:", error);
            const errorMessage = error.response?.data?.error || "Sorry, something went wrong.";
            setMessages([...newMessages, { role: 'model', text: errorMessage }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
            
            {isOpen && (
                <div className="flex flex-col w-[280px] sm:w-[360px] h-[55vh] sm:h-[600px] mb-4 border border-red-200 rounded-xl shadow-xl bg-white">
                    
                    {/* Header with Close Button */}
                    <div className="p-2 px-3 md:p-4 border-b border-red-50 bg-red-200 rounded-t-xl flex justify-between items-center">
                        <h2 className="text-base md:text-xl font-bold text-gray-800">Ask Rachel</h2>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-gray-600 hover:text-black font-bold text-base md:text-xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                    
                    {/* Chat History Window */}
                    <div className="flex-1 p-2 md:p-4 overflow-y-auto bg-white space-y-2 md:space-y-4 text-xs md:text-base">
                        {messages.length === 0 && (
                            <p className="text-gray-400 text-center mt-2 md:mt-4">
                                Hi! I'm Rachel. What are we shopping for today?
                            </p>
                        )}
                        
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-1.5 px-2.5 md:p-3 max-w-[85%] rounded-2xl ${
                                    msg.role === 'user' 
                                    ? 'bg-black text-white' 
                                    : 'bg-white border border-red-50 shadow-sm text-gray-800 prose prose-sm'
                                }`}>
                                    {msg.role === 'model' ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                img: ({ src, alt }) => (
                                                    <img
                                                        src={src}
                                                        alt={alt ?? ''}
                                                        className="mt-2 w-full max-w-[220px] rounded-lg object-cover"
                                                    />
                                                ),
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {loading && (
                            <div className="flex justify-start">
                                <div className="p-2 md:p-3 bg-white border border-red-50 shadow-sm text-gray-500 rounded-2xl">
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Form */}
                    <div className="p-2 md:p-4 border-t border-red-50 bg-white rounded-b-xl">
    <form onSubmit={handleSubmit} className="flex gap-1 md:gap-2 text-[13px] md:text-base">
        <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
className="flex-1 p-1 px-2 md:p-3 border border-red-50 rounded-lg outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-200 text-xs md:text-base placeholder:text-xs md:placeholder:text-base"            placeholder="Type a message..."
            disabled={loading}
        />
        <button 
            type="submit" 
            disabled={loading || !prompt.trim()}
            className="px-2.5 py-1 md:px-6 md:py-3 bg-black text-white font-medium rounded-lg disabled:bg-gray-400 hover:bg-gray-800"
        >
            Send
        </button>
    </form>
</div>
                </div>
            )}

            {/* Floating Icon Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-10 h-10 md:w-14 md:h-14 bg-red-300 rounded-full shadow-lg"
                >
                    <span className="text-3xl"><img 
                        src="/robotics.png" 
                        alt="ChatBot Icon" 
                        className="w-full h-full object-contain p-1.5 md:p-2" 
                    /></span>
                </button>
            )}
        </div>
    );
}
