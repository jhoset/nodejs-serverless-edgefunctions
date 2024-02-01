import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
    console.log("Hello World from helloHandler");
    return new Response(JSON.stringify("Hello, world Netlify!"), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
