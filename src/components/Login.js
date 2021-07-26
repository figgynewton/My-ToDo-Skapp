import React from 'react';
import {Button} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

function Login(props) {
    return (
        <div className="LoginButton">
        {props.loggedIn === true && (
            <Button color="green" onClick={props.handleMySkyLogout}>
                Log Out of MySky
            </Button>
            )}

            {props.loggedIn === false && (
            <Button className="login" onClick={props.handleMySkyLogin}>
                Login with MySky
            </Button>
            )}

           {props.loggedIn === null && <Button>Loading MySky...</Button>}
        </div>
    )
}

export default Login;