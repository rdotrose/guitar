const pageContainer = document.getElementById("page-container");
const chordsInsert = document.getElementById("chords-insert");
const titleInsert = document.getElementById("title-insert");
const lyricsInsert = document.getElementById("lyrics-insert");
const mainTable = document.getElementById("main-table");
const lyricChordContainer = document.getElementById("lyric-chord-container");
const chordToggle = document.getElementById("chord-toggle");
const autoscrollToggle = document.getElementById("autoscroll-toggle");
const scrollPlus = document.getElementById("scroll-plus");
const scrollMinus = document.getElementById("scroll-minus");
const markPlayed = document.getElementById("mark-played");
const animationContainer = document.getElementById("animation-container");
const guitarContainer = document.getElementById("guitar-container");
const showChanges = document.getElementById("show-changes");
const changes = document.getElementById("changes");
const date = new Date();
const timestamp = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
const changeLog = [];

let currentId;
let currentTitle;
let capoVal = "";
let sortTitle = true;
let sortTitleAsc = true;
let sortArtist = false;
let sortArtistAsc = true;
let sortTime = false;
let sortTimeDesc = true;
let sortTotal = false;
let sortTotalDesc = true;
let lastScrollPos = 0;
let showChords = false;
let scrollInterval;
let scrollOn = false;
let scrollSpeed = 1;
let scrollFreq = 152;

function mapRows(resultSet) {
  const columns = resultSet.columns;
  const values = resultSet.values;
  const rows = [];

  for (let i = 0; i < values.length; i++) {
    const row = values[i];  //accesses one 'table row'
    const rowObject = {};
    for (let j = 0; j < columns.length; j++) {
      //defines the properties of the object based on the column names
      rowObject[columns[j]] = row[j];
    }
    rows.push(rowObject);
  }
  return rows;
}

function showLyrics(){
  lyricChordContainer.style.left = "0vw";
  // lyricChordContainer.scrollTop = 0;
  // while (window.scrollY > 0){
  //   window.scrollTop -= 1; 
  // }
  toggleChords();
  lastScrollPos = window.scrollY;
  setTimeout(function(){window.scrollTo(0,0)}, 250);
}

function hideLyrics(){
  lyricChordContainer.style.left = "100vw";
  showChords = !showChords;
  animationContainer.style.display = "none";
  setTimeout(function(){window.scrollTo(0,lastScrollPos)}, 150);
}

//create back button function
for(let i=0; i<document.getElementsByClassName("back").length; i++){
  document.getElementsByClassName("back")[i].onclick = function(){
    hideLyrics();
  }
}

function toggleChords(){
  //select lyrics insert and start with the 3rd p tag to turn off 
  for(let i=2; i<lyricsInsert.querySelectorAll("p").length; i++){
    //then select all chord-text elements to set their display to 'none'
    for(let j=0; j<lyricsInsert.querySelectorAll("p")[i].getElementsByClassName("chord-text").length; j++){
      if(showChords){
        lyricsInsert.querySelectorAll("p")[i].getElementsByClassName("chord-text")[j].style.display = "none";
      }
      else{
        lyricsInsert.querySelectorAll("p")[i].getElementsByClassName("chord-text")[j].style.display = "inline-block";
      }
    }
  }
  showChords = !showChords;
}

chordToggle.onclick = function(){
  toggleChords();
  if(showChords){
    chordToggle.innerHTML = "Clean Lyrics";
  }
  else{
    chordToggle.innerHTML = "With Chords";
  }
}

function autoscroll(){
  if(scrollOn){
    // autoscrollToggle.disabled = false;
    clearInterval(scrollInterval);
  }
  else{ //begin autoscroll
    // autoscroll.disabled = true;
    scrollInterval = setInterval(function(){
      let currentPos = window.scrollY;
      if((currentPos + scrollSpeed) > (lyricChordContainer.clientHeight - window.innerHeight)){
        window.scrollTo(0, lyricChordContainer.clientHeight - window.innerHeight);
        // autoscrollToggle.disabled = false;
        scrollOn = false;
        clearInterval(scrollInterval);
      }
      else{
        window.scrollTo(0, currentPos + scrollSpeed);
      }
    }, scrollFreq);
  }
  scrollOn = !scrollOn;
}

autoscrollToggle.onclick = function(){
  autoscroll();
}

scrollMinus.onclick = function(){
  if(scrollFreq < 254){
    scrollFreq += 17;
  }
  if(scrollOn){
    clearInterval(scrollInterval);
    scrollOn = false;
    autoscroll();
  }
  
}

scrollPlus.onclick = function(){
  if(scrollFreq > 16){
    scrollFreq -= 17;
  }
  if(scrollOn){
    clearInterval(scrollInterval);
    scrollOn = false; 
    autoscroll();
  }
  
}

