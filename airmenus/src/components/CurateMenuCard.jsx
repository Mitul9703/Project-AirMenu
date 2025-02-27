import React from "react";

const CurateMenuCard = ({ onCurate }) => {
    return (
        <div className="bg-[#7A00D8] p-4 rounded-xl shadow-sm border border-gray-300 text-center mb-6 flex flex-col items-start px-6 py-6">
            <img src="/icons/sadface-icon.svg" alt="sadface" className="w-10 h-10 inline-block" />
            <h2 className="text-xl font-bold text-white mt-2">Menu seems too long?</h2>
            <p className="text-white font-medium text-sm mt-2">Curate your own menu with just 2 steps.</p>
            <button
                className="mt-4 px-4 py-2 bg-white text-sm text-black rounded-lg text-sm font-semibold hover:bg-pink-600 transition"
                onClick={onCurate}
            >
                Curate Now
            </button>
        </div>
    );
};

export default CurateMenuCard;
