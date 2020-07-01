////////// Milestone 1:
// Creare un layout base con una searchbar (una input e un button)
// in cui possiamo scrivere completamente o parzialmente il nome di un film.
// Possiamo, cliccando il  bottone,
// cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API
// visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

////////// Dettagli chiamata AJAX:
// endpoint: https://api.themoviedb.org/3/search/movie
// API KEY: 4cc6118b11d73c4c0274675794143586
// query: valore della input #ricerca (film da cercare)
// language: imposta la lingua del film cercato (it-IT)

$(document).ready(
  function() {

    // Click sul bottone #cerca
    $('#cerca').click(
      function() {

        $.ajax(
          {
            url: 'https://api.themoviedb.org/3/search/movie',
            method: 'GET',
            data: {
              api_key: '4cc6118b11d73c4c0274675794143586',
              query: 'ritorno al futuro', // TODO: $('#ricerca').val()
              language: 'it-IT'
            },
            success: function(rispostAPI) {
              // console.log(rispostAPI);
              // console.log(rispostAPI.total_results);
              // console.log(rispostAPI.total_pages);

              var arrayObjFilm = rispostAPI.results;
              console.log(arrayObjFilm);

              // Preparo il template handlebars
              // a cui darò in pasto il mio singoloFilm formattato
              var source = $("#film-template").html();
              var template = Handlebars.compile(source);

              // Ciclo gli oggetti dell'array ricevuto
              for (var i = 0; i < arrayObjFilm.length; i++) {
                var singoloFilmAPI = arrayObjFilm[i];
                console.log(singoloFilmAPI);
                // console.log(singoloFilmAPI.original_title);

                var singoloFilm = {
                  titolo_originale: singoloFilmAPI.original_title,
                  titolo: singoloFilmAPI.title
                };
                console.log(singoloFilm);

                var html = template(singoloFilm);
                console.log(html);
                $('.lista-films').append(html);
              }


            },
            error: function() {
              alert('errore');
            }
          }
        );
      }
    );

////////// Fine document.ready
  }
);

// Handlebars
// var source = $("#film-template").html();
// var template = Handlebars.compile(source);
//
// var context = { title: "My New Post", body: "This is my first post!" };
// var html = template(context);
