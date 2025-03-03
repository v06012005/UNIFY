import { Spinner } from '@heroui/react';
import Image from 'next/image';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import PostVideo from './PostVideo';

const Slider = ({ srcs = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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
        }, 10000);

        return () => clearTimeout(timeout);
    }, [srcs, currentIndex]);

    return (
        <div className="max-w-[450px] w-full h-[550px] my-auto bg-cover relative mx-auto group">
            {loading && (
                <div className="absolute inset-0 flex justify-center rounded-lg items-center bg-gray-200 dark:bg-gray-800">
                    <Spinner
                        classNames={{ label: "text-foreground mt-4" }}
                        label="Please wait..."
                        variant="wave"
                    />
                </div>
            )}
            {error && (
                <div className="absolute text-red-500 inset-0 flex justify-center rounded-lg items-center bg-gray-200 dark:bg-gray-800">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <p>This image/ video is no longer available!</p>
                </div>
            )}
            {srcs[currentIndex]?.mediaType === "IMAGE" && (
                <Image
                    src={srcs[currentIndex].url}
                    alt="Image"
                    className={`transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"
                        } object-cover w-full h-full rounded-lg duration-500`}
                    width={450}
                    height={550}
                    onLoad={() => {
                        setLoading(false);
                        setError(false);
                    }}
                    onError={() => {
                        setLoading(false);
                        setError(true);
                    }}
                />
            )}
            {srcs[currentIndex]?.mediaType === "VIDEO" && (
                <>
                    <PostVideo src={srcs[currentIndex].url} />
                </>
            )}
            <div
                onClick={next}
                className="hidden group-hover:flex absolute top-1/2 right-[-10px] -translate-x-0 -translate-y-1/2 bg-gray-400 w-7 h-7 rounded-full cursor-pointer"
            >
                <i className="fa-solid fa-angle-right m-auto"></i>
            </div>
            <div
                onClick={prev}
                className="hidden group-hover:flex absolute top-1/2 left-[-10px] -translate-x-0 -translate-y-1/2 bg-gray-400 w-7 h-7 rounded-full cursor-pointer"
            >
                <i className="fa-solid fa-angle-left m-auto"></i>
            </div>
            <div className="flex justify-center">
                {srcs.map((src, index) => (
                    <div
                        key={index}
                        onClick={() => goTo(index)}
                        className={`text-xs mx-[2px] cursor-pointer ${currentIndex === index ? "dark:text-white" : "text-gray-500"
                            }`}
                    >
                        <i className="fa-solid fa-circle fa-xs "></i>
                    </div>
                ))}
            </div>
        </div>
    );

}

export default Slider