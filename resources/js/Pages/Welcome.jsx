import { Link, Head } from "@inertiajs/react";
import { Navbar } from "@/Components/common";
import { Button, NavLink } from "@/Components";

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

            {/* Desktop Layout */}
            <div className="hidden lg:flex justify-around items-center w-full mx-auto lg:max-w-[1340px]">
                <div className="space-y-8">
                    <h1 className="text-[#1632b9] text-4xl uppercase tracking-wide font-extrabold text-center">
                        CeCNIAN: Your Gateway to Thriving Opportunities
                    </h1>
                    <p className="text-[gray] text-2xl font-medium text-center">
                        Unlock a World of Career Advancements and Project Collaborations Tailored to Your Expertise and Passion.
                    </p>
                    <div className="flex items-center space-x-11 justify-center">
                        <NavLink active={false} href={`/register`} className="bg-[#E8AA42] hover:bg-sky-700 hover:bg-blue-700 rounded-lg w-24 text-center text-white">
                            Get Started
                        </NavLink>
                        <a href="https://sites.google.com/view/risk-coders/home" target="_blank" rel="noopener noreferrer" className="border border-black hover:bg-blue-700 rounded-lg h-9 w-24 flex items-center justify-center">
                            Learn More
                        </a>
                    </div>
                    <p className="text-[#092199] tracking-wide text-center"><br /> In collaboration with:</p>
                    <div className="flex items-start space-x-6 justify-center">
                        <img src={`cec.png`} width={60} alt="CEC Logo" />
                        <img src={`csd.png`} width={60} alt="CSD Logo" />
                    </div>
                </div>
                
                <img id="job-gif" className="scale-x-[-1]" src="job.gif" width={600} height={600} onError={handleImageError} alt="Job illustration" style={{ width: "700px", height: "700px", objectFit: "cover" }} />
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col items-center w-full px-4">
                <div className="space-y-4 text-center">
                    <h1 className="text-[#1632b9] text-3xl uppercase tracking-wide font-extrabold">
                        CeCNIAN: Your Gateway to Thriving Opportunities
                    </h1>
                    <p className="text-[gray] text-lg font-medium">
                        Unlock a World of Career Advancements and Project Collaborations Tailored to Your Expertise and Passion.
                    </p>
                </div>

                <img id="job-gif" className="mt-6" src="job.gif" width={300} height={300} onError={handleImageError} alt="Job illustration" style={{ width: "350px", height: "350px", objectFit: "cover" }} />

                <div className="flex flex-col items-center space-y-4 mt-6">
                    <NavLink active={false} href={`/register`} className="bg-[#E8AA42] hover:bg-sky-700 hover:bg-blue-700 rounded-lg w-32 text-center text-white py-2">
                        Get Started
                    </NavLink>
                    <a href="https://sites.google.com/view/risk-coders/home" target="_blank" rel="noopener noreferrer" className="border border-black hover:bg-blue-700 rounded-lg h-10 w-32 flex items-center justify-center">
                        Learn More
                    </a>
                </div>

                <p className="text-[#092199] tracking-wide mt-4 ">In collaboration with:</p>
                <div className="flex items-center space-x-4 justify-center mt-2">
                    <img src={`cec.png`} className="w-12" alt="CEC Logo" />
                    <img src={`csd.png`} className="w-12" alt="CSD Logo" />
                    
                    
                </div>
                <br />
                <br /><br />
            </div>

            {/* Footer Section */}
            <footer className="bg-[#231955] text-white py-4 text-center mt-8">
                <p className="text-sm">© 2024 CeCNIAN. All rights reserved.</p>
            </footer>
        </>
    );
}
