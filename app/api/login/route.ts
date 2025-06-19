import { NextRequest, NextResponse } from "next/server";

type User = {
  id: string;
  email: string;
  password: string;
};

const users: User[] = [
  { id: "a7d93f4x", email: "user1@gmail.com", password: "password1" },
  { id: "k2p18zqm", email: "user2@gmail.com", password: "password2" },
  { id: "t9w64vne", email: "user3@gmail.com", password: "password3" },
  { id: "m0r37bxa", email: "user4@gmail.com", password: "password4" },
  { id: "z1q82cyd", email: "user5@gmail.com", password: "password5" },
];

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      {
        message: "Email and password are required.",
      },
      { status: 500 }
    );
  }

  const user = users.find(
    (u) => u?.email === email && u?.password === password
  );

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials." },
      { status: 400 }
    );
  }

  return Response.json(
    {
      message: "Login successful!",
      user: { id: user.id, email: user.email },
    },
    { status: 200 }
  );
}
