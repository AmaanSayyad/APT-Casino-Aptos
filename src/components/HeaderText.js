export default function HeaderText({ header, description }) {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">{header}</h2>
      {description && (
        <p className="text-sm md:text-base font-display text-white/70 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};
