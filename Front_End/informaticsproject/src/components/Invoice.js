import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const Invoice = ({ invoiceId }) => {
    const [invoiceInfo, setInvoiceInfo] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const invoiceRef = useRef();
    const navigate = useNavigate();  // Hook to navigate

    useEffect(() => {
        if (invoiceId > 0) {
            // Fetch invoice information and products
            const fetchInvoiceData = async () => {
                try {
                    console.log("InvoiceId: ", invoiceId);

                    const invoiceResponse = await axios.get(`http://localhost:58398/Service1.svc/GetInvoice?invoiceId=${invoiceId}`);
                    const productResponse = await axios.get(`http://localhost:58398/Service1.svc/GetProductsInInvoice?invoiceId=${invoiceId}`);

                    setInvoiceInfo(invoiceResponse.data); // Assuming invoiceResponse contains invoiceNumber, date, and total
                    console.log("InvoiceDate: ", invoiceInfo.InvoiceDate);
                    setProducts(productResponse.data);    // Assuming productResponse contains an array of product details
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching invoice data:', error);
                    setLoading(false);
                }
            };
            fetchInvoiceData();

            const element = document.getElementById('invoice-box');
            html2pdf().from(element).save('invoice.pdf');
        }
    }, [invoiceId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <button onClick={() => navigate(-1)} style={styles.goBackButton}>Go Back</button> {/* Go back button */}
            <div className="invoice-box" style={styles.invoiceBox} ref={invoiceRef}>
                <table cellPadding="0" cellSpacing="0" style={styles.table}>
                    <thead>
                        <tr className="top">
                            <td colSpan="4">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="title" style={styles.title}>
                                                {/* Company logo */}
                                                <Link to="/">
                                                    <a className="navbar-brand">
                                                        Boost<span>.</span>
                                                    </a>
                                                </Link>
                                            </td>
                                            <td>
                                                Invoice #: {invoiceInfo.InvoiceId}<br />
                                                Date: {invoiceInfo.InvoiceDate}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr className="heading" style={styles.headingRow}>
                            <td>Item</td>
                            <td>Price</td>
                            <td>Quantity</td>
                            <td>Total Price</td>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product, index) => (
                            <tr className="item" key={index} style={index === products.length - 1 ? styles.itemLast : styles.item}>
                                <td>{product.ProdName}</td>
                                <td>R{product.Price.toFixed(2)}</td>
                                <td>{product.QTY}</td>
                                <td>R{(product.Price * product.QTY).toFixed(2)}</td>
                            </tr>
                        ))}

                        <tr className="spacer">
                            <td colSpan="4"></td>
                        </tr>

                        <tr className="total" style={styles.total}>
                            <td colSpan="3"></td>
                            <td>Subtotal: R{invoiceInfo.TotalAmount.toFixed(2)}</td>
                        </tr>

                        <tr className="total" style={styles.total}>
                            <td colSpan="3"></td>
                            <td>VAT ({0.15 * 100}%): R{(invoiceInfo.TotalAmount * 0.15).toFixed(2)}</td>
                        </tr>

                        <tr className="total" style={styles.total}>
                            <td colSpan="3"></td>
                            <td>Total: R{(invoiceInfo.TotalAmount + (invoiceInfo.TotalAmount * 0.15)).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Inline styles for the component
const styles = {
    goBackButton: {
        marginBottom: '20px',
        padding: '10px 20px',
        color: '#333',
        border: 'none',
        cursor: 'pointer',
    },
    invoiceBox: {
        width: '100%',
        maxWidth: '800px',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #eee',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.15)',
    },
    table: {
        width: '100%',
        lineHeight: 'inherit',
        textAlign: 'left',
    },
    title: {
        fontSize: '45px',
        lineHeight: '45px',
        color: '#333',
    },
    logo: {
        width: '100%',
        maxWidth: '150px',
    },
    headingRow: {
        background: '#eee',
        borderBottom: '1px solid #ddd',
        fontWeight: 'bold',
    },
    item: {
        borderBottom: '1px solid #eee',
    },
    itemLast: {
        borderBottom: 'none',
    },
    total: {
        paddingTop: '20px',
        textAlign: 'right',
    },
};

export default Invoice;
