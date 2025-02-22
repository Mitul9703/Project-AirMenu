import React from "react";

const Button = ({ text, onClick }) => {
    return (
        <button
            className="bg-black text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-800 transition"
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button;
