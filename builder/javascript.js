const lyricConvert = document.getElementById("lyric-convert");
const lyricInput = document.getElementById("lyric-input");
const lyricContainer = document.getElementById("lyric-container");
const chordBuilder = document.getElementById("chord-builder");
const copyHTML = document.getElementById("copy-HTML");
const copyChords = document.getElementById("copy-chords");
const chordOptions = document.getElementById("chord-options");
const chordTextType = document.getElementById("chord-text-type");
const chordTextInput = document.getElementById("chord-text-input");
const finalize = document.getElementById("finalize");
const undoLyric = document.getElementById("undo-lyric");
const undoChord = document.getElementById("undo-chord");
const previousLyric = [];
const previousChords = [];
const previousChordsHTML = [];
const previousChordOptions = [];
let currentDragItem;

function dragStartHandler(e){
  currentDragItem = e.target;
}

function dragoverHandler(e){
  e.preventDefault();
}

function dropHandler(e){
  e.preventDefault();
  const position = document.caretPositionFromPoint(e.clientX, e.clientY);
  
  if(position){
    const range = document.createRange();
    range.setStart(position.offsetNode, position.offset);
    range.collapse(true);

    //update undo array
    previousLyric.push(lyricContainer.innerHTML);

    //avoid nested span tags
    let currentTarget = range.startContainer;
    if(currentTarget.nodeType === Node.TEXT_NODE){
      currentTarget = currentTarget.parentElement;
    }

    //see if closest node is a span tag, then insert
    const existingSpan = currentTarget.closest('span');
    if(existingSpan){
      if (chordTextType.value == "spaced") {
        existingSpan.parentNode.insertBefore(document.createTextNode(" "), existingSpan);
        existingSpan.parentNode.insertBefore(currentDragItem, existingSpan);
        existingSpan.parentNode.insertBefore(document.createTextNode(" "), existingSpan);
      } else {
        existingSpan.parentNode.insertBefore(currentDragItem, existingSpan);
      }
    }
    else{
      if (chordTextType.value == "spaced") {
        range.insertNode(document.createTextNode(" "));
        range.insertNode(currentDragItem);
        range.insertNode(document.createTextNode(" "));
      } else {
        range.insertNode(currentDragItem);
      }
    }
  }
  currentDragItem = null;
}

function touchStartHandler(e) {
  currentDragItem = e.target;
  //reduce opacity for visual feedback
  e.target.style.opacity = "0.6"; 
}


function touchMoveHandler(e) {
  e.preventDefault(); // prevent scrolling
  const touch = e.touches[0];  //corresponds to a single finger touch or the first in a two-finger press
  const elem = currentDragItem;
  if (elem) {
    //calculate the coordinates relative to lyric-container

    elem.style.position = "absolute";
    elem.style.left = touch.clientX + "px";
    elem.style.top = touch.clientX + window.scrollY + "px";
  }
}


function touchEndHandler(e) {
  const touch = e.changedTouches[0];  //corresponds to the movement of the first finger
  const position = document.caretPositionFromPoint(touch.clientX, touch.clientY);

  if (position && currentDragItem) {
    const range = document.createRange();
    range.setStart(position.offsetNode, position.offset);
    range.collapse(true);

    previousLyric.push(lyricContainer.innerHTML);

    let currentTarget = range.startContainer;
    if (currentTarget.nodeType === Node.TEXT_NODE) {
      currentTarget = currentTarget.parentElement;
    }

    const existingSpan = currentTarget.closest('span');
    if (existingSpan) {
      if (chordTextType.value === "spaced") {
        existingSpan.parentNode.insertBefore(document.createTextNode(" "), existingSpan);
        existingSpan.parentNode.insertBefore(currentDragItem, existingSpan);
        existingSpan.parentNode.insertBefore(document.createTextNode(" "), existingSpan);
      } else {
        existingSpan.parentNode.insertBefore(currentDragItem, existingSpan);
      }
    } else {
      if (chordTextType.value === "spaced") {
        range.insertNode(document.createTextNode(" "));
        range.insertNode(currentDragItem);
        range.insertNode(document.createTextNode(" "));
      } else {
        range.insertNode(currentDragItem);
      }
    }
  }

  if (currentDragItem) {
    currentDragItem.style.opacity = "1";
    currentDragItem.style.position = "";
    currentDragItem.style.left = "";
    currentDragItem.style.top = "";
  }
  currentDragItem = null;
}



function redoDragHandlers(){
  const paragraphs = lyricContainer.querySelectorAll("p");
  for(let i=0; i<paragraphs.length; i++){
    paragraphs[i].ondragover = dragoverHandler;
    paragraphs[i].ondrop = dropHandler;
  }

  const spans = lyricContainer.querySelectorAll('span');
  for(let i=0; i<spans.length; i++){
    spans[i].draggable = true;
    spans[i].ondragstart = dragStartHandler;

    //mobile event handlers    
    spans[i].addEventListener("touchstart", touchStartHandler, { passive: false });
    spans[i].addEventListener("touchmove", touchMoveHandler, { passive: false });
    spans[i].addEventListener("touchend", touchEndHandler, { passive: false });

  }
}

