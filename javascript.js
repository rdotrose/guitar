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
const dbPath = 'https://rdotrose.github.io/guitar/guitar.db';
const changeLog = [];

let currentId;
let currentTitle;
let sortTitle = false;
let sortTitleAsc = true;
let sortArtist = false;
let sortArtistAsc = true;
let sortTime = true;
let sortTimeDesc = true;
let sortTotal = false;
let sortTotalDesc = true;
let lastScrollPos = 0;
let showChords = false;
let scrollInterval;
let scrollOn = false;
let scrollSpeed = 1;
let scrollFreq = 51;

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
  if(scrollSpeed > 1){
    scrollSpeed--;
    console.log(scrollSpeed);
  }
}

scrollPlus.onclick = function(){
  if(scrollSpeed <= 4){
    scrollSpeed++;
    console.log(scrollSpeed);
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
}

function popTable(objArray){
  mainTable.innerHTML = '<button id="title-button" class="table-header">Title</button><button id="artist-button" class="table-header">Artist</button><button id="total-button" class="table-header">Times Played</button><button id="time-button" class="table-header">Last Played</button><p class="table-header">Lyrics <br class="query-small">Link</p>';
  document.getElementById("title-button").onclick = function(){
    sortTitle = true;
    initDatabase();
  }
  document.getElementById("artist-button").onclick = function(){
    sortArtist = true;
    initDatabase();
  }
  document.getElementById("total-button").onclick = function(){
    sortTotal = true;
    initDatabase();
  }
  document.getElementById("time-button").onclick = function(){
    sortTime = true;
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
      chordsInsert.innerHTML = objArray[i].chords;
      titleInsert.innerHTML = objArray[i].title;
      lyricsInsert.innerHTML = objArray[i].lyrics;
      currentId = objArray[i].id;
      currentTitle = objArray[i].title;
      showLyrics();
      //create button that can update last played
    }
  }
}


//function must be asynchronous
async function initDatabase() {
  const SQL = await initSqlJs({
    // locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
    //without arrow notation
    locateFile: function(file){
      return 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/' + file;
    }
  });

  const response = await fetch(dbPath);
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const db = new SQL.Database(uint8Array);
  

  // Query
  //the res variable doesn't seem to exist outside of the if statement. That's why the repeated code
  //it's a javascript scope thing... repeated code vs using let for 'res' above the if block
  let res;
  if(sortTitle){
    if(sortTitleAsc){
      res = db.exec("SELECT * FROM songs ORDER BY title, artist, times_played DESC, last_played DESC");
    }
    else{
      res = db.exec("SELECT * FROM songs ORDER BY title DESC, artist, times_played DESC, last_played DESC");
    }
    sortTitleAsc = !sortTitleAsc;
  }
  else if(sortArtist){
    if(sortArtistAsc){
      res = db.exec("SELECT * FROM songs ORDER BY artist, title, times_played DESC, last_played DESC");
    }
    else{
      res = db.exec("SELECT * FROM songs ORDER BY artist DESC, title, times_played DESC, last_played DESC");
    }
    sortArtistAsc = !sortArtistAsc;
  }
  else if(sortTotal){
    if(sortTotalDesc){
      res = db.exec("SELECT * FROM songs ORDER BY times_played DESC, title, artist, last_played DESC");
    }
    else{
      res = db.exec("SELECT * FROM songs ORDER BY times_played, title, artist, last_played DESC");
    }
    sortTotalDesc = !sortTotalDesc;
  }
  else{
    if(sortTimeDesc){
      res = db.exec("SELECT * FROM songs ORDER BY last_played DESC, title, artist, times_played DESC");
    }
    else{
      res = db.exec("SELECT * FROM songs ORDER BY last_played, title, artist, times_played DESC");
    }
    sortTimeDesc = !sortTimeDesc;
  }
  
  const rows = mapRows(res[0]);
  popTable(rows);
  
  sortTitle = false;
  sortArtist = false;
  sortTime = false;
  sortTotal = false;
}

async function updateDatabase() {
    changeLog.push([currentId, currentTitle, timestamp]);
    // Saving to the database directly didn't work on GitHub, so I'll have to track changes manually

    //   const SQL = await initSqlJs({
    //     // locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
    //     //without arrow notation
    //     locateFile: function(file){
    //       return 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/' + file;
    //     }
    //   });

    //   const response = await fetch('https://rdotrose.github.io/guitar/guitar.db');
    //   const arrayBuffer = await response.arrayBuffer();
    //   const uint8Array = new Uint8Array(arrayBuffer);

    //   const db = new SQL.Database(uint8Array);
    
    //   //update record
    //   let updateString = "UPDATE songs SET times_played = times_played + 1, last_played = " + timestamp + "  WHERE id = " + currentId;
    //   db.run(updateString);
    //   console.log(updateString);
        
    //   // Export the modified database
    //   const data = db.export();
    //   const buffer = Buffer.from(data);
    //   fs.writeFileSync(dbPath, buffer); 
}

function writeChanges(){
    changes.innerHTML = "";
    let output = "";
    for(let i=0; i<changeLog.length; i++){
        output += `<p>Song ID: ${changeLog[i][0]},    Song Title: ${changeLog[i][1]},    Date: ${changeLog[i][2]}`
    }
    changes.innerHTML = output;
}

showChanges.onclick = function(){
    writeChanges();
}

const guitarAnimation = lottie.loadAnimation({
    container: guitarContainer,
    path: 'https://rdotrose.github.io/guitar/guitarAnimation.json',
    render: 'svg',
    loop: true,
    autoplay: true
  });
initDatabase();