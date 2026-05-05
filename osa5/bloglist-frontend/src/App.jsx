import { useState, useEffect } from 'react'
import {
   BrowserRouter as Router,
   Routes, Route, Link,
   useNavigate
} from 'react-router-dom'
import {
   Container, TableContainer,
   AppBar, Toolbar,
   Button, Typography,
   Table, TableBody, TableCell, TableHead, TableRow, Paper
} from '@mui/material'

import blogService from './services/blogs'
import loginService from './services/login'

import Blog from './components/Blog'
import Notification from './components/Notification.jsx'
import Togglable from './components/Togglable.jsx'
import BlogForm from './components/BlogForm.jsx'
import LoginForm from './components/LoginForm.jsx'



const App = () => {
   const [blogs, setBlogs] = useState([])

   // 5.1: kirjautumislomakkeen toteutus
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [user, setUser] = useState(null)

   // 5.4: notifikaation lisäys
   const [notification, setNotification] = useState(null)

   const navigate = useNavigate()

   useEffect(() => {
      blogService.getAll().then(blogs =>
         setBlogs( blogs )
      )
   }, [])

   useEffect(() => {
      const loggedUserJSON = window.localStorage.getItem('loggedUser')

      if (loggedUserJSON) {
         const user = JSON.parse(loggedUserJSON)
         console.log(user)

         setUser(user)
         blogService.setToken(user.token)
      }
   }, [])

   const addBlog = async (blogObject) => {
      try {
         if (!blogObject.title || !blogObject.url) {
            setNotification({
               text: 'Could not create blog: invalid or missing title or URL.',
               type: 'error'
            })
            return
         }

         const returnedBlog = await blogService.create(blogObject)

         setNotification({
            text: `Successfully added ${returnedBlog.title}`,
            type: 'success'
         })
         setTimeout(() => {setNotification(null)}, 5000)

         navigate('/')
         setBlogs(blogs.concat(returnedBlog))

      }
      catch {
         setNotification({
            text: 'Could not create blog',
            type: 'error'
         })
         setTimeout(() => {setNotification(null)}, 5000)
      }
   }

   // 5.8: blogin tykkäysten päivitys
   const updateLikes = async (blogObject) => {
      try {
         const updatedBlog = await blogService.update(blogObject.id, blogObject)

         // päivittää blogilistan
         setBlogs(blogs.map(blog =>
            blog.id === updatedBlog.id ? updatedBlog : blog
         ))
      }
      catch {
         setNotification({
            text: 'Unknown error when liking blog.',
            type: 'error'
         })
         setTimeout(() => {setNotification(null)}, 5000)
      }
   }

   // 5.11: blogin poisto
   const removeBlog = async (blogObject) => {
      try {
         await blogService.del(blogObject.id)

         // päivittää blogilistan
         setBlogs(blogs.filter((blog => blog.id !== blogObject.id)))

         navigate('/')
      }
      catch {
         setNotification({
            text: 'Could not remove blog.',
            type: 'error'
         })
         setTimeout(() => {setNotification(null), 5000})
      }
   }

   const handleLogin = async event => {
      event.preventDefault()
      console.log(`Attempting to log in as: ${username} - ${password}`)

      try {
         const user = await loginService.login({ username, password })

         window.localStorage.setItem('loggedUser', JSON.stringify(user))
         blogService.setToken(user.token)

         navigate('/')

         setUser(user)
         setUsername('')
         setPassword('')
      }
      catch {
         setNotification({
            text: 'Login unsuccessful: incorrect username or password.',
            type: 'error'
         })
         setTimeout(() => {setNotification(null)}, 5000)
      }
   }

   // 5.2: käyttäjän kirjaus ulos
   const handleLogout = async event => {
      event.preventDefault()

      window.localStorage.removeItem('loggedUser')

      navigate('/')

      blogService.setToken(null)
      setUser(null)
      setUsername('')
      setPassword('')
   }

   const padding = {padding: 5}

   return (
      <Container>
         <AppBar position="static">
            <Toolbar>
               <Typography variant="h5" style={{padding: 10}}>
                  Blog App
               </Typography>

               <Button color="inherit" component={Link} to="/">Blogs</Button>
               <Button color="inherit" component={Link} to="/create">Create</Button>
               
               {!user && (
                  <Button color="inherit" component={Link} to="/login">Log in</Button>
               )}
               {user && (
                  <Button color="inherit" onClick={handleLogout}>Log out</Button>
               )}
            </Toolbar>
         </AppBar>
            
         <Routes>
            <Route path="/" element={
               <div>
                  <Notification msg={notification}/>
                  <div>
                     <h2>Current blogs</h2>
                     <TableContainer component={Paper}>
                        <Table>
                           <TableBody>
                              {blogs.sort((a, b) => a.likes < b.likes).map(blog =>
                                 <TableRow key={blog.id}>
                                    <TableCell>
                                       <Link to={`blogs/${blog.id}`}>{blog.title}</Link>
                                    </TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </TableContainer>
                  </div>
               </div>
            }/>

            <Route path="/create" element={
               <div>
                  {user && (
                     <BlogForm createBlog={addBlog}/>
                  )}
                  {!user && (
                     <p>Log in to add blogs :3</p>
                  )}
               </div>
            }/>
            
            <Route path="/blogs/:id" element={
               <Blog blogs={blogs} handleLikes={updateLikes} handleRemove={removeBlog} user={user}/>
            }/>

            <Route path="/login" element={
               <div>
                  {!user && (
                     <LoginForm username={username} password={password}
                           handleUsernameChange={({ target }) => setUsername(target.value)}
                           handlePasswordChange={({ target }) => setPassword(target.value)}
                           handleSubmit={handleLogin}
                     />
                  )}
                  {user && (
                     <p>Currently logged in as {user.name}</p>
                  )}
               </div>
            }/>
         </Routes>
      </Container>
   )
}

export default App