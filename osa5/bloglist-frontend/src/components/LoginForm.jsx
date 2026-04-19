const LoginForm = (props) => (
   <div>
      <h2>Login</h2>
      <form onSubmit={props.handleSubmit}>
         <div>
            <label>
               username
               <input type="text" value={props.username} onChange={props.handleUsernameChange}/>
            </label>
         </div>
         <div>
            <label>
               password
               <input type="text" value={props.password} onChange={props.handlePasswordChange}/>
            </label>
         </div>
         <button type="submit">Log in loser &gt;:3</button>
      </form>
   </div>
)

export default LoginForm