//variables de control general
var watchProcess=null;
var LastGeoPos=null;
var TimeRunning=0;
var DistanceRunning=0;
var IntervalTime=null;
var KilometersMilestone=[];
var playingGameWithActions={};
var map ;
var infowindow;
var locations = [];
var advisors=[];
//cuando pausemos un entrenamiento
function pausegetGeoLocation(){
    CurrentTrainingPaused=true;
    stop_watchlocation();
    clearInterval(IntervalTime);
}
//iniciamos o continuamos tras una pausa el entrenamiento.Inicializamos.
function getGeoLocation(){
    if(!CurrentTrainingPaused)
    {
        $$("#ulGameInfo").html("");
        TimeRunning=0;
        advisors=[];
        KilometersMilestone=[];
        clearInterval(IntervalTime);
        playingGameWithActions={};
        $$("#txtSpeedGlobal").html("");
        $$("#txtSpeedPartial").html("");
        $$("#txtDistance").html("");
        $$("#txtTime").html("");
        $$("#txtCalories").html("");
    }
    else
        CurrentTrainingPaused=false;
    
    stop_watchlocation();
    if (navigator.geolocation) {
        LastGeoPos=null;
        //realizamos un intervalo para capturar la posición del usuario.
        watchProcess=navigator.geolocation.watchPosition(setDataGeo,onError,{enableHighAccuracy: true,maximumAge: 10000, timeout: 10000});
        IntervalTime = setInterval("TimeRuns()",1000);
    } else {
        Lungo.Notification.error(CurrentLngObj.txtnogeo, CurrentLngObj.error);
    }
}
//por cada posición recibida establecemos un protocolo de actuación.
function setDataGeo(pos){
    var objGeo;
    if(LastGeoPos==null)
    {// si es la primera vez que cargamos la posición
        objGeo=[CurrentTraining.Id ,""+pos.coords.latitude+"" ,""+pos.coords.longitude +"",0 ,pos.coords.speed ,pos.coords.altitude ,new Date() ,0 ,0];
        InsertGeoPos(objGeo);
    }
    else
    {
        if(LastGeoPos.coords.latitude!=pos.coords.latitude && LastGeoPos.coords.longitude!=pos.coords.longitude)
        { // si la posición es la misma que la anterior no sumamos distancia

            //calculamos la distancia entre puntos. en kilometros
            var distanceCal=getDistance(LastGeoPos.coords.latitude,LastGeoPos.coords.longitude, pos.coords.latitude,pos.coords.longitude);
            DistanceRunning+=distanceCal;
            var calculateDis=DistanceRunning;

            $$("#txtDistance").html(calculateDis.toFixed(3) +" km");
            
            var milestone=0;
            if(parseInt(calculateDis)>KilometersMilestone.length && parseInt(calculateDis)>=1)
            { // añadimos sólo cuando se van logrando kilometros.
                milestone=1;
                KilometersMilestone.push({});
            }
            objGeo=[CurrentTraining.Id ,""+pos.coords.latitude+"" ,""+pos.coords.longitude +"",0 ,pos.coords.speed ,pos.coords.altitude ,new Date() ,milestone ,calculateDis];
            //obtenemos los minutos por kilometro.
            var kmperMin=getKmperMin(calculateDis);

            if(milestone)
            {
                KilometersMilestone[KilometersMilestone.length-1]=objGeo;
                if(CurrentOptions.Milestone=="1")
                {
                    //En el caso de un hito kilometrico lanzamos una locución.
                    var spkm=KilometersMilestone.length+" "+CurrentLngObj.lblkilometer + " "+CurrentLngObj.lblSpeed+" " +kmperMin.TimeGlobal.toFixed(2);
                    speak(spkm);
                }
            }
            $$("#txtSpeedGlobal").html(kmperMin.TimeGlobal.toFixed(2) + " min/km");
            $$("#txtSpeedPartial").html(isNaN(kmperMin.TimeperKm.toFixed(2))?kmperMin.TimeGlobal.toFixed(2)+" min/km":kmperMin.TimeperKm.toFixed(2) +" min/km");
            //Insertamos posicion
            InsertGeoPos(objGeo);
            //establecemos las calorias
            setCalories();
            //control de juegos.
            PlayingGame(pos,kmperMin);
        }
    }
    LastGeoPos=pos;
}
function setCalories()
{
    $$("#txtCalories").html(getCalories());
}
// en funcion de la distancia,el rol y el peso se establecen las calorias gastadas
function getCalories()
{
 var weight = parseInt(CurrentUser.Weight);
 var minutes = getTimeinMin(TimeRunning);
 var level;
 var rol=CurrentUser.Rol;
 if (rol==1)
 {
    level = .102;
}
if (rol==2)
{
    level = .142;
}
if (rol==0)
{
    level = .048;
}
var aux_calories = (weight*2.2)*minutes*level;
aux_calories = Math.round(aux_calories*10)/10;
return aux_calories;
}
//se obtiene la distancia en minutos por kilometro.
function getKmperMin(distance)
{
    var Time={
        TimeGlobal:0,
        TimeperKm:0};
        var ctime=getTimeinMin(TimeRunning);
        Time.TimeGlobal=ctime/distance;
        Time.TimeperKm=Time.TimeGlobal;
        if(KilometersMilestone.length>0)
        {
          var laskm=KilometersMilestone[KilometersMilestone.length-1];
          var kmSincelastKm=distance-laskm[8];
          var timeSincelastKm=new Date(laskm[6]);
          var now=new Date();
          var time=now.getTime()-timeSincelastKm.getTime();
           // Time.TimeperKm=((1/((pos.coords.speed/1000)/0,01666666666667))*1000000000000);
           if(kmSincelastKm!=0)
            Time.TimeperKm=getTimeinMin(time/1000)/kmSincelastKm;
    }
    return Time;
}
//obtiene el tiempo global en minutos.
    function getTimeinMin(timeinSeconds)
    {
        var t=getTimeobj(timeinSeconds);
        return  (((t.hours*60)+t.minutes)+"."+t.seconds)*1;

    }
    //obtenemos un objeto con formato tiempo dado un objeto datetime
    function getTimeobj(time)
    {
        var hours = 0; var minutes = 0;var seconds = 0;
        var time_temp = 0.0;

        time_temp = time/3600;
        hours = Math.floor(time_temp);
        time_temp = time_temp - hours;
        time_temp = time_temp*60;
        minutes = Math.floor(time_temp);
        time_temp = (time_temp - minutes)*60;
        seconds = Math.floor(time_temp);

        return {hours:hours,minutes:minutes,seconds:seconds};
    }
    //incrementamos el tiempo que va pasando
    function TimeRuns()
    {
        TimeRunning++;
        $$("#txtTime").html(TimeFormat(TimeRunning));
    }
    // devuelve un string con elformato de tiempo en hh:mm:ss
    function TimeFormat(time)
    {
        var t=getTimeobj(time);
        var h = (t.hours < 10) ? "0" + t.hours : t.hours;
        var m = (t.minutes < 10) ? "0" + t.minutes : t.minutes;
        var s = (t.seconds < 10) ? "0" + t.seconds : t.seconds;

        return h+":"+m+":"+s;
    }
    // en caso de error mostramos un aviso.
    function onError(e) {
        if(e.code == 1) {
            Lungo.Notification.error(CurrentLngObj.errgeoDenied, 'error');
         }else if( e.code == 2) {
            Lungo.Notification.error(CurrentLngObj.errgeoPos, 'error');
         }else if( e.code == 3) {
            Lungo.Notification.error(CurrentLngObj.errgeoTimeout, 'error');
         }
        
    }
    //detenemos el intervalo
    function stop_watchlocation(){
        if(watchProcess!= null)
        {
            navigator.geolocation.clearWatch(watchProcess);
            watchProcess = null;
            clearInterval(IntervalTime);
        }
    }
    //paramos el entrenamiento y guardamos resultados.
    function stopSaveDataTraining(){
        if(DistanceRunning){
            var Reached=true;
            var cal=getCalories();
            var PointsLose=0;
            var PointsWin=CurrentGame.Points;
            var times=getKmperMin(DistanceRunning);
            var objData=[CurrentGame.Image, TimeRunning,times.TimeGlobal,PointsWin,PointsLose,Reached,cal,DistanceRunning.toFixed(3), CurrentTraining.Id];
            stop_watchlocation();
            UpdateTraining(objData);
            UpdateProfileTraining([CurrentUser.Points+PointsWin,PointsWin,PointsLose,CurrentUser.Id]);
        }
        DistanceRunning=0;
        
    }
