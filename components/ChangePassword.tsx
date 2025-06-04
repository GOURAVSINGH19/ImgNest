"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { useSignIn } from "@clerk/nextjs"

const ChangePassword = React.memo(() => {
    const router = useRouter();
    const { signIn, isLoaded } = useSignIn();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(z.object({
            password: z.string().min(8, "Password must be at least 8 characters"),
            confirmPassword: z.string()
        }).refine((data) => data.password === data.confirmPassword, {
            message: "Passwords don't match",
            path: ["confirmPassword"],
        })),
    });

    const onSubmit = async (data: { password: string }) => {
        if (!isLoaded || !signIn) return;

        setIsSubmitting(true);

        try {
            const result = await signIn.resetPassword({
                password: data.password,
            });

            if (result.status === "complete") {
                toast.success("Password reset successful!");
                router.push("/sign-in");
            }
        } catch (error) {
            console.error("Password reset error:", error);
            toast.error("Failed to reset password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md bg-[#171717] text-white">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Set New Password</CardTitle>
                    <CardDescription className="text-center">
                        Please enter your new password
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                {...register("password")}
                                id="password"
                                type="password"
                                placeholder="Enter new password"
                                className="w-full rounded-lg bg-[#222222] outline-none focus:outline-none ring-0 focus:ring-0"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                {...register("confirmPassword")}
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                className="w-full rounded-lg bg-[#222222] outline-none focus:outline-none ring-0 focus:ring-0"
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full btn cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Resetting Password..." : "Reset Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
});

ChangePassword.displayName = 'ChangePassword'

export default ChangePassword