import Image from "next/image";

const MobileApps = () => {
    return (
        <div className="flex my-15 flex-row h-[60vh] overflow-hidden bg-sky-500 p-10 rounded-lg">
            <div className="flex-[50%]">
                <div className="w-3/4 mx-auto my-10 text-white flex flex-col justify-center items-start">
                    <div className="flex flex-row gap-4">
                        <p className="text-xs">Available On</p>
                        <Image
                        src="/apple.svg"
                        width={15}
                        height={15}
                        alt="Professional Image"/>
                        <Image
                        src="/google.svg"
                        width={15}
                        height={15}
                        alt="Professional Image"/>
                    </div>
                    <h1 className="font-semibold mb-4">
                        <p className="text-4xl font-dark">
                            The only app you need to stay on <span className="text-[#0077B6]">top of everything.</span>
                        </p>
                    </h1>
                        <p className="mb-6">
                            From personalized guides to seamless project planning — it’s all in one place, and it’s completely free.
                        </p>
                    <div className="flex flex-row gap-4">
                        <a href="https://apps.apple.com/app/idYOUR_APP_ID" target="_blank" rel="noopener noreferrer">
                            <img src="/app-store.svg" 
                            alt="Download on the App Store" 
                            className="h-12" />
                        </a>

                        <a href="https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE" target="_blank" rel="noopener noreferrer">
                            <img src="/google-play.png" 
                            alt="Get it on Google Play" 
                            className="h-12" />
                        </a>
                    </div>
                </div>

            </div>
            <div className="">
                <img src="/mobile.svg" alt="mobile" width={300} height={250} />
            </div>
        </div>
    );
}

export default MobileApps;