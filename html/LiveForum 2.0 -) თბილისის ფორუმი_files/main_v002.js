var fgModal, fgModalTitle, fgModalIMGOpen, fgUserID, fgModalClose, fgModalIMG, fgModalWait, fgModalError, fgModalLoading, fgInputBox, fgModalDIV = document.createElement('div');

fgModalDIV.setAttribute("id", "fgModal");
fgModalDIV.innerHTML = '<div class="fgModalContent">'+
  '<div id="fgModalClose">X</div><div id="fgModalTitle"></div><div class="fgModalClear"></div>'+
  '<div id="fgModalIMG">ბმულით დამატება<br>'+
  '<input type="text" id="fgModalIMGURL" value="" placeholder="https://example.com/img/myPhoto.jpg"> <button onclick="fgModalIMGUpload(1)">დაამატე</button>'+
  '<br><br>სურათის ატვირთვა<br>'+
  '<input type="file" id="fsModalIMGFile" /> <button onclick="fgModalIMGUpload(2)">ატვირთე</button></div>'+
  '<div id="fgModalWait">გთხოვთ დაიცადოთ...</div>'+
  '<div id="fgModalError"></div>';

function fgModalRun() {
  try {
    var fgForm = document.getElementsByName("REPLIER")[0],
      fgPost = fgForm.getElementsByTagName("textarea"),
      fgBlock = true, i;
    if(fgForm.tagName === "FORM" && fgPost.length > 0){
      for(i=0; i<fgPost.length; i++){
        if(fgPost[i].getAttribute("name") === "Post"){
          fgInputBox = fgPost[i];
          i = fgPost.length;
          fgBlock = false;
        }
      }
      if(!fgBlock){
        fgModalTitle.innerHTML = "სურათის დამატება";
        fgModal.style.display = "block";
        fgModalIMG.style.display = "block";
      }
    } else {
      return;
    }
  } catch(e){
    return;
  }
}

function fgModalHide(){
  fgModal.style.display = "none";
  fgModalIMG.style.display = "none";
  fgModalWait.style.display = "none";
  fgModalError.style.display = "none";
  fgModalLoading = false;
  document.getElementById("fsModalIMGFile").value = "";
  document.getElementById("fgModalIMGURL").value = "";
}

function fgModalIMGUpload(act){
  var inputFile = document.getElementById("fsModalIMGFile"),
     inputURL = document.getElementById("fgModalIMGURL").value;
  if(inputURL.length > 10 && act === 1 || inputFile.files.length === 1 && act === 2){
    var xhr = new XMLHttpRequest(),
      data = new FormData();

    if(act === 1){
      data.append("url", inputURL);
      data.append("act", "imgURL");
    } else if(act === 2){
      data.append("imgFile", inputFile.files[0]);
      data.append("act", "imgUP");
    }

    data.append("userid", fgUserID);

    fgModalLoading = true;
    fgModalIMG.style.display = "none";
    fgModalWait.style.display = "block";
    fgModalError.style.display = "none";

    xhr.onerror = function () {
      fgModalWarning("სერვერთან დაკავშირება ვერ მოხერხდა, სცადეთ ხემეორედ.");
    };

    xhr.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status == 200) {
          try {
            var result = JSON.parse(this.responseText);
            if(result.type === "ok" && result.id.length > 1){
              fgInsertAtCursor(fgInputBox, "[img]"+result.id+"[/img]");
              fgModalHide();
              showImg(result.id);
            } else {
              fgModalWarning();
              fgModalIMG.style.display = "block";
            }
          } catch(e) {
            fgModalWarning();
            fgModalIMG.style.display = "block";
          }
        } else {
          fgModalWarning();
          fgModalIMG.style.display = "block";
        }
      }
    };
    xhr.open("post", "/imgapi/");
    xhr.send(data);
  } else {
    fgModalWarning("აირჩიეთ ფაილი.");
  }
}

function fgModalWarning(error){
  var errorText = "დაფიქსირდა შეცდომა, სცადეთ ხელმეორედ.";
  if(error){
    errorText = error;
  }
  fgModalLoading = false;
  fgModalError.innerHTML = errorText;
  fgModalError.style.display = "block";
  fgModalWait.style.display = "none";
  setTimeout(function(){fgModalError.style.display = "none"; }, 3000);
}

