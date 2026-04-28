import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
   // 5.3: blogin lisäyksen toteutus
   const [newTitle, setTitle] = useState('')
   const [newAuthor, setAuthor] = useState('')
   const [newUrl, setUrl] = useState('')

   const addBlog = (event) => {
      event.preventDefault()

      createBlog({
         title: newTitle,
         author: newAuthor,
         url: newUrl
      })

      setTitle('')
      setAuthor('')
      setUrl('')
   }

   return (
      <div>
         <h2>Add new blog</h2>
         <form onSubmit={addBlog}>
            <div>
               <label>
                  title:
                  <input type="text" value={newTitle} onChange={event => setTitle(event.target.value)}/>
               </label>
            </div>
            <div>
               <label>
                  author:
                  <input type="text" value={newAuthor} onChange={event => setAuthor(event.target.value)}/>
               </label>
            </div>
            <div>
               <label>
                  url:
                  <input type="text" value={newUrl} onChange={event => setUrl(event.target.value)}/>
               </label>
            </div>
            <button type="submit">Add blog</button>
         </form>
      </div>
   )
}

export default BlogForm