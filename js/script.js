var db, input, ul;

const API_KEY = "2620bb10";
const URL = "https://www.omdbapi.com/";

window.addEventListener('offline', event =>{
    document.getElementById('cnx-status').classList.remove('online');
    document.getElementById('cnx-status').classList.add('offline');   
  })

window.addEventListener('online', event =>{
    document.getElementById('cnx-status').classList.remove('offline');
    document.getElementById('cnx-status').classList.add('online');    
  })
  
  if(!navigator.onLine){
    document.getElementById('cnx-status').classList.remove('online');
    document.getElementById('cnx-status').classList.add('offline');
  }

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
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-info">Ver ficha IMDB <i class="fab fa-imdb"></i></a>                        
            <button id="agregarPendientes" type="submit" class="btn btn-success" value="${movie.imdbID}">Sumar a Pendientes <i class="fas fa-bookmark"></i></button>
        </div>
    </div>
  `;
  $('#movie').html(exitdescp);
}

function init(){
    db = new Dexie("HeroFun-MisPendientes");
    input = document.getElementById("agregarPendientes").value;    
    document.body.addEventListener('submit', onSubmit);
    document.body.addEventListener('click', onClick);
    
    db.version(1).stores({ todo: '_id'});
    db.open()
      .then(refreshView);
}

function onSubmit(event){
    event.preventDefault();

    db.todo.put({ text: input.value, _id: String(Date.now()) })
    .then(function(){
      input.value = '';
    })
    .then(refreshView);

  if (flag == 0){
    flag++;    
  } else {
    flag = 0;    
  }
}        


/* 
function agregarMisPendientes(){

}

function quitarMisPendientes(){

}

function verMisPendientes(){

}




*/

window.onload = function(){
    init();
  }