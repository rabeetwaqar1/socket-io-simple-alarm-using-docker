
exports.get = (req, res) => {
    return res.json({
        status: 200
    });
};

exports.post = (req, res) => {
    let body = req.body;
    if (body) {
        if (typeof io !== 'undefined') {
            io.emit("alarm", body);
        }
    }
    return res.json({
        status: 200,
        data: body
    });
};

exports.update = (req, res) => {
    return res.json({
        status: 200
    });
};


exports.delete = (req, res) => {
    return res.json({
        status: 200
    });
};