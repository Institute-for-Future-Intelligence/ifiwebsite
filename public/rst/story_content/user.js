window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
window.Script1 = function()
{
  var player = GetPlayer();

if (Number(player.GetVar("S4Complete")) === 1) {
    player.SetVar("AudioToPlay", 0)
}
else if (Number(player.GetVar("S3Complete")) === 1) {
    player.SetVar("AudioToPlay", 4)
}
else if (Number(player.GetVar("S2Complete")) === 1) {
    player.SetVar("AudioToPlay", 3)
}
else if (Number(player.GetVar("S1Complete")) === 1) {
    player.SetVar("AudioToPlay", 2)
}
else if (Number(player.GetVar("S1Complete")) === 0) {
	player.SetVar("AudioToPlay", 1)
}
}

window.Script2 = function()
{
  var currentTime = new Date();
var dateString = (currentTime.getMonth() + 1).toString() + "/" + currentTime.getDate().toString() + "/" + currentTime.getFullYear().toString();

var player = GetPlayer();
player.SetVar("certDate", dateString);
}

window.Script3 = function()
{
  var styles = `
@media print {
body, * { visibility: hidden; }
html, body { overflow: hidden; transform: translateZ(0); }
#slide {
transform: scale(.9) !important; # Adjusted scale to 1 (no zoom)
}
#wrapper {
transform: scale(.9) !important;
}
#slide,
#wrapper {
width: 100% !important;
height: 100% !important;
overflow: visible !important;
}
#frame {
overflow: visible !important;
}
.slide-transition-container {
overflow: visible !important;
}
@page {
size: A4 landscape;
max-height: 99%;
max-width: 99%;
}
.slide-container, .slide-container * {
visibility: visible !important;
margin-top: 0px !important;
margin-left: 0px !important;
}
#outline-panel {
display: none !important;
}
}
`;

var stylesheet = document.createElement('style');
stylesheet.type = 'text/css';
stylesheet.innerText = styles;
document.head.appendChild(stylesheet);
	window.print();
}

};
