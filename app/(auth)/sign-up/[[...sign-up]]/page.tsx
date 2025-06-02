import SignUpForm from '@/components/SignUpForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const SignUpPage = () => {
  return (
    <>
      <div className='absolute top-2 left-5 p-5'>
        <Link href="/">
          <span className='text-white'>
            <ArrowLeft className='w-4 h-4' />
          </span>
        </Link>
      </div>
      <div className="bg-[#0A0A0A] flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-sm mt-10">
          <SignUpForm />
        </div>
      </div>
    </>
  )
}

export default SignUpPage