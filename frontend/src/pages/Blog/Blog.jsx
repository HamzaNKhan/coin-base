import { useState, useEffect } from "react";
import Loader from "../../components/Loader/Loader";
import { getAllBlogs } from "../../api/internal";
import styles from "./Blog.module.css";
import { useNavigate } from "react-router-dom";


function Blog() {

  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    //IIFE
    (async function getAllBlogsApiCall() {
      let response;
      try {
        
        response = await getAllBlogs();
        if (response.status === 200) {
          setBlogs(response.data.blogs);
  
          console.log(response.data.blogs);
        }
      } catch (error) {
        console.log(error);
        console.log(response);
        return error;
      }
    })();

    //CLEAN UP
    setBlogs([]);
  }, []);

  if (blogs.length === 0) {
    return <Loader text="Blogs" />;
  }

  return (
    <div className={styles.blogsWrapper}>
      {blogs.map((blog) => {
        return (
          <div id={blog._id} className={styles.blog} onClick={() => navigate(`/blog/${blog._id}`)}>
            <h1>{blog.title}</h1>
            <img src={blog.photo} alt="" />
            <p>{blog.content}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Blog;
