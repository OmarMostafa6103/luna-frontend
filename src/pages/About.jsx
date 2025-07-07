import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="">

      <Title text1={'About'} text2={'Us'} />

      <div className="flex  flex-col lg:flex-row md:flex-row justify-center gap-10 text-start items-start mt-16">
        <img src={assets.about_img} alt="" className='border border-gray-800 w-96 rounded-md' />
        <div className='flex flex-col gap-14 justify-center items-start'>
          <p className='max-w-[600px]  md:text-md lg:text-md  mt-8' >Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt neque, pariatur excepturi iste sed doloribus obcaecati dolorum ex molestias illum vero officia ea atque impedit et? Doloribus nihil tempore est magni, impedit accusamus in tenetur molestias. Nostrum minima asperiores quas, quis quos animi nihil eos. Dignissimos animi officiis incidunt enim beatae sapiente ab dolorum saepe quidem voluptates labore iste possimus distinctio temporibus, ipsam hic fugiat sequi, necessitatibus ad rem cupiditate unde perspiciatis aliquam! Eveniet eos molestiae dicta atque obcaecati ipsum unde? Ex iste natus, vero, ipsum soluta rem voluptatum necessitatibus molestias explicabo deserunt est aliquam unde officiis eligendi a magnam?</p>
          <Link to="/contact"><button className="bg-red-500 text-white px-4 py-2">Contact Us</button></Link></div>
      </div>

    </div>
  )
}

export default About