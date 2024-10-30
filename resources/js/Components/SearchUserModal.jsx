// src/components/SearchUserModal.js
import React from 'react';

const SearchUserModal = ({ isOpen, searchResults, onSelect, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                {/* Close button */}
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    ✖
                </button>
                <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                {searchResults.length > 0 ? (
                    <ul className="space-y-2">
                        {searchResults.map((user) => (
                            <li
                                key={user.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                                onClick={() => onSelect(user)}
                            >
                                <p>{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No results found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchUserModal;
