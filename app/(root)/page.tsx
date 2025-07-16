import { createClient } from '@/utils/supabase/server';
import LazyHomeContent from './LazyHomeContent';

export default async function Page() {
  const supabase = await createClient();

  const { data: promotionsRaw } = await supabase
  .from("promotion")
  .select(`
    id,
    description,
    image_url,
    categories (
      id,
      name
    )
  `);

  const promotions = (promotionsRaw || []).map((promo) => {
    const { data: imageData } = supabase.storage
      .from("promotionimage")
      .getPublicUrl(promo.image_url || "");

    const category = Array.isArray(promo.categories)
      ? promo.categories[0]
      : promo.categories;

    return {
      id: String(promo.id),
      description: promo.description,
      imageUrl: imageData?.publicUrl || "/images/default-promo.jpg",
      categories: {
        id: String(category?.id ?? ''),
        name: String(category?.name ?? 'Uncategorized').trim(),
      },
    };
  });






  const { data: popularServicesRaw } = await supabase.from('services').select('*');
  const { data: exploreRaw } = await supabase
  .from("sub_categories")
  .select(`
    id,
    name,
    image_url,
    description,
    services (
      id,
      name,
      service_image_url
    )
  `).limit(4);
  const { data: youMayLikeRaw } = await supabase.from('services').select('*');
  const { data: costEstimates } = await supabase.from('service_providers').select('*');
  const { data: locations } = await supabase.from('state').select('*');
  const { data: reviews } = await supabase
  .from('testimonials')
  .select(`
    id,
    review,
    created_at,
    users_profiles (
      username
    )
  `);

  



  const flattenedReviews = (reviews || []).map((review) => ({
    ...review,
    users_profiles: Array.isArray(review.users_profiles)
      ? review.users_profiles[0] // flatten the array
      : review.users_profiles,
  }));


  //Generate the public url for the sub_category and its services image_url
  const explore = (exploreRaw || []).map((subcategory) => {
    const { data: subImg } = supabase.storage
      .from("subcategoryimage")
      .getPublicUrl(subcategory.image_url || "");

    const services = (subcategory.services || []).map((service) => {
      const { data: serviceImg } = supabase.storage
        .from("serviceslogos")
        .getPublicUrl(service.service_image_url || "");

      return {
        id: service.id,
        name: service.name,
        imageUrl: serviceImg?.publicUrl || "/images/image4.jpg",
      };
    });

    return {
      id: subcategory.id,
      name: subcategory.name,
      imageUrl: subImg?.publicUrl || "/images/image4.jpg",
      description: subcategory.description || "",
      services,
    };
  });


  const popularServices = popularServicesRaw?.map(service => {
    const { data: urlData} = supabase.storage
      .from('serviceslogos')
      .getPublicUrl(service.service_image_url);

    return { ...service, imageUrl: urlData?.publicUrl ?? '' };
  }) || [];

  const youMayLike = youMayLikeRaw?.map(service => {
    const { data: urlData} = supabase.storage
      .from('serviceslogos')
      .getPublicUrl(service.service_image_url);
    return { ...service, imageUrl: urlData?.publicUrl ?? '' };
    
  }) || [];

  return (
    <LazyHomeContent
      promotions={promotions || []}
      popularServices={popularServices}
      youMayLike={youMayLike}
      explore={explore || []}
      costEstimates={costEstimates || []}
      locations={locations || []}
      reviews={flattenedReviews || []}
    />
  );
}
