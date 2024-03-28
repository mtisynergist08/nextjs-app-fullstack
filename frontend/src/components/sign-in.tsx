"use client";
import React from "react";
import Image from "next/image";
import cover from "@/../public/cover.jpg";
import { BsDiscord } from "react-icons/bs";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormSchema } from "@/lib/zod-schema/zod-schema";
import z from "zod";

const SignInForm = () => {
  const { push } = useRouter();
  const form = useForm({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof SignInFormSchema>) {
    try {
      await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: "/",
      });
      form.reset();
      push("/");
    } catch (error) {
      console.log(error);
    }
    console.log(values);
  }

  return (
    <section className={"min-h-screen flex items-center justify-center"}>
      {/*login container*/}
      <div className={"bg-cyan-100 p-5 flex rounded-2xl shadow-lg max-w-3xl"}>
        {/*form*/}
        <div className={"sm:w-1/2 px-10"}>
          <h2 className={"font-bold text-2xl text-slate-900"}>Login</h2>
          <p className={"text-slate-600 text-sm mt-2 mb-2"}>
            Login to your account, if you don&apos;t have an account please ask
            administrator.
          </p>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className={"flex flex-col gap-4"}
          >
            <label className={"text-slate-600 mt-4"} htmlFor="email">
              Email
            </label>
            <input
              {...form.register("email")}
              className={"rounded-xl p-2 text-black border border-slate-300"}
              type="email"
              id="email"
              name={"email"}
              placeholder={"Email"}
            />
            {form.formState.errors.email?.message && (
              <p className={"text-red-500 text-xs"}>
                {form.formState.errors.email.message}
              </p>
            )}
            <label htmlFor="password" className={"text-slate-600"}>
              Password
            </label>
            <input
              {...form.register("password")}
              className={"rounded-xl p-2 text-black border border-slate-300"}
              type="password"
              id="password"
              name={"password"}
              placeholder={"Password"}
            />
            {form.formState.errors.password?.message && (
              <p className={"text-red-500 text-xs"}>
                {" "}
                {form.formState.errors.password.message}
              </p>
            )}
            <button
              disabled={form.formState.isSubmitting}
              className={
                "rounded-xl p-2 text-white bg-cyan-500 hover:bg-cyan-600"
              }
            >
              Login
            </button>
          </form>
          <div className={"mt-10 grid grid-cols-3 items-center text-slate-500"}>
            <hr className={"border-slate-500"} />
            <p className={"text-slate-500 text-center text-sm"}>OR</p>
            <hr className={"border-slate-500"} />
          </div>
          <Link href={"/auth/discord"}>
            <button
              className={
                "rounded-xl p-2 text-white mt-4 w-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center"
              }
            >
              <BsDiscord className={"mr-2"} />
              Login with Discord
            </button>
          </Link>
          <Link href={"/forgot-password"}>
            <p className={"text-slate-500 text-right text-sm mt-4"}>
              Forgot password?
            </p>
          </Link>
        </div>
        {/*image container*/}
        <div className={"sm:block hidden w-1/2 "}>
          <Image
            className={"rounded-2xl w-full h-full object-cover"}
            src={cover}
            alt={"image-cover"}
            priority
          />
        </div>
      </div>
    </section>
  );
};
export default SignInForm;
