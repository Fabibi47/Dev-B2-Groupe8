const bcrypt = require('bcrypt');
const saltRounds = 10; // Facteur de travail
const Players = require('../models/Players.js');

const hashPassword = async (plainPassword) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe :', error);
        throw error;
    }
};

const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Erreur lors de la comparaison des mots de passe :', error);
        throw error;
    }
}

exports.Login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const player = await Players.getPlayerByUsername(username);
        if (!player) {
            return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        const isMatch = await comparePassword(password, player.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        // Authentification réussie
        req.session.playerId = player.player_id; // Stocker l'ID du joueur dans la session
        return res.status(200).json({ message: 'Authentification réussie', playerId: player.player_id });
    } catch (error) {
        console.error('Erreur lors de l\'authentification :', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
}