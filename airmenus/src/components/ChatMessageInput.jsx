// airmenus/src/components/MessageInput.jsx
import React from "react";
import ChatOptions from "./ChatOptions";
import { AppWindow, CookingPot, MessageCircleQuestion } from "lucide-react";

const ChatMessageInput = ({ input, setInput, handleSendMessage, isQuickReplyOpen, setIsQuickReplyOpen, inputRef }) => {
    return (
        <div className="flex items-center p-4 mb-4 relative">
            <div className="relative w-full flex items-center justify-between">
                <button className="mx-2 mr-4 relative" onClick={() => setIsQuickReplyOpen(!isQuickReplyOpen)}>
                    <img src='/icons/chat-options-icon.svg' className="w-8 h-8" />
                </button>

                {/* Quick Reply Pop-up */}
                {isQuickReplyOpen && (
                    <div className="absolute bottom-18 left-4 bg-white shadow-lg rounded-lg p-3 w-60">
                        <ChatOptions text="Curate a menu for me" icon={<AppWindow />} isHot={true} onClick={() => handleSendMessage("Curate a menu")} />
                        <ChatOptions text="Must try dishes" icon={<CookingPot />} onClick={() => handleSendMessage("Must try dishes")} />
                        <ChatOptions text="Ask me about a dish" icon={<MessageCircleQuestion />} onClick={() => handleSendMessage("Ask me about a dish")} />
                    </div>
                )}

                {/* Message Input */}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your message"
                    className="w-full p-3 border border-gray-300 focus:outline-none rounded-full pr-10"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2" onClick={() => handleSendMessage(input)}>
                    <img src='/icons/chat-send-icon.svg' className="w-7 h-7" />
                </button>
            </div>
        </div>
    );
};

export default ChatMessageInput;