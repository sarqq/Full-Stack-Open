import Togglable from "./Togglable"

const Blog = ({ blog, handleLikes }) => {
   const blogStyle = {
      border: 'solid',
      borderWidth: 1,
      paddingTop: 5,
      paddingLeft: 5
   }

   // 5.8: blogin tykkäysten päivitys
   const handleLikeClick = (event) => {
      event.preventDefault()
      
      handleLikes(
         {
            ...blog,
            likes: blog.likes + 1
         }
      )
   }

   return (
      <div style={blogStyle}>
         <h3>{blog.title}</h3>
         <Togglable buttonLabelOn="View" buttonLabelOff="Hide">
         <div>
            url: <a href={blog.url}>{blog.url}</a>
         </div>
         <div>
            likes: {blog.likes}
            <button onClick={handleLikeClick}>Like</button>
         </div>
         <div>
            author: {blog.author}
         </div>
         </Togglable>
      </div>
  )
}

export default Blog