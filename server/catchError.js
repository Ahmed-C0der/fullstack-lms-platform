export default function catchError (res,error){
    console.log(error)
    return res.status(500).json({message:error?error.message : "there is an err with server try later"})
}