// control del juego
    function PlayingGame(pos,kmtime)
    {
        var h=getTimeobj(TimeRunning);
        if(CurrentGame.Id==1)
            GameFree(pos,kmtime,h);
       /* else if(CurrentGame.Id==1)
            GameRescue(pos,kmtime,h);
        else if(CurrentGame.Id==2)
            GameZoo(pos,kmtime,h);
        */else if(CurrentGame.Id==2)
        GameShadow(pos,kmtime,h);
        else if(CurrentGame.Id==3 )
            GameVirus(pos,kmtime,h);
    }
//caso juego libre
    function GameFree(pos,kmtime,h){
        var Notfound=true;
        for (var i = 0; i < advisors.length; i++) {
           if(h.minutes==advisors[i])
            Notfound=false;
        };
    if(h.minutes%5==0 && Notfound)
    {
        speak(RandomSentence());
        advisors.push(h.minutes);
    }
}
//juegos no oprativos
function GameRescue(pos,kmtime){}
function GameZoo(pos,kmtime){}
//muestra la información por kilometro del juego previamente seleccionado
//no dio tiempo a finalizarlo. :'(
function GameShadow(pos,kmtime,h){

    if($$("#ulGameInfo").html()==""){
        var lastpoint=CurrentHistory.Pos.item(0);
        $$("#ulGameInfo").html("<ul class=''><li class='indented'>"+CurrentLngObj.lblGameSubTitleShadow+"</li></ul>");
        for (i = 0; i < CurrentHistory.PosMil.length; i++) {
            var RealTime=getRealTime(new Date(lastpoint.Time),new Date(CurrentHistory.PosMil.item(i).Time));
            var objhtml=RealTime+" <span class='fright'>"+ (CurrentHistory.PosMil.item(i).Distance.length>6?(CurrentHistory.PosMil.item(i).Distance*1).toFixed(3):CurrentHistory.PosMil.item(i).Distance) +" km</span>" ;
            advisors.push({Time:RealTime,Done:false,Reached:false});
            $$("#ulGameInfo ul").append("<li><a>"+objhtml+"</a></li>");
            lastpoint=CurrentHistory.PosMil.item(i);
        }
    }
    else {
        /*if(KilometersMilestone.length>0)
        {
            var ad=-1;
            for (var i = 0; i < advisors.length; i++) {
                if(!advisors[i].Done)
                    {
                        ad=i;
                        break;
                    }
            };
            if(ad>-1 && KilometersMilestone.length==ad)
                {
                    if(advisors[ad].Time)
                    advisors[ad].Reached=true;
                    advisors[ad].Done=true;
                }
        }*/
    }
}
//establece unos intervalos cada 5 minutos para que el usuario 
//corra a la velocidad que indica de manera aleatoria.
function GameVirus(pos,kmtime,h){

    if(advisors.length==0)
        for (var i = 0; i < 10; i++) {
          var variable=6;
          if(i>5)
            variable=10;
          var cond=variable-i;
          var id=Math.floor((Math.random()*4)+cond);
          advisors.push({speed:id,adviced:false});
        };
    if((h.minutes>=0 && h.minutes<=5) && !advisors[0].adviced)
    {
        advisors[0].adviced=true;
        speak(CurrentLngObj.txtGameVirus+" "+ advisors[0].speed);
    }
    else if((h.minutes>5 && h.minutes<=10) && !advisors[1].adviced)
    {
        advisors[1].adviced=true;
        speak(CurrentLngObj.txtGameVirus+" "+ advisors[1].speed);
    }
    else if((h.minutes>10 && h.minutes<=15) && !advisors[2].adviced)
    {
        advisors[2].adviced=true;
        speak(CurrentLngObj.txtGameVirus+" "+ advisors[2].speed);
    }
    else if((h.minutes>15 && h.minutes<=20) && !advisors[3].adviced)
    {
        advisors[3].adviced=true;
        speak(CurrentLngObj.txtGameVirus+" "+ advisors[3].speed);
    }
    else if((h.minutes>20 && h.minutes<=25) && !advisors[4].adviced)
    {
        advisors[4].adviced=true;
        speak(CurrentLngObj.txtGameVirus+" "+ advisors[4].speed);
    }
    else if((h.minutes>25 && h.minutes<=30) && !advisors[5].adviced)
    {
        advisors[5].adviced=true;
        speak(CurrentLngObj.txtGameVirus+" "+ advisors[5].speed);
    }
    else if((h.minutes>30 && h.minutes<=35) && !advisors[6].adviced)
    {
        advisors[6].adviced=true;
        speak(CurrentLngObj.txtGameVirus+" "+ advisors[6].speed);
    }
    else if((h.minutes>35 && h.minutes<=40) && !advisors[7].adviced)
    {
        advisors[7].adviced=true;
        speak(CurrentLngObj.txtGameVirus+" "+ advisors[7].speed);
    }
    else if((h.minutes>40 && h.minutes<=45) && !advisors[8].adviced)
    {
        advisors[8].adviced=true;
        speak(CurrentLngObj.txtGameVirus+" "+ advisors[8].speed);
    }
    else if((h.minutes>45) && !advisors[9].adviced)
    {
        advisors[9].adviced=true;
        speak(CurrentLngObj.txtGameVirus+" "+ advisors[9].speed);
    }
}
//obtiene la diferencia de tiempo entre dos fechas.
function getRealTime(oDate1,oDate2)
{
    var t=oDate2.getTime()-oDate1.getTime();
    return TimeFormat(t/1000);
}

