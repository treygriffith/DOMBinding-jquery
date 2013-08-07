
var DOMBinding = require('../');

function isElement(obj) {
  try {
    //Using W3 DOM2 (works for FF, Opera and Chrom)
    return obj instanceof HTMLElement;
  }
  catch(e){
    //Browsers not supporting W3 DOM2 don't have HTMLElement and
    //an exception is thrown and we end up here. Testing some
    //properties that all elements have. (works on IE7)
    return (typeof obj==="object") &&
      (obj.nodeType===1) && (typeof obj.style === "object") &&
      (typeof obj.ownerDocument ==="object");
  }
}

describe('DOMBinding Initialization', function() {

	it('returns an instance of DOMBinding', function() {

		var db = new DOMBinding("<div></div>");


		assert.ok(db instanceof DOMBinding);
	});

	it('provides access to the underlying DOM', function() {

		var db = new DOMBinding("<div></div>");

		assert.ok(isElement(db.getDOM()));
	});

	it("can take a DOM Node as it's initializer", function() {

		var db = new DOMBinding(window.document.body);

		assert.strictEqual(db.getDOM(), window.document.body);
	});

});

describe('Style Manipulation', function() {

	it('updates style of a DOM element', function() {

		var db = new DOMBinding("<div></div>");
		var color = 'green';

		db.setStyle({
			backgroundColor: color
		});

		assert.strictEqual(db.getDOM().style.backgroundColor, color);
	});
});

describe('Attribute Manipulation', function() {

	it('retrieves an attribute value', function() {

		var id = 'my_id';

		var db = new DOMBinding("<div id='"+id+"'></div>");

		assert.strictEqual(db.getProp('id'), id);
	});

	it('changes attribute values', function() {

		var new_id = 'my_id';

		var db = new DOMBinding("<div id='old_id'></div>");

		db.setProp('id', new_id);

		assert.strictEqual(db.getProp('id'), new_id);
	});

	it('changes arbitrary attributes', function() {

		var new_arb = 'arbor day';

		var db = new DOMBinding("<div arb='flagday'></div>");

		db.setProp('arb', 'arbor day');

		assert.strictEqual(db.getProp('arb'), new_arb);
	});
});

describe('Text Manipulation', function() {

	it('changes the text contents of a node', function() {

		var content = "Text Content";

		var db = new DOMBinding("<div></div>");

		db.setText(content);

		assert.strictEqual(db.getDOM().childNodes[0].nodeValue, content);
	});

});

