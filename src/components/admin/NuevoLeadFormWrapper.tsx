'use client'

import { useState } from 'react'
import { Property } from '@/types/leads'
import NuevoLeadForm from './NuevoLeadForm'

export default function NuevoLeadFormWrapper({
  properties,
}: {
  properties: Property[]
}) {
  const [abierto, setAbierto] = useState(false)

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
      >
        <span className="text-lg leading-none">+</span>
        Nuevo contacto
      </button>

      {abierto && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setAbierto(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Nuevo contacto</h2>
                <button
                  onClick={() => setAbierto(false)}
                  className="text-gray-400 hover:text-black text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <NuevoLeadForm
                properties={properties}
                onSuccess={() => setAbierto(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
