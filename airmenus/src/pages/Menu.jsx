import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FloatingButton from "../components/FloatingButton";
import CurateMenuCard from "../components/CurateMenuCard";
import CategoryTabs from "../components/CategoryTabs";
import MenuItemCard from "../components/MenuItemCard";
import Chatbot from "../components/Chatbot";
import { useNavigate } from "react-router-dom";
import { RESTAURANT_LOGO, MENU_ITEMS } from "../constants/logos";

const Menu = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const foodPreference = searchParams.get("preference") || "veg"; // Default to Veg

    const [selectedCategory, setSelectedCategory] = useState("Starters");
    const [cart, setCart] = useState([]); // Stores added menu items
    const [isChatOpen, setIsChatOpen] = useState(false);
    const navigate = useNavigate();

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleAddToCart = (item) => {
        setCart((prevCart) => [...prevCart, item]);
    };

    // Sample Menu Items
    const menuItems = MENU_ITEMS;

    const filteredItems = menuItems.filter((item) => item.category === selectedCategory);

    return (
        <div className="relative min-h-screen bg-gray-100 p-6">
            {/* Header with Food Preference */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-4">
                <div className="flex items-center space-x-2">
                    <img src={RESTAURANT_LOGO} alt="Lafayette" className="w-10 h-10 rounded-full" />
                    <h1 className="text-2xl font-semibold">Lafayette</h1>
                </div>
                <span className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium">
                    {foodPreference.charAt(0).toUpperCase() + foodPreference.slice(1)}
                </span>
            </div>

            {/* "Menu Seems Long?" Card */}
            <CurateMenuCard onCurate={() => console.log("Curate menu clicked!")} />

            {/* Category Tabs */}
            <CategoryTabs
                categories={["Starters", "Main Course", "Desserts", "Drinks"]}
                onCategorySelect={handleCategorySelect}
            />

            {/* Menu Items */}
            <div className="mt-4">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <MenuItemCard key={item.id} item={item} onAdd={() => handleAddToCart(item)} />
                    ))
                ) : (
                    <p className="text-gray-500 text-center mt-4">No items available in this category.</p>
                )}
            </div>

            {/* Floating Action Button */}
            <FloatingButton onClick={() => setIsChatOpen(true)} />

            {/* Chatbot Popup */}
            <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} onAddToCart={handleAddToCart} />

            {/* Floating Cart Icon */}
            {cart.length > 0 && (
                <button
                    className="fixed bottom-20 right-6 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                    onClick={() => navigate("/cart")}
                >
                    🛒 <span>{cart.length}</span>
                </button>
            )}
        </div>
    );
};

export default Menu;
