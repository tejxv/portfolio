const darkModeToggle = document.querySelector('#dark-mode-toggle');

let darkMode = localStorage.getItem('darkMode');

if (darkMode === 'enabled') {
  	enableDarkMode();
} else {
	disableDarkMode();
}

darkModeToggle.addEventListener('click', () => {
  darkMode = localStorage.getItem('darkMode'); 
  if (darkMode !== 'enabled') {
    enableDarkMode();  
  } else {  
    disableDarkMode(); 
  }
});

function enableDarkMode() {
   var element = document.body;
   element.classList.add("dark-mode");
   localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
   var element = document.body;
   element.classList.remove("dark-mode");
   localStorage.setItem('darkMode', null );
}