import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { refreshAccessToken } from "./models/auth.service";

class AuthorizationError extends Error {}

//세션 스토리지 생성 코드
export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: ["secret"], // Production 에서는 secrets 도 설정해야하고, secure 옵션도 켜주는 것이 좋다.
  },
});

//유저 세션에서 토큰과 만료일을 가져오는 코드
export async function getUserToken(request: Request): Promise<{
  accessToken: string;
  refreshToken: string;
  expirationDate: number;
}> {
  const session = await getSession(request.headers.get("Cookie")); // 쿠키를 통해 유저 세션을 가져온다.
  const accessToken = session.get("accessToken");
  const refreshToken = session.get("refreshToken");
  const expirationDate = session.get("expirationDate");
  return { accessToken, refreshToken, expirationDate };
}

//유저 세션에서 JWT 토큰을 검증하고 반환하는 코드
export async function authenticate(request: Request, headers = new Headers()): Promise<any> {
  try {
    const { accessToken } = await getUserToken(request); // 유저 세션에 있는 토큰을 가져온다.

    if (!accessToken) throw redirect("/auth/login"); // 토큰이 없을 경우 로그인 페이지로 이동한다.

    const session = await getSession(request.headers.get("Cookie"));

    if (new Date(session.get("expirationDate") * 1000) < new Date()) {
      throw new AuthorizationError("Expired");
    } // 만료일이 현재 날짜보다 지난 경우, 인증 에러를 던진다.

    return { accessToken }; // 에러가 없을 경우 유저 세션에 있던 Access Token 을 반환한다.
  } catch (error) {
    if (error instanceof AuthorizationError) {
      const { refreshToken } = await getUserToken(request); // 유저 세션에서 Refresh Token 을 가져온다.

      if (new Date(getExpireDate(refreshToken) * 1000) < new Date()) {
        throw await logout(request); // Refresh Token 만료 기한이 지난 경우 로그아웃 처리를 한다.
      }

      const newTokens = await refreshAccessToken({ refreshToken }); // Refresh Token 을 통해 Access Token 을 가져온다.

      if (newTokens.statusCode === 403) {
        // Refresh Token 에 문제가 있는 경우 로그아웃 처리를 한다.
        throw await logout(request);
      }

      const session = await getSession(request.headers.get("Cookie"));

      // 유저 세션을 들고온 후 새 토큰과 기존 Refresh Token 으로 지정한다.
      session.set("accessToken", newTokens.access_token);
      session.set("refreshToken", refreshToken);
      console.log(newTokens.access_token);
      session.set("expirationDate", JSON.parse(atob(newTokens.access_token.split(".")[1])).exp);

      headers.append(
        "Set-Cookie",
        await commitSession(session, {
          maxAge: 7 * 24 * 60 * 60 * 1,
        })
      );

      // 만약 GET 메소드 요청 (라우트 접속, loader 실행) 일 경우 redirect 처리를 한다.
      if (request.method === "GET") throw redirect(request.url, { headers });

      // 그 외는 Access Token 과 새 유저세션이 담긴 헤더를 반환한다.
      return { accessToken: newTokens.access_token, headers };
    }

    throw error;
  }
}

//세션 스토리지에 토큰과 함께 유저 세션을 생성하는 코드
export const getExpireDate = (jwt: string): number => parseInt(JSON.parse(atob(jwt.split(".")[1])).exp); // JWT 토큰에서 만료일을 가져오는 코드

export async function createUserSession({ request, access_token, refresh_token, redirectTo }: { request: Request; access_token: string; refresh_token: string; redirectTo: string }) {
  const session = await getSession(request.headers.get("Cookie")); // 쿠키 값을 통해 세션을 가져온다.
  // JWT 토큰과 만료 기한을 유저 세션에 지정한다.
  session.set("accessToken", access_token);
  session.set("refreshToken", refresh_token);
  session.set("expirationDate", getExpireDate(access_token));
  return redirect(redirectTo, {
    headers: {
      // Header 를 반환해야 유저단에서 쿠키로 유저 세션을 등록할 수 있다.
      "Set-Cookie": await commitSession(session, {
        maxAge: 7 * 24 * 60 * 60 * 1, // 쿠키 지정 후 1주일 동안 유효하도록 설정한다.
      }),
    },
  });
}

//로그아웃
export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/auth/login", {
    headers: {
      "Set-Cookie": await destroySession(session), // 유저 세션 삭제 후 반환
    },
  });
}
