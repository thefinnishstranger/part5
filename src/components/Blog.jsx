

import Togglable from './Togglable'

const Blog = ({ blog, handleLike, handleDelete }) => (
  <div className="blogBlock">
    <p className='blogTitle'>Title of the blog: <b><i>{blog.title}</i></b></p>
    <p className='blogAuthor'>Author of the blog: <b><i>{blog.author}</i></b></p>
    <Togglable buttonLabel="view">
      <p className='blogUrl'>Url: <b><i>{blog.url}</i></b></p>
      <p className='blogLikes'>Likes: <b><i>{blog.likes}</i></b>
        <button onClick={(event) => handleLike(event, blog.id)}>like</button>
      </p>
      <button onClick={(event) => handleDelete(event, blog.id)}>
            delete
      </button>
    </Togglable>
  </div>
)

export default Blog