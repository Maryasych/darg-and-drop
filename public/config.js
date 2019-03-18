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

function separateFiles(e) {
  let dt = e.dataTransfer;
  let files = dt.files;
  Object.keys(files).forEach(file => chaining(files[file]))
}

function chaining(file) {
  let filesFetch = new FormData();
  filesFetch.append('file', file)
  uploadFile(filesFetch)
    .then(resp => console.log(resp))
    .catch(error => alert(error))
}


function uploadFile(file) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', false);
    xhr.onload = function () {
      if (this.status == 200) {
        resolve(this.responseText);
      } else {
        var error = new Error(this.response);
        error.code = this.status;
        reject(error);
      }
    };
    xhr.onerror = function () {
      reject(new Error("Network Error"));
    };
    xhr.send(file);
  });
}

function addThumbnail(origFile) {
  const img = document.createElement('img'),
    progressBar = document.createElement('progress');
  progressBar.setAttribute('min', 0)
  img.file = origFile;
  gallery.appendChild(img);
  gallery.appendChild(progressBar)
  const reader = new FileReader();
  reader.onload = (function (aImg) {
    return function (e) {
      aImg.src = e.target.result;
    };
  })(img);
  reader.readAsDataURL(origFile);
}