import { useState, useRef, useEffect } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import axios from 'axios';
import UserProfileModal from './UserProfileModal'; // Import UserProfileModal

export default function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // Track selected user for modal
    const [showProfileModal, setShowProfileModal] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Fetch notifications data
    const fetchNotifData = async () => {
        try {
            const response = await axios.get('/notifications');
            setNotifications(response.data.notifs);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Fetch the notifications initially
    useEffect(() => {
        fetchNotifData();
        
        // Set an interval to refresh notifications every 30 seconds (or adjust as needed)
        const intervalId = setInterval(() => {
            fetchNotifData();
        }, 1000); // 30000ms = 30 seconds

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);


    // Mark notifications as read when dropdown is opened
    const markNotificationsAsRead = async () => {
        try {
            const unreadNotifications = notifications.filter((notif) => !notif.read);
            for (const notification of unreadNotifications) {
                await axios.post(`/notifications/${notification.id}/mark-as-read`);
            }
            // Update the notifications state to reflect the read status
            setNotifications((prevNotifications) =>
                prevNotifications.map((notif) => ({ ...notif, read: true }))
            );
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const handleProfileClick = async (userId) => {
        try {
            const response = await axios.get(`/user-profile/${userId}`);
            setSelectedUser(response.data);  // Store the full user data
            setShowProfileModal(true); // Show the profile modal when a user's name is clicked
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const closeProfileModal = () => {
        setShowProfileModal(false);
        setSelectedUser(null);
    };

    // Close the dropdown when clicking outside
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
            <button onClick={toggleDropdown} className="relative" onBlur={markNotificationsAsRead}>
                <IoMdNotificationsOutline size={25} className="text-white" />
                {/* Only show badge if there are unread notifications */}
                {notifications.filter((notif) => !notif.read).length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {notifications.filter((notif) => !notif.read).length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-gray-700">Notifications</h2>
                    </div>
                    <ul className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                            <li
                                key={notification.id}
                                className={`p-4 border-b hover:bg-gray-100 ${notification.read ? 'bg-gray-200' : ''}`}
                            >
                                <p className="text-gray-700">
                                    {/* Display the post creator's name when it's related to proposal acceptance */}
                                    <span
                                        className="cursor-pointer text-blue-600"
                                        onClick={() => handleProfileClick(notification.sender_user_id || notification.user.id)} // Either sender or user id
                                    >
                                        Visit User 
                                    </span><br />
                                    {notification.message}
                                </p>
                                <span className="text-xs text-gray-500">
                                    {new Date(notification.created_at).toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {showProfileModal && selectedUser && (
                <UserProfileModal
                    showProfileModal={showProfileModal}
                    closeUserProfileModal={closeProfileModal}
                    user={selectedUser} // Pass full user data to the modal
                />
            )}
        </div>
    );
}
