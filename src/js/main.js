const bear = document.querySelector('.title'),
	  header = document.querySelector('.l-header');

var lastScrollTop = 0;



// Test this chunk of code
var generateRandom = function(min, max) {return Math.random() * (max - min) + min},
    dots = document.getElementById('dots'),
    dots_width = Math.floor(parseInt(window.getComputedStyle(dots).getPropertyValue('width'))),
    dots_height = Math.floor(parseInt(window.getComputedStyle(dots).getPropertyValue('height'))),
    dot_single = document.querySelectorAll('.dot');
    //dot_single_radius = window.getComputedStyle(dot_single).getPropertyValue('width');

// Keep for possible IE issue
// function hasClass(element, cls) {
//     return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
// }

document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('.preloader').classList.add('is-hidden');
	dots.style.setProperty('z-index', -1);
	disperseTrigger();
});

function disperseTrigger() {
    dot_single.forEach(function(el) {
        el.classList.add('is-dispersed');
        el.style.setProperty('transform', 'translateZ(0) translateX('+ Math.floor(generateRandom(-(dots_width/2), (dots_width/2))) + 'px) translateY(' + Math.floor(generateRandom(-(dots_height/2), (dots_height/2))) + 'px) scale('+ parseFloat(((generateRandom(0.5, 1) / 100) * 100).toFixed(1)) +')')
    });
}

document.querySelectorAll('.is-scrolling').forEach(function(el) {
	el.onclick = function(e) {
		e.preventDefault();
		Jump(el.getAttribute('href'), {
			duration: 500
		});
	}
});

function remapRange(input, oldmin, oldmax, newmin, newmax) {
	return Math.floor(
		(((input - oldmin) * (newmax - newmin)) / (oldmax - oldmin)) + newmin
	);
}