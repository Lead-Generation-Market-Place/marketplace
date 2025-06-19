"use client";

import { CheckCircle, Star, UserCheck, DollarSign, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { checkProfileCompletion } from "@/actions/profile-setup";

type TaskKey = "business" | "dub" | "service" | "review" | "background";

interface Task {
	id: number;
	text: string;
	key: TaskKey;
	completed: boolean;
	icon: React.ComponentType<{ size?: number; className?: string }>;
	href?: string;
}

const initialTasks: Task[] = [
	{ id: 1, text: "Fill out your business profile.", key: "business", completed: false, icon: CheckCircle, href: "/dashboard/professional/business-info" },
	{ id: 2, text: "Set Business Availability.", key: "dub", completed: false, icon: CheckCircle, href: "/dashboard/professional/daytime" },
	{ id: 3, text: "Set your budget.", key: "service", completed: false, icon: DollarSign, href: "/dashboard/professional/budget" },
	{ id: 4, text: "Add one past customer review.", key: "review", completed: false, icon: Star, href: "/dashboard/professional/reviews" },
	{ id: 5, text: "Get a background check.", key: "background", completed: false, icon: UserCheck, href: "/dashboard/professional/background-check" },
];

export default function SetupProgress() {
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCompletion = async () => {
			const completion = await checkProfileCompletion();
			setTasks((prev) => prev.map((t) => ({
				...t,
				completed: Boolean(completion[t.key]),
			})));
			setLoading(false);
		};
		fetchCompletion();
	}, []);

	const incompleteCount = tasks.filter((t) => !t.completed).length;
	const progressPercent = (tasks.length - incompleteCount) / tasks.length;
	const radius = 18;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference * (1 - progressPercent);

	return (
		<div className="max-w-4xl mx-auto p-6 font-sans text-gray-900 dark:text-gray-100">
			<div className="flex flex-col md:flex-row items-center gap-10">
				{/* Left side: Progress info and task list */}
				<div className="flex-1 space-y-6 max-w-md w-full">
					{/* Top progress info */}
					<div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-md p-4">
						<svg
							className="w-10 h-10"
							viewBox="0 0 48 48"
							fill="none"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							{/* Background circle */}
							<circle
								cx="24"
								cy="24"
								r={radius}
								stroke="#BFDBFE" // Tailwind blue-300
								strokeWidth="4"
							/>
							{/* Progress arc */}
							<circle
								cx="24"
								cy="24"
								r={radius}
								stroke="#2563EB" // Tailwind [#0077B6]
								strokeWidth="4"
								strokeDasharray={circumference}
								strokeDashoffset={strokeDashoffset}
								strokeLinecap="round"
								transform="rotate(-90 24 24)"
							/>
						</svg>
						<p className="text-base font-normal leading-relaxed">
							{loading ? "Checking setup..." : `Only ${incompleteCount} setup tasks left before you can start getting leads.`}
						</p>
					</div>

					{/* Tasks list */}
					<ul className="divide-y divide-gray-200 dark:divide-gray-700">
						{tasks.map(({ id, text, completed, icon: Icon, href }) => (
							<li key={id} className="flex items-center justify-between py-4">
								<div className="flex items-center gap-3">
									{completed ? (
										<Icon className="text-green-600" size={20} />
									) : (
										<Icon className="text-[#0077B6]" size={20} />
									)}
									{completed ? (
										<span className="text-gray-800 dark:text-gray-300 text-sm font-normal">{text}</span>
									) : href ? (
										<a
											href={href}
											className="text-[#0077B6] dark:text-[#0077B6] hover:underline text-sm font-normal"
										>
											{text}
										</a>
									) : (
										<span className="text-gray-800 dark:text-gray-300 text-sm font-normal">{text}</span>
									)}
								</div>

								{!completed && href && (
									<a
										href={href}
										className="text-[#0077B6] dark:text-[#0077B6] hover:underline"
										aria-label={`Go to ${text}`}
									>
										<ArrowRight size={18} />
									</a>
								)}
							</li>
						))}
					</ul>
				</div>

				{/* Right side: Animated checkmark with pulse */}
				<div className="flex-1 flex justify-center items-center">
					<svg
						className="w-48 h-48 text-[#0077B6] dark:text-[#0077B6]"
						viewBox="0 0 64 64"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						{/* Circle outline */}
						<circle
							cx="32"
							cy="32"
							r="28"
							stroke="currentColor"
							strokeWidth="4"
							strokeLinecap="round"
							className="circle-outline"
						/>
						{/* Checkmark path */}
						<path
							d="M20 34 L28 42 L44 26"
							stroke="currentColor"
							strokeWidth="5"
							strokeLinecap="round"
							strokeLinejoin="round"
							fill="none"
							className="checkmark"
						/>
						<style>
							{`
              .circle-outline {
                stroke-dasharray: 175;
                stroke-dashoffset: 175;
                animation: dash 2s ease forwards;
                transform-origin: 50% 50%;
              }

              .checkmark {
                stroke-dasharray: 40;
                stroke-dashoffset: 40;
                animation: dash-check 2s ease forwards 1.5s;
                transform-origin: 50% 50%;
              }

              @keyframes dash {
                to {
                  stroke-dashoffset: 0;
                }
              }

              @keyframes dash-check {
                to {
                  stroke-dashoffset: 0;
                }
              }

              /* Pulse animation */
              svg {
                animation: pulse 3s ease-in-out infinite;
              }

              @keyframes pulse {
                0%, 100% {
                  transform: scale(1);
                  opacity: 1;
                }
                50% {
                  transform: scale(1.05);
                  opacity: 0.8;
                }
              }
            `}
						</style>
					</svg>
				</div>
			</div>
		</div>
	);
}
