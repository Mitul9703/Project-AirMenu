import React from 'react';
import { ArrowRight, Flame } from "lucide-react";

const QuickReplyButton = ({ text, isHot, onClick }) => {
    return (
        <button
            className={`px-4 py-3 border rounded-lg text-sm font-medium flex justify-between items-center hover:bg-gray-100 transition ${isHot ? "border border-[#7A00D8]" : "border border-gray-300"}`}
            onClick={onClick}
        >
            {text}
            {isHot && (
                <span className="bg-purple-100 text-[#7A00D8] border border-[#7A00D8] text-xs font-semibold px-2 py-1 rounded-full ml-2">
                    HOT
                </span>
            )}
            <ArrowRight className="ml-2 w-5 h-5 text-gray-500" />
        </button>
    );
};

export default QuickReplyButton;