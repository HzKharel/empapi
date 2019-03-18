CREATE TABLE User (
	UserID INTEGER  NOT NULL UNIQUE,
	User_Password varchar(255) NOT NULL,
	User_Name varchar(255) NOT NULL UNIQUE,
	First_Name varchar(255) NOT NULL,
	Last_Name varchar(255) NOT NULL,
	Email varchar(255) NOT NULL UNIQUE,
	Creation_Date varchar(500),
	PRIMARY KEY (UserID)
);

CREATE TABLE FriendList (
	User_one_ID INT NOT NULL UNIQUE,
	User_two_ID INT NOT NULL UNIQUE,
	Status TINYINT NOT NULL,
	Action_User_ID INT NOT NULL,
	FOREIGN KEY(User_one_ID) REFERENCES USER(UserID),
	FOREIGN KEY(User_two_ID) REFERENCES USER(UserID)
);

CREATE TABLE Message (
	Sent_Message varchar(1000) NOT NULL,
	From_User int NOT NULL,
	To_User int NOT NULL,
	Encryption varchar(100) NOT NULL,
	Sent_Date datetime NOT NULL,
	Encryption_Key varchar(100) NOT NULL,
	FOREIGN KEY(From_User) REFERENCES USER(UserID),
	FOREIGN KEY(To_User) REFERENCES USER(UserID)
);

CREATE TABLE AdminUsers (
	Admin_ID INTEGER NOT NULL UNIQUE,
	Admin_User_ID  varchar(255) NOT NULL UNIQUE,
	PRIMARY KEY (Admin_ID),
	FOREIGN KEY (Admin_User_ID) REFERENCES User(UserID)
	
);