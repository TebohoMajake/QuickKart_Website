CREATE TABLE [dbo].[Customer]
(
	[CustomerId] INT NOT NULL IDENTITY(1,1),
	[FitnessGoal] INT,

	PRIMARY KEY(CustomerId),
	FOREIGN KEY(CustomerId) REFERENCES dbo.[User](Id),
	FOREIGN KEY(CustomerId) REFERENCES dbo.[Cart](CartId),
	FOREIGN KEY(FitnessGoal) REFERENCES dbo.[FitnessGoal](FitnessGoalId)
)
