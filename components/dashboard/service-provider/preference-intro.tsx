import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Phone, Check } from "lucide-react";
import { useRouter } from "next/navigation";

// Reusable User Badge Component
const UserBadge = ({ initials, name, time }: { initials: string; name: string; time: string }) => (
  <div className="flex items-center space-x-2">
    <div className="w-9 h-9 bg-[#d7f1ff] dark:bg-[#023e8a] text-[#0077B6] dark:text-[#90e0ef] flex items-center justify-center rounded-full font-semibold text-sm">
      {initials}
    </div>
    <div>
      <h2 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{name}</h2>
      <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
    </div>
  </div>
);

// Reusable Detail Item Component with colorful icons
const DetailItem = ({ icon: Icon, text, color }: { icon: React.ElementType; text: string; color: string }) => (
  <div className="flex items-center text-gray-600 dark:text-gray-300 text-xs">
    <Icon className={`w-4 h-4 mr-2 ${color}`} />
    {text}
  </div>
);

// Reusable Preference List Component with colorful check icon
// Reusable Preference List Component with Check Icon inside Circle
const PreferenceList = ({ items }: { items: string[] }) => (
  <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
    {items.map((item, index) => (
      <li key={index} className="flex items-center">
        <div className="w-5 h-5 flex items-center justify-center bg-[#d7f1ff] dark:bg-[#023e8a] rounded-full mr-2">
          <Check className="w-3 h-3 text-[#0077B6] dark:text-[#90e0ef]" />
        </div>
        {item}
      </li>
    ))}
  </ul>
);
export default function WorkControlCard() {
const router = useRouter();

  const handleNext = () => {
    // Logic to handle next action}
    router.push(`/professional/daytime?`);

  }
  const handleBack = () => {
    router.push(`/professional/progress?`);


  }
  return (
    <div className="flex items-center justify-center md:p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-6xl w-full ">
        {/* Left Section */}
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
            Control where, when, <br /> and how you work.
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md">
            Your leads match your availability, work areas, and other preferences. Stay flexible and in control.
          </p>
        </div>

        {/* Right Section */}
        <Card className=" dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="py-2 px-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <UserBadge initials="AJ" name="Alex J." time="1m ago" />
              <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-full">
                Exact match
              </span>
            </div>

            {/* Service Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">House cleaning</h3>
              <DetailItem icon={MapPin} text="Graham, WA 98338" color="text-blue-500 dark:text-blue-300" />
              <DetailItem icon={Calendar} text="Monday mornings" color="text-purple-500 dark:text-purple-300" />
              <DetailItem icon={Phone} text="xxx-xxx-9875" color="text-green-500 dark:text-green-300" />
            </div>

            {/* Preferences */}
            <PreferenceList
              items={[
                "1 bedroom",
                "Bathrooms: 2 bathrooms",
                "Frequency: Recurring",
                "Property type: Residential",
              ]}
            />
          </CardContent>
        </Card>
      </div>
            {/* Back and Next Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-4">
        <button
          onClick={handleBack}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold px-6 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-[#0077B6] text-white font-semibold px-6 py-2 rounded hover:bg-[#005f91] transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
