const Loader = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} border-zinc-700 border-t-netflix-red rounded-full animate-spin`}
      />
      {text && <p className="text-zinc-400 text-sm animate-pulse">{text}</p>}
    </div>
  );
};

export const PageLoader = ({ text = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-netflix-dark">
    <Loader size="xl" text={text} />
  </div>
);

export default Loader;
