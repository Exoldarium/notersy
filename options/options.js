const data = async () => {
  const res = await chrome.storage.local.get('selectedText');
  const selectedText = res.selectedText || [];
  return selectedText;
};

const selectedText = await data();

const clearStorageButton = document.querySelector('.clearStorageButton');

// clears the storage and all saved data
async function clearStorage() {
  if (window.confirm(`Are you sure you want to delete all saved data?`)) {
    if (window.confirm(`All saved data will be deleted, press OK to continue`)) {
      await chrome.storage.local.clear();
      await chrome.runtime.sendMessage({ clearStorage: 'clear' });
    }
  }
}

clearStorageButton.addEventListener('click', clearStorage);

