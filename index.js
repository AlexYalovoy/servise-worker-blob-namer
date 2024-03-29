const registerPattern = "registerBase64";
const fetchPattern = "fetchBase64";
const setUnnamedButton = document.getElementById("set-unnamed-src-button");
const setNamedButton = document.getElementById("set-named-src-button");
const iframe = document.getElementById("iframe");
const fileInput = document.getElementById("inp");
const name = document.getElementById("name");

let pdfFile = null;
let objectURL = null;

function registerNamedObjectURL(file, filename) {
  return fetch(`/${registerPattern}/` + encodeURIComponent(filename), {
    method: "POST",
    body: file
  });
}

if (navigator.serviceWorker) {
  navigator.serviceWorker.register("sw.js").catch(console.error);
}

name.oninput = e => {
  setNamedButton.innerText = `Set src to ${fetchPattern}/${name.value}`;
};

fileInput.onchange = e => {
  console.log("chosen file", e.target.files[0]);
  pdfFile = e.target.files[0];
  objectURL = URL.createObjectURL(pdfFile);
  console.log("objectURL", objectURL);
  setUnnamedButton.innerText = `Set src to ${objectURL}`;
};

setUnnamedButton.onclick = () => {
  iframe.src = objectURL;
  console.log("src setted to ", objectURL);
};

setNamedButton.onclick = () => {
  const fileName = `${name.value}`;
  const src = `/${fetchPattern}/${fileName}`;
  registerNamedObjectURL(pdfFile, fileName).then(() => {
    iframe.src = src;
    console.log("src setted to ", src);
  });
};
