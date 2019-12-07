import React, {Component} from "react";
import {Button, Col, Container,  Row} from "reactstrap";
import {Link} from 'react-router-dom';
import { faCopy, faUsers } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import logoLine from "../../logos/logo-line-white.svg";


class UnknownView extends Component {

    constructor(props) {
        super(props);
        const electionSlug  = this.props.match.params.handle;
        this.state = {
            urlOfVote: "https://" + window.location.hostname + "/vote/" + electionSlug,
            urlOfResult: "https://" + window.location.hostname + "/result/" + electionSlug
        };
        this.urlVoteField = React.createRef();
        this.urlResultField = React.createRef();
    }

    handleClickOnField=(event)=>{
        event.target.focus();
        event.target.select();
    };

    handleClickOnCopyVote=(event)=>{
        const input = this.urlVoteField.current;
        input.focus();
        input.select();
        document.execCommand("copy");
    };

    handleClickOnCopyResult=(event)=>{
        const input = this.urlResultField.current;
        input.focus();
        input.select();
        document.execCommand("copy");
    };

    render(){
        return(
            <Container>
                    <Row>
                        <Link  to="/" className="d-block ml-auto mr-auto mb-4"><img src={logoLine} alt="logo" height="128" /></Link>
                    </Row>
                    <Row className="mt-4">
                        <Col className="text-center offset-lg-3" lg="6"><h2>Voto creado con éxito !</h2>
                        <p className="mt-4 mb-1">Ahora puede compartir el enlace de votación con los participantes :</p>


                            <div className="input-group  ">
                                <input type="text" className="form-control" ref={this.urlVoteField}
                                       value={this.state.urlOfVote} readOnly onClick={this.handleClickOnField} />

                                    <div className="input-group-append">
                                        <Button  className="btn btn-outline-light" onClick={this.handleClickOnCopyVote}
                                                type="button">
                                            <FontAwesomeIcon icon={faCopy} className="mr-2"/>Copier</Button>
                                    </div>

                            </div>

                            <p className="mt-4 mb-1">Aquí está el enlace a los resultados de la votación en tiempo real :</p>
                            <div className="input-group ">
                                <input type="text" className="form-control" ref={this.urlResultField}
                                       value={this.state.urlOfResult} readOnly onClick={this.handleClickOnField} />

                                <div className="input-group-append">
                                    <Button  className="btn btn-outline-light" onClick={this.handleClickOnCopyResult}
                                             type="button">
                                        <FontAwesomeIcon icon={faCopy} className="mr-2"/>Copier</Button>
                                </div>

                            </div>


                        </Col>
                    </Row>
                <Row className="mt-4 mb-4" >
                    <Col >
                        <div className=" bg-warning text-white p-2 "><p className="m-0 p-0 text-center">Mantenga estos enlaces en un lugar seguro !</p>
                        <p className="small m-2 p-0"><b>ATENCIÓN</b> : No los encontrará en otro lugar y no podremos enviárselos. 
                        Por ejemplo, puede guardarlos en los favoritos de su navegador.</p></div>
                    </Col>
                </Row>

                    <Row className="mt-4 mb-4" >
                        <Col className="text-center">
                          <Link to={ "/vote/" + this.props.match.params.handle} className="btn btn-success"><FontAwesomeIcon icon={faUsers} className="mr-2"/>Participer maintenant !</Link>
                        </Col>
                    </Row>
            </Container>
        )
    }
}
export default UnknownView;
