import {useState, useEffect} from 'react';
import React from "react";
import axios from "axios";
import './index.css';
import { Link, useParams } from 'react-router-dom';
import ItemManagerContract from "../../contracts/ItemManager.json";

import ListProducts from "../../components/accounts/ListProducts";
import ListProductsBuy from "../../components/accounts/ListProductsBuy";

import { ToastContainer, toast } from 'react-toastify';


export default function UserPage(props){
    const { userId } = useParams();
    const [listItems, setListItem] = useState([]);
    const [listItemsBought, setListItemsBought] = useState([]);

    const [web3, setWeb3] = useState();
    const [itemManager, setItemManager] = useState();

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
        if (props._web3) {
          setWeb3(props._web3);
        }
      },[props._web3])
    
      useEffect(() => {
        if(web3){
            console.log(listItems);
            getListItems();
            getListItemsBought();
            getNetworkId();
        }
      },[web3]);

      const getListItems = async () => {
        let newlist = []
        console.log("check");
        try {
          await axios.get(`http://localhost:5000/api/products/getProducts/${userId}`).then(res => {
            const persons = res.data;
            for(let i = 0; i < persons.length; i++){
                const price = web3.utils.fromWei(`${persons[i].price}`, 'ether');

                const newItem = {
                  id: persons[i]._id,
                  name: persons[i].nameProduct,
                  addressItem: persons[i].addressItem,
                  price: price,
                  addressCreator: persons[i].addressCreator,
                  urlImage: persons[i].urlImage,
                  status: persons[i].step,
                  index: persons[i].indexProduct, 

                }
                newlist.push(newItem);
            }
          })
        } catch (err) {
          console.log(err)
          console.log("Error loading")
        }
        console.log(newlist)
        setListItem(newlist)
      }

      const getListItemsBought = async () => {
        let newlist = []
        console.log("check");
        try {
          await axios.get(`http://localhost:5000/api/products/getBuyProduct/${userId}`).then(res => {
            const persons = res.data;
            for(let i = 0; i < persons.length; i++){
                const price = web3.utils.fromWei(`${persons[i].price}`, 'ether');

                const newItem = {
                  id: persons[i]._id,
                  name: persons[i].nameProduct,
                  addressItem: persons[i].addressItem,
                  price: price,
                  addressCreator: persons[i].addressCreator,
                  urlImage: persons[i].urlImage,
                  status: persons[i].step,
                  index: persons[i].indexProduct, 

                }
                newlist.push(newItem);
            }
          })
        } catch (err) {
          console.log(err)
          console.log("Error loading")
        }
        console.log(newlist)
        setListItemsBought(newlist)
      }


      const handCLickDelivered = async (item) =>{
        try{

          console.log(item);

          props.handleChangeLogin(true);
          const price = web3.utils.toWei(`${item.price}`, 'ether')
          let result =  await itemManager.methods.triggerDelivery(item.index).send({from: userId});

          const res = await axios.patch(`http://localhost:5000/api/products/update/${item.addressItem}`, {
            step: 2
          }).then(res =>{ 
            const person = res.data;
            console.log(person)
          });

          const res1 = await axios.patch(`http://localhost:5000/api/products/buyer/update/${item.addressItem}`).then(res =>{ 
            console.log("Cập Nhật Người Mua Thành Công")
          });

          props.handleChangeLogin(false);
    
          //toast
          toast.success("Vận Chuyển Thành Công", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          });
    
        } catch(e){
          console.log(e)
          props.handleChangeLogin(false);
          //toast
          toast.error("Vận Chuyển Thất Bại", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          });
        }
      }

    
    return (
    <div className="tables_dashboard">
      <div className="table_products">
        <ListProducts listItems={listItems} handCLickDelivered = {handCLickDelivered}></ListProducts>
      </div>
      <div className="table_products">
        <ListProductsBuy listItems={listItemsBought}></ListProductsBuy>
      </div>
    </div>
    )
}
