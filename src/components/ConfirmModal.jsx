export default function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-[#2a2a2a] rounded-2xl p-6 w-full max-w-sm">

                {/* Icon */}
                <div className="text-center mb-4">
                    <span className="text-4xl">🗑️</span>
                </div>

                {/* Message */}
                <h2 className="text-white text-center font-semibold mb-2">
                    Confirmar exclusão
                </h2>
                <p className="text-gray-400 text-center text-sm mb-6">
                    {message}
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 border border-gray-600 text-gray-400 py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2 rounded-lg transition"
                    >
                        Sim, excluir
                    </button>
                </div>
            </div>
        </div>
    )
}