export default function PageHeader({ title, lead, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold">{title}</h1>
        {lead && <p className="mt-2 text-muted text-[17px] leading-relaxed">{lead}</p>}
      </div>
      {children}
    </div>
  );
}
