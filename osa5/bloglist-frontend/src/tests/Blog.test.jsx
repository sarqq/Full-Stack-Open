import {render, screen} from '@testing-library/react'
import Blog from '../components/Blog'

describe('Blog renders correctly', () => {
   // 5.13: blogin renderöityminen oikein
   test('Only title visible by default', async () => {
      const testblog = {
         title: 'testiblogi420',
         author: 'mie',
         url: 'juuh.org',
         likes: 69,
         user: null
      }

      render(<Blog blog={testblog}/>)

      const element = screen.getByText('testiblogi420')
      expect(element).toBeDefined()
   })
})