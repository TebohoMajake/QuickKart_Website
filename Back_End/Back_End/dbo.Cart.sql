CREATE TABLE [dbo].[Cart]
(
	[CartId] INT NOT NULL IDENTITY(1,1),

	PRIMARY KEY(CartId),
	FOREIGN KEY(CartId) REFERENCES dbo.[Customer](CustomerId)
)
