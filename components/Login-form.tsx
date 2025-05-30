"use client"
import {
  Card,
  CardFooter,
} from "@heroui/card"
import { Input } from "@heroui/input"
import { signInSchema } from "@/Schema/signinSchema"
import { useSignIn } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@heroui/button"
import { AlertCircle, Mail, Lock, Eye, EyeOff, Github } from "lucide-react"
import Link from "next/link"
import { Divider } from "@heroui/divider"
import { CardContent } from "./ui/card"
import { toast } from "react-toastify"

export function LoginForm() {
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
    <div className="flex min-h-screen items-center justify-center p-4 text-black">
      <div className="w-full max-w-screen-sm mx-auto bg-[#ffffff] p-8">
        <Card className="w-full rounded-xl overflow-hidden">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Login to your account</h1>
              <p>Enter your email below to login to your account</p>
            </div>
          </div>

          <Divider />

          <CardContent className="p-6">
            {authError && (
              <div className="bg-danger-50 text-danger-700 p-3 rounded-md mb-4 flex items-center gap-2 text-sm">
                <AlertCircle className="h-5 w-5" />
                <p>{authError}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Button
                className="flex items-center justify-center gap-2 rounded-xl btn text-white  transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </Button>
              <Button
                className="flex items-center justify-center gap-2 rounded-xl btn text-white  transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                <span>Google</span>
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="identifier">Email</label>
                <Input
                  id="identifier"
                  type="email"
                  placeholder="your.email@example.com"
                  startContent={<Mail className="h-4 w-4 text-default-500" />}
                  isInvalid={!!errors.identifier}
                  errorMessage={errors.identifier?.message}
                  {...register("identifier")}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  startContent={<Lock className="h-4 w-4 text-default-500" />}
                  endContent={
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-default-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-default-500" />
                      )}
                    </Button>
                  }
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                  {...register("password")}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full btn"
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>

          <Divider />
          <CardFooter className="p-4 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
