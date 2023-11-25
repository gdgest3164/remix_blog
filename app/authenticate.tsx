import { getUserToken } from "./auth.server";

export async function authenticate(request: Request, headers = new Headers()): Promise<{ accessToken: string; headers?: Headers }> {
  try {
    const { accessToken } = await getUserToken(request); // 유저 세션에 있는 토큰을 가져온다.

    if (!accessToken) throw redirect("/auth/login"); // 토큰이 없을 경우 로그인 페이지로 이동한다.

    const session = await getSession(request.headers.get("Cookie"));

    if (new Date(session.get("expirationDate") * 1000) < new Date()) {
      throw new AuthorizationError("Expired");
    } // 만료일이 현재 날짜보다 지난 경우, 인증 에러를 던진다.

    return { accessToken }; // 에러가 없을 경우 유저 세션에 있던 Access Token 을 반환한다.
  } catch (error) {
    // Refresh Token 을 통한 Access Token 갱신 로직 구현
    // Try - catch 가 아닌 갱신 함수를 별도의 함수로 이전시켜 구현하는 것도 좋은 방법이다.
  }
}
