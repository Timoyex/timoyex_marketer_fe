import { GOOGLE_RECAPTCHA_SECRET_KEY } from "@/app.config";

export async function POST(request: Request) {
  const { token } = await request.json();

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${GOOGLE_RECAPTCHA_SECRET_KEY}&response=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  const ver = await response.json();

  if (ver.success) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    return new Response(JSON.stringify({ success: false }), {
      status: 422,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
