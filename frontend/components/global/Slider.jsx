import { Spinner } from '@heroui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import PostVideo from './PostVideo';

const Slider = ({ srcs = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [mediaAspectRatio, setMediaAspectRatio] = useState(4/5);

    const prev = () => {
        const isFirst = currentIndex === 0;
        const newIndex = isFirst ? srcs.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const next = () => {
        const isLast = currentIndex === srcs.length - 1;
        const newIndex = isLast ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goTo = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        setLoading(true);
        setError(false);

        const timeout = setTimeout(() => {
            if (loading) {
                setError(true);
                setLoading(false);
            }
        }, 5000);

        return () => clearTimeout(timeout);
    }, [srcs, currentIndex]);

    // Function to calculate aspect ratio
    const calculateAspectRatio = (media) => {
        if (!media) return 4/5;
        
        // If media has width and height, calculate actual ratio
        if (media.width && media.height) {
            const ratio = media.width / media.height;
            // Only use landscape ratio if the media is actually landscape
            return ratio >= 1.5 ? 16/9 : 4/5;
        }
        
        // Default to 4:5 for everything else
        return 4/5;
    };

    useEffect(() => {
        if (srcs[currentIndex]) {
            setMediaAspectRatio(calculateAspectRatio(srcs[currentIndex]));
        }
    }, [currentIndex, srcs]);

    const containerStyle = {
        aspectRatio: mediaAspectRatio,
    };

    return (
        <div 
            className="relative w-full bg-white dark:bg-neutral-900 overflow-hidden shadow-lg transition-all duration-300 group"
            style={containerStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-gray-100/80 dark:bg-neutral-900/80 backdrop-blur-sm z-10">
                    <Spinner
                        classNames={{ 
                            label: "text-gray-700 dark:text-gray-200 mt-4 font-medium",
                            base: "text-primary"
                        }}
                        label="Loading media..."
                        variant="wave"
                    />
                </div>
            )}
            
            {srcs[currentIndex] == null && (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-200 dark:bg-neutral-800 z-10">
                    <i className="fa-solid fa-triangle-exclamation text-3xl text-red-500 mb-3"></i>
                    <p className="text-gray-700 dark:text-gray-200 font-medium">This media is no longer available</p>
                </div>
            )}

            {srcs[currentIndex]?.mediaType === "IMAGE" && (
                <div className="relative w-full h-full">
                    <Image
                        src={srcs[currentIndex].url}
                        alt="Post media"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`transition-all duration-500 ${
                            loading ? "opacity-0 scale-95" : "opacity-100 scale-100"
                        } object-cover`}
                        onLoad={() => {
                            setLoading(false);
                            setError(false);
                        }}
                        onError={() => {
                            setLoading(false);
                            setError(true);
                        }}
                    />
                </div>
            )}

            {srcs[currentIndex]?.mediaType === "VIDEO" && (
                <div className="relative w-full h-full">
                    <PostVideo src={srcs[currentIndex].url} />
                </div>
            )}

            {srcs.length >= 2 && (
                <>
                    <button
                        onClick={next}
                        className={`absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 dark:bg-neutral-800/80 w-10 h-10 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center backdrop-blur-sm
                            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
                            hover:bg-white dark:hover:bg-neutral-700 hover:scale-110
                            shadow-lg hover:shadow-xl z-10`}
                    >
                        <i className="fa-solid fa-angle-right text-gray-700 dark:text-gray-200"></i>
                    </button>

                    <button
                        onClick={prev}
                        className={`absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 dark:bg-neutral-800/80 w-10 h-10 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center backdrop-blur-sm
                            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
                            hover:bg-white dark:hover:bg-neutral-700 hover:scale-110
                            shadow-lg hover:shadow-xl z-10`}
                    >
                        <i className="fa-solid fa-angle-left text-gray-700 dark:text-gray-200"></i>
                    </button>
                </>
            )}

            {srcs.length >= 2 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-white/30 dark:bg-neutral-800/30 px-3 py-2 rounded-full backdrop-blur-sm z-10">
                    {srcs.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goTo(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                currentIndex === index 
                                    ? 'bg-primary scale-125' 
                                    : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Slider;