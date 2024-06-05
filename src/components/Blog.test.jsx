import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach, describe } from 'vitest'
import Togglable from './Togglable'
import BlogForm from './BlogForm'

/*test('renders content', async () => {
  const blog = {
    title: 'hello woman',
    author: 'womanizer',
    url: 'www.hello.com',
    likes: 10
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  //const button = screen.getByText('lol')
  //await user.click(button)

  //expect(mockHandler.mock.calls).toHaveLength(1)

  //screen.debug()
  const element = screen.getByText('hello woman')
  screen.debug(element)



  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'hello woman'
  )
}) */

/*

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const input = screen.getByPlaceholderText('title of the blog')
    const sendButton = screen.getByText('create')

    await user.type(input, 'testing a form...')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].content).toBe('testing a form...')

    console.log(createBlog.mock.calls)
})


describe('<Togglable />', () => {
    let container

    beforeEach(() => {
        container = render(
            <Togglable buttonLabel="show...">
                <div className='testDiv' >
                    togglable content
                </div>
            </Togglable>
        ).container
    })

    test('renders its children', async () => {
        await screen.findAllByText('togglable content')
    })

    test('at start the children are not displayed', () => {
        const div = container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })

    test('after clicking the button, children are displayed', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('show...')
        await user.click(button)

        const div = container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display: none')
    })

    test('toggled content can be closed', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('show...')
        await user.click(button)

        const closeButton = screen.getByText('hide')
        await user.click(closeButton)

        const div = container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })

}) */

describe('blog component test', () => {

    let blog = {
        title: "i do not know",
        author: "nikolas",
        url: "www.drake.com",
        likes: 1
    }

    const handleLike = vi.fn()
    const handleDelete = vi.fn()

    test('renders blog title and author, but not url and likes by default', async () => {
        render(<Blog blog={blog} handleLike={handleLike} handleDelete={handleDelete} /> )
    
        expect(screen.getByText('i do not know')).toBeInTheDocument()
        expect(screen.getByText('nikolas')).toBeInTheDocument()
    })

    test('url and likes are shown when view button is pressed', async () => {
        const user = userEvent.setup()
        render(<Blog blog={blog} handleLike={handleLike} handleDelete={handleDelete} /> )

        const button = screen.getByText('view')
        await user.click(button)

        const blogUrl = screen.getByText('Url:', { exact: false })
        expect(blogUrl).toBeInTheDocument()

        const likes = screen.getByText('Likes:', { exact: false })
        expect(likes).toBeInTheDocument()
    })

    test('if the like button is clicked twice the event handler is called exactly twice', async () => {

        render(<Blog blog={blog} handleLike={handleLike} handleDelete={handleDelete} />)

        const user = userEvent.setup()

        const viewButton = screen.getByText('view')
        await user.click(viewButton)

        const likeButton = screen.getByText('like')
        await user.click(likeButton)
        await user.click(likeButton)

        expect(handleLike.mock.calls).toHaveLength(2)
    })
})
