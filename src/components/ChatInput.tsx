import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useConversation } from '@11labs/react'
import './ChatInput.css'

interface ChatHistory {
  role: string
  content: string
}

const ChatInput = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [chatModal, setChatModal] = useState(true)
  const [input, setInput] = useState('')
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Memoize the conversation configuration
  const conversationConfig = useMemo(() => ({
    onConnect: () => {
      console.log('Connected to ElevenLabs agent')
      setError(null)
    },
    
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs agent')
    },
    
    onMessage: (message: { 
      type?: string
      text?: string
      source?: string
      message?: string
      isFinal?: boolean
      [key: string]: unknown 
    }) => {
      console.log('Message received:', message)
      
      if (message.source && message.message) {
        const newMessage = {
          role: message.source === 'ai' ? 'ai' : 'user',
          content: message.message
        }
        
        setChatHistory(prev => [...prev, newMessage])
        setChatModal(true)
      }
      
      else if (message.type === 'agent_response' || message.type === 'transcription') {
        const newMessage = {
          role: message.type === 'agent_response' ? 'ai' : 'user',
          content: message.text || ''
        }
        
        setChatHistory(prev => [...prev, newMessage])
        setChatModal(true)
      }
    },
    
    onError: (err: any) => {
      console.error('Error during conversation:', err)
      setError(`Voice chat error: ${err.message || 'Unknown error'}`)
      setIsVoiceActive(false)
    }   
  }), [])

  const conversation = useConversation(conversationConfig)

  const { status } = conversation

  // Memoize the scroll to bottom effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }, [])

  const handleErasure = useCallback(() => {
    setChatHistory([])
    setChatModal(false)
    setInput('')
    if (isVoiceActive) {
      conversation.endSession()
      setIsVoiceActive(false)
    }
  }, [isVoiceActive, conversation])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (input === '') return
      setChatModal(true)
      setChatHistory(prev => [...prev, { role: 'user', content: input }])
      setInput('')
    }
  }, [input])

  const toggleVoiceChat = useCallback(async () => {
    if (!isVoiceActive) {
      try {
        const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID
        if (!agentId) {
          throw new Error('ElevenLabs Agent ID not found in environment variables')
        }
        
        // Request microphone permission explicitly
        await navigator.mediaDevices.getUserMedia({ audio: true })
        
        const dynamicVariables = {
          nome_utente: 'Utente',
          cliente_ecommerce: 'no',
          acquisti_recenti: 'nessuno',
          cliente_viaggi: 'no',
          cliente_giochi: 'no',
          giochi_preferiti: 'nessuno',
          ultima_visita: 'prima volta',
          cliente_finanza: 'no'
        }
        
        console.log('Starting session with dynamic variables:', dynamicVariables)
        
        const conversationId = await conversation.startSession({ 
          agentId: agentId,
          dynamicVariables: dynamicVariables
        })
        
        console.log('Conversation started with ID:', conversationId)
        setIsVoiceActive(true)
        setChatModal(true)
        setError(null)
      } catch (err: unknown) {
        console.error('Error starting voice chat:', err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(`Failed to start voice chat: ${errorMessage}`)
        setIsVoiceActive(false)
      }
    } else {
      conversation.endSession()
      setIsVoiceActive(false)
      setTimeout(() => {
        if (!isVoiceActive) {
          setChatModal(false)
        }
      }, 2000)
    }
  }, [isVoiceActive, conversation])

  const toggleChatModal = useCallback(() => {
    setChatModal(prev => !prev)
  }, [])

  const dismissError = useCallback(() => {
    setError(null)
  }, [])

  // Memoize the chat history JSX to prevent recreation
  const chatHistoryJSX = useMemo(() => (
    chatHistory.map((chat, index) => {
      const chatBubbleClass = chat.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
      const alignmentClass = chat.role === 'user' ? 'flex justify-end' : 'flex justify-start'
      
      return (
        <div key={index} className={alignmentClass}>
          <div className={chatBubbleClass}>
            <span className={chat.role === 'user' ? 'chat-bubble-text-user' : 'chat-bubble-text-ai'}>
              {chat.content}
            </span>
          </div>
        </div>
      )
    })
  ), [chatHistory])

  // Memoize the voice button class
  const voiceButtonClass = useMemo(() => {
    if (isVoiceActive) return 'voice-button-active'
    if (status === 'connected') return 'voice-button-connected'
    return 'voice-button-default'
  }, [isVoiceActive, status])

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        {error && (
          <div className="chat-error">
            <p>{error}</p>
            <button onClick={dismissError}>
              Dismiss
            </button>
          </div>
        )}
        
        {chatHistory.length > 0 && chatModal && (
          <>
            <div className="chat-modal-close">
              <button className="chat-close-button" onClick={toggleChatModal}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50">
                  <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                </svg>
              </button>
            </div>
            <div 
              ref={chatContainerRef}
              className="chat-history-container"
            >
              {chatHistoryJSX}
            </div>
          </>
        )}
        <div className="chat-controls">
          <button 
            className="chat-expand-button"
            onClick={toggleChatModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Zoom-In-Map--Streamline-Rounded-Material" height="24" width="24">
              <path fill="#000000" d="m7.24995 17.8249 -3.150025 3.15c-0.15 0.15 -0.325 0.22085 -0.525 0.2125 -0.2 -0.00835 -0.375 -0.0875 -0.525 -0.2375 -0.15 -0.15 -0.225 -0.32915 -0.225 -0.5375 0 -0.20835 0.075 -0.3875 0.225 -0.5375l3.125025 -3.125H3.749925c-0.2125 0 -0.390585 -0.07235 -0.53425 -0.217 -0.143835 -0.1445 -0.21575 -0.32365 -0.21575 -0.5375 0 -0.21365 0.071915 -0.39135 0.21575 -0.533 0.143665 -0.14165 0.32175 -0.2125 0.53425 -0.2125h4.250025c0.2125 0 0.39065 0.07185 0.5345 0.2155 0.14365 0.14385 0.2155 0.322 0.2155 0.5345v4.25c0 0.2125 -0.07235 0.3906 -0.217 0.53425 -0.1445 0.14385 -0.3237 0.21575 -0.5375 0.21575 -0.2137 0 -0.39135 -0.0719 -0.533 -0.21575 -0.1417 -0.14365 -0.2125 -0.32175 -0.2125 -0.53425v-2.425Zm9.5 0v2.425c0 0.2125 -0.07235 0.3906 -0.217 0.53425 -0.1445 0.14385 -0.3237 0.21575 -0.5375 0.21575 -0.2137 0 -0.39135 -0.0719 -0.533 -0.21575 -0.1417 -0.14365 -0.2125 -0.32175 -0.2125 -0.53425v-4.25c0 -0.2125 0.0719 -0.39065 0.21575 -0.5345 0.14365 -0.14365 0.32175 -0.2155 0.53425 -0.2155h4.25c0.2125 0 0.39065 0.07235 0.5345 0.217 0.14365 0.1445 0.2155 0.32365 0.2155 0.5375 0 0.21365 -0.07185 0.39135 -0.2155 0.533 -0.14385 0.14165 -0.322 0.2125 -0.5345 0.2125h-2.425l3.15 3.15c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.3292 0.225 -0.5375 0.225 -0.20835 0 -0.38755 -0.075 -0.5375 -0.225l-3.15 -3.125Zm-10.575 -10.575 -3.150025 -3.15c-0.15 -0.15 -0.220835 -0.329165 -0.2125 -0.5375 0.008335 -0.20833 0.0875 -0.3875 0.2375 -0.5375 0.15 -0.15 0.329165 -0.225 0.5375 -0.225s0.3875 0.075 0.5375 0.225l3.125025 3.15v-2.425c0 -0.2125 0.0723 -0.390665 0.217 -0.5345 0.1445 -0.143665 0.32365 -0.2155 0.5375 -0.2155 0.21365 0 0.3913 0.071835 0.533 0.2155 0.14165 0.143835 0.2125 0.322 0.2125 0.5345v4.25c0 0.2125 -0.07185 0.3906 -0.2155 0.53425 -0.14385 0.14385 -0.322 0.21575 -0.5345 0.21575H3.749925c-0.2125 0 -0.390585 -0.07235 -0.53425 -0.217 -0.143835 -0.1445 -0.21575 -0.32365 -0.21575 -0.5375 0 -0.21365 0.071915 -0.39135 0.21575 -0.533 0.143665 -0.14165 0.32175 -0.2125 0.53425 -0.2125h2.425025Zm11.65 0h2.425c0.2125 0 0.39065 0.07235 0.5345 0.217 0.14365 0.1445 0.2155 0.32365 0.2155 0.5375 0 0.21365 -0.07185 0.39135 -0.2155 0.533 -0.14385 0.14165 -0.322 0.2125 -0.5345 0.2125h-4.25c-0.2125 0 -0.3906 -0.0719 -0.53425 -0.21575 -0.14385 -0.14365 -0.21575 -0.32175 -0.21575 -0.53425v-4.25c0 -0.2125 0.0723 -0.390665 0.217 -0.5345 0.1445 -0.143665 0.32365 -0.2155 0.5375 -0.2155 0.21365 0 0.3913 0.071835 0.533 0.2155 0.14165 0.143835 0.2125 0.322 0.2125 0.5345v2.425l3.17495 -3.175c0.15005 -0.15 0.3292 -0.225 0.53755 -0.225 0.2083 0 0.3875 0.075 0.5375 0.225 0.15 0.15 0.225 0.32917 0.225 0.5375 0 0.208335 -0.075 0.3875 -0.225 0.5375l-3.175 3.175Z" strokeWidth="0.5"></path>
            </svg>
          </button>

          <div className="chat-input-section">
            <input 
              type="text" 
              className="chat-text-input"
              placeholder="Try Something like..." 
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <div className="chat-input-controls">
              <button 
                className="chat-clear-button"
                onClick={handleErasure}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_8_5478" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                    <rect width="24" height="24" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_8_5478)">
                    <path d="M20 7L19.05 4.95L17 4L19.05 3.05L20 1L20.95 3.05L23 4L20.95 4.95L20 7ZM8.5 7L7.55 4.95L5.5 4L7.55 3.05L8.5 1L9.45 3.05L11.5 4L9.45 4.95L8.5 7ZM20 18.5L19.05 16.45L17 15.5L19.05 14.55L20 12.5L20.95 14.55L23 15.5L20.95 16.45L20 18.5ZM5.1 21.7L2.3 18.9C2.1 18.7 2 18.4583 2 18.175C2 17.8917 2.1 17.65 2.3 17.45L13.45 6.3C13.65 6.1 13.8917 6 14.175 6C14.4583 6 14.7 6.1 14.9 6.3L17.7 9.1C17.9 9.3 18 9.54167 18 9.825C18 10.1083 17.9 10.35 17.7 10.55L6.55 21.7C6.35 21.9 6.10833 22 5.825 22C5.54167 22 5.3 21.9 5.1 21.7ZM5.85 19.6L13 12.4L11.6 11L4.4 18.15L5.85 19.6Z" fill="#272727"/>
                  </g>
                </svg>
              </button>
            </div>
          </div>

          <button 
            className={`voice-button ${voiceButtonClass}`}
            onClick={toggleVoiceChat}
            disabled={status === 'connecting'}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_8_5482" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                  <rect width="32" height="32" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_8_5482)">
                  <path d="M6.6667 13.1333L5.46337 10.5367L2.8667 9.33335L5.46337 8.13001L6.6667 5.53335L7.87003 8.13001L10.4667 9.33335L7.87003 10.5367L6.6667 13.1333ZM24 9.13335L23.2292 7.43751L21.5334 6.66668L23.2292 5.89585L24 4.20001L24.7709 5.89585L26.4667 6.66668L24.7709 7.43751L24 9.13335ZM26.6667 14.4667L25.8959 12.7708L24.2 12L25.8959 11.2292L26.6667 9.53335L27.4375 11.2292L29.1334 12L27.4375 12.7708L26.6667 14.4667ZM16 19.8333C14.9445 19.8333 14.0473 19.4583 13.3084 18.7083C12.5695 17.9583 12.2 17.0556 12.2 16V8.13335C12.2 7.07779 12.5695 6.18057 13.3084 5.44168C14.0473 4.70279 14.9445 4.33335 16 4.33335C17.0556 4.33335 17.9528 4.70279 18.6917 5.44168C19.4306 6.18057 19.8 7.07779 19.8 8.13335V16C19.8 17.0556 19.4306 17.9583 18.6917 18.7083C17.9528 19.4583 17.0556 19.8333 16 19.8333ZM14.75 29.0667V24.9833C12.4945 24.6945 10.6278 23.6939 9.15003 21.9817C7.67226 20.2696 6.93337 18.2757 6.93337 16H9.43337C9.43337 17.8222 10.0736 19.3722 11.3541 20.65C12.6346 21.9278 14.1833 22.5667 16 22.5667C17.8168 22.5667 19.3655 21.9264 20.646 20.6459C21.9265 19.3654 22.5667 17.8168 22.5667 16H25.0667C25.0667 18.2778 24.3278 20.2722 22.85 21.9833C21.3723 23.6945 19.5056 24.6945 17.25 24.9833V29.0667H14.75ZM16 17.3333C16.3684 17.3333 16.6771 17.2056 16.9263 16.95C17.1755 16.6945 17.3 16.3778 17.3 16V8.14008C17.3 7.76892 17.1756 7.45835 16.9268 7.20835C16.678 6.95835 16.3696 6.83335 16.0018 6.83335C15.634 6.83335 15.325 6.95793 15.075 7.20711C14.825 7.45627 14.7 7.76501 14.7 8.13335V16C14.7 16.3778 14.8246 16.6945 15.0738 16.95C15.3229 17.2056 15.6317 17.3333 16 17.3333Z" fill="#272727"/>
                </g>
              </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
