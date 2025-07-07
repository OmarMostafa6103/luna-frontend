import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import VisitedProducts from '../components/VisitedProducts'
import OurPolicy from '../components/OurPolicy'


const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <VisitedProducts />
      <OurPolicy />
    </div>
  )
}

export default Home