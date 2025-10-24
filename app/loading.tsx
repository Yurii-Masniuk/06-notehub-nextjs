import React from 'react';

const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-[50vh] p-4">
            <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg text-gray-600">Завантаження...</p>
            </div>
        </div>
    );
};

export default Loading;
