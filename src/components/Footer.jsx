import Leaders from './Leaders'
import CommentSection from './CommentSection'

const Footer = () => {
  return (
    <footer className="footer mt-auto">
        <Leaders />
        <CommentSection />
        <p style={{ marginTop: '2rem', color: '#6c757d', fontSize: '1rem' }}>
          &copy; 2025, developed by{' '}
          <a href="https://www.krishvattum.com/" target="_blank" rel="noreferrer">K. Hvattum</a>{' '}and{' '}
          <a href="https://vn0.dev" target="_blank" rel="noreferrer">Vn0 (Chris)</a>
        </p>
    </footer>
  )
}

export default Footer;