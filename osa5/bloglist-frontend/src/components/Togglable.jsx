/* Valmis komponentti kurssimateriaalista */
import { useState } from 'react'

const Togglable = (props) => {
   const [visible, setVisible] = useState(false)

   const hideWhenVisible = { display: visible ? 'none' : '' }
   const showWhenVisible = { display: visible ? '' : 'none' }

   const toggleVisibility = () => {
      setVisible(!visible)
   }

   const buttonStyle = {
      float: 'right'
   }

   return (
      <div>
         <div style={hideWhenVisible}>
            <button onClick={toggleVisibility} style={buttonStyle}>{props.buttonLabelOn}</button>
         </div>

         <div style={showWhenVisible}>
            {props.children}
            <button onClick={toggleVisibility} style={buttonStyle}>{props.buttonLabelOff}</button>
         </div>
      </div>
   )
}

export default Togglable