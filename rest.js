var request;
var objJSON;
var id_mongo;
var login = "";
var datal = {};


function getRequestObject()      {
   if ( window.ActiveXObject)  {
      return ( new ActiveXObject("Microsoft.XMLHTTP")) ;
   } else if (window.XMLHttpRequest)  {
      return (new XMLHttpRequest())  ;
   } else {
      return (null) ;
   }
}

function openTab(evt, tabName) {
  document.getElementById('result').innerHTML ="";
  document.getElementById('result1').innerHTML ="";
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

window.addEventListener("DOMContentLoaded", ()=> {    
    if(get_cookies() != "") {
        document.getElementById('Login').style.display = 'none';
        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').style.display = 'inline';
    } 
});


function get_cookies() {
	var cookies = document.cookie.split(';')
	for (var i = 0; i < cookies.length; i++) {
	  var	tmp = cookies[i];
		while (tmp.charAt(0) == ' ') {
			tmp = tmp.substring(1, tmp.length);
		}
		if (tmp.indexOf("sessionID=") == 0) {
			return tmp.substring("sessionID=".length, tmp.length);
		}
	}
	return '';
}



function _register()  {
  document.getElementById('result').innerHTML ="";
  document.getElementById('result1').innerHTML ="";
if(validate_login()){
    var form = document.querySelector("[name='form2']");
    var user = {};
    user.login = form.login.value;
    user.haslo = form.haslo.value;
   
    txt = JSON.stringify(user);
    console.log(txt);
    document.getElementById('result').innerHTML = '';
    
    request = getRequestObject();
    request.open("POST", "http://pascal.fis.agh.edu.pl/~9brach/Projekt_TI_2/rest/register", true);
    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {
          
          objJSON = JSON.parse(request.response);
            if(objJSON['return'] == 'ok') {
              document.getElementById('result').innerHTML = "Udało się. Teraz możesz zalogować się!";
              console.log(request.responseText);
              } else {
                console.log(request.responseText);
                document.getElementById('result').innerHTML = "Nie udało się. Użytkownik z takim loginem już istnieje!";
              }
        }
    }
    request.send(txt);
       }
        else{
      document.getElementById('result').innerHTML ="Pola nie mogą być puste!!!";
    }
}

function _login()  {
  document.getElementById('result').innerHTML ="";
  document.getElementById('result1').innerHTML ="";
  if(validate_login()){
    var form = document.querySelector("[name='form2']");
    var user = {};
    user.login = form.login.value;
    user.haslo = form.haslo.value;
   
    txt = JSON.stringify(user);
    console.log(txt);
    document.getElementById('result').innerHTML = '';
    
    request = getRequestObject();
    request.open("POST", "http://pascal.fis.agh.edu.pl/~9brach/Projekt_TI_2/rest/login", true);
    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {
          objJSON = JSON.parse(request.response);
            if(objJSON['return'] == 'ok') {
              login = user.login;
              document.getElementById('data').innerHTML = ''; 
              document.getElementById('Login').style.display = 'none';
              document.getElementById('login').style.display = 'none';
              document.getElementById('logout').style.display = 'inline';
              form.login.value ="";
              form.haslo.value ="";
              document.getElementById('result').innerHTML ="";
              document.cookie = "sessionID=" + objJSON['session'] + "; path=/";
              indexedDB.deleteDatabase("questionnaire");
              document.getElementById('data').innerHTML = ''; 
              } 
            else {
                document.getElementById('result').innerHTML ="Nie udało się zalogować. Sprobuj ponownie!!!";
              }
        }
    }
    request.send(txt);
    }
    else{
      document.getElementById('result').innerHTML ="Pola nie mogą być puste!!!";
    }
}

function _logout()  {
  document.getElementById('chart1').innerHTML = '';
  document.getElementById('chart2').innerHTML = '';
  document.getElementById('chart3').innerHTML = '';
  document.getElementById('result').innerHTML ="";
  document.getElementById('result1').innerHTML ="";
	req = getRequestObject();
	req.onreadystatechange = function () {
		if (req.readyState == 4 && req.status == 200) {
			objJSON = JSON.parse(req.response);
      console.log(req.responseText);
			if (objJSON['return'] == 'ok') {
      login ="";
       document.cookie ="sessionID=" + "" + "; path=/";
       document.getElementById('logout').style.display = 'none';
       document.getElementById('login').style.display = 'inline';
			}
		}
	}
	req.open("POST", "http://pascal.fis.agh.edu.pl/~9brach/Projekt_TI_2/rest/logout", true);
	req.send(null);
}

