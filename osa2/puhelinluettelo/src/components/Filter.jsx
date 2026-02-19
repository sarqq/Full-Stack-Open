const Filter = ({query, handleQueryChange}) => {
    return (
        <div>
            <h2>Filter entries:</h2>
            <input type="search" value={query} onChange={handleQueryChange}/>
        </div>
    )
}

export default Filter