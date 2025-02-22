import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    // Load cart from localStorage (for persistence)
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
    }, []);

    // Remove item from cart
    const handleRemoveItem = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

            {cart.length > 0 ? (
                cart.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md border flex items-center space-x-4 mb-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <p className="text-md font-bold mt-1">₹{item.price}</p>
                        </div>
                        <button
                            className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                            onClick={() => handleRemoveItem(index)}
                        >
                            Remove
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center mt-4">Your cart is empty.</p>
            )}

            <button
                className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition w-full"
                onClick={() => navigate("/menu")}
            >
                Back to Menu
            </button>
        </div>
    );
};

export default Cart;
