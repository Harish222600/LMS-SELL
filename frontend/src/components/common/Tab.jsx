export default function Tab({ tabData, field, setField }) {
  return (
    <div className="flex bg-academic-slate-100 p-1 gap-x-1 rounded-full max-w-max border border-academic-slate-200 shadow-classic">
      {
        tabData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setField(tab.type)}
            className={`${field === tab.type
              ? "bg-academic-navy-700 text-white shadow-classic"
              : "bg-transparent text-academic-slate-600 hover:text-academic-navy-700"
              } py-3 px-6 rounded-full transition-all duration-200 font-medium text-sm`}
          >
            {tab?.tabName}
          </button>
        ))}
    </div>
  );
}
