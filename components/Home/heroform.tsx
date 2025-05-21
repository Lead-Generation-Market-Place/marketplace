"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import stringSimilarity from "string-similarity";
type category = {
    id:number,
    name:string
}
export default function HeroForm(){
    const [searchKey, setSearchKey] = useState("")
    const [selected, setSelected] = useState<number[]>([]);
    const [categories, setCategories] = useState<category[]>([])
    const [zipCode, setZipcode] = useState("")
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const slides = [
    "Your Home, Our Priority",
    "Fix It Fast",
    "On-Demand Experts",
    "Service at Your Doorstep",
    "From Mess to Fresh",
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    // Now you have access to searchKey and zipCode
    console.log("Search Key:", searchKey);
    console.log("Zip Code:", zipCode);
    // You can now perform your search logic here
    fetchCategories()
    };

    const handleCheckboxChange = (id:number) => {
        setSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // selected contains the checked data.id's
    console.log(selected);
    // Do what you want with selected
  };

    async function fetchCategories() {
        const {data} = await createClient().from('category').select("*");
        setCategories(data ?? [])
    }
        
   
    // When the user submits a description as searchKey:
    const filtered = categories.filter(cat =>
    cat.name &&
    stringSimilarity.compareTwoStrings(
        cat.name.toLocaleLowerCase(),
        searchKey.toLocaleLowerCase()
    ) > 0.3 // You can adjust the threshold
    );


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
            <span className="p-2 font-bold rounded-full bg-blue-500 text-white">US-C</span>
        </p>
         <div className="relative w-full h-20 flex items-center justify-center">
            <p
            className={`text-4xl font-bold text-center transition-opacity duration-1000 ${
                fade ? "opacity-100" : "opacity-0"
            }`}>
            {slides[index]}
            </p>
        </div>
        <p className="font-bold text-blue-500 font-bold text-center uppercase">Simplifying Home Services</p>
        {/* carousel */}
        <div className="flex items-start justify-center pt-10">
            <div className="w-2/3 border">
                <form 
                onSubmit={handleSubmit}
                action="#" 
                className="flex flex-row flex-nowrap items-center border border-gray-300 shadow">
                <input
                    type="search"
                    value={searchKey}
                    onChange={(e)=> setSearchKey(e.target.value)}
                    className="outline-none p-3 border-r border-gray-300 flex-[8]"
                    placeholder="What brings you here?  Share a bit about it..."
                />
                <input
                    type="number"
                    value={zipCode}
                    onChange={(e)=> setZipcode(e.target.value)}
                    className="outline-none border-none p-3 flex-1"
                    placeholder="Zip Code"
                />
                <button type="submit" className="px-4 py-3 bg-blue-500 text-white font-semibold shadow flex-1">
                    Search
                </button>
                </form>
            </div>
        </div>
        {filtered.length > 0 && (
        <ul className="flex flex-col items-center justify-center">
                <p className="font-bold">Search Result</p>
                <form action="#" onSubmit={handleNext}>
                    {filtered.map((data, idx) => (
                    <li key={idx}>
                        <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            value={data.id}
                            checked={selected.includes(data.id)}
                            onChange={() => handleCheckboxChange(data.id)}
                        />
                        {data.name}
                        </label>
                    </li>
                    ))}
                    <button
                    type="submit"
                    className="bg-blue-500 px-4 py-3 text-white font-semibold mt-4"
                    >
                    Next
                    </button>
                </form>
            </ul>
            
        )}
            

        </>
    );
}