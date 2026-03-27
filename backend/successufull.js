export default function success (res , status , obj){
    return res.status(status).json(obj)
}