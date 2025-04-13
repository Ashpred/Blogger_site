import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../index.css';

const AboutPage = () => {
  const features = [
    {
      title: 'Modern Writing Experience',
      description: 'Write and edit your content with our intuitive, distraction-free editor.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      title: 'Community Engagement',
      description: 'Connect with other writers, share ideas, and grow together.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'Advanced Analytics',
      description: 'Track your content performance and audience engagement.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 8 8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'Secure Platform',
      description: 'Your content and data are protected with enterprise-grade security.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ];

  const teamMembers = [
    {
      name: 'Kavya Agarwal',
      role: 'Mern Stack Developer',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/002/206/015/small/developer-working-icon-free-vector.jpg',
    },
    {
      name: 'Vinit Khorwal',
      role: 'Mern Stack Developer',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/002/206/015/small/developer-working-icon-free-vector.jpg',
    },
    {
      name: 'Ashwin Anand',
      role: 'Mern Stack Developer',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/002/206/015/small/developer-working-icon-free-vector.jpg',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
    >
      {/* Hero Section */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            About Our Blog Platform
          </h1>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Discover the story behind our platform and join a community of passionate writers and readers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're dedicated to creating a space where writers and readers can connect, share ideas, and grow together.
              Our platform is built on the principles of community, creativity, and knowledge sharing.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition duration-300"
            >
              <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center text-purple-600 mb-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {feature.icon.props.children}
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Meet Our Team</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            We're a passionate team of developers, writers, and designers working together to create
            the best blogging experience for our users.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 rounded-full mx-auto mb-2 object-cover border-2 border-purple-100"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-0.5">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-white mb-1">10K+</p>
              <p className="text-sm text-white/90">Active Writers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">50K+</p>
              <p className="text-sm text-white/90">Published Articles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">1M+</p>
              <p className="text-sm text-white/90">Monthly Readers</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Join Our Community</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
            Whether you're a seasoned writer or just starting out, we welcome you to join our growing
            community of creators and readers.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPage; 