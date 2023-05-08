// get selected text from local storage
chrome.storage.local.get('selectedText', (text) => {
  const selectedText = text.selectedText;
  console.log(selectedText);
});