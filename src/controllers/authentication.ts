import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('emailとpassword両方を入力してください');
        }
        const emailCheck = await getUserByEmail(email);
        if (!emailCheck) {
            return res.status(400).send('emailアドレスが登録されていません');
        }
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.send(400).send('emailアドレスが登録されていません');
        }
        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            console.log(expectedHash);
            console.log(user.authentication.salt);
            return res.status(403).send('パスワードが一致しません');
        }
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();
        res.cookie('ANTNIO-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
        return res.status(200).json(user).end();
    } catch (err) {
        console.log(err)
        return res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, password, email } = req.body;
        if (!email || !password || !username) {
            return res.status(400).send('email,password,usernameの全てを入力して下さい。')
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).send('このemailアドレスはすでに登録されています。')
        }
        const salt = random();
        const user = await createUser({
            username: username,
            email: email,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });
        return res.status(200).json(user).end();
    } catch (err) {
        console.log(err);
        return res.status(400).send('サーバーの問題で送信出来ませんでした。')
    }
}