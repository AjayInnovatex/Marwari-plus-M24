import { useCallback } from "react";
import { toast } from "react-toastify";

const useHttpErrorHandler = () => {
  const handleHttpError = useCallback((error) => {
    if (error?.response?.data?.message) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    } else {
      toast.error(error?.message || error || "Something went wrong", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  }, []);

  return handleHttpError;
};

export default useHttpErrorHandler;
