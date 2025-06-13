import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query) {
            return NextResponse.json({ users: [], hashtags: [] });
        }

        // Search for users
        const { data: users, error: usersError } = await supabase
            .from("users")
            .select("id, username, firstName, lastName, avatar")
            .or(`username.ilike.%${query}%,firstName.ilike.%${query}%,lastName.ilike.%${query}%`)
            .limit(5);

        if (usersError) throw usersError;

        // Search for hashtags
        const { data: hashtags, error: hashtagsError } = await supabase
            .from("hashtags")
            .select("id, name, postCount")
            .ilike("name", `%${query}%`)
            .limit(5);

        if (hashtagsError) throw hashtagsError;

        return NextResponse.json({
            users: users || [],
            hashtags: hashtags || []
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { error: "Failed to perform search" },
            { status: 500 }
        );
    }
} 