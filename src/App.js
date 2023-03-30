import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState({
    date: "",
    programming: "",
  });
  //const [amounts, setAmounts] = useState([]);
  const [inputs, setInputs] = useState({});
  const [positions, setPositions] = useState([{}]);

  const handleChange = (e, idx=1) => {
    const name = e.target.name;
    const value = e.target.value;
    let newArr = [...positions];
    newArr[idx]["pos"] = idx+1
    newArr[idx]["amount"] = "";
    newArr[idx][name] = value;
    setInputs(values => ({...values, [name]: value}))
    setPositions(newArr);
    console.log(positions);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);

    const settings = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(inputs)
    }
    const fetchResponse = await fetch("/api/data", settings);
    const data = await fetchResponse.json();
    console.log(data);
  }

  const handleAddPosition = () => {
    const row = {
      pos: "",
      qty: "",
      item: "",
      price: "",
      amount: ""
    };
    setPositions(rows => ([...rows, row]));
  }

  useEffect(() => {
    const fetchData = async () => {
      const fetchResponse = await fetch('/api/data');
      const data = await fetchResponse.json();
      setData({
        date: data.Date,
        programming: data.programming,
      });
    }
    fetchData()
      .catch((error) => {
        console.error('Error:', error);
      })
    }, []);

  return (
    <div className="App">
      <header className="App-header"></header>
        <form onSubmit={handleSubmit}>
        <div className="wrapper">
          <div className="page">
                <h1>{"Invoice".toUpperCase()}</h1>
            <div className="two-col">
              <div className="contact-info">
                <div className="sender">
                  <p className="underline">{inputs.biller_name || "Biller Name"}, {inputs.biller_street || "Street"}, {inputs.biller_location || "Postcode and Location"}</p>
                </div>
                <div className="receiver">
                  <input type="text" name="recipient_name" placeholder="Recipient Name" onChange={(e) => handleChange(e)}/><br />
                  <input type="text" name="recipient_street" placeholder="Street" onChange={(e) => handleChange(e)}/><br />
                  <input type="text" name="recipient_location" placeholder="Postcode and Location" onChange={(e) => handleChange(e)}/>
                </div>
              </div>
              <div className="invoice-info">
                <input type="text" name="biller_name" placeholder="Biller Name" onChange={(e) => handleChange(e)}/><br />
                <input type="text" name="biller_street" placeholder="Street" onChange={(e) => handleChange(e)}/><br />
                <input type="text" name="biller_location" placeholder="Postcode and Location" onChange={(e) => handleChange(e)}/><br /><br />
                <input type="text" name="inv_number" placeholder="Invoice Number" onChange={(e) => handleChange(e)}/><br />
                <input type="text" name="po_number" placeholder="PO Number" onChange={(e) => handleChange(e)}/>
              </div>
            </div>
            <div className="right">
              <label className="bold">Date: </label>
              <input type="date" name="date" onChange={(e) => handleChange(e)}/>
            </div>
            <br /><br /><br /><br /><br />
            <table>
              <tr className="grey">
                <th>Pos</th>
                <th>Qty</th>
                <th className="item">Item</th>
                <th>Unit price</th>
                <th>Amount</th>
              </tr>
              {positions.map((row, idx) => (
              <tr key={idx+1}>
                <td>{idx+1}</td>
                <td><input type="number" name="qty" placeholder="1" className="number" onChange={(e) => handleChange(e, idx)} /></td>
                <td><input type="textarea" name="item" className="use-up-space" placeholder="Description of service or product..." onChange={(e) => handleChange(e, idx)}/></td>
                <td>
                  <label>€ </label>
                  <input type="number" name="price" placeholder="1" className="number" onChange={(e) => handleChange(e, idx)} />
                </td>
                <td className="amount">
                  <label>€ </label>
                  {isNaN(parseInt(row.qty)) || isNaN(parseInt(row.price)) ? (0).toFixed(2) : (row.qty * row.price).toFixed(2)}
                </td>
              </tr>
              ))}
              <button id="add" onClick={handleAddPosition}>+</button>
              <br />
              <tr className="grey">
                <td>Subtotal</td>
                <td></td>
                <td></td>
                <td></td>
                <td id="subtotal">€ 100</td>
              </tr>
              <br />
              <tr>
                <td>19% Tax</td>
                <td></td>
                <td></td>
                <td></td>
                <td>€ 19</td>
              </tr>
              <br />
              <tr className="bold">
                <td>Total</td>
                <td></td>
                <td></td>
                <td></td>
                <td id="total">€ 119</td>
              </tr>
            </table>
            <br /><br /><br /><br /><br />
            <p>{data.date}</p>
            <p>{data.programming}</p>
          </div>
          <input type="submit" value="Create PDF" />
        </div>
      </form>
    </div>
  );
}

export default App;