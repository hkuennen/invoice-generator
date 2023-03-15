import React, { useState, useEffect } from "react";
import moment from "moment";
import './App.css';
import Positions from './Positions.js';

const App = () => {
  const [data, setData] = useState({
    date: "",
    programming: "",
  });

useEffect(() => {
  fetch('/api/data')
    .then((res) => res.json())
    .then((data) => {
      setData({
        date: data.Date,
        programming: data.programming,
      });
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    })
  }, []);

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="wrapper">
        <div class="page">
              <h1>{"Invoice".toUpperCase()}</h1>
          <div className="two-col">
            <div className="contact-info">
              <div className="sender">
                <p className="underline">Biller name, Street, Postcode and Location</p>
              </div>
              <div className="receiver">
                <p>Recipient name</p>
                <p>Street</p>
                <p>Postcode and Location</p>
              </div>
            </div>
            <div className="invoice-info">
              <p>Biller name</p>
              <p>Street</p>
              <p>Postcode and Location</p>
              <p class="bold">Invoice number: #</p>
            </div>
          </div>
          <p class="right">Date: {moment().format('DD.MM.YYYY')}</p>
          <br /><br /><br /><br /><br />
          <Positions />
          <br /><br /><br /><br /><br />
          <p>{data.date}</p>
          <p>{data.programming}</p>
        </div>
      </div>
    </div>
  );
}

export default App;