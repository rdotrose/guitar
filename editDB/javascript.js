const newItem = document.getElementById("new-item");
const searchItem = document.getElementById("search-item");
const editItem = document.getElementById("edit-item");
const formSpace = document.getElementById("form-space");
const modal = document.getElementById("modal");

function showModal(displayText){
  modal.style.opacity = 0.98;
  modal.style.pointerEvents = "auto";
  modal.innerHTML = displayText;
}

function clearModal(){
  modal.style.opacity = 0;
  setTimeout(function(){
    modal.innerHTML = "";
    modal.style.pointerEvents = "none";
  }, 1000);
}

function createPasswordListener(){
  showModal(
    `
    <p>Please enter your password</p>
    <input id="user-password" type="password" autocomplete="off">
    <button id="password-submit">Submit</button>
    `);
  document.getElementById("user-password").focus();
  document.getElementById("password-submit").onclick = function(){
    let password = document.getElementById("user-password").value.trim();
    checkPassword(password);
  }
  document.getElementById("user-password").addEventListener("keypress", function(event){
    if(event.key == "Enter"){
      document.getElementById("password-submit").click();
    }
  })
}

async function checkPassword(userPassword) {

  if (!userPassword) {
    window.location.href = "/index.html";
    return;
  }

  try {
    const response = await fetch("/api/crud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "auth",
        password: userPassword
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      showModal("<p>Incorrect password. Redirecting...</p>")
      window.location.href = "/index.html";
    } else {
      //store password in sessionStorage for later use
      sessionStorage.setItem("adminPassword", userPassword);
      clearModal();
      document.getElementById("page-container").style.visibility = "visible";
    }
  } catch (err) {
    console.error("Auth failed:", err);
    window.location.href = "/index.html";
  }
}


newItem.onclick = function(){
  formSpace.style.background = "#FFFFFF";
  newItem.style.borderBottom = "1px solid #FFFFFF"
  searchItem.style.borderBottom = "1px solid var(--darkFont)"
  editItem.style.borderBottom = "1px solid var(--darkFont)"
  newItem.style.zIndex = 2;
  searchItem.style.zIndex = 0;
  editItem.style.zIndex = 0;
  
  formSpace.innerHTML = `
  <form id="new-form">
      <label for="title">Title</label>
      <input type="text" id="title" name="title" required>
      <label for="artist">Artist</label>
      <input type="text" id="artist" name="artist"required>
      <label for="capo">Capo</label>
      <select name="capo" id="capo">
        <option value="None">None</option>
        <option value="1st Fret">1st Fret</option>
        <option value="2nd Fret">2nd Fret</option>
        <option value="3rd Fret">3rd Fret</option>
        <option value="4th Fret">4th Fret</option>
        <option value="5th Fret">5th Fret</option>
        <option value="6th Fret">6th Fret</option>
        <option value="7th Fret">7th Fret</option>
        <option value="8th Fret">8th Fret</option>
        <option value="9th Fret">9th Fret</option>
        <option value="10th Fret">10th Fret</option>
      </select>
      <label for="chords">Chords</label>
      <textarea name="chords" id="chords" required></textarea>
      <label for="lyrics">Lyrics</label>
      <textarea name="lyrics" id="lyrics" required></textarea>
      <input type="submit" id="save" class="lyrics-link" value="Save">
    </form>
    `;
  document.getElementById("new-form").addEventListener('submit', async function(e){
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    
    const data = {
      password: window.sessionStorage.getItem('adminPassword'),
      title: formData.get('title'),
      artist: formData.get('artist'),
      capo: formData.get('capo'),
      chords: formData.get('chords'),
      lyrics: formData.get('lyrics'),
      action: 'create' // if you're using a unified API endpoint
    };    
    
    try {
      const response = await fetch('/api/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        showModal('<p>Song saved successfully!</p>');
        setTimeout(clearModal, 1500);
        e.target.reset(); // Clear the form
      } else {
        showModal('<p>Error: ' + result.error + '</p>');
        setTimeout(clearModal, 1500);
      }
    }catch (err) {
    console.error('Request failed:', err);
    showModal('<p>Request failed: ' + err.message + '</p>');
    setTimeout(clearModal, 1500);
    }

  });
}

searchItem.onclick = function(){
  formSpace.style.background = "var(--lightBG)";
  searchItem.style.borderBottom = "1px solid var(--lightBG)"
  newItem.style.borderBottom = "1px solid var(--darkFont)"
  editItem.style.borderBottom = "1px solid var(--darkFont)"
  newItem.style.zIndex = 0;
  searchItem.style.zIndex = 2;
  editItem.style.zIndex = 0;

  
  formSpace.innerHTML = `
  <form id="search-form">
      <label for="id">ID</label>
      <input type="text" id="id" name="id">
      <input type="submit" class="lyrics-link" id="search-id" value="Search">
      <label for="title">title</label>
      <input type="text" id="title" name="title">
      <input type="submit" class="lyrics-link" id="search-title" value="Search">
    </form>
    <div id="search-results">
      <label for="id-result">ID</label>
      <input type="text" id="id-result" name="id-result">
      <label for="title-result">Title</label>
      <input type="text" id="title-result" name="title-result">
      <label for="artist-result">Artist</label>
      <input type="text" id="artist-result" name="artist-result">
    </div>
  `;
  
  
  document.getElementById('search-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('id').value.trim();
    const title = document.getElementById('title').value.trim();

    let searchParams = {
      action: 'read'
    };

    if (id) {
      searchParams.id = id;
    } else if (title) {
      searchParams.title = title;
    } else {
      showModal('<p>Please enter an ID or Title to search.</p>');
      setTimeout(clearModal, 1500);
      return;
    }

    try {
      const response = await fetch('/api/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams)
      });

      const result = await response.json();

      if (response.ok && result.song) {
        document.getElementById('id-result').value = result.song.id;
        document.getElementById('title-result').value = result.song.title;
        document.getElementById('artist-result').value = result.song.artist;
      } else {
        showModal('<p>Song not found</p>');
        setTimeout(clearModal, 1500);
      }
    } catch (err) {
      console.error('Search failed:', err);
      showModal('<p>Something went wrong</p>');
      setTimeout(clearModal, 1500);
    }
  });

}

