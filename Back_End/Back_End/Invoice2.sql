CREATE TABLE [dbo].[Invoice2] (
    [InvoiceId]   INT           IDENTITY (1, 1) NOT NULL,
    [CustomerId]  INT           NOT NULL,
    [InvoiceDate] DATETIME      NOT NULL,
    [TotalAmount] MONEY         NOT NULL,
    PRIMARY KEY CLUSTERED ([InvoiceId] ASC),
    FOREIGN KEY ([CustomerId]) REFERENCES [dbo].[Customer] ([CustomerId])
);