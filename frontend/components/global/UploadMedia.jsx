import { useRef, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline"; // Adjust based on your import method

export default function UploadMedia() {
    const fileInputRef = useRef(null);
    const [images, setImages] = useState([]); // Store selected images

    const handleDivClick = () => {
        fileInputRef.current?.click(); // Trigger file input
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (!files) return;

        const newImages = Array.from(files).map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        );

        setImages((prevImages) => [...prevImages, ...newImages]); // Append new images
    };

    return (
        <div>
            {/* Clickable Upload Box */}
            <div
                onClick={handleDivClick}
                className="mt-2 cursor-pointer h-5/6 flex justify-center rounded-lg border border-dashed dark:border-gray-200 border-gray-900/25 px-6 py-10"
            >
                <div className="text-center my-auto">
                    <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300 dark:text-white" />
                    <div className="mt-4 flex text-sm/6 text-gray-600 dark:text-white">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white dark:bg-black font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            <span>Upload photos or/and videos here</span>
                            <input
                                ref={fileInputRef}
                                id="file-upload"
                                multiple
                                name="file-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleFileChange} // Handle file selection
                            />
                        </label>
                    </div>
                    <p className="text-xs/5 text-gray-600 dark:text-gray-100">PHOTOS AND VIDEOS</p>
                </div>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {images.map((image, index) => (
                        <div key={index} className="relative w-32 h-32">
                            <img
                                src={image.preview}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-md"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
