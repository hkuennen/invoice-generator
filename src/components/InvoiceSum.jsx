const InvoiceSum = ({ subtotal, tax, handleTaxChange }) => {
  return (
    <>
      <table>
        <tr className="grey">
          <th className="th_pos w-5p"></th>
          <th className="th_qty w-13p"></th>
          <th className="th_item w-52p"></th>
          <th className="th_price w-17p"></th>
          <th className="th_amount w-17p"></th>
        </tr>
        <tr className="grey">
          <td>Subtotal</td>
          <td></td>
          <td></td>
          <td></td>
          <td id="subtotal">
            € {isNaN(subtotal) ? (0).toFixed(2) : parseFloat(subtotal).toFixed(2)}
          </td>
        </tr>
        <br />
        <tr>
          <td>Tax</td>
          <td>
            <select name="tax" onChange={(e) => handleTaxChange(e)}>
              <option value="0.19">19 %</option>
              <option value="0.07">7 %</option>
            </select>
          </td>
          <td></td>
          <td></td>
          <td>€ {isNaN(subtotal) ? (0).toFixed(2) : (subtotal * parseFloat(tax)).toFixed(2)}</td>
        </tr>
        <br />
        <tr className="bold">
          <td>Total</td>
          <td></td>
          <td></td>
          <td></td>
          <td id="total">
            € {isNaN(subtotal) ? (0).toFixed(2) : (subtotal * (1 + parseFloat(tax))).toFixed(2)}
          </td>
        </tr>
      </table>
    </>
  );
};

export default InvoiceSum;
