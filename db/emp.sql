CREATE TABLE User (
	UserID INTEGER  NOT NULL UNIQUE,
	User_Password varchar(255) NOT NULL,
	User_Name varchar(255) NOT NULL UNIQUE,
	First_Name varchar(255) NOT NULL,
	Last_Name varchar(255) NOT NULL,
	Email varchar(255) NOT NULL UNIQUE,
	Creation_Date varchar(500),
	Admin INTEGER,
	PRIMARY KEY (UserID)
);

CREATE TABLE ContactList (
	ID VARCHAR(255) NOT NULL UNIQUE,
	User_Name varchar(255) NOT NULL,
	Contact_Name varchar(255) NOT NULL,
	FOREIGN KEY(User_Name) REFERENCES USER(User_Name),
	FOREIGN KEY(Contact_Name) REFERENCES USER(User_Name)
);

CREATE TABLE Message (
	Sent_Message varchar(100000) NOT NULL,
	From_User int NOT NULL,
	To_User int NOT NULL,
	Encryption varchar(100) NOT NULL,
	Sent_Date varchar(255) NOT NULL,
	Encryption_Key varchar(100) NOT NULL,
	FOREIGN KEY(From_User) REFERENCES USER(UserID),
	FOREIGN KEY(To_User) REFERENCES USER(UserID)
);