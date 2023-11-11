export const timeChange = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const secondsRemainder = time % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = secondsRemainder.toFixed(0);

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
