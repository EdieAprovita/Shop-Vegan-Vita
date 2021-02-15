import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/Homepage'

function App() {
	return (
		<div className='App'>
			<Header />
			<main className='py-4'>
				<Container>
					<h1>Tienda</h1>
					<HomePage />
				</Container>
			</main>
			<Footer />
		</div>
	)
}

export default App
