'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const defaultSchedule = [
	{ dayOfWeek: 0, day: 'Sunday', shifts: [{ openTime: '00:00', closeTime: '00:00', isClosed: true }] },
	{ dayOfWeek: 1, day: 'Monday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
	{ dayOfWeek: 2, day: 'Tuesday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
	{ dayOfWeek: 3, day: 'Wednesday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
	{ dayOfWeek: 4, day: 'Thursday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
	{ dayOfWeek: 5, day: 'Friday', shifts: [{ openTime: '09:00', closeTime: '17:00', isClosed: false }] },
	{ dayOfWeek: 6, day: 'Saturday', shifts: [{ openTime: '00:00', closeTime: '00:00', isClosed: true }] },
];

const generateTimeOptions = () => {
	const times = [];
	for (let h = 0; h < 24; h++) {
		for (let m = 0; m < 60; m += 30) {
			times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
		}
	}
	return times;
};

const timeOptions = generateTimeOptions();

export interface SaveAvailabilityResult {
	status: 'success' | 'error';
	message: string;
	details?: string | null;
}

export default function AvailabilityForm({
	saveAvailability,
}: {
	saveAvailability: (formData: FormData) => Promise<SaveAvailabilityResult>;
}) {
	const [selectedOption, setSelectedOption] = useState<'business' | 'any'>('business');
	const [schedule, setSchedule] = useState(defaultSchedule);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const handleTimeChange = (
		dayIndex: number,
		shiftIndex: number,
		type: 'openTime' | 'closeTime',
		value: string
	) => {
		setSchedule((prev) => {
			const newSchedule = prev.map((day, i) => {
				if (i !== dayIndex) return day;
				return {
					...day,
					shifts: day.shifts.map((shift, j) => {
						if (j !== shiftIndex) return shift;
						return {
							...shift,
							[type]: value,
							// If time is changed to something other than '00:00', mark isClosed false
							isClosed: value !== '00:00' ? false : shift.isClosed,
						};
					}),
				};
			});
			return newSchedule;
		});
	};

	const handleAvailabilityToggle = (dayIndex: number, shiftIndex: number) => {
		setSchedule((prev) => {
			const newSchedule = prev.map((day, i) => {
				if (i !== dayIndex) return day;
				const newDay = { ...day };
				newDay.shifts = day.shifts.map((shift, j) => {
					if (j !== shiftIndex) return shift;
					const isClosed = !shift.isClosed;
					return {
						...shift,
						isClosed,
						openTime: isClosed ? '00:00' : '09:00',
						closeTime: isClosed ? '00:00' : '17:00',
					};
				});
				return newDay;
			});
			return newSchedule;
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData();
		formData.set('availabilityType', selectedOption);
		formData.set('timezone', timezone);

		let finalSchedule = schedule;
		if (selectedOption === 'any') {
			finalSchedule = defaultSchedule.map((day) => ({
				...day,
				shifts: [{ openTime: '00:00', closeTime: '23:59', isClosed: false }],
			}));
		}

		formData.set('schedule', JSON.stringify(finalSchedule));

		startTransition(async () => {
			const result = await saveAvailability(formData);
			if (result.status === 'success') {
				router.push('/professional/daytime/success');
			} else {
				alert(`Error: ${result.message}`);
			}
		});
	};

	return (
		<div className="flex items-center justify-center text-[13px] bg-white dark:bg-gray-900">
			<div className="w-full max-w-4xl border border-gray-200 dark:border-gray-700 shadow-sm rounded-[7px] overflow-hidden">
				<form onSubmit={handleSubmit} className="p-8 md:p-10 bg-white dark:bg-gray-900">
					<h2 className="text-2xl font-bold text-[#023E8A] dark:text-white mb-3">Set your availability</h2>
					<p className="text-gray-600 dark:text-gray-300 text-[13px] mb-5">
						Customers will only request jobs during the times you set.
					</p>

					<div className="space-y-4">
						{/* Business Hours Option */}
						<div
							className={`border rounded-[4px] cursor-pointer p-4 ${
								selectedOption === 'business'
									? 'border-[#0077B6]'
									: 'border-gray-300 dark:border-gray-700'
							}`}
							onClick={() => setSelectedOption('business')}
						>
							<div className="flex items-center space-x-2 mb-4">
								<input
									type="radio"
									checked={selectedOption === 'business'}
									readOnly
									className="accent-[#0077B6]"
								/>
								<span className="font-medium text-gray-900 dark:text-gray-100">Set Business Availability</span>
							</div>

							{selectedOption === 'business' && (
								<div className="space-y-3">
									{schedule.map((day, dayIndex) => (
										<div
											key={day.dayOfWeek}
											className="flex items-center gap-4 border-b py-2 last:border-none border-gray-200 dark:border-gray-700"
										>
											<label
												className="flex items-center text-gray-700 dark:text-gray-300 cursor-pointer min-w-[80px]"
												htmlFor={`closed-${day.dayOfWeek}`}
											>
												<input
													id={`closed-${day.dayOfWeek}`}
													type="checkbox"
													checked={day.shifts[0].isClosed === true}
													onChange={() => handleAvailabilityToggle(dayIndex, 0)}
													className="mr-2"
												/>
												Closed
											</label>

											<span className="min-w-[80px] text-gray-900 dark:text-gray-100 font-medium">{day.day}</span>

											{!day.shifts[0].isClosed && (
												<div className="flex items-center gap-2">
													<select
														value={day.shifts[0].openTime}
														onChange={(e) =>
															handleTimeChange(dayIndex, 0, 'openTime', e.target.value)
														}
														className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
													>
														{timeOptions.map((time) => (
															<option key={time} value={time}>
																{time}
															</option>
														))}
													</select>

													<span className="mx-1 text-gray-500 dark:text-gray-400">to</span>

													<select
														value={day.shifts[0].closeTime}
														onChange={(e) =>
															handleTimeChange(dayIndex, 0, 'closeTime', e.target.value)
														}
														className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
													>
														{timeOptions.map((time) => (
															<option key={time} value={time}>
																{time}
															</option>
														))}
													</select>
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>

						{/* Available Any Time Option */}
						<div
							className={`border rounded-[4px] cursor-pointer p-4 ${
								selectedOption === 'any'
									? 'border-[#0077B6]'
									: 'border-gray-300 dark:border-gray-700'
							}`}
							onClick={() => setSelectedOption('any')}
						>
							<div className="flex items-center space-x-2">
								<input
									type="radio"
									checked={selectedOption === 'any'}
									readOnly
									className="accent-[#0077B6]"
								/>
								<span className="font-medium text-gray-900 dark:text-gray-100">Available Any Time</span>
							</div>

							{selectedOption === 'any' && (
								<p className="mt-4 text-green-600 dark:text-green-400">
									You will be available 24 hours, every day.
								</p>
							)}
						</div>
					</div>

					<button
						type="submit"
						disabled={isPending}
						className="mt-8 w-full rounded-[4px] border border-[#0077B6] bg-[#0077B6] text-white text-[13px] font-semibold leading-5 py-3 hover:bg-[#005f8c]"
					>
						{isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> : 'Save Availability'}
					</button>
				</form>
			</div>
		</div>
	);
}
