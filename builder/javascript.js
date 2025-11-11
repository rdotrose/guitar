const lyricConvert = document.getElementById("lyric-convert");
const lyricInput = document.getElementById("lyric-input");
const lyricContainer = document.getElementById("lyric-container");
const copyHTML = document.getElementById("copy-HTML");
const chordTextType = document.getElementById("chord-text-type");
const chordTextInput = document.getElementById("chord-text-input");
const finalize = document.getElementById("finalize");
const undo = document.getElementById("undo");
let previousText = "";

document.getElementById("add-chord").onclick = function(){
  const chordBuilder = document.getElementById("chord-builder");
  const chordInputs = chordBuilder.querySelectorAll("input");
  let node = document.createElement("div");
  node.innerHTML = chordGen(
    chordInputs[0].value.trim(), 
    chordInputs[1].value.trim(),
    chordInputs[2].value.trim(),
    chordInputs[3].value.trim(),
    chordInputs[4].value.trim(),
    chordInputs[5].value.trim(),
    chordInputs[6].value.trim()
  );
  chordBuilder.append(node);
  document.getElementById("copy-chords").append(node.innerHTML);
  
  node = document.createElement("span");
  node.classList.add("chord-text");
  node.innerHTML = chordInputs[0].value.trim();
  document.getElementById("chord-options").append(node);
  node.onclick = function(){
    chordTextInput.value = node.textContent;
  }
}

const chordGen = (chord, f6, f5, f4, f3, f2, f1) =>
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
    console.log(sub);
    let node = document.createElement("p");
    node.innerHTML = sub.replaceAll("\n", "<br>");
    target.append(node);

    beg = end + 2;
  }
}

lyricConvert.onclick = () => {
  lyricContainer.innerHTML = "";
  const rawText = lyricInput.value;
  console.log(rawText, lyricContainer);
  addBreakTags(rawText, lyricContainer);


  // converted = converted.replaceAll("@@p", "</p>");
  // converted = converted.replaceAll("@p", "<p>");
  // converted = converted.replaceAll("@br", "<br>");
  // converted = converted.replaceAll("@@sp", "</span>");
  // converted = converted.replaceAll("@sp", '<span class="chord-text">');
  // converted = converted.replaceAll(/(?:\r\n|\r|\n)/g, "");
};

lyricContainer.addEventListener("click", function (e) {
  const range = document.caretRangeFromPoint(e.clientX, e.clientY);
  //for future, try caretPositionFromPoint?

  if (range) {
    previousText = lyricContainer.innerHTML;
    const tag = document.createElement("span");
    tag.classList.add("chord-text");
    tag.innerHTML = chordTextInput.value;
    if (chordTextType.value == "spaced") {
      range.insertNode(document.createTextNode(" "));
      range.insertNode(tag);
      range.insertNode(document.createTextNode(" "));
    } else {
      range.insertNode(tag);
    }
  }
});

finalize.onclick = function () {
  copyHTML.value = "";
  copyHTML.value = lyricContainer.innerHTML;
  navigator.clipboard.writeText(lyricContainer.innerHTML);
};

undo.onclick = function () {
  lyricContainer.innerHTML = previousText;
};

lyricInput.value = "Notes: \n\nIntro: \n\n";