module.exports = (req, res, next) => {
    try {

        if (!req.body.email || req.body.email === undefined || req.body.email == null) {
            return res.status(401).json({ error: "Le champs email est obligatoire. Veuillez le renseigner." });
        } else {
            let emailRegExp = new RegExp(
                "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
            );
            
            let testEmail = emailRegExp.test(req.body.email);

            if (!testEmail) {
                return res.status(401).json({ error: "Le contenu du champs email, n'est pas une adresse mail valide. Veuillez renseigner une adresse mail valide." });
            }

        }

        if (!req.body.password || req.body.password === undefined || req.body.password == null) {
            return res.status(401).json({ error: "Le champs mot de passe est obligatoire. Veuillez le renseigner." });
        }else {

            let passwordRegExp = new RegExp(
                "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
            );
            
            let testPassword = passwordRegExp.test(req.body.password.value);

            if (!testPassword) {
                return res.status(401).json({ error: "Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre." });
            }

        }

        next();

    } catch (error) {
        res.status(401).json({ error });
    }
};