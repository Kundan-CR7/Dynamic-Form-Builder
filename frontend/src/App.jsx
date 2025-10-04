import FormBuilder from "./components/FormBuilder";

function App() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            🚀 AI Dynamic Form Builder
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <FormBuilder />
        </div>
      </main>
    </div>
  );
}

export default App;
