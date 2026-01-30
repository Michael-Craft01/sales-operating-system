import { getServerSession } from "next-auth/next";
import { GET as authOptions } from "../../auth/[...nextauth]/route";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session: any = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    try {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
        const endOfWeek = new Date(today.setDate(today.getDate() + 7));

        const response = await calendar.events.list({
            calendarId: "primary",
            timeMin: startOfWeek.toISOString(),
            timeMax: endOfWeek.toISOString(),
            singleEvents: true,
            orderBy: "startTime",
            fields: "items(id, summary, start, end, htmlLink)"
        });

        return NextResponse.json({ events: response.data.items });
    } catch (error) {
        console.error("Google Calendar API Error:", error);
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}
