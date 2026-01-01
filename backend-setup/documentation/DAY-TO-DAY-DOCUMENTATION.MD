//-------------------------------------------------- 04/12/2025 START ----------------------------------------------------------


//IMP: USED WEBHOOK ON THIS PROJECT FOR STRIPE 


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









                    
2)inngest 

Inngest is not a random library. It solves a very specific backend pain you will hit as your app grows.          
Inngest lets you run background jobs, workflows, and delayed tasks reliably — without managing queues, cron servers, or retries yourself.

                    
            The problem it solves (real talk)

Right now your backend probably does things like:

->Send emails
->Process payments
->Handle webhooks
->Expire bookings
->Release seats
->Sync data

If you do all this inside API requests, you get:

->slow responses
->crashes on retries
->duplicated logic
->no visibility
->hell debugging        

Inngest moves those tasks out of the request lifecycle.
                    
That inngest object is:

->your event bus
->your job scheduler
->your workflow engine
->You use it to:
->Send events
->React to events
->Run background logic safely
                    
                    
| Feature                | Cron       | Inngest |
| ---------------------- | ---------- | ------- |
| Time-based jobs        | ✅          | ✅       |
| Event-based triggers   | ❌          | ✅       |
| Per-user delays        | ❌          | ✅       |
| Retries                | ❌ (manual) | ✅       |
| State awareness        | ❌          | ✅       |
| Idempotency            | ❌          | ✅       |
| Debug UI               | ❌          | ✅       |
| Serverless-friendly    | ❌          | ✅       |
| Step-by-step workflows | ❌          | ✅       |



//-------------------------------------------------- 31/12/2025 
END ----------------------------------------------------------





// "start": "env-cmd -f .env node dist/app/server.js",






2) ingwest alternative 


is ther any apckage that is free to use like ingest on server side without paying ? ingest has to pay if i decide to realworld applicaiton?



Yeah — this is an important question. If you’re building a real-world, production service, you do not want surprise bills or locked-in cloud workflow services you didn’t plan for.

Here’s the blunt truth:

🚫 Inngest is NOT completely free for production

Inngest has a free tier for development and small apps

For serious real-world traffic, you will hit limits and need a paid plan

They bill based on events, executions, and retention

So yes — if you scale to real traffic, a paid plan is a real possibility.

If you’re uncomfortable paying, that’s fair. Most cloud workflow services cost money at scale.

✅ Free / Self-Hosted Alternatives You Can Run Yourself
🟢 1) BullMQ (Redis)

Most popular Node async queue system.

Pros

Free, open-source

Works with Redis (you control it)

Delayed jobs

Retries

Job state / persistence

Can do expiry tasks

Cons

Requires Redis (run it yourself or paid)

Less “workflow orchestration”

More manual wiring

Install:

npm i bullmq


Example basic delayed job:

import { Queue } from "bullmq";

const queue = new Queue("bookingExpiry", { connection: { host: "localhost" } });

await queue.add("expireBooking", { bookingId }, { delay: 10 * 60 * 1000 });


Then worker:

import { Worker } from "bullmq";
new Worker("bookingExpiry", async job => {
  // expire logic
});

🟢 2) Agenda.js (Mongo)

If you already have Mongo, Agenda lets you schedule jobs stored in your DB.

Pros

Doesn’t need Redis

Uses Mongo collections

Easy to schedule jobs

Cons

Single node (cron style) unless clustered

Less robust than BullMQ

Install:

npm i agenda


Schedule job:

await agenda.schedule("in 10 minutes", "expire booking", { bookingId });

🟢 3) Node-Cron (simple)

Plan:

Your app runs an interval

It checks DB and expires bookings

npm i node-cron


Basic:

import cron from "node-cron";

cron.schedule("* * * * *", async () => {
  // check bookings expired and release
});


Not great for per-booking timers, but free and simple.

🟠 4) Temporal / Cadence (powerful, free OSS)

Big-league workflow system, designed for exactly this kind of job orchestration.

Pros

True workflow engine

Durable, fault-tolerant

Can handle retries, timers, long workflows

Cons

Heavy to set up

Requires running your own Temporal server

Harder learning curve

Install Temporal SDK in Node, but you host servers yourself.

🟡 What’s Possible Without Inngest
Feature	Node-Cron	Agenda	BullMQ	Temporal	Inngest
Delayed jobs	❌	✔	✔	✔	✔
Persistent retry	❌	✔	✔	✔	✔
Distributed workers	⚠	⚠	✔	✔	✔
Workflow orchestration	❌	❌	★	⭐	⭐
Free self-hosted	✔	✔	✔	✔	❌ (limited)
Cloud-hosted easy	❌	❌	❌	❌	✔

Stars:
⭐ = best
★ = okay

So which should you pick?
If you want free + simplest

👉 Agenda (uses your Mongo)

Good for:

booking expiry

basic delayed jobs

If you want robust + scale

👉 BullMQ

Good for:

retries

workers

large scale

horizontal processing

⚠ Requires Redis (self-hosted or managed)

If you want workflow engines but free

👉 Temporal

Good for:

complicated sequences

long workflows

business processes

⚠ heavier and more complex

Example with BullMQ (quickest migration from Inngest idea)
Create queue
// queues/bookingExpiry.js
import { Queue } from "bullmq";

export const expiryQueue = new Queue("bookingExpiry", {
  connection: { host: "localhost" },
});

Add job after booking
await expiryQueue.add(
  "expireBooking",
  { bookingId: booking._id.toString() },
  { delay: 10 * 60 * 1000 } // 10 minutes
);

