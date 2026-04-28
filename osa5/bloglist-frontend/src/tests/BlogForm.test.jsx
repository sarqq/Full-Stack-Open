import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../components/BlogForm'

const testblog = {
   title: 'testiblogi420',
   author: 'mie',
   url: 'juuh.org'
}

// 5.16: blogilomakkeen testaus
test('Callback function called with correct values on submit', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog}/>)

    const title = screen.getByLabelText('title:')
    const author = screen.getByLabelText('author:')
    const url = screen.getByLabelText('url:')
    const submitButton = screen.getByText('Add blog')

    await user.type(title, testblog.title)
    await user.type(author, testblog.author)
    await user.type(url, testblog.url)
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe(testblog.title)
    expect(createBlog.mock.calls[0][0].author).toBe(testblog.author)
    expect(createBlog.mock.calls[0][0].url).toBe(testblog.url)
})