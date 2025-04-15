
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin, MessageCircle, Tag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    bio: string;
  };
  date: string;
  readTime: string;
  image: string;
  categories: string[];
  tags: string[];
}

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // This would normally be fetched from an API based on the ID
  // For this example, we'll use hardcoded data
  const blogPost: BlogPost = {
    id: id || '1',
    title: 'Understanding Diabetes: Symptoms, Causes, and Management',
    excerpt: 'Learn about the early warning signs of diabetes, risk factors, and how to effectively manage this common condition.',
    content: `
      <p>Diabetes is a chronic health condition that affects how your body turns food into energy. Most of the food you eat is broken down into sugar (glucose) and released into your bloodstream. When your blood sugar goes up, it signals your pancreas to release insulin.</p>
      
      <h2>Types of Diabetes</h2>
      
      <p>There are three main types of diabetes: Type 1, Type 2, and gestational diabetes.</p>
      
      <h3>Type 1 Diabetes</h3>
      
      <p>Type 1 diabetes is thought to be caused by an autoimmune reaction (the body attacks itself by mistake) that stops your body from making insulin. Approximately 5-10% of the people who have diabetes have type 1.</p>
      
      <h3>Type 2 Diabetes</h3>
      
      <p>With type 2 diabetes, your body doesn't use insulin well and can't keep blood sugar at normal levels. About 90-95% of people with diabetes have type 2. It develops over many years and is usually diagnosed in adults.</p>
      
      <h3>Gestational Diabetes</h3>
      
      <p>Gestational diabetes develops in pregnant women who have never had diabetes. If you have gestational diabetes, your baby could be at higher risk for health problems.</p>
      
      <h2>Symptoms of Diabetes</h2>
      
      <p>Symptoms of diabetes include:</p>
      
      <ul>
        <li>Frequent urination, often at night</li>
        <li>Feeling very thirsty</li>
        <li>Losing weight without trying</li>
        <li>Presence of ketones in the urine</li>
        <li>Feeling tired and weak</li>
        <li>Feeling irritable or having other mood changes</li>
        <li>Blurry vision</li>
        <li>Slow-healing sores</li>
        <li>Frequent infections, such as gums or skin infections and vaginal infections</li>
      </ul>
      
      <h2>Risk Factors</h2>
      
      <p>Factors that may increase your risk of type 2 diabetes include:</p>
      
      <ul>
        <li>Weight. Being overweight or obese is a main risk.</li>
        <li>Fat distribution. If you store fat mainly in your abdomen, you have a greater risk than if you store it elsewhere, such as in your hips and thighs.</li>
        <li>Inactivity. The less active you are, the greater your risk.</li>
        <li>Family history. Your risk increases if a parent or sibling has type 2 diabetes.</li>
        <li>Age. Your risk increases as you get older, especially after age 45.</li>
      </ul>
      
      <h2>Prevention and Management</h2>
      
      <p>Healthy lifestyle choices can help prevent type 2 diabetes, and they can also help manage all types of diabetes:</p>
      
      <ul>
        <li>Eat healthy foods. Choose foods lower in fat and calories and higher in fiber.</li>
        <li>Get active. Aim for 150 minutes of moderate physical activity a week.</li>
        <li>Lose weight. If you're overweight, losing even 7% of your body weight can decrease the risk of diabetes.</li>
        <li>Monitor blood sugar. Depending on your treatment plan, you may need to check and record your blood sugar level several times a day.</li>
        <li>Take medication as prescribed. If lifestyle changes aren't enough, your doctor will prescribe medications.</li>
      </ul>
      
      <p>Remember, managing diabetes requires daily commitment. But the effort is worth it to enjoy a longer, healthier life.</p>
    `,
    author: {
      name: 'Dr. Priya Sharma',
      role: 'Endocrinologist',
      avatar: '/placeholder.svg',
      bio: 'Dr. Priya Sharma is a board-certified endocrinologist with over 10 years of experience in diabetes care and research. She is passionate about patient education and preventive healthcare.'
    },
    date: '2023-07-15',
    readTime: '8 min read',
    image: '/placeholder.svg',
    categories: ['Health Tips', 'Disease Management'],
    tags: ['diabetes', 'chronic disease', 'health management', 'prevention']
  };
  
  // Related posts would normally be fetched from an API
  const relatedPosts = [
    {
      id: '2',
      title: 'Nutrition Tips for Diabetics: Foods to Enjoy and Avoid',
      excerpt: 'A comprehensive guide to making healthy food choices that help manage blood sugar levels.',
      image: '/placeholder.svg',
      date: '2023-06-20',
      author: {
        name: 'Dr. Anjali Desai',
        avatar: '/placeholder.svg'
      }
    },
    {
      id: '3',
      title: 'Exercise Guidelines for Patients with Diabetes',
      excerpt: 'Learn how physical activity affects blood sugar and how to exercise safely with diabetes.',
      image: '/placeholder.svg',
      date: '2023-05-12',
      author: {
        name: 'Dr. Rajiv Kumar',
        avatar: '/placeholder.svg'
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Article Header */}
      <div className="relative">
        <div className="h-96 overflow-hidden">
          <img 
            src={blogPost.image} 
            alt={blogPost.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative -mt-32 z-10 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/blog" className="inline-flex items-center text-white mb-4 hover:text-primary transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </Link>
            
            <div className="flex flex-wrap gap-3 mb-4">
              {blogPost.categories.map(category => (
                <Badge key={category} className="bg-primary text-white">
                  {category}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {blogPost.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-white gap-4 mb-8">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>
                  {new Date(blogPost.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>{blogPost.readTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Article Content */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Article */}
            <motion.div 
              className="lg:col-span-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                {/* Author Box (Top) */}
                <div className="flex items-center mb-8">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={blogPost.author.avatar} alt={blogPost.author.name} />
                    <AvatarFallback>{blogPost.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{blogPost.author.name}</p>
                    <p className="text-sm text-gray-500">{blogPost.author.role}</p>
                  </div>
                </div>
                
                {/* Article Content */}
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                ></div>
                
                {/* Tags */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blogPost.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="px-3 py-1">
                        <Tag size={14} className="mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Social Share */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-3">Share this article</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Facebook size={18} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Twitter size={18} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Linkedin size={18} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Share2 size={18} />
                    </Button>
                  </div>
                </div>
                
                {/* Author Box (Bottom) */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={blogPost.author.avatar} alt={blogPost.author.name} />
                      <AvatarFallback>{blogPost.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold mb-1">About {blogPost.author.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{blogPost.author.role}</p>
                      <p>{blogPost.author.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <MessageCircle size={20} className="mr-2" />
                  Comments
                </h3>
                
                {/* Comment form */}
                <div className="mb-8">
                  <textarea 
                    placeholder="Share your thoughts..." 
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                    rows={4}
                  ></textarea>
                  <Button className="mt-2">Post Comment</Button>
                </div>
                
                {/* Placeholder for comments */}
                <div className="text-center py-8">
                  <p className="text-gray-500">Be the first to comment on this article</p>
                </div>
              </div>
            </motion.div>
            
            {/* Sidebar */}
            <motion.div 
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="sticky top-20">
                {/* Related Articles */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8">
                  <h3 className="text-xl font-bold mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map(post => (
                      <Link to={`/blog/${post.id}`} key={post.id}>
                        <Card className="hover:shadow-md transition-shadow overflow-hidden">
                          <CardContent className="p-0">
                            <div className="h-32 overflow-hidden">
                              <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h4 className="font-bold mb-1 line-clamp-2">{post.title}</h4>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={post.author.avatar} />
                                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{post.author.name}</span>
                                </div>
                                <span className="text-xs text-gray-500">
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
                    ))}
                  </div>
                </div>
                
                {/* Newsletter Section */}
                <div className="bg-primary/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">Subscribe to Our Newsletter</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Get the latest health tips and medical insights direct to your inbox.
                  </p>
                  <form>
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="w-full p-3 mb-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    />
                    <Button className="w-full">Subscribe</Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* More Articles Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">More Articles You Might Like</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* This would typically be dynamically rendered */}
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: item * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to="/blog/1" className="block h-full">
                  <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                    <CardContent className="p-0">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src="/placeholder.svg" 
                          alt="Blog post" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <Badge variant="outline" className="mb-3">Health Tips</Badge>
                        <h3 className="text-xl font-bold mb-3">Sample Article Title Here</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          This is a sample excerpt for the article that would appear in the grid.
                        </p>
                        <Button variant="link" className="px-0">Read More</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Link to="/blog">
              <Button size="lg">
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
