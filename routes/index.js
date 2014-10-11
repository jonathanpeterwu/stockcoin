// module.exports = function(app, route, controller) {

// 	// API Resource controller referenecs
// 	var capsul = controller.capsul;
// 	var media = controller.media;
// 	var users = controller.users;

// 	// CapsulE
// 	app.use(route.get('/', capsul.home));

// 	// Media Selections
// 	app.use(route.get('/images', media.images));
// 	app.use(route.get('/text', media.text));

// 	// User Routes
// 	app.use(route.get('/users/:id', users.user));
// 	app.use(route.post('/users', users.create));
// 	app.use(route.put('/users/:id', users.update));
// 	app.use(route.delete('/users/:id', users.deleteUser));
// 	app.use(route.get('/users/:id/media', users.collection));

// 	// Test Collection
// 	app.use(route.get('/users/:id/test', users.collectionTest));
// }