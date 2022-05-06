import React, { Component, useState, useEffect } from "react";
import ItemManagerContract from "../../contracts/ItemManager.json";
import ListItem from "../../components/item/ListItem"

import { ToastContainer, toast } from 'react-toastify';


import "./home.css";
import axios from "axios";

function HomePage(props) {
  const [listItems, setListItem] = useState([]);
  const [account, setAccount] = useState();
  const [web3, setWeb3] = useState();
  const [networkId, setNetworkId] = useState();
  const [itemManager, setItemManager] = useState();

  useEffect(() => {
    if (props.web3) {
      setWeb3(props.web3);
    }
  },[props.web3])

  useEffect(() => {
      if (props.addressUser) {
        setAccount(props.addressUser);
      }
  },[props.addressUser])
  
  const getList = async () => {
    let newlist = []
    console.log("check");
    try {

      await axios.get(`http://localhost:5000/api/products/getProducts`).then(res => {
          const persons = res.data;
          for(let i = 0; i < persons.length; i++){
            if(persons[i].step === 0){

              const price = web3.utils.fromWei(`${persons[i].price}`, 'ether');

              const newItem = new It(
                persons[i].indexProduct, 
                persons[i].nameProduct, 
                price, 
                persons[i].step, 
                persons[i].addressItem, 
                persons[i].addressCreator,
                persons[i].urlImage,
              );
              newlist.push(newItem);
            }
        
          }
          console.log(persons[0])
      })
    } catch (err) {
      console.log(err)
      console.log("Error loading")
  }
    setListItem(newlist)
  }

  const getNetworkId = async ()=>{
    const network = await web3.eth.net.getId();
    const _itemManager = new web3.eth.Contract(
      ItemManagerContract.abi,
      ItemManagerContract.networks[network] && ItemManagerContract.networks[network].address
    );
    console.log(_itemManager)
    setItemManager(_itemManager);
  }

  useEffect(() => {
    if(web3){
      console.log(itemManager)
      getList();
      getNetworkId();
    }
  },[web3]);

  const handCLickPaid = async (item) =>{
    console.log("itemManager",itemManager)
    console.log(item.price);
    console.log(web3.utils.toWei(`${item.price}`, 'ether'))
    console.log(item.addressItem)
    try{
      props.handleChangeLogin(true);
      const price = web3.utils.toWei(`${item.price}`, 'ether')
      let result =  await itemManager.methods.triggerPayment(item.index).send({from: account,to: item.addressItem, value: web3.utils.toWei(`${item.price}`, 'ether') });

      const res = await axios.patch(`http://localhost:5000/api/products/update/${item.addressItem}`, {
        step: 1
      }).then(res =>{ 
        const person = res.data;
        console.log(person)
      });

      const postBuyer = await axios.post(`http://localhost:5000/api/products/postBuyProduct/${item.ownerAddress}`, {
        nameProduct : item.identifier,
        price : price,
        addressCreator : item.ownerAddress,
        addressItem : item.addressItem,
        addressBuyer : account,
        urlImage: item.urlImage

      }).then(res =>{ 
        const person = res.data;
        console.log(person)
      });

      alert("Thanh toán sản phẩm: " + item.addressItem);
      props.handleChangeLogin(false);

      //toast
      toast.success("Mua Sản Phẩm Thành Công", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });

    } catch(e){
      console.log(e)
      props.handleChangeLogin(false);

      //toast
      toast.error("Mua Sản Phẩm Thất Bại", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    }
  }

  const handCLickDelivered = async (item) =>{
    try{
      const price = web3.utils.toWei(`${item.price}`, 'ether')
      let result =  await itemManager.methods.triggerDelivery(item.index , item.ownerAddress, price).send({from: account});
      alert("Mặt hàng đã giao: " + item.addressItem);
    } catch(e){
      alert("Không gửi được " + e);
    }
  } 

  return (
    <div>
      <ListItem 
        account = {account}
        listItems = {listItems} 
        itemManager = {itemManager} 
        handCLickPaid = {handCLickPaid}
        handCLickDelivered = {handCLickDelivered}
      ></ListItem>
    </div>
  );
}

function It(index, identifier, price, step, addressItem, ownerAddress, urlImage){
  this.index = index;
  this.identifier = identifier;
  this.price = price;
  this.step = step;
  this.addressItem = addressItem;
  this.ownerAddress = ownerAddress;
  this.urlImage = urlImage;
}

export default HomePage;
