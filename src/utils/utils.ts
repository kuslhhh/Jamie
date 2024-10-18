import { artists } from "@/lib/types";

export const formatArtistName = (artists: artists[]) => {
  return artists
    .map((data, index) => {
      if (index === artists.length - 1) {
        return `${data.name}`;
      }
      return `${data.name}, ${data.name}`;
    })
    .join("");
};
export function formatElapsedTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return "0:00";
  }
  const totalSeconds = Math.floor(seconds);

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
  }`;
}

export function setNeverExpiringCookie(name: string, value: string) {
  const date = new Date();
  date.setTime(date.getTime() + 365 * 100 * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie =
    name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

export function generateRandomUsername() {
  const adjectives = [
    "Cool",
    "Fast",
    "Happy",
    "Bright",
    "Mighty",
    "Silent",
    "Quick",
    "Sharp",
  ];
  const nouns = [
    "IronMan",
    "Hulk",
    "CaptainAmerica",
    "BlackWidow",
    "Hawkeye",
    "ScarletWitch",
    "Vision",
    "BlackPanther",
    "SpiderMan",
    "DoctorStrange",
    "AntMan",
    "Wasp",
  ];
  const randomNumber = Math.floor(Math.random() * 1000);
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective}${randomNoun}${randomNumber}`;
}
