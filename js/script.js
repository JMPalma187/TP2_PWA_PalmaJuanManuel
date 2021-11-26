const API_KEY = "2620bb10";
const URL = "https://www.omdbapi.com/";

window.addEventListener('offline', event =>{
    document.getElementById('statuscnx').innerHTML =  (`<p class="nav-item nav-link">| Estás Offline <i class="fas fa-skull"></i></p>`);
});

window.addEventListener('online', event =>{
    document.getElementById('statuscnx').innerHTML = (`<p class="nav-item nav-link">| Estás Online <i class="far fa-laugh"></i></p>`);
  });
  
  if(!navigator.onLine){
    document.getElementById('statuscnx').innerHTML = (`<p class="nav-item nav-link">| Estás Offline <i class="fas fa-skull"></i></p>`);
  } else {
    document.getElementById('statuscnx').innerHTML = (`<p class="nav-item nav-link">| Estás Online <i class="far fa-laugh"></i></p>`);
  };

$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        let buscarPeli = $('#buscarPeli').val();
        getPelis(buscarPeli);
        e.preventDefault();
    });
});

function getPelis(buscarPeli){         
    fetch(`${URL}?apikey=${API_KEY}&s=${buscarPeli}`).then(function(response)
      {console.log(response);
        return response.json();
    }).then(function(responseJson){                
                console.log(responseJson.Search);
                mostrarResultados(responseJson);
            })
    .catch(function(error){
        console.log('No existe la serie/película o la chingaste --> ', error);
    })
}

function mostrarResultados(responseJson){
    let pelis = responseJson.Search;
    let salidapeli = '';
    $.each(pelis, (index, peli) => {
    peli.Poster === "N/A" ? peli.Poster = 'images/pna.jpg' : peli.Poster;
    peli.Year.includes('–') ? peli.Year += '> Now' : peli.Year;        
    salidapeli += `<div class="card border-primary mb-3 tarjetas" style="max-width: 20rem;">
                        <div class="card-header">${peli.Type} | ${peli.Year}</div>
                        <div class="card-body">                            
                            <img src="${peli.Poster}" alt="Poster de ${peli.Title}">
                            <h4 class="card-title">${peli.Title}</h4>                                               
                        </div>                                                
                        <div class="d-grid gap-2 button-effect">
                            <a href="#" class="btn btn-lg btn-primary botonsubmit effect effect-1" onclick="seleccionPeli('${peli.imdbID}')">Ver detalles</a>
                        </div>
                    </div>`;
                });
    $('#movies').html(salidapeli);
};

function seleccionPeli(id){
    sessionStorage.setItem('movieId', id);
    window.location = 'detalles.html';
    return false;
}

function getMovie(){
    let movieId = sessionStorage.getItem('movieId');
    fetch(`${URL}?apikey=${API_KEY}&i=${movieId}`).then(function(detallado)
      {console.log(detallado);
        return detallado.json();
    }).then(function(detalladoJson){ 
        mostrarDetallesPeli(detalladoJson);        
    })
    .catch(function(error){
        console.log('No existe la serie/película o la chingaste --> ', error);
    })
}

function mostrarDetallesPeli(detalladoJson){
    console.log(detalladoJson);    
    let movie = detalladoJson;    
    movie.Poster === "N/A" ? movie.Poster = 'images/pna.jpg' : movie.Poster;
    movie.Year.includes('–') ? movie.Year += '> Now' : movie.Year;
    let exitdescp =`

    <div class="card border-primary mb-3">
        <h2 class="card-header">${movie.Title} | ${movie.Year}</h2>
        <div class="card-body">
          <h5 class="card-title">Plot</h5>
          <h6 class="card-subtitle text-muted">${movie.Plot}</h6>
        </div>
        <img src="${movie.Poster}" alt="Poster de ${movie.Year} - ${movie.Title}" class="thumbnail d-block user-select-none">        
        <div class="card-body card-header">
          <h3 class="card-header">Información y descripción:</h3>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item infoitems"><p><strong>Genre:</strong> ${movie.Genre}</p></li>            
            <li class="list-group-item infoitems"><p><strong>Released:</strong> ${movie.Released}</p></li>
            <li class="list-group-item infoitems"><p><strong>Rated:</strong> ${movie.Rated}</p></li>
            <li class="list-group-item infoitems"><p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p></li>
            <li class="list-group-item infoitems"><p><strong>Director:</strong> ${movie.Director}</p></li>
            <li class="list-group-item infoitems"><p><strong>Writer:</strong> ${movie.Writer}</p></li>
            <li class="list-group-item infoitems"><p><strong>Actors:</strong> ${movie.Actors}</p></li>          
        </ul>
        <div class="card-body">
            <a href="index.html" class="btn btn-dark"><i class="fas fa-arrow-left"></i> Volver</a>                        
            <a id="llaveid" href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-info">Ver ficha IMDB <i class="fab fa-imdb"></i></a>                        
            <a hre="#" id="addpdn" class="btn btn-success" onclick="lsadd('my_storage','${movie.imdbID}');">Sumar a Pendientes <i class="fas fa-bookmark"></i></a>
        </div>
    </div>
  `;
  $('#movie').html(exitdescp);    
}

