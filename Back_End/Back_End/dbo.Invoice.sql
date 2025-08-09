CREATE TABLE [dbo].[Invoice] (
    [InvoiceId]   INT      IDENTITY (1, 1) NOT NULL,
    [CustomerId]  INT      NULL,
    [OrderDate]   DATETIME DEFAULT (getdate()) NOT NULL,
    [TotalAmount] MONEY    NOT NULL,
    [CreatedAT]   DATETIME DEFAULT (getdate()) NOT NULL,
    PRIMARY KEY CLUSTERED ([InvoiceId] ASC),
    FOREIGN KEY ([CustomerId]) REFERENCES [dbo].[Customer] ([CustomerId])
);

