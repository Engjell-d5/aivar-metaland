import { useState, useRef, useEffect } from "react";
import { useConversation } from "@11labs/react";

interface ChatHistory {
    role: string;
    content: string;
}

const ChatInput = () => {
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    const [chatModal, setChatModal] = useState(true);
    const [input, setInput] = useState("");
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const conversation = useConversation({
        onConnect: () => {
            console.log('Connected to ElevenLabs agent');
            setError(null);
        },
        
        onDisconnect: () => {
            console.log('Disconnected from ElevenLabs agent');
            setIsVoiceActive(false);
        },
        
        onMessage: (message: { type?: string; text?: string; source?: string; message?: string; isFinal?: boolean; [key: string]: unknown }) => {
            console.log('Message received:', message);
            
            if (message.source && message.message) {
                const newMessage = {
                    role: message.source === 'ai' ? 'ai' : 'user',
                    content: message.message
                };
                
                setChatHistory(prev => [...prev, newMessage]);
                setChatModal(true);
            }
            
            else if (message.type === 'agent_response' || message.type === 'transcription') {
                const newMessage = {
                    role: message.type === 'agent_response' ? 'ai' : 'user',
                    content: message.text || ''
                };
                
                setChatHistory(prev => [...prev, newMessage]);
                setChatModal(true);
            }
        },
        
        onError: (err: any) => {
            console.error('Error during conversation:', err);
            setError(`Voice chat error: ${err.message || 'Unknown error'}`);
            setIsVoiceActive(false);
        }   
    });

    const { status, isSpeaking } = conversation;

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }

    const handleErasure = () => {
        setChatHistory([]);
        setChatModal(false);
        setInput("");
        if (isVoiceActive) {
            conversation.endSession();
            setIsVoiceActive(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if(input == '') return;
            setChatModal(true);
            setChatHistory([...chatHistory, {role: "user", content: input}]);
            setInput("");
        }
    }

    const toggleVoiceChat = async () => {
        if (!isVoiceActive) {
            try {
                const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;
                if (!agentId) {
                    throw new Error('ElevenLabs Agent ID not found in environment variables');
                }
                
                await navigator.mediaDevices.getUserMedia({ audio: true });
                
                const dynamicVariables = {
                    nome_utente: 'Utente',
                    cliente_ecommerce: 'no',
                    acquisti_recenti: 'nessuno',
                    cliente_viaggi: 'no',
                    cliente_giochi: 'no',
                    giochi_preferiti: 'nessuno',
                    ultima_visita: 'prima volta',
                    cliente_finanza: 'no'
                };
                
                console.log('Starting session with dynamic variables:', dynamicVariables);
                
                const conversationId = await conversation.startSession({ 
                    agentId: agentId,
                    dynamicVariables: dynamicVariables
                });
                
                console.log('Conversation started with ID:', conversationId);
                setIsVoiceActive(true);
                setChatModal(true);
                setError(null);
            } catch (err: unknown) {
                console.error('Error starting voice chat:', err);
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(`Failed to start voice chat: ${errorMessage}`);
                setIsVoiceActive(false);
            }
        } else {
            conversation.endSession();
            setIsVoiceActive(false);
            setTimeout(() => {
                if (!isVoiceActive) {
                    setChatModal(false);
                }
            }, 2000);
        }
    };

    return (
        <div className="w-full sm:w-auto font-bold text-white text-4xl">
            <div className="w-full bg-[#5c5d5d]  sm:w-[682px] rounded-[80px] sm:rounded-[40px] p-4 flex flex-col gap-3">
                {error && (
                    <div className="bg-red-500 text-white p-2 rounded-lg mb-2 text-sm">
                        <p>{error}</p>
                        <button onClick={() => setError(null)} className="text-xs underline">Dismiss</button>
                    </div>
                )}
                
                {chatHistory.length > 0 && chatModal && (
                    <>
                        <div className="flex justify-end">
                            <button className="chat-close-button" onClick={() => setChatModal(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50">
                                    <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                                </svg>
                            </button>
                        </div>
                        <div 
                            ref={chatContainerRef}
                            className="max-h-130 overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-600"
                        >
                            {chatHistory.map((chat, index) => {
                                const chatBubbleClass = chat.role === "user" ? "chat-bubble-user" : "chat-bubble-ai";
                                const alignmentClass = chat.role === "user" ? "flex justify-end" : "flex justify-start";
                                return(
                                    <div key={index} className={alignmentClass}>
                                        <div className={chatBubbleClass}>
                                            <span 
                                                className={chat.role === "user" ? "chat-bubble-text-user" : "chat-bubble-text-ai"}
                                                style={{
                                                    fontFamily: 'Outfit',
                                                    fontWeight: 400,
                                                    fontSize: '16px',
                                                    lineHeight: '100%',
                                                    letterSpacing: '0%',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {chat.content}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                            {isSpeaking && (
                                <div className="flex justify-start">
                                    <div className="chat-bubble-ai">
                                        <span className="chat-bubble-text-ai">
                                            🎤 AI is speaking...
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
                <div className="flex justify-between items-center gap-2">
                    <button className="hidden sm:flex bg-white rounded-[28px] w-[56px] h-[56px] justify-center items-center" onClick={() => setChatModal(!chatModal)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Zoom-In-Map--Streamline-Rounded-Material" height="24" width="24">
                            <path fill="#000000" d="m7.24995 17.8249 -3.150025 3.15c-0.15 0.15 -0.325 0.22085 -0.525 0.2125 -0.2 -0.00835 -0.375 -0.0875 -0.525 -0.2375 -0.15 -0.15 -0.225 -0.32915 -0.225 -0.5375 0 -0.20835 0.075 -0.3875 0.225 -0.5375l3.125025 -3.125H3.749925c-0.2125 0 -0.390585 -0.07235 -0.53425 -0.217 -0.143835 -0.1445 -0.21575 -0.32365 -0.21575 -0.5375 0 -0.21365 0.071915 -0.39135 0.21575 -0.533 0.143665 -0.14165 0.32175 -0.2125 0.53425 -0.2125h4.250025c0.2125 0 0.39065 0.07185 0.5345 0.2155 0.14365 0.14385 0.2155 0.322 0.2155 0.5345v4.25c0 0.2125 -0.07235 0.3906 -0.217 0.53425 -0.1445 0.14385 -0.3237 0.21575 -0.5375 0.21575 -0.2137 0 -0.39135 -0.0719 -0.533 -0.21575 -0.1417 -0.14365 -0.2125 -0.32175 -0.2125 -0.53425v-2.425Zm9.5 0v2.425c0 0.2125 -0.07235 0.3906 -0.217 0.53425 -0.1445 0.14385 -0.3237 0.21575 -0.5375 0.21575 -0.2137 0 -0.39135 -0.0719 -0.533 -0.21575 -0.1417 -0.14365 -0.2125 -0.32175 -0.2125 -0.53425v-4.25c0 -0.2125 0.0719 -0.39065 0.21575 -0.5345 0.14365 -0.14365 0.32175 -0.2155 0.53425 -0.2155h4.25c0.2125 0 0.39065 0.07235 0.5345 0.217 0.14365 0.1445 0.2155 0.32365 0.2155 0.5375 0 0.21365 -0.07185 0.39135 -0.2155 0.533 -0.14385 0.14165 -0.322 0.2125 -0.5345 0.2125h-2.425l3.15 3.15c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.3292 0.225 -0.5375 0.225 -0.20835 0 -0.38755 -0.075 -0.5375 -0.225l-3.15 -3.125Zm-10.575 -10.575 -3.150025 -3.15c-0.15 -0.15 -0.220835 -0.329165 -0.2125 -0.5375 0.008335 -0.20833 0.0875 -0.3875 0.2375 -0.5375 0.15 -0.15 0.329165 -0.225 0.5375 -0.225s0.3875 0.075 0.5375 0.225l3.125025 3.15v-2.425c0 -0.2125 0.0723 -0.390665 0.217 -0.5345 0.1445 -0.143665 0.32365 -0.2155 0.5375 -0.2155 0.21365 0 0.3913 0.071835 0.533 0.2155 0.14165 0.143835 0.2125 0.322 0.2125 0.5345v4.25c0 0.2125 -0.07185 0.3906 -0.2155 0.53425 -0.14385 0.14385 -0.322 0.21575 -0.5345 0.21575H3.749925c-0.2125 0 -0.390585 -0.07235 -0.53425 -0.217 -0.143835 -0.1445 -0.21575 -0.32365 -0.21575 -0.5375 0 -0.21365 0.071915 -0.39135 0.21575 -0.533 0.143665 -0.14165 0.32175 -0.2125 0.53425 -0.2125h2.425025Zm11.65 0h2.425c0.2125 0 0.39065 0.07235 0.5345 0.217 0.14365 0.1445 0.2155 0.32365 0.2155 0.5375 0 0.21365 -0.07185 0.39135 -0.2155 0.533 -0.14385 0.14165 -0.322 0.2125 -0.5345 0.2125h-4.25c-0.2125 0 -0.3906 -0.0719 -0.53425 -0.21575 -0.14385 -0.14365 -0.21575 -0.32175 -0.21575 -0.53425v-4.25c0 -0.2125 0.0723 -0.390665 0.217 -0.5345 0.1445 -0.143665 0.32365 -0.2155 0.5375 -0.2155 0.21365 0 0.3913 0.071835 0.533 0.2155 0.14165 0.143835 0.2125 0.322 0.2125 0.5345v2.425l3.17495 -3.175c0.15005 -0.15 0.3292 -0.225 0.53755 -0.225 0.2083 0 0.3875 0.075 0.5375 0.225 0.15 0.15 0.225 0.32917 0.225 0.5375 0 0.208335 -0.075 0.3875 -0.225 0.5375l-3.175 3.175Z" strokeWidth="0.5"></path>
                        </svg>
                    </button>

                    <div className=" bg-white w-[100px] sm:w-[300px] flex flex-grow h-[56px] sm:bg-[#d6d7d6] rounded-[32px] sm:rounded-[28px] items-center px-1 gap-2">
                        <input 
                            type="text" 
                            className="px-3 flex-1 bg-transparent focus:outline-none text-black placeholder:font-bold placeholder:text-sm placeholder:text-[#141414]" 
                            style={{
                                fontFamily: 'Outfit',
                                fontWeight: 400,
                                fontSize: '16px',
                                lineHeight: '100%',
                                letterSpacing: '0%',
                            }}
                            placeholder="Try Something like..." 
                            value={input}
                            onChange={(e) => handleInputChange(e)}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="flex justify-end items-center">
                            <button className="hidden bg-white rounded-full w-[48px] h-[48px] sm:flex justify-center items-center shadow-lg" onClick={() => handleErasure()}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24">
                                <path fill="#000000" d="M7.5,5.6L5,7L6.4,4.5L5,2L7.5,3.4L10,2L8.6,4.5L10,7L7.5,5.6M19.5,15.4L22,14L20.6,16.5L22,19L19.5,17.6L17,19L18.4,16.5L17,14L19.5,15.4M22,2L20.6,4.5L22,7L19.5,5.6L17,7L18.4,4.5L17,2L19.5,3.4L22,2M13.34,12.78L15.78,10.34L13.66,8.22L11.22,10.66L13.34,12.78M14.37,7.29L16.71,9.63C17.1,10 17.1,10.65 16.71,11.04L5.04,22.71C4.65,23.1 4,23.1 3.63,22.71L1.29,20.37C0.9,20 0.9,19.35 1.29,18.96L12.96,7.29C13.35,6.9 14,6.9 14.37,7.29Z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <button 
                        className={`rounded-[28px] w-[56px] h-[56px] flex justify-center items-center transition-all duration-200 ${
                            isVoiceActive 
                                ? 'bg-red-500 animate-pulse' 
                                : status === 'connected' 
                                    ? 'bg-green-500' 
                                    : 'bg-white'
                        }`}
                        onClick={toggleVoiceChat}
                        disabled={status === 'connecting'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Ai-Spark-Microphone--Streamline-Outlined-Expansion" height="24" width="24">
                            <g id="ai-spark-microphone">
                                <path 
                                    id="Union" 
                                    fill={isVoiceActive || status === 'connected' ? "#ffffff" : "#000000"} 
                                    fillRule="evenodd" 
                                    d="M17 1.5c0 1.93296 -1.567 3.49991 -3.5 3.49991v2c1.933 0 3.5 1.56701 3.5 3.49999V10.5l1.0001 0 0.9999 0v-0.0001c0 -1.93298 1.567 -3.49999 3.5 -3.49999h0.0001v-2H22.5c-1.9329 0 -3.4999 -1.56695 -3.5 -3.49991h-2ZM5.875 14.125C6.45833 14.7083 7.16667 15 8 15c0.83333 0 1.54167 -0.2917 2.125 -0.875 0.5833 -0.5833 0.875 -1.2917 0.875 -2.125V6c0 -0.83333 -0.2917 -1.54167 -0.875 -2.125C9.54167 3.29167 8.83333 3 8 3c-0.83333 0 -1.54167 0.29167 -2.125 0.875C5.29167 4.45833 5 5.16667 5 6v6c0 0.8333 0.29167 1.5417 0.875 2.125ZM7 18.925V22h2v-3.075c1.7333 -0.2333 3.1667 -1.0083 4.3 -2.325 1.1333 -1.3167 1.7 -2.85 1.7 -4.6h-2c0 1.3833 -0.4875 2.5625 -1.4625 3.5375C10.5625 16.5125 9.38333 17 8 17s-2.5625 -0.4875 -3.5375 -1.4625C3.4875 14.5625 3 13.3833 3 12H1c0 1.75 0.56667 3.2833 1.7 4.6 1.13333 1.3167 2.56667 2.0917 4.3 2.325Zm1.7125 -6.2125C8.52083 12.9042 8.28333 13 8 13s-0.52083 -0.0958 -0.7125 -0.2875C7.09583 12.5208 7 12.2833 7 12V6c0 -0.28333 0.09583 -0.52083 0.2875 -0.7125C7.47917 5.09583 7.71667 5 8 5s0.52083 0.09583 0.7125 0.2875C8.90417 5.47917 9 5.71667 9 6v6c0 0.2833 -0.09583 0.5208 -0.2875 0.7125Z" 
                                    clipRule="evenodd" 
                                    strokeWidth="1"
                                />
                            </g>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput; 