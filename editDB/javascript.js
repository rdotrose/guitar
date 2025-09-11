const newItem = document.getElementById("new-item");
const searchItem = document.getElementById("search-item");
const editItem = document.getElementById("edit-item");
const formSpace = document.getElementById("form-space");

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
        alert('Song saved successfully!');
        e.target.reset(); // Clear the form
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      console.error('Request failed:', err);
      alert('Something went wrong.');
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
      alert('Please enter an ID or Title to search.');
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
        alert('Song not found.');
      }
    } catch (err) {
      console.error('Search failed:', err);
      alert('Something went wrong.');
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
      <input type="text" id="edit-id" name="edit-id">
      <label for="edit-title">Title</label>
      <input type="text" id="edit-title" name="edit-title" required>
      <label for="edit-artist">Artist</label>
      <input type="text" id="edit-artist" name="edit-artist"required>
      <label for="edit-capo">Capo</label>
      <select name="edit-capo" id="edit-capo">
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
      <label for="edit-chords">Chords</label>
      <textarea name="edit-chords" id="edit-chords" required></textarea>
      <label for="edit-lyrics">Lyrics</label>
      <textarea name="edit-lyrics" id="edit-lyrics" required></textarea>
      <input type="submit" id="save" class="lyrics-link" value="Save">
    </form>
  `;
  
  
  document.getElementById('edit-search').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = Number(document.getElementById('id').value.trim());

    if (!id) {
      alert('Please enter a valid ID.');
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
        document.getElementById('edit-capo').value = result.song.capo || 'None';
        document.getElementById('edit-chords').value = result.song.chords || '';
        document.getElementById('edit-lyrics').value = result.song.lyrics || '';
      } else {
        alert('Song not found.');
      }
    } catch (err) {
      console.error('Search failed:', err);
      alert('Something went wrong.');
    }
  });
  
  
  document.getElementById('edit-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
      action: 'update',
      id: Number(document.getElementById('edit-id').value),
      title: document.getElementById('edit-title').value,
      artist: document.getElementById('edit-artist').value,
      capo: document.getElementById('edit-capo').value,
      chords: document.getElementById('edit-chords').value,
      lyrics: document.getElementById('edit-lyrics').value
    };

    try {
      const response = await fetch('/api/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Song updated successfully!');
      } else {
        alert('Update failed: ' + result.error);
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert('Something went wrong.');
    }
  });


}