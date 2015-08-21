(function () {

	var expresshbs = require('express-handlebars');
	var expressHandlebars = expresshbs.create({
		// Specify helpers which are only registered on this instance. 
		helpers: {
			foo: function () { return 'FOO!'; },
			bar: function () { return 'BAR!'; }
		}
				});
	var fs = require('fs');

	var hbsLocal = {
		getTemplate: function (templateName) {

			var templateLocation;
			var template;

			switch (templateName) {
				case "collapse":
					templateLocation = __dirname + "/templates/collapse.html";
					break;

				default:
					templateLocation = __dirname + "/templates/"+templateName+".html"
					break;
			}
			
			//TODO: put templates into an array and reuse them instead of reloading them 
			if (templateLocation !== "undefined") {

				var file = fs.readFileSync(templateLocation, "utf8");
				template = expressHandlebars.handlebars.compile(file);
			}

			return template;
		}

	};
	module.exports = {
		buildHandlebarsHTML: function (templateName, context) {

			var template = hbsLocal.getTemplate(templateName);
			var html = template(context);

			return html;
		}
	};
} ());