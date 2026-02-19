const Form = ({
	onSubmit,
	newName, newNumber,
	handleNameChange, handleNumberChange
}) => {
   return (
		<div>
			<h2>Add new entry:</h2>
			<form onSubmit={onSubmit}>
				<p>name: <input value={newName} onChange={handleNameChange}/></p>
				<p>number: <input value={newNumber} onChange={handleNumberChange}/></p>
				<button type="submit">add</button>
			</form>
		</div>
	)
}

export default Form