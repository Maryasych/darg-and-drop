let dragForm = document.querySelector('form'),
  gallery = document.querySelector('#gallery'),
  progressbars = [],
  iterator = 0;

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
  Object.keys(files).forEach(file =>{
    iterator++
    chaining(files[file], iterator)
    })
}

function chaining(file, i) {
  let filesFetch = new FormData();
  filesFetch.append('file', file)
  uploadFile(filesFetch, file, i)
}


function uploadFile(fileFetch, file, i) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload');
    addThumbnail(file)
    xhr.upload.onprogress = function(event){
      progressbars[i-1].setAttribute('value', (event.loaded/event.total)*100)
    }
    xhr.onload = function () {
      if (this.status == 200) {
       // resolve(this);
      } else {
        var error = new Error(this.response);
        error.code = this.status;
        //reject(error);
      }
    };
    xhr.onerror = function () {
      reject(new Error("Network Error"));
    };
    xhr.send(fileFetch);
}

function addThumbnail(origFile) {
  const img = document.createElement('img'),
    progressBar = document.createElement('progress');
  progressBar.setAttribute('min', 0)
  progressBar.setAttribute('max', 100)
  img.file = origFile;
  gallery.appendChild(img);
  gallery.appendChild(progressBar)
  progressbars.push(progressBar)
  console.log(progressbars)
  const reader = new FileReader();
  reader.onload = (function (aImg) {
    return function (e) {
      aImg.src = e.target.result;
    };
  })(img);
  reader.readAsDataURL(origFile);
}