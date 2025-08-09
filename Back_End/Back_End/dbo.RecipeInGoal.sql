CREATE TABLE [dbo].[RecipeInGoal]
(
	[RecipeId] INT NOT NULL,
	[FitnessGoalId] INT NOT NULL,

	PRIMARY KEY(RecipeId, FitnessGoalId),
	FOREIGN KEY(RecipeId) REFERENCES dbo.[Recipe](RecipeId),
	FOREIGN KEY(FitnessGoalId) REFERENCES dbo.[FitnessGoal](FitnessGoalId)
)
