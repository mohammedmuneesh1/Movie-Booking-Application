//-------------------------------------------------- 04/12/2025 START ----------------------------------------------------------

1) INSTALLING CLERK ON EXPRESS 

npm install @clerk/express



//-------------------------------------------------- 04/12/2025 END ----------------------------------------------------------


//-------------------------------------------------- 21/12/2025 START ----------------------------------------------------------

1) <!-- /toISOString() -->

const date = show.showDateTime.toISOString().split('T')[0];
//toISOString() converts a JavaScript Date object into a standard ISO 8601 string.

YYYY-MM-DD → date

T → separator (date ↔ time)

HH:mm:ss.sss → time

Z → UTC timezone, not your local time

Why .split('T')[0]?

Because you only want the date part, not time.

"2025-12-21T13:00:00.000Z".split('T')



2) date.setHours(hours, minutes, seconds, milliseconds)


   const [hour, minute] = time.split(':').map(Number);

 //Extracts hours and minutes from "8:00" → 8 and 0  ,
//  Number("00") -> 0, Number("01")  // 1 , Number("10")  // 10
//8:00 -> [8,0] , 9:00 -> [9,0] , 16:02 -> [16,2] , 16:30 -> [16,30]
 console.log('hour',hour,'minute',minute);

const showDateTime = new Date(showDate);
//showDateTime 2026-03-10T00:00:00.000Z
 console.log('showDateTime',showDateTime);

           showDateTime.setHours(hour, minute, 0, 0);



3)  const { origin } = req.headers; 
What origin contains

It tells you where the request came from (scheme + domain + port).
Origin: http://localhost:3000



4) 

    showData.markModified('occupiedSeats');
    //When markModified() IS needed (important) ❌ Plain object / Mixed type 
    //mutating a nested object, not reassigning it, using a dynamic key (seat)


//-------------------------------------------------- 21/12/2025 END ----------------------------------------------------------

//-------------------------------------------------- 27/12/2025 START----------------------------------------------------------


1) google Auth 

// npm install google-auth-library axios

import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage" // IMPORTANT for popup auth-code flow
);


import { Request, Response } from "express";
import axios from "axios";

export const USER_LOGIN_FN = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Authorization code missing" });
    }

    // 1. Exchange auth code for tokens
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    // 2. Fetch Google user info
    const googleUserRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const { email, name, picture } = googleUserRes.data;

    if (!email) {
      return res.status(400).json({ message: "Google account has no email" });
    }

    // 3. CHECK USER IN YOUR DB
    // const user = await User.findOne({ email });

    // 4. CREATE USER IF NOT EXISTS
    // 5. CHECK ADMIN ROLE HERE (VERY IMPORTANT)

    // 6. ISSUE YOUR OWN JWT (not Google token)
    // const token = signJwt({ userId: user._id, role: user.role });

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      // token
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Google authentication failed" });
  }
};




2) $UNWIND

const userTop10FavouriteMovies = await FavoriteModel.aggregate([
  {
    $group: {
      _id: "$movieRef", //this id is the lookup id 
      totalFavorites: { $sum: 1 },
    },
  },
  {
    $sort: { totalFavorites: -1 },
  },
  {
    $limit: 10,
  },
  {
    $lookup: {
      from: "movies", // Mongo collection name (plural!)
      localField: "_id", // movieRef after grouping
      foreignField: "_id",  // Movie _id
      as: "movie",
    },
  },
  {
    $unwind: "$movie",
  },
  {
    $project: {
      _id: 0,
      movie: 1,
      totalFavorites: 1,
    },
  },
]);



  {
    $unwind: "$movie",
  },


  EACH DOCUMENT BEFORE UNWIND LOOK LIKE THIS 

  {
  movie: [
    {
      _id: ObjectId("..."),
      title: "Inception",
      poster_path: "...",
      ...
    }
  ],
  totalFavorites: 42
}




What $unwind does

$unwind takes an array field and turns each element into its own document.


So this:

movie: [
  { title: "Inception" }
]

Becomes:
movie: { title: "Inception" }


Final shape WITH $unwind

{
  movie: {
    _id: "...",
    title: "Inception",
    ...
  },
  totalFavorites: 42
}




//-------------------------------------------------- 27/12/2025 
END----------------------------------------------------------

//-------------------------------------------------- 30/12/2025 
START ----------------------------------------------------------
Yes.
A return inside a for...of loop immediately exits BOTH:

the loop
the function itself
No debate. No edge case.
What happens in your code (step-by-step)
for (const type of PRIORITY) {
  ...
  return selected;
}


Execution flow:
Loop starts with first type
Finds candidates
Picks selected
Hits return selected
Function exits immediately
Loop is terminated
Nothing after this runs

So yes:

❌ loop does NOT continue
❌ next priority types are NOT checked
✅ function returns selected
This is exactly what you want in this logic.

//-------------------------------------------------- 30/12/2025 
END ----------------------------------------------------------


//-------------------------------------------------- 31/12/2025 
START ----------------------------------------------------------


INSTALLING STRIPE PACKAGE

i) npm install stripe
ii) after that we have to add another package ---> npm install svix   ---> that will be used for to verify stripe payment, strip webhooks, to manage stripe webhooks, we use svix 
iii)  



webhooks stripe 

in payment intent : https://movie-booking-application.vercel.app/


https://dashboard.stripe.com/acct_1SkJ3aChVooBhQhu/test/workbench/webhooks/create


in payment_intent -> payment_intent.succeeded -> continue buton --> then we can see webhook endpoint -> endpoint URL : 
 (add vercel/ec2) url there 

 https://movieBookingUrl.app/api/stripe




then we will get 

Signing secret
Use this secret to verify that events come from Stripe. You can always view or roll this secret from the destination details page.




a) app.use('/api/stripe',express.raw({type:'application/json'}),stripeWebHooks);



“If the request’s Content-Type is application/json, give me the body as a Buffer, exactly as it arrived.”


express.raw() means “don’t touch the request body”.
No parsing. No JSON conversion. No cleverness. Just raw bytes.



Why Stripe DEMANDS raw body (important)

Stripe webhook verification works like this:

Stripe sends:
Raw payload (bytes)
stripe-signature header


Stripe SDK:
Recomputes a hash using the raw bytes
Compares it with the signature





//-------------------------------------------------- 31/12/2025 
END ----------------------------------------------------------





// "start": "env-cmd -f .env node dist/app/server.js",


