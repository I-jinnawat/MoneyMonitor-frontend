import React, { useState, useEffect } from 'react';
import Table from './components/tableTransaction';

type Props = {
    URL: string;
};

const Report = (props: Props) => {
    const [data, setData] = useState<any[]>([]);
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalOutcome: 0,
        balance: 0,
    });
    const [selectedMonth, setSelectedMonth] = useState('9');

    useEffect(() => {
        if (selectedMonth) {
            fetchData(selectedMonth);
        }
    }, [selectedMonth]);
    const URL = `https://api-backend-wdu7.onrender.com/transaction?month=${selectedMonth}`
    const fetchData = async (month: string) => {
        try {
            const response = await fetch(`https://api-backend-wdu7.onrender.com/report/${month}`);
            const result = await response.json();
            setData(result.transactions);
            setSummary(result.summary);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <>
            <div className="container-fluid p-5 bg-white mx-5 shadow-md rounded-md">
                <h2 className='font-bold text-2xl'>Select Month </h2>
                <select
                    className='select select-bordered mt-2 w-full'
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    <option value="">Select Month</option>
                    <option value="1">Jan</option>
                    <option value="2">Feb</option>
                    <option value="3">Mar</option>
                    <option value="4">Apr</option>
                    <option value="5">May</option>
                    <option value="6">Jun</option>
                    <option value="7">Jul</option>
                    <option value="8">Aug</option>
                    <option value="9">Sep</option>
                    <option value="10">Oct</option>
                    <option value="11">Nov</option>
                    <option value="12">Dec</option>
                </select>
            </div>

            {/* Display summary */}
            <div className="container-fluid p-5 bg-white mx-5 mt-5 shadow-md rounded-md">
                <h2 className='font-bold text-xl'>Summary</h2>
                <div className="flex flex-col">
                    <span>Total Income: {summary.totalIncome}</span>
                    <span>Total Expense: {summary.totalOutcome}</span>
                    <span>Balance: {summary.balance}</span>
                </div>
            </div>

            {/* Display transactions */}
            <div className="mt-5 container-fluid mx-5 bg-white rounded-md shadow-md h-full">
                <Table URL={URL} />
            </div>
        </>
    );
};

export default Report;