function save_answers()  {
  document.getElementById('result').innerHTML ="";
  document.getElementById('result1').innerHTML ="";
  if( validate_questionnaire()){
    var form = document.querySelector("[name='form1']");
    var cookiee=get_cookies();
    var answ = {};
    answ.id = login;
    answ.age = form.age.value;
    answ.q1 = form.question_1.value;
    answ.q2= form.question_2.value;

    
    txt = JSON.stringify(answ);
    console.log(txt);
       
    document.getElementById('result1').innerHTML = '';
    if(navigator.onLine && cookiee!='')
    {
      request = getRequestObject();
      request.onreadystatechange = function() {
          if(request.readyState == 4 && request.status == 200) {
            document.getElementById('result1').innerHTML = request.responseText;
            objJSON = JSON.parse(request.response);
              if(objJSON['return'] == 'ok') {
                console.log(request.responseText);
                document.getElementById('result1').innerHTML = "Odpowiedzi zostały zanotowane!";
                } else {
                   console.log(request.responseText);
                   document.getElementById('result1').innerHTML = "Brałeś już udział w ankiecie!";
                }
          }
      }
      
      request.open("POST", "http://pascal.fis.agh.edu.pl/~9brach/Projekt_TI_2/rest/answers", true);
      request.send(txt);
    }
    else if(login=="")
    {
      document.getElementById('result1').innerHTML = "Należy się zalogować aby zarejestrować odpowiedź";
    }
    else{
      
      var conn = window.indexedDB.open("questionnaire", 3);
      
        conn.onupgradeneeded = function (event) {
            var db = event.target.result;

            var store;
            try {
              var objectStore = transaction.objectStore('odpowiedzi');
              objectStore.clear();
            }
            catch(e) {   
              console.log("baza nie istnieje");
            }
            
            //var transaction = db.transaction('odpowiedzi', 'readwrite');
            
            var objectStore = db.createObjectStore('odpowiedzi', {autoIncrement: true});
            console.log(objectStore);
            
            objectStore.createIndex("wiek", "wiek");
          	objectStore.createIndex("q1", "q1");
          	objectStore.createIndex("q2", "q2");
        };
        conn.onsuccess = function (event) {
            var db = event.target.result;
            var transaction = db.transaction('odpowiedzi', 'readwrite');
            var objectStore = transaction.objectStore('odpowiedzi');
            var objectRequest = objectStore.put(answ);
            objectRequest.onerror = function (event) {
                console.log("Error dodawania do lokalnej!");
                console.log(event);
         };
    
        objectRequest.onsuccess = function (event) {
            console.log("Udalo sie dodac do lokalnej");
        };
        
        document.getElementById('result1').innerHTML = " Dane zostały zapisane do lokalnej bazy"; 
    }
    }
    clear_questionnaire();
    }
  else{
    document.getElementById('result1').innerHTML = "Formularz nie został w pełni wypełniony"; 
  }
       
}

    function local_save()
    { 
      var answ = {};
      answ.id = login;
      answ.age = datal.age;
      answ.q1 = datal.q1;
      answ.q2= datal.q2;
          txt = JSON.stringify(answ);
          console.log(txt);
          if(navigator.onLine != ''){
            request = getRequestObject();
            request.onreadystatechange = function() {
                if(request.readyState == 4 && request.status == 200) {
                  document.getElementById('result1').innerHTML = request.responseText;
                  objJSON = JSON.parse(request.response);
                  if(objJSON['return'] == 'ok') {
                    console.log(request.responseText);
                    document.getElementById('result2').innerHTML = "Odpowiedzi zostały zanotowane! Ponownie kliknij w wyniki!";
                    datal.age=null;
                    datal.q1=null;
                    datal.q2=null;
                    document.getElementById('hidden_button').innerHTML='';
                    } else {
                       console.log(request.responseText);
                       document.getElementById('result2').innerHTML = "Brałeś już udział w ankiecie!";
                    }

                }
            }
            
            request.open("POST", "http://pascal.fis.agh.edu.pl/~9brach/Projekt_TI_2/rest/answers", true);
            request.send(txt);

                } else {
                    console.log("Nie jesteś online!");
                    document.getElementById('result2').innerHTML = "Nie jesteś online!";
                }
    };

