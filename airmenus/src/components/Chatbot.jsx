import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import MenuItemCard from "../components/MenuItemCard"; // Import the menu item component
import { MENU_ITEMS } from "../constants/logos";

const Chatbot = ({ isOpen, onClose, onAddToCart }) => {
    const [messages, setMessages] = useState([
        { text: "Lafayette welcomes you!", sender: "bot", options: ["Curate", "Best Dishes", "Ask me anything"] },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false); // New state for typing animation

    // Sample Recommended Dishes
    const recommendedDishes = MENU_ITEMS.slice(0, 2);

    const handleSendMessage = (message) => {
        if (!message.trim()) return;

        // Append user message
        const newMessages = [...messages, { text: message, sender: "user" }];
        setMessages(newMessages);
        setInput("");

        // Show typing animation
        setIsTyping(true);

        // Simulate bot response delay
        setTimeout(() => {
            let botResponse = { text: "This is a placeholder response.", sender: "bot", options: [] };

            if (message.toLowerCase().includes("dishes")) {
                botResponse = { text: "Here are some dishes you might like:", sender: "bot", showDishes: true };
            } else if (message === "Curate") {
                botResponse = { text: "Let’s curate a menu for you!", sender: "bot" };
            } else if (message === "Best Dishes") {
                botResponse = { text: "Here are our top recommendations!", sender: "bot" };
            } else if (message === "Ask me anything") {
                botResponse = { text: "I'm here to help! What do you want to ask?", sender: "bot" };
            }

            setIsTyping(false); // Hide typing animation before showing response

            setMessages((prevMessages) => [...prevMessages, botResponse]);
        }, 1500); // Delay for realism
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 backdrop-blur-2xl flex justify-center items-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth transition
                >
                    <motion.div
                        className="bg-white w-6/7 h-6/7 rounded-lg shadow-lg p-6 flex flex-col"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-3 right-3 text-gray-500 text-lg hover:text-gray-700"
                            onClick={onClose}
                        >
                            ✖
                        </button>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto space-y-3 p-2">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    {msg.sender === "bot" && (
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                                            🤖
                                        </div>
                                    )}
                                    <div
                                        className={`p-3 rounded-lg max-w-xs ${msg.sender === "user"
                                            ? "bg-blue-500 text-white self-end"
                                            : "bg-gray-200 text-black"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {/* Typing Animation */}
                            {isTyping && (
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        🤖
                                    </div>
                                    <div className="p-2 bg-gray-200 rounded-lg text-sm text-gray-600">
                                        Bot is typing<span className="dot-typing">...</span>
                                    </div>
                                </div>
                            )}

                            {/* Display Quick Reply Buttons for Last Bot Message (Stacked Vertically) */}
                            {messages.length > 0 &&
                                messages[messages.length - 1].options &&
                                messages[messages.length - 1].options.length > 0 && (
                                    <div className="flex flex-col space-y-2 p-2">
                                        {messages[messages.length - 1].options.map((option) => (
                                            <button
                                                key={option}
                                                className="px-4 py-2 bg-gray-100 border rounded-lg text-sm hover:bg-gray-200 transition"
                                                onClick={() => handleSendMessage(option)}
                                            >
                                                {option} →
                                            </button>
                                        ))}
                                    </div>
                                )}

                            {/* Display Recommended Dishes if applicable */}
                            {messages.length > 0 && messages[messages.length - 1].showDishes && (
                                <div className="space-y-3 p-2">
                                    <h3 className="text-lg font-semibold text-cyan-600">Starters</h3>
                                    {recommendedDishes.map((dish) => (
                                        <MenuItemCard key={dish.id} item={dish} onAdd={() => onAddToCart(dish)} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="flex items-center p-2 border-t border-gray-400 pt-4 mt-2">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
                            />
                            <button
                                className="ml-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                onClick={() => handleSendMessage(input)}
                            >
                                ➤
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Chatbot;
