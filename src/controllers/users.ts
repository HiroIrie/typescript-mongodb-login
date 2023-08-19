import express from 'express';
import { getUsers, deleteUserById, getUserById,UserModel } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users);
    } catch (err) {
        console.log(err);
        return res.status(400).send('サーバーに繋がりませんでした。');
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const deleteUser = await deleteUserById(id);
        return res.json(deleteUser);
    } catch (err) {
        console.log(err);
        return res.status(400).send('サーバーに繋がりませんでした。');
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        if (!username) {
            res.status(400).send('名前を入力して下さい。');
        }
        const user = await getUserById(id);
        user.username = username;
        await user.save();
        return res.status(200).json(user).end();
    } catch (err) {
        console.log(err);
        res.status(400).send('サーバーに繋がりませんでした。')
    }
}