import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import Alert from './components/Alert.jsx'
import Togglable from './components/Togglable.jsx'
import BlogForm from './components/BlogForm.jsx'
import LoginForm from './components/LoginForm.jsx'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
   const [blogs, setBlogs] = useState([])

   // 5.1: kirjautumislomakkeen toteutus
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [user, setUser] = useState(null)

   // 5.3: blogin lisäyksen toteutus
   const [newTitle, setTitle] = useState('')
   const [newAuthor, setAuthor] = useState('')
   const [newUrl, setUrl] = useState('')

   // 5.4: notifikaation lisäys
   const [alert, setAlert] = useState(null)

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

   const addBlog = async event => {
      event.preventDefault()
      
      try {
         if (!newTitle || !newUrl) {
            setAlert('Could not create blog: invalid or missing title or URL.')
            return
         }

         const newBlog = {
            title: newTitle,
            author: newAuthor,
            url: newUrl
         }

         const returnedBlog = await blogService.create(newBlog)
         
         setAlert(`Successfully added ${returnedBlog.title}`)
         setTimeout(() => {setAlert(null)}, 5000)   
         
         setBlogs(blogs.concat(returnedBlog))
         setTitle('')
         setAuthor('')
         setUrl('')
      }
      catch {
         setAlert('Could not create blog')
         setTimeout(() => {
            setAlert(null)
         }, 5000)
      }
   }

   const handleLogin = async event => {
      event.preventDefault()
      console.log(`Attempting to log in as: ${username} - ${password}`)

      try {
         const user = await loginService.login({username, password})
         
         window.localStorage.setItem('loggedUser', JSON.stringify(user))
         blogService.setToken(user.token)
         
         setUser(user)
         setUsername('')
         setPassword('')
      }
      catch {
         setAlert('Log in unsuccessful: incorrect username or password.')
         setTimeout(() => {
            setAlert(null)
         }, 5000)
      }
   }

   // 5.2: käyttäjän kirjaus ulos
   const handleLogout = async event => {
      event.preventDefault()
      
      window.localStorage.removeItem('loggedUser')

      blogService.setToken(null)
      setUser(null)
      setUsername('')
      setPassword('')
   }

   const blogView = () => (
      <>
         <h2>Current blogs</h2>
         {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
         )}
      </>
   )

   return (
      <div>
         <h1>Blogs</h1>
         {!user && (
            <Togglable buttonLabel="Log in">
               <LoginForm username={username} password={password}
                  handleUsernameChange={({target}) => setUsername(target.value)}
                  handlePasswordChange={({target}) => setPassword(target.value)}
                  handleSubmit={handleLogin}
               />
            </Togglable>
         )}
         {user && (
            <div>
               <Alert msg={alert}/>
               <p>
                  Logged in as: {user.name}
                  <button onClick={handleLogout}>Log out</button>
               </p>
               {blogView()}
               <Togglable buttonLabel="Add new">
                  <BlogForm newTitle={newTitle} newAuthor={newAuthor} newUrl={newUrl}
                     handleTitleChange={({target}) => setTitle(target.value)}
                     handleAuthorChange={({target}) => setAuthor(target.value)}
                     handleUrlChange={({target}) => setUrl(target.value)}
                     handleSubmit={addBlog}
                  />
               </Togglable>
            </div>
         )}
      </div>
   )
}

export default App