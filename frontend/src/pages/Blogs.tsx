import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useEffect, useState } from "react";
import { Blog } from "../hooks";
export const Blogs = () => {
  // const [loading,setLoading]=useState(true); 
  // const [blogs, setBlogs] = useState<Blog[]>([]);
  // useEffect(()=>{
  //   fetchBlogs();
  // },[])
  // const fetchBlogs=async()=>{
  //   try{
  //     const response=await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
  //                 headers:{
  //                     Authorization: localStorage.getItem("token")
  //                 }
  //             })
  //     if(response){
  //       setLoading(false);
  //       setBlogs(response.data.blogs)
  //       console.log(response.data.blogs)
  //     }        
  //   }catch(e){
  //     console.log(e);
  //   }
  // }
  const {loading,blogs}=useBlogs();
    if (loading){
      return <div>
        <Appbar/>
        <div className="flex justify-center">
          <div>
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
          </div>
          
        </div>
      </div>
    }
  

  return (
    <div>
       <Appbar />
      <div  className="flex justify-center">
        <div className="">
        {blogs.map(blog => <BlogCard 
         id={blog.id}
         authorname ={blog.author.name || "Jaser"}
         title={blog.title}
         content={blog.content}
         publishedDate={"23rd June"} />) 
         }
        
       
      </div>
      </div>
    </div>
    
  )
}
