import Navbar from "./components/Navbar";
import BlogList from "./components/BlogList";
import BlogForm from "./components/BlogForm";
function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-8">
            <BlogList />
          </div>
          <div className="col-4">
            <BlogForm />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
