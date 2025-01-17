export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJhODdkMzc1ZS04MWIzLTQ0ZGMtYWU0Ny00OGUzYmMxNzJkNmEiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTczNjkxOTQ2MywiZXhwIjoxNzY4NDU1NDYzfQ.bFQM0XlARM66ahaWcMHBRpExywftSZPuY6JG19039PE"

export const createMeeting = async ({ token }) => {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
        method: "POST",
        headers: {
            authorization: `${authToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });
    const { roomId } = await res.json();
    return roomId;
};