

const Notification = ({ message }) => {
  if (message === null || message === ''){
    return null
  }

  return (
    <div className="success">
      <h3>
        <i>
          {message}
        </i>
      </h3>
    </div>
  )
}

export default Notification