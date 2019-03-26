var win = $( this );
var app = $( '.ui-window' );
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
  $('.ui-elements').removeClass('only-installed');
  filterApps( $('.ui-header-bottom input').val() );

})

.on( 'click', '.installed-apps:not(.selected)', function(){

  $('.bookmark-tabs .selected').removeClass('selected');
  $(this).addClass('selected');
  $('.ui-elements').addClass('only-installed');
  filterApps( $('.ui-header-bottom input').val() );

})

.on( 'click', '.bookmark-finder .remove', function(){

  $('.ui-header-bottom input').val('');
  filterApps('');

})

.on( 'click', '.add-own-apps a', function(){
  app.addClass( 'addNewApp' );
})

.on( 'click', '.add-apps', function(){
  app.removeClass( 'addNewApp' );
})

.on( 'click', '.add-apps-content', function(e){
  e.stopPropagation();
})

.on( 'click', '.add-apps-close', function(){
  app.removeClass( 'addNewApp' );
})

.on( 'click', '.add-apps-link', function(){
  api.app.openApp( 312 );
})

.on( 'input', '.ui-header-bottom input', function(){
  filterApps( $( this ).val() );
});

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

//FUNCIONES
var addApp = function( appDom ){

  var apiApp = appDom.data('app');
  console.log('añado', apiApp);

  if( !apiApp.purchased ){

    apiApp.purchase(function(){
      console.log(arguments);

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

var filterApps = function( filter ){

  var apps;

  if( $('.ui-elements').hasClass('only-installed') ){
    apps = $( '.appDom.installed' );
  }else{
    apps = $( '.appDom' );
  }

  apps.removeClass('hidden');
  var appsToShow = apps.filter( startsWithApps( filter ) );
  var appsNotToShow = apps.not( appsToShow );
  appsNotToShow.addClass('hidden');

  console.log( appsToShow )
  console.log( appsToShow.length )
  if( appsToShow.length ){
    app.removeClass( 'noAppResults' )
  }else{
    app.addClass( 'noAppResults' )
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

    list = orderAppList(list);

    list.forEach( function( storeApp ){

      var app = appPrototype.clone();

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
    translateApps();

  });

}

var orderAppList = function( list ){

  return list.sort(function(a, b){

   var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
   if (nameA < nameB) //sort string ascending
    return -1;
   if (nameA > nameB)
    return 1;
   return 0; //default return value (no sorting)

  });

}

var removeApp = function( appDom ){

  var apiApp = appDom.data('app');
  console.log('borro', apiApp);

  apiApp.uninstall(function(){

    console.log(arguments);
    //apiApp.install

  });

}

var showListDom = function( list ){
  $( '.ui-elements' ).append( list );
}

var startApp = function(){

  loadAppList();
  translateUI();

}

var startsWithApps = function( wordToCompare ){

  return function( index , element ) {

    return $( element ).find( '.bookmark-name' ).text().toLowerCase().indexOf( wordToCompare.toLowerCase() ) !== -1;

  }

}

var translateApps = function(){

  $('.bookmark-button-uninstall .added').text( lang.addedApp );
  $('.bookmark-button-uninstall .delete').text( lang.removeApp );

}

var translateUI = function(){

  $('.all-apps span').text( lang.allApps );
  $('.installed-apps span').text( lang.installedApps );
  $('.app-title').text( lang.appTitle );
  $('.ui-header-bottom input').attr('placeholder', lang.search);

  $( '.add-own-apps .bookmark-name' ).text( lang.addApps )
  $( '.add-own-apps a' ).text( lang.learnHow + ' →' )

  $( '.no-results .no-results-title' ).text( lang.noResults )
  $( '.no-results .no-results-description' ).text( lang.dontWorry )
  $( '.no-results .add-apps-link' ).text( lang.vintageBrowser + ' →' )

  $( '.add-apps .add-apps-title' ).html( lang.ownApps )
  $( '.add-apps .add-apps-description' ).text( lang.createApp )
  $( '.add-apps .add-apps-link' ).text( lang.vintageBrowser + ' →' )

}

startApp();