// para la pantalla de histórico muestra un mapa con las posiciones
function ShowGeoMapPositions(response)
{
       // try{
        locations = []; 
        var Positions=response.Pos;
        var Milestones=response.PosMil;
        var lat=0;
        var lng=0;
        var startico="http://maps.google.com/mapfiles/dd-start.png";
        var endico="http://maps.google.com/mapfiles/dd-end.png";
        var stdico="http://maps.google.com/mapfiles/marker_orange.png";
        
        locations.push([Positions.item(0).Lat,Positions.item(0).Long,startico,Positions.item(0).Distance,Positions.item(0).Time,Positions.item(0).Velocity]);
        if(Milestones.length>0){
            lat=Milestones.item(0).Lat;
            lng=Milestones.item(0).Long;
            for (var i = 0; i < Milestones.length; i++) {
                var ico="http://maps.google.com/mapfiles/marker_yellow"+((i%9)+1)+".png";
                locations.push([Milestones.item(i).Lat,Milestones.item(i).Long,ico,Milestones.item(i).Distance,Milestones.item(i).Time,Milestones.item(i).Velocity]);
            };
        }
        else
        {
            lat=Positions.item(0).Lat;
            lng=Positions.item(0).Long;
        }
        
        locations.push([Positions.item(Positions.length-1).Lat,Positions.item(Positions.length-1).Long,endico,Positions.item(Positions.length-1).Distance,Positions.item(Positions.length-1).Time,Positions.item(Positions.length-1).Velocity]);
        
        /*for (var i=0; i < Positions.length; i++){
            locations.push([Positions.item(i).Lat,Positions.item(i).Long,stdico,Positions.item(i).Distance,Positions.item(i).Time,Positions.item(i).Velocity]);
        };*/

        map = new google.maps.Map(document.getElementById('mapholder'), {
          zoom: 12,
          center: new google.maps.LatLng(lat, lng),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
            },
            panControl: true,
            panControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            scaleControl: true,
            scaleControlOptions: {
                position: google.maps.ControlPosition.TOP_LEFT
            }
    });

        infowindow = new google.maps.InfoWindow();

        var marker, i;
        var lastpoint=null;
        var isnotReset=true;
        for (i = 0; i < locations.length; i++) {
            if(lastpoint==null )
            {
                lastpoint=locations[i];
            }
            var RealTime=getRealTime(new Date(lastpoint[4]),new Date(locations[i][4]));
            var objhtml="<img src='"+locations[i][2]+"' style='margin-right:10px'/>"+getHour(new Date(locations[i][4]))+"  ("+RealTime+ ")<span class='fright'>"+ (locations[i][3].length>6?(locations[i][3]*1).toFixed(3):locations[i][3]) +" km</span>" ;
            $$("#dvSummaryHistory").append("<li><a>"+objhtml+"</a></li>");
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][0], locations[i][1]),
                map: map,
                icon: locations[i][2],
                info: new google.maps.InfoWindow({
                    content: locations[i][3]
                })
            });
            lastpoint=locations[i];

      /*google.maps.event.addListener(marker, 'click', function() {
            marker.info.open(map, marker);
        });*/
}
    //}catch(error){}
}