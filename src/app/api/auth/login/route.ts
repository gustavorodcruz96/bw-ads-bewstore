import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createServiceClient } from "@/lib/supabase";
import { createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha obrigatórios" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: user, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 });
    }

    const token = createSession(user.id, user.email);
    const response = NextResponse.json({ success: true });

    response.cookies.set("bw_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("[Login]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
