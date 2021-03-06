var urlBase = 'http://www.contastic.rocks/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );

	if ((login == "") || (password == ""))
	{
		document.getElementById("loginResult").innerHTML = "Not a valid username/password";
		return;
	}

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true); // Changed to true
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.send(jsonPayload);
		// Updated try block from friday free for all code session
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1)
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				// Changed html file to home.html as group discussed
				window.location.href = "home.html";
			}
		};
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}



// Create new login for user
function registerUser() {

	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );

	if ((login == "") || (password == ""))
	{
		document.getElementById("loginResult").innerHTML = "Not a valid username/password";
		return;
	}

	document.getElementById("registerResult").innerHTML = "";

	// Must match API naming scheme
	var jsonPayload =  `{"firstName" : "${firstName}",
						"lastName" : "${lastName}",
						"login" : "${login}",
						"password" : "${hash}"}`; // Changed to hash

	var url = urlBase + '/SignUp.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
				// Ensures user does not get auto logged in if they create existing username
				if (userId < 1)
				{
					document.getElementById("loginResult").innerHTML = jsonObject.error;
					return;
				}
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				// Changed html file to home.html as group discussed
				window.location.href = "home.html";
			}
		};
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Welcome " + firstName + " " + lastName + "!";
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// Once logged in, user can add contact
function addContact()
{
	var newFirstName = document.getElementById("firstName").value;
	var newLastName = document.getElementById("lastName").value;
	var newPhone = document.getElementById("phone").value;
	var newEmail = document.getElementById("email").value;

	document.getElementById("contactAddResult").innerHTML = "";

	// Must match API
	var jsonPayload =  `{"firstName" : "${newFirstName}",
						"lastName" : "${newLastName}",
						"phone" : "${newPhone}",
						"email" : "${newEmail}",
						"id" : "${userId}"}`; // Changed from userId to id
		

	var url = urlBase + '/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";

				//  Alert when the contact does not have a name. 
				if (newFirstName == "")
				{	
					alert("You need to add a name");
					return;
				}
				addContactToTable(newFirstName, newLastName, newPhone, newEmail);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function addContactToTable(newFirstName, newLastName, newPhone, newEmail)
{
	// Find a <table> element with id="fillContacts":
	var table = document.getElementById("fillContacts");

	// Create edit button
	var editButton = document.createElement("BUTTON");
	editButton.innerHTML = "Edit";

	editButton.onclick = function() { alert("This button should call the updateContact() funtion"); }
	
	//Create delete button
	var deleteButton = document.createElement("BUTTON");
	deleteButton.innerHTML = "Delete";
	deleteButton.onclick = function()
	{ 
		// This function is a test. The working version should call deleteContact()
		deleteTest(newFirstName, newLastName, newPhone, newEmail);
	}
	
	// Create an empty <tr> element and add it to the 1st position of the table:
	var row = table.insertRow(0);

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var cell6 = row.insertCell(5);

	// Add some text to the new cells:
	cell1.innerHTML = newFirstName;
	cell2.innerHTML = newLastName;
	cell3.innerHTML = newPhone;
	cell4.innerHTML = newEmail;
	cell5.appendChild(editButton);
	cell6.appendChild(deleteButton);
}

// This function is a test. I am testing if the parameters can be pass to this function.
function deleteTest(newFirstName, newLastName, newPhone, newEmail) 
{
	window.alert("This button should call the delete() funtion and deletes this contact : " +  newFirstName + " " + newLastName + " "  + newPhone + " " + newEmail );
}



// Updated Search
function searchContact()
{
	// Updated to search every field
	var first = document.getElementById("firstSearch").value;
	var last = document.getElementById("lastSearch").value;
	var phone = document.getElementById("phoneSearch").value;
	var email = document.getElementById("emailSearch").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	var contactList = "";

	var jsonPayload = `{"firstName" : "${first}",
						"lastName" : "${last}",
						"phone" : "${phone}",
						"email" : "${email}",
						"id" : "${userId}"}`; // Changed from userId to id
	var url = urlBase + '/SearchContact.' + extension; // Changed to match php

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );

				for( var i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

// Updates every field whether editted or not
function updateContact() {

	var updateFirstName = document.getElementById("firstName").value;
	var updateLastName = document.getElementById("lastName").value;
	var updateEmail = document.getElementById("email").value;
	var updatePhone = document.getElementById("phone").value;
	document.getElementById("updateResult").innerHTML = "";

	var jsonPayload = '{"firstName" : "' + updateFirstName + '", "lastName" : "' + updateLastName +'", "email" : "' + updateEmail + '", "phone" : "' + updatePhone + '"}';

	// MUST match API
	var url = urlBase + '/UpdateContact.' + extension; // Changed to match php

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("updateResult").innerHTML = "Contact has been updated";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("updateResult").innerHTML = err.message;
	}
}



// Removes contact
function deleteContact() {

	// Grab specific contact id (MUST MATCH HTML)
	var contactID = document.getElementById("contactID").value;
	document.getElementById("deleteResult").innerHTML = "";

	// "id" must match API
	var jsonPayload = '{"id" : "' + contactID + '"}';
	var url = urlBase + '/DeleteContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("updateResult").innerHTML = "Contact has been deleted";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("deleteResult").innerHTML = err.message;
	}
}
