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

dragForm.addEventListener('drop', separateFiles = e => {
  let dt = e.dataTransfer;
  let files = dt.files;
  Object.keys(files).forEach(file => {
    iterator++
    chaining(files[file], iterator)
  })
});

chaining = (file, i) => {
  let filesFetch = new FormData();
  filesFetch.append('file', file)
  uploadFile(filesFetch, file, i)
};

uploadFile = (fileFetch, file, i) => {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/upload');
  addThumbnail(file)
  xhr.upload.onprogress = function (e) {
    progressbars[i - 1].setAttribute('value', (e.loaded / e.total) * 100)
  }
  xhr.onload = function () {
    if (this.status == 415) {
      progressbars[i - 1].classList.add('failed');
      console.error(this.responseText)
    }
    if (this.status !== 200) {
      var error = new Error(this.response);
      error.code = this.status;
      console.error(error.code)
    }
  };
  xhr.onerror = function () {
    console.error(new Error("Network Error"));
  };
  xhr.send(fileFetch);
}

createElements = (origFile) => {
  const imgWrap = document.createElement('div'),
    img = document.createElement('img'),
    progressBar = document.createElement('progress');
  imgWrap.classList.add('imgWrap');
  img.file = origFile;
  imgWrap.append(img)
  imgWrap.append(progressBar)
  progressBar.setAttribute('min', 0)
  progressBar.setAttribute('max', 100)
  gallery.appendChild(imgWrap)
  return [img, progressBar]
}

addThumbnail = origFile => {
  let [img, progressBar] = createElements(origFile)
  progressbars.push(progressBar)
  const reader = new FileReader();
  reader.onload = (function (aImg) {
    return function (e) {
      aImg.src = e.target.result;
    };
  })(img);
  reader.readAsDataURL(origFile);
}