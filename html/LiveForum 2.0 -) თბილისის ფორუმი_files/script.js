// (c) by Tim @ forum.ge
function ValidateMyForm() {
MessageLength=document.REPLIER.Post.value.length;
errors="";
if (MessageLength < 50) {
errors="Please enter some text, at least 10 chars.";
}
if (errors != "") {
alert(errors);
return false;
} else {
document.REPLIER.submit.disabled = true;
return true;
}
}
function paste(name)
{
document.REPLIER.Post.value+="[b]"+name+"[/b]\n";
}
function paste2(name)
{
if (name!="") document.REPLIER.Post.value+="[quote]"+name+"[/quote]\n"
}
function paste3(name)
{
if (name!="") document.REPLIER.Post.value+=""+name+"\n"
}
function Insert(text){ 
if (text!="") paste4("[quote]"+text+"[/quote]\n", 0);
}
function paste4(text, flag){ 
if (document.REPLIER) {
if ((document.selection)&&(flag)) {
	document.REPLIER.Post.focus();
	document.REPLIER.document.selection.createRange().text = text;
} else document.REPLIER.Post.value += text;
}
}

function get_selection() {
  if(navigator.userAgent.search(/webkit/i) > -1) {
    selection = window.getSelection();
    } else {
      if (document.getSelection){
           selection = document.getSelection();
	selection = selection.replace(/\r\n\r\n/gi, "_doublecaret_");
	 selection = selection.replace(/\r\n/gi, " ");
	 while (selection.indexOf("  ") !=-1) selection = selection.replace(/  /gi, "");
	 selection = selection.replace(/_doublecaret_/gi, "\r\n\r\n");
	 } else {
 selection = document.selection.createRange().text;
          }
  }
}


//last updated 9 june 2006

///----- taya
eng=new Array(97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,87,82,84,83,67,74,90);
geo=new Array(4304,4305,4330,4307,4308,4324,4306,4336,4312,4335,4313,4314,4315,4316,4317,4318,4325,4320,4321,4322,4323,4309,4332,4334,4327,4310,4333,4326,4311,4328,4329,4319,4331,91,93,59,39,44,46,96);
///--- taya

