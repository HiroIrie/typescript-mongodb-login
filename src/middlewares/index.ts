import express from 'express';
import {get,merge}from 'lodash';
import { getUserBySessionToken } from '../db/users';

export const isOwner=async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
try{
    console.log(req);
const {id}=req.params;
const currentUserId=get(req,'identity._id') as string;
if(!currentUserId){return res.status(403).send('ユーザーidが見つかりません')}
if(currentUserId.toString()!==id){
    return res.sendStatus(403);
}
next();
}catch(err){
    console.log(err);
    return res.sendStatus(400);
}
}

export const isAuthenticated=async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
try{
const sessionToken=req.cookies['ANTNIO-AUTH'];
if(!sessionToken){
   return res.status(403).send('アクセス権がありません。');
}
const existingUser=await getUserBySessionToken(sessionToken);
if(!existingUser){
    return res.status(403).send('情報の取得に失敗しました。');
}
 merge(req,{identity:existingUser});
 console.log(req);
return next();
}catch(err){
    console.log(err);
    res.status(400).send('データの取得に失敗しました。')
}
}