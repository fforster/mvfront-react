import React, {Component} from "react";
import {Link} from "react-router-dom";

class Footer extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render(){
        return(
            <footer className="text-center">
                <Link to="/">Inicio</Link>
                <span className="m-2">-</span>
                <a href="https://github.com/MieuxVoter">Código fuente</a>
                <span className="m-2">-</span>
                <a href="https://mieuxvoter.fr/">Quiénes somos ?</a>
                <div className="mt-2">
                    MieuxVoter &copy;
                </div>
            </footer>
        )
    }
}
export default Footer;
