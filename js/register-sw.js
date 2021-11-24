if ('serviceWorker' in navigator){
  // Gonza: Tuve que poner la ruta con un '.' porque sino me tiraba el erro de clase que te tiraba a vos.
  navigator.serviceWorker.register("./service-worker.js").then((message) => {
    console.log("ServiceWorker funcionando ;) !");
  });
} else {
  console.log("No soup for you! -  Service Worker no es soportado :(");
}
