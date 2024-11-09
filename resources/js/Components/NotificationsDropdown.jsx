import { useState, useRef, useEffect } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import axios from 'axios';

export default function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Fetch notifications from the backend
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/notifications');
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error.response?.data || error.message);
            }
        };
        
        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 10000); // Poll every 10 seconds

        return () => clearInterval(intervalId);
    }, []);

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

    // Trigger a notification popup for approved proposals
    useEffect(() => {
        const approvedNotification = notifications.find(
            (notification) => notification.message.includes('approved')
        );
        if (approvedNotification) {
            alert('Your proposal has been approved!');
        }
    }, [notifications]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="relative">
                <IoMdNotificationsOutline size={25} className="text-white" />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-gray-700">Notifications</h2>
                    </div>
                    <ul className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <li key={notification.id} className="p-4 border-b hover:bg-gray-100">
                                    <p className="text-gray-700">{notification.message}</p>
                                    <span className="text-xs text-gray-500">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="p-4 text-gray-700">No new notifications</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
