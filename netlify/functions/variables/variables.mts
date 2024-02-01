import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {

    console.log("Hello World from variableHandler");
    const myImportantVariable = process.env.MY_IMPORTANT_VARIABLE;

    if ( !myImportantVariable ) {
        throw ('Missing MY_IMPORTANT_VARIABLE');
    }


    return new Response(JSON.stringify(myImportantVariable), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
