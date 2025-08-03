import { useState } from "react";
import { FiTrash2 } from "react-icons/fi"
import { FaTrash, FaExclamationTriangle } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import ConfirmationModal from './../../../common/ConfirmationModal';
import { deleteProfile } from "../../../../services/operations/SettingsAPI"

export default function DeleteAccount() {

  const [confirmationModal, setConfirmationModal] = useState(null);
  const [check, setCheck] = useState(false);

  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()



  return (
    <>
      <div className="classic-card bg-white border-2 border-red-200">
        {/* Academic Header */}
        <div className="bg-red-50 border-b border-red-200 px-8 py-4">
          <div className="flex items-center gap-3">
            <FaTrash className="text-red-600 text-xl" />
            <div>
              <h3 className="elegant-heading text-red-800">Danger Zone</h3>
              <p className="text-sm text-red-600 font-inter">Permanently delete your account and all associated data</p>
            </div>
          </div>
        </div>

        {/* Academic Content */}
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Warning Icon */}
            <div className="flex-shrink-0">
              <div className="bg-red-100 border-2 border-red-300 p-6 rounded-xl">
                <FaExclamationTriangle className="text-red-600 text-3xl" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6">
              <div>
                <h4 className="text-xl font-bold text-red-800 font-playfair mb-3">
                  Delete Account
                </h4>
                <div className="space-y-3 text-red-700 font-inter">
                  <p>Are you sure you want to permanently delete your account?</p>
                  <p>
                    <strong>Warning:</strong> This action cannot be undone. Your account may contain paid courses, certificates, and learning progress. 
                    Deleting your account will permanently remove all content and data associated with it.
                  </p>
                </div>
              </div>

              {/* Consequences List */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h5 className="font-bold text-red-800 mb-3 font-playfair">What will be deleted:</h5>
                <ul className="space-y-2 text-sm text-red-700 font-inter">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    All course enrollments and progress
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    Earned certificates and achievements
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    Purchase history and payment records
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    Profile information and preferences
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    All associated account data
                  </li>
                </ul>
              </div>

              {/* Confirmation */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="deleteConfirm"
                    className="mt-1 h-4 w-4 text-red-600 border-red-300 rounded focus:ring-red-500"
                    checked={check}
                    onChange={() => setCheck(prev => !prev)}
                  />
                  <label htmlFor="deleteConfirm" className="text-sm text-red-700 font-inter cursor-pointer">
                    I understand that this action is permanent and cannot be undone. I want to delete my account and all associated data.
                  </label>
                </div>

                <button
                  type="button"
                  disabled={!check}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium font-inter transition-all duration-200 ${
                    check 
                      ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer' 
                      : 'bg-red-200 text-red-400 cursor-not-allowed'
                  }`}
                  onClick={() => check &&
                    setConfirmationModal({
                      text1: "Are you absolutely sure?",
                      text2: "This will permanently delete your account and all associated data. This action cannot be undone.",
                      btn1Text: "Delete Account",
                      btn2Text: "Cancel",
                      btn1Handler: () => dispatch(deleteProfile(token, navigate)),
                      btn2Handler: () => { setConfirmationModal(null); setCheck(false) },
                    })
                  }
                >
                  <FaTrash size={16} />
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}