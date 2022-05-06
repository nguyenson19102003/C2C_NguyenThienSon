import React, { useContext, useState, useEffect } from 'react'
import MTable from "../../components/table/MTable"
import UsersTable from "../../components/table/UsersTable"
import './style.css'
import axios from "axios";


const DashboardPage = (props) => {
  const [web3, setWeb3] = useState();
  const [listItems, setListItem] = useState([]);
  const [listUsers, setListUsers] = useState([]);

  useEffect(() => {
    if (props.web3) {
      setWeb3(props.web3);
    }
  
  },[props.web3])

  useEffect(() => {
    console.log(listItems);
    if(web3){
      getListItems();
    }
    getListUsers();
  },[web3]);

  const getListItems = async () => {
    let newlist = []
    console.log("check");
    try {
      await axios.get(`http://localhost:5000/api/products/getProducts`).then(res => {
        const persons = res.data;
        for(let i = 0; i < persons.length; i++){
          if(persons[i].actice){
            const price = web3.utils.fromWei(`${persons[i].price}`, 'ether');
            const newItem = {
              id: persons[i]._id,
              name: persons[i].nameProduct,
              addressItem: persons[i].addressItem,
              price: price,
              addressCreator: persons[i].addressCreator,
              status: persons[i].step,
              urlImage: persons[i].urlImage
            }
            newlist.push(newItem);
          }
        }
      })
    } catch (err) {
      console.log(err)
      console.log("Error loading")
    }
    setListItem(newlist)

  }

  const getListUsers = async () => {
    let newlist = []
    try {
      await axios.get(`http://localhost:5000/auth/getUsers`).then(res => {
        const persons = res.data;
        console.log(persons)
        for(let i = 0; i < persons.length; i++){
          const newItem = {
            id: persons[i]._id,
            userAddress: persons[i].userAddress,
            email: persons[i].email,
            status: persons[i].state,
            isAdmin: persons[i].role
          }

          newlist.push(newItem);
        }
      })
    } catch (err) {
      console.log(err)
      console.log("Error loading")
    }
    setListUsers(newlist)

  }

  return (
    <div className="tables_dashboard">
      <div className="table_products">
        <MTable listItems={listItems}></MTable>
      </div>
      <div className="table_users">
        <UsersTable listUsers={listUsers}></UsersTable>
      </div>
      
    </div>
  )
}

export default DashboardPage
