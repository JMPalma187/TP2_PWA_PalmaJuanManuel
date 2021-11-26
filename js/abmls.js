
function lsadd(storage_name, value, limit){	
    var storage_list = [];
		storage_list = JSON.parse(localStorage.getItem(storage_name)) || [];
	var storaged 	 = JSON.parse(localStorage.getItem(storage_name));

	if (localStorage.getItem(storage_name) === null) { // if storage name not saved previously, we will add now...
			storage_list.push(value); // add in array clicked value
			console.log(storage_list); // show list on console...
			localStorage.setItem(storage_name, JSON.stringify(storage_list));
			process("my_storage");
			 
	} else {
		if(storaged.indexOf(value)==-1){ // if clicked value not in storage list?				
				var count =  storaged.length;
				if(count >= limit){
					// if reached limit overwrite first element...
					storaged.splice(0, 1); // remove first element, for overwrite
					localStorage.setItem(storage_name, JSON.stringify(storaged)); // update new list without first element
					storage_list.push(value); // and add new clicked element value...
				} else {
					storage_list.push(value); 
					console.log(storage_list);
					localStorage.setItem(storage_name, JSON.stringify(storage_list));	
				}				
				process("my_storage");
				 
		} else {
			console.log("its already added!");
		}
	}
}


function lsdel(storage_name, value){
	if (localStorage.getItem(storage_name) === null) { 
		$(".r_text").html("local storage not saved yet...");
	} else {		
		console.log("vikvik");
		var ls_data = JSON.parse(localStorage.getItem(storage_name));
		var index   = ls_data.indexOf(value);
		console.log("seçilen index:"+index);
		if(index == -1){
		// if not matched selected index	
		} else {
			// is matched, remove...
			ls_data.splice(index, 1);
			localStorage.setItem(storage_name, JSON.stringify(ls_data));
			console.log(ls_data);  
			process("my_storage");
		}
	}
}



function process(storage_name) {
	$("ul.storage_list").html("");
	if (localStorage.getItem(storage_name) === null) { 
		console.log("local storage not saved yet...");
		
		$(".r_text").html("local storage not saved yet...");
	} else {
 
		var storageList = JSON.parse(window.localStorage.getItem(storage_name));
		var count =  storageList.length;

		if(count==0){
			console.log("0 values in list..."); 
		}

			console.log(count+" values on list...");

		for (var i = 0, len = storageList.length; i < len; i++) {
		// Show storage list...
			console.log(storageList[i]);
			 
			$("ul.storage_list").append('<li><div class="text">'+storageList[i]+'</div><div onclick="lsdel(\'my_storage\',\''+storageList[i]+'\');" class="remove">Remove</div></li>');

		}
	$(".r_array").show();
	$(".r_array").html("<b>my_storage</b>="+JSON.stringify(storageList));
	$(".r_text").html("<b>"+count+ "</b> values in LocalStorage array list...");
	}
}

// update all
process("my_storage");
