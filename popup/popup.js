const paragraph = document.querySelector(".text");

// get selected text from local storage
chrome.storage.local.get('selectedText', (text) => {
  const selectedText = text.selectedText;
  paragraph.textContent = selectedText;
  console.log(text);
});

