import React from "react";

const MenuItemCard = ({ item, onAdd }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-300 flex space-x-4 items-center mb-4">
            {/* Left Section - Details */}
            <div className="flex-1">

                <div className="flex space-x-2 mb-2">
                    {item.chefSpecial && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">
                            Chef’s Special
                        </span>
                    )}
                    {item.spicy && (
                        <span className="bg-red-200 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                            Spicy
                        </span>
                    )}
                    {item.bestseller && (
                        <span className="bg-orange-200 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold">
                            Bestseller
                        </span>
                    )}
                </div>

                {/* Item Name */}
                <h3 className="text-lg font-semibold">{item.name}</h3>



                {/* Price */}
                <p className="text-md font-bold mt-1">₹{item.price}</p>

                {/* Description */}
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>

                {/* Nutritional Info */}
                <p className="text-xs text-gray-500 mt-1">
                    {item.nutrition && item.nutrition.join(" • ")}
                </p>
            </div>

            {/* Right Section - Image & Add Button */}
            <div className="flex flex-col items-center">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                />

                {/* Add Button */}
                <button
                    className="mt-2 px-4 py-2 bg-green-200 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition flex items-center border border-green-700 relative"
                    onClick={() => onAdd(item)}
                >
                    <span className="text-green-700 font-bold">ADD</span>
                    <span className="absolute top-0 right-0 mr-1 text-green-700">+</span>
                </button>

            </div>
        </div>
    );
};

export default MenuItemCard;