Worker to process
import { Worker } from "bullmq";

new Worker("bookingExpiry", async (job) => {
  const { bookingId } = job.data;
  // expire logic here
});

Final verdict (no BS)

Inngest is great, but not free for production scale

If you don’t want recurring costs, pick a self-hosted alternative

For your specific booking expiry use case:

Agenda (Mongo) or BullMQ (Redis) are both solid free choices

If you want distributed workers → BullMQ is better

If you want, I can give you a full refactor to one of these (Agenda or BullMQ) with sample code matching your booking logic. Pick one.




\

//INGEST STEP BY STEP 

STEP-1 INGEST FUNCTION.TS setup(check the file )
STEP-2 SERVER REGISTRATION (CHECK SERVER.TS )

STEP-3 USING ON CONTROLLER  OF BOOKING 

  try {
    await inngest.send({
      name: "app.checkpayment",
      data: { bookingId: booking[0]._id.toString() },
    });
  } catch (inngestError) {
    // Log but don't fail the request - booking is already saved
    console.error("Inngest send failed:", inngestError);
  }

  STEP-4 : npm install -g inngest-cli

1️⃣ Install the Inngest CLI (globally or via npx)
You must have the CLI. The inngest npm package alone is NOT enough.


  ⚠️ YOU NEED TO RUN INGEST SERVER SEPRATLY AND NPM RUN DEV SEPERATLY 


  
 STEP-5: THEN ON TERMINAL -->  npm install -g inngest-cli


npx inngest-cli dev
npx inngest-cli dev
npx inngest-cli dev
npx inngest-cli dev
npx inngest-cli dev
npx inngest-cli dev
npx inngest-cli dev

    - http://127.0.0.1:8288 (http://localhost:8288)
    THIS WILL BE INNGEST LOCALLY DASHBOARD URL 





  YES — you must run it alongside npm run dev, every time during development.

Do I need to restart npx inngest dev?

If you:

change workflow code
add/remove createFunction
change app ID
change event names
👉 Restart npx inngest dev
Hot reload is not guaranteed for workflow registration.







//INGEST BEHAVIOUR 


User service listening on port 8080 in development mode


[1/1/2026, 14:40:54] [PUT] /api/inngest
[1/1/2026, 14:40:59] [PUT] /api/inngest
[1/1/2026, 14:41:04] [PUT] /api/inngest
[1/1/2026, 14:41:09] [PUT] /api/inngest
[1/1/2026, 14:41:14] [PUT] /api/inngest
[1/1/2026, 14:41:19] [PUT] /api/inngest
[1/1/2026, 14:41:24] [PUT] /api/inngest
[1/1/2026, 14:41:29] [PUT] /api/inngest
[1/1/2026, 14:41:34] [PUT] /api/inngest
[1/1/2026, 14:41:39] [PUT] /api/inngest
[1/1/2026, 14:41:45] [PUT] /api/inngest
[1/1/2026, 14:41:50] [PUT] /api/inngest
[1/1/2026, 14:41:55] [PUT] /api/inngest
[1/1/2026, 14:42:00] [PUT] /api/inngest
[1/1/2026, 14:42:05] [PUT] /api/inngest
[1/1/2026, 14:42:10] [PUT] /api/inngest
[1/1/2026, 14:42:15] [PUT] /api/inngest
[1/1/2026, 14:42:20] [PUT] /api/inngest
[1/1/2026, 14:42:25] [PUT] /api/inngest
[1/1/2026, 14:42:30] [PUT] /api/inngest
[1/1/2026, 14:42:35] [PUT] /api/inngest
[1/1/2026, 14:42:40] [PUT] /api/inngest
[1/1/2026, 14:42:45] [PUT] /api/inngest





Yes, It's Normal - But Here's What's Happening 🔄
Those PUT requests every 5 seconds are from the Inngest Dev Server polling your endpoint to check for function updates.



[PUT] /api/inngest  ← Inngest checking for changes
[PUT] /api/inngest  ← Every 5 seconds
[PUT] /api/inngest  ← This is normal in dev mode!



Why This Happens:
The Inngest dev server (npx inngest-cli dev) continuously polls your /api/inngest endpoint to:

Discover new functions
Detect code changes
Sync function definitions
Keep the connection alive

Will It Cause Server Load Issues?
In Development: ❌ No Problem

Lightweight requests - Just checking function metadata
Your local machine - Not a production environment
Expected behavior - Helps with hot reloading



In Production: ✅ No Polling

Inngest Cloud doesn't poll your endpoint
It only makes requests when:

Triggering scheduled functions
Executing event-driven workflows
Delivering webhooks




Development (npx inngest-cli dev):
Your Server ←→ Inngest Dev Server (polling every ~5s)
     ↓
Discovers functions
Enables hot reload
Shows in dashboard

Production (Inngest Cloud):
Your Server ← Inngest Cloud (ONLY when executing functions)
     ↓
No polling
Event-driven only





// Each polling request is super lightweight:
GET /api/inngest
Response: {
  functions: [{id: "release-seats-delete-booking", ...}]
}
// ~1-2KB response, takes <10ms
```

**Impact on your server**: Negligible! These are simple metadata requests.

## What You Should See in Production:

Once deployed (not using `inngest-cli dev`):
```
✅ No polling
✅ Requests only when:
   - Event triggered (inngest.send())
   - Scheduled function runs
   - Step executes  

⚠️⚠️⚠️⚠️  IMP , WHEN EVER YOU ADD/EDIT THE FUNCTION ON INNGEST, SYNC THE APP ON THE INNGEST , IT'S A MUST 



