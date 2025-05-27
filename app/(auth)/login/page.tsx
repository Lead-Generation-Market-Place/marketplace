import LoginForm from "@/components/auth/LoginForm";
import LoginGithub from "@/components/auth/LoginGithub";
import Google from '@/components/auth/Google'
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <div className="w-full flex justify-center">
        <section className="flex flex-col w-[400px]">
     
          <LoginForm />
          <LoginGithub />
          <Google />

          <div className="mt-2 flex items-center text-gray-600 text-[14px] justify-center">
            <h1>{`Don't have an account?`}</h1>
            <Link className="font-bold ml-2" href="/register">
              Sign Up
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