function fgInsertAtCursor(ta, val) {
  if (document.selection) {
    ta.focus();
    document.selection.createRange().text = val;
  } else if(window.navigator.userAgent.indexOf("Edge") > -1) {
    var startPos = ta.selectionStart,
    endPos = ta.selectionEnd,
    pos = startPos + val.length;
    ta.value = ta.value.substring(0, startPos)+ val + ta.value.substring(endPos, ta.value.length);
    ta.focus();
    ta.setSelectionRange(pos, pos);
  } else if (ta.selectionStart || ta.selectionStart == '0') {
    var startPos = ta.selectionStart,
    endPos = ta.selectionEnd;
    ta.value = ta.value.substring(0, startPos) + val + ta.value.substring(endPos, ta.value.length);
  } else {
    ta.value += val;
  }
}

function fgGifPlayer(){
  var gifList = document.querySelectorAll("img[src^='https://img.forum.ge/V']"), playerDiv = [], i;

  for(i=0; i<gifList.length; i++){
    playerDiv[i] = document.createElement("div");
    playerDiv[i].setAttribute("id", gifList[i].getAttribute("src").split("https://img.forum.ge/")[1].split(".")[0]);
    playerDiv[i].style.position = "relative";
    playerDiv[i].style.backgroundImage = "url('"+gifList[i].getAttribute("src")+"')";
    playerDiv[i].style.width = gifList[i].getAttribute("width")+"px";
    playerDiv[i].style.height = gifList[i].getAttribute("height")+"px";
    playerDiv[i].innerHTML = '<img src="https://img.forum.ge/files/gifplay.png" class="fgGifPlay">';
    playerDiv[i].onclick = function(e){
      var cID = this.getAttribute("id"), j;
      for(j=0; j<100; j++){
        if(!document.getElementById("vp"+j.toString()+cID)){
          this.innerHTML = '<video id="vp'+j.toString()+cID+'" loop muted src="https://img.forum.ge/'+cID+'.mp4" onclick="if(this.paused){this.play();}else{this.pause();}" />';
          document.getElementById("vp"+j.toString()+cID).play();
          this.setAttribute("onclick", "");
          j = 100;
        }
      }
    }
    gifList[i].parentNode.replaceChild(playerDiv[i], gifList[i]);
  }
}

function fgButtons(){
  var fgImgTagButton = document.getElementsByName("img"), fgForm, fgPost, fgNewButton;
  if(fgImgTagButton.length > 0){
    fgImgTagButton[0].setAttribute("onclick", "fgModalRun()");
  } else {
    try {
      fgForm = document.getElementsByName("REPLIER")[0], fgPost = fgForm.getElementsByTagName("textarea");
      if(fgForm.tagName === "FORM" && fgPost.length > 0){
        if(fgPost[0].getAttribute("name") === "Post"){
          fgNewButton = document.createElement('div');
          fgNewButton.innerHTML = '<input accesskey="g" value=" [IMG] სურათის დამატება " onclick="fgModalRun()" style="margin: 10px 0" class="codebuttons" name="img" type="button">';
          fgPost[0].parentNode.insertBefore(fgNewButton, fgPost[0]);
        }
      }
    } catch (e) {
      //
    }
  }
}

function fgResizer(){
  var imgList = document.querySelectorAll("img[alt='user posted image']"), i, tempW, tempH, w, h, screenW = Math.round(window.innerWidth * 0.75), resize = false;

  for(i=0; i<imgList.length; i++){
    if(imgList[i].getAttribute("width") && imgList[i].getAttribute("height")){
      tempW = imgList[i].getAttribute("width");
      tempH = imgList[i].getAttribute("height");
      if(tempW > screenW){
        imgList[i].setAttribute("height", Math.round(tempH/(tempW/screenW)));
        imgList[i].setAttribute("width", screenW);
      }
    } else {
      imgList[i].style.maxWidth = screenW + "px";
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  document.body.appendChild(fgModalDIV);
  fgModal = document.getElementById('fgModal');
  fgModalTitle = document.getElementById('fgModalTitle');
  fgModalIMGOpen = document.getElementById("fgModalIMGOpen");
  fgModalClose = document.getElementById("fgModalClose");
  fgModalIMG = document.getElementById("fgModalIMG");
  fgModalWait = document.getElementById("fgModalWait");
  fgModalError = document.getElementById("fgModalError");
  fgModalLoading = false;
  fgUserID = Number(document.getElementById("userlinks").getElementsByTagName("a")[0].getAttribute("href").split("showuser=")[1]);
  if(!(fgUserID>0)){ fgUserID = 0; }
  fgButtons();
  fgGifPlayer();
  fgResizer();
});

window.onclick = function(e) {
  if (e.target === fgModal && !fgModalLoading || e.target === fgModalClose && !fgModalLoading) {
    fgModalHide();
  }
}
