import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
   const [blogs, setBlogs] = useState([])
   const [errorMessage, setErrorMessage] = useState(null)

   // 5.1: kirjautumislomakkeen toteutus
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [user, setUser] = useState(null)

   // 5.3: blogin lisäyksen toteutus
   const [newTitle, setTitle] = useState('')
   const [newAuthor, setAuthor] = useState('')
   const [newUrl, setUrl] = useState('')

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
            setErrorMessage('Could not create blog: invalid or missing title or URL.')
            return
         }

         const newBlog = {
            title: newTitle,
            author: newAuthor,
            url: newUrl
         }

         const returnedBlog = await blogService.create(newBlog)
         
         console.log(`Successfully added ${returnedBlog.title}`)
            
         setBlogs(blogs.concat(returnedBlog))
         setTitle('')
         setAuthor('')
         setUrl('')
      }
      catch {
         setErrorMessage('Could not create blog')
         setTimeout(() => {
            setErrorMessage(null)
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
         setErrorMessage('Log in unsuccessful: incorrect username or password.')
         setTimeout(() => {
            setErrorMessage(null)
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

   const loginForm = () => (
      <>
         <h2>Login</h2>
         <form onSubmit={handleLogin}>
            <div>
               <label>
                  username
                  <input type="text" value={username} onChange={({target}) => setUsername(target.value)}/>
               </label>
            </div>
            <div>
               <label>
                  password
                  <input type="text" value={password} onChange={({target}) => setPassword(target.value)}/>
               </label>
            </div>
            <button type="submit">Log in loser &gt;:3</button>
         </form>
      </>
   )

   const blogForm =  () => (
      <>
         <h2>Add new blog</h2>
         <form onSubmit={addBlog}>
            <div>
               <label>
                  title:
                  <input type="text" value={newTitle} onChange={({target}) => setTitle(target.value)}/>
               </label>
            </div>
            <div>
               <label>
                  author:
                  <input type="text" value={newAuthor} onChange={({target}) => setAuthor(target.value)}/>
               </label>
            </div>
            <div>
               <label>
                  url:
                  <input type="text" value={newUrl} onChange={({target}) => setUrl(target.value)}/>
               </label>
            </div>
            <button type="submit">Add blog</button>
         </form>
      </>
   )

   const blogView = () => (
      <>
         <h2>Blogs</h2>
         {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
         )}
      </>
   )

   return (
      <div>
         {!user && loginForm()}
         {user && (
            <div>
               <p>
                  Logged in as: {user.name}
                  <button onClick={handleLogout}>Log out</button>
               </p>
               {blogView()}
               {blogForm()}
            </div>
         )}
      </div>
   )
}

export default App