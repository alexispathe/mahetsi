export default function Hero() {
    return (
      <section className="relative w-full h-screen">
        <img
          src="https://mahetsipage.web.app/assets/images/instagram/ManzanaCanela0.jpeg"
          alt="Productos Naturales"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-5xl font-bold">Mahets'i Productos Naturales</h1>
          <div className="mt-4 flex space-x-4">
            <button className="bg-red-600 px-4 py-2 rounded">Productos</button>
            <button className="bg-gray-600 px-4 py-2 rounded">Conócenos</button>
          </div>
        </div>
      </section>
    );
  }
  