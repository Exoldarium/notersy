async function data() {
  const res = await chrome.storage.local.get('selectedText');
  const selectedText = res.selectedText || [];
  return selectedText;
};

const selectedText = await data();
const confirmClearDiv = document.querySelector('.confirmClear');
const clearStorageButton = document.querySelector('.clearStorageButton');

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
}

clearStorageButton.addEventListener('click', clearStorage);
confirmClearDiv.addEventListener('click', confirmClear);