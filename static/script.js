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


  if( !apiApp.purchased ){

    apiApp.purchase(function(){

      apiApp.install(function(){
        console.log(arguments);
      });

    });

  }else{

    apiApp.install(function(){
      console.log(arguments);
    });

  }

}

var loadAppList = function(){

  var appList = [];
  var categoryId = 2; //bookmarks

  api.store.listApps( categoryId, function( error, list ){

    if( error ){
      alert(error);
      return;
    }

    console.log(list);

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

api.store.on( 'appInstalled', function(store){

  console.log('evento install');
  console.log(store);
  $('.appDom-' + store.id).addClass('installed').data('app', store);

})

.on( 'appUninstalled', function(store){

  console.log('evento uninstall');
  console.log(store);
  $('.appDom-' + store.id).removeClass('installed').data('app', store);

});

loadAppList();
