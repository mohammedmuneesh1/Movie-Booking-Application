
const MovieCardSkeletion = () => {
  return (
        <div
      className="flex flex-col justify-between p-3
      bg-gray-800 rounded-2xl
      max-w-full w-full animate-pulse"
    >
      {/* Poster */}
      <div className="rounded-lg h-52 w-full bg-gray-700" />

      {/* Title */}
      <div className="mt-3 h-4 w-3/4 rounded bg-gray-700" />

      {/* Meta line */}
      <div className="mt-2 h-3 w-5/6 rounded bg-gray-700" />

      {/* Bottom section */}
      <div className="flex items-center justify-between mt-4 pb-3">
        {/* Button */}
        <div className="h-8 w-24 rounded-full bg-gray-700" />

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-gray-700" />
          <div className="h-4 w-8 rounded bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

export default MovieCardSkeletion