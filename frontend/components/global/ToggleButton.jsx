"use client"

import { useState } from "react";

const ToggleButton = ({ description, className = "" }) => {
    const [isOn, setIsOn] = useState(false);

    const toggleButton = () => {
        setIsOn((prev) => !prev);
    };

    return (
        <div className="flex items-center space-x-4 border p-3 rounded-md mb-2">
            {/* Description */}
            <span className={` grow text-gray-700 ${className}`}>
                {description}
            </span>

            {/* Toggle Button */}
            <button
                onClick={toggleButton}
                className={`relative w-12 h-6 rounded-full focus:outline-none transition-colors ${isOn ? "bg-green-500" : "bg-gray-300"
                    }`}
            >
                <span
                    className={`absolute w-6 top-0 left-0 h-6 bg-white rounded-full shadow transform transition-transform ${isOn ? "translate-x-6" : "translate-x-0"
                        }`}
                ></span>
            </button>
        </div>
    );
};

export default ToggleButton;
