
import axios from "axios";
function BlogForm({
  allBlogs,
  setAllBlogs,
  title,
  setTitle,
  description,
  setDescription,
  isUpdate,
  setIsUpdate,
  blogId,
}) {
  function createBlog(event) {
    event.preventDefault();
    axios({
      method: "POST",
      url: "http://localhost:8000/blog/create",
      data: {
        title: title,
        description: description,
      },
    })
      .then((res) => {
        alert("Your blog has been added");
        setTitle("");
        setDescription("");
        let temp = [res.data.data, ...allBlogs];
        console.log(temp);
        setAllBlogs(temp);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }
  function updateBlog(event) {
    console.log(blogId);
    event.preventDefault();
    axios({
      method: "PUT",
      url: "http://localhost:8000/blog/update/" + blogId,
      data: {
        title: title,
        description: description,
      },
    })
      .then((res) => {
        alert("Your blog has been updated");
        setTitle("");
        setDescription("");
        console.log(res);
        let index = allBlogs.findIndex((blog) => blog._id == res.data.data._id);
        allBlogs[index] = res.data.data;
        // let temp = [...allBlogs];
        // temp[index] = res.data.data;
        setAllBlogs(allBlogs);
        setIsUpdate(false);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }

  function cancelBlog(event) {
    event.preventDefault();
    setTitle("");
    setDescription("");
    setIsUpdate(false);
  }
  return (
    <>
      <form>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Blog Title
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Blog Description
          </label>
          <textarea
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            rows={8}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        {isUpdate ? (
          <>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={updateBlog}
            >
              Update
            </button>{" "}
            <button
              type="submit"
              className="btn btn-warning"
              onClick={cancelBlog}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="submit"
            className="btn btn-primary"
            onClick={createBlog}
          >
            Submit
          </button>
        )}
      </form>
    </>
  );
}

export default BlogForm;
