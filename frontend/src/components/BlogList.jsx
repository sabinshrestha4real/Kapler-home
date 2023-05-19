import axios from "axios";
import { useEffect, useState } from "react";

function BlogList() {
  // State to store blogs
  const [allBlogs, setAllBlogs] = useState([]);

  // Function to fetch all blogs from the server
  function getAllBlogs() {
    axios({
      method: "GET",
      url: "http://localhost:8000/blog/get",
    })
      .then((res) => {
        console.log(res.data.data);
        setAllBlogs(res.data.data);
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
        url: "http://localhost:8000/blog/delete/" + blogId,
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
  }

  // Hook to execute the function once
  useEffect(() => {
    getAllBlogs();
  }, []);

  return (
    <>
      {allBlogs.map((blog) => {
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
            </div>
          </div>
        );
      })}
    </>
  );
}

export default BlogList;
