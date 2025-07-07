import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[2fr_1fr_1fr] gap-14 my-10 mt-24 text-sm'>
                <div className='flex flex-col gap-5'>
                    <a href='#homepage' className='text-xl font-bold '>Luna<span className='text-sm'>Helthy</span>  </a>
                    <p className=" md:w-2/3 w-full">Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Officia vitae maiores magnam molestias est sequi fuga dolor t sequi fuga dolor
                        quis, officiis iste dolore officia vitae expedita iusto sed id.</p>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>Company</p>
                    <ul className='flex flex-col gap-1 cursor-pointer'>
                        <Link to="/"><a>Home</a></Link>
                        <Link to="/about"><a>About Us</a></Link>
                        <Link to="/contact"><a>Contact Us</a></Link>
                        <Link to="/"><a>Policy</a></Link>
                    </ul>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>Get In Touch</p>
                    <ul className='flex flex-col gap-1 '>
                        <li>Phone Number : 123456789</li>
                        <li>Whatsapp Number : 1234567890</li>
                        <li>Email : project@gmail.com</li>
                    </ul>
                </div>

            </div>

            <div>
                <hr />
                <p className='text-center py-5  text-sm font-semibold' >Copyright 2024@forever.com - All Right Reserved.</p>
            </div>
        </div>
    )
}

export default Footer