"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { useSignIn } from "@clerk/nextjs"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./InputOTP"

const Forgetpassword = React.memo(() => {
    const router = useRouter();
    const { signIn, isLoaded } = useSignIn();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [email, setEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(z.object({
            email: z.string().email("Invalid email address")
        })),
        defaultValues: {
            email: ""
        }
    });

    const onSubmit = async (data: { email: string }) => {
        if (!signIn) return;

        setIsSubmitting(true);
        setEmail(data.email);

        try {
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: data.email,
            });
            setVerifying(true);
            toast.success("Password reset instructions sent to your email");
        } catch (error: unknown) {
            console.error("Error:", error);
            toast.error("Failed to send reset code");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerificationSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (!isLoaded || !signIn) return;

        setIsSubmitting(true);

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code: verificationCode,
            });

            if (result.status === "needs_new_password") {
                toast.success("Code verified successfully!");
                router.push('/change-password');
            }
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("Failed to verify code. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resendCode = async () => {
        if (!signIn) return;
        setVerificationCode("")
        try {
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: email,
            });
            toast.success("New code sent to your email");
        } catch (error) {
            console.error("Error resending code:", error);
            toast.error("Failed to resend code");
        }
    };

    if (verifying) {
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
                                    value={verificationCode}
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
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md bg-[#171717] text-white">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email address and we&apos;ll send you instructions to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                    {...register("email")}
                                    autoFocus
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="pl-10"
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full btn cursor-pointer mt-4"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Send Reset Code"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Link
                        href="/sign-in"
                        className="flex items-center justify-center gap-2 text-sm transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
})

Forgetpassword.displayName = 'Forgetpassword'

export default Forgetpassword