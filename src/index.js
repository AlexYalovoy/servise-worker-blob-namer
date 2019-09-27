import { fetchPattern, registerPattern } from "./variables";

if (navigator.serviceWorker) {
  navigator.serviceWorker.register("/src/sw.js").catch(console.error);
}

inp.onchange = e => {
  console.log("onchange file", inp.files[0]);
  const file = inp.files[0];
  displayRenamedPDF(file, file.name).then(console.log);
};

function displayRenamedPDF(file, filename) {
  const reg_path = `/${registerPattern}/`;
  const url = reg_path + encodeURIComponent(filename);
  const xhr = new XMLHttpRequest();

  xhr.open("POST", url);
  return new Promise(resolve => {
    xhr.onload = () => {
      console.log("response", xhr.response);
      const frame = document.createElement("iframe");
      frame.src = xhr.response;
      document.body.append(frame);
      // return frame;
      resolve(xhr.response);
    };
    xhr.send(file);
  });
}
