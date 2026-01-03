const isoTimeFormatForCountry = (iso: string, country: string = "en-US", timeZone: string = "UTC") => {
  const date = new Date(iso);
  return date.toLocaleTimeString(country, {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: timeZone,
  });
};

export default isoTimeFormatForCountry;


export const isoDateTimeFormatForCountry = (
  iso: string,
  country: string = "en-IN", // ✅ India locale
  timeZone: string = "Asia/Kolkata" 
) => {
  if(!iso) return '';
  if(typeof iso === 'string' && iso.length === 0) return '';
  const date = new Date(iso);

  return date.toLocaleString(country, {
    year: "numeric",
    month: "short",   // or "long" or "2-digit"
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone,
  });
};

