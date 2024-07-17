import { Button } from "@/./Components"; //all exports under Components/index.js

export default function Navbar({ className = "", ...props }) {
    return (
        <div
            {...props}
            className={
                `bg-[#231955] w-full flex justify-between items-center p-6 mx-auto` +
                className
            }
        >
            <ul className={`flex items-center space-x-10 text-white text-sm`}>
                <h1 className={`text-2xl font-semibold text-[#E8AA42]`}>
                    CeC-Trabahanap
                </h1>
                <li>Find Work</li>
                <li>Our Jobs</li>
                <li>About Us</li>
            </ul>
            <div className={`flex items-center space-x-8 text-white text-sm`}>
                <Button>
                    <a href="/login">Log in</a>
                </Button>
                <Button className={`bg-[#E8AA42] p-2 rounded-lg w-24`}>
                    <a href="/register">Sign Up</a>
                </Button>
            </div>
        </div>
    );
}
