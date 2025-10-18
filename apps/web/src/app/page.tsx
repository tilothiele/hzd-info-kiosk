export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Hovawart-Züchterdatenbank
            </h1>
            <p className="text-gray-600 mb-6">
              Willkommen bei der Hovawart-Züchterdatenbank
            </p>
            <div className="space-y-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                ✅ API Status: Online
              </div>
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                🐕 Hunde-Datenbank: Bereit
              </div>
              <div className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded">
                🔍 Suchfunktion: Aktiv
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
