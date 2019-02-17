Array.prototype.from = Array.prototype.from || function(arrLikeObj) {
	return Array.prototype.slice.call(arrLikeObj);
}

HTMLTextAreaElement.prototype.getRangeText = function() {
	const {selectionStart:start, selectionEnd:end, value} = this;
	return value.substring(start,end);
}

window.liveForum = window.liveForum || {};

liveForum.hasParent = function(child, parentClass) {
	let node = child.parentElement;
	while(node) {
		if(node.classList.contains(parentClass))
			return true;
		node = node.parentElement;
	}
	return false;
}

liveForum.init = function() {
	document.addEventListener('click', function(e) {
		if(!liveForum.hasParent(e.target, 'popup-wrapper'))
			liveForum.closePopups();

	});
	this.textarea.addEventListener('keydown', e => {
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

	const wrapper = this.generateElement('div', {});
	this.textarea.parentElement.insertBefore(wrapper, this.textarea);
	const btnContainer = this.generateElement('div', {}, wrapper);
	wrapper.appendChild(this.textarea);

	const bold = this.generateElement('button', {'data-bbcode': 'b', textContent: 'B'}, btnContainer);
		bold.addEventListener('click', function(e) {
			liveForum.bbcodeHandler(e, this.dataset.bbcode);
		});
	const italic = this.generateElement('button', {'data-bbcode': 'i', textContent: 'I'}, btnContainer);
		italic.addEventListener('click', function(e) {
			liveForum.bbcodeHandler(e, this.dataset.bbcode);
		});
	const underline = this.generateElement('button', {'data-bbcode': 'u', textContent: 'U'}, btnContainer);
		underline.addEventListener('click', function(e) {
			liveForum.bbcodeHandler(e, this.dataset.bbcode);
		});
	const strikethrough = this.generateElement('button', {'data-bbcode': 's', textContent: 'S'}, btnContainer);
		strikethrough.addEventListener('click', function(e) {
			liveForum.bbcodeHandler(e, this.dataset.bbcode);
		});

	// URL
	const urlWrapper = this.generateElement('div', {class: 'popup-wrapper'}, btnContainer);
	const urlPopupBtn = this.generateElement('button', {textContent: 'URL'}, urlWrapper);
		urlPopupBtn.addEventListener('click', function(e) {
			e.preventDefault();
			console.log(liveForum.popups);
			liveForum.closePopups(this.nextElementSibling);
			this.nextElementSibling.classList.toggle('show');
		});
	const urlPopup = this.generateElement('div', {class: 'popup'}, urlWrapper);
		liveForum.popups.push(urlPopup);
	const urlTextInput = this.generateElement('input', {}, urlPopup);
	const urlLinkInput = this.generateElement('input', {}, urlPopup);
	const urlBtn = this.generateElement('button', {textContent: 'Submit'}, urlPopup);
	// IMG
	const imgWrapper = this.generateElement('div', {class: 'popup-wrapper'}, btnContainer);
	const imgPopupBtn = this.generateElement('button', {textContent: 'IMG'}, imgWrapper);
		imgPopupBtn.addEventListener('click', function(e) {
			e.preventDefault();
			console.log(liveForum.popups);
			liveForum.closePopups(this.nextElementSibling);
			this.nextElementSibling.classList.toggle('show');
		});
	const imgPopup = this.generateElement('div', {class: 'popup'}, imgWrapper);
		liveForum.popups.push(imgPopup);
	const imgTextInput = this.generateElement('input', {}, imgPopup);
	const imgLinkInput = this.generateElement('input', {}, imgPopup);
	const imgBtn = this.generateElement('button', {textContent: 'Submit'}, imgPopup);
	
}

liveForum.popups = [];

liveForum.closePopups = function(except) {
	this.popups.forEach(popup => {
		if(popup !== except)
			popup.classList.remove('show');
	});
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
		if(key == 'textContent') {
			el.textContent = options[key];
		} else {
			el.setAttribute(key, options[key]);
		}
	}
	if(parent)
		parent.appendChild(el);
	return el;
}

liveForum.init();