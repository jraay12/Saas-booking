const STATUS = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

type props = {
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled"
}
export const StatusBadge = ({ status }: props) => (
  <span className={`px-2 py-1 text-xs rounded-full ${STATUS[status]}`}>
    {status}
  </span>
);