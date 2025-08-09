import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Invoice from './Invoice.js';

const InvoiceDisplay = () => {
    const navigate = useNavigate();
    const [invoiceId, setInvoiceId] = useState(0);
    


    useEffect(() => {

        const invId = localStorage.getItem("invoiceId");

        if(invId)
        {
            setInvoiceId(invId);
            console.log("InvID: ", invId);
        }
        else
        {
            navigate("/");
        }
        
    }, [navigate]);

    return (
        <div>
            <Invoice
                invoiceId = {invoiceId}
            />
        </div>
    );
};

export default InvoiceDisplay;
