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

    // -------------------------- LOGICA -------------------------- //

                        // ----- Ricerca Film ----- //

    ////////// Click sul bottone #cerca
    $('#cerca').click(
      function() {

        // resetto la lista dei film html per non accodare nuove ricerche
        $('.lista-films').html('');

        // valore della input inserito nel campo ricerca
        var filmCercato = $('#ricerca').val();
        stampaRicerca(filmCercato);

        // infine cancello il testo scritto nella input
        $('#ricerca').val('');
      }
    );

    ////////// Invio #ricerca da tastiera
    $('#ricerca').keypress(
      function() {

        if ((event.which === 13) || (event.keyCode === 13)) {

          // resetto la lista dei film html per non accodare nuove ricerche
          $('.lista-films').html('');

          // valore della input inserito nel campo ricerca
          var filmCercato = $('#ricerca').val();
          stampaRicerca(filmCercato);

          // infine cancello il testo scritto nella input
          $('#ricerca').val('');
        }
      }
    );
                        // ----- Fine Ricerca Film ----- //

    // -------------------------- FINE LOGICA -------------------------- //

    // -------------------------- FUNZIONI -------------------------- //

    ////////// STAMPA FILM
    // Funzione che stampa a schermo i dettagli del film cercato
    //  --> arrayObj: array di oggetti che serve alla funzione come argomento
    // return: niente
    function stampaFilm(arrayObj) {

      // Preparo il template handlebars
      // a cui darò in pasto il mio singoloFilm formattato
      var source = $("#film-template").html();
      var template = Handlebars.compile(source);


      // Ciclo gli oggetti dell'array ricevuto
      for (var i = 0; i < arrayObj.length; i++) {

        ////////// Oggetto API
        var singoloFilmAPI = arrayObj[i];

        // Creo una lista di variabili
        // che corrispondono ai valori di ritono della chiamata.
        // Queste variabili diventano poi
        // i valori del nuovo oggetto che andrò a stampare

        ////////// Lista variabili
        var titoloOriginale = singoloFilmAPI.original_title;
        var titolo = singoloFilmAPI.title;
        var lingua = singoloFilmAPI.original_language;
        var voto = singoloFilmAPI.vote_average;

        ////////// Oggetto Handlebars
        var singoloFilm = {
          titolo_originale: titoloOriginale,
          titolo: titolo,
          lingua: lingua,
          voto: voto
        };

        // Stampo nell'html singoloFilm
        var html = template(singoloFilm);
        $('.lista-films').append(html);
      }
    }

    ////////// STAMPA RICERCA
    // Funzione che genera una chiamata Ajax
    // prende il valore inserito nella input #ricerca e lo setta come query per la chiamata
    //  --> filmCercato: stringa che serve alla funzione come argomento
    //      per generare la query all'API
    // return: niente
    function stampaRicerca(filmCercato) {

      $.ajax(
        {
          url: 'https://api.themoviedb.org/3/search/movie',
          method: 'GET',
          data: {
            api_key: '4cc6118b11d73c4c0274675794143586',
            query: filmCercato,
            language: 'it-IT'
          },
          success: function(rispostAPI) {

            ////////// Array di ritorno chiamata Ajax
            var arrayObjFilm = rispostAPI.results;

            stampaFilm(arrayObjFilm)
          },
          error: function() {
            alert('Inserisci il titolo di un film');
          }
        }
      );
    }
    // -------------------------- FINE FUNZIONI -------------------------- //

////////// Fine document.ready
  }
);
