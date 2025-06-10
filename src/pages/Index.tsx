
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import BikeGallery from '@/components/BikeGallery';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <BikeGallery />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