document.getElementById("add-chord").onclick = function(){
  const chordInputs = chordBuilder.querySelectorAll("input");
  let node = document.createElement("div");
  let abort = false;
  let incHTML = true;
  for(let i=0; i<7; i++){
    if(chordInputs[i].value.trim() == ""){
      if(i == 0){
        abort = true;
      }
      else{
        incHTML = false;
      }
    }
  }
  if(abort){
    return;
  }
  else{
  node.innerHTML = chordGen(
    chordInputs[0].value.trim(), 
    chordInputs[1].value.trim().toUpperCase(),
    chordInputs[2].value.trim().toUpperCase(),
    chordInputs[3].value.trim().toUpperCase(),
    chordInputs[4].value.trim().toUpperCase(),
    chordInputs[5].value.trim().toUpperCase(),
    chordInputs[6].value.trim().toUpperCase()
  );
  previousChords.push(chordBuilder.innerHTML);
  previousChordsHTML.push(copyChords.innerHTML);
  previousChordOptions.push(chordOptions.innerHTML);
  chordBuilder.append(node);
  }
  if(incHTML){
    copyChords.append(node.innerHTML);
  }
  
  node = document.createElement("span");
  node.classList.add("chord-text");
  node.innerHTML = chordInputs[0].value.trim();
  document.getElementById("chord-options").append(node);
  node.onclick = function(){
    chordTextInput.value = node.textContent;
  }
}

const chordGen = (chord, f1, f2, f3, f4, f5, f6) =>
  `<div class="tab-container"><h3 class="chord-title">${chord}</h3><div class="tab-line">—<span class="fret">${f1}</span>—</div><div class="tab-line">—<span class="fret">${f2}</span>—</div><div class="tab-line">—<span class="fret">${f3}</span>—</div><div class="tab-line">—<span class="fret">${f4}</span>—</div><div class="tab-line">—<span class="fret">${f5}</span>—</div><div class="tab-line">—<span class="fret">${f6}</span>—</div></div>`;

function addBreakTags(text, target){
  let beg = 0;
  let str = text;
  let cont = true;
  
  while(cont){
    let end = str.indexOf("\n\n", beg);
    let sub = "";
    if(end == -1){
      cont = false;
      sub = str.substring(beg, str.length);
    }
    else{
      sub = str.substring(beg, end);
    }
    let node = document.createElement("p");
    node.innerHTML = sub.replaceAll("\n", "<br>");
    node.ondragover = dragoverHandler;
    node.ondrop = dropHandler;
    target.append(node);

    beg = end + 2;
  }
}

lyricConvert.onclick = () => {
  lyricContainer.innerHTML = "";
  let rawText = lyricInput.value;
  addBreakTags(rawText, lyricContainer);
};

lyricContainer.addEventListener("click", function (e) {
  if (!chordTextInput.value) return;
  const clientX = e.clientX || (e.touches ? e.touches[0].clientX : null);
  const clientY = e.clientY || (e.touches ? e.touches[0].clientY : null);
  if (clientX === null || clientY === null) return;


  const position = document.caretPositionFromPoint(e.clientX, e.clientY);

  if (position) {
    const range = document.createRange();
    range.setStart(position.offsetNode, position.offset);
    range.collapse(true);

    previousLyric.push(lyricContainer.innerHTML);
    const tag = document.createElement("span");
    tag.classList.add("chord-text");
    tag.draggable = true;
    tag.ondragstart = dragStartHandler;
    tag.innerHTML = chordTextInput.value;

    //mobile listeners added
    tag.addEventListener("touchstart", touchStartHandler, { passive: false });
    tag.addEventListener("touchmove", touchMoveHandler, { passive: false });
    tag.addEventListener("touchend", touchEndHandler, { passive: false });


    //avoid nested span tags
    let currentTarget = range.startContainer;
    if(currentTarget.nodeType === Node.TEXT_NODE){
      currentTarget = currentTarget.parentElement;
    }

    //see if closest node is a span tag, then insert
    const existingSpan = currentTarget.closest('span');
    if(existingSpan){
      if (chordTextType.value == "spaced") {
        existingSpan.parentNode.insertBefore(document.createTextNode(" "), existingSpan);
        existingSpan.parentNode.insertBefore(tag, existingSpan);
        existingSpan.parentNode.insertBefore(document.createTextNode(" "), existingSpan);
      } else {
        existingSpan.parentNode.insertBefore(tag, existingSpan);
      }
    }
    else{
      if (chordTextType.value == "spaced") {
        range.insertNode(document.createTextNode(" "));
        range.insertNode(tag);
        range.insertNode(document.createTextNode(" "));
      } else {
        range.insertNode(tag);
      }
    }
  }
});

finalize.onclick = function () {
  copyHTML.value = "";
  let rawCode = lyricContainer.innerHTML;
  rawCode = rawCode.replaceAll('draggable="true"', '');
  rawCode = rawCode.replaceAll("</p><p>","</p>\n\n<p>" );
  console.log(rawCode);
  copyHTML.value = rawCode;
  navigator.clipboard.writeText(rawCode);
};

undoLyric.onclick = function () {
  if(previousLyric.length > 0){
    lyricContainer.innerHTML = previousLyric.pop();
    redoDragHandlers();
  }
};

undoChord.onclick = function(){
  if(previousChords.length > 0){
    chordBuilder.innerHTML = previousChords.pop();
    copyChords.innerHTML = previousChordsHTML.pop();
    chordOptions.innerHTML = previousChordOptions.pop();
  }
}

lyricInput.value = "Notes: \n\nIntro: \n\n";