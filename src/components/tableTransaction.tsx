import { p } from 'framer-motion/client';
import React, { useEffect, useState } from 'react';

type Props = {
    URL: string;
};

type Transaction = {
    _id: string; // Assuming transactions have an _id
    type: string;
    name: string;
    amount: number;
    date: string;
};

const TableTransaction = ({ URL }: Props) => {
    const [data, setData] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 12; // Number of items per page

    // Calculate total pages based on fetched data length
    const totalPages = Math.ceil(data.length / itemsPerPage);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(URL, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'GET',
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }

                const result = await res.json();
                setData(result); // Assuming result is an array of transactions
            } catch (e) {
                setError('Failed to fetch data');
                console.error(e);
            }
        };

        fetchData();
    }, [URL]);

    // Calculate data for current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${URL}/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setData((prevData) => prevData.filter((transaction) => transaction._id !== id));
            } else {
                throw new Error('Failed to delete transaction');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to delete transaction');
        }
    };

    const handleEdit = (transaction: Transaction) => {
        setEditTransaction(transaction); // Open the modal for editing
        setIsModalOpen(true); // Set modal visibility to true
    };

    const handleUpdate = async (updatedTransaction: Transaction) => {
        try {
            const res = await fetch(`${URL}/${updatedTransaction._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTransaction),
            });

            if (res.ok) {
                setData((prevData) =>
                    prevData.map((transaction) =>
                        transaction._id === updatedTransaction._id ? updatedTransaction : transaction
                    )
                );
                setEditTransaction(null); // Close the modal
                setIsModalOpen(false);
            } else {
                throw new Error('Failed to update transaction');
            }
        } catch (e) {
            console.error(e);
            setError('Failed to update transaction');
        }
    };

    return (
        <div className="overflow-x-auto min-h-screen w-full">
            {error ? (
                <div className="flex justify-center align-middle h-screen">
                    <span className="loading loading-dots loading-lg items-center"></span>
                </div>
            ) : data.length === 0 ? (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-lg text-gray-500">No transactions available.</p>
                </div>
            ) : (
                <>
                    <table className="sm:table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{transaction.type}</td>
                                    <td>{transaction.name}</td>
                                    <td>{transaction.amount}</td>
                                    <td>{new Date(transaction.date).toLocaleString('th-TH')}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleEdit(transaction)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger ml-2"
                                            onClick={() => handleDelete(transaction._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="join flex justify-end p-5">
                        <button
                            className="join-item btn btn-sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                className={`join-item btn btn-sm ${currentPage === i + 1 ? 'btn-active' : ''}`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="join-item btn btn-sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )
            }


            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3>Edit Transaction</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (editTransaction) handleUpdate(editTransaction);
                            }}
                        >
                            <select
                                name="type"
                                id="type"
                                required
                                className="select select-bordered w-full mb-2"
                                value={editTransaction?.type || ''} // Set the value to the current type or an empty string if none is selected
                                onChange={(e) => setEditTransaction({ ...editTransaction!, type: e.target.value })} // Update the type on change
                            >
                                <option disabled value="">
                                    Choose Type
                                </option>
                                <option value="รายรับ">Income</option>
                                <option value="รายจ่าย">Expense</option>
                            </select>

                            <input
                                type="text"
                                value={editTransaction?.name || ''}
                                onChange={(e) =>
                                    setEditTransaction({ ...editTransaction!, name: e.target.value })
                                }
                                className="input input-bordered w-full mb-2"
                            />
                            <input
                                type="number"
                                value={editTransaction?.amount || ''}
                                onChange={(e) =>
                                    setEditTransaction({ ...editTransaction!, amount: Number(e.target.value) })
                                }
                                className="input input-bordered w-full mb-2"
                            />
                            <div className="modal-action">
                                <button type="submit" className="btn btn-primary">Save</button>
                                <button
                                    type="button"
                                    className="btn btn-secondary ml-2"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableTransaction;
