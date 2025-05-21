import { z } from "zod";


export const RulesValidation= z.object({
    email:z.string().email({message:"Please enter a valid email"}).min(1, {message:"Email is required"}).trim(),
    password:z.string().min(8, {message:"Password must be at least 8 characters"}).min(1, {message:"Password is required"})
    .regex(/(?=.*[0-9])/, {message:"Password must contain at least one number"})
    .regex(/(?=.*[a-z])/, {message:"Password must contain at least one lowercase letter"})
    .regex(/(?=.*[A-Z])/, {message:"Password must contain at least one uppercase letter"})
    .regex(/(?=.*[!@#$%^&*])/, {message:"Password must contain at least one special character"})
    .trim(),
    confirmPassword:z.string().min(1, {message:"Confirm Password is required"}).trim()
}).superRefine((val, ctx)=> {
    if(val.password !== val.confirmPassword){
        ctx.addIssue({
            code:z.ZodIssueCode.custom,
            message:"Password do not match",
            path:["confirmPassword"]
});
    }

})