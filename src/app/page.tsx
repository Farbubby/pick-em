export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-2xl font-bold">
          How many items do you want to bring?
        </div>
        <form className="flex flex-row gap-4 w-full justify-center items-center">
          <input
            type="number"
            name="itemCount"
            id="itemCount"
            required
            className="rounded-lg p-2 border border-gray-300 drop-shadow-lg w-1/2"
          />
          <button
            type="submit"
            className="rounded-lg bg-white hover:bg-black duration-150">
            <svg
              className="h-8 fill-black hover:fill-white p-1 duration-150"
              clipRule="evenodd"
              fillRule="evenodd"
              strokeLinejoin="round"
              strokeMiterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="m2.25 12.321 7.27 6.491c.143.127.321.19.499.19.206 0 .41-.084.559-.249l11.23-12.501c.129-.143.192-.321.192-.5 0-.419-.338-.75-.749-.75-.206 0-.411.084-.559.249l-10.731 11.945-6.711-5.994c-.144-.127-.322-.19-.5-.19-.417 0-.75.336-.75.749 0 .206.084.412.25.56"
                fillRule="nonzero"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