describe('Form Manipulation', function() {

	it("retrieves the value of an input element", function() {

		var value = "MyValue";

		var text = new DOMBinding("<input type='text' value='"+value+"' />");
		var hidden = new DOMBinding("<input type='hidden' value='"+value+"' />");
		var checkbox = new DOMBinding("<input type='checkbox' value='"+value+"' />");
		var radio = new DOMBinding("<input type='radio' value='"+value+"' />");

		assert.strictEqual(text.getFormValue(), value);
		assert.strictEqual(hidden.getFormValue(), value);
		assert.strictEqual(checkbox.getFormValue(), value);
		assert.strictEqual(radio.getFormValue(), value);

	});

	it("sets the value of an input element", function() {

		var value = "MyValue";
		var new_value = "MyNewValue";

		var text = new DOMBinding("<input type='text' value='"+value+"' />");
		var hidden = new DOMBinding("<input type='hidden' value='"+value+"' />");
		var checkbox = new DOMBinding("<input type='checkbox' value='"+value+"' />");
		var radio = new DOMBinding("<input type='radio' value='"+value+"' />");

		text.setFormValue(new_value);
		hidden.setFormValue(new_value);
		checkbox.setFormValue(new_value);
		radio.setFormValue(new_value);

		assert.strictEqual(text.getFormValue(), new_value);
		assert.strictEqual(hidden.getFormValue(), new_value);
		assert.strictEqual(checkbox.getFormValue(), new_value);
		assert.strictEqual(radio.getFormValue(), new_value);
	});

	it("indicates if a radio or checkbox is selected", function() {

		var value = "MyValue";

		var checkboxSelected = new DOMBinding("<input type='checkbox' value='"+value+"' checked />");
		var checkbox = new DOMBinding("<input type='checkbox' value='"+value+"' />");
		var radioSelected = new DOMBinding("<input type='radio' value='"+value+"' checked />");
		var radio = new DOMBinding("<input type='radio' value='"+value+"' />");

		assert.isTrue(checkboxSelected.isSelected());
		assert.isFalse(checkbox.isSelected());
		assert.isTrue(radioSelected.isSelected());
		assert.isFalse(radio.isSelected());
	});


	it("retrieves the value of a select element", function() {

		var value = "MyValue";
		var defaultValue = "default";

		var selectExplicitValue = new DOMBinding("<select><option value='"+value+"' selected>Some Text</option></select>");
		var selectImplicitValue = new DOMBinding("<select><option selected>"+value+"</option></select>");
		var selectNoSelectedOption = new DOMBinding("<select><option>"+defaultValue+"</option><option>"+value+"</option></select>");
		var optionExplicitValue = new DOMBinding("<option value='"+value+"'>Some Text</option>");
		var optionImplicitValue = new DOMBinding("<option>"+value+"</option>");

		assert.strictEqual(selectExplicitValue.getFormValue(), value);
		assert.strictEqual(selectImplicitValue.getFormValue(), value);
		assert.strictEqual(selectNoSelectedOption.getFormValue(), defaultValue);
		assert.strictEqual(optionExplicitValue.getFormValue(), value);
		assert.strictEqual(optionImplicitValue.getFormValue(), value);

	});

	it("indicates if an option is selected", function() {

		var optionSelected = new DOMBinding("<option selected>My Text</option>");
		var option = new DOMBinding("<option>My Text</option>");

		assert.isTrue(optionSelected.isSelected());
		assert.isFalse(option.isSelected());
	});

	it("retrieves the value of a textarea element", function() {

		var value = "MyValue";

		var textarea = new DOMBinding("<textarea>"+value+"</textarea>");

		assert.strictEqual(textarea.getFormValue(), value);
	});

	it("sets the value of a textarea element", function() {

		var value = "MyValue";
		var new_value = "MyNewValue";

		var textarea = new DOMBinding("<textarea>"+value+"</textarea>");
		var textarea2 = new DOMBinding("<textarea>"+value+"</textarea>");

		textarea.setText(new_value);
		textarea2.setFormValue(new_value);

		assert.strictEqual(textarea.getFormValue(), new_value);
		assert.strictEqual(textarea2.getFormValue(), new_value);
	});
});

describe("DOM Manipulation", function() {

	it("appends DOM nodes", function() {

		var body = new DOMBinding(window.document.body);

		var div = new DOMBinding("<div></div>");

		var div2 = new DOMBinding("<div></div>");

		var div3 = new DOMBinding("<div></div>");

		body.append(div);

		div.append(div2);

		div.append(div3);

		assert.strictEqual(div.getDOM().childNodes[0], div2.getDOM());

		assert.strictEqual(div.getDOM().childNodes[div.getDOM().childNodes.length - 1], div3.getDOM());
	});

	it("inserts DOM nodes after a sibling", function() {

		var div = new DOMBinding("<div></div>");

		var div2 = new DOMBinding("<div></div>");

		var div3 = new DOMBinding("<div></div>");

		div.append(div2);

		div2.siblingAfter(div3);

		assert.strictEqual(div.getDOM().childNodes[0], div2.getDOM());

		assert.strictEqual(div.getDOM().childNodes[div.getDOM().childNodes.length - 1], div3.getDOM());
	});

	it("inserts DOM nodes before a sibling", function() {

		var div = new DOMBinding("<div></div>");

		var div2 = new DOMBinding("<div></div>");

		var div3 = new DOMBinding("<div></div>");

		div.append(div2);

		div2.siblingBefore(div3);

		assert.strictEqual(div.getDOM().childNodes[0], div3.getDOM());

		assert.strictEqual(div.getDOM().childNodes[div.getDOM().childNodes.length - 1], div2.getDOM());
	});

	it("replaces DOM nodes", function() {

		var div = new DOMBinding("<div></div>");

		var div2 = new DOMBinding("<div></div>");

		var div3 = new DOMBinding("<div></div>");

		div.append(div2);

		div2.replaceWith(div3);

		assert.lengthOf(div.getDOM().childNodes, 1);
		assert.strictEqual(div.getDOM().childNodes[0], div3.getDOM());
	});

	it("removes DOM nodes", function() {

		var div = new DOMBinding("<div></div>");

		var div2 = new DOMBinding("<div></div>");

		div.append(div2);

		div2.remove();

		assert.lengthOf(div.getDOM().childNodes, 0);
	});

	it("removes all child nodes", function() {

		var div = new DOMBinding("<div></div>");

		var div2 = new DOMBinding("<div></div>");

		var div3 = new DOMBinding("<div></div>");

		div.append(div2);
		div.append(div3);

		div.empty();

		assert.lengthOf(div.getDOM().childNodes, 0);
	});
});

