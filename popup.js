document.addEventListener('DOMContentLoaded', function () {
    const noteInput = document.getElementById('note');
    const saveButton = document.getElementById('save');
    const notesContainer = document.getElementById('notes');
    const clearButton = document.getElementById('clear');
  
    // Load existing notes from storage
    chrome.storage.sync.get('notes', function (data) {
      if (data.notes) {
        const existingNotes = data.notes.split('\n');
        displayNotes(existingNotes);
      }
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
  
    // Clear all notes
    clearButton.addEventListener('click', function () {
      chrome.storage.sync.remove('notes', function () {
        notesContainer.textContent = '';
      });
    });
  
    function displayNotes(noteList) {
      notesContainer.innerHTML = ''; // Clear existing content
      for (let i = 0; i < noteList.length; i++) {
        const noteItem = document.createElement('div');
        noteItem.textContent = `${i + 1}. ${noteList[i]}`;
        notesContainer.appendChild(noteItem);
      }
    }
  });
  