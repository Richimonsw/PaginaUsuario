import React, { useCallback, useState } from "react";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import { saveAs } from "file-saver";
import {
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaEnvelope,
  FaTimes,
  FaDownload,
  FaShare,
} from "react-icons/fa";

export const QRCodeModal = React.memo(({ isOpen, onRequestClose, qrCode }) => {
  const handleDownload = useCallback(() => {
    saveAs(qrCode, "albergue-qr-code.png");
  }, [qrCode]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: "Código QR del Albergue",
          text: "Escanea este código QR para obtener información del albergue",
          url: qrCode,
        })
        .then(() => {
          console.log("Código QR compartido exitosamente");
        })
        .catch((error) => {
          console.error("Error al compartir:", error);
        });
    } else {
      // Si Web Share API no está disponible, muestra opciones alternativas
      setShowShareOptions(true);
    }
  }, [qrCode]);

  const [showShareOptions, setShowShareOptions] = useState(false);

  const shareVia = (platform) => {
    let url;
    switch (platform) {
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          "Código QR del Albergue: " + qrCode
        )}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          qrCode
        )}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          "Código QR del Albergue"
        )}&url=${encodeURIComponent(qrCode)}`;
        break;
      case "email":
        url = `mailto:?subject=${encodeURIComponent(
          "Código QR del Albergue"
        )}&body=${encodeURIComponent(
          "Aquí está el código QR del albergue: " + qrCode
        )}`;
        break;
      default:
        return;
    }
    window.open(url, "_blank");
  };

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
              <motion.button
                onClick={handleShare}
                className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShare className="mr-2" /> Compartir
              </motion.button>
            </div>

            {showShareOptions && (
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  onClick={() => shareVia("whatsapp")}
                  className="text-green-500 hover:text-green-600"
                >
                  <FaWhatsapp size={24} />
                </button>
                <button
                  onClick={() => shareVia("facebook")}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <FaFacebookF size={24} />
                </button>
                <button
                  onClick={() => shareVia("twitter")}
                  className="text-blue-400 hover:text-blue-500"
                >
                  <FaTwitter size={24} />
                </button>
                <button
                  onClick={() => shareVia("email")}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <FaEnvelope size={24} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
});
