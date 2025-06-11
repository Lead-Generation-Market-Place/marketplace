import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Mail, Twitter } from "lucide-react";

const Footer = () => {
    return (
        <footer className="px-6 pt-6 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="flex flex-col md:flex-row flex-wrap gap-6 md:gap-4 justify-between w-full max-w-6xl mx-auto text-xs">
                <ul className="mb-4 md:mb-0 min-w-[180px]">
                    <li className="py-2">
                        <Link href="/" className="text-gray-400">
                            <Image
                                src={`/yelpax.png`}
                                width={100}
                                height={100}
                                alt="logo"
                                className=" object-cover flex-1"
                            />
                        </Link>
                    </li>
                    <li className="py-2">
                        <h6 className="text-xs font-semibold text-gray-800 dark:text-gray-200">Download App</h6>
                        <div className="flex flex-row gap-4 items-center">
                            <Link href="https://apps.apple.com/app/idYOUR_APP_ID">
                                <Image src="/apple-black.svg" width={16} height={16} alt="App Store" />
                            </Link>
                            <Link href="https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE">
                                <Image src="/play-store.svg" width={16} height={16} alt="Google Play" />
                            </Link>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Available</span>
                        </div>
                    </li>
                    <li className="py-2">
                        <h6 className="text-xs font-semibold text-gray-800 dark:text-gray-200">Follow us on</h6>
                        <div className="flex flex-row gap-2">
                            <Link href="/"><Facebook className="w-4 h-4 hover:text-sky-500 transition-colors" /></Link>
                            <Link href="/"><Instagram className="w-4 h-4 hover:text-pink-500 transition-colors" /></Link>
                            <Link href="/"><Linkedin className="w-4 h-4 hover:text-sky-600 transition-colors" /></Link>
                            <Link href="/"><Mail className="w-4 h-4 hover:text-orange-400 transition-colors" /></Link>
                            <Link href="/"><Twitter className="w-4 h-4 hover:text-blue-500 transition-colors" /></Link>
                        </div>
                    </li>
                </ul>
                <ul className="mb-4 md:mb-0 min-w-[150px]">
                    <li className="py-2 font-semibold text-gray-800 dark:text-gray-200">Customers</li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">How to use US-Connector</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Trending Services</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Service Near me</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">New Services For you</Link></li>
                </ul>
                <ul className="mb-4 md:mb-0 min-w-[150px]">
                    <li className="py-2 font-semibold text-gray-800 dark:text-gray-200">Pros</li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">US-Connector for Pros</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Sign Up as Pro</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Pro review</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Pro App for iPhone</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Pro App for Android</Link></li>
                </ul>
                <ul className="mb-4 md:mb-0 min-w-[150px]">
                    <li className="py-2 font-semibold text-gray-800 dark:text-gray-200">Support</li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Terms of Use</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Privacy Policy</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Contact Us</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">About Us</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Service Desk</Link></li>
                </ul>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row flex-wrap gap-2 justify-between text-center items-center max-w-6xl mx-auto">
                <p className="text-sm text-gray-800 dark:text-gray-300">&copy;2023 US-Connector. All rights reserved.</p>
                <div className="flex items-center gap-2">
                    <Image src="/y-logo.png" width={50} height={30} alt="logo"/>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Yepax Guarantee</span>
                </div>
            </div>
        </footer>
    );
}
export default Footer;