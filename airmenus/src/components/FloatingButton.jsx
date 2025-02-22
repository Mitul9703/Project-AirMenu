import React from "react";

const FloatingButton = ({ onClick }) => {
    return (
        <button
            className="fixed bottom-6 right-6 bg-black text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:bg-gray-800 transition"
            onClick={onClick}
        >
            💬 {/* Chat Icon Placeholder */}
        </button>
    );
};

export default FloatingButton;
