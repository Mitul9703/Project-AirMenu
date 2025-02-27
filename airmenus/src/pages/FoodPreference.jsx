import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Info } from "lucide-react";

const FoodPreference = () => {
    const [selectedOption, setSelectedOption] = useState(null); // Default: No selection
    const navigate = useNavigate();

    const options = [
        { id: "veg", label: "Veg", icon: "/icons/veg-option-icon.svg", color: "text-green-600" },
        { id: "nonveg", label: "Non-Veg", icon: "/icons/nonveg-option-icon.svg", color: "text-red-600" },
        { id: "egg", label: "Eggitarian", icon: "/icons/eggetarian-option-icon.svg", color: "text-yellow-600" },
        { id: "all", label: "I’ll eat it all", icon: "", color: "text-gray-600" },
    ];

    return (
        <div className="flex flex-col h-[100dvh] w-[100dvw] bg-white px-6 py-4">
            {/* Back Button */}
            <div className="flex justify-between items-left mb-4">

                <button className="text-2xl text-gray-800" onClick={() => navigate(-1)}>
                    <ChevronLeft className="w-7 h-7" />
                </button>
            </div>

            {/* Heading */}
            <div className="mt-4">
                <h1 className="text-2xl font-bold text-black">What’s your dietary preference?</h1>
                <p className="text-gray-500 text-md mt-1 font-normal">Select one option</p>
            </div>

            {/* Options */}
            <div className="flex flex-col space-y-4 mt-8 flex-2">
                {options.map((option) => (
                    <button
                        key={option.id}
                        className={`w-full mt-2 flex items-center justify-center gap-3 px-4 py-3 border rounded-lg text-lg font-medium transition-all
                        ${selectedOption === option.id ? "bg-black text-white" : "bg-white text-black border-gray-300"}
                    `}
                        onClick={() => setSelectedOption(option.id)}
                    >
                        {option.icon && <img src={option.icon} alt={option.label} className={`${option.color} text-xl`} />}
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Next Button */}
            <div className="flex justify-center items-center font-normal text-gray-500 text-sm mt-4">
                <Info className="w-5 h-5 mr-2" /> You can change this later
            </div>
            <button
                className={`mt-6 w-full bg-pink-600 text-white text-lg font-semibold py-3 mb-4 rounded-lg shadow-md transition
                ${selectedOption ? "hover:bg-pink-700" : "opacity-50 cursor-not-allowed"}
            `}
                onClick={() => selectedOption && navigate(`/menu?preference=${selectedOption}`)}
                disabled={!selectedOption} // Disable button if no selection is made
            >
                Confirm
            </button>
        </div>
    );
};

export default FoodPreference;
