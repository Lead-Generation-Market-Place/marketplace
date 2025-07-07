import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import CategoryContentWrapper from "@/components/category/CategoryContentWrapper"; // ✅ new wrapper

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: categoryId } = await params;

  const supabase = await createClient();

  const { data: subcategories, error } = await supabase
    .from("sub_categories")
    .select("*")
    .eq("category_id", categoryId);

  if (error || !subcategories) {
    console.error(error);
    return notFound();
  }

  return <CategoryContentWrapper subcategories={subcategories} />;
}
