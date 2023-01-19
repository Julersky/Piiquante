module.exports = (req, res, next) => {
    try {
        if (!req.body.email || req.body.email === undefined || req.body.email == null) {
            return res.status(401).json({ error: "Le champs email est obligatoir. Veuillez le renseigner" });
        }
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};