import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-14 text-sm'>
            {/*-------left section------------*/}
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt='' />
                <p className='w-full md:w-2/3 text-gray-100 leading-6'>UPLYFT is a smart platform that helps businesses deliver goods faster and cities reduce traffic jams. It uses real-time data like traffic, weather,
                and road closures to plan the best routes for trucks and improve public transport. By cutting delivery delays and easing congestion, it saves
                time, fuel,and lives. Whether it’s avoiding accidents or balancing bus crowds, UPLYFT makes urban life smoother and safer. It’s the future of
                smarter cities and efficient logistics.</p>
            </div>

            {/*-------centre section------------*/}
            <div>
                <p className='text-xl font-medium mb-5 mt-10 text-white'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-100'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>
                
            </div>

            {/*-------right section------------*/}
            <div>
                <p className='text-xl font-medium mb-5 mt-10 text-white'>Get In Touch</p>
                <ul className='flex flex-col gap-2 text-gray-100'>
                    <li>+91-1234567890</li>
                    <li>MailUPLYFT@gmail.com</li>
                </ul>
                
            </div>

        </div>
        <div>
            <hr />
            <p className='py-5 text-sm text-center text-gray-100'>© 2025 UPLYFT. All rights reserved.</p>
        </div>

    </div>
  )
}

export default Footer