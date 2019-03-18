let dragForm = document.querySelector('form'),
 gallery = document.querySelector('#gallery');

['dragover', 'dragleave', 'drop'].forEach(eventName => {
  dragForm.addEventListener(eventName, opacityAndPreventDefault)   
  document.addEventListener(eventName, opacityAndPreventDefault)
});

function opacityAndPreventDefault(e){
  e.type == 'dragover' ? dragForm.style.opacity = .5 : 0
  e.type == 'dragleave' || e.type == 'drop' ? dragForm.style.opacity = 1 : 0
  e.preventDefault();
  e.stopPropagation()
};

dragForm.addEventListener('drop', sendFile)

function sendFile(e){

}

