"use client";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function HeroForm() {
  const [searchKey, setSearchKey] = useState("");
  const [zipCode, setZipcode] = useState("");
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

//   const router = useRouter(); // ✅ Hook at the top level

  const slides = [
    "Your Home, Our Priority",
    "Fix It Fast",
    "On-Demand Experts",
    "Service at Your Doorstep",
    "From Mess to Fresh",
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    // router.push(`/service?searchKey=${encodeURIComponent(searchKey)}&zipCode=${encodeURIComponent(zipCode)}`);
    // Now you have access to searchKey and zipCode
    console.log("Search Key:", searchKey);
    console.log("Zip Code:", zipCode);
    // You can now perform your search logic here
  };


    useEffect(() => {
        // Fade out before changing slide
        const fadeTimeout = setTimeout(() => setFade(false), 2500);
        // Change slide and fade in
        const slideTimeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % slides.length);
        setFade(true);
        }, 3000);

        return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(slideTimeout);
        };
    }, [index]);
  
    return (
        <>
        {/* carousel */}
        <p className="text-center mt-4">
            <span className="p-2 font-bold rounded-full bg-[#0077B6] text-white">US-C</span>
        </p>
         <div className="relative w-full h-20 flex items-center justify-center">
            <p
            className={`text-4xl font-bold text-center transition-opacity duration-1000 font- ${
                fade ? "opacity-100" : "opacity-0"
            }`}>
            {slides[index]}
            </p>
        </div>
        <p className="font-bold text-[#0077B6] font-bold text-center uppercase">Simplifying Home Services</p>
        {/* carousel */}
        <div className="lg:mx-50 xl:mx-50 md:mx-30 sm:mx-10 my-3">
            <form action="#" onSubmit={handleSubmit}
            className="flex flex-row flex-nowrap border border-gray-200 shadow p-3">
                <div className="flex-[70%]">
                    <input
                    type="search"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    className="outline-none placeholder:font-normal font-bold p-3 m-0 w-full border-r border-gray-200"
                    placeholder="What brings you here?  Share a bit about it..."
                    />
                </div>
                <div className="flex-[20%]">
                    <input
                    type="number"
                    value={zipCode}
                    onChange={(e) => setZipcode(e.target.value)}
                    className="outline-none placeholder:font-normal font-bold p-3 m-0 w-full"
                    placeholder="Zip Code"
                    />
                </div>
                <div className="flex-[10%]">
                    <button
                    type="submit"
                    className="px-4 py-3 bg-[#0077B6] hover:bg-[#0096C7] text-white font-semibold shadow w-full"
                    >
                    Search
                    </button>
                </div>
            </form>
        </div>
        </>
    );
}