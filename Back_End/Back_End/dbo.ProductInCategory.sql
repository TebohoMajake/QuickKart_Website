CREATE TABLE [dbo].[ProductInCatergory]
(
	[CategoryId] INT NOT NULL, 
	[ProductId] INT NOT NULL,

	PRIMARY KEY(CategoryId),
	FOREIGN KEY(CategoryId) REFERENCES dbo.[Category](CategoryId),
	FOREIGN KEY(ProductId) REFERENCES dbo.[Product](ProductId)
)
