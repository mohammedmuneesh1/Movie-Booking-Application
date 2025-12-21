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



// "start": "env-cmd -f .env node dist/app/server.js",