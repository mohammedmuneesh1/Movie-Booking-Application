

const randomKeyGenerator = (item:number | string)=>{
    const randomDigit = Math.random().toString(36).substring(2, 9);
    return `${item}${randomDigit}`

}

export default randomKeyGenerator;


//Math.random(); // 0.482739102 (any number >=0 and <1)
// 2️⃣ .toString(36)
// Converts the number to a string in base 36 (digits 0-9 + letters a-z).
(0.482739102).toString(36); // "0.xr4jzq"

// 3️⃣ .substring(2, 9)
// Removes the "0." at the beginning (starts at index 2)

// Takes 7 characters after the "0."

// Example:

// "0.xr4jzq".substring(2, 9); // "xr4jzq"

// substring(startIndex, endIndex)
// Negative values are treated as 0.
// substring never accepts negative indexes the way slice() does.