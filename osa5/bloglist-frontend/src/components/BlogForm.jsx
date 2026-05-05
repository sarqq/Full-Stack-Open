import { useState } from 'react'
import {TextField, Button} from '@mui/material'


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
            <TextField label="title" value={newTitle} onChange={event => setTitle(event.target.value)}/>
            <TextField label="author" value={newAuthor} onChange={event => setAuthor(event.target.value)}/>
            <TextField label="url" value={newUrl} onChange={event => setUrl(event.target.value)}/>
            <Button type="submit" style={{marginTop: 10, marginBottom: 10}}>Add blog</Button>
         </form>
      </div>
   )
}

export default BlogForm