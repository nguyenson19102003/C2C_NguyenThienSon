import React, {useState, useEffect} from 'react';
import loginImg from "../image/register.jpg";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

export function Register(props){

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [useraddress,setUserAddress] = useState(props.account);

  const [formError, setFormError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleSubmit = async (e)=>{
    props.handleChangeLogin(true);
      try {
        e.preventDefault();
        setFormError(validate(useraddress, password, email))
        setIsSubmit(true);

      } catch (error) {
        console.log(error);
      }
    props.handleChangeLogin(false);
    
  }
  useEffect(() => {
    setIsSubmit(false);
  },[])
  
  useEffect(() => {
    console.log(formError)
    if(Object.keys(formError).length === 0 && isSubmit) {
      registerall();
    }
  },[formError])

  const validate = (useraddress, password,email)=>{
    const err = {};
    const regex =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!useraddress){
      err.useraddress = "User Address is required";
    }
    if(!password){
      err.password = "Password is required";
    }else if(password.length < 6){
      err.password = "Password must be more than 6 characters";
    }

    if(!email){
      err.email = "Password is required";
    }else if(!regex.test(email)){
      err.email = "This is not a valid email format";
    }
    return err;
  }

  const registerall = async () => {
    try {
        const res = await axios.post('http://localhost:5000/auth/register', {
          userAddress: useraddress,
          password: password,
          email: email
        }).then(res=>{

          const person = res.data;
          toast.success(person.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          });

        });
      } catch (err) {
        console.log("Đã xuất hiện lỗi vui lòng thực hiện lại 😓");
        if(err.response.data.address){
          setFormError({useraddress: err.response.data.message});
          //toast
          toast.error(err.response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          });
        }
        if(err.response.data.email){
          setFormError({email: err.response.data.message});
          //toast
          toast.error(err.response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          });
        }
      }
  };
  return (
    <div className="base-container" ref={props.containerRef}>
        <div className="header">WELCOME</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} />
          </div>

          <div className="form">
            <div className="form-group">
              <label htmlFor="useraddress">User Address</label>
              <input type="text" name="useraddress" placeholder="useraddress" value= {useraddress} disabled/>
              <p className="validate--error">{formError.useraddress }</p>

            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="text" 
                name="email" 
                placeholder="email" 
                onChange = {(e)=>{setEmail(e.target.value)}}
                required/>
              <p className="validate--error">{formError.email }</p>

            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="password" 
                onChange = {(e)=>{setPassword(e.target.value)}}
                required/>
              <p className="validate--error">{formError.password }</p>

            </div>
            
            <div className="form-group">
              <input type="submit" value = "Register" onClick={handleSubmit}/>
            </div>
          </div>
        </div>
      </div>
  )
} 
