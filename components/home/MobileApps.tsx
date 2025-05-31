export default function MobileApps() {
    return (
        <div className="flex flex-row h-[75vh] overflow-hidden bg-[#0077B6]/20 p-10">
            <div className="flex-[50%]">
                <div className="w-3/4 mx-auto my-10 flex flex-col justify-center items-start">
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
                <img src="/mobile.svg" alt="mobile" width={500} height={450} />
            </div>
        </div>
    );
}