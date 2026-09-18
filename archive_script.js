const archiveData = JSON.parse(localStorage.getItem("12092026archiveData")) || {};
const subjectData = JSON.parse(localStorage.getItem("6092026subData")) || {};
const currentSub = document.querySelector("#subject");
const subjectName = document.getElementById("subjectName");
const notesSection = document.getElementById("notesSection");
const editor = document.getElementById('editor');
const editInp = document.getElementById('editInp');
let editingIndex = null;


console.log(archiveData)
window.addEventListener("load", () => {
    for (const newSub of Object.keys(archiveData)) {
        console.log(newSub);
        currentSub.innerHTML += `<option value="${newSub}" class="option">${newSub}</option>`;
    }

})


const cleanText = (originalText) => {
    if (!originalText) return '';
    return originalText.trim().replace(/\s+/g, '_');
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

    if (activeSubject !== 'none' && archiveData[activeSubject]) {
        archiveData[activeSubject]['notes'].forEach((note, i) => {
            noteList += `
                        <div class="note">
                            <label class="date">${note.date} |</label>
                            <span class="note-info">${note.info}</span>
                            <button onclick="toggleTextExpand(this)">+Expand</button>
                            <button class="addNew" onclick="toggleEditor(${i})">edit</button>
                            <button class="delete" onclick="deleteNote(${i})">delete</button>
                            <button class="addNew" onclick="recoverNote(${i})">Recover</button>
                        </div>`;
        });
    }
    notesSection.innerHTML = noteList;


}


const deleteNote = (pos) => {
    const activeSubject = currentSub.value;
    // Use splice instead of delete to keep array clean and unbroken
    archiveData[activeSubject]['notes'].splice(pos, 1);

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
    const text = archiveData[activeSubject]['notes'][pos];

    // Use .value instead of .innerHTML for textareas to prevent UI sync errors
    editInp.value = text.info;
    editor.hidden = false;
}

const editNote = () => {
    if (editingIndex === null) return;

    const activeSubject = currentSub.value;
    if (editInp.value.trim() !== '') {
        archiveData[activeSubject]['notes'][editingIndex].info = editInp.value;
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
    localStorage.setItem("12092026archiveData", JSON.stringify(archiveData));
}
const toggleTextExpand = (button) => {
    const relatedSpan = button.previousElementSibling;
    if (relatedSpan.style.whiteSpace === 'pre-line') {
        relatedSpan.style.whiteSpace = 'normal';
        button.textContent = '+Expand'; // Optional: update button text
    } else {
        relatedSpan.style.whiteSpace = 'pre-line';
        button.textContent = '-Contract';
    }
}
const check_char = (words) => {
    for (let c of words){
        if(validChar.includes(c)){
            continue
        } else{
            return false;
        } 
    }
    return true;
}
const toggleUsageInfo = () => {
    usageInfo.hidden = !usageInfo.hidden;
}
const recoverNote = (pos) => {
    const activeNote = currentSub.value;
    if(!confirm(`Are You sure you want to recover this note?`)){
        alert('Canceled successfully');
        return;
    }
    alert('Recovered Successfully.')
    subjectData[activeNote]['notes'].push(archiveData[activeNote]['notes'][pos]);
    deleteNote(pos);
    update();
    save();
    localStorage.setItem("6092026subData", JSON.stringify(subjectData));
}