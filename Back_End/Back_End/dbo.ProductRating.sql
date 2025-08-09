CREATE TABLE [dbo].[ProductRating]
(
	[ProductId] INT NOT NULL,
	[CustomerId] INT NOT NULL,
	[Rating] INT NOT NULL,
	[Review] VARCHAR(MAX) NOT NULL,

	PRIMARY KEY(ProductId, CustomerId),
	FOREIGN KEY(ProductId) REFERENCES dbo.[Product](ProductId),
	FOREIGN KEY(CustomerId) REFERENCES dbo.[Customer](CustomerId)
)
