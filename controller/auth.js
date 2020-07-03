exports.login = (req, res, next) => {
    res.render('login');
}
exports.register = (req, res, next) => {
    res.render('register');
}
exports.forgotPassword = (req, res, next) => {
    res.render('forgotPassword');
}
exports.loadDashboard = (req, res, next) => {
    res.render('dashboard_dreams', {
        layout: 'dashboard',
    });
}
exports.addDream = (req, res, next) => {
    res.render('dashboard_add_dream', {
        layout: 'dashboard',
    });
}