//----------------------------------------------------
function Is ()
{
    var agt=navigator.userAgent.toLowerCase();
    this.major = parseInt(navigator.appVersion);
    this.minor = parseFloat(navigator.appVersion);
    this.nav  = (
		(agt.indexOf('mozilla')!=-1)      
		&& (agt.indexOf('spoofer')==-1)
                && (agt.indexOf('compatible') == -1) 
		&& (agt.indexOf('opera')==-1)   
		&& (agt.indexOf('konqueror')==-1)             ///------------- taya
		&& (agt.indexOf('safari')==-1)                  // ------------------ taya
                && (agt.indexOf('webtv')==-1) 
		&& (agt.indexOf('hotjava')==-1)
		);
if  ((agt.indexOf('mozilla')!=-1) && ((agt.indexOf('konqueror')>=0) || (agt.indexOf('safari')>=0))) {this.nav=true;} //---- taya

    this.nav2 = (this.nav && (this.major == 2));
    this.nav3 = (this.nav && (this.major == 3));
    this.nav4 = (this.nav && (this.major == 4));
    this.nav4up = (this.nav && (this.major >= 4));
    this.navonly      = (this.nav && ((agt.indexOf(";nav") != -1) ||
                          (agt.indexOf("; nav") != -1)) );
    this.nav6 = (this.nav && (this.major == 5));
    this.nav6up = (this.nav && (this.major >= 5));
    this.gecko = (agt.indexOf('gecko') != -1);
    this.ie     = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));
    this.ie3    = (this.ie && (this.major < 4));
    this.ie4    = (this.ie && (this.major == 4) && (agt.indexOf("msie 4")!=-1) );
    this.ie4up  = (this.ie && (this.major >= 4));
    this.ie5    = (this.ie && (this.major == 4) && (agt.indexOf("msie 5.0")!=-1) );
    this.ie5_5  = (this.ie && (this.major == 4) && (agt.indexOf("msie 5.5") !=-1));
    this.ie5up  = (this.ie && !this.ie3 && !this.ie4);
    this.ie5_5up =(this.ie && !this.ie3 && !this.ie4 && !this.ie5);
    this.ie6    = (this.ie && (this.major == 4) && (agt.indexOf("msie 6.")!=-1) );
    this.ie6up  = (this.ie && !this.ie3 && !this.ie4 && !this.ie5 && !this.ie5_5);
    this.aol   = (agt.indexOf("aol") != -1);
    this.aol3  = (this.aol && this.ie3);
    this.aol4  = (this.aol && this.ie4);
    this.aol5  = (agt.indexOf("aol 5") != -1);
    this.aol6  = (agt.indexOf("aol 6") != -1);
    this.opera = (agt.indexOf("opera") != -1);
    this.opera2 = (agt.indexOf("opera 2") != -1 || agt.indexOf("opera/2") != -1);
    this.opera3 = (agt.indexOf("opera 3") != -1 || agt.indexOf("opera/3") != -1);
    this.opera4 = (agt.indexOf("opera 4") != -1 || agt.indexOf("opera/4") != -1);
    this.opera5 = (agt.indexOf("opera 5") != -1 || agt.indexOf("opera/5") != -1);
    this.opera6 = (agt.indexOf("opera 6") != -1 || agt.indexOf("opera/6") != -1);
    this.opera7 = (agt.indexOf("opera 7") != -1 || agt.indexOf("opera/7") != -1);
    this.opera7up = (this.opera && !this.opera2 && !this.opera3 && !this.opera4 && !this.opera5 && !this.opera6 && !this.opera7 );
    this.webtv = (agt.indexOf("webtv") != -1); 
    this.TVNavigator = ((agt.indexOf("navio") != -1) || (agt.indexOf("navio_aoltv") != -1)); 
    this.AOLTV = this.TVNavigator;
    this.hotjava = (agt.indexOf("hotjava") != -1);
    this.hotjava3 = (this.hotjava && (this.major == 3));
    this.hotjava3up = (this.hotjava && (this.major >= 3));
    this.konqueror=   (agt.indexOf("konqueror") != -1); //--- taya
    this.safari=   (agt.indexOf("safari") != -1);   //--- taya
}
//----------------------------------------------------
function handleKeys(e)
{

var key=(window.event)?event : e;

// es aris ALT+S dacheraze submitis gagzavna.
if (e.which==115 && key.altKey) document.REPLIER.submit.click();

if(key.altKey || key.ctrlKey) return true;//----- კვეჟო


var theKey
theKey = e.which
if (e.which==96) { geoobj.checked = !geoobj.checked; setCookie("geoobj", geoobj.checked, 100); }
var i=formobj.value.length - 1;
if (e.which==96) { var f=e.target; var g=f.selectionStart; f.value=f.value.substring(0, f.selectionStart)+""+ f.value.substring(f.selectionStart); f.setSelectionRange(g,g); return false;}


if (geoobj.checked )
{
	//----------starts----- taya
	for (i=0; i<=geo.length; i++){
		if (eng[i]==e.which){
			//-- ak unda chaszored rom firefoxshi scrolli ar gauketdes--- TAYA
			var f=e.target; 
			var g=f.selectionStart;  //--- ak vigebt ramdeni simbolo aris ukve akrefli  kursoramede --Taya
			f.value=f.value.substring(0, f.selectionStart) //--- kursoramede sul mteli texti razaa
				+String.fromCharCode(geo[i])		//-- damatebuli es axali akrefili simbolo (ukve gadakvanili) --Taya
				+f.value.substring(f.selectionEnd);  //--- da kursoris mere raz zeria ----Taya

			//f.value+=String.fromCharCode(geo[i]);
			g++; 
			f.setSelectionRange(g,g); 
			return false;
		}
	}
	//----------ends----- taya
status=theKey;
}
return true;
}
//----------------------------------------------------
function changeVal()
{
formobj2=document.REPLIER.Post;
geoobj2=document.REPLIER.geo;

formobj=formobj2;
geoobj=geoobj2;


var is=new Is();
//|| (is.opera && !is.opera7up)
if (is.konqueror && formobj.value=='') {formobj.value=" ";} //-- TAYA  konqueror FIX - rom pirvel asos marjgvniv agebdebs 0 magis fixi


if (is.ie4up)  { // ak opera ar gvchirdeba ;) -- aiet
if (event.keyCode==96) geoobj.checked = geoobj.checked ? false : true;
if (event.keyCode==96) event.keyCode=''; 
} else if (is.nav6up    || is.konqueror || is.safari) {	// ai ak gadavidet operaze ;) -- aiet ++ Taya
	// alert("Unfortunately your browser is not supported");
	document.onkeypress = handleKeys;
}
if (geoobj.checked)
{
if (is.ie4up || (is.opera && !is.opera7up))  {	// opera 8-mde  -- Taya
var theKey
theKey=event.keyCode
	//----------starts----- taya
	for (i=0; i<=geo.length; i++){
		if (eng[i]==event.keyCode) {
			event.keyCode=geo[i];
		}
	}
	//----------ends----- taya
status = theKey;
}
else if (is.nav6up  || is.opera ) {  // opera 8 da mis shemdeg----- Taya
//       document.captureEvents(Event.KEYPRESS) ;
        document.onkeypress = handleKeys;
} else {
    alert("We doesn't currently support your browser");
    geoobj.checked=false;
  }
 }
}
//----------------------------------------------------

function setup_REPLIER(enablefocus){
if ((!enablefocus)&&(navigator.appVersion.indexOf("MSIE")!= -1)){ 
	var i=1;
	while (document.all("tbl"+i) != null) {document.all("tbl"+i).style.tableLayout="fixed"; i++}

	var testform_cookie = getCookie('setup2')
	if (testform_cookie!=null){
		form_cookie=testform_cookie.split("|");
		if ((form_cookie[3] != null)&&(form_cookie[3] >=20)&&(form_cookie[3]<=250)) {document.REPLIER.Post.cols=form_cookie[3]} else {document.REPLIER.Post.style.width="100%"};
		if (form_cookie[4] != null) {document.REPLIER.Post.rows=form_cookie[4]}
		if (form_cookie[5] != null) {document.REPLIER.Post.style.fontSize=form_cookie[5]}
		if (form_cookie[6] != null) {document.REPLIER.Post.accessKey=form_cookie[6]}
	} else {document.REPLIER.Post.style.width="100%"}
}
}
function getCookie(name) {
var prefix = name + "="
var StartIndex = document.cookie.indexOf(prefix)
if (StartIndex == -1)
return null
var EndIndex = document.cookie.indexOf(";", StartIndex + prefix.length)
if (EndIndex == -1)
EndIndex = document.cookie.length
return unescape(document.cookie.substring(StartIndex + prefix.length, EndIndex))
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
