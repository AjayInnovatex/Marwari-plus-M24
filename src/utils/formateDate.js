export const formatDateFromNumber = (dateNumber) => {
  const dateString = dateNumber.toString();

  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  const date = new Date(year, month - 1, day);

  const monthNames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formattedDate = `${day}-${monthNames[date.getMonth()]}-${year}`;

  return formattedDate;
};
