// app/actions/checkProfileCompletion.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export const checkProfileCompletion = async () => {
	const supabase = await createClient();

	const { data: { user }, error: userError } = await supabase.auth.getUser();
	if (userError || !user) {
		return { business: false, dub: false, service: false, review: false, background: false };
	}
	const userId = user.id;

	// 1. Business profile
	const { data: business } = await supabase
		.from("service_providers")
		.select("*")
		.eq("user_id", userId)
		.maybeSingle();
	// 2. Availability (provider_business_hours)
	let availability = null;
	const businessId = business?.provider_id;
	if (businessId) {
		const { data } = await supabase
			.from("provider_business_hours")
			.select("provider_id")
			.eq("provider_id", businessId);
		availability = data;
	}

	// 3. Budget (customer_plans)
	let budget = null;
	const { data: budgetData } = await supabase
		.from("customer_plans")
		.select("id")
		.eq("user_id", userId)
		.maybeSingle();
	budget = budgetData;

	// 4. Review (reviews)
	let review = null;
	const { data: reviewData } = await supabase
		.from("reviews")
		.select("providerUser_id")
		.eq("providerUser_id", userId)
		.maybeSingle();
	review = reviewData;

	// 5. Background check (background_checks)
	let background = null;
	const { data: backgroundData } = await supabase
		.from("background_checks")
		.select("id")
		.eq("user_id", userId)
		.maybeSingle();
	background = backgroundData;

	return {
		business: !!business,
		dub: !!availability,
		service: !!budget,
		review: !!review,
		background: !!background,
	};
};
