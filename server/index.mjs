import {initMongodb, saveUsers} from "./db/mongodb.mjs";
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {authRouter} from './auth/auth.mjs';
import "express-async-errors";
import {resumeRouter} from './resume/resume.mjs';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res,next) => {
    res.json({
        message: "Hello world",
    });
});
app.use("/uploads", express.static("uploads"));
app.use(express.static('public'))

app.use("/auth", authRouter);
app.use("/resume", resumeRouter);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});

function errorHandler(err, req, res, next) {
    console.log(err)
    res.status(500)
    res.json( { error: 'error' }) 
}

app.use(errorHandler);


(async () => { 
    await initMongodb();
  
})()