function showCelebrate(){
  animationContainer.innerHTML = "";
  animationContainer.style.display = "block";
  const animation = lottie.loadAnimation({
    container: animationContainer,
    path: 'https://rdotrose.github.io/guitar/celebrateAnimation.json',
    render: 'svg',
    loop: false,
    autoplay: true
  });
}

markPlayed.onclick = function(){
  showCelebrate();
  updateDatabase();
  setTimeout(function(){
    initDatabase(true);
  }, 500)
}

function popTable(objArray){
  mainTable.innerHTML = '<button id="title-button" class="table-header">Title</button><button id="artist-button" class="table-header">Artist</button><button id="total-button" class="table-header">Times Played</button><button id="time-button" class="table-header">Last Played</button><p class="table-header">Lyrics <br class="query-small">Link</p>';
  document.getElementById("title-button").onclick = function(){
    sortTitle = true;
    sortArtist = false;
    sortTime = false;
    sortTotal = false;
    sortTitleAsc = !sortTitleAsc;
    initDatabase();
  }
  document.getElementById("artist-button").onclick = function(){
    sortArtist = true;
    sortTime = false;
    sortTotal = false;
    sortTitle = false;
    sortArtistAsc = !sortArtistAsc;
    initDatabase();
  }
  document.getElementById("total-button").onclick = function(){
    sortTotal = true;
    sortTitle = false;
    sortArtist = false;
    sortTime = false;
    sortTotalDesc = !sortTotalDesc;
    initDatabase();
  }
  document.getElementById("time-button").onclick = function(){
    sortTime = true;
    sortTotal = false;
    sortTitle = false;
    sortArtist = false;
    sortTimeDesc = !sortTimeDesc;
    initDatabase();
  }
  for(let i=0; i<objArray.length; i++){
    const titleNode = document.createElement("p");
    titleNode.classList.add("table-item");
    titleNode.innerHTML = objArray[i].title;
    mainTable.append(titleNode);
    
    const artistNode = document.createElement("p");
    artistNode.classList.add("table-item");
    artistNode.innerHTML = objArray[i].artist;
    mainTable.append(artistNode);
    
    const totalNode = document.createElement("p");
    totalNode.classList.add("table-item");
    totalNode.classList.add("times-played-stat");
    totalNode.innerHTML = objArray[i].times_played;
    mainTable.append(totalNode);
    
    const playedNode = document.createElement("p");
    playedNode.classList.add("table-item");
    playedNode.innerHTML = objArray[i].last_played;
    mainTable.append(playedNode);
    
    const buttonNode = document.createElement("button");
    buttonNode.classList.add("lyrics-link", "table-item");
    buttonNode.innerHTML = "Lyrics";
    mainTable.append(buttonNode);
    buttonNode.onclick = function(){
      capoVal = objArray[i].capo;
      chordsInsert.innerHTML = objArray[i].chords;
      titleInsert.innerHTML = objArray[i].title;
      lyricsInsert.innerHTML = objArray[i].lyrics;
      lyricsInsert.querySelectorAll("p")[0].innerHTML = "<p> Capo: " + capoVal + "</p>" + lyricsInsert.querySelectorAll("p")[0].innerHTML;
      currentId = objArray[i].id;
      currentTitle = objArray[i].title;
      showLyrics();
      //create button that can update last played
    }
  }
}

//new initDatabase function
async function initDatabase() {
  let sortParam = 'title';
  let direction = 'asc';

  if (sortTitle) {
    sortParam = 'title';
    direction = sortTitleAsc ? 'asc' : 'desc';
  } else if (sortArtist) {
    sortParam = 'artist';
    direction = sortArtistAsc ? 'asc' : 'desc';
  } else if (sortTotal) {
    sortParam = 'times_played';
    direction = sortTotalDesc ? 'desc' : 'asc';
  } else {
    sortParam = 'last_played';
    direction = sortTimeDesc ? 'desc' : 'asc';
  }

  const response = await fetch(`/api/songs?sort=${sortParam}&direction=${direction}`);
  const songs = await response.json();
  popTable(songs);
}

//New Update method
async function updateDatabase() {
  try {
    await fetch('/api/mark-played', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentId })
    });
    console.log(`Marked song ${currentTitle} as played.`);
  } catch (error) {
    console.error('Error updating song:', error);
  }
}

const guitarAnimation = lottie.loadAnimation({
    container: guitarContainer,
    path: 'https://rdotrose.github.io/guitar/guitarAnimation.json',
    render: 'svg',
    loop: true,
    autoplay: true
  });
initDatabase();