function set_results() {
    document.getElementById('result2').innerHTML = "";
    if (navigator.onLine && get_cookies() != '') {
        analyze_answers();
    } 
    else if(login=="")
    {
      document.getElementById('result2').innerHTML = "Należy się zalogować aby zobaczyć wyniki!";
    }
    else {
      document.getElementById('data').innerHTML = "";
      var content = "<h3>Nie masz dostępu do internetu, wyświetlane są jedynie twoje odpowiedzi!</h3>";
      document.getElementById('onlineRes').style.display = 'none';
        var conn = window.indexedDB.open("questionnaire", 3);

        conn.onsuccess = function (event) {
            var db = event.target.result;
            var transaction = db.transaction('odpowiedzi', 'readwrite');
            var objectStore = transaction.objectStore('odpowiedzi');
          
                objectStore.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    
                    if (cursor) {
                      var data = {};
                			datal.age = cursor.value.age;
                      content += "<p>Wiek: " + cursor.value.age + "</p>  ";
                			datal.q1 = cursor.value.q1;
                      content += "<p>Czy szczepiłeś się przeciwko COVID-19?</p><p>Odpowiedź: " + cursor.value.q1 + "</p>  ";
                			datal.q2 = cursor.value.q2;
                      content += "<p>Jaki jest powód dla którego się szczepiłeś / jaki miałby być powód abyś się zaszczepił?</p> <p>Odpowiedź: " + cursor.value.q2 + "</p>  ";
                      
                       
                        content+="<p>Jeżeli jesteś pewny swoich odpowiedzi kliknij w przycisk który pojawił się na górze (Uwaga musisz być online!)";
                        content+='</p>';
                        document.getElementById('hidden_button').innerHTML='<button class="tablinks" onclick="local_save()" id="zardane" >Zarejestruj Dane!</button>';
                        content+='<p>Jeżeli nie ponownie przejdź do ankiety</p>';
                        console.log(`${content}`);
                        document.getElementById('data').innerHTML = content;
                        objectStore.clear();
                        cursor.continue();
                    } else {
                        console.log("No more entries!");
                    }

                };

            };
        }
         
    }


function analyze_answers()  {
  document.getElementById('data').innerHTML = ''; 
  document.getElementById('result').innerHTML ="";
  document.getElementById('result1').innerHTML =""; 
  request = getRequestObject() ;
   
   request.onreadystatechange = function() {
      if (request.readyState == 4)    {
         objJSON = JSON.parse(request.response);
          if(objJSON['return'] == 'ok') {
                console.log(objJSON['res']);
                document.getElementById('data').style.display = 'none';
                document.getElementById('onlineRes').style.display = 'inline';
                Chart_1(objJSON['res']);
                Chart_2(objJSON['res']);
                Chart_3(objJSON['res']);
                
                } else {
                  console.log(request.responseText);
                  
                }
         }
      };
   
   request.open("GET", "http://pascal.fis.agh.edu.pl/~9brach/Projekt_TI_2/rest/getansw", true);
   request.send(null);

}


function validate_login(){
  var form = document.querySelector("[name='form2']");
  var formValid = false;
  if(form.login.value !="" && form.haslo.value !=""){
    formValid=true;
  }
  return formValid;
}

function radiosVal(radios) {    
    var formValid = false;
    var i = 0;
    while ((!formValid) && (i < radios.length)) {
        if (radios[i].checked) {   formValid = true; }
        i++;        
    }
    return formValid;
}

function validate_questionnaire(){
  if(radiosVal(document.querySelectorAll("[name = 'question_1']")) && radiosVal(document.querySelectorAll("[name = 'question_2']")) &&
  (document.querySelector("[name='age']").value != ""))
  {
    return true;
  }
  return false;
}


