import React,{useRef} from 'react'
import Hero from '../components/Hero/Hero'
import Popular from '../components/Popular/Popular'
import Offers from '../components/Offers/Offers'
import NewCollections from '../components/NewCollections/NewCollections'
import NewsLetter from '../components/NewsLetter/NewsLetter'

const Home = () => {

  const newCollectionsRef = useRef(null);

  const scrollToNewCollections = () => {
    if (newCollectionsRef.current) {
      newCollectionsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <Hero scrollToNewCollections={scrollToNewCollections}/>
      <Popular/>
      <Offers/>
      <NewCollections ref={newCollectionsRef}/>
      <NewsLetter/>
    </div>
  )
}

export default Home