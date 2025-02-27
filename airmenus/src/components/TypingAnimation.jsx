import React from "react";

const TypingAnimation = () => {
    return (
        <div className="flex items-center space-x-2">
            <img src="/icons/bot-icon.svg" className="w-8 h-8 border border-gray-300 rounded-full" />
            <div className="p-2 text-base text-gray-400">
                <div className="flex">
                    {'Thinking for you...'.split('').map((char, index) => (
                        <span
                            key={index}
                            className="animate-pulse-sequence"
                            style={{
                                animationDelay: `${index * 0.05}s`,
                                display: 'inline-block',
                                marginRight: char === ' ' ? '0.25em' : '0'
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TypingAnimation; 