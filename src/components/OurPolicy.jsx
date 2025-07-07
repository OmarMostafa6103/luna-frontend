import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div id='policy' className='flex flex-col sm:flex-row justify-around gap-12 text-center py-20 text-xs sm:text-sm md:text-base '>

      <div className="flex flex-col items-center">
        <img src={assets.chocolates} alt="" className="w-[150px] h-[150px] mb-4" />
        {/* <p className="font-semibold">Best Customer Support</p> */}
        <p className="text-center max-w-[500px] text-[1.25rem] font-light">
          All our chocolates are beautifully handmade by our award-winning chocolatiers.
        </p>
      </div>



      <div className="flex flex-col items-center">
        <img src={assets.fresh} alt="" className="w-[150px] h-[150px] mb-4" />
        {/* <p className="font-semibold">7 Days Return Policy</p> */}
        <p className="text-center max-w-[500px] text-[1.25rem] font-light">
          Fresh from Notting Hill using natural ingredients
        </p>
      </div>

      <div className="flex flex-col items-center">
        <img src={assets.delicious} alt="" className="w-[150px] h-[150px] mb-4" />
        {/* <p className="font-semibold">Best Customer Support</p> */}
        <p className="text-center max-w-[500px] text-[1.25rem] font-light">
          Our sublime chocolates stay delicious for weeks
        </p>
      </div>

      <div className="flex flex-col items-center">
        <img src={assets.message} alt="" className="w-[150px] h-[150px] mb-4" />
        {/* <p className="font-semibold">Best Customer Support</p> */}
        <p className="text-center max-w-[500px] text-[1.25rem] font-light">
          You can add a gift message for the lucky recipient at checkout - personalising your gift
        </p>
      </div>



      <div className="flex flex-col items-center">
        <img src={assets.backage} alt="" className="w-[150px] h-[150px] mb-4" />
        {/* <p className="font-semibold">Best Customer Support</p> */}
        <p className="text-center max-w-[500px] text-[1.25rem] font-light">
          We beautifully package our orders with care, so they arrive safely in plastic free packaging
        </p>
      </div>

    </div>
  )
}

export default OurPolicy