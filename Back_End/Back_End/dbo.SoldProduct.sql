CREATE TABLE [dbo].[SoldProduct]
(
	[ProductId] INT NOT NULL,
	[Sales] INT NOT NULL,
	
	PRIMARY KEY(ProductId),
	FOREIGN KEY(ProductId) REFERENCES [dbo].[Product](ProductId)
)
