import { Link, Head } from "@inertiajs/react";
import { Navbar } from "@/Components/common";
import { Button, NavLink } from "@/Components"; //single line import 

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };

    return (
        <>
            <Head title="Welcome" />
            <Navbar className={``} />
            <div
                className={`flex justify-around items-center w-full mx-auto lg:max-w-[1340px]`}
            >
                <div className={`space-y-8`}>
                    <h1
                        className={`text-4xl uppercase tracking-wide font-extrabold`}
                    >
                        CEC-NIANS: <br /> Your Gateway to Thriving Opportunities
                    </h1>
                    <p className={`text-gray-500 text-2xl font-medium`}>
                        Unlock a World of Career Advancements and Project
                        Collaborations Tailored to Your Expertise and Passion
                    </p>
                        <div className={`flex items-center space-x-5`}>
                            <NavLink active={false} href={`/register`} className={`bg-[#E8AA42] hover:bg-sky-700 hover:bg-blue-700 rounded-lg w-24 text-center text-white`}>Get Started</NavLink>
                            <a
                                href="https://sites.google.com/view/risk-coders/home"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`border border-black hover:bg-blue-700 rounded-lg h-9 w-24 flex items-center justify-center`}>
                                Learn More
                            </a>
                            {/* <NavLink active={false} href={`https://sites.google.com/view/risk-coders/home`} className={`border border-black rounded-lg w-24 text-center`}>Learn More</NavLink> */}
                        </div>
                    <p className={`text-gray-500 tracking-wide`}>
                        In collaboration with:
                    </p>
                    <div className={`flex items-start space-x-6`}>
                        <img src={`cec.png`} width={50} />
                        <img src={`csd.png`} width={50} />
                    </div>
                </div>
                <img className={`scale-x-[-1]`} src={`programer.gif`} />
            </div>
        </>
    );
}
