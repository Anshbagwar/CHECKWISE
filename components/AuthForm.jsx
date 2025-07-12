'use client';
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authFormSchema } from "@/lib/actions/validation";
import { signUp, signIn } from "@/lib/actions/auth.action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { auth } from "@/firebase/client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const AuthForm = ({ type }) => {
  const isSignin = type === "signin";
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (type === "signup") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name,
          email,
        });

        console.log("Signup result:", result); // Debug

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/signin");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in failed. Try again.");
          return;
        }

        await signIn({ email, idToken });
        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.error("Form error:", error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="card-border lg:min-w-[556px] border p-8 rounded-md shadow-md bg-gray-900">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-4 justify-center items-center">
            <img src="/logo.svg" alt="logo" height={32} width={38} />
            <h2 className="text-xl font-semibold text-primary-100">CrackWise</h2>
          </div>

          <h3 className="text-center text-lg">Practice job interview with AI</h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {!isSignin && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormDescription>This will be your public display name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {isSignin ? "Sign In" : "Create Account"}
              </Button>

              <p className="text-center text-sm">
                {isSignin ? (
                  <>
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-500 underline">
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link href="/signin" className="text-blue-500 underline">
                      Sign in
                    </Link>
                  </>
                )}
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
