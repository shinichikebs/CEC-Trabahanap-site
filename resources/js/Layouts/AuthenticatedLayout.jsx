import { useState } from "react";
import { Dropdown, NavLink, TextInput } from "@/Components";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiFolderOpen } from "react-icons/bi";
import { TbMessageShare } from "react-icons/tb";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen">
            {/* Wrap the entire navigation in a header */}
            <header className="sticky top-0 bg-[#231955] z-50 shadow-lg">
                <nav className="flex justify-between items-center min-w-full px-6">
                    <img src={`cecLogo.png`} width={70} />
                    <ul className="flex items-center justify-between space-x-10 text-white text-sm w-full mr-16">
                        <li>
                            <NavLink
                                href={route("dashboard")}
                                className="text-lg font-bold text-[#E8AA42] uppercase tracking-tight"
                            >
                                CeC-Trabahanap
                            </NavLink>
                        </li>
                        <li className="flex items-center space-x-4">
                            <form className="flex items-center bg-gray-200 rounded-full px-6 py-0">
                                <button type="button" className="mr-3">
                                    <svg
                                        className="w-5 h-4 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16m-7 6h7"
                                        />
                                    </svg>
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="bg-gray-100 outline-none text-black w-full"
                                />
                                <button type="submit">
                                    <svg
                                        className="w-5 h-4 text-gray-500 ml-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                                        />
                                    </svg>
                                </button>
                            </form>
                            <NavLink href={route('post-project')} className="text-white">
                                Post Project
                            </NavLink>
                        </li>
                    </ul>
                    <div className="flex items-center space-x-6">
                        <TbMessageShare size={25} className="text-white" />
                        <IoMdNotificationsOutline size={25} className="text-white" />
                        <div className="ms-3 relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="transition ease-in-out duration-150"
                                        >
                                            <img
                                                src={
                                                    user.avatar
                                                        ? user.avatar
                                                        : "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"
                                                }
                                                width={35}
                                                className="object-cover rounded-full shadow-md"
                                                draggable="false"
                                            />
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <img
                                        src={
                                            user.avatar
                                                ? user.avatar
                                                : "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"
                                        }
                                        width={80}
                                        className="object-cover rounded-full shadow-md mt-2 border-4 border-green-700"
                                        draggable="false"
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
                </nav>
            </header>

            {/* Main content */}
            <main className="max-w-[1330px] mx-auto mt-4">{children}</main>
        </div>
    );
}
