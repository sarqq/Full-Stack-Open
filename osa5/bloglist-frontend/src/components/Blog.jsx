import {useParams} from 'react-router-dom'
import Togglable from './Togglable'

import {Card, Button, Typography, CardContent, CardActions} from '@mui/material'

const Blog = ({ blogs, handleLikes, handleRemove, user }) => {
   const id = useParams().id
   const blog = blogs.find(b => b.id === id)

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

   // 5.11: blogin poisto
   const handleDelClick = (event) => {
      event.preventDefault()

      if(window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
         handleRemove(blog)
      }
   }

   return (
      <Card className="blog">
         <CardContent>
            <Typography gutterBottom variant="h5">{blog.title}</Typography>
            <Typography variant="body2">
               <ul>
                  <li>url: <a href={blog.url}>{blog.url}</a></li>
                  <li>likes: {blog.likes}</li>
                  <li>author: {blog.author}</li>
               </ul>
            </Typography>
         </CardContent>

         <CardActions>   
            {user && (
               <Button size="small" onClick={handleLikeClick}>Like</Button>
            )}
            {user && (
               <Button size="small" onClick={handleDelClick}>Remove</Button>
            )}
         </CardActions>
      </Card>
   )
}

export default Blog