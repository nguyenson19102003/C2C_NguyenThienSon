import React, { Component } from "react";
import ItemManagerContract from "../../contracts/ItemManager.json";
import ItemContract from "../../contracts/Item.json";
import getWeb3 from "../../getWeb3";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import './index.css';

class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cost: 0,
      itemName: "Name Item",
      url: "http://localhost:5000",
      imageSelect: "",
      srcImage: ""
    };
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.itemManager = new this.web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[this.networkId] && ItemManagerContract.networks[this.networkId].address,
      );

      this.item = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[this.networkId] && ItemContract.networks[this.networkId].address,
      );
      console.log(this.itemManager);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  postProductCall = async (
    nameProduct,
    price,
    addressCreator,
    addressItem,
    urlImage,
    indexProduct
  ) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/products/postProduct`, {
        nameProduct: nameProduct,
        price: price,
        addressCreator: addressCreator,
        addressItem: addressItem,
        urlImage: urlImage,
        indexProduct: indexProduct
      }).then((res) => {
        const person = res.data

        //toast
        toast.success("Thêm Sản Phẩm Thành Công", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });

      });
    } catch (err) {
      //toast
      toast.error("Thêm Sản Phẩm Thất Bại", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });

      console.log(err);
    }
    this.props.handleChangeLogin(false);
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

  }

  handleSubmit = async () => {
    this.props.handleChangeLogin(true);
    try {
      if (this.state.cost <= 0 || !this.state.itemName || !this.state.imageSelect) {
        this.setState({
          cost: 0,
          itemName: "",
          imageSelect: ""
        })
        this.props.handleChangeLogin(false);
        //toast
        toast.error("Thêm Sản Phẩm Thất Bại", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
        return;
      }

      const { cost, itemName, imageSelect } = this.state;
      console.log(imageSelect);
      let urlImage = "";
      const price = this.web3.utils.toWei(`${cost}`, 'ether');
      let result = await this.itemManager.methods.createItem(itemName, price, this.accounts[0])
        .send({ from: this.accounts[0] });

      const indexProduct = result.events.SupplyChainStep.returnValues._itemIndex;
      const step = result.events.SupplyChainStep.returnValues._step;
      const address = result.events.SupplyChainStep.returnValues._itemAddress;

      const formData = new FormData();
      formData.append("file", imageSelect);
      formData.append("upload_preset", "mdtcalcz");

      const uploadImage = await axios.post("https://api.cloudinary.com/v1_1/dk4dkhkyn/image/upload", formData)
        .then((res) => {
          console.log("urlImage", res.data.url)
          urlImage = res.data.url;
        }).catch((err) => {
          console.log("Co loi trong post img");
          console.log(err);

          //toast
          toast.error("Thêm Sản Phẩm Thất Bại", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          });
        })
        console.log(urlImage);

      if (result) {
        this.postProductCall(
          itemName,
          price,
          this.accounts[0],
          address,
          urlImage,
          indexProduct
        );
      }
      alert("Send " + cost + " Wei to " + result.events.SupplyChainStep.returnValues._itemAddress);
      this.props.handleChangeLogin(false);

    } catch (err) {
      alert(err.message);
      this.props.handleChangeLogin(false);
    }
  }


  handleInputFile(value) {
    if (value) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({srcImage: e.target.result});
      };
      reader.readAsDataURL(value);
    };

    this.setState({
      imageSelect: value
    })
  }


  render() {
    return (
      < >

        <div class="wrapper">
          <div class="title">
            Create New Product
          </div>
          <div class="form">
            <div class="inputfield">
                <label>Price: </label>
                <input type="number" className="input" name="cost" value={this.state.cost} onChange={this.handleInputChange} />
            </div>  
            <div class="inputfield">
                <label>Name: </label>
                <input type="text" className="input"  name="itemName" value={this.state.itemName} onChange={this.handleInputChange} />
            </div> 

            <div class="inputfield">
              <div>
                <input type="file" name="file" onChange={(e) => {
                  this.handleInputFile(e.target.files[0])
                }} />
              </div>
              {
                this.state.srcImage 
                && <div>
                  <img className="image-select" src={this.state.srcImage} alt="image"/>
                </div>
              }
            </div>

            <div class="inputfields">
              <input type="submit"  className="btn" onClick={this.handleSubmit} value = "Create"/>
            </div>
          </div>
      </div>
      </>
    );
  }
}


export default CreateProduct;