/* Localstorage para guardar, ver y borrar Mis Pendientes :) - Costó MUCHO pero salió con ayuda de Google.
Lástima que no pude aplicar indexedDB :( */

function lsadd(storage_name, id, limit){	
    var storage_list = [];
		storage_list = JSON.parse(localStorage.getItem(storage_name)) || [];
	var storaged 	 = JSON.parse(localStorage.getItem(storage_name));

	if (localStorage.getItem(storage_name) === null) { 
			storage_list.push(id); 
			console.log(storage_list); 
			localStorage.setItem(storage_name, JSON.stringify(storage_list));
			process("my_storage");
			 
	} else {
		if(storaged.indexOf(id)==-1){				
				var count =  storaged.length;
				if(count >= limit){
					// Esto es por si alcanza el límite. Me pareció una buena validación 
					storaged.splice(0, 1); // Remueve el primero, para poder sobre-escribir.
					localStorage.setItem(storage_name, JSON.stringify(storaged)); // Hace update sin la primera posición ocupada
					storage_list.push(id); // y agrega el nuevo Pendiente que el usuario clickeó...
				} else {
					storage_list.push(id); 
					console.log(storage_list);
					localStorage.setItem(storage_name, JSON.stringify(storage_list));	
				}				
				process("my_storage");
				 
		} else {
			console.log("Ya se ha agregado!");
		}
	}
}


function lsdel(storage_name, id){
	if (localStorage.getItem(storage_name) === null) { 
		 console.log("Tu localstorage no está guardado aun");
	} else {				
		var ls_data = JSON.parse(localStorage.getItem(storage_name));
		var index   = ls_data.indexOf(id);		
		if(index == -1){
		// si no coincide, sigue	
		} else {
			// si coincide el ID, lo saca.
			ls_data.splice(index, 1);
			localStorage.setItem(storage_name, JSON.stringify(ls_data));			
			process("my_storage");
		}
	}
}

function process(storage_name) {
	let pelipendi = '';
	if (localStorage.getItem(storage_name) === null) { 
		console.log("Tu LocalStorage no se generó");	
	} else { 
		var storageList = JSON.parse(window.localStorage.getItem(storage_name));
		var count =  storageList.length;

		if(count==0){
			console.log("Tu LocalStorage está vacío");
            pelipendi = '';
            $('#pendmovies').html(pelipendi); 
		}
		for (var i = 0, len = storageList.length; i < len; i++) {
		// Mostramos la lista y generamos las vistas de Mis Pendientes
		
            let imdbkey = storageList[i];

            fetch(`${URL}?apikey=${API_KEY}&i=${imdbkey}`).then(function(pendientes)
            {
            return pendientes.json();
           
            }).then(function(pendientesJson){                
                         
               pending = pendientesJson;            
               pending.Poster === "N/A" ? pending.Poster = 'images/pna.jpg' : pending.Poster;
               pending.Year.includes('–') ? pending.Year += '> Now' : pending.Year;
               pelipendi += `<div class="card border-primary mb-3 tarjetas" style="max-width: 20rem;">
               <div class="card-header">${pending.Type} | ${pending.Year}</div>
               <div class="card-body">                            
                   <img class="img-fluid" src="${pending.Poster}" alt="Poster de ${pending.Title}">
                   <h4 class="card-title">${pending.Title}</h4>                                               
               </div>                                                
               <div class="d-grid gap-2 button-effect">
                   <a href="#" class="btn btn-lg btn-primary botonQuitar" onclick="lsdel('my_storage','${pending.imdbID}');">Quitar de Mis Pendientes</a>
               </div>
           </div>`;
           $('#pendmovies').html(pelipendi);     
           })       
           .catch(function(error){
           console.log('No existe la serie/película o la chingaste --> ', error);
            })
           }}
	}

// meto update de todo
process("my_storage");

// Spinner de carga

function onReady(callback) {
    var intervalId = window.setInterval(function() {
      if (document.getElementsByTagName('body')[0] !== undefined) {
        window.clearInterval(intervalId);
        callback.call(this);
      }
    }, 1000);
  }
  
  function setVisible(selector, visible) {
    document.querySelector(selector).style.display = visible ? 'block' : 'none';
  }
  
  onReady(function() {
    setVisible('.page', true);
    setVisible('#loading', false);
  });