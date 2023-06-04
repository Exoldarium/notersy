// get and set storage data
function setStorage(key, data) {
  chrome.storage.sync.set({ [key]: data });
}

async function getStorage(key) {
  const res = await chrome.storage.sync.get([key]);
  return res[key];
}

export { setStorage, getStorage };