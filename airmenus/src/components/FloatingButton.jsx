import React from "react";

const FloatingButton = ({ onClick }) => {
    return (
        <button
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 hover:bg-gray-800 transition"
            onClick={onClick}
        >
            <img src="/icons/chat-icon.svg" alt="Chat" className="w-4 h-4" />
            <span className="text-sm font-medium">Chat with DineAI</span>
        </button>
    );
};

export default FloatingButton;
