CREATE TABLE [dbo].[InvoiceLineItem] (
    [InvoiceId]  INT   NOT NULL,
    [ProductId]  INT   NOT NULL,
    [Quantity]   INT   NOT NULL,
    [UnitPrice]  MONEY NOT NULL,
    [TotalPrice] MONEY NOT NULL,
    PRIMARY KEY CLUSTERED ([InvoiceId] ASC, [ProductId] ASC),
    FOREIGN KEY ([InvoiceId]) REFERENCES [dbo].[Invoice] ([InvoiceId]),
    FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product] ([ProductId])
);

