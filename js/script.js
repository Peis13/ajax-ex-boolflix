    // -------------------------- INFO APPLICAZIONE -------------------------- //

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

////////// Milestone 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5,
// così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5,
// lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva,
// non gestiamo icone mezze piene (o mezze vuote :P)
//
// Trasformiamo poi la stringa statica della lingua
// in una vera e propria bandiera della nazione corrispondente,
// gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API
//
// Allarghiamo poi la ricerca anche alle serie tv.
// Con la stessa azione di ricerca dovremo prendere
// sia i film che corrispondono alla query, sia le serie tv,
// stando attenti ad avere alla fine dei valori simili
// (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// Qui un esempio di chiamata per le serie tv:
// https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs


////////// Dettagli chiamata AJAX:
// endpoint: https://api.themoviedb.org/3/search/movie
// API KEY: 4cc6118b11d73c4c0274675794143586
// query: valore della input #ricerca (film da cercare)
// language: imposta la lingua del film cercato (it-IT)

    // -------------------------- FINE INFO APPLICAZIONE -------------------------- //

$(document).ready(
  function() {

    // -------------------------- LOGICA -------------------------- //

                        // ----- Ricerca Film ----- //

    ////////// Click sul bottone #cerca
    // prendo il valore della input #ricerca
    // e cerco i film nell'API
    $('#cerca').click(
      function() {

        // valore della input inserito nel campo ricerca
        var filmCercato = $('#ricerca').val();
        ottieniRicerca(filmCercato);

        // infine cancello il testo scritto nella input
        resetInput();
      }
    );

    ////////// Invio #ricerca da tastiera
    // prendo il valore della input #ricerca
    // e cerco i film nell'API
    $('#ricerca').keypress(
      function() {

        if ((event.which === 13) || (event.keyCode === 13)) {

          // valore della input inserito nel campo ricerca
          var filmCercato = $('#ricerca').val();
          ottieniRicerca(filmCercato);

          // infine cancello il testo scritto nella input
          resetInput();
        }
      }
    );



    // $(document).on('error', '.bandiera', function(){
    //   console.log($(this));
    //   $('.lingua img').replaceWith(55)
    //
    // });
                        // ----- Fine Ricerca Film ----- //

    // -------------------------- FINE LOGICA -------------------------- //

    // -------------------------- FUNZIONI -------------------------- //

    ////////// OTTIENI RICERCA
    // Funzione che genera una chiamata Ajax
    // prende il valore inserito nella input #ricerca e lo setta come query per la chiamata
    //  --> filmCercato: stringa che serve alla funzione come argomento
    //      per generare la query all'API
    // return: niente
    function ottieniRicerca(filmCercato) {
      resetHtml()

      ////////// Info chiamata
      // metto i dettagli della chamata Ajax in delle variabili
      var url = 'https://api.themoviedb.org/3/search/movie';
      var api_key = '4cc6118b11d73c4c0274675794143586';

      $.ajax(
        {
          url: url,
          method: 'GET',
          data: {
            api_key: api_key,
            query: filmCercato,
            language: 'it-IT'
          },
          success: function(rispostAPI) {

            ////////// Array di ritorno chiamata Ajax
            var arrayObjFilm = rispostAPI.results;

            // Se l'array che mi torna è vuoto, stampo un messaggio di errore
            if (arrayObjFilm.length > 0) {

              stampaFilm(arrayObjFilm)
            } else {

              ////////// Imposto un messaggio di errore
              var messaggioErrore = 'Errore, non è stato trovato nessun film';
              stampaErrore(messaggioErrore);
            }

          },
          error: function() {

            ////////// Imposto un messaggio di errore
            var messaggioErrore = 'Errore, inserisci una parola nella ricerca film';
            stampaErrore(messaggioErrore);
          }
        }
      );
    }

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

        ////////// Lista lingue
        var listaLingue = [
          'de',
          'en',
          'es',
          'fr',
          'it',
          'pt',
          'zh'
        ];

        if (listaLingue.includes(lingua)) {

          lingua = '<img class="bandiera" src="img/' + lingua + '.png" alt="">';
        }

        // Il voto che ricevo dall'API è su una scala da 0 a 10
        // il mio range di valutazione invece va da 0 a 5
        //  --> per prima cosa divido per 2 il voto ricevuto e lo arrotondo per eccesso
        //  --> quindi genero le stelle che inserirò nell'oggetto handlebars
        var valutazione = Math.ceil(voto / 2);
        var stelle = generaStelle(valutazione);

        ////////// Oggetto Handlebars
        var singoloFilm = {
          titolo_originale: titoloOriginale,
          titolo: titolo,
          lingua: lingua,
          valutazione: stelle
        };

        // $('.bandiera').on('error', function() {
        //   // console.log($(this));
        //   // var lingua = $('.lingua img').attr('data-lingua')
        //   // console.log(lingua);
        //   $(this).attr('src', 'img/it.png')
        // })

        // Stampo nell'html singoloFilm
        var html = template(singoloFilm);
        $('.lista-films').append(html);
      }
    }

    ////////// GENERA STELLE
    // Funzione che genera delle stelle
    //  --> valutazione: come argomento gli passo un numero che identifica una valutazione
    // Faccio un ciclo for per visualizzare la valutazione con delle stelle
    // con un range di valutazione massima di 5
    // ogni ciclo rappresenta il riempimento di una stellina
    //  --> se la valutazione è maggiore dell'indice del ciclo
    //      --> stellina piena
    //  --> altrimenti
    //      --> stellina vuota
    // return: stelle formattate
    function generaStelle(valutazione) {
      var rangeValutazione = 5;
      var stelle = '';
      for (var i = 1; i <= rangeValutazione; i++) {

        if (i <= valutazione) {

          stelle += '<i class="fas fa-star"></i>';
        } else {

          stelle += '<i class="far fa-star"></i>';
        }
      }
      return stelle;
    }

    ////////// STAMPA ERRORE
    // Funzione che stampa un messaggio di errore
    //  --> messaggio: è una stringa che contiene il messaggio da visualizzare
    // return: niente
    function stampaErrore(messaggio) {

      // Preparo il template handlebars
      // a cui darò in pasto il messaggio da stampare
      var source = $("#messaggio-template").html();
      var template = Handlebars.compile(source);

      ////////// Oggetto Handlebars
      var errore = {
        messaggio: messaggio
      };

      // Stampo nell'html il messaggio di errore
      var html = template(errore);
      $('.lista-films').append(html);
    }

    ////////// RESET HTML
    // Funzione che svuota la lista dei film trovati per non accodare nuove ricerche
    function resetHtml() {
      $('.lista-films').html('');
    }

    ////////// RESET INPUT
    // Funzione che svuota la lista dei film trovati per non accodare nuove ricerche
    function resetInput() {
      $('#ricerca').val('');
    }

    // -------------------------- FINE FUNZIONI -------------------------- //

////////// Fine document.ready
  }
);
