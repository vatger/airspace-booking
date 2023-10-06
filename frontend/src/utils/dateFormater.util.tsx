const formatDateTime = (dateInput: Date | string) => {
  const date = new Date(dateInput);
  // Check if the parsed date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  const formattedDate = `${day}.${month}.${year}`;
  const formattedTime = `${hours}:${minutes}`;

  return `${formattedDate} ${formattedTime}`;
};

const formatDateOnly = (dateInput: Date | string) => {
  const date = new Date(dateInput);
  // Check if the parsed date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${day}.${month}.${year}`;

  return formattedDate;
};

const formatTimeOnly = (dateInput: Date | string) => {
  const date = new Date(dateInput);
  // Check if the parsed date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  const formattedTime = `${hours}:${minutes}`;

  return formattedTime;
};

export { formatDateTime, formatDateOnly, formatTimeOnly };
