"use client"
import { useForm } from "react-hook-form"
import { useSignUp } from "@clerk/nextjs"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "@/Schema/signupSchema"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Eye,
    EyeOff,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "react-toastify"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./InputOTP"

export default function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const [Verifying, setVerifying] = useState(false);
    const [VerificationError, setVerificationError] = useState<string | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [VerificationCode, setVerificationCode] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signUp, isLoaded, setActive } = useSignUp();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        if (!isLoaded) {
            setAuthError("Authentication service is not ready. Please try again.");
            return;
        }
        setIsSubmitting(true);
        setAuthError(null);

        try {
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });
            setVerifying(true);
        } catch (error) {
            console.error("Signup error:", error, VerificationError);
            setAuthError(
                "An error occurred during signup. Please try again."
            )
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleVerificationSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (!isLoaded || !signUp) return;

        setIsSubmitting(true);
        setVerificationError(null);

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: VerificationCode,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            } else {
                setVerificationError(`Verification incomplete: status was "${result.status}"`);
            }
        } catch (error) {
            console.error("Verification error:", error);
            setVerificationError(
                (error as Error).message || "An unexpected error occurred during verification."
            );
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const resendCode = async () => {
        if (!signUp) return;
        setVerificationCode("")
        try {
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            });
            toast.success("New code sent to your email");
        } catch (error) {
            console.error("Error resending code:", error);
            toast.error("Failed to resend code");
        }
    };


    if (Verifying) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4  dark:bg-neutral-900">
                <Card className="w-full max-w-md border-none shadow-lg bg-neutral-900 text-white">
                    <CardHeader>
                        <CardTitle className="text-xl">Verify Your Email</CardTitle>
                        <CardDescription className="text-neutral-400">We have sent a verification code to your email</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleVerificationSubmit} className="space-y-6">
                            <div className="grid gap-3">
                                <Label htmlFor="verificationCode">Verification Code</Label>
                                <InputOTP
                                    autoFocus
                                    maxLength={6}
                                    value={VerificationCode}
                                    onChange={setVerificationCode}
                                    render={({ slots }) => (
                                        <InputOTPGroup>
                                            {slots.map((slot, index) => (
                                                <InputOTPSlot key={index} {...slot} className="bg-neutral-800 border-neutral-700 text-white" />
                                            ))}
                                        </InputOTPGroup>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="w-full bg-white text-black hover:bg-neutral-200" disabled={isSubmitting}>
                                {isSubmitting ? "Verifying..." : "Verify Email"}
                            </Button>

                            <div className="text-center text-sm">
                                <p className="text-neutral-400">
                                    Did not receive a code?{" "}
                                    <button
                                        onClick={resendCode}
                                        type="button"
                                        className="text-white hover:underline font-medium cursor-pointer"
                                    >
                                        Resend code
                                    </button>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="bg-[#171717] text-white">
                <CardHeader>
                    <CardTitle>Create Your Account</CardTitle>
                    <CardDescription>
                        Sign up to start managing your images securely
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {authError && (
                        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6">
                            <p>{authError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                {...register("email")}
                                className="w-full rounded-lg bg-[#222222] outline-none focus:outline-none ring-0 focus:ring-0 select-none"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className="w-full rounded-lg bg-[#222222] outline-none focus:outline-none ring-0 focus:ring-0 select-none pr-10"
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
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="passwordConfirmation"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("passwordConfirmation")}
                                    className="w-full rounded-lg bg-[#222222] outline-none focus:outline-none ring-0 focus:ring-0 select-none pr-10"
                                />
                                <Button
                                    size="sm"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#222222] hover:bg-[#222222] outline-none focus:outline-none ring-0 focus:ring-0"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-default-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-default-500" />
                                    )}
                                </Button>
                            </div>
                            {errors.passwordConfirmation && (
                                <p className="text-sm text-red-500">{errors.passwordConfirmation.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full cursor-pointer btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Creating account..." : "Create Account"}
                            </Button>
                        </div>

                    </form>
                    <div className="text-center text-sm flex justify-between items-center">
                        Already have an account?
                        <Link href="/sign-in" className="underline text-white">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}