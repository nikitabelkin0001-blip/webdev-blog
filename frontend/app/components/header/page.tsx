import Image from 'next/image';

export default function Header() {
    return (
        <header className="bg-green-100/30 py-4 px-6 flex items-center justify-between flex-wrap gap-4">
            <div className="logo">
                <Image 
                    src="/logo.png" 
                    alt="web dev blog logo" 
                    width={100}
                    height={100}
                    className="h-12 w-auto"
                />
            </div>

            <nav className="flex items-center gap-6 flex-wrap">
                <a href="#" className="hover:text-green-700 transition">Главная</a>
                <a href="#" className="hover:text-green-700 transition">Направления</a>
                <a href="#" className="hover:text-green-700 transition">Обратная связь</a>
            </nav>

            <div className="signUp">
                <a href="#" className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition">
                    Записаться на тренировку
                </a>
            </div>
        </header>
    );
}