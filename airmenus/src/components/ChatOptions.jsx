import React from 'react';
import { ArrowRight, Flame } from "lucide-react";

const ChatOptions = ({ text, isHot, icon, onClick }) => {
    return (
        <button
            className={`p-3 w-full text-md font-medium flex space-x-2 justify-start items-center hover:bg-gray-100 transition ${isHot ? "text-[#7A00D8]" : ""}`}
            onClick={onClick}
        >
            <div>

                {icon}
            </div>

            <div>

                {text}
            </div>

        </button>
    );
};

export default ChatOptions;
