import React, {useState, useEffect}from "react";

import HomePage from "./page/home/Home";
import CreateProduct from "./page/create_product/CreateProduct";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FormLoginRegister from "./page/form/FormLoginRegister";
import NotFound from "./components/NotFound";
import Header from "./components/header/index";

import Navbar from "./components/Navbar/Navbar";
import UserPage from "./page/user/UserPage";
import DashboardPage from "./page/dashboard/Dashboard";

import getWeb3 from "./getWeb3";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
  useHistory 
} from "react-router-dom";

import "./App.css";

function App() {
  const [addressUser, setAddressUser]= useState();
  const [isLoading, setIsLoading]= useState(false);

  const [success, setIsSuccess] = useState(false);
  const [web3, setWeb3] = useState();

  const getAddress = async ()=>{
    const _web3 = await getWeb3();
    const accounts = await _web3.eth.getAccounts();
    setAddressUser(accounts[0]);
    setWeb3(_web3);
  }

  const handleChangeLogin = (value)=>{
    setIsLoading(value);
  }
  
  let history = useHistory();

  useEffect(() => {
    getAddress();
    setIsLoading(!isLoading);
  },[web3])

  const handleClickSuccess = () => {
    console.log("Click success")
    setIsSuccess(!success);
  }

  return (
    <> 
      {isLoading ? 
        <div className ="loading">
          <div className="ring"></div>
        </div> 
        :<></>
      }
      <ToastContainer />
      <Router>
        <Navbar web3={web3 && web3} addressUser={addressUser} success = {success} handleClickSuccess = {handleClickSuccess}></Navbar>

        <Switch>
          <Route exact path="/" render = {()=>{
            return localStorage.getItem("accessToken") 
            ? <HomePage 
              web3={web3 && web3} 
              addressUser={addressUser} 
              success={success} 
              handleClickSuccess={handleClickSuccess}
              handleChangeLogin = {handleChangeLogin} 
              isLoading = {isLoading}
            /> : <Redirect to="/login"/>
          }} >
          </Route>

          <Route exact path="/login" 
            render = {()=>{
              return localStorage.getItem("accessToken") ? <Redirect to="/"/> : <FormLoginRegister handleChangeLogin = {handleChangeLogin} addressUser={addressUser} isLoading = {isLoading} handleClickSuccess={handleClickSuccess}/>
            }}
          >
          </Route>

          <Route exact path="/createProduct">
            <CreateProduct handleChangeLogin = {handleChangeLogin} addressUser={addressUser} isLoading = {isLoading}/>
          </Route>

          <Route exact path='/dashboard' render = {()=>{
              return <DashboardPage web3={web3 && web3} addressUser={addressUser}/>
            }}></Route>
          
          <Route exact path='/user/:userId' render={()=>{
            return <UserPage _web3={web3 && web3} handleChangeLogin = {handleChangeLogin} addressUser={addressUser} isLoading = {isLoading}></UserPage>
          }} />

          <Route path="/404">
            <NotFound />
          </Route>

          <Route exact path="*">
            <Redirect from="/" to="/404" />
          </Route>
        </Switch>
      </Router>
    </>
  );
}


export default App;
