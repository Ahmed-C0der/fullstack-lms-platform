import React from 'react'
import Hero from './home/hero'
import Logos from './home/logos'
import Testimonials from './home/testimonials'
import Featured from './home/featured'
import CTA from './home/cta'
import Nav from './Mynav'
import Footer from './footer'

export default function HomePage() {
  return (
    < >
        <Hero />
        <Logos/>
        <Testimonials/>
        <Featured/>
        <CTA/>
        <Footer />
    </>
  )
}