describe("DOM Traversal", function() {

	it("finds all child nodes and provides an array of DOMBindings", function() {

		var div = new DOMBinding("<div></div>");

		var div2 = new DOMBinding("<div></div>");

		var div3 = new DOMBinding("<div></div>");

		div.append(div2);
		div.append(div3);

		var arr = div.find();

		assert.lengthOf(arr, 2);
		assert.isTrue(Array.isArray(arr));
		assert.isTrue(arr[0] instanceof DOMBinding);
	});

	it("finds matching child nodes and provides an array of DOMBindings", function() {
		var div = new DOMBinding("<div></div>");

		var div2 = new DOMBinding("<div></div>");

		var p = new DOMBinding("<p></p>");

		div.append(div2);
		div.append(p);

		var arr = div.find("p");

		assert.lengthOf(arr, 1);
		assert.isTrue(Array.isArray(arr));
		assert.isTrue(arr[0] instanceof DOMBinding);
		assert.strictEqual(arr[0].getDOM(), p.getDOM());
	});

	it("indicates if an element is attached to the document", function() {

		var body = new DOMBinding(window.document.body);

		var div = new DOMBinding("<div></div>");

		var div2 = new DOMBinding("<div></div>");

		body.append(div);

		assert.isTrue(div.inDOM());

		assert.isFalse(div2.inDOM());
	});

});

describe("Events", function() {

	it("listens for events", function(done) {

		var div = new DOMBinding("<div></div>");

		div.on('click', function(e) {

			assert.strictEqual(div, this);

			done();
		});

		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

		div.getDOM().dispatchEvent(evt);
	});

	it("prevents default actions", function(done) {

		var div = new DOMBinding("<div></div>");

		div.on('click', function(e) {

			e.preventDefault();

			assert.strictEqual(div, this);

			done();
		});

		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

		var cancelled = !div.getDOM().dispatchEvent(evt);

		assert.isTrue(cancelled);
	});

	it("detaches all event handlers for a single event", function() {

		var div = new DOMBinding("<div></div>");

		div.on('click', function(e) {

			assert.isTrue(false);
		});

		div.on('click', function(e) {

			assert.isTrue(false);
		});

		div.off('click');

		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

		div.getDOM().dispatchEvent(evt);

	});

	it("detaches a single event handler", function(done) {

		var div = new DOMBinding("<div></div>");

		// this handler will fail the test
		var handler1 = function(e) {

			assert.isTrue(false);
		};

		var handler2 = function(e) {

			assert.strictEqual(div, this);

			done();
		};

		div.on('click', handler1);

		div.on('click', handler2);

		div.off('click', handler1);

		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

		div.getDOM().dispatchEvent(evt);

	});

	it("emits events manually", function(done) {

		var div = new DOMBinding("<div></div>");

		div.on('click', function() {

			assert.strictEqual(div, this);

			done();
		});

		div.emit('click');
	});

	it("fires event handlers after being removed and re-added", function(done) {

		var div = new DOMBinding("<div></div>");

		div.on('click', function() {

			assert.strictEqual(div, this);

			done();
		});

		var body = new DOMBinding(window.document.body);

		body.append(div);

		assert.ok(div.inDOM());

		div.remove();

		assert.notOk(div.inDOM());

		body.append(div);

		assert.ok(div.inDOM());

		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

		div.getDOM().dispatchEvent(evt);		
	});

});