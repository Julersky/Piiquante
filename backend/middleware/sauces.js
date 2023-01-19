module.exports = (req, res, next) => {
    try {
        if (!req.body.sauce || req.body.sauce === undefined || req.body.sauce == null) {
            return res.status(401).json({ error: "Les champs sont obligatoires" });
        }
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};