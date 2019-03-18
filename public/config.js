let dragForm = document.querySelector('form'),
  gallery = document.querySelector('#gallery');

['dragover', 'dragleave', 'drop'].forEach(eventName => {
  dragForm.addEventListener(eventName, opacityAndPreventDefault)
  document.addEventListener(eventName, opacityAndPreventDefault)
});

function opacityAndPreventDefault(e) {
  e.type == 'dragover' ? dragForm.style.opacity = .5 : 0
  e.type == 'dragleave' || e.type == 'drop' ? dragForm.style.opacity = 1 : 0
  e.preventDefault();
  e.stopPropagation()
};

dragForm.addEventListener('drop', separateFiles)

function separateFiles(e){
  let dt = e.dataTransfer;
  let files = dt.files;
  Object.keys(files).forEach(file => sendFile(files[file]))
}

function sendFile(file) {  
  let filesFetch = new FormData();
  filesFetch.append('file',file)
  let options = {
    method: "POST",
    body: filesFetch
  }
  fetch('/upload', options)
    .then(handleErrors)
    .then(addThumbnail(file))
    .catch(error => alert(error));
}

function handleErrors(response) {
  if (!response.ok) {
    return response.text().then((errorText) => Promise.reject(errorText))
  }
  return response
};

function addThumbnail(file) {
  const img = document.createElement("img");
  img.classList.add("obj");
  img.file = file;
  gallery.appendChild(img);
  const reader = new FileReader();
  reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
  reader.readAsDataURL(file);
}
