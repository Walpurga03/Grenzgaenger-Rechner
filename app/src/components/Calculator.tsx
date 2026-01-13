export function Calculator() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Steuerrechner für Grenzgänger
        </h2>
        <p className="text-slate-600">
          Berechnen Sie Ihr Nettoeinkommen als Grenzgänger zwischen St. Gallen (CH) und Österreich (AT)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <h3 className="text-xl font-semibold mb-4">Schweizer Lohndaten</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Bruttolohn (CHF)
            </label>
            <input
              type="number"
              placeholder="6500"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Wechselkurs (CHF → EUR)
            </label>
            <input
              type="number"
              step="0.0001"
              placeholder="0.95"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <h3 className="text-xl font-semibold mb-4">Österreichische Abzüge & Pauschalen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Pendlerpauschale (EUR)
            </label>
            <input
              type="number"
              placeholder="200"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Familienbonus Plus (EUR)
            </label>
            <input
              type="number"
              placeholder="125"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 border border-blue-200">
        <h3 className="text-xl font-semibold mb-4 text-blue-900">Ergebnis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Brutto (EUR)</p>
            <p className="text-2xl font-bold text-slate-900">€ 6,175.00</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Schweizer Abzüge</p>
            <p className="text-2xl font-bold text-red-600">- € 1,234.00</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Netto (EUR)</p>
            <p className="text-2xl font-bold text-green-600">€ 4,941.00</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
          PDF-Bericht herunterladen
        </button>
      </div>
    </div>
  );
}
