


//---------------------------------------------- 08-12-2025 START ---------------------------------------------- 

1) display: inline-flex;

Which means:
Inline-level box
-> It flows within text like an inline element (<span> style).
-> It does not take the full width like a block element.

Flex container
-> Inside it, all children are laid out using flexbox, just like display: flex.


🔍 When to use inline-flex?

Use it when:

->You want elements to sit next to each other horizontally.
->You still want to use flexbox for alignment inside the element.
->Example: buttons, badges, chips, icons + text combos.






//---------------------------------------------- 08-12-2025 END ---------------------------------------------- 

//---------------------------------------------- 27-12-2025 START ---------------------------------------------- 

1) npm install @react-oauth/google

2) 2️⃣ Wrap app with provider
import { GoogleOAuthProvider } from "@react-oauth/google";

<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <App />
</GoogleOAuthProvider>



3) 3️⃣ Use useGoogleLogin (THIS is what you want)

import { useGoogleLogin } from "@react-oauth/google";
import axios from "@/lib/axios";

const googleLogin = useGoogleLogin({
  flow: "auth-code", // IMPORTANT
  onSuccess: async (response) => {
    // response.code ← THIS is what you send to backend
    await axios.post("/auth/google", {
      code: response.code,
    });
  },
  onError: () => {
    console.log("Google login failed");
  },
});

<button
  type="button"
  onClick={() => googleLogin()}
  className="w-full border-4 border-black px-6 py-3 text-xl font-black"
>
  Google Login
</button>















//---------------------------------------------- 27-12-2025 END ---------------------------------------------- 