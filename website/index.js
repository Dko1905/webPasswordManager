let currentlySelected;

function getIcon(url = ''){
	return `https://www.google.com/s2/favicons?domain=${url}`;
}

function addToList(website = '', username = '', last = false){
	//var tempalte = `<li> <table style="margin-left:2px; margin-top:auto;"> <tr> <td><img src=${imgUrl} style="width: 30px; heigh:30px;"></img></td> <td><h2 style="font-weight: bold;">Hello</h2></td> </tr> </table> </li>`;
	
	let listElementBody = document.createElement('li');
	listElementBody.id = 'listElement';

	let tableElement = document.createElement('table');
	
	tableElement.style = 'margin-left:2px; margin-top:auto;'; // remember to change selected section

	let tableRow = document.createElement('tr');
	let ImageTableElement = document.createElement('td');
	let TextTableElement = document.createElement('td');
	let brakeLine;

	{ // set image inside image table element
		let imgElement = document.createElement('img');
		imgElement.style = 'width: 30px; heigh:30px;';
		{
			let temp = getIcon(website);
			if(temp){
				imgElement.src = temp;
			}
			else{
				console.log('Error in getting web url');
			}
		}
		ImageTableElement.appendChild(imgElement);
	}

	{ // set text into the TextTableElement
		let websiteHeader = document.createElement('h3');
		websiteHeader.style = 'font-weight: bold; margin-left:10px; margin-top:0px; margin-bottom:0px;';
		websiteHeader.innerText = website;

		let websiteUsername = document.createElement('p');
		websiteUsername.style = 'color: gray; margin-left:10px; margin-top:0px; margin-bottom:0px;font-size: 12px;';
		websiteUsername.innerText = username;

		TextTableElement.appendChild(websiteHeader);
		TextTableElement.appendChild(websiteUsername);
	}

	{	// append it to the table row.
		tableRow.appendChild(ImageTableElement);
		tableRow.appendChild(TextTableElement);
	}

	{	// append tableRow to table
		tableElement.appendChild(tableRow);
	}

	{ // append it all to the listElementBody
		listElementBody.appendChild(tableElement);
	}

	{ // set brake line to the 'last' argument
		if(top){
			let list = document.getElementById('accountList');
			list.appendChild(document.createElement('br'));
		}
		if(!last){
			brakeLine = document.createElement('hr')
			brakeLine.style = 'height: 4px;color: #333;background-color: #333;';
		}
		else{
			brakeLine = document.createElement('br')
		}
	}

	{ // Add onclick event to them.
		listElementBody.onclick = ()=>{
			
			listElementBody.style = 'background-color:deepskyblue;';
			if(currentlySelected) currentlySelected.style = ''
			currentlySelected = listElementBody;
		}
	}

	{ // append the listElementBody to the list
		let list = document.getElementById('accountList');
		list.appendChild(listElementBody);
		list.appendChild(brakeLine);
	}
}

function post(url = '', input = ''){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'text/plain');
	xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhr.send(input);
	xhr.onreadystatechange = () => {
		if(xhr.readyState != 4)
			return;
		if(xhr.status == 200){
			console.log(xhr.responseText)
		}
	};

}

function getToken(){
	let param = `{"account":{"username":"daniel","password":"password","attachedTokens":[]}}`
	post("http://127.0.0.1:8080/gettoken", param);
}

function loadPasswords(){
	$("#loginDiv").hide(1000);
	$("#mainContent").show(1000);

	addToList('www.google.com', 'Daniel.florescu1905@yahoo.com', false);
	addToList('www.skype.com', 'Daniel.florescu1905@yahoo.com', false);
	addToList('skole.com', 'Daniel.florescu1905@yahoo.com', false);
	addToList('skole.com', 'Daniel.florescu1905@yahoo.com', false);
	addToList('skole.com', 'Daniel.florescu1905@yahoo.com', false);
	addToList('skole.com', 'Daniel.florescu1905@yahoo.com', false);
	addToList('skole.com', 'Daniel.florescu1905@yahoo.com', false);
	addToList('skole.com', 'Daniel.florescu1905@yahoo.com', false);
	addToList('work.com', 'dako1905', true);
}

$("#mainContent").hide();