editItem.onclick = function(){
  formSpace.style.background = "var(--lightBG2)";
  editItem.style.borderBottom = "1px solid var(--lightBG2)"
  newItem.style.borderBottom = "1px solid var(--darkFont)"
  searchItem.style.borderBottom = "1px solid var(--darkFont)"
  newItem.style.zIndex = 0;
  searchItem.style.zIndex = 0;
  editItem.style.zIndex = 2;
  
  formSpace.innerHTML = `
  <form id="edit-search">
      <label for="id">ID</label>
      <input type="text" id="id" name="id" required>
      <input type="submit" class="lyrics-link" id="search-id" value="Search">
    </form>
    <form id="edit-form">
      <label for="edit-id">ID</label>
      <input type="text" id="edit-id" name="edit-id" required>
      <label for="edit-title">Title</label>
      <input type="text" id="edit-title" name="edit-title" required>
      <label for="edit-artist">Artist</label>
      <input type="text" id="edit-artist" name="edit-artist"required>
      <label for="edit-capo">Capo</label>
      <input type="text" name="edit-capo" id="edit-capo" required>
      <label for="edit-chords">Chords</label>
      <textarea name="edit-chords" id="edit-chords" required></textarea>
      <label for="edit-lyrics">Lyrics</label>
      <textarea name="edit-lyrics" id="edit-lyrics" required></textarea>
      <label for="edit-times-played">Times Played</label>
      <input type="text" id="edit-times-played" name="edit-times-played" required>
      <label for="edit-last-played">Last Played</label>
      <input type="text" id="edit-last-played" name="edit-last-played" required>
      <input type="submit" id="save" class="lyrics-link" value="Save">
    </form>
  `;
  
  
  document.getElementById('edit-search').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = Number(document.getElementById('id').value.trim());

    if (!id) {
      showModal('<p>Please enter a valid ID</p>');
      setTimeout(clearModal, 1500);
      return;
    }

    try {
      const response = await fetch('/api/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read', id })
      });

      const result = await response.json();

      if (response.ok && result.song) {
        document.getElementById('edit-id').value = result.song.id;
        document.getElementById('edit-title').value = result.song.title;
        document.getElementById('edit-artist').value = result.song.artist;
        document.getElementById('edit-capo').value = result.song.capo;
        document.getElementById('edit-chords').value = result.song.chords;
        document.getElementById('edit-lyrics').value = result.song.lyrics;
        document.getElementById('edit-times-played').value = result.song.times_played;
        document.getElementById('edit-last-played').value = result.song.last_played;
      } else {
        showModal('<p>Song not found</p>');
        setTimeout(clearModal, 1500);
      }
    } catch (err) {
      console.error('Search failed:', err);
      showModal('<p>Something went wrong</p>');
      setTimeout(clearModal, 1500);
    }
  });
  
  
  document.getElementById('edit-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
      password: window.sessionStorage.getItem('adminPassword'),
      action: 'update',
      id: Number(document.getElementById('edit-id').value),
      title: document.getElementById('edit-title').value,
      artist: document.getElementById('edit-artist').value,
      capo: document.getElementById('edit-capo').value,
      chords: document.getElementById('edit-chords').value,
      lyrics: document.getElementById('edit-lyrics').value,
      times_played: Number(document.getElementById('edit-times-played').value),
      last_played: document.getElementById('edit-last-played').value
    };

    console.log(data);

    try {
      const response = await fetch('/api/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        showModal('<p>Song updated successfully!</p>');
        setTimeout(clearModal, 1500);
      } else {
        showModal('<p>Update failed: ' + result.error + '</p>');
        setTimeout(clearModal, 1500);
      }
    } catch (err) {
      console.error('Update failed:', err);
      showModal('<p>Something went wrong</p>');
      setTimeout(clearModal, 1500);
    }
  });

}

function pageLoad(){
  console.log("pageLoad running");
  document.getElementById("new-form").addEventListener('submit', async function(e){
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  
  const data = {
    password: window.sessionStorage.getItem('adminPassword'),
    title: formData.get('title'),
    artist: formData.get('artist'),
    capo: formData.get('capo'),
    chords: formData.get('chords'),
    lyrics: formData.get('lyrics'),
    action: 'create' // if you're using a unified API endpoint
  };    
  
  try {
    const response = await fetch('/api/crud', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      showModal('<p>Song saved successfully!</p>');
      setTimeout(clearModal, 1500);
      e.target.reset(); // Clear the form
    } else {
      showModal('<p>Error: ' + result.error + '</p>');
      setTimeout(clearModal, 1500);
    }
  }catch (err) {
  console.error('Request failed:', err);
  showModal('<p>Request failed: ' + err.message + '</p>');
  setTimeout(clearModal, 1500);
  }

});
}


console.log("Script loaded");
window.onload = function() {
  console.log("window.onload fired");
  pageLoad();
  createPasswordListener();
};