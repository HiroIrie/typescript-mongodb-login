import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router/index';
import dotenv from 'dotenv';

dotenv.config();
const app=express();
const uri=process.env.MONGO_URI;

app.use(cors({
    credentials:true
}));

app.use(compression());
app.use(cookieParser());
app.use(express.json());

const server = http.createServer(app);

server.listen(8080,()=>{
    console.log('サーバーが起動しました');
});


mongoose.connect(uri).then(()=>{
    console.log('サーバーに接続しました');
}).catch((err)=>{console.log('接続エラー:',err)});

app.use('/',router());