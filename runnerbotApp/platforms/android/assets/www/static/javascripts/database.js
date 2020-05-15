/*********Control SQL*******/
var RunBotdb = {};
RunBotdb.db = null;
//control para crear/abrir la base de datos
RunBotdb.open = function(options) {
    if (typeof openDatabase == "undefined") return;
    var options = options || {};
    options.name = options.name || 'noname';
    options.mb = options.mb || (5 * 1024 * 1024);
    options.description = options.description || 'no description';
    options.version = options.version || '1.0';
    var dbSize = options.mb ;
    try{
        RunBotdb.db = openDatabase(options.name, options.version, options.description, dbSize);

    }catch(e)
    {
        Lungo.Notification.error("Error",e,'remove',2);
    }
};
// Ejecutaremos las consultas mediante el metodo ExecuteSql
RunBotdb.executeSql = function(sql, data, onSuccess, onError){
    if (!RunBotdb.db) return;
    RunBotdb.db.transaction(function(tx){tx.executeSql(sql, data,onSuccess,onError);});
};
//inicializamos la bbdd
function Initsqlstorage()
{
    var opt = {
        name: "RunnerBotApp",
        mb: 102400,
        description: 'App DB RunnerBotApp',
        version: "1.0"
    };
    RunBotdb.open(opt);
    RunBotdb.executeSql("Select * from Config", [],
        function(tx, r){
            if(r.rows.length==0)
               InitsqlstorageQuerys();
           else
               initViews();
       },
       function(tx, e){
        InitsqlstorageQuerys();
    });
}
//definimos las tablas y los inserts por defecto
function InitsqlstorageQuerys()
{
var Profiledb="CREATE TABLE IF NOT EXISTS Profile (Id INTEGER PRIMARY KEY ASC,Name TEXT,SurName TEXT,Age INTEGER,Weight INTEGER,Gender TEXT,Rol TEXT,Email TEXT,Points INTEGER,Win INTEGER,Lose INTEGER)";
var ProfileData='INSERT INTO Profile (Name,SurName,Age,Weight,Gender,Rol,Email,Points,Win,Lose) VALUES ("","",0,60,"","0","",1000,1000,0)';
//var Socialdb="CREATE TABLE IF NOT EXISTS SocialMedia (Id INTEGER PRIMARY KEY ASC,Comment TEXT,Social TEXT,Date DATETIME,IdTraining INTEGER)";
var Trainingdb="CREATE TABLE IF NOT EXISTS Training (Id INTEGER PRIMARY KEY ASC,IdUser INTEGER, Date DATETIME,IdGame INTEGER,Name TEXT,Description INTEGER, TimeTotal TEXT,TimeAVG REAL,TimeKm REAL,TimeBest REAL,PointsWin INTEGER,PointsLose INTEGER,Reached INTEGER,Calories INTEGER,Distance REAL)";
var GeoPosdb="CREATE TABLE IF NOT EXISTS Geopos (Id INTEGER PRIMARY KEY ASC,IdTraining INTEGER,Lat TEXT,Long TEXT,VelAVG INTEGER,Velocity INTEGER,Height INTEGER,Time DATETIME,Milestone INTEGER,Distance TEXT)";
var Configdb="CREATE TABLE IF NOT EXISTS Config (Id INTEGER PRIMARY KEY ASC,Param TEXT,Description TEXT,Type INTEGER,ValuesOPT TEXT,ValueSelected TEXT,OrderOPT INTEGER)";
var ConfigData=[
'INSERT INTO Config (Param,Description,Type,ValuesOPT,ValueSelected,OrderOPT) VALUES ("Milestone","lblConfigKm",1,"1/0",1,0)',
'INSERT INTO Config (Param,Description,Type,ValuesOPT,ValueSelected,OrderOPT) VALUES ("Sounds","lblConfigSounds",1,"1/0",1,1)',
//'INSERT INTO Config (Param,Description,Type,ValuesOPT,ValueSelected,OrderOPT) VALUES ("Intro","lblConfigIntro",1,"1/0",1,2)',
'INSERT INTO Config (Param,Description,Type,ValuesOPT,ValueSelected,OrderOPT) VALUES ("Language","lblConfigLang",2,"ES|ESPAÑOL/CA|CATALAN/EN_GB|ENGLISH","ES",3)'
];

var Gamesdb="CREATE TABLE IF NOT EXISTS Games (Id INTEGER PRIMARY KEY ASC,Name TEXT,Subtitle TEXT,Description TEXT,Points INTEGER,Duration INTEGER,Difficulty INTEGER, Image TEXT)";
var GamesData=[
'INSERT INTO Games (Name,Subtitle,Description,Points,Duration,Difficulty,Image) VALUES ("lblGameTitleFree","lblGameSubTitleFree","lblGameDescFree",500,0,0,"Free")',
//'INSERT INTO Games (Name,Subtitle,Description,Points,Duration,Difficulty,Image) VALUES ("lblGameTitleRescue","lblGameSubTitleRescue","lblGameDescRescue",700,30,1,"/hostage.jpg")',
//'INSERT INTO Games (Name,Subtitle,Description,Points,Duration,Difficulty,Image) VALUES ("lblGameTitleZoo","lblGameSubTitleZoo","lblGameDescZoo",800,30,1,"Zoo")',
'INSERT INTO Games (Name,Subtitle,Description,Points,Duration,Difficulty,Image) VALUES ("lblGameTitleShadow","lblGameSubTitleShadow","lblGameDescShadow",1500,0,2,"Shadow")',
'INSERT INTO Games (Name,Subtitle,Description,Points,Duration,Difficulty,Image) VALUES ("lblGameTitleVirus","lblGameSubTitleVirus","lblGameDescVirus",1000,45,3,"Virus")',
];

var totaldbcreated=0;
RunBotdb.executeSql(Profiledb, [],
    function(tx, r){
        totaldbcreated++;
    },
    function(tx, e){
        Lungo.Notification.error(e.message, 'remove');
    });
/*RunBotdb.executeSql(Socialdb, [],
    function(tx, r){
        totaldbcreated++;
    },
    function(tx, e){
        Lungo.Notification.error(e.message, 'remove');
    });*/
RunBotdb.executeSql(Trainingdb, [],
    function(tx, r){
        totaldbcreated++;
    },
    function(tx, e){
        Lungo.Notification.error(e.message, 'remove');
    });
RunBotdb.executeSql(GeoPosdb, [],
    function(tx, r){
        totaldbcreated++;
    },
    function(tx, e){
        Lungo.Notification.error(e.message, 'remove');
    });
RunBotdb.executeSql(Configdb, [],
    function(tx, r){
        totaldbcreated++;
    },
    function(tx, e){
        Lungo.Notification.error(e.message, 'remove');
    });
RunBotdb.executeSql(Gamesdb, [],
    function(tx, r){
        totaldbcreated++;
    },
    function(tx, e){
        Lungo.Notification.error(e.message, 'remove');
    });
RunBotdb.executeSql("Select * from Config", [],
    function(tx, r){
        if(r.rows.length==0)
            for (var i = 0; i <ConfigData.length ; i++) {
            RunBotdb.executeSql(ConfigData[i], [],
                function(tx, r){
                },
                function(tx, e){
                    Lungo.Notification.error(e.message, 'remove');
                });
        }
    },
    function(tx, e){
        Lungo.Notification.error(e.message, 'remove');
    });
RunBotdb.executeSql("Select * from Games", [],
    function(tx, r){
        if(r.rows.length==0)
            for (var i = 0; i <GamesData.length ; i++) {
            RunBotdb.executeSql(GamesData[i], [],
                function(tx, r){
                },
                function(tx, e){
                    Lungo.Notification.error(e.message, 'remove');
                });
        }
    },
    function(tx, e){
        Lungo.Notification.error(e.message, 'remove');
    });
RunBotdb.executeSql("Select * from Profile", [],
    function(tx, r){
        if(r.rows.length==0)
            RunBotdb.executeSql(ProfileData, [],
                function(tx, r){
                    initViews();
                },
                function(tx, e){
                    Lungo.Notification.error(e.message);
                });
    },
    function(tx, e){
        Lungo.Notification.error(e.message);
    });

}
//insertamos cada posicion del gps
function InsertGeoPos(ObjGeo)
{
    RunBotdb.executeSql('INSERT INTO Geopos (IdTraining ,Lat ,Long ,VelAVG ,Velocity ,Height ,Time ,Milestone ,Distance ) VALUES (?,?,?,?,?,?,?,?,?)', ObjGeo,
        function(tx, r){
        },
        function(tx, e){
            Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
        });
}
//recogemos las posiciones de un entrenamiento que sean hitos kilometricos
function SelectGeoPosByIdTrMi(ObjTr,callbackfn)
{
RunBotdb.executeSql('SELECT * FROM Geopos Where IdTraining=? and Milestone=1', [ObjTr],
    function(tx, r){
        callbackfn(r.rows);
    },
    function(tx, e){
        Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
    });
}
//seleccionamos las posiciones de un entrenamiento.
function SelectGeoPosByIdTr(ObjTr,callbackfn)
{
RunBotdb.executeSql('SELECT * FROM Geopos Where IdTraining=?', [ObjTr],
    function(tx, r){
        callbackfn(r.rows);
    },
    function(tx, e){
        Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
    });
}
//creamos un entrenamiento y devolvemos el objeto creado
function InsertTraining(ObjTraining,callbackfn)
{
    ControlSetRun=false;
    var ObjInsTr=[ObjTraining.Usr,new Date(),ObjTraining.IdGame,ObjTraining.Name];
RunBotdb.executeSql('INSERT INTO Training (IdUser, Date,IdGame,Name) VALUES (?,?,?,?)', ObjInsTr,
    function(tx, r){
        RunBotdb.executeSql('SELECT * FROM Training ORDER BY Id Desc', [],
            function(txs, rs){
               if(rs.rows.length>0)
                callbackfn(rs.rows.item(0));
            else
                Lungo.Notification.error("Error","InsertTraining",'remove',2);
        },
        function(txs, es){
            Lungo.Notification.error(CurrentLngObj.Error+" "+es.message);
        });
    },
    function(tx, e){
        Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
    });
}
// actualizamos el entrenamiento al finalizarlo
function UpdateTraining(ObjUpdTra)
{
RunBotdb.executeSql('UPDATE Training SET Description=?, TimeTotal=?,TimeAVG=?,PointsWin=?,PointsLose=?,Reached=?,Calories=?,Distance=? WHERE Id=?', ObjUpdTra,
    function(tx, r){
    },
    function(tx, e){
        Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
    });

}
//listado de historico de entrenamientos
function SelectTrainigAll(callbackfn)
{
RunBotdb.executeSql('SELECT * FROM Training ORDER BY Id Desc', [],
    function(tx, r){
        callbackfn(r.rows);
    },
    function(tx, e){
        Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
    });
}
//eliminamos un entrenamiento
function DeleteTrainigById(ObjTr,callbackfn)
{
RunBotdb.executeSql('Delete from Geopos Where IdTraining=?', [ObjTr],
    function(tx, r){
            RunBotdb.executeSql('Delete from Training Where Id=?', [ObjTr],
            function(tx,rx){
                speak(CurrentLngObj.lblChangeDone);
                callbackfn(true);
            },function(tx, e){
        Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
        });
    },
    function(tx, e){
        Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
    });
}
//Seleccionamos un entrenamiento pod identificador
function SelectTrainigById(ObjTr,callbackfn)
{
    var objReturn={History:{},Pos:[],PosMil:[]};
RunBotdb.executeSql('SELECT * FROM Training Where Id=?', [ObjTr],
    function(tx, r){
        objReturn.History=r.rows.item(0);
        SelectGeoPosByIdTr(ObjTr,
            function(rx){
                objReturn.Pos=rx;
                SelectGeoPosByIdTrMi(ObjTr,
                    function(rx){
                        objReturn.PosMil=rx;
                        callbackfn(objReturn);
                    });
            });
    },
    function(tx, e){
        Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
    });
}
//listado de juegos disponibles
function SelectGames(callbackfn)
{
RunBotdb.executeSql('SELECT * FROM Games ORDER BY Difficulty', [],
    function(tx, r){
        callbackfn(r.rows);
    },
    function(tx, e){
        Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
    });
}
//Seleccion de juego por id
function SelectGamesById(ObjGame,callbackfn)
{
RunBotdb.executeSql('SELECT * FROM Games WHERE Id=?', [ObjGame],
    function(tx, r){
        if(r.rows.length>0)
            callbackfn(r.rows.item(0));
        else
            Lungo.Notification.error("Error","SelectGamesById",'remove',2);
    },
    function(tx, e){
        Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
    });
}
/*
//insertamos una nueva publicación en las redes sociales
//no implementado por tiempo :'(
function InsertSocial(ObjSocial,callbackfn)
{
var ObjInsSocial=[ObjSocial.Comment,ObjSocial.IdSocial,new Date(),ObjSocial.IdTraining];
RunBotdb.executeSql('INSERT INTO SocialMedia (Comment,Social,Date,IdTraining) VALUES (?,?,?,?)', ObjInsSocial,
    function(tx, r){
    },
    function(tx, e){
        Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
    });
}
*/
//lees el perfil
function SelectProfile(callbackfn)
{
    RunBotdb.executeSql('SELECT * FROM Profile', [],
        function(tx, r){
            callbackfn(r.rows);
        },
        function(tx, e){
            Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
        });
}
//actualizamos el perfil
function UpdateProfile(ObjUpdUsr,callbackfn)
{
    RunBotdb.executeSql('UPDATE Profile SET Name=?,SurName=?,Age=?,Weight=?,Gender=?,Rol=?,Email=? WHERE Id=?', ObjUpdUsr,
        function(tx, r){
            callbackfn("ok");
        },
        function(tx, e){
            Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
        });
}
//actualizamos la puntuacion de nuestro perfil al finalizar el entrenaiento
function UpdateProfileTraining(ObjUpdUsr)
{
    RunBotdb.executeSql('UPDATE Profile SET Points=?,Win=?,Lose=? WHERE Id=?', ObjUpdUsr,
        function(tx, r){
        },
        function(tx, e){
            Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
        });
}

//seleccionamos la configuracion actual
function SelectConfigAll(callbackfn)
{
RunBotdb.executeSql('SELECT * FROM Config', [],
    function(tx, r){
        callbackfn(r.rows);
    },
    function(tx, e){
        Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
    });
}
//recogemos el idioma actual al iniciar la aplicación
function SelectCurrentLanguage(callbackfn)
{
RunBotdb.executeSql('SELECT ValueSelected FROM Config Where Param=?', ["Language"],
    function(tx, r){
        if(r.rows.length>0)
            callbackfn(r.rows.item(0));
        else
            Lungo.Notification.error("Error","SelectCurrentLanguage",'remove',2);
    },
    function(tx, e){
        Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
    });
}
//actualizamos los valores de la aplicación.
function UpdateConfigParam(ObjUpdConf)
{
    RunBotdb.executeSql('UPDATE Config SET ValueSelected=? WHERE Param=?', ObjUpdConf,
        function(tx, r){
            App.getConfigList();
            //alert(CurrentLngObj.lblChangeDone);
            speak(CurrentLngObj.lblChangeDone);
        },
        function(tx, e){
            Lungo.Notification.error("Error",CurrentLngObj.Error+" "+e.message,'remove',2);
        });
}

