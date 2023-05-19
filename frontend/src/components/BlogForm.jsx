function BlogForm() {
  // function createBlog({ title, description }) {
  const postData = async () => {
    try {
      const response = await fetch("http://localhost:8000/blog/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Hellow world",
          description: "this is just for the demo purpose",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert("Created new blog");
      } else {
        throw new Error("Error creating blog");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // }
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
          />
        </div>

        <button type="submit" className="btn btn-primary" onClick={postData}>
          Submit
        </button>
      </form>
    </>
  );
}

export default BlogForm;
