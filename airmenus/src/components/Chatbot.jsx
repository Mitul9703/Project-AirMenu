import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MENU_ITEMS } from "../constants/constants";
import QuickReplyButton from "./QuickReplyButton";
import RecommendedMenuItemCard from "./RecommendedMenuItemCard";
import ChatMessageInput from "./ChatMessageInput";
import TypingAnimation from "./TypingAnimation";
import ChatTopBar from "./ChatTopBar";

const Chatbot = ({ isOpen, onClose, onAddToCart }) => {
    const [messages, setMessages] = useState([
        { text: "Lafayette welcomes you! Let me know how I can help you. Here are some ways to get started.", sender: "bot", isFirstMessage: true },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isQuickReplyOpen, setIsQuickReplyOpen] = useState(false);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    const recommendedDishes = MENU_ITEMS.slice(0, 2);


    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);



    const handleSendMessage = async (message) => {
        if (!message.trim()) return;

        const newMessages = [...messages, { text: message, sender: "user" }];
        setMessages(newMessages);
        setInput("");

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 10);

        setIsQuickReplyOpen(false); // Close pop-up when an option is selected

        if (messages.some(msg => msg.isFirstMessage)) {
            setMessages(prevMessages => prevMessages.map(msg => ({ ...msg, isFirstMessage: false })));
        }

        if (message.toLowerCase() === "curate a menu") {
            setIsTyping(true);
            setTimeout(() => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        text: "Here's what I recommend",
                        sender: "bot",
                        recommendedDishes, // Attach recommended dishes to this message
                    },
                ]);
                setIsTyping(false);
            }, 4000);
            return;
        }

        setIsTyping(true);

        try {
            const response = await fetch("http://localhost:8000/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: message,
                    history: newMessages.map((msg) => ({ question: msg.text, answer: "" }))
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch response from chatbot API");
            }

            const data = await response.json();

            setMessages((prevMessages) => [
                ...prevMessages,
                { text: data.answer.replace(/\*\*|\*/g, ""), sender: "bot" } // No recommended dishes in normal replies
            ]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: "Oops! Something went wrong. Try again later.", sender: "bot" }
            ]);
        }

        setIsTyping(false);

    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-white flex flex-col z-50"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{
                        duration: 0.3,
                        ease: "easeInOut", // Custom easing for smoother animation
                        opacity: { duration: 0.2 } // Faster opacity transition
                    }}
                    style={{
                        willChange: "transform, opacity",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "translateZ(0)",
                        WebkitTransform: "translateZ(0)"
                    }}
                >
                    {/* Top Bar */}
                    <ChatTopBar onClose={onClose} />

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <AnimatePresence>
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                    <div className={`flex items-center ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                        {msg.sender === "bot" && (
                                            <img src="/icons/bot-icon.svg" className="w-8 h-8 border border-gray-300 mr-3 rounded-full" />
                                        )}
                                        <div className={`${msg.sender === "user" ? "ml-12" : "mr-12"}`}>
                                            <div className={`p-4 rounded-3xl text-base max-w-xs mb-3 ${msg.sender === "user" ? "bg-[#7A00D8] text-white self-end rounded-tr-none" : "bg-[#F2F4F5] text-black rounded-tl-none"}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Show Recommended Dishes if attached to this message */}
                                    {msg.recommendedDishes && (
                                        <div className="space-y-3 p-2">
                                            {msg.recommendedDishes.map((dish) => (
                                                <RecommendedMenuItemCard
                                                    key={dish.id}
                                                    item={dish}
                                                    onAdd={() => onAddToCart(dish)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </motion.div>

                            ))}
                        </AnimatePresence>

                        {/* Typing Animation */}
                        {isTyping && <TypingAnimation />}
                        <div ref={chatEndRef} />

                        {/* Standard Quick Reply Buttons (Only for First Bot Message) */}
                        {messages.some(msg => msg.isFirstMessage) && (
                            <div className="flex flex-col space-y-2 mt-2 ml-10 mr-12">
                                <QuickReplyButton text="Curate a menu for me" isHot={true} onClick={() => handleSendMessage("Curate a menu")} />
                                <QuickReplyButton text="Must try dishes" onClick={() => handleSendMessage("Must try dishes")} />
                                <QuickReplyButton text="Ask me about a dish" onClick={() => handleSendMessage("Ask me about a dish")} />
                            </div>
                        )}
                    </div>

                    {/* Message Input & Quick Reply Pop-up */}
                    <ChatMessageInput
                        inputRef={inputRef}
                        input={input}
                        setInput={setInput}
                        handleSendMessage={handleSendMessage}
                        isQuickReplyOpen={isQuickReplyOpen}
                        setIsQuickReplyOpen={setIsQuickReplyOpen}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Chatbot;
