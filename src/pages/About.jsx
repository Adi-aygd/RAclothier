import React from 'react';
import { Award, Users, Globe, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About R&A Clothier
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Crafting exceptional menswear since 1985. Where tradition meets innovation 
            in every stitch, every fabric, every detail.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 1985 by master tailors Robert and Anthony, R&A Clothier began 
                as a small atelier with a simple mission: to create the finest menswear 
                using traditional craftsmanship and premium materials.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Today, we continue that legacy, combining time-honored techniques with 
                contemporary design to create clothing that embodies sophistication, 
                quality, and timeless style.
              </p>
              <p className="text-lg text-gray-600">
                Every piece in our collection is carefully crafted to meet the highest 
                standards of quality and design, ensuring that our customers always 
                look and feel their absolute best.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"
                alt="Master tailor at work"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Award size={48} className="mx-auto text-black mb-4" />
              <h3 className="text-xl font-bold mb-3">Excellence</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every piece meets our exacting standards.
              </p>
            </div>
            
            <div className="text-center">
              <Users size={48} className="mx-auto text-black mb-4" />
              <h3 className="text-xl font-bold mb-3">Craftsmanship</h3>
              <p className="text-gray-600">
                Master artisans with decades of experience create each garment by hand.
              </p>
            </div>
            
            <div className="text-center">
              <Globe size={48} className="mx-auto text-black mb-4" />
              <h3 className="text-xl font-bold mb-3">Sustainability</h3>
              <p className="text-gray-600">
                Committed to ethical practices and sustainable fashion for future generations.
              </p>
            </div>
            
            <div className="text-center">
              <Heart size={48} className="mx-auto text-black mb-4" />
              <h3 className="text-xl font-bold mb-3">Passion</h3>
              <p className="text-gray-600">
                Every stitch is sewn with love and dedication to our craft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The artisans behind R&A Clothier</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
                alt="Robert Anderson"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold mb-2">Robert Anderson</h3>
              <p className="text-gray-600 mb-2">Co-Founder & Master Tailor</p>
              <p className="text-sm text-gray-500">40+ years of experience in bespoke tailoring</p>
            </div>
            
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
                alt="Anthony Clarke"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold mb-2">Anthony Clarke</h3>
              <p className="text-gray-600 mb-2">Co-Founder & Design Director</p>
              <p className="text-sm text-gray-500">Visionary designer with a passion for innovation</p>
            </div>
            
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face"
                alt="Sarah Mitchell"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold mb-2">Sarah Mitchell</h3>
              <p className="text-gray-600 mb-2">Head of Operations</p>
              <p className="text-sm text-gray-500">Ensuring excellence in every customer experience</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

