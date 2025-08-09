CREATE TABLE [dbo].[Invoice1] (
    [InvoiceId] INT IDEnTITY(1, 1) NOT NULL,
    [CustomerId] INT NOT NULL,
    [InvoiceHTML] VARCHAR(MAX) NOT NULL,
    [InvoiceDate] DAtETIME NOT NULL,
    [TotalAmount] MONEY NOT NULL,
    
    PRIMARY KEY(InvoiceId),
    FOREIGN KEY(CustomerId) REFERENCES [dbo].[Customer](CustomerId)
);