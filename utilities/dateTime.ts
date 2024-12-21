import moment from "moment-timezone";

export const getCurrentDateTimeInParaguay = () => {
  const currentTimeInParaguay = moment.tz("America/Asuncion");

  const currentDate = currentTimeInParaguay.format("YYYY-MM-DD");
  const currentTime = currentTimeInParaguay.format("HH:mm");

  return { currentDate, currentTime };
};
