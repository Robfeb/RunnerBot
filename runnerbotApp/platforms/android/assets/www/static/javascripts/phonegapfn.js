//control del boton de menu desde phonegap
function menuyourCallbackFunction() {
	Lungo.Aside.toggle("menuoptions");
}

// en el caso de que el tts no funcione
function startupFail(result) {
	console.log("Startup failure = " + result);
}
//al inicializar el plugin tts establecemos el idioma
function startupWin(result) {
		if (result == TTS.STARTED) {
			window.plugins.tts.getLanguage(win, fail);
			changeLang();
			
		}
}
//Saludo inicial de la aplicación
function SayHello() {
		if (CurrentOptions.Sounds=="1") {
			speak(CurrentLngObj.Title +" . "+CurrentLngObj.msgMision);
		}
}
//cambiar el idioma
function changeLang() {
	try{
	window.plugins.tts.setLanguage(CurrentLanguage.toLowerCase(), win, fail);
	}catch(error){}
}
//tts correcto
function win(result) {
	//console.log("win : " + result);
}
//tts  error
function fail(result) {
	console.log("Error : " + result);
}
//cerramos aplicación desde phonegap
function closeapp()
{
	if(navigator.app){
        navigator.app.exitApp();
	}else if(navigator.device){
        navigator.device.exitApp();
	}
}
//reproduce desde android un texto a voz dependiendo del idioma.
function speak(txt) {
		try{
			if(txt==undefined)
			txt=CurrentLngObj.btnPlay;
		if (CurrentOptions.Sounds=="1")
			window.plugins.tts.speak(txt,win,fail);
		}catch(error)
		{

		}
}