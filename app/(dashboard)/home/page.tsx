"use client";
import { useEffect, useState,useTransition } from "react";
import { useRouter } from "next/navigation";
import SearchButton from "@/components/elements/SearchButton";



export default function HeroForm() {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();
    const [waiting, setWaiting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [locationInfo, setLocationInfo] = useState<string | null>(null);
    const loading = isPending;

    const slides = [
        "Your Home, Our Priority",
        "Fix It Fast",
        "On-Demand Experts",
        "Service at Your Doorstep",
        "From Mess to Fresh",
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const form = new FormData(e.currentTarget);
        const formData: Record<string, string> = {};

        for (const [key, value] of form.entries()) {
        if (value.toString().trim() !== "") {
            formData[key] = value.toString();
        }
        }
        // ✅ Add locationInfo to formData if it exists
        if (locationInfo) {
            formData["locationInfo"] = locationInfo;
        }
        startTransition(() => {
        router.push("/service?" + new URLSearchParams(formData).toString());
        });
    };

    // fetch api for state and city
    const fetchCityState = async (zip: string): Promise<{ city: string; state: string } | null> => {
        setWaiting(true);
        try {
            const response = await fetch(`https://api.api-ninjas.com/v1/zipcode?zip=${zip}`, {
            headers: {
                'X-Api-Key': 'J2aHdXorMJxPKPzv2u12ig==UTsCBHuqMFaTGIpf', // Replace with your actual API key
            },
            });

            if (!response.ok) {
            throw new Error('Failed to fetch location data');
            }

            const data = await response.json();
            if (data.length > 0) {
            return {
                city: data[0].city,
                state: data[0].state,
            };
            } else {
            return null;
            }
            
        } catch (error) {
            console.error('Error fetching city and state:', error);
            return null;
        }finally {
            setWaiting(false);
        }
    
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
            <span className=" font-bold rounded-full bg-[#0077B6] text-white">US-C</span>
        </p>
         <div className="relative w-full h-20 flex items-center justify-center">
            <p
            className={`text-4xl font-black text-center transition-opacity duration-1000 font- ${
                fade ? "opacity-100" : "opacity-0"
            }`}>
            {slides[index]}
            </p>
        </div>
        <p className="font-bold text-[#0077B6] text-center uppercase">Simplifying Home Services</p>
        {/* carousel */}
        <div className="lg:mx-20 xl:mx-20 md:mx-10 sm:mx-10 my-3">
            <form action="#" onSubmit={handleSubmit}
            className="flex flex-row flex-nowrap border border-gray-200 shadow p-3">
                <div className="flex-[70%]">
                    <input
                    type="search"
                    name="search"
                    id="search"
                    className="outline-none placeholder:font-normal font-bold p-3 m-0 w-full border-r border-gray-200"
                    placeholder="What brings you here?  Share a bit about it..."
                    />
                </div>
                <div className="flex-[20%]">
                    <input
                    type="number"
                    name="zipcode"
                    id="zipcode"
                    className="outline-none placeholder:font-normal font-bold p-3 m-0 w-full"
                    placeholder="Zip Code"
                    onChange={async (e) => {
                    const zip = e.target.value;
                    if (zip.length === 5) {
                    const location = await fetchCityState(zip);
                    if (location) {
                        setLocationInfo("Location: " + location.state + ", " + location.city);
                       
                    } else {
                        setLocationInfo(null);
                    }
                    } else {
                    setLocationInfo(null);
                    }
                }}
                    />
                    
                </div>
                <div className="flex-[10%]">
                    <SearchButton type="Search" loading={loading}/>
                </div>
            </form>
            {waiting ? (
                
                <div role="status">
                    <svg aria-hidden="true" className="w-4 h-4 my-1 text-gray-200 animate-spin dark:text-gray-600 fill-[#0077B6]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>

            ):(
                <p className="text-start text-sm text-green-600 text-md">{locationInfo}</p>
            )}
          
            <small className="text-red">{error}</small>
        </div>
        </>
    );
}