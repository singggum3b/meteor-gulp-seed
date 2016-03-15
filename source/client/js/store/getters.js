exports.bag = ["store"];
exports.bagData = ["store", "bagData"];
exports.selectedBagOptions = ["store", "selectedBagOptions"];
exports.bagMeta = ["store", "bagMeta"];
exports.customerComment = ["store", "customerComment"];
exports.customerName = ["store", "customerName"];
exports.dialog = ["store", "dialog"];

exports.siteRoutes = ["store", "siteRoutes"];
exports.drivers = ["store", "drivers"];
exports.calendar = ["store", "calendar"];
exports.currentDriver = ["store", "currentDriver"];
exports.compareDriver = ["store", "compareDriver"];
exports.news = ["store", "news"];
exports.article = ["store", "article"];
exports.suggestionDrivers = ["store", "suggestionDrivers"];
exports.formDriverPostNews = ["store", "formDriverPostNews"];
exports.formResetPWD = ["store", "formResetPWD"];

exports.login = ["store", "login"];
exports.hasMoreNews = [exports.news, function (news) {
	return news.getIn(["meta", "hasMoreNews"]);
}];
