function show(elm,show = true){
	if(!show){
		elm.style.display = "none";
	}
	else{
		elm.style.display = "";
	}
	
}

function post(url = '', input = '', callback = (result = '')=>{}){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'text/plain');
	xhr.send(input);
	xhr.onreadystatechange = () => {
		if(xhr.readyState != 4)
			return;
		if(xhr.status == 200){
			callback(xhr.responseText)
		}
	};

}

let code = (function () {
	return {
		encryptMessage: function (messageToencrypt = '', secretkey = '') {
			var encryptedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretkey);
			return encryptedMessage.toString();
		},
		decryptMessage: function (encryptedMessage = '', secretkey = '') {
			var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretkey);
			var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

			return decryptedMessage;
		}
	}
})();


let url = 'https://password-server.adamstenbaek.dk:7687';

let token = {tokenString: '', experationDate: 0};
let encryptionKey = '';
let list = []; // data is a array of {website: "Website", username: "Username", password: "Password", extra: "Extra"}
let onceLogedin = false;

function getToken(username, password){
	let param = JSON.stringify({username:username, password:password});
	post(url+"/gettoken", param, (result)=>{
		let res = JSON.parse(result);
		if(res.error){
			alert('Error in getting token, username or password possibly wrong.');
			return;
		}
		token = res.token;
		
		if(!onceLogedin){
			getData();
			onceLogedin = true;
		}
		else{
			$('#loginModal').modal("toggle");
			document.getElementById('mainContainer').classList.remove('d-none');
		}
	});
}
function setData(data){
	let param = JSON.stringify({tokenString:token.tokenString, experationDate:token.experationDate, data: data});
	post(url+"/setdata", param, (result)=>{
		let res = JSON.parse(result);
		if(res.error){
			alert(`Error in writing to file. (${res.errorMessage})`);
			return;
		}
		console.log(`sent`);
	});
}
function getData(){
	let param = JSON.stringify({tokenString:token.tokenString, experationDate:token.experationDate});
	post(url+"/getdata", param, (result)=>{
		let res = JSON.parse(result);
		if(res.error){
			bootbox.alert({
				title: 'Error',
				message: 'Error in reading from file. (${res.errorMessage})'
			});
			return;
		}
		$('#loginModal').modal("toggle");
		document.getElementById('mainContainer').classList.remove('d-none');
		list = JSON.parse( code.decryptMessage(res.data, encryptionKey));
	
		for(let account of list){
			add(account.website, account.username, account.password, account.extra)
		}
	});
}

function pushToServer(){
	if(Date.now()/10/10/10 > token.experationDate){
		$('#loginModal').modal("show");
		document.getElementById('mainContainer').classList.add('d-none');
	}
	else{
		setData(code.encryptMessage(JSON.stringify(list), encryptionKey));
	}
}

function saveAll(){
	showAll();
	list = [];
	let datalist = document.getElementById('dataList');
	for(let child of datalist.children){
		let base = child.children[2];

		let website = child.children[1].innerText;
		let username = base.children[1].children[0].value;
		let password = base.children[2].children[0].children[0].value;
		let extra = base.children[3].children[0].value;

		list.push({website: website, username: username, password: password, extra: extra});
	}
}

let currentElm = 0;

