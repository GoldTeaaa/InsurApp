export const getStatusClass = (status: string) => {
  const baseClasses =
    "inline-block px-2.5 py-1 text-xs font-bold text-white rounded-full capitalize";
  let colorClass = "bg-gray-500";

  switch (status) {
    case "paid":
      colorClass = "bg-green-500";
      break;
    case "unpaid":
      colorClass = "bg-red-500";
      break;
    case "partially_paid":
      colorClass = "bg-yellow-500";
      break;
  }
  return `${baseClasses} ${colorClass}`;
};
