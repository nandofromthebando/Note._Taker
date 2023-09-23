document.addEventListener('DOMContentLoaded', function () {
  const noteInput = document.getElementById('note');
  const saveButton = document.getElementById('save');
  const notesContainer = document.getElementById('notes');
  const clearButton = document.getElementById('clear');
  window.resizeTo(1200, 800);
  // Load existing notes from storage
  chrome.storage.sync.get('notes', function (data) {
    if (data.notes) {
      const existingNotes = data.notes.split('\n');
      displayNotes(existingNotes);
    }
  });
  clearButton.addEventListener('click', function () {
    chrome.storage.sync.remove('notes', function () {
      notesContainer.textContent = '';
    });
  });
  
  // Save a new note
  saveButton.addEventListener('click', function () {
    const newNote = noteInput.value;
    chrome.storage.sync.get('notes', function (data) {
      let notes = data.notes || '';
      notes += (notes ? '\n' : '') + newNote;
      chrome.storage.sync.set({ 'notes': notes }, function () {
        const existingNotes = notes.split('\n');
        displayNotes(existingNotes);
        noteInput.value = '';
      });
    });
  });


  function displayNotes(noteList) {
    notesContainer.innerHTML = ''; // Clear existing content
    for (let i = 0; i < noteList.length; i++) {
      const noteItem = document.createElement('div');
      noteItem.textContent = `${i + 1}. ${noteList[i]}`;
  
      // Create a delete button for each note
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function () {
        removeNote(i);
      });
  
      // Append the delete button to the note
      noteItem.appendChild(deleteButton);
  
      notesContainer.appendChild(noteItem);
    }
  }
  function removeNote(index) {
    chrome.storage.sync.get('notes', function (data) {
      let notes = data.notes || '';
      const noteList = notes.split('\n');
      
      // Remove the selected note from the array
      if (index >= 0 && index < noteList.length) {
        noteList.splice(index, 1);
        notes = noteList.join('\n');
        
        // Update the storage and re-display the notes
        chrome.storage.sync.set({ 'notes': notes }, function () {
          displayNotes(noteList);
        });
      }
    });
  }
  
  
});
