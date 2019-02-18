HTMLTextAreaElement.prototype.getRangeText = function() {
	const {selectionStart:start, selectionEnd:end, value} = this;
	return value.substring(start,end);
}

window.liveForum = window.liveForum || {};

liveForum.events = {};

liveForum.on = function(eventName, fn) {
	this.events[eventName] = this.events[eventName] || [];
	this.events[eventName].push(fn);
}

liveForum.off = function(eventName, fn) {
	let index = this.events[eventName].indexOf(fn);
	if(index > -1)
		this.events[eventName].splice(index, 1);
}

liveForum.emit = function(eventName, data) {
	this.events[eventName].forEach(fn => {
		fn(data);
	});
}

liveForum.hasParent = function(child, parent) {
	let node = child.parentElement;
	while(node) {
		if(parent instanceof HTMLElement) {
			if(node === parent)
				return true;
		} else if(parent[0] == '.') {
			if(node.classList.contains(parent.slice(1)))
				return true;
		} else if(parent[0] == '#') {
			if(node.id == parent.slice(1))
				return true;
		}
		node = node.parentElement;
	}
	return false;
}

liveForum.init = function() {
	const self = this;
	document.addEventListener('click', e => {
		if(!this.hasParent(e.target, '.popup-wrapper'))
			this.closePopups();

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
		console.log(e.keyCode);
	});
	this.textarea.addEventListener('keyup', e => {
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
			case 71:
				if(this.ctrlPressed && this.altPressed) {
					this.popupHandler(e, this.imgPopup, this.imgLinkInput);
				}
				break;
			case 72:
				if(this.ctrlPressed && this.altPressed) {
					this.popupHandler(e, this.urlPopup, this.urlLinkInput, this.urlTextInput);
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

	const bold = this.generateElement('button', {textContent: 'B'}, btnContainer);
		bold.addEventListener('click', function(e) {
			self.bbcodeHandler(e, 'b');
		});
	const italic = this.generateElement('button', {textContent: 'I'}, btnContainer);
		italic.addEventListener('click', function(e) {
			self.bbcodeHandler(e, 'i');
		});
	const underline = this.generateElement('button', {textContent: 'U'}, btnContainer);
		underline.addEventListener('click', function(e) {
			self.bbcodeHandler(e, 'u');
		});
	const strikethrough = this.generateElement('button', {textContent: 'S'}, btnContainer);
		strikethrough.addEventListener('click', function(e) {
			self.bbcodeHandler(e, 's');
		});

	// URL
	this.urlWrapper = this.generateElement('div', {class: 'popup-wrapper'}, btnContainer);
	this.urlPopupBtn = this.generateElement('button', {textContent: 'URL'}, this.urlWrapper);
	this.urlPopupBtn.addEventListener('click', e => {
		this.popupHandler(e, this.urlPopup, this.urlLinkInput, this.urlTextInput);
	});
	this.urlPopup = this.generateElement('div', {class: 'popup'}, this.urlWrapper);
	this.popups.push(this.urlPopup);
	this.urlTextInput = this.generateElement('input', {}, this.urlPopup);
	this.urlTextInput.addEventListener('keypress', e => {
		if(e.keyCode == 13)
			this.bbcodeHandler(e, 'url', this.urlLinkInput, this.urlTextInput);
	});
	this.urlLinkInput = this.generateElement('input', {}, this.urlPopup);
	this.urlLinkInput.addEventListener('keypress', e => {
		if(e.keyCode == 13)
			this.bbcodeHandler(e, 'url', this.urlLinkInput, this.urlTextInput);
	});
	this.urlBtn = this.generateElement('button', {textContent: 'Submit'}, this.urlPopup);
	this.urlBtn.addEventListener('click', e => {
			this.bbcodeHandler(e, 'url', this.urlLinkInput, this.urlTextInput);
		})
	// IMG
	this.imgWrapper = this.generateElement('div', {class: 'popup-wrapper'}, btnContainer);
	this.imgPopupBtn = this.generateElement('button', {textContent: 'IMG'}, this.imgWrapper);
	this.imgPopupBtn.addEventListener('click', e => {
			this.popupHandler(e, this.imgPopup, this.imgLinkInput);
		});
	this.imgPopup = this.generateElement('div', {class: 'popup'}, this.imgWrapper);
	this.popups.push(this.imgPopup);
	this.imgLinkInput = this.generateElement('input', {}, this.imgPopup);
	this.imgLinkInput.addEventListener('keypress', e => {
		if(e.keyCode == 13)
			this.bbcodeHandler(e, 'img', this.imgLinkInput);
	});
	this.imgBtn = this.generateElement('button', {textContent: 'Submit'}, this.imgPopup);
	this.imgBtn.addEventListener('click', e => {
		this.bbcodeHandler(e, 'img', this.imgLinkInput);
	});
	
}

liveForum.popups = [];

liveForum.closePopups = function(except) {
	this.popups.forEach(popup => {
		if(popup !== except)
			popup.classList.remove('show');
	});
}

liveForum.textarea = document.querySelector('textarea');

liveForum.bbcodeHandler = function(e, bbcode, linkInput, textInput) {
	e.preventDefault();
	const {selectionStart: selStart, selectionEnd: selEnd} = this.textarea;
	let tagStart = '[' + bbcode + ']',
		text = linkInput ? linkInput.value : this.textarea.getRangeText(),
		tagEnd = '[/' + bbcode + ']',
		force = false;

	if(linkInput && textInput) {
		tagStart = '[' + bbcode + '=' + linkInput.value + ']';
		text = textInput.value;
		force = true;
	}


	this.textarea.setRangeText(tagStart + text + tagEnd, selStart, selEnd, 'end');
	if(!text.length || force)
		this.textarea.setSelectionRange(selStart + tagStart.length, selStart + tagStart.length);

	this.textarea.focus();
	this.closePopups();
}

liveForum.popupHandler = function(e, popup, linkInput, textInput) {
	e.preventDefault();
	let text = this.textarea.getRangeText();
	this.closePopups(popup); //except
	popup.classList.toggle('show');
	if(linkInput && textInput) {
		textInput.value = text;
		if(text.length)
			linkInput.focus();
		else
			textInput.focus();
	} else if(linkInput) {
		linkInput.focus();
	}
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