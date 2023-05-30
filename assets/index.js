//this index.js file adds functionality to the nothes.html page
//this variables are declared to store references to various elements in the html 
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

//this conditional checks if the current URL path is /notes, if true it initializes the 
//variables by selecting the corresponding elements from the DOM
//window.location.pathname returns the path of the current URL 
if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

//this function is used in the code to show or hide certain elements based on certain conditions 
//show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
//activeNote is set as and empty object
let activeNote = {};


//sends a GET request to retrieve the notes from the server, uses fetch API to make an HTTP request to /api/notes
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET', //specifies thet the method is GET, indicating that the intentions is to retrieve data 
    headers: { //sets the request headers, specifying that the content type of the request is JSON
      'Content-Type': 'application/json',
    },
  });

  //sends a POST request to the /api/notes endpoint to save a new note on the server
const saveNote = (note) =>
  fetch('/api/notes', { ///api/notes URL its the API endpoint for retrievieng notes 
    method: 'POST', //POST method is used to send data to the server for crerating a new note 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note), //convert the note objetc into a JSON string
  });

//sends a DELETE request to /api/notes to delete a note with a specified ID 
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

//Rendering functions
//renderActiveNote() updates the UI based on the currently selected active note
const renderActiveNote = () => {
  hide(saveNoteBtn); //hides the saveNoteBtn when rendering the active note 

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

//when the save button is clicked, it creates a new note object from the tittle and text inputs
//sends a request to save the note to the server 
const handleNoteSave = () => {
  const newNote = { //new note
    title: noteTitle.value, //title 
    text: noteText.value, //text 
  };
  saveNote(newNote).then(() => { //saveNote sends a POST request to the /api/notes endpoint with the new note object as request body 
    getAndRenderNotes(); //then it calls this ffunction to retrieve the updated list of notes form the server and render it in the screen 
    renderActiveNote(); //function updates the UI based on the currently selected active note
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => { //e its a parameter
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target; //assigns the clicked delete button element to the note variable
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id; //retrieves the ID of the note that its going to be deleated

  if (activeNote.id === noteId) { //if the noteID matches the id of the current note, it means that the active note is being deleted so ActiveNote is reset to an empty object 
    activeNote = {};
  }

  deleteNote(noteId).then(() => { 
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note')); //retrieves data associated with the clicked note
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

//shows or hude the saveBtn based on the content of the note
const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn); //if the trimmed values of title and text are empty, hide function is called
  } else {
    show(saveNoteBtn); //if both have content the condition evaluates false and else block is executed 
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => { //notes as a parameter is the response objetc containing the notes retrieved from the server
  let jsonNotes = await notes.json(); //wait fot the promiste to resolve and assign the parsed JSON data to jsonNotes 
  if (window.location.pathname === '/notes') { //if this matches the function updates the HTML content of each element in the noteList
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = []; //this variable is used to store the generated HTML elements for each note in the note list 

//this function is used within the renderNoteList functon to generrate the html elements for each note 
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item'); //crates a li elment and adds CSS class to it 

    const spanEl = document.createElement('span'); //creates span elment and adds the css class
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i'); //if dlBTN is true, it creates an i element representing a delete btn
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete); //adds an event listener to the delete button for a clcik event and calling the handleNote delete 

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) { 
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
//getAndRenderNotes() is called to retrieve the notes from the server and render them in the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

//fucntion called
getAndRenderNotes();
