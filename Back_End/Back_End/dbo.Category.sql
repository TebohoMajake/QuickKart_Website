CREATE TABLE [dbo].[Category]
(
	[CategoryId] INT NOT NULL IDENTITY(1,1) UNIQUE,
	[CategoryName] VARCHAR(MAX) NOT NULL,

	PRIMARY KEY(CategoryId)
)
