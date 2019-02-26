// (c) by Tim @ forum.ge
var geoSp = new Array("[\u10D1]","[/\u10D1]","[\u10E5\u10E3\u10DD\u10E2\u10D4]","[/\u10E5\u10E3\u10DD\u10E2\u10D4]");
var codeBB = new Array("[b]","[/b]","[quote]","[/quote]");
var engAr = new Array(/a/g,/b/g,/g/g,/d/g,/e/g,/v/g,/z/g,/T/g,/i/g,/k/g,/l/g,/m/g,/n/g,/o/g,/p/g,/J/g,/r/g,/s/g,/t/g,/u/g,/f/g,/q/g,/R/g,/y/g,/S/g,/C/g,/c/g,/Z/g,/w/g,/W/g,/x/g,/j/g,/h/g);
var geoAr = new Array("\u10D0","\u10D1","\u10D2","\u10D3","\u10D4","\u10D5","\u10D6","\u10D7","\u10D8","\u10D9","\u10DA","\u10DB","\u10DC","\u10DD","\u10DE","\u10DF","\u10E0","\u10E1","\u10E2","\u10E3","\u10E4","\u10E5","\u10E6","\u10E7","\u10E8","\u10E9","\u10EA","\u10EB","\u10EC","\u10ED","\u10EE","\u10EF","\u10F0");
function GeoLang() {
var textar = document.REPLIER.Post.value;
if (textar) {
 for (i=0; i<engAr.length; i++) {
 textar = textar.replace(engAr[i], geoAr[i])
 }
 for (i=0; i<geoSp.length; i++) {
 textar = textar.replace(geoSp[i], codeBB[i])
 }
document.REPLIER.Post.value = textar;
}
}
