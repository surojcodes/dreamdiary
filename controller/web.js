exports.loadIndex = (req, res, next) => {
    res.render('index');
}
exports.loadBlog = (req, res, next) => {
    res.render('blog');
}
exports.loadDreams = (req, res, next) => {
    res.render('dreams');
}
exports.loadDream = (req, res, next) => {
    res.render('dream');
}