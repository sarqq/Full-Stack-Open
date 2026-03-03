const Alert = ({msg}) => {
    if (!msg) return null

    return (
        <div className="alert">
            {msg}
        </div>
    )
}

export default Alert