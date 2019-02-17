Array.prototype.from = Array.prototype.from || function(arrLikeObj) {
	return Array.prototype.slice.call(arrLikeObj);
}

HTMLTextAreaElement.prototype.getRangeText = function() {
	const {selectionStart:start, selectionEnd:end, value} = this;
	return value.substring(start,end);
}

window.liveForum = window.liveForum || {};

liveForum.init = function() {
	this.textarea.addEventListener('keydown', (e) => {
		switch(e.keyCode) {
			case 17:
				this.ctrlPressed = true;
				break;
			case 18:
				this.altPressed = true;
				break;
		}
		// console.log(e.keyCode);
	});
	this.textarea.addEventListener('keyup', (e) => {
		switch(e.keyCode) {
			case 17:
				this.ctrlPressed = false;
				break;
			case 18:
				this.altPressed = false;
				break;
			case 66:
				if(this.ctrlPressed && this.altPressed) {
					this.bbcodeHandler(e, 'b');
				}
				break;
			case 73:
				if(this.ctrlPressed && this.altPressed) {
					this.bbcodeHandler(e, 'i');
				}
				break;
			case 85:
				if(this.ctrlPressed && this.altPressed) {
					this.bbcodeHandler(e, 'u');
				}
				break;
			case 83:
				if(this.ctrlPressed && this.altPressed) {
					this.bbcodeHandler(e, 's');
				}
				break;
		}
	});
	this.textarea.previousElementSibling.style.display = 'none';

	const wrapper = this.generateElement('div', {class: 'wrapper'});
	this.textarea.parentElement.insertBefore(wrapper, this.textarea);
	const btnContainer = this.generateElement('div', {class: 'buttons'}, wrapper);
	wrapper.appendChild(this.textarea);

	const bold = this.generateElement('button', {class: 'bold', 'data-bbcode': 'b', textContent: 'B'}, btnContainer);
		bold.addEventListener('click', function(e) {
			liveForum.bbcodeHandler(e, this.dataset.bbcode);
		});
	const italic = this.generateElement('button', {class: 'bold', 'data-bbcode': 'i', textContent: 'I'}, btnContainer);
		italic.addEventListener('click', function(e) {
			liveForum.bbcodeHandler(e, this.dataset.bbcode);
		});
	const underline = this.generateElement('button', {class: 'bold', 'data-bbcode': 'u', textContent: 'U'}, btnContainer);
		underline.addEventListener('click', function(e) {
			liveForum.bbcodeHandler(e, this.dataset.bbcode);
		});
	const strikethrough = this.generateElement('button', {class: 'bold', 'data-bbcode': 's', textContent: 'S'}, btnContainer);
		strikethrough.addEventListener('click', function(e) {
			liveForum.bbcodeHandler(e, this.dataset.bbcode);
		});

	const urlWrapper = this.generateElement('div', {}, btnContainer);
	
}

liveForum.textarea = document.querySelector('textarea');

liveForum.moveSelection = function(offset) {
	const {selectionStart:start, selectionEnd:end} = this.textarea;
	start += offset;
	end += offset;
}

liveForum.bbcodeHandler = function(e, bbcode) {
	e = e || event;
	e.preventDefault();
	const {selectionStart: start, selectionEnd: end} = this.textarea;
	before = '[' + bbcode + ']',
	text = this.textarea.getRangeText(),
	after = '[/' + bbcode + ']';

	this.textarea.setRangeText(before + text + after, start, end, 'end');
	if(!text.length)
		this.textarea.setSelectionRange(start + before.length, end + before.length);
	this.textarea.focus();
}

liveForum.ctrlPressed = false;
liveForum.altPressed = false;

liveForum.generateElement = function(elName, options, parent) {
	let el = document.createElement(elName);
	for(let key in options) {
		if(key == 'textContent') 
			el.textContent = options[key];
		el.setAttribute(key, options[key])
	}
	if(parent)
		parent.appendChild(el);
	return el;
}

liveForum.init();