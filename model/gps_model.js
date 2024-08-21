import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
import { userDetailsAtom } from "../../recoil/atoms";
import api from "../../config";

const DeviceModal = ({ isOpen, onClose, onSubmit }) => {
  const userDetails = useRecoilValue(userDetailsAtom); 
  const [formData, setFormData] = useState({
    serialNumber: "",
    
  });

  const [formErrors, setFormErrors] = useState({
    serialNumber: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};
    if (!formData.serialNumber) {
      errors.serialNumber = "Serial number is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    
    const dataToSend = {
      serialNumber: formData.serialNumber,
      userId: userDetails.id, 
    };

    
    setIsLoading(true);
    try {
      const response = await axios.post(`${api.baseURL}/api/linkgps`, dataToSend);
      setIsLoading(false);
      onSubmit(dataToSend);
      onClose();
      toast.success("GPS module linked successfully!");
      console.log("GPS module linked successfully:", response.data);
    } catch (error) {
      setIsLoading(false);
      console.error("Error linking GPS module:", error);
      toast.error(error.response?.data?.error || "Failed to link GPS module. Please try again."); // Show error toast
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto my">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-gray-50 px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  Link GPS Module
                </h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="grid grid-cols-1 gap-y-6">
                    <div>
                      <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                        Serial Number
                      </label>
                      <input
                        type="text"
                        name="serialNumber"
                        id="serialNumber"
                        className={`mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md ${formErrors.serialNumber ? 'border-red-500' : ''}`}
                        onChange={handleChange}
                        value={formData.serialNumber}
                      />
                      {formErrors.serialNumber && (
                        <p className="mt-1 text-red-500 text-sm">{formErrors.serialNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Linking...' : 'Link'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

DeviceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default DeviceModal;
