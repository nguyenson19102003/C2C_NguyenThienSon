import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Navbar.css";
import getWeb3 from "../../getWeb3";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';


const Navbar = (props) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [addressUser, setAddressUser] = useState();
  const [isMobile, setIsMobile] = useState(false);

  const [isShowUserLogin, setIsShowUserLogin] = useState(false);
  const [web3, setWeb3] = useState();
  let history = useHistory();

  const handleShowUserLogin = () => {
    setIsShowUserLogin(!isShowUserLogin);
  };

  useEffect(() => {
    if(props.addressUser){
      console.log("addressUser",addressUser)
      setAddressUser(props.addressUser);
    }
  }, [props.addressUser]);

  useEffect(() => {
    if (props.web3) {
      setWeb3(props.web3);
    }
  }, [props.web3]);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      const addrr = JSON.parse(localStorage.getItem("accessToken"));
      if (addressUser != addrr.userAddress && addressUser) {
        localStorage.removeItem("accessToken");
        history.replace("/login")
      }
      setIsAdmin(addrr.admin);
    }
  },[])

  const address = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    setAddressUser(accounts[0]);
  }

  const changeStateUser = async () => {
    const user = await axios.patch(`http://localhost:5000/auth/updateStateUser/${addressUser}`, {
      state: false
    }).then(res =>{ 
      const person = res.data;
      console.log(person);

    });
  }

  const getLogOut = async () => {
    const user = await axios.get(`http://localhost:5000/auth/logout`, {
      state: false
    }).then(res =>{ 
      const person = res.data;
      console.log(person);
      //toast
      toast.success(person.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    });
  }

  const logout = () => {

    try{
      localStorage.removeItem("accessToken");
      history.replace("/login");
      getLogOut();
      changeStateUser();
      setIsShowUserLogin(!isShowUserLogin);
      props.handleClickSuccess();
    }
    catch(e){

    }
  }

  return (
    <nav className="navbar">
      <h3 className="logo">
        <Link to="/" className="logo">DRAGON MARKET</Link>
      </h3>
      {/* nav-links-mobile */}
      <ul className={isMobile ? "" : "nav-links"} >
        
        {
          localStorage.getItem("accessToken")
            ? <>
            <Link to="/" className="create">
              <li>Sản Phẩm</li>
            </Link>
            <Link to="/" className="create">
              <li>Xu Hướng</li>
            </Link>
            <Link to="/" className="create">
              <li>Blog</li>
            </Link>
            <Link to="/" className="create">
              <li>Liên Hệ</li>
            </Link>
              <div className="header__log" onClick={handleShowUserLogin}>
                <svg
                  className="header__log--icon"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                >
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                </svg>
                <p className="header__log--text">{addressUser}</p>
              </div>
              <div
                className={
                  !isShowUserLogin ? `dropdown-menu` : `dropdown-menu active`
                }
              >

                {isAdmin &&
                  <>
                    <Link
                      to="/dashboard"
                      className="menu-content"
                      onClick={handleShowUserLogin}
                    >
                      <i className="fad fa-tachometer-slow"></i>
                      <p className="menu-title">Dashboard</p>
                    </Link>
                  </>
                }

                <Link
                  to={"/user/" + addressUser}
                  className="menu-content"
                >
                  <i className="fad fa-user-circle"></i>
                  <p className="menu-title">Account</p>
                </Link>

                <Link
                  className="menu-content"
                  to="/login"
                  onClick={() => { logout() }}
                >
                  <i className="fad fa-sign-out"></i>
                  <p className="menu-title">LogOut</p>
                </Link>
              </div>
            </>
            : <Link to="login" className="">
              <li></li>
            </Link>
        }
      </ul>
      <button className="mobile-menu-icon"
        onClick={() => setIsMobile(!isMobile)}
      >
        {isMobile ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
      </button>
    </nav>
  )
}

export default Navbar;