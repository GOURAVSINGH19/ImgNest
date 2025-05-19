import { LoginForm } from '@/components/Login-form'
import Link from 'next/link'
import React from 'react'

const SignInPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#121212]">
            <div className='w-full p-5'>
                <Link href="/">
                    <span className='text-white'>Home</span>
                </Link>
            </div>

            <main className="flex-1 flex justify-center items-center p-6">
                <LoginForm />
            </main>

            <footer className=" text-white py-4">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Droply. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default SignInPage