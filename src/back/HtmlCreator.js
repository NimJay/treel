const getLoggedInUser = require('./api/get-logged-in-user.js').postOutput;

class HtmlCreator {

    constructor(req, res, page, callback) {
        getLoggedInUser(req, res, (o) => {
            this.preData = { user: o.get('user') };
            if (page == '/about') {
                // TODO: Alter <meta> tags.
            }
            if (page == '/sign-up') {
                // TODO: Alter <meta> tags.
            }
            if (page === null) res.status(404);
            callback(this);
        });
    }

    create() {
        return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

		<!-- favicon.png -->
		<link rel="shortcut icon" href="favicon.png" type="image/png">
		<link rel="icon" href="favicon.png" type="image/png">

		<title>Treel</title>
		<meta name="description" content="A minimalistic learning management system.">
		<meta name="author" content="Nim">

		<!-- I M P O R T -->
		<!-- Google Fonts: Muli --><link href="https://fonts.googleapis.com/css?family=Muli" rel="stylesheet">
		<!-- treel.css --><link type="text/css" rel="stylesheet" href="/css/treel.css" />

        <!-- PreData --->
        <script>
            var TREEL_PRE_DATA = ${JSON.stringify(this.preData)};
        </script>
	</head>

	<body>
		   <div id="treel"></div>
           <!-- treel.js -->
           <script src="/js/treel.js"></script>
	</body>
</html>
`;
    }
}


module.exports = { HtmlCreator };
