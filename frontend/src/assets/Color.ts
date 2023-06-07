export function RandomColorClass() {
  const colors = [
    "text-orange-500",
    "text-pink-500",
    "text-teal-500",
    "text-red-500",
    "text-fuchsia-500",
    "text-rose-500",
    "text-blue-500",
    "text-yellow-500",
    "text-purple-500",
    "text-violet-500",
    "text-indigo-500",
    "text-sky-500",
    "text-gray-500",
    "text-cyan-500",
    "text-lime-500",
    "text-emerald-500",
    "text-amber-500",
    "text-lightBlue-500",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

export function RandomColorBg() {
  const colors = [
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-red-500",
    "bg-fuchsia-500",
    "bg-rose-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-violet-500",
    "bg-indigo-500",
    "bg-sky-500",
    "bg-gray-500",
    "bg-cyan-500",
    "bg-lime-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-lightBlue-500",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
