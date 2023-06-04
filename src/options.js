import '../styles/options.css';

(async () => {
  const res = await chrome.storage.local.get('selectedText');
  const selectedText = res.selectedText || [];

  const confirmClearDiv = document.querySelector('.confirmClear');
  const clearStorageButton = document.querySelector('.clearStorageButton');
  const downloadButton = document.querySelector('.downloadButton');
  const downloadDiv = document.querySelector('.download');

  // add note text and title data to an array
  const dataArr = [];
  selectedText.map(notes => {
    notes.note.map((note) => {
      dataArr.push(note.title + '\n', note.text + '\n\n');
    })
  });

  // prompt the user to confirm
  function clearStorage() {
    confirmClearDiv.classList.add('confirmActive');
  }

  // clears the storage and all saved data
  function confirmClear(e) {
    if (e.target.textContent === 'OK') {
      chrome.storage.local.clear();
      chrome.runtime.sendMessage({ clearStorage: 'clear' });
      confirmClearDiv.classList.remove('confirmActive');
    }
    if (e.target.textContent === 'Cancel') {
      confirmClearDiv.classList.remove('confirmActive');
    }
    dataArr.length = 0;
    location.reload();
  }

  // create file link and simulate click
  function prepareFile(filename, text) {
    const link = document.createElement('a');
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    link.setAttribute('download', filename);

    link.style.display = 'none';
    downloadDiv.appendChild(link);

    link.click();
  }

  // download the file after the button has been clicked
  function downloadFile(e) {
    if (e.target) {
      prepareFile('notes.txt', dataArr.join(''));
    }
  }

  clearStorageButton.addEventListener('click', clearStorage);
  confirmClearDiv.addEventListener('click', confirmClear);
  downloadButton.addEventListener('click', downloadFile);
})();