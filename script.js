const subjectData = JSON.parse(localStorage.getItem("6092026subData")) || {};
const currentSub = document.querySelector("#subject");
const subjectName = document.getElementById("subjectName");
const notesSection = document.getElementById("notesSection");
const editor = document.getElementById('editor');
const editInp = document.getElementById('editInp');

let editingIndex = null;


console.log(subjectData)
window.addEventListener("load", () => {
    for (const newSub of Object.keys(subjectData)) {
        console.log(newSub);
        currentSub.innerHTML += `<option value="${newSub}" class="option">${newSub}</option>`;
    }
    updateSubMenu();

})

const updateSubMenu = () => {
    msl = '';
    for (const newSub of Object.keys(subjectData)) {
        msl += `<div class="menuSub">
                    <span class="menuSubName">${newSub}</span>
                    <div>
                        <button class="addNew" onclick="editSubject('${newSub}')">change name</button>
                        <button class="delete" onclick="delSubject('${newSub}')"">delete</button>
                    </div>
                </div> `;
    }
    menuSubList.innerHTML = msl;
}

const cleanText = (originalText) => {
    if (!originalText) return '';
    return originalText.trim().replace(/\s+/g, '_');
}

const getDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
}

const addSubject = () => {
    const input = prompt("Subject name: ");
    if (!input) return; // Handle cancel button or empty values

    let newSub = cleanText(input.toUpperCase());
    if (!newSub) return alert("Invalid subject name.");

    if (subjectData[newSub]) {
        alert("Subject already exists");
    } else {
        subjectData[newSub] = { notes: [] };
        currentSub.innerHTML += `<option value="${newSub}" class="option">${newSub}</option>`;
        currentSub.value = newSub; // Auto-select the newly created subject
        subjectName.innerHTML = newSub;
        save();
        update();
        updateSubMenu();
    }
}


const delSubject = (sub = cleanText(prompt("Subject name").toUpperCase())) => {

    if (subjectData[`${sub}`]) {
        let proceed = confirm(`Are you sure you want to delete '${sub}'? It's data can NEVER be recovered`);
        if (proceed) {
            delete subjectData[sub];
            let optionToDelete = document.querySelector(`option[value=${sub}]`);
            if (sub == currentSub.value) {
                currentSub.value = 'none';
                subjectName.innerHTML = 'None';
                notesSection.innerHTML = `<div class="note"><label class="date">Config</label> <span class="note-info">Select or add a new Subject to add notes</span ></div>`;
            }
            if (optionToDelete) {
                optionToDelete.remove();
            }
            alert("Deleted successfully.");
            save();
            update();
            updateSubMenu();
        } else alert("Item was not deleted :)");
    } else alert("Subject does not exist.");
    console.log(subjectData);
}

currentSub.addEventListener("change", () => {
    subjectName.innerHTML = currentSub.value;
    // Close active editor if changing subjects
    editor.hidden = true;
    editingIndex = null;
    update();
});

const update = () => {
    let noteList = '';
    const activeSubject = currentSub.value;

    if (activeSubject !== 'none' && subjectData[activeSubject]) {
        subjectData[activeSubject]['notes'].forEach((note, i) => {
            noteList += `
                        <div class="note">
                            <label class="date">${note.date} |</label>
                            <span class="note-info">${note.info}</span>
                            <button class="delete" onclick="deleteNote(${i})">delete</button>
                            <button class="addNew" onclick="toggleEditor(${i})">edit</button>
                        </div>`;
        });
    }
    notesSection.innerHTML = noteList;


}

const addNote = () => {
    const activeSubject = currentSub.value;
    if (activeSubject === 'none') {
        return alert("Please pick or create a subject first!");
    }

    const newNote = document.getElementById("newNote");
    const date = getDate();

    if (newNote.value.trim() !== '') {
        subjectData[activeSubject]['notes'].push({ info: newNote.value, date: date });
        newNote.value = '';
        update();
        save();
    } else {
        alert("Please fill in the textbox");
    }
}

const deleteNote = (pos) => {
    const activeSubject = currentSub.value;
    // Use splice instead of delete to keep array clean and unbroken
    subjectData[activeSubject]['notes'].splice(pos, 1);

    // If the note being edited gets deleted, shut down the editor panel
    if (editingIndex === pos) {
        editor.hidden = true;
        editingIndex = null;
    }
    update();
    save();
}

const toggleEditor = (pos) => {
    if (pos === undefined) {
        // Triggered by cancel button
        editor.hidden = true;
        editingIndex = null;
        return;
    }

    editingIndex = pos;
    const activeSubject = currentSub.value;
    const text = subjectData[activeSubject]['notes'][pos];

    // Use .value instead of .innerHTML for textareas to prevent UI sync errors
    editInp.value = text.info;
    editor.hidden = false;
}

const editNote = () => {
    if (editingIndex === null) return;

    const activeSubject = currentSub.value;
    if (editInp.value.trim() !== '') {
        subjectData[activeSubject]['notes'][editingIndex].info = editInp.value;
        editInp.value = '';
        editor.hidden = true;
        editingIndex = null;
        update();
        save();
    } else {
        alert("Please fill in the textbox");
    }
}
const save = () => {
    localStorage.setItem("6092026subData", JSON.stringify(subjectData));
}
const toggleSubMenu = () => {
    subjectMenu.hidden = !subjectMenu.hidden;
}
const editSubject = (sub) => {
    const currentKeyName = sub // This can vary dynamically
    let newName = cleanText(prompt("New name:").toUpperCase());
    if (newName in subjectData) {
        alert("Name already used");
        return;
    }
    const newKeyName = newName; // This can vary dynamically

    // 1. Assign the value to the new dynamic key name
    subjectData[newKeyName] = subjectData[currentKeyName];

    // 2. Delete the old dynamic key name
    delete subjectData[currentKeyName];

    let optionToDelete = document.querySelector(`option[value=${sub}]`);
    if (optionToDelete) {
        optionToDelete.remove();
    }
    if (currentSub.value == sub) {
        currentSub.innerHTML += `<option value="${newName}" class="option">${newName}</option>`;
        currentSub.value = newName;
        subjectName.innerHTML = newName;
    }

    console.log(JSON.stringify(subjectData));
    save();
    update();
    updateSubMenu();
}