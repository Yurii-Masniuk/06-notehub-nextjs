'use client';

import React, { useEffect } from 'react';

const ErrorBoundary = ({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) => {
    useEffect(() => {
        console.error('Error Boundary Activated:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center bg-red-50 border border-red-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-700 mb-4">
                Ой, сталася помилка!
            </h2>
            <p className="text-gray-600 mb-6">
                На жаль, не вдалося завантажити деталі нотатки.
            </p>
            <p className="text-sm text-red-500 mb-6">
                {error.message}
            </p>
            <button
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                onClick={
                    () => reset()
                }
            >
                Спробувати знову
            </button>
        </div>
    );
};

export default ErrorBoundary;
