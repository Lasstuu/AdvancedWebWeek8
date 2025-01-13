import {Request, Response, Router} from "express"
import {body, Result, ValidationError, validationResult} from "express-validator"
import bcrypt from "bcrypt"
import {User, IUser} from "./models/User"
import jwt, {JwtPayload} from "jsonwebtoken"
import {validateToken} from "./middleware/validateToken"
import{registerValidation, loginValidation} from "./validators/inputValidation"


const router:Router = Router()



router.post("/api/user/register",
    registerValidation,
    async(req: Request, res: Response):Promise<any> => {
        const errors: Result<ValidationError> = validationResult(req)
        if(!errors.isEmpty()){
            console.log(errors);
            return res.status(403).json({errors: errors.array()})
        }
    try{
        const existingUser: IUser | null = await User.findOne({email: req.body.email})
        console.log(existingUser)
        if(existingUser){
            return res.status(403).json({email: "Email already in use"})
        }
        const salt: string = bcrypt.genSaltSync(10)
        const hash: string = bcrypt.hashSync(req.body.password, salt)

        const newUser = await User.create({
            email: req.body.email,
            password: hash,
            username: req.body.username,
            isAdmin: req.body.isAdmin
        })
        return res.json(newUser)

    }catch(error:any){
        console.error(`Error during registration: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
})

router.post("/api/user/login",
    loginValidation,
    async (req: Request, res: Response):Promise<any> => {
        try{
            const user: IUser | null = await User.findOne({email: req.body.email})
            if(!user){
                return res.status(404).json({message: "Login failed"})
            }
            if(bcrypt.compareSync(req.body.password, user.password as string)){
                const jwtPayload: JwtPayload = {
                    id: user._id,
                    username: user.username,
                    isAdmin: user.isAdmin
                }
                const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {expiresIn: "2m"})

                return res.status(200).json({success: true, token})
            }
            return res.status(401).json({message: "Login failed"})

        }catch(error:any){
            console.error(`Error during user login: ${error}`)
            return res.status(500).json({message: "Internal server error"})
        }
    })

export default router