import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Mail, ShieldCheck, Twitter } from "lucide-react";

const Footer = () => {
    return (
        <div className="px-6 pt-6 bg-white border-t border-gray-100">
            <div className="flex flex-row flex-wrap gap-4 justify-between w-full max-w-6xl mx-auto text-xs">
                <ul>
                    <li className="py-2">
                        <Link href="/" className="text-gray-400">
                             <Image
                            src={`/us-connector.png`} 
                            width={100}
                            height={100}
                            alt="logo"
                            className="w-12 h-8 object-cover flex-1"/>
                        </Link>
                    </li>
                    <li className="py-2">
                        <h6 className="text-xs font-semibold">Download App</h6>
                        <div className="flex flex-row gap-4">
                            <Link href="https://apps.apple.com/app/idYOUR_APP_ID">
                            <Image src="/apple-black.svg" width={12} height={12} alt="App Store"/>
                            </Link>
                            <Link href="https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE">
                            <Image src="/play-store.svg" width={12} height={12} alt="Google Play"/>
                            </Link>
                            <span className="text-xs font-semibold">Available</span>
                        </div>
                    </li>
                    <li className="py-2">
                        <h6 className="text-xs font-semibold">Follow us on</h6>
                        <div className="flex flex-row gap-2">
                            <Link href="/"><Facebook className="w-4 h-4 hover:text-sky-500" /></Link>
                            <Link href="/"><Instagram className="w-4 h-4 hover:text-pink-500" /></Link>
                            <Link href="/"><Linkedin className="w-4 h-4 hover:text-sky-600" /></Link>
                            <Link href="/"><Mail className="w-4 h-4 hover:text-orange-400" /></Link>
                            <Link href="/"><Twitter className="w-4 h-4 hover:text-blue-500" /></Link>
                        </div>
                    </li>
                </ul>
                <ul>
                    <li className="py-2 font-semibold">Customers</li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500">How to use US-Connector</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500">Trending Services</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500">Service Near me</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500">New Services For you</Link></li>
                </ul>
                <ul>
                    <li className="py-2 font-semibold">Pros</li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500">US-Connector for Pros</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500">Sign Up as Pro</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500">Pro review</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500">Pro App for iPhone</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500">Pro App for Android</Link></li>
                </ul>
                <ul>
                    <li className="py-2 font-semibold">Support</li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500">Terms of Use</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500">Privacy Policy</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500">Contact Us</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500">About Us</Link></li>
                    <li className="py-1"><Link href="/" className="text-gray-400 hover:text-sky-500">Service Desk</Link></li>
                </ul>
            </div>
            <div className="p-2 border-t border-gray-100 flex flex-wrap justify-around text-center items-center">
                <p className="text-sm">&copy;2023 US-Connector. All rights reserved.</p>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-sky-100 bg-sky-500 px-[3px] py-[2px] rounded-full" />
                    <span className="text-sm font-semibold">USC Guarantee</span>
                </div>
            </div>
        </div>
    );
}
export default Footer;