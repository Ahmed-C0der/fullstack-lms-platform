type IMethod = "GET"|"POST"|"PUT"|"PATCH"|"DELETE"
const interactWithDB = async <T>(
  url: string,
  method:IMethod="GET",
  body?:object  | undefined | null
): Promise<{ target: T | null; isFinished: boolean }> => {
  let target: T | null = null;
  let isFinished: boolean = false;
  try {
    const BASE_URL = process.env.BACKEND_SERVER || "http://localhost:5000";
    const responst: Response = await fetch(`${BASE_URL}${url}`, {
      credentials: "include",
      method,
       headers: {
    "Content-Type": "application/json",
  },
      body:body ?JSON.stringify(body) : null
    });
    if (!responst.ok) {
      throw new Error();
    }
    const result: T = await responst.json();
    target = result;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    target = null;
  } finally {
    isFinished = true;
    return { target, isFinished };
  }
};

export default interactWithDB;
