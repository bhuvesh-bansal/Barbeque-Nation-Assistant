import { Chat } from '../components/Chat';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Barbeque Nation Assistant
        </h1>
        <div className="flex justify-center">
          <Link href="/faqs" className="text-orange-600 hover:text-orange-800 font-medium">
            View Menu & Drinks FAQs
          </Link>
        </div>
      </header>
      <Chat />
    </main>
  );
} 