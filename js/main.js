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

	const mainDivSet = this.generateElements('div', [{class: 'wrapper'}, {class: 'buttons'}]);
	const [wrapper, btnContainer] = mainDivSet;

	const buttonSet = this.generateElements('button', [
		{class: 'bold', 'data-bbcode': 'b', textContent: 'B'},
		{class: 'italic', 'data-bbcode': 'i', textContent: 'I'},
		{class: 'underline', 'data-bbcode': 'u', textContent: 'U'},
		{class: 'strikethrough', 'data-bbcode': 's', textContent: 'S'}
	]);
	const [bold, italic, underline, strikethrough] = buttonSet;

	const btnWrappers = this.generateElements('div', [{}, {}, {}]);
	const [urlWrapper, imgWrapper, mediaWrapper] = btnWrappers;

	buttonSet.forEach(button => {
		button.addEventListener('click', function(e) {
			liveForum.bbcodeHandler(e, this.dataset.bbcode);
		});
		btnContainer.appendChild(button);
	});

	btnWrappers.forEach(btnWrapper => {
		btnContainer.appendChild(btnWrapper);
	});

	this.textarea.parentElement.insertBefore(wrapper, this.textarea);
	wrapper.appendChild(btnContainer);
	wrapper.appendChild(this.textarea);
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

liveForum.generateElements = function(elName, options) {
	const resultSet = [];
	for(let i = 0; i < options.length; i++) {
		let el = document.createElement(elName);
		for(let key in options[i]) {
			if(key == 'textContent') 
				el.textContent = options[i][key];
			el.setAttribute(key, options[i][key])
		}
		resultSet.push(el);
	}
	return resultSet;
}

liveForum.init();