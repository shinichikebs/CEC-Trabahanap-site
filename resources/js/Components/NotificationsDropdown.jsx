import { useState, useRef, useEffect } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io'; // Notification icon

export default function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false); // To toggle the dropdown
    const [notifications] = useState([
        { id: 1, sender: 'Aljay Sepe', message: 'Sent a proposal...', date: 'July 2024' },
        { id: 2, sender: 'Mark Vincent', message: 'Sent a proposal...', date: 'July 2024' },
    ]);

    const dropdownRef = useRef(null);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Close the dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Icon */}
            <button onClick={toggleDropdown} className="relative">
                <IoMdNotificationsOutline size={25} className="text-white" />
                {/* You can also add a notification badge here */}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-gray-700">Notifications</h2>
                    </div>
                    <ul className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                            <li key={notification.id} className="p-4 border-b hover:bg-gray-100">
                                <strong className="block text-gray-700">{notification.sender}</strong>
                                <p className="text-sm text-gray-600">{notification.message}</p>
                                <span className="text-xs text-gray-500">{notification.date}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
