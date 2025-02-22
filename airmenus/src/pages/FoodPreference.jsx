import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RESTAURANT_LOGO } from "../constants/logos";


const FoodPreference = () => {
    const [selectedOption, setSelectedOption] = useState("veg"); // Default selection
    const navigate = useNavigate();

    const options = [
        { id: "veg", label: "Veg", symbol: "⭕" },
        { id: "nonveg", label: "Non-Veg", symbol: "△" },
        { id: "egg", label: "Eggitarian", symbol: "⭕" },
    ];

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6 text-center">
            <img
                src={RESTAURANT_LOGO}
                alt="Food Icon"
                className="w-24 h-24 rounded-full mb-6"
            />
            <h1 className="text-2xl font-semibold mb-6">What are your food preferences?</h1>

            <div className="w-full max-w-xs space-y-4">
                {options.map((option) => (
                    <button
                        key={option.id}
                        className={`w-full flex items-center justify-center gap-4 p-4 border rounded-lg text-lg font-medium cursor-pointer transition-all ${selectedOption === option.id ? "bg-black text-white" : "bg-white text-black border-gray-300"
                            }`}
                        onClick={() => setSelectedOption(option.id)}
                    >
                        <span>{option.symbol}</span> {option.label}
                    </button>
                ))}
            </div>

            {/* Pass selected preference to Menu page */}
            <button
                className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition"
                onClick={() => navigate(`/menu?preference=${selectedOption}`)}
            >
                Next
            </button>
        </div>
    );
};

export default FoodPreference;
