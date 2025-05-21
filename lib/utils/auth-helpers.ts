import { createClient } from "@/utils/supabase/client";



export async function verifyOtp()
{

}


export async function login(email: string, password: string)
{
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    }); 
    if (error) {
        throw new Error(error.message);
    }
    return data;
}



export async function logout()
{
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw new Error(error.message);
    }
}






export async function updatePassword(password: string)
{
 const supabase = createClient();
 const { error } = await supabase.auth.updateUser({
  password
 });
    if (error) {    
     throw new Error(error.message);
    }
}


/// get data from user table