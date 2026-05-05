import {TextField, Button} from '@mui/material'

const LoginForm = (props) => (
   <div>
      <h2>Login</h2>
      <form onSubmit={props.handleSubmit}>
         <TextField label="username" value={props.username} onChange={props.handleUsernameChange}/>
         <TextField label="password" value={props.password} onChange={props.handlePasswordChange}/>
         <Button type="submit" variant="contained" style={{marginTop: 10, padding: 5}}>Log in loser &gt;:3</Button>
      </form>
   </div>
)

export default LoginForm