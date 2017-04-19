var win = $( this );
var bookmarkFinder = $( '.bookmark-finder' );
var appPrototype = $('.bookmark-card.wz-prototype');

//EVENTOS
win.on( 'focus', '.bookmark-finder input', function(){
  bookmarkFinder.addClass( 'active' );
})

.on( 'blur', '.bookmark-finder input', function(){
  bookmarkFinder.removeClass( 'active' );
})

.on( 'mousedown', '.bookmark-finder', function(){
  bookmarkFinder.addClass( 'active' );
})

.on( 'click', '.bookmark-finder', function(){
  $( '.bookmark-finder input' ).focus();
})

.on( 'click', '.appDom button', function(){

  if( $(this).parent().hasClass('installed') ){
    removeApp( $(this).parent() );
  }else{
    addApp( $(this).parent() );
  }

})

.on( 'click', '.all-apps:not(.selected)', function(){

  $('.bookmark-tabs .selected').removeClass('selected');
  $(this).addClass('selected');

})

.on( 'click', '.installed-apps:not(.selected)', function(){

  $('.bookmark-tabs .selected').removeClass('selected');
  $(this).addClass('selected');

});

//FUNCIONES
var addApp = function( appDom ){

  var apiApp = appDom.data('app');

  console.log('añado');
  apiApp.purchase(function(){

    console.log(arguments);
    //apiApp.install

  });

}

var loadAppList = function(){

  var appList = [];
  var categoryId = 2; //bookmarks

  api.store.listApps( categoryId, function( error, list ){

    if( error ){
      alert(error);
      return;
    }

    list.forEach( function( storeApp ){

      var app = appPrototype.clone();
      console.log(storeApp);

      app
      .removeClass( 'wz-prototype' )
      .addClass( 'appDom-' + storeApp.id )
      .data( 'app', storeApp );

      if( storeApp.installed ){
        app.addClass( 'installed' );
      }

      app.find( '.bookmark-name' ).text( storeApp.name );
      app.find( '.bookmark-button span' ).text( lang.addApp );
      app.find( '.bookmark-logo' ).css('background-image', 'url("https://static.horbito.com/app/' + storeApp.id + '/launchpad.png")');

      appList.push( app );

    })

    showListDom( appList );

  });

}

var orderAppList = function( list ){}

var removeApp = function( appDom ){

  var apiApp = appDom.data('app');
  console.log('borro');

  apiApp.uninstall(function(){

    console.log(arguments);
    //apiApp.install

  });

}

var showListDom = function( list ){
  $( '.ui-elements' ).append( list );
}

loadAppList();

/*

$( '.content-subject-text input' ).focus();

win.on( 'click', '.content-button', function(){

    if( $( '.content-subject-text input' ).val() && $( '.content-description-text' ).val() ){

        api.feedback( $( '.content-subject-text input' ).val(), $( '.content-description-text' ).val(), function( error ){

            if( error ){
                console.log( error );
            }

        });

        api.banner()
            .setTitle( lang.bannerTitle )
            .setText( lang.bannerDescription )
            .setIcon( 'https://static.inevio.com/app/9/icon.png' )
            .render();

        api.view.remove();

    }else{

        if( !$( '.content-subject-text input' ).val() && !$( '.content-description-text' ).val() ){
            alert( lang.errorTotal );
        }else if( !$( '.content-subject-text input' ).val() ){
            alert( lang.errorSubject );
        }else{
            alert( lang.errorDescription );
        }

    }

});

win.css({'border-radius'    : '6px',
         'background-color' : '#2c3238'
});

$( '.app-title' ).text( lang.appTitle );
$( '.content-subject-text input' ).attr( 'placeholder' , lang.typehere);
$( '.content-description-text' ).attr( 'placeholder' , lang.typehere);
$( '.contact-info' ).text( lang.contactInfo );
$( '.contact-subject' ).text( lang.contactSubject );
$( '.contact-description' ).text( lang.contactDescription );
$( '.content-button span' ).text( lang.contactSend );

searchWorldCard.on( 'input' , function(){

  searchWorldQuery = searchWorldQuery + 1;
  var searchWorldQueryCopy = searchWorldQuery;
  filterWorldCards( $( this ).val() , searchWorldQueryCopy );

});

var filterWorldCards = function( filter , searchWorldQueryCopy ){

  var worldCards = $( '.world-card' );

  if ( filter === '' ) {

    worldCards.show();
    return;

  }

  wz.cosmos.list( filter , null , {from:0 , to:1000} , function( e , worlds ){

    // Query desfasada
    if ( searchWorldQuery != searchWorldQueryCopy ) {
      return;
    }

    worldCards.hide();

    $.each( worlds , function( i , world ){

      $( '.world-card-' + world.id ).show();

    });


  });

}

*/
