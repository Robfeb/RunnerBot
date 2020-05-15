//Variables de control Globales
var CurrentTraining={};
var CurrentTrainingPaused=false;
var CurrentUser={};
var CurrentGame={};
var CurrentHistory={};
var CurrentOptions={Milestone:1,Sounds:1,Intro:1,Language:'ES'};
var CurrentLanguage="ES";
var CurrentLngObj=null;
var ControlSetRun=true;
var InitRunPage=false;
var App = (function(lng, undefined) {

    startRun = function(event) {
        //le damos a "empezar" y empezamos a correr ;)
        if(!CurrentTrainingPaused)
        {
            if(CurrentTraining.Id==undefined && ControlSetRun)
                InsertTraining({Usr:CurrentUser.Id,IdGame:CurrentGame.Id,Name:CurrentGame.Name},App.setTraining);
        }
        else{
            getGeoLocation();
        }
        $$("#Runstartbtn").hide();
        $$("#Runpausebtn").show();
        $$("#Runstopbtn").show();
    };
    setTraining= function(training) {
        //establecemos el entrenamoento
        CurrentTraining=training;
        getGeoLocation();
    };
    stopRun= function(event) {
        //pulsamos en parar el entrenamiento
        clearInterval(IntervalTime);
        stopSaveDataTraining();
        $$("#Runstartbtn").show();
        $$("#Runpausebtn").hide();
        $$("#Runstopbtn").hide();
        CurrentTraining={};
        ControlSetRun=true;
    };
    pauseRun= function(event)
    {//pulsamos en pausar
        pausegetGeoLocation();
        CurrentTrainingPaused=true;
        $$("#Runstartbtn").show();
        $$("#Runpausebtn").hide();
        $$("#Runstopbtn").show();
    };
    getConfigList= function(event) {
        //busca las opciones de configuración
        SelectConfigAll(App.showConfigList);

        setHeaderFooter(CurrentLngObj.btnConfig);
    };
    showTraining=function(event)
    {
        //muestra la pantalla de entrenamiento
        if(!CurrentTrainingPaused)
        {
            $$("article#run").html("");
            var template = $$('#TrainningTpl').html();
            var obj={
                GameName:getTxtLang(CurrentGame.Name),
                GameSubtitle:getTxtLang(CurrentGame.Subtitle),
                GameClass:CurrentGame.Image,
                btnStart:CurrentLngObj.btnStart,
                btnPause:CurrentLngObj.btnPause,
                btnStop:CurrentLngObj.btnStop,
                btnChange:CurrentLngObj.btnChange,
                lblTime:CurrentLngObj.lblTime,
                lblRecord:CurrentLngObj.lblRecord,
                lblDistance:CurrentLngObj.lblDistance,
                lblSpeed:CurrentLngObj.lblSpeed,
                lblSpeedPartial:CurrentLngObj.lblSpeedPartial,
                lblRgPointsEarned:CurrentLngObj.lblRgPointsEarned,
                lblCalories:CurrentLngObj.lblCalories
            };
            var html = Mustache.to_html(template, obj);
            $$("article#run").html(html);
            setHeaderFooter(CurrentLngObj.btnTraining);

            $$("#Runstartbtn").show();
            $$("#Runpausebtn").hide();
            $$("#Runstopbtn").hide();
        }
        else{

        }

    };
    showConfigList= function(response) {
        //muestra la lista de configuracion
        var content="<form><ul class='list' id='configlistul'>";
        for (var i = 0; i < response.length; i++)
        {
            eval("CurrentOptions."+  response.item(i).Param +"='"+ response.item(i).ValueSelected+"';");
            content+="<li class='' id='"+response.item(i).Id+"'><strong>"+getTxtLang(response.item(i).Description)+"</strong>";
            switch(response.item(i).Type)
            {
                case 1:
                content+="<label class='checkbox'><input type='checkbox' id='"+response.item(i).Param+"' ";
                if(response.item(i).ValueSelected==1)
                    content+="checked";
                content+="></label>";
                break;
                case 2:
                content+="<select id='"+response.item(i).Param+"' onchange='App.setLanguage(this)' >";
                var values=response.item(i).ValuesOPT;
                var opts=values.split("/");
                for (var j = 0; j < opts.length; j++){
                    var obj=opts[j].split("|");
                    content+="<option value='"+obj[0]+"' ";
                    if(response.item(i).ValueSelected==obj[0])
                        {content+="selected";}
                    content+=" >"+obj[1]+"</option>";
                }
                content+="></select>";
                break;
            }

            content+="</li>";
        }
        content+="</ul></form>";
        $$("article#configlist").html(content);
    };
    setLanguage=function(obj)
    { // establece el idioma
        var objConf=[$$(obj).val(),obj.id];

        UpdateConfigParam(objConf);

        setObjLang($$(obj).val());
        App.setAsideContent();
    };
    getCurrentLang=function(){
        //obtiene el idioma actual
        SelectCurrentLanguage(function(r){
            setObjLang(r.ValueSelected);
            App.setInit();
            App.setAsideContent();
            SayHello();
        }
            );
    };
    setConfig=function(event)
    {
        //establecemos el valor cuando modifican la configuracion
        var value=$$("#"+event.currentTarget.id).val();
        if(event.currentTarget.type=="checkbox")
            value=$$("#"+event.currentTarget.id)[0].checked?"0":"1";

        var objConf=[value,event.currentTarget.id];

        UpdateConfigParam(objConf);
    };
    getGamesList= function(getGamesList) {
        //buscamos los juegos disponibles
        SelectGames(showGamesList);
        setHeaderFooter(CurrentLngObj.btnGames);
    };
    getGame= function(event) {
        //obtiene el juego
        SelectGamesById(event.currentTarget.id,App.showGamesId);
    };
    showGamesId= function(response) {
    //mostramos la definicion del juego seleccionado
        $$("article#gameslist").removeClass("active");
        $$("article#gamesId").addClass("active");
        var template = $$('#GamesIdTpl').html();
        var obj={
            Id:response.Id,
            Name:getTxtLang(response.Name),
            Subtitle:getTxtLang(response.Subtitle),
            Description:getTxtLang(response.Description),
            btnPlay:CurrentLngObj.btnPlay,
            Image:response.Image,
            Difficulty:response.Difficulty,
            Points:response.Points,
            lblRgPoints:CurrentLngObj.lblRgPoints,
            lblDifficulty:CurrentLngObj.lblDifficulty,
            lblDescription:CurrentLngObj.lblDescription,
            btnGames:CurrentLngObj.btnGames,
        };
        var html = Mustache.to_html(template, obj);
        $$("article#gamesId").html(html);
    };
    showGamesList= function(response) {
        //mostramos el listado de juegos
        $$("article#gameslist").addClass("active");
        if($$("ul#gameslistul").length==0)
            $$("article#gameslist").append("<ul class='list' id='gameslistul'></ul>");
        $$("article#gamesId").removeClass("active");
        var template = $$('#GamesListTpl').html();
        var data={data:[]};
        for (var i = 0; i < response.length; i++)
        {
            var obj={
                Id:response.item(i).Id,
                Name:getTxtLang(response.item(i).Name),
                Subtitle:getTxtLang(response.item(i).Subtitle),
                Description:getTxtLang(response.item(i).Description)
            };
            data.data.push(obj);
        }
        var html = Mustache.to_html(template, data);
        $$("ul#gameslistul").html(html);
    };
    getGamesInit= function() {
        //seleccionamos los juegos disponibles
        SelectGames(App.setFirstGame);
    };
    setFirstGame= function(games) {
        //establecemos un juego por defecto (Libre)
        App.setGame(games.item(0));
    };
    setGame= function(game) {
        //establecemos el juego seleccionado
        CurrentGame=game;
    };
    setGameById= function(game) {
        //seleccionamos un juego del listado para jugar
        if(game.currentTarget.id!=2)
        {
            SelectGamesById(game.currentTarget.id,function(game){
                App.setGame(game);
                Lungo.Router.article("main","run");
                $$("article#gamesId").removeClass("active");
            });
        }
        else{
            setActiveView("historylist");
            App.getHistoryList();
        }

    };
    getHistoryList= function(event) {
        //obtenemos el listado de entrenamientos
        SelectTrainigAll(App.showHistoryList);
        setHeaderFooter(CurrentLngObj.btnHistory);
    };
    getShareList= function(event) {
        //establecemos el titulo en la seccion de compratir
        setHeaderFooter(CurrentLngObj.btnShare);
    };
    showHistoryList= function(response) {
        //mostramos la lista del historial
        $$("article#historylist").addClass("active");
        if($$("ul#ulhistorylist").length==0)
        $$("article#historylist").append("<ul class='list' id='ulhistorylist'></ul>");
        $$("article#historyId").removeClass("active");
        var template = $$('#HistoryListTpl').html();
        var data={data:[]};
        for (var i = 0; i < response.length; i++)
        {
            var obj={
                Id:response.item(i).Id,
                Name:getTxtLang(response.item(i).Name),
                Image:response.item(i).Description,
                DateTime:getDate(response.item(i).Date),
                Distance:response.item(i).Distance,
                TimeTotal:TimeFormat(response.item(i).TimeTotal)
            };
            data.data.push(obj);
        }
        var html = Mustache.to_html(template, data);

        $$("ul#ulhistorylist").html(html);
    };
    getHistory= function(event) {
        //buscamos el historico
        SelectTrainigById(event.currentTarget.id,App.showHistoryId);
    };
    showHistoryId= function(response) {
        //mostramos un entrenamiento del historial
        CurrentHistory=response;
        $$("article#historylist").removeClass("active");
        $$("article#historyId").addClass("active");
        var template = $$('#HistoryIdTpl').html();
        var obj={
            Id:response.History.Id,
            Name:getTxtLang(response.History.Name),
            DateTime:getDate(response.History.Date),
            Milestones:response.PosMil.length,
            Geopos:response.Pos.length,
            Image:response.History.Description,
            Distance:response.History.Distance,
            btnPlay:CurrentLngObj.btnPlay +" (" +CurrentLngObj.lblGameTitleShadow+")" ,
            btnHistory:CurrentLngObj.btnHistory,
            btnDelete:CurrentLngObj.btnDelete,
            TimeTotal:TimeFormat(response.History.TimeTotal)
        };
        var html = Mustache.to_html(template, obj);
        $$("article#historyId").html(html);
        ShowGeoMapPositions(response);
    };
    setInit= function() {
        if(!InitRunPage) {
            setActiveView("principal");
            App.setInitLayer();
        }
        else
        {
            setActiveView("run");
            App.showTraining();

        }
    };
    setInitLayer= function() {
        //Muestra la capa inicial
        var template = $$('#PrincipalTpl').html();
        var html = Mustache.to_html(template, CurrentLngObj);
        $$("article#principal").html(html);
        App.setHeaderFooter(CurrentLngObj.Title);
    };
    setAsideContent= function() {
        //establece el menu con una plantilla de mustache en el idioma establecido
        var template = $$('#AsideTpl').html();
        var html = Mustache.to_html(template, CurrentLngObj);
        $$("article#asidePrincipal").html(html);
        Lungo.Aside.show();
    };
    getProfile= function() {
        //obtenemos el perfil
        SelectProfile(App.setUser);
    };
    setUser= function(user) {
        //establece el usuario actual (se deja preparado para poder tener más de uno)
        CurrentUser=user.item(0);
        if(user.item(0).Name!="")
                {InitRunPage=true;}
    };
    setHeaderFooter= function(title) {
        //establecemos el titulo de la cabecera 
        $$("section#main header span.title").html(title);
    };
    getInitConfig= function() {
        //obtenemos la configuracion inicial
        SelectConfigAll(function(rows)
        {
            for (var i = 0; i < rows.length; i++) {
                eval("CurrentOptions."+  rows.item(i).Param +"='"+ rows.item(i).ValueSelected+"';");
            }

        });
    };
    updateUser=function(event){
        //actualizamos el perfil
        var objprofile=[
        $$("#regUsername").val(),
        $$("#regFirstName").val(),
        $$("#regAge").val(),
        $$("#regPeso").val(),
        $$("#regGenero").val(),
        $$("#regRol").val(),
        $$("#regEmail").val(),
        CurrentUser.Id
        ];
        UpdateProfile(objprofile,function(result){
            App.getProfile();
            Lungo.Notification.success(CurrentLngObj.lblDone,CurrentLngObj.msgProfileSucces, 'ok', 2);
            speak(CurrentLngObj.msgProfileSucces);
        });
    };
    viewProfile= function(event) {
        //establece el perfil
        var template = $$('#RegisterTpl').html();
        var html = Mustache.to_html(template, CurrentLngObj);
        $$("article#register").html(html);
        $$("#regUsername").val(CurrentUser.Name);
        $$("#regFirstName").val(CurrentUser.SurName);
        $$("#regPeso").val(""+CurrentUser.Weight);
        $$("#regAge").val(""+CurrentUser.Age);
        $$("#regEmail").val(CurrentUser.Email);
        $$("#regGenero").val(CurrentUser.Gender);
        $$("#regRol").val(CurrentUser.Rol);
        $$("#regPoints").html(CurrentUser.Points);
        $$("#regPointsWin").html(CurrentUser.Win);
        $$("#regPointsLose").html(CurrentUser.Lose);
    };
    getDate=function(obj) {
        //obtiene la fecha con formato DD/MM/YYYY
        try {
            var value=new Date(obj);
            var month=value.getMonth()+1;
            return (value.getDate()<10?'0' +value.getDate():value.getDate())+ "/" + (month<10?'0' +month:month) + "/" + value.getFullYear() + " - " + getHour(value);
        } catch (error) {
            return "-";
        }
    };
    getHour=function (date) {
        //obtiene el formato hora HH:MM:SS
        try {
            return '' + ('0' + ((date.getHours() % 24) || 12)).replace(/.*(\d\d)$/, '$1') + ':' + ('0' + date.getMinutes()).replace(/.*(\d\d)$/, '$1')+ ':' + ('0' + date.getSeconds()).replace(/.*(\d\d)$/, '$1');
        } catch (error) {
            return "-";
        }
    };
    setActiveView=function (view) {
        //establecemos la vista inicial según parametro y eliminamos la vista existente
        var active=$$("article");
        for (var i = 0; i < active.length; i++) {
            if(active[i].id!="asidePrincipal" && active[i].id!="share-list")
                $$(active[i]).html("");
        };
        $$("article").removeClass("active");
        $$("article#"+view).addClass("active");
        $$("#asidePrincipal").addClass("active");
    };
    degreesToRadians=function (degrees) {
        //pasamos de grados a radianes.
        var radians = (degrees * Math.PI)/180;
        return radians;
    };
    getDistance=function (lat1,lon1,lat2,lon2) {
    //calculamos la distancia entre dos puntos geograficos.
    var R = 6371; // curvatura de la tierra en km
    var startLatRads = degreesToRadians(lat1);
    var startLongRads = degreesToRadians(lon1);
    var destLatRads = degreesToRadians(lat2);
    var destLongRads = degreesToRadians(lon2);

    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
    Math.cos(startLatRads) * Math.cos(destLatRads) *
    Math.cos(startLongRads - destLongRads)) * R;
    return distance;
};

return {
    startRun: startRun,
    stopRun: stopRun,
    setTraining: setTraining,
    getGamesList: getGamesList,
    showGamesList: showGamesList,
    getHistoryList: getHistoryList,
    showHistoryList: showHistoryList,
    getHistory: getHistory,
    showHistoryId: showHistoryId,
    getProfile: getProfile,
    setUser: setUser,
    viewProfile: viewProfile,
    updateUser: updateUser,
    getGame: getGame,
    showGamesId: showGamesId,
    getGamesInit: getGamesInit,
    setFirstGame: setFirstGame,
    setGame: setGame,
    getConfigList: getConfigList,
    showConfigList: showConfigList,
    setConfig: setConfig,
    setLanguage: setLanguage,
    getCurrentLang: getCurrentLang,
    setInitLayer: setInitLayer,
    setInit: setInit,
    setAsideContent: setAsideContent,
    getDate: getDate,
    getHour: getHour,
    setHeaderFooter: setHeaderFooter,
    getShareList: getShareList,
    getDistance: getDistance,
    degreesToRadians:degreesToRadians,
    pauseRun: pauseRun,
    showTraining: showTraining,
    setGameById: setGameById,
    setActiveView:setActiveView,
    getInitConfig:getInitConfig
};

})(Lungo);

