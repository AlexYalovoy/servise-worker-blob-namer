if (navigator.serviceWorker) {
  navigator.serviceWorker.register("sw.js").catch(console.error);
}

inp.onchange = e => {
  console.log("here", inp.files[0]);
  const file = inp.files[0];
  displayRenamedPDF(file, file.name).then(console.log);
};

function displayRenamedPDF(file, filename) {
  // we use an hard-coded fake path
  // that we will check in every requests from the SW
  const reg_path = "/nameForcer_register/";
  // pass the filename
  const url = reg_path + encodeURIComponent(filename);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  return new Promise((res, rej) => {
    xhr.onload = e => {
      const frame = document.createElement("iframe");
      frame.src = xhr.response;
      document.body.append(frame);
      return frame;
    };
    xhr.send(file);
  });
}
