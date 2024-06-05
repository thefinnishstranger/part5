
import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit, handleUsernameChange, handlePasswordChange, username, password
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <h2>
            Login
      </h2>
      <div>
        username
        <input
          data-testid='username'
          type="text"
          value={username}
          name="Username"
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        password
        <input
          data-testid='password'
          type="password"
          value={password}
          name="Password"
          onChange={handlePasswordChange}
        />
      </div>
      <button type='submit'>
        login
      </button>
    </form>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm
