import { useState } from 'react';
import Tabletransaction from './components/tableTransaction';

function App() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [month, setMonth] = useState(9); // Default month is set to February
  const URL = `https://api-backend-wdu7.onrender.com/transaction?month=${month}`;
  console.log(URL)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    try {
      const res = await fetch(`https://api-backend-wdu7.onrender.com/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (res.status === 201) {
        setSuccessMessage('บันทึกข้อมูลสำเร็จ');
        setErrorMessage('');
      } else {
        setErrorMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        setSuccessMessage('');
      }
    } catch (e) {
      setErrorMessage('Failed to submit the form. Please try again.');
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(Number(e.target.value));
  };

  return (
    <>
      <div className="bg-base-200 p-6">
        <form className="bg-white p-6 rounded-md shadow-md" onSubmit={handleSubmit}>
          <h2 className="font-bold text-xl mb-2">New Transaction</h2>

          <div className="mb-4">
            <select name="type" id="type" required className="select w-full ">
              <option disabled selected>
                Choose Type
              </option>
              <option value="รายรับ">Income</option>
              <option value="รายจ่าย">Expense</option>
            </select>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              name="name"
              className="input  w-full"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="number"
              id="amount"
              placeholder="Amount"
              name="amount"
              required
              className="input  w-full"
            />
          </div>

          <div className="mb-4">
            <input
              type="date"
              id="date"
              name="date"
              required
              className="input  w-full"
            />
          </div>

          <div className="mb-4 text-center">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
            {successMessage && (
              <div className="mt-4 text-green-500 text-xl">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="mt-4 text-red-500">{errorMessage}</div>
            )}
          </div>
        </form>

        <div className="bg-white rounded-md shadow-md mt-4 p-4">
          <h2 className="font-bold text-lg mb-2">Select Month</h2>
          <select
            className="select w-full"
            value={month}
            onChange={handleMonthChange}
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        <div className="bg-white rounded-md shadow-md mt-4 ">
          {/* Pass selected month to Tabletransaction */}
          <Tabletransaction URL={URL} />
        </div>
      </div>
    </>
  );
}

export default App;
