import Scroll from '@/app/components/scrollcomponent/Scroll'
import Aurora from '@/components/Aurora'
import React from 'react'
import Section2 from './sections/Section2'
import Section3 from './sections/Section3'

const Home2 = () => {
  return (
    <div className='max-w-screen'>
        <Scroll/>
        <Aurora/>
        <Section2/>
        <Section3/>
    </div>
  )
}

export default Home2
