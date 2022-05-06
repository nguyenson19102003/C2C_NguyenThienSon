import Item from './Item';
import React, { Component, useState, useEffect } from "react";
import './itemStyle.css';
import { Link, useHistory } from "react-router-dom";

export default function ListItem(props){
    return (
      <>
      
        <Link to="/createProduct">
        <a href="#" class="btn6">
          + THÊM SẢN PHẨM
        </a>
        </Link>
           
          <div id="list" className="container">
            {props.listItems.map(item =>  (
              <Item 
                account = {props.account}
                handCLickPaid = {props.handCLickPaid} 
                item = {item} 
                key={item.index}
                handCLickDelivered = {props.handCLickDelivered}
              />
             ))}
          </div>
      </>
        
    )
}