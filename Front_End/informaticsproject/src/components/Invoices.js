import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // State for the selected filter
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const storedUserId = localStorage.getItem("UserId");

    if (storedUserId) {
      // Fetch all invoices
      const fetchInvoices = async () => {
        try {
          const response = await axios.get(`http://localhost:58398/Service1.svc/GetInvoices?customerId=${storedUserId}`);
          setInvoices(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching invoices:', error);
          setLoading(false);
        }
      };

      fetchInvoices();
    }
  }, []);

  const goToInvoice = (invoiceId) => {
    localStorage.setItem("invoiceId", invoiceId);
    navigate("/Invoice");
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filterInvoices = () => {
    const today = new Date();
    return invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.InvoiceDate);
      switch (filter) {
        case 'past-7-days':
          return (today - invoiceDate) / (1000 * 60 * 60 * 24) <= 7;
        case 'past-2-weeks':
          return (today - invoiceDate) / (1000 * 60 * 60 * 24) <= 14;
        case 'over-1-month':
          return (today - invoiceDate) / (1000 * 60 * 60 * 24) > 30;
        default:
          return true;
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredInvoices = filterInvoices();

  return (
    <Layout>
      <div className="invoice-list">
        <h1>My Invoices</h1>
        <label htmlFor="filter" className="filter-label">Filter Invoices by Date:</label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="">All Invoices</option>
          <option value="past-7-days">Past 7 Days</option>
          <option value="past-2-weeks">Past 2 Weeks</option>
          <option value="over-1-month">Over 1 Month</option>
        </select>
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Date</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.InvoiceId}>
                <td>{invoice.InvoiceId}</td>
                <td>{new Date(invoice.InvoiceDate).toLocaleDateString("en-GB")}</td>
                <td>R{(invoice.TotalAmount + (invoice.TotalAmount * 0.15)).toFixed(2)}</td>
                <td>
                  <a onClick={() => goToInvoice(invoice.InvoiceId)}>
                    View Invoice
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default InvoiceList;
