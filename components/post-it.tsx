interface PostItProps {
  username: string
  password: string
}

export default function PostIt({ username, password }: PostItProps) {
  return (
    <div>
      <div className="absolute right-0 -bottom-24 z-[200] h-32 w-50 rotate-[350deg] transform bg-yellow-300 p-3 shadow-md">
        <div className="font-handwriting text-sm text-gray-800 pointer-events-none select-none">
          <p>{username}/{password}</p>
        </div>
      </div>
      <div className="absolute right-40 -bottom-24 z-[200] h-32 w-50 rotate-[6deg] transform bg-yellow-300 p-3 shadow-md">
        <div className="font-handwriting text-sm text-gray-800 pointer-events-none select-none">
          <b>Please, remove the post-it note</b>
          <p>signed : Your boss</p>
        </div>
      </div>
    </div>
  )
}
