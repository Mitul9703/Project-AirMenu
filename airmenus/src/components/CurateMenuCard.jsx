import React from "react";

const CurateMenuCard = ({ onCurate }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300 text-center mb-6">
            <h2 className="text-lg font-semibold text-cyan-600">Menu seems long?</h2>
            <p className="text-gray-600 text-sm">Curate your own menu</p>
            <button
                className="mt-3 px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition"
                onClick={onCurate}
            >
                Curate Now
            </button>
        </div>
    );
};

export default CurateMenuCard;
