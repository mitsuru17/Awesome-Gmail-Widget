function restyle() {
	if ($(window).height() === 200) {
		$(".unread").height("120px");
	}
	if ($(window).height() === 406) {
		$(".unread").height("300px");
	}
}

function reset() {
	$(".widget").css("background-color", localStorage.color);
	var data = JSON.parse(localStorage.getItem("response"));
	var emails = "";

	if (typeof (data) !== "object" || typeof (data.feed) !== "object" || typeof (data.feed.fullcount) === "undefined") {
		$(".account").text("error");
		$(".email").text("sorry! something went wrong. are you logged in?");
		$(".count").empty();

		return;
	}

	if (typeof (data.feed.title) === "string") {
		$(".account").text((data.feed.title).split(" ").pop());
	}

	if (typeof (parseInt(data.feed.fullcount)) === "number") {
		var amount = parseInt(data.feed.fullcount);
		if (amount > 999) {
			amount = "999+";
		}
		$(".count").text(amount);
	} else {
		$(".count").empty();
	}

	if (typeof (data.feed.entry) === "object") {
		$(".unread").empty();
		if (localStorage.showemailaddress !== "N") {
			$(".account").show();
		} else {
			$(".account").hide();
		}
		
		$.each(data.feed.entry, function (num, entry) {
			// In case people have a lot of unread messages that get returned
			if (num > 20) {
				return false;
			}

			var email = $("<div></div>").addClass("email");
			$("<div></div>").appendTo(email).addClass("subject").text(entry.title).attr("href", entry.link.href);
			if (localStorage.showemailsummary === "N") {
				//
			} else {
				$("<div></div>").appendTo(email).addClass("summary").attr("href", entry.link.href);
				if (localStorage.getItem("email_" + $.md5(entry.author.email)) === "Y") {
					$("<div></div>").appendTo($(email).find(".summary")).attr("href", entry.link.href).attr("style", "float:left").addClass("imageholder");
					$("<img/>").appendTo($(email).find(".imageholder")).addClass("gravatarimage").attr("emailaddress", entry.author.email).attr("src", "http://www.gravatar.com/avatar/" + $.md5(entry.author.email) + "?s=40&d=404").css("padding-right", "3px");
				}
				// Show Sender
				if (localStorage.showemailsender === "N") { // N because: "Y" and undefined count as "Y".
					//
				} else {
					$("<span></span>").appendTo($(email).find(".summary")).addClass("sender").attr("href", entry.link.href).text(entry.author.name || entry.author.email);
				}

				$("<span></span>").appendTo($(email).find(".summary")).addClass("message").text(entry.summary).attr("href", entry.link.href);

			}
			emails += email.html();
		});

		$(emails).appendTo(".unread");

		// Show unread email
		if (localStorage.showemail === "N") {
			$(".unread").css("display", "none");
		} else {
			$(".unread").show();
		}
	} else {
		$(".unread").html("awesome, 0 unread mail!");
	}
}

$(document).ready(function ($) {
	restyle();
	$(window).bind("resize", function () {
		restyle();
	});

	// Being able to drag images just feels so tacky
	$('img').live('dragstart', function (event) {
		event.preventDefault();
	});

	$(".sender, .subject, .message, .imageholder").live("click", function () {
		localStorage.setItem("gmail", $(".account").html());
		localStorage.setItem("go_to_gmail", $(this).attr("href"));
	});

	$(".account, .count").live("click", function () {
		localStorage.setItem("gmail", $(".account").html());
		localStorage.setItem("inbox_only", "Y");
		localStorage.setItem("go_to_gmail", $(this).attr("href"));
	});

	// Initial setup of the widget
	reset();

	// When anything in localStorage changes
	$(window).bind('storage', function (e) {
		reset();
		restyle();
	});
});