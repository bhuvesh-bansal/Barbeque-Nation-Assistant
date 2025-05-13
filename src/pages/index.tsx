import { Chat } from '../components/Chat';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Barbeque Nation Assistant
      </h1>
      <Chat />
    </main>
  );
} 