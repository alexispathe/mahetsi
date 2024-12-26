import { authMiddleware } from 'next-firebase-auth-edge';

// Tu clave privada JWK
const privateKey = {
  "kty": "RSA",
  "kid": "iS9KVZbeBRkJ31We1DoJVXznjF4mEwldmcmwmK7BKpk",
  "n": "yDrPl8yubTc9oC9qMP_r-EqKzPPJnUYjj_OE3NBiKGSXx4olPijpip-Un2SoeCW4FbUMEjjTspwxUe8Db6EDJgy08m9vP0eMo29oMmwzDL7BPb-4gSuYkE11lCiEJhQV1i0QUbD3i9bqf2WkI7CLO7lY6tQQBjSJpc-vO485Sbh9Z4yD2_uyCcAIpp3PeomKV4pyNMMRKiFYSSBN2BccraGM2re30OomCDJH0BtgxeC6hPQ-qUHR95YYxxBo-KQ7NJOV5WaQXJ0PjVxSbz61NwwzDiXvQNtSrGjE8NlTlqIfDJwvbXNC7uWI4oF_zEUVp1HMOK-_aRaP2bMPSlmIyw",
  "e": "AQAB",
  "d": "qUx4vHxXO4dKtweAPWAWsECu7a5v2Wg1p4Ca5W3YoRi08QXQiadkGE7oBoHApJ4X8Vq8kyezb8D7PrDeceNtWx3BXX91S8b-li4bpw6vd2ZO1BwoMCehftnPwe8kFWJEOGyv8LK2DGoyqndRes_KWjxUf3HA_s4rWKSrIKvwH3C65zyeR0UACIuqmfbZbANckJQYBzTDDTgHMK6YihTJZrLzGJNhQvhZV6vLvo3Hm3Da7qnhl1YDG5B5fxB_B5o6A5FFWJ0XugTCp0TwKW8sUtAwWSiiyFBbdJBET3zWzc8pIfO3yEirsahj-e9qAOPCZm8JY3JLf_MEJf6AXwDVIQ",
  "p": "-jvVycYd9zYPu_OfPzRwik7j_-m5mDWQysCAFzF0yaV1kiXnJgnYxnbzloGQnDiCj1R0plF0Zs9Ht7xpOsoipOK4_Yb_Re8Bne8z-oUXoTRr8MRTf1RxEWPJadMAaYf2kNycLJGWIw5FRKCarPMRVyhEWtAIiyF3lmw0_fGbPJs",
  "q": "zNf-tzi8SjX33XbLrJECdQqHBPetZJmv5-r5as-BIhGGf0CLbfCVa9GyIuAE1AXpXPrW9JKfzgF8yjNsXVYIUVnTkZxGcSa491k9kKY9Ps8D52HDHjeMDz8UQw2LDMbycoX2Xbs7TORMZkRtShXikA1QdZ2BeDDE0KqrkSg_b5E",
  "dp": "G1iSonxOJgf4bDfRfVzDt7mrXPoz2BhyfFXRKbez5Z15XcFao2OMFxRExnveS9Q5IGTAYrSgHeQlGEU00sHoS1CjmsE4AHKAILxVV9lXnbxW13b9EPsvaBEZn8D5WI8NOQOC5bP7TlVu6HMMtD3T9UxnO-1kIaBEq2Gj4OSYbGU",
  "dq": "HevrHA5giqKJe0MQCzv_VONdx576J_i_FixflHeNEFHpCIuAEmYTHXW7BJcefW4DoX5OidklGK1k8hBC4vtfKarqWZmvPHYAjLjvYkK2LYeFtXW1T6OjhNKc_hJrXkltPsdMrnJb_iZW9pVGNY0u1AXt29BPCiRti2FywDhV09E",
  "qi": "iy3-e7UAG01HfgxMlg_u6w6HUqcWkra1b4nCutZ6emt8ov794W21fsG6ApYR0y1zXFK2edBGDzaNv-XDsir5b2u1eeWOT_ASB3yNANnozdCnYMaTINqEkfdvLfTW--AINZK7JBe7fAIVGuIkzYCONYKAN-WO5fhBvLZo5sPlm8A"
}

// Convierte el JWK a un KeyObject

export async function middleware(request) {
  console.log("Entro al middleware");

  return authMiddleware(request, {
    loginPath: '/api/sessionLogin',
    logoutPath: '/api/sessionLogout',
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    cookieName: 'session',
    cookieSignatureKeys: [privateKey], // Utiliza el KeyObject convertido
    cookieSerializeOptions: {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hora en segundos
    },
    serviceAccount: {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    },
  });
}

export const config = {
  matcher: [
    '/api/brands/private/:path*',
    '/api/cart/:path*',
    '/api/categories/private/:path*',
    '/api/favorites/:path*',
    '/api/products/private/:path*',
    '/api/roles/:path*',
    '/api/sessionLogout',
    '/api/types/private/:path*',
    '/api/verify-session',
  ],
};