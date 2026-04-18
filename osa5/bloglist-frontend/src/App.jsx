import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
   const [blogs, setBlogs] = useState([])

   // 5.1: kirjautumislomakkeen toteutus
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [user, setUser] = useState(null)

   useEffect(() => {
      blogService.getAll().then(blogs =>
         setBlogs( blogs )
      )  
   }, [])

   const handleLogin = async event => {
      event.preventDefault()
      console.log(`Attempting to log in as: ${username} - ${password}`)

      try {
         const user = await loginService.login({username, password})
         
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
               <p>Logged in as: {user.name}</p>
               {blogView()}
            </div>
         )}
      </div>
   )
}

export default App