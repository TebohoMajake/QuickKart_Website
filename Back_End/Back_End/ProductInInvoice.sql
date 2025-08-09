CREATE TABLE [dbo].[ProductInInvoice] (
    [InvoiceId] INT NOT NULL,
    [ProductId] INT IDENTITY(1, 1) NOT NULL,
    [ProdName] VARCHAR(MAX) NOT NULL,
    [Price] MONEY NOT NULL,
    [QTY] INT NOT NULL,
    [Total] MONEY NOT NULL,
    PRIMARY KEY([ProductId]),
    FOREIGN KEY([InvoiceId]) REFERENCES [dbo].[Invoice2] ([InvoiceId])

);