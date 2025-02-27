import React from "react";

const ChatTopBar = ({ onClose }) => (
    <div className="flex items-center justify-start space-x-4 px-4 py-3 mb-6 mt-4">
        <button className="text-3xl text-gray-600" onClick={onClose}>
            <img src='/icons/cross-icon.svg' className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold">DineAI</h2>
        <div className="w-6"></div>
    </div>
);

export default ChatTopBar; 