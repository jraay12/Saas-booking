import { TriangleAlert, X } from "lucide-react";
import Button from "./Button";
import { useDeleteMembershipStaff } from "../features/staff/staff.hook";
type Props = {
  onClose: () => void;
  open: boolean;
  staff: any;
};

const DeleteModal = ({ onClose, open, staff }: Props) => {
  const deleteMutation = useDeleteMembershipStaff();

  const handleDelete = () => {
    deleteMutation.mutate(staff?.user_id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 transition-all duration-300 ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* BACKDROP */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className={`relative bg-white w-full max-w-sm rounded-xl shadow-lg max-h-5/6 p-6 transform transition-all duration-300 ${
          open
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-4 opacity-0"
        }`}
      >
        <div className="flex justify-between items-center">
          <h1 className="font-medium text-lg">Delete Staff Member?</h1>

          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-black/5 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex mt-5 gap-5 p-4">
          <div className="bg-red-500/10 rounded-full p-2 h-max">
            <TriangleAlert className="text-red-600" />
          </div>

          <p className="text-justify text-sm">
            Are you sure you want to delete{" "}
            <span className="font-bold">{staff?.name}</span>? This action cannot
            be undone and will remove them from all assigned services.
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            name="Cancel"
            variant="edit"
            className="border border-black/50 text-xs"
            onClick={onClose}
          />

          <Button
            name="Delete Member"
            variant="danger"
            className="bg-red-800 text-white text-xs"
            onClick={() => handleDelete()}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
