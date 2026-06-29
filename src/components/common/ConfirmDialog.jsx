import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'
import { SI } from '../../utils/constants'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel, danger = true }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="sm">
    <div className="text-center">
      <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${danger ? 'bg-red-100' : 'bg-primary-100'}`}>
        <AlertTriangle size={24} className={danger ? 'text-red-500' : 'text-primary-500'} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title || SI.confirm}</h3>
      {message && <p className="text-gray-500 text-sm mb-6">{message}</p>}
      <div className="flex gap-3 justify-center">
        <button onClick={onClose} className="btn-secondary flex-1">{SI.cancel}</button>
        <button
          onClick={() => { onConfirm(); onClose() }}
          className={`flex-1 font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95 inline-flex items-center justify-center gap-2 ${danger ? 'btn-danger' : 'btn-primary'}`}
        >
          {confirmLabel || SI.confirm}
        </button>
      </div>
    </div>
  </Modal>
)

export default ConfirmDialog
