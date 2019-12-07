import React, {Component} from "react";
import {Col, Container,  Row} from "reactstrap";
import logoLine from "../../logos/logo-line-white.svg";
import {Link} from 'react-router-dom';


class UnknownView extends Component {

    render(){
        return(
            <Container>
                    <Row>
                      <Link  to="/" className="d-block ml-auto mr-auto mb-4">
                        <img src={logoLine} alt="logo" height="128" />
                      </Link>
                    </Row>
                    <Row className="mt-4">
                      <Col className="text-center offset-lg-3" lg="6">
                        <h2>Participación registrada con éxito !</h2>
                        <p>Gracias por su participación.</p>

                        </Col>
                    </Row>

                <Row className="mt-4" >
                    <Col className="text-center">
                        <Link to="/" className="btn btn-secondary">Volver al inicio</Link>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default UnknownView;
