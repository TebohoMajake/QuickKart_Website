using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Back_End
{
    public class cInvoice
    {

        public int InvoiceId { get; set; }
        public int CustomerId { get; set; }
        public string InvoiceDate { get; set; }
        public decimal TotalAmount { get; set; }

    }
}