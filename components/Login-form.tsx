"use client"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/Schema/signinSchema"
import { useSignIn } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { AlertCircle, Mail, Lock, Eye, EyeOff, Github } from "lucide-react"
import Link from "next/link"
import { toast } from "react-toastify"
import { Label } from "./ui/label"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();

  const [isSubmitting, setisSubmitting] = useState(false);
  const [authError, setauthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {

    if (!isLoaded) { return; }
    setisSubmitting(true);
    setauthError(null);

    try {
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Sign-in incomplete:", result);
        setauthError("Sign-in could not be completed. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Error in login:", error);
      toast.error("Error in login");
      setauthError(
        error instanceof Error ? error.message : "An error occurred during sign-in. Please try again."
      );
    } finally {
      setisSubmitting(false);
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-[#171717] text-white">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="identifier"
                  type="email"
                  placeholder="your.email@example.com"
                  {...register("identifier")}
                  className="w-full rounded-lg bg-[#222222] outline-none focus:outline-none ring-0 focus:ring-0 select-none"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forget-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="w-full outline-none focus:outline-none ring-0 focus:ring-0 select-none bg-[#222222] rounded-md pr-10"
                  />
                  <Button
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#222222] hover:bg-[#222222] outline-none focus:outline-none ring-0 focus:ring-0"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-default-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-default-500" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  variant="default"
                  className="w-full btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Login"}
                </Button>
                <Button variant="outline" className="w-full text-black">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm flex justify-between items-center">
              Don&apos;t have an account?
              <Link href="/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
