import { Link, Head } from "@inertiajs/react";
import { Navbar } from "@/Components/common";
import { Button } from "@/Components";

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
                    <Button
                        className={`bg-[#E8AA42] p-2 rounded-lg w-32 text-white`}
                    >
                        Get Started
                    </Button>
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
