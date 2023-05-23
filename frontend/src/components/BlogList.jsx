import axios from "axios";
import { useEffect, useState } from "react";

function BlogList({ allBlogs, setAllBlogs,setTitle, setDescription, setIsUpdate, setBlogId}) {
  // Function to fetch all blogs from the server
  function getAllBlogs() {
    axios({
      method: "GET",
      url: "http://localhost:8000/blog/get",
    })
      .then((res) => {
        //reversing list so that lastest data is at top
        setAllBlogs(res.data.data.reverse());
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  // Function to delete the blog

  function deleteBlog(blogId) {
    let confirmation = confirm("Do you want to delete this blog?");

    if (confirmation) {
      axios({
        method: "DELETE",
        url: import.meta.env.VITE_API_URL + "/blog/delete/" + blogId,
      })
        .then(() => {
          alert("Blog has been deleted successfully");
          // window.location.reload();

          //Updating the allBlogs state by removing the deleted blog

          let reamainingBlogs = allBlogs.filter((blog) => blog._id !== blogId);
          setAllBlogs(reamainingBlogs);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }-
  // Hook to execute the function once
  useEffect(() => {
    getAllBlogs();
  }, []);

  return (
    <>
      {allBlogs.reverse().map((blog) => {
        return (
          <div className="card my-4" key={blog._id}>
            <div className="card-body">
              <h5 className="card-title">{blog.title}</h5>

              <p className="card-text">{blog.description}</p>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  deleteBlog(blog._id);
                }}
              >
                Delete
              </button>
              {" "} 
              <button
                className="btn btn-primary"
                onClick={() => {
                 
                  setTitle(blog.title);
                  setDescription(blog.description);
                  setIsUpdate(true);
                  setBlogId(blog._id);
                  
                  // deleteBlog(blog._id);
                }}
              >
                Edit
              </button>
            </div>

            
          </div>
        );
      })}
    </>
  );
}

export default BlogList;
