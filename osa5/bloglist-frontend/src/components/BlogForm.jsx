const BlogForm = (props) => (
   <div>
      <h2>Add new blog</h2>
      <form onSubmit={props.handleSubmit}>
         <div>
            <label>
               title:
               <input type="text" value={props.newTitle} onChange={props.handleTitleChange}/>
            </label>
         </div>
         <div>
            <label>
               author:
               <input type="text" value={props.newAuthor} onChange={props.handleAuthorChange}/>
            </label>
         </div>
         <div>
            <label>
               url:
               <input type="text" value={props.newUrl} onChange={props.handleUrlChange}/>
            </label>
         </div>
         <button type="submit">Add blog</button>
      </form>
   </div>
)

export default BlogForm