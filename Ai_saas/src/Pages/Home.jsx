import React from 'react'
import Navbar from "../Components/Navbar.jsx"
import Hero from "../Components/Hero.jsx"
import AItools from '../Components/AItools.jsx'
import Testimonial from '../Components/Testimonial.jsx'
import InfiniteSlider from '../Components/InfiniteSlider.jsx'
import Plan from '../Components/Plan.jsx'
import Footer from '../Components/Footer.jsx'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      < InfiniteSlider />
      <AItools />
      <Testimonial />
      <Plan />
      <Footer />
    </div>
  )
}

export default Home
