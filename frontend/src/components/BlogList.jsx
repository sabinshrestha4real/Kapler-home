function BlogList() {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Blog title</h5>

          <p className="card-text">Blog description goes here</p>

          <button className="btn btn-danger btn-sm">Delete</button>
        </div>
      </div>
    </>
  );
}

export default BlogList;