function clear_questionnaire(){
  document.querySelector("[name='age']").value="";
   clear_radio(document.querySelectorAll("[name = 'question_1']"));
   clear_radio(document.querySelectorAll("[name = 'question_2']"));
 }
 
 
 function clear_radio(ele){
   for(var i=0;i<ele.length;i++){
      ele[i].checked = false;
      }
 }
 
 
  function Chart_1(data){
  
   var x = {};
   x.a1=0;
   x.a2=0;
   x.a3=0;
   x.a4=0;
   x.a5=0;
   for ( var id in data )  {
       for ( var prop in data[id] ) {             
           if ( prop === 'age'){
             var age = parseInt(data[id][prop]);
             if(age <= 18){
                 x.a1++;
             }
             else if(age>18 && age <=30){
                 x.a2++;
             }
             else if(age>30 && age <=45){
                 x.a3++;
             }
              else if(age>45 && age <=65){
                 x.a4++;
             }
             else if(age > 65){
                 x.a5++;
             }
          }
        }
     }
     
             
   var options = {
          series: [x.a1, x.a2, x.a3, x.a4, x.a5],
          chart: {
          width: 380,
          type: 'donut',
        },
        title: {
          text: "Rocznik uczestników.",
          align: 'left',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            fontFamily:  undefined,
            color:  '#263238'
          },
        },
        labels: [' <18', '19-30', '31-45', '46-65', '>66'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
        
        
        };

        var chart = new ApexCharts(document.querySelector("#chart1"), options);
        
        destroyChart = () => {
              if (chart.ohYeahThisChartHasBeenRendered) {
                  chart.destroy();
                  chart.ohYeahThisChartHasBeenRendered = false;
              }
          };
      document.getElementById('chart1').innerHTML = '';
      chart.render().then(() => chart.ohYeahThisChartHasBeenRendered = true);
             
 }

 
 function Chart_2(data){
   
   var x = {};
   x.a1=0;
   x.a2=0;
   x.a3=0;
   for ( var id in data )  {
       for ( var prop in data[id] ) {             
           if ( prop === 'q2'){
             
             if(data[id][prop]==='A'){
                 x.a1++;
             }
             else if(data[id][prop]==='B'){
                 x.a2++;
             }
             else if(data[id][prop]==='C'){
                 x.a3++;
             }
          }
        }
     }
     
             
   var options = {
          series: [x.a1, x.a2, x.a3],
          chart: {
          width: 380,
          type: 'donut',
        },
        title: {
          text: "Czy szczepiłeś się przeciwko COVID-19?",
          align: 'left',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            fontFamily:  undefined,
            color:  '#263238'
          },
        },
        labels: ['Tak', 'Nie', 'Jeszcze nie'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
        
        
        };

        var chart = new ApexCharts(document.querySelector("#chart2"), options);
        
        destroyChart = () => {
              if (chart.ohYeahThisChartHasBeenRendered) {
                  chart.destroy();
                  chart.ohYeahThisChartHasBeenRendered = false;
              }
          };
      document.getElementById('chart2').innerHTML = '';
      chart.render().then(() => chart.ohYeahThisChartHasBeenRendered = true);
      
 }


 function Chart_3(data){
   var x = {};
   x.a1=0;
   x.a2=0;
   x.a3=0;
   for ( var id in data )  {
       for ( var prop in data[id] ) {             
           if ( prop === 'q2'){
             
             if(data[id][prop]==='A'){
                 x.a1++;
             }
             else if(data[id][prop]==='B'){
                 x.a2++;
             }
             else if(data[id][prop]==='C'){
                 x.a3++;
             }
          }
        }
     }
     
             
   var options = {
          series: [x.a1, x.a2, x.a3],
          chart: {
          width: 380,
          type: 'pie',
        },
        title: {
          text: "Powód szcepienia.",
          align: 'left',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            fontFamily:  undefined,
            color:  '#263238'
          },
        },
        labels: ['Ochronne', 'Wymagane', 'Inne...'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 380
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
        
        
        };
        
        var chart = new ApexCharts(document.querySelector("#chart3"), options);
        destroyChart = () => {
              if (chart.ohYeahThisChartHasBeenRendered) {
                  chart.destroy();
                  chart.ohYeahThisChartHasBeenRendered = false;
              }
          };
      document.getElementById('chart3').innerHTML = '';
      chart.render().then(() => chart.ohYeahThisChartHasBeenRendered = true);
      
 }
