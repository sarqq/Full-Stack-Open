import {Alert} from '@mui/material'

const Notification = ({ msg }) => {
   if (!msg) return null

   return (
      <Alert style={{marginTop: 10, marginBottom: 10}} severity={msg.type}>
         {msg.text}
      </Alert>
   )
}

export default Notification