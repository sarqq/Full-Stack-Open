import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

const testblog = {
   title: 'testiblogi420',
   author: 'mie',
   url: 'juuh.org',
   likes: 69,
   user: null
}

const mockHandler = vi.fn()

describe('Blog renders correctly', () => {
   // 5.13: blogin renderöityminen oikein
   test('Only title visible by default', async () => {
      render(<Blog blog={testblog} handleLikes={mockHandler} handleRemove={mockHandler}/>)

      expect(screen.getByText('testiblogi420')).toBeDefined()
      expect(screen.queryByText('juuh.org')).not.toBeVisible()
      expect(screen.queryByText('author: mie')).not.toBeVisible()
      expect(screen.queryByText('likes: 69')).not.toBeVisible()
   })
   // 5.14: blogin renderöityminen oikein, kun togglattu auki
   test('Url, likes and user visible when toggled', async () => {
      const user = userEvent.setup()

      render(<Blog blog={testblog} handleLikes={mockHandler} handleRemove={mockHandler}/>)
      await user.click(screen.getByText('View'))

      expect(screen.queryByText('juuh.org')).toBeVisible()
      expect(screen.queryByText('author: mie')).toBeVisible()
      expect(screen.queryByText('likes: 69')).toBeVisible()
   })
})