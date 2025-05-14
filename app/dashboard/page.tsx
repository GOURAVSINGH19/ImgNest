import Home from '@/components/Home'
import Navbar from '@/components/Navbar'

const page = () => {
    return (
        <div className='w-full min-h-screen bg-black'>
            <Navbar />
            <Home />
        </div>
    )
}

export default page