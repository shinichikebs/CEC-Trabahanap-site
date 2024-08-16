import { useState } from "react";
import { Dropdown, NavLink, TextInput } from "@/Components";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { TbMessageShare } from "react-icons/tb";
import { Link } from '@inertiajs/react';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen">
            <nav className="flex justify-between items-center min-w-full px-6 bg-[#231955] ">
                <img src={`cecLogo.png`} width={70} />
            <ul className="flex items-center justify-between space-x-10 text-white text-sm w-full  mr-16">
                    
                    <li>
                        <Link href={route('dashboard')} className="text-lg font-bold text-[#E8AA42] uppercase tracking-tight">
                            CeC-Trabahanap
                        </Link>
                    </li>
                    <li>
                        <Link href={route('post-project')} className="text-white">
                            Post Project
                        </Link>
                    </li> 
{/* <li>
                        <NavLink
                            href={route("dashboard")}
                            className="text-lg font-bold text-[#E8AA42] uppercase tracking-tight"
                        >
                            CeC-Trabahanap
                        </NavLink>
                    </li>
                    <li>
                    <NavLink to={route('post-project')} className="text-white">
                        Post Project
                    </NavLink>
                    </li> */}
                    {/* <li>Our Jobs</li>
                    <li>About Us</li> */}
                    
                </ul>
                <div className="flex items-center space-x-6">
                    <TbMessageShare size={25} className="text-white" />
                    <IoMdNotificationsOutline
                        size={25}
                        className="text-white"
                    />
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
                                <Dropdown.Link
                                    className="flex items-center mt-4"
                                    href={route("profile.edit")}
                                >
                                    <IoSettingsOutline size={16} />
                                    &nbsp; My Project
                                </Dropdown.Link>
                                <Dropdown.Link
                                    className="flex items-center "
                                    href={route("profile.edit")}
                                >
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
            <main className="max-w-[1330px] mx-auto">{children}</main>
        </div>
    );
}
