import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import { SkynetClient } from "skynet-js";
import TodoList from './components/TodoList';
import { ContentRecordDAC } from '@skynetlabs/content-record-library';


const portal =
  window.location.hostname === 'localhost' ? 'https://siasky.net' : undefined;
  
console.log("portal: ", portal);

const client = new SkynetClient(portal);
const contentRecord = new ContentRecordDAC();

function App() {
  const [userID, setUserID] = useState();
  const [mySky, setMySky] = useState();
  const [loggedIn, setLoggedIn] = useState(null);
  const [data, setData] = useState(null);

  const dataDomain = 'localhost';
  
  
  useEffect(() => {
    async function initMySky() {
      try {
        const mySky = await client.loadMySky(dataDomain);
        
        const loggedIn = await mySky.checkLogin();
        setMySky(mySky);
        setLoggedIn(loggedIn);

        
        if (loggedIn) {
          setUserID(await mySky.userID());
          try {

            await mySky.loadDacs(contentRecord);
            const { data } = await mySky.getJSON('localhost');
            setData(data);
            console.log("loaded data init: ", data);

          } catch (e) {
            console.log('getJSON failed on initMySky(): ');
            console.error(e);
          }

        }

      } catch (e) {
        console.log("exception caught under initMySky(): ");
        console.error(e);
      }
  
    }
  
    initMySky();
  }, []);

  
  const handleMySkyLogin = async () => {
    try {

      const status = await mySky.requestLoginAccess();
      setLoggedIn(status);
      if (status) {
        setUserID(await mySky.userID());
      }
      console.log("MySky login success!");

      try {

        await mySky.loadDacs(contentRecord);
        const { data } = await mySky.getJSON('localhost');
        setData(data);
        console.log("loaded data login: ", data);

      } catch (e) {
        console.log('getJSON failed on handleMySkyLogin(): ');
        console.error(e);
      }
      

    } catch (e) {
      console.log("MySky login failure: ");
      console.error(e);
    }



    
  };

  const handleMySkyLogout = async () => {
    try {

      await mySky.logout();
      setLoggedIn(false);
      setUserID('');
      console.log("MySky logout success!");

    } catch (e) { 
      console.log("MySky logout failure: ");
      console.error(e);
    }
   
  };

  const LoginProps = {
    mySky,
    loggedIn,
    userID, 
    dataDomain,
    handleMySkyLogin,
    handleMySkyLogout, 
    data
    
  };


  return (
    <div className="todo-app">
      <Login {...LoginProps}/>
     <div> 
        {loggedIn === true && <TodoList {...LoginProps} /> }
        {loggedIn === false && <div id='log-in'>Please Login</div>}
     </div>
    </div>
  );
}

export default App;

