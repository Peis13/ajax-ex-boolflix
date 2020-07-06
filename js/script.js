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

// Milestone 3:
// In questa milestone come prima cosa aggiungiamo la copertina del film o della serie al nostro elenco.
// Ci viene passata dall’API solo la parte finale dell’URL,
// questo perché poi potremo generare da quella porzione di URL tante dimensioni diverse.
// Dovremo prendere quindi l’URL base delle immagini di TMDB: https://image.tmdb.org/t/p/
// per poi aggiungere la dimensione che vogliamo generare
// (troviamo tutte le dimensioni possibili a questo link: https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400)
// per poi aggiungere la parte finale dell’URL passata dall’API.
// Esempi di URL che tornano delle copertine:
// https://image.tmdb.org/t/p/w185/s2VDcsMh9ZhjFUxw77uCFDpTuXp.jpg
// https://image.tmdb.org/t/p/w1280/aF8jc8Umf8gmRDm7H7gVw7xzItJ.jpg


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

        var film = 'movie';
        var serieTV = 'tv';
        resetHtml($('.numero-video'))
        resetHtml($('.lista-films'))

        // valore della input inserito nel campo ricerca
        var parolaCercata = $('#ricerca').val();
        ottieniVideo(film, parolaCercata);
        ottieniVideo(serieTV, parolaCercata);

        // infine cancello il testo scritto nella input
        resetInput();
      }
    );

    ////////// Invio #ricerca da tastiera
    // prendo il valore della input #ricerca
    // e cerco i film nell'API
    $('#ricerca').keypress(
      function() {

        var film = 'movie';
        var serieTV = 'tv';

        if ((event.which === 13) || (event.keyCode === 13)) {
          resetHtml($('.numero-video'))
          resetHtml($('.lista-films'))

          // valore della input inserito nel campo ricerca
          var parolaCercata = $('#ricerca').val();
          ottieniVideo(film, parolaCercata);
          ottieniVideo(serieTV, parolaCercata);

          // infine cancello il testo scritto nella input
          resetInput();
        }
      }
    );

    ////////// Mostra dettagli Video
    // quando il mouse entra nel singolo video,
    // mostro i dettagli del video
    $(document).on('mouseenter', '.singolo-video',
      function() {

      $(this).children('.dettagli-video').addClass('visibile');
      }
    );

    ////////// Nascondi dettagli Video
    // quando il mouse esce dal singolo video,
    // mostro i dettagli del video
    $(document).on('mouseleave', '.singolo-video',
      function() {

      $(this).children('.dettagli-video').removeClass('visibile');
      }
    );

                        // ----- Fine Ricerca Film ----- //

    // -------------------------- FINE LOGICA -------------------------- //

    // -------------------------- FUNZIONI -------------------------- //

    ////////// OTTIENI VIDEO
    // Funzione che genera una chiamata Ajax
    // prende il valore inserito nella input #ricerca e lo setta come query per la chiamata
    //  --> tipologia: stringa che rappresenta la tipologia di video
    //  --> parolaCercata: stringa che l'utente inserisce nella input #ricerca
    //      per generare la query all'API
    // return: niente
    function ottieniVideo(tipologia, parolaCercata) {

      ////////// Info chiamata
      // metto i dettagli della chamata Ajax in delle variabili
      var url = 'https://api.themoviedb.org/3/search/';
      var api_key = '4cc6118b11d73c4c0274675794143586';

      $.ajax(
        {
          url: url + tipologia,
          method: 'GET',
          data: {
            api_key: api_key,
            query: parolaCercata,
            language: 'it-IT'
          },
          success: function(rispostaAPI) {
            // console.log(rispostaAPI);

            ////////// Array di ritorno chiamata Ajax
            var arrayObjVideo = rispostaAPI.results;

            stampaNumeroVideo(rispostaAPI, tipologia)

            // Se l'array che mi torna è vuoto, stampo un messaggio di errore
            if (arrayObjVideo.length > 0) {

              stampaVideo(arrayObjVideo, tipologia);
            } else {

              if (tipologia == 'movie') {

                ////////// Imposto un messaggio di errore
                var messaggioErrore = 'Errore, non è stato trovato nessun film';
                stampaErrore(messaggioErrore);
              } else {

                ////////// Imposto un messaggio di errore
                var messaggioErrore = 'Errore, non è stato trovato nessuna serie TV';
                stampaErrore(messaggioErrore);
              }
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

    ////////// STAMPA VIDEO
    // Funzione che stampa a schermo i dettagli del video cercato
    //  --> arrayObj: array di oggetti che serve alla funzione come argomento
    //  --> tipologia: stringa che serve alla funzione per decidere se stampare film oppure serie TV
    // return: niente
    function stampaVideo(arrayObj, tipologia) {

      // Preparo il template handlebars
      // a cui darò in pasto il mio oggetto singoloVideo formattato
      var source = $("#film-template").html();
      var template = Handlebars.compile(source);

      // Ciclo gli oggetti dell'array ricevuto
      for (var i = 0; i < arrayObj.length; i++) {

        ////////// Oggetto API
        var singoloVideoAPI = arrayObj[i];

        ////////// Lista variabili
        // Creo una lista di variabili che corrispondono ai valori di ritono della chiamata.
        // Queste variabili diventano poi i valori del nuovo oggetto che andrò a stampare
        var immagine = singoloVideoAPI.poster_path;
        var lingua = singoloVideoAPI.original_language;
        var voto = singoloVideoAPI.vote_average;
        var trama = singoloVideoAPI.overview;
        var id = singoloVideoAPI.id;

        // in base alla tipologia che mi arriva come argomento,
        // vado a pescare i titoli che hanno chiavi diverse
        // in base alla chiamata effettuata in precedenza
        switch (tipologia) {

          case 'movie':
          var titoloOriginale = singoloVideoAPI.original_title;
          var titolo = singoloVideoAPI.title;
          var tipo = 'Film';
            break;

          case 'tv':
          var titoloOriginale = singoloVideoAPI.original_name;
          var titolo = singoloVideoAPI.name;
          var tipo = 'Serie TV';
            break;
        }

        ////////// Oggetto Handlebars
        var singoloVideo = {
          immagine: stampaImmagine(immagine),
          titolo_originale: titoloOriginale,
          titolo: titolo,
          tipologia_api: tipologia,
          tipologia: tipo,
          lingua: stampaBandiera(lingua),
          valutazione: generaStelle(voto),
          trama: trama,
          id_video: id
        };

        // Stampo nell'html singoloVideo
        var html = template(singoloVideo);
        $('.lista-films').append(html);
        // console.log(singoloVideo.id_video);
      }
      ottieniCrediti()
    }

    ////////// OTTIENI CREDITI
    // Funzione che effettua una chiamata per ogni video già stampato
    // per ottenere informazioni sul genere e sugli attori
    //  --> credito: stringa che identifica il tipo di credito che si vuole ottenere
    // return: niente
    function ottieniCrediti() {

      $('.singolo-video').each(
        function() {

          var attrTipologia = $(this).attr('data-tipologia');
          var attrID = $(this).attr('data-id');

          // in base a quale info voglio ottenere,
          // vado a formare il percorso per la chiamata ajax
          var chiamataGeneri = attrTipologia + '/' + attrID;
          var chiamataAttori = chiamataGeneri + '/credits';

          ottieniGeneri(chiamataGeneri, attrID);
          ottieniAttori(chiamataAttori);
        }
      );
    }

    // OTTIENI GENERI
    // Chiamata per ottenere il genere di ogni video
    //  --> percorsoParziale: stringa che serve per l'indirizzamento della chiamata
    //  --> attrID: stringa che serve per l'indirizzamento del template handlebars
    // return: niente
    function ottieniGeneri(percorsoParziale, attrID) {

      ////////// Info chiamata
      // metto i dettagli della chamata Ajax in delle variabili
      var url = 'https://api.themoviedb.org/3/' + percorsoParziale; // movie/214756
      var api_key = '4cc6118b11d73c4c0274675794143586';

      $.ajax(
        {
          url: url,
          method: 'GET',
          data: {
            api_key: api_key,
            language: 'it-IT'
          },
          success: function(rispostaAPI) {

            ////////// Array di ritorno chiamata Ajax
            var arrayObjGeneri = rispostaAPI.genres;

            if (arrayObjGeneri.length > 0) {

              // Preparo il template handlebars
              // a cui darò in pasto il mio oggetto singoloVideoGeneri formattato
              var source = $("#generi-template").html();
              var template = Handlebars.compile(source);

              var listaGeneri = [];
              for (var i = 0; i < arrayObjGeneri.length; i++) {

                var genere = arrayObjGeneri[i].name;
                listaGeneri.push(genere);
              }

              ////////// Oggetto Handlebars
              var singoloVideoGeneri = {
                generi: listaGeneri
              }

              // Stampo nell'html singoloVideo
              var html = template(singoloVideoGeneri);
              console.log(html);
              $('.singolo-video[data-id="' + attrID + '"]').find('.generi').append(html);
            }
          },
          error: function() {
            alert('nessun ID corrispondente trovato');
          }
        }
      );
    }

    // OTTIENI ATTORI
    // Chiamata per ottenere gli attori di ogni video
    //  --> percorsoParziale: stringa che serve per l'indirizzamento della chiamata
    // return: niente
    function ottieniAttori(percorsoParziale) {

      ////////// Info chiamata
      // metto i dettagli della chamata Ajax in delle variabili
      var url = 'https://api.themoviedb.org/3/' + percorsoParziale; // movie/214756
      var api_key = '4cc6118b11d73c4c0274675794143586';

      $.ajax(
        {
          url: url,
          method: 'GET',
          data: {
            api_key: api_key,
            language: 'it-IT'
          },
          success: function(rispostaAPI) {
            // console.log(rispostaAPI);


          },
          error: function() {
            alert('nessun ID corrispondente trovato');
          }
        }
      );
    }


    ////////// GENERA STELLE
    // Funzione che genera delle stelle
    //  --> voto: come argomento gli passo un numero che identifica una media voto
    // Il voto che ricevo dall'API è su una scala da 0 a 10
    // il mio range di valutazione invece va da 0 a 5
    //  --> per prima cosa divido per 2 il voto ricevuto e lo arrotondo per eccesso
    //  --> faccio un ciclo for per visualizzare la valutazione con delle stelle
    //      con un range di valutazione massima di 5
    //      ogni ciclo rappresenta il riempimento di una stellina
    //        --> se la valutazione è maggiore dell'indice del ciclo
    //              --> stellina piena
    //        --> altrimenti
    //            --> stellina vuota
    // return: stelle formattate che inserirò nell'oggetto handlebars
    function generaStelle(voto) {

      var valutazione = Math.ceil(voto / 2);
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

    ////////// STAMPA BANDIERA
    // Funzione che genera un'immagine di bandiera in base alla lingua
    //  --> lingua: stringa che passo come argomento per controllare
    //      se è disponibile la bandiera di quella lingua stessa
    // se la lingua che gli passo è presente nell'array 'listaLingue'
    //  --> creo una stringa con tag html di un'immagine
    //      che ha come attributo 'src' la lingua corrispondente all'immagine in cartella
    //  --> altrimenti la lingua rimarrà la sigla che torna dall'API
    // return: stringa da passare all'oggetto gestito da handlebars
    function stampaBandiera(lingua) {

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

        lingua = '<img class="bandiera" src="img/' + lingua + '.png" alt="' + lingua + '">';
      }
      return lingua;
    }

    ////////// STAMPA IMMAGINE COPERTINA
    // Trasforma il valore di poster_path ricevuto dall'API in un perscorso
    // da stampare con handlebars
    //  --> immagineAPI: può essere una stringa o null (se il film non ha immagine di copertina)
    // return: una stringa pronta per essere stampata in handlebars
    function stampaImmagine(immagineAPI) {

      ////////// Url parziale
      // Queste due stringhe servono per formare un percorso parziale
      // per la ricerca delle copertine video
      var urlBaseImmagine = 'https://image.tmdb.org/t/p/';
      var formatoImmagine = 'w342';  // Array ["w92", "w154", "w185", "w342", "w500", "w780", "original"]
      var urlParziale = urlBaseImmagine + formatoImmagine;

      // controllo che la risposta dell'immagine non sia nulla
      //  --> se è nulla imposto un'immagine di default
      //  --> altrimenti concateno la risposta all'url parziale
      if (immagineAPI == null) {

        var immagineCopertina = 'img/non_disponibile.png';
      } else {

        var immagineCopertina = urlParziale + immagineAPI;
      }
      return immagineCopertina;
    }

    ////////// STAMPA NUMERO VIDEO TROVATI
    // Funzione che stampa il numero di video ricevuti dalla ricerca
    // e il numero di pagine di video che ricevo dalla chiamata ajax
    //  --> rispostaAPI: è un oggetto ricevuto dalla richiesta all'API
    //  --> tipologia: stringa che rappresenta la tipologia di video
    // return: niente
    function stampaNumeroVideo(rispostaAPI, tipologia) {

      // Preparo il template handlebars
      // a cui darò in pasto il messaggio da stampare
      var source = $("#info-template").html();
      var template = Handlebars.compile(source);

      // in base alla tipologia che mi arriva come argomento,
      // vado a scrivere la info della tipologia di risposta
      switch (tipologia) {

        case 'movie':
        var tipo = 'Film';
          break;

        case 'tv':
        var tipo = 'Serie TV';
          break;
      }
      var numeroVideo = rispostaAPI.total_results;

      ////////// Oggetto Handlebars
      var videoTrovati = {
        info: tipo,
        numero_video: numeroVideo
      };

      // Stampo nell'html il messaggio di errore
      var html = template(videoTrovati);
      $('.numero-video').append(html);
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
    function resetHtml(selettore) {
      selettore.html('');
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
