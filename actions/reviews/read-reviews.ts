// app/actions/reviews/read-reviews.ts
import { createClient } from "@/utils/supabase/server";

export type RedReviewsResult =
  | {
      status: "success";
      userId: string;
      totalReviews: number;
      averageRating: number;
      ratingPercent: number; // added
    }
  | {
      status: "error";
      message: string;
      code: string;
    };

export async function RedReviews(): Promise<RedReviewsResult> {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return {
      status: "error",
      message: `Failed to get user: ${userError?.message}`,
      code: "AUTH_ERROR",
    };
  }

  const userId = userData.user.id;

  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("rating")
    .eq("providerUser_id", userId);

  if (reviewsError) {
    return {
      status: "error",
      message: `Failed to fetch reviews: ${reviewsError.message}`,
      code: "REVIEWS_FETCH_FAILED",
    };
  }

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviews
      : 0;

  return {
    status: "success",
    userId,
    totalReviews,
    averageRating: Number(averageRating.toFixed(2)),
    ratingPercent: totalReviews > 0 ? (averageRating / 5) * 100 : 0,
  };
}
