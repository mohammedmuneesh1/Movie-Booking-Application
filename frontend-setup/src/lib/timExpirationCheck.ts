

//return if expired then true, if not false
 export function timeExpirationCheck (date:Date) {
    if(!date) return true;
    if (!(date instanceof Date)) return false;
      const expiresAt = date.getTime();
      return Date.now() > expiresAt;
}