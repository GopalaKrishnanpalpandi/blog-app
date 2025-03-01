import { blog_data } from '@/Assets/assets'
import React, { useEffect, useState, useCallback, memo } from 'react'
import BlogItem from './BlogItem'
import axios from 'axios';

const BlogItemMemo = memo(BlogItem);

const LoadingSkeleton = () => (
  <div className="max-w-[330px] sm:max-w-[300px] bg-white border border-black animate-pulse">
    <div className="h-[200px] bg-gray-200 border-b border-black"></div>
    <div className="p-5">
      <div className="h-4 w-20 bg-gray-200 mb-4"></div>
      <div className="h-4 w-full bg-gray-200 mb-2"></div>
      <div className="h-4 w-2/3 bg-gray-200"></div>
    </div>
  </div>
);

const RETRY_COUNT = 3;
const RETRY_DELAY = 1000;

const BlogList = () => {
    const [menu,setMenu] = useState("All");
    const [blogs,setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBlogs = useCallback(async (retryCount = 0) => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/blog');
        if (!response.data || !response.data.blogs || response.data.blogs.length === 0) {
          const formattedBlogData = blog_data.map(blog => ({
            _id: blog.id.toString(),
            title: blog.title,
            description: blog.description,
            image: blog.image,
            category: blog.category,
            author: blog.author
          }));
          setBlogs(formattedBlogData);
        } else {
          setBlogs(response.data.blogs);
        }
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching blogs (attempt ${retryCount + 1}):`, err);
        if (retryCount < RETRY_COUNT) {
          setTimeout(() => fetchBlogs(retryCount + 1), RETRY_DELAY);
        } else {
          const formattedBlogData = blog_data.map(blog => ({
            _id: blog.id.toString(),
            title: blog.title,
            description: blog.description,
            image: blog.image.src || blog.image,
            category: blog.category,
            author: blog.author
          }));
          setBlogs(formattedBlogData);
          setError('Failed to fetch blogs from server, showing cached content');
          setLoading(false);
        }
      }
    }, []);

    useEffect(() => {
      fetchBlogs();
    }, [fetchBlogs]);
    if (loading) {
      return (
        <div className="flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24">
          {[...Array(6)].map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      );
    }

    return (
      <div>
        <div className='flex justify-center gap-6 my-10'>
          <button onClick={()=>setMenu('All')} className={menu==="All"?'bg-black text-white py-1 px-4 rounded-sm':""}>All</button>
          <button onClick={()=>setMenu('Technology')} className={menu==="Technology"?'bg-black text-white py-1 px-4 rounded-sm':""}>Technology</button>
          <button onClick={()=>setMenu('Startup')} className={menu==="Startup"?'bg-black text-white py-1 px-4 rounded-sm':""}>Startup</button>
          <button onClick={()=>setMenu('Lifestyle')} className={menu==="Lifestyle"?'bg-black text-white py-1 px-4 rounded-sm':""}>Lifestyle</button>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {blogs.length === 0 ? (
            <div className="text-xl text-gray-600 text-center py-12">No blogs found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 mx-auto">
              {blogs.filter((item)=> menu==="All"?true:item.category===menu).map((item)=> {
                return <BlogItemMemo key={item._id} id={item._id} image={item.image} title={item.title} description={item.description} category={item.category} />
              })}
            </div>
          )}
        </div>
      </div>
    )
}

export default BlogList
