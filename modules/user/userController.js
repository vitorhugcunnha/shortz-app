const User = require('./userModel');
const bcrypt = require('bcryptjs');
const fs = require("fs");            // [ADICIONAR]
const path = require("path");        // [ADICIONAR]
const Video = require("../video/videoModel"); // [ADICIONAR] Importa o modelo Video

exports.register = async (req, res) => {
    const { username, email, password, confirmPassword, fullName } = req.body;
     try {
        // Passo 1: gera o salt (valor aleatório único)
        const salt = await bcrypt.genSalt(10);

        // Passo 2: combina a senha + salt e gera o hash
        const hashedPassword = await bcrypt.hash(password, salt);

        // Passo 3: salva o hash no banco (nunca a senha original!)
        await User.create({
            username,
            email,
            password: hashedPassword, // ← apenas o hash
            fullName
        });

        req.flash('success', 'Conta criada com sucesso! Faça seu login.');
        res.redirect('/login');

    } catch (error) {
        console.error(error);
        req.flash('error', 'Erro ao criar conta.');
        res.redirect('/register');
    }
};

exports.login = async (req, res) => {
    try {
        const { login, password } = req.body;

        const user = await User.findOne({
            where: {
                [require('sequelize').Op.or]: [{ email: login }, { username: login }]
            }
        });

        // bcrypt.compare verifica se a senha bate com o hash armazenado
        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash('error', 'E-mail/Usuário ou senha incorretos.');
            return res.redirect('/login');
        }

        const userData = await this.getProfile(userId);
        req.session.user = userData;

    } catch (error) {
        console.error(error);
        req.flash('error', 'Ocorreu um erro ao tentar entrar.');
        res.redirect('/login');
    }
};


exports.logout = (req, res) => {
   req.session.destroy(() => {
      res.redirect('/');
   });
};

exports.getProfile = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
            attributes: ['id', 'username', 'email', 'fullName', 'bio', 'profilePicture']
        });
        return user;
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao buscar perfil do usuário.');
    }
};

exports.renderPublicProfile = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({
            where: { username },
            include: [{
                model: Video,
                attributes: ["id", "title", "thumbnailPath", "views"],
                order: [["createdAt", "DESC"]]
            }],
            attributes: ["id", "username", "fullName", "bio", "profilePicture", "followersCount", "followingCount", "videosCount"]
        });

        if (!user) {
            req.flash("error", "Usuário não encontrado.");
            return res.redirect("/feed");
        }

        // Verifica se o perfil sendo visualizado é o do usuário logado
        const isOwner = req.session.user && req.session.user.id === user.id;

        res.render("profile", { title: `@${user.username} | Shortz-App`, profileUser: user, isOwner });

    } catch (error) {
        console.error("Erro ao carregar perfil público:", error);
        req.flash("error", "Erro ao carregar o perfil. Tente novamente.");
        res.redirect("/feed");
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { fullName, bio } = req.body;
        const userId = req.session.user.id;

        const updateData = { fullName, bio };

        // Se um arquivo foi enviado pelo Multer, ele estará em req.file
        if (req.file) {
            updateData.profilePicture = req.file.filename;
        }

        const oldUser = await User.findByPk(userId);

        await User.update(updateData, { where: { id: userId } });

        // Se uma nova foto foi enviada e o usuário tinha uma foto anterior (não a default),
        // apagar a foto antiga do sistema de arquivos.
        if (req.file && oldUser.profilePicture && oldUser.profilePicture !== 'default-profile.png') {
            const oldProfilePicPath = path.join(__dirname, '../../public/uploads/profiles', oldUser.profilePicture);
            fs.unlink(oldProfilePicPath, (err) => {
                if (err) console.error('Erro ao apagar foto de perfil antiga:', err);
                else console.log('Foto de perfil antiga apagada:', oldProfilePicPath);
            });
        }

        req.flash('success', 'Perfil atualizado com sucesso!');
        res.redirect('/profile/edit');

    } catch (error) {
        console.error(error);
        req.flash('error', 'Erro ao atualizar perfil.');
        res.redirect('/profile/edit');
    }
};