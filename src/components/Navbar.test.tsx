import { render, screen } from '@testing-library/react'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('renders the brand name', () => {
    render(<Navbar />)
    expect(screen.getByText('CampusConnect')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Navbar />)
    
    // Use getAllByText because links appear in both desktop and mobile menus
    expect(screen.getAllByText('Home')).toHaveLength(2)
    expect(screen.getAllByText('Events')).toHaveLength(2)
    expect(screen.getAllByText('Marketplace')).toHaveLength(2)
    expect(screen.getAllByText('Study Groups')).toHaveLength(2)
    expect(screen.getAllByText('Profile')).toHaveLength(2)
  })

  it('has correct link destinations', () => {
    render(<Navbar />)
    
    // Get all Home links and check the first one (desktop)
    const homeLinks = screen.getAllByText('Home')
    expect(homeLinks[0].closest('a')).toHaveAttribute('href', '/')
    
    const eventsLinks = screen.getAllByText('Events')
    expect(eventsLinks[0].closest('a')).toHaveAttribute('href', '/events')
  })
})