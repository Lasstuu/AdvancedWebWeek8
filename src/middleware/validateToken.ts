import {Request, Response, NextFunction} from "express"
import jwt, {JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

interface CustomRequest extends Request{
    user?: JwtPayload
}

const validateToken = (req: CustomRequest, res: Response, next: NextFunction) =>{
    const token: string | undefined = req.header('authorization')?.split(" ")[1]
    if(!token){
        res.status(401).json({message: "Token not found."})
        return 
    }
    try{
        const verified: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload
        req.user = verified
        next()
        
    }catch(error:any){
        res.status(400).json({message: "Access denied, missing token"})
    }
    
}


const validateAdmin = (req: CustomRequest, res: Response, next: NextFunction) =>{
    const token: string | undefined = req.header('authorization')?.split(" ")[1]
    if(!token){
        res.status(401).json({message: "Token not found."})
        return 
    }
    try{
        const verified = jwt.verify(token, process.env.SECRET as string) as JwtPayload
        if(!verified.isAdmin){
            res.status(403).json({message: "Access denied."})
            return 
        }
        req.user = verified
        next()
        return verified
    }catch(error:any){
        res.status(400).json({message: "Access denied, missing token"})
    }
    

}

export {validateToken, validateAdmin}

