import React, { useEffect, useState, useRef } from 'react';

export default function AuthModal() {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-auth-modal', handleOpen);
        return () => window.removeEventListener('open-auth-modal', handleOpen);
    }, []);

    // Close on click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center relative animate-in zoom-in-95 duration-200"
            >
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="mb-6 flex flex-col items-center justify-center space-y-1">
                    <h2 className="text-[28px] font-bold text-gray-900 leading-tight">
                        Start exploring with a free
                    </h2>
                    <h2 className="text-[28px] font-black text-gray-900 leading-tight uppercase tracking-tight">
                        ZVENIA account
                    </h2>
                </div>

                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Sign up to get unlimited content. <br />
                    No credit card needed.
                </p>

                <a
                    href="/join"
                    className="inline-block bg-[#10C35B] hover:bg-[#0da04b] text-[#00331d] font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-[1.02] text-2xl mb-6 shadow-lg shadow-green-500/20"
                >
                    Register for Free
                </a>

                <p className="text-gray-600 font-medium">
                    Already have an account? <a href="/login" className="text-gray-900 font-bold hover:underline ml-1">Log In</a>
                </p>
            </div>
        </div>
    );
}
