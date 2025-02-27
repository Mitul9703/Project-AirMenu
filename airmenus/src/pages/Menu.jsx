import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FloatingButton from "../components/FloatingButton";
import CurateMenuCard from "../components/CurateMenuCard";
import CategoryTabs from "../components/CategoryTabs";
import MenuItemCard from "../components/MenuItemCard";
import Chatbot from "../components/Chatbot";
import { useNavigate } from "react-router-dom";
import { MENU_ITEMS } from "../constants/constants";

const Menu = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [foodPreference, setFoodPreference] = useState(searchParams.get("preference") || "veg");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All Items");
    const [cart, setCart] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const navigate = useNavigate();

    const preferences = [
        { id: "veg", label: "Veg", icon: "/icons/veg-option-icon.svg", color: "text-green-600" },
        { id: "nonveg", label: "Non-Veg", icon: "/icons/nonveg-option-icon.svg", color: "text-red-600" },
        { id: "egg", label: "Eggitarian", icon: "/icons/eggetarian-option-icon.svg", color: "text-yellow-600" },
        { id: "all", label: "I’ll eat it all", icon: "", color: "text-gray-600" },
    ];

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleAddToCart = (item) => {
        setCart((prevCart) => [...prevCart, item]);
    };

    // Group menu items by category
    const categorizedMenu = MENU_ITEMS.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    // **Filter menu items based on dietary preference**
    const filterByPreference = (items) => {
        if (foodPreference === "veg") {
            return items.filter((item) => item.vegetarian);
        } else if (foodPreference === "nonveg") {
            return items.filter((item) => !item.vegetarian);
        } else if (foodPreference === "egg") {
            return items; // Eggitarian includes both veg and non-veg
        } else {
            return items; // "I’ll eat it all" includes everything
        }
    };

    // Flatten all displayed items across categories for counting
    let totalDisplayedItems = 0;
    let curateMenuCardInserted = false; // Track if we have inserted the CurateMenuCard

    return (
        <div className="relative h-[100dvh] bg-gray-50">
            {/* Header Section */}
            <div className="flex justify-between items-center pb-4 border-b bg-gray-50 border-gray-200 mb-2 p-6">
                <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold">Lafayette</h1>
                </div>

                {/* Right - Dietary Preference Dropdown */}
                <div className="relative">
                    <button
                        className="flex items-center px-4 py-2 bg-white rounded-lg text-sm font-normal focus:outline-none border border-gray-300"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {preferences.find((p) => p.id === foodPreference)?.icon && (
                            <img
                                src={preferences.find((p) => p.id === foodPreference)?.icon}
                                alt={preferences.find((p) => p.id === foodPreference)?.label}
                                className={`${preferences.find((p) => p.id === foodPreference)?.color} text-xl`}
                            />
                        )}
                        <span className="ml-2">{preferences.find((p) => p.id === foodPreference)?.label}</span>
                        <span className="ml-1">▼</span>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                            {preferences.map((pref) => (
                                <button
                                    key={pref.id}
                                    className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100 transition ${foodPreference === pref.id ? "font-bold" : ""
                                        }`}
                                    onClick={() => {
                                        setFoodPreference(pref.id);
                                        setIsDropdownOpen(false);
                                        navigate(`/menu?preference=${pref.id}`);
                                    }}
                                >
                                    {pref.icon && <img src={pref.icon} alt={pref.label} className={`${pref.color} text-xl`} />} {pref.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Category Tabs */}
            <div className="p-5">
                <CategoryTabs categories={["All Items", "Starters", "Main Course", "Desserts", "Drinks"]} onCategorySelect={handleCategorySelect} />
            </div>

            {/* Menu Items */}
            <div className="px-6">
                {selectedCategory === "All Items" ? (
                    Object.keys(categorizedMenu).map((category) => {
                        const filteredItems = filterByPreference(categorizedMenu[category]);
                        if (filteredItems.length === 0) return null;

                        return (
                            <div key={category} className="mb-6">
                                <h2 className="text-xl font-bold mb-6 pb-2">{category}</h2>
                                {filteredItems.map((item, index) => {
                                    totalDisplayedItems++;

                                    return (
                                        <React.Fragment key={item.id}>
                                            <MenuItemCard item={item} onAdd={() => handleAddToCart(item)} />

                                            {/* Show CurateMenuCard after 3 total displayed items */}
                                            {totalDisplayedItems === 3 && !curateMenuCardInserted && (
                                                <>
                                                    <CurateMenuCard onCurate={() => console.log("Curate menu clicked!")} />
                                                    {curateMenuCardInserted = true}
                                                </>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        );
                    })
                ) : (
                    <>
                        <h2 className="text-xl font-bold mb-6">{selectedCategory}</h2>
                        {filterByPreference(categorizedMenu[selectedCategory])?.map((item, index) => {
                            totalDisplayedItems++;

                            return (
                                <React.Fragment key={item.id}>
                                    <MenuItemCard item={item} onAdd={() => handleAddToCart(item)} />

                                    {/* Show CurateMenuCard after 3 total displayed items */}
                                    {totalDisplayedItems === 3 && !curateMenuCardInserted && (
                                        <>
                                            <CurateMenuCard onCurate={() => console.log("Curate menu clicked!")} />
                                            {curateMenuCardInserted = true}
                                        </>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </>
                )}

                {/* If total items < 3, show CurateMenuCard at the end */}
                {!curateMenuCardInserted && <CurateMenuCard onCurate={() => console.log("Curate menu clicked!")} />}
            </div>

            {/* Floating Button & Chatbot */}
            <FloatingButton onClick={() => setIsChatOpen(true)} />
            <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} onAddToCart={handleAddToCart} />
        </div>
    );
};

export default Menu;