function add(website = '', username = '', password = '', extra = ''){
	let liElm = document.createElement('li');
	liElm.classList.add('list-group-item');
	liElm.classList.add('bg-light');
	let liElmID = `acc${currentElm}_li`
	liElm.id = liElmID;

	let imgElm = document.createElement('img');
	imgElm.alt = 'website icon';
	imgElm.src = `https://www.google.com/s2/favicons?domain=${website.substr(1, website.length)}`;

	let spanElm = document.createElement('cool-link');
	spanElm.classList.add('cool-link');
	spanElm.setAttribute('data-toggle','collapse');
	spanElm.setAttribute('data-target', `#acc${currentElm}`);
	spanElm.onclick = collapseAll;
	spanElm.innerText = ' '+website;

	let divElm = document.createElement('div');
	divElm.classList.add('container');
	divElm.classList.add('collapse');
	divElm.id = `acc${currentElm}`;

	divElm.append(document.createElement('br'));

	{// username
		let groupPElm = document.createElement('p');
		groupPElm.innerText = 'Username:';

		let inputElm = document.createElement('input');
		inputElm.classList.add('form-control');
		inputElm.type = 'text';

		inputElm.value = username;

		groupPElm.append(inputElm);

		divElm.append(groupPElm);
		// button if password
	}
	{// password
		let groupPElm = document.createElement('p');
		groupPElm.innerText = 'Password:';

		let inputGroupElm = document.createElement('div');
		inputGroupElm.classList.add('input-group');

		let password_id = `acc${currentElm}_password`;
		let inputElm = document.createElement('input');
		inputElm.classList.add('form-control');
		inputElm.type = 'password';
		inputElm.id = password_id;
		inputElm.value = password;

		let inputgroupappendElm = document.createElement('div');
		inputgroupappendElm.classList.add('input-group-append');

		let copyButtonElm = document.createElement('button');
		copyButtonElm.type = 'button';
		copyButtonElm.classList.add('btn');
		copyButtonElm.classList.add('btn-primary');
		copyButtonElm.innerText = 'Copy';

		

		let showbuttonElm = document.createElement('button');
		showbuttonElm.type = 'button';
		showbuttonElm.classList.add('btn');
		showbuttonElm.classList.add('btn-primary');
		showbuttonElm.innerText = 'Show';

		let shown = false;
		showbuttonElm.onclick = () => {
			let temp = document.getElementById(password_id);
			if(!shown){
				temp.type = 'text';
				shown = true;
			}
			else{
				temp.type = 'password';
				shown = false;
			}
			
		};

		copyButtonElm.onclick = () => {
			let temp = document.getElementById(password_id);

			temp.type = 'text';

			temp.select();
			temp.setSelectionRange(0, 99999);

			document.execCommand("copy");

			temp.type = 'password';
		}


		inputGroupElm.append(inputElm);
		inputgroupappendElm.append(copyButtonElm);
		inputgroupappendElm.append(showbuttonElm);
		inputGroupElm.append(inputgroupappendElm);
		groupPElm.append(inputGroupElm);

		divElm.append(groupPElm);
		// button if password
	}
	{// extra
		let groupPElm = document.createElement('p');
		groupPElm.innerText = 'Extra:';

		let textareaElem = document.createElement('textarea');
		textareaElem.classList.add('form-control');
		textareaElem.rows = 5;
		textareaElem.value = extra;

		groupPElm.append(textareaElem);

		divElm.append(groupPElm);
	}
	{// delete and save button
		let buttongroupElm = document.createElement('div');
		buttongroupElm.classList.add('btn-group');

		let savebuttonElm = document.createElement('button');
		savebuttonElm.classList.add('btn');
		savebuttonElm.classList.add('btn-success');
		savebuttonElm.innerText = 'Save';

		savebuttonElm.onclick = () => {
			saveAll();
		}

		let deletebuttonElm = document.createElement('button');
		deletebuttonElm.classList.add('btn');
		deletebuttonElm.classList.add('btn-danger');
		deletebuttonElm.innerText = 'Delete';

		deletebuttonElm.onclick = () => {
			document.getElementById(liElmID).remove();
		}

		buttongroupElm.append(savebuttonElm);
		buttongroupElm.append(deletebuttonElm);

		divElm.append(buttongroupElm);
	}
	
	liElm.append(imgElm);
	liElm.append(spanElm);
	liElm.append(divElm);

	document.getElementById('dataList').append(liElm);

	currentElm++;
}

// on load hide dataDiv

function OnLogin(){
	let loginForm = document.getElementById('loginForm');
	if( loginForm.checkValidity() === false){
		bootbox.alert({
			title: "Error",
			message: "Please fill out all fields",
		});
		return;
	}
	

	let username = document.getElementById('Username').value;
	let password = document.getElementById('Password').value;
	let encryptionPassword = document.getElementById('EncryptionPassword').value;
	let rememberMe = document.getElementById('RememberMe').value;

	encryptionKey = encryptionPassword;

	console.log(`username:${username},password:${password}`)

	getToken(username, password);
}

function showAll(){
	for(let n = 0; n < document.getElementById('dataList').childElementCount; n++){
		document.getElementById(`acc${n}_li`).classList.remove('d-none');
	}
}
function hide(elmName){
	document.getElementById(elmName).classList.add('d-none');
}

function updateSearch(){
	saveAll();
	let search = document.getElementById('serchInput').value;
	if(search == ''){
		showAll();
		return;
	}
	showAll();
	let results = []; // array of numebrs of the elements that should be hidden.
	let n = 0;
	for(; n < list.length; n++){
		let account = list[n];
		if(account.website.toLowerCase().includes(search.toLowerCase()) || account.username.toLowerCase().includes(search.toLowerCase()) || account.extra.toLowerCase().includes(search.toLowerCase())){
			
		}
		else{
			results.push(n);
		}
	}
	results.forEach((val)=>{
		hide(`acc${val}_li`);
	});
}
function newAccount(){
	bootbox.prompt({
		title: 'URL needed',
		message: 'Please write the url og the accounts website',
		onEscape: true,
		closeButton: true, 
		buttons: {
			cancel: {
				labal: 'Cancel',
				className: 'btn-danger',
			},
			confirm: {
				labal: 'Ok',
				className: 'btn-success',
			}
		},
		callback: (result)=>{
			if(result)
				add(result, '', '', '');
		}
	})
}

let shown0 = false;
let shown1 = false;
function login_show(num){
	if(num === 0){
		let temp = document.getElementById('Password');
		if(!shown0){
			temp.type = 'text';
			shown0 = true;
		}
		else{
			temp.type = 'password';
			shown0 = false;
		}
	}
	else if(num === 1){
		let temp = document.getElementById('EncryptionPassword');
		if(!shown1){
			temp.type = 'text';
			shown1 = true;
		}
		else{
			temp.type = 'password';
			shown1 = false;
		}
	}
}