import React from "react";

export default function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-blue-500 text-white py-4 px-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button className="bg-blue-600 py-2 px-4 rounded-lg">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main layout with sidebar and content */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-800 text-gray-100">
                    <nav className="p-6">
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="#"
                                    className="block py-2 px-4 hover:bg-gray-700 rounded-lg"
                                >
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block py-2 px-4 hover:bg-gray-700 rounded-lg"
                                >
                                    Users
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block py-2 px-4 hover:bg-gray-700 rounded-lg"
                                >
                                    Projects
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block py-2 px-4 hover:bg-gray-700 rounded-lg"
                                >
                                    Messages
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block py-2 px-4 hover:bg-gray-700 rounded-lg"
                                >
                                    Settings
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6 bg-gray-100">
                    <h2 className="text-xl font-bold mb-4">
                        Welcome to the Admin Dashboard
                    </h2>

                    {/* Dashboard Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Widget 1 */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-2">
                                Total Users
                            </h3>
                            <p className="text-4xl font-bold">1,234</p>
                        </div>

                        {/* Widget 2 */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-2">
                                Active Projects
                            </h3>
                            <p className="text-4xl font-bold">67</p>
                        </div>

                        {/* Widget 3 */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-2">
                                New Messages
                            </h3>
                            <p className="text-4xl font-bold">5</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
