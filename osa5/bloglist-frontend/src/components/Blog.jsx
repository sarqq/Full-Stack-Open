import Togglable from "./Togglable"

const Blog = ({ blog }) => {
  const blogStyle = {
    border: 'solid',
    borderWidth: 1,
    paddingTop: 5,
    paddingLeft: 5
  }

  return (
    <div style={blogStyle}>
      <h3>{blog.title}</h3>
      <Togglable buttonLabelOn="View" buttonLabelOff="Hide">
        <div>
          url: {blog.url}
        </div>
        <div>
          likes: {blog.likes}
          <button>Like</button>
        </div>
        <div>
          author: {blog.author}
        </div>
      </Togglable>
    </div>
  )
}

export default Blog