import React from "react";

const RecommendedMenuItemCard = ({ item, onAdd }) => {
    return (
        <div className="flex items-start space-x-4 mb-6 border border-gray-200 p-4 rounded-lg">
            {/* Left Section - Details */}
            <div className="flex-1">
                {/* Labels & Dietary Icons */}
                <div className="flex items-center space-x-2 mb-2">
                    {/* Spicy Indicator */}
                    {item.spicy && (
                        <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-semibold border border-red-700">
                            <img src="/icons/spicy-icon.svg" alt="Spicy" className="w-4 h-4 inline-block" />
                        </span>
                    )}
                    {/* Chef's Special */}
                    {item.chefSpecial && (
                        <span className="bg-[#FF80000A] text-[#FF8000] px-2 py-1 rounded-full text-xs font-semibold border border-[#FF8000]">
                            CHEF'S SPECIAL
                        </span>
                    )}
                </div>

                <div className="flex flex-row items-center space-x-2">
                    {/* Vegetarian / Non-Veg Icon */}
                    <span className={`text-sm font-semibold ${item.vegetarian ? "text-green-600" : "text-red-600"}`}>
                        {item.vegetarian ? (
                            <img src="/icons/veg-icon.svg" alt="Veg" className="w-5 h-5 inline-block" />
                        ) : (
                            <img src="/icons/nonveg-icon.svg" alt="Non-Veg" className="w-4 h-4 inline-block" />
                        )}
                    </span>
                    {/* Item Name */}
                    <h3 className="text-md font-bold">{item.name}</h3>
                </div>

                {/* Description */}
                {/* <p className="text-xs font-normal text-gray-600 mt-1">{item.description}</p> */}


            </div>

            {/* Right Section - Image & Learn More */}
            <div className="relative">
                {/* Price */}
                <p className="text-xl font-bold mt-2">₹{item.price}</p>

            </div>
        </div>
    );
};

export default RecommendedMenuItemCard; 