import type { Context, HandlerEvent } from "@netlify/functions"

const notify = async (message: string) => {
    const body = {
        content: message,
        embeds: [
            {
                image: {
                    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzV0NHVvbWl1cHlsZ3BsejYzbXN4Y2kycTZ6MmNqY29uOGllb24zayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/349qKnoIBHK1i/giphy.gif'
                }
            }
        ]
    }

    const response = await fetch(process.env.DISCORD_WEBHOOK_URL ?? '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        console.log("Something went wrong trying to send message to discord")
        return false;
    }
    return true;
}

const onStar = (payload: any): string => {
    let message: string = '';
    const { starred_at, action, sender, repository } = payload;
    return `User ${sender.login} ${action} star on ${repository.full_name}`
}

const onIssue = (payload: any): string => {
    let message: string = '';
    const { action, issue } = payload;

    if (action === 'opened') {
        message = `An issue was ${action} with this title: "${issue?.title}"`;
    } else {
        message = `Àn issue was ${action} by ${issue?.user?.login}`;
    }
    // else if (action === 'closed') {
    //     message = `Àn issue was ${action} by ${issue.user.login}`;
    // } else if (action === 'reopened'){
    //     message = `Àn issue was ${action} by ${issue.user.login}`;
    // } else {
    //     message = `Àn issue was ${action} by ${issue.user.login}`;
    // }

    return message;
}


export default async (req: Request, event: HandlerEvent, context: Context) => {
    const githubEvent = req.headers.get('x-github-event') ?? 'Unknown';
    const payload = await req.json();
    let message = ''
    switch (githubEvent) {

        case 'star':
            message = onStar(payload)
            break;
        case 'issues':
            message = onIssue(payload)
            break;
        default:
            message = `Unknown Event: ${githubEvent}`
            break;
    }

    await notify(message);

    return new Response(JSON.stringify("Github-Discord Done!"), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
