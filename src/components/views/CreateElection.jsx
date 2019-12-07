import React, {Component} from "react";
import { Redirect } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Input,
    Label,
    InputGroup,
    InputGroupAddon,
    Button
} from 'reactstrap';

import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resolve } from 'url';
import HelpButton from "../form/HelpButton";
import {arrayMove, sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import ButtonWithConfirm from "../form/ButtonWithConfirm";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus, faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons';

import { grades } from '../../Util';


const DragHandle = sortableHandle(({children}) => <span className="input-group-text indexNumber">{children}</span>);

const SortableCandidate = sortableElement(({candidate, sortIndex, form}) => <li className="sortable">

        <Row key={"rowCandidate" + sortIndex}>
            <Col>
                <InputGroup >
                    <InputGroupAddon addonType="prepend"  >
                        <DragHandle  >
                            <span >{sortIndex + 1}</span>
                        </DragHandle>
                    </InputGroupAddon>
                    <Input type="text" value={candidate.label}
                           onChange={(event) => form.editCandidateLabel(event, sortIndex)}
                           onKeyPress={(event) => form.handleKeypressOnCandidateLabel(event, sortIndex)}
                           placeholder="Nombre de su candidato o propuesta ..."
                           tabIndex={ sortIndex + 1}
                           innerRef={(ref) => form.candidateInputs[sortIndex] = ref}
                           maxLength="250"/>
                    <ButtonWithConfirm className="btn btn-primary input-group-append border-light">
                        <div key="button"><FontAwesomeIcon icon={faTrashAlt} /></div>
                        <div key="modal-title">Eliminar ?</div>
                        <div key="modal-body">Está seguro que desea eliminar? {(candidate.label!=="")?<b>"{candidate.label}"</b>:<span>la ligne {sortIndex+1}</span>} ?
                        </div>
                        <div key="modal-confirm" onClick={() => form.removeCandidate(sortIndex)}>Sí</div>
                        <div key="modal-cancel">No</div>
                    </ButtonWithConfirm>
                </InputGroup>
            </Col>
            <Col xs="auto" className="align-self-center pl-0">
                <HelpButton>
                    Introduzca acá el nombre de su candidato o propuesta (250 caracteres máx.)
                </HelpButton>
            </Col>
        </Row>

</li>);

const SortableCandidatesContainer = sortableContainer(({items, form}) => {
    return <ul className="sortable">{items.map((candidate, index) => (
        <SortableCandidate key={`item-${index}`} index={index} sortIndex={index} candidate={candidate} form={form}/>
    ))}</ul>;
});

class CreateElection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidates:[{label:""},{label:""}],
            numCandidatesWithLabel:0,
            title:null,
            isVisibleTipsDragAndDropCandidate:true,
            numGrades:7,
            successCreate: false,
            redirectTo: null
        };
        this.candidateInputs = [];
        this.focusInput= React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChangeTitle= (event) => {
        this.setState({title: event.target.value});
    };

    addCandidate = (event) => {

        let candidates = this.state.candidates;
        if (candidates.length < 100) {
            candidates.push({label:""});
            this.setState({ candidates: candidates});
        }
        if(event.type === 'keypress'){
            setTimeout(()=>{ this.candidateInputs[this.state.candidates.length-1].focus();},250);
        }

    };

    removeCandidate = (index) => {
        let candidates = this.state.candidates;
        candidates.splice(index, 1);
        console.log(candidates.length);
        if(candidates.length===0){
            candidates=[{label:""}];
        }
        this.setState({candidates: candidates});
    };

    editCandidateLabel = (event, index) => {
        let candidates = this.state.candidates;
        let numLabels = 0;
        candidates[index].label = event.currentTarget.value;
        candidates.map((candidate,i)=>{
            if(candidate.label!==""){
                numLabels++;
            }
            return candidate.label;
        });
        this.setState({candidates: candidates, numCandidatesWithLabel:numLabels});

    };

    handleKeypressOnCandidateLabel = (event, index) => {
        if(event.key === 'Enter'){
            event.preventDefault();
            if(index+1===this.state.candidates.length){
                this.addCandidate(event);
            }else{
               this.candidateInputs[index+1].focus();
            }

        }

    };

    onCandidatesSortEnd = ({oldIndex, newIndex}) => {
        let candidates = this.state.candidates;
        candidates = arrayMove(candidates, oldIndex, newIndex);
        this.setState({candidates: candidates});
    };

    handleChangeNumGrades= (event) => {
        this.setState({numGrades: event.target.value});
    };

    componentWillMount() {
        const params = new URLSearchParams(this.props.location.search);
        this.setState({title:params.get("title")?params.get("title"):""});

    };

    handleSubmit () {
        const {
          candidates,
          title,
          numGrades
        } = this.state;

        const endpoint = resolve(
            process.env.REACT_APP_SERVER_URL,
            'election/'
        );

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                candidates: candidates.map(c => c.label),
                on_invitation_only: false,
                num_grades: numGrades,
                elector_emails: []
            })
        })
            .then(response => response.json())
            .then(result => this.setState(state => ({
                redirectTo: '/create-success/' + result.id,
                successCreate: true
            })))
            .catch(error => error);
    };

    handleSendWithoutCandidate = () => {
        toast.error("Debe ingresar al menos dos candidatos !", {
            position: toast.POSITION.TOP_CENTER
        });
    };

    render(){
        const { successCreate, redirectTo } = this.state;
        const params = new URLSearchParams(this.props.location.search);

        if (successCreate) return <Redirect to={redirectTo} />;

        return(
            <Container>
                <ToastContainer/>
                <form onSubmit={this.handleSubmit} autoComplete="off" >
                    <Row>
                        <Col ><h3>Comience una votación</h3></Col>
                    </Row>
                    <hr />
                    <Row className="mt-4">
                        <Col xs="12" >
                            <Label for="title">Pregunta de la votación :</Label>
                        </Col>
                        <Col>
                            <Input placeholder="Introduzca acá la pregunta de su votación" tabIndex="1" name="title" id="title" innerRef={this.focusInput} autoFocus  defaultValue={params.get("title")?params.get("title"):""} onChange={this.handleChangeTitle} maxLength="250" />
                        </Col>
                        <Col xs="auto" className="align-self-center pl-0">
                            <HelpButton>
                                Introduza acá su pregunta o simplemente el encabezado de su voto (250 caracteres máx.)
                                <br /><u>Por ejemplo :</u> <em>Para ser mi representante, evalúo a este candidato ...</em>
                            </HelpButton>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col xs="12" >
                            <Label for="title">Candidatos / Propuestas :</Label>
                        </Col>
                        <Col xs="12" >
                            <SortableCandidatesContainer items={this.state.candidates} onSortEnd={this.onCandidatesSortEnd}
                                                         form={this} useDragHandle/>
                        </Col>
                    </Row>
                    <Row className="mb-4" >
                        <Col className="text-right" >
                        <Button className="btn-secondary"
                                tabIndex={this.state.candidates.length+2}
                                type="button"
                                onClick={(event)=>this.addCandidate(event)}>
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />Agregar una propuesta</Button>
                        </Col>
                        <Col xs="auto" />
                    </Row>
                    <Row className="mt-4 mb-4">
                        <Col xs="12" >
                            <Label for="title">Número de opciones :</Label>
                        </Col>
                        <Col  xs="" md="2" >
                            <select  className="form-control" tabIndex={this.state.candidates.length+3} onChange={this.handleChangeNumGrades}  defaultValue="7">
                                <option value="5">5</option>
                                <option value="6" >6</option>
                                <option value="7">7</option>
                            </select>
                        </Col>
                        <Col xs="auto" className="align-self-center pl-0">
                            <HelpButton>
                                Puede elegir aquí el número de evaluaciones posibles
                                <br /><u>Por ejemplo : </u> <em> 5 = Excelente, Muy bueno, bueno, bastante bueno, suficiente</em>
                            </HelpButton>
                        </Col>
                        <Col xs="12" md="" >
                            { grades.map((mention,i) => {
                                return <span key={i} className="badge badge-light mr-2 mt-2" style={{backgroundColor:mention.color,color:"#fff",opacity:(i<this.state.numGrades)?1:0.3}} >{mention.label}</span>
                            })
                            }
                        </Col>

                    </Row>
                    <hr />
                    <Row className="mt-4 justify-content-md-center">
                        <Col xs="12"  md="3"   >
                            {this.state.numCandidatesWithLabel>=2?<ButtonWithConfirm className="btn btn-success float-right btn-block" tabIndex={this.state.candidates.length+4}>
                                <div key="button"><FontAwesomeIcon icon={faCheck} className="mr-2" />Validar</div>
                                <div key="modal-title">Confirme su voto</div>
                                <div key="modal-body">
                                    <div className="mt-1 mb-1">
                                        <div className="text-white bg-primary p-1">Pregunta de la votación :</div>
                                        <div className="p-1 pl-3"><em>{this.state.title}</em></div>
                                        <div className="text-white bg-primary p-1">Candidatos/Propuestas :</div>
                                        <div className="p-1 pl-0"><ul className="m-0 pl-4">
                                            {
                                                this.state.candidates.map((candidate,i) => {
                                                    if(candidate.label!==""){
                                                       return <li key={i} className="m-0">{candidate.label}</li>
                                                    }else{
                                                        return <li key={i} className="d-none" />
                                                    }

                                                })
                                            }
                                        </ul></div>
                                        <div className="text-white bg-primary p-1">Opciones :</div>
                                        <div className="p-1 pl-3">{ grades.map((mention,i) => {
                                            return (i<this.state.numGrades)?<span key={i} className="badge badge-light mr-2 mt-2" style={{backgroundColor:mention.color,color:"#fff"}}>{mention.label}</span>:<span key={i}/>
                                        })
                                        }</div>
                                    </div>
                                </div>
                                <div key="modal-confirm" onClick={this.handleSubmit}>Comienza la votación</div>
                                <div key="modal-cancel">Anular</div>
                            </ButtonWithConfirm>:<Button type="button" className="btn btn-dark float-right btn-block" onClick={this.handleSendWithoutCandidate}><FontAwesomeIcon icon={faCheck} className="mr-2" />Validar</Button>}
                        </Col>
                    </Row>
                </form>
            </Container>
        )
    }
}
export default CreateElection;
