'use client';
import React, { useState, useRef, useEffect }  from 'react';

interface Props {
    initialText: string;
    text: string;
    setText: (text: string) => void;
}

export default function OutputBox({initialText, text, setText} : Props) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        setLoading(true);
    };

    return (
        <>
            <div className="relative rounded-lg shadow-md">
                <textarea 
                    className="w-full min-h-[40px] border p-2 rounded-md focus:outline-blue-500"
                    disabled={!isEditing}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`
                    }}
                    onBlur={handleBlur}
                />
                {!isEditing && (
                    <button 
                        className="absolute top-2 right-2 px-4 py-2 bg-blue-500 text-white rounded-md" 
                        onClick={handleEditClick}
                    >
                        Edit
                    </button>
                )}
                {/* {loading && (
                    <div className="absolute bottom-0 left-2 right-2 space-y-2">
                        <div className="h-4 bg-gray-300 animate-pulse rounded-md w-3/4" />
                        <div className="h-4 bg-gray-300 animate-pulse rounded-md w-3/4" />
                    </div>
                )} */}
            </div>
        </>
    );
}