Lungo.Events.init({
'load article#gameslist': function(event) {
    //mostramos el listado de juegos.
    setActiveView("gameslist");
    App.getGamesList();
},
'tap #gameslistul li':App.getGame,
'tap #dvgame a.selectGame':App.setGameById,
'tap #btnPlayGameHist':function(event) {
    // jugamos a un juego sombra con el historial
    SelectGamesById(2, function(game){
            App.setGame(game);
            setActiveView("run");
            App.showTraining();
        });
},
'tap #btnHistoryBack':function(event) {
    //volvemos a la pantalla de historial
    setActiveView("historylist");
    App.getHistoryList();
},
'tap #btnHistoryDelete':function(event) {
    //eliminamos un entrenamiento
    DeleteTrainigById(CurrentHistory.History.Id,function(response){
    setActiveView("historylist");
    App.getHistoryList();});
},
'tap #dvgame a.chooseGames':function(){
    //volvemos a la pantalla de juegos
    setActiveView("gameslist");
    App.getGamesList();
},
'load article#historylist':function(event) {
    //mostramos el histórico
    setActiveView("historylist");
    App.getHistoryList();
},
'tap #historylist li':App.getHistory,
'load article#register': function(event) {
    //mostramos la pantalla del perfil
    setActiveView("register");
    App.viewProfile();
    setHeaderFooter(CurrentLngObj.btnProfile);
},
'touch #configlist li input':App.setConfig,
'tap #btnSaveProfile':App.updateUser,
'tap #Runstartbtn':App.startRun,
'tap #Runpausebtn':App.pauseRun,
'tap #Runstopbtn':App.stopRun,
'load article#run': function(event) {
    //mostramos la pantalla de entrenar
  setActiveView("run");
  App.showTraining();
},
'load article#configlist': function(event) {
    //mostramos la pantalla de configuracion
    setActiveView("configlist");
    App.getConfigList();
},
'load article#share-list': function(event) {
    //mostramos el menus de compartir
    setActiveView("share-list");
    App.getShareList();
},
'load article#principal': function(event) {
    //mostramos el menú principal
    App.setInit();
},
'tap a[data-view-aside=menuoptions]':function(event) {
    //pulsamos el icono y mostramos el menú lateral
    Lungo.Aside.show();
},
'tap span#btnSound':function(event) {
    //pulsamos el botón para leer los kilometros que llevamos
    var spkm=(DistanceRunning.toFixed(3)+"").replace("."," ")+" "+CurrentLngObj.lblkilometer;
    speak(spkm);
},
});

Lungo.ready(function() {
    //al iniciar el framework de lungo se iniciará la app. (no en phonegap)
    init();
});
var initDone=false;
function initViews()
{
    //inicializamos los elementos de las vistas
    App.getInitConfig();
    App.getGamesInit();
    App.getProfile();
    App.getCurrentLang();
    
    
}

function init()
{
    //inicializamos la aplicación
    if(!initDone){
        Initsqlstorage();
        initDone=true;
    }
}
devidereadyfn= function(event)
{
    //en phonegap recibimos l evento de que ya está disponible el control en la aplicación pata iniciar las vistas
    document.addEventListener("menubutton", menuyourCallbackFunction, false);
    init();
    try{
        //inicializamos el tts
    window.plugins.tts.startup(startupWin, startupFail);
    }catch(error){}
 
};
//para phonegap nos suscribimos al evento que nos indicará si está disponible la app
document.addEventListener("deviceready", devidereadyfn, false);