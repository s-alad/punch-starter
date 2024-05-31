/* export const CVAR = "http://localhost:5001"; */

export const CVAR = 
    process.env.NODE_ENV === "development" ? 
    "http://localhost:5001" : 
    "https://raized-production.up.railway.app"

export const placeholderImageUrl =
    "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*";
  
  