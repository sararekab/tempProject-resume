import express from "express";
import multer from "multer";
import path from "path";
import { OpenAI } from "openai";
import jwt from "jsonwebtoken";
import e from "express";
import { saveResults } from "../db/mongodb.mjs";

export const resumeRouter = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

resumeRouter.use(async (req, res, next) => {
  console.log(req?.headers);
  const authorization = req?.headers?.authorization || "";
  const jwt_token = authorization.replace("Bearer ", "");
  const decoded = jwt.verify(jwt_token, process.env.JWT_SECRET_KEY);
  if (decoded?.roles?.includes("user")) {
    return next();

  }
  res.statusCode = 403;
  return res.json({
    status: "Unauthorized access",
  });
});

//ROUTES

const generateID = () => Math.random().toString(36).substring(2, 10);
let database = [];
const ChatGPTFunction = async (text) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.3,
    max_tokens: 100,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });
  // console.log('full response', JSON.stringify(response));
  // console.log('response.choices', response.choices)
  return response.choices[0];
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});
resumeRouter.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});
resumeRouter.post(
  "/create",
  upload.single("headshotImage"),
  async (req, res) => {
    const {
      fullName,
      jobDesc,
      email,
      currentPosition,
      currentLength,
      currentTechnologies,
      workHistory, //JSON format
    } = req.body;
    console.log(req.body);

    const workArray = JSON.parse(workHistory); //an array
    //👇🏻 loops through the items in the workArray and converts them to a string
    const remainderText = () => {
      let stringText = "";
      for (let i = 0; i < workArray.length; i++) {
        stringText += ` ${workArray[i].name} as a ${workArray[i].position}.`;
      }
      return stringText;
    };
    //👇🏻 The job description prompt
    const prompt1 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n I write in the technolegies: ${currentTechnologies}. Can you write a 50 words description for the top of the resume(first person writing),Make sure it stands out while accurately reflecting the individual's skills and experiences. this is a job description :" ${jobDesc}" please align your answer to this job description.`;
    //👇🏻 The job responsibilities prompt
    const prompt2 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n I write in the technolegies: ${currentTechnologies}. Can you write 4 points for a resume on what I am good at. this is a job description :" ${jobDesc}" please align your answer to this job description.?`;
    //👇🏻 The job achievements prompt

    const prompt3 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n During my years I worked at ${
      workArray.length
    } companies. ${remainderText()} \n Can you write me 2 bulet points for each company seperated in numbers of my succession in the company (in first person)? this is a job description :" ${jobDesc}" please align your answer to this job description.`;

    //👇🏻 generate a GPT-3 result
    const objective = await ChatGPTFunction(prompt1);
    const keypoints = await ChatGPTFunction(prompt2);
    const jobResponsibilities = await ChatGPTFunction(prompt3);
    //👇🏻 put them into an object
    const chatgptData = { objective, keypoints, jobResponsibilities };
    //👇🏻log the result
    console.log(chatgptData);
    //👇🏻 group the values into an object
    const newEntry = {
      id: generateID(),
      fullName,
      email,
      image_url: `/uploads/${req?.file?.filename}`,
      currentPosition,
      currentLength,
      currentTechnologies,
      workHistory: workArray,
    };
    const data = { ...newEntry, ...chatgptData };
    //👇🏻 push the object into the database array
    database.push(data);
    const authorization = req?.headers?.authorization || "";
    const jwt_token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(jwt_token, process.env.JWT_SECRET_KEY);
    await saveResults({
      userId: decoded?.userId,
      userEmail: decoded?.email,
      ...data,
    });

    res.json({
      message: "Request successful!",
      data,
    });
  }
);
resumeRouter.post(
  "/createFr",
  upload.single("headshotImage"),
  async (req, res) => {
    const {
      fullName,
      jobDesc,
      email,
      currentPosition,
      currentLength,
      currentTechnologies,
      workHistory, //JSON format
    } = req.body;

    const workArray = JSON.parse(workHistory); //an array
    //👇🏻 loops through the items in the workArray and converts them to a string
    const remainderText = () => {
      let stringText = "";
      for (let i = 0; i < workArray.length; i++) {
        stringText += ` ${workArray[i].name} as a ${workArray[i].position}.`;
      }
      return stringText;
    };
    //👇🏻 The job description prompt
    // create prompts for French
    const prompt1French = `J'écris un CV, mes détails sont \n nom: ${fullName} \n rôle: ${currentPosition} (${currentLength} ans). \n J'écris dans les technolegies: ${currentTechnologies}. Pouvez-vous écrire une description de 50 mots pour le haut du CV (écriture à la première personne), assurez-vous qu'il se démarque tout en reflétant avec précision les compétences et l'expérience de la personne. c'est une description de poste: "${jobDesc}" veuillez aligner votre réponse sur cette description de poste.`;
    //👇🏻 The job responsibilities prompt in French
    const prompt2French = `J'écris un CV, mes détails sont \n nom: ${fullName} \n rôle: ${currentPosition} (${currentLength} ans). \n J'écris dans les technolegies: ${currentTechnologies}. Pouvez-vous écrire 8 points pour un CV sur ce que je sais faire. c'est une description de poste: "${jobDesc}" veuillez aligner votre réponse sur cette description de poste.?`;
    //👇🏻 The job achievements prompt in French
    const prompt3French = `J'écris un CV, mes détails sont \n nom: ${fullName} \n rôle: ${currentPosition} (${currentLength} ans). \n Au cours de mes années, j'ai travaillé dans ${
      workArray.length
    } entreprises. ${remainderText()} \n Pouvez-vous m'écrire 50 mots pour chaque entreprise séparés en nombres de ma succession dans l'entreprise (à la première personne)? c'est une description de poste: "${jobDesc}" veuillez aligner votre réponse sur cette description de poste.`;
    //👇🏻 generate a GPT-3 result in French
    const objective = await ChatGPTFunction(prompt1French);
    const keypoints = await ChatGPTFunction(prompt2French);
    const jobResponsibilities = await ChatGPTFunction(prompt3French);
    //👇🏻 put them into an object
    const chatgptData = { objective, keypoints, jobResponsibilities };
    //👇🏻log the result
    console.log(chatgptData);
    //👇🏻 group the values into an object
    const newEntry = {
      id: generateID(),
      fullName,
      email,
      image_url: `/uploads/${req.file.filename}`,
      currentPosition,
      currentLength,
      currentTechnologies,
      workHistory: workArray,
    };
    const data = { ...newEntry, ...chatgptData };
    //👇🏻 push the object into the database array
    database.push(data);

    const authorization = req?.headers?.authorization || "";
    const jwt_token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(jwt_token, process.env.JWT_SECRET_KEY);

    await saveResults({
      userId: decoded?.userId,
      userEmail: decoded?.email,
      ...data,
    });

    res.json({
      message: "Request successful!",
      data,
    });
  }
);
