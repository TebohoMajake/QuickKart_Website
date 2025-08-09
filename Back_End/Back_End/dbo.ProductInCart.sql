CREATE TABLE [dbo].[ProductInCart] (
    [CustomerId]    INT NOT NULL,
    [ProductId] INT NOT NULL,
    [Quantity]  INT NOT NULL,
    PRIMARY KEY CLUSTERED ([CustomerId] ASC, [ProductId] ASC),
    FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product] ([ProductId]),
    FOREIGN KEY ([CustomerId]) REFERENCES [dbo].[Customer] ([CustomerId])
);

