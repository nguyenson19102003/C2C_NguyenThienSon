import React from "react";
import "./form.css";
import getWeb3 from "../../getWeb3";

import {Login ,Register} from "../../components/form/index.js";

class FormLoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogginActive: true, 
      account : '', 
    };
  }

  componentDidMount = async() =>{
    this.rightSide.classList.add("right");

    try {
        // Get network provider and web3 instance.
        this.web3 = await getWeb3();
          // Use web3 to get the user's accounts.
        this.accounts = await this.web3.eth.getAccounts();
          // Get the contract instance.
        this.networkId = await this.web3.eth.net.getId();

        this.setState({account: this.accounts[0]})
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
  }

  changeState() {
    const { isLogginActive } = this.state;

    if (isLogginActive) {
      this.rightSide.classList.remove("right");
      this.rightSide.classList.add("left");
    } else {
      this.rightSide.classList.remove("left");
      this.rightSide.classList.add("right");
    }
    this.setState(prevState => ({ isLogginActive: !prevState.isLogginActive }));
  }

  render() {
    const { isLogginActive } = this.state;
    const current = isLogginActive ? "Register" : "Login";
    const currentActive = isLogginActive ? "login" : "register";

    return (
      <div className="App">
        <div className="login">
          <div className="container" ref={ref => (this.container = ref)}>
            {isLogginActive && (
              <Login 
                isLoading={this.props.isLoading}
                handleChangeLogin={this.props.handleChangeLogin}
                handleClickSuccess = {this.props.handleClickSuccess} 
                account={this.props.addressUser} 
                containerRef={ref => (this.current = ref)} />
            )}
            {!isLogginActive && (
              <Register 
                isLoading = {this.props.isLoading} 
                handleChangeLogin={this.props.handleChangeLogin}
                account={this.props.addressUser} 
                containerRef={ref => (this.current = ref)} 
                changeState = {this.changeState}
              />
            )}
          </div>
          <RightSide
            current={current}
            currentActive={currentActive}
            containerRef={ref => (this.rightSide = ref)}
            onClick={this.changeState.bind(this)}
          />
        </div>
      </div>
    );
  }
}

const RightSide = props => {
  return (
    <div
      className="right-side"
      ref={props.containerRef}
      onClick={props.onClick}
    >
      <div className="inner-container">
        <div className="text">{props.current}</div>
      </div>
    </div>
  );
};

export default FormLoginRegister;