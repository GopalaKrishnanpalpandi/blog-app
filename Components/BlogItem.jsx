import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const BlogItem = ({title,description,category,image,id}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className='w-full h-full flex flex-col bg-white border border-black transition-all hover:shadow-[-7px_7px_0px_#000000]'>
      <Link href={`/blogs/${id}`} className='block w-full'>
        <div className='relative w-full aspect-[16/9] overflow-hidden border-b border-black'>
          <Image 
            src={imageError ? assets.blog_icon : (typeof image === 'string' ? image : image.src || image)} 
            alt={`Blog post image for ${title}`} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className='object-cover w-full h-full transition-transform duration-300 hover:scale-105' 
            priority={true}
            onError={() => setImageError(true)}
            loading="eager"
            style={{ minHeight: '200px' }}
          />
        </div>
      </Link>
      <div className='flex-1 flex flex-col p-5'>
        <p className='mb-4 px-2 py-1 self-start bg-black text-white text-sm'>{category}</p>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h5 className='mb-3 text-lg font-medium tracking-tight text-gray-900 line-clamp-2'>{title}</h5>
            <p className='mb-4 text-sm tracking-tight text-gray-700 line-clamp-3' dangerouslySetInnerHTML={{"__html":description.slice(0,120)}}></p>
          </div>
          <Link href={`/blogs/${id}`} className='inline-flex items-center py-2 font-semibold text-center hover:underline'>
            Read more <Image src={assets.arrow} className='ml-2' alt='' width={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogItem
