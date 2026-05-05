import { useState, useEffect } from 'react'
import {
   BrowserRouter as Router,
   Routes,
   Route,
   Link,
   useNavigate
} from 'react-router-dom'

import blogService from './services/blogs'
import loginService from './services/login'

import Blog from './components/Blog'
import Alert from './components/Alert.jsx'
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
   const [alert, setAlert] = useState(null)

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
            setAlert('Could not create blog: invalid or missing title or URL.')
            return
         }

         const returnedBlog = await blogService.create(blogObject)

         setAlert(`Successfully added ${returnedBlog.title}`)
         setTimeout(() => {setAlert(null)}, 5000)

         setBlogs(blogs.concat(returnedBlog))

      }
      catch {
         setAlert('Could not create blog')
         setTimeout(() => {setAlert(null)}, 5000)
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

         setAlert(`Liked ${updatedBlog.title}`)
         setTimeout(() => {setAlert(null)}, 5000)
      }
      catch {
         setAlert('Unknown error when liking blog.')
         setTimeout(() => {setAlert(null)}, 5000)
      }
   }

   // 5.11: blogin poisto
   const removeBlog = async (blogObject) => {
      try {
         await blogService.del(blogObject.id)

         // päivittää blogilistan
         setBlogs(blogs.filter((blog => blog.id !== blogObject.id)))

         setAlert(`Removed ${blogObject.title} by ${blogObject.author}`)
         setTimeout(() => {setAlert(null)}, 5000)
      }
      catch {
         setAlert('Could not remove blog.')
         setTimeout(() => {setAlert(null), 5000})
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
         setAlert('Log in unsuccessful: incorrect username or password.')
         setTimeout(() => {setAlert(null)}, 5000)
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
      <>
         <div>
            <Link style={padding} to="/">Blogs</Link>
            {!user && (
               <Link style={padding} to="/login">Log in</Link>
            )}
            {user && (
               <button style={padding} onClick={handleLogout}>Log out</button>
            )}
         </div>
            
         <Routes>
            <Route path="/" element={
               <div>
                  <Alert msg={alert}/>
                  <div>
                     <h2>Current blogs</h2>
                     {blogs.sort((a, b) => a.likes < b.likes).map(blog =>
                        <Blog key={blog.id} blog={blog} handleLikes={updateLikes} handleRemove={removeBlog} user={user}/>
                     )}
                     {user && (
                        <Togglable buttonLabelOn="Add new" buttonLabelOff="Cancel">
                           <BlogForm createBlog={addBlog}/>
                        </Togglable>
                     )}
                  </div>
               </div>
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
      </>
   )
}

export default App