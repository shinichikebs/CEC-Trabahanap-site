import { useState, useEffect } from "react";
import { Dropdown, NavLink } from "@/Components";
import { IoSettingsOutline, IoLogOutOutline, IoSearchOutline } from "react-icons/io5";
import { BiFolderOpen } from "react-icons/bi";
import { TbMessageShare } from "react-icons/tb";
import axios from 'axios';
import NotificationsDropdown from "../Components/NotificationsDropdown";
import { MdDashboard } from "react-icons/md";
import { MdOutlinePostAdd } from "react-icons/md";

export default function Authenticated({ user, header, children, showNavbar = true }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleSearchChange = async (query) => {
        setSearchQuery(query);

        if (query.trim() !== "") {
            try {
                const response = await axios.get(`/search-user`, {
                    params: { query },
                });
                setSearchResults(response.data.users || []);
            } catch (error) {
                console.error("Error searching for users:", error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log("Search submitted:", searchQuery);
        }
    };

    const handleSelectResult = (result) => {
        window.location.href = `/profile/${result.id}`;
    };

    return (
        <div className="min-h-screen">
            {showNavbar && (
                <header className="sticky top-0 bg-[#231955] z-50 shadow-lg">
                    <nav className="flex justify-between items-center min-w-full px-4 py-3">
                        <img src={`cecLogo.png`} width={70} alt="Logo" />
                        {!isMobile && (
                            <NavLink
                                href={route("dashboard")}
                                className="text-lg font-bold text-[#E8AA42] uppercase tracking-tight"
                            >
                                CeC-Trabahanap
                            </NavLink>
                        )}
                        {/* Desktop Search Bar */}
                        {/* {!isMobile && (
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative flex items-center mr-20 " // Positioned to the right
                            >
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="bg-gray-200 rounded-lg px-8 py-2 w-full max-w-[300px] text-gray-900 outline-none placeholder-gray-500"
                                />
                                <button type="submit" className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                    <IoSearchOutline className="w-5 h-5 text-gray-600" />
                                </button>
                            </form>
                        )} */}
                        {/* Mobile Search Bar */}
                        {isMobile && (
                            <form
                                onSubmit={handleSearchSubmit}
                                className={`relative flex items-center flex-grow mx-4`}
                            >
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="bg-gray-200 rounded-lg px-8 py-2 w-full text-gray-900 outline-none placeholder-gray-500"
                                />
                                <button type="submit" className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                    <IoSearchOutline className="w-5 h-5 text-gray-600" />
                                </button>
                            </form>
                        )}
                        {isMobile ? (
                            <button
                                className="text-white px-4 py-2 rounded-lg bg-[#E8AA42] hover:bg-[#D18C33] flex items-center shadow-lg"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                Menu
                            </button>
                        ) : (
                            <div className="flex items-center space-x-6 ml-auto relative">
                                <form
                                onSubmit={handleSearchSubmit}
                                className="relative flex items-center mr-20 " // Positioned to the right
                            >
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="bg-gray-200 rounded-lg px-8 py-2 w-70 max-w-[300px] text-gray-900 outline-none placeholder-gray-500"
                                />
                                <button type="submit" className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                    <IoSearchOutline className="w-5 h-5 text-gray-600" />
                                </button>
                            </form>
                                <NavLink
                                    href={route('post-project')}
                                    className="bg-[#E8AA42] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#D18C33] shadow-md"
                                >
                                    Post Project
                                </NavLink>
                                <TbMessageShare size={25} className="text-white" />
                                <NotificationsDropdown />
                                <div className="ms-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="transition ease-in-out duration-150"
                                                >
                                                    <img
                                                        src={user.avatar ? user.avatar : "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"}
                                                        width={35}
                                                        className="object-cover rounded-full shadow-md"
                                                        draggable="false"
                                                        alt="User Avatar"
                                                    />
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <img
                                                src={user.avatar ? user.avatar : "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"}
                                                width={80}
                                                className="object-cover rounded-full shadow-md mt-2 border-4 border-green-700"
                                                draggable="false"
                                                alt="User Avatar"
                                            />
                                            <h1 className="text-sm mt-2 font-semibold uppercase">
                                                {user.firstName} {user.lastName}
                                            </h1>
                                            <p className="text-xs font-sans">{user.role}</p>
                                            <Dropdown.Link className="flex items-center mt-4" href={route("My-project")}>
                                                <BiFolderOpen size={16} />
                                                &nbsp; My Project
                                            </Dropdown.Link>
                                            <Dropdown.Link className="flex items-center" href={route("profile.edit")}>
                                                <IoSettingsOutline size={16} />
                                                &nbsp; Settings
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                className="flex items-center"
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                            >
                                                <IoLogOutOutline size={16} />
                                                &nbsp;Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        )}
                    </nav>

                    {isMobile && isMobileMenuOpen && (
                        <div className="bg-[#231955] text-white p-4 rounded-lg shadow-lg absolute top-16 right-0 w-52">
                            
                            <Dropdown.Link
                                className="block py-2 px-4 text-white rounded-lg mb-2 hover:bg-[#D18C33] flex items-center"
                                href={route("dashboard")}
                            >
                                <MdDashboard size={16}/>
                                
                                &nbsp; Dashboard
                            </Dropdown.Link>
                            <Dropdown.Link
                                className="block py-2 px-4 text-white rounded-lg mb-2 hover:bg-[#D18C33] flex items-center"
                                href={route("post-project")}
                            >
                                <MdOutlinePostAdd size={16}/>
                                &nbsp; Post Project
                            </Dropdown.Link>
                            <Dropdown.Link
                                className="block py-2 px-4 text-white rounded-lg mb-2 hover:bg-[#D18C33] flex items-center"
                                href={route("My-project")}
                            >
                                <BiFolderOpen size={16} />
                                &nbsp; My Project
                            </Dropdown.Link>
                            <Dropdown.Link
                                className="block py-2 px-4 text-white rounded-lg mb-2 hover:bg-[#D18C33] flex items-center"
                                href={route("profile.edit")}
                            >
                                <IoSettingsOutline size={16} />
                                &nbsp; Settings
                            </Dropdown.Link>
                            <Dropdown.Link
                                className="block py-2 px-4 text-white rounded-lg hover:bg-[#D18C33] flex items-center"
                                href={route("logout")}
                                method="post"
                                as="button"
                            >
                                <IoLogOutOutline size={16} />
                                &nbsp; Log Out
                            </Dropdown.Link>
                        </div>
                    )}
                    {!isMobile && searchResults.length > 0 && (
                        <ul className="absolute z-10 top-16 right-80 bg-white w-[18rem] max-h-64 overflow-y-auto border border-gray-300 rounded-lg shadow-lg">
                            {searchResults.map((result) => (
                                <li
                                    key={result.id}
                                    className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelectResult(result)}
                                >
                                    {result.firstName} {result.lastName}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Mobile Search Results Display */}
                    {isMobile && searchResults.length > 0 && (
                        <ul className="absolute z-10 top-16 left-28 bg-white w-[16rem] max-h-64 overflow-y-auto border border-gray-300 rounded-lg shadow-lg">
                            {searchResults.map((result) => (
                                <li
                                    key={result.id}
                                    className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelectResult(result)}
                                >
                                    {result.firstName} {result.lastName}
                                </li>
                            ))}
                        </ul>
                    )}
                </header>
            )}

            <main className="max-w-[1330px] mx-auto mt-4">{children}</main>
        </div>
    );
}
