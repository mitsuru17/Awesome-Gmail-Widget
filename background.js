	// Learn more about poke v2 here:
	// http://wiki.antp.co/
	var info = {
		"poke": 2,
		// poke version 2
		"width": 1,
		// 200 px default
		"height": 1,
		// 200 px default
		"path": "gmail.html",
		"v2": {
			"resize": true,
			// Set to true ONLY if you create a range below.
			"min_width": 1,
			// Required; set to default width  if not resizable
			"max_width": 2,
			// Required; set to default width  if not resizable
			"min_height": 1,
			// Required; set to default height if not resizable
			"max_height": 2
      // Required; set to default height if not resizable
		}
	};

	chrome.extension.onRequestExternal.addListener(function (request, sender, sendResponse) {
		if (request === "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-poke") {
			chrome.extension.sendRequest(
			sender.id, {
				head: "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-pokeback",
				body: info,
			});
		}
	});

	function getURLParameter(url, name) {
		return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(url) || [, null])[1]);
	}

	$(window).bind('storage', function (e) {
		if (e.originalEvent.key === "go_to_gmail") {
			if (localStorage.getItem("go_to_gmail") != "") {
				var url = localStorage.getItem("go_to_gmail");
				var inbox_only = localStorage.getItem("inbox_only");
				if (inbox_only === "Y") {
					url = "https://mail.google.com/mail/u/0/#inbox/";
				} else {
					url = "https://mail.google.com/mail/u/0/#inbox/" + getURLParameter(url, "message_id");
				}
				chrome.tabs.query({
					title: "*" + localStorage.getItem("gmail") + "*"
				}, function (tab) {
					if (tab.length > 0 && tab[0].url.indexOf("mail.google.com") !== -1) {
						chrome.tabs.update(tab[0].id, {
							url: url,
							active: true
						});
					} else {
						chrome.tabs.create({
							url: url,
							active: true
						});
					}
				});
				localStorage.setItem("go_to_gmail", "");
				localStorage.setItem("inbox_only", "");
			}
		}
	});


	function update() {
		var url = "https://mail.google.com/mail/u/0/feed/atom?nocache=" + Math.random();
		var xml = new JKL.ParseXML(url);
		var data = xml.parse();

		if (typeof (data.feed) !== "object") {
			console.error("No response; doing nothing.");
			return;
		}

		// Is it an array (more than 1)?
		if (typeof (data.feed.entry) !== "undefined" && typeof ((data.feed.entry).length) === "undefined") {
			console.warn("Only 1 entry, converting it to an array.");
			data.feed.entry = [data.feed.entry];
		}
		localStorage.setItem("response", JSON.stringify(data));
		//console.log("debugging:", data);

		$.each(data.feed.entry, function(num, entry) {
			var email = $.md5(entry.author.email);
			var url = "https://en.gravatar.com/" + email + ".json";
			$.getJSON(url, function(data) {
				// this isn't really used, it's to check for a lack of gravatar images, based on success or error messages below.
			}).success(function() {
				localStorage.setItem("email_" + email, "Y"); // yes!
			}).error(function () {
				localStorage.setItem("email_" + email, "N"); // no!
			});
		});
	}

	setInterval(update, 1 * 60 * 1000);
	update();