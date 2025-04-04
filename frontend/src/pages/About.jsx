import React from 'react'
import AboutUsSection from '../components/AboutUsSection/AboutUsSection';
import './CSS/About.css';
import InarrchMartDifference from '../components/InarrchMartDifference/InarrchMartDifference';
import HowWeSourceOurProducts from '../components/HowWeSourceOurProducts/HowWeSourceOurProducts';

const About = () => {
  return (
    <div>
      <AboutUsSection/>
      <InarrchMartDifference/>
      <HowWeSourceOurProducts/>
    </div>
  )
}

export default About;