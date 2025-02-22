import React, { useState } from "react";

const CategoryTabs = ({ categories, onCategorySelect }) => {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);

    return (
        <div className="flex overflow-x-auto space-x-4 pb-3">
            {categories.map((category) => (
                <button
                    key={category}
                    className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap border transition ${selectedCategory === category
                            ? "bg-black text-white"
                            : "bg-white border-gray-300 text-gray-600"
                        }`}
                    onClick={() => {
                        setSelectedCategory(category);
                        onCategorySelect(category);
                    }}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default CategoryTabs;
