import { Link } from 'react-router-dom';

export default function ToolCard({ tool }) {
  const { name, description, icon: Icon, path, color, bg } = tool;

  return (
    <Link
      to={path}
      className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 p-6 flex flex-col items-start gap-3"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ backgroundColor: bg }}
      >
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-base">
          {name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
