import React, { useCallback } from "react";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import { saveAs } from "file-saver";
import { FaTimes, FaDownload } from "react-icons/fa";

export const QRCodeModal = React.memo(({ isOpen, onRequestClose, qrCode }) => {
  const handleDownload = useCallback(() => {
    saveAs(qrCode, "albergue-qr-code.png");
  }, [qrCode]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Código QR del Albergue"
      className="modal-content"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      closeTimeoutMS={300}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-auto relative"
          >
            <button
              onClick={onRequestClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-300"
              aria-label="Cerrar"
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
              Código QR del Albergue
            </h2>

            {qrCode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <img
                  src={qrCode}
                  alt="Código QR"
                  className="mx-auto rounded-lg shadow-md max-w-full h-auto"
                />
              </motion.div>
            )}

            <div className="flex justify-center space-x-4 mb-4">
              <motion.button
                onClick={handleDownload}
                className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDownload className="mr-2" /> Descargar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
});
