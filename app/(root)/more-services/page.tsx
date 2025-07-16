import CategoryContentWrapper from "@/components/category/CategoryContentWrapper";
import { createClient } from "@/utils/supabase/server";


export default async function MoreServicePage() {
   
    const supabase = await createClient();
    const { data: subcategories, error } = await supabase
    .from("sub_categories")
    .select("*")
    .order("id", { ascending: true });
    
    
    if(error){
        console.error("Error Fetch sub Categories: ", error);
    }
   
  return <CategoryContentWrapper subcategories={subcategories ?? []} />
;
}
