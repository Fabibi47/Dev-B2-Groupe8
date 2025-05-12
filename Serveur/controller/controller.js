const bcrypt = require('bcrypt');
const saltRounds = 10; // Facteur de travail

const Players = require('../models/Players.js');
const Games = require('../models/Games.js');
const Waiting = require('../models/Waiting.js');

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


exports.getLogin = async (req, res) => {
    try{
        if (req.session.user) { 
            res.redirect('/home');
        }
        res.render('login', { error: null, user: {username: null} });
    }catch (error) {
        console.error('Erreur lors de la récupération de la page de connexion :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const player = await Players.getPlayerByUsername(username);
        if (!player) {
            res.redirect('/login');
        }

        const isMatch = await comparePassword(password, player.password);
        if (!isMatch) {
            res.redirect('/login');
        }

        // Authentification réussie
        req.session.user = player.player_id; // Stocker l'username du joueur dans la session
        res.redirect('/home');
    } catch (error) {
        console.error('Erreur lors de l\'authentification :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

exports.getRegister = async (req, res) => {
    try {
        // Si l'utilisateur est déjà connecté, il est redirigé vers la page d'accueil
        if (req.session.user) { 
            res.redirect('/home');
        } else {
            res.render('register', { error: null, user: {username: null} });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la page d\'inscription :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

exports.postRegister = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Vérification si le nom d'utilisateur existe déjà
        const existingPlayer = await Players.getPlayerByUsername(username);
        if (existingPlayer) {
            res.status(409).json({ message: 'Nom d\'utilisateur invalide' });
        }

        // Hachage du mot de passe
        const hashedPassword = await hashPassword(password);
        await Players.addPlayer(username, hashedPassword);

        // Enregistrement réussi
        res.redirect('/login');
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

exports.getHome = async (req, res) => {
    try {
        // Vérification si l'utilisateur est connecté
        if (!req.session.user) {
            res.redirect('/login');
        } else {

            // Récupération des informations du joueur

            const player = await Players.getPlayer(req.session.user);
            console.log(player);

            const user = {
                username: player.username,
                mmr: player.matchmaking_rating
            };

            res.render('index', { user: user });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la page d\'accueil :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

exports.getLoading = async (req, res) => {
    try {
        // Vérification si l'utilisateur est connecté
        if (!req.session.user) {
            res.redirect('/login');
        } else {
            const player = await Players.getPlayer(req.session.user);
            const games = await Games.getGameByPlayerId(player.player_id);
            console.log(games);

            // Si le joueur est déjà dans la liste d'attente, il est redirigé vers la page de jeu
            if (games) {
                if (games.length > 0) {
                    res.redirect('/game');
                }
            }
            res.render('loading', { user: player });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la page de chargement :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

exports.getGame = async (req, res) => {
    try {
        // Vérification si l'utilisateur est connecté
        if (!req.session.user) {
            res.redirect('/login');
        } else {
            const player = await Players.getPlayer(req.session.user);
            const game = await Games.getGameByPlayerId(player.player_id);
            if (!game) {
                res.redirect('/home');
            }
            if (game.player1_id == player.player_id) {
                sign = 'X';
            }
            else {
                sign = 'O';
            }
            const user = {
                id: player.player_id,
                username: player.username,
                sign: sign
            };

            let opponent;
            if (sign == 'X') {
                opponent = await Players.getPlayer(game.player2_id);
            } else {
                opponent = await Players.getPlayer(game.player1_id);
            }

            
            const opponentUser = {
                id: opponent.player_id,
                username: opponent.username
            }
            if (!opponent) {
                res.redirect('/home');
            }

            res.render('game', { user: user, game: game, opponent: opponentUser });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la page de jeu :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

exports.getLogout = async (req, res) => {
    try {
        // Déconnexion de l'utilisateur
        req.session.destroy((err) => {
            if (err) {
                console.error('Erreur lors de la déconnexion :', err);
                res.status(500).json({ message: 'Erreur serveur' });
            } else {
                res.redirect('/login');
            }
        });
    } catch (error) {
        console.error('Erreur lors de la déconnexion :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}