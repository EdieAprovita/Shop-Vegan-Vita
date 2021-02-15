import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
	return (
		<footer>
			<Container>
				<Row>
					<Col className='text-center py-3'>Copyright &copy; Vegan-Vita</Col>
				</Row>
			</Container>
		</footer>
	)
}

export default Footer
