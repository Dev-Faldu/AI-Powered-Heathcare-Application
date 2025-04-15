
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  image: string;
  categories: string[];
  tags: string[];
}

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sample blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Understanding Diabetes: Symptoms, Causes, and Management',
      excerpt: 'Learn about the early warning signs of diabetes, risk factors, and how to effectively manage this common condition.',
      content: 'Full content here...',
      author: {
        name: 'Dr. Priya Sharma',
        role: 'Endocrinologist',
        avatar: '/placeholder.svg'
      },
      date: '2023-07-15',
      readTime: '8 min read',
      image: '/placeholder.svg',
      categories: ['Health Tips', 'Disease Management'],
      tags: ['diabetes', 'chronic disease', 'health management']
    },
    {
      id: '2',
      title: 'The Future of AI in Medical Diagnostics',
      excerpt: 'Explore how artificial intelligence is transforming disease diagnosis and what this means for patients and healthcare providers.',
      content: 'Full content here...',
      author: {
        name: 'Dr. Rajiv Kumar',
        role: 'Medical AI Researcher',
        avatar: '/placeholder.svg'
      },
      date: '2023-06-28',
      readTime: '10 min read',
      image: '/placeholder.svg',
      categories: ['Medical Innovation', 'AI Updates'],
      tags: ['artificial intelligence', 'diagnostics', 'technology']
    },
    {
      id: '3',
      title: 'Mental Health in the Digital Age: Challenges and Solutions',
      excerpt: 'How social media and constant connectivity affect our mental wellbeing, and strategies to maintain a healthy digital balance.',
      content: 'Full content here...',
      author: {
        name: 'Dr. Sanjana Gupta',
        role: 'Clinical Psychologist',
        avatar: '/placeholder.svg'
      },
      date: '2023-06-10',
      readTime: '7 min read',
      image: '/placeholder.svg',
      categories: ['Mental Health', 'Health Tips'],
      tags: ['mental health', 'digital wellbeing', 'psychology']
    },
    {
      id: '4',
      title: 'COVID-19 Long-term Effects: What We Know So Far',
      excerpt: 'A comprehensive look at the emerging research on long COVID and its implications for patient care and recovery.',
      content: 'Full content here...',
      author: {
        name: 'Dr. Amit Patel',
        role: 'Pulmonologist',
        avatar: '/placeholder.svg'
      },
      date: '2023-05-22',
      readTime: '12 min read',
      image: '/placeholder.svg',
      categories: ['COVID-19', 'Research Updates'],
      tags: ['covid-19', 'long covid', 'respiratory health']
    },
    {
      id: '5',
      title: 'Telemedicine Adoption in Rural India: Progress and Challenges',
      excerpt: 'How virtual healthcare is breaking barriers in remote areas and the obstacles that still need to be overcome.',
      content: 'Full content here...',
      author: {
        name: 'Dr. Meera Reddy',
        role: 'Public Health Specialist',
        avatar: '/placeholder.svg'
      },
      date: '2023-05-05',
      readTime: '9 min read',
      image: '/placeholder.svg',
      categories: ['Telemedicine', 'Healthcare Access'],
      tags: ['telemedicine', 'rural healthcare', 'digital health']
    }
  ];

  // Get all unique categories
  const allCategories = Array.from(
    new Set(blogPosts.flatMap(post => post.categories))
  );

  // Filter posts based on search term and selected category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? post.categories.includes(selectedCategory) : true;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-5xl font-bold mb-6 text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Health & Wellness Blog
          </motion.h1>
          <motion.p 
            className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Expert insights, medical updates, and health tips from our network of specialists
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-20">
                <h3 className="text-xl font-bold mb-4">Categories</h3>
                <div className="space-y-2">
                  <Button 
                    variant={selectedCategory === null ? 'default' : 'outline'} 
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Categories
                  </Button>
                  
                  {allCategories.map(category => (
                    <Button 
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'} 
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                <h3 className="text-xl font-bold mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(blogPosts.flatMap(post => post.tags))).slice(0, 10).map(tag => (
                    <Badge key={tag} variant="outline" className="px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:w-3/4">
              <h2 className="text-3xl font-bold mb-6">
                {selectedCategory ? `${selectedCategory} Articles` : 'Latest Articles'}
              </h2>
              
              {filteredPosts.length === 0 ? (
                <div className="text-center py-20">
                  <Search size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium mb-2">No articles found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria.</p>
                </div>
              ) : (
                <div className="grid gap-8">
                  {/* Featured Post */}
                  {!selectedCategory && searchTerm === '' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mb-8"
                    >
                      <Link to={`/blog/${filteredPosts[0].id}`} className="block overflow-hidden rounded-xl">
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <CardContent className="p-0">
                            <div className="relative h-96">
                              <img 
                                src={filteredPosts[0].image} 
                                alt={filteredPosts[0].title} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                              <div className="absolute bottom-0 left-0 p-8 text-white">
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge variant="secondary" className="bg-primary/80 hover:bg-primary text-white">
                                    {filteredPosts[0].categories[0]}
                                  </Badge>
                                  <span className="text-gray-300 text-sm flex items-center">
                                    <Clock size={14} className="mr-1" />
                                    {filteredPosts[0].readTime}
                                  </span>
                                </div>
                                <h3 className="text-3xl font-bold mb-3">{filteredPosts[0].title}</h3>
                                <p className="mb-4 text-gray-200">
                                  {filteredPosts[0].excerpt}
                                </p>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                                    <img src={filteredPosts[0].author.avatar} alt={filteredPosts[0].author.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium block">{filteredPosts[0].author.name}</span>
                                    <span className="text-xs text-gray-300">
                                      {new Date(filteredPosts[0].date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  )}
                  
                  {/* Regular Posts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPosts.slice(selectedCategory || searchTerm ? 0 : 1).map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Link to={`/blog/${post.id}`} className="block h-full">
                          <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                            <CardContent className="p-0">
                              <div className="h-48 overflow-hidden">
                                <img 
                                  src={post.image} 
                                  alt={post.title} 
                                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                />
                              </div>
                              <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                                    {post.categories[0]}
                                  </Badge>
                                  <span className="text-gray-500 text-sm flex items-center">
                                    <Clock size={14} className="mr-1" />
                                    {post.readTime}
                                  </span>
                                </div>
                                
                                <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                  {post.excerpt}
                                </p>
                                
                                <div className="flex items-center justify-between mt-auto pt-4">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                                      <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-sm font-medium">{post.author.name}</span>
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {new Date(post.date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Load More Button */}
              {filteredPosts.length > 6 && (
                <div className="mt-10 text-center">
                  <Button variant="outline" size="lg">
                    Load More Articles
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Informed</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            Subscribe to our newsletter for the latest health tips, medical insights, and updates
          </p>
          <div className="max-w-md mx-auto">
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                required
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;
