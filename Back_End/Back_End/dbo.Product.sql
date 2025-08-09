CREATE TABLE [dbo].[Product] (
    [ProductId]       INT           IDENTITY (1, 1) NOT NULL,
    [ProdName]        VARCHAR (MAX) NOT NULL,
    [Price]           MONEY         NOT NULL,
    [ProdDescription] VARCHAR (MAX) NOT NULL,
    [ProdIngredients] VARCHAR (MAX) NOT NULL,
	[ProductDirections] VARCHAR(MAX) NOT NULL,
    [NumInStock]      INT           NOT NULL,
	[Storage] VARCHAR(MAX) NOT NULL,
	[ImageURL] VARCHAR(MAX) NOT NULL,

    PRIMARY KEY CLUSTERED ([ProductId] ASC)
);

