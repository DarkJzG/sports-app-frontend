export default function PanelEstilosRGB({ designs, designId, onPick }) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(designs).map(([id, d]) => (
          <button
            key={id}
            onClick={() => onPick(id)}
            className={`border rounded-lg p-2 text-left hover:bg-blue-50
              ${designId === id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
          >
            <div className="font-semibold">{d.name}</div>
            <div className="text-xs text-gray-500">Máscara: {d.mask.split('/').pop()}</div>
          </button>
        ))}
      </div>
    );
  }
  