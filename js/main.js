HTMLTextAreaElement.prototype.getRangeText = function() {
	const {selectionStart:start, selectionEnd:end, value} = this;
	return value.substring(start,end);
}

window.liveForum = {};

liveForum.storage = {};

liveForum.storage.defaultParameters = {
	about: {
		author: "Neo",
		name: "LiveForum storage sync",
		description: "Do not edit unless you know what you are doing"
	}​,
	avoid30chars: true​,
	avoidFlood: true​,
	blocked_users: []​,
	custom_buttons: []​,
	custom_emojis: []​,
	last_checked: 0,
	notifications_enabled: true​,
	quote_author: true​
};

liveForum.storage.get = function(prop, callback) {
	fetch('https://forum.ge/index.php?act=UserCP&CODE=00')
		.then(resp => resp.text())
		.then(text => {
			const div = document.createElement('div');
			div.innerHTML = text;
			const data = div.querySelector('textarea').value;
			try {
				return JSON.parse(data);
			} catch(e) {
				console.error(e);
				console.log(data);
				return text;
			}
		}).then(data => {
			// if(typeof data === 'object') {
				switch(Object.prototype.toString.call(prop)) {
					case '[object String]':
						if(prop in data)
							callback(data[prop]);
						else
							console.log('no such entry')
						break;
					case '[object Array]':
						var result = prop.reduce((a, b) => {
							a[b] = data[b];
							return a;
						}, {});
						callback(result);
						break;
					case '[object Null]':
						callback(data);
						break;
					default:
						console.log('You must enter a value');
				}
			// } else {
			// 	console.log(data);
			// }
		}).catch(console.error);
}

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
	this.textarea.previousElementSibling.style.display = 'none';

	const wrapper = this.generateElement('div', {class: 'lf-wrapper'});
	this.textarea.parentElement.insertBefore(wrapper, this.textarea);
	const btnContainer = this.generateElement('div', {class: 'lf-container'}, wrapper);
	wrapper.appendChild(this.textarea);

	this.boldWrapper = this.generateElement('div', {class: 'lf-button-wrapper'}, btnContainer);
	this.bold = this.generateElement('button', {textContent: 'B', type: 'button', class: 'button bold'}, this.boldWrapper);
	this.bold.addEventListener('click', e => {
		this.bbcodeHandler('b');
	});
	this.italicWrapper = this.generateElement('div', {class: 'lf-button-wrapper'}, btnContainer);
	this.italic = this.generateElement('button', {textContent: 'I', type: 'button', class: 'button italic'}, this.italicWrapper);
	this.italic.addEventListener('click', e => {
		this.bbcodeHandler('i');
	});
	this.underlineWrapper = this.generateElement('div', {class: 'lf-button-wrapper'}, btnContainer);
	this.underline = this.generateElement('button', {textContent: 'U', type: 'button', class: 'button underline'}, this.underlineWrapper);
	this.underline.addEventListener('click', e => {
		this.bbcodeHandler('u');
	});
	this.strikethroughWrapper = this.generateElement('div', {class: 'lf-button-wrapper'}, btnContainer);
	this.strikethrough = this.generateElement('button', {textContent: 'S', type: 'button', class: 'button strikethrough'}, this.strikethroughWrapper);
	this.strikethrough.addEventListener('click', e => {
		this.bbcodeHandler('s');
	});

	// URL
	this.urlWrapper = this.generateElement('div', {class: 'lf-button-wrapper'}, btnContainer);
	this.urlPopupBtn = this.generateElement('button', {textContent: 'URL', type: 'button'}, this.urlWrapper);
	this.urlPopupBtn.addEventListener('click', e => {
		this.popupHandler(this.urlPopup, this.urlLinkInput, this.urlTextInput);
	});
	this.urlPopup = this.generateElement('div', {class: 'lf-popup'}, this.urlWrapper);
	this.popups.push(this.urlPopup);
	this.urlTextInput = this.generateElement('input', {}, this.urlPopup);
	this.urlTextInput.addEventListener('keydown', e => {
		if(e.keyCode == 13)  {
			e.preventDefault();
			this.urlSubmit.click();
		}
	});
	this.urlLinkInput = this.generateElement('input', {}, this.urlPopup);
	this.urlLinkInput.addEventListener('keydown', e => {
		if(e.keyCode == 13) {
			e.preventDefault();
			this.urlSubmit.click();
		}
	});
	this.urlFooter = this.generateElement('div', {class: 'lf-footer'}, this.urlPopup);
	this.urlSubmit = this.generateElement('button', {class: 'lf-btn-submit', textContent: 'Insert', type: 'button'}, this.urlFooter);
	this.urlSubmit.addEventListener('click', e => {
		this.bbcodeHandler('url', this.urlLinkInput, this.urlTextInput);
	});
	// IMG
	this.imgWrapper = this.generateElement('div', {class: 'lf-button-wrapper'}, btnContainer);
	this.imgPopupBtn = this.generateElement('button', {textContent: 'IMG', type: 'button'}, this.imgWrapper);
	this.imgPopupBtn.addEventListener('click', e => {
		this.popupHandler(this.imgPopup, this.imgLinkInput);
	});
	this.imgPopup = this.generateElement('div', {class: 'lf-popup'}, this.imgWrapper);
	this.popups.push(this.imgPopup);
	this.imgLinkInput = this.generateElement('input', {}, this.imgPopup);
	this.imgLinkInput.addEventListener('keydown', e => {
		if(e.keyCode == 13) {
			e.preventDefault();
			this.imgSubmit.click();
		}
	});
	this.imgFooter = this.generateElement('div', {class: 'lf-footer'}, this.imgPopup);
	this.imgSubmit = this.generateElement('button', {class: 'lf-btn-submit', textContent: 'Insert', type: 'button'}, this.imgFooter);
	this.imgSubmit.addEventListener('click', e => {
		this.bbcodeHandler('img', this.imgLinkInput);
	});

	// LIST
	this.listWrapper = this.generateElement('div', {class: 'lf-button-wrapper'}, btnContainer);
	this.listPopupBtn = this.generateElement('button', {textContent: 'LIST', type: 'button'}, this.listWrapper);
	this.listPopupBtn.addEventListener('click', e => {
			this.listPopupHandler(this.listPopup);
		});
	this.listPopup = this.generateElement('div', {class: 'lf-popup'}, this.listWrapper);
	this.popups.push(this.listPopup);
	this.listType = 'unordered';
	this.listModeContainer = this.generateElement('div', {class: 'lf-list-type-wrapper'}, this.listPopup);
	this.listModeUl = this.generateElement('input', {type: 'radio', name: 'mode', id: 'lfListUnordered', checked: true}, this.listModeContainer);
	this.listModeUl.addEventListener('change', e => {
		this.listType = 'unordered';
	})
	this.listModeUlLabel = this.generateElement('label', {textContent: '•', for: 'lfListUnordered'}, this.listModeContainer);
	this.listModeOl = this.generateElement('input', {type: 'radio', name: 'mode', id: 'lfListOrdered'}, this.listModeContainer);
	this.listModeOl.addEventListener('change', e => {
		this.listType = '1';
	})
	this.listModeOlLabel = this.generateElement('label', {textContent: '1', for: 'lfListOrdered'}, this.listModeContainer);
	this.listModeOlA = this.generateElement('input', {type: 'radio', name: 'mode', id: 'lfListOrderedUC'}, this.listModeContainer);
	this.listModeOlA.addEventListener('change', e => {
		this.listType = 'A';
	})
	this.listModeOlALabel = this.generateElement('label', {textContent: 'A', for: 'lfListOrderedUC'}, this.listModeContainer);
	this.listModeOla = this.generateElement('input', {type: 'radio', name: 'mode', id: 'lfListOrderedLC'}, this.listModeContainer);
	this.listModeOla.addEventListener('change', e => {
		this.listType = 'a';
	})
	this.listModeOlaLabel = this.generateElement('label', {textContent: 'a', for: 'lfListOrderedLC'}, this.listModeContainer);
	this.listModeOlI = this.generateElement('input', {type: 'radio', name: 'mode', id: 'lfListUCRoman'}, this.listModeContainer);
	this.listModeOlI.addEventListener('change', e => {
		this.listType = 'I';
	})
	this.listModeOlILabel = this.generateElement('label', {textContent: 'I', for: 'lfListUCRoman'}, this.listModeContainer);
	this.listModeOli = this.generateElement('input', {type: 'radio', name: 'mode', id: 'lfListLCRoman'}, this.listModeContainer);
	this.listModeOli.addEventListener('change', e => {
		this.listType = 'i';
	})
	this.listModeOliLabel = this.generateElement('label', {textContent: 'i', for: 'lfListLCRoman'}, this.listModeContainer);
	this.listInputsContainer = this.generateElement('div', {class: 'lf-ls-wrapper'}, this.listPopup);
	this.listInputsContainer.appendChild(this.generateListInput());
	this.listFooter = this.generateElement('div', {class: 'lf-footer'}, this.listPopup);
	this.listSubmit = this.generateElement('button', {class: 'lf-btn-submit', textContent: 'Insert', type: 'button'}, this.listFooter);
	this.listSubmit.addEventListener('click', e => {
		e.preventDefault();
		let listItems = '\n';
		Array.from(this.listInputsContainer.children).forEach(el => {
			listItems += '[*]' + el.children[1].value + '\n';
		});
		if(this.listType == 'unordered')
			this.bbcodeHandler('list', {value: listItems});
		else
			this.bbcodeHandler('list', {value: this.listType}, {value: listItems});
	});
	
	// E Listeners
	document.addEventListener('click', e => {
		if(!this.hasParent(e.target, '.lf-button-wrapper'))
			this.closePopups();

	});
	document.addEventListener('keydown', e => {
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
	document.addEventListener('keyup', e => {
		switch(e.keyCode) {
			case 17:
				this.ctrlPressed = false;
				break;
			case 18:
				this.altPressed = false;
				break;
			case 66:
				if(this.ctrlPressed && this.altPressed) {
					this.bold.click();
				}
				break;
			case 71:
				if(this.ctrlPressed && this.altPressed) {
					this.imgPopupBtn.click();
				}
				break;
			case 72:
				if(this.ctrlPressed && this.altPressed) {
					this.urlPopupBtn.click();
				}
				break;
			case 73:
				if(this.ctrlPressed && this.altPressed) {
					this.italic.click();
				}
				break;
			case 85:
				if(this.ctrlPressed && this.altPressed) {
					this.underline.click();
				}
				break;
			case 83:
				if(this.ctrlPressed && this.altPressed) {
					this.strikethrough.click();
				}
				break;
		}
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

liveForum.generateListInput = function(val) {
	const wrapper = this.generateElement('div', {class: 'lf-ls-input-wrapper'}),
		minBtn = this.generateElement('button', {textContent: '-', type: 'button'}, wrapper),
		input = this.generateElement('input', {}, wrapper),
		maxBtn = this.generateElement('button', {textContent: '+', type: 'button'}, wrapper);
		const addInput = () => {
			const newWrapper = this.generateListInput();
			this.listInputsContainer.insertBefore(newWrapper, wrapper.nextElementSibling);
			newWrapper.children[1].focus();
		}
		const removeInput = () => {
			if(wrapper.previousElementSibling) {
				wrapper.previousElementSibling.children[1].focus();
				wrapper.remove();
			} else { 
				wrapper.children[1].value = '';
				wrapper.children[1].focus();
			}
		}
		maxBtn.addEventListener('click', e => {
			addInput();
		});
		input.addEventListener('keydown', e => {
			if(this.ctrlPressed && e.keyCode == 13) {
				e.preventDefault();
				e.stopPropagation();
				addInput();
			} else if(e.keyCode == 13) {
				e.preventDefault();
				this.listSubmit.click();
			}
			if(e.keyCode == 27)
				removeInput();
		});
		minBtn.addEventListener('click', e => {
			e.stopPropagation();
			removeInput();
		});
		if(val)
			input.value = val;
		return wrapper;
}

liveForum.bbcodeHandler = function(bbcode, linkInput, textInput) {
	const {selectionStart: selStart, selectionEnd: selEnd} = this.textarea;
	let tagStart = '[' + bbcode + ']',
		text = linkInput ? linkInput.value : this.textarea.getRangeText(),
		tagEnd = '[/' + bbcode + ']';

	if(linkInput && textInput) {
		tagStart = '[' + bbcode + '=';
		text = linkInput.value + ']' + textInput.value;

		if(linkInput.value.length && !textInput.value.length) {
			this.textarea.setRangeText(tagStart + text + tagEnd, selStart, selEnd, 'end');
			this.textarea.setSelectionRange(selStart + tagStart.length + text.length, selStart + tagStart.length + text.length);
			this.textarea.focus();
			return;
		} else if(!linkInput.value.length && textInput.value.length) {
			this.textarea.setRangeText(tagStart + text + tagEnd, selStart, selEnd, 'end');
			this.textarea.setSelectionRange(selStart + tagStart.length, selStart + tagStart.length);
			this.textarea.focus();
			return;
		} else if (!linkInput.value.length && !textInput.value.length) {
			tagStart = '[' + bbcode + ']';
			text = '';
		}
	}

	this.textarea.setRangeText(tagStart + text + tagEnd, selStart, selEnd, 'end');

	if(!text.length)
		this.textarea.setSelectionRange(selStart + tagStart.length, selStart + tagStart.length);

	this.textarea.focus();
	this.closePopups();
}

liveForum.listPopupHandler = function(popup) {
	let text = this.textarea.getRangeText().split('\n');
	this.closePopups(popup); //except
	popup.classList.toggle('show');
	text.forEach(el => {
		if(el !== '') {
			const wrapper = this.generateListInput(el);
			this.listInputsContainer.appendChild(wrapper);
		}
	});
}

liveForum.popupHandler = function(popup, linkInput, textInput) {
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
liveForum.storage.get('author', function(data) {
	console.log(data);
});