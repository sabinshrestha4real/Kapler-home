import Navbar from "./components/Navbar";
import BlogList from "./components/BlogLIst";
import BlogForm from "./components/BlogForm";
import { useState } from "react";
function App() {
  // State to store blogs
  const [allBlogs, setAllBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [blogId, setBlogId] = useState("");
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-8">
            <BlogList
              allBlogs={allBlogs}
              setAllBlogs={setAllBlogs}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              isUpdate={isUpdate}
              setIsUpdate={setIsUpdate}
          
              setBlogId={setBlogId}
            />
          </div>
          <div className="col-4">
            <BlogForm
              allBlogs={allBlogs}
              setAllBlogs={setAllBlogs}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              isUpdate={isUpdate}
              setIsUpdate={setIsUpdate}
              blogId={blogId}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
