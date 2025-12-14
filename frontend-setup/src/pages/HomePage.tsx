import FeaturedSection from "../components/FeaturedSection";
import HeroSection from "../components/HeroSection";
import TrailerSection from "../components/TrailerSections";

const  HomePage = () => {
  return (
    <div className='text-[15px] bg-black min-h-screen  text-white'>
      <HeroSection/>
      <FeaturedSection/>
      <TrailerSection/>

       </div>
  )
}

export default